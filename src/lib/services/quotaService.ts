import { createClient } from "@/utils/supabase/createClient";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

/** Exact crop names from the ML model's label encoder. */
export const SUPPORTED_CROPS = [
  "ASH PLANTAINS",
  "BEETROOT",
  "BITTER GOURD",
  "BRINJALS",
  "CABBAGE",
  "CAPSICUM",
  "CARROT",
  "CUCUMBER",
  "LEEKS",
  "LUFFA",
  "RADDISH",
  "TOMATOES",
] as const;

export const CROP_LABELS: Record<string, string> = {
  "ASH PLANTAINS": "🍌 Ash Plantains",
  BEETROOT: "🟣 Beetroot",
  "BITTER GOURD": "🥒 Bitter Gourd",
  BRINJALS: "🍆 Brinjals",
  CABBAGE: "🥬 Cabbage",
  CAPSICUM: "🫑 Capsicum",
  CARROT: "🥕 Carrot",
  CUCUMBER: "🥒 Cucumber",
  LEEKS: "🧅 Leeks",
  LUFFA: "🥒 Luffa",
  RADDISH: "⚪ Radish",
  TOMATOES: "🍅 Tomatoes",
};

/** Monthly rainfall normals (mm) used by the model notebook. */
export const RAINFALL_NORMALS: Record<number, number> = {
  1: 100,
  2: 90,
  3: 150,
  4: 220,
  5: 250,
  6: 180,
  7: 150,
  8: 150,
  9: 200,
  10: 350,
  11: 300,
  12: 250,
};

export const DEFAULT_DIESEL_PRICE = 392;
export const MODEL_VERSION = "rf-hybrid-v1";
/** Fair price = cost × (1 + margin). Must match the model. */
export const PROFIT_MARGIN = 0.4;
export const FLOOR_RATIO = 0.85;

export const cropLabel = (c: string) => CROP_LABELS[c?.toUpperCase()] ?? c;

/**
 * Growth cycle in months, mirrored from the model's CROP_LIFECYCLE (verified
 * against the live engine on 2026-10-08). The database table `crop_lifecycle`
 * is the source of truth — see fetchCropCycles(); this is only the fallback
 * used before that table is reachable.
 */
export const CROP_CYCLE_FALLBACK: Record<string, number> = {
  "ASH PLANTAINS": 10,
  BEANS: 3,
  BEETROOT: 3,
  "BITTER GOURD": 3,
  BRINJALS: 4,
  CABBAGE: 3,
  CAPSICUM: 4,
  CARROT: 4,
  CUCUMBER: 2,
  DRUMSTIC: 12,
  LEEKS: 5,
  LUFFA: 3,
  RADDISH: 2,
  TOMATOES: 4,
};

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface AdvisoryData {
  Target_Harvest_Date: string;
  Planting_Date: string;
  Required_Harvest_MT: number;
  Allowed_Extent_Ha: number;
  Calculated_Fair_Price: number;
  Estimated_Wholesale_Price: number;
  Estimated_Consumer_Price: number;
}

export interface AdvisoryParams {
  crop: string;
  year: number;
  /**
   * REGISTRATION (planting) month. Verified against the live engine: it adds
   * the crop's growth cycle itself and returns Target_Harvest_Date = month +
   * cycle (e.g. CARROT 2026-10 → 2027-02). Never add the cycle on this side.
   */
  month: number;
  rainfall: number;
  dieselPrice: number;
}

export type TargetStatus = "open" | "full" | "scheduled" | "closed" | "inactive";

/** One row per target from get_target_summary — every number is per target_id. */
export interface TargetSummary {
  target_id: number;
  crop_name: string;
  harvest_year: number;
  harvest_month: number;
  harvest_label: string;
  planting_year: number | null;
  planting_month: number | null;
  registration_label: string | null;
  target_limit_mt: number;
  allowed_extent_ha: number | null;
  filled_mt: number;
  filled_ha: number | null;
  remaining_mt: number;
  fill_ratio: number;
  farmer_count: number;
  is_active: boolean;
  is_open: boolean;
  status: TargetStatus;
  current_window_id: number | null;
  window_opens_at: string | null;
  window_closes_at: string | null;
  next_opens_at: string | null;
  target_fair_price: number | null;
  estimated_wholesale_price: number | null;
  my_registration_id: number | null;
  my_amount_mt: number | null;
}

