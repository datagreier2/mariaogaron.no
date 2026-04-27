import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n, uploadTranslations } from "./i18n";

const API_BASE = "https://api.mariaogaron.no";
const ACCEPT = "image/*,video/*";

function useFreshChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    setFailed(false);
    fetch(`${API_BASE}/api/challenge`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setChallenge(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFailed(true);
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { challenge, loading, failed, reload };
}

function putFile(file, url, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`HTTP ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Nettverksfeil"));
    xhr.send(file);
  });
}

export default function Upload() {
  const { language } = useI18n();
  const t = uploadTranslations[language] ?? uploadTranslations.en;
  const { challenge, loading: challengeLoading, failed: challengeFailed, reload } = useFreshChallenge();
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [answer, setAnswer] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef(null);

  const mergeFiles = (incoming) => {
    const arr = Array.from(incoming).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (!arr.length) return;
    setSuccessCount(0);
    setFiles((prev) => [...prev, ...arr]);
    setStatuses((prev) => [
      ...prev,
      ...arr.map(() => ({ state: "pending", progress: 0, error: "" })),
    ]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    mergeFiles(e.dataTransfer.files);
  };

  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setStatuses((prev) => prev.filter((_, idx) => idx !== i));
  };

  const patchStatus = (i, patch) =>
    setStatuses((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!challenge || !files.length || answer === "" || name.trim() === "") return;

    setUploading(true);
    setAuthError("");
    let doneCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      patchStatus(i, { state: "uploading", progress: 0, error: "" });

      let presign;
      try {
        const resp = await fetch(
          `${API_BASE}/api/presign?filename=${encodeURIComponent(file.name)}&token=${encodeURIComponent(challenge.token)}&answer=${encodeURIComponent(answer)}&uploader=${encodeURIComponent(name.trim())}`
        );
        if (resp.status === 403) {
          const msg = await resp.text();
          patchStatus(i, { state: "failed", error: msg });
          setAuthError(msg);
          setAnswer("");
          setUploading(false);
          reload();
          return;
        }
        if (!resp.ok) {
          patchStatus(i, { state: "failed", error: `HTTP ${resp.status}` });
          continue;
        }
        presign = await resp.json();
      } catch (err) {
        patchStatus(i, { state: "failed", error: err.message });
        continue;
      }

      try {
        await putFile(file, presign.url, (pct) => patchStatus(i, { progress: pct }));
        patchStatus(i, { state: "done", progress: 100 });
        doneCount++;
      } catch (err) {
        patchStatus(i, { state: "failed", error: err.message });
      }
    }

    setSuccessCount(doneCount);
    setAnswer("");
    setUploading(false);
    setFiles([]);
    setStatuses([]);
    reload();
  };

  const canSubmit = !uploading && files.length > 0 && answer !== "" && name.trim() !== "" && challenge != null;

  return (
      <form id="upload-section" className="panel panel--wide upload" onSubmit={handleSubmit}>
          <div className="panel__header">
            <h2>{t.panelTitle}</h2>
          </div>

          <div className="upload__name-row">
            <label className="upload__name-label" htmlFor="uploader-name">
              {t.nameLabel}
            </label>
            <input
              id="uploader-name"
              type="text"
              className="upload__name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={uploading}
              placeholder={t.namePlaceholder}
              autoComplete="name"
            />
          </div>

          <div
            className={`upload__dropzone${dragOver ? " upload__dropzone--over" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !uploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={uploading ? -1 : 0}
            onKeyDown={(e) => e.key === "Enter" && !uploading && fileInputRef.current?.click()}
            aria-label={t.dropzoneAriaLabel}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              onChange={(e) => { mergeFiles(e.target.files); e.target.value = ""; }}
              className="upload__file-input"
              tabIndex={-1}
            />
            {files.length === 0 ? (
              <>
                <span className="upload__dropzone-icon">+</span>
                <span className="upload__dropzone-label">{t.dropzoneLabel}</span>
                <span className="upload__dropzone-sub">{t.dropzoneSub}</span>
              </>
            ) : (
              <span className="upload__dropzone-add">{t.dropzoneAdd}</span>
            )}
          </div>

          {files.length > 0 && (
            <ul className="upload__file-list">
              {files.map((file, i) => {
                const s = statuses[i] ?? { state: "pending", progress: 0, error: "" };
                return (
                  <li key={`${file.name}-${i}`} className={`upload__file upload__file--${s.state}`}>
                    <span className="upload__file-name">{file.name}</span>
                    <span className="upload__file-right">
                      {s.state === "pending" && !uploading && (
                        <button
                          type="button"
                          className="upload__file-remove"
                          onClick={() => removeFile(i)}
                          aria-label={`${t.removePrefix} ${file.name}`}
                        >
                          ×
                        </button>
                      )}
                      {s.state === "uploading" && (
                        <span className="upload__progress-wrap">
                          <span
                            className="upload__progress-bar"
                            style={{ width: `${s.progress}%` }}
                            role="progressbar"
                            aria-valuenow={s.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                          <span className="upload__progress-pct">{s.progress}%</span>
                        </span>
                      )}
                      {s.state === "done" && (
                        <span className="upload__status upload__status--ok">✓</span>
                      )}
                      {s.state === "failed" && (
                        <span className="upload__status upload__status--fail" title={s.error}>
                          ✗
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {successCount > 0 && (
            <div className="upload__success">
              {successCount === 1 ? t.successSingular : t.successPlural.replace("{n}", successCount)}
            </div>
          )}

          <div className="upload__challenge">
            {challengeLoading && (
              <p className="upload__challenge-hint">{t.challengeLoading}</p>
            )}
            {challengeFailed && !challengeLoading && (
              <p className="upload__challenge-hint">
                {t.challengeFailed}{" "}
                <button type="button" className="panel__note-btn" onClick={reload}>
                  {t.challengeRetry}
                </button>
              </p>
            )}
            {challenge && !challengeLoading && (
              <>
                {authError && <div className="panel__warn">{authError}</div>}
                <label className="upload__challenge-question" htmlFor="math-answer">
                  {challenge.question}
                </label>
                <input
                  id="math-answer"
                  type="number"
                  className="upload__challenge-input"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={uploading}
                  placeholder={t.mathPlaceholder}
                  autoComplete="off"
                />
              </>
            )}
          </div>

          <div className="upload__actions">
            <button type="submit" className="upload__submit" disabled={!canSubmit}>
              {uploading
                ? t.submitUploading
                : files.length > 0
                ? `${t.submitLabel} (${files.length} ${files.length !== 1 ? t.filePlural : t.fileSingular})`
                : t.submitLabel}
            </button>
          </div>
      </form>
  );
}
