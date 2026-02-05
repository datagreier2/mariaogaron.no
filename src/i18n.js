import { useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    languageLabel: "Language",
    languageName: "English",
    heroKicker: "Invitation",
    heroTitle: "Maria & Aron",
    heroBody:
      "We're getting married!",
    heroDates: ["Party 25 April"],
    rsvpTitle: "RSVP",
    rsvpBody:
      "Please RSVP by April 1.",
    rsvpNote: "Respond here: https://forms.gle/SwN1yks1u1Gv6xUD6",
    directionsTitle: "Directions",
    directionsBody:
      "Party at Dogyard.",
    directionsNote:
      "Dogyard on the map: https://maps.app.goo.gl/HWwEj7whNaJapLkb7\nPublic from Oslo S: https://maps.app.goo.gl/y95KnMzcdAs4HsbZ8\nDrive from E6: https://maps.app.goo.gl/Q9FKnybNbZuyY9hc6\nDrive from E18: https://maps.app.goo.gl/DgTYfLUzGPWgLiHAA",
    practicalTitle: "Program",
    practicalBody:
      "...",
    practicalNote: "Coming soon",
    footerBody: "..."
  },
  no: {
    languageLabel: "Language",
    languageName: "Norsk",
    heroKicker: "Invitasjon",
    heroTitle: "Maria & Aron",
    heroBody:
      "Vi skal gifte oss!",
    heroDates: ["Fest 25. april"],
    rsvpTitle: "Svar vennligst",
    rsvpBody:
      "Svar innen 1. april.",
    rsvpNote: "Svar her: https://forms.gle/SwN1yks1u1Gv6xUD6",
    directionsTitle: "Veibeskrivelse",
    directionsBody:
      "Fest på Dogyard.",
    directionsNote:
      "Dogyard på kartet: https://maps.app.goo.gl/HWwEj7whNaJapLkb7\nKollektiv fra Oslo S: https://maps.app.goo.gl/y95KnMzcdAs4HsbZ8\nKjøring fra E6: https://maps.app.goo.gl/Q9FKnybNbZuyY9hc6\nKjøring fra E18: https://maps.app.goo.gl/DgTYfLUzGPWgLiHAA",
    practicalTitle: "Program",
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
