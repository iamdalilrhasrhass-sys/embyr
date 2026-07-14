"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    let cancelled = false;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          updateViaCache: "none",
        });
        if (!cancelled) await registration.update();
      } catch {
        // The application must remain usable when PWA registration is unavailable.
      }
    };

    void register();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
