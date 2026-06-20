import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/moderation" : "https://embir.xyz/moderation";
  const title = locale === "fr" ? "Modération humaine — Embir" : "Human Moderation — Embir";
  const description = locale === "fr"
    ? "Modération sur Embir : contenus interdits, harcèlement, menaces, usurpation, faux profils, sanctions. Une équipe humaine examine chaque signalement."
    : "Embir moderation: prohibited content, harassment, threats, impersonation, fake profiles, and sanctions. A human team reviews every report.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/moderation", "en": "https://embir.xyz/moderation", "x-default": "https://embir.xyz/moderation" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=👥+Modération+humaine,+pas+automatique&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=👥+Modération+humaine,+pas+automatique&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function ModerationPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Sécurité", h1: "Modération", updated: "Dernière mise à jour : 17 juin 2026",
    intro: "La modération chez Embir n'est pas un algorithme opaque. C'est une équipe humaine qui examine chaque signalement, prend des décisions et applique des sanctions. Voici comment nous protégeons notre communauté.",
    sections: [
      { title: "👥 Modération humaine, pas automatique", body: "Contrairement à de nombreuses plateformes qui s'appuient exclusivement sur des filtres automatiques, Embir utilise une équipe de modération humaine. Chaque signalement est lu et évalué par une personne réelle. Nous croyons que le contexte, la nuance et le jugement humain sont irremplaçables pour protéger une communauté de rencontre." },
      { title: "📋 Contenus interdits", body: "Les contenus suivants sont strictement interdits sur Embir et entraînent une modération immédiate : harcèlement, menaces, discours de haine, usurpation d'identité, nudité explicite non consentie, sollicitation de services sexuels rémunérés, spam, publicité non autorisée, faux profils, liens malveillants, et contenus illégaux." },
      { title: "🚫 Harcèlement et menaces", body: "Le harcèlement sous toutes ses formes est interdit : messages répétés non désirés, insultes, menaces physiques, chantage, diffusion d'informations personnelles sans consentement, et toute forme de cyberharcèlement. Un seul signalement de harcèlement confirmé peut entraîner la suspension ou la suppression définitive du compte." },
      { title: "🎭 Usurpation et faux profils", body: "Créer un profil en se faisant passer pour quelqu'un d'autre est strictement interdit. Cela inclut l'utilisation de photos ne vous appartenant pas, l'usurpation d'identité d'une personne réelle, ou la création de profils fictifs. Les faux profils sont supprimés dès leur détection." },
      { title: "⚠️ Sanctions", body: "Les sanctions sont proportionnelles à la gravité de l'infraction : avertissement, suspension temporaire, ou suppression définitive du compte. Les infractions graves (menaces, harcèlement sexuel, usurpation, contenus illégaux) entraînent une suppression immédiate et définitive, sans préavis." },
      { title: "🔄 Appel des décisions", body: "Si vous pensez qu'une décision de modération vous concernant est injustifiée, vous pouvez contacter moderation@embir.xyz. Votre demande sera examinée par un membre différent de l'équipe de modération. Les décisions concernant des infractions graves ne sont pas susceptibles d'appel." },
    ],
  } : {
    badge: "Safety", h1: "Moderation", updated: "Last updated: June 17, 2026",
    intro: "Moderation at Embir is not an opaque algorithm. It is a human team that reviews every report, makes decisions, and applies sanctions. Here's how we protect our community.",
    sections: [
      { title: "👥 Human moderation, not automated", body: "Unlike many platforms that rely exclusively on automatic filters, Embir uses a human moderation team. Every report is read and evaluated by a real person. We believe that context, nuance, and human judgment are irreplaceable for protecting a dating community." },
      { title: "📋 Prohibited content", body: "The following content is strictly prohibited on Embir and triggers immediate moderation: harassment, threats, hate speech, impersonation, non-consensual explicit nudity, solicitation of paid sexual services, spam, unauthorized advertising, fake profiles, malicious links, and illegal content." },
      { title: "🚫 Harassment and threats", body: "Harassment in all forms is prohibited: repeated unwanted messages, insults, physical threats, blackmail, sharing personal information without consent, and any form of cyberbullying. A single confirmed harassment report can lead to suspension or permanent account deletion." },
      { title: "🎭 Impersonation and fake profiles", body: "Creating a profile pretending to be someone else is strictly prohibited. This includes using photos that are not yours, impersonating a real person, or creating fictitious profiles. Fake profiles are deleted upon detection." },
      { title: "⚠️ Sanctions", body: "Sanctions are proportional to the severity of the violation: warning, temporary suspension, or permanent account deletion. Serious violations (threats, sexual harassment, impersonation, illegal content) result in immediate and permanent deletion without notice." },
      { title: "🔄 Appealing decisions", body: "If you believe a moderation decision regarding your account is unjustified, you can contact moderation@embir.xyz. Your request will be reviewed by a different member of the moderation team. Decisions regarding serious violations are not subject to appeal." },
    ],
  };

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{content.badge}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">{content.h1}</h1>
        <p className="mt-4 text-sm text-white/35">{content.updated}</p>
        <p className="mt-6 text-base leading-relaxed text-white/55">{content.intro}</p>
        <section className="mt-10 space-y-6 text-base leading-relaxed text-white/55">
          {content.sections.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
              <h2 className="font-serif text-2xl text-white">{s.title}</h2>
              <p className="mt-4">{s.body}</p>
            </div>
          ))}
        </section>
        <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Rejoindre une communauté modérée" : "Join a moderated community"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">{isFr ? "Crée ton profil dans un espace où la modération est prise au sérieux." : "Create your profile in a space where moderation is taken seriously."}</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">{isFr ? "Créer mon profil gratuit" : "Create my free profile"}</Link>
        </section>
      </article>
    </main>
  );
}
