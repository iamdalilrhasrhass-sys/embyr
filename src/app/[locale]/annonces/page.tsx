"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";

export default function AnnoncesPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [city, setCity] = useState("");

  const fetchAds = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set("category", filter);
    if (city) params.set("city", city);
    fetch("/api/classifieds?"+params)
      .then(r=>r.json()).then(d=>{setAds(d.ads||d);setLoading(false);}).catch(()=>setLoading(false));
  };

  useEffect(() => { fetchAds(); }, []);

  return (
    <AppShell>
      <main className="min-h-screen text-[var(--eb-text-primary)] pt-4 pb-20 md:pb-8 px-4" style={{background:"var(--eb-bg-base)"}}>
        <h1 className="text-2xl font-[var(--eb-font-display)] font-bold mb-4" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          📋 Petites Annonces
        </h1>
        <div className="flex gap-2 mb-4">
          <select value={filter} onChange={(e)=>{setFilter(e.target.value);setTimeout(fetchAds,0)}} className="px-3 py-2 rounded-[var(--eb-radius-sm)] text-sm border" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)",color:"var(--eb-text-primary)",fontSize:"16px"}}>
            <option value="">Toutes catégories</option>
            <option value="rencontre">Rencontre</option>
            <option value="amitie">Amitié</option>
            <option value="evenement">Événement</option>
            <option value="service">Service</option>
            <option value="autre">Autre</option>
          </select>
          <input placeholder="Ville..." value={city} onChange={(e)=>{setCity(e.target.value);setTimeout(fetchAds,0)}} className="flex-1 px-3 py-2 rounded-[var(--eb-radius-sm)] text-sm border" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)",color:"var(--eb-text-primary)",fontSize:"16px"}} />
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)] animate-spin" /></div>
        ) : ads.length===0 ? (
          <p className="text-[var(--eb-text-secondary)]">Aucune annonce trouvée.</p>
        ) : (
          <div className="grid gap-3">
            {ads.map((a:any) => (
              <div key={a.id} className="rounded-[var(--eb-radius-card)] p-4" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)"}}>
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold text-white">{a.title}</h3>
                  {a.category && <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"var(--eb-accent)",color:"#fff"}}>{a.category}</span>}
                </div>
                <p className="text-sm text-[var(--eb-text-secondary)] line-clamp-2">{a.description}</p>
                {a.city && <p className="text-xs text-[var(--eb-text-secondary)] mt-2">📍 {a.city}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
