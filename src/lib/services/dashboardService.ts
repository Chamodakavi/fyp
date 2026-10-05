import { createClient } from "@/utils/supabase/createClient";

export interface DashboardKPIs {
  totalFarmers: number;
  totalAllocatedHa: number;
  activeCropsCount: number;
  pendingComplaintsCount: number;
}

export interface ActiveCropWindow {
  crop: string;
  targetHarvest: string;
  registeredHa: number;
  allowedHa: number;
  status: "Healthy" | "Near Limit" | "Cap Reached";
  statusColor: "green" | "orange" | "red";
  percentage: number;
}

export interface TrajectoryPoint {
  month: string;
  registeredMT: number;
  targetMT: number;
}

// Map MT to Hectares using your ML Engine's exact baseline yields
const YIELD_PER_HECTARE: Record<string, number> = {
  CARROT: 19.0,
  TOMATOES: 13.1,
  BEANS: 18.0,
  CABBAGE: 24.0,
  BRINJALS: 11.4,
};

// Cancelled registrations stay in the table as history but no longer hold quota
const holdsQuota = (r: { status?: string | null }) => r.status !== "cancelled";

// Deactivated targets are hidden from farmers, so they aren't "under regulation"
const isActiveTarget = (t: { is_active?: boolean | null }) =>
  t.is_active !== false;

function getYieldForCrop(cropName: string): number {
  return YIELD_PER_HECTARE[cropName.toUpperCase()] || 15.0; // Fallback
}

// 1. Fetch Key Performance Indicators
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const supabase = createClient();

  // A. Total registered farmers (Filtered by u_role = "user")
  const { count: farmerCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("u_role", "user"); // <-- Fixed: Now filters by the correct column

  // B. Total registered land extent (Calculated from farmer_registrations MT)
  const { data: regs } = await supabase
    .from("farmer_registrations")
    .select("crop_name, amount_mt, status");

  let totalAllocatedHa = 0;
  if (regs) {
    totalAllocatedHa = regs.filter(holdsQuota).reduce((sum, r) => {
      const yieldMt = getYieldForCrop(r.crop_name || "");
      const ha = (Number(r.amount_mt) || 0) / yieldMt;
      return sum + ha;
    }, 0);
  }
  const formattedTotalAllocatedHa = Number(totalAllocatedHa.toFixed(1));

  // C. Distinct active crops under regulation from 'national_targets'
  const { data: targetCrops } = await supabase
    .from("national_targets")
    .select("crop_name, is_active");

  const distinctCrops = new Set(
    (targetCrops || [])
      .filter(isActiveTarget)
      .map((t) => t.crop_name.toUpperCase()),
  );

  // D. Pending complaints needing attention
  const { count: pendingComplaints } = await supabase
    .from("complaints")
    .select("id", { count: "exact", head: true })
    .eq("status", "unread");

  return {
    totalFarmers: farmerCount || 0,
    totalAllocatedHa: formattedTotalAllocatedHa,
    activeCropsCount: distinctCrops.size,
    pendingComplaintsCount: pendingComplaints || 0,
  };
}

// 2. Fetch Active Quota Windows (Comparing national_targets vs farmer_registrations)
export async function getActiveCropWindows(): Promise<ActiveCropWindow[]> {
  const supabase = createClient();

  // Fetch published targets
  const { data: allTargets, error: targetError } = await supabase
    .from("national_targets")
    .select(
      "crop_name, allowed_extent_ha, target_harvest_date, year, month, is_active",
    )
    .order("year", { ascending: true })
    .order("month", { ascending: true });

  if (targetError || !allTargets) return [];

  const targets = allTargets.filter(isActiveTarget);

  // FIX: Fetch actual registrations from farmer_registrations (not crop_registrations)
  const { data: registrations } = await supabase
    .from("farmer_registrations")
    .select("crop_name, amount_mt, status");

  return targets.slice(0, 5).map((target) => {
    const targetCropUpper = target.crop_name.toUpperCase();

    // Sum matching farmer registrations for this crop
    const matchingRegistrations = (registrations || []).filter(
      (reg) =>
        holdsQuota(reg) && reg.crop_name?.toUpperCase() === targetCropUpper,
    );

    // Sum Metric Tons
    const registeredMT = matchingRegistrations.reduce(
      (sum, r) => sum + (Number(r.amount_mt) || 0),
      0,
    );

    // FIX: Convert Metric Tons back to Hectares using specific crop yield
    const yieldMt = getYieldForCrop(targetCropUpper);
    const registeredHa = Number((registeredMT / yieldMt).toFixed(1));
    const allowedHa = Number(target.allowed_extent_ha) || 1;

    const percentage = Math.min(
      Math.round((registeredHa / allowedHa) * 100),
      100,
    );

    let status: "Healthy" | "Near Limit" | "Cap Reached" = "Healthy";
    let statusColor: "green" | "orange" | "red" = "green";

    if (percentage >= 95) {
      status = "Cap Reached";
      statusColor = "red";
    } else if (percentage >= 80) {
      status = "Near Limit";
      statusColor = "orange";
    }

    return {
      crop: target.crop_name,
      targetHarvest:
        target.target_harvest_date ||
        `${target.year}-${String(target.month).padStart(2, "0")}`,
      registeredHa,
      allowedHa: Number(allowedHa.toFixed(1)),
      status,
      statusColor,
      percentage,
    };
  });
}

// 3. Fetch Supply Trajectory for the Area Chart
export async function getSupplyTrajectory(): Promise<TrajectoryPoint[]> {
  const supabase = createClient();

  const [targetsRes, registrationsRes] = await Promise.all([
    supabase
      .from("national_targets")
      .select("year, month, target_limit_mt, is_active"),
    supabase
      .from("farmer_registrations")
      .select("amount_mt, registered_at, status"),
  ]);

  const targets = (targetsRes.data || []).filter(isActiveTarget);
  const farmerRegs = (registrationsRes.data || []).filter(holdsQuota);

  // Month names for labels
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Aggregate targets by Month-Year
  const trajectoryMap = new Map<
    string,
    { month: string; targetMT: number; registeredMT: number }
  >();

  targets.forEach((t) => {
    const key = `${t.year}-${String(t.month).padStart(2, "0")}`;
    const label = `${monthNames[(t.month - 1) % 12]} ${t.year}`;

    if (!trajectoryMap.has(key)) {
      trajectoryMap.set(key, { month: label, targetMT: 0, registeredMT: 0 });
    }
    const entry = trajectoryMap.get(key)!;
    entry.targetMT += Number(t.target_limit_mt) || 0;
  });

  // Aggregate farmer registrations by Month-Year
  farmerRegs.forEach((r) => {
    if (!r.registered_at) return;
    const date = new Date(r.registered_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (trajectoryMap.has(key)) {
      trajectoryMap.get(key)!.registeredMT += Number(r.amount_mt) || 0;
    } else {
      // FIX: If a farmer registers for a month without an AI target, still show the supply on the chart
      const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      trajectoryMap.set(key, {
        month: label,
        targetMT: 0,
        registeredMT: Number(r.amount_mt) || 0,
      });
    }
  });

  const sortedPoints = Array.from(trajectoryMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, val]) => val);

  return sortedPoints.length > 0
    ? sortedPoints
    : [{ month: "Current", registeredMT: 0, targetMT: 0 }];
}
