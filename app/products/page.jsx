"use client";

import ProductModal from "../components/ProductModal";
import WishlistHeart from "../components/WishlistHeart";
import { useEffect, useState } from "react";

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

const TRANSLATIONS = {
  en: {
    site_name: "AfriBazaar",
    search: "Search products...",
    cart_count: "Cart",
    products_title: "Our Products",
    products_sub: "Browse our full catalog of Indian products",
    no_products: "No products yet",
    no_products_sub: "Products will appear here once added",
    add_to_cart: "Add to cart",
    added_to_cart: "Added to cart!",
    category_all: "All Categories",
    loading: "Loading...",
    whatsapp: "Chat",
  },
  fr: {
    site_name: "AfriBazaar",
    search: "Rechercher des produits...",
    cart_count: "Panier",
    products_title: "Nos Produits",
    products_sub: "Parcourez notre catalogue complet de produits indiens",
    no_products: "Aucun produit pour l'instant",
    no_products_sub: "Les produits apparaîtront ici une fois ajoutés",
    add_to_cart: "Ajouter au panier",
    added_to_cart: "Ajouté au panier !",
    category_all: "Toutes les catégories",
    loading: "Chargement...",
    whatsapp: "Chatter",
  },
};

export default function ProductsPage() {
  const [lang, setLang] = useState("fr");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState([]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    loadProducts();
  }, []);

  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }

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

  function getCategoryLabel(cat) {
    if (lang === "fr") return CATEGORY_TRANSLATIONS[cat] || cat;
    return cat;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav className="ab-nav" style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
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

      <div className="ab-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
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

        {categories.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button onClick={() => setCategory("all")} style={{ padding: "6px 16px", borderRadius: "50px", border: category === "all" ? "none" : "1px solid #e5e7eb", cursor: "pointer", fontSize: "13px", fontWeight: "600", backgroundColor: category === "all" ? "#ea580c" : "white", color: category === "all" ? "white" : "#374151" }}>
              {t.category_all}
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ padding: "6px 16px", borderRadius: "50px", border: category === cat ? "none" : "1px solid #e5e7eb", cursor: "pointer", fontSize: "13px", fontWeight: "600", backgroundColor: category === cat ? "#ea580c" : "white", color: category === cat ? "white" : "#374151" }}>
                {getCategoryLabel(cat)}
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

        <div className="ab-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
          {filtered.map(product => (
            <div key={product.id} onClick={() => setSelected(product)}
              style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"}
            >
              <img src={product.image_url || "/placeholder.png"} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "contain", padding: "16px", backgroundColor: "#f9fafb", boxSizing: "border-box" }} />
              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: "11px", color: "#ea580c", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  {getCategoryLabel(product.category)}
                </p>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "8px", lineHeight: "1.4" }}>{product.name}</h3>
                <p style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>{getPrice(product)}</p>
                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={{ width: "100%", backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  {t.add_to_cart}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} lang={lang} price={getPrice(selected)} category={getCategoryLabel(selected.category)} addLabel={t.add_to_cart} onAdd={() => addToCart(selected)} />}
      <a className="ab-wa" href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "14px 20px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 999 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "22px", height: "22px" }} />
        {t.whatsapp}
      </a>
    </div>
  );
}