export interface BucketStatus {
  target_id: number;
  crop_name: string;
  year: number | null;
  month: number | null;
  target_limit_mt: number;
  allowed_extent_ha: number | null;
  filled_mt: number;
  remaining_mt: number;
  farmer_count: number;
  fill_ratio: number;
  is_active: boolean;
  is_open: boolean;
  current_window_id: number | null;
  window_opens_at: string | null;
  window_closes_at: string | null;
  next_opens_at: string | null;
  target_fair_price: number | null;
  estimated_wholesale_price: number | null;
  estimated_retail_price: number | null;
  cost_per_kg: number | null;
  planting_date: string | null;
  target_harvest_date: string | null;
  my_registration_id: number | null;
  my_amount_mt: number | null;
}

export interface Alternative {
  target_id: number;
  crop_name: string;
  year: number | null;
  month: number | null;
  remaining_mt: number;
  target_fair_price: number | null;
  window_closes_at: string | null;
}

export type RegisterResult =
  | {
      status: "success";
      registration_id: number;
      target_id: number;
      crop_name: string;
      amount_mt: number;
      filled_mt: number;
      remaining_mt: number;
    }
  | {
      status: "surplus_warning";
      target_id: number;
      crop_name: string;
      limit_mt: number;
      filled_mt: number;
      remaining_mt: number;
      alternatives: Alternative[];
    }
  | {
      status: "registration_closed";
      crop_name: string;
      next_opens_at: string | null;
    }
  | { status: "already_registered"; registration_id: number; crop_name: string }
  | { status: "no_target" | "invalid_amount" | "not_authenticated" };

export interface MyRegistration {
  id: number;
  crop_name: string;
  amount_mt: number;
  registered_at: string;
  status: "active" | "cancelled";
  target_id: number | null;
  target: {
    year: number | null;
    month: number | null;
    target_harvest_date: string | null;
    planting_date: string | null;
  } | null;
}

export type QuotaRequestType =
  | "increase"
  | "decrease"
  | "cancel"
  | "correction";
export type QuotaRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn";

export interface QuotaRequest {
  id: number;
  registration_id: number;
  farmer_id: string;
  target_id: number | null;
  crop_name: string;
  request_type: QuotaRequestType;
  current_amount_mt: number;
  requested_amount_mt: number | null;
  reason: string;
  status: QuotaRequestStatus;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  farmer?: {
    u_name: string | null;
    u_surname: string | null;
    u_tel: string | null;
    u_district: string | null;
    u_email: string | null;
  } | null;
  target?: {
    year: number | null;
    month: number | null;
    target_limit_mt: number | null;
  } | null;
}

export interface RegistrationWindow {
  id: number;
  opens_at: string;
  closes_at: string;
  closed_early_at: string | null;
  reason: string | null;
}

export type RpcResult = {
  status: string;
  message?: string;
  [k: string]: unknown;
};

/* ------------------------------------------------------------------ */
/* Date helpers (Asia/Colombo)                                         */
/* ------------------------------------------------------------------ */

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/** Accepts "2026-10" (what /api/advisory returns), "2026-10-01", "October 2026", "Oct 2026". */
export function parseYearMonth(
  value: string | null | undefined,
): { year: number; month: number } | null {
  if (!value) return null;
  const v = value.trim();
  const iso = v.match(/^(\d{4})-(\d{1,2})/);
  if (iso) {
    const month = Number(iso[2]);
    return month >= 1 && month <= 12 ? { year: Number(iso[1]), month } : null;
  }
  const named = v.toLowerCase().match(/^([a-z]+)\s+(\d{4})$/);
  if (named) {
    const idx = MONTHS.findIndex((m) => m.startsWith(named[1].slice(0, 3)));
    if (idx >= 0) return { year: Number(named[2]), month: idx + 1 };
  }
  return null;
}

export const monthName = (year?: number | null, month?: number | null) =>
  year && month
    ? new Date(year, month - 1, 1).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

export const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        timeZone: "Asia/Colombo",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/** Start of a calendar month in Sri Lanka time (UTC+05:30, no DST). */
export const colomboMonthStart = (year: number, month: number) =>
  new Date(Date.UTC(year, month - 1, 1, 0, 0, 0) - 5.5 * 3600 * 1000);

