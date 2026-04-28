import { useI18n } from "./i18n";
import Upload from "./Upload.jsx";
import "./styles.css";

const Section = ({
  title,
  body,
  note,
  noteHeading,
  noteChildren,
  id,
  className,
  noteClass,
  noteAsList,
  bodyAsList,
  bodyClass,
}) => {
  const renderInline = (text) => {
    const parts = [];
    const pattern = /(https?:\/\/\S+)|\baron\.social\b|\bDogyard\b|\boyvind\.aamold@gmail\.com\b/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1]) {
        const url = match[1].replace(/[).,!?]+$/, "");
        const trailing = match[1].slice(url.length);
        parts.push(
          <a key={`${id}-inline-${match.index}`} href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        );
        if (trailing) parts.push(trailing);
      } else if (match[0] === "aron.social") {
        parts.push(
          <a
            key={`${id}-inline-${match.index}`}
            href="https://aron.social"
            target="_blank"
            rel="noreferrer"
          >
            aron.social
          </a>
        );
      } else if (match[0] === "oyvind.aamold@gmail.com") {
        parts.push(
          <a key={`${id}-inline-${match.index}`} href="mailto:oyvind.aamold@gmail.com">
            oyvind.aamold@gmail.com
          </a>
        );
      } else {
        parts.push(
          <a
            key={`${id}-inline-${match.index}`}
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

  const renderNoteLines = (text) => {
    return text.split("\n").map((line, index) => {
      const match = line.match(/^(.*?):\s*(https?:\/\/\S+)\s*$/);
      if (match) {
        const [, label, url] = match;
        const content = (
          <a href={url} target="_blank" rel="noreferrer">
            {label}
          </a>
        );

        return noteAsList ? (
          <li key={`${id}-note-${index}`}>{content}</li>
        ) : (
          <p key={`${id}-note-${index}`}>{content}</p>
        );
      }

      return noteAsList ? (
        <li key={`${id}-note-${index}`}>{renderInline(line)}</li>
      ) : (
        <p key={`${id}-note-${index}`}>{renderInline(line)}</p>
      );
    });
  };

  return (
    <section className={`panel${className ? ` ${className}` : ""}`} id={id}>
      <div className="panel__header">
        <h2>{title}</h2>
      </div>
      {body ? (
        bodyAsList ? (
          <ul className={`panel__body-list${bodyClass ? ` ${bodyClass}` : ""}`}>
            {body.split("\n").map((line, index) => {
              const isScenemester = line.includes("truls.hannemyr@gmail.com");
              const isFull = isScenemester || line.includes("**");
              const displayLine = line.replace(/\*\*/g, "").trimEnd();
              return (
                <li
                  key={`${id}-body-${index}`}
                  className={[isFull ? "panel__body-list-item--full" : "", isScenemester ? "panel__body-list-item--scenemester" : ""].filter(Boolean).join(" ") || undefined}
                >
                  {displayLine}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>{renderInline(body)}</p>
        )
      ) : null}
      {(note || noteHeading || noteChildren) ? (
        <div className={`panel__note${noteClass ? ` ${noteClass}` : ""}`}>
          {noteHeading ? <p><strong>{noteHeading}</strong></p> : null}
          {noteChildren ?? null}
          {note ? (
            noteAsList ? (
              <ul className="panel__note-list">{renderNoteLines(note)}</ul>
            ) : (
              renderNoteLines(note)
            )
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default function App() {
  const { language, t, updateLanguage, supported } = useI18n();

  return (
    <div className="page">
      <header className="hero">
        <img className="hero__image" src="/couple2.png" alt="Maria and Aron" />
        <div className="lang-toggle" role="group" aria-label="Language">
          {supported.map((code) => (
            <button
              key={code}
              type="button"
              className={`lang-toggle__btn${language === code ? " lang-toggle__btn--active" : ""}`}
              onClick={() => updateLanguage(code)}
              aria-pressed={language === code}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroBody}</p>
        <div className="vipps-help" style={{ gridColumn: "1 / -1" }}>
          <a href="/gaver" className="vipps-help__btn">{t.vippsHelpBtn}</a>
        </div>
      </header>

      <main className="grid">
        <Section
          id="upload-intro"
          title={t.uploadPanelTitle}
          body={t.uploadPanelBody}
          noteChildren={<a href="#upload-section">{t.uploadPanelLink}</a>}
          className="panel--info"
        />
        <Upload language={language} />
        <Section
          id="lost"
          title={t.lostTitle}
          body={t.lostBody}
          className="panel--info"
        />
      </main>

      <footer className="footer">
        <p>{t.footerBody}</p>
      </footer>
    </div>
  );
}
