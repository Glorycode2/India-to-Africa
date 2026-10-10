"use client";
import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";

const L = {
  en: { how: "How it works", products: "Products", shipping: "Shipping", track: "Track order", wishlist: "Wishlist", login: "Login", shop: "Start shopping", logout: "Log out", cart: "Cart" },
  fr: { how: "Comment \u00e7a marche", products: "Produits", shipping: "Livraison", track: "Suivre ma commande", wishlist: "Favoris", login: "Connexion", shop: "Commencer", logout: "D\u00e9connexion", cart: "Panier" },
};

export default function Header({ lang, switchLang, variant, cartCount, hideCart }) {
  const l = L[lang] || L.fr;
  const orange = variant !== "light";
  const [stored, setStored] = useState(0);

  useEffect(() => {
    function read() {
      try {
        setStored(JSON.parse(localStorage.getItem("cart") || "[]").reduce((n, i) => n + (i.quantity || 1), 0));
      } catch (e) { setStored(0); }
    }
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  const count = typeof cartCount === "number" ? cartCount : stored;
  const links = [
    { href: "/how-it-works", label: l.how },
    { href: "/products", label: l.products },
    { href: "/#shipping", label: l.shipping },
    { href: "/track-order", label: l.track },
    { href: "/wishlist", label: l.wishlist },
    { href: "/cart", label: l.cart + " (" + count + ")" },
    { href: "/login", label: l.login },
  ];

  return (
    <header className="ab-hdr" style={{ backgroundColor: orange ? "#ea580c" : "rgba(255,255,255,0.95)", borderBottom: orange ? "none" : "1px solid #e5e7eb", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, fontFamily: "sans-serif" }}>
      <a href="/" style={{ display: "flex", alignItems: "center" }}>
        <img src={orange ? "/afribazaar-logo-white.svg" : "/afribazaar-logo-color.svg"} alt="AfriBazaar" style={{ height: orange ? "36px" : "46px", width: "auto", display: "block" }} />
      </a>
      <div className="ab-hdr-right" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ display: "flex", border: orange ? "1px solid rgba(255,255,255,0.4)" : "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
          {["fr", "en"].map((code) => (
            <button key={code} onClick={() => switchLang(code)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === code ? (orange ? "white" : "#ea580c") : (orange ? "transparent" : "white"), color: lang === code ? (orange ? "#ea580c" : "white") : (orange ? "white" : "#374151") }}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        {hideCart ? null : <a href="/cart" style={{ color: orange ? "white" : "#374151", fontSize: "14px", fontWeight: "600", textDecoration: "none", whiteSpace: "nowrap" }}>{l.cart} ({count})</a>}
        <MobileMenu iconColor={orange ? "white" : "#ea580c"} logoutLabel={l.logout} cta={l.shop} links={links} />
      </div>
    </header>
  );
}