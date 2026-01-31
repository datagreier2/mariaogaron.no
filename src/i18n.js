import { useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    languageLabel: "Language",
    languageName: "English",
    heroKicker: "Maria & Aron",
    heroTitle: "Save the Date",
    heroBody:
      "We're getting married!",
    heroDates: ["Wedding ceremony 24 April", "Party 25 April"],
    rsvpTitle: "RSVP",
    rsvpBody:
      "...",
    rsvpNote: "Coming soon",
    directionsTitle: "Directions",
    directionsBody:
      "...",
    directionsNote: "Coming soon",
    practicalTitle: "Practical Info",
    practicalBody:
      "...",
    practicalNote: "Coming soon",
    footerBody: "..."
  },
  no: {
    languageLabel: "Sprak",
    languageName: "Norsk",
    heroKicker: "Maria & Aron",
    heroTitle: "Save the Date",
    heroBody:
      "Vi skal gifte oss!",
    heroDates: ["Vielse 24. april", "Fest 25. april"],
    rsvpTitle: "Svar vennligst",
    rsvpBody:
      "...",
    rsvpNote: "Mer informasjon kommer",
    directionsTitle: "Veibeskrivelse",
    directionsBody:
      "...",
    directionsNote: "Mer informasjon kommer",
    practicalTitle: "Praktisk info",
    practicalBody:
      "...",
    practicalNote: "Mer informasjon kommer",
    footerBody: "..."
  }
};

const STORAGE_KEY = "maria-aron-language";
const supported = ["en", "no"];

const normalizeLanguage = (value) => {
  if (!value) return "en";
  const lower = value.toLowerCase();
  if (lower.startsWith("no")) return "no";
  if (lower.startsWith("nb")) return "no";
  if (lower.startsWith("nn")) return "no";
  if (lower.startsWith("en")) return "en";
  return "en";
};

export const useI18n = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && supported.includes(saved)) {
      setLanguage(saved);
      return;
    }
    const detected = normalizeLanguage(
      (navigator.languages && navigator.languages[0]) || navigator.language
    );
    setLanguage(detected);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => translations[language], [language]);

  const updateLanguage = (next) => {
    if (!supported.includes(next)) return;
    setLanguage(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return { language, t, updateLanguage, supported };
};
