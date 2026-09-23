"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/useLanguage";

const WHATSAPP_NUMBER = "919XXXXXXXXX";

export default function ProductsPage() {
  const { lang, switchLang, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data } = await supabase.from("products").select("*").eq("in_stock", true).limit(100);
      if (data) {
        setProducts(data);
        const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(cats);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function getPrice(product) {
    if (currency === "USD") return "$" + (product.price_usd || 0);
    if (currency === "CFA") return "CFA " + Math.round((product.price_usd || 0) * 605).toLocaleString();
    return "₹" + (product.price_inr || 0);
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setMessage(t.added_to_cart);
    setTimeout(() => setMessage(""), 2000);
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="https://flagcdn.com/w40/in.png" alt="India" style={{ width: "28px", borderRadius: "3px" }} />
          <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>{t.site_name}</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", overflow: "hidden" }}>
            {["fr", "en"].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "white" : "transparent", color: lang === l ? "#ea580c" : "white" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="/cart" style={{ color: "white", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>
            {t.cart_count} ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </a>
        </div>
      </nav>

      {message && (
        <div style={{ backgroundColor: "#22c55e", color: "white", textAlign: "center", padding: "10px", fontSize: "14px", fontWeight: "600" }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>{t.products_title}</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>{t.products_sub}</p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "200px", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", color: "#111827", backgroundColor: "white" }}
          />
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", color: "#111827", backgroundColor: "white" }}>
            <option value="USD">USD $</option>
            <option value="CFA">CFA (XOF)</option>
            <option value="INR">INR ₹</option>
          </select>
        </div>

        {/* CATEGORY TABS */}
        {categories.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button onClick={() => setCategory("all")} style={{ padding: "6px 16px", borderRadius: "50px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", backgroundColor: category === "all" ? "#ea580c" : "white", color: category === "all" ? "white" : "#374151", border: category === "all" ? "none" : "1px solid #e5e7eb" }}>
              {t.category_all}
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "6px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "13px", fontWeight: "600", backgroundColor: category === cat ? "#ea580c" : "white", color: category === cat ? "white" : "#374151", border: category === cat ? "none" : "1px solid #e5e7eb" }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && <div style={{ textAlign: "center", padding: "80px", color: "#6b7280", fontSize: "16px" }}>{t.loading}</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px", color: "#6b7280" }}>
            <p style={{ fontSize: "18px", fontWeight: "600" }}>{t.no_products}</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>{t.no_products_sub}</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
          {filtered.map(product => (
            <div key={product.id} style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"}
            >
              <img src={product.image_url || "/placeholder.png"} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "contain", padding: "16px", backgroundColor: "#f9fafb", boxSizing: "border-box" }} />
              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: "11px", color: "#ea580c", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{product.category}</p>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "8px", lineHeight: "1.4" }}>{product.name}</h3>
                <p style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>{getPrice(product)}</p>
                <button onClick={() => addToCart(product)} style={{ width: "100%", backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  {t.add_to_cart}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <a href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "14px 20px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 999 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "22px", height: "22px" }} />
        {t.whatsapp}
      </a>
    </div>
  );
}