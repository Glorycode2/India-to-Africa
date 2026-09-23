"use client";

import { useState } from "react";

const TRANSLATIONS = {
  en: {
    tagline: "Cross-border shopping made simple",
    nav_products: "Products",
    nav_how: "How it works",
    nav_shipping: "Shipping",
    nav_track: "Track Order",
    nav_login: "Login",
    nav_shop: "Start Shopping",
    badge: "Fast delivery from India to Africa",
    hero_title: "Buy Indian products from anywhere in Africa",
    hero_sub: "We purchase products from Indian markets then deliver them to your doorstep. Simple, affordable and reliable.",
    btn_shop: "Start Shopping",
    btn_how: "How it works",
    trending: "Trending Products",
    live: "Live Catalog",
    how_title: "How it works",
    step1_title: "1. Browse & Order",
    step1_desc: "Browse products and place an order request. No payment needed upfront.",
    step2_title: "2. We Confirm",
    step2_desc: "We confirm availability and contact you within 24 hours with the total cost.",
    step3_title: "3. We Buy in India",
    step3_desc: "We purchase your items from Flipkart, Amazon India or Meesho.",
    step4_title: "4. We Ship to You",
    step4_desc: "Your package arrives at your door in 14 to 21 days.",
    ship_title: "We ship to your country",
    ship_sub: "Currently delivering to these African countries",
    footer_copy: "2026 AfricaBridge. All rights reserved. Based in India, delivering to Africa.",
    whatsapp: "Chat on WhatsApp",
  },
  fr: {
    tagline: "Shopping transfrontalier simplifié",
    nav_products: "Produits",
    nav_how: "Comment ça marche",
    nav_shipping: "Livraison",
    nav_track: "Suivre ma commande",
    nav_login: "Connexion",
    nav_shop: "Commencer",
    badge: "Livraison rapide de l'Inde vers l'Afrique",
    hero_title: "Achetez des produits indiens depuis n'importe où en Afrique",
    hero_sub: "Nous achetons des produits sur les marchés indiens puis les livrons à votre porte. Simple, abordable et fiable.",
    btn_shop: "Commencer",
    btn_how: "Comment ça marche",
    trending: "Produits Tendance",
    live: "Catalogue en direct",
    how_title: "Comment ça marche",
    step1_title: "1. Parcourir et commander",
    step1_desc: "Parcourez les produits et passez une demande de commande. Aucun paiement requis à l'avance.",
    step2_title: "2. Nous confirmons",
    step2_desc: "Nous confirmons la disponibilité et vous contactons sous 24 heures avec le coût total.",
    step3_title: "3. Nous achetons en Inde",
    step3_desc: "Nous achetons vos articles sur Flipkart, Amazon Inde ou Meesho.",
    step4_title: "4. Nous vous livrons",
    step4_desc: "Votre colis arrive à votre porte en 14 à 21 jours.",
    ship_title: "Nous livrons dans votre pays",
    ship_sub: "Actuellement en livraison dans ces pays africains",
    footer_copy: "2026 AfricaBridge. Tous droits réservés. Basé en Inde, livraison en Afrique.",
    whatsapp: "Chatter sur WhatsApp",
  },
};

