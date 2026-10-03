"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "917842280069";

const TRANSLATIONS = {
  en: {
    site_name: "AfriBazaar",
    track_title: "Track Your Order",
    track_sub: "Enter your order ID or phone number to see your order status",
    order_id_label: "Order ID",
    order_id_placeholder: "e.g. 5B7784AC",
    or: "or",
    phone_used: "Phone number used at checkout",
    track_btn: "Track Order",
    tracking: "Searching...",
    no_order_found: "No order found",
    no_order_sub: "Please check your order ID or phone number and try again",
    current_status: "Current Status",
    order_progress: "Order Progress",
    order_details: "Order Details",
    order_id_display: "Order ID",
    date: "Date",
    customer: "Customer",
    phone_label: "Phone",
    delivery_to: "Delivery to",
    estimated: "Estimated delivery",
    items_ordered: "Items Ordered",
    total_paid: "Total",
    need_help: "Need help with your order?",
    contact_whatsapp: "Contact us on WhatsApp and quote your order ID",
    browse_products: "Browse Products",
    whatsapp: "Chat",
    status_pending: "Order Received",
    status_confirmed: "Order Confirmed",
    status_purchased: "Items Purchased",
    status_shipped: "Shipped",
    status_delivered: "Delivered",
    status_cancelled: "Cancelled",
    status_delayed: "Delayed",
    status_dispatched: "Dispatched",
    status_in_transit: "In Transit",
    qty: "Qty",
  },
  fr: {
    site_name: "AfriBazaar",
    track_title: "Suivre ma commande",
    track_sub: "Entrez votre numéro de commande ou votre téléphone pour voir le statut",
    order_id_label: "Numéro de commande",
    order_id_placeholder: "ex. 5B7784AC",
    or: "ou",
    phone_used: "Numéro de téléphone utilisé à la commande",
    track_btn: "Suivre",
    tracking: "Recherche en cours...",
    no_order_found: "Aucune commande trouvée",
    no_order_sub: "Veuillez vérifier votre numéro de commande ou téléphone et réessayer",
    current_status: "Statut actuel",
    order_progress: "Progression de la commande",
    order_details: "Détails de la commande",
    order_id_display: "Numéro de commande",
    date: "Date",
    customer: "Client",
    phone_label: "Téléphone",
    delivery_to: "Livraison vers",
    estimated: "Livraison estimée",
    items_ordered: "Articles commandés",
    total_paid: "Total",
    need_help: "Besoin d'aide pour votre commande ?",
    contact_whatsapp: "Contactez-nous sur WhatsApp avec votre numéro de commande",
    browse_products: "Parcourir les produits",
    whatsapp: "Chatter",
    status_pending: "Commande reçue",
    status_confirmed: "Commande confirmée",
    status_purchased: "Articles achetés",
    status_shipped: "Expédiée",
    status_delivered: "Livrée",
    status_cancelled: "Annulée",
    status_delayed: "Retardée",
    status_dispatched: "Expédiée par le vendeur",
    status_in_transit: "En transit",
    qty: "Qté",
  },
};

const STATUS_STEPS = ["pending", "confirmed", "purchased", "dispatched", "in_transit", "shipped", "delivered"];

const STATUS_INFO = {
  pending: { color: "#854d0e", bg: "#fef9c3" },
  confirmed: { color: "#1e40af", bg: "#dbeafe" },
  purchased: { color: "#6b21a8", bg: "#f3e8ff" },
  dispatched: { color: "#0f766e", bg: "#ccfbf1" },
  in_transit: { color: "#c2410c", bg: "#ffedd5" },
  shipped: { color: "#9a3412", bg: "#fee2e2" },
  delivered: { color: "#166534", bg: "#dcfce7" },
  cancelled: { color: "#991b1b", bg: "#fee2e2" },
  delayed: { color: "#92400e", bg: "#fef3c7" },
};

