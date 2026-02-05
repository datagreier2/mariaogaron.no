import { useI18n } from "./i18n";
import "./styles.css";

const languageLabel = (code) => {
  if (code === "no") return "Norsk";
  if (code === "en") return "English";
  return code;
};

const Section = ({ title, body, note, id, className }) => {
  const renderNoteLines = (text) => {
    return text.split("\n").map((line, index) => {
      const match = line.match(/^(.*?):\s*(https?:\/\/\S+)\s*$/);
      if (match) {
        const [, label, url] = match;
        return (
          <p key={`${id}-note-${index}`}>
            <a href={url}>{label}</a>
          </p>
        );
      }

      return <p key={`${id}-note-${index}`}>{line}</p>;
    });
  };

  return (
    <section className={`panel${className ? ` ${className}` : ""}`} id={id}>
      <div className="panel__header">
        <h2>{title}</h2>
      </div>
      <p>{body}</p>
      {note ? (
        <div className="panel__note">{renderNoteLines(note)}</div>
      ) : null}
    </section>
  );
};

export default function App() {
  const { language, t, updateLanguage, supported } = useI18n();

  return (
    <div className="page">
      <header className="hero">
        <img className="hero__image" src="/couple.png" alt="Maria and Aron" />
        <div className="hero__top">
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
        <div className="hero__kicker">{t.heroKicker}</div>
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
          className="panel--wide"
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
