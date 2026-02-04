import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { PostgrestError } from "@supabase/supabase-js";

export function useCart() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function fetchCart() {
      const supabase = createClient();
      
      // 1. Get Logged In User
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setCart([]); // No user = empty cart
        setLoading(false);
        return;
      }

      // 2. Fetch Cart Items for THIS User only
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id); 

      if (error) {
        console.error("Error fetching cart:", error);
        setError(error);
      } else {
        setCart(data || []);
      }
      setLoading(false);
    }

    fetchCart();
  }, []);

  return { cart, loading, error };
}