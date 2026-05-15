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
      {/* ═══ HERO — Gratuit, généraliste, attractif ═══ */}
      <section className="emb-section relative flex min-h-screen flex-col items-center justify-center text-center overflow-hidden">
        <AuroraBackground variant="embyr" />
        <Particles3D count={50} className="absolute inset-0 z-[2]" />
        <div className="emb-container relative z-10">
          <EmbyrLogo size="lg" className="mb-8 justify-center" />
          <h1 className="emb-title max-w-4xl text-balance">
            Rencontre plus librement.
            <br />
            <span className="emb-gradient-text">Gratuitement.</span>
          </h1>
          <p className="emb-subtitle mx-auto mt-6 max-w-2xl text-balance">
            Embyr est une nouvelle plateforme de rencontre moderne, élégante
            et gratuite pendant sa phase de lancement. Crée ton profil,
            découvre les premiers membres et rejoins la communauté fondatrice.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register" className="emb-button-primary">
              Créer mon profil gratuitement
            </Link>
            <Link href="#pourquoi" className="emb-button-secondary">
              Découvrir Embyr
            </Link>
          </div>

          {/* Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {[
              "Gratuit au lancement",
              "Membres fondateurs",
              "Messagerie privée",
              "Pensé mobile",
              "Premium offert aux premiers actifs"
            ].map((b) => (
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

      {/* ═══ POURQUOI EMBYR ═══ */}
      <section className="emb-section bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.06),transparent_50%)]" id="pourquoi">
        <div className="emb-container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Pourquoi Embyr
            </div>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Une nouvelle façon de
              <br />
              <span className="emb-gradient-text">faire des rencontres</span>
            </h2>
            <p className="mt-4 text-white/55">
              Moderne, élégante et gratuite au lancement. Embyr repense la
              rencontre en ligne pour la rendre plus simple et plus humaine.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Plus simple", desc: "Un parcours clair, sans application lourde à installer.", icon: "✨" },
              { title: "Gratuit au lancement", desc: "Les fonctions essentielles sont accessibles gratuitement pendant la phase de lancement.", icon: "🎁" },
              { title: "Plus humain", desc: "Des profils plus soignés, une ambiance plus respectueuse, une communauté qui démarre proprement.", icon: "🤝" },
              { title: "Pensé mobile", desc: "Une expérience fluide depuis ton téléphone, pour créer ton profil et discuter facilement.", icon: "📱" },
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

      {/* ═══ MEMBRE FONDATEUR ═══ */}
      <section className="emb-section">
        <div className="emb-container">
          <div className="mx-auto max-w-3xl text-center">
            <TiltCard className="emb-card rounded-3xl p-10 md:p-14 border-cyan-300/20 bg-[linear-gradient(145deg,rgba(6,182,212,0.06),rgba(124,58,237,0.04))]">
              <div className="mb-4 inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                ✦ Membres fondateurs
              </div>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Deviens membre fondateur
              </h2>
              <p className="mt-4 text-white/55 max-w-xl mx-auto">
                Les premiers membres actifs pourront recevoir un badge Fondateur
                et des avantages Premium offerts lorsque les options payantes
                seront activées.
              </p>
              <Link href="/auth/register" className="emb-button-primary mt-8">
                Créer mon profil fondateur
              </Link>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section className="emb-section bg-[radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.06),transparent_50%)]">
        <div className="emb-container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Comment ça marche
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-5">
            {[
              { step: "1", title: "Crée ton compte", desc: "Gratuitement, en 2 minutes.", icon: "👤" },
              { step: "2", title: "Complète ton profil", desc: "Ajoute ta description et tes photos.", icon: "📝" },
              { step: "3", title: "Ajoute tes photos", desc: "Montre qui tu es vraiment.", icon: "📸" },
              { step: "4", title: "Découvre les membres", desc: "Parcours les profils de la communauté.", icon: "🔍" },
              { step: "5", title: "Lance une discussion", desc: "Échange librement avec les membres.", icon: "💬" },
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

      {/* ═══ GRATUIT MAINTENANT ═══ */}
      <section className="emb-section">
        <div className="emb-container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Gratuit <span className="emb-gradient-text">maintenant</span>
            </h2>
            <p className="mt-4 text-white/55">
              Pendant la phase de lancement, toutes les fonctions essentielles
              sont accessibles gratuitement.
            </p>
          </div>
          <div className="mx-auto max-w-xl grid gap-4 sm:grid-cols-2">
            {[
              "Inscription",
              "Création de profil",
              "Ajout de photos",
              "Consultation des membres",
              "Messagerie de base",
              "Accès mobile",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PREMIUM BIENTÔT ═══ */}
      <section className="emb-section bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]">
        <div className="emb-container text-center">
          <div className="mb-3 inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
            Premium bientôt
          </div>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Premium <span className="emb-gradient-text">arrive bientôt</span>
          </h2>
          <p className="emb-subtitle mx-auto mt-4 max-w-2xl">
            Pendant la phase de lancement, Embyr donne accès gratuitement aux
            fonctionnalités essentielles. Les options Premium seront disponibles
            plus tard, sans pression.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
            {[
              "Voir qui visite ton profil",
              "Boost de visibilité",
              "Filtres avancés",
              "Albums privés",
              "Mode invisible",
              "Badge vérifié",
              "Mise en avant",
              "Messages illimités",
            ].map((f) => (
              <div key={f} className="px-4 py-3 rounded-xl border border-white/[0.04] bg-white/[0.01] text-sm text-white/50">
                {f}
              </div>
            ))}
          </div>
          <Link href="/premium" className="emb-button-secondary mt-8">
            En savoir plus
          </Link>
        </div>
      </section>

      {/* ═══ CONFIANCE ═══ */}
      <section className="emb-section">
        <div className="emb-container text-center">
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Une communauté plus{" "}
            <span className="emb-gradient-text">respectueuse</span>
          </h2>
          <p className="mt-4 text-white/55 max-w-2xl mx-auto">
            Embyr démarre avec une phase de lancement gratuite pour construire
            une base de membres réels, actifs et respectueux.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-4">
            {[
              { title: "Respectueux", desc: "Communauté bienveillante, tolérance zéro pour les abus." },
              { title: "Confidentiel", desc: "Vos données restent privées. Aucun profilage public." },
              { title: "Modéré", desc: "Modération humaine progressive pour garantir la qualité." },
              { title: "Sécurisé", desc: "Données hébergées en Europe. Conformité RGPD." },
            ].map((s) => (
              <div key={s.title} className="text-center">
                <h4 className="font-bold text-white">{s.title}</h4>
                <p className="mt-2 text-sm text-white/45">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="emb-section pb-20">
        <div className="emb-container text-center">
          <TiltCard className="mx-auto max-w-2xl rounded-3xl border border-cyan-300/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(6,182,212,0.04))] p-12 backdrop-blur-xl">
            <EmbyrLogo size="md" className="mb-6 justify-center" />
            <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              Rejoins les premiers membres Embyr
            </h2>
            <p className="emb-subtitle mx-auto mt-3 max-w-md">
              L&apos;accès est gratuit pendant la phase de lancement. Les premiers
              profils actifs recevront des avantages fondateurs.
            </p>
            <Link href="/auth/register" className="emb-button-primary mt-8">
              Créer mon profil gratuitement
            </Link>
            <p className="mt-3 text-xs text-white/30">
              Déjà membre ?{" "}
              <Link href="/auth/login" className="text-cyan-300/70 hover:text-cyan-300 underline underline-offset-2" style={{padding:"6px 8px",minHeight:"44px",display:"inline-block"}}>
                Connecte-toi
              </Link>
            </p>
          </TiltCard>
        </div>
      </section>
    </main>
  );
}
