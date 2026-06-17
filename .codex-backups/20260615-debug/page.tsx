import EmbirLogo from "@/components/brand/EmbirLogo";
import ScrollReveal from "@/components/motion/ScrollReveal";
import AuroraBackground from "@/components/motion/AuroraBackground";
import TiltCard from "@/components/motion/TiltCard";
import SchemaOrg from "@/components/seo/SchemaOrg";
import Particles3D from "@/components/Particles3D";
import {
  ScrollSection,
  AuroraBubbles,
  DepthLayer,
  ParallaxHero,
  Rotating3DRing,
} from "@/components/VibeEffects";
import Link from "next/link";

export const revalidate = 3600;

const FEATURES = [
  {
    title: "Verified Profiles",
    desc: "Selfie verification, visible intent, and stronger moderation. Meet real people instead of bots or catfish.",
    icon: (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>),
  },
  {
    title: "Free At Launch",
    desc: "Profiles, messages, discovery, and compatibility tools stay free during the founding phase. Freemium comes later.",
    icon: (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>),
  },
  {
    title: "Compatibility First",
    desc: "Orientation, preferences, relationship intent, lifestyle, and conversation energy determine who you see.",
    icon: (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>),
  },
  {
    title: "Safer Community",
    desc: "Human and automated moderation, reporting, privacy controls, and founding-member culture set the tone from day one.",
    icon: (<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>),
  },
];

const COMPARISONS = [
  { feature: "Audience", legacy: "Narrower", embir: "All orientations" },
  { feature: "Launch access", legacy: "Freemium limits", embir: "Free core app" },
  { feature: "Discovery", legacy: "Distance-led", embir: "Compatibility-led" },
  { feature: "Verification", legacy: "Optional", embir: "Core trust layer" },
  { feature: "Markets", legacy: "Global legacy", embir: "France · UK · USA" },
  { feature: "Community", legacy: "Transactional", embir: "Founder culture" },
];

const MARKETS = [
  { city: "France", focus: "Paris, then major cities", detail: "A French foundation for verified, safer, inclusive dating across every orientation." },
  { city: "United Kingdom", focus: "London and urban density", detail: "For people tired of noisy swiping, expensive subscriptions, and unclear intent." },
  { city: "United States", focus: "New York and coastal communities", detail: "A founder-led entry for users who want compatibility, privacy, and a cleaner freemium." },
];

