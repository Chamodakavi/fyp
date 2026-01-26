"use client";

import Login from "@/components/login/Login";
import { createClient } from "@/utils/supabase/createClient";
import { useEffect } from "react";

export default function Home() {
  const supabase = createClient();

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("❌ Connection Failed:", error.message);
      } else {
        console.log("✅ Connection Successful! yeyyy", data);
      }
    }

    checkConnection();
  }, []);

  return <Login />;
}
