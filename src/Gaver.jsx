import { useState } from "react";
import { useI18n } from "./i18n";
import { gaverTranslations } from "./i18n";
import "./styles.css";

const CopyButton = ({ text, label, doneLabel }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button className={`modal__copy${copied ? " modal__copy--done" : ""}`} onClick={copy}>
      {copied ? doneLabel : label}
    </button>
  );
};

export default function Gaver() {
  const { language, updateLanguage, supported } = useI18n();
  const t = gaverTranslations[language] ?? gaverTranslations.en;

  return (
    <div className="page">
      <header className="hero">
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
      </header>

      <div className="vipps-help">
        <a href="/" className="vipps-help__btn">{t.backLink}</a>
      </div>

      <main className="grid">
        <section className="panel panel--gifts panel--wide" id="vipps-issue">
          <div className="panel__header">
            <h2>{t.vippsIssueTitle}</h2>
          </div>
          <p>
            {t.vippsIssueBody.split("46693130").map((part, i, arr) =>
              i < arr.length - 1
                ? [part, <strong key={i}>46693130</strong>]
                : part
            )}
          </p>
        </section>

        <section className="panel" id="international">
          <div className="panel__header">
            <h2>{t.internationalTitle}</h2>
          </div>
          <p>{t.internationalBody}</p>
          <div className="panel__note panel__note--body" style={{ marginTop: "20px" }}>
            <dl className="modal__iban">
              <dt>{t.ibanLabel}</dt>
              <dd>
                NO06 9230 3461 789
                <CopyButton text="NO0692303461789" label={t.copyLabel} doneLabel={t.copiedLabel} />
              </dd>
              <dt>{t.bicLabel}</dt>
              <dd>
                KBNONO22XXX
                <CopyButton text="KBNONO22XXX" label={t.copyLabel} doneLabel={t.copiedLabel} />
              </dd>
            </dl>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Maria &amp; Aron</p>
      </footer>
    </div>
  );
}
