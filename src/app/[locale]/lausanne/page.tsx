import type { Metadata } from "next";
import Link from "next/link";
import PageTypeTracker from "@/components/PageTypeTracker";
import TrackedLink from "@/components/TrackedLink";

type Params = Promise<{ locale: string }>;

const content = {
  fr: {
    title: "Rencontres à Lausanne — moins de swipe, plus de réciprocité",
    description: "Embir se lance à Lausanne : sélection courte, intentions claires, compatibilité réciproque et cœur de la rencontre gratuit, sans carte bancaire.",
    badge: "Lancement local · Lausanne",
    eyebrow: "La rencontre locale, sans flux infini",
    heading: "Moins de profils à faire défiler.",
    highlight: "Plus de personnes qui cherchent vraiment la même chose.",
    intro: "Embir se construit à Lausanne autour d’une idée simple : une sélection courte, un intérêt contextualisé et une connexion seulement quand l’envie va dans les deux sens.",
    primary: "Rejoindre Lausanne gratuitement",
    secondary: "Voir comment ça marche",
    proof: "Sans carte bancaire · cœur de la rencontre gratuit · communauté en lancement",
    howTitle: "Un parcours qui mène quelque part",
    steps: [
      ["01", "Dis ce que tu recherches maintenant", "Intention, disponibilité et rayon approximatif : assez de contexte pour proposer des personnes pertinentes, jamais ta position exacte."],
      ["02", "Reçois une sélection courte", "Pas de catalogue sans fin. Embir privilégie quelques profils compatibles dans les deux sens."],
      ["03", "Envoie une étincelle précise", "Réagis à un élément réel du profil. Si l’intérêt devient réciproque, la Résonance s’ouvre pour vous deux."],
      ["04", "Passe au réel sans pression", "Conversation protégée, proposition de lieu public et acceptation par l’autre personne avant tout projet de rencontre."],
    ],
    localTitle: "La densité avant les grands chiffres",
    localBody: "La communauté lausannoise démarre maintenant. Nous n’affichons ni faux compteur, ni faux profil pour donner l’illusion d’une foule. Chaque inscription réelle améliore les chances de recommandations compatibles dans la région.",
    localCta: "Faire partie du noyau lausannois",
    trustTitle: "Ce qui reste non négociable",
    trust: [
      ["Réciprocité", "Une conversation ne s’ouvre pas sur un signal à sens unique."],
      ["Contrôle", "Blocage, signalement, préférences de notifications et heures calmes restent accessibles."],
      ["Gratuit utile", "Inscription, compatibilité, réciprocité et messagerie entre connexions restent accessibles sans carte bancaire."],
      ["Honnêteté", "Aucun match, disponibilité locale ou résultat n’est inventé. D’éventuels services optionnels futurs seraient annoncés clairement."],
    ],
    regionTitle: "Une communauté romande, ville par ville",
    regionBody: "Embir concentre d’abord sa croissance là où une communauté locale peut devenir réellement utile. Explore les pages de ta ville ou de ta région avant de rejoindre le lancement.",
    regionLinks: [
      ["Genève", "/fr/suisse/geneve"],
      ["Montreux", "/fr/suisse/montreux"],
      ["Vevey", "/fr/suisse/vevey"],
      ["Nyon", "/fr/suisse/nyon"],
      ["Yverdon-les-Bains", "/fr/suisse/yverdon-les-bains"],
      ["Fribourg", "/fr/suisse/fribourg"],
      ["Neuchâtel", "/fr/suisse/neuchatel"],
      ["Sion", "/fr/suisse/sion"],
    ],
    faqTitle: "Questions avant de rejoindre",
    faq: [
      ["Y a-t-il déjà beaucoup de membres à Lausanne ?", "Le lancement local est en cours. Embir préfère montrer une disponibilité réelle — quitte à afficher un état vide — plutôt qu’un faux volume."],
      ["Est-ce vraiment gratuit ?", "Oui. Tout le cœur nécessaire pour rencontrer quelqu’un est accessible sans carte bancaire. Si des options additionnelles apparaissent plus tard, elles seront annoncées clairement."],
      ["Est-ce réservé à un type de relation ?", "Non. Tu définis tes intentions et les identités que tu recherches. La sélection vérifie que les préférences sont compatibles dans les deux sens."],
      ["Pourquoi une web app ?", "Tu peux l’ouvrir immédiatement sur téléphone et l’ajouter à l’écran d’accueil. Aucun téléchargement de boutique n’est nécessaire."],
    ],
    finalTitle: "La prochaine personne compatible n’a pas besoin d’un swipe de plus.",
    finalBody: "Elle a besoin de savoir que tu recherches la même chose, au même moment.",
    finalCta: "Créer mon profil gratuit",
    login: "Se connecter",
    home: "Embir",
  },
  en: {
    title: "Dating in Lausanne — fewer swipes, more mutual intent",
    description: "Embir is launching in Lausanne with short selections, clear intentions, mutual compatibility and free core dating features without a card.",
    badge: "Local launch · Lausanne",
    eyebrow: "Local dating without the endless feed",
    heading: "Fewer profiles to scroll through.",
    highlight: "More people genuinely looking for the same thing.",
    intro: "Embir is growing in Lausanne around one simple idea: a short selection, contextual interest and a connection only when it goes both ways.",
    primary: "Join Lausanne for free",
    secondary: "See how it works",
    proof: "No card · core dating features are free · community launching now",
    howTitle: "A journey that leads somewhere",
    steps: [
      ["01", "Say what you want right now", "Intent, availability and an approximate radius — enough context for relevance, never your exact location."],
      ["02", "Receive a short selection", "No endless catalogue. Embir prioritizes a few profiles whose preferences work both ways."],
      ["03", "Send a specific spark", "React to something real in their profile. If interest becomes mutual, Resonance opens for both of you."],
      ["04", "Move offline without pressure", "Protected conversation, public-place suggestions and acceptance by the other person before a meeting plan is confirmed."],
    ],
    localTitle: "Density before impressive numbers",
    localBody: "The Lausanne community is starting now. We do not show fake counters or fake profiles to create the illusion of a crowd. Every real member improves the chance of a compatible local recommendation.",
    localCta: "Join the Lausanne founding group",
    trustTitle: "What stays non-negotiable",
    trust: [
      ["Mutual intent", "A conversation never opens from one person’s signal alone."],
      ["Control", "Blocking, reporting, notification preferences and quiet hours remain accessible."],
      ["Useful free core", "Signup, compatibility, mutual connections and messaging stay available without a payment card."],
      ["Honesty", "No match, local availability or result is invented. Any future optional service would be announced clearly."],
    ],
    regionTitle: "A French-speaking Swiss community, city by city",
    regionBody: "Embir is concentrating growth where a local community can become genuinely useful. Explore your city or region before joining the launch.",
    regionLinks: [
      ["Geneva", "/switzerland/geneva"],
      ["Montreux", "/switzerland/montreux"],
      ["Vevey", "/switzerland/vevey"],
      ["Nyon", "/switzerland/nyon"],
      ["Yverdon-les-Bains", "/switzerland/yverdon-les-bains"],
      ["Fribourg", "/switzerland/fribourg"],
      ["Neuchâtel", "/switzerland/neuchatel"],
      ["Sion", "/switzerland/sion"],
    ],
    faqTitle: "Before you join",
    faq: [
      ["Are there already many members in Lausanne?", "The local launch is in progress. Embir would rather show genuine availability — even an empty state — than fake volume."],
      ["Is it really free?", "Yes. Everything essential to meet someone is available without a card. If optional extras appear later, they will be clearly disclosed."],
      ["Is it only for one kind of relationship?", "No. You set your intentions and who you are looking for. Selection checks that preferences are compatible both ways."],
      ["Why a web app?", "You can open it instantly on your phone and add it to your home screen. No app-store download is required."],
    ],
    finalTitle: "The next compatible person does not need one more swipe.",
    finalBody: "They need to know you want the same thing, at the same time.",
    finalCta: "Create my free profile",
    login: "Sign in",
    home: "Embir",
  },
} as const;

