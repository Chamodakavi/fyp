-- =============================================================================
-- FarmFriend — Monthly Registration Fix (one target per harvest month)
-- Run in the Supabase SQL editor, in order, on staging first.
--
-- Rules implemented here:
--   R1  national_targets (crop_name, year, month) = the HARVEST month, unique.
--   R2  registration (planting) month = harvest month − crop life cycle.
--       Life cycles live in crop_lifecycle; the trigger below derives
--       planting_year / planting_month — nothing else calculates it.
--   R3  target_harvest_date / planting_date are derived text "YYYY-MM".
--   R4  One registration window per target, in its registration month,
--       Sri Lanka time. Admin can edit, extend, cancel or reopen.
--   R5  Every total is grouped by target_id (get_target_summary).
--
-- Prerequisite: 01_supabase_sql_changes.md (get_bucket_status,
-- admin_open_registration, admin_extend_registration, is_admin, ...).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- A1. One table of crop life cycles
--     Values verified against the live model on 2026-10-08
--     (month=1 2027 -> Target_Harvest_Date per crop). Change here only and keep
--     the model's CROP_LIFECYCLE in sync, because the model adds the cycle itself.
-- -----------------------------------------------------------------------------
create table if not exists public.crop_lifecycle (
  crop_name    text primary key,
  cycle_months int  not null check (cycle_months between 1 and 24),
  updated_at   timestamptz not null default now()
);

insert into public.crop_lifecycle (crop_name, cycle_months) values
  ('ASH PLANTAINS',10),('BEANS',3),('BEETROOT',3),('BITTER GOURD',3),('BRINJALS',4),
  ('CABBAGE',3),('CAPSICUM',4),('CARROT',4),('CUCUMBER',2),('DRUMSTIC',12),
  ('LEEKS',5),('LUFFA',3),('RADDISH',2),('TOMATOES',4)
on conflict (crop_name) do nothing;

alter table public.crop_lifecycle enable row level security;
drop policy if exists "lifecycle_read_all" on public.crop_lifecycle;
create policy "lifecycle_read_all" on public.crop_lifecycle
  for select to anon, authenticated using (true);
drop policy if exists "lifecycle_admin_write" on public.crop_lifecycle;
create policy "lifecycle_admin_write" on public.crop_lifecycle
  for all to authenticated using (public.is_admin()) with check (public.is_admin());


-- -----------------------------------------------------------------------------
-- A2. Registration (planting) month as real columns
-- -----------------------------------------------------------------------------
alter table public.national_targets
  add column if not exists planting_year        int,
  add column if not exists planting_month       int check (planting_month between 1 and 12),
  add column if not exists growth_cycle_months  int;


-- -----------------------------------------------------------------------------
-- A3. Trigger: harvest month (year/month) is the truth, everything else derived
--     planting_date / target_harvest_date are TEXT in this project (verified via
--     the REST API: values like "2026-10"). If you ever change them to DATE,
--     replace the two to_char(...) lines with the date values themselves.
-- -----------------------------------------------------------------------------
create or replace function public.normalize_national_target()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_cycle   int;
  v_harvest date;
  v_plant   date;
begin
  new.crop_name := upper(btrim(new.crop_name));
  if new.year is null or new.month is null or new.month not between 1 and 12 then
    raise exception 'national_targets: year and month (harvest month) are required';
  end if;

  select cycle_months into v_cycle from crop_lifecycle where crop_name = new.crop_name;
  new.growth_cycle_months := coalesce(v_cycle, new.growth_cycle_months, 3);

  v_harvest := make_date(new.year, new.month, 1);
  v_plant   := (v_harvest - make_interval(months => new.growth_cycle_months))::date;

  new.planting_year       := extract(year  from v_plant)::int;
  new.planting_month      := extract(month from v_plant)::int;
  new.target_harvest_date := to_char(v_harvest, 'YYYY-MM');
  new.planting_date       := to_char(v_plant,   'YYYY-MM');
  return new;
end;
$$;

drop trigger if exists national_targets_normalize on public.national_targets;
create trigger national_targets_normalize
before insert or update on public.national_targets
for each row execute function public.normalize_national_target();

-- Re-derive existing rows. BEFORE running: fix any row from D1 (see the
-- diagnostics file) whose year/month is wrong, because year/month win from now on.
update public.national_targets set year = year;


-- -----------------------------------------------------------------------------
-- A4. Window functions: open the registration month, edit, cancel
-- -----------------------------------------------------------------------------

-- Replace: open the target's own registration month (Colombo time).
-- B11: next month's midnight is built in Sri Lanka time directly. Adding
-- '1 month' to a timestamptz is evaluated in UTC and lands a day early.
create or replace function public.admin_open_planting_month(p_target_id bigint, p_notify boolean default true)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  t public.national_targets%rowtype;
  v_next date;
  v_open timestamptz; v_close timestamptz;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  select * into t from public.national_targets where id = p_target_id;
  if not found then return jsonb_build_object('status','no_target'); end if;
  if t.planting_year is null or t.planting_month is null then
    return jsonb_build_object('status','no_planting_date');
  end if;

  v_next  := (make_date(t.planting_year, t.planting_month, 1) + interval '1 month')::date;
  v_open  := make_timestamptz(t.planting_year, t.planting_month, 1, 0, 0, 0, 'Asia/Colombo');
  v_close := make_timestamptz(extract(year from v_next)::int, extract(month from v_next)::int, 1, 0, 0, 0, 'Asia/Colombo');

  if v_close <= now() then
    return jsonb_build_object('status','month_passed',
      'message', 'The registration month (' || t.planting_date || ') has already passed. Use a custom window.');
  end if;
  v_open := greatest(v_open, now());

  return public.admin_open_registration(p_target_id, v_open, v_close, 'Registration month ' || t.planting_date, p_notify);
