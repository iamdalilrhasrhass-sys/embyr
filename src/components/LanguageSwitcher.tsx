"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_SOURCE_COOKIE,
  buildLocalizedPath,
  getLocaleFromPathname,
  type PublicLocale,
} from "@/i18n/locale-detection";

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
] as const satisfies readonly { code: PublicLocale; label: string; flag: string }[];

type LanguageOption = (typeof LANGUAGES)[number];

const DEFAULT_LANGUAGE = LANGUAGES[1];
const COOKIE_MAX_AGE = 31536000;

const getCookie = (name: string) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

const findLanguage = (code: string | null | undefined): LanguageOption => {
  return LANGUAGES.find((language) => language.code === code) ?? DEFAULT_LANGUAGE;
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageOption>(DEFAULT_LANGUAGE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activePath = pathname || window.location.pathname;
    const pathLocale = getLocaleFromPathname(activePath);
    const cookieLocale = activePath === "/" ? getCookie(LOCALE_COOKIE) : null;
    setCurrent(findLanguage(pathLocale ?? cookieLocale ?? "en"));
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (code: PublicLocale) => {
    setCookie(LOCALE_COOKIE, code);
    setCookie(LOCALE_SOURCE_COOKIE, "manual");
    setCurrent(findLanguage(code));
    setOpen(false);

    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const nextPath = buildLocalizedPath(currentPath, code);
    if (nextPath === currentPath) {
      window.location.reload();
      return;
    }

    window.location.assign(nextPath);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.06] whitespace-nowrap"
        aria-label="Changer de langue"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-sm">{current.flag}</span>
        <span className="uppercase tracking-wider font-bold">{current.code}</span>
        <svg className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-white/[0.06] bg-[#0a0614]/95 backdrop-blur-2xl shadow-2xl z-[100] p-2 scrollbar-thin"
          role="menu"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                lang.code === current.code
                  ? "bg-[#d4a574]/10 text-[#d4a574]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
              }`}
              role="menuitemradio"
              aria-checked={lang.code === current.code}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
              {lang.code === current.code && (
                <span className="ml-auto">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
