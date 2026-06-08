'use client';

import EmbirLogo from "@/components/brand/EmbirLogo";

export default function EmbyrProductMockup() {
  const profiles = [
    { name: 'Lucas', meta: 'Paris · actif', score: '94%' },
    { name: 'Rayan', meta: 'Marais · vérifié', score: '88%' },
    { name: 'Gabriel', meta: '11e · fondateur', score: '91%' },
  ];

  return (
    <div className="relative mx-auto max-w-xs sm:max-w-sm">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,94,54,0.22),transparent_62%)] blur-3xl" />

      <div className="relative mx-auto h-[560px] w-[280px] overflow-hidden rounded-[2.75rem] border border-white/10 bg-[#09090b] p-[6px] shadow-[0_42px_120px_rgba(0,0,0,0.72),0_0_70px_rgba(255,90,0,0.12)]">
        <div className="h-full overflow-hidden rounded-[2.35rem] bg-gradient-to-b from-[#121016] via-[#09090b] to-black">
          <div className="flex items-center justify-between px-6 pt-4 text-[10px] font-semibold text-white/55">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5e36]" />
              <span>5G</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-4">
            <EmbirLogo size="sm" showText={false} />
            <div>
              <div className="text-sm font-black tracking-[-0.06em] text-white">
                embir<span className="text-[#ff5e36]">.</span>
              </div>
              <div className="-mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/35">
                Allume l&apos;étincelle
              </div>
            </div>
            <div className="ml-auto rounded-full border border-[#ff5e36]/20 bg-[#ff5e36]/10 px-2 py-0.5 text-[9px] font-bold text-[#ffa333]">
              Paris
            </div>
          </div>

          <div className="space-y-2.5 px-3 py-1">
            {profiles.map((profile, index) => (
              <div
                key={profile.name}
                className={`rounded-2xl border p-3 backdrop-blur ${
                  index === 0
                    ? 'border-[#ff5e36]/25 bg-[#ff5e36]/[0.06]'
                    : 'border-white/8 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#ff1f5a] to-[#ff5e36] text-sm font-bold text-white shadow-[0_0_20px_rgba(255,94,54,0.28)]">
                    {profile.name[0]}
                  </div>
                  <div className="flex-1 leading-tight">
                    <div className="text-xs font-semibold text-white">{profile.name}</div>
                    <div className="text-[10px] text-white/42">{profile.meta}</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/24 px-2 py-0.5 text-[8px] font-bold text-[#ffa333]">
                    {profile.score}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-3 mt-3 overflow-hidden rounded-2xl border border-white/8 bg-black/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff5e36] shadow-[0_0_12px_rgba(255,94,54,0.75)]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/52">
                Match intelligent
              </span>
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-[10px] leading-relaxed text-white/76">
              “Vous avez le même rythme, les mêmes quartiers et une vraie compatibilité de discussion.”
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="rounded-full bg-[#ff5e36]/10 px-2 py-0.5 text-[8px] font-semibold text-[#ffa333]">Profil vérifié</div>
              <div className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] text-white/38">Sans pub</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
