import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Dating App — No Paywall During Launch | Embir",
  description: "Embir is free during launch: unlimited messaging, verified profiles, compatibility matching, and full discovery — all at no cost for founding members.",
  alternates: {
    canonical: "https://embir.xyz/free-dating-app",
    languages: { "fr": "https://embir.xyz/fr/application-rencontre-gratuite" },
  },
  openGraph: {
    title: "Free Dating App — No Paywall During Launch | Embir",
    description: "Embir is free during launch: unlimited messaging, verified profiles, compatibility matching, and full discovery — all at no cost for founding members.",
    url: "https://embir.xyz/free-dating-app",
    locale: "en_US",
    siteName: "Embir",
  },
  twitter: { card: "summary_large_image", title: "Free Dating App — No Paywall During Launch | Embir", description: "Embir is free during launch: unlimited messaging, verified profiles, compatibility matching.", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Free at launch</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">A dating app that&apos;s actually free during launch</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          &quot;Free dating app&quot; usually means &quot;free to download, pay to use.&quot; Embir is different. During our launch phase, every core feature is free — messaging, matching, verified profiles, compatibility discovery. No bait-and-switch.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why free at launch</h2>
            <p className="mt-4">We believe a dating platform should prove its value before asking for money. Our launch phase is about building a quality founding community, testing the matching algorithms with real people, and gathering feedback to make the product better. Charging from day one would limit who can join and slow down community growth.</p>
            <p className="mt-3">Founding members get the full experience at no cost: create a detailed profile, set your orientation and preferences, browse compatible people, send messages, and help shape the platform. When a freemium model arrives later, founding members will be the first to know — and the last to be affected.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">What&apos;s free during launch</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Profile creation", "Build a rich profile with photos, interests, preferences, and intentions. No limits on what you can share about yourself."],
                ["Unlimited messaging", "Message anyone you match with. No caps, no 'message quota,' no forcing you to upgrade to keep talking."],
                ["Compatibility discovery", "Browse profiles filtered by your preferences. See compatibility signals that help you decide who's worth reaching out to."],
                ["Selfie verification", "Get verified and earn the verified badge on your profile. No extra charge — verification should be a basic safety feature, not a premium perk."],
                ["Orientation preferences", "Set who you want to see and who can see you. Full control over your visibility based on orientation and gender."],
                ["Safety tools", "Reporting, blocking, and access to human moderation are included. Safety isn't a paid feature."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">What could become premium later</h2>
            <p className="mt-4">We&apos;re transparent about the future. A freemium model will eventually fund the mobile app, infrastructure, safety tools, human moderation, and continuous product improvement. Premium features might include: advanced compatibility filters, profile boosts for more visibility, and see-who-liked-you. But here&apos;s what won&apos;t change: core messaging, profile creation, basic discovery, and safety tools will remain accessible. No one will be forced to pay to have a basic conversation.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">How this is different from other &quot;free&quot; apps</h2>
            <p className="mt-4">Most dating apps use the same playbook: let you sign up for free, then restrict essential features — messaging, seeing who liked you, filtering by preferences — behind a paywall. The &quot;free&quot; experience is intentionally frustrating to push you toward a subscription. Embir takes the opposite approach during launch: everything is open, and we earn your trust (and eventual paid support) by being genuinely useful from day one.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Is Embir really free? No catch?", "Yes, during the launch phase. Core features — profile, discovery, messaging, matching — are free for founding members. No hidden fees, no credit card required."],
                ["When will Embir start charging?", "A freemium model will be introduced after the launch phase, once the founding community is established. All members will be informed well in advance of any changes."],
                ["What happens to founding members when freemium arrives?", "Founding members will retain access to the core free features they joined with. Premium features will be optional add-ons, not replacements for what was previously free."],
                ["Why is Embir doing this differently?", "Because we believe trust is built by delivering value first. A dating app that asks for payment before proving itself is asking for blind faith. We'd rather earn yours."],
                ["How does Embir plan to make money?", "Through a future freemium model with optional premium features. No selling user data. No intrusive advertising. Transparent, straightforward economics."],
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
          <h2 className="font-serif text-3xl text-white">Join for free, stay for the community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your free profile. No credit card. No trial period. Just a dating platform that wants to earn your trust.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/freemium", "Freemium model"],
              ["/verified-dating-app", "Verified dating"],
              ["/tinder-alternative", "Tinder alternative"],
              ["/grindr-alternative", "Grindr alternative"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
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
