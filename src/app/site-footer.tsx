import Link from "next/link";
import Image from "next/image";
import { collections } from "@/lib/collections";
import { ArrowIcon } from "@/components/arrow-icon";
import footerStyles from "./footer.module.css";

export function SiteFooter() {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.container}>
        <div className={footerStyles.intro}>
          <div>
            <p className={footerStyles.eyebrow}>Let&apos;s create together</p>
            <h2 className={footerStyles.title}>
              Made by nature. <em>Made to last.</em>
            </h2>
          </div>
          <a
            className={footerStyles.cta}
            href="mailto:info@samdanigroup.com"
          >
            Start a conversation <ArrowIcon />
          </a>
        </div>

        <div className={footerStyles.main}>
          <div className={footerStyles.identity}>
            <Link
              className={footerStyles.brand}
              href="/#home"
              aria-label="Samdani Group, home"
            >
              <Image
                className={footerStyles.brandLogo}
                src="/images/samdani-group-logo.png"
                width={3016}
                height={560}
                sizes="208px"
                alt=""
              />
            </Link>
            <p className={footerStyles.description}>
              Crafting timeless spaces with the beauty of natural stone.
            </p>
            <nav className={footerStyles.socials} aria-label="Social media">
              <a
                href="https://www.instagram.com/samdanigroup"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <ArrowIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/samdani-group/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <ArrowIcon />
              </a>
            </nav>
          </div>

          <nav className={footerStyles.column} aria-label="Company links">
            <h3 className={footerStyles.columnTitle}>Explore</h3>
            <Link href="/#home">Home</Link>
            <Link href="/#about">Our story</Link>
            <Link href="/#materials">Collections</Link>
            <Link href="/contact">Contact us</Link>
          </nav>

          <nav className={footerStyles.column} aria-label="Stone collections">
            <h3 className={footerStyles.columnTitle}>Collections</h3>
            {collections.map((collection) => (
              <Link key={collection.name} href={collection.href}>
                {collection.name}
              </Link>
            ))}
          </nav>

          <address className={footerStyles.contact}>
            <h3 className={footerStyles.columnTitle}>Get in touch</h3>
            <a className={footerStyles.contactLink} href="tel:+917300097005">
              <span className={footerStyles.contactLabel}>Call us</span>
              <span>+91 73000 97005</span>
            </a>
            <a
              className={footerStyles.contactLink}
              href="mailto:info@samdanigroup.com"
            >
              <span className={footerStyles.contactLabel}>Email us</span>
              <span>info@samdanigroup.com</span>
            </a>
            <a
              className={footerStyles.contactLink}
              href="https://maps.app.goo.gl/zCUGfNX46CeWfSRB8?g_st=ic"
              target="_blank"
              rel="noreferrer"
            >
              <span className={footerStyles.contactLabel}>Visit us</span>
              <span>
                E-91, RIICO Industrial Area
                <br />
                Chittorgarh, Rajasthan 312001
              </span>
            </a>
          </address>
        </div>

        <div className={footerStyles.bottom}>
          <p>&copy; Samdani Group. All rights reserved.</p>
          <p>Natural stone, thoughtfully sourced since 1994.</p>
          <Link className={footerStyles.backToTop} href="/#home">
            Back to top <ArrowIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}
