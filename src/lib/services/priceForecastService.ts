import { createClient } from "@/utils/supabase/createClient";

/** One AI price prediction for a crop's harvest month (table: crop_price_forecasts). */
export interface PriceForecast {
  crop_name: string;
  /** Harvest year / month the prices are predicted for */
  year: number;
  month: number;
  wholesale_price: number | null;
  retail_price: number | null;
  fair_price: number | null;
  cost_per_kg: number | null;
  planting_year: number | null;
  planting_month: number | null;
  generated_at: string | null;
}

export interface PriceSummary {
  fairPrice: number | null;
  costPerKg: number | null;
  avgWholesale: number | null;
  /** Harvest month with the highest predicted wholesale price */
  bestMonth: PriceForecast | null;
  lastGeneratedAt: string | null;
}

const toNumber = (v: unknown): number | null =>
  v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v);

/** All predictions, grouped by crop and sorted by harvest month (oldest first). */
export async function fetchPriceForecasts(): Promise<
  Record<string, PriceForecast[]>
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("crop_price_forecasts")
    .select(
      "crop_name, year, month, wholesale_price, retail_price, fair_price, cost_per_kg, planting_year, planting_month, generated_at",
    )
    .order("crop_name", { ascending: true })
    .order("year", { ascending: true })
    .order("month", { ascending: true });
  if (error) throw error;

  const byCrop: Record<string, PriceForecast[]> = {};
  for (const row of data ?? []) {
    const crop = String(row.crop_name).toUpperCase();
    (byCrop[crop] ??= []).push({
      crop_name: crop,
      year: Number(row.year),
      month: Number(row.month),
      wholesale_price: toNumber(row.wholesale_price),
      retail_price: toNumber(row.retail_price),
      fair_price: toNumber(row.fair_price),
      cost_per_kg: toNumber(row.cost_per_kg),
      planting_year: toNumber(row.planting_year),
      planting_month: toNumber(row.planting_month),
      generated_at: row.generated_at ?? null,
    });
  }
  return byCrop;
}

export function summarizePrices(rows: PriceForecast[]): PriceSummary {
  const latest = rows[rows.length - 1];
  const wholesale = rows.filter((r) => r.wholesale_price !== null);

  const bestMonth = wholesale.reduce<PriceForecast | null>(
    (best, r) =>
      !best || r.wholesale_price! > best.wholesale_price! ? r : best,
    null,
  );
  const avgWholesale = wholesale.length
    ? wholesale.reduce((sum, r) => sum + r.wholesale_price!, 0) /
      wholesale.length
    : null;
  const lastGeneratedAt = rows.reduce<string | null>(
    (max, r) =>
      r.generated_at && (!max || r.generated_at > max) ? r.generated_at : max,
    null,
  );

  return {
    fairPrice: latest?.fair_price ?? null,
    costPerKg: latest?.cost_per_kg ?? null,
    avgWholesale,
    bestMonth,
    lastGeneratedAt,
  };
}

/** "Rs. 194.95" — or "—" when the model gave no value. */
export const formatPrice = (value: number | null | undefined) =>
  value === null || value === undefined
    ? "—"
    : `Rs. ${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

/** "Feb 27" for chart axes. */
export const shortMonth = (year: number, month: number) =>
  new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "2-digit",
  });