export const ym = (y: number, m: number) =>
  `${y}-${String(m).padStart(2, "0")}`;

/** Registration month + life cycle → harvest month (R2). */
export function harvestFromRegistration(
  regYear: number,
  regMonth: number,
  cycle: number,
) {
  const idx = regYear * 12 + (regMonth - 1) + cycle;
  return { year: Math.floor(idx / 12), month: (idx % 12) + 1 };
}

/** Months since year 0 — handy for "is this month in the past?" comparisons. */
export const monthIndex = (year: number, month: number) => year * 12 + month;

/**
 * Window for a registration month (R4): max(now, 1st of month) → 1st of the
 * next month, Sri Lanka time. Returns null when the month is already over.
 */
export function registrationMonthWindow(regYear: number, regMonth: number) {
  const start = colomboMonthStart(regYear, regMonth);
  const end = colomboMonthStart(
    regMonth === 12 ? regYear + 1 : regYear,
    regMonth === 12 ? 1 : regMonth + 1,
  );
  const now = new Date();
  if (end <= now) return null;
  return { opensAt: start < now ? now : start, closesAt: end };
}

/** Value for <input type="datetime-local"> in the browser's local time. */
export const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Readable text from a thrown value (Error, Supabase error object, or anything else). */
export function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === "object" && "message" in e && e.message) {
    return String(e.message);
  }
  return fallback;
}

/* ------------------------------------------------------------------ */
/* AI advisory (unchanged API route)                                   */
/* ------------------------------------------------------------------ */

export async function fetchAdvisoryQuota(
  params: AdvisoryParams,
): Promise<AdvisoryData> {
  const response = await fetch("/api/advisory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crop: params.crop.toUpperCase(),
      year: Number(params.year),
      month: Number(params.month),
      rainfall_mm: Number(params.rainfall),
      diesel_price_lkr: Number(params.dieselPrice),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || "Failed to fetch response from AI Engine",
    );
  }

  return response.json();
}

/** cost = fair ÷ (1 + margin); the API doesn't return the production cost itself. */
function costFromFairPrice(fair: number): number | null {
  return fair > 0 ? Number((fair / (1 + PROFIT_MARGIN)).toFixed(2)) : null;
}

/** Builds a crop_price_forecasts row from one advisory result. */
function forecastRowFromAdvisory(
  crop: string,
  a: AdvisoryData,
  rainfall: number,
  diesel: number,
  source: "ai_targets" | "bulk_generator",
) {
  const harvest = parseYearMonth(a.Target_Harvest_Date);
  const planting = parseYearMonth(a.Planting_Date);
  if (!harvest) {
    throw new Error(`Unreadable Target_Harvest_Date: ${a.Target_Harvest_Date}`);
  }

  const fair = Number(a.Calculated_Fair_Price);
  const cost = costFromFairPrice(fair);
  const cycle = planting
    ? (harvest.year - planting.year) * 12 + (harvest.month - planting.month)
    : null;

  return {
    crop_name: crop.toUpperCase(),
    year: harvest.year,
    month: harvest.month,
    wholesale_price: Number(a.Estimated_Wholesale_Price),
    retail_price: Number(a.Estimated_Consumer_Price) || null,
    fair_price: fair || null,
    cost_per_kg: cost,
    profit_per_kg: cost !== null ? Number((fair - cost).toFixed(2)) : null,
    floor_price: cost !== null ? Number((cost * FLOOR_RATIO).toFixed(2)) : null,
    harvest_goal_mt: Number(a.Required_Harvest_MT) || null,
    allowed_extent_ha: Number(a.Allowed_Extent_Ha) || null,
    growth_cycle_months: cycle,
    planting_year: planting?.year ?? null,
    planting_month: planting?.month ?? null,
    rainfall_mm: rainfall,
    diesel_lkr: diesel,
    model_version: MODEL_VERSION,
    source,
    generated_at: new Date().toISOString(),
  };
}

