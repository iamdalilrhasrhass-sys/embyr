import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/age-verification" : "https://embir.xyz/age-verification";
  const title = locale === "fr" ? "Vérification d'âge 18+ — Embir" : "Age Verification 18+ — Embir";
  const description = locale === "fr"
    ? "Embir est strictement réservé aux adultes de 18 ans et plus. Déclaration d'âge obligatoire, signalement des profils mineurs, blocage immédiat et suppression définitive."
    : "Embir is strictly for adults 18+. Mandatory age declaration, minor profile reporting, immediate blocking and permanent deletion of underage accounts.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/age-verification", "en": "https://embir.xyz/age-verification", "x-default": "https://embir.xyz/age-verification" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Embir&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function AgeVerificationPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-embir-rose/70">{isFr ? "Sécurité" : "Safety"}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          {isFr ? "Vérification d'âge" : "Age Verification"}
        </h1>
        <p className="mt-4 text-sm text-white/35">{isFr ? "Dernière mise à jour : 17 juin 2026" : "Last updated: June 17, 2026"}</p>

        <section className="mt-10 space-y-6 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-embir-rose-deep/10 bg-embir-rose-deep/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">{isFr ? "🔞 18+ uniquement" : "🔞 18+ Only"}</h2>
            <p className="mt-4">{isFr ? "Embir est une plateforme de rencontre exclusivement réservée aux adultes de 18 ans et plus. L'accès aux personnes mineures est strictement interdit, sans exception. Cette règle est absolue et s'applique à toutes les fonctionnalités de la plateforme, y compris la création de profil, la messagerie, et la participation à la communauté fondatrice." : "Embir is a dating platform exclusively for adults aged 18 and over. Access by minors is strictly prohibited, without exception. This rule is absolute and applies to all platform features, including profile creation, messaging, and participation in the founding community."}</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">{isFr ? "Déclaration d'âge obligatoire" : "Mandatory Age Declaration"}</h2>
            <p className="mt-3">{isFr ? "Lors de l'inscription, chaque utilisateur doit déclarer sa date de naissance. Cette déclaration est obligatoire. Fournir une fausse date de naissance constitue une violation de nos conditions d'utilisation et entraîne la suppression immédiate du compte." : "During registration, every user must declare their date of birth. This declaration is mandatory. Providing a false date of birth constitutes a violation of our terms of service and results in immediate account deletion."}</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">{isFr ? "Signalement de profils mineurs" : "Reporting Underage Profiles"}</h2>
            <p className="mt-3">{isFr ? "Si vous soupçonnez qu'un profil appartient à une personne mineure, signalez-le immédiatement via le bouton de signalement présent sur chaque profil. Les signalements de profils suspectés mineurs sont traités en priorité absolue par notre équipe de modération." : "If you suspect a profile belongs to a minor, report it immediately via the report button on every profile. Reports of suspected underage profiles are handled with absolute priority by our moderation team."}</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">{isFr ? "Blocage et suppression immédiats" : "Immediate Blocking and Deletion"}</h2>
            <p className="mt-3">{isFr ? "Tout profil confirmé comme appartenant à un mineur est immédiatement suspendu puis définitivement supprimé. Les données associées sont effacées. Aucun recours n'est possible. La protection des mineurs est une priorité absolue qui ne souffre aucune exception." : "Any profile confirmed to belong to a minor is immediately suspended then permanently deleted. Associated data is erased. No appeal is possible. Minor protection is an absolute priority with no exceptions."}</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">{isFr ? "Contrôles supplémentaires possibles" : "Possible Additional Controls"}</h2>
            <p className="mt-3">{isFr ? "Dans le futur, Embir pourra mettre en place des contrôles d'âge supplémentaires : estimation par selfie, vérification de pièce d'identité pour certaines fonctionnalités, ou partenariat avec des services tiers de vérification d'âge. Ces mesures seront communiquées à la communauté avant leur mise en place." : "In the future, Embir may implement additional age controls: selfie-based age estimation, ID verification for certain features, or partnerships with third-party age verification services. These measures will be communicated to the community before implementation."}</p>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-embir-rose/15 bg-embir-rose/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Une communauté adulte et responsable" : "An adult, responsible community"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            {isFr ? "Rejoins Embir, une plateforme pensée pour des rencontres entre adultes, dans le respect et la sécurité." : "Join Embir, a platform designed for dating between adults, with respect and safety."}
          </p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">{isFr ? "Créer mon profil" : "Create my profile"}</Link>
        </section>
      </article>
    </main>
  );
}
