import type { Metadata } from "next";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "@/components/site-header";
import { CatalogueUploader } from "./catalogue-uploader";
import styles from "./catalogue.module.css";

export const metadata: Metadata = {
  title: "Upload Catalogue | Samdani Marble Group",
  description:
    "Upload a PDF catalogue and create a shareable link that opens the PDF.",
};

export default function CataloguePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main className={styles.main} id="main-content">
        <div className={styles.content}>
          <section className={styles.intro} aria-labelledby="catalogue-heading">
            <p className={styles.eyebrow}>Samdani Marble Group</p>
            <h1 className={styles.title} id="catalogue-heading">
              A closer look at <em>what&apos;s possible.</em>
            </h1>
            <p className={styles.description}>
              Upload your catalogue PDF and create a link you can share with
              anyone. Opening the link displays the PDF in their browser.
            </p>
          </section>
          <CatalogueUploader />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
