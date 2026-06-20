import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invite Friends — Build the Embir Founding Community Together | Embir",
  description: "Invite people you trust to join Embir during the launch phase. Help build a verified, respectful dating community from the ground up. Free for everyone during launch.",
  alternates: {
    canonical: "https://embir.xyz/invite",
    languages: { "fr": "https://embir.xyz/fr/invitation" },
  },
  openGraph: {
    title: "Invite Friends — Build the Embir Founding Community Together",
    description: "Invite people you trust to join Embir during the launch phase. Help build a verified, respectful dating community from the ground up.",
    url: "https://embir.xyz/invite",
    locale: "en_US",
    siteName: "Embir",
    images: [`/api/og?title=Invite+Friends+—+Build+the+Embir+Founding+Community+Together&variant=market`],
  },
  twitter: { card: "summary_large_image", title: "Invite Friends — Build the Embir Founding Community Together", description: "Help build a verified, respectful dating community from the ground up.", images: [`/api/og?title=Invite+Friends+—+Build+the+Embir+Founding+Community+Together+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function InvitePage() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Founding Community</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          Invite people you trust. Build a <span className="text-[#d4a574]">better dating community</span> together.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          The best dating communities aren't built by algorithms. They're built by people inviting people they know and trust. During Embir's launch phase, every invitation matters — you're not just adding users, you're shaping the culture.
        </p>

        <section className="mt-12 space-y-8 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Why invite people to Embir?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Better matches for everyone", "More verified profiles in your area means better compatibility suggestions and more genuine conversations."],
                ["Shape the culture early", "Founding members set the tone. Invite people who share your values about respect, honesty, and real connections."],
                ["Free for everyone right now", "Every core feature is free during launch. No one you invite will hit a paywall. No credit card needed."],
                ["Verified community", "Selfie verification means the people you invite — and the people they meet — are real. Less catfishing, more trust."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">How invitations work</h2>
            <div className="mt-6 space-y-5">
              {[
                {
                  step: "1",
                  title: "Create your profile first",
                  text: "Get verified, set your preferences, and experience Embir yourself. You can't invite people to something you haven't tried.",
                },
                {
                  step: "2",
                  title: "Share your invite link",
                  text: "Once you have a profile, you'll get a personal invite link. Share it however feels natural — text, DM, group chat. No spam, no leaderboards, no pressure.",
                },
                {
                  step: "3",
                  title: "They join for free",
                  text: "People you invite create their profile, verify by selfie, set their preferences — and start discovering. No paywall, no trial period.",
                },
                {
                  step: "4",
                  title: "The community grows",
                  text: "Every real, verified person who joins makes Embir better for everyone. Better density means better matches, more conversations, and a stronger community.",
                },
              ].map(({ step, title, text }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d4a574]/30 bg-[#d4a574]/10 text-sm font-bold text-[#d4a574]">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/85">{title}</h3>
                    <p className="mt-1 text-sm text-white/45">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">What invitations are NOT</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-white/45">
              <li><strong className="text-white/65">Not a referral program.</strong> There are no points, no rewards, no leaderboards. Invitations are about community quality, not quantity.</li>
              <li><strong className="text-white/65">Not a growth hack.</strong> We're not asking you to post your link everywhere. Thoughtful invitations to people you actually know work better than mass spam.</li>
              <li><strong className="text-white/65">Not a requirement.</strong> You can use Embir fully without ever inviting anyone. This is an option, not an obligation.</li>
              <li><strong className="text-white/65">Not tracked publicly.</strong> Your invitations are private. No one sees how many people you've invited.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Do I need to invite people to use Embir?", "No. Invitations are completely optional. You can create your profile, browse, match, and message without ever inviting anyone."],
                ["Is there a limit on invitations?", "No hard limits, but we encourage quality over quantity. Inviting a few people you actually know is more valuable than blasting a link to strangers."],
                ["Do I get anything for inviting people?", "During the launch phase, the main benefit is building a better community in your area — which means better matches for you too. There are no financial rewards or credits."],
                ["Can I invite people from other countries?", "Yes. Embir is available in France, the UK, the US, and Switzerland. You can invite people in any of these markets."],
                ["What if someone I invite doesn't want to verify?", "Verification is optional but encouraged. They can still use Embir without the verified badge — though verified profiles tend to get more genuine interactions."],
                ["How does this compare to 'invite-only' dating apps?", "Embir isn't invite-only. Anyone can join directly. Invitations are a way for founding members to bring in people they trust, making the community better for everyone."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80">{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">Start by creating your profile</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            Join Embir first. Get verified. Then invite the people you'd actually want to meet — or the friends you'd trust to build a better dating culture.
          </p>
          <Link
            href="/auth/register?utm_source=invite_page&utm_medium=organic&utm_campaign=founding_community"
            className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]"
          >
            Create my free profile
          </Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/freemium", "Why Embir is free"],
              ["/verified-dating-app", "How verification works"],
              ["/safety", "Safety & trust"],
              ["/about", "About Embir"],
              ["/lgbtq-dating-app", "LGBTQ+ dating"],
              ["/paris", "Embir in Paris"],
              ["/london", "Embir in London"],
              ["/new-york", "Embir in New York"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">
                {label}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
