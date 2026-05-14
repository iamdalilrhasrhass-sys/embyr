import EmbyrLogo from "@/components/brand/EmbyrLogo";
import EmbyrProductMockup from "@/components/landing/EmbyrProductMockup";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TiltCard from "@/components/motion/TiltCard";
import AuroraBackground from "@/components/motion/AuroraBackground";
import FloatingMockup from "@/components/motion/FloatingMockup";
import Particles3D from "@/components/ui/Particles3D";
import Link from "next/link";

export default function Home() {
  return (
    <main className="emb-page">
      {/* ── HERO ── */}
      <section className="emb-section relative flex min-h-screen flex-col items-center justify-center text-center overflow-hidden">
        <AuroraBackground variant="embyr" />
        <Particles3D count={50} className="absolute inset-0 z-[2]" />
        <div className="emb-container relative z-10">
          <EmbyrLogo size="lg" className="mb-8 justify-center" />
          <h1 className="emb-title max-w-4xl text-balance">
            Un cercle privé pour des
            <br />
            <span className="emb-gradient-text">connexions plus intenses</span>
          </h1>
          <p className="emb-subtitle mx-auto mt-6 max-w-2xl text-balance">
            Embyr propose une expérience confidentielle, premium et mobile-first
            pour découvrir des profils masculins qui veulent vraiment échanger.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/inscription" className="emb-button-primary">
              Entrer dans le cercle
            </Link>
            <Link href="/premium" className="emb-button-secondary">
              Voir Premium
            </Link>
          </div>

          {/* Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {["Club privé", "Profils vérifiés", "Messagerie premium", "Confidentialité"].map((b) => (
              <span key={b} className="emb-badge">✦ {b}</span>
            ))}
          </div>

          {/* Mockup */}
          <div className="mt-16">
            <FloatingMockup>
                <EmbyrProductMockup />
              </FloatingMockup>
          </div>
        </div>
      </section>

      {/* ── LE CERCLE PRIVÉ ── */}
      <section className="emb-section bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.06),transparent_50%)]">
        <div className="emb-container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Le cercle privé
            </div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Plus qu&rsquo;une plateforme,
              <br />
              <span className="emb-gradient-text">un espace sélect</span>
            </h2>
            <p className="mt-4 text-white/55">
              Embyr réunit des hommes qui partagent une envie de connexions authentiques,
              dans un cadre confidentiel et premium. Pas de foule, pas de bruit.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "Confidentiel", desc: "Vos échanges restent privés. Aucune donnée revendue, aucun profilage public.", icon: "🔒" },
              { title: "Sélect", desc: "Profils vérifiés manuellement. Une communauté masculine premium et respectueuse.", icon: "✦" },
              { title: "Intense", desc: "Messagerie illimitée, vocaux, appels, visios. Des échanges qui comptent.", icon: "⚡" },
            ].map((item) => (
              <TiltCard key={item.title} className="emb-card rounded-2xl p-8 text-center">
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{item.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="emb-section">
        <div className="emb-container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Comment ça marche
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-4">
            {[
              { step: "1", title: "Créez votre profil", desc: "En 2 minutes. Vérifié manuellement.", icon: "👤" },
              { step: "2", title: "Découvrez", desc: "Parcourez des profils masculins vérifiés.", icon: "🔍" },
              { step: "3", title: "Échangez", desc: "Messages, vocaux, appels. Sans limite.", icon: "💬" },
              { step: "4", title: "Connectez", desc: "Des connexions plus intenses, en privé.", icon: "🤝" },
            ].map((s) => (
              <TiltCard key={s.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/10 text-xl">
                  {s.icon}
                </div>
                <div className="mt-1 text-xs font-bold text-cyan-300/70">Étape {s.step}</div>
                <h4 className="mt-2 font-bold text-white">{s.title}</h4>
                <p className="mt-1 text-sm text-white/45">{s.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── MESSAGERIE PRIVÉE ── */}
      <section className="emb-section bg-[radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.06),transparent_50%)]">
        <div className="emb-container text-center">
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Messagerie <span className="emb-gradient-text">privée</span>
          </h2>
          <p className="emb-subtitle mx-auto mt-4 max-w-2xl">
            Messages texte illimités, messages vocaux, appels privés et visios.
            Tout est chiffré et confidentiel.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Messages", desc: "Texte illimité entre membres Premium", icon: "💬" },
              { title: "Vocaux", desc: "Messages audio privés, envoyez votre voix", icon: "🎤" },
              { title: "Appels & Visios", desc: "Appels et visios privés en un clic", icon: "📹" },
            ].map((m) => (
              <TiltCard key={m.title} className="emb-card rounded-2xl p-8">
                <div className="mb-3 text-3xl">{m.icon}</div>
                <h4 className="font-bold text-white">{m.title}</h4>
                <p className="mt-2 text-sm text-white/50">{m.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM ── */}
      <section className="emb-section" id="premium">
        <div className="emb-container text-center">
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Premium
          </h2>
          <p className="emb-subtitle mx-auto mt-4 max-w-2xl">
            Débloquez toutes les fonctionnalités et entrez dans le cercle privé.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-4">
            {[
              { duration: "1 mois", price: "14,99 €", period: "/mois" },
              { duration: "3 mois", price: "29,99 €", period: "/3 mois" },
              { duration: "6 mois", price: "49,99 €", period: "/6 mois" },
              { duration: "À vie", price: "99,99 €", period: "unique" },
            ].map((p) => (
              <TiltCard key={p.duration} className="emb-card rounded-2xl p-6 text-center">
                <div className="text-sm font-bold text-cyan-300">{p.duration}</div>
                <div className="mt-2 text-3xl font-black text-white">{p.price}</div>
                <div className="text-xs text-white/40">{p.period}</div>
                <ul className="mt-4 space-y-2 text-left text-sm text-white/55">
                  <li>✓ Profils complets</li>
                  <li>✓ Messages illimités</li>
                  <li>✓ Vocaux Premium</li>
                  <li>✓ Appels & Visios</li>
                  <li>✓ Favoris illimités</li>
                </ul>
                <Link href="/premium" className="emb-button-primary mt-4 w-full text-center">
                  Choisir
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SÉCURITÉ / CONFIDENTIALITÉ ── */}
      <section className="emb-section bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]">
        <div className="emb-container text-center">
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Sécurité & <span className="emb-gradient-text">confidentialité</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-4">
            {[
              { title: "Chiffré", desc: "Toutes les communications sont chiffrées de bout en bout." },
              { title: "Anonyme", desc: "Votre identité reste protégée. Pas de profilage public." },
              { title: "Modéré", desc: "Équipe de modération humaine. Tolérance zéro abus." },
              { title: "RGPD", desc: "Données hébergées en Europe. Droit à l'oubli." },
            ].map((s) => (
              <div key={s.title} className="text-center">
                <h4 className="font-bold text-white">{s.title}</h4>
                <p className="mt-2 text-sm text-white/45">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="emb-section pb-20">
        <div className="emb-container text-center">
          <TiltCard className="mx-auto max-w-2xl rounded-3xl border border-cyan-300/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(6,182,212,0.04))] p-12 backdrop-blur-xl">
            <EmbyrLogo size="md" className="mb-6 justify-center" />
            <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Prêt à entrer dans le cercle ?
            </h2>
            <p className="emb-subtitle mx-auto mt-3 max-w-md">
              Rejoignez Embyr et découvrez une nouvelle façon de connecter.
            </p>
            <Link href="/inscription" className="emb-button-primary mt-8">
              Créer mon compte gratuitement
            </Link>
            <p className="mt-3 text-xs text-white/30">
              Ou <Link href="/connexion" className="text-cyan-300/70 hover:text-cyan-300">connectez-vous</Link> si vous avez déjà un compte.
            </p>
          </TiltCard>
        </div>
      </section>
    </main>
  );
}
