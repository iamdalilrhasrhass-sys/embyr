import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { SEO_CITIES, SEO_INTENTS, COUNTRY_NAMES } from "@/seo/seo-cities";

export const revalidate = 3600;

export async function generateStaticParams() {
  const locales = ["fr", "en"];
  const params: { locale: string; slug: string; city: string }[] = [];
  for (const locale of locales) {
    for (const intent of SEO_INTENTS) {
      for (const city of SEO_CITIES) {
        params.push({ locale, slug: intent.slug, city: city.slug });
      }
    }
  }
  return params;
}

async function getData(locale: string, intentSlug: string, citySlug: string) {
  const intent = SEO_INTENTS.find((i) => i.slug === intentSlug);
  const city = SEO_CITIES.find((c) => c.slug === citySlug);
  if (!intent || !city) return null;
  return { intent, city };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; city: string }>;
}): Promise<Metadata> {
  const { locale, slug, city } = await params;
  const data = await getData(locale, slug, city);
  if (!data) return { title: "Embir" };

  const isFr = locale === "fr";
  const { intent: int, city: ct } = data;
  const country = COUNTRY_NAMES[ct.country];

  const titleFr = `Rencontre ${int.label} ${ct.name} gratuit | Embir`;
  const titleEn = `${int.labelEn} dating in ${ct.nameEn} — free | Embir`;
  const descFr = `Rencontre ${int.label} a ${ct.name} (${country.fr}). Profils verifies, filtre par orientation. 100% gratuit, sans pub, sans abonnement.`;
  const descEn = `${int.labelEn} dating in ${ct.nameEn} (${country.en}). Verified profiles, orientation filter. 100% free, no ads, no subscription.`;

  return {
    title: isFr ? titleFr : titleEn,
    description: isFr ? descFr : descEn,
    alternates: {
      canonical: `https://embir.xyz/${isFr ? "fr/" : ""}rencontre/${int.slug}/${ct.slug}`,
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
  const data = await getData(locale, slug, city);
  if (!data) return <div>Page not found</div>;

  const { intent: int, city: ct } = data;
  const country = COUNTRY_NAMES[ct.country];
  const h1Fr = `${int.label} a ${ct.name} : rencontre gratuite par orientation`;
  const h1En = `${int.labelEn} in ${ct.nameEn}: free dating by orientation`;
  const introFr = `Embir connecte les personnes qui cherchent ${int.label.toLowerCase()} a ${ct.name}, ${country.fr}. Filtre strict par orientation. 100% gratuit, sans pub, sans abonnement.`;
  const introEn = `Embir connects people looking for ${int.labelEn.toLowerCase()} in ${ct.nameEn}, ${country.en}. Strict orientation filter. 100% free, no ads, no subscription.`;

  const sectionsFr = [
    { title: `Pourquoi Embir pour ${int.label.toLowerCase()} a ${ct.name} ?`, text: `A ${ct.name} (${ct.population} habitants, ${country.fr}), les apps de rencontre melangent tout le monde. Embir separe. Chaque orientation obtient son propre espace filtre. Si tu cherches ${int.label.toLowerCase()}, tu ne vois que les profils qui cherchent la meme chose dans ta ville.` },
    { title: `Filtre par orientation a ${ct.name}`, text: `Le filtre bidirectionnel est strict : tu ne vois que les profils qui te correspondent ET qui te cherchent aussi. Un hetero ne verra jamais un profil gay a ${ct.name}. Chaque communaute obtient son espace.` },
    { title: `Profils verifies a ${ct.name}`, text: `La verification par selfie elimine les faux profils. Les profils verifies ont un badge et sont mis en avant dans le feed de ${ct.name}.` },
    { title: `100% gratuit a ${ct.name}`, text: `Aucun abonnement, aucune pub, aucune limite de likes. Toutes les fonctionnalites sont accessibles a tous les membres de ${ct.name}.` },
  ];
  const sectionsEn = [
    { title: `Why Embir for ${int.labelEn} in ${ct.nameEn}?`, text: `In ${ct.nameEn} (pop. ${ct.population}, ${country.en}), dating apps mix everyone together. Embir separates. Each orientation gets its own filtered space.` },
    { title: `Orientation filter in ${ct.nameEn}`, text: `The bidirectional filter is strict: you only see profiles that match you AND are looking for you. A straight person never sees a gay profile in ${ct.nameEn}.` },
    { title: `Verified profiles in ${ct.nameEn}`, text: `Selfie verification eliminates fake profiles. Verified profiles have a badge and are featured in the ${ct.nameEn} feed.` },
    { title: `100% free in ${ct.nameEn}`, text: `No subscription, no ads, no like limits. All features are available to all members in ${ct.nameEn}.` },
  ];

  const faqFr = [
    { q: `Embir est-il gratuit pour ${int.label.toLowerCase()} a ${ct.name} ?`, a: `Oui, 100% gratuit. Aucune fonctionnalite payante.` },
    { q: `Comment trouver des ${int.label.toLowerCase()} a ${ct.name} ?`, a: `Inscris-toi, choisis l'intention "${int.label}" et ta ville ${ct.name}. Embir te montre les profils compatibles.` },
    { q: `Le filtre par orientation fonctionne-t-il a ${ct.name} ?`, a: `Oui. Le filtre est bidirectionnel et strict.` },
    { q: `Les profils sont-ils verifies a ${ct.name} ?`, a: `Oui, par selfie. Les profils verifies ont un badge.` },
    { q: `Puis-je chercher plusieurs intentions a ${ct.name} ?`, a: `Oui. Tu peux selectionner plusieurs intentions.` },
  ];
  const faqEn = [
    { q: `Is Embir free for ${int.labelEn.toLowerCase()} in ${ct.nameEn}?`, a: `Yes, 100% free. No paid features.` },
    { q: `How do I find ${int.labelEn.toLowerCase()} in ${ct.nameEn}?`, a: `Sign up, choose the "${int.labelEn}" intention and your city ${ct.nameEn}.` },
    { q: `Does the orientation filter work in ${ct.nameEn}?`, a: `Yes. The filter is bidirectional and strict.` },
    { q: `Are profiles verified in ${ct.nameEn}?`, a: `Yes, by selfie. Verified profiles have a badge.` },
    { q: `Can I search for multiple intentions in ${ct.nameEn}?`, a: `Yes. You can select multiple intentions.` },
  ];

  const sections = isFr ? sectionsFr : sectionsEn;
  const faq = isFr ? faqFr : faqEn;
  const h1 = isFr ? h1Fr : h1En;
  const intro = isFr ? introFr : introEn;
  const nearbyCities = SEO_CITIES.filter((c) => c.country === ct.country && c.slug !== ct.slug).slice(0, 6);
  const otherIntents = SEO_INTENTS.filter((i) => i.slug !== int.slug);

  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Embir", item: "https://embir.xyz" },
    { "@type": "ListItem", position: 2, name: isFr ? int.label : int.labelEn, item: `https://embir.xyz/${int.slug}` },
    { "@type": "ListItem", position: 3, name: isFr ? ct.name : ct.nameEn, item: `https://embir.xyz/rencontre/${int.slug}/${ct.slug}` },
  ]};

  return (
    <>
      <Navbar showLogo />
      <main className="emb-page min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <SchemaOrg />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <section className="mx-auto max-w-4xl py-12 text-center lg:py-16">
          <nav className="text-xs text-white/30 mb-6">
            <Link href="/" className="hover:text-[#d4a574]">Embir</Link> / <Link href={`/${int.slug}`} className="hover:text-[#d4a574]">{isFr ? int.label : int.labelEn}</Link> / <span className="text-white/50">{isFr ? ct.name : ct.nameEn}</span>
          </nav>
          <p className="inline-flex rounded-full border border-[#d4a574]/20 bg-[#d4a574]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a574]">{isFr ? `${ct.name} · 100% gratuit` : `${ct.nameEn} · 100% free`}</p>
          <h1 className="mt-6 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">{h1}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">{intro}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href={`/auth/register?intent=${int.intent}&city=${ct.slug}`} prefetch={false} className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]">{isFr ? `Rejoindre ${ct.name}` : `Join ${ct.nameEn}`}</Link>
            <Link href={`/${int.slug}`} prefetch={false} className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white/75 transition hover:border-[#d4a574]/35">{isFr ? `Voir tout ${int.label}` : `See all ${int.labelEn}`}</Link>
          </div>
        </section>
        <section className="mx-auto max-w-4xl py-8"><div className="space-y-8">{sections.map((s, i) => (<article key={i} className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8"><h2 className="font-serif text-2xl font-light text-white sm:text-3xl">{s.title}</h2><p className="mt-4 text-base leading-relaxed text-white/55">{s.text}</p></article>))}</div></section>
        <section className="mx-auto max-w-4xl py-8"><p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a574]">{isFr ? `Autres intentions a ${ct.name}` : `Other intentions in ${ct.nameEn}`}</p><div className="mt-6 flex flex-wrap justify-center gap-3">{otherIntents.map((oi) => (<Link key={oi.slug} href={`/rencontre/${oi.slug}/${ct.slug}`} prefetch={false} className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/65 transition hover:border-[#d4a574]/35 hover:text-white">{isFr ? oi.label : oi.labelEn} {isFr ? ct.name : ct.nameEn}</Link>))}</div></section>
        {nearbyCities.length > 0 && (<section className="mx-auto max-w-4xl py-8"><p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#d4a574]">{isFr ? `Villes proches` : `Nearby cities`}</p><div className="mt-6 flex flex-wrap justify-center gap-3">{nearbyCities.map((nc) => (<Link key={nc.slug} href={`/rencontre/${int.slug}/${nc.slug}`} prefetch={false} className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-white/65 transition hover:border-[#d4a574]/35 hover:text-white">{isFr ? `${int.label} ${nc.name}` : `${int.labelEn} ${nc.nameEn}`}</Link>))}</div></section>)}
        <section className="mx-auto max-w-4xl py-12"><h2 className="text-center font-serif text-4xl font-light text-white sm:text-5xl">{isFr ? "Questions frequentes" : "Frequently asked"}</h2><div className="mt-10 space-y-3">{faq.map((item, i) => (<details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"><summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-white/80">{item.q}<span className="ml-4 text-lg text-[#d4a574] transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-relaxed text-white/48">{item.a}</p></details>))}</div></section>
        <section className="mx-auto max-w-5xl py-16 text-center"><h2 className="font-serif text-4xl font-light text-white sm:text-5xl">{isFr ? `Pret a rencontrer des ${int.label.toLowerCase()} a ${ct.name} ?` : `Ready to meet ${int.labelEn.toLowerCase()} in ${ct.nameEn}?`}</h2><p className="mx-auto mt-4 max-w-xl text-base text-white/45">{isFr ? "100% gratuit. Aucune pub. Aucun abonnement." : "100% free. No ads. No subscription."}</p><Link href={`/auth/register?intent=${int.intent}&city=${ct.slug}`} prefetch={false} className="mt-8 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]">{isFr ? "Creer mon profil" : "Create my profile"}</Link></section>
      </main>
    </>
  );
}
