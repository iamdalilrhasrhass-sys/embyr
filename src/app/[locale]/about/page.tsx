import EmbirLogo from "@/components/brand/EmbirLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — embir.xyz",
  description: "Découvrez embir.xyz, l'application de rencontre gay gratuite qui commence par 100 membres fondateurs à Paris.",
};

const team = [
  { name: "Dalil R.", role: "Fondateur & CEO", desc: "Entrepreneur tech passionné par les expériences utilisateur qui changent vraiment les choses." },
  { name: "DeepSeek", role: "IA de Matching", desc: "Analyse les personnalités pour des rencontres vraiment compatibles." },
  { name: "Toi ?", role: "Rejoins l'aventure", desc: "On recrute des talents pour construire la meilleure expérience de rencontre." },
];

const values = [
  { title: "Authenticité", desc: "Pas de faux profils pour faire croire que l'app est pleine. On préfère une petite communauté réelle à un faux décor." },
  { title: "Densité locale", desc: "On commence par Paris / Île-de-France pour créer assez de vrais profils au même endroit." },
  { title: "Accessibilité", desc: "100% gratuit au lancement. Pas de pubs, pas de compteurs de swipe, pas de paywall pour les messages." },
  { title: "Respect", desc: "Zéro tolérance pour la toxicité. Signalement, modération et communauté adulte 18+." },
];

export default function AboutPage() {
  return (
    <main className="emb-page pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="text-center mb-24">
          <div className="mb-8 flex justify-center">
            <EmbirLogo size="lg" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-6">
            La rencontre,<br />
            <span className="bg-gradient-to-r from-[#e8c4a2] via-[#d4a574] to-[#f0d0b0] bg-clip-text text-transparent">
              repensée.
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            embir.xyz est née d&apos;un constat simple : une app de rencontre ne sert à rien si elle est vide,
            toxique ou remplie de faux profils. On commence donc petit, local et honnête : Paris, 100 membres
            fondateurs, puis seulement après on élargit.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-24">
          <div className="relative p-8 sm:p-12 rounded-2xl border border-white/5 bg-gradient-to-br from-[#120c1a] to-[#0a0612] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4a574]/50 to-transparent" />
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-6">Notre mission</h2>
            <p className="text-white/50 leading-relaxed text-base sm:text-lg">
              Permettre à chaque homme gay, bi ou curieux de faire des rencontres authentiques,
              sans barrière financière ni faux compteur. On utilise la technologie pour faciliter
              la rencontre, pas pour te garder bloqué dans un swipe infini.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#d4a574]">100%</div>
                <div className="text-xs text-white/30 mt-1">Gratuit au lancement</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#d4a574]">Paris</div>
                <div className="text-xs text-white/30 mt-1">D&apos;abord</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#d4a574]">7</div>
                <div className="text-xs text-white/30 mt-1">IA de matching</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#d4a574]">∞</div>
                <div className="text-xs text-white/30 mt-1">Messages gratuits</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-10 text-center">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-10 text-center">L&apos;équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((m, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center hover:border-white/10 transition-colors">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a574]/30 to-[#6366F1]/30 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-serif text-white/60">{m.name[0]}</span>
                </div>
                <h3 className="text-white font-semibold">{m.name}</h3>
                <p className="text-xs text-[#d4a574] mt-1 mb-3">{m.role}</p>
                <p className="text-sm text-white/30 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="p-10 rounded-2xl border border-white/5 bg-gradient-to-br from-[#d4a574]/5 via-transparent to-[#6366F1]/5">
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-4">Prêt à nous rejoindre ?</h2>
            <p className="text-white/40 mb-8 max-w-lg mx-auto">
              Rejoins les 100 premiers membres fondateurs à Paris. Un vrai profil vaut mieux que dix promesses.
            </p>
            <a
              href="/paris"
              className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4a574] to-[#c49464] text-[#0a0612] font-semibold text-sm hover:opacity-90 transition-all"
            >
              Rejoindre les fondateurs Paris
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
