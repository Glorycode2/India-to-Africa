"use client";
import { useState, useEffect } from "react";

const ADMIN_EMAIL = "yayenasrine@gmail.com";
let client = null;
async function getSb() {
  if (client) return client;
  const { createClient } = await import("@supabase/supabase-js");
  client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return client;
}

const box = { width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 10px", fontSize: "14px", color: "#111827", backgroundColor: "white", boxSizing: "border-box" };
const lbl = { display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" };
const EMPTY = { destination_country: "", weight_min_kg: "0", weight_max_kg: "", cost_usd: "", estimated_days_min: "", estimated_days_max: "" };

function Fields({ r, set }) {
  const f = (k, label, type) => (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type || "text"} value={r[k] === null || r[k] === undefined ? "" : r[k]} onChange={(e) => set(k, e.target.value)} style={box} />
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px" }}>
      <div style={{ gridColumn: "1 / -1" }}>{f("destination_country", "Country (same spelling as checkout)")}</div>
      {f("weight_min_kg", "From (kg)", "number")}
      {f("weight_max_kg", "To (kg)", "number")}
      {f("cost_usd", "Cost (USD)", "number")}
      {f("estimated_days_min", "Days min", "number")}
      {f("estimated_days_max", "Days max", "number")}
    </div>
  );
}

function RateRow({ row, onSave, onDelete }) {
  const [r, setR] = useState(row);
  const set = (k, v) => setR({ ...r, [k]: v });
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px", marginBottom: "12px", backgroundColor: "white" }}>
      <Fields r={r} set={set} />
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button onClick={() => onSave(r)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Save</button>
        <button onClick={() => onDelete(r)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#fee2e2", color: "#b91c1c", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Delete</button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [state, setState] = useState("checking");
  const [password, setPassword] = useState("");
  const [fee, setFee] = useState("10");
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [fresh, setFresh] = useState(EMPTY);

  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  async function isAdmin(sb) {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return false;
    const { data } = await sb.from("admins").select("user_id").maybeSingle();
    return !!data;
  }

  async function loadAll(sb) {
    const { data: s } = await sb.from("site_settings").select("value").eq("key", "service_fee_percent").maybeSingle();
    if (s) setFee(String(s.value));
    const { data: list } = await sb.from("shipping_rates").select("*").order("destination_country").order("weight_min_kg");
    setRows(list || []);
  }

  useEffect(() => {
    (async () => {
      const sb = await getSb();
      if (await isAdmin(sb)) { await loadAll(sb); setState("ready"); } else { setState("login"); }
    })();
  }, []);

  async function login() {
    try {
      const sb = await getSb();
      const { error } = await sb.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
      if (error) throw error;
      if (!(await isAdmin(sb))) { await sb.auth.signOut(); throw new Error("not admin"); }
      await loadAll(sb);
      setState("ready");
    } catch (e) { alert("Wrong password"); }
  }

  async function saveFee() {
    const sb = await getSb();
    const n = parseFloat(fee);
    if (isNaN(n) || n < 0) { flash("Enter a valid percentage"); return; }
    const { error } = await sb.from("site_settings").upsert({ key: "service_fee_percent", value: String(n) });
    flash(error ? "Not saved: " + error.message : "Service fee saved");
  }

  async function saveRow(r) {
    const sb = await getSb();
    const payload = {
      destination_country: String(r.destination_country || "").trim(),
      weight_min_kg: parseFloat(r.weight_min_kg) || 0,
      weight_max_kg: parseFloat(r.weight_max_kg),
      cost_usd: parseFloat(r.cost_usd),
      estimated_days_min: parseInt(r.estimated_days_min),
      estimated_days_max: parseInt(r.estimated_days_max),
    };
    if (!payload.destination_country || isNaN(payload.weight_max_kg) || isNaN(payload.cost_usd) || isNaN(payload.estimated_days_min) || isNaN(payload.estimated_days_max)) {
      flash("Fill in every box"); return false;
    }
    const q = r.id ? sb.from("shipping_rates").update(payload).eq("id", r.id).select() : sb.from("shipping_rates").insert([payload]).select();
    const { data, error } = await q;
    if (error || !data || data.length === 0) { flash("Not saved: " + (error ? error.message : "no permission")); return false; }
    await loadAll(sb);
    flash("Saved");
    return true;
  }

  async function delRow(r) {
    if (!window.confirm("Delete this rate?")) return;
    const sb = await getSb();
    const { error } = await sb.from("shipping_rates").delete().eq("id", r.id);
    if (error) { flash("Not deleted: " + error.message); return; }
    await loadAll(sb);
    flash("Deleted");
  }

  async function addNew() {
    const ok = await saveRow(fresh);
    if (ok) setFresh(EMPTY);
  }

  const page = { minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "sans-serif" };

  if (state === "checking") return <div style={{ ...page, padding: "40px", textAlign: "center", color: "#6b7280" }}>...</div>;

  if (state === "login") {
    return (
      <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "32px", width: "100%", maxWidth: "360px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>Admin Access</h1>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} style={{ ...box, marginBottom: "12px", padding: "12px" }} />
          <button onClick={login} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div className="ab-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>Settings</h1>
          <a href="/admin" style={{ color: "#ea580c", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>Back to dashboard</a>
        </div>
        {msg ? <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{msg}</div> : null}

        <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "10px" }}>Service fee</h2>
          <label style={lbl}>Percentage of the order total (%)</label>
          <div style={{ display: "flex", gap: "8px", maxWidth: "320px" }}>
            <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} style={box} />
            <button onClick={saveFee} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Save</button>
          </div>
        </div>

        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Shipping rates by weight</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px" }}>One row per country and weight range. The delivery days shown to customers come from the same row.</p>

        {rows.map((row) => (
          <RateRow key={row.id + "-" + (row.cost_usd || "") + "-" + (row.weight_max_kg || "")} row={row} onSave={saveRow} onDelete={delRow} />
        ))}

        <div style={{ border: "2px dashed #fed7aa", borderRadius: "12px", padding: "14px", backgroundColor: "#fff7ed", marginTop: "8px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "10px" }}>Add a new rate</h3>
          <Fields r={fresh} set={(k, v) => setFresh({ ...fresh, [k]: v })} />
          <button onClick={addNew} style={{ marginTop: "12px", padding: "10px 22px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>Add rate</button>
        </div>
      </div>
    </div>
  );
}