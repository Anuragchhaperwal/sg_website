"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { buildResumeMailto } from "@/lib/contact-email";
import styles from "./contact.module.css";

export function ResumeInquiry() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [emailAppOpened, setEmailAppOpened] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const resume = formData.get("resume");
    window.location.href = buildResumeMailto({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      resumeFileName: resume instanceof File ? resume.name : "",
    });
    setEmailAppOpened(true);
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
                  accept=".pdf,.doc,.docx"
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

            <button className={styles.submit} type="submit">
              Continue to email <ArrowIcon />
            </button>
            <p className={styles.formNote} aria-live="polite">
              {emailAppOpened
                ? "Your email app should open with your details. Please attach your resume there."
                : "This opens your email app; it does not send or store your details. Attach your selected resume in the email before sending."}
            </p>
          </form>
        </div>
      </dialog>
    </>
  );
}
