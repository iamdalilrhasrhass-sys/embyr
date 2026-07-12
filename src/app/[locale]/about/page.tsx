import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === "fr" ? "https://embir.xyz/fr/about" : "https://embir.xyz/about";
  const title = locale === "fr" ? "À propos d'Embir — Application de rencontre inclusive" : "About Embir — Inclusive Dating App";
  const description = locale === "fr"
    ? "Embir est une application de rencontre inclusive, gratuite pour les connexions essentielles. Pour toutes les orientations, avec profils vérifiés, compatibilité réelle et modèle freemium transparent."
    : "Embir is an inclusive dating app with free core connections. For all orientations, with verified profiles, real compatibility, and a transparent freemium model.";
  return {
    title, description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: { canonical: url, languages: { "fr-FR": "https://embir.xyz/fr/about", "en": "https://embir.xyz/about", "x-default": "https://embir.xyz/about" } },
    openGraph: { title, description, url, siteName: "Embir", locale: locale === "fr" ? "fr_FR" : "en_US", type: "website", images: [{ url: `/api/og?title=Embir&variant=default`, width: 1200, height: 630, alt: "Embir" }] },
    twitter: { card: "summary_large_image", title, description, images: [`/api/og?title=Embir&variant=default`] },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{isFr ? "Embir" : "Embir"}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          {isFr ? "À propos d'Embir" : "About Embir"}
        </h1>

        <section className="mt-12 space-y-10 text-base leading-relaxed text-white/55">
          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Pourquoi Embir existe" : "Why Embir exists"}</h2>
            <p className="mt-4">{isFr ? "Les applications de rencontre devaient rapprocher les gens. Mais aujourd'hui, beaucoup sont devenues des usines à swipe : profils sans substance, paywalls précoces, vérification inexistante, et algorithmes qui optimisent le temps passé plutôt que la qualité des connexions." : "Dating apps were supposed to bring people together. But today, many have become swipe factories: empty profiles, early paywalls, non-existent verification, and algorithms optimizing time spent rather than connection quality."}</p>
            <p className="mt-4">{isFr ? "Embir est né d'une conviction simple : la technologie de la rencontre peut faire mieux. Mieux pour les hétérosexuels, les gays, les lesbiennes, les bisexuels, les personnes trans, queer, ou encore en exploration. Mieux pour ceux qui veulent du sérieux comme pour ceux qui veulent découvrir. Mieux pour la sécurité, la transparence et le respect." : "Embir was born from a simple conviction: dating technology can do better. Better for straight people, gay people, lesbians, bisexuals, trans people, queer people, and those still exploring. Better for those seeking something serious and those open to discovery. Better for safety, transparency, and respect."}</p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Ce qui nous distingue" : "What sets us apart"}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(isFr ? [
                ["Orientation et visibilité", "Vous déclarez votre orientation et vos préférences. Votre profil n'est visible que par les personnes compatibles. Pas de mauvaise surprise."],
                ["Profils vérifiés", "La vérification par selfie réduit les faux profils. Pas de promesse magique — juste une barrière concrète contre le catfishing."],
                ["gratuit pour les connexions essentielles", "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire."],
                ["Compatibilité réelle", "Notre matching ne se limite pas à la distance. Préférences, intentions, style de vie : nous connectons les personnes qui se ressemblent vraiment."],
                ["signalement et blocage", "Chaque signalement est enregistré pour examen ; tu peux bloquer immédiatement le compte concerné. Pas seulement un algorithme qui ferme les yeux."],
                ["Transparence économique", "Nous expliquons clairement ce qui est gratuit, ce qui deviendra premium, et pourquoi. Pas de frais cachés."],
              ] : [
                ["Orientation & Visibility", "You declare your orientation and preferences. Your profile is only visible to compatible people. No awkward surprises."],
                ["Verified Profiles", "Selfie verification reduces fake profiles. No magic promise — just a real barrier against catfishing."],
                ["core connection features are free", "Everything needed to meet someone is free. No credit card required."],
                ["Real Compatibility", "Our matching goes beyond distance. Preferences, intentions, lifestyle: we connect people who truly align."],
                ["reporting and blocking", "Every report is recorded for review; you can block the account immediately. Not just an algorithm that looks the other way."],
                ["Economic Transparency", "We clearly explain what's free, what will become premium, and why. No hidden fees."],
              ]).map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Notre approche du lancement" : "Our launch approach"}</h2>
            <p className="mt-4">{isFr ? "Embir est en expérience de connexion mondial. La communauté se construit ville par ville pour garder une vraie densité locale, mais l'accès est ouvert aux membres fondateurs partout dans le monde. Votre feedback, vos signalements et votre participation façonnent la plateforme de demain." : "Embir is in its worldwide core connection experience. The community grows city by city to keep real local density, but access is open to founding members everywhere. Your feedback, reports, and participation shape tomorrow's platform."}</p>
            <p className="mt-4">{isFr ? "L'application mobile est en développement et sera disponible après l'expérience de connexion web. Les options facultatives transparentes financeront cette application mobile, ainsi que la sécurité, la modération et l'amélioration continue du service." : "The mobile app is in development and will be available after the web core connection experience. optional services will fund this mobile app, as well as security, moderation, and continuous service improvement."}</p>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Rejoindre la communauté fondatrice" : "Join the founding community"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            {isFr ? "Fais partie des premiers membres d'Embir et aide-nous à construire une plateforme de rencontre plus saine et plus inclusive." : "Be one of Embir's first members and help us build a healthier, more inclusive dating platform."}
          </p>
          <Link href="/auth/register" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">{isFr ? "Créer mon profil gratuit" : "Create my free profile"}</Link>
        </section>
      </article>
    </main>
  );
}
