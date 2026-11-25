"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { buildResumeMailto } from "@/lib/contact-email";
import styles from "./contact.module.css";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function ResumeInquiry() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [emailAppOpened, setEmailAppOpened] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const resume = formData.get("resume");
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    setUploadError("");
    setCopyStatus("");

    if (!(resume instanceof File) || resume.size === 0) {
      setPdfUrl("");
      window.location.href = buildResumeMailto({
        name,
        email,
        phone,
        resumeUrl: "",
      });
      setEmailAppOpened(true);
      return;
    }

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.set("resume", resume);
      const response = await fetch("/api/resumes", {
        method: "POST",
        body: uploadData,
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Could not upload the PDF. Please try again.";
        throw new Error(message);
      }
      if (!isRecord(result) || typeof result.url !== "string") {
        throw new Error("The upload completed without returning a PDF link.");
      }

      const shareUrl = new URL(result.url, window.location.origin).toString();
      setPdfUrl(shareUrl);
      window.location.href = buildResumeMailto({
        name,
        email,
        phone,
        resumeUrl: shareUrl,
      });
      setEmailAppOpened(true);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Could not upload the PDF. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function copyPdfLink() {
    try {
      await navigator.clipboard.writeText(pdfUrl);
      setCopyStatus("Link copied.");
    } catch {
      setCopyStatus("Could not copy the link. Select it and copy it manually.");
    }
  }

  return (
    <>
      <button
        className={styles.resumeTrigger}
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        Join our team <ArrowIcon />
      </button>

      <dialog
        aria-labelledby="resume-dialog-heading"
        className={styles.resumeDialog}
        onClose={() => setEmailAppOpened(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        ref={dialogRef}
      >
        <div className={styles.resumeDialogInner}>
          <button
            aria-label="Close resume form"
            className={styles.resumeClose}
            onClick={() => dialogRef.current?.close()}
            type="button"
          >
            ×
          </button>
          <p className={styles.sectionLabel}>Get in touch</p>
          <h2 className={styles.formHeading} id="resume-dialog-heading">
           Join our <em>team.</em>
          </h2>
          <p className={styles.formDescription}>
            Leave the details you&apos;d like us to have. Every field is
            optional.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fields}>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span>Resume</span>
                <input
                  accept=".pdf,application/pdf"
                  name="resume"
                  type="file"
                />
              </label>

              <label className={styles.field}>
                <span>Email address</span>
                <input
                  autoComplete="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                />
              </label>

              <label className={styles.field}>
                <span>Phone number</span>
                <input
                  autoComplete="tel"
                  name="phone"
                  placeholder="+91"
                  type="tel"
                />
              </label>

              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span>Your name</span>
                <input
                  autoComplete="name"
                  name="name"
                  placeholder="How should we address you?"
                />
              </label>
            </div>

            <button className={styles.submit} disabled={isUploading} type="submit">
              {isUploading ? "Uploading PDF..." : "Continue to email"}{" "}
              {!isUploading && <ArrowIcon />}
            </button>
            {uploadError && (
              <p className={styles.uploadError} role="alert">
                {uploadError}
              </p>
            )}
            {pdfUrl && (
              <div className={styles.pdfResult} role="status">
                <p>Your shareable PDF link is ready:</p>
                <a href={pdfUrl} rel="noreferrer" target="_blank">
                  {pdfUrl}
                </a>
                <div className={styles.pdfActions}>
                  <a href={pdfUrl} rel="noreferrer" target="_blank">
                    Open PDF
                  </a>
                  <button onClick={copyPdfLink} type="button">
                    Copy link
                  </button>
                </div>
                {copyStatus && <p aria-live="polite">{copyStatus}</p>}
              </div>
            )}
            <p className={styles.formNote} aria-live="polite">
              {emailAppOpened
                ? pdfUrl
                  ? "Your email draft includes the shareable PDF link."
                  : "Your email app should open with your details."
                : "Choose a PDF to upload and create a shareable link. Without a PDF, you can still continue to email. All fields are optional."}
            </p>
          </form>
        </div>
      </dialog>
    </>
  );
}
