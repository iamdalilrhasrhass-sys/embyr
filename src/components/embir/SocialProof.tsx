"use client";
import { useEffect, useState, useCallback } from "react";

const EVENTS = [
  { name: "Thomas", action: "vient de s'inscrire", city: "Lyon", delay: 3000 },
  { name: "Lucas", action: "a rejoint les Ambassadeurs", city: "Marseille", delay: 8000 },
  { name: "Hugo", action: "a activé son Premium", city: "Paris", delay: 14000 },
  { name: "Nathan", action: "vient de s'inscrire", city: "Bordeaux", delay: 20000 },
  { name: "Enzo", action: "a rejoint les Ambassadeurs", city: "Lille", delay: 26000 },
  { name: "Mathis", action: "vient de s'inscrire", city: "Toulouse", delay: 32000 },
  { name: "Louis", action: "a activé son Premium", city: "Nantes", delay: 38000 },
  { name: "Gabriel", action: "a rejoint les Ambassadeurs", city: "Strasbourg", delay: 44000 },
];

export default function SocialProof() {
  const [current, setCurrent] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const showNext = useCallback(() => {
    const idx = Math.floor(Math.random() * EVENTS.length);
    setCurrent(idx);
    setVisible(true);
    setTimeout(() => setVisible(false), 4000);
  }, []);

  useEffect(() => {
    const t = setInterval(showNext, 9000);
    showNext();
    return () => clearInterval(t);
  }, [showNext]);

  if (current === null) return null;
  const e = EVENTS[current];

  return (
    <div className={`fixed bottom-6 left-4 z-[9998] transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm" style={{background:"rgba(20,5,5,0.95)", border:"1px solid rgba(255,90,31,0.2)", backdropFilter:"blur(20px)", boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
        <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{background:"var(--eb-accent)"}} />
        <div>
          <span className="text-white font-semibold">{e.name}</span>
          <span className="text-white/50"> {e.action}</span>
          <span className="text-white/30 text-xs block">{e.city}</span>
        </div>
      </div>
    </div>
  );
}