export async function saveForecast(
  crop: string,
  a: AdvisoryData,
  rainfall: number,
  diesel: number,
  source: "ai_targets" | "bulk_generator" = "ai_targets",
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("crop_price_forecasts")
    .upsert(forecastRowFromAdvisory(crop, a, rainfall, diesel, source), {
      onConflict: "crop_name,year,month",
    });
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Admin: publish target + windows                                     */
/* ------------------------------------------------------------------ */

export interface ApplyTargetOptions {
  rainfall: number;
  dieselPrice: number;
  /** null = publish target but keep registration closed */
  window: { opensAt: Date; closesAt: Date; reason?: string } | null;
  notifyFarmers?: boolean;
}

/**
 * Publishes one target for `harvest` (R1). The harvest month is computed by
 * the caller from the registration month + crop cycle; the API's own date
 * strings are only used as a cross-check so a cycle mismatch between the
 * model and `crop_lifecycle` is caught before anything is written (B1, B9).
 * planting_date / target_harvest_date are NOT sent — the database trigger
 * derives them (R3).
 */
export async function applyNationalTarget(
  crop: string,
  harvest: { year: number; month: number },
  apiResponse: AdvisoryData,
  opts: ApplyTargetOptions,
): Promise<{ targetId: number; windowResult: RpcResult | null }> {
  const supabase = createClient();
  const targetLimitMT = Number(apiResponse.Required_Harvest_MT);
  const targetLimitHa = Number(apiResponse.Allowed_Extent_Ha);

  if (!targetLimitMT || Number.isNaN(targetLimitMT)) {
    throw new Error("Invalid AI target yield value.");
  }

  const apiHarvest = parseYearMonth(apiResponse.Target_Harvest_Date);
  if (
    apiHarvest &&
    (apiHarvest.year !== harvest.year || apiHarvest.month !== harvest.month)
  ) {
    throw new Error(
      `AI engine returned harvest ${apiResponse.Target_Harvest_Date}, expected ${ym(harvest.year, harvest.month)}. ` +
        `Check that the crop life cycle in crop_lifecycle matches the model.`,
    );
  }

  const fair = Number(apiResponse.Calculated_Fair_Price);
  const cropName = crop.toUpperCase();

  const { data, error: upsertError } = await supabase
    .from("national_targets")
    .upsert(
      {
        crop_name: cropName,
        target_limit_mt: targetLimitMT,
        allowed_extent_ha: targetLimitHa,
        year: harvest.year,
        month: harvest.month,
        target_fair_price: fair,
        estimated_wholesale_price: Number(
          apiResponse.Estimated_Wholesale_Price,
        ),
        estimated_retail_price:
          Number(apiResponse.Estimated_Consumer_Price) || null,
        cost_per_kg: costFromFairPrice(fair),
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "crop_name,year,month" },
    )
    .select("id")
    .single();

  if (upsertError) throw upsertError;

  // Keep the price screens in sync with what was published (non-blocking)
  try {
    await saveForecast(
      cropName,
      apiResponse,
      opts.rainfall,
      opts.dieselPrice,
      "ai_targets",
    );
  } catch (e) {
    console.warn("Forecast row not saved:", e);
  }

  // The target is already saved at this point, so a failure to open the window
  // is reported as a result instead of thrown — the caller can tell the admin
  // "published, but registration is still closed".
  let windowResult: RpcResult | null = null;
  if (opts.window) {
    try {
      windowResult = await openRegistration(
        data.id,
        opts.window.opensAt,
        opts.window.closesAt,
        opts.window.reason ?? "Initial registration window",
        opts.notifyFarmers ?? true,
      );
    } catch (e) {
      windowResult = {
        status: "error",
        message: errorMessage(e, "Could not open the registration window."),
      };
    }
  }

  return { targetId: data.id, windowResult };
}

async function rpc<T = RpcResult>(
  fn: string,
  args?: Record<string, unknown>,
): Promise<T> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc(fn, args ?? {});
  if (error) throw error;
  return data as T;
}

export const openRegistration = (
  targetId: number,
  opensAt: Date,
  closesAt: Date,
  reason?: string,
  notify = true,
) =>
  rpc("admin_open_registration", {
    p_target_id: targetId,
    p_opens_at: opensAt.toISOString(),
    p_closes_at: closesAt.toISOString(),
    p_reason: reason ?? null,
    p_notify: notify,
  });

export const openPlantingMonth = (targetId: number, notify = true) =>
  rpc("admin_open_planting_month", { p_target_id: targetId, p_notify: notify });

export const closeRegistration = (targetId: number) =>
  rpc("admin_close_registration", { p_target_id: targetId });

