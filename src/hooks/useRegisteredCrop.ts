import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { useUser } from "./useUser"; // We use your existing hook to get the ID

type RegisteredCrop = {
  id: number;
  farmer_id: string;
  crop_name: string;
  amount_mt: number;
  registered_at: string;
};

export function useRegisteredCrops() {
  const supabase = createClient();
  const { user } = useUser(); // Get the current logged-in user
  const [crops, setCrops] = useState<RegisteredCrop[]>([]);
  const [loadingCrops, setLoadingCrops] = useState(true);

  useEffect(() => {
    // Only fetch if we actually have a user ID
    if (!user?.id) return;

    const fetchCrops = async () => {
      setLoadingCrops(true);
      
      const { data, error } = await supabase
        .from("farmer_registrations")
        .select("*")
        .eq("farmer_id", user.id); // Match the farmer_id with the user's ID

      if (error) {
        console.error("Error fetching crops:", error.message);
      } else {
        setCrops(data || []);
      }
      setLoadingCrops(false);
    };

    fetchCrops();
  }, [user?.id]); // Re-run if the user changes (like after a Google login)

  return { crops, loadingCrops };
}