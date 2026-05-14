'use client';

export default function EmbyrProductMockup() {
  const profiles = [
    { initial: 'G', color: 'from-sky-400 to-indigo-500', badge: true },
    { initial: 'R', color: 'from-indigo-400 to-violet-500' },
    { initial: 'L', color: 'from-cyan-400 to-blue-500', badge: true },
  ];

  return (
    <div className="relative mx-auto max-w-xs sm:max-w-sm">
      {/* Phone frame */}
      <div className="relative mx-auto h-[560px] w-[280px] overflow-hidden rounded-[2.5rem] border-2 border-white/10 bg-[#030208] shadow-[0_40px_100px_rgba(6,182,212,0.15),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 text-[10px] text-white/50">
          <span>21:47</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <div className="h-2 w-2 rounded-full bg-cyan-400/60" />
            <div className="h-1 w-4 rounded bg-white/30" />
          </div>
        </div>

        {/* App header */}
        <div className="flex items-center gap-2 px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/10 text-sm font-black text-cyan-300">
            E
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Embyr</div>
            <div className="-mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/35">Club privé</div>
          </div>
          <div className="ml-auto rounded-full bg-cyan-400/15 px-2 py-0.5 text-[9px] font-bold text-cyan-300">
            Premium
          </div>
        </div>

        {/* Profile list */}
        <div className="space-y-2.5 px-3 py-1">
          {profiles.map((p, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3 backdrop-blur ${i === 0 ? 'border-cyan-400/15' : ''}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-sm font-bold text-white shadow-lg`}>
                {p.initial}
              </div>
              <div className="flex-1 leading-tight">
                <div className="text-xs font-semibold text-white">Profil {p.initial}</div>
                <div className="text-[10px] text-white/40">Paris • Actif</div>
              </div>
              {p.badge && (
                <div className="rounded-full bg-indigo-400/15 px-2 py-0.5 text-[8px] font-bold text-indigo-300">
                  Vérifié
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat preview */}
        <div className="mx-3 mt-2 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-[8px] font-bold text-white">
              G
            </div>
            <span className="text-[10px] font-semibold text-white">Guillaume</span>
            <span className="text-[8px] text-white/30">22:15</span>
          </div>
          <div className="inline-block rounded-2xl rounded-tl-sm bg-cyan-500/10 px-3 py-1.5 text-[10px] text-white/75">
            Salut, ravi de te croiser ici !
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] text-white/35">🎤 Vocal</div>
            <div className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] text-white/35">📞 Appel</div>
            <div className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] text-white/35">📹 Visio</div>
          </div>
        </div>
      </div>

      {/* Glow ring */}
      <div className="absolute -inset-8 -z-10 rounded-full bg-[conic-gradient(from_0deg,#06b6d4,#3730a3_40%,#7c3aed_70%,#06b6d4)] opacity-[0.06] blur-3xl" />
    </div>
  );
}
