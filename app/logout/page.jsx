"use client";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      await sb.auth.signOut();
      window.location.href = "/";
    })();
  }, []);
  return <p style={{ fontFamily: "sans-serif", padding: "40px", textAlign: "center", color: "#6b7280" }}>...</p>;
}