export const extendRegistration = (windowId: number, closesAt: Date) =>
  rpc("admin_extend_registration", {
    p_window_id: windowId,
    p_closes_at: closesAt.toISOString(),
  });

/** Change the dates of a scheduled or open window (an open one keeps its start). */
export const updateWindow = (windowId: number, opensAt: Date, closesAt: Date) =>
  rpc("admin_update_window", {
    p_window_id: windowId,
    p_opens_at: opensAt.toISOString(),
    p_closes_at: closesAt.toISOString(),
  });

/** Scheduled window → deleted; open window → closed now. */
export const cancelWindow = (windowId: number) =>
  rpc("admin_cancel_window", { p_window_id: windowId });

export const setTargetActive = (targetId: number, active: boolean) =>
  rpc("admin_set_target_active", { p_target_id: targetId, p_active: active });

/** crop_name → growth cycle in months, from `crop_lifecycle` (falls back to the model mirror). */
export async function fetchCropCycles(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("crop_lifecycle")
    .select("crop_name, cycle_months");
  if (error) throw error;
  return {
    ...CROP_CYCLE_FALLBACK,
    ...Object.fromEntries(
      (data ?? []).map((r) => [r.crop_name, Number(r.cycle_months)]),
    ),
  };
}

export async function fetchWindowHistory(
  targetId: number,
): Promise<RegistrationWindow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("registration_windows")
    .select("id, opens_at, closes_at, closed_early_at, reason")
    .eq("target_id", targetId)
    .order("opens_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as RegistrationWindow[];
}

/* ------------------------------------------------------------------ */
/* Status + farmer registration                                        */
/* ------------------------------------------------------------------ */

export async function fetchBucketStatus(
  includeAll = false,
): Promise<BucketStatus[]> {
  const data = await rpc<BucketStatus[]>("get_bucket_status", {
    p_include_all: includeAll,
  });
  return (data ?? []).map((r) => ({
    ...r,
    target_limit_mt: Number(r.target_limit_mt),
    filled_mt: Number(r.filled_mt),
    remaining_mt: Number(r.remaining_mt),
    fill_ratio: Number(r.fill_ratio),
  }));
}

const numOrNull = (v: unknown) =>
  v === null || v === undefined ? null : Number(v);

/** One row per target (R5). Use this for every list, card and chart. */
export async function fetchTargetSummary(
  includeAll = false,
): Promise<TargetSummary[]> {
  const rows = await rpc<TargetSummary[]>("get_target_summary", {
    p_include_all: includeAll,
  });
  return (rows ?? []).map((r) => ({
    ...r,
    target_limit_mt: Number(r.target_limit_mt),
    filled_mt: Number(r.filled_mt),
    remaining_mt: Number(r.remaining_mt),
    fill_ratio: Number(r.fill_ratio),
    farmer_count: Number(r.farmer_count),
    filled_ha: numOrNull(r.filled_ha),
    allowed_extent_ha: numOrNull(r.allowed_extent_ha),
    target_fair_price: numOrNull(r.target_fair_price),
    estimated_wholesale_price: numOrNull(r.estimated_wholesale_price),
    my_amount_mt: numOrNull(r.my_amount_mt),
  }));
}

export const STATUS_LABEL: Record<TargetStatus, string> = {
  open: "Open",
  full: "Open · FULL",
  scheduled: "Scheduled",
  closed: "Closed",
  inactive: "Inactive",
};

export const STATUS_COLOR: Record<TargetStatus, string> = {
  open: "green",
  full: "red",
  scheduled: "blue",
  closed: "orange",
  inactive: "gray",
};

/** Health chip from the fill ratio: < 0.6 Healthy, 0.6–0.85 Watch, 0.85–1 Near limit, ≥ 1 Full. */
export const healthOf = (
  ratio: number,
): { label: string; color: "green" | "yellow" | "orange" | "red" } =>
  ratio >= 1
    ? { label: "Full", color: "red" }
    : ratio >= 0.85
      ? { label: "Near limit", color: "orange" }
      : ratio >= 0.6
        ? { label: "Watch", color: "yellow" }
        : { label: "Healthy", color: "green" };

export const registerHarvest = (targetId: number, amountMt: number) =>
  rpc<RegisterResult>("register_harvest", {
    p_target_id: targetId,
    p_amount_mt: amountMt,
  });

