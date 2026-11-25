"use client";

import { useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import styles from "./catalogue.module.css";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function CatalogueUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError("");
    setCopyStatus("");
    setPdfUrl("");

    const formData = new FormData(event.currentTarget);
    const catalogue = formData.get("catalogue");
    if (!(catalogue instanceof File) || catalogue.size === 0) {
      setUploadError("Choose a PDF catalogue to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.set("catalogue", catalogue);
    setIsUploading(true);
    try {
      const response = await fetch("/api/catalogue", {
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

      setPdfUrl(new URL(result.url, window.location.origin).toString());
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
    <div className={styles.uploadPanel}>
      <p className={styles.eyebrow}>Share your collection</p>
      <h2 className={styles.panelHeading}>
        Upload your <em>catalogue.</em>
      </h2>
      <p className={styles.panelDescription}>
        Choose a PDF and we&apos;ll create a link anyone can open to view it.
        Maximum file size: 10 MB.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.fileField}>
          <span>Catalogue PDF</span>
          <input
            accept=".pdf,application/pdf"
            name="catalogue"
            required
            type="file"
          />
        </label>

        <button className={styles.submit} disabled={isUploading} type="submit">
          {isUploading ? "Uploading PDF..." : "Upload catalogue"}
          {!isUploading && <ArrowIcon />}
        </button>
      </form>

      {uploadError && (
        <p className={styles.uploadError} role="alert">
          {uploadError}
        </p>
      )}

      {pdfUrl && (
        <div className={styles.pdfResult} role="status">
          <p>Your shareable catalogue link is ready:</p>
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
    </div>
  );
}
