"use client";
import { useState, useEffect, use } from "react";
import AppShell from "@/components/layout/AppShell";

export default function ForumThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [thread, setThread] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchThread = () => {
    fetch(`/api/forum/${id}`).then(r=>r.json()).then(d=>{setThread(d);setPosts(d.posts||[]);}).catch(()=>{});
  };

  useEffect(() => { fetchThread(); setLoading(false); }, [id]);

  const sendReply = async () => {
    if (!reply.trim()||sending) return;
    setSending(true);
    await fetch(`/api/forum/${id}/posts`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:reply})});
    setReply(""); fetchThread();
    setSending(false);
  };

  if (loading||!thread) return <AppShell><main className="min-h-screen flex items-center justify-center" style={{background:"var(--eb-bg-base)"}}><div className="w-8 h-8 rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)] animate-spin" /></main></AppShell>;

  return (
    <AppShell>
      <main className="min-h-screen text-[var(--eb-text-primary)] pt-4 pb-20 md:pb-8 px-4 flex flex-col" style={{background:"var(--eb-bg-base)"}}>
        <h1 className="text-xl font-[var(--eb-font-display)] font-bold mb-1" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{thread.title}</h1>
        <p className="text-sm text-[var(--eb-text-secondary)] mb-4">{thread.category?.name||thread.categoryId} · {thread._count?.posts||posts.length} réponses</p>
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {posts.map((p:any) => (
            <div key={p.id} className="rounded-[var(--eb-radius-sm)] p-3" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)"}}>
              <div className="flex gap-2 items-center mb-1">
                <span className="text-sm font-semibold" style={{color:"var(--eb-accent)"}}>{p.author?.username||"Anonyme"}</span>
                <span className="text-xs text-[var(--eb-text-secondary)]">{new Date(p.createdAt).toLocaleDateString("fr")}</span>
              </div>
              <p className="text-sm text-[var(--eb-text-secondary)]">{p.content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2" style={{paddingBottom:"env(safe-area-inset-bottom, 12px)"}}>
          <input value={reply} onChange={(e)=>setReply(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&sendReply()} placeholder="Votre réponse..." className="flex-1 px-4 py-3 rounded-[var(--eb-radius-sm)] text-sm text-white border" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)",fontSize:"16px"}} />
          <button onClick={sendReply} disabled={sending||!reply.trim()} className="px-5 py-3 rounded-[var(--eb-radius-sm)] text-sm font-semibold text-white transition-opacity disabled:opacity-50" style={{background:reply.trim()?"var(--eb-accent)":"var(--eb-bg-elev-2)"}}>Envoyer</button>
        </div>
      </main>
    </AppShell>
  );
}
