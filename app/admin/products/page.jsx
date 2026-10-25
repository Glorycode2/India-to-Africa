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
    images_text: "",
  source_url: "",
  source_platform: "Flipkart",
  category: "Electronics",
  weight_kg: "",
  in_stock: true,
};

const CATEGORIES = ["Electronics", "Mobile Phones", "Clothing", "Beauty", "Home & Kitchen", "Sports", "Books", "Toys", "Other"];
const PLATFORMS = ["Flipkart", "Amazon India", "Meesho", "Myntra", "Other"];
const ADMIN_EMAIL = "yayenasrine@gmail.com";

const TR = {
  en: {
    wrong_pw: "Wrong password", need_fields: "Please fill in name, INR price and USD price at minimum",
    updated: "Product updated successfully", added: "Product added successfully",
    no_perm: "Not saved: no permission, try logging out of the customer account",
    fail_save: "Failed to save product", confirm_del: "Are you sure you want to delete this product?",
    fail_del: "Failed to delete product", fail_stock: "Failed to update stock",
    admin_access: "Admin Access", pw_sub: "Enter your password to continue", pw_ph: "Enter password", login: "Login",
    title: "Product Management", sub: "Add, edit and manage your products", orders: "Orders",
    cancel: "Cancel", add_product: "+ Add Product", edit_product: "Edit Product", add_new_product: "Add New Product",
    l_name: "Product name *", l_desc: "Description", ph_desc: "Describe the product...",
    l_inr: "Original price (INR) *", l_your: "Your price (INR with markup)", l_usd: "Price in USD *", l_cfa: "Price in CFA (XOF)",
    l_img: "Image URL", l_more: "More photos (one image link per line)", l_src: "Source URL (Flipkart/Amazon link)",
    l_cat: "Category", ph_cat: "Type your own category (customers will see it as a tab)", l_plat: "Platform",
    l_weight: "Weight (kg)", l_stock: "In stock", saving: "Saving...", update_product: "Update Product", add_product_btn: "Add Product",
    all_products: "All Products", loading: "Loading products...", none: "No products yet", none_sub: "Click Add Product to get started",
    in_stock: "In Stock", out_stock: "Out of Stock", edit: "Edit", delete: "Delete",
  },
  fr: {
    wrong_pw: "Mot de passe incorrect", need_fields: "Veuillez remplir au minimum le nom, le prix en INR et le prix en USD",
    updated: "Produit mis \u00e0 jour avec succ\u00e8s", added: "Produit ajout\u00e9 avec succ\u00e8s",
    no_perm: "Non enregistr\u00e9 : autorisation refus\u00e9e, essayez de vous d\u00e9connecter du compte client",
    fail_save: "\u00c9chec de l\u2019enregistrement du produit", confirm_del: "Voulez-vous vraiment supprimer ce produit ?",
    fail_del: "\u00c9chec de la suppression du produit", fail_stock: "\u00c9chec de la mise \u00e0 jour du stock",
    admin_access: "Acc\u00e8s Admin", pw_sub: "Entrez votre mot de passe pour continuer", pw_ph: "Mot de passe", login: "Se connecter",
    title: "Gestion des produits", sub: "Ajoutez, modifiez et g\u00e9rez vos produits", orders: "Commandes",
    cancel: "Annuler", add_product: "+ Ajouter un produit", edit_product: "Modifier le produit", add_new_product: "Ajouter un nouveau produit",
    l_name: "Nom du produit *", l_desc: "Description", ph_desc: "D\u00e9crivez le produit...",
    l_inr: "Prix d\u2019origine (INR) *", l_your: "Votre prix (INR avec marge)", l_usd: "Prix en USD *", l_cfa: "Prix en CFA (XOF)",
    l_img: "Lien de l\u2019image", l_more: "Autres photos (un lien d\u2019image par ligne)", l_src: "Lien source (Flipkart/Amazon)",
    l_cat: "Cat\u00e9gorie", ph_cat: "Saisissez votre propre cat\u00e9gorie (les clients la verront comme un onglet)", l_plat: "Plateforme",
    l_weight: "Poids (kg)", l_stock: "En stock", saving: "Enregistrement...", update_product: "Mettre \u00e0 jour le produit", add_product_btn: "Ajouter le produit",
    all_products: "Tous les produits", loading: "Chargement des produits...", none: "Aucun produit", none_sub: "Cliquez sur Ajouter un produit pour commencer",
    in_stock: "En stock", out_stock: "Rupture de stock", edit: "Modifier", delete: "Supprimer",
  },
};
let LANG = "fr";
function tr(k) { return (TR[LANG] || TR.fr)[k]; }
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [lang, setLang] = useState("fr");
  LANG = lang;
  useEffect(() => { try { const sl = localStorage.getItem("lang"); if (sl === "en" || sl === "fr") setLang(sl); } catch (e) {} }, []);
  function switchLang(l) { setLang(l); try { localStorage.setItem("lang", l); } catch (e) {} }
  useEffect(() => {
    (async () => {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return;
      const { data: adm } = await sb.from("admins").select("user_id").maybeSingle();
      if (adm) { setLoggedIn(true); loadProducts(); }
    })();
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const { error } = await sb.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
      if (error) throw error;
      const { data: row } = await sb.from("admins").select("user_id").maybeSingle();
      if (!row) { await sb.auth.signOut(); throw new Error("not admin"); }
      setLoggedIn(true);
      loadProducts();
    } catch (e) {
      alert(tr("wrong_pw"));
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
      alert(tr("need_fields"));
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
        images: [form.image_url, ...(form.images_text || "").split(/\r?\n/)].map((s) => (s || "").trim()).filter(Boolean),
        source_url: form.source_url,
        source_platform: form.source_platform,
        category: (form.category || "").trim() || "Other",
        weight_kg: parseFloat(form.weight_kg) || 0.5,
        in_stock: form.in_stock,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        { const { data: saved, error: saveErr } = await supabase.from("products").update(payload).eq("id", editing).select(); if (saveErr) throw saveErr; if (!saved || saved.length === 0) throw new Error(tr("no_perm")); }
        setMessage(tr("updated"));
      } else {
        { const { error: saveErr } = await supabase.from("products").insert([payload]); if (saveErr) throw saveErr; }
        setMessage(tr("added"));
      }

      setForm(EMPTY_FORM);
      setEditing(null);
      setShowForm(false);
      loadProducts();
    } catch (e) {
      alert(tr("fail_save"));
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function deleteProduct(id) {
    if (!confirm(tr("confirm_del"))) return;
    try {
      const supabase = await getSupabase();
      await supabase.from("products").delete().eq("id", id);
      loadProducts();
    } catch (e) {
      alert(tr("fail_del"));
    }
  }

  async function toggleStock(id, current) {
    try {
      const supabase = await getSupabase();
      await supabase.from("products").update({ in_stock: !current }).eq("id", id);
      loadProducts();
    } catch (e) {
      alert(tr("fail_stock"));
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
      images_text: (product.images || []).filter((u) => u !== product.image_url).join("\n"),
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
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{tr("admin_access")}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>{tr("pw_sub")}</p>
          <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", marginBottom: "16px" }}>{["fr", "en"].map((l) => (<button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151" }}>{l.toUpperCase()}</button>))}</div>
          <input
            type="password"
            placeholder={tr("pw_ph")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", color: "#111827", marginBottom: "16px", boxSizing: "border-box" }}
          />
          <button
            onClick={handleLogin}
            style={{ width: "100%", backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            {tr("login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav className="ab-adminnav" style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{tr("title")}</h1>
          <p style={{ fontSize: "12px", color: "#6b7280" }}>{tr("sub")}</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}><div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>{["fr", "en"].map((l) => (<button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151" }}>{l.toUpperCase()}</button>))}</div>
          <a href="/admin" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none", padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>{tr("orders")}</a>
          <button
            onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY_FORM); }}
            style={{ backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "8px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            {showForm ? tr("cancel") : tr("add_product")}
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
              {editing ? tr("edit_product") : tr("add_new_product")}
            </h2>

            <div className="ab-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_name")}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Samsung Galaxy Buds"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_desc")}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  placeholder={tr("ph_desc")}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_inr")}</label>
                <input
                  type="number"
                  value={form.price_inr}
                  onChange={(e) => update("price_inr", e.target.value)}
                  placeholder="2999"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_your")}</label>
                <input
                  type="number"
                  value={form.your_price_inr}
                  onChange={(e) => update("your_price_inr", e.target.value)}
                  placeholder="3599"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_usd")}</label>
                <input
                  type="number"
                  value={form.price_usd}
                  onChange={(e) => update("price_usd", e.target.value)}
                  placeholder="36"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_cfa")}</label>
                <input
                  type="number"
                  value={form.price_xof}
                  onChange={(e) => update("price_xof", e.target.value)}
                  placeholder="21780"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_img")}</label>
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
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_more")}</label>
                <textarea
                  value={form.images_text || ""}
                  onChange={(e) => update("images_text", e.target.value)}
                  rows={4}
                  placeholder="https://..."
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", color: "#111827", backgroundColor: "white" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_src")}</label>
                <input
                  type="text"
                  value={form.source_url}
                  onChange={(e) => update("source_url", e.target.value)}
                  placeholder="https://www.flipkart.com/..."
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_cat")}</label>
                <select
                  value={CATEGORIES.includes(form.category) ? form.category : "Other"}
                  onChange={(e) => update("category", e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {form.category === "Other" || !CATEGORIES.includes(form.category) ? (
                  <input
                    type="text"
                    value={form.category === "Other" ? "" : form.category}
                    onChange={(e) => update("category", e.target.value.trimStart() || "Other")}
                    placeholder={tr("ph_cat")}
                    style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", backgroundColor: "white", marginTop: "8px", boxSizing: "border-box" }}
                  />
                ) : null}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_plat")}</label>
                <select
                  value={form.source_platform}
                  onChange={(e) => update("source_platform", e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}
                >
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{tr("l_weight")}</label>
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
                <label htmlFor="in_stock" style={{ fontSize: "14px", color: "#374151", fontWeight: "500", cursor: "pointer" }}>{tr("l_stock")}</label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={saveProduct}
                disabled={saving}
                style={{ backgroundColor: saving ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? tr("saving") : editing ? tr("update_product") : tr("add_product_btn")}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); }}
                style={{ backgroundColor: "white", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
              >
                {tr("cancel")}
              </button>
            </div>
          </div>
        )}

        {/* PRODUCTS LIST */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>{tr("all_products")} ({products.length})</h2>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>{tr("loading")}</div>
          )}

          {!loading && products.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
              <p style={{ fontSize: "16px", fontWeight: "600" }}>{tr("none")}</p>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>{tr("none_sub")}</p>
            </div>
          )}

          {products.map((product, i) => (
            <div key={product.id} className="ab-prow" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: i < products.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <img
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                style={{ width: "56px", height: "56px", objectFit: "contain", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{product.name}</p>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{product.category} • {product.source_platform}</p>
                <p style={{ fontSize: "13px", color: "#ea580c", fontWeight: "600", marginTop: "2px" }}>${product.price_usd} • CFA {Math.round(product.price_xof || product.price_usd * 605).toLocaleString()}{" \u2022 \u20B9" + (product.price_inr || 0)}</p>
              </div>

              <div className="ab-pbtns" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => toggleStock(product.id, product.in_stock)}
                  style={{ padding: "5px 12px", borderRadius: "50px", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer", backgroundColor: product.in_stock ? "#dcfce7" : "#fee2e2", color: product.in_stock ? "#166534" : "#991b1b" }}
                >
                  {product.in_stock ? tr("in_stock") : tr("out_stock")}
                </button>
                <button
                  onClick={() => startEdit(product)}
                  style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "white", fontSize: "13px", fontWeight: "500", color: "#374151", cursor: "pointer" }}
                >
                  {tr("edit")}
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  style={{ padding: "6px 14px", borderRadius: "8px", border: "none", backgroundColor: "#fee2e2", fontSize: "13px", fontWeight: "500", color: "#991b1b", cursor: "pointer" }}
                >
                  {tr("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}