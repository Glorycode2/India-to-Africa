"use client";

import { useState } from "react";

const STATUS_STEPS = ["pending", "confirmed", "purchased", "shipped", "delivered"];

const STATUS_INFO = {
  pending: {
    label: "Order Received",
    desc: "We have received your order and will confirm it within 24 hours.",
    color: "#854d0e",
    bg: "#fef9c3",
  },
  confirmed: {
    label: "Order Confirmed",
    desc: "We have confirmed your order and are preparing to purchase your items in India.",
    color: "#1e40af",
    bg: "#dbeafe",
  },
  purchased: {
    label: "Items Purchased",
    desc: "We have purchased your items and are preparing them for international shipping.",
    color: "#6b21a8",
    bg: "#f3e8ff",
  },
  shipped: {
    label: "Shipped",
    desc: "Your package is on its way. Expected delivery in 14-21 days from order date.",
    color: "#9a3412",
    bg: "#ffedd5",
  },
  delivered: {
    label: "Delivered",
    desc: "Your package has been delivered. Thank you for shopping with India to Africa!",
    color: "#166534",
    bg: "#dcfce7",
  },
  cancelled: {
    label: "Cancelled",
    desc: "This order has been cancelled. Please contact us if you have any questions.",
    color: "#991b1b",
    bg: "#fee2e2",
  },
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!orderId.trim() && !phone.trim()) {
      setError("Please enter your order ID or phone number");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(false);

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      let query = supabase
        .from("orders")
        .select(`
          *,
          users(name, email, phone, country),
          order_items(
            quantity,
            price_at_order_usd,
            products(name, image_url, category)
          )
        `);

      if (orderId.trim()) {
        query = query.ilike("id", orderId.trim() + "%");
      } else {
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("phone", phone.trim())
          .single();

        if (!user) {
          setError("No orders found with that phone number");
          setLoading(false);
          setSearched(true);
          return;
        }
        query = query.eq("user_id", user.id).order("created_at", { ascending: false }).limit(1);
      }

      const { data, error: queryError } = await query.single();

      if (queryError || !data) {
        setError("No order found. Please check your order ID or phone number.");
        setSearched(true);
      } else {
        setOrder(data);
        setSearched(true);
      }

    } catch (e) {
      setError("Something went wrong. Please try again.");
      setSearched(true);
    }

    setLoading(false);
  }

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ color: "white", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>India to Africa</a>
        <a href="/products" style={{ color: "white", fontSize: "14px", textDecoration: "none" }}>Browse Products</a>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "8px", textAlign: "center" }}>Track Your Order</h1>
        <p style={{ fontSize: "15px", color: "#6b7280", textAlign: "center", marginBottom: "40px" }}>
          Enter your order ID or phone number to see your order status
        </p>

        {/* SEARCH BOX */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "28px", marginBottom: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setPhone(""); setError(""); }}
              placeholder="e.g. 5B7784AC"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>
              Phone number used at checkout
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setOrderId(""); setError(""); }}
              placeholder="+227 xx xx xx xx"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", fontWeight: "500" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading}
            style={{ width: "100%", backgroundColor: loading ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </div>

        {/* ORDER RESULT */}
        {order && (
          <div>
            {/* STATUS BANNER */}
            <div style={{ backgroundColor: STATUS_INFO[order.status]?.bg || "#f3f4f6", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Current Status</p>
              <p style={{ fontSize: "20px", fontWeight: "700", color: STATUS_INFO[order.status]?.color || "#374151", marginBottom: "8px" }}>
                {STATUS_INFO[order.status]?.label || order.status}
              </p>
              <p style={{ fontSize: "14px", color: "#374151" }}>
                {STATUS_INFO[order.status]?.desc}
              </p>
              {order.tracking_number && (
                <div style={{ marginTop: "12px", backgroundColor: "white", borderRadius: "8px", padding: "10px 14px", display: "inline-block" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Tracking number: </span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>{order.tracking_number}</span>
                </div>
              )}
            </div>

            {/* PROGRESS BAR */}
            {order.status !== "cancelled" && (
              <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "20px" }}>Order Progress</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                  <div style={{ position: "absolute", top: "16px", left: "0", right: "0", height: "2px", backgroundColor: "#e5e7eb", zIndex: 0 }} />
                  <div style={{ position: "absolute", top: "16px", left: "0", height: "2px", backgroundColor: "#ea580c", zIndex: 1, width: currentStep >= 0 ? ((currentStep / (STATUS_STEPS.length - 1)) * 100) + "%" : "0%", transition: "width 0.5s ease" }} />
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: i <= currentStep ? "#ea580c" : "white", border: i <= currentStep ? "2px solid #ea580c" : "2px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                        {i < currentStep ? (
                          <span style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>✓</span>
                        ) : i === currentStep ? (
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "white" }} />
                        ) : null}
                      </div>
                      <p style={{ fontSize: "10px", color: i <= currentStep ? "#ea580c" : "#9ca3af", fontWeight: i === currentStep ? "700" : "400", textAlign: "center", maxWidth: "60px" }}>
                        {STATUS_INFO[step]?.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDER DETAILS */}
            <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>Order Details</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                {[
                  { label: "Order ID", value: "#" + order.id.slice(0, 8).toUpperCase() },
                  { label: "Date", value: new Date(order.created_at).toLocaleDateString() },
                  { label: "Customer", value: order.users?.name || "N/A" },
                  { label: "Phone", value: order.users?.phone || "N/A" },
                  { label: "Delivery to", value: order.users?.country || "N/A" },
                  { label: "Estimated delivery", value: order.delivery_estimate || "14-21 days" },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "2px" }}>{item.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER ITEMS */}
            {order.order_items && order.order_items.length > 0 && (
              <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>Items Ordered</p>
                {order.order_items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", marginBottom: "12px", borderBottom: i < order.order_items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <img
                      src={item.products?.image_url || "/placeholder.png"}
                      alt={item.products?.name}
                      style={{ width: "48px", height: "48px", objectFit: "contain", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{item.products?.name}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>${(item.price_at_order_usd * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "4px" }}>
                  {[
                    { label: "Products subtotal", value: "$" + order.total_charged_usd?.toFixed(2) },
                    { label: "Shipping fee", value: "$" + order.shipping_fee_usd?.toFixed(2) },
                    { label: "Service fee", value: "$" + order.service_fee_usd?.toFixed(2) },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
                      <span>{row.label}</span>
                      <span style={{ color: "#374151", fontWeight: "500" }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "700", color: "#111827", borderTop: "1px solid #e5e7eb", paddingTop: "10px", marginTop: "6px" }}>
                    <span>Total paid</span>
                    <span>${order.total_charged_usd?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ backgroundColor: "#fff7ed", borderRadius: "12px", padding: "16px 20px", border: "1px solid #fed7aa" }}>
              <p style={{ fontSize: "13px", color: "#c2410c", fontWeight: "600", marginBottom: "4px" }}>Need help with your order?</p>
              <p style={{ fontSize: "13px", color: "#92400e" }}>Contact us on WhatsApp or by phone and quote your order ID: <strong>#{order.id.slice(0, 8).toUpperCase()}</strong></p>
            </div>
          </div>
        )}

        {searched && !order && !error && (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <p style={{ fontSize: "16px", fontWeight: "600" }}>No order found</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>Please check your order ID or phone number and try again</p>
          </div>
        )}
      </div>
    </div>
  );
}