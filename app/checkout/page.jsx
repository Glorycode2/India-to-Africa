"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "917842280069";

const SHIPPING = {
  "Niger": 22, "Nigeria": 19, "Ghana": 20, "Senegal": 24,
  "Mali": 25, "Burkina Faso": 26, "Ivory Coast": 24, "Cameroon": 25, "Other": 30,
};

const RATES = { USD: 1, CFA: 605, INR: 83 };
const SYMBOLS = { USD: "$", CFA: "CFA ", INR: "₹" };

const TRANSLATIONS = {
  en: {
    site_name: "AfriBazaar",
    checkout_title: "Complete Your Order",
    checkout_sub: "Fields marked with * are required",
    your_details: "Your Details",
    full_name: "Full name *",
    email: "Email address",
    email_optional: "(optional)",
    phone: "Phone number *",
    country: "Country *",
    city: "City *",
    address: "Full address *",
    notes: "Special notes",
    notes_optional: "(optional)",
    order_summary: "Order Summary",
    qty: "Qty",
    subtotal: "Subtotal",
    shipping_to: "Shipping to",
    service_fee: "Service fee (10%)",
    total: "Total",
    estimated_delivery: "Estimated delivery to",
    delivery_days: "14-21 days",
    payment_note: "Payment collected after we confirm availability",
    place_order: "Place Order Request",
    placing_order: "Placing order...",
    contact_phone: "We will contact you on your phone within 48 hours to confirm",
    back_to_cart: "Back to Cart",
    order_received: "Order Received!",
    order_ref: "Your order reference is",
    order_contact: "We will contact you at",
    order_contact_2: "within 48 hours to confirm your order and arrange payment.",
    continue_shopping: "Continue Shopping",
    name_required: "Full name is required",
    phone_required: "Phone number is required",
    city_required: "City is required",
    address_required: "Address is required",
    whatsapp: "Chat on WhatsApp",
  },
  fr: {
    site_name: "AfriBazaar",
    checkout_title: "Finaliser votre commande",
    checkout_sub: "Les champs marqués d'un * sont obligatoires",
    your_details: "Vos Informations",
    full_name: "Nom complet *",
    email: "Adresse email",
    email_optional: "(optionnel)",
    phone: "Numéro de téléphone *",
    country: "Pays *",
    city: "Ville *",
    address: "Adresse complète *",
    notes: "Notes spéciales",
    notes_optional: "(optionnel)",
    order_summary: "Récapitulatif de commande",
    qty: "Qté",
    subtotal: "Sous-total",
    shipping_to: "Livraison vers",
    service_fee: "Frais de service (10%)",
    total: "Total",
    estimated_delivery: "Livraison estimée vers",
    delivery_days: "14-21 jours",
    payment_note: "Paiement collecté après confirmation de disponibilité",
    place_order: "Passer la commande",
    placing_order: "Commande en cours...",
    contact_phone: "Nous vous contacterons par téléphone sous 48 heures pour confirmer",
    back_to_cart: "Retour au panier",
    order_received: "Commande reçue !",
    order_ref: "Votre référence de commande est",
    order_contact: "Nous vous contacterons au",
    order_contact_2: "sous 48 heures pour confirmer votre commande et organiser le paiement.",
    continue_shopping: "Continuer les achats",
    name_required: "Le nom complet est obligatoire",
    phone_required: "Le numéro de téléphone est obligatoire",
    city_required: "La ville est obligatoire",
    address_required: "L'adresse est obligatoire",
    whatsapp: "Chatter sur WhatsApp",
  },
};

export default function CheckoutPage() {
  const [lang, setLang] = useState("fr");
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "Niger",
    city: "", address: "", notes: "",
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
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

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t.name_required;
    if (!form.phone.trim()) newErrors.phone = t.phone_required;
    if (!form.city.trim()) newErrors.city = t.city_required;
    if (!form.address.trim()) newErrors.address = t.address_required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    if (cart.length === 0) {
      alert(lang === "fr" ? "Votre panier est vide" : "Your cart is empty");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // Step 1: find or create user
      let userId = null;
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("phone", form.phone)
        .maybeSingle();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert([{
            name: form.name,
            email: form.email || null,
            phone: form.phone,
            country: form.country,
            address: form.city + ", " + form.country + " — " + form.address,
          }])
          .select("id")
          .single();

        if (userError) {
          setErrorMsg("User error: " + userError.message);
          setSubmitting(false);
          return;
        }
        userId = newUser.id;
      }

      // Step 2: create order
      const shippingAddress = form.name + "\n" + form.address + "\n" + form.city + ", " + form.country + "\nPhone: " + form.phone + (form.email ? "\nEmail: " + form.email : "");

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

      if (orderError) {
        setErrorMsg("Order error: " + orderError.message);
        setSubmitting(false);
        return;
      }

      // Step 3: save order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(cart.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price_at_order_inr: item.price_inr || 0,
          price_at_order_usd: item.price_usd || 0,
        })));

      if (itemsError) {
        setErrorMsg("Items error: " + itemsError.message);
        setSubmitting(false);
        return;
      }

      localStorage.removeItem("cart");
      setOrderId(order.id.slice(0, 8).toUpperCase());
      setDone(true);

    } catch (err) {
      setErrorMsg("Unexpected error: " + (err.message || JSON.stringify(err)));
    }

    setSubmitting(false);
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "48px", textAlign: "center", maxWidth: "440px", border: "1px solid #e5e7eb" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="success" style={{ width: "64px", marginBottom: "16px" }} />
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{t.order_received}</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>{t.order_ref}:</p>
          <div style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
            <p style={{ fontSize: "20px", fontWeight: "700", color: "#ea580c" }}>#{orderId}</p>
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
            {t.order_contact} <strong>{form.phone}</strong> {t.order_contact_2}
          </p>
          <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "12px 32px", borderRadius: "50px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
            {t.continue_shopping}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                   <img src="/afribazaar-logo-white.svg" alt="AfriBazaar" style={{ height: "32px", display: "block" }} />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", overflow: "hidden" }}>
            {["fr", "en"].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "white" : "transparent", color: lang === l ? "#ea580c" : "white" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="/cart" style={{ color: "white", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>{t.back_to_cart}</a>
        </div>
      </nav>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{t.checkout_title}</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "32px" }}>{t.checkout_sub}</p>

        {errorMsg && (
          <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "24px", fontWeight: "500" }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>{t.your_details}</h2>

            {[
              { label: t.full_name, field: "name", type: "text" },
              { label: t.phone, field: "phone", type: "tel" },
              { label: t.city, field: "city", type: "text" },
            ].map(({ label, field, type }) => (
              <div key={field} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{label}</label>
                <input type={type} value={form[field]} onChange={e => update(field, e.target.value)}
                  style={{ width: "100%", border: errors[field] ? "1px solid #ef4444" : "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
                {errors[field] && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors[field]}</p>}
              </div>
            ))}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>
                {t.email} <span style={{ color: "#9ca3af" }}>{t.email_optional}</span>
              </label>
              <input type="email" value={form.email} onChange={e => update("email", e.target.value)}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.country}</label>
              <select value={form.country} onChange={e => update("country", e.target.value)}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}>
                {Object.keys(SHIPPING).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.address}</label>
              <textarea value={form.address} onChange={e => update("address", e.target.value)} rows={3}
                style={{ width: "100%", border: errors.address ? "1px solid #ef4444" : "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
              {errors.address && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors.address}</p>}
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>
                {t.notes} <span style={{ color: "#9ca3af" }}>{t.notes_optional}</span>
              </label>
              <textarea value={form.notes} onChange={e => update("notes", e.target.value)} rows={2}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>{t.order_summary}</h2>
                <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                  {["USD", "CFA", "INR"].map(c => (
                    <button key={c} onClick={() => setCurrency(c)} style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", border: "none", cursor: "pointer", backgroundColor: currency === c ? "#ea580c" : "white", color: currency === c ? "white" : "#374151" }}>{c}</button>
                  ))}
                </div>
              </div>

              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{item.name}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{t.qty}: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>{convert(item.price_usd * item.quantity)}</p>
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                {[
                  { label: t.subtotal, value: convert(subtotal) },
                  { label: t.shipping_to + " " + form.country, value: convert(shipping) },
                  { label: t.service_fee, value: convert(service) },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                    <span>{row.label}</span>
                    <span style={{ color: "#374151", fontWeight: "500" }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: "700", color: "#111827", borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "8px" }}>
                  <span>{t.total}</span>
                  <span>{convert(total)}</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#fff7ed", borderRadius: "8px", padding: "12px", marginTop: "16px" }}>
                <p style={{ fontSize: "13px", color: "#c2410c", fontWeight: "500" }}>{t.estimated_delivery} {form.country}: {t.delivery_days}</p>
                <p style={{ fontSize: "12px", color: "#ea580c", marginTop: "4px" }}>{t.payment_note}</p>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: "100%", backgroundColor: submitting ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "600", cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? t.placing_order : t.place_order}
            </button>
            <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "12px" }}>{t.contact_phone}</p>
          </div>
        </div>
      </div>

      <a href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "14px 20px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 999 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "22px", height: "22px" }} />
        {t.whatsapp}
      </a>
    </div>
  );
}