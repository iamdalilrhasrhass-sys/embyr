"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALE_COOKIE,
  SWITCHER_LOCALES,
  localizePathname,
  type SwitcherLocale,
} from "@/i18n/locale-detection";

const LOCALES: Array<{
  code: SwitcherLocale;
  flag: string;
  label: string;
}> = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
];

function getCurrentLocale(pathname: string): SwitcherLocale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return SWITCHER_LOCALES.includes(firstSegment as SwitcherLocale)
    ? (firstSegment as SwitcherLocale)
    : "en";
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getCurrentLocale(pathname);
  const currentLocale = LOCALES.find((locale) => locale.code === current) ?? LOCALES[1];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function selectLocale(locale: SwitcherLocale) {
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
    router.push(localizePathname(pathname, locale));
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className="e21-language relative inline-block"
      data-cookie-name="embir_locale"
    >
      <button
        type="button"
        className="e21-language__button flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        aria-label="Changer de langue"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className="text-base leading-none">{currentLocale.flag}</span>
        <span>{currentLocale.code}</span>
        <svg
          aria-hidden="true"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="e21-language__menu absolute right-0 z-[100] mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#100a12]/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
          role="menu"
        >
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              type="button"
              role="menuitemradio"
              aria-checked={locale.code === current}
              className="e21-language__option flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white aria-checked:bg-[#f06d55]/10 aria-checked:text-[#f06d55]"
              onClick={() => selectLocale(locale.code)}
            >
              <span aria-hidden="true" className="text-lg">{locale.flag}</span>
              <span>{locale.label}</span>
              {locale.code === current && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
