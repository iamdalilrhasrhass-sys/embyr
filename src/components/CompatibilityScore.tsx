"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CompatibilityScore({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const [data, setData] = useState<{ score: number; reasons: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/compatibility?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.score) setData({ score: d.score, reasons: d.reasons || [] });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 animate-pulse">
        <div className="h-6 bg-white/5 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-white/5 rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  const score = data.score;
  const scoreColor =
    score >= 85 ? "#ff1f5a" : score >= 70 ? "#ff5e36" : "#d4a574";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4 text-center">
        Universe Compatibility
      </p>
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={scoreColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black text-white">{score}</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">
            {score >= 85 ? "Exceptional" : score >= 70 ? "Strong" : "Promising"}
          </p>
          <p className="text-sm text-white/40">match with {displayName}</p>
        </div>
      </div>
      {data.reasons.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {data.reasons.map((reason, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-white/[0.06] text-white/50"
            >
              {reason}
            </span>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-white/30 mt-4">
        Based on universe alignment, intentions, and profile richness. Refreshes daily.
      </p>
    </motion.div>
  );
}
