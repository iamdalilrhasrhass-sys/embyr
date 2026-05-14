"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function Messages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const msgEnd = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.status === 401) { setError("Connecte-toi pour accéder aux messages."); return; }
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);
        // Update active conversation
        if (activeConv) {
          const updated = data.find((c: any) => c.id === activeConv.id);
          if (updated) setMessages(updated.messages || []);
        }
      }
      setLoading(false);
    } catch { setLoading(false); }
  };

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.id) setMyId(d.id);
    });
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !activeConv) return;
    const conv = activeConv;
    const receiverId = conv.user1Id === myId ? conv.user2Id : conv.user1Id;
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: conv.id, receiverId, content: text })
      });
      setText("");
      fetchMessages();
    } catch {}
  };

  if (loading) return <main className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Chargement...</div></main>;
  if (error) return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-4xl mb-4">💬</div>
      <p className="text-gray-300 mb-6">{error}</p>
      <Link href="/auth/login" className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white font-bold">Se connecter</Link>
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white flex">
      <Navbar />
      <div className="flex w-full pt-16 h-screen">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/5 p-4 overflow-y-auto hidden md:block">
          <h2 className="text-lg font-bold mb-4">Messages</h2>
          {conversations.length === 0 && <p className="text-gray-500 text-sm">Aucune conversation.</p>}
          {conversations.map((c: any) => {
            const other = c.user1Id === myId ? c.user2 : c.user1;
            return (
              <button key={c.id} onClick={() => { setActiveConv(c); setMessages(c.messages || []); }}
                className={`w-full text-left p-3 rounded-xl mb-1 transition-all ${activeConv?.id === c.id ? 'bg-[var(--color-premium-purple)]/20 border border-[var(--color-premium-purple)]/20' : 'hover:bg-white/[0.03]'}`}>
                <div className="font-semibold text-sm">{other?.profile?.displayName || other?.profile?.username || "Utilisateur"}</div>
                <div className="text-xs text-gray-400 truncate">{c.messages?.[c.messages.length-1]?.content || "Nouvelle conversation"}</div>
              </button>
            );
          })}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">Sélectionne une conversation</div>
          ) : (
            <>
              <div className="p-4 border-b border-white/5 font-semibold">
                {(() => {
                  const other = activeConv.user1Id === myId ? activeConv.user2 : activeConv.user1;
                  return other?.profile?.displayName || other?.profile?.username || "Utilisateur";
                })()}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && <p className="text-gray-500 text-center text-sm mt-8">Aucun message. Dis bonjour !</p>}
                {messages.map((m: any) => (
                  <div key={m.id} className={`flex ${m.senderId === myId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      m.senderId === myId 
                        ? 'bg-gradient-to-r from-[var(--color-premium-rose)]/40 to-[var(--color-premium-purple)]/30 border border-white/10' 
                        : 'bg-white/[0.06] border border-white/5'
                    }`}>
                      {m.content}
                      <div className="text-[10px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>
              <div className="p-4 border-t border-white/5 flex gap-3">
                <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Écris un message..." className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-premium-purple)]/40" />
                <button onClick={handleSend} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white font-bold">Envoyer</button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
