import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n, uploadTranslations } from "./i18n";

const API_BASE = "https://api.mariaogaron.no";

const boldText = (text) =>
  text.split(/\*\*(.+?)\*\*/).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
const ACCEPT = "image/*,video/*";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function useFreshChallenge(language) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    setFailed(false);
    fetch(`${API_BASE}/api/challenge?lang=${language}`)
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
  }, [language]);

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

export default function Upload({ language: languageProp }) {
  const { language: languageCtx } = useI18n();
  const language = languageProp ?? languageCtx;
  const t = uploadTranslations[language] ?? uploadTranslations.en;
  const { challenge, loading: challengeLoading, failed: challengeFailed, reload } = useFreshChallenge(language);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [answer, setAnswer] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const [failedFiles, setFailedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const wakeLockRef = useRef(null);
  const isUploadingRef = useRef(false);

  const acquireWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    try { wakeLockRef.current = await navigator.wakeLock.request("screen"); } catch {}
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try { await wakeLockRef.current.release(); } catch {}
      wakeLockRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isUploadingRef.current) {
        await acquireWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [acquireWakeLock]);

  const mergeFiles = (incoming) => {
    const arr = Array.from(incoming).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (!arr.length) return;
    setSuccessCount(0);
    setFailedFiles([]);
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
    isUploadingRef.current = true;
    setAuthError("");
    let doneCount = 0;
    const failedNames = [];

    await acquireWakeLock();

    // Fetch all pre-signed URLs in one call (token is single-use)
    const params = new URLSearchParams({
      token: challenge.token,
      answer: answer,
      uploader: name.trim(),
    });
    files.forEach((f) => params.append("filename", f.name));

    let presigns;
    try {
      const resp = await fetch(`${API_BASE}/api/presign?${params}`);
      if (resp.status === 403) {
        const body = await resp.json().catch(() => ({ detail: "Feil svar eller utløpt utfordring" }));
        setAuthError(body.detail ?? "Feil svar eller utløpt utfordring");
        setAnswer("");
        await releaseWakeLock();
        isUploadingRef.current = false;
        setUploading(false);
        reload();
        return;
      }
      if (!resp.ok) {
        files.forEach((_, i) => patchStatus(i, { state: "failed", error: `HTTP ${resp.status}` }));
        await releaseWakeLock();
        isUploadingRef.current = false;
        setUploading(false);
        return;
      }
      presigns = await resp.json();
    } catch (err) {
      files.forEach((_, i) => patchStatus(i, { state: "failed", error: err.message }));
      await releaseWakeLock();
      isUploadingRef.current = false;
      setUploading(false);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      let succeeded = false;
      patchStatus(i, { state: "uploading", progress: 0, error: "", retry: 0 });
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          patchStatus(i, { state: "uploading", progress: 0, retry: attempt });
        }
        try {
          await putFile(files[i], presigns[i].url, (pct) => patchStatus(i, { progress: pct }));
          patchStatus(i, { state: "done", progress: 100, retry: 0 });
          doneCount++;
          succeeded = true;
          break;
        } catch (err) {
          if (attempt === MAX_RETRIES) {
            patchStatus(i, { state: "failed", error: err.message, retry: 0 });
          }
        }
      }
      if (!succeeded) failedNames.push(files[i].name);
    }

    await releaseWakeLock();
    isUploadingRef.current = false;
    setSuccessCount(doneCount);
    setFailedFiles(failedNames);
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

          <p className="upload__storage-note">{boldText(t.storageNote)}</p>

          {files.length > 0 && (
            files.length > 7 ? (
              <p className="upload__file-count">
                {files.length} {t.filePlural}
              </p>
            ) : (
              <ul className="upload__file-list">
                {files.map((file, i) => {
                  const s = statuses[i] ?? { state: "pending", progress: 0, error: "" };
                  return (
                    <li key={`${file.name}-${i}`} className={`upload__file upload__file--${s.state}`}>
                      <span className="upload__file-name">
                        {file.name}
                        {s.state === "uploading" && s.retry > 0
                          ? ` … (${t.retryLabel.replace("{n}", s.retry).replace("{max}", MAX_RETRIES)})`
                          : ""}
                      </span>
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
            )
          )}

          {(successCount > 0 || failedFiles.length > 0) && (
            failedFiles.length === 0 ? (
              <div className="upload__success">{t.allSuccessful}</div>
            ) : (
              <>
                {successCount > 0 && (
                  <div className="upload__success">
                    {successCount === 1 ? t.successSingular : t.successPlural.replace("{n}", successCount)}
                  </div>
                )}
                <div className="upload__failed">
                  <p className="upload__failed-heading">
                    {failedFiles.length === 1 ? t.failedSingular : t.failedPlural.replace("{n}", failedFiles.length)}
                  </p>
                  {failedFiles.length <= 7 && (
                    <ul className="upload__failed-list">
                      {failedFiles.map((name, i) => <li key={i}>{name}</li>)}
                    </ul>
                  )}
                </div>
              </>
            )
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
