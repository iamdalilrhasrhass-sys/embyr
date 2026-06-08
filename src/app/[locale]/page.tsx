import EmbirLogo from "@/components/brand/EmbirLogo";
import ScrollReveal from "@/components/motion/ScrollReveal";
import AuroraBackground from "@/components/motion/AuroraBackground";
import Link from "next/link";

const FEATURES = [
  {
    title: "Selfie vérifié",
    desc: "Chaque profil est authentifié. Fini les bots et les catfish. Des vrais mecs, des vraies rencontres.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Gratuit au lancement",
    desc: "Pendant le lancement, tout est gratuit : profils, messages, photos illimitées. Les fondateurs garderont un accès privilégié à vie.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
  },
  {
    title: "IA pour matcher",
    desc: "Notre IA DeepSeek analyse ta personnalité et te propose les mecs les plus compatibles. Pas de swipe aléatoire.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Zéro toxicité",
    desc: "Modération humaine + IA. Les comportements toxiques sont bannis immédiatement. Une communauté qui se respecte.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "Gratuit", label: "Au lancement" },
  { value: "7", label: "IA intelligentes" },
  { value: "25+", label: "Langues" },
  { value: "∞", label: "Messages" },
];

const COMPARISONS = [
  { feature: "Prix", grindr: "~15€/mois", embir: "Gratuit 🎉", winner: "embir" },
  { feature: "Pubs", grindr: "Partout", embir: "Zéro", winner: "embir" },
  { feature: "Swipes gratuits", grindr: "Limités", embir: "Illimités", winner: "embir" },
  { feature: "Vérification", grindr: "Optionnelle", embir: "Obligatoire", winner: "embir" },
  { feature: "IA Matching", grindr: "Non", embir: "DeepSeek", winner: "embir" },
  { feature: "Messages", grindr: "Limités", embir: "Illimités", winner: "embir" },
];

function PhonePreview() {
  return (
    <div className="relative mx-auto flex w-full max-w-[390px] justify-center lg:max-w-[430px]" aria-label="Aperçu iPhone de l'application embir.xyz">
      <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5e36]/20 blur-3xl" />
      <div className="absolute left-0 top-8 h-36 w-36 rounded-full bg-[#ff1f5a]/25 blur-2xl" />
      <div className="absolute bottom-8 right-2 h-44 w-44 rounded-full bg-[#ffa333]/18 blur-2xl" />

      <div className="absolute -left-1 top-28 h-16 w-1.5 rounded-l-full bg-[#2a2d34]" />
      <div className="absolute -right-1 top-36 h-24 w-1.5 rounded-r-full bg-[#2a2d34]" />

      <div className="relative h-[650px] w-[318px] rounded-[3.25rem] border border-white/12 bg-gradient-to-br from-[#3a3d46] via-[#111318] to-black p-[7px] shadow-[0_42px_110px_rgba(0,0,0,0.72)]">
        <div className="absolute inset-[3px] rounded-[3rem] border border-white/8 pointer-events-none" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.75rem] bg-[#090b0e]">
          <div className="absolute left-1/2 top-3 z-40 h-8 w-28 -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_8px_22px_rgba(0,0,0,0.45)]" />

          <div className="relative z-30 flex items-center justify-between px-7 pb-3 pt-4 text-[11px] font-semibold text-white/72">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="flex items-end gap-[2px]" aria-hidden="true">
                <span className="h-1.5 w-1 rounded-sm bg-white/70" />
                <span className="h-2 w-1 rounded-sm bg-white/70" />
                <span className="h-2.5 w-1 rounded-sm bg-white/70" />
              </span>
              <span className="text-[10px]">5G</span>
              <span className="h-2.5 w-5 rounded-[4px] border border-white/60 p-[1px]" aria-hidden="true">
                <span className="block h-full w-3.5 rounded-[2px] bg-white/75" />
              </span>
            </div>
          </div>

          <div className="relative z-20 flex h-[calc(100%-44px)] flex-col px-4 pb-3">
            <div className="mb-3 flex items-center justify-between">
              <EmbirLogo size="sm" />
              <button className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold text-white/65">
                Paris
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-tr from-[#171a20] via-[#24182e] to-[#ff5e36]/30 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_16%,rgba(255,163,51,0.36),transparent_30%),radial-gradient(circle_at_22%_72%,rgba(255,31,90,0.28),transparent_36%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />

              <span className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/78 backdrop-blur-md">
                📍 À 1.4 km
              </span>
              <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/72 backdrop-blur-md">
                fondateur
              </span>

              <div className="absolute inset-x-0 bottom-0 p-4 pt-20">
                <div className="rounded-[26px] border border-white/10 bg-black/38 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black tracking-[-0.03em] text-white">Lucas, 26</h3>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                  </div>
                  <p className="mt-1 text-xs text-white/58">Paris · Créateur de contenu</p>
                  <p className="mt-2 text-xs italic text-white/44">
                    “Boire un verre ce soir dans le Marais ?”
                  </p>

                  <div className="mt-4 flex justify-center gap-4">
                    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/55 transition-transform hover:scale-105" aria-label="Passer">
                      ✕
                    </button>
                    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36] font-bold text-white shadow-[0_0_20px_rgba(255,31,90,0.45)] transition-transform hover:scale-105" aria-label="Allumer">
                      🔥
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-around rounded-full border border-white/8 bg-white/[0.035] px-5 py-3 text-lg text-white/30">
              <span className="text-[#ff5e36]">🎴</span>
              <span>💬</span>
              <span>👤</span>
            </div>
            <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-white/32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="emb-page">
      {/* ───── HERO ───── */}
      <section className="relative flex min-h-[96vh] items-center overflow-hidden px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <AuroraBackground variant="embir" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-center lg:text-left">
            <ScrollReveal>
              <EmbirLogo size="lg" className="mb-8 justify-center lg:justify-start" />
            </ScrollReveal>

            <ScrollReveal delay={180}>
              <h1 className="font-serif text-5xl font-light leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                Là où les regards
                <br />
                <span className="bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] bg-clip-text text-transparent">
                  s&apos;embrasent.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={360}>
              <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/45 sm:text-xl lg:mx-0">
                Pas de chichis, pas de profils fantômes. Embir concentre ses premiers
                membres à Paris pour créer de vraies rencontres, gratuitement, sans pubs
                et sans faux compteur.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={520}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/paris"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_36px_rgba(255,31,90,0.32)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_46px_rgba(255,94,54,0.42)] sm:w-auto"
                >
                  <span>Rejoindre les 100 fondateurs</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white/72 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:w-auto"
                >
                  Créer un compte gratuit
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={700}>
              <div className="mt-14 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-8">
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="font-serif text-2xl font-light text-white/86 sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/25">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={300}>
            <PhonePreview />
          </ScrollReveal>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" className="relative py-32 px-4">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-[#d4a574]/60 uppercase">
                Pourquoi Embir
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.02em] text-white sm:text-5xl">
                Plus qu'une app,{" "}
                <span className="text-[#d4a574]">une expérience.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 150}>
                <div className="group relative bg-[#0a0614] p-8 transition-all duration-500 hover:bg-[#0d0a18]">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#d4a574]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4a574]/10 text-[#d4a574] transition-all duration-300 group-hover:bg-[#d4a574]/20 group-hover:scale-110">
                      {f.icon}
                    </div>
                    <h3 className="font-serif text-lg font-medium tracking-[-0.01em] text-white">
                      {f.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/30 font-light">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── COMPARISON ───── */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0614] via-[#0d0a18] to-[#0a0614]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <p className="font-mono text-xs font-medium tracking-[0.2em] text-[#d4a574]/60 uppercase">
                La différence
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.02em] text-white sm:text-5xl">
                Grindr vs <span className="text-[#d4a574]">Embir</span>
              </h2>
              <p className="mt-4 text-white/25 font-light">
                Pourquoi payer pour ce qui devrait être gratuit
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="overflow-hidden rounded-2xl border border-white/[0.04] bg-[#0d0a18]/50 backdrop-blur-sm">
              {/* Header */}
              <div className="grid grid-cols-3 border-b border-white/[0.04] px-6 py-4">
                <div className="text-sm font-medium tracking-wider text-white/30 uppercase"></div>
                <div className="text-sm font-medium tracking-wider text-red-300/60 uppercase text-center">Grindr</div>
                <div className="text-sm font-medium tracking-wider text-[#d4a574] uppercase text-center">Embir</div>
              </div>
              {/* Rows */}
              {COMPARISONS.map((row, i) => (
                <div key={i} className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-4 last:border-b-0 transition-colors hover:bg-white/[0.01]">
                  <div className="text-sm font-light text-white/40">{row.feature}</div>
                  <div className="text-sm text-center font-light text-white/25">{row.grindr}</div>
                  <div className="text-sm text-center font-medium text-[#d4a574]">{row.embir}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="mt-8 text-center">
              <Link
                href="/comparaison"
                className="inline-flex items-center gap-2 text-sm font-light text-white/30 hover:text-[#d4a574] transition-colors"
              >
                Comparaison détaillée
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── FONDATEUR ───── */}
      <section className="relative py-32 px-4">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-[#d4a574]/10 bg-gradient-to-br from-[#d4a574]/5 to-[#0a0614] p-12 md:p-16">
              {/* Decorative corner */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d4a574]/5 blur-3xl" />

              <div className="relative z-10 text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
                  <span className="text-xs font-medium tracking-[0.15em] text-[#d4a574]/80 uppercase">
                    Membre fondateur
                  </span>
                </div>

                <h2 className="font-serif text-4xl font-light tracking-[-0.02em] text-white sm:text-5xl">
                  Les premiers auront{" "}
                  <span className="text-[#d4a574]">tout</span>
                </h2>
                <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/30 font-light">
                  Inscris-toi maintenant et obtiens le badge Fondateur à vie.
                  Accès anticipé aux futures fonctionnalités premium — sans jamais payer.
                </p>

                <Link
                  href="/auth/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-medium text-[#0a0614] transition-all duration-500 hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]"
                >
                  Devenir membre fondateur
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── CTA FINAL ───── */}
      <section className="relative pb-32 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <h2 className="font-serif text-4xl font-light tracking-[-0.02em] text-white sm:text-5xl">
              Prêt à rencontrer
              <br />
              <span className="text-[#d4a574]">des vrais mecs ?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-sm text-base leading-relaxed text-white/25 font-light">
              Gratuit. Safe. Sans algorithme opaque.
              <br />
              Juste toi et les mecs qui te correspondent vraiment.
            </p>

            <div className="mt-10">
              <Link
                href="/auth/register"
                className="group relative inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-medium text-[#0a0614] transition-all duration-500 hover:bg-[#e8c4a2] hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]"
              >
                <span>Créer mon profil</span>
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <p className="mt-6 text-xs text-white/15 font-light">
              Déjà membre ?{" "}
              <Link href="/auth/login" className="text-[#d4a574]/60 hover:text-[#d4a574] underline underline-offset-4 transition-colors">
                Connecte-toi
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
