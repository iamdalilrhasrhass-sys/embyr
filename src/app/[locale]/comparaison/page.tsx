import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gay Dating Apps Compared — Why Embir?",
  description: "Compare gay dating apps side by side. See why Embir is the only 100% free option with no ads, unlimited messaging, and 25 languages.",
  alternates: { canonical: "https://embir.xyz/comparaison" },
};

export default function ComparaisonPage() {
  const apps = [
    { name: "Embir", free: true, ads: false, messaging: "Unlimited", languages: "25", privacy: "Strong" },
    { name: "Grindr", free: "Limited", ads: true, messaging: "Restricted", languages: "10+", privacy: "Moderate" },
    { name: "Tinder", free: "Limited", ads: true, messaging: "Restricted", languages: "40+", privacy: "Moderate" },
    { name: "Romeo", free: "Limited", ads: true, messaging: "Restricted", languages: "15+", privacy: "Good" },
    { name: "Scruff", free: "Limited", ads: true, messaging: "Restricted", languages: "10+", privacy: "Good" },
  ];

  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white text-center">Gay Dating Apps Compared</h1>
          <p className="text-white/50 text-lg mb-10 leading-relaxed text-center max-w-xl mx-auto">
            See how Embir stacks up against other gay dating apps. One is truly free — the rest have catches.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40">
                  <th className="py-3 px-4 font-medium">App</th>
                  <th className="py-3 px-4 font-medium">Free</th>
                  <th className="py-3 px-4 font-medium">No Ads</th>
                  <th className="py-3 px-4 font-medium">Messaging</th>
                  <th className="py-3 px-4 font-medium">Languages</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app, i) => (
                  <tr key={i} className={`border-b border-white/[0.03] ${app.name === "Embir" ? "bg-white/[0.03]" : ""}`}>
                    <td className="py-3 px-4 font-bold text-white">{app.name}</td>
                    <td className="py-3 px-4 text-white/60">{app.free}</td>
                    <td className="py-3 px-4 text-white/60">{app.ads ? "Yes" : "None"}</td>
                    <td className="py-3 px-4 text-white/60">{app.messaging}</td>
                    <td className="py-3 px-4 text-white/60">{app.languages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Only one is truly free</h2>
            <p className="text-white/50 mb-6">Try Embir — no credit card, no trial, no catch.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
