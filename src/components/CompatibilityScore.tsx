"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CompatibilityScore({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const [data, setData] = useState<{ eligible: boolean; reasons: string[] } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/compatibility?username=${encodeURIComponent(username)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (payload && typeof payload.eligible === "boolean" && Array.isArray(payload.reasons)) {
          setData({ eligible: payload.eligible, reasons: payload.reasons.filter((reason: unknown) => typeof reason === "string") });
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [username]);

  if (!data?.eligible || data.reasons.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"
      aria-labelledby="compatibility-title"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Préférences réciproques</p>
      <h2 id="compatibility-title" className="mt-2 text-xl font-semibold text-white">
        Pourquoi {displayName} peut faire partie de ta sélection
      </h2>
      <ul className="mt-5 space-y-2">
        {data.reasons.map((reason) => (
          <li key={reason} className="flex items-start gap-2 text-sm text-white/65">
            <span aria-hidden="true" className="text-embir-rose">✦</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-white/35">Aucun pourcentage pseudo-scientifique : seulement des raisons vérifiables.</p>
    </motion.section>
  );
}
