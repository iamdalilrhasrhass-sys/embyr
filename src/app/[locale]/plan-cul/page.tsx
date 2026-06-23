import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Plan cul gratuit avec consentement et respect | Embir" : "Casual encounters free with consent and respect | Embir",
    description: isFr ? "Du plaisir clair, du consentement, zéro jugement. Embir filtre par orientation pour des rencontres sans engagement sûres. 100% gratuit." : "Clear pleasure, consent, zero judgment. Embir filters by orientation for safe casual encounters. 100% free.",
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}plan-cul`,
      languages: {
        "fr-FR": `https://embir.xyz/fr/plan-cul`,
        "en-US": `https://embir.xyz/plan-cul`,
        "en-GB": `https://embir.xyz/plan-cul`,
      },
    },
    openGraph: {
      title: isFr ? "Plan cul gratuit avec consentement et respect | Embir" : "Casual encounters free with consent and respect | Embir",
      description: isFr ? "Du plaisir clair, du consentement, zéro jugement. Embir filtre par orientation pour des rencontres sans engagement sûres. 100% gratuit." : "Clear pleasure, consent, zero judgment. Embir filters by orientation for safe casual encounters. 100% free.",
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
          <div className="mt-8 text-6xl">✸</div>
          <h1 className="mt-6 font-serif text-5xl font-light tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {isFr ? "Transparence sur les intentions. Consentement explicite. Sécurité par la vérification. Embir rend les rencontres sans engagement plus sûres et plus honnêtes." : "Transparency on intentions. Explicit consent. Safety through verification. Embir makes casual encounters safer and more honest."}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?intent=PLAN_CUL"
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
            href="/auth/register?intent=PLAN_CUL"
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
    h1: "Du plaisir clair, du consentement, zéro jugement.",
    sections: [{"title": "Transparence sur les intentions", "text": "Sur Embir, l'intention 'plan cul' est explicite. Pas de mensonge, pas de fausse promesse. Chaque profil dans ton feed cherche la même chose que toi. La transparence élimine les malentendus et le ghosting."}, {"title": "Consentement et respect", "text": "Embir promeut le consentement explicite. Les profils vérifiés sont mis en avant. Les signalements sont traités rapidement par une équipe humaine. Le respect n'est pas optionnel — c'est la condition pour rester sur la plateforme."}, {"title": "Sécurité par la vérification", "text": "La vérification par selfie garantit que tu sais à qui tu parles. Les faux profils sont éliminés. Les profils vérifiés ont un badge. Pour des rencontres sans engagement, la confiance est encore plus importante — Embir la garantit."}, {"title": "100% gratuit, aucune limite", "text": "Pas de paywall pour voir qui a liké ton profil. Pas de limite de messages. Pas d'abonnement pour débloquer des fonctionnalités. Tout est gratuit, pour tout le monde. Le plaisir n'a pas de prix mensuel."}],
    faq: [{"q": "Embir est-il sûr pour les plans cul ?", "a": "Embir intègre la vérification par selfie, la modération humaine, et le traitement rapide des signalements. Les profils vérifiés sont mis en avant. Comme partout, reste prudent : rencontre en public la première fois."}, {"q": "Le plan cul est-il vraiment gratuit ?", "a": "Oui, 100% gratuit. Aucune limite de messages, aucun paywall, aucun abonnement. Toutes les fonctionnalités sont accessibles à tous."}, {"q": "Comment garantir le consentement ?", "a": "Embir promeut le consentement explicite. Les profils sont transparents sur leurs intentions. Les signalements pour comportement inapproprié sont traités rapidement par notre équipe de modération."}, {"q": "Le filtre par orientation est-il actif ?", "a": "Oui. Le filtre bidirectionnel par orientation est actif sur toutes les intentions, y compris plan cul. Tu ne vois que les profils compatibles qui te cherchent aussi."}, {"q": "Puis-je chercher plan cul ET autre chose ?", "a": "Oui. Tu peux sélectionner plusieurs intentions. Embir te montrera les profils qui partagent au moins une de tes intentions."}],
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
    h1: "Clear pleasure, consent, zero judgment.",
    sections: [{"title": "Transparency on intentions", "text": "On Embir, the 'casual' intention is explicit. No lying, no false promises. Every profile in your feed is looking for the same thing. Transparency eliminates misunderstandings and ghosting."}, {"title": "Consent and respect", "text": "Embir promotes explicit consent. Verified profiles are featured. Reports are handled quickly by a human team. Respect is not optional — it's the condition to stay on the platform."}, {"title": "Safety through verification", "text": "Selfie verification guarantees you know who you're talking to. Fake profiles are eliminated. Verified profiles have a badge. For casual encounters, trust is even more important — Embir guarantees it."}, {"title": "100% free, no limits", "text": "No paywall to see who liked your profile. No message limits. No subscription to unlock features. Everything is free, for everyone. Pleasure doesn't have a monthly price."}],
    faq: [{"q": "Is Embir safe for casual encounters?", "a": "Embir includes selfie verification, human moderation, and fast report handling. Verified profiles are featured. As anywhere, be cautious: meet in public the first time."}, {"q": "Is casual dating really free?", "a": "Yes, 100% free. No message limits, no paywall, no subscription. All features are available to everyone."}, {"q": "How is consent guaranteed?", "a": "Embir promotes explicit consent. Profiles are transparent about their intentions. Reports for inappropriate behavior are handled quickly by our moderation team."}, {"q": "Is the orientation filter active?", "a": "Yes. The bidirectional orientation filter is active on all intentions, including casual. You only see compatible profiles that are also looking for you."}, {"q": "Can I look for casual AND something else?", "a": "Yes. You can select multiple intentions. Embir will show you profiles that share at least one of your intentions."}],
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