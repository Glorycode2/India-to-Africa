"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  price_inr: "",
  price_usd: "",
  price_xof: "",
  your_price_inr: "",
  image_url: "",
  source_url: "",
  source_platform: "Flipkart",
  category: "Electronics",
  weight_kg: "",
  in_stock: true,
};

const CATEGORIES = ["Electronics", "Mobile Phones", "Clothing", "Beauty", "Home & Kitchen", "Sports", "Books", "Toys", "Other"];
const PLATFORMS = ["Flipkart", "Amazon India", "Meesho", "Myntra", "Other"];
const ADMIN_PASSWORD = "admin123";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadProducts();
    } else {
      alert("Wrong password");
    }
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function getSupabase() {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function saveProduct() {
    if (!form.name || !form.price_inr || !form.price_usd) {
      alert("Please fill in name, INR price and USD price at minimum");
      return;
    }

    setSaving(true);
    try {
      const supabase = await getSupabase();
      const payload = {
        name: form.name,
        description: form.description,
        price_inr: parseFloat(form.price_inr),
        price_usd: parseFloat(form.price_usd),
        price_xof: parseFloat(form.price_xof) || parseFloat(form.price_usd) * 605,
        your_price_inr: parseFloat(form.your_price_inr) || parseFloat(form.price_inr),
        image_url: form.image_url,
        source_url: form.source_url,
        source_platform: form.source_platform,
        category: form.category,
        weight_kg: parseFloat(form.weight_kg) || 0.5,
        in_stock: form.in_stock,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        await supabase.from("products").update(payload).eq("id", editing);
        setMessage("Product updated successfully");
      } else {
        await supabase.from("products").insert([payload]);
        setMessage("Product added successfully");
      }

      setForm(EMPTY_FORM);
      setEditing(null);
      setShowForm(false);
      loadProducts();
    } catch (e) {
      alert("Failed to save product");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const supabase = await getSupabase();
      await supabase.from("products").delete().eq("id", id);
      loadProducts();
    } catch (e) {
      alert("Failed to delete product");
    }
  }

  async function toggleStock(id, current) {
    try {
      const supabase = await getSupabase();
      await supabase.from("products").update({ in_stock: !current }).eq("id", id);
      loadProducts();
    } catch (e) {
      alert("Failed to update stock");
    }
  }

  function startEdit(product) {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price_inr: product.price_inr || "",
      price_usd: product.price_usd || "",
      price_xof: product.price_xof || "",
      your_price_inr: product.your_price_inr || "",
      image_url: product.image_url || "",
      source_url: product.source_url || "",
      source_platform: product.source_platform || "Flipkart",
      category: product.category || "Electronics",
      weight_kg: product.weight_kg || "",
      in_stock: product.in_stock,
    });
    setEditing(product.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  }

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "40px", width: "360px", border: "1px solid #e5e7eb", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔒</div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>Admin Access</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>Enter your password to continue</p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", color: "#111827", marginBottom: "16px", boxSizing: "border-box" }}
          />
          <button
            onClick={handleLogin}
            style={{ width: "100%", backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>Product Management</h1>
          <p style={{ fontSize: "12px", color: "#6b7280" }}>Add, edit and manage your products</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <a href="/admin" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none", padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>Orders</a>
          <button
            onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY_FORM); }}
            style={{ backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {message && (
          <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", marginBottom: "24px" }}>
            {message}
          </div>
        )}

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "28px", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "24px" }}>
              {editing ? "Edit Product" : "Add New Product"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Product name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Samsung Galaxy Buds"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  placeholder="Describe the product..."
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Original price (INR) *</label>
                <input
                  type="number"
                  value={form.price_inr}
                  onChange={(e) => update("price_inr", e.target.value)}
                  placeholder="2999"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Your price (INR with markup)</label>
                <input
                  type="number"
                  value={form.your_price_inr}
                  onChange={(e) => update("your_price_inr", e.target.value)}
                  placeholder="3599"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Price in USD *</label>
                <input
                  type="number"
                  value={form.price_usd}
                  onChange={(e) => update("price_usd", e.target.value)}
                  placeholder="36"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Price in CFA (XOF)</label>
                <input
                  type="number"
                  value={form.price_xof}
                  onChange={(e) => update("price_xof", e.target.value)}
                  placeholder="21780"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Image URL</label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => update("image_url", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
                {form.image_url && (
                  <img src={form.image_url} alt="preview" style={{ width: "80px", height: "80px", objectFit: "contain", marginTop: "8px", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                )}
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Source URL (Flipkart/Amazon link)</label>
                <input
                  type="text"
                  value={form.source_url}
                  onChange={(e) => update("source_url", e.target.value)}
                  placeholder="https://www.flipkart.com/..."
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Platform</label>
                <select
                  value={form.source_platform}
                  onChange={(e) => update("source_platform", e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}
                >
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Weight (kg)</label>
                <input
                  type="number"
                  value={form.weight_kg}
                  onChange={(e) => update("weight_kg", e.target.value)}
                  placeholder="0.5"
                  step="0.1"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "24px" }}>
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) => update("in_stock", e.target.checked)}
                  id="in_stock"
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="in_stock" style={{ fontSize: "14px", color: "#374151", fontWeight: "500", cursor: "pointer" }}>In stock</label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={saveProduct}
                disabled={saving}
                style={{ backgroundColor: saving ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Saving..." : editing ? "Update Product" : "Add Product"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); }}
                style={{ backgroundColor: "white", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* PRODUCTS LIST */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>All Products ({products.length})</h2>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading products...</div>
          )}

          {!loading && products.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
              <p style={{ fontSize: "16px", fontWeight: "600" }}>No products yet</p>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>Click Add Product to get started</p>
            </div>
          )}

          {products.map((product, i) => (
            <div key={product.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: i < products.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                style={{ width: "56px", height: "56px", objectFit: "contain", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{product.name}</p>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{product.category} • {product.source_platform}</p>
                <p style={{ fontSize: "13px", color: "#ea580c", fontWeight: "600", marginTop: "2px" }}>${product.price_usd} • CFA {Math.round(product.price_xof || product.price_usd * 605).toLocaleString()}</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => toggleStock(product.id, product.in_stock)}
                  style={{ padding: "5px 12px", borderRadius: "50px", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer", backgroundColor: product.in_stock ? "#dcfce7" : "#fee2e2", color: product.in_stock ? "#166534" : "#991b1b" }}
                >
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </button>
                <button
                  onClick={() => startEdit(product)}
                  style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "white", fontSize: "13px", fontWeight: "500", color: "#374151", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  style={{ padding: "6px 14px", borderRadius: "8px", border: "none", backgroundColor: "#fee2e2", fontSize: "13px", fontWeight: "500", color: "#991b1b", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}