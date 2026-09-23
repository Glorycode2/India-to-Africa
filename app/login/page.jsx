"use client";

import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Niger",
    password: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSkip() {
    localStorage.setItem("skipped_login", "true");
    window.location.href = "/products";
  }

  async function handleSubmit() {
    if (!form.email || !form.password) {
      setMessage("Please fill in your email and password");
      setMessageType("error");
      return;
    }
    if (mode === "signup" && !form.name) {
      setMessage("Please enter your name");
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
          options: {
            data: {
              name: form.name,
              phone: form.phone,
              country: form.country,
            },
          },
        });

        if (error) throw error;

        await supabase.from("users").insert([{
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
        }]);

        setMessage("Account created! You can now log in.");
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
      setMessage(err.message || "Something went wrong. Please try again.");
      setMessageType("error");
    }

    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>

      {/* NAV - no products link here */}
      <nav style={{ backgroundColor: "#ea580c", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ color: "white", fontWeight: "bold", fontSize: "20px", textDecoration: "none" }}>India to Africa</a>
        <button
          onClick={handleSkip}
          style={{ color: "white", fontSize: "14px", background: "none", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "8px", padding: "6px 16px", cursor: "pointer", fontWeight: "500" }}
        >
          Skip for now
        </button>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "40px", width: "100%", maxWidth: "420px" }}>

          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", marginBottom: "4px", textAlign: "center" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", textAlign: "center", marginBottom: "32px" }}>
            {mode === "login" ? "Log in to track your orders" : "Sign up to start shopping"}
          </p>

          {/* MODE TOGGLE */}
          <div style={{ display: "flex", backgroundColor: "#f3f4f6", borderRadius: "10px", padding: "4px", marginBottom: "24px" }}>
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setMessage(""); }}
                style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: mode === m ? "white" : "transparent", color: mode === m ? "#111827" : "#6b7280", boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
              >
                {m === "login" ? "Log In" : "Sign Up"}
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
              <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Amina Diallo"
                style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
              />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
            />
          </div>

          {mode === "signup" && (
            <>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Phone number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+227 xx xx xx xx"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Country</label>
                <select
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827" }}
                >
                  {["Niger", "Nigeria", "Ghana", "Senegal", "Mali", "Burkina Faso", "Ivory Coast", "Cameroon", "Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#374151", fontWeight: "500", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="minimum 6 characters"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", color: "#111827", boxSizing: "border-box" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", backgroundColor: loading ? "#d1d5db" : "#ea580c", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginBottom: "16px" }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>

          {/* SKIP BUTTON */}
          <button
            onClick={handleSkip}
            style={{ width: "100%", backgroundColor: "white", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}
          >
            Skip and browse as guest
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "20px" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}
              style={{ color: "#ea580c", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}