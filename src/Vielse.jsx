import { useI18n } from "./i18n";
import { vielseTranslations } from "./i18n";
import "./styles.css";

const languageLabel = (code) => {
  if (code === "no") return "Norsk";
  if (code === "en") return "English";
  return code;
};

const renderInline = (text, id) => {
  const parts = [];
  const pattern = /\*\*(.+?)\*\*|(https?:\/\/\S+)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={`${id}-${match.index}`}>{match[1]}</strong>);
    } else {
      const url = match[2].replace(/[).,!?]+$/, "");
      const trailing = match[2].slice(url.length);
      parts.push(
        <a key={`${id}-${match.index}`} href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      );
      if (trailing) parts.push(trailing);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const renderNoteLines = (text, id) => {
  return text.split("\n").map((line, i) => {
    const linkLabel = line.match(/^(.*?):\s*(https?:\/\/\S+)\s*$/);
    if (linkLabel) {
      const [, label, url] = linkLabel;
      return (
        <li key={`${id}-note-${i}`}>
          <a href={url} target="_blank" rel="noreferrer">
            {label}
          </a>
        </li>
      );
    }
    return <li key={`${id}-note-${i}`}>{renderInline(line, `${id}-note-${i}`)}</li>;
  });
};

const Section = ({ id, title, body, note, warn, className }) => (
  <section className={`panel${className ? ` ${className}` : ""}`} id={id}>
    <div className="panel__header">
      <h2>{title}</h2>
    </div>
    {body ? <p>{renderInline(body, id)}</p> : null}
    {note ? (
      <div className="panel__note">
        <ul className="panel__note-list">{renderNoteLines(note, id)}</ul>
      </div>
    ) : null}
    {warn ? <p className="panel__warn">{warn}</p> : null}
  </section>
);

export default function Vielse() {
  const { language, updateLanguage, supported } = useI18n();
  const t = vielseTranslations[language] ?? vielseTranslations.en;

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
                  <span className="hero__dates-sub">@ {sub}</span>
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
          warn={t.whenWarn}
          className="panel--serving"
        />
        <Section
          id="welcome"
          title={t.welcomeTitle}
          body={t.welcomeBody}
          className="panel--wide"
        />
        <Section
          id="lunch"
          title={t.lunchTitle}
          body={t.lunchBody}
          className="panel--info"
        />
      </main>

      <footer className="footer">
        <p>{t.footerBody}</p>
      </footer>
    </div>
  );
}
