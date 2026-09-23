"use client";

import { useLanguage } from "./i18n/useLanguage";

const WHATSAPP_NUMBER = "917842280069";

const COUNTRIES = [
  { name: "Niger", code: "ne" },
  { name: "Nigeria", code: "ng" },
  { name: "Ghana", code: "gh" },
  { name: "Sénégal", code: "sn" },
  { name: "Mali", code: "ml" },
  { name: "Burkina Faso", code: "bf" },
  { name: "Côte d'Ivoire", code: "ci" },
  { name: "Cameroun", code: "cm" },
];

const TRENDING = [
  { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120&q=80", en: "Indian Fashion Dresses", fr: "Robes de Mode Indienne", sub: "Myntra • Meesho • Flipkart", price: "From ₹999",price_fr: "À partir de ₹999" },
  { img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=80", en: "Smartphones & Electronics", fr: "Smartphones et Électronique", sub: "Amazon India", price: "From ₹8,999", price_fr: "À partir de ₹8,999" },
  { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&q=80", en: "Beauty & Skincare", fr: "Beauté et Soins", sub: "Nykaa • Meesho", price: "From ₹299", price_fr: "À partir de ₹299" },
  { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&q=80", en: "Home & Kitchen", fr: "Maison et Cuisine", sub: "Amazon India • Flipkart", price: "From ₹499", price_fr: "À partir de ₹499"  },
];

const STEP_ICONS = [
  "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
  "https://cdn-icons-png.flaticon.com/512/597/597177.png",
  "https://cdn-icons-png.flaticon.com/512/684/684809.png",
  "https://cdn-icons-png.flaticon.com/512/2769/2769339.png",
];

const FLAG_WATERMARKS = [
  { top: "5%", left: "3%", code: "in", size: 80 },
  { top: "15%", right: "5%", code: "ne", size: 60 },
  { top: "35%", left: "1%", code: "ng", size: 60 },
  { top: "50%", right: "2%", code: "gh", size: 60 },
  { top: "65%", left: "4%", code: "sn", size: 55 },
  { top: "75%", right: "6%", code: "ml", size: 55 },
  { top: "85%", left: "8%", code: "bf", size: 50 },
  { top: "90%", right: "10%", code: "ci", size: 50 },
  { top: "25%", left: "45%", code: "cm", size: 45 },
];

export default function HomePage() {
  const { lang, switchLang, t } = useLanguage();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", fontFamily: "Inter, sans-serif", position: "relative" }}>

      {/* FLAG WATERMARKS */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {FLAG_WATERMARKS.map((flag, i) => (
          <img key={i} src={`https://flagcdn.com/w80/${flag.code}.png`} alt="" style={{ position: "absolute", top: flag.top, left: flag.left, right: flag.right, width: flag.size + "px", opacity: 0.06, borderRadius: "4px" }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* NAV */}
        <nav style={{ padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.95)", borderBottom: "1px solid #f3f4f6", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="https://flagcdn.com/w40/in.png" alt="India" style={{ width: "32px", borderRadius: "4px" }} />
            <div>
              <div style={{ fontWeight: "800", fontSize: "18px", color: "#111827" }}>{t.site_name}</div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>{t.tagline}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <a href="#how-it-works" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_how}</a>
            <a href="/products" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_products}</a>
            <a href="#shipping" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_shipping}</a>
            <a href="/track-order" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_track}</a>
            <a href="/login" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>{t.nav_login}</a>
            <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
              {["fr", "en"].map((l) => (
                <button key={l} onClick={() => switchLang(l)} style={{ padding: "6px 14px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151" }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "10px 24px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>{t.nav_shop}</a>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ backgroundColor: "rgba(255,247,237,0.95)", padding: "80px 40px 0 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", minHeight: "520px" }}>
          <div style={{ flex: 1, paddingTop: "40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#fed7aa", padding: "8px 16px", borderRadius: "50px", fontSize: "13px", color: "#c2410c", fontWeight: "600", marginBottom: "32px" }}>
              {t.badge}
            </div>
            <h1 style={{ fontSize: "56px", fontWeight: "900", color: "#111827", lineHeight: "1.1", marginBottom: "24px", maxWidth: "560px" }}>{t.hero_title}</h1>
            <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "480px", lineHeight: "1.6", marginBottom: "40px" }}>{t.hero_sub}</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
              <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "14px 32px", borderRadius: "50px", fontSize: "16px", fontWeight: "600", textDecoration: "none" }}>{t.btn_shop}</a>
              <a href="#how-it-works" style={{ backgroundColor: "white", color: "#374151", padding: "14px 32px", borderRadius: "50px", fontSize: "16px", fontWeight: "600", textDecoration: "none", border: "1px solid #d1d5db" }}>{t.btn_how}</a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "40px" }}>
              <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: "500" }}>{t.delivering_from}</span>
              <img src="https://flagcdn.com/w40/in.png" alt="India" style={{ width: "32px", borderRadius: "3px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
              <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: "500" }}>{t.to}</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {["ne", "ng", "gh", "sn", "ml", "bf"].map((code) => (
                  <img key={code} src={`https://flagcdn.com/w40/${code}.png`} alt={code} style={{ width: "28px", borderRadius: "3px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                ))}
                <span style={{ fontSize: "13px", color: "#9ca3af", alignSelf: "center", fontWeight: "500" }}>& more</span>
              </div>
            </div>
          </div>

          {/* TRENDING CARD */}
          <div style={{ width: "380px", backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginTop: "20px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontWeight: "700", fontSize: "16px", color: "#111827" }}>{t.trending}</span>
              <a href="/products" style={{ color: "#ea580c", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>{t.live}</a>
            </div>
            {TRENDING.map((item, i) => (
              <a href="/products" key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px", borderRadius: "12px", marginBottom: "4px", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div style={{ width: "56px", height: "56px", borderRadius: "12px", overflow: "hidden", flexShrink: 0 }}>
                  <img src={item.img} alt={item[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}>{item[lang]}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>{item.sub}</div>
                  <div style={{ fontSize: "13px", color: "#ea580c", fontWeight: "600", marginTop: "4px" }}>{lang === "fr" ? item.price_fr : item.price_en}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div id="how-it-works" style={{ padding: "80px 40px", maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", color: "#111827", marginBottom: "48px" }}>{t.how_title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", textAlign: "center" }}>
            {t.steps.map((step, i) => (
              <div key={i} style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "28px 20px", border: "1px solid #fed7aa" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <img src={STEP_ICONS[i]} alt={step.title} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                </div>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#ea580c", color: "white", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>{i + 1}</div>
                <h4 style={{ fontWeight: "700", fontSize: "15px", marginBottom: "8px", color: "#111827" }}>{step.title}</h4>
                <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.6" }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <a href="/how-it-works" style={{ backgroundColor: "#ea580c", color: "white", padding: "12px 32px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>{t.learn_more}</a>
          </div>
        </div>

        {/* SHIPPING */}
        <div id="shipping" style={{ backgroundColor: "rgba(249,250,251,0.95)", padding: "80px 40px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", marginBottom: "16px" }}>{t.ship_title}</h2>
            <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "40px" }}>{t.ship_sub}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
              {COUNTRIES.map((country, i) => (
                <div key={i} style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "50px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", color: "#374151", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <img src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.name} style={{ width: "24px", borderRadius: "3px" }} />
                  {country.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ backgroundColor: "#111827", color: "#9ca3af", textAlign: "center", padding: "40px", fontSize: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
            <img src="https://flagcdn.com/w40/in.png" alt="India" style={{ width: "24px", borderRadius: "3px" }} />
            <p style={{ fontWeight: "800", color: "white", fontSize: "18px" }}>{t.site_name}</p>
          </div>
          <p style={{ marginBottom: "16px" }}>{t.footer_copy}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
            <a href="/track-order" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>{t.nav_track}</a>
            <a href="/how-it-works" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>{t.nav_how}</a>
            <a href="/login" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>{t.nav_login}</a>
            <a href="/products" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>{t.nav_products}</a>
          </div>
        </div>

        {/* WHATSAPP */}
        <a href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "14px 20px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 999 }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "22px", height: "22px" }} />
          {t.whatsapp}
        </a>

      </div>
    </div>
  );
}