const WHATSAPP_NUMBER = "917842280069"; // replace with your actual number

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", fontFamily: "Inter, sans-serif" }}>

      {/* NAV */}
      <nav style={{ padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderBottom: "1px solid #f3f4f6", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #ea580c, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🌍</div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "18px", color: "#111827" }}>AfricaBridge</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>{t.tagline}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <a href="#how-it-works" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_how}</a>
          <a href="/products" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_products}</a>
          <a href="#shipping" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_shipping}</a>
          <a href="/track-order" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_track}</a>
          <a href="/login" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_login}</a>

          {/* LANGUAGE TOGGLE */}
          <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            {["en", "fr"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151", textTransform: "uppercase" }}
              >
                {l === "en" ? "🇬🇧 EN" : "🇫🇷 FR"}
              </button>
            ))}
          </div>

          <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "10px 24px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>{t.nav_shop}</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ backgroundColor: "#fff7ed", padding: "80px 40px 0 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", minHeight: "500px" }}>
        <div style={{ flex: 1, paddingTop: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#fed7aa", padding: "8px 16px", borderRadius: "50px", fontSize: "13px", color: "#c2410c", fontWeight: "500", marginBottom: "32px" }}>
            ✈️ {t.badge}
          </div>
          <h1 style={{ fontSize: "56px", fontWeight: "900", color: "#111827", lineHeight: "1.1", marginBottom: "24px", maxWidth: "560px" }}>
            {t.hero_title}
          </h1>
          <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "480px", lineHeight: "1.6", marginBottom: "40px" }}>
            {t.hero_sub}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "14px 32px", borderRadius: "50px", fontSize: "16px", fontWeight: "600", textDecoration: "none" }}>{t.btn_shop}</a>
            <a href="#how-it-works" style={{ backgroundColor: "white", color: "#374151", padding: "14px 32px", borderRadius: "50px", fontSize: "16px", fontWeight: "600", textDecoration: "none", border: "1px solid #d1d5db" }}>{t.btn_how}</a>
          </div>

          {/* FLAGS */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "40px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Delivering from</span>
            <span style={{ fontSize: "24px" }}>🇮🇳</span>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>to</span>
            <div style={{ display: "flex", gap: "6px" }}>
              {["🇳🇪", "🇳🇬", "🇬🇭", "🇸🇳", "🇲🇱", "🇧🇫"].map((flag, i) => (
                <span key={i} style={{ fontSize: "22px" }}>{flag}</span>
              ))}
              <span style={{ fontSize: "13px", color: "#9ca3af", alignSelf: "center" }}>& more</span>
            </div>
          </div>
        </div>

        {/* TRENDING PRODUCTS CARD */}
        <div style={{ width: "380px", backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginTop: "20px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontWeight: "700", fontSize: "16px", color: "#111827" }}>{t.trending}</span>
            <a href="/products" style={{ color: "#ea580c", fontSize: "13px", fontWeight: "500", textDecoration: "none" }}>{t.live}</a>
          </div>

          {[
            { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120", name: lang === "fr" ? "Robes de Mode Indienne" : "Indian Fashion Dresses", sub: "Myntra • Meesho • Flipkart", price: "From ₹999" },
            { img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120", name: lang === "fr" ? "Smartphones et Électronique" : "Smartphones & Electronics", sub: "Amazon India", price: lang === "fr" ? "Derniers modèles" : "Latest models" },
            { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120", name: lang === "fr" ? "Beauté et Soins" : "Beauty & Skincare", sub: "Nykaa • Meesho", price: "From ₹299" },
            { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120", name: lang === "fr" ? "Maison et Cuisine" : "Home & Kitchen", sub: "Amazon India • Flipkart", price: lang === "fr" ? "Meilleures offres" : "Best deals" },
          ].map((item, i) => (
            <a href="/products" key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px", borderRadius: "12px", marginBottom: "4px", textDecoration: "none", transition: "background 0.2s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ width: "56px", height: "56px", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}>{item.name}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>{item.sub}</div>
                <div style={{ fontSize: "13px", color: "#ea580c", fontWeight: "600", marginTop: "4px" }}>{item.price}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ padding: "80px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", color: "#111827", marginBottom: "48px" }}>{t.how_title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", textAlign: "center" }}>
          {[
            { icon: "🛒", bg: "#dbeafe", title: t.step1_title, desc: t.step1_desc },
            { icon: "💬", bg: "#dcfce7", title: t.step2_title, desc: t.step2_desc },
            { icon: "🏪", bg: "#fef9c3", title: t.step3_title, desc: t.step3_desc },
            { icon: "📦", bg: "#fce7f3", title: t.step4_title, desc: t.step4_desc },
          ].map((step, i) => (
            <div key={i} style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "28px 20px" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: step.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", fontSize: "32px" }}>
                {step.icon}
              </div>
              <h4 style={{ fontWeight: "700", fontSize: "15px", marginBottom: "8px", color: "#111827" }}>{step.title}</h4>
              <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.6" }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/how-it-works" style={{ backgroundColor: "#ea580c", color: "white", padding: "12px 32px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
            {lang === "fr" ? "En savoir plus" : "Learn more"}
          </a>
        </div>
      </div>

      {/* SHIPPING */}
      <div id="shipping" style={{ backgroundColor: "#f9fafb", padding: "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", marginBottom: "16px" }}>{t.ship_title}</h2>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "40px" }}>{t.ship_sub}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {[
              { name: "Niger", flag: "🇳🇪" },
              { name: "Nigeria", flag: "🇳🇬" },
              { name: "Ghana", flag: "🇬🇭" },
              { name: "Senegal", flag: "🇸🇳" },
              { name: "Mali", flag: "🇲🇱" },
              { name: "Burkina Faso", flag: "🇧🇫" },
              { name: "Ivory Coast", flag: "🇨🇮" },
              { name: "Cameroon", flag: "🇨🇲" },
            ].map((country, i) => (
              <div key={i} style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "50px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", color: "#374151", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{country.flag}</span>
                {country.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ backgroundColor: "#111827", color: "#9ca3af", textAlign: "center", padding: "32px", fontSize: "14px" }}>
        <p style={{ fontWeight: "700", color: "white", fontSize: "16px", marginBottom: "8px" }}>AfricaBridge</p>
        <p>{t.footer_copy}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px" }}>
          <a href="/track-order" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>{t.nav_track}</a>
          <a href="/how-it-works" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>{t.nav_how}</a>
          <a href="/login" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>{t.nav_login}</a>
        </div>
      </div>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href={"https://wa.me/" + WHATSAPP_NUMBER}
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "14px 20px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 999 }}
      >
        <span style={{ fontSize: "20px" }}>💬</span>
        {t.whatsapp}
      </a>

    </div>
  );
}