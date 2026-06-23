import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Partenaire de sport gratuit par discipline | Embir" : "Free sports partner by discipline | Embir",
    description: isFr ? "Trouve un partenaire d'entraînement par discipline, niveau et ville. Embir filtre par orientation et intention. 100% gratuit." : "Find a training partner by discipline, level and city. Embir filters by orientation and intention. 100% free.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}sport`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/sport`,
        "en-US": `https://embir.xyz/sport`,
        "en-GB": `https://embir.xyz/sport`,
      },
    },
    openGraph: {
      title: isFr ? "Partenaire de sport gratuit par discipline | Embir" : "Free sports partner by discipline | Embir",
      description: isFr ? "Trouve un partenaire d'entraînement par discipline, niveau et ville. Embir filtre par orientation et intention. 100% gratuit." : "Find a training partner by discipline, level and city. Embir filters by orientation and intention. 100% free.",
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
            {isFr ? "Embir · 100% gratuit" : "Embir · 100% free"}
          </p>
          <div className="mt-8 text-6xl">◆</div>
          <h1 className="mt-6 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {isFr ? "Course, escalade, musculation, tennis. Trouve quelqu'un à ton niveau, ta discipline, ta ville. Le sport est mieux à deux." : "Running, climbing, gym, tennis. Find someone at your level, your discipline, your city. Sport is better together."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?intent=SPORT"
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
            {isFr ? "100% gratuit. Aucune pub. Aucun abonnement." : "100% free. No ads. No subscription."}
          </p>
          <Link
            href="/auth/register?intent=SPORT"
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
    h1: "Un partenaire d'entraînement vaut mille abonnements.",
    sections: [{"title": "Par discipline et niveau", "text": "Embir te permet de filtrer par activité sportive et par niveau. Que tu sois débutant en course ou expert en escalade, tu trouves un partenaire qui te correspond. Fini les séances solo quand tu veux progresser à deux."}, {"title": "Pas seulement du dating", "text": "L'intention 'sport' est séparée du dating. Tu cherches un partenaire d'entraînement, pas un rencard. Les profils cherchant l'amour ne verront pas ton profil sport. Le sport reste le sport, sans ambiguïté."}, {"title": "Événements sportifs locaux", "text": "Les ambassadeurs organisent des sorties sportives : runs collectifs, sessions d'escalade, matchs de tennis. Tu rejoins un groupe, tu progresses, tu rencontres des gens qui partagent ta discipline."}, {"title": "Le filtre orientation évite les malentendus", "text": "Le filtre bidirectionnel par orientation est actif même pour le sport. Tu ne vois que les profils compatibles. Pas de gêne, pas de malentendu. Juste le sport."}],
    faq: [{"q": "Puis-je chercher uniquement des partenaires de sport ?", "a": "Oui. Sélectionne l'intention 'sport' à l'inscription. Tu ne verras que les profils qui cherchent aussi des partenaires sportifs. Pas de confusion avec le dating."}, {"q": "Y a-t-il un filtre par niveau ?", "a": "Tu peux décrire ton niveau dans ton profil et filtrer par activité. Les ambassadeurs organisent aussi des événements par niveau (débutant, intermédiaire, avancé)."}, {"q": "Quelles disciplines sont disponibles ?", "a": "Course, musculation, escalade, tennis, natation, cyclisme, yoga, et plus. Tu peux lister plusieurs disciplines dans ton profil et trouver des partenaires pour chacune."}, {"q": "Le sport est-il vraiment gratuit sur Embir ?", "a": "Oui, 100% gratuit. Messagerie, événements, matching — tout est gratuit. Pas d'abonnement, pas de pub."}, {"q": "Puis-je chercher sport ET amour ?", "a": "Oui. Tu peux sélectionner plusieurs intentions. Embir te montrera les profils qui partagent au moins une de tes intentions."}],
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
    h1: "A training partner is worth a thousand subscriptions.",
    sections: [{"title": "By discipline and level", "text": "Embir lets you filter by sport activity and level. Whether you're a beginner runner or expert climber, you find a matching partner. No more solo sessions when you want to progress together."}, {"title": "Not just dating", "text": "The 'sports' intention is separate from dating. You're looking for a training partner, not a date. Profiles looking for love won't see your sports profile. Sport stays sport, no ambiguity."}, {"title": "Local sports events", "text": "Ambassadors organize sports outings: group runs, climbing sessions, tennis matches. You join a group, progress, meet people who share your discipline."}, {"title": "The orientation filter prevents misunderstandings", "text": "The bidirectional orientation filter is active even for sports. You only see compatible profiles. No awkwardness, no misunderstanding. Just sport."}],
    faq: [{"q": "Can I look only for sports partners?", "a": "Yes. Select the 'sports' intention during signup. You'll only see profiles also looking for sports partners. No confusion with dating."}, {"q": "Is there a level filter?", "a": "You can describe your level in your profile and filter by activity. Ambassadors also organize events by level (beginner, intermediate, advanced)."}, {"q": "What disciplines are available?", "a": "Running, gym, climbing, tennis, swimming, cycling, yoga, and more. You can list multiple disciplines in your profile and find partners for each."}, {"q": "Is sports really free on Embir?", "a": "Yes, 100% free. Messaging, events, matching — everything is free. No subscription, no ads."}, {"q": "Can I look for sports AND love?", "a": "Yes. You can select multiple intentions. Embir will show you profiles that share at least one of your intentions."}],
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