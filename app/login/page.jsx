"use client";

import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "917842280069";

const TRANSLATIONS = {
  en: {
    site_name: "AfricaBridge",
    login_title: "Welcome back",
    login_sub: "Log in to track your orders",
    signup_title: "Create account",
    signup_sub: "Sign up to start shopping",
    log_in: "Log In",
    sign_up: "Sign Up",
    email_label: "Email address",
    password_label: "Password",
    password_placeholder: "minimum 6 characters",
    name_label: "Full name",
    name_placeholder: "Amina Diallo",
    phone_label: "Phone number",
    country_label: "Country",
    login_btn: "Log In",
    signup_btn: "Create Account",
    loading_btn: "Please wait...",
    skip_nav: "Skip for now",
    skip_btn: "Skip and browse as guest",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    sign_up_link: "Sign up",
    log_in_link: "Log in",
    whatsapp: "Chat on WhatsApp",
    success_msg: "Account created! You can now log in.",
  },
  fr: {
    site_name: "AfricaBridge",
    login_title: "Bon retour",
    login_sub: "Connectez-vous pour suivre vos commandes",
    signup_title: "Créer un compte",
    signup_sub: "Inscrivez-vous pour commencer vos achats",
    log_in: "Se connecter",
    sign_up: "S'inscrire",
    email_label: "Adresse email",
    password_label: "Mot de passe",
    password_placeholder: "minimum 6 caractères",
    name_label: "Nom complet",
    name_placeholder: "Amina Diallo",
    phone_label: "Numéro de téléphone",
    country_label: "Pays",
    login_btn: "Se connecter",
    signup_btn: "Créer un compte",
    loading_btn: "Veuillez patienter...",
    skip_nav: "Passer pour l'instant",
    skip_btn: "Continuer en tant qu'invité",
    no_account: "Pas encore de compte ?",
    have_account: "Déjà un compte ?",
    sign_up_link: "S'inscrire",
    log_in_link: "Se connecter",
    whatsapp: "Chatter sur WhatsApp",
    success_msg: "Compte créé ! Vous pouvez maintenant vous connecter.",
  },
};

const COUNTRIES = ["Niger", "Nigeria", "Ghana", "Senegal", "Mali", "Burkina Faso", "Ivory Coast", "Cameroon", "Other"];

export default function LoginPage() {
  const [lang, setLang] = useState("fr");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "Niger", password: "",
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  function switchLang(l) {
    setLang(l);
    localStorage.setItem("lang", l);
  }

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSkip() {
    localStorage.setItem("skipped_login", "true");
    window.location.href = "/products";
  }

  async function handleSubmit() {
    if (!form.email || !form.password) {
      setMessage(lang === "fr" ? "Veuillez remplir votre email et mot de passe" : "Please fill in your email and password");
      setMessageType("error");
      return;
    }
    if (mode === "signup" && !form.name) {
      setMessage(lang === "fr" ? "Veuillez entrer votre nom" : "Please enter your name");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { name: form.name, phone: form.phone, country: form.country } },
        });

        if (error) throw error;

        await supabase.from("users").insert([{
          name: form.name, email: form.email,
          phone: form.phone, country: form.country,
        }]);

        setMessage(t.success_msg);
        setMessageType("success");
        setMode("login");

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        localStorage.setItem("user_email", form.email);
        localStorage.setItem("user_name", data.user?.user_metadata?.name || form.email);
        window.location.href = "/products";
      }

    } catch (err) {
      setMessage(err.message || (lang === "fr" ? "Une erreur s'est produite" : "Something went wrong"));
      setMessageType("error");
    }

    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="https://flagcdn.com/w40/in.png" alt="India" style={{ width: "28px", borderRadius: "3px" }} />
          <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>{t.site_name}</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", overflow: "hidden" }}>
            {["fr", "en"].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "white" : "transparent", color: lang === l ? "#ea580c" : "white" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={handleSkip} style={{ color: "white", fontSize: "14px", background: "none", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 16px", cursor: "pointer", fontWeight: "500" }}>
            {t.skip_nav}
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "40px", width: "100%", maxWidth: "420px" }}>

          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "4px", textAlign: "center" }}>
            {mode === "login" ? t.login_title : t.signup_title}
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", textAlign: "center", marginBottom: "32px" }}>
            {mode === "login" ? t.login_sub : t.signup_sub}
          </p>

          <div style={{ display: "flex", backgroundColor: "#f3f4f6", borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setMessage(""); }}
                style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: mode === m ? "white" : "transparent", color: mode === m ? "#111827" : "#6b7280", boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                {m === "login" ? t.log_in : t.sign_up}
              </button>
            ))}
          </div>

          {message && (
            <div style={{ backgroundColor: messageType === "success" ? "#dcfce7" : "#fee2e2", color: messageType === "success" ? "#166534" : "#991b1b", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px", fontWeight: "500" }}>
              {message}
            </div>
          )}

          {mode === "signup" && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.name_label}</label>
              <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder={t.name_placeholder}
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.email_label}</label>
            <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
          </div>

          {mode === "signup" && (
            <>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.phone_label}</label>
                <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+227 xx xx xx xx"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.country_label}</label>
                <select value={form.country} onChange={e => update("country", e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>{t.password_label}</label>
            <input type="password" value={form.password} onChange={e => update("password", e.target.value)}
              placeholder={t.password_placeholder} onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", backgroundColor: loading ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginBottom: "12px" }}>
            {loading ? t.loading_btn : mode === "login" ? t.login_btn : t.signup_btn}
          </button>

          <button onClick={handleSkip}
            style={{ width: "100%", backgroundColor: "white", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
            {t.skip_btn}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "20px" }}>
            {mode === "login" ? t.no_account : t.have_account}{" "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}
              style={{ color: "#ea580c", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
              {mode === "login" ? t.sign_up_link : t.log_in_link}
            </button>
          </p>
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