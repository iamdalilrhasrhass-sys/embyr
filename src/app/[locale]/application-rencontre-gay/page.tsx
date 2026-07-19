import type { Metadata } from "next";
import Link from "next/link";
import TrackedLink from "@/components/TrackedLink";
import PageTypeTracker from "@/components/PageTypeTracker";

export const metadata: Metadata = {
  title: "Application de rencontre gay gratuite en France — Profils vérifiés, sans pub",
  description: "Embir est une application de rencontre gay dont les connexions essentielles sont gratuites pensée pour la France. Profils vérifiés, matching intelligent, zéro pub et Messagerie entre connexions réciproques. Disponible à Paris, Lyon, Marseille, Toulouse et partout en France.",
  alternates: {
    canonical: "https://embir.xyz/application-rencontre-gay",
    languages: {
      "en": "https://embir.xyz/free-gay-dating-app",
      "en-US": "https://embir.xyz/gay-dating-app-usa",
      "en-GB": "https://embir.xyz/gay-dating-app-uk",
    },
  },
  openGraph: {
    title: "Application de rencontre gay gratuite en France",
    description: "connexions essentielles gratuites, profils vérifiés, sans publicité. L'application de rencontre gay pensée pour les hommes en France.",
    url: "https://embir.xyz/application-rencontre-gay",
    locale: "fr_FR",
    images: [`/api/og?title=Application+de+rencontre+gay+gratuite+en+France&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <PageTypeTracker type="landing" market="FR" />
      {/* Hero */}
      <section className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(216,139,167,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-embir-rose/20 bg-embir-rose/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-embir-rose" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-embir-rose/80">France</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            Une application de rencontre gay<br />
            <span className="text-embir-rose">vraiment gratuite en France.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            Embir est une nouvelle application de rencontre gay, conçue pour les hommes
            qui cherchent des connexions authentiques. Profils vérifiés, matching intelligent,
            zéro publicité, Messagerie entre connexions réciproques et gratuite — disponible à Paris, Lyon,
            Marseille, Toulouse, Nice et dans toute la France.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TrackedLink href="/auth/register?source=fr-landing" label="Créer mon profil gratuit" location="fr-landing-hero" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void transition-all hover:bg-embir-blush hover:shadow-[0_0_40px_rgba(216,139,167,0.3)]">
              Créer mon profil gratuit
            </TrackedLink>
            <Link href="/membres" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white">
              Voir les membres
            </Link>
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30">Le constat</p>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
              Les applis de rencontre gay<br />
              <span className="text-white/50">sont devenues des supermarchés.</span>
            </h2>
            <p className="mt-5 text-white/45 leading-relaxed">
              Entre les abonnements à 15-30 € par mois, les pubs toutes les trois secondes,
              les faux profils qui pullulent et les fonctionnalités basiques verrouillées derrière
              des paywalls, les applications de rencontre gay ressemblent plus à des machines
              à cash qu&apos;à des espaces de connexion humaine.
            </p>
            <p className="mt-4 text-white/45 leading-relaxed">
              Embir repart de zéro avec une question simple : à quoi ressemblerait une appli
              de rencontre si elle respectait vraiment ses utilisateurs ? La réponse : gratuite,
              vérifiée, sans pub, et pensée pour la compatibilité réelle — pas juste la proximité
              géographique.
            </p>
            <p className="mt-4 text-white/45 leading-relaxed">
              Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Les membres fondateurs contribuent aux choix produit.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
            <h3 className="text-lg font-bold text-white mb-6">Ce qu&apos;Embir vous offre</h3>
            <ul className="space-y-4">
              {[
                { label: "Messagerie réciproque", desc: "La conversation s'ouvre après une connexion mutuelle et les étapes de révélation prévues." },
                { label: "Profils vérifiés", desc: "Chaque membre peut demander une vérification par selfie. Les profils approuvés affichent un badge ; aucun système ne garantit l’absence de bots ou de faux comptes." },
                { label: "Matching intelligent", desc: "Le moteur applique vos préférences déclarées dans les deux sens et explique les principaux points de compatibilité." },
                { label: "Zéro publicité", desc: "Pas de bannières, pas de pubs interstitielles, pas de profils sponsorisés." },
                { label: "Présent dans toute la France", desc: "Paris, Lyon, Marseille, Toulouse, Nice, Lille, Bordeaux, et partout ailleurs." },
                { label: "Outils de sécurité", desc: "Blocage immédiat, signalement enregistré et contrôles de confidentialité." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-embir-rose/10 text-embir-rose flex items-center justify-center text-xs">✓</span>
                  <div>
                    <span className="text-sm font-semibold text-white/80">{item.label}</span>
                    <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Villes */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/30 text-center">Villes françaises</p>
          <h2 className="mt-4 text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            Embir construit des communautés<br />
            <span className="text-embir-rose">dans toute la France.</span>
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { city: "Paris", desc: "Le Marais, Bastille, Belleville — des milliers de profils dans la capitale.", href: "/paris" },
              { city: "Lyon", desc: "Vieux Lyon, Presqu'île, Croix-Rousse — une scène gay dynamique mérite une appli à la hauteur.", href: "/lyon" },
              { city: "Marseille", desc: "Du Vieux-Port au Panier, trouvez des connexions authentiques sous le soleil.", href: "/marseille" },
              { city: "Toulouse", desc: "Capitole, Saint-Cyprien — la ville rose a une communauté qui ne demande qu'à grandir.", href: "/toulouse" },
              { city: "Nice", desc: "Promenade des Anglais, Vieux Nice — rencontres sur la Côte d'Azur.", href: "/nice" },
              { city: "Lille", desc: "Vieux-Lille, Wazemmes — le Nord a aussi son appli de rencontre gratuite.", href: "/lille" },
            ].map((c, i) => (
              <Link key={i} href={c.href} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-embir-rose/20 hover:bg-white/[0.04]">
                <h3 className="text-lg font-bold text-white group-hover:text-embir-rose transition-colors">{c.city}</h3>
                <p className="mt-2 text-sm text-white/40 leading-relaxed">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparatif */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            Embir face aux autres applis<br />
            <span className="text-white/50">en France.</span>
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-4 border-b border-white/[0.04] px-6 py-4 text-sm font-semibold tracking-wider text-white/30 uppercase">
              <div>Fonctionnalité</div>
              <div className="text-center">Grindr</div>
              <div className="text-center">Tinder</div>
              <div className="text-center text-embir-rose">Embir</div>
            </div>
            {[
              ["Prix", "~15€/mois", "~20€/mois", "Gratuit"],
              ["Publicités", "Partout", "Fréquentes", "Zéro"],
              ["Vérification", "Optionnelle", "Optionnelle", "Obligatoire"],
              ["compatibilité réciproque", "Aucun", "Basique", "DeepSeek IA"],
              ["Messages gratuits", "Limités", "Match requis", "Illimités"],
              ["Profils", "Basiques", "Basiques", "Détaillés + Tags"],
              ["Sécurité", "Minimale", "Minimale", "signalement et blocage"],
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 border-b border-white/[0.02] px-6 py-3.5 last:border-b-0 hover:bg-white/[0.01] transition-colors">
                <div className="text-sm text-white/60">{row[0]}</div>
                <div className="text-sm text-center text-white/30">{row[1]}</div>
                <div className="text-sm text-center text-white/30">{row[2]}</div>
                <div className="text-sm text-center font-semibold text-embir-rose">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {[
              { q: "Est-ce qu'Embir est vraiment gratuit en France ?", a: "Oui. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Les membres fondateurs contribuent aux choix produit." },
              { q: "Comment fonctionne la vérification ?", a: "La vérification selfie est facultative. Une demande approuvée ajoute un badge visible ; ce badge ne prouve ni l'identité complète ni les intentions." },
              { q: "Embir est-il une alternative à Grindr ?", a: "Embir utilise les préférences déclarées dans les deux sens plutôt qu'un simple tri par distance. Le blocage, le signalement et un badge selfie facultatif sont disponibles. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire." },
              { q: "Dans quelles villes françaises Embir est-il disponible ?", a: "Les inscriptions sont ouvertes partout en France. Embir ne publie pas de classement de densité locale sans données mesurées suffisantes." },
              { q: "Comment la mesure d'audience fonctionne-t-elle ?", a: "La mesure d'audience est soumise au consentement. Les préférences sensibles restent protégées par les contrôles d'accès du produit." },
            ].map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <summary className="cursor-pointer px-6 py-5 text-sm font-semibold text-white/80 group-open:text-embir-rose transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="px-6 pb-5 text-sm text-white/45 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-light tracking-[-0.02em] text-white sm:text-4xl">
            Prêt à faire de vraies rencontres ?<br />
            <span className="text-embir-rose">Gratuit, vérifié, sans pub.</span>
          </h2>
          <p className="mt-4 text-white/35">Rejoignez les membres fondateurs. Aucune carte bancaire requise.</p>
          <Link href="/auth/register?source=fr-landing" className="mt-8 inline-flex items-center gap-2 rounded-full bg-embir-rose px-10 py-4 text-sm font-bold text-embir-void transition-all hover:bg-embir-blush hover:shadow-[0_0_40px_rgba(216,139,167,0.3)]">
            Créer mon profil gratuit
          </Link>
          <p className="mt-4 text-xs text-white/20">18+ uniquement. Les connexions essentielles sont gratuites. Sans engagement.</p>
        </div>
      </section>

      {/* Liens internes */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-white/20 mb-4">Explorez aussi</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/blog/meilleures-applis-rencontre-gay-france" className="text-sm text-white/35 hover:text-embir-rose transition-colors underline underline-offset-4">Meilleures applis rencontre gay</Link>
            <span className="text-white/10">·</span>
            <Link href="/blog/alternative-grindr-gratuite" className="text-sm text-white/35 hover:text-embir-rose transition-colors underline underline-offset-4">Alternative à Grindr gratuite</Link>
            <span className="text-white/10">·</span>
            <Link href="/paris" className="text-sm text-white/35 hover:text-embir-rose transition-colors underline underline-offset-4">Rencontre gay Paris</Link>
            <span className="text-white/10">·</span>
            <Link href="/grindr-vs-alternatives" className="text-sm text-white/35 hover:text-embir-rose transition-colors underline underline-offset-4">Comparatif Grindr vs alternatives</Link>
            <span className="text-white/10">·</span>
            <Link href="/" className="text-sm text-white/35 hover:text-embir-rose transition-colors underline underline-offset-4">Accueil Embir</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
