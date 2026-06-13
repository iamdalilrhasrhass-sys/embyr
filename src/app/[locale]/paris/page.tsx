import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Embir Paris — 100 Founding Members | Free Gay Dating",
  description:
    "Join the Embir Paris launch: 100 founding members, real profiles, free messaging, no ads, no fake accounts.",
  keywords: [
    "Embir Paris",
    "gay dating Paris",
    "free gay app Paris",
    "founding members Embir",
    "gay dating no ads",
  ],
  alternates: { canonical: "https://embir.xyz/paris" },
  openGraph: {
    title: "Embir Paris — The First 100 Founding Members",
    description:
      "A local, honest, and free launch to create enough real profiles in Paris.",
    url: "https://embir.xyz/paris",
    type: "website",
  },
};

const registerHref = "/auth/register?source=paris-100-fondateurs";

const rules = [
  "Real profiles only. No fake accounts to inflate numbers.",
  "Free launch. Messages, profiles, and discovery all open during the founding phase.",
  "Paris first. We concentrate the first members in the same place to create real connections.",
  "Respect is non-negotiable. Reporting, moderation, and an adult 18+ community.",
];

const steps = [
  {
    title: "Create your profile",
    text: "Add a clear photo, your name or nickname, and what you're really looking for.",
  },
  {
    title: "Invite 2 or 3 friends",
    text: "Embir works when the community starts with real people, not empty advertising.",
  },
  {
    title: "Test for 7 days",
    text: "Tell us what's missing, what's blocking you, and what would make the app obvious for you.",
  },
];

const founderPerks = [
  "Founding member badge",
  "Free access during launch",
  "Priority on product feedback",
  "Direct influence on upcoming features",
];

export default function ParisFoundersPage() {
  return (
    <main className="emb-page min-h-screen overflow-hidden">
      <section className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-white/80" />
              Paris · local launch
            </div>

            <h1 className="font-serif text-5xl font-light leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
              The first 100
              <span className="block text-white/60">
                founding members
              </span>
              of Embir Paris.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/52">
              We won't sell you a full app if it's just starting. We do better:
              we launch Paris intentionally, with real profiles, for free, and
              enough people in the same place for real connections to happen.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={registerHref}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:opacity-90"
              >
                Join the 100 founders
              </Link>
              <Link
                href="/membres"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                View members
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/32">
              18+ only · free during launch · no ads · no fake profiles.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="rounded-[1.5rem] border border-white/[0.06] bg-white/[0.02] p-7">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">
                Public goal
              </p>
              <div className="mt-5 flex items-end gap-3">
                <span className="font-serif text-7xl font-light text-white">100</span>
                <span className="pb-3 text-lg text-white/45">real profiles</span>
              </div>
              <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm font-medium text-white/60">
                We show the goal, not a fake counter. Real numbers are tracked internally.
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/45">
                The goal isn't to look huge. The goal is to create a
                first active pocket in Paris, with people who genuinely want
                to test a healthier alternative.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {founderPerks.map((perk) => (
                  <div key={perk} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/70">
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">
              Why Paris first
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.03em] text-white">
              A dating app doesn't win with noise.
              <span className="text-white/50"> It wins with density.</span>
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/8 md:grid-cols-4">
            {rules.map((rule) => (
              <div key={rule} className="bg-[#0a0614] p-6 text-sm leading-relaxed text-white/50">
                <span className="mb-5 block h-1.5 w-10 rounded-full bg-white/40" />
                {rule}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">
              What we ask of you
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.03em] text-white">
              Three simple actions.
            </h2>
            <p className="mt-5 text-white/45">
              If you want a French gay app to truly exist, the first
              step is simple: create a real profile and invite a few trusted people.
            </p>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-sm font-bold text-white/60">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-8 text-center sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/40">
            Share this message
          </p>
          <blockquote className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            "I'm testing Embir, a new free gay dating app launching its
            first 100 members in Paris. No ads, no fake profiles,
            just a real community at the start. Join here:
            embir.xyz/paris"
          </blockquote>
          <Link
            href={registerHref}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:opacity-90"
          >
            Create my founder profile
          </Link>
        </div>
      </section>
    </main>
  );
}
