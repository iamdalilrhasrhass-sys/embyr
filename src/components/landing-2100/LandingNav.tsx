"use client";

import { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TrackedLink from "@/components/TrackedLink";
import EmbirLogo from "@/components/brand/EmbirLogo";
import type { LandingCopy } from "./landing-copy";

interface LandingNavProps {
  copy: LandingCopy["nav"];
  locale: "fr" | "en";
}

export default function LandingNav({ copy, locale }: LandingNavProps) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.requestAnimationFrame(() => {
      linksRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const close = () => setOpen(false);
  const homePath = locale === "fr" ? "/fr" : "/";
  const loginPath = locale === "fr" ? "/fr/auth/login" : "/auth/login";
  const registerPath = locale === "fr" ? "/fr/auth/register" : "/auth/register";

  return (
    <nav className="e21-nav" aria-label="Embir">
      <div className="e21-shell e21-nav__inner">
        <TrackedLink href={homePath} label="wordmark" location="landing_nav" className="e21-wordmark" onClick={close}>
          <EmbirLogo variant="lockup" tone="light" size="sm" />
        </TrackedLink>
        <div
          ref={linksRef}
          id="embir-landing-navigation"
          className="e21-nav__links"
          data-open={open}
          aria-hidden={mobile && !open ? true : undefined}
          inert={mobile && !open ? true : undefined}
        >
          <a href="#discover" onClick={close}>{copy.discover}</a>
          <a href="#compatibility" onClick={close}>{copy.compatibility}</a>
          <a href="#safety" className="e21-nav__optional" onClick={close}>{copy.safety}</a>
          <a href="#journal" className="e21-nav__optional" onClick={close}>{copy.journal}</a>
          <TrackedLink href={loginPath} label={copy.login} location="landing_nav" onClick={close}>
            {copy.login}
          </TrackedLink>
          <TrackedLink href={registerPath} label={copy.create} location="landing_nav" className="e21-button" onClick={close}>
            {copy.create}
          </TrackedLink>
        </div>
        <div className="e21-nav__language">
          <LanguageSwitcher initialLocale={locale} />
        </div>
        <button
          ref={toggleRef}
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
