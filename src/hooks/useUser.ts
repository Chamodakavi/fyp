import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/createClient";
import { User as SupabaseUser } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  u_email: string;
  u_name: string;
  u_surname?: string;
  u_tel?: string;
  u_district?: string;
  u_type?: string;
  u_notify?: boolean;
  created_at?: string;
};

export function useUser() {
  const supabase = createClient();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to fetch data
  const fetchProfile = async (userId: string, retryCount = 0) => {
    console.log("Fetching profile for:", userId);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      // If profile isn't found, wait 1 second and try one more time
      if (retryCount < 1) {
        console.log("Profile not found yet, retrying in 1s...");
        setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
      } else {
        console.error("Error fetching user profile:", error);
        setError(error.message);
        setLoading(false);
      }
    } else {
      setUser(data);
      setLoading(false);
    }
  };

  // 1️⃣ Initial Load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) fetchProfile(data.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2️⃣ REALTIME LISTENER (Debug Version)
  useEffect(() => {
    if (!user?.id) return;

    console.log("🔌 Subscribing to Realtime changes for ID:", user.id);

    const channel = supabase
      .channel("user-profile-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("🟢 Realtime Update Received!", payload);
          // Merge new data into existing user state
          setUser((prev) => prev ? { ...prev, ...(payload.new as UserProfile) } : null);
        }
      )
      .subscribe((status) => {
        console.log("🔌 Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { user, loading, error };
}