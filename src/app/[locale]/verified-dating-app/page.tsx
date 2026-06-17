import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verified Dating App — Selfie-Checked Profiles, Real People | Embir",
  description: "Embir verifies profiles by selfie to reduce fake accounts. No catfish, fewer bots, more real connections. Free during launch for founding members.",
  alternates: {
    canonical: "https://embir.xyz/verified-dating-app",
    languages: { "fr": "https://embir.xyz/fr/profils-verifies" },
  },
  openGraph: {
    title: "Verified Dating App — Selfie-Checked Profiles, Real People | Embir",
    description: "Embir verifies profiles by selfie to reduce fake accounts. No catfish, fewer bots, more real connections. Free during launch for founding members.",
    url: "https://embir.xyz/verified-dating-app",
    locale: "en_US",
    siteName: "Embir",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Embir verified dating" }],
  },
  twitter: { card: "summary_large_image", title: "Verified Dating App — Selfie-Checked Profiles, Real People | Embir", description: "Embir verifies profiles by selfie to reduce fake accounts. No catfish, fewer bots, more real connections.", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Trust</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Verified dating: know who you&apos;re talking to</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          The biggest frustration with dating apps isn&apos;t the matching. It&apos;s discovering the person you&apos;ve been talking to doesn&apos;t exist. Embir tackles this head-on with selfie verification — a simple, effective barrier against fake profiles.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">How selfie verification works</h2>
            <p className="mt-4">When you create your profile, you can verify it by taking a real-time selfie. Our system compares this selfie with your profile photos. If they match, you get a verified badge on your profile. This tells everyone you&apos;re a real person — not a catfish, not a bot, not someone using stolen photos.</p>
            <p className="mt-3">Verification is optional but strongly encouraged. Profiles without the badge aren&apos;t penalized, but verified profiles tend to get more genuine interactions because other members know they&apos;re real.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Why verification matters</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Fewer fake profiles", "Selfie verification creates a real barrier. Creating a fake account requires passing a live photo check, which is significantly harder than uploading stolen photos."],
                ["Less catfishing", "Catfishing relies on fake photos. Verification makes it much harder to pretend to be someone else. Reported catfish accounts are investigated and removed."],
                ["More trust, faster", "When you see the verified badge, you can skip the 'are they real?' phase and focus on whether you're actually compatible."],
                ["Safer first dates", "Meeting someone who has verified their identity reduces one major risk. You still need to practice normal safety precautions, but at least you know the person matches their photos."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">Honest limits: what verification doesn&apos;t do</h2>
            <p className="mt-4">Let&apos;s be transparent. Selfie verification confirms a person is real and matches their photos. It does NOT guarantee good intentions, honesty about age or relationship status, or safe behavior. A verified badge doesn&apos;t mean &quot;this person is safe&quot; — it means &quot;this person passed a photo check.&quot;</p>
            <p className="mt-3">That&apos;s why Embir combines verification with other safety layers: human moderation, easy reporting, instant blocking, and clear community rules. No single tool guarantees safety — the combination of tools reduces risk.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Beyond verification: our trust layers</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Reporting", "Every profile and conversation has a one-tap report button. Reports go to human moderators, not just an algorithm."],
                ["Blocking", "Block anyone instantly. They lose all access to your profile and messages. No appeals, no workarounds."],
                ["Moderation", "Our team reviews reports daily. Fake profiles are removed. Harassment gets accounts suspended or banned."],
                ["Preferences & visibility", "Your orientation and preference settings control who can see your profile. This reduces unwanted attention before it happens."],
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
                ["Is verification mandatory?", "No, but we strongly encourage it. Verified profiles tend to have better experiences because other members trust them more quickly."],
                ["What happens to my verification selfie?", "It is compared with your profile photos and then discarded. It is not stored, displayed, or shared. The only thing that remains is your verified badge."],
                ["Can someone fake the selfie verification?", "No system is perfect, but live selfie verification is significantly harder to fake than uploading static photos. We continuously improve our detection."],
                ["What if someone with a verified badge harasses me?", "Report them. Verification doesn't protect anyone from the consequences of bad behavior. Verified users who violate community rules lose their accounts just like anyone else."],
                ["Does Embir sell my verification data?", "No. Embir does not sell any user data. Our business model is a future freemium, not data monetization."],
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
          <h2 className="font-serif text-3xl text-white">Join a verified community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your profile, verify it by selfie, and meet real people who&apos;ve done the same. Free during launch.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free verified profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/safety", "Safety tools"],
              ["/moderation", "How we moderate"],
              ["/age-verification", "Age verification"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/about", "About Embir"],
              ["/freemium", "Freemium model"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
