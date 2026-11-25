import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "../../site-footer";
import styles from "../catalogue.module.css";
import { CatalogueManager } from "./catalogue-manager";

export const metadata: Metadata = {
  title: "Catalogue Manager | Samdani Marble Group",
  robots: { index: false, follow: false },
};

export default function CatalogueManagerPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main className={styles.main} id="main-content">
        <div className={styles.content}>
          <section className={styles.intro} aria-labelledby="manager-heading">
            <p className={styles.eyebrow}>Restricted access</p>
            <h1 className={styles.title} id="manager-heading">
              Manage your <em>catalogues.</em>
            </h1>
            <p className={styles.description}>
              This private page lets authorized administrators view, share, and
              remove uploaded catalogues.
            </p>
          </section>
          <CatalogueManager />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
