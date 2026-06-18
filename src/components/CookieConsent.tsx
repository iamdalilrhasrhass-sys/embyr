"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("embir_cookie_consent");
    if (!consented) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-white/[0.08] bg-[#0a0614]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-white/55 sm:text-sm">
          Embir uses essential cookies to function and optional analytics to improve the experience.{" "}
          <a href="/privacy" className="text-[#d4a574] underline hover:text-[#e8c4a2]">
            Privacy policy
          </a>
          . No data is sold.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem("embir_cookie_consent", "essential");
              setVisible(false);
            }}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/60 hover:border-white/30 hover:text-white/80"
          >
            Essential only
          </button>
          <button
            onClick={() => {
              localStorage.setItem("embir_cookie_consent", "all");
              setVisible(false);
            }}
            className="rounded-full bg-[#d4a574] px-4 py-2 text-xs font-bold text-[#0a0614] hover:bg-[#e8c4a2]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
