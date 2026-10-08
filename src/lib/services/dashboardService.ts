import { createClient } from "@/utils/supabase/createClient";
import {
  fetchTargetSummary,
  monthIndex,
  TargetSummary,
} from "@/lib/services/quotaService";

export interface DashboardKPIs {
  totalFarmers: number;
  /** Σ filled_mt over open + scheduled targets (MT is the unit of the quota, R6). */
  registeredSupplyMt: number;
  /** Number of open + scheduled harvest-month targets behind that figure. */
  harvestMonthsCount: number;
  activeCropsCount: number;
  pendingComplaintsCount: number;
}

/** One bar pair per target: AI limit vs registered, both in MT. */
export interface TrajectoryPoint {
  /** e.g. "CARROT Feb 2027" */
  label: string;
  registeredMT: number;
  targetMT: number;
}

const byHarvest = (a: TargetSummary, b: TargetSummary) =>
  monthIndex(a.harvest_year, a.harvest_month) -
    monthIndex(b.harvest_year, b.harvest_month) ||
  a.crop_name.localeCompare(b.crop_name);

const takingRegistrations = (t: TargetSummary) =>
  t.status === "open" || t.status === "full" || t.status === "scheduled";

/**
 * Everything the admin dashboard shows comes from get_target_summary, so every
 * number is per target (crop + harvest month) — never summed by crop name (B4).
 */
export async function getDashboardData(): Promise<{
  kpis: DashboardKPIs;
  targets: TargetSummary[];
  trajectory: TrajectoryPoint[];
}> {
  const supabase = createClient();

  const [targets, farmerRes, complaintRes] = await Promise.all([
    fetchTargetSummary(false),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("u_role", "user"),
    supabase
      .from("complaints")
      .select("id", { count: "exact", head: true })
      .eq("status", "unread"),
  ]);

  const sorted = [...targets].sort(byHarvest);
  const live = sorted.filter(takingRegistrations);

  const kpis: DashboardKPIs = {
    totalFarmers: farmerRes.count || 0,
    registeredSupplyMt: Number(
      live.reduce((s, t) => s + t.filled_mt, 0).toFixed(1),
    ),
    harvestMonthsCount: live.length,
    activeCropsCount: new Set(sorted.map((t) => t.crop_name)).size,
    pendingComplaintsCount: complaintRes.count || 0,
  };

  const trajectory: TrajectoryPoint[] = sorted.map((t) => ({
    label: `${t.crop_name} ${t.harvest_label}`,
    targetMT: t.target_limit_mt,
    registeredMT: t.filled_mt,
  }));

  return { kpis, targets: sorted, trajectory };
}
