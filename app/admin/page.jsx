"use client";

import { useEffect, useState } from "react";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e" },
  confirmed: { bg: "#dbeafe", color: "#1e40af" },
  purchased: { bg: "#f3e8ff", color: "#6b21a8" },
  shipped: { bg: "#ffedd5", color: "#9a3412" },
  delivered: { bg: "#dcfce7", color: "#166534" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const ADMIN_PASSWORD = "admin123";

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadOrders();
    } else {
      alert("Wrong password");
    }
  }

  async function loadOrders() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data, error } = await supabase
        .from("orders")
        .select(`*, users(name, email, phone), order_items(quantity, price_at_order_usd, products(name, image_url))`)
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data);
    } catch (e) {
      console.error("Could not load orders", e);
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
      await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      loadOrders();
    } catch (e) {
      console.error("Could not update status", e);
    }
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    revenue: orders.reduce((sum, o) => sum + (o.total_charged_usd || 0), 0),
  };

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
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>Admin Dashboard</h1>
          <p style={{ fontSize: "12px", color: "#6b7280" }}>Order Management</p>
        </div>
        <a href="/" style={{ fontSize: "13px", color: "#ea580c", textDecoration: "none" }}>Back to website</a>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Orders", value: stats.total, bg: "white" },
            { label: "Pending", value: stats.pending, bg: "#fef9c3" },
            { label: "Shipped", value: stats.shipped, bg: "#dbeafe" },
            { label: "Total Revenue", value: "$" + stats.revenue.toFixed(0), bg: "#dcfce7" },
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: stat.bg, borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px 24px" }}>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>{stat.label}</p>
              <p style={{ fontSize: "28px", fontWeight: "700", color: "#111827" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* FILTER TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["all", "pending", "confirmed", "purchased", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{ padding: "6px 16px", borderRadius: "50px", fontSize: "13px", fontWeight: "500", cursor: "pointer", border: filter === status ? "none" : "1px solid #e5e7eb", backgroundColor: filter === status ? "#ea580c" : "white", color: filter === status ? "white" : "#374151", textTransform: "capitalize" }}
            >
              {status}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading orders...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
            <p style={{ fontSize: "18px", fontWeight: "600" }}>No orders yet</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>Orders will appear here when customers place them</p>
          </div>
        )}

        {/* ORDERS TABLE */}
        {filtered.length > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Update Status"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>
                      {order.id.slice(0, 8)}...
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{order.users?.name || "Unknown"}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{order.users?.email}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{order.users?.phone}</p>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>
                      {order.order_items?.length || 0} item(s)
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                      ${order.total_charged_usd?.toFixed(2) || "0.00"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ backgroundColor: STATUS_COLORS[order.status]?.bg || "#f3f4f6", color: STATUS_COLORS[order.status]?.color || "#374151", padding: "4px 12px", borderRadius: "50px", fontSize: "12px", fontWeight: "600" }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", color: "#374151", cursor: "pointer" }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="purchased">Purchased</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}