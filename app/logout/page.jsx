"use client";
import { getSharedSb } from "../lib/supabase";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      const sb = (await getSharedSb());
      await sb.auth.signOut();
      window.location.href = "/";
    })();
  }, []);
  return <p style={{ fontFamily: "sans-serif", padding: "40px", textAlign: "center", color: "#6b7280" }}>...</p>;
}