import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Embir Paris — 100 membres fondateurs | Rencontre gay gratuite",
  description:
    "Rejoins le lancement Paris d'Embir : 100 membres fondateurs, profils réels, messagerie gratuite, sans pubs et sans faux comptes.",
  keywords: [
    "Embir Paris",
    "rencontre gay Paris",
    "app rencontre gay gratuite Paris",
    "membres fondateurs Embir",
    "rencontre gay sans pub",
  ],
  alternates: { canonical: "https://embir.xyz/paris" },
  openGraph: {
    title: "Embir Paris — les 100 premiers membres fondateurs",
    description:
      "Un lancement local, honnête et gratuit pour créer assez de vrais profils à Paris.",
    url: "https://embir.xyz/paris",
    type: "website",
  },
};

const registerHref = "/auth/register?source=paris-100-fondateurs";

const rules = [
  "Vrais profils uniquement : pas de faux comptes pour gonfler les chiffres.",
  "Lancement gratuit : messages, profils et découverte ouverts pendant la phase fondatrice.",
  "Paris d'abord : on concentre les premiers membres au même endroit pour créer de vraies rencontres.",
  "Respect non négociable : signalement, modération et communauté adulte 18+.",
];

const steps = [
  {
    title: "Crée ton profil",
    text: "Ajoute une photo claire, ton prénom ou pseudo, et ce que tu cherches vraiment.",
  },
  {
    title: "Invite 2 ou 3 amis",
    text: "Embir marche quand la communauté démarre par des personnes réelles, pas par de la pub vide.",
  },
  {
    title: "Teste pendant 7 jours",
    text: "Dis-nous ce qui manque, ce qui bloque, et ce qui rendrait l'app évidente pour toi.",
  },
];

const founderPerks = [
  "Badge membre fondateur",
  "Accès gratuit pendant le lancement",
  "Priorité sur les retours produit",
  "Influence directe sur les prochaines fonctionnalités",
];

export default function ParisFoundersPage() {
  return (
    <main className="emb-page min-h-screen overflow-hidden">
      <section className="relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(212,165,116,0.22),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/25 bg-[#d4a574]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e8c4a2]">
              <span className="h-2 w-2 rounded-full bg-[#d4a574] shadow-[0_0_18px_rgba(212,165,116,0.9)]" />
              Paris · lancement local
            </div>

            <h1 className="font-serif text-5xl font-light leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
              Les 100 premiers
              <span className="block bg-gradient-to-r from-[#e8c4a2] via-[#d4a574] to-[#f0d0b0] bg-clip-text text-transparent">
                membres fondateurs
              </span>
              d&apos;Embir Paris.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/52">
              On ne va pas te vendre une app pleine si elle démarre. On fait mieux :
              on lance Paris volontairement, avec de vrais profils, gratuitement, et
              assez de monde au même endroit pour que les rencontres deviennent possibles.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={registerHref}
                className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2] hover:shadow-[0_0_44px_rgba(212,165,116,0.32)]"
              >
                Rejoindre les 100 fondateurs
              </Link>
              <Link
                href="/membres"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                Voir les membres
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/32">
              18+ uniquement · gratuit au lancement · sans pubs · sans faux profils.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#120c1a]/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] border border-[#d4a574]/18 bg-gradient-to-br from-[#d4a574]/10 via-white/[0.03] to-[#6366F1]/10 p-7">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d4a574]/75">
                Objectif public
              </p>
              <div className="mt-5 flex items-end gap-3">
                <span className="font-serif text-7xl font-light text-white">100</span>
                <span className="pb-3 text-lg text-white/45">profils réels</span>
              </div>
              <div className="mt-6 rounded-2xl border border-white/8 bg-black/18 p-4 text-sm font-medium text-white/60">
                On affiche l&apos;objectif, pas un faux compteur : les vrais chiffres se suivent en interne.
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/45">
                Le but n&apos;est pas de paraître énorme. Le but est de créer une
                première poche active à Paris, avec des personnes qui veulent vraiment
                tester une alternative plus saine.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {founderPerks.map((perk) => (
                  <div key={perk} className="rounded-2xl border border-white/8 bg-black/18 px-4 py-3 text-sm text-white/70">
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#d4a574]/65">
              Pourquoi Paris d&apos;abord
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.03em] text-white">
              Une app de rencontre ne gagne pas avec du bruit.
              <span className="text-[#d4a574]"> Elle gagne avec de la densité.</span>
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/8 md:grid-cols-4">
            {rules.map((rule) => (
              <div key={rule} className="bg-[#0a0614] p-6 text-sm leading-relaxed text-white/50">
                <span className="mb-5 block h-1.5 w-10 rounded-full bg-[#d4a574]" />
                {rule}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#d4a574]/65">
              Ce qu&apos;on te demande
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.03em] text-white">
              Trois actions simples.
            </h2>
            <p className="mt-5 text-white/45">
              Si tu veux qu&apos;une app gay française existe vraiment, le premier
              geste est simple : créer un vrai profil et inviter quelques personnes fiables.
            </p>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/8 bg-white/[0.025] p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a574]/12 text-sm font-bold text-[#d4a574]">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d4a574]/18 bg-gradient-to-br from-[#d4a574]/10 via-[#120c1a] to-[#6366F1]/10 p-8 text-center sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d4a574]/75">
            Message à partager
          </p>
          <blockquote className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            “Je teste Embir, une nouvelle app de rencontre gay gratuite qui lance
            ses 100 premiers membres à Paris. Pas de pubs, pas de faux profils,
            juste une vraie communauté au départ. Tu peux rejoindre ici :
            embir.xyz/paris”
          </blockquote>
          <Link
            href={registerHref}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2]"
          >
            Je crée mon profil fondateur
          </Link>
        </div>
      </section>
    </main>
  );
}
