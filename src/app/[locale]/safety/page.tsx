import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/securite" : "https://embir.xyz/safety";
  const title = locale === "fr" ? "Sécurité et conseils — Embir" : "Safety Tips & Tools — Embir";
  const description = locale === "fr"
    ? "Sécurité sur Embir : vérification des profils, signalement, blocage, modération humaine, règles communautaires, conseils de rencontre et protection des mineurs."
    : "Embir safety: profile verification, reporting, blocking, human moderation, community rules, dating safety tips and minor protection.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/securite", "en": "https://embir.xyz/safety", "x-default": "https://embir.xyz/safety" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Embir&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function SafetyPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{isFr ? "Sécurité" : "Safety"}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          {isFr ? "Sécurité et confiance" : "Safety & Trust"}
        </h1>
        <p className="mt-4 text-sm text-white/35">{isFr ? "Dernière mise à jour : 17 juin 2026" : "Last updated: June 17, 2026"}</p>
        <p className="mt-6 text-base leading-relaxed text-white/55">
          {isFr
            ? "La sécurité est la fondation d'Embir. Nous concevons chaque fonctionnalité en partant du principe qu'une rencontre ne peut être bonne que si elle est sûre. Voici comment nous protégeons notre communauté — et comment vous pouvez vous protéger."
            : "Safety is the foundation of Embir. We design every feature with the principle that a good date can only happen when it's safe. Here's how we protect our community — and how you can protect yourself."}
        </p>

        <section className="mt-12 space-y-8 text-base leading-relaxed text-white/55">
          {/* Verification */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">{isFr ? "🛡️ Vérification des profils" : "🛡️ Profile Verification"}</h2>
            <p className="mt-4">{isFr ? "Embir propose une vérification par selfie. Lorsque vous voyez le badge vérifié sur un profil, cela signifie que la personne a confirmé son identité en prenant un selfie en temps réel. Cette vérification réduit considérablement le risque de faux profils et de catfishing. Nous encourageons tous les membres à se faire vérifier." : "Embir offers selfie verification. When you see the verified badge on a profile, it means the person confirmed their identity by taking a real-time selfie. This verification significantly reduces the risk of fake profiles and catfishing. We encourage all members to get verified."}</p>
          </div>

          {/* Reporting */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">{isFr ? "🚩 Signalement" : "🚩 Reporting"}</h2>
            <p className="mt-4">{isFr ? "Chaque profil et chaque conversation dispose d'un bouton de signalement. Vous pouvez signaler un comportement inapproprié, un faux profil, du harcèlement ou tout contenu qui vous semble dangereux. Tous les signalements sont examinés par notre équipe de modération humaine — pas seulement par un algorithme." : "Every profile and every conversation has a report button. You can report inappropriate behavior, fake profiles, harassment, or any content that feels unsafe. All reports are reviewed by our human moderation team — not just an algorithm."}</p>
          </div>

          {/* Blocking */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">{isFr ? "🚫 Blocage" : "🚫 Blocking"}</h2>
            <p className="mt-4">{isFr ? "Vous pouvez bloquer n'importe quel utilisateur à tout moment, sans justification. Une fois bloquée, la personne ne peut plus voir votre profil, vous envoyer de messages, ni interagir avec vous d'aucune façon. Le blocage est immédiat et définitif." : "You can block any user at any time, without justification. Once blocked, the person can no longer see your profile, send you messages, or interact with you in any way. Blocking is immediate and permanent."}</p>
          </div>

          {/* Community Rules */}
          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Règles communautaires" : "Community Rules"}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              {(isFr ? [
                "Soyez respectueux : pas d'insultes, de menaces, de harcèlement ou de discrimination.",
                "Soyez authentique : un seul compte par personne, avec votre véritable identité.",
                "Respectez le consentement : ne partagez pas de photos ou messages privés sans autorisation.",
                "Pas de contenus sexuellement explicites non sollicités.",
                "Pas de sollicitation commerciale, de spam ou de promotion de services externes.",
                "Respectez les limites des autres : si quelqu'un n'est pas intéressé, acceptez-le.",
                "Signalez les comportements problématiques plutôt que de les ignorer.",
              ] : [
                "Be respectful: no insults, threats, harassment, or discrimination.",
                "Be authentic: one account per person, with your real identity.",
                "Respect consent: do not share private photos or messages without permission.",
                "No unsolicited sexually explicit content.",
                "No commercial solicitation, spam, or promotion of external services.",
                "Respect others' boundaries: if someone is not interested, accept it.",
                "Report problematic behavior rather than ignoring it.",
              ]).map((rule, i) => <li key={i}>{rule}</li>)}
            </ul>
          </div>

          {/* Dating Safety Tips */}
          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Conseils de rencontre" : "Dating Safety Tips"}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(isFr ? [
                ["Premier rendez-vous en public", "Choisissez un lieu fréquenté et restez-y. Ne montez pas dans la voiture de quelqu'un que vous venez de rencontrer."],
                ["Prévenez un proche", "Dites à un ami où vous allez, avec qui, et à quelle heure vous prévoyez de rentrer."],
                ["Restez sobre", "Gardez le contrôle. Une consommation excessive peut altérer votre jugement et votre vigilance."],
                ["Transport indépendant", "Prévoyez votre propre moyen de transport pour pouvoir partir quand vous le souhaitez."],
                ["Confiance progressive", "Ne partagez pas d'informations trop personnelles (adresse, lieu de travail) avant d'avoir établi une vraie confiance."],
                ["Écoutez votre instinct", "Si quelque chose ne vous semble pas normal, n'hésitez pas à partir. Votre sécurité passe avant la politesse."],
              ] : [
                ["First date in public", "Choose a busy location and stay there. Do not get into someone's car on a first meeting."],
                ["Tell a friend", "Let someone know where you're going, with whom, and when you expect to be back."],
                ["Stay in control", "Excessive drinking can impair your judgment. Stay aware."],
                ["Independent transport", "Arrange your own transportation so you can leave whenever you want."],
                ["Build trust gradually", "Don't share overly personal information (address, workplace) before establishing real trust."],
                ["Trust your instincts", "If something feels off, don't hesitate to leave. Your safety comes before politeness."],
              ]).map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Minor Protection */}
          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">{isFr ? "🔞 Protection des mineurs" : "🔞 Minor Protection"}</h2>
            <p className="mt-4">{isFr ? "Embir est strictement réservé aux personnes de 18 ans et plus. Nous utilisons une déclaration d'âge obligatoire à l'inscription. Tout profil soupçonné d'appartenir à un mineur est immédiatement suspendu et supprimé après vérification. Si vous pensez qu'un mineur utilise la plateforme, signalez-le immédiatement." : "Embir is strictly for adults aged 18 and over. We require an age declaration at sign-up. Any profile suspected of belonging to a minor is immediately suspended and deleted upon verification. If you believe a minor is using the platform, report it immediately."}</p>
          </div>

          {/* Limits */}
          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Limites et honnêteté" : "Limits & Honesty"}</h2>
            <p className="mt-4">{isFr ? "Aucune plateforme ne peut garantir une sécurité absolue. Même avec la vérification, la modération et le signalement, des risques subsistent. La vérification par selfie confirme qu'une personne est réelle, pas qu'elle est bien intentionnée. Nous faisons tout notre possible pour réduire les risques, mais votre vigilance reste essentielle. La sécurité est une responsabilité partagée entre la plateforme et ses membres." : "No platform can guarantee absolute safety. Even with verification, moderation, and reporting, risks remain. Selfie verification confirms someone is a real person, not that they have good intentions. We do everything we can to reduce risks, but your vigilance remains essential. Safety is a shared responsibility between the platform and its members."}</p>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Rejoindre une communauté plus sûre" : "Join a safer community"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            {isFr ? "Crée ton profil vérifié gratuitement et fais partie d'une communauté où la sécurité est prise au sérieux." : "Create your verified profile for free and be part of a community where safety is taken seriously."}
          </p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">{isFr ? "Créer mon profil gratuit" : "Create my free profile"}</Link>
        </section>
      </article>
    </main>
  );
}
