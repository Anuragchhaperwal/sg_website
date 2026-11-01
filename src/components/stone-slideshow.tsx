"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowIcon } from "@/components/arrow-icon";
import type { ShowcaseSlide } from "@/lib/showcase";
import styles from "./stone-slideshow.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const AUTOPLAY_SECONDS = 6;
const SWIPE_THRESHOLD = 50;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pad = (value: number) => String(value).padStart(2, "0");

export function StoneSlideshow({ slides }: { slides: ShowcaseSlide[] }) {
  const root = useRef<HTMLElement>(null);
  const previous = useRef(0);
  const direction = useRef(1);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const progress = useRef<gsap.core.Tween | null>(null);
  const pausedByUser = useRef(false);
  const hovering = useRef(false);
  const focused = useRef(false);
  const inView = useRef(false);
  const swipeStart = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const syncPlayback = () => {
    progress.current?.paused(
      pausedByUser.current ||
        hovering.current ||
        focused.current ||
        !inView.current,
    );
  };

  const step = (amount: number) => {
    direction.current = amount > 0 ? 1 : -1;
    setActive((current) => (current + amount + count) % count);
  };

  const goTo = (index: number) => {
    if (index === active) return;
    direction.current = index > active ? 1 : -1;
    setActive(index);
  };

  // Initial state, scroll-driven entrance, and pointer parallax.
  useGSAP(
    () => {
      const slideEls = gsap.utils.toArray<HTMLElement>("[data-slide]");
      gsap.set(slideEls, { autoAlpha: 0, zIndex: 0 });
      gsap.set(slideEls[0], { autoAlpha: 1, zIndex: 2 });
      gsap.set("[data-media]", { scale: 1.06 });

      ScrollTrigger.create({
        trigger: "[data-stage]",
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => {
          inView.current = self.isActive;
          syncPlayback();
        },
      });

      if (prefersReducedMotion()) return;

      gsap.from("[data-heading] > *", {
        y: 48,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      gsap.fromTo(
        "[data-stage]",
        { clipPath: "inset(7% 6% 7% 6%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-stage]",
            start: "top bottom",
            end: "top 30%",
            scrub: 0.6,
          },
        },
      );

      const firstReveal = gsap.timeline({
        scrollTrigger: { trigger: "[data-stage]", start: "top 60%" },
      });
      firstReveal
        .fromTo(
          slideEls[0].querySelector("[data-media]"),
          { scale: 1.3 },
          { scale: 1.06, duration: 2.2, ease: "expo.out" },
        )
        .from(
          slideEls[0].querySelectorAll("[data-reveal]"),
          { yPercent: 120, duration: 1.2, stagger: 0.09, ease: "expo.out" },
          0.25,
        );

      if (!window.matchMedia("(pointer: fine)").matches) return;

      const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      const xTo = gsap.quickTo(layers, "xPercent", {
        duration: 1.4,
        ease: "power3",
      });
      const yTo = gsap.quickTo(layers, "yPercent", {
        duration: 1.4,
        ease: "power3",
      });

      const onMove = (event: globalThis.PointerEvent) => {
        const bounds = stage.getBoundingClientRect();
        xTo(((event.clientX - bounds.left) / bounds.width - 0.5) * -3);
        yTo(((event.clientY - bounds.top) / bounds.height - 0.5) * -3);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);

      return () => {
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  // Slide transition: directional clip-path wipe with layered parallax.
  useGSAP(
    () => {
      const from = previous.current;
      if (from === active) return;
      previous.current = active;

      transition.current?.progress(1);

      const slideEls = gsap.utils.toArray<HTMLElement>("[data-slide]");
      const incoming = slideEls[active];
      const outgoing = slideEls[from];
      const inQ = gsap.utils.selector(incoming);
      const outQ = gsap.utils.selector(outgoing);
      const dir = direction.current;

      gsap.set(slideEls, { zIndex: 0 });
      gsap.set(outgoing, { zIndex: 1 });
      gsap.set(incoming, { zIndex: 2, autoAlpha: 1 });
      gsap.set(inQ("[data-shade]"), { opacity: 0 });

      if (prefersReducedMotion()) {
        gsap.set(outgoing, { autoAlpha: 0 });
        gsap.set(inQ("[data-reveal]"), { yPercent: 0 });
        gsap.set(incoming, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      transition.current = gsap
        .timeline({ defaults: { ease: "expo.inOut" } })
        .fromTo(
          incoming,
          {
            clipPath:
              dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
          },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 },
        )
        .fromTo(
          inQ("[data-media]"),
          { scale: 1.35, xPercent: 14 * dir },
          { scale: 1.06, xPercent: 0, duration: 1.6 },
          0,
        )
        .to(outQ("[data-media]"), { xPercent: -16 * dir, duration: 1.4 }, 0)
        .to(outQ("[data-shade]"), { opacity: 0.7, duration: 1.4 }, 0)
        .to(
          outQ("[data-reveal]"),
          { yPercent: -120, duration: 0.6, stagger: 0.04, ease: "power3.in" },
          0,
        )
        .fromTo(
          inQ("[data-reveal]"),
          { yPercent: 120 },
          { yPercent: 0, duration: 1.1, stagger: 0.09, ease: "expo.out" },
          0.6,
        )
        .set(outgoing, { autoAlpha: 0 }, 1.45)
        .to(
          inQ("[data-media]"),
          { scale: 1.03, duration: AUTOPLAY_SECONDS, ease: "none" },
          1.6,
        );
    },
    { dependencies: [active], scope: root },
  );

  // Autoplay progress bar; advancing happens when it fills.
  useGSAP(
    () => {
      progress.current?.kill();
      gsap.set(`[data-progress]:not([data-progress="${active}"])`, {
        scaleX: 0,
      });

      if (prefersReducedMotion()) return;

      progress.current = gsap.fromTo(
        `[data-progress="${active}"]`,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: AUTOPLAY_SECONDS,
          ease: "none",
          onComplete: () => step(1),
        },
      );
      syncPlayback();
    },
    { dependencies: [active], scope: root },
  );

  const togglePlayback = () => {
    pausedByUser.current = !pausedByUser.current;
    setPaused(pausedByUser.current);
    syncPlayback();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    hovering.current = true;
    syncPlayback();
  };

  const onPointerLeave = () => {
    hovering.current = false;
    syncPlayback();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") swipeStart.current = event.clientX;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > SWIPE_THRESHOLD) step(distance < 0 ? 1 : -1);
  };

  return (
    <section
      ref={root}
      className={styles.showcase}
      id="spaces"
      aria-labelledby="showcase-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header} data-heading>
          <div className={styles.label}>
            <span>02</span>
            <span className={styles.labelLine} aria-hidden="true" />
            <span>Spaces in stone</span>
          </div>
          <h2 className={styles.title} id="showcase-heading">
            Inspiration, <em>in every surface.</em>
          </h2>
          <p className={styles.intro}>
            From quiet bathrooms to welcoming facades, see how natural stone
            shapes the character of a space.
          </p>
        </div>

        <div
          className={styles.carousel}
          role="region"
          aria-roledescription="carousel"
          aria-label="Spaces in stone"
          onKeyDown={onKeyDown}
          onFocus={() => {
            focused.current = true;
            syncPlayback();
          }}
          onBlur={(event) => {
            if (event.currentTarget.contains(event.relatedTarget)) return;
            focused.current = false;
            syncPlayback();
          }}
        >
          <div
            className={styles.stage}
            data-stage
            aria-live={paused ? "polite" : "off"}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
          >
            {slides.map((slide, index) => (
              <article
                key={slide.src}
                className={styles.slide}
                data-slide
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${slide.title}`}
                aria-hidden={index !== active}
                inert={index !== active}
              >
                <div className={styles.parallax} data-parallax>
                  <div className={styles.media} data-media>
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 1400px) 100vw, 1280px"
                      draggable={false}
                    />
                  </div>
                </div>
                <div className={styles.caption}>
                  <span className={styles.line}>
                    <span className={styles.space} data-reveal>
                      {slide.space}
                    </span>
                  </span>
                  <h3 className={styles.slideTitle}>
                    <span className={styles.line}>
                      <span data-reveal>{slide.title}</span>
                    </span>
                  </h3>
                  <span className={styles.line}>
                    <span data-reveal>
                      <Link
                        className={styles.slideLink}
                        href={slide.collection.href}
                      >
                        Featuring {slide.collection.name} <ArrowIcon />
                      </Link>
                    </span>
                  </span>
                </div>
                <div className={styles.shade} data-shade aria-hidden="true" />
              </article>
            ))}
          </div>

          <div className={styles.controls}>
            <p className={styles.counter} aria-hidden="true">
              <span>{pad(active + 1)}</span> / {pad(count)}
            </p>

            <ol className={styles.tabs}>
              {slides.map((slide, index) => (
                <li key={slide.src}>
                  <button
                    type="button"
                    className={styles.tab}
                    onClick={() => goTo(index)}
                    aria-current={index === active ? "true" : undefined}
                    aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  >
                    <span className={styles.tabName}>{slide.space}</span>
                    <span className={styles.tabTrack}>
                      <span className={styles.tabBar} data-progress={index} />
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className={styles.buttons}>
              <button
                type="button"
                className={`${styles.button} ${styles.toggle}`}
                onClick={togglePlayback}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  {paused ? (
                    <path d="M8 5.5v13l10-6.5-10-6.5Z" />
                  ) : (
                    <path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" />
                  )}
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.prev}`}
                onClick={() => step(-1)}
                aria-label="Previous slide"
              >
                <ArrowIcon />
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={() => step(1)}
                aria-label="Next slide"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
