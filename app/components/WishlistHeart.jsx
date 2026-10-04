"use client";
import { useState, useEffect } from "react";

let client = null;
async function getClient() {
  if (client) return client;
  const { createClient } = await import("@supabase/supabase-js");
  client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return client;
}

let saved = null;
let loading = null;
const listeners = new Set();
function notify() { listeners.forEach((f) => f(new Set(saved))); }
async function load() {
  if (loading) return loading;
  loading = (async () => {
    const sb = await getClient();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { saved = new Set(); return; }
    const { data } = await sb.from("wishlist").select("product_id");
    saved = new Set((data || []).map((r) => String(r.product_id)));
  })();
  return loading;
}

export default function WishlistHeart({ productId }) {
  const id = String(productId);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let alive = true;
    const fn = (s) => { if (alive) setOn(s.has(id)); };
    listeners.add(fn);
    load().then(() => { if (alive && saved) setOn(saved.has(id)); });
    return () => { alive = false; listeners.delete(fn); };
  }, [id]);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    const sb = await getClient();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { window.location.href = "/login"; return; }
    await load();
    if (saved.has(id)) {
      const { error } = await sb.from("wishlist").delete().eq("user_id", session.user.id).eq("product_id", id);
      if (!error) saved.delete(id);
    } else {
      const { error } = await sb.from("wishlist").insert([{ user_id: session.user.id, product_id: id }]);
      if (!error) saved.add(id);
    }
    notify();
  }

  return (
    <button onClick={toggle} aria-label="Wishlist" style={{ position: "absolute", top: "8px", right: "8px", zIndex: 2, width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", backgroundColor: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={on ? "#ea580c" : "none"} stroke="#ea580c" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
      </svg>
    </button>
  );
}