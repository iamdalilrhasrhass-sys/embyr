import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/confidentialite" : "https://embir.xyz/privacy";
  const title = locale === "fr" ? "Politique de confidentialité — Embir" : "Privacy Policy — Embir";
  const description = locale === "fr"
    ? "Politique de confidentialité d'Embir : données collectées, finalités, base légale RGPD, conservation, droits utilisateur, sécurité et absence de revente des données personnelles."
    : "Embir Privacy Policy: data collected, purposes, GDPR legal basis, retention, user rights, security, and no resale of personal data.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/confidentialite", "en": "https://embir.xyz/privacy", "x-default": "https://embir.xyz/privacy" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=1.+Données+que+nous+collectons&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=1.+Données+que+nous+collectons&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  const content = isFr ? {
    badge: "Confidentialité",
    h1: "Politique de confidentialité",
    updated: "Dernière mise à jour : 17 juin 2026",
    intro: "Embir s'engage à protéger vos données personnelles et à être transparent sur leur utilisation. Cette politique explique quelles données nous collectons, pourquoi, et comment vous pouvez exercer vos droits.",
    sections: [
      { title: "1. Données que nous collectons", body: "Nous collectons les informations que vous fournissez lors de la création et de l'utilisation de votre profil : prénom, âge, photos, orientation déclarée, préférences de rencontre, intentions relationnelles, centres d'intérêt. Nous collectons également les messages que vous échangez, les signalements que vous faites, et les données techniques liées à votre utilisation (type d'appareil, navigateur, pages visitées)." },
      { title: "2. Photos et selfie de vérification", body: "Les photos de profil sont stockées sur nos serveurs. Le selfie de vérification est utilisé exclusivement pour confirmer que le profil correspond à une personne réelle. Il n'est pas affiché publiquement et n'est pas conservé au-delà de la vérification, sauf obligation légale contraire." },
      { title: "3. Messages et conversations", body: "Les messages échangés sur Embir sont stockés pour permettre la continuité des conversations. Ils ne sont pas analysés à des fins publicitaires. Nous pouvons accéder aux messages dans le cadre d'un signalement ou d'une enquête de modération." },
      { title: "4. Orientation et préférences de visibilité", body: "Votre orientation et vos préférences déterminent quels profils vous sont montrés et à quels profils le vôtre est visible. Ces informations sont au cœur du fonctionnement d'Embir. Vous pouvez les modifier à tout moment. Elles ne sont jamais partagées avec des tiers à des fins marketing." },
      { title: "5. Finalités du traitement", body: "Nous traitons vos données pour : fournir le service de mise en relation, améliorer la compatibilité des suggestions, assurer la sécurité et la modération de la plateforme, communiquer avec vous concernant votre compte, et respecter nos obligations légales." },
      { title: "6. Base légale (RGPD)", body: "Pour les utilisateurs situés dans l'Espace économique européen, le traitement de vos données repose sur : l'exécution du contrat (fourniture du service), votre consentement (pour les données sensibles comme l'orientation), et notre intérêt légitime (sécurité, modération, amélioration du service)." },
      { title: "7. Pas de revente de données", body: "Embir ne vend pas vos données personnelles à des tiers. Nous ne partageons pas vos informations avec des annonceurs, des courtiers en données, ou toute autre entité à des fins commerciales externes. Notre modèle économique futur repose sur un freemium transparent, pas sur la monétisation de vos données." },
      { title: "8. Conservation des données", body: "Vos données sont conservées tant que votre compte est actif. En cas de suppression de votre compte, vos données personnelles sont effacées dans un délai de 30 jours. Certaines informations peuvent être conservées plus longtemps pour respecter des obligations légales ou pour la défense de nos droits." },
      { title: "9. Suppression de compte", body: "Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l'application. La suppression est irréversible et entraîne l'effacement de votre profil, de vos photos, de vos messages et de vos préférences. Les conversations avec d'autres utilisateurs peuvent conserver les messages que vous avez envoyés, mais sans lien avec votre profil supprimé." },
      { title: "10. Vos droits", body: "Conformément au RGPD et aux lois applicables, vous disposez des droits suivants : droit d'accès à vos données, droit de rectification, droit à l'effacement, droit à la portabilité, droit d'opposition et droit à la limitation du traitement. Pour exercer ces droits, contactez-nous à l'adresse ci-dessous." },
      { title: "11. Sécurité", body: "Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données : chiffrement en transit (HTTPS), accès restreint aux données personnelles, authentification sécurisée, et surveillance des accès suspects. Aucun système n'est infaillible, mais nous nous engageons à maintenir un niveau de sécurité élevé." },
      { title: "12. Sous-traitants", body: "Nous pouvons faire appel à des sous-traitants pour l'hébergement, l'envoi d'emails transactionnels ou l'analyse technique. Ces sous-traitants sont sélectionnés pour leurs garanties de sécurité et de conformité. Cette section sera complétée avec la liste des sous-traitants avant le lancement commercial." },
      { title: "13. Contact", body: "Pour toute question relative à cette politique ou pour exercer vos droits : privacy@embir.xyz" },
    ],
    cta_title: "Rejoindre la communauté fondatrice",
    cta_text: "Crée ton profil gratuitement, sans carte bancaire. Tes données sont protégées et ne seront jamais revendues.",
    cta_button: "Créer mon profil gratuit",
  } : {
    badge: "Privacy",
    h1: "Privacy Policy",
    updated: "Last updated: June 17, 2026",
    intro: "Embir is committed to protecting your personal data and being transparent about how it is used. This policy explains what data we collect, why, and how you can exercise your rights.",
    sections: [
      { title: "1. Data we collect", body: "We collect the information you provide when creating and using your profile: first name, age, photos, declared orientation, dating preferences, relationship intentions, and interests. We also collect the messages you exchange, reports you submit, and technical data related to your usage (device type, browser, pages visited)." },
      { title: "2. Photos and verification selfie", body: "Profile photos are stored on our servers. The verification selfie is used exclusively to confirm that the profile corresponds to a real person. It is not displayed publicly and is not retained beyond verification, unless legally required otherwise." },
      { title: "3. Messages and conversations", body: "Messages exchanged on Embir are stored to ensure conversation continuity. They are not analyzed for advertising purposes. We may access messages as part of a report investigation or moderation review." },
      { title: "4. Orientation and visibility preferences", body: "Your orientation and preferences determine which profiles are shown to you and which profiles can see yours. This information is central to how Embir works. You can modify it at any time. It is never shared with third parties for marketing purposes." },
      { title: "5. Purposes of processing", body: "We process your data to: provide the matchmaking service, improve the compatibility of suggestions, ensure platform security and moderation, communicate with you about your account, and comply with our legal obligations." },
      { title: "6. Legal basis (GDPR)", body: "For users in the European Economic Area, the processing of your data is based on: contract performance (service provision), your consent (for sensitive data such as orientation), and our legitimate interest (security, moderation, service improvement)." },
      { title: "7. No data resale", body: "Embir does not sell your personal data to third parties. We do not share your information with advertisers, data brokers, or any other entity for external commercial purposes. Our future business model relies on transparent freemium, not data monetization." },
      { title: "8. Data retention", body: "Your data is retained as long as your account is active. Upon deletion of your account, your personal data is erased within 30 days. Certain information may be retained longer to comply with legal obligations or to defend our rights." },
      { title: "9. Account deletion", body: "You can delete your account at any time from the app settings. Deletion is irreversible and results in the erasure of your profile, photos, messages, and preferences. Conversations with other users may retain messages you sent, but without any link to your deleted profile." },
      { title: "10. Your rights", body: "In accordance with GDPR and applicable laws, you have the following rights: right of access, right of rectification, right to erasure, right to data portability, right to object, and right to restrict processing. To exercise these rights, contact us at the address below." },
      { title: "11. Security", body: "We implement technical and organizational measures to protect your data: encryption in transit (HTTPS), restricted access to personal data, secure authentication, and monitoring for suspicious access. No system is infallible, but we are committed to maintaining a high level of security." },
      { title: "12. Subprocessors", body: "We may use subprocessors for hosting, transactional emails, or technical analytics. These subprocessors are selected for their security and compliance guarantees. This section will be completed with the list of subprocessors before commercial launch." },
      { title: "13. Contact", body: "For any questions regarding this policy or to exercise your rights: privacy@embir.xyz" },
    ],
    cta_title: "Join the founding community",
    cta_text: "Create your profile without a credit card. Your data is protected and will never be sold.",
    cta_button: "Create my free profile",
  };

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-embir-rose/70">{content.badge}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">{content.h1}</h1>
        <p className="mt-4 text-sm text-white/35">{content.updated}</p>
        <p className="mt-6 text-base leading-relaxed text-white/55">{content.intro}</p>

        <section className="mt-10 space-y-6 text-base leading-relaxed text-white/55">
          {content.sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-serif text-2xl text-white">{s.title}</h2>
              <p className="mt-3">{s.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-3xl border border-embir-rose/15 bg-embir-rose/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{content.cta_title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">{content.cta_text}</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">{content.cta_button}</Link>
        </section>
      </article>
    </main>
  );
}
