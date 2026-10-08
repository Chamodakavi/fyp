-- Diagnostics for the monthly registration fix. Read-only. Run before and after
-- 03_monthly_registration_fix.sql; D1-D4 must return 0 problem rows afterwards.

-- D1. Do year/month and the text dates agree? (they must)
select id, crop_name, year, month, target_harvest_date, planting_date, is_active
from national_targets
where target_harvest_date is distinct from to_char(make_date(year, month, 1), 'YYYY-MM')
order by crop_name, year, month;

-- D2. Every target with its windows (Sri Lanka time)
select t.id, t.crop_name, t.year, t.month, t.planting_date,
       w.id as window_id,
       w.opens_at  at time zone 'Asia/Colombo' as opens,
       w.closes_at at time zone 'Asia/Colombo' as closes,
       w.closed_early_at
from national_targets t
left join registration_windows w on w.target_id = t.id
order by t.crop_name, t.year, t.month, w.opens_at;

-- D3. Registrations and the target each is linked to
select r.id, r.farmer_id, r.crop_name, r.amount_mt, r.status, r.registered_at,
       r.target_id, t.year, t.month
from farmer_registrations r
left join national_targets t on t.id = r.target_id
order by r.crop_name, r.registered_at;

-- D4. Registrations linked to a target of a DIFFERENT crop (must be 0)
select r.id, r.crop_name, t.crop_name as target_crop
from farmer_registrations r join national_targets t on t.id = r.target_id
where upper(r.crop_name) <> upper(t.crop_name);

-- D5. Is the old crop_registrations table still being written?
select count(*), max(created_at) from crop_registrations;

-- D6. Windows that do not sit in their target's registration month (review after A3)
select t.id, t.crop_name, t.planting_date, w.id as window_id,
       w.opens_at  at time zone 'Asia/Colombo' as opens,
       w.closes_at at time zone 'Asia/Colombo' as closes
from national_targets t join registration_windows w on w.target_id = t.id
where w.closed_early_at is null
  and to_char((w.opens_at at time zone 'Asia/Colombo'), 'YYYY-MM') <> t.planting_date
order by t.crop_name, t.year, t.month;
