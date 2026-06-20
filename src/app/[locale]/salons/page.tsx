"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
export default function SalonsPage() {
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/salons")
      .then((r) => r.json())
      .then((data) => { setSalons(data.salons || data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <main className="min-h-screen text-[var(--eb-text-primary)] pt-4 pb-20 md:pb-8 px-4" style={{background:"var(--eb-bg-base)"}}>
        <h1 className="text-2xl font-[var(--eb-font-display)] font-bold mb-6" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          Discover rooms
        </h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)] animate-spin" /></div>
        ) : salons.length === 0 ? (
          <p className="text-[var(--eb-text-secondary)]">Aucun salon disponible pour le moment.</p>
        ) : (
          <div className="grid gap-3">
            {salons.map((s:any) => (
              <Link key={s.id} href={`/salons/${s.id}`} className="block rounded-[var(--eb-radius-card)] p-4 transition-all hover:brightness-110" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)"}}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{s.name}</h3>
                    {s.description && <p className="text-sm text-[var(--eb-text-secondary)] mt-1">{s.description}</p>}
                  </div>
                  {s.isPremium && <span className="text-xs px-2 py-1 rounded-full" style={{background:"var(--eb-accent)",color:"#fff"}}>Premium</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
