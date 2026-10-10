"use client";
import Header from "../components/Header";
import { useState, useEffect } from "react";

const TXT = {
  fr: { title: "Mes favoris", sub: "Les produits que vous avez enregistr\u00e9s", empty: "Aucun favori pour le moment", emptySub: "Touchez le c\u0153ur sur un produit pour l'enregistrer ici.", browse: "Voir les produits", add: "Ajouter au panier", added: "Ajout\u00e9", remove: "Retirer", cart: "Panier", loading: "Chargement...", chat: "Chatter" },
  en: { title: "My wishlist", sub: "The products you saved", empty: "No saved products yet", emptySub: "Tap the heart on a product to save it here.", browse: "Browse products", add: "Add to cart", added: "Added", remove: "Remove", cart: "Cart", loading: "Loading...", chat: "Chat" },
};

let client = null;
async function getClient() {
  if (client) return client;
  const { createClient } = await import("@supabase/supabase-js");
  client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return client;
}

export default function WishlistPage() {
  const [lang, setLang] = useState("fr");
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedId, setAddedId] = useState(null);
  const t = TXT[lang] || TXT.fr;

  function readCart() {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch (e) { return []; }
  }

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
    setCartCount(readCart().reduce((n, i) => n + (i.quantity || 1), 0));
    (async () => {
      const sb = await getClient();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      const { data: rows } = await sb.from("wishlist").select("product_id").order("created_at", { ascending: false });
      const ids = (rows || []).map((r) => String(r.product_id));
      if (ids.length === 0) { setItems([]); setLoading(false); return; }
      const { data: prods } = await sb.from("products").select("*").in("id", ids);
      const byId = {};
      (prods || []).forEach((p) => { byId[String(p.id)] = p; });
      setItems(ids.map((id) => byId[id]).filter(Boolean));
      setLoading(false);
    })();
  }, []);

  function switchLang(l) { setLang(l); localStorage.setItem("lang", l); }

  function getPrice(p) {
    if (currency === "USD") return "$" + (p.price_usd || 0);
    if (currency === "CFA") return "CFA " + Math.round((p.price_usd || 0) * 605).toLocaleString();
    return "\u20B9" + (p.price_inr || 0);
  }

  function addToCart(p) {
    const cart = readCart();
    const existing = cart.find((i) => i.id === p.id);
    const next = existing ? cart.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)) : [...cart, { ...p, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(next));
    setCartCount(next.reduce((n, i) => n + (i.quantity || 1), 0));
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  async function removeItem(p) {
    const sb = await getClient();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    const { error } = await sb.from("wishlist").delete().eq("user_id", session.user.id).eq("product_id", String(p.id));
    if (!error) setItems((list) => list.filter((x) => x.id !== p.id));
  }

  const imgOf = (p) => (p.images && p.images.length ? p.images[0] : p.image_url) || "/placeholder.png";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <Header lang={lang} switchLang={switchLang} />

      <div className="ab-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#111827", marginBottom: "6px" }}>{t.title}</h1>
        <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "16px" }}>{t.sub}</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["USD", "CFA", "INR"].map((c) => (
            <button key={c} onClick={() => setCurrency(c)} style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", border: currency === c ? "none" : "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", backgroundColor: currency === c ? "#ea580c" : "white", color: currency === c ? "white" : "#374151" }}>{c}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: "#6b7280" }}>{t.loading}</p>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#6b7280", marginBottom: "8px" }}>{t.empty}</h2>
            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>{t.emptySub}</p>
            <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>{t.browse}</a>
          </div>
        ) : (
          <div className="ab-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {items.map((p) => (
              <div key={p.id} style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <img src={imgOf(p)} alt={p.name} style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "16px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "8px", lineHeight: "1.4" }}>{p.name}</h3>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>{getPrice(p)}</p>
                  <button onClick={() => addToCart(p)} style={{ width: "100%", backgroundColor: addedId === p.id ? "#16a34a" : "#ea580c", color: "white", border: "none", borderRadius: "10px", padding: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginBottom: "8px" }}>
                    {addedId === p.id ? t.added : t.add}
                  </button>
                  <button onClick={() => removeItem(p)} style={{ width: "100%", backgroundColor: "white", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "10px", padding: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    {t.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <a className="ab-wa" href="https://wa.me/917842280069" target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "14px", textDecoration: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "22px", height: "22px" }} />
        {t.chat}
      </a>
    </div>
  );
}