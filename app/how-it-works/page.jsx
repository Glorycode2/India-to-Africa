"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "917842280069";

const TRANSLATIONS = {
  en: {
    site_name: "AfriBazaar",
    whatsapp: "Chat on WhatsApp",
    page_title: "How It Works",
    page_sub: "Everything you need to know about ordering from India to Africa",

    section1_title: "The Simple Version",
    section1_sub: "In 4 steps",
    steps: [
      { title: "You browse and order", desc: "Visit our website, browse products from Indian markets. Add what you want to your cart and place an order request. No payment needed at this stage." },
      { title: "We confirm within 48 hours", desc: "After receiving your order, we contact you within 48 hours by phone or WhatsApp to confirm the products are available, give you the final price including shipping, and explain how to send payment." },
      { title: "You send payment", desc: "Once confirmed, you send the payment through one of our accepted methods — Mobile Money, Western Union, MoneyGram, or bank card. We only purchase your items after payment is received." },
      { title: "We buy and ship to you", desc: "We purchase your items from Indian platforms, pack them carefully, and ship them internationally. You receive a tracking number once dispatched." },
    ],

    section2_title: "Shipping — How We Do It",
    shipping_standard_title: "Standard Shipping (Group Delivery)",
    shipping_standard_desc: "To keep costs affordable for everyone, we use a group shipping method. This means we collect orders from multiple customers and ship them together in one package. This significantly reduces the cost per person. Your package travels from India to Africa, then gets sorted and delivered to your address.",
    shipping_standard_time: "Estimated time: 14 to 21 days from the date we purchase your items. May vary",
    shipping_express_title: "Express Shipping (DHL / FedEx)",
    shipping_express_desc: "If you need your items urgently, you can request express shipping through DHL or FedEx. Your package is shipped individually and arrives much faster. However, the cost is significantly higher as you pay the full courier rate alone.",
    shipping_express_time: "Estimated time: 5 to 10 days",
    shipping_note: "Express shipping must be requested at checkout. The cost will be communicated to you during order confirmation.",

    section3_title: "Delivery Options",
    delivery1_title: "Home Delivery",
    delivery1_desc: "A delivery person will bring your package to the address you provided at checkout. A delivery fee applies depending on your location.",
    delivery2_title: "Pickup Point",
    delivery2_desc: "You can choose to collect your package yourself from a designated pickup point in your city. This option is free of charge.",

    section4_title: "Payment Methods",
    payment_note: "All payments are made after we confirm your order. We never ask for payment before confirmation.",
    payment_methods: [
      { title: "Mobile Money (Niger)", desc: "Wave, MyNita, AmanaTa, Zamani Cash — send to our local agent in Niger who transfers funds to us in India." },
      { title: "Western Union / MoneyGram", desc: "International transfer directly to our name in India. Details provided after order confirmation." },
      { title: "Bank Card (Visa / Mastercard)", desc: "Transfer to our Visa card in India. A small processing fee may apply." },
    ],

    section5_title: "Cancellation Policy",
    cancel1_title: "Pending orders",
    cancel1_desc: "You can cancel a pending order at any time before we confirm it. No charges apply.",
    cancel2_title: "Confirmed orders",
    cancel2_desc: "You can still cancel a confirmed order as long as we have not yet purchased the items. Contact us immediately on WhatsApp.",
    cancel3_title: "Purchased orders",
    cancel3_desc: "Once we have purchased your items in India, cancellation is no longer possible as the items are already paid for.",

    section6_title: "Return Policy",
    return_desc: "Due to the nature of international shipping, we do not accept returns. Please make sure you are certain about your order before confirming. If a product arrives damaged, contact us with photos within 48 hours of receiving it and we will find a solution.",

    section7_title: "Frequently Asked Questions",
    faqs: [
      { q: "How long does delivery take?", a: "Standard group shipping takes 14 to 21 days but it may vary. Express shipping via DHL takes 5 to 10 days. These are estimates from the date we purchase your items." },
      { q: "How do I track my order?", a: "Once your package is shipped, go to our Track Order page and enter your order ID or phone number. You will see the real-time status of your delivery." },
      { q: "What if my product is out of stock?", a: "We always confirm availability before asking for payment. If a product is unavailable we will offer alternatives or a full refund." },
      { q: "Can I order multiple products at once?", a: "Yes. Add as many products as you want to your cart. They will all be grouped and shipped together, saving you on shipping costs." },
      { q: "Is it safe to order?", a: "Yes. We only ask for payment after confirming your order. We have been operating this service connecting Indian markets to African customers." },
      { q: "What countries do you ship to?", a: "We currently ship to Niger, Nigeria, Ghana, Senegal, Mali, Burkina Faso, Ivory Coast and Cameroon. More countries coming soon." },
      { q: "Can I change my delivery address after ordering?", a: "Yes, as long as the order has not been shipped yet. Contact us on WhatsApp as soon as possible with your order ID and new address." },
    ],

    browse_btn: "Browse Products",
    track_btn: "Track an Order",
    contact_btn: "Contact us on WhatsApp",
  },

  fr: {
    site_name: "AfriBazaar",
    whatsapp: "Chatter sur WhatsApp",
    page_title: "Comment ça marche",
    page_sub: "Tout ce que vous devez savoir pour commander de l'Inde vers l'Afrique",

    section1_title: "La Version Simple",
    section1_sub: "En 4 étapes",
    steps: [
      { title: "Vous parcourez et commandez", desc: "Visitez notre site, parcourez les produits des marchés indiens. Ajoutez ce que vous voulez à votre panier et passez une demande de commande. Aucun paiement requis à ce stade." },
      { title: "Nous confirmons sous 48 heures", desc: "Après réception de votre commande, nous vous contactons sous 48 heures par téléphone ou WhatsApp pour confirmer la disponibilité des produits, vous donner le prix final avec la livraison, et expliquer comment envoyer le paiement." },
      { title: "Vous envoyez le paiement", desc: "Une fois confirmé, vous envoyez le paiement via l'un de nos modes acceptés — Mobile Money, Western Union, MoneyGram ou carte bancaire. Nous n'achetons vos articles qu'après réception du paiement." },
      { title: "Nous achetons et vous livrons", desc: "Nous achetons vos articles sur les plateformes indiennes, les emballons soigneusement et les expédions à l'international. Vous recevez un numéro de suivi une fois expédié." },
    ],

    section2_title: "Livraison — Comment nous procédons",
    shipping_standard_title: "Livraison Standard (Groupée)",
    shipping_standard_desc: "Pour maintenir des coûts abordables pour tous, nous utilisons une méthode d'expédition groupée. Cela signifie que nous regroupons les commandes de plusieurs clients et les expédions ensemble dans un seul colis. Cela réduit considérablement le coût par personne. Votre colis voyage de l'Inde vers l'Afrique, puis est trié et livré à votre adresse.",
    shipping_standard_time: "Délai estimé : 14 à 21 jours à partir de la date d'achat de vos articles. Peut varier",
    shipping_express_title: "Livraison Express (DHL / FedEx)",
    shipping_express_desc: "Si vous avez besoin de vos articles rapidement, vous pouvez demander une livraison express via DHL ou FedEx. Votre colis est expédié individuellement et arrive beaucoup plus vite. Cependant, le coût est nettement plus élevé car vous payez le tarif courier complet seul.",
    shipping_express_time: "Délai estimé : 5 à 10 jours",
    shipping_note: "La livraison express doit être demandée lors de la commande. Le coût vous sera communiqué lors de la confirmation de commande.",

    section3_title: "Options de Livraison",
    delivery1_title: "Livraison à domicile",
    delivery1_desc: "Un livreur apportera votre colis à l'adresse que vous avez fournie lors de la commande. Des frais de livraison s'appliquent selon votre localisation.",
    delivery2_title: "Point de retrait",
    delivery2_desc: "Vous pouvez choisir de récupérer votre colis vous-même dans un point de retrait désigné dans votre ville. Cette option est gratuite.",

    section4_title: "Modes de Paiement",
    payment_note: "Tous les paiements sont effectués après confirmation de votre commande. Nous ne demandons jamais de paiement avant la confirmation.",
    payment_methods: [
      { title: "Mobile Money (Niger)", desc: "Wave, MyNita, AmanaTa, Zamani Cash — envoyez à notre agent local au Niger qui nous transfère les fonds en Inde." },
      { title: "Western Union / MoneyGram", desc: "Transfert international directement à notre nom en Inde. Détails fournis après confirmation de commande." },
      { title: "Carte bancaire (Visa / Mastercard)", desc: "Transfert sur notre carte Visa en Inde. Des frais de traitement mineurs peuvent s'appliquer." },
    ],

    section5_title: "Politique d'Annulation",
    cancel1_title: "Commandes en attente",
    cancel1_desc: "Vous pouvez annuler une commande en attente à tout moment avant que nous la confirmions. Aucun frais ne s'applique.",
    cancel2_title: "Commandes confirmées",
    cancel2_desc: "Vous pouvez encore annuler une commande confirmée tant que nous n'avons pas encore acheté les articles. Contactez-nous immédiatement sur WhatsApp.",
    cancel3_title: "Commandes achetées",
    cancel3_desc: "Une fois que nous avons acheté vos articles en Inde, l'annulation n'est plus possible car les articles sont déjà payés.",

    section6_title: "Politique de Retour",
    return_desc: "En raison de la nature des expéditions internationales, nous n'acceptons pas les retours. Assurez-vous d'être certain de votre commande avant de confirmer. Si un produit arrive endommagé, contactez-nous avec des photos dans les 48 heures suivant la réception et nous trouverons une solution.",

    section7_title: "Questions Fréquentes (FAQ)",
    faqs: [
      { q: "Combien de temps prend la livraison ?", a: "La livraison groupée standard prend 14 à 21 jours. La livraison express via DHL prend 5 à 10 jours. Ce sont des estimations à partir de la date d'achat de vos articles." },
      { q: "Comment suivre ma commande ?", a: "Une fois votre colis expédié, allez sur notre page Suivre ma commande et entrez votre numéro de commande ou votre téléphone. Vous verrez le statut en temps réel." },
      { q: "Et si mon produit est en rupture de stock ?", a: "Nous confirmons toujours la disponibilité avant de demander un paiement. Si un produit est indisponible, nous proposons des alternatives ou un remboursement complet." },
      { q: "Puis-je commander plusieurs produits à la fois ?", a: "Oui. Ajoutez autant de produits que vous voulez à votre panier. Ils seront tous regroupés et expédiés ensemble, ce qui réduit vos frais de livraison." },
      { q: "Est-ce sûr de commander ?", a: "Oui. Nous ne demandons le paiement qu'après avoir confirmé votre commande. Nous ne prenons jamais d'argent avant confirmation." },
      { q: "Dans quels pays livrez-vous ?", a: "Nous livrons actuellement au Niger, Nigeria, Ghana, Sénégal, Mali, Burkina Faso, Côte d'Ivoire et Cameroun. D'autres pays arrivent bientôt." },
      { q: "Puis-je changer mon adresse de livraison après avoir commandé ?", a: "Oui, tant que la commande n'a pas encore été expédiée. Contactez-nous sur WhatsApp dès que possible avec votre numéro de commande et votre nouvelle adresse." },
    ],

    browse_btn: "Parcourir les produits",
    track_btn: "Suivre une commande",
    contact_btn: "Nous contacter sur WhatsApp",
  },
};

