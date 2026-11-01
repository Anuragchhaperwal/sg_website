import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { SiteHeader } from "@/components/site-header";
import { StoneSlideshow } from "@/components/stone-slideshow";
import { collections } from "@/lib/collections";
import { showcaseSlides } from "@/lib/showcase";
import { SiteFooter } from "./site-footer";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="hero" id="home" aria-labelledby="hero-heading">
          <Image
            className="hero__image"
            src="/images/hero-interior.webp"
            alt=""
            fill
            sizes="100vw"
            preload
          />

          <div className="hero__content">
            <p className="hero__eyebrow">
              <span aria-hidden="true" />
              Nature, beautifully considered
              <span aria-hidden="true" />
            </p>
            <h1 id="hero-heading">
              Spaces shaped <em>by nature.</em>
            </h1>
            <p className="hero__description">
              Marble, granite, and natural stone for spaces to live in, love,
              and remember.
            </p>
            <a className="hero__button" href="#about">
              Discover our story
              <ArrowIcon />
            </a>
          </div>

          <div className="hero__bottom">
            <span className="hero__bottom-note">From Chittorgarh, Rajasthan</span>
            <a className="scroll-cue" href="#about">
              <span>Scroll to explore</span>
              <span className="scroll-cue__line" aria-hidden="true" />
            </a>
            <span className="hero__bottom-note hero__bottom-note--right">
              Natural stone since 1994
            </span>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-heading">
          <div className="section-inner">
            <div className="section-label">
              <span>01</span>
              <span className="section-label__line" aria-hidden="true" />
              <span>Our story</span>
            </div>

            <div className="about__grid">
              <div className="about__visual">
                <div className="about__image">
                  <Image
                    src="/images/about-interior.webp"
                    alt="A bright kitchen with a marble-topped island"
                    fill
                    sizes="(max-width: 820px) 90vw, 42vw"
                  />
                </div>
                <div className="about__texture" aria-hidden="true">
                  <Image
                    src="/images/marble-texture.webp"
                    alt=""
                    fill
                    sizes="(max-width: 820px) 35vw, 18vw"
                  />
                </div>
                <div className="about__image-note">
                  <span>Inspired by</span>
                  <strong>the natural world.</strong>
                </div>
              </div>

              <div className="about__content">
                <p className="eyebrow">Welcome to Samdani Group</p>
                <h2 id="about-heading">
                  A little of nature, <em>a lot of character.</em>
                </h2>
                <p className="about__lead">
                  Since 1994, Samdani Group has brought the character of natural
                  stone to spaces across India.
                </p>
                <p className="about__copy">
                  Based in Chittorgarh, Rajasthan, we work with marble, granite,
                  and imported natural stones, helping architects, designers,
                  and builders find materials for spaces made to last.
                </p>

                <div className="about__details">
                  <div>
                    <span>01</span>
                    Established in 1994
                  </div>
                  <div>
                    <span>02</span>
                    Chittorgarh, Rajasthan
                  </div>
                </div>

                <a className="text-link" href="#materials">
                  Explore our collections
                  <ArrowIcon />
                </a>
              </div>
            </div>

            <div className="materials" id="materials">
              <div className="materials__heading">
                <div>
                  <p className="eyebrow">Our collections</p>
                  <h3>Nature in every detail.</h3>
                </div>
                <p>
                  Five curated collections, each with its own character, tone,
                  and finish.
                </p>
              </div>

              <ul className="materials__list">
                {collections.map((collection) => (
                  <li key={collection.name}>
                    <Link
                      className="materials__link"
                      href={collection.href}
                      aria-label={`View ${collection.name} collection`}
                    >
                      <span className="materials__number">
                        {collection.number}
                      </span>
                      <h4>{collection.name}</h4>
                      <p>{collection.description}</p>
                      <span className="materials__link-label">
                        View collection <ArrowIcon />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <StoneSlideshow slides={showcaseSlides} />
      </main>

      <SiteFooter />
    </>
  );
}
