import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Rencontres à Lyon — Profils Vérifiés, Compatibilité Réelle | Embir",
    en: "Dating in Lyon — Verified Profiles, Real Compatibility | Embir",
  };
  const descriptions: Record<string, string> = {
    fr: "Application de rencontre à Lyon : profils vérifiés, matching par compatibilité, communauté fondatrice. gratuite pour les connexions essentielles. Presqu&apos;île, Croix-Rousse, Vieux Lyon et au-delà.",
    en: "Lyon dating app: verified profiles, compatibility matching, and a founding community. core connection features are free. Presqu&apos;île, Croix-Rousse, Vieux Lyon and beyond.",
  };
  return {
    title: titles[locale] ?? titles.fr,
    description: descriptions[locale] ?? descriptions.fr,
    alternates: {
      canonical: "https://embir.xyz/lyon",
      languages: { "en": "https://embir.xyz/en/dating-lyon" },
    },
    openGraph: {
      title: titles[locale] ?? titles.fr,
      description: descriptions[locale] ?? descriptions.fr,
      url: "https://embir.xyz/lyon",
      locale: locale === "en" ? "en_US" : "fr_FR",
      siteName: "Embir",
      images: [{ url: `/api/og?title=Rencontres+à+Lyon+%7C+Embir&variant=default`, width: 1200, height: 630, alt: "Embir Lyon rencontres" }],
    },
    twitter: { card: "summary_large_image", title: "Rencontres à Lyon | Embir", description: "Application de rencontre à Lyon : profils vérifiés, matching par compatibilité.", images: [`/api/og?title=Rencontres+à+Lyon+%7C+Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default function Page() {
  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">Lyon · France</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Rencontres à Lyon, avec des profils vérifiés et une vraie compatibilité</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          Lyon est la troisième ville de France, mais son marché des rencontres reste étonnamment mal servi. Entre la Presqu&apos;île élégante, la Croix-Rousse bohème, et le Vieux Lyon touristique, les Lyonnais cherchent des connexions authentiques — mais se heurtent souvent aux mêmes profils recyclés et aux mêmes conversations qui ne mènent nulle part. Embir arrive à Lyon avec une approche différente : moins de faux profils, des intentions plus claires, et une compatibilité qui va au-delà de la proximité.
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">Pourquoi Lyon</h2>
            <p className="mt-4">Lyon est une ville de contrastes — gastronomie et street food, quartiers historiques et pôles tech, étudiants et cadres. La densité est réelle, mais elle ne garantit pas des rencontres de qualité. Les applications grand public traitent Lyon comme une extension de Paris, sans tenir compte de sa culture locale : plus discrète, plus exigeante, plus attachée à l&apos;authenticité.</p>
            <p className="mt-3">Nous construisons la communauté lyonnaise quartier par quartier — en commençant par un noyau de membres fondateurs qui valorisent la vérification, les intentions claires et la compatibilité. Pas de chiffres gonflés. Pas de faux comptes. Juste de vrais Lyonnais qui construisent une vraie communauté locale.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Des rencontres lyonnaises, avec du fond</h2>
            <div className="mt-4 space-y-3">
              {[
                ["De la Croix-Rousse aux Brotteaux, vérifié", "Lyon a des quartiers aux identités marquées. Quelqu&apos;un à la Croix-Rousse ne vit pas au même rythme que quelqu&apos;un dans le 6e. Les signaux de compatibilité d&apos;Embir vont plus loin que l&apos;arrondissement — ils regardent le style de vie, les intentions, et ce que vous attendez vraiment d&apos;une rencontre."],
                ["Lyon gay, Lyon lesbien, Lyon queer", "Lyon a une scène LGBTQ+ dynamique — des pentes de la Croix-Rousse au Vieux Lyon, en passant par les associations et événements culturels. La visibilité orientée d&apos;Embir garantit que vous ne voyez que les profils compatibles, que vous soyez un homme gay à Lyon, une femme lesbienne, ou une personne trans cherchant des connexions respectueuses."],
                ["Fini les boucles « salut, ça va ? »", "Les applis de rencontre à Lyon souffrent du même problème qu&apos;ailleurs : des conversations qui ne décollent jamais. Embir encourage des profils plus riches — centres d&apos;intérêt, préférences, intentions — pour que le premier message parle de quelque chose de réel, pas juste briser la glace."],
                ["Membres fondateurs, pas métriques gonflées", "On ne va pas vous dire qu&apos;il y a 100 000 membres à Lyon alors que ce n&apos;est pas vrai. La communauté fondatrice démarre petite, vérifiée, et réelle. Chaque membre compte. La qualité avant la quantité, dès le premier jour."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-7">
            <h2 className="font-serif text-2xl text-white">gratuit pour les connexions essentielles — sans étiquette lyonnaise</h2>
            <p className="mt-4">Lyon n&apos;est pas bon marché, mais Embir est gratuit pour les connexions essentielles. Créez votre profil, définissez vos préférences, parcourez les personnes compatibles, envoyez des messages — tout cela sans payer. Des services facultatifs peuvent financer l’application mobile, la sécurité et la modération, sans bloquer le chemin vers une rencontre.</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Ce que les membres fondateurs lyonnais obtiennent</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Communauté vérifiée", "Vérification par selfie dès le premier jour. Discutez avec de vrais Lyonnais, pas avec des bots ou des faux profils."],
                ["Contrôle d&apos;orientation", "Que vous soyez hétéro, gay, lesbienne, bi, trans ou queer — choisissez qui voit votre profil et qui vous souhaitez découvrir."],
                ["Signaux de compatibilité", "Centres d&apos;intérêt partagés, intentions relationnelles, préférences de style de vie. Matchez sur ce qui compte, pas juste une photo."],
                ["Phase initiale sur invitation", "Faites venir vos amis, construisez votre cercle. Les meilleures communautés de rencontre se développent par la confiance, pas par la publicité."],
                ["Façonnez la culture", "Les membres fondateurs influencent les normes de modération, les priorités de fonctionnalités et les standards communautaires. Votre voix compte."],
                ["Accès prioritaire à l&apos;app mobile", "Les membres fondateurs lyonnais seront les premiers servis lors du lancement des applications iOS et Android."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">Questions fréquentes</h2>
            <div className="mt-6 space-y-3">
              {[
                ["Combien de membres Embir a-t-il à Lyon ?", "Embir est en expérience de connexion. Nous construisons la communauté fondatrice lyonnaise en ce moment — en commençant par un noyau de membres vérifiés. Nous ne publions pas de chiffres gonflés. La communauté grandit par invitations et bouche-à-oreille."],
                ["Est-ce qu&apos;Embir est uniquement pour les rencontres gay à Lyon ?", "Non. Embir est pour toutes les orientations. Les hommes gays et bi, les femmes lesbiennes et bi, les personnes trans et queer, et les hétérosexuels partagent tous la même plateforme. Les contrôles d&apos;orientation garantissent que chacun ne voit que les profils compatibles."],
                ["En quoi Embir est différent de Tinder à Lyon ?", "Tinder à Lyon, c&apos;est du swipe à haut volume et de la fatigue. Embir mise sur la compatibilité, les profils vérifiés et des intentions plus claires. Moins de matchs aléatoires, plus de connexions qui ont une vraie chance d&apos;aboutir."],
                ["Est-ce qu&apos;Embir est une bonne alternative à Fruitz à Lyon ?", "Si vous voulez plus de substance que des icônes de fruits, oui. Embir se concentre sur les signaux de compatibilité et les profils vérifiés. Toutes les intentions relationnelles sont les bienvenues — sérieuses, légères, ou à définir."],
                ["Quand l&apos;application mobile sera-t-elle disponible ?", "En développement. La version web fonctionne sur les navigateurs mobiles. Les membres fondateurs lyonnais seront les premiers à accéder aux applications natives."],
              ].map(([q, a]) => (
                <details key={q} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80">{q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">Rejoignez la communauté fondatrice de Lyon</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Soyez parmi les premiers membres lyonnais. Profil vérifié. Vraie compatibilité. Les connexions essentielles sont gratuites. Aidez à construire une culture de la rencontre dont Lyon mérite.</p>
          <Link href="/auth/register?utm_source=seo&utm_medium=organic&utm_campaign=city_landing" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
        </section>

        <section className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
          <h2 className="font-serif text-2xl text-white">Explorer plus</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              ["/paris", "Rencontres Paris"],
              ["/us", "Rencontres US"],
              ["/uk", "Rencontres UK"],
              ["/switzerland", "Rencontres Suisse"],
              ["/lgbtq-dating-app", "Rencontres LGBTQ"],
              ["/verified-dating-app", "Profils vérifiés"],
              ["/free-dating-app", "App gratuite"],
              ["/tinder-alternative", "Alternative Tinder"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-[#d4a574]/30 hover:text-[#d4a574]">{label}</Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