export default function HowItWorksPage() {
  const [lang, setLang] = useState("fr");
  const [openFaq, setOpenFaq] = useState(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", fontFamily: "sans-serif" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
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
          <a href="/products" style={{ color: "white", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>{t.browse_btn}</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ backgroundColor: "#fff7ed", padding: "60px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "40px", fontWeight: "900", color: "#111827", marginBottom: "16px" }}>{t.page_title}</h1>
        <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>{t.page_sub}</p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px" }}>

        {/* SECTION 1 - 4 STEPS */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>{t.section1_title}</h2>
          <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "32px" }}>{t.section1_sub}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {t.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start", backgroundColor: "#f9fafb", borderRadius: "16px", padding: "24px", border: "1px solid #e5e7eb" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#ea580c", color: "white", fontSize: "18px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{step.title}</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.7" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2 - SHIPPING */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "32px" }}>{t.section2_title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ backgroundColor: "#fff7ed", borderRadius: "16px", padding: "24px", border: "1px solid #fed7aa" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <img src="https://cdn-icons-png.flaticon.com/512/2769/2769339.png" alt="standard" style={{ width: "32px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>{t.shipping_standard_title}</h3>
              </div>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.7", marginBottom: "12px" }}>{t.shipping_standard_desc}</p>
              <p style={{ fontSize: "13px", color: "#ea580c", fontWeight: "600", backgroundColor: "#fff", borderRadius: "8px", padding: "8px 12px" }}>{t.shipping_standard_time}</p>
            </div>
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "24px", border: "1px solid #bfdbfe" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <img src="https://cdn-icons-png.flaticon.com/512/870/870175.png" alt="express" style={{ width: "32px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827" }}>{t.shipping_express_title}</h3>
              </div>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.7", marginBottom: "12px" }}>{t.shipping_express_desc}</p>
              <p style={{ fontSize: "13px", color: "#1e40af", fontWeight: "600", backgroundColor: "#fff", borderRadius: "8px", padding: "8px 12px" }}>{t.shipping_express_time}</p>
            </div>
          </div>
          <div style={{ backgroundColor: "#f3f4f6", borderRadius: "10px", padding: "14px 18px", marginTop: "16px" }}>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>ℹ️ {t.shipping_note}</p>
          </div>
        </div>

        {/* SECTION 3 - DELIVERY OPTIONS */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "32px" }}>{t.section3_title}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {[
              { title: t.delivery1_title, desc: t.delivery1_desc, icon: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png" },
              { title: t.delivery2_title, desc: t.delivery2_desc, icon: "https://cdn-icons-png.flaticon.com/512/684/684809.png" },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: "#f9fafb", borderRadius: "16px", padding: "24px", border: "1px solid #e5e7eb" }}>
                <img src={item.icon} alt={item.title} style={{ width: "36px", marginBottom: "12px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.7" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 - PAYMENT */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>{t.section4_title}</h2>
          <div style={{ backgroundColor: "#dcfce7", borderRadius: "10px", padding: "12px 18px", marginBottom: "24px" }}>
            <p style={{ fontSize: "13px", color: "#166534", fontWeight: "500" }}>{t.payment_note}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {t.payment_methods.map((method, i) => (
              <div key={i} style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "20px 24px", border: "1px solid #e5e7eb" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>{method.title}</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>{method.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 - CANCELLATION */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "32px" }}>{t.section5_title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { title: t.cancel1_title, desc: t.cancel1_desc, color: "#dcfce7", textColor: "#166534" },
              { title: t.cancel2_title, desc: t.cancel2_desc, color: "#fef9c3", textColor: "#854d0e" },
              { title: t.cancel3_title, desc: t.cancel3_desc, color: "#fee2e2", textColor: "#991b1b" },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: item.color, borderRadius: "12px", padding: "20px 24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: item.textColor, marginBottom: "6px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6 - RETURN POLICY */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "16px" }}>{t.section6_title}</h2>
          <div style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.8" }}>{t.return_desc}</p>
          </div>
        </div>

        {/* SECTION 7 - FAQ */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "32px" }}>{t.section7_title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {t.faqs.map((faq, i) => (
              <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", textAlign: "left", padding: "18px 24px", backgroundColor: openFaq === i ? "#fff7ed" : "white", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#111827" }}>{faq.q}</span>
                  <span style={{ fontSize: "20px", color: "#ea580c", fontWeight: "700" }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 18px 24px", backgroundColor: "#fff7ed" }}>
                    <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.7" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
          <a href="/products" style={{ backgroundColor: "#ea580c", color: "white", padding: "14px 32px", borderRadius: "50px", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}>{t.browse_btn}</a>
          <a href="/track-order" style={{ backgroundColor: "white", color: "#374151", padding: "14px 32px", borderRadius: "50px", fontSize: "15px", fontWeight: "600", textDecoration: "none", border: "1px solid #d1d5db" }}>{t.track_btn}</a>
          <a href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#25d366", color: "white", padding: "14px 32px", borderRadius: "50px", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}>{t.contact_btn}</a>
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