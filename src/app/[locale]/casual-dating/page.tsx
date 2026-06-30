import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: "en" | "fr" }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  const url = isFr ? "https://embir.xyz/fr/casual-dating" : "https://embir.xyz/casual-dating";
  const title = isFr ? "Casual dating sans pression — Embir" : "Casual dating without pressure — Embir";
  const description = isFr
    ? "Embir aide a chercher du casual avec des intentions claires, des profils verifies et une compatibilite reciproque, sans faux discours ni paywall precoce."
    : "Embir helps people look for casual dating with clear intentions, verified profiles and reciprocal compatibility, without fake promises or early paywalls.";
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "fr-FR": "https://embir.xyz/fr/casual-dating",
        "en-US": "https://embir.xyz/casual-dating",
        "x-default": "https://embir.xyz/casual-dating",
      },
    },
    openGraph: { title, description, url, siteName: "Embir", locale: isFr ? "fr_FR" : "en_US", type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function CasualDatingPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const canonical = isFr ? "https://embir.xyz/fr/casual-dating" : "https://embir.xyz/casual-dating";
  const faq = isFr
    ? [
        { q: "Que signifie casual dating sur Embir ?", a: "Une rencontre sans engagement imposé, avec une intention annoncée clairement, du consentement et du respect." },
        { q: "Les profils casual sont-ils vérifiés ?", a: "Embir met la vérification selfie au cœur de la confiance et signale les profils vérifiés." },
        { q: "Puis-je changer d'intention plus tard ?", a: "Oui. Tu peux faire évoluer tes intentions et tes préférences lorsque ta situation change." },
      ]
    : [
        { q: "What does casual dating mean on Embir?", a: "Dating without imposed commitment, with clearly stated intent, consent and respect." },
        { q: "Are casual dating profiles verified?", a: "Embir puts selfie verification at the centre of trust and identifies verified profiles." },
        { q: "Can I change my intent later?", a: "Yes. You can update your intentions and preferences when your situation changes." },
      ];
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Embir", item: "https://embir.xyz" },
    { "@type": "ListItem", position: 2, name: isFr ? "Rencontre casual" : "Casual dating", item: canonical },
  ] };

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">{isFr ? "Intention" : "Intention"}</p>
        <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">
          {isFr ? "Rencontre casual sans pression et sans ambiguite" : "Casual dating without pressure or ambiguity"}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/50">
          {isFr
            ? "Le casual ne devrait pas etre flou. Sur Embir, l'intention est explicite, la compatibilite est reciproque et les profils sont verifies avant le moindre contact."
            : "Casual dating should not be vague. On Embir, intent is explicit, compatibility is reciprocal, and profiles are verified before the first contact."}
        </p>

        <section className="mt-12 space-y-5 text-base leading-relaxed text-white/55">
          <div className="rounded-2xl border border-[#d4a574]/10 bg-[#d4a574]/[0.02] p-7">
            <h2 className="font-serif text-3xl text-white">{isFr ? "Un cadre casual plus clair" : "A clearer casual frame"}</h2>
            <p className="mt-4">
              {isFr
                ? "Le casual dating souffre d'un probleme simple: tout le monde n'entend pas la meme chose par ce mot. Embir pose un cadre plus net: du clair, du consenti, du respectueux."
                : "Casual dating often suffers from a simple problem: different people mean different things by the same phrase. Embir sets a clearer frame: explicit, consensual and respectful."}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Ce que tu obtiens" : "What you get"}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                [isFr ? "Intention claire" : "Clear intent", isFr ? "Tu choisis l'intention casual, et tu vois des personnes qui cherchent la meme chose." : "You choose casual intent and only see people looking for the same thing."],
                [isFr ? "Profils verifies" : "Verified profiles", isFr ? "La verification selfie reduit les faux profils et le bruit inutile." : "Selfie verification reduces fake profiles and unnecessary noise."],
                [isFr ? "Compatibilite reciproque" : "Reciprocal compatibility", isFr ? "La compatibilite ne depend pas seulement de l'algorithme, mais aussi du consentement mutuel." : "Compatibility depends on mutual intent, not just an opaque algorithm."],
                [isFr ? "Zéro paywall precoce" : "No early paywall", isFr ? "Tu peux tester sans carte bancaire pendant la phase de lancement." : "You can test the product without a credit card during launch."],
              ].map(([title, text]) => (
                <div key={title as string} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h3 className="font-semibold text-white/85">{title}</h3>
                  <p className="mt-2 text-sm text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
            <h2 className="font-serif text-2xl text-white">{isFr ? "Le casual, bien fait" : "Casual, done properly"}</h2>
            <p className="mt-4">
              {isFr
                ? "Le casual n'est pas un prétexte pour être flou, irrespectueux ou pressé. Embir garde le cadre simple: tu dis ce que tu cherches, tu vois des profils compatibles, et tu décides en adulte."
                : "Casual dating is not an excuse to be vague, disrespectful or pushy. Embir keeps the frame simple: say what you want, see compatible profiles, and decide like an adult."}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-white">{isFr ? "Questions fréquentes" : "Frequently asked questions"}</h2>
            <div className="mt-5 space-y-3">
              {faq.map((item) => (
                <details key={item.q} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <summary className="cursor-pointer font-semibold text-white/85">{item.q}</summary>
                  <p className="mt-3 text-sm text-white/50">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-8 text-center">
          <h2 className="font-serif text-3xl text-white">{isFr ? "Essayer Embir gratuitement" : "Try Embir for free"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
            {isFr
              ? "Crée un profil gratuit et teste une approche plus claire du casual dating."
              : "Create a free profile and test a clearer approach to casual dating."}
          </p>
          <Link href="/auth/register?source=casual-dating" className="mt-7 inline-flex rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">
            {isFr ? "Créer mon profil" : "Create my profile"}
          </Link>
        </section>
      </article>
    </main>
  );
}
