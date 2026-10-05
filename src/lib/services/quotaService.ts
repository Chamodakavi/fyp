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
  /** Planting month — the API returns the harvest month after the growth lag. */
  month: number;
  rainfall: number;
  dieselPrice: number;
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

/**
 * Default window = the planting month; starts now if the month has already begun.
 * Returns null when the date is unreadable or the planting month is already over.
 */
export function defaultWindowFromPlanting(
  plantingDate: string | null | undefined,
) {
  const ym = parseYearMonth(plantingDate);
  if (!ym) return null;
  const start = colomboMonthStart(ym.year, ym.month);
  const end = colomboMonthStart(
    ym.month === 12 ? ym.year + 1 : ym.year,
    ym.month === 12 ? 1 : ym.month + 1,
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

export async function applyNationalTarget(
  crop: string,
  apiResponse: AdvisoryData,
  opts: ApplyTargetOptions,
): Promise<{ targetId: number; windowResult: RpcResult | null }> {
  const supabase = createClient();
  const targetLimitMT = Number(apiResponse.Required_Harvest_MT);
  const targetLimitHa = Number(apiResponse.Allowed_Extent_Ha);

  if (!targetLimitMT || Number.isNaN(targetLimitMT)) {
    throw new Error("Invalid AI target yield value.");
  }

  const harvest = parseYearMonth(apiResponse.Target_Harvest_Date);
  if (!harvest) {
    throw new Error(
      `Unreadable harvest date: ${apiResponse.Target_Harvest_Date}`,
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
        target_harvest_date: apiResponse.Target_Harvest_Date,
        planting_date: apiResponse.Planting_Date,
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

export const setTargetActive = (targetId: number, active: boolean) =>
  rpc("admin_set_target_active", { p_target_id: targetId, p_active: active });

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
  if (r.message) return String(r.message);
  switch (r.status) {
    case "success":
      return "Done.";
    case "overlap":
      return "This target already has a window in that period. Extend the existing window instead.";
    case "invalid_dates":
      return "Check the dates: closing must be after opening and in the future.";
    case "no_target":
      return "Target not found.";
    case "no_planting_date":
      return "This target has no readable planting date — set custom dates.";
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
