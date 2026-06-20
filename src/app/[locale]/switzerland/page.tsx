import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Dating App for Switzerland — Geneva, Lausanne, Zurich | Embir",
  description: "Embir arrives in Switzerland: free at launch, with verified profiles, multilingual expectations, and compatibility-first dating across Geneva, Lausanne, Zurich, Basel and Bern.",
  alternates: {
    canonical: "https://embir.xyz/switzerland",
    languages: { "fr": "https://embir.xyz/fr/suisse" },
  },
  openGraph: {
    title: "Free Dating App for Switzerland — Geneva, Lausanne, Zurich | Embir",
    description: "Embir arrives in Switzerland: free at launch, with verified profiles, multilingual expectations, and compatibility-first dating.",
    url: "https://embir.xyz/switzerland",
    locale: "en_US",
    siteName: "Embir",
    images: [`/api/og?title=Free+Dating+App+for+Switzerland+—+Geneva,+Lausanne,+Zurich+%7C+Embir&variant=market`],
  },
  twitter: { card: "summary_large_image", title: "Free Dating App for Switzerland | Embir", description: "Embir arrives in Switzerland: free at launch, verified profiles, and compatibility-first dating.", images: [`/api/og?title=Free+Dating+App+for+Switzerland+—+Geneva,+Lausanne,+Zurich+%7C+Embir&variant=default`] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Switzerland</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Swiss dating, where privacy and compatibility meet</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Switzerland is unlike any other dating market. Four languages, dense cities connected by short train rides, a culture that values discretion, and a large community of cross-border workers and international residents. Embir is building its Swiss community across Geneva, Lausanne, Zurich, Basel, and Bern.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Multilingual by necessity</h2>
            <p className="mt-4">Switzerland speaks German, French, Italian, and Romansh — but dating happens in all of them. A profile in Geneva might be written in French while someone in Zurich writes in German. Embir supports both French and English at launch, with the flexibility to handle multilingual encounters. The platform doesn&apos;t force you into one linguistic bubble — your profile, your language.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Dating across Swiss cities</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Geneva", "International hub with UN, NGOs, and banking professionals. Dating here crosses borders — many members live in France and work in Geneva. Embir's orientation and preference controls help navigate a deeply international dating pool."],
                ["Lausanne", "Student city with a vibrant cultural scene. Younger, more experimental dating culture. The EPFL and UNIL bring technical and international crowds looking for compatibility beyond proximity."],
                ["Zurich", "Switzerland's largest city. Fast-paced, professional, with the country's highest density of dating app users. Embir's verified profiles and compatibility signals cut through the volume."],
                ["Basel & Bern", "Mid-sized Swiss cities with distinct identities. Basel's pharmaceutical and art scenes create unique dating dynamics. Bern's slower pace and political culture attract people looking for substance over speed."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">Privacy and discretion — the Swiss way</h2>
            <p className="mt-4">Swiss dating culture values discretion. People often prefer to control who sees their profile before broadcasting it to everyone nearby. Embir&apos;s orientation-based visibility controls and preference filters align with this cultural expectation: you decide who sees you, and your profile is only visible to compatible people. Add verified profiles to reduce fake accounts, and you get a platform that respects Swiss expectations around privacy and trust.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frontaliers and cross-border dating</h2>
            <p className="mt-4">Geneva alone has over 100,000 cross-border workers commuting daily from France. Basel shares a border with both France and Germany. The Swiss dating scene doesn&apos;t stop at the border, and Embir doesn&apos;t either. The platform is designed for a world where your home and your dating life might be in different countries.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Frequently asked questions</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Is Embir available in German or Italian?", "Embir currently supports French and English. Swiss German, German, and Italian speakers can use the English interface. Additional languages may be added based on community demand."],
                ["Can I date across Swiss cities?", "Yes. Embir lets you set your discovery range. The Swiss rail network makes inter-city dating practical — Lausanne to Geneva is 40 minutes, Zurich to Bern is under an hour."],
                ["Is Embir free in Switzerland?", "Yes, completely free during the launch phase. All core features — messaging, matching, verification — are free for Swiss founding members."],
                ["How does Embir handle cross-border dating?", "Switzerland's borders are porous for dating. Embir doesn't restrict you by country. Your preferences and compatibility signals matter more than which side of a border you live on."],
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
          <h2 className="font-serif text-3xl text-white">Join the Swiss founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your free verified profile. Help build a Swiss dating platform that respects your language, your privacy, and your time.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explore more</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/us", "US dating"],
              ["/uk", "UK dating"],
              ["/lgbtq-dating-app", "LGBTQ dating"],
              ["/verified-dating-app", "Verified dating"],
              ["/free-dating-app", "Free dating app"],
              ["/safety", "Safety tools"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
