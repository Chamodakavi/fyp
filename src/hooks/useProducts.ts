import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { PostgrestError } from "@supabase/supabase-js";

export type Product = {
  id: number;
  name: string;
  description?: string;
  type: string;
  price: number;
  stock: number;
  image?: string;
  weight?: string;
};

export function useProducts(
  initialCategory: string = "all",
  initialSearch: string = "",
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const supabase = createClient();

  const fetchProducts = async (category: string, searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (category !== "all") {
        query = query.eq("type", category);
      }

      if (searchTerm.trim() !== "") {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching products:", fetchError);
        setError(fetchError);
        setProducts([]);
        return;
      }

      const formattedProducts: Product[] = (data || []).map((product) => ({
        id: Number(product.id),
        name: product.name,
        description: product.description || "",
        type: product.type,
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.image || "",
        weight: product.weight || "",
      }));

      setProducts(formattedProducts);
    } catch (err: any) {
      console.error("Unexpected error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(initialCategory, initialSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, initialSearch]);

  return {
    products,
    loading,
    error,

    refreshProducts: (category: string = "all", searchTerm: string = "") =>
      fetchProducts(category, searchTerm),
  };
}
