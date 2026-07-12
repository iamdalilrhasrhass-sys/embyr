import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dating App in Paris — Verified Profiles, Real Compatibility | Embir",
  description: "Paris dating app: LGBTQ+ and inclusive, with verified profiles, compatibility matching, and a founding community. core connection features are free for Paris founding members.",
  alternates: {
    canonical: "https://embir.xyz/paris",
    languages: { "fr": "https://embir.xyz/fr/rencontre-paris" },
  },
  openGraph: {
    title: "Dating App in Paris — Verified Profiles, Real Compatibility | Embir",
    description: "Paris dating app: inclusive, verified profiles, compatibility matching, and a founding community. core connection features are free.",
    url: "https://embir.xyz/paris",
    locale: "en_US",
    siteName: "Embir",
    images: [{ url: `/api/og?title=Dating+App+in+Paris+—+Verified+Profiles,+Real+Compatibility+%7C+Embir&variant=default`, width: 1200, height: 630, alt: "Embir Paris dating" }],
  },
  twitter: { card: "summary_large_image", title: "Dating App in Paris | Embir", description: "Paris dating app: inclusive, verified profiles, compatibility matching.", images: [`/api/og?title=Dating+App+in+Paris+—+Verified+Profiles,+Real+Compatibility+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Paris · France</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Paris dating, with verified profiles and real compatibility</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Paris has one of the densest dating scenes in Europe — and one of the most frustrating. Millions of profiles, endless swiping, and a culture where dating apps often feel more like games than tools for genuine connection. Embir starts here with a different approach: fewer fake profiles, clearer intentions, and compatibility that goes beyond proximity.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why Paris first</h2>
            <p className="mt-4">Paris is Embir&apos;s launch city. The density, diversity, and dating culture make it the ideal place to build a founding community. Paris has everything — students, professionals, artists, international residents, LGBTQ+ communities across the Marais and beyond. But with that density comes noise: fake profiles, ghosting, and matches that never turn into conversations.</p>
            <p className="mt-3">We&apos;re building Paris city by neighborhood — starting with a core of founding members who value verification, clear intentions, and compatibility over the swipe grind. No fake counters. No inflated numbers. Just real people building a real local community.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Dating à Paris, but make it real</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Le Marais to Montmartre, verified", "Paris has distinct neighborhood cultures. Someone in the 11ème lives a different rhythm than someone in the 16ème. Embir's compatibility signals go deeper than arrondissement — they look at lifestyle, intentions, and what you actually want from dating."],
                ["Gay Paris, lesbian Paris, queer Paris", "Paris has one of Europe's richest LGBTQ+ scenes. Embir's orientation-aware visibility means you see only compatible profiles — whether you're a gay man in the Marais, a lesbian woman in Belleville, or trans and looking for people who respect your identity."],
                ["No more 'salut, ça va ?' loops", "Paris dating apps are notorious for conversations that never leave the chat. Embir encourages richer profiles — interests, preferences, intentions — so the first message can be about something real, not just breaking the ice."],
                ["Founding members, not inflated numbers", "We&apos;re not going to tell you there are 50,000 members in Paris when there aren't. The founding community starts small, verified, and real. Every member matters. Quality over quantity from day one."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">Core connections without a Parisian price tag</h2>
            <p className="mt-4">Paris isn&apos;t cheap, but Embir&apos;s core connection features are free. Create your profile, set your preferences, browse compatible people and message reciprocal connections without a credit card. Optional services are clearly separated from core connections.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What Paris founding members get</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Verified community", "Selfie verification from day one. Know you're talking to real Parisians, not bots or catfish using stolen photos."],
                ["Orientation control", "Whether you're straight, gay, lesbian, bi, trans, or queer — set who sees your profile and who you want to discover."],
                ["Compatibility signals", "Shared interests, relationship intentions, lifestyle preferences. Match on what matters, not just a photo."],
                ["Invite-only early phase", "Bring friends, build your circle. The best dating communities grow through trust, not ads."],
                ["Shape the culture", "Founding members influence moderation norms, feature priorities, and community standards. Your voice matters."],
                ["First access to mobile app", "Paris founding members will be first in line when the native iOS and Android apps launch."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["How many members does Embir have in Paris?", "Embir is in its core connection experience. We're building the Paris founding community right now — starting with a core of verified members. We don't publish inflated numbers. The community grows through invitations and word of mouth."],
                ["Is Embir only for gay dating in Paris?", "No. Embir is for all orientations. Gay and bi men use the same platform as everyone else, but orientation controls ensure everyone only sees compatible profiles. Straight, lesbian, bi, trans, and queer Parisians all share the same community."],
                ["How is Embir different from Tinder in Paris?", "Tinder in Paris is high-volume, swipe-fatigue central. Embir focuses on compatibility, verified profiles, and clearer intentions. Fewer random matches, more connections that have a real chance."],
                ["Is Embir a good Grindr alternative in Paris?", "If you want more substance than instant proximity, yes. Embir focuses on compatibility and verified profiles. It serves all orientations, not just gay men, but gay and bi men are a core part of the community."],
                ["When is the Paris mobile app launching?", "In development. The web app works on mobile browsers. Paris founding members will be first to access the native apps when they launch."],
                ["Can I invite friends to the Paris community?", "Absolutely. Inviting trusted friends is the best way to grow a quality community. The more verified, real profiles in Paris, the better the experience for everyone."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80">{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">Join the Paris founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Be among the first Paris members. Verified profile. Real compatibility. Core connection features are free. Help build a dating culture Paris deserves.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/us", "US dating"],
              ["/uk", "UK dating"],
              ["/switzerland", "Switzerland dating"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/verified-dating-app", "Verified dating"],
              ["/grindr-alternative", "Grindr alternative"],
              ["/tinder-alternative", "Tinder alternative"],
              ["/free-dating-app", "Free dating app"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
