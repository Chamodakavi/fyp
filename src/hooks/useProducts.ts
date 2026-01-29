import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { PostgrestError } from "@supabase/supabase-js";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Error fetching products:", error);
        setError(error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Return the data so your component can use it
  return { products, loading, error };
}