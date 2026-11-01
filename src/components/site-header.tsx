"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowIcon } from "./arrow-icon";

const navigation = [
  { label: "Home", section: "home" },
  { label: "About Us", section: "about" },
  { label: "Collections", section: "materials" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const homeHref = pathname === "/" ? "#home" : "/#home";
  const sectionHref = (section: string) =>
    pathname === "/" ? `#${section}` : `/#${section}`;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }

  return (
    <header className="site-header" onKeyDown={handleKeyDown}>
      <div className="site-header__inner">
        <Link
          className="brand"
          href={homeHref}
          aria-label="Samdani Group, home"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            className="brand__logo"
            src="/images/samdani-group-logo.png"
            width={3016}
            height={560}
            sizes="(max-width: 560px) 128px, 160px"
            alt=""
          />
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ label, section }) => (
            <Link key={section} href={sectionHref(section)}>
              {label}
            </Link>
          ))}
          <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>
            Contact
          </Link>
        </nav>

        <Link className="header-cta" href="/contact">
          Get in touch
          <ArrowIcon />
        </Link>

        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span
            className={`menu-toggle__icon${menuOpen ? " is-open" : ""}`}
            aria-hidden="true"
          >
            <span />
            <span />
          </span>
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        {navigation.map(({ label, section }) => (
          <Link
            key={section}
            href={sectionHref(section)}
            onClick={() => setMenuOpen(false)}
          >
            {label}
            <ArrowIcon />
          </Link>
        ))}
        <Link
          href="/contact"
          aria-current={pathname === "/contact" ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          Contact
          <ArrowIcon />
        </Link>
      </nav>
    </header>
  );
}
