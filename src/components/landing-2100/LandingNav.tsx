"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import type { LandingCopy } from "./landing-copy";

interface LandingNavProps {
  copy: LandingCopy["nav"];
}

export default function LandingNav({ copy }: LandingNavProps) {
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

  return (
    <nav className="e21-nav" aria-label="Embir">
      <div className="e21-shell e21-nav__inner">
        <Link href="/" className="e21-wordmark" onClick={close}>
          Embir
        </Link>
        <div id="embir-landing-navigation" className="e21-nav__links" data-open={open}>
          <a href="#discover" onClick={close}>{copy.discover}</a>
          <a href="#compatibility" onClick={close}>{copy.compatibility}</a>
          <a href="#intentions" className="e21-nav__optional" onClick={close}>{copy.intentions}</a>
          <a href="#universe" className="e21-nav__optional" onClick={close}>{copy.universe}</a>
          <div className="e21-nav__actions">
            <LanguageSwitcher />
            <Link href="/auth/register" className="e21-button" onClick={close}>
              {copy.create}
            </Link>
          </div>
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
