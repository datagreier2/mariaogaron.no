import { useEffect, useMemo, useState } from "react";

export const middagTranslations = {
  en: {
    languageLabel: "Language",
    heroKicker: "Wedding Dinner",
    heroTitle: "Wedding Buffet",
    heroBody: "You're invited to dinner!",
    heroDates: ["Saturday 25 April @ Dogyard", "Dinner starts at 16:00"],
    welcomeTitle: "Welcome",
    welcomeBody:
      "We'd like to invite you to dinner before the wedding reception. We're running a bit late with this invitation, but we hope it works for you. This will be a chance for family and close friends to get to know each other and share a meal together before the party begins. If you'd like to give a toast in a more intimate setting, there will be an opportunity for that.",
    whenTitle: "When & Where",
    whenNote:
      "Saturday 25 April, 16:00\nDogyard\nSame venue as the party",
    foodTitle: "Food",
    foodBody:
      "We'll be serving a buffet with a selection of dishes — including both meat options and a fully **vegetarian** alternative.",
    contactTitle: "Toastmaster",
    contactBody:
      "Get in touch with Øyvind at oyvind.aamold@gmail.com.",
    footerBody: "We look forward to celebrating with you! Maria and Aron",
  },
  no: {
    languageLabel: "Language",
    heroKicker: "Bryllupsmiddag",
    heroTitle: "Bryllups\u00ADbuffet",
    heroBody: "Du er invitert til middag!",
    heroDates: ["Lørdag 25. april @ Dogyard", "Middag kl. 16:00"],
    welcomeTitle: "Velkommen",
    welcomeBody:
      "Vi har lyst til å invitere deg til middag før bryllupsfest. Vi er ganske sent ute med denne invitasjonen, men håper at det passer for deg. Dette blir en anledning for familie og nære venner til å bli kjent og spise et måltid sammen før det blir fest. Om man vil tale i en mer intim setting er det mulighet for det.",
    whenTitle: "Tid og sted",
    whenNote:
      "Lørdag 25. april kl. 16:00\nDogyard\nSamme lokale som festen",
    foodTitle: "Mat",
    foodBody:
      "Vi serverer buffet med et utvalg retter — inkludert kjøttretter og et fullstendig **vegetarisk** alternativ.",
    contactTitle: "Toastmaster",
    contactBody:
      "Ta kontakt med Øyvind på oyvind.aamold@gmail.com.",
    footerBody: "Vi gleder oss masse til å feire sammen med dere! Maria og Aron",
  },
};

export const vielseTranslations = {
  en: {
    languageLabel: "Language",
    heroTitle: "Ceremony & Lunch",
    heroBody: "In Oslo City Hall",
    heroDates: ["Friday 24 April @ Oslo City Hall", "Arrive 10:15 · Ceremony 10:25"],
    whenTitle: "When & Where",
    whenNote:
      "Arrive: 10:15\nCeremony: 10:25\nMunchrommet, Oslo City Hall\nOn the map: https://maps.google.com/?q=Oslo+City+Hall,+Oslo",
    whenWarn:
      "Note: there may be a security check with some queuing, so please factor this into your timing.",
    welcomeTitle: "Welcome",
    welcomeBody:
      "Space at Oslo City Hall is limited, so we only have a few spots, but we'd love for you to join us for the ceremony. It's informal, so just wear something you feel great in.",
    lunchTitle: "Lunch at Theatercafeen",
    lunchBody:
      "The ceremony only takes about 15 minutes, and after that it's lunchtime. We've booked a table at Theatercafeen and everyone is welcome to join us for lunch afterwards, at your own expense. We haven't planned anything more for the day, as we have quite a bit to sort out before the big party.",
    footerBody: "We look forward to celebrating with you! Maria and Aron",
  },
  no: {
    languageLabel: "Language",
    heroTitle: "Vielse & Lunch",
    heroBody: "I Oslo Rådhus",
    heroDates: ["Fredag 24. april @ Oslo rådhus", "Oppmøte 10:15 · Vielse 10:25"],
    whenTitle: "Tid og sted",
    whenNote:
      "Oppmøte: 10:15\nVielse: 10:25\nMunchrommet, Oslo rådhus\nPå kartet: https://maps.google.com/?q=Oslo+rådhus",
    whenWarn:
      "Merk: det kan være sikkerhetskontroll med noe kø, så ta høyde for dette i tidsberegningen.",
    welcomeTitle: "Velkommen",
    welcomeBody:
      "Kapasiteten på rådhuset er begrenset, så vi har bare noen få plasser, men vi ønsker deg hjertelig velkommen til vielsen. Det er uformelt, så pynt deg så mye du vil.",
    lunchTitle: "Lunsj på Theatercafeen",
    lunchBody:
      "Selve vielsen varer i ca. 15 minutter, og etterpå er det lunsjtid. Vi har booket et bord på Theatercafeen, og alle som vil er hjertelig velkomne til å bli med og spise på egen regning. Vi har ikke lagt opp til noe ytterligere program denne dagen, da vi har en del å ordne før den store festen.",
    footerBody: "Vi gleder oss masse til å feire sammen med dere! Maria og Aron",
  },
};

