import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/conditions" : "https://embir.xyz/terms";
  const title = locale === "fr"
    ? "Conditions générales d'utilisation — Embir"
    : "Terms of Service — Embir";
  const description = locale === "fr"
    ? "Conditions générales d'utilisation d'Embir : règles communautaires, âge minimum, comportements interdits, signalements, suppression de compte et modèle freemium transparent."
    : "Embir Terms of Service: community rules, minimum age, prohibited behavior, reporting, account removal and transparent freemium model.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/conditions", "en": "https://embir.xyz/terms", "x-default": "https://embir.xyz/terms" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Embir&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  if (isFr) {
    return (
      <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Légal</p>
          <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Conditions générales d&apos;utilisation</h1>
          <p className="mt-4 text-sm text-white/35">Dernière mise à jour : 17 juin 2026</p>

          <section className="mt-12 space-y-6 text-base leading-relaxed text-white/55">
            <div>
              <h2 className="font-serif text-2xl text-white">1. Objet du service</h2>
              <p className="mt-3">Embir est une plateforme de rencontre en ligne accessible via le web (embir.xyz) et destinée aux personnes majeures de toutes orientations. Le service permet de créer un profil, de découvrir d&apos;autres profils selon des préférences déclarées, d&apos;échanger des messages et de participer à une communauté fondatrice.</p>
              <p className="mt-3">Cette page sera complétée avec les informations légales définitives de l&apos;éditeur avant le lancement commercial complet. Les présentes conditions constituent un cadre de référence pendant la phase de lancement.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">2. Âge minimum</h2>
              <p className="mt-3">L&apos;inscription et l&apos;utilisation d&apos;Embir sont strictement réservées aux personnes âgées d&apos;au moins 18 ans. Toute personne n&apos;ayant pas atteint cet âge n&apos;est pas autorisée à créer un compte. En cas de signalement d&apos;un profil mineur, le compte est immédiatement suspendu et supprimé après vérification.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">3. Création de compte</h2>
              <p className="mt-3">Pour utiliser Embir, vous devez créer un compte en fournissant des informations exactes vous concernant. Vous êtes responsable de la confidentialité de vos identifiants. Vous ne devez pas créer de compte au nom d&apos;une autre personne, usurper une identité, ou créer plusieurs comptes pour contourner une suspension.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">4. Comportements interdits</h2>
              <p className="mt-3">Les comportements suivants sont strictement interdits sur Embir :</p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                <li>Harcèlement, intimidation, menaces ou discours de haine</li>
                <li>Discrimination fondée sur l&apos;orientation, l&apos;identité de genre, l&apos;origine, la religion ou le handicap</li>
                <li>Usurpation d&apos;identité ou création de faux profils</li>
                <li>Sollicitation commerciale, spam ou publicité non autorisée</li>
                <li>Partage de contenus sexuellement explicites non sollicités</li>
                <li>Proposition ou sollicitation de services sexuels rémunérés</li>
                <li>Collecte de données personnelles d&apos;autres utilisateurs sans consentement</li>
                <li>Toute activité illégale ou contraire aux lois applicables</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">5. Signalement et modération</h2>
              <p className="mt-3">Embir met à disposition des outils de signalement accessibles depuis chaque profil et chaque conversation. Les signalements sont examinés par notre équipe de modération. Nous nous réservons le droit de supprimer tout contenu signalé et de suspendre ou supprimer tout compte qui enfreint les présentes conditions, sans préavis et à notre seule discrétion.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">6. Suspension et suppression de compte</h2>
              <p className="mt-3">Nous pouvons suspendre ou supprimer votre compte en cas de violation des présentes conditions. Vous pouvez également demander la suppression de votre compte à tout moment via les paramètres de l&apos;application ou en contactant le support. La suppression entraîne l&apos;effacement de vos données personnelles dans les conditions décrites dans notre politique de confidentialité.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">7. Disponibilité du service</h2>
              <p className="mt-3">Embir est actuellement en phase de lancement. Le service est fourni « en l&apos;état » et nous ne garantissons pas une disponibilité ininterrompue. Nous pouvons interrompre le service pour maintenance, mises à jour ou améliorations. Nous nous efforçons de communiquer ces interruptions à l&apos;avance lorsque cela est possible.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">8. Modèle économique</h2>
              <p className="mt-3">Pendant la phase de lancement, Embir est gratuit. Les fonctions essentielles (profil, découverte, messagerie, compatibilité) sont accessibles sans frais. Un modèle freemium pourra être introduit ultérieurement pour financer l&apos;application mobile, la sécurité, la modération et l&apos;infrastructure. Les membres fondateurs seront informés de toute évolution du modèle économique avec un préavis raisonnable.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">9. Responsabilité</h2>
              <p className="mt-3">Embir est une plateforme de mise en relation. Nous ne vérifions pas l&apos;exactitude de toutes les informations fournies par les utilisateurs, malgré nos efforts de vérification. Nous ne sommes pas responsables des interactions entre utilisateurs en dehors de la plateforme. Nous encourageons chaque utilisateur à faire preuve de prudence lors des rencontres en personne.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">10. Propriété intellectuelle</h2>
              <p className="mt-3">Le nom Embir, le logo, le design de la plateforme et l&apos;ensemble des contenus originaux sont protégés par le droit d&apos;auteur et les lois sur la propriété intellectuelle. Les utilisateurs conservent la propriété du contenu qu&apos;ils publient sur la plateforme et accordent à Embir une licence limitée pour afficher ce contenu dans le cadre du service.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">11. Données personnelles</h2>
              <p className="mt-3">Le traitement de vos données personnelles est détaillé dans notre <Link href="/privacy" className="text-[#d4a574] underline hover:text-[#e8c4a2]">politique de confidentialité</Link>. En utilisant Embir, vous acceptez cette politique.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">12. Contact</h2>
              <p className="mt-3">Pour toute question relative aux présentes conditions : <a href="mailto:support@embir.xyz" className="text-[#d4a574] underline hover:text-[#e8c4a2]">support@embir.xyz</a></p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-white">13. Loi applicable</h2>
              <p className="mt-3">Les présentes conditions sont régies par le droit applicable selon la structure juridique de l&apos;éditeur. Cette section sera complétée avec les informations définitives avant le lancement commercial complet.</p>
            </div>
          </section>

          <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
            <h2 className="font-serif text-3xl text-white">Rejoindre la communauté fondatrice</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Crée ton profil gratuitement pendant le lancement et aide Embir à construire une plateforme plus saine pour toutes les orientations.</p>
            <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
          </section>
        </article>
      </main>
    );
  }

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Legal</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-white/35">Last updated: June 17, 2026</p>

        <section className="mt-12 space-y-6 text-base leading-relaxed text-white/55">
          <div>
            <h2 className="font-serif text-2xl text-white">1. Purpose of the service</h2>
            <p className="mt-3">Embir is an online dating platform accessible via the web (embir.xyz) designed for adults of all orientations. The service allows users to create a profile, discover other profiles based on declared preferences, exchange messages, and participate in a founding community.</p>
            <p className="mt-3">This page will be completed with the publisher&apos;s definitive legal information before full commercial launch. These terms serve as a reference framework during the launch phase.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">2. Minimum age</h2>
            <p className="mt-3">Registration and use of Embir are strictly reserved for individuals aged 18 years or older. Anyone under this age is not permitted to create an account. If an underage profile is reported, the account is immediately suspended and deleted upon verification.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">3. Account creation</h2>
            <p className="mt-3">To use Embir, you must create an account by providing accurate information about yourself. You are responsible for the confidentiality of your login credentials. You must not create an account on behalf of another person, impersonate anyone, or create multiple accounts to bypass a suspension.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">4. Prohibited behavior</h2>
            <p className="mt-3">The following behaviors are strictly prohibited on Embir:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Harassment, intimidation, threats, or hate speech</li>
              <li>Discrimination based on orientation, gender identity, origin, religion, or disability</li>
              <li>Identity theft or creation of fake profiles</li>
              <li>Commercial solicitation, spam, or unauthorized advertising</li>
              <li>Sharing unsolicited sexually explicit content</li>
              <li>Offering or soliciting paid sexual services</li>
              <li>Collecting personal data from other users without consent</li>
              <li>Any illegal activity or activity contrary to applicable laws</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">5. Reporting and moderation</h2>
            <p className="mt-3">Embir provides reporting tools accessible from every profile and every conversation. Reports are reviewed by our moderation team. We reserve the right to remove any reported content and to suspend or delete any account that violates these terms, without notice and at our sole discretion.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">6. Account suspension and deletion</h2>
            <p className="mt-3">We may suspend or delete your account in case of violation of these terms. You may also request deletion of your account at any time via the app settings or by contacting support. Deletion results in the erasure of your personal data under the conditions described in our privacy policy.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">7. Service availability</h2>
            <p className="mt-3">Embir is currently in its launch phase. The service is provided &quot;as is&quot; and we do not guarantee uninterrupted availability. We may interrupt the service for maintenance, updates, or improvements. We strive to communicate these interruptions in advance when possible.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">8. Business model</h2>
            <p className="mt-3">During the launch phase, Embir is free. Core features (profile, discovery, messaging, compatibility) are accessible at no cost. A freemium model may be introduced later to fund the mobile app, security, moderation, and infrastructure. Founding members will be informed of any changes to the business model with reasonable notice.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">9. Liability</h2>
            <p className="mt-3">Embir is a matchmaking platform. We do not verify the accuracy of all information provided by users, despite our verification efforts. We are not responsible for interactions between users outside the platform. We encourage every user to exercise caution during in-person meetings.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">10. Intellectual property</h2>
            <p className="mt-3">The name Embir, the logo, the platform design, and all original content are protected by copyright and intellectual property laws. Users retain ownership of the content they publish on the platform and grant Embir a limited license to display this content within the service.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">11. Personal data</h2>
            <p className="mt-3">The processing of your personal data is detailed in our <Link href="/privacy" className="text-[#d4a574] underline hover:text-[#e8c4a2]">privacy policy</Link>. By using Embir, you accept this policy.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">12. Contact</h2>
            <p className="mt-3">For any questions regarding these terms: <a href="mailto:support@embir.xyz" className="text-[#d4a574] underline hover:text-[#e8c4a2]">support@embir.xyz</a></p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-white">13. Governing law</h2>
            <p className="mt-3">These terms are governed by the applicable law according to the publisher&apos;s legal structure. This section will be completed with definitive information before full commercial launch.</p>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">Join the founding community</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Create your profile for free during launch and help Embir build a healthier platform for every orientation.</p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Create my free profile</Link>
        </section>
      </article>
    </main>
  );
}
