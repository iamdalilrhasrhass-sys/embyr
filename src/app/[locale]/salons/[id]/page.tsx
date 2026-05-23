"use client";
import { useState, useEffect, use } from "react";
import AppShell from "@/components/layout/AppShell";

export default function SalonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [salon, setSalon] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/salons/${id}`)
      .then((r) => r.json())
      .then((data) => { setSalon(data); setMessages(data.messages || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const send = async () => {
    if (!msg.trim() || sending) return;
    setSending(true);
    const r = await fetch(`/api/salons/${id}/messages`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({content:msg}) });
    if (r.ok) { setMsg(""); fetchMessages(); }
    setSending(false);
  };

  const fetchMessages = () => {
    fetch(`/api/salons/${id}`).then(r=>r.json()).then(d=>setMessages(d.messages||[]));
  };

  useEffect(() => { const i = setInterval(fetchMessages, 5000); return () => clearInterval(i); }, [id]);

  if (loading) return <AppShell><main className="min-h-screen flex items-center justify-center" style={{background:"var(--eb-bg-base)"}}><div className="w-8 h-8 rounded-full border-2 border-[var(--eb-border-soft)] border-t-[var(--eb-accent)] animate-spin" /></main></AppShell>;

  return (
    <AppShell>
      <main className="min-h-screen text-[var(--eb-text-primary)] pt-4 pb-20 md:pb-8 px-4 flex flex-col" style={{background:"var(--eb-bg-base)", height:"100dvh"}}>
        <h1 className="text-xl font-[var(--eb-font-display)] font-bold mb-4" style={{background:"linear-gradient(135deg, var(--eb-accent), var(--eb-copper))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {salon?.name || "Salon"}
        </h1>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((m:any) => (
            <div key={m.id} className="rounded-[var(--eb-radius-sm)] p-3" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)"}}>
              <div className="flex gap-2 items-center mb-1">
                <span className="text-sm font-semibold" style={{color:"var(--eb-accent)"}}>{m.author?.username || "Anonyme"}</span>
                <span className="text-xs text-[var(--eb-text-secondary)]">{new Date(m.createdAt).toLocaleTimeString("fr",{hour:"2-digit",minute:"2-digit"})}</span>
              </div>
              <p className="text-sm text-[var(--eb-text-secondary)]">{m.content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2" style={{paddingBottom:"env(safe-area-inset-bottom, 12px)"}}>
          <input value={msg} onChange={(e)=>setMsg(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Votre message..." className="flex-1 px-4 py-3 rounded-[var(--eb-radius-sm)] text-sm text-white border" style={{background:"var(--eb-bg-elev-1)",border:"1px solid var(--eb-border-soft)",fontSize:"16px"}} />
          <button onClick={send} disabled={sending||!msg.trim()} className="px-5 py-3 rounded-[var(--eb-radius-sm)] text-sm font-semibold text-white transition-opacity disabled:opacity-50" style={{background:msg.trim()?"var(--eb-accent)":"var(--eb-bg-elev-2)"}}>Envoyer</button>
        </div>
      </main>
    </AppShell>
  );
}
