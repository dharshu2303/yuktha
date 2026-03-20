"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import translations from "@/lib/translations";

const LanguageContext = createContext(null);

// Language code to Web Speech API locale mapping
export const SPEECH_LOCALES = {
  ta: "ta-IN",
  hi: "hi-IN",
  te: "te-IN",
  ml: "ml-IN",
  kn: "kn-IN",
  bn: "bn-IN",
  en: "en-IN",
};

// Language metadata for Step 1
export const LANGUAGES = [
  { code: "ta", name: "தமிழ்", english: "Tamil", emoji: "🇮🇳" },
  { code: "hi", name: "हिन्दी", english: "Hindi", emoji: "🇮🇳" },
  { code: "te", name: "తెలుగు", english: "Telugu", emoji: "🇮🇳" },
  { code: "ml", name: "മലയാളം", english: "Malayalam", emoji: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", english: "Kannada", emoji: "🇮🇳" },
  { code: "bn", name: "বাংলা", english: "Bengali", emoji: "🇮🇳" },
  { code: "en", name: "English", english: "English", emoji: "🇬🇧" },
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(null); // null until Step 1 selection

  // Restore saved language on mount (for PWA / offline page support)
  useEffect(() => {
    const saved = localStorage.getItem("yuktha-language");
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("yuktha-language", lang);
    }
  };

  const t = useCallback(
    (key) => {
      if (!language || !translations[key]) return translations[key]?.en || key;
      return translations[key][language] || translations[key].en || key;
    },
    [language]
  );

  const speechLocale = language ? SPEECH_LOCALES[language] : "en-IN";

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, speechLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;
