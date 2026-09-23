 "use client";

import { useState, useEffect } from "react";
import { TRANSLATIONS } from "./translations";

export function useLanguage() {
  const [lang, setLang] = useState("fr"); // default to French

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  function switchLang(newLang) {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS["fr"];

  return { lang, switchLang, t };
}
