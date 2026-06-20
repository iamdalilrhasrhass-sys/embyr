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
  const [myLanguage, setMyLanguage] = useState<string>("fr");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<Set<string>>(new Set());
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
    // Fetch user language
    fetch("/api/profile/me/language")
      .then(r => r.json())
      .then(d => { if (d.language) setMyLanguage(d.language); })
      .catch(() => {});
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

  const handleTranslate = async (messageId: string, content: string) => {
    if (translating.has(messageId) || translations[messageId]) return;
    setTranslating(prev => new Set(prev).add(messageId));
    try {
      const res = await fetch("/api/messages/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, targetLang: myLanguage })
      });
      const data = await res.json();
      if (data.translatedText) {
        setTranslations(prev => ({ ...prev, [messageId]: data.translatedText }));
      }
    } catch {}
    setTranslating(prev => {
      const next = new Set(prev);
      next.delete(messageId);
      return next;
    });
  };

  if (loading) return <main className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Chargement...</div></main>;
  if (error) return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-4xl mb-4">💬</div>
      <p className="text-gray-300 mb-6">{error}</p>
      <Link href="/auth/login" className="px-6 py-3 rounded-full text-white font-bold"
        style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>Se connecter</Link>
    </main>
  );

  return (
    <main className="min-h-screen bg-black text-white flex">
      <Navbar />
      <div className="flex w-full pt-16 min-h-screen pb-20 md:pb-0" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
        {/* Sidebar — desktop always, mobile when no active conv */}
        <div className={`w-80 border-r border-white/5 p-4 overflow-y-auto ${!activeConv ? 'block' : 'hidden'} md:block`}>
          <h2 className="text-lg font-bold mb-4">Messages</h2>
          {conversations.length === 0 && (
            <div className="text-center py-10">
              <div className="text-3xl opacity-20 mb-3">💬</div>
              <p className="text-gray-500 text-sm mb-4">Aucune conversation pour le moment</p>
              <Link href="/membres" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Découvrir les membres →
              </Link>
            </div>
          )}
          {conversations.map((c: any) => {
            const other = c.user1Id === myId ? c.user2 : c.user1;
            return (
              <button key={c.id} onClick={() => { setActiveConv(c); setMessages(c.messages || []); }}
                className={`w-full text-left p-3 rounded-xl mb-1 transition-all ${activeConv?.id === c.id ? 'bg-cyan-500/20 border border-cyan-500/20' : 'hover:bg-white/[0.03]'}`}>
                <div className="font-semibold text-sm">{other?.profile?.displayName || other?.profile?.username || "Utilisateur"}</div>
                <div className="text-xs text-gray-400 truncate">{c.messages?.[c.messages.length-1]?.content || "Nouvelle conversation"}</div>
              </button>
            );
          })}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4 px-4">
              <div className="text-5xl opacity-20">💬</div>
              {conversations.length === 0 ? (
                <>
                  <h2 className="text-lg font-semibold text-white/60">Aucune conversation pour le moment</h2>
                  <p className="text-sm text-white/30 max-w-xs text-center">
                    Découvre les membres et lance une première discussion.
                  </p>
                  <Link href="/membres" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
                    Voir les membres
                  </Link>
                </>
              ) : (
                <p>Sélectionne une conversation</p>
              )}
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-white/5 font-semibold flex items-center gap-3">
                <button onClick={() => setActiveConv(null)} className="md:hidden text-white/60 hover:text-white transition-colors">← Retour</button>
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
                        ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-500/20 border border-white/10' 
                        : 'bg-white/[0.06] border border-white/5'
                    }`}>
                      {m.content}
                      {/* Translate button — only for received messages, and only if not already translated */}
                      {m.senderId !== myId && !translations[m.id] && (
                        <button
                          onClick={() => handleTranslate(m.id, m.content)}
                          disabled={translating.has(m.id)}
                          className="mt-1.5 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                          {translating.has(m.id) ? "Traduction..." : "🌐 Traduire"}
                        </button>
                      )}
                      {/* Show translation if available */}
                      {translations[m.id] && (
                        <div className="mt-1.5 pt-1.5 border-t border-white/10">
                          <div className="text-[10px] text-gray-500 mb-0.5">Traduction</div>
                          <div className="text-xs italic text-gray-300">{translations[m.id]}</div>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>
              <div className="p-4 border-t border-white/5 flex gap-3 items-end">
                <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Écris un message..." className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/40 text-base" style={{minHeight:"44px"}} />
                <button onClick={handleSend} className="px-6 py-3 rounded-xl text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)", minHeight:"44px" }}>Envoyer</button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