function localeContent(locale: string) {
  return locale === "fr" ? content.fr : content.en;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const copy = localeContent(locale);
  const path = locale === "en" ? "/lausanne" : `/${locale}/lausanne`;
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `https://embir.xyz${path}`,
      languages: {
        en: "https://embir.xyz/lausanne",
        "fr-CH": "https://embir.xyz/fr/lausanne",
        "x-default": "https://embir.xyz/lausanne",
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `https://embir.xyz${path}`,
      siteName: "Embir",
      locale: locale === "fr" ? "fr_CH" : "en_US",
      type: "website",
      images: [{
        url: `/api/og?title=${encodeURIComponent(copy.heading)}&subtitle=${encodeURIComponent(copy.highlight)}&locale=${locale}&variant=market`,
        width: 1200,
        height: 630,
        alt: copy.title,
      }],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
    robots: { index: true, follow: true },
  };
}

export default async function LausannePage({ params }: { params: Params }) {
  const { locale } = await params;
  const copy = localeContent(locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  const registerPath = `${prefix}/auth/register?utm_source=lausanne_landing&utm_medium=owned&utm_campaign=lausanne_launch_2500`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map(([name, answer]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const regionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.regionTitle,
    itemListElement: copy.regionLinks.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      url: `https://embir.xyz${path}`,
    })),
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#06030f] text-white">
      <PageTypeTracker type="city" city="Lausanne" country="CH" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(regionSchema) }} />

      <nav aria-label="Navigation Lausanne" className="relative z-20 mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href={prefix || "/"} className="inline-flex min-h-11 items-center font-serif text-xl tracking-[0.08em] text-white">{copy.home}</Link>
        <Link href={`${prefix}/auth/login`} className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-5 text-sm text-white/65 hover:border-white/25 hover:text-white">{copy.login}</Link>
      </nav>

      <section className="relative px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[540px] w-[780px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,94,54,0.17),rgba(212,165,116,0.07)_38%,transparent_70%)] blur-2xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#d4a574]">
            <span className="h-2 w-2 rounded-full bg-[#ff5e36] shadow-[0_0_18px_rgba(255,94,54,0.8)]" />
            {copy.badge}
          </div>
          <p className="mt-9 text-xs font-semibold uppercase tracking-[0.24em] text-white/35">{copy.eyebrow}</p>
          <h1 className="mx-auto mt-5 max-w-5xl font-serif text-5xl font-light leading-[0.98] text-white sm:text-7xl lg:text-[5.8rem]">
            {copy.heading}<br /><span className="bg-gradient-to-r from-[#f7d1bd] via-[#ff8a65] to-[#d4a574] bg-clip-text text-transparent">{copy.highlight}</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">{copy.intro}</p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <TrackedLink href={registerPath} label={copy.primary} location="lausanne_hero" campaign="lausanne_launch_2500" className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ff5e36] to-[#d4a574] px-8 text-sm font-bold text-[#120812] shadow-[0_18px_60px_rgba(255,94,54,0.22)] hover:brightness-110">
              {copy.primary}
            </TrackedLink>
            <a href="#how" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 px-8 text-sm font-semibold text-white/70 hover:border-white/30 hover:text-white">{copy.secondary}</a>
          </div>
          <p className="mt-5 text-xs text-white/30">{copy.proof}</p>
        </div>
      </section>

      <section id="how" className="border-y border-white/[0.06] bg-white/[0.018] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a574]">Connection OS</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl font-light sm:text-6xl">{copy.howTitle}</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {copy.steps.map(([number, title, body]) => (
              <article key={number} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
                <p className="font-mono text-sm text-[#d4a574]">{number}</p>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/45">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a574]">Lausanne d’abord</p>
            <h2 className="mt-4 font-serif text-4xl font-light sm:text-6xl">{copy.localTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/48">{copy.localBody}</p>
            <TrackedLink href={registerPath} label={copy.localCta} location="lausanne_density" campaign="lausanne_launch_2500" className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-[#0a0614] hover:bg-[#f7e4d9]">
              {copy.localCta}
            </TrackedLink>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border border-[#d4a574]/20 bg-[radial-gradient(circle,rgba(212,165,116,0.16),rgba(255,94,54,0.06)_38%,transparent_70%)]">
            <div className="absolute inset-[13%] rounded-full border border-white/10" />
            <div className="absolute inset-[28%] rounded-full border border-[#ff5e36]/25" />
            <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d4a574]/30 bg-[#100916]/85 text-center shadow-[0_0_70px_rgba(255,94,54,0.24)]">
              <span className="font-serif text-lg text-[#f7d1bd]">Lausanne<br />en premier</span>
            </div>
            {["top-[10%] left-[46%]", "top-[32%] right-[7%]", "bottom-[13%] right-[28%]", "bottom-[24%] left-[10%]", "top-[27%] left-[8%]"].map((position) => <span key={position} className={`absolute h-3 w-3 rounded-full bg-[#ff8a65] shadow-[0_0_24px_rgba(255,138,101,0.8)] ${position}`} />)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.018] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl font-light sm:text-6xl">{copy.trustTitle}</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
            {copy.trust.map(([title, body]) => (
              <article key={title} className="bg-[#090511] p-7 sm:p-9">
                <h3 className="text-lg font-semibold text-[#f7d1bd]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/45">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a574]">Romandie</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h2 className="font-serif text-4xl font-light sm:text-6xl">{copy.regionTitle}</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/48">{copy.regionBody}</p>
            </div>
            <nav aria-label={copy.regionTitle} className="grid gap-3 sm:grid-cols-2">
              {copy.regionLinks.map(([label, href]) => (
                <Link key={href} href={href} className="inline-flex min-h-14 items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 text-sm font-semibold text-white/65 transition hover:border-[#d4a574]/35 hover:text-white">
                  {label}<span aria-hidden="true" className="text-[#d4a574]">→</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-4xl font-light sm:text-6xl">{copy.faqTitle}</h2>
          <div className="mt-12 space-y-3">
            {copy.faq.map(([question, answer]) => (
              <details key={question} className="group rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white/75 marker:content-none sm:px-6">
                  {question}<span aria-hidden="true" className="text-xl text-[#d4a574] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-white/45 sm:px-6 sm:pb-6">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#d4a574]/20 bg-[radial-gradient(circle_at_top,rgba(255,94,54,0.18),transparent_58%),rgba(255,255,255,0.025)] px-6 py-14 text-center sm:px-12 sm:py-20">
          <h2 className="mx-auto max-w-4xl font-serif text-4xl font-light sm:text-6xl">{copy.finalTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/48">{copy.finalBody}</p>
          <TrackedLink href={registerPath} label={copy.finalCta} location="lausanne_final" campaign="lausanne_launch_2500" className="mt-9 inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#ff5e36] to-[#d4a574] px-9 text-sm font-bold text-[#120812] hover:brightness-110">
            {copy.finalCta}
          </TrackedLink>
        </div>
      </section>
    </main>
  );
}
