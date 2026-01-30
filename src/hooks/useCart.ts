import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { PostgrestError } from "@supabase/supabase-js";

export function useCart() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data, error } = await supabase.from("cart").select("*").eq("u_id", 1);

      if (error) {
        console.error("Error fetching cart:", error);
        setError(error);
      } else {
        setCart(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return { cart, loading, error };
}
