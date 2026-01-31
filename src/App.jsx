import { useI18n } from "./i18n";
import "./styles.css";

const languageLabel = (code) => {
  if (code === "no") return "Norsk";
  if (code === "en") return "English";
  return code;
};

const Section = ({ title, body, note, id }) => {
  return (
    <section className="panel" id={id}>
      <div className="panel__header">
        <h2>{title}</h2>
      </div>
      <p>{body}</p>
      {note ? <p className="panel__note">{note}</p> : null}
    </section>
  );
};

export default function App() {
  const { language, t, updateLanguage, supported } = useI18n();

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__top">
          <div className="hero__kicker">{t.heroKicker}</div>
          <label className="language">
            <span className="language__label">{t.languageLabel}</span>
            <span className="language__value">
              {languageLabel(language)}
            </span>
            <select
              id="language"
              aria-label={t.languageLabel}
              value={language}
              onChange={(event) => updateLanguage(event.target.value)}
            >
              {supported.map((code) => (
                <option key={code} value={code}>
                  {languageLabel(code)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroBody}</p>
        <div className="hero__dates">
          {t.heroDates.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </header>

      <main className="grid">
        <Section
          id="rsvp"
          title={t.rsvpTitle}
          body={t.rsvpBody}
          note={t.rsvpNote}
        />
        <Section
          id="directions"
          title={t.directionsTitle}
          body={t.directionsBody}
          note={t.directionsNote}
        />
        <Section
          id="practical"
          title={t.practicalTitle}
          body={t.practicalBody}
          note={t.practicalNote}
        />
      </main>

      <footer className="footer">
        <p>{t.footerBody}</p>
      </footer>
    </div>
  );
}
