import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { PostgrestError } from "@supabase/supabase-js";

export function useNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data, error } = await supabase.from("news").select("*");

      if (error) {
        console.error("Error fetching products:", error);
        setError(error);
      } else {
        setNews(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return { news, loading, error };
}