import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Événements de rencontre gratuits par ville | Embir" : "Free dating events by city | Embir",
    description: isFr ? "Crée ou rejoins des événements de rencontre dans ta ville. Embir filtre par intention et orientation. Sans carte bancaire." : "Create or join dating events in your city. Embir filters by intention and orientation. Core connections are free.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}evenements`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/evenements`,
        "en-US": `https://embir.xyz/evenements`,
        "en-GB": `https://embir.xyz/evenements`,
      },
    },
    openGraph: {
      title: isFr ? "Événements de rencontre gratuits par ville | Embir" : "Free dating events by city | Embir",
      description: isFr ? "Crée ou rejoins des événements de rencontre dans ta ville. Embir filtre par intention et orientation. Sans carte bancaire." : "Create or join dating events in your city. Embir filters by intention and orientation. Core connections are free.",
      locale: isFr ? "fr_FR" : "en_US",
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const c = isFr ? COPY.fr : COPY.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.faq.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  };

  return (
    <>
      <Navbar showLogo />
      <main className="emb-page min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <SchemaOrg />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* HERO */}
        <section className="mx-auto max-w-5xl py-12 text-center lg:py-20">
          <p className="inline-flex rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
            {isFr ? "Embir · sans carte bancaire" : "Embir · free for core connections"}
          </p>
          <div className="mt-8 text-6xl">❖</div>
          <h1 className="mt-6 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {isFr ? "Crée ou rejoins des soirées, expos, concerts, voyages. Les ambassadeurs animent ta ville. Embir devient une excuse pour sortir." : "Create or join parties, exhibitions, concerts, trips. Ambassadors animate your city. Embir becomes a reason to go out."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?intent=EVENEMENTS"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
            >
              {isFr ? "Commencer gratuitement" : "Get started free"}
            </Link>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/75 transition hover:border-[#d4a574]/35"
            >
              {isFr ? "Voir toutes les intentions" : "See all intentions"}
            </Link>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section className="mx-auto max-w-4xl py-12">
          <div className="space-y-12">
            {c.sections.map((section, i) => (
              <article key={i} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8">
                <h2 className="font-serif text-2xl font-light text-white sm:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">
                  {section.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKING */}
        <section className="mx-auto max-w-4xl py-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
            {isFr ? "Autres intentions" : "Other intentions"}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(isFr ? COPY.fr.links : COPY.en.links).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/65 transition hover:border-[#d4a574]/35 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl py-12">
          <h2 className="text-center font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? "Questions fréquentes" : "Frequently asked"}
          </h2>
          <div className="mt-10 space-y-3">
            {c.faq.map((item, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-white/80">
                  {item.q}
                  <span className="ml-4 text-lg text-[#d4a574] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/48">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl py-16 text-center">
          <h2 className="font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? "Prêt à commencer ?" : "Ready to start?"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/45">
            {isFr ? "sans carte bancaire. Aucune pub. Aucun abonnement." : "free for core connections. No ads. No subscription."}
          </p>
          <Link
            href="/auth/register?intent=EVENEMENTS"
            prefetch={false}
            className="mt-8 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
          >
            {isFr ? "Créer mon profil" : "Create my profile"}
          </Link>
        </section>
      </main>
    </>
  );
}

const COPY = {
  fr: {
    h1: "Les meilleures rencontres arrivent en vrai.",
    sections: [{"title": "Crée ton événement", "text": "Tu veux organiser une soirée, un apéro, une sortie ? Crée l'événement sur Embir, choisis l'intention et l'orientation cibles. Les membres compatibles dans ta ville le voient et s'inscrivent. C'est gratuit, c'est simple."}, {"title": "Rejoins des événements près de chez toi", "text": "Les ambassadeurs organisent des événements réguliers dans les grandes villes : apéros, ateliers, concerts, sorties sportives. Tu filtres par intention et par ville, tu trouves l'événement qui te correspond."}, {"title": "Filtre par intention", "text": "Un événement 'amour' n'est pas un événement 'fun'. Embir filtre les événements par intention. Tu ne vois que les événements qui correspondent à ce que tu cherches. Pas de malentendu, pas de mauvaise surprise."}, {"title": "Multi-orientation respecté", "text": "Chaque événement respecte le filtre par orientation. Un événement gay ne apparaîtra pas pour un hétéro. Un événement lesbienne ne apparaîtra pas pour un homme. Le respect des communautés est la règle, pas l'exception."}],
    faq: [{"q": "La création d'événements est-elle gratuite ?", "a": "Oui, connexions essentielles gratuites. Tu peux créer autant d'événements que tu veux. Les ambassadeurs peuvent aussi organiser des événements officiels Embir."}, {"q": "Qui peut rejoindre mes événements ?", "a": "Les membres compatibles : même intention, même orientation, dans ta ville. Le filtre bidirectionnel garantit que seules les bonnes personnes voient ton événement."}, {"q": "Y a-t-il un filtre par intention ?", "a": "Oui. Chaque événement a une intention (amour, fun, sport, etc.). Tu ne vois que les événements qui correspondent à tes intentions. Moins de confusion."}, {"q": "Quelles villes sont disponibles ?", "a": "Embir est disponible partout. Embir ne publie pas de couverture locale d'ambassadeurs sans données opérationnelles. Si ta ville n'a pas encore d'ambassadeur, tu peux postuler."}, {"q": "Les événements sont-ils sûrs ?", "a": "Embir ne certifie ni ne supervise les rassemblements organisés hors plateforme. Les profils approuvés affichent un badge visible. Comme partout, reste prudent : les premiers événements en public sont recommandés."}],
    links: [
      { href: "/amour", label: "\u2665 Amour" },
      { href: "/amis", label: "\u2726 Amis" },
      { href: "/fun", label: "\u26a1 Fun" },
      { href: "/plan-cul", label: "\u2738 Plan cul" },
      { href: "/sport", label: "\u25c6 Sport" },
      { href: "/evenements", label: "\u2756 \u00c9v\u00e9nements" },
    ],
  },
  en: {
    h1: "The best encounters happen in real life.",
    sections: [{"title": "Create your event", "text": "Want to organize a party, a meetup, an outing? Create the event on Embir, choose the target intention and orientation. Compatible members in your city see it and sign up. It's free, it's simple."}, {"title": "Join events near you", "text": "Ambassadors organize regular events in major cities: meetups, workshops, concerts, sports outings. You filter by intention and city, you find the event that matches."}, {"title": "Filter by intention", "text": "A 'love' event is not a 'fun' event. Embir filters events by intention. You only see events that match what you're looking for. No misunderstanding, no bad surprises."}, {"title": "Multi-orientation respected", "text": "Every event respects the orientation filter. A gay event won't appear for a straight person. A lesbian event won't appear for a man. Respecting communities is the rule, not the exception."}],
    faq: [{"q": "Is event creation free?", "a": "Yes, free for core connections. You can create as many events as you want. Ambassadors can also organize official Embir events."}, {"q": "Who can join my events?", "a": "Compatible members: same intention, same orientation, in your city. The bidirectional filter guarantees only the right people see your event."}, {"q": "Is there an intention filter?", "a": "Yes. Each event has an intention (love, fun, sports, etc.). You only see events that match your intentions. Less confusion."}, {"q": "Which cities are available?", "a": "Embir is available everywhere. Embir does not publish local ambassador coverage without operational data. If your city doesn't have an ambassador yet, you can apply."}, {"q": "Are events safe?", "a": "Embir does not certify or supervise gatherings organized outside the platform. Verified profiles are featured. As anywhere, be cautious: first events in public are recommended."}],
    links: [
      { href: "/amour", label: "\u2665 Love" },
      { href: "/amis", label: "\u2726 Friends" },
      { href: "/fun", label: "\u26a1 Fun" },
      { href: "/plan-cul", label: "\u2738 Casual" },
      { href: "/sport", label: "\u25c6 Sports" },
      { href: "/evenements", label: "\u2756 Events" },
    ],
  },
} as const;