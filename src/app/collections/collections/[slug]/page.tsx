import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/arrow-icon";
import { SiteHeader } from "@/components/site-header";
import { collections, getCollection } from "@/lib/collections";
import { SiteFooter } from "../../site-footer";
import styles from "./collection.module.css";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return { title: "Collection not found | Samdani Group" };
  }

  return {
    title: `${collection.name} | Samdani Group Natural Stone`,
    description: `${collection.description} ${collection.intro}`,
  };
}

function Headline({ text }: { text: string }) {
  const [lead, accent] = text.split("*");

  return (
    <>
      {lead}
      {accent ? <em>{accent}</em> : null}
    </>
  );
}

export const instant = false;

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  const index = collections.findIndex((item) => item.slug === collection.slug);
  const next = collections[(index + 1) % collections.length];
  const others = collections.filter((item) => item.slug !== collection.slug);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />

      <main
        id="main-content"
        style={{ "--collection-tone": collection.tone } as CSSProperties}
      >
        <section className={styles.hero} aria-labelledby="collection-heading">
          <Image
            className={styles.heroImage}
            src="/images/marble-texture.webp"
            alt=""
            fill
            loading="eager"
            sizes="100vw"
          />
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/#materials">Collections</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{collection.name}</span>
            </nav>
            <p className={styles.eyebrow}>Collection {collection.number}</p>
            <h1 className={styles.heroTitle} id="collection-heading">
              {collection.name}
            </h1>
            <p className={styles.heroDescription}>{collection.intro}</p>
            <a className={styles.heroLink} href="#overview">
              Explore the collection <ArrowIcon />
            </a>
          </div>
        </section>

        <section
          className={styles.overview}
          id="overview"
          aria-labelledby="overview-heading"
        >
          <div className={styles.inner}>
            <div>
              <p className={styles.sectionLabel}>About the collection</p>
              <h2 className={styles.sectionTitle} id="overview-heading">
                <Headline text={collection.headline} />
              </h2>
              <p className={styles.bodyText}>{collection.story}</p>
            </div>

            <div className={styles.swatchPanel}>
              <div className={styles.swatchImage}>
                <Image
                  src="/images/marble-texture.webp"
                  alt={`Natural stone texture representing ${collection.name}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </div>
              <ul className={styles.palette} aria-label="Colour palette">
                {collection.palette.map((tone) => (
                  <li key={tone.name}>
                    <span
                      className={styles.paletteChip}
                      style={{ background: tone.color }}
                      aria-hidden="true"
                    />
                    {tone.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.details} aria-label="Collection details">
          <div className={`${styles.inner} ${styles.detailsGrid}`}>
            <div className={styles.detailCard}>
              <h3>Available finishes</h3>
              <ul>
                {collection.finishes.map((finish) => (
                  <li key={finish}>{finish}</li>
                ))}
              </ul>
            </div>
            <div className={styles.detailCard}>
              <h3>Ideal for</h3>
              <ul>
                {collection.applications.map((application) => (
                  <li key={application}>{application}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.detailCard} ${styles.ctaCard}`}>
              <h3>Interested in {collection.name}?</h3>
              <p>
                Ask about availability, sizes, samples, and the right finish
                for your project.
              </p>
              <Link className={styles.ctaLink} href="/contact#inquiry">
                Enquire now <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.more} aria-labelledby="more-heading">
          <div className={styles.inner}>
            <div className={styles.moreHeading}>
              <div>
                <p className={styles.sectionLabel}>Keep exploring</p>
                <h2 className={styles.sectionTitle} id="more-heading">
                  More <em>collections.</em>
                </h2>
              </div>
              <Link className={styles.nextLink} href={next.href}>
                Next: {next.name} <ArrowIcon />
              </Link>
            </div>

            <ul className={styles.moreList}>
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    className={styles.moreItem}
                    href={item.href}
                    style={{ "--collection-tone": item.tone } as CSSProperties}
                  >
                    <span className={styles.moreSwatch} aria-hidden="true" />
                    <span className={styles.moreNumber}>{item.number}</span>
                    <span className={styles.moreName}>{item.name}</span>
                    <span className={styles.moreDescription}>
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
