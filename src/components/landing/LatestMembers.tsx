"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  displayName: string;
  city: string;
  age: number;
}

export default function LatestMembers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetch("/api/profiles/latest")
      .then((r) => r.json())
      .then((d) => setProfiles(d.profiles || []))
      .catch(() => {});
  }, []);

  if (profiles.length === 0) return null;

  return (
    <section className="emb-section">
      <div className="emb-container">
        <h2 className="mb-10 text-center text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
          Ils viennent de nous <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">rejoindre</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {profiles.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-lg font-bold text-white/60">
                {p.displayName?.charAt(0) || "?"}
              </div>
              <div className="text-sm font-semibold text-white truncate">
                {p.displayName}
              </div>
              <div className="text-xs text-white/35 mt-0.5">
                {p.age} ans · {p.city}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/membres"
            className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Voir tous les membres →
          </Link>
        </div>
      </div>
    </section>
  );
}
