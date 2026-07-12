import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/moderation" : "https://embir.xyz/moderation";
  const title = locale === "fr" ? "Signalement et blocage — Embir" : "Reporting and blocking — Embir";
  const description = locale === "fr"
    ? "Règles Embir, signalement des comportements problématiques et blocage immédiat d'un compte."
    : "Embir rules, reporting tools for problematic behavior, and immediate account blocking.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/moderation", "en": "https://embir.xyz/moderation", "x-default": "https://embir.xyz/moderation" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Signalement+et+blocage&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Reporting+and+blocking&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function ModerationPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Sécurité", h1: "Modération", updated: "Dernière mise à jour : 17 juin 2026",
    intro: "Embir fournit des règles communautaires, un outil de signalement et un blocage immédiat. Un signalement est enregistré pour examen ; aucun délai de réponse ou résultat particulier n'est garanti.",
    sections: [
      { title: "🚩 Signalement et blocage", body: "Chaque signalement est enregistré pour examen. Le blocage prend effet immédiatement pour le membre qui l'utilise. En cas de danger immédiat, contactez les services d'urgence compétents." },
      { title: "📋 Contenus interdits", body: "Les contenus suivants sont strictement interdits sur Embir et entraînent une modération immédiate : harcèlement, menaces, discours de haine, usurpation d'identité, nudité explicite non consentie, sollicitation de services sexuels rémunérés, spam, publicité non autorisée, faux profils, liens malveillants, et contenus illégaux." },
      { title: "🚫 Harcèlement et menaces", body: "Le harcèlement sous toutes ses formes est interdit : messages répétés non désirés, insultes, menaces physiques, chantage, diffusion d'informations personnelles sans consentement, et toute forme de cyberharcèlement. Un seul signalement de harcèlement confirmé peut entraîner la suspension ou la suppression définitive du compte." },
      { title: "🎭 Usurpation et faux profils", body: "Créer un profil en se faisant passer pour quelqu'un d'autre est interdit. La vérification selfie facultative ajoute un badge visible après approbation, mais aucun système ne garantit l'absence de faux profil." },
      { title: "⚠️ Mesures possibles", body: "Après examen, un compte peut faire l'objet d'une restriction, d'une suspension ou d'une suppression selon les faits disponibles et les règles applicables." },
      { title: "🔄 Contacter Embir", body: "Pour contester une décision ou ajouter des informations à un signalement, vous pouvez écrire à moderation@embir.xyz. La demande est enregistrée sans promesse de délai." },
    ],
  } : {
    badge: "Safety", h1: "Moderation", updated: "Last updated: June 17, 2026",
    intro: "Embir provides community rules, reporting tools, and immediate blocking. A report is recorded for review; no response time or particular outcome is guaranteed.",
    sections: [
      { title: "🚩 Reporting and blocking", body: "Every report is recorded for review. Blocking takes effect immediately for the member who uses it. If you are in immediate danger, contact the appropriate emergency services." },
      { title: "📋 Prohibited content", body: "The following content is strictly prohibited on Embir and triggers immediate moderation: harassment, threats, hate speech, impersonation, non-consensual explicit nudity, solicitation of paid sexual services, spam, unauthorized advertising, fake profiles, malicious links, and illegal content." },
      { title: "🚫 Harassment and threats", body: "Harassment in all forms is prohibited: repeated unwanted messages, insults, physical threats, blackmail, sharing personal information without consent, and any form of cyberbullying. A single confirmed harassment report can lead to suspension or permanent account deletion." },
      { title: "🎭 Impersonation and fake profiles", body: "Creating a profile while pretending to be someone else is prohibited. Optional selfie verification adds a visible badge after approval, but no system guarantees the absence of fake profiles." },
      { title: "⚠️ Possible measures", body: "After review, an account may be restricted, suspended, or deleted according to the available facts and applicable rules." },
      { title: "🔄 Contact Embir", body: "To contest a decision or add information to a report, email moderation@embir.xyz. The request is recorded without a promised response time." },
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
          <h2 className="font-serif text-3xl text-white">{isFr ? "Garder le contrôle" : "Stay in control"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">{isFr ? "Le blocage et le signalement sont disponibles, mais aucun outil ne remplace votre vigilance." : "Blocking and reporting are available, but no tool replaces your judgment."}</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">{isFr ? "Créer mon profil gratuit" : "Create my free profile"}</Link>
        </section>
      </article>
    </main>
  );
}
