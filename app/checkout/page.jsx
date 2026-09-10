"use client";

import { useEffect, useState } from "react";

const SHIPPING = {
  "Niger": 22,
  "Nigeria": 19,
  "Ghana": 20,
  "Senegal": 24,
  "Mali": 25,
  "Burkina Faso": 26,
  "Ivory Coast": 24,
  "Cameroon": 25,
  "Other": 30,
};

const RATES = {
  USD: 1,
  CFA: 605,
  INR: 83,
};

const SYMBOLS = {
  USD: "$",
  CFA: "CFA ",
  INR: "₹",
};

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Niger",
    city: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function convert(usdAmount) {
    const rate = RATES[currency];
    const symbol = SYMBOLS[currency];
    const converted = usdAmount * rate;
    if (currency === "CFA") return symbol + Math.round(converted).toLocaleString();
    if (currency === "INR") return symbol + Math.round(converted).toLocaleString();
    return symbol + converted.toFixed(2);
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price_usd * item.quantity, 0);
  const shipping = SHIPPING[form.country] || 30;
  const service = parseFloat((subtotal * 0.1).toFixed(2));
  const total = subtotal + shipping + service;

  async function handleSubmit() {
    if (!form.name || !form.email || !form.address) {
      alert("Please fill in your name, email and address");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      let userId = null;
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", form.email)
        .single();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert([{
            name: form.name,
            email: form.email,
            phone: form.phone,
            country: form.country,
            address: form.city + ", " + form.country + " — " + form.address,
          }])
          .select("id")
          .single();

        if (userError) throw userError;
        userId = newUser.id;
      }

      const shippingAddress = form.name + "\n" + form.address + "\n" + form.city + ", " + form.country + "\nPhone: " + form.phone;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: userId,
          status: "pending",
          total_original_inr: cart.reduce((sum, item) => sum + (item.price_inr || 0) * item.quantity, 0),
          total_charged_usd: parseFloat(total.toFixed(2)),
          shipping_fee_usd: shipping,
          service_fee_usd: service,
          delivery_estimate: "14-21 days",
          shipping_address: shippingAddress,
          customer_notes: form.notes,
        }])
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_order_inr: item.price_inr || 0,
        price_at_order_usd: item.price_usd || 0,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      localStorage.removeItem("cart");
      setOrderId(order.id.slice(0, 8).toUpperCase());
      setDone(true);

    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong. Please try again.");
    }

    setSubmitting(false);
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "48px", textAlign: "center", maxWidth: "440px", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#ba1616", marginBottom: "8px" }}>Order Received!</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
            Thank you {form.name}. Your order reference is:
          </p>
          <div style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
            <p style={{ fontSize: "20px", fontWeight: "700", color: "#ea580c" }}>#{orderId}</p>
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
            We will contact you at <strong>{form.email}</strong> within 24 hours to confirm your order and arrange payment.
          </p>
          <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "12px 32px", borderRadius: "50px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ color: "white", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>India to Africa</a>
        <a href="/cart" style={{ color: "white", fontSize: "14px", textDecoration: "none" }}>Back to Cart</a>
      </nav>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "32px" }}>Complete Your Order</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>

          {/* LEFT - Form */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>Your Details</h2>

            {[
              { label: "Full name *", field: "name", type: "text" },
              { label: "Email address *", field: "email", type: "email" },
              { label: "Phone number", field: "phone", type: "tel" },
              { label: "City", field: "city", type: "text" },
            ].map(({ label, field, type }) => (
              <div key={field} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>{label}</label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>Country *</label>
              <select
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}
              >
                {Object.keys(SHIPPING).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>Full address *</label>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                rows={3}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>Special notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={2}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* RIGHT - Summary */}
          <div>
            <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>Order Summary</h2>

                {/* CURRENCY TOGGLE */}
                <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  {["USD", "CFA", "INR"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: currency === c ? "#ea580c" : "white",
                        color: currency === c ? "white" : "#374151",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "500", color: "#111827" }}>{item.name}</p>
                    <p style={{ fontSize: "12px", color: "#9ca3af" }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: "600" }}>{convert(item.price_usd * item.quantity)}</p>
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                {[
                  { label: "Subtotal", value: convert(subtotal) },
                  { label: "Shipping to " + form.country, value: convert(shipping) },
                  { label: "Service fee (10%)", value: convert(service) },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "700", color: "#111827", borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "8px" }}>
                  <span>Total</span>
                  <span>{convert(total)}</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#fff7ed", borderRadius: "8px", padding: "12px", marginTop: "16px" }}>
                <p style={{ fontSize: "13px", color: "#c2410c", fontWeight: "500" }}>
                  Estimated delivery to {form.country}: 14-21 days
                </p>
                <p style={{ fontSize: "12px", color: "#ea580c", marginTop: "4px" }}>
                  Payment collected after we confirm availability
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: "100%", backgroundColor: submitting ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "600", cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Placing order..." : "Place Order Request"}
            </button>
            <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "12px" }}>
              We will contact you within 24 hours to confirm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}