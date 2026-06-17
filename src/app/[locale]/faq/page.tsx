import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embir FAQ — Free dating platform questions and answers | Embir",
  description:
    "Frequently asked questions about Embir — the free-at-launch dating platform for every orientation. Pricing, safety, verified profiles, compatibility, and the future freemium model.",
  alternates: {
    canonical: "https://embir.xyz/faq",
  },
  openGraph: {
    title: "Embir FAQ — Free dating platform questions and answers",
    description:
      "Is Embir really free? Is it open to all orientations? How does verification work? Find clear answers about the Embir dating platform.",
    url: "https://embir.xyz/faq",
    type: "website",
    siteName: "Embir",
    images: [{ url: "https://embir.xyz/og-image.png", width: 1200, height: 630, alt: "Embir FAQ" }],
  },
};

const faqItems = [
  {
    q: "Is Embir really free?",
    a: "Yes. Embir is completely free during the launch phase so the founding community can test profiles, discovery, messaging and compatibility before any paid options arrive. When the freemium model launches later, core features will remain free and premium options will be clearly marked — no hidden paywalls on essential functions.",
  },
  {
    q: "Is Embir open to all orientations?",
    a: "Yes. Embir is designed for all adults 18+, across every orientation and identity — straight, gay, lesbian, bisexual, transgender, queer, and everyone who wants clearer, more respectful dating. You set your orientation and preferences from the start, and Embir adapts discovery around them instead of forcing everyone into the same swipe feed.",
  },
  {
    q: "How does Embir keep profiles real?",
    a: "Embir uses a combination of selfie verification, behavioral signals, community reporting, and human moderation. Verified profiles show a badge. Suspicious accounts are flagged and reviewed. The goal is a community where you can trust that the person you are talking to is who they say they are — without turning verification into a barrier to joining.",
  },
  {
    q: "How is Embir different from other dating apps?",
    a: "Most dating apps rely on infinite swiping and lock the best features behind a subscription. Embir prioritises orientation-aware preferences, compatibility signals, verified profiles, and a time-limited discovery model that rewards quality over volume. Instead of showing you hundreds of faces per hour, Embir helps you find fewer, better matches.",
  },
  {
    q: "When will the mobile apps be available?",
    a: "Embir is launching first as a web app (progressive web app — installable on your home screen) so the founding community can shape the product before iOS and Android apps are built. The PWA already works on mobile with push notifications, offline support, and full functionality. Native mobile apps will follow based on community feedback and demand.",
  },
  {
    q: "What will the freemium model look like?",
    a: "The future freemium model will be transparent: core discovery, messaging, and profile creation will stay free. Premium features will likely include advanced filters, visibility boosts, read receipts, and extra universe customisation — all clearly marked with a price, never hidden behind a vague 'subscribe to see who liked you' wall. The goal is to fund safety, moderation, and mobile development without exploiting loneliness.",
  },
  {
    q: "Is Embir available in my country?",
    a: "Embir is launching first in France, Switzerland, the United Kingdom, and the United States. If you are outside these markets, you can still join as a founding member — the platform works globally. Additional countries will be added based on community demand and localization readiness.",
  },
  {
    q: "How does Embir protect my privacy?",
    a: "Embir does not sell your data. Profile visibility controls let you choose who sees you. You can browse in discreet mode, block and report anyone, and delete your account and all associated data at any time. Privacy and safety are built into the product architecture, not bolted on as an afterthought.",
  },
];

const faqGraph = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FaqPage() {
  return (
    <main
      className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8"
      style={{ background: "#0a0614", color: "rgba(255,255,255,0.9)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqGraph) }}
      />

      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/75">
          Frequently asked questions
        </p>
        <h1 className="mt-4 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          Embir FAQ
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Clear answers about the free-at-launch dating platform built for every
          orientation.
        </p>

        <div className="mt-12 space-y-6">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="group rounded-3xl border border-white/[0.07] bg-white/[0.025] transition hover:border-[#d4a574]/20"
            >
              <summary className="cursor-pointer p-7 text-lg font-semibold text-white/85 list-none [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <div className="px-7 pb-7 text-base leading-relaxed text-white/50">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <p className="text-white/60">
            Did not find your answer?{" "}
            <a href="mailto:contact@embir.xyz" className="text-[#d4a574] underline underline-offset-2">
              contact@embir.xyz
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
