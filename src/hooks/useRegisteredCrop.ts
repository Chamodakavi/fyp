import { useCallback, useEffect, useState } from "react";
import {
  fetchMyRegistrations,
  errorMessage,
  MyRegistration,
} from "@/lib/services/quotaService";

/**
 * The logged-in farmer's registrations (newest first), each with its status
 * and target month. Bump `refreshKey` or call `refresh()` to reload.
 */
export function useRegisteredCrops(refreshKey = 0) {
  const [crops, setCrops] = useState<MyRegistration[]>([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setCrops(await fetchMyRegistrations());
      setError(null);
    } catch (e) {
      console.error("Error fetching crops:", e);
      setError(errorMessage(e, "Could not load registrations"));
    } finally {
      setLoadingCrops(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  return { crops, loadingCrops, error, refresh };
}

export default useRegisteredCrops;
