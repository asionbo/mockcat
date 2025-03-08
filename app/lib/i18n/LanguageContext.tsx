"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Language, translations } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load language preference from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "zh")) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: keyof typeof translations.en): string => {
    const text = translations[language][key];
    if (key === "footer") {
      return text.replace("{year}", new Date().getFullYear().toString());
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
