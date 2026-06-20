"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
export default function CertificationPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => r.json())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <main className="min-h-screen text-[var(--eb-text-primary)] pt-4 pb-20 md:pb-8" style={{background: "var(--eb-bg-base)"}}>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-[var(--eb-font-display)] font-bold mb-6" style={{background: "linear-gradient(135deg, var(--eb-accent), var(--eb-copper))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
            Certification
          </h1>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)] animate-spin" />
            </div>
          ) : (
            <div className="rounded-[var(--eb-radius-card)] p-6 space-y-3" style={{background: "var(--eb-bg-elev-1)", border: "1px solid var(--eb-border-soft)"}}>
              <p className="text-[var(--eb-text-secondary)]">Get verified to build trust with other members.</p>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
