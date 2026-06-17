import Link from "next/link";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

const proofPoints = [
  {
    title: "Welcome to my world",
    text: "Embir is not a swipe app. Profiles are immersive personal universes where you express your true self through visuals, preferences and lifestyle.",
  },
  {
    title: "Free at launch",
    text: "Core access starts free so the first members can build the community before paid options arrive.",
  },
  {
    title: "Built for every orientation",
    text: "Embir is for adults across orientations, identities and dating intentions, with clearer preferences from day one.",
  },
  {
    title: "Deep compatibility",
    text: "Discovery is shaped by orientation, preferences, intent, and behavioral compatibility instead of swipe volume alone.",
  },
  {
    title: "Verified profiles and safety",
    text: "Verification, reporting, moderation and privacy controls are part of the product foundation.",
  },
  {
    title: "Future freemium model",
    text: "The future freemium model will be transparent and fund safety, moderation, mobile apps and algorithms.",
  },
];

const markets = [
  {
    name: "France",
    focus: "Paris first, then major cities",
    href: "/fr",
  },
  {
    name: "UK",
    focus: "London, Manchester, Birmingham and urban communities",
    href: "/uk",
  },
  {
    name: "US",
    focus: "New York, Los Angeles, Miami and early coastal demand",
    href: "/us",
  },
  {
    name: "Switzerland",
    focus: "Zurich, Geneva, Lausanne and border regions",
    href: "/switzerland",
  },
];

export default function Home() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <SchemaOrg />

      <section className="mx-auto grid max-w-7xl gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
            France · Switzerland · UK · US
          </p>
          <h1 className="mt-8 max-w-5xl font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl">
            Free dating app for every orientation — France, Switzerland, UK &amp; US
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/58 sm:text-xl">
            Free at launch. Built for France, Switzerland, the UK and the United States. Embir helps people meet through immersive universes, deep compatibility, verified profiles, and shared intentions.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/early-access"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
            >
              Request early access
            </Link>
            <Link
              href="/auth/register"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/75 transition hover:border-[#d4a574]/35 hover:text-white"
            >
              Create my universe
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/38">
            <span>Accès fondateur</span>
            <span>·</span>
            <span>Welcome to my world</span>
            <span>·</span>
            <span>Compatibilité profonde</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="rounded-[1.5rem] border border-white/[0.06] bg-[#0d0816] p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">embir<span className="text-[#ff5e36]">.</span></span>
              <span className="rounded-full border border-[#d4a574]/20 px-3 py-1 text-xs text-[#d4a574]">founder phase</span>
            </div>
            <div className="mt-8 space-y-4">
              {["Orientation", "Preferences", "Compatibility", "Verified safety"].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/82">{item}</span>
                    <span className="text-xs text-white/32">0{index + 1}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#d4a574]"
                      style={{ width: `${72 + index * 6}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-white/45">
              Join the founding community before Embir becomes freemium.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {markets.map((market) => (
            <Link
              key={market.name}
              href={market.href}
              prefetch={false}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7 transition hover:border-[#d4a574]/25 hover:bg-white/[0.04]"
            >
              <h2 className="font-serif text-4xl font-light text-white">{market.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/45">{market.focus}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {proofPoints.map((point) => (
            <article key={point.title} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7">
              <h2 className="font-serif text-3xl font-light text-white">{point.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/45">{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/75">Founder access</p>
        <h2 className="mt-5 font-serif text-4xl font-light text-white sm:text-6xl">
          Ready to create your universe?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/45">
          Free at launch. Built for every orientation. Designed around immersive personal universes, deep compatibility, verified profiles and a safer community culture.
        </p>
        <Link
          href="/early-access"
          prefetch={false}
          className="mt-8 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
        >
          Request my early access
        </Link>
      </section>
    </main>
  );
}
