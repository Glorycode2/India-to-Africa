"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function MobileMenu({ links, cta }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const panel = (
    <>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.45)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.25s", zIndex: 1000 }} />
      <div style={{ position: "fixed", top: 0, right: 0, height: "100%", width: "78%", maxWidth: "320px", backgroundColor: "white", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s ease", zIndex: 1001, padding: "20px", display: "flex", flexDirection: "column", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
          </button>
        </div>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ color: "#111827", textDecoration: "none", fontSize: "17px", fontWeight: "600", padding: "14px 4px", borderBottom: "1px solid #f3f4f6" }}>{l.label}</a>
        ))}
        {cta ? <a href="/products" onClick={() => setOpen(false)} style={{ marginTop: "24px", backgroundColor: "#ea580c", color: "white", textAlign: "center", padding: "14px", borderRadius: "50px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>{cta}</a> : null}
      </div>
    </>
  );

  return (
    <div className="ab-menu-wrap">
      <button onClick={() => setOpen(true)} aria-label="Menu" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}