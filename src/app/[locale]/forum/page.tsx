"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

export default function ForumPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forum").then(r=>r.json()).then(d=>{setThreads(d.threads||d);setLoading(false);}).catch(()=>setLoading(false));
  }, []);

  return (
    <AppShell>
      <main className="min-h-screen text-[var(--eb-text-primary)] pt-4 pb-20 md:pb-8 px-4" style={{background:"var(--eb-bg-base)"}}>
        <h1 className="text-2xl font-[var(--eb-font-display)] font-bold mb-6" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          💬 Forum
        </h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)] animate-spin" /></div>
        ) : threads.length===0 ? (
          <p className="text-[var(--eb-text-secondary)]">Aucune discussion pour le moment.</p>
        ) : (
          <div className="grid gap-3">
            {threads.map((t:any) => (
              <Link key={t.id} href={`/forum/${t.id}`} className="block rounded-[var(--eb-radius-card)] p-4 transition-all hover:brightness-110" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)"}}>
                <h3 className="font-semibold text-white">{t.title}</h3>
                <div className="flex gap-2 mt-2 text-xs text-[var(--eb-text-secondary)]">
                  {t.category && <span className="px-2 py-0.5 rounded-full" style={{background:"var(--eb-accent)",color:"#fff"}}>{t.category.name||t.categoryId}</span>}
                  <span>{t._count?.posts||0} réponses</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
