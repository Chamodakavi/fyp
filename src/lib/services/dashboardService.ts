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

// 1. Fetch Key Performance Indicators
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const supabase = createClient();

  // A. Total registered farmers from 'users' table
  const { count: farmerCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("u_type", "farmer");

  // B. Total registered land extent from 'crop_registrations' (1 Acre = 0.404686 Ha)
  const { data: landData } = await supabase
    .from("crop_registrations")
    .select("land_size_acres");

  const totalAcres = (landData || []).reduce(
    (sum, item) => sum + (Number(item.land_size_acres) || 0),
    0,
  );
  const totalAllocatedHa = Number((totalAcres * 0.404686).toFixed(1));

  // C. Distinct active crops under regulation from 'national_targets'
  const { data: targetCrops } = await supabase
    .from("national_targets")
    .select("crop_name");

  const distinctCrops = new Set(
    (targetCrops || []).map((t) => t.crop_name.toUpperCase()),
  );

  // D. Pending complaints needing attention
  const { count: pendingComplaints } = await supabase
    .from("complaints")
    .select("id", { count: "exact", head: true })
    .eq("status", "unread");

  return {
    totalFarmers: farmerCount || 0,
    totalAllocatedHa,
    activeCropsCount: distinctCrops.size,
    pendingComplaintsCount: pendingComplaints || 0,
  };
}

// 2. Fetch Active Quota Windows (Comparing national_targets vs crop_registrations)
export async function getActiveCropWindows(): Promise<ActiveCropWindow[]> {
  const supabase = createClient();

  // Fetch published targets
  const { data: targets, error: targetError } = await supabase
    .from("national_targets")
    .select("crop_name, allowed_extent_ha, target_harvest_date, year, month")
    .order("year", { ascending: true })
    .order("month", { ascending: true });

  if (targetError || !targets) return [];

  // Fetch actual registrations to aggregate real registered hectares
  const { data: registrations } = await supabase
    .from("crop_registrations")
    .select("crop_name, land_size_acres, harvest_date");

  return targets.slice(0, 5).map((target) => {
    const targetCropUpper = target.crop_name.toUpperCase();

    // Sum matching farmer registrations for this crop (acres converted to ha)
    const matchingRegistrations = (registrations || []).filter(
      (reg) => reg.crop_name?.toUpperCase() === targetCropUpper,
    );

    const registeredAcres = matchingRegistrations.reduce(
      (sum, r) => sum + (Number(r.land_size_acres) || 0),
      0,
    );
    const registeredHa = Number((registeredAcres * 0.404686).toFixed(1));
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
      allowedHa,
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
    supabase.from("national_targets").select("year, month, target_limit_mt"),
    supabase.from("farmer_registrations").select("amount_mt, registered_at"),
  ]);

  const targets = targetsRes.data || [];
  const farmerRegs = registrationsRes.data || [];

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
    }
  });

  const sortedPoints = Array.from(trajectoryMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, val]) => val);

  return sortedPoints.length > 0
    ? sortedPoints
    : [{ month: "Current", registeredMT: 0, targetMT: 0 }];
}
