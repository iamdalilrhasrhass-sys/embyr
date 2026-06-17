import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Blog",
  description: "Article Embir.",
  alternates: { canonical: "https://embir.xyz/blog/best-grindr-alternative-free" },
};
export default function Page() {
  return (<main className="emb-page min-h-screen"><section className="px-4 pt-32 pb-20"><div className="mx-auto max-w-3xl text-center"><h1 className="font-serif text-4xl text-white">Article</h1><p className="mt-6 text-white/50">Cet article est en cours de rédaction.</p><Link href="/auth/register" className="inline-flex items-center gap-2 mt-8 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614]">Créer mon profil gratuit</Link></div></section></main>);
}