import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Se faire des amis gratuitement par affinité | Embir" : "Make friends free by shared interests | Embir",
    description: isFr ? "Des amis vrais, pas des followers. Embir connecte par affinités réelles, par ville. Sans carte bancaire, sans confusion avec le dating." : "Real friends, not followers. Embir connects by shared interests, by city. Core connections are free, no confusion with dating.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}amis`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/amis`,
        "en-US": `https://embir.xyz/amis`,
        "en-GB": `https://embir.xyz/amis`,
      },
    },
    openGraph: {
      title: isFr ? "Se faire des amis gratuitement par affinité | Embir" : "Make friends free by shared interests | Embir",
      description: isFr ? "Des amis vrais, pas des followers. Embir connecte par affinités réelles, par ville. Sans carte bancaire, sans confusion avec le dating." : "Real friends, not followers. Embir connects by shared interests, by city. Core connections are free, no confusion with dating.",
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
          <div className="mt-8 text-6xl">✦</div>
          <h1 className="mt-6 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {isFr ? "Pas des followers. Des amis avec qui sortir, partager, construire. Embir sépare l'amitié du dating pour que chaque connexion soit claire." : "Not followers. Friends to hang out with, share with, build with. Embir separates friendship from dating so every connection is clear."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?intent=AMIS"
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
            href="/auth/register?intent=AMIS"
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
    h1: "Des amis qui partagent vraiment tes passions.",
    sections: [{"title": "L'amitié a sa place", "text": "Sur la plupart des apps, tout est mélangé. Quelqu'un qui veut un ami se retrouve face à quelqu'un qui cherche l'amour. Embir sépare. Si tu choisis l'intention 'amis', tu ne vois que les profils qui cherchent aussi de l'amitié. Pas de malentendu, pas de gêne."}, {"title": "Par affinités réelles", "text": "Embir matche par passions communes : sport, musique, gaming, cuisine, voyage. Tu trouves des gens qui aiment ce que tu aimes, dans ta ville. Pas des connections aléatoires — des affinités réelles."}, {"title": "Événements et activités locales", "text": "La disponibilité d'événements dépend des annonces réellement publiées. Embir ne promet pas de couverture locale sans données opérationnelles."}, {"title": "Pas de confusion avec le dating", "text": "Le filtre par intention garantit que les profils cherchant l'amour ne verront pas ton profil 'amis'. Et inversement. Chacun cherche ce qu'il veut, sans empiéter sur les autres. C'est ça, le respect bidirectionnel."}],
    faq: [{"q": "Puis-je chercher uniquement des amis ?", "a": "Oui. Sélectionne l'intention 'amis' lors de l'inscription. Tu ne verras que les profils qui cherchent aussi de l'amitié. Les profils cherchant l'amour ne te verront pas."}, {"q": "Les profils cherchant l'amour me verront-ils ?", "a": "Non. Le filtre par intention est bidirectionnel. Si tu cherches des amis et qu'ils cherchent l'amour, aucun de vous ne verra l'autre. Moins de confusion."}, {"q": "Puis-je chercher amis ET amour en même temps ?", "a": "Oui. Tu peux sélectionner plusieurs intentions. Embir te montrera les profils qui cherchent au moins une des mêmes intentions que toi."}, {"q": "Y a-t-il des groupes par passion ?", "a": "Les ambassadeurs organisent des événements par thème (sport, musique, gastronomie). Tu peux aussi filtrer le feed par activité pour trouver des gens qui partagent tes passions."}, {"q": "C'est vraiment gratuit de se faire des amis ?", "a": "Oui, sans carte bancaire. Messagerie entre connexions réciproques, événements gratuits, Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. L'amitié n'a pas de prix mensuel."}],
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
    h1: "Friends who truly share your passions.",
    sections: [{"title": "Friendship has its place", "text": "On most apps, everything is mixed. Someone looking for a friend ends up facing someone looking for love. Embir separates. If you choose 'friends' as your intention, you only see profiles also looking for friendship. No misunderstanding, no awkwardness."}, {"title": "By real affinities", "text": "Embir matches by shared passions: sports, music, gaming, cooking, travel. You find people who love what you love, in your city. Not random connections — real affinities."}, {"title": "Local events and activities", "text": "Event availability depends on actual published listings. Embir does not promise local coverage without operational data."}, {"title": "No confusion with dating", "text": "The intention filter guarantees that profiles looking for love won't see your 'friends' profile. And vice versa. Everyone seeks what they want without stepping on others. That's bidirectional respect."}],
    faq: [{"q": "Can I look only for friends?", "a": "Yes. Select the 'friends' intention during signup. You'll only see profiles also looking for friendship. Profiles looking for love won't see you."}, {"q": "Will profiles looking for love see me?", "a": "No. The intention filter is bidirectional. If you're looking for friends and they're looking for love, neither of you will see the other. Less confusion."}, {"q": "Can I look for friends AND love at the same time?", "a": "Yes. You can select multiple intentions. Embir will show you profiles that share at least one of your intentions."}, {"q": "Are there groups by passion?", "a": "Ambassadors organize themed events (sports, music, food). You can also filter the feed by activity to find people who share your passions."}, {"q": "Is it really free to make friends?", "a": "Yes, free for core connections. messaging between reciprocal connections, free events, no credit card for core connections. Friendship doesn't have a monthly price."}],
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