function PhonePreview() {
  return (
    <div className="emb-phone-wrapper" aria-label="iPhone preview of Embir">
      <div className="relative mx-auto flex w-full max-w-[390px] justify-center lg:max-w-[430px]">
        <div className="relative h-[640px] w-[310px] rounded-[3.5rem] border border-white/[0.06] bg-gradient-to-b from-[#1a1d24] to-black p-[8px] shadow-[0_50px_120px_rgba(0,0,0,0.7),0_0_80px_rgba(212,165,116,0.05)]">
          <div className="absolute inset-[4px] rounded-[3.25rem] border border-white/[0.03] pointer-events-none" />
          <div className="relative h-full w-full overflow-hidden rounded-[2.75rem] bg-[#0a0c10]">
            <div className="absolute left-1/2 top-3 z-40 h-7 w-28 -translate-x-1/2 rounded-full bg-black border border-white/[0.04]" />
            <div className="relative z-30 flex items-center justify-between px-8 pb-3 pt-4 text-[10px] font-semibold text-white/40"><span>9:41</span><div className="flex items-center gap-1"><span className="h-2.5 w-4 rounded border border-white/20 p-[1px]"><span className="block h-full w-3 rounded bg-white/40" /></span></div></div>
            <div className="relative z-20 flex h-[calc(100%-40px)] flex-col px-4 pb-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36] shadow-[0_0_25px_rgba(255,31,90,0.25)]"><span className="h-1/3 w-1/3 rounded-full bg-white" /></span>
                  <span className="text-lg font-bold tracking-tight text-white">embir<span className="text-[#ff5e36]">.</span></span>
                </div>
                <span className="rounded-full border border-white/[0.04] bg-white/[0.02] px-2.5 py-1 text-[10px] font-medium text-white/30">FR · UK · US</span>
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[2.25rem] border border-white/[0.04] bg-gradient-to-b from-[#171a20] to-[#1a1020]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/50 backdrop-blur-md"><span className="h-1.5 w-1.5 rounded-full bg-[#ff5e36]" />1.4 km away</span>
                <span className="absolute right-3 top-3 rounded-full border border-white/[0.06] bg-black/40 px-2.5 py-0.5 text-[10px] font-medium text-white/40 backdrop-blur-md">founder</span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="rounded-[24px] border border-white/[0.04] bg-black/55 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-2"><h3 className="text-lg font-bold tracking-tight text-white">Maya, 29</h3><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span></div>
                    <p className="mt-1 text-xs text-white/35">Founder member · verified</p>
                    <p className="mt-2 text-xs italic text-white/25">&quot;Kind, direct, real chemistry.&quot;</p>
                    <div className="mt-4 flex justify-center gap-3">
                      <button className="flex-1 py-2.5 rounded-full border border-white/[0.04] bg-white/[0.03] text-xs font-medium text-white/30">Pass</button>
                      <button className="flex-1 py-2.5 rounded-full bg-white text-xs font-semibold text-black">Like</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-around rounded-full border border-white/[0.03] bg-white/[0.01] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-white/15"><span className="text-[#ff5e36]">Discover</span><span>Messages</span><span>Me</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="emb-page">
      <SchemaOrg />

      {/* ═══════════ HERO SUPERNOVA ═══════════ */}
      <ParallaxHero>
        <section className="relative flex min-h-[100vh] items-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 lg:px-8">
          <AuroraBackground variant="embir" />

          {/* Liquid gradient mesh */}
          <div className="emb-liquid-mesh" />

          <Particles3D count={80} />

          {/* Mega orbs */}
          <div className="emb-hero-orb emb-hero-orb-1 emb-breath" />
          <div className="emb-hero-orb emb-hero-orb-2 emb-breath" style={{ animationDelay: "-3s" }} />
          <div className="emb-hero-orb emb-hero-orb-3 emb-breath" style={{ animationDelay: "-6s" }} />

          <AuroraBubbles count={30} colors={["#ffa333","#ff5e36","#ff1f5a","#d4a574","#c4956a","#f59e0b"]} />

          <Rotating3DRing speed={36} className="absolute top-[5%] right-[-8%] hidden lg:block pointer-events-none z-[3]">
            <div className="h-[36rem] w-[36rem] rounded-full border border-[#d4a574]/3" style={{background:"radial-gradient(circle, rgba(212,165,116,0.02) 0%, transparent 55%)"}} />
          </Rotating3DRing>

          {/* Mouse-driven parallax layers */}
          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="text-center lg:text-left">
              {/* Logo — depth 1 */}
              <div className="emb-parallax-layer" data-depth="0.5">
                <EmbirLogo size="lg" className="mb-12 justify-center lg:justify-start" />
              </div>

              {/* Title — depth 2 */}
              <div className="emb-parallax-layer" data-depth="1">
                <h1 className="emb-super-title text-6xl sm:text-8xl md:text-[7rem] lg:text-[8rem] text-white">
                  <span className="emb-word">Where</span>{" "}
                  <span className="emb-word emb-gradient-text-super">every</span>{" "}
                  <span className="emb-word emb-gradient-text-super">look</span>
                  <br />
                  <span className="emb-word text-white/80">ignites</span>{" "}
                  <span className="emb-word text-white/60">something</span>
                  <br />
                  <span className="emb-word text-white/20 font-light italic">real.</span>
                </h1>
              </div>

              {/* Subtitle — depth 1.5 */}
              <div className="emb-parallax-layer mt-10" data-depth="1.5">
                <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/30 sm:text-xl lg:mx-0" style={{textShadow:"0 2px 4px rgba(0,0,0,0.6)"}}>
                  Free at launch. France, UK, United States.
                  <br />
                  Built around orientation, compatibility, and verified profiles.
                </p>
              </div>

              {/* CTA — depth 2 */}
              <div className="emb-parallax-layer mt-12" data-depth="2">
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link href="/auth/register" className="emb-cta-mega group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] px-12 py-5.5 text-base font-bold text-white shadow-[0_25px_70px_rgba(255,31,90,0.35)] transition-all duration-500 sm:w-auto"
                  >
                    <span className="relative z-10">Join as a founder</span>
                    <svg className="relative z-10 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    <div className="absolute inset-0 -translate-x-full animate-[embCtaShimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                  </Link>
                  <Link href="/auth/register" className="inline-flex w-full items-center justify-center rounded-full border border-white/6 bg-white/[0.02] px-10 py-5.5 text-base font-semibold text-white/50 backdrop-blur-xl transition-all hover:border-white/12 hover:bg-white/[0.05] hover:text-white sm:w-auto">
                    Create a free profile
                  </Link>
                </div>
              </div>

              {/* Stats — depth 2.5 */}
              <div className="emb-parallax-layer mt-16 grid grid-cols-3 gap-6 sm:flex sm:gap-12" data-depth="2.5">
                {["100% Free","FR · UK · US","25+ Languages"].map((v,i) => (
                  <div key={v} className="text-center lg:text-left group cursor-default">
                    <div className="emb-stat-super text-3xl sm:text-5xl" style={{animationDelay:`${0.2*i}s`}}>{v.split(" ")[0]}</div>
                    <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15">{v.split(" ").slice(1).join(" ")}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone — depth 3 */}
            <div className="emb-parallax-layer" data-depth="3">
              <DepthLayer depth={0.9}>
                <TiltCard intensity={12}>
                  <PhonePreview />
                </TiltCard>
              </DepthLayer>
            </div>
          </div>
        </section>
      </ParallaxHero>

      {/* Divider */}
      <div className="emb-section-divider" />
      <div className="emb-glow-divider" />

      {/* ═══════════ FEATURES — EXTREME GLASS ═══════════ */}
      <ScrollSection speed={0.4}>
        <section id="features" className="relative py-28 px-4 emb-reveal-on-scroll">
          <AuroraBubbles count={6} colors={["#d4a574","#ffa333"]} />
          <div className="mx-auto max-w-6xl relative z-10">
            <ScrollReveal>
              <div className="mb-24 text-center">
                <div className="emb-float-badge inline-flex items-center gap-3 rounded-full border border-[#d4a574]/10 bg-[#d4a574]/3 px-5 py-2 mb-8 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-[#d4a574]/50 uppercase">Why Embir</span>
                </div>
                <h2 className="emb-section-title text-5xl sm:text-7xl text-white">
                  More than swiping.
                  <br />
                  <span className="text-[#d4a574]">A compatibility layer.</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 100}>
                  <div className="emb-glass-extreme rounded-2xl p-8 min-h-[340px] flex flex-col group cursor-default">
                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4a574]/8 to-[#d4a574]/3 text-[#d4a574] transition-all duration-700 group-hover:from-[#d4a574]/15 group-hover:to-[#d4a574]/8 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(212,165,116,0.12)]">
                      {f.icon}
                    </div>
                    <h3 className="font-serif text-2xl font-medium tracking-[-0.02em] text-white mb-3 group-hover:text-[#d4a574] transition-colors duration-500">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/20 font-light flex-1">
                      {f.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      <div className="emb-glow-divider" />

      {/* ═══════════ MARKETS ═══════════ */}
      <ScrollSection speed={0.35}>
        <section className="relative px-4 py-28 overflow-hidden">
          <AuroraBubbles count={8} colors={["#ffa333","#d4a574","#ff5e36"]} />
          <div className="mx-auto max-w-6xl relative z-10">
            <ScrollReveal>
              <div className="mb-20 max-w-3xl">
                <div className="emb-section-eyebrow">International launch</div>
                <h2 className="emb-section-title mt-6 text-5xl sm:text-7xl text-white">
                  Built for{" "}
                  <span className="text-[#d4a574]">France, the UK,</span>
                  <br />
                  <span className="text-[#d4a574]">and the United States</span>
                  <span className="text-white/20"> from day one.</span>
                </h2>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/20">
                  Focused founder communities. Verified people. Compatible discovery. Safer conversations.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 md:grid-cols-3">
              {MARKETS.map((m, i) => (
                <ScrollReveal key={m.city} delay={i * 150}>
                  <div className="emb-glass-extreme rounded-2xl p-10 min-h-[320px] group cursor-default">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/10">0{i+1}</p>
                    <h3 className="mt-8 font-serif text-5xl font-light text-white group-hover:text-[#d4a574] transition-colors duration-500">{m.city}</h3>
                    <div className="emb-accent-line" />
                    <p className="text-sm font-semibold text-[#d4a574]/60">{m.focus}</p>
                    <p className="mt-5 text-sm leading-relaxed text-white/20">{m.detail}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      <div className="emb-glow-divider" />

      {/* ═══════════ COMPARISON ═══════════ */}
      <ScrollSection speed={0.3}>
        <section className="relative py-28 px-4">
          <AuroraBubbles count={4} colors={["#d4a574"]} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0614] via-[#0b0718] to-[#0a0614]" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <ScrollReveal>
              <div className="mb-20 text-center">
                <div className="emb-section-eyebrow">The difference</div>
                <h2 className="emb-section-title mt-6 text-5xl sm:text-7xl text-white">
                  Legacy apps vs{" "}
                  <span className="text-[#d4a574]">Embir</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="overflow-hidden rounded-3xl border border-white/[0.03] bg-white/[0.01] backdrop-blur-sm">
                <div className="grid grid-cols-3 border-b border-white/[0.02] px-8 py-5">
                  <div className="text-xs font-semibold tracking-[0.2em] text-white/15 uppercase"></div>
                  <div className="text-xs font-semibold tracking-[0.15em] text-red-300/30 uppercase text-center">Legacy</div>
                  <div className="text-xs font-semibold tracking-[0.15em] text-[#d4a574]/50 uppercase text-center">Embir</div>
                </div>
                {COMPARISONS.map((r, i) => (
                  <div key={i} className="emb-table-row grid grid-cols-3 border-b border-white/[0.01] px-8 py-6 last:border-b-0">
                    <div className="text-sm font-light text-white/30">{r.feature}</div>
                    <div className="text-sm text-center font-light text-white/15">{r.legacy}</div>
                    <div className="text-sm text-center font-semibold text-[#d4a574] emb-check-glow">{r.embir} <span className="text-[#d4a574]/25">✓</span></div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollSection>

      <div className="emb-glow-divider" />

      {/* ═══════════ FOUNDER CTA MEGA ═══════════ */}
      <ScrollSection speed={0.5}>
        <section className="relative py-28 px-4">
          <AuroraBubbles count={20} colors={["#ffa333","#ff5e36","#d4a574"]} />
          <div className="mx-auto max-w-3xl relative z-10">
            <ScrollReveal>
              <div className="emb-founder-cta rounded-3xl p-14 md:p-20 text-center">
                <div className="emb-float-badge mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#d4a574]/12 bg-[#d4a574]/3 px-6 py-2.5 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#d4a574] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4a574]" />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-[#d4a574]/60 uppercase">Founding community</span>
                </div>

                <h2 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-light tracking-[-0.04em] text-white leading-[0.95]">
                  Launch free.
                  <br />
                  <span className="emb-gradient-text-super">Fair freemium</span>
                  <br />
                  <span className="text-white/20 text-5xl sm:text-6xl">later.</span>
                </h2>

                <p className="mx-auto mt-10 max-w-lg text-lg leading-relaxed text-white/20 font-light">
                  Sign up now. Shape the first communities. Founder members
                  earn a permanent badge and privileged access.
                </p>

                <Link href="/auth/register"
                  className="emb-cta-mega mt-10 inline-flex items-center gap-3 rounded-full bg-[#d4a574] px-14 py-5.5 text-lg font-bold text-[#0a0614] transition-all duration-700 hover:bg-[#e8c4a2] relative overflow-hidden group"
                >
                  <span className="relative z-10">Become a founder</span>
                  <svg className="relative z-10 h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                  <div className="absolute inset-0 -translate-x-full animate-[embCtaShimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
                </Link>

                <p className="mt-8 text-xs text-white/10 font-light">Free at launch · No credit card · 25+ languages</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ScrollSection>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative pb-40 px-4">
        <AuroraBubbles count={6} colors={["#d4a574","#ff5e36"]} />
        <div className="mx-auto max-w-2xl text-center relative z-10">
          <h2 className="emb-section-title text-5xl sm:text-7xl text-white">
            Ready to meet{" "}
            <span className="text-[#d4a574]">compatible people?</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-white/15 font-light">
            Free at launch. Safer by design.
          </p>
          <div className="mt-10">
            <Link href="/auth/register" className="emb-cta-mega group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36] px-14 py-5.5 text-lg font-bold text-white shadow-[0_25px_70px_rgba(255,31,90,0.3)] transition-all duration-500">
              <span className="relative z-10">Join Embir — free</span>
              <svg className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              <div className="absolute inset-0 -translate-x-full animate-[embCtaShimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="mobile-cta-bar">
        <Link href="/auth/register" className="mobile-cta-primary">Join as a founder — free</Link>
      </div>

      <style dangerouslySetInnerHTML={{__html:`@keyframes embCtaShimmer{0%{transform:translateX(-100%) skewX(-20deg)}100%{transform:translateX(200%) skewX(-20deg)}}`}} />
    </main>
  );
}
