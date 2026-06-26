import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { COUNTRY_NAMES, SEO_CITIES, SEO_INTENTS } from "@/seo/seo-cities";
import {
  INDEXABLE_PROGRAMMATIC_CITIES,
  isProgrammaticIndexable,
  qualifiedProgrammaticParams,
} from "@/seo/programmatic-policy";

export const revalidate = 3600;

export async function generateStaticParams() {
  return qualifiedProgrammaticParams();
}

function localizedPath(locale: string, path: string): string {
  return locale === "fr" ? `/fr${path}` : path;
}

function getData(intentSlug: string, citySlug: string) {
  const intent = SEO_INTENTS.find((candidate) => candidate.slug === intentSlug);
  const city = SEO_CITIES.find((candidate) => candidate.slug === citySlug);
  if (!intent || !city) return null;
  return { intent, city };
}

function discoveryHref(locale: string, intent: string, cityName: string): string {
  const query = new URLSearchParams({ intent, city: cityName });
  return `${localizedPath(locale, "/decouvrir")}?${query.toString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; city: string }>;
}): Promise<Metadata> {
  const { locale, slug, city } = await params;
  const data = getData(slug, city);
  if (!data) {
    return {
      title: "Embir",
      robots: { index: false, follow: true },
    };
  }

  const isFr = locale === "fr";
  const isIndexable = isProgrammaticIndexable(locale, slug, city);
  const { intent: int, city: ct } = data;
  const country = COUNTRY_NAMES[ct.country];
  const titleFr = `Rencontre ${int.label.toLowerCase()} à ${ct.name} | Embir`;
  const titleEn = `${int.labelEn} dating in ${ct.nameEn} | Embir`;
  const descFr = `Rencontre ${int.label.toLowerCase()} à ${ct.name} : découvrez Embir, une approche par intentions déclarées et préférences réciproques. Profil gratuit au lancement.`;
  const descEn = `${int.labelEn} dating in ${ct.nameEn}, ${country.en}: explore Embir through declared intentions and reciprocal preferences. Free profile creation during launch.`;
  const path = localizedPath(locale, `/rencontre/${int.slug}/${ct.slug}`);
  const canonical = `https://embir.xyz${path}`;

  return {
    title: isFr ? titleFr : titleEn,
    description: isFr ? descFr : descEn,
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical,
      languages: {
        "fr-FR": `https://embir.xyz/fr/rencontre/${int.slug}/${ct.slug}`,
        "en-US": `https://embir.xyz/rencontre/${int.slug}/${ct.slug}`,
      },
    },
    openGraph: {
      title: isFr ? titleFr : titleEn,
      description: isFr ? descFr : descEn,
      locale: isFr ? "fr_FR" : "en_US",
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string; city: string }>;
}) {
  const { locale, slug, city } = await params;
  const isFr = locale === "fr";
  const data = getData(slug, city);
  if (!data) return <div>Page not found</div>;

  const { intent: int, city: ct } = data;
  const isIndexable = isProgrammaticIndexable(locale, slug, city);
  const cityName = isFr ? ct.name : ct.nameEn;
  const intentLabel = isFr ? int.label : int.labelEn;
  const intentLower = intentLabel.toLowerCase();
  const pagePath = localizedPath(locale, `/rencontre/${int.slug}/${ct.slug}`);
  const intentHubPath = localizedPath(locale, `/${int.slug}`);
  const primaryHref = discoveryHref(locale, int.intent, ct.name);
  const qualifiedCities = new Set<string>(INDEXABLE_PROGRAMMATIC_CITIES);
  const nearbyCities = SEO_CITIES.filter((candidate) => candidate.country === "FR" && candidate.slug !== ct.slug && qualifiedCities.has(candidate.slug)).slice(0, 6);
  const otherIntents = SEO_INTENTS.filter((candidate) => candidate.slug !== int.slug);

  const h1 = isFr
    ? `Rencontre ${int.label.toLowerCase()} à ${ct.name}`
    : `${int.labelEn} dating in ${ct.nameEn}`;
  const intro = isFr
    ? `${ct.contextFr ?? `${ct.name} fait partie des villes françaises suivies dans le pilote Embir.`} Ici, Embir présente une approche plus lisible de la rencontre : partir des intentions déclarées, des préférences réciproques et d’un parcours d’inscription volontaire.`
    : `Embir is being shaped around declared intentions, reciprocal preferences, and a voluntary sign-up journey for people exploring ${int.labelEn.toLowerCase()} in ${ct.nameEn}.`;

  const sections = isFr
    ? [
        {
          title: `Pourquoi une page ${int.label.toLowerCase()} à ${ct.name} ?`,
          text: `Cette page aide les personnes situées à ${ct.name} ou autour de la ville à comprendre comment Embir classe les intentions. Elle ne prétend pas afficher tout le marché local : elle sert de point d’entrée vers un aperçu anonyme et prudent.`,
        },
        {
          title: "Intentions déclarées, pas swipe au hasard",
          text: `La logique Embir commence par ce que chacun cherche vraiment : ${int.label.toLowerCase()}, amitié, sport, événements ou autre intention disponible. L’objectif est de réduire les malentendus avant même la création du profil.`,
        },
        {
          title: "Aperçus anonymisés avant inscription",
          text: `Le tunnel Découvrir peut afficher des aperçus limités issus de profils publics réels lorsque des profils compatibles existent. Les noms, photos, descriptions et identifiants ne sont pas exposés sur cette page publique.`,
        },
        {
          title: "Lancement progressif ville par ville",
          text: `Embir avance avec une surface SEO volontairement resserrée. ${ct.name} fait partie du pilote français indexable afin de privilégier des pages utiles, maintenables et honnêtes plutôt qu’un catalogue artificiel.`,
        },
      ]
    : [
        {
          title: `Why a ${int.labelEn.toLowerCase()} page in ${ct.nameEn}?`,
          text: `This page explains how Embir frames local discovery through declared intentions. It is an entry point to a cautious preview flow, not a claim that every local community is already fully populated.`,
        },
        {
          title: "Declared intentions first",
          text: `Embir starts with what people say they are looking for: love, friendship, casual discovery, sports, events, or another available intention. The goal is to reduce mismatch before profile creation.`,
        },
        {
          title: "Anonymous previews before sign-up",
          text: `The discovery flow can show limited previews from real public profiles when compatible profiles are available. Names, photos, descriptions, and internal identifiers are not exposed here.`,
        },
        {
          title: "A careful city-by-city launch",
          text: `Embir keeps its public programmatic surface deliberately narrow so pages stay useful, maintainable, and honest instead of becoming an artificial catalogue.`,
        },
      ];

  const faq = isFr
    ? [
        {
          q: `Comment explorer ${int.label.toLowerCase()} à ${ct.name} ?`,
          a: `Utilisez le tunnel Découvrir, choisissez votre intention et indiquez ${ct.name} si vous voulez filtrer par ville. Les aperçus restent anonymisés.`,
        },
        {
          q: "Est-ce que je dois créer un compte tout de suite ?",
          a: "Non. Le tunnel Découvrir permet de comprendre l’expérience avant l’inscription. La création du profil vient ensuite, si vous souhaitez continuer.",
        },
        {
          q: "Les aperçus affichent-ils des données personnelles ?",
          a: "Non. Les aperçus publics sont limités à des signaux non identifiants comme une tranche d’âge, une ville et une intention.",
        },
        {
          q: `Pourquoi certaines villes ne sont-elles pas indexées ?`,
          a: "Embir limite volontairement les pages programmatiques indexables pendant le lancement afin de privilégier la qualité et l’utilité réelle.",
        },
      ]
    : [
        {
          q: `How can I explore ${int.labelEn.toLowerCase()} in ${ct.nameEn}?`,
          a: `Use the discovery flow, choose your intention, and add ${ct.nameEn} if you want to filter by city. Public previews remain anonymous.`,
        },
        {
          q: "Do I need to create an account immediately?",
          a: "No. The discovery flow lets you understand the experience before signing up. Profile creation comes later if you want to continue.",
        },
        {
          q: "Do previews expose personal data?",
          a: "No. Public previews are limited to non-identifying signals such as an age band, a city, and an intention.",
        },
        {
          q: "Why are some cities not indexed?",
          a: "Embir deliberately limits indexable programmatic pages during launch to keep the public corpus useful and maintainable.",
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Embir", item: "https://embir.xyz" },
      { "@type": "ListItem", position: 2, name: intentLabel, item: `https://embir.xyz${intentHubPath}` },
      { "@type": "ListItem", position: 3, name: cityName, item: `https://embir.xyz${pagePath}` },
    ],
  };

  return (
    <>
      <Navbar showLogo />
      <main className="emb-page min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <SchemaOrg />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

        <section className="mx-auto max-w-4xl py-12 text-center lg:py-16">
          <nav className="mb-6 text-xs text-white/30">
            <Link href={localizedPath(locale, "/")} className="hover:text-[#d4a574]">
              Embir
            </Link>{" "}
            /{" "}
            <Link href={intentHubPath} className="hover:text-[#d4a574]">
              {intentLabel}
            </Link>{" "}
            / <span className="text-white/50">{cityName}</span>
          </nav>
          <p className="inline-flex rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
            {isFr ? `${ct.name} · pilote français` : `${ct.nameEn} · launch pilot`}
          </p>
          {!isIndexable && (
            <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-white/35">
              {isFr
                ? "Page accessible mais non indexable pendant le lancement Embir."
                : "Accessible page, kept out of search indexing during the Embir launch."}
            </p>
          )}
          <h1 className="mt-6 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">{intro}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={primaryHref}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
            >
              {isFr ? "Découvrir des aperçus" : "Explore previews"}
            </Link>
            <Link
              href={intentHubPath}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/75 transition hover:border-[#d4a574]/35"
            >
              {isFr ? `Voir l’intention ${int.label.toLowerCase()}` : `See ${int.labelEn.toLowerCase()} intent`}
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-4xl py-8">
          <div className="space-y-8">
            {sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8">
                <h2 className="font-serif text-2xl font-light text-white sm:text-3xl">{section.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">{section.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl py-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
            {isFr ? `Autres intentions à ${ct.name}` : `Other intentions in ${ct.nameEn}`}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {otherIntents.map((otherIntent) => (
              <Link
                key={otherIntent.slug}
                href={localizedPath(locale, `/rencontre/${otherIntent.slug}/${ct.slug}`)}
                prefetch={false}
                className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/65 transition hover:border-[#d4a574]/35 hover:text-white"
              >
                {isFr ? otherIntent.label : otherIntent.labelEn} {cityName}
              </Link>
            ))}
          </div>
        </section>

        {nearbyCities.length > 0 && (
          <section className="mx-auto max-w-4xl py-8">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a574]">
              {isFr ? "Villes pilotes proches" : "Other pilot cities"}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {nearbyCities.map((nearbyCity) => (
                <Link
                  key={nearbyCity.slug}
                  href={localizedPath(locale, `/rencontre/${int.slug}/${nearbyCity.slug}`)}
                  prefetch={false}
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/65 transition hover:border-[#d4a574]/35 hover:text-white"
                >
                  {isFr ? `${int.label} ${nearbyCity.name}` : `${int.labelEn} ${nearbyCity.nameEn}`}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-4xl py-12">
          <h2 className="text-center font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? "Questions fréquentes" : "Frequently asked"}
          </h2>
          <div className="mt-10 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-white/80">
                  {item.q}
                  <span className="ml-4 text-lg text-[#d4a574] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-white/48">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl py-16 text-center">
          <h2 className="font-serif text-4xl font-light text-white sm:text-5xl">
            {isFr ? `Explorer ${int.label.toLowerCase()} à ${ct.name}` : `Explore ${int.labelEn.toLowerCase()} in ${ct.nameEn}`}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/45">
            {isFr
              ? "Commencez par un aperçu anonyme, puis créez votre profil si l’expérience vous convient."
              : "Start with an anonymous preview, then create your profile if the experience fits."}
          </p>
          <Link
            href={primaryHref}
            prefetch={false}
            className="mt-8 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
          >
            {isFr ? "Lancer Découvrir" : "Start discovery"}
          </Link>
        </section>
      </main>
    </>
  );
}
