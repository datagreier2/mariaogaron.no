import { useI18n } from "./i18n";
import { middagTranslations } from "./i18n";
import "./styles.css";

const languageLabel = (code) => {
  if (code === "no") return "Norsk";
  if (code === "en") return "English";
  return code;
};

const renderInline = (text, id) => {
  const parts = [];
  const pattern = /\*\*(.+?)\*\*|\boyvind\.aamold@gmail\.com\b|\bDogyard\b/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={`${id}-${match.index}`}>{match[1]}</strong>);
    } else if (match[0] === "oyvind.aamold@gmail.com") {
      parts.push(
        <a key={`${id}-${match.index}`} href="mailto:oyvind.aamold@gmail.com">
          oyvind.aamold@gmail.com
        </a>
      );
    } else {
      parts.push(
        <a
          key={`${id}-${match.index}`}
          href="https://www.dogyard.no"
          target="_blank"
          rel="noreferrer"
        >
          Dogyard
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const Section = ({ id, title, body, note, className }) => (
  <section className={`panel${className ? ` ${className}` : ""}`} id={id}>
    <div className="panel__header">
      <h2>{title}</h2>
    </div>
    {body ? <p>{renderInline(body, id)}</p> : null}
    {note ? (
      <div className="panel__note">
        <ul className="panel__note-list">
          {note.split("\n").map((line, i) => (
            <li key={i}>{renderInline(line, `${id}-note-${i}`)}</li>
          ))}
        </ul>
      </div>
    ) : null}
  </section>
);

export default function Middag() {
  const { language, updateLanguage, supported } = useI18n();
  const t = middagTranslations[language] ?? middagTranslations.en;

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__top">
          <label className="language">
            <span className="language__label">{t.languageLabel}</span>
            <span className="language__value">{languageLabel(language)}</span>
            <select
              id="language"
              aria-label={t.languageLabel}
              value={language}
              onChange={(e) => updateLanguage(e.target.value)}
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
          {t.heroDates.map((line) => {
            const separator = " @ ";
            if (line.includes(separator)) {
              const [main, sub] = line.split(separator);
              return (
                <span key={line}>
                  {main}
                  <br className="hero__dates-break" />
                  <span className="hero__dates-sub">
                    @{" "}
                    <a
                      className="hero__dates-link"
                      href="https://www.dogyard.no"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {sub}
                    </a>
                  </span>
                </span>
              );
            }
            return <span key={line}>{line}</span>;
          })}
        </div>
      </header>

      <main className="grid">
        <Section
          id="when"
          title={t.whenTitle}
          note={t.whenNote}
          className="panel--serving"
        />
        <Section
          id="welcome"
          title={t.welcomeTitle}
          body={t.welcomeBody}
          className="panel--wide"
        />
        <Section
          id="contact"
          title={t.contactTitle}
          body={t.contactBody}
          className="panel--info"
        />
        <Section
          id="food"
          title={t.foodTitle}
          body={t.foodBody}
          className="panel--gifts"
        />
      </main>

      <footer className="footer">
        <p>{t.footerBody}</p>
      </footer>
    </div>
  );
}
