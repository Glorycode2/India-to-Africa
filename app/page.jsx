"use client";
export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", fontFamily: "Inter, sans-serif" }}>

      {/* NAV */}
      <nav style={{ padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #ea580c, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🌍</div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "18px", color: "#111827" }}>AfricaBridge</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>Cross-border shopping made simple</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <a href="#how-it-works" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>How it works</a>
          <a href="/products" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Products</a>
          <a href="#shipping" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Shipping</a>
          <a href="/login" style={{ color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>Login</a>
          <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", color: "#374151" }}>🇬🇧 EN</div>
          <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "10px 24px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>Start Shopping</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ backgroundColor: "#fff7ed", padding: "80px 40px 0 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", minHeight: "500px" }}>

        {/* LEFT */}
        <div style={{ flex: 1, paddingTop: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#fed7aa", padding: "8px 16px", borderRadius: "50px", fontSize: "13px", color: "#c2410c", fontWeight: "500", marginBottom: "32px" }}>
             Fast delivery from India to Africa
          </div>
          <h1 style={{ fontSize: "64px", fontWeight: "900", color: "#111827", lineHeight: "1.1", marginBottom: "24px", maxWidth: "560px" }}>
            Buy Indian products from anywhere in Africa
          </h1>
          <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "480px", lineHeight: "1.6", marginBottom: "40px" }}>
            We purchase products from Indian markets then deliver them to your doorstep. Simple, affordable and reliable.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "14px 32px", borderRadius: "50px", fontSize: "16px", fontWeight: "600", textDecoration: "none" }}>Start Shopping</a>
            <a href="#how-it-works" style={{ backgroundColor: "white", color: "#374151", padding: "14px 32px", borderRadius: "50px", fontSize: "16px", fontWeight: "600", textDecoration: "none", border: "1px solid #d1d5db" }}>How it works</a>
          </div>
        </div>

        {/* RIGHT - Trending Products Card */}
        <div style={{ width: "380px", backgroundColor: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontWeight: "700", fontSize: "16px", color: "#111827" }}>Trending Products</span>
            <a href="/products" style={{ color: "#ea580c", fontSize: "13px", fontWeight: "500", textDecoration: "none" }}>Live Catalog</a>
          </div>

         {[
  { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120", name: "Indian Fashion Dresses", sub: "Myntra • Meesho • Nykaa Fashion", price: "From ₹999" },
  { img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120", name: "Smartphones & Electronics", sub: "Amazon India", price: "Latest models available" },
  { img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120", name: "Beauty & Skincare", sub: "Nykaa • Meesho", price: "From ₹299" },
  { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120", name: "Home & Kitchen", sub: "Amazon India • Flipkart", price: "Best deals available" },
].map((item, i) => (
  <a href="/products" key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px", borderRadius: "12px", marginBottom: "8px", textDecoration: "none" }}
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
        <h2 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", color: "#111827", marginBottom: "48px" }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", textAlign: "center" }}>
        {[
  { icon: "🛒", bg: "#dbeafe", title: "1. Browse & Order", desc: "Browse products and place an order request. No payment needed upfront." },
  { icon: "💬", bg: "#dcfce7", title: "2. We Confirm", desc: "We confirm availability and contact you within 24 hours with the total cost." },
  { icon: "🏪", bg: "#fef9c3", title: "3. We Buy in India", desc: "We purchase your items from Flipkart, Amazon India or Meesho." },
  { icon: "📦", bg: "#fce7f3", title: "4. We Ship to You", desc: "Your package arrives at your door in 14 to 21 days." },
].map((step, i) => (
  <div key={i} style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "28px 20px", textAlign: "center" }}>
    <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: step.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", fontSize: "32px" }}>
      {step.icon}
    </div>
    <h4 style={{ fontWeight: "700", fontSize: "15px", marginBottom: "8px", color: "#111827" }}>{step.title}</h4>
    <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.6" }}>{step.desc}</p>
  </div>
))}
        </div>
      </div>

      {/* SHIPPING */}
      <div id="shipping" style={{ backgroundColor: "#f9fafb", padding: "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", marginBottom: "16px" }}>We ship to your country</h2>
          <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "40px" }}>Currently delivering to these African countries</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {["🇳🇪 Niger", "🇳🇬 Nigeria", "🇬🇭 Ghana", "🇸🇳 Senegal", "🇲🇱 Mali", "🇧🇫 Burkina Faso", "🇨🇮 Ivory Coast", "🇨🇲 Cameroon"].map((country, i) => (
              <div key={i} style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "50px", padding: "10px 20px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                {country}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ backgroundColor: "#111827", color: "#9ca3af", textAlign: "center", padding: "32px", fontSize: "14px" }}>
        <p style={{ fontWeight: "700", color: "white", fontSize: "16px", marginBottom: "8px" }}>AfricaBridge</p>
        <p>2026 AfricaBridge. All rights reserved. Based in India, delivering to Africa.</p>
      </div>

    </div>
  );
}