import { useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    languageLabel: "Language",
    languageName: "English",
    heroKicker: "Invitation",
    heroTitle: "Maria & Aron",
    heroBody:
      "We're getting married!",
    heroDates: ["25 April @ Dogyard", "Party starts at 19:30"],
    rsvpTitle: "RSVP",
    rsvpBody:
      "Please RSVP by April 1st.",
    rsvpNote: "Respond here: https://forms.gle/SwN1yks1u1Gv6xUD6",
    infoTitle: "Info",
    infoBody:
      "You can reach Aron at aron.social and toastmaster Øyvind at oyvind.aamold@gmail.com.",
    infoNote:
      "The party is for adults. If any youths under 20 want to attend, it's possible to give them inverted alcohol wristbands. Let us know well in advance!\nInvitation to dinner for the closest family and friends will come as a separate invitation.\nThe formal ceremony is at Rådhuset on April 24, with limited space.",
    giftsTitle: "Gifts",
    giftsBody:
      "We're not maxing out our credit cards on this party and neither should you. We already have all the fondue sets and silverware we need. If you'd like to give a gift, we'd love something you made yourself, something fun, or a contribution to the honeymoon.",
    servingTitle: "Food & Drinks",
    servingNote:
      "Snacks!\nCake!\nContinental-standard bar, open until 03:00\nExtra lovely wine? (TBD)",
    directionsTitle: "Directions",
    directionsBody: "",
    directionsNote:
      "Dogyard on the map: https://maps.app.goo.gl/HWwEj7whNaJapLkb7\nPublic from Oslo S: https://maps.app.goo.gl/y95KnMzcdAs4HsbZ8\nDrive from E6: https://maps.app.goo.gl/Q9FKnybNbZuyY9hc6\nDrive from E18: https://maps.app.goo.gl/DgTYfLUzGPWgLiHAA",
    hotelsTitle: "Hotels etc.",
    hotelsBody:
      "The venue is right by the subway station, on line 5 that loops \"the entire city\".",
    hotelsNote:
      "Close to the venue:\nRadisson RED Økern: https://share.google/kCYy1UEHJBlxPYlzc\nQuality Hasle Linie: https://share.google/ai0hAa7EHGComzxro",
    dressTitle: "Dress code",
    dressBody: "Just wear something you feel great in!",
    practicalTitle: "Program (TBD)",
    practicalBody:
      "Agnes Stock (singer) **\nSpeech?\nWedding band 🤘 **\nSecret act\nMartin spins guilty pleasures from the DJ booth **\nDJ keeps the dance floor going into the late hours**\nScenemester: truls.hannemyr@gmail.com",
    practicalNote: "",
    footerBody: "..."
  },
  no: {
    languageLabel: "Language",
    languageName: "Norsk",
    heroKicker: "Invitasjon",
    heroTitle: "Maria & Aron",
    heroBody:
      "Vi skal gifte oss!",
    heroDates: ["25. april @ Dogyard", "Festen starter 19:30"],
    rsvpTitle: "Svar ønskes",
    rsvpBody:
      "Svar innen 1. april.",
    rsvpNote: "Svar her: https://forms.gle/SwN1yks1u1Gv6xUD6",
    infoTitle: "Info",
    infoBody:
      "Du kan nå Aron på aron.social og toastmaster Øyvind på oyvind.aamold@gmail.com.",
    infoNote:
      "Festen er for voksne. Hvis noen ungdommer under 20 ønsker å delta er det mulig å gi dem omvendt skjenkebånd. Si i så fall fra i god tid!\nInvitasjon til middag for de aller nærmeste kommer som separat invitasjon.\nDen formelle vielsen er på Rådhuset den 24. april, med begrenset plass.",
    giftsTitle: "Gaver",
    giftsBody:
      "Vi blakker oss ikke på dette kalaset, og det skal ikke du heller. Vi har alt vi trenger av dessertvinsglass og suppeterriner. Hvis du vil gi en gave, ønsker vi oss noe du har laget selv, noe gøyalt, eller et bidrag til bryllupsreise.",
    servingTitle: "Servering",
    servingNote:
      "Snacks!\nKake!\nBar av kontinental standard, åpen til 03:00\nEkstra herlig vin? (TBD)",
    directionsTitle: "Veibeskrivelse",
    directionsBody:
      "Festen er på Dogyard.",
    directionsNote:
      "Dogyard på kartet: https://maps.app.goo.gl/HWwEj7whNaJapLkb7\nKollektiv fra Oslo S: https://maps.app.goo.gl/y95KnMzcdAs4HsbZ8\nKjøring fra E6: https://maps.app.goo.gl/Q9FKnybNbZuyY9hc6\nKjøring fra E18: https://maps.app.goo.gl/DgTYfLUzGPWgLiHAA",
    hotelsTitle: "Hotell osv.",
    hotelsBody:
      "Lokalet ligger rett ved T-banen, på linje 5 Ringen, som omfatter \"hele byen\".",
    hotelsNote:
      "Nær lokalet:\nRadisson RED Økern: https://share.google/kCYy1UEHJBlxPYlzc\nQuality Hasle Linie: https://share.google/ai0hAa7EHGComzxro",
    dressTitle: "Kleskode",
    dressBody: "Bare ha på deg noe du føler deg fin i!",
    practicalTitle: "Program (TBD)",
    practicalBody:
      "Agnes Stock (sanger) **\nTale?\nBryllupsband 🤘 **\nHemmelig innslag\nMartin spinner guilty pleasures fra DJ-båsen **\nDJ spiller opp til dans i det sene timer**\nScenemester: truls.hannemyr@gmail.com",
    practicalNote: "",
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
