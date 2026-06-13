import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Dating Safety — Rules to Protect Yourself | Embir Blog",
  description: "Essential safety rules for gay dating. Meeting strangers, protecting your privacy, and staying safe.",
  keywords: ["securite rencontres gay", "gay", "LGBTQ+", "rencontre gay", "Embir"],
  alternates: { canonical: "https://embir.xyz/blog/securite-rencontres-gay" },
};

export default function BlogPost() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-3xl">
          <p className="text-rose-400 text-sm font-semibold mb-2 uppercase tracking-wider">Blog Embir</p>
          <h1 className="text-3xl md:text-5xl font-black mb-6 text-white">Sécurité dans les rencontres gay — Les règles à connaître absolument</h1>
          
          <div className="prose prose-invert max-w-none text-white/50 space-y-4 leading-relaxed">
            <p>Guide de sécurité pour les rencontres gay en ligne et dans la vie réelle. Protégez votre vie privée et restez en sécurité.</p>
            <p>Chez Embir, on croit en des rencontres authentiques entre hommes. Sans pubs, sans abonnement, sans algorithme intrusif.</p>
            <p>Notre mission : créer un espace où chaque homme peut être lui-même, en toute sécurité.</p>
            
            <h2 className="text-white text-xl font-bold mt-8">Rejoins la communauté Embir</h2>
            <p>
              Embir est l&apos;app de rencontre gay 100% gratuite, sans pubs, disponible en 25 langues.
              Crée ton profil en 2 minutes et découvre des mecs près de chez toi.
            </p>
          </div>
          
          <div className="rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-8 text-center mt-10">
            <h2 className="text-2xl font-bold text-white mb-3">Prêt à rencontrer des mecs ?</h2>
            <p className="text-white/50 mb-6">Embir est 100% gratuit. Sans pubs, sans abonnement.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]">
              Créer mon profil gratuitement
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
