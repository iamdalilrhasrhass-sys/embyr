import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog Embyr — Conseils rencontre gay, dating & lifestyle",
  description: "Le blog Embyr : conseils pour tes rencontres gay, témoignages, astuces dating et lifestyle. Tout pour réussir tes rencontres entre hommes.",
  keywords: ["blog gay", "conseils rencontre gay", "dating gay", "lifestyle gay", "app rencontre gay"],
  alternates: { canonical: "https://embir.xyz/blog" },
};

const articles = [
  { title: "Top 7 des Meilleures Apps de Rencontre Gay Gratuites en 2026", slug: "meilleures-apps-rencontre-gay-gratuites-2026", desc: "Tu cherches une app de rencontre gay gratuite ? Découvre notre comparatif complet des meilleures applis pour rencontrer des mecs en 2026.", tags: ["app rencontre gay", "rencontre gay gratuite", "dating gay"] },
  { title: "Comment Draguer un Mec en 2026 : Le Guide Complet", slug: "comment-draguer-mec-guide-complet", desc: "Draguer un mec te stresse ? Voici nos conseils pour aborder, séduire et créer une vraie connexion. Du premier message au premier date.", tags: ["draguer un mec", "rencontre homme", "dating conseils"] },
  { title: "Premier Date Gay : 10 Conseils pour le Réussir", slug: "premier-date-gay-conseils", desc: "Stressé pour ton premier date avec un mec ? On te donne tous nos conseils pour un premier rendez-vous gay réussi et sans pression.", tags: ["premier date gay", "rendez-vous gay", "conseils dating"] },
  { title: "Rencontre Gay : Comment Créer un Profil Qui Attire", slug: "creer-profil-gay-qui-attire", desc: "Ton profil de rencontre gay ne reçoit pas assez de messages ? Voici comment optimiser tes photos et ta bio pour attirer les bons mecs.", tags: ["profil rencontre gay", "photo profil gay", "bio dating"] },
  { title: "Coming Out et Rencontres : Nos Conseils Bienveillants", slug: "coming-out-rencontres-conseils", desc: "Tu viens de faire ton coming out et tu veux rencontrer des mecs ? Un guide bienveillant pour tes premières rencontres gay.", tags: ["coming out", "première rencontre gay", "conseils LGBTQ+"] },
  { title: "Sécurité et Rencontres Gay : 12 Règles d'Or", slug: "securite-rencontres-gay-regles", desc: "Rencontrer des mecs en ligne en toute sécurité. Nos conseils pour des dates safe et respectueux. Protège-toi et profite.", tags: ["sécurité rencontre gay", "dating safe", "conseils sécurité"] },
];

export default function BlogPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Le blog <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">Embyr</span>
          </h1>
          <p className="text-white/50 text-lg mb-12 max-w-2xl">
            Conseils, astuces et témoignages pour réussir tes rencontres entre hommes. 
            Du premier message au premier date, on t&apos;accompagne.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]">
                <h2 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors mb-2">{article.title}</h2>
                <p className="text-white/45 text-sm leading-relaxed mb-4">{article.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (<span key={tag} className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-[11px] text-white/35">{tag}</span>))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