export const uploadTranslations = {
  en: {
    panelTitle: "Choose files",
    nameLabel: "Your name",
    namePlaceholder: "Enter your name",
    dropzoneLabel: "Drag and drop photos or videos here",
    dropzoneSub: "or click to browse",
    dropzoneAdd: "+ Add more files",
    dropzoneAriaLabel: "Drag and drop files, or click to browse",
    challengeLoading: "Loading challenge…",
    challengeFailed: "Could not load challenge.",
    challengeRetry: "Try again",
    mathPlaceholder: "Answer",
    submitLabel: "Upload",
    submitUploading: "Uploading…",
    fileSingular: "file",
    filePlural: "files",
    removePrefix: "Remove",
    successSingular: "Successfully uploaded 1 file!",
    successPlural: "Successfully uploaded {n} files!",
  },
  no: {
    panelTitle: "Velg filer",
    nameLabel: "Ditt navn",
    namePlaceholder: "Skriv inn navnet ditt",
    dropzoneLabel: "Dra og slipp bilder eller videoer her",
    dropzoneSub: "eller klikk for å velge",
    dropzoneAdd: "+ Legg til flere filer",
    dropzoneAriaLabel: "Dra og slipp filer, eller klikk for å velge",
    challengeLoading: "Laster oppgave…",
    challengeFailed: "Kunne ikke laste oppgave.",
    challengeRetry: "Prøv igjen",
    mathPlaceholder: "Svar",
    submitLabel: "Last opp",
    submitUploading: "Laster opp…",
    fileSingular: "fil",
    filePlural: "filer",
    removePrefix: "Fjern",
    successSingular: "1 fil ble lastet opp!",
    successPlural: "{n} filer ble lastet opp!",
  },
};

const translations = {
  en: {
    languageLabel: "Language",
    languageName: "English",
    heroTitle: "Maria & Aron",
    heroBody:
      "Thank you for making our day so special!",
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
    giftsNoteHeading: "We have been asked for money transfer details, so here they are:",
    giftsVippsLink: "Vipps-link",
    giftsQrLabel: "QR code",
    giftsVippsNumberPrefix: "Or use ",
    giftsVippsNumberId: "3800YU",
    giftsVippsNumberSuffix: " in Vipps",
    giftsFromAbroad: "From abroad",
    servingTitle: "Food & Drinks",
    servingNote:
      "Snacks!\nContinental-standard bar, open until 03:00\nExtra lovely wine? (TBD)",
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
      "Agnes Stock (singer) **\nSpeeches **\nWedding band 🤘 **\nSecret act\nWedding band pt. II 🤘🤘 **\nMartin spins guilty pleasures from the DJ booth **\nDJ keeps the dance floor going into the late hours**\nMC: truls.hannemyr@gmail.com",
    practicalNote: "",
    uploadPanelTitle: "Photos & video",
    uploadPanelBody: "We really appreciate it if you want to upload photos and videos from the weekend!",
    uploadPanelLink: "Upload your photos below!",
    lostTitle: "Forgot something?",
    lostBody: "Contact Maria 🙂",
    footerBody: "..."
  },
  no: {
    languageLabel: "Language",
    languageName: "Norsk",
    heroTitle: "Maria & Aron",
    heroBody:
      "Tusen takk til alle som kom i vårt bryllup!",
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
    giftsNoteHeading: "Vi har blitt spurt om penge\u00ADoverførings\u00ADgreier, så her er det:",
    giftsVippsLink: "Vipps-lenke",
    giftsQrLabel: "QR-kode",
    giftsVippsNumberPrefix: "Eller bruk ",
    giftsVippsNumberId: "3800YU",
    giftsVippsNumberSuffix: " i Vipps",
    giftsFromAbroad: "Fra utlandet",
    servingTitle: "Servering",
    servingNote:
      "Snacks!\nBar av kontinental standard, åpen til 03:00\nEkstra herlig vin? (TBD)",
    directionsTitle: "Veibeskrivelse",
    directionsBody:
      "Festen er på Dogyard.",
    directionsNote:
      "Dogyard på kartet: https://maps.app.goo.gl/HWwEj7whNaJapLkb7\nKollektiv fra Oslo S: https://maps.app.goo.gl/y95KnMzcdAs4HsbZ8\nKjøring fra E6: https://maps.app.goo.gl/Q9FKnybNbZuyY9hc6\nKjøring fra E18: https://maps.app.goo.gl/DgTYfLUzGPWgLiHAA",
    hotelsTitle: "Hotell osv.",
    hotelsBody:
      "Lokalet ligger rett ved T-banen, på linje 5 Ringen, som omfatter \«hele byen\».",
    hotelsNote:
      "Nær lokalet:\nRadisson RED Økern: https://share.google/kCYy1UEHJBlxPYlzc\nQuality Hasle Linie: https://share.google/ai0hAa7EHGComzxro",
    dressTitle: "Kleskode",
    dressBody: "Bare ha på deg noe du føler deg fin i!",
    practicalTitle: "Program (TBD)",
    practicalBody:
      "Agnes Stock (sanger) **\nTaler **\nBryllupsband 🤘 **\nHemmelig innslag\nBryllupsband del II 🤘🤘 **\nMartin spinner guilty pleasures fra DJ-båsen **\nDJ spiller opp til dans i de sene timer**\nScenemester: truls.hannemyr@gmail.com",
    practicalNote: "",
    uploadPanelTitle: "Bilder & video",
    uploadPanelBody: "Vi setter veldig pris på om du vil laste opp bilder og videoer du tok i bryllupet! 😊",
    uploadPanelLink: "Last opp bildene dine under!",
    lostTitle: "Gjenglemt?",
    lostBody: "Si i fra til Maria 🙂",
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
