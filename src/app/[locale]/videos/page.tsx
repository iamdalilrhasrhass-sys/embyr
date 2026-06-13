"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const fetchVideos = () => {
    setLoading(true);
    fetch("/api/videos").then(r=>r.json()).then(d=>{setVideos(d.videos||d);setLoading(false);}).catch(()=>setLoading(false));
  };

  useEffect(() => { fetchVideos(); }, []);

  const addVideo = async () => {
    if (!url.trim() || !title.trim()) return;
    await fetch("/api/videos", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,title})});
    setUrl(""); setTitle(""); setShowForm(false); fetchVideos();
  };

  return (
    <AppShell>
      <main className="min-h-screen text-[var(--eb-text-primary)] pt-4 pb-20 md:pb-8 px-4" style={{background:"var(--eb-bg-base)"}}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-[var(--eb-font-display)] font-bold" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Videos
          </h1>
          <button onClick={()=>setShowForm(!showForm)} className="px-4 py-2 rounded-[var(--eb-radius-sm)] text-sm font-semibold text-white transition-all hover:brightness-110" style={{background:"var(--eb-accent)"}}>
            + Ajouter
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-[var(--eb-radius-card)] p-4 space-y-3" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)"}}>
            <input placeholder="Titre de la vidéo" value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-4 py-3 rounded-[var(--eb-radius-sm)] text-sm text-white border" style={{background:"var(--eb-bg-elev-2)",border:"1px solid var(--eb-border-soft)",fontSize:"16px"}} />
            <input placeholder="URL (YouTube, Vimeo...)" value={url} onChange={e=>setUrl(e.target.value)} className="w-full px-4 py-3 rounded-[var(--eb-radius-sm)] text-sm text-white border" style={{background:"var(--eb-bg-elev-2)",border:"1px solid var(--eb-border-soft)",fontSize:"16px"}} />
            <button onClick={addVideo} className="w-full px-4 py-3 rounded-[var(--eb-radius-sm)] text-sm font-semibold text-white transition-all hover:brightness-110" style={{background:"var(--eb-accent)"}}>Publier</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)] animate-spin" /></div>
        ) : videos.length===0 ? (
          <p className="text-[var(--eb-text-secondary)]">Aucune vidéo pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((v:any) => (
              <div key={v.id} className="rounded-[var(--eb-radius-card)] overflow-hidden" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)"}}>
                <div className="aspect-video bg-[var(--eb-bg-elev-2)] flex items-center justify-center">
                  <span className="text-4xl">▶️</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm">{v.title}</h3>
                  <p className="text-xs text-[var(--eb-text-secondary)] mt-1">{v.url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
