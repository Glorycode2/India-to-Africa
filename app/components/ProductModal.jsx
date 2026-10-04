"use client";
import { useState, useEffect } from "react";
import WishlistHeart from "./WishlistHeart";

export default function ProductModal({ product, onClose, lang, price, category, addLabel, onAdd }) {
  const list = (product.images && product.images.length ? product.images : [product.image_url]).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [startX, setStartX] = useState(null);
  const fr = lang === "fr";

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  function go(n) { setIdx((idx + n + list.length) % list.length); }
  function onTouchEnd(e) {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40 && list.length > 1) go(dx < 0 ? 1 : -1);
    setStartX(null);
  }

  const arrow = { position: "absolute", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", border: "none", cursor: "pointer", backgroundColor: "rgba(255,255,255,0.85)", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };

  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "white", borderRadius: "16px", width: "100%", maxWidth: "520px", maxHeight: "92vh", overflowY: "auto", fontFamily: "sans-serif" }}>
        <div onTouchStart={(e) => setStartX(e.touches[0].clientX)} onTouchEnd={onTouchEnd} style={{ position: "relative", height: "320px", backgroundColor: "#f9fafb", borderRadius: "16px 16px 0 0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {list.length > 0 ? (
            <img src={list[idx]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <span style={{ color: "#9ca3af", fontSize: "14px" }}>{fr ? "Pas de photo" : "No photo"}</span>
          )}
          <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "8px", left: "8px", width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: "pointer", backgroundColor: "rgba(255,255,255,0.85)", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, zIndex: 2 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
          </button>
          <WishlistHeart productId={product.id} />
          {list.length > 1 ? (
            <>
              <button onClick={() => go(-1)} aria-label="Previous" style={{ ...arrow, left: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 5 8 12 15 19" /></svg>
              </button>
              <button onClick={() => go(1)} aria-label="Next" style={{ ...arrow, right: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 5 16 12 9 19" /></svg>
              </button>
            </>
          ) : null}
        </div>
        {list.length > 1 ? (
          <div style={{ display: "flex", gap: "8px", padding: "10px 16px 0 16px", overflowX: "auto" }}>
            {list.map((src, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{ flex: "0 0 auto", width: "56px", height: "56px", padding: 0, borderRadius: "8px", overflow: "hidden", cursor: "pointer", backgroundColor: "white", border: i === idx ? "2px solid #ea580c" : "1px solid #e5e7eb" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        ) : null}
        <div style={{ padding: "16px" }}>
          <p style={{ fontSize: "11px", color: "#ea580c", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{category}</p>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "8px", lineHeight: "1.3" }}>{product.name}</h2>
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>{price}</p>
          {product.description ? (
            <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: "1.6", marginBottom: "12px", whiteSpace: "pre-line" }}>{product.description}</p>
          ) : null}
          {product.weight_kg ? (
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>{fr ? "Poids" : "Weight"} : {product.weight_kg} kg</p>
          ) : null}
          <button onClick={() => { onAdd(); setAdded(true); setTimeout(() => setAdded(false), 1500); }} style={{ width: "100%", backgroundColor: added ? "#16a34a" : "#ea580c", color: "white", border: "none", borderRadius: "10px", padding: "13px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
            {added ? (fr ? "Ajouté" : "Added") : addLabel}
          </button>
        </div>
      </div>
    </div>
  );
}