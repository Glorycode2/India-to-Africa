"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/useLanguage";

const WHATSAPP_NUMBER = "917842280069";

const CATEGORY_TRANSLATIONS = {
  "Electronics": "Électronique",
  "Mobile Phones": "Téléphones Mobiles",
  "Clothing": "Vêtements",
  "Beauty": "Beauté",
  "Home & Kitchen": "Maison et Cuisine",
  "Sports": "Sports",
  "Books": "Livres",
  "Toys": "Jouets",
  "Other": "Autre",
};
export default function CartPage() {
  const { lang, switchLang, t } = useLanguage();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function removeItem(id) {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function increase(id) {
    const updated = cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function decrease(id) {
    const updated = cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce((sum, item) => sum + item.price_usd * item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <img src="/afribazaar-logo-white.svg" alt="AfriBazaar" style={{ height: "32px", display: "block" }} />
        </a>
        <div className="ab-navright" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", overflow: "hidden" }}>
            {["fr", "en"].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "white" : "transparent", color: lang === l ? "#ea580c" : "white" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="/products" style={{ color: "white", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>{t.back_to_products}</a>
        </div>
      </nav>

      <div className="ab-container" style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "32px" }}>{t.cart_title}</h1>

        {cart.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>{t.cart_empty}</p>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>{t.cart_empty_sub}</p>
            <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
              {t.browse_products}
            </a>
          </div>
        )}

        {cart.length > 0 && (
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "16px", marginBottom: "16px", display: "flex", gap: "16px", alignItems: "center" }}>
                <img src={item.image_url || "/placeholder.png"} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "contain", backgroundColor: "#f9fafb", borderRadius: "8px" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>{item.name}</p>
                  <p style={{ fontSize: "16px", fontWeight: "700", color: "#ea580c", marginBottom: "12px" }}>${item.price_usd}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => decrease(item.id)} style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#374151", color: "white", border: "none", fontSize: "18px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => increase(item.id)} style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#374151", color: "white", border: "none", fontSize: "18px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>${(item.price_usd * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} style={{ fontSize: "13px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: "500" }}>{t.remove}</button>
                </div>
              </div>
            ))}

            <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280", marginBottom: "10px" }}>
                <span>{t.products_total}</span>
                <span style={{ color: "#111827", fontWeight: "600" }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
                <span>{t.shipping}</span>
                <span style={{ color: "#111827", fontWeight: "600" }}>{t.calculated_checkout}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "700", color: "#111827", borderTop: "1px solid #e5e7eb", paddingTop: "16px", marginBottom: "20px" }}>
                <span>{t.total}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <a href="/checkout" style={{ display: "block", width: "100%", backgroundColor: "#ea580c", color: "white", textAlign: "center", padding: "14px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "15px", boxSizing: "border-box" }}>
                {t.place_order}
              </a>
              <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "12px" }}>{t.no_payment}</p>
            </div>
          </div>
        )}
      </div>

      <a className="ab-wa" href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "14px 20px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 999 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "22px", height: "22px" }} />
        {t.whatsapp}
      </a>
    </div>
  );
}