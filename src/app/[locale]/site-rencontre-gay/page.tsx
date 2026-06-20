import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Dating App — Inclusive, Verified & Free at Launch | Embir",
  description: "Embir is a dating platform for all orientations including gay men. Verified profiles, preference-based matching, safer discovery, and free during launch.",
  alternates: {
    canonical: "https://embir.xyz/site-rencontre-gay",
    languages: { "fr": "https://embir.xyz/fr/site-rencontre-gay" },
  },
  openGraph: {
    title: "Gay Dating App — Inclusive, Verified & Free at Launch | Embir",
    description: "Embir is a dating platform for all orientations including gay men. Verified profiles, preference-based matching, safer discovery, and free during launch.",
    url: "https://embir.xyz/site-rencontre-gay",
    locale: "en_US",
    siteName: "Embir",
    images: [`/api/og?title=Gay+Dating+App+—+Inclusive,+Verified+&+Free+at+Launch+%7C+Embir&variant=market`],
  },
  twitter: { card: "summary_large_image", title: "Gay Dating App — Inclusive, Verified & Free at Launch | Embir", description: "Embir is a dating platform for all orientations including gay men. Verified profiles, preference-based matching, safer discovery, and free during launch." },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Community</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Gay dating, done with respect</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Embir is not just another gay dating app. It&apos;s a platform for all orientations — including gay, bi, queer and questioning men — built on verified profiles, real compatibility, and a free-at-launch model that lets you test everything before any premium options arrive.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">More than a grid of torsos</h2>
            <p className="mt-4">Many gay dating apps reduce people to a photo grid sorted by distance. Embir takes a different approach: your profile shows who you are — your interests, your intentions, your preferences. You decide what matters. Our compatibility signals help you find men who share your values and what you&apos;re actually looking for, whether that&apos;s a serious relationship or something more casual but respectful.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Orientation-aware visibility</h2>
            <p className="mt-4">You set your orientation and preferences. Your profile is only visible to people whose preferences are compatible with yours. If you&apos;re a gay man looking for other gay men, that&apos;s who sees your profile. No awkward cross-orientation mix-ups, no unwanted attention. You control your visibility.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What makes Embir different for gay dating</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Verified, not anonymous", "Selfie verification means fewer fake profiles and catfish. You know the person you're talking to is real."],
                ["Intentions that matter", "Declare what you're looking for — relationship, casual, friends first. Filter out people whose intentions don't match."],
                ["Free during launch", "No paywall after 3 messages. Test the full experience, build your profile, and join the founding community at no cost."],
                ["Safer discovery", "Human moderation, easy reporting, and instant blocking. Your safety isn't an afterthought."],
                ["Not just one niche", "Embir welcomes everyone. Gay men share the platform with lesbians, bi people, trans people, and straight people — each seeing only compatible profiles."],
                ["No pressure, no noise", "We don't optimize for endless swiping. We optimize for connections that have a real chance."],
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
                ["Is Embir only for gay men?", "No. Embir is built for all orientations. Gay men use the same platform as everyone else but only see and are seen by compatible profiles based on their declared preferences."],
                ["Is Embir a Grindr alternative?", "Yes, especially if you're looking for more substance than instant proximity. Embir focuses on compatibility, verified profiles, and clearer intentions — not just distance."],
                ["Is Embir really free for gay dating?", "Yes, during the launch phase. Core features — profiles, discovery, messaging, matching — are free. A freemium model may come later to fund the mobile app, safety tools, and moderation. Founding members will be informed in advance."],
                ["How does Embir protect gay users?", "Your orientation settings control who sees your profile. Reporting and blocking are instant. Our human moderation team reviews every report. We take anti-gay harassment seriously."],
                ["When is the mobile app coming?", "The mobile app is in development. The web version works on mobile browsers. All founding members will be notified when the native app launches."],
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
          <h2 className="font-serif text-3xl text-white">Join the founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your verified profile for free and help build a healthier gay dating space — one where respect and compatibility come first.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/grindr-alternative", "Grindr alternative"],
              ["/tinder-alternative", "Tinder alternative"],
              ["/lgbtq-dating-app", "LGBTQ dating app"],
              ["/verified-dating-app", "Verified dating"],
              ["/safety", "Safety tools"],
              ["/about", "About Embir"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