end;
$$;
grant execute on function public.admin_open_planting_month(bigint, boolean) to authenticated;

-- New: change the dates of a window that has not finished yet (scheduled or open)
create or replace function public.admin_update_window(p_window_id bigint, p_opens_at timestamptz, p_closes_at timestamptz)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare w public.registration_windows%rowtype;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  select * into w from public.registration_windows where id = p_window_id for update;
  if not found then return jsonb_build_object('status','not_found'); end if;
  if least(w.closes_at, coalesce(w.closed_early_at, w.closes_at)) <= now() then
    return jsonb_build_object('status','finished','message','This window has already ended. Open a new one instead.');
  end if;
  -- an open window keeps its start (farmers may already have registered)
  if w.opens_at <= now() then p_opens_at := w.opens_at; end if;
  if p_closes_at <= p_opens_at or p_closes_at <= now() then
    return jsonb_build_object('status','invalid_dates','message','Closing time must be after opening time and in the future.');
  end if;
  if exists (
    select 1 from public.registration_windows o
    where o.target_id = w.target_id and o.id <> w.id
      and tstzrange(o.opens_at, least(o.closes_at, coalesce(o.closed_early_at, o.closes_at)))
          && tstzrange(p_opens_at, p_closes_at)
  ) then
    return jsonb_build_object('status','overlap','message','Overlaps another window of this target. Edit or cancel that window first.');
  end if;
  update public.registration_windows
     set opens_at = p_opens_at, closes_at = p_closes_at, closed_early_at = null
   where id = p_window_id;
  return jsonb_build_object('status','success');
end;
$$;
grant execute on function public.admin_update_window(bigint, timestamptz, timestamptz) to authenticated;

-- New: cancel a window. Not started -> deleted. Open -> closed now.
create or replace function public.admin_cancel_window(p_window_id bigint)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare w public.registration_windows%rowtype;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  select * into w from public.registration_windows where id = p_window_id for update;
  if not found then return jsonb_build_object('status','not_found'); end if;
  if w.opens_at > now() then
    delete from public.registration_windows where id = p_window_id;
    return jsonb_build_object('status','success','action','deleted');
  end if;
  if w.closed_early_at is null and w.closes_at > now() then
    update public.registration_windows set closed_early_at = now() where id = p_window_id;
    return jsonb_build_object('status','success','action','closed');
  end if;
  return jsonb_build_object('status','finished','message','This window has already ended.');
end;
$$;
grant execute on function public.admin_cancel_window(bigint) to authenticated;


-- -----------------------------------------------------------------------------
-- A5. One summary row per target (both dashboards, Targets page, Register form)
--     Every number is computed per target_id: it builds on get_bucket_status,
--     which sums farmer_registrations by target_id.
-- -----------------------------------------------------------------------------
drop function if exists public.get_target_summary(boolean);
create or replace function public.get_target_summary(p_include_all boolean default false)
returns table (
  target_id bigint, crop_name text,
  harvest_year int, harvest_month int, harvest_label text,
  planting_year int, planting_month int, registration_label text,
  target_limit_mt numeric, allowed_extent_ha numeric,
  filled_mt numeric, filled_ha numeric, remaining_mt numeric, fill_ratio numeric,
  farmer_count int, is_active boolean, is_open boolean, status text,
  current_window_id bigint, window_opens_at timestamptz, window_closes_at timestamptz, next_opens_at timestamptz,
  target_fair_price numeric, estimated_wholesale_price numeric,
  my_registration_id bigint, my_amount_mt numeric
)
language sql stable security definer set search_path = public
as $$
  select
    b.target_id, b.crop_name,
    t.year, t.month, to_char(make_date(t.year, t.month, 1), 'Mon YYYY'),
    t.planting_year, t.planting_month,
    case when t.planting_year is not null and t.planting_month is not null
         then to_char(make_date(t.planting_year, t.planting_month, 1), 'Mon YYYY') end,
    b.target_limit_mt, t.allowed_extent_ha,
    b.filled_mt,
    case when b.target_limit_mt > 0 and t.allowed_extent_ha > 0
         then round(b.filled_mt * t.allowed_extent_ha / b.target_limit_mt, 1) end,
    b.remaining_mt, b.fill_ratio, b.farmer_count, b.is_active, b.is_open,
    case when not b.is_active then 'inactive'
         when b.is_open and b.remaining_mt <= 0 then 'full'
         when b.is_open then 'open'
         when b.next_opens_at is not null then 'scheduled'
         else 'closed' end,
    b.current_window_id, b.window_opens_at, b.window_closes_at, b.next_opens_at,
    b.target_fair_price, b.estimated_wholesale_price,
    b.my_registration_id, b.my_amount_mt
  from public.get_bucket_status(p_include_all) b
  join public.national_targets t on t.id = b.target_id
  order by b.crop_name, t.year, t.month;
$$;
grant execute on function public.get_target_summary(boolean) to anon, authenticated;


-- -----------------------------------------------------------------------------
-- A6. Make target_id required. Run ONLY after the data clean-up, when this is 0:
--     select count(*) from public.farmer_registrations where target_id is null;
-- -----------------------------------------------------------------------------
-- alter table public.farmer_registrations alter column target_id set not null;
