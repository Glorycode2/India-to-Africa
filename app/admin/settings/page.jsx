"use client";
import { getSharedSb } from "../../lib/supabase";
import { useState, useEffect } from "react";

const ADMIN_EMAIL = "yayenasrine@gmail.com";
let client = null;
async function getSb() {
  if (client) return client;
  client = (await getSharedSb());
  return client;
}

const box = { width: "100%", border: "1px solid #d1d5db", borderRadius: "8px", padding: "8px 10px", fontSize: "14px", color: "#111827", backgroundColor: "white", boxSizing: "border-box" };
const lbl = { display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" };
const EMPTY = { destination_country: "", method: "plane", weight_min_kg: "0", weight_max_kg: "", cost_usd: "", cost_per_kg: "", estimated_days_min: "", estimated_days_max: "" };

const TR = {
  en: {
    country: "Country (same spelling as checkout)", method: "Method", plane: "Plane", cargo: "Cargo boat", courier: "Private courier",
    from: "From (kg)", to: "To (kg)", flat: "Flat cost (USD)", perkg: "Per kg (USD)", dmin: "Days min", dmax: "Days max",
    save: "Save", delete: "Delete", category: "Category", svc_pct: "Service fee (%)", new_cat: "New category", add: "Add",
    valid_pct: "Enter a valid percentage", not_saved: "Not saved:", no_permission: "no permission", fee_saved: "Service fee saved",
    fill: "Fill in every box", saved: "Saved", del_rate: "Delete this rate?", not_deleted: "Not deleted:", deleted: "Deleted",
    del_cat: "Delete this category fee?", cat_err: "Enter a category and a percentage from 0 to 100", wrong_pw: "Wrong password",
    admin_access: "Admin Access", password: "Password", continue: "Continue", settings: "Settings", back: "Back to dashboard",
    svc_title: "Service fee", svc_label: "Percentage of the order total (%)", cat_title: "Service fee by category",
    cat_help: "A category listed here uses its own percentage. Any other category uses the general service fee above.",
    rates_title: "Shipping rates by weight",
    rates_help: "One row per country, method and weight range. Fill in \u201cPer kg\u201d to charge by weight (cost per kg times the cart weight). The delivery days shown to customers come from the same row.",
    add_new: "Add a new rate", add_rate: "Add rate",
  },
  fr: {
    country: "Pays (m\u00eame orthographe que sur la page de paiement)", method: "M\u00e9thode", plane: "Avion", cargo: "Bateau cargo", courier: "Coursier priv\u00e9",
    from: "De (kg)", to: "\u00c0 (kg)", flat: "Co\u00fbt fixe (USD)", perkg: "Par kg (USD)", dmin: "Jours min", dmax: "Jours max",
    save: "Enregistrer", delete: "Supprimer", category: "Cat\u00e9gorie", svc_pct: "Frais de service (%)", new_cat: "Nouvelle cat\u00e9gorie", add: "Ajouter",
    valid_pct: "Entrez un pourcentage valide", not_saved: "Non enregistr\u00e9 :", no_permission: "autorisation refus\u00e9e", fee_saved: "Frais de service enregistr\u00e9s",
    fill: "Remplissez toutes les cases", saved: "Enregistr\u00e9", del_rate: "Supprimer ce tarif ?", not_deleted: "Non supprim\u00e9 :", deleted: "Supprim\u00e9",
    del_cat: "Supprimer les frais de cette cat\u00e9gorie ?", cat_err: "Entrez une cat\u00e9gorie et un pourcentage de 0 \u00e0 100", wrong_pw: "Mot de passe incorrect",
    admin_access: "Acc\u00e8s Admin", password: "Mot de passe", continue: "Continuer", settings: "Param\u00e8tres", back: "Retour au tableau de bord",
    svc_title: "Frais de service", svc_label: "Pourcentage du total de la commande (%)", cat_title: "Frais de service par cat\u00e9gorie",
    cat_help: "Une cat\u00e9gorie list\u00e9e ici utilise son propre pourcentage. Toute autre cat\u00e9gorie utilise les frais de service g\u00e9n\u00e9raux ci-dessus.",
    rates_title: "Tarifs de livraison par poids",
    rates_help: "Une ligne par pays, par m\u00e9thode et par tranche de poids. Remplissez \u00ab Par kg \u00bb pour facturer au poids (prix par kg multipli\u00e9 par le poids du panier). Les jours de livraison affich\u00e9s aux clients viennent de la m\u00eame ligne.",
    add_new: "Ajouter un nouveau tarif", add_rate: "Ajouter le tarif",
  },
};
let LANG = "fr";
function tr(k) { return (TR[LANG] || TR.fr)[k]; }
function Fields({ r, set }) {
  const f = (k, label, type) => (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type || "text"} value={r[k] === null || r[k] === undefined ? "" : r[k]} onChange={(e) => set(k, e.target.value)} style={box} />
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px" }}>
      <div style={{ gridColumn: "1 / -1" }}>{f("destination_country", tr("country"))}</div>
      <div><label style={lbl}>{tr("method")}</label><select value={r.method || "plane"} onChange={(e) => set("method", e.target.value)} style={box}><option value="plane">{tr("plane")}</option><option value="cargo">{tr("cargo")}</option><option value="courier">{tr("courier")}</option></select></div>
      {f("weight_min_kg", tr("from"), "number")}
      {f("weight_max_kg", tr("to"), "number")}
      {f("cost_per_kg", tr("perkg"), "number")}
      {f("estimated_days_min", tr("dmin"), "number")}
      {f("estimated_days_max", tr("dmax"), "number")}
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
        <button onClick={() => onSave(r)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>{tr("save")}</button>
        <button onClick={() => onDelete(r)} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#fee2e2", color: "#b91c1c", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>{tr("delete")}</button>
      </div>
    </div>
  );
}

function CatRow({ row, onSave, onDelete }) {
  const [r, setR] = useState(row);
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexWrap: "wrap", marginBottom: "10px" }}>
      <div style={{ flex: "2 1 160px" }}>
        <label style={lbl}>{tr("category")}</label>
        <input value={r.category} disabled style={{ ...box, backgroundColor: "#f3f4f6" }} />
      </div>
      <div style={{ flex: "1 1 90px" }}>
        <label style={lbl}>{tr("svc_pct")}</label>
        <input type="number" value={r.service_percent} onChange={(e) => setR({ ...r, service_percent: e.target.value })} style={box} />
      </div>
      <button onClick={() => onSave(r)} style={{ padding: "9px 18px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>{tr("save")}</button>
      <button onClick={() => onDelete(r)} style={{ padding: "9px 18px", borderRadius: "8px", border: "none", backgroundColor: "#fee2e2", color: "#b91c1c", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>{tr("delete")}</button>
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
  const [cats, setCats] = useState([]);
  const [catList, setCatList] = useState([]);
  const [freshCat, setFreshCat] = useState({ category: "", service_percent: "" });
  const [lang, setLang] = useState("fr");
  LANG = lang;
  useEffect(() => { try { const sl = localStorage.getItem("lang"); if (sl === "en" || sl === "fr") setLang(sl); } catch (e) {} }, []);
  function switchLang(l) { setLang(l); try { localStorage.setItem("lang", l); } catch (e) {} }

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
    const { data: cf } = await sb.from("category_fees").select("*").order("category");
    setCats(cf || []);
    const { data: pc } = await sb.from("products").select("category");
    setCatList([...new Set((pc || []).map((p) => p.category).filter(Boolean))]);
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
    } catch (e) { alert(tr("wrong_pw")); }
  }

  async function saveFee() {
    const sb = await getSb();
    const n = parseFloat(fee);
    if (isNaN(n) || n < 0) { flash(tr("valid_pct")); return; }
    const { error } = await sb.from("site_settings").upsert({ key: "service_fee_percent", value: String(n) });
    flash(error ? tr("not_saved") + " " + error.message : tr("fee_saved"));
  }

  async function saveRow(r) {
    const sb = await getSb();
    const payload = {
      destination_country: String(r.destination_country || "").trim(),
      method: r.method || "plane",
      weight_min_kg: parseFloat(r.weight_min_kg) || 0,
      weight_max_kg: parseFloat(r.weight_max_kg),
      cost_usd: parseFloat(r.cost_usd) || 0,
      cost_per_kg: (r.cost_per_kg === "" || r.cost_per_kg === null || r.cost_per_kg === undefined) ? null : parseFloat(r.cost_per_kg),
      estimated_days_min: parseInt(r.estimated_days_min),
      estimated_days_max: parseInt(r.estimated_days_max),
    };
    if (!payload.destination_country || isNaN(payload.weight_max_kg) || (payload.cost_usd <= 0 && !(payload.cost_per_kg > 0)) || isNaN(payload.estimated_days_min) || isNaN(payload.estimated_days_max)) {
      flash(tr("fill")); return false;
    }
    const q = r.id ? sb.from("shipping_rates").update(payload).eq("id", r.id).select() : sb.from("shipping_rates").insert([payload]).select();
    const { data, error } = await q;
    if (error || !data || data.length === 0) { flash(tr("not_saved") + " " + (error ? error.message : tr("no_permission"))); return false; }
    await loadAll(sb);
    flash(tr("saved"));
    return true;
  }

  async function delRow(r) {
    if (!window.confirm(tr("del_rate"))) return;
    const sb = await getSb();
    const { error } = await sb.from("shipping_rates").delete().eq("id", r.id);
    if (error) { flash(tr("not_deleted") + " " + error.message); return; }
    await loadAll(sb);
    flash(tr("deleted"));
  }

  async function saveCat(r) {
    const name = String(r.category || "").trim();
    const pct = parseFloat(r.service_percent);
    if (!name || isNaN(pct) || pct < 0 || pct > 100) { flash(tr("cat_err")); return false; }
    const sb = await getSb();
    const { error } = await sb.from("category_fees").upsert({ category: name, service_percent: pct });
    if (error) { flash(tr("not_saved") + " " + error.message); return false; }
    await loadAll(sb);
    flash(tr("saved"));
    return true;
  }

  async function delCat(r) {
    if (!window.confirm(tr("del_cat"))) return;
    const sb = await getSb();
    const { error } = await sb.from("category_fees").delete().eq("category", r.category);
    if (error) { flash(tr("not_deleted") + " " + error.message); return; }
    await loadAll(sb);
    flash(tr("deleted"));
  }

  async function addCat() {
    const ok = await saveCat(freshCat);
    if (ok) setFreshCat({ category: "", service_percent: "" });
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
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>{tr("admin_access")}</h1>
          <div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", marginBottom: "16px" }}>{["fr", "en"].map((l) => (<button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151" }}>{l.toUpperCase()}</button>))}</div>
          <input type="password" placeholder={tr("password")} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} style={{ ...box, marginBottom: "12px", padding: "12px" }} />
          <button onClick={login} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>{tr("continue")}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div className="ab-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>{tr("settings")}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}><div style={{ display: "flex", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>{["fr", "en"].map((l) => (<button key={l} onClick={() => switchLang(l)} style={{ padding: "5px 12px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: lang === l ? "#ea580c" : "white", color: lang === l ? "white" : "#374151" }}>{l.toUpperCase()}</button>))}</div><a href="/admin" style={{ color: "#ea580c", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>{tr("back")}</a></div>
        </div>
        {msg ? <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>{msg}</div> : null}

        <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "10px" }}>{tr("svc_title")}</h2>
          <label style={lbl}>{tr("svc_label")}</label>
          <div style={{ display: "flex", gap: "8px", maxWidth: "320px" }}>
            <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} style={box} />
            <button onClick={saveFee} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>{tr("save")}</button>
          </div>
        </div>

        <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>{tr("cat_title")}</h2>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>{tr("cat_help")}</p>
          {cats.map((row) => (
            <CatRow key={row.category + "-" + row.service_percent} row={row} onSave={saveCat} onDelete={delCat} />
          ))}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexWrap: "wrap", marginTop: "10px", paddingTop: "12px", borderTop: "1px dashed #e5e7eb" }}>
            <div style={{ flex: "2 1 160px" }}>
              <label style={lbl}>{tr("new_cat")}</label>
              <input list="ab-cats" value={freshCat.category} onChange={(e) => setFreshCat({ ...freshCat, category: e.target.value })} style={box} />
              <datalist id="ab-cats">{catList.map((n) => <option key={n} value={n} />)}</datalist>
            </div>
            <div style={{ flex: "1 1 90px" }}>
              <label style={lbl}>{tr("svc_pct")}</label>
              <input type="number" value={freshCat.service_percent} onChange={(e) => setFreshCat({ ...freshCat, service_percent: e.target.value })} style={box} />
            </div>
            <button onClick={addCat} style={{ padding: "9px 18px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>{tr("add")}</button>
          </div>
        </div><h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>{tr("rates_title")}</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px" }}>{tr("rates_help")}</p>

        {rows.map((row) => (
          <RateRow key={row.id + "-" + (row.cost_usd || "") + "-" + (row.weight_max_kg || "")} row={row} onSave={saveRow} onDelete={delRow} />
        ))}

        <div style={{ border: "2px dashed #fed7aa", borderRadius: "12px", padding: "14px", backgroundColor: "#fff7ed", marginTop: "8px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "10px" }}>{tr("add_new")}</h3>
          <Fields r={fresh} set={(k, v) => setFresh({ ...fresh, [k]: v })} />
          <button onClick={addNew} style={{ marginTop: "12px", padding: "10px 22px", borderRadius: "8px", border: "none", backgroundColor: "#ea580c", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>{tr("add_rate")}</button>
        </div>
      </div>
    </div>
  );
}