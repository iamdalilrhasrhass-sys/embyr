import EmbyrLogo from "@/components/brand/EmbyrLogo";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TiltCard from "@/components/motion/TiltCard";
import AuroraBackground from "@/components/motion/AuroraBackground";
import Link from "next/link";

const features = [
  { title: "Toi, sans filtres", desc: "Pas d'algorithmes qui décident pour toi. Parcours les profils, choisis qui te plaît, sans pression.", icon: "🔥" },
  { title: "Du sérieux au chill", desc: "Que tu cherches l'amour, des potes ou juste une discussion — ici, tout est possible, sans cases.", icon: "🎯" },
  { title: "Safe et respectueux", desc: "Une communauté qui se construit sur le respect. Zéro tolérance pour les comportements toxiques.", icon: "🛡️" },
  { title: "Gratuit au lancement", desc: "Inscription, profils, messages — tout est gratuit pendant la phase de lancement. Sans piège.", icon: "🎁" },
];

const steps = [
  { step: "01", title: "Crée ton compte", desc: "2 minutes, email ou Google." },
  { step: "02", title: "Dis qui tu es", desc: "Photos, description, ce que tu cherches." },
  { step: "03", title: "Explore les mecs", desc: "Parcours, filtre, découvre." },
  { step: "04", title: "Parle librement", desc: "Message, vocal, quand t'es prêt." },
];

export default function Home() {
  return (
    <main className="emb-page">
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center text-center overflow-hidden">
        <AuroraBackground variant="embyr" />
        <div className="emb-container relative z-10 px-4 sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-medium text-white/60 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-rose-400 to-amber-400" />
            Pour les gays et la communauté queer
          </div>
          
          <h1 className="mx-auto max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
            Des rencontres
            <br />
            <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">
              entre hommes.
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            Embyr est une nouvelle app de rencontre gay, pensée pour ceux qui
            veulent du vrai. Pas de pression, pas de jugement. Gratuite pendant
            le lancement.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40 hover:scale-[1.02]"
            >
              Créer mon profil gratuitement
            </Link>
            <Link
              href="#pourquoi"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white/70 backdrop-blur transition-all hover:bg-white/[0.06] hover:text-white"
            >
              Découvrir Embyr
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {[
              "Gratuit au lancement",
              "Messagerie illimitée",
              "Membres fondateurs",
              "Pensé mobile",
            ].map((b) => (
              <span key={b} className="rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[11px] text-white/40">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI EMBYR */}
      <section className="emb-section" id="pourquoi">
        <div className="emb-container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              Une app gay qui change
              <br />
              <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">
                des autres
              </span>
            </h2>
            <p className="mt-4 text-white/45">
              Embyr n'est pas une énième copie. On a repensé la rencontre gay pour
              qu'elle soit plus simple, plus respectueuse et plus excitante.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <ScrollReveal key={f.title}>
                <TiltCard className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur transition-colors hover:border-white/[0.10] hover:bg-white/[0.04]">
                  <div className="mb-3 text-2xl">{f.icon}</div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/40">{f.desc}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBRE FONDATEUR */}
      <section className="emb-section">
        <div className="emb-container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-3xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-10 md:p-14">
              <div className="mb-4 inline-flex rounded-full border border-amber-400/20 bg-amber-500/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber-300">
                Membre fondateur
              </div>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Les premiers auront tout
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/45">
                Les comptes créés maintenant auront un badge Fondateur à vie et
                les futures options premium offertes.
              </p>
              <Link
                href="/auth/register"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40"
              >
                Créer mon compte fondateur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="emb-section">
        <div className="emb-container">
          <h2 className="mb-16 text-center text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
            Simple comme bonjour
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <ScrollReveal key={s.step}>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-2xl font-black text-white/15">
                    {s.step}
                  </div>
                  <h4 className="mt-4 font-bold text-white">{s.title}</h4>
                  <p className="mt-1 text-sm text-white/40">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GRATUIT */}
      <section className="emb-section">
        <div className="emb-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              Gratuit.
              <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent"> Vraiment.</span>
            </h2>
            <p className="mt-4 text-white/45">
              Tout ce dont t'as besoin pour rencontrer des mecs est gratuit maintenant.
            </p>
          </div>
          <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-2">
            {[
              "Inscription", "Profil complet", "Photos", "Messagerie",
              "Parcourir les membres", "Mobile & desktop",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.01] px-4 py-3">
                <span className="text-emerald-400">✓</span>
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM BIENTÔT */}
      <section className="emb-section">
        <div className="emb-container text-center">
          <div className="mb-3 inline-flex rounded-full border border-purple-400/15 bg-purple-500/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-purple-300">
            Plus tard
          </div>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
            Premium arrivera
            <br />
            <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">
              quand la communauté sera là
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/45">
            Pour l'instant, concentrons-nous sur l'essentiel : construire un
            espace où les mecs peuvent vraiment se rencontrer. Les options
            premium viendront plus tard, sans pression.
          </p>
          
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40"
          >
            Créer mon profil
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="emb-section pb-20">
        <div className="emb-container text-center">
          <div className="mx-auto max-w-lg rounded-3xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.03] to-amber-500/[0.03] p-10 md:p-14">
            <h2 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              Prêt à rencontrer
              <br />
              <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">
                des mecs ?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-white/45">
              Gratuit, safe, et pensé pour toi. Les premiers inscrits seront
              les fondateurs de la communauté.
            </p>
            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40"
            >
              Créer mon profil gratuitement
            </Link>
            <p className="mt-4 text-xs text-white/25">
              Déjà membre ?{" "}
              <Link href="/auth/login" className="text-rose-400/70 hover:text-rose-400 underline underline-offset-2">
                Connecte-toi
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