export async function fetchMyRegistrations(): Promise<MyRegistration[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("farmer_registrations")
    .select(
      "id, crop_name, amount_mt, registered_at, status, target_id, target:national_targets(year, month, target_harvest_date, planting_date)",
    )
    .eq("farmer_id", user.id)
    .order("registered_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MyRegistration[];
}

/* ------------------------------------------------------------------ */
/* Quota change requests                                               */
/* ------------------------------------------------------------------ */

export const submitQuotaRequest = (
  registrationId: number,
  type: QuotaRequestType,
  requestedMt: number | null,
  reason: string,
) =>
  rpc("submit_quota_change_request", {
    p_registration_id: registrationId,
    p_request_type: type,
    p_requested_amount_mt: requestedMt,
    p_reason: reason,
  });

export const withdrawQuotaRequest = (requestId: number) =>
  rpc("withdraw_quota_change_request", { p_request_id: requestId });

export async function fetchMyQuotaRequests(): Promise<QuotaRequest[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("quota_change_requests")
    .select("*, target:national_targets(year, month, target_limit_mt)")
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as QuotaRequest[];
}

export async function adminFetchQuotaRequests(
  status: QuotaRequestStatus | "all",
): Promise<QuotaRequest[]> {
  const supabase = createClient();
  // users!farmer_id: name the FK column so the join stays unambiguous even if
  // the table has a second reference to users (e.g. the reviewing admin).
  let q = supabase
    .from("quota_change_requests")
    .select(
      "*, farmer:users!farmer_id(u_name, u_surname, u_tel, u_district, u_email), target:national_targets(year, month, target_limit_mt)",
    )
    .order("created_at", { ascending: status === "pending" });
  if (status !== "all") q = q.eq("status", status);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as QuotaRequest[];
}

export const adminReviewQuotaRequest = (
  requestId: number,
  approve: boolean,
  note: string | null,
  overrideCapacity = false,
) =>
  rpc("admin_review_quota_request", {
    p_request_id: requestId,
    p_approve: approve,
    p_admin_note: note,
    p_override_capacity: overrideCapacity,
  });

/* ------------------------------------------------------------------ */
/* App config                                                          */
/* ------------------------------------------------------------------ */

export async function fetchDieselPrice(
  fallback = DEFAULT_DIESEL_PRICE,
): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase
    .from("app_config")
    .select("diesel_price_lkr")
    .eq("id", 1)
    .maybeSingle();
  return Number(data?.diesel_price_lkr ?? fallback);
}

export async function updateDieselPrice(value: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("app_config")
    .update({ diesel_price_lkr: value })
    .eq("id", 1);
  if (error) throw error;
}

/* ------------------------------------------------------------------ */
/* Friendly messages                                                   */
/* ------------------------------------------------------------------ */

export function rpcMessage(r: RpcResult | null | undefined): string {
  if (!r) return "";
  // Status first: the old admin_open_registration still says "Extend it instead",
  // which is wrong now that scheduled windows can be edited or cancelled (B3).
  if (r.status === "overlap") {
    return "This target already has a window in that period. Edit or cancel that window (Windows list) instead.";
  }
  if (r.message) return String(r.message);
  switch (r.status) {
    case "success":
      return "Done.";
    case "month_passed":
      return "The registration month has already passed. Use a custom window.";
    case "finished":
      return "This window has already ended. Open a new one instead.";
    case "invalid_dates":
      return "Check the dates: closing must be after opening and in the future.";
    case "no_target":
      return "Target not found.";
    case "no_planting_date":
      return "This target has no registration month yet — run the database migration (03_monthly_registration_fix.sql) or set custom dates.";
    case "not_open":
      return "Registration is not open right now.";
    case "not_found":
      return "Not found.";
    case "pending_exists":
      return "You already have a pending request for this registration.";
    case "reason_too_short":
      return "Please explain the reason (at least 10 characters).";
    case "registration_inactive":
      return "This registration is cancelled.";
    case "invalid_amount":
      return "Please enter a valid amount.";
    case "not_pending":
      return "This request was already handled.";
    case "insufficient_capacity":
      return `Not enough quota left (${r.remaining_mt} MT remaining, ${r.requested_extra_mt} MT extra requested). Tick "override capacity" to approve anyway.`;
    default:
      return `Status: ${r.status}`;
  }
}
