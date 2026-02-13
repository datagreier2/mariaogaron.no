import { useI18n } from "./i18n";
import "./styles.css";

const languageLabel = (code) => {
  if (code === "no") return "Norsk";
  if (code === "en") return "English";
  return code;
};

const Section = ({
  title,
  body,
  note,
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
              const isScenemesterLine = line.includes("truls.hannemyr@gmail.com");
              return (
                <li
                  key={`${id}-body-${index}`}
                  className={isScenemesterLine ? "panel__body-list-item--full" : undefined}
                >
                  {line}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>{renderInline(body)}</p>
        )
      ) : null}
      {note ? (
        <div className={`panel__note${noteClass ? ` ${noteClass}` : ""}`}>
          {noteAsList ? (
            <ul className="panel__note-list">{renderNoteLines(note)}</ul>
          ) : (
            renderNoteLines(note)
          )}
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
                    <a className="hero__dates-link" href="#directions">
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
          id="rsvp"
          title={t.rsvpTitle}
          body={t.rsvpBody}
          note={t.rsvpNote}
          className="panel--wide"
        />
        <Section
          id="info"
          title={t.infoTitle}
          body={t.infoBody}
          note={t.infoNote}
          noteClass="panel__note--fine"
          noteAsList
          className="panel--info"
        />
        <Section
          id="serving"
          title={t.servingTitle}
          note={t.servingNote}
          noteAsList
          className="panel--serving"
        />
        <Section
          id="gifts"
          title={t.giftsTitle}
          body={t.giftsBody}
          className="panel--gifts"
        />
        <Section
          id="directions"
          title={t.directionsTitle}
          body={t.directionsBody}
          note={t.directionsNote}
        />
        <Section
          id="dress"
          title={t.dressTitle}
          body={t.dressBody}
          className="panel--dress"
        />
        <Section
          id="practical"
          title={t.practicalTitle}
          body={t.practicalBody}
          note={t.practicalNote}
          bodyAsList
          bodyClass="panel__body-list--dim"
        />
        <Section
          id="hotels"
          title={t.hotelsTitle}
          body={t.hotelsBody}
          note={t.hotelsNote}
          className="panel--hotels"
        />
      </main>

      <footer className="footer">
        <p>{t.footerBody}</p>
      </footer>
    </div>
  );
}
