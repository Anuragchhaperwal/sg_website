import type { Metadata } from "next";
import Image from "next/image";
import { ArrowIcon } from "@/components/arrow-icon";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "../site-footer";
import { ContactInquiryForm } from "./contact-inquiry-form";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Samdani Group | Natural Stone, Chittorgarh",
  description:
    "Talk with Samdani Group about natural stone for your next project. Contact our team in Chittorgarh, Rajasthan.",
};

export default function ContactPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="contact-heading">
          <Image
            className={styles.heroImage}
            src="/images/about-interior.webp"
            alt=""
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>We&apos;d love to hear from you</p>
              <h1 className={styles.heroTitle} id="contact-heading">
                Let&apos;s make room for <em>something lasting.</em>
              </h1>
              <p className={styles.heroDescription}>
                Tell us what you&apos;re imagining. We&apos;ll help you find
                natural stone with the right character for your space.
              </p>
              <a className={styles.heroLink} href="#inquiry">
                Start an enquiry <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        <section
          className={styles.content}
          id="inquiry"
          aria-labelledby="inquiry-heading"
        >
          <div className={styles.contentInner}>
            <div className={styles.contactIntro}>
              <p className={styles.sectionLabel}>Get in touch</p>
              <h2 className={styles.sectionTitle} id="inquiry-heading">
                A good place to <em>begin.</em>
              </h2>
              <p className={styles.introText}>
                Whether you&apos;re choosing a surface for home, planning a
                larger project, or simply exploring, our team is here to help.
              </p>

              <div className={styles.contactDetails}>
                <a className={styles.contactDetail} href="tel:+917300097005">
                  <span className={styles.detailLabel}>Call our team</span>
                  <span>+91 73000 97005</span>
                </a>
                <a
                  className={styles.contactDetail}
                  href="mailto:info@samdanigroup.com"
                >
                  <span className={styles.detailLabel}>Email us</span>
                  <span>info@samdanigroup.com</span>
                </a>
                <a
                  className={styles.contactDetail}
                  href="https://maps.app.goo.gl/zCUGfNX46CeWfSRB8?g_st=ic"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.detailLabel}>Find us</span>
                  <span>
                    E-91, RIICO Industrial Area
                    <br />
                    Chittorgarh, Rajasthan 312001
                  </span>
                </a>
              </div>
            </div>

            <div className={styles.formPanel}>
              <h3 className={styles.formHeading}>Tell us what you&apos;re planning.</h3>
              <p className={styles.formDescription}>
                Share a few details and we&apos;ll help you take the next step.
              </p>
              <ContactInquiryForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
