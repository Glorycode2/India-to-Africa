"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

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
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .limit(50);
      if (!error && data) setProducts(data);
    } catch (e) {
      console.error("Could not load products", e);
    }
    setLoading(false);
  }

  function getPrice(product) {
    if (currency === "USD") return "$" + (product.price_usd || 0);
    if (currency === "XOF") return "CFA " + (product.price_xof || 0);
    return "Rs " + (product.price_inr || 0);
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setMessage("Added to cart!");
    setTimeout(() => setMessage(""), 2000);
  }

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>

      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ color: "white", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>India to Africa</a>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/products" style={{ color: "white", textDecoration: "none", fontSize: "14px" }}>Products</a>
          <a href="/cart" style={{ color: "white", textDecoration: "none", fontSize: "14px" }}>
            Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </a>
        </div>
      </nav>

      {message && (
        <div style={{ backgroundColor: "#22c55e", color: "white", textAlign: "center", padding: "8px", fontSize: "14px" }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", color: "#111827", backgroundColor: "white" }}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", color: "#111827", backgroundColor: "white" }}
          >
            <option value="USD">USD $</option>
            <option value="XOF">CFA (XOF)</option>
            <option value="INR">INR Rs</option>
          </select>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>Loading products...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#6b7280" }}>
            <p style={{ fontSize: "18px", fontWeight: "500" }}>No products yet</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>Add products in your Supabase dashboard to see them here</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
          {filtered.map((product) => (
            <div key={product.id} style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                style={{ width: "100%", height: "180px", objectFit: "contain", padding: "16px", backgroundColor: "#f9fafb" }}
              />
              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: "12px", color: "#ea580c", fontWeight: "600", marginBottom: "4px" }}>{product.category}</p>
                <h3 style={{ fontSize: "14px", fontWeight: "500", color: "#1f2937", marginBottom: "8px" }}>{product.name}</h3>
                <p style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>{getPrice(product)}</p>
                <button
                  onClick={() => addToCart(product)}
                  style={{ width: "100%", backgroundColor: "#f97316", color: "white", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}