export default function TrackOrderPage() {
  const [lang, setLang] = useState("fr");
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }

  function getStatusLabel(status) {
    const key = "status_" + status;
    return t[key] || status;
  }

  async function handleSearch() {
    if (!orderId.trim() && !phone.trim()) {
      setError(lang === "fr" ? "Veuillez entrer votre numéro de commande ou téléphone" : "Please enter your order ID or phone number");
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
        .select(`*, users(name, email, phone, country), order_items(quantity, price_at_order_usd, products(name, image_url, category))`);

      if (orderId.trim()) {
        query = query.ilike("id", orderId.trim() + "%");
      } else {
        const { data: user } = await supabase.from("users").select("id").eq("phone", phone.trim()).maybeSingle();
        if (!user) {
          setError(lang === "fr" ? "Aucune commande trouvée avec ce numéro" : "No orders found with that phone number");
          setLoading(false);
          setSearched(true);
          return;
        }
        query = query.eq("user_id", user.id).order("created_at", { ascending: false }).limit(1);
      }

      const { data, error: queryError } = await query.maybeSingle();

      if (queryError || !data) {
        setError(lang === "fr" ? "Aucune commande trouvée. Vérifiez vos informations." : "No order found. Please check your details.");
        setSearched(true);
      } else {
        setOrder(data);
        setSearched(true);
      }
    } catch (e) {
      setError(lang === "fr" ? "Une erreur s'est produite. Réessayez." : "Something went wrong. Please try again.");
      setSearched(true);
    }

    setLoading(false);
  }

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          <a href="/products" style={{ color: "white", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>{t.browse_products}</a>
        </div>
      </nav>

      <div className="ab-container" style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "8px", textAlign: "center" }}>{t.track_title}</h1>
        <p style={{ fontSize: "15px", color: "#6b7280", textAlign: "center", marginBottom: "40px" }}>{t.track_sub}</p>

        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "28px", marginBottom: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.order_id_label}</label>
            <input type="text" value={orderId} onChange={e => { setOrderId(e.target.value); setPhone(""); setError(""); }}
              placeholder={t.order_id_placeholder}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>{t.or}</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.phone_used}</label>
            <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setOrderId(""); setError(""); }}
              placeholder="+227 xx xx xx xx"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
          </div>

          {error && (
            <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", fontWeight: "500" }}>
              {error}
            </div>
          )}

          <button onClick={handleSearch} disabled={loading}
            style={{ width: "100%", backgroundColor: loading ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? t.tracking : t.track_btn}
          </button>
        </div>

        {order && (
          <div>
            <div style={{ backgroundColor: STATUS_INFO[order.status]?.bg || "#f3f4f6", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>{t.current_status}</p>
              <p style={{ fontSize: "20px", fontWeight: "700", color: STATUS_INFO[order.status]?.color || "#374151", marginBottom: "8px" }}>
                {getStatusLabel(order.status)}
              </p>
              {order.tracking_number && (
                <div style={{ marginTop: "12px", backgroundColor: "white", borderRadius: "8px", padding: "10px 14px", display: "inline-block" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Tracking: </span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>{order.tracking_number}</span>
                </div>
              )}
            </div>

            {order.status !== "cancelled" && order.status !== "delayed" && (
              <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "20px" }}>{t.order_progress}</p>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
                  <div style={{ position: "absolute", top: "16px", left: "0", right: "0", height: "2px", backgroundColor: "#e5e7eb", zIndex: 0 }} />
                  <div style={{ position: "absolute", top: "16px", left: "0", height: "2px", backgroundColor: "#ea580c", zIndex: 1, width: currentStep >= 0 ? ((currentStep / (STATUS_STEPS.length - 1)) * 100) + "%" : "0%", transition: "width 0.5s ease" }} />
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2, flex: 1 }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: i <= currentStep ? "#ea580c" : "white", border: i <= currentStep ? "2px solid #ea580c" : "2px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                        {i < currentStep ? <span style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>✓</span> : i === currentStep ? <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "white" }} /> : null}
                      </div>
                      <p style={{ fontSize: "9px", color: i <= currentStep ? "#ea580c" : "#9ca3af", fontWeight: i === currentStep ? "700" : "400", textAlign: "center" }}>
                        {getStatusLabel(step)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>{t.order_details}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: t.order_id_display, value: "#" + order.id.slice(0, 8).toUpperCase() },
                  { label: t.date, value: new Date(order.created_at).toLocaleDateString() },
                  { label: t.customer, value: order.users?.name || "N/A" },
                  { label: t.phone_label, value: order.users?.phone || "N/A" },
                  { label: t.delivery_to, value: order.users?.country || "N/A" },
                  { label: t.estimated, value: order.delivery_estimate || "14-21 days" },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "2px" }}>{item.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {order.order_items && order.order_items.length > 0 && (
              <div style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>{t.items_ordered}</p>
                {order.order_items.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", marginBottom: "12px", borderBottom: i < order.order_items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <img src={item.products?.image_url || "/placeholder.png"} alt={item.products?.name} style={{ width: "48px", height: "48px", objectFit: "contain", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{item.products?.name}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{t.qty}: {item.quantity}</p>
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>${(item.price_at_order_usd * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                  <span>{t.total_paid}</span>
                  <span>${order.total_charged_usd?.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div style={{ backgroundColor: "#fff7ed", borderRadius: "12px", padding: "16px 20px", border: "1px solid #fed7aa" }}>
              <p style={{ fontSize: "13px", color: "#c2410c", fontWeight: "600", marginBottom: "4px" }}>{t.need_help}</p>
              <p style={{ fontSize: "13px", color: "#92400e" }}>{t.contact_whatsapp}: <strong>#{order.id.slice(0, 8).toUpperCase()}</strong></p>
            </div>
          </div>
        )}

        {searched && !order && !error && (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <p style={{ fontSize: "16px", fontWeight: "600" }}>{t.no_order_found}</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>{t.no_order_sub}</p>
          </div>
        )}
      </div>

      <a href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "24px", right: "24px", backgroundColor: "#25d366", color: "white", borderRadius: "50px", padding: "14px 20px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 16px rgba(37,211,102,0.4)", zIndex: 999 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: "22px", height: "22px" }} />
        {t.whatsapp}
      </a>
    </div>
  );
}