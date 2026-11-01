"use client";

import { useState, type FormEvent } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { buildContactMailto } from "@/lib/contact-email";
import styles from "./contact.module.css";

export function ContactInquiryForm() {
  const [emailAppOpened, setEmailAppOpened] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const interest = String(formData.get("interest") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    window.location.href = buildContactMailto({
      name,
      email,
      phone,
      interest,
      message,
    });
    setEmailAppOpened(true);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Your name</span>
          <input
            autoComplete="name"
            name="name"
            placeholder="How should we address you?"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Email address</span>
          <input
            autoComplete="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>

        <label className={styles.field}>
          <span>Phone number <span className={styles.optional}>Optional</span></span>
          <input
            autoComplete="tel"
            name="phone"
            placeholder="+91"
            type="tel"
          />
        </label>

        <label className={styles.field}>
          <span>What can we help with?</span>
          <select defaultValue="" name="interest" required>
            <option disabled value="">
              Choose an enquiry
            </option>
            <option>Natural stone selection</option>
            <option>Residential project</option>
            <option>Commercial project</option>
            <option>Trade or partnership</option>
            <option>Something else</option>
          </select>
        </label>

        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span>Tell us a little about your project</span>
          <textarea
            name="message"
            placeholder="What are you planning?"
            required
            rows={5}
          />
        </label>
      </div>

      <button className={styles.submit} type="submit">
        Open your email app <ArrowIcon />
      </button>
      <p className={styles.formNote} aria-live="polite">
        {emailAppOpened
          ? "Your email app should open with your enquiry ready to send."
          : "This form prepares an email in your email app; it does not send or store your details."}
      </p>
    </form>
  );
}
