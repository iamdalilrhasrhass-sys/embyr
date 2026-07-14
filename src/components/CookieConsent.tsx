"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ANALYTICS_CONSENT_KEY,
  writeAnalyticsConsent,
} from "@/lib/analytics-consent";

export default function CookieConsent() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const copy = locale === "fr"
    ? {
        body: "Embir utilise des cookies essentiels et, avec ton accord, des mesures d’audience pour améliorer l’expérience.",
        privacy: "Politique de confidentialité",
        sold: "Aucune donnée n’est vendue.",
        essential: "Essentiels uniquement",
        accept: "Tout accepter",
      }
    : locale === "es"
      ? {
          body: "Embir utiliza cookies esenciales y, con tu permiso, medición de audiencia para mejorar la experiencia.",
          privacy: "Política de privacidad",
          sold: "No se venden datos.",
          essential: "Solo esenciales",
          accept: "Aceptar todo",
        }
      : {
          body: "Embir uses essential cookies and, with your permission, audience analytics to improve the experience.",
          privacy: "Privacy policy",
          sold: "No data is sold.",
          essential: "Essential only",
          accept: "Accept all",
        };
  const privacyHref = locale === "en" ? "/privacy" : `/${locale}/privacy`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const consented = localStorage.getItem(ANALYTICS_CONSENT_KEY);
        if (!consented) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-white/[0.08] bg-[#0a0614]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-white/55 sm:text-sm">
          {copy.body}{" "}
          <Link href={privacyHref} className="inline-flex min-h-11 items-center text-[#d4a574] underline hover:text-[#e8c4a2]">
            {copy.privacy}
          </Link>
          . {copy.sold}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              writeAnalyticsConsent(false);
              setVisible(false);
            }}
            className="min-h-11 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/60 hover:border-white/30 hover:text-white/80"
          >
            {copy.essential}
          </button>
          <button
            onClick={() => {
              writeAnalyticsConsent(true);
              setVisible(false);
            }}
            className="min-h-11 rounded-full bg-[#d4a574] px-4 py-2 text-xs font-bold text-[#0a0614] hover:bg-[#e8c4a2]"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
