import { createClient } from "@/utils/supabase/createClient";

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
  month: number;
  rainfall: number;
  dieselPrice: number;
}

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
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Failed to fetch response from AI Engine",
    );
  }

  return response.json();
}

export async function applyNationalTarget(
  crop: string,
  apiResponse: AdvisoryData,
): Promise<void> {
  const supabase = createClient();
  const targetLimitMT = Number(apiResponse.Required_Harvest_MT);
  const targetLimitHa = Number(apiResponse.Allowed_Extent_Ha);

  if (!targetLimitMT || Number.isNaN(targetLimitMT)) {
    throw new Error("Invalid AI target yield value.");
  }

  const [harvestYear, harvestMonth] =
    apiResponse.Target_Harvest_Date.split("-").map(Number);
  const cropName = crop.toUpperCase();

  const { error: upsertError } = await supabase.from("national_targets").upsert(
    {
      crop_name: cropName,
      target_limit_mt: targetLimitMT,
      allowed_extent_ha: targetLimitHa,
      year: harvestYear,
      month: harvestMonth,
      target_harvest_date: apiResponse.Target_Harvest_Date,
      planting_date: apiResponse.Planting_Date,
      target_fair_price: apiResponse.Calculated_Fair_Price,
      estimated_wholesale_price: apiResponse.Estimated_Wholesale_Price,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "crop_name, year, month" },
  );

  if (upsertError) throw upsertError;
}
