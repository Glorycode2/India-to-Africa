"use client";
import { useState, useEffect } from "react";

export default function AdminBar() {
  const [admin, setAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let sb = null;
    let sub = null;
    let cleanup = null;
    let alive = true;
    async function check(session) {
      if (!session) { if (alive) setAdmin(false); return; }
      const { data } = await sb.from("admins").select("user_id").maybeSingle();
      if (alive) setAdmin(!!data);
    }
    (async () => {
      const { createClient } = await import("@supabase/supabase-js");
      sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const { data: { session } } = await sb.auth.getSession();
      await check(session);
      const r = sb.auth.onAuthStateChange((_e, s) => { setTimeout(() => check(s), 0); });
      sub = r.data.subscription;
      const recheck = async () => { const { data: { session: s } } = await sb.auth.getSession(); await check(s); };
      setTimeout(recheck, 900);
      setTimeout(recheck, 2500);
      window.addEventListener("pageshow", (e) => { if (e.persisted) window.location.reload(); });
      window.addEventListener("pageshow", recheck);
      window.addEventListener("focus", recheck);
      cleanup = () => { window.removeEventListener("pageshow", recheck); window.removeEventListener("focus", recheck); };
    })();
    return () => { alive = false; if (sub) sub.unsubscribe(); if (cleanup) cleanup(); };
  }, []);

  if (!admin) return null;

  const link = { display: "block", padding: "10px 16px", color: "#111827", fontSize: "14px", fontWeight: "600", textDecoration: "none", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap" };

  return (
    <div style={{ position: "fixed", left: "12px", bottom: "16px", zIndex: 2500, display: "flex", flexDirection: "column-reverse", alignItems: "flex-start", gap: "8px", fontFamily: "sans-serif" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "50px", padding: "8px 14px", fontSize: "12px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ea580c", display: "inline-block" }} />
        Admin
      </button>
      {open ? (
        <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", overflow: "hidden" }}>
          <a href="/admin" style={link}>Dashboard</a>
          <a href="/admin/products" style={link}>Products</a>
          <a href="/admin/settings" style={link}>Settings</a>
          <a href="/logout" style={{ ...link, borderBottom: "none", color: "#b91c1c" }}>Log out</a>
        </div>
      ) : null}
    </div>
  );
}