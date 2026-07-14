"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TrackedLink from "@/components/TrackedLink";
import type { LandingCopy } from "./landing-copy";

interface LandingNavProps {
  copy: LandingCopy["nav"];
  locale: "fr" | "en";
}

export default function LandingNav({ copy, locale }: LandingNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);
  const homePath = locale === "fr" ? "/fr" : "/";
  const registerPath = locale === "fr" ? "/fr/auth/register" : "/auth/register";

  return (
    <nav className="e21-nav" aria-label="Embir">
      <div className="e21-shell e21-nav__inner">
        <TrackedLink href={homePath} label="wordmark" location="landing_nav" className="e21-wordmark" onClick={close}>
          Embir
        </TrackedLink>
        <div id="embir-landing-navigation" className="e21-nav__links" data-open={open}>
          <a href="#discover" onClick={close}>{copy.discover}</a>
          <a href="#compatibility" onClick={close}>{copy.compatibility}</a>
          <a href="#safety" className="e21-nav__optional" onClick={close}>{copy.safety}</a>
          <a href="#journal" className="e21-nav__optional" onClick={close}>{copy.journal}</a>
          <TrackedLink href={registerPath} label={copy.create} location="landing_nav" className="e21-button" onClick={close}>
            {copy.create}
          </TrackedLink>
        </div>
        <div className="e21-nav__language">
          <LanguageSwitcher initialLocale={locale} />
        </div>
        <button
          type="button"
          className="e21-nav__toggle"
          aria-expanded={open}
          aria-controls="embir-landing-navigation"
          aria-label={open ? copy.close : copy.open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="e21-nav__toggle-lines" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
