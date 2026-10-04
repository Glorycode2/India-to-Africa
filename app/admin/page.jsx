"use client";

import { useEffect, useState } from "react";

const TRANSLATIONS = {
  en: {
    site_name: "AfriBazaar",
    dashboard_title: "Admin Dashboard",
    dashboard_sub: "Order Management",
    back_to_site: "Back to website",
    total_orders: "Total Orders",
    pending: "Pending",
    shipped: "Shipped",
    revenue: "Total Revenue",
    all: "All",
    confirmed: "Confirmed",
    purchased: "Purchased",
    dispatched: "Dispatched",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
    delayed: "Delayed",
    loading: "Loading orders...",
    no_orders: "No orders yet",
    no_orders_sub: "Orders will appear here when customers place them",
    order_id: "Order ID",
    customer: "Customer",
    items: "Items",
    total: "Total",
    status: "Status",
    date: "Date",
    update_status: "Update Status",
    manage_products: "Manage Products",
    password_title: "Admin Access",
    password_sub: "Enter your password to continue",
    password_placeholder: "Enter password",
    login_btn: "Login",
  },
  fr: {
    site_name: "AfriBazaar",
    dashboard_title: "Tableau de bord",
    dashboard_sub: "Gestion des commandes",
    back_to_site: "Retour au site",
    total_orders: "Total commandes",
    pending: "En attente",
    shipped: "Expédiées",
    revenue: "Revenus totaux",
    all: "Toutes",
    confirmed: "Confirmées",
    purchased: "Achetées",
    dispatched: "Expédiées vendeur",
    in_transit: "En transit",
    delivered: "Livrées",
    cancelled: "Annulées",
    delayed: "Retardées",
    loading: "Chargement des commandes...",
    no_orders: "Aucune commande",
    no_orders_sub: "Les commandes apparaîtront ici quand les clients en passeront",
    order_id: "N° commande",
    customer: "Client",
    items: "Articles",
    total: "Total",
    status: "Statut",
    date: "Date",
    update_status: "Mettre à jour",
    manage_products: "Gérer les produits",
    password_title: "Accès Admin",
    password_sub: "Entrez votre mot de passe pour continuer",
    password_placeholder: "Mot de passe",
    login_btn: "Se connecter",
  },
};

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  confirmed: { bg: "#dbeafe", color: "#1e40af" },
  purchased: { bg: "#f3e8ff", color: "#6b21a8" },
  dispatched: { bg: "#ccfbf1", color: "#0f766e" },
  in_transit: { bg: "#ffedd5", color: "#9a3412" },
  shipped: { bg: "#fee2e2", color: "#991b1b" },
  delivered: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#f3f4f6", color: "#6b7280" },
  delayed: { bg: "#fef3c7", color: "#92400e" },
};

const ADMIN_PASSWORD = "admin123";

export default function AdminPage() {
  const [lang, setLang] = useState("fr");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadOrders();
    } else {
      alert(lang === "fr" ? "Mot de passe incorrect" : "Wrong password");
    }
  }

  async function loadOrders() {
    setLoading(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data } = await supabase
        .from("orders")
        .select(`*, users(name, email, phone), order_items(quantity, price_at_order_usd, products(name, image_url))`)
        .order("created_at", { ascending: false });
      if (data) setOrders(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function updateStatus(orderId, newStatus) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  }

  const STATUS_OPTIONS = ["pending", "confirmed", "purchased", "dispatched", "in_transit", "shipped", "delivered", "delayed", "cancelled"];
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    revenue: orders.reduce((sum, o) => sum + (o.total_charged_usd || 0), 0),
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "40px", width: "360px", border: "1px solid #e5e7eb", textAlign: "center" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="lock" style={{ width: "56px", marginBottom: "16px" }} />
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{t.password_title}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>{t.password_sub}</p>
          <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", marginBottom: "16px" }}>
            {["fr", "en"].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ flex: 1, padding: "6px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <input type="password" placeholder={t.password_placeholder} value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", color: "#111827", marginBottom: "16px", boxSizing: "border-box" }} />
          <button onClick={handleLogin}
            style={{ width: "100%", backgroundColor: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
            {t.login_btn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav className="ab-adminnav" style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{t.dashboard_title}</h1>
          <p style={{ fontSize: "12px", color: "#6b7280" }}>{t.site_name} {t.dashboard_sub}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            {["fr", "en"].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="/admin/products" style={{ fontSize: "13px", color: "white", textDecoration: "none", padding: "8px 16px", border: "none", borderRadius: "8px", backgroundColor: "#374151", fontWeight: "600" }}>{t.manage_products}</a>
          <a href="/" style={{ fontSize: "13px", color: "#ea580c", textDecoration: "none" }}>{t.back_to_site}</a>
        </div>
      </nav>

      <div className="ab-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        <div className="ab-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: t.total_orders, value: stats.total, bg: "white" },
            { label: t.revenue, value: "$" + stats.revenue.toFixed(0), bg: "#dcfce7" },
            ...STATUS_OPTIONS.map((s) => ({ label: t[s] || s, value: orders.filter((o) => o.status === s).length, bg: STATUS_COLORS[s]?.bg || "#f3f4f6" })),
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: stat.bg, borderRadius: "12px", border: "1px solid #e5e7eb", padding: "12px 14px" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>{stat.label}</p>
              <p style={{ fontSize: "22px", fontWeight: "700", color: "#111827" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["all", ...STATUS_OPTIONS].map(status => (
            <button key={status} onClick={() => setFilter(status)}
              style={{ padding: "6px 16px", borderRadius: "50px", fontSize: "13px", fontWeight: "500", cursor: "pointer", border: filter === status ? "none" : "1px solid #e5e7eb", backgroundColor: filter === status ? "#ea580c" : "white", color: filter === status ? "white" : "#374151" }}>
              {status === "all" ? t.all : (t[status] || status)}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>{t.loading}</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
            <p style={{ fontSize: "18px", fontWeight: "600" }}>{t.no_orders}</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>{t.no_orders_sub}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {[t.order_id, t.customer, t.items, t.total, t.status, t.date, t.update_status].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>{order.id.slice(0, 8)}...</td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{order.users?.name || "N/A"}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{order.users?.email}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{order.users?.phone}</p>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>{order.order_items?.length || 0}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>${order.total_charged_usd?.toFixed(2) || "0.00"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ backgroundColor: STATUS_COLORS[order.status]?.bg || "#f3f4f6", color: STATUS_COLORS[order.status]?.color || "#374151", padding: "4px 12px", borderRadius: "50px", fontSize: "12px", fontWeight: "600" }}>
                        {t[order.status] || order.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", color: "#374151", cursor: "pointer" }}>
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{t[s] || s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}