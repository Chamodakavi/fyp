import { useEffect, useState } from "react";
import {
  fetchPriceForecasts,
  PriceForecast,
} from "@/lib/services/priceForecastService";

/** Predicted prices for every crop that has forecasts, plus the crop list for dropdowns. */
export function usePriceForecasts() {
  const [byCrop, setByCrop] = useState<Record<string, PriceForecast[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchPriceForecasts()
      .then((data) => {
        if (!cancelled) setByCrop(data);
      })
      .catch((e) => {
        console.error("Error fetching price forecasts:", e);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const crops = Object.keys(byCrop).sort();

  return { byCrop, crops, loading, error };
}
