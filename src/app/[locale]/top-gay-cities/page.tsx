import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top 30 Gay Cities in the World — The 2026 Ranking | Embir",
  description: "The definitive ranking of the best gay cities in 2026. Nightlife, dating scene, community, and LGBTQ rights — find your next destination.",
  keywords: ["best gay cities", "gay travel", "LGBTQ cities", "gay friendly cities", "top gay destinations 2026"],
  alternates: { canonical: "https://embir.xyz/top-gay-cities" },
};

const cities = [
  { rank: 1, name: "Berlin", country: "Germany", score: 9.4, highlight: "Unmatched nightlife and creative freedom", link: "/rencontre-gay/berlin" },
  { rank: 2, name: "Amsterdam", country: "Netherlands", score: 9.3, highlight: "The original gay rights pioneer", link: "/rencontre-gay/amsterdam" },
  { rank: 3, name: "Barcelona", country: "Spain", score: 9.2, highlight: "Mediterranean sun + vibrant gay scene", link: "/rencontre-gay/barcelona" },
  { rank: 4, name: "San Francisco", country: "USA", score: 9.1, highlight: "Historic LGBTQ capital of America", link: "/rencontre-gay/san-francisco" },
  { rank: 5, name: "London", country: "UK", score: 9.0, highlight: "Massive, diverse, and always on", link: "/rencontre-gay/london" },
  { rank: 6, name: "New York", country: "USA", score: 8.9, highlight: "Endless options for every vibe", link: "/rencontre-gay/new-york" },
  { rank: 7, name: "Paris", country: "France", score: 8.8, highlight: "Le Marais and beyond — classic charm", link: "/rencontre-gay/paris" },
  { rank: 8, name: "Madrid", country: "Spain", score: 8.7, highlight: "Europe's most welcoming capital", link: "/rencontre-gay/madrid" },
  { rank: 9, name: "Toronto", country: "Canada", score: 8.6, highlight: "Multicultural, safe, and proudly out", link: "/rencontre-gay/toronto" },
  { rank: 10, name: "Tokyo", country: "Japan", score: 8.5, highlight: "Nichome district — unique and electric", link: "/rencontre-gay/tokyo" },
  { rank: 11, name: "Sydney", country: "Australia", score: 8.4, highlight: "Beach vibes + Mardi Gras energy", link: "/rencontre-gay/sydney" },
  { rank: 12, name: "Mexico City", country: "Mexico", score: 8.3, highlight: "Latin America's gay cultural hub", link: "/rencontre-gay/mexico-city" },
  { rank: 13, name: "Tel Aviv", country: "Israel", score: 8.2, highlight: "Middle East's most liberal city", link: "/rencontre-gay/tel-aviv" },
  { rank: 14, name: "Lisbon", country: "Portugal", score: 8.1, highlight: "Affordable, sunny, and inclusive", link: "/rencontre-gay/lisbon" },
  { rank: 15, name: "Copenhagen", country: "Denmark", score: 8.0, highlight: "Scandinavian design meets gay rights", link: "/rencontre-gay/copenhagen" },
  { rank: 16, name: "Vancouver", country: "Canada", score: 7.9, highlight: "Pacific beauty + progressive values", link: "/rencontre-gay/vancouver" },
  { rank: 17, name: "Miami", country: "USA", score: 7.8, highlight: "Sun, beach, and Latin gay energy", link: "/rencontre-gay/miami" },
  { rank: 18, name: "Bangkok", country: "Thailand", score: 7.7, highlight: "Asia's most vibrant LGBTQ destination", link: "/rencontre-gay/bangkok" },
  { rank: 19, name: "Rome", country: "Italy", score: 7.6, highlight: "History, beauty, and a growing scene", link: "/rencontre-gay/rome" },
  { rank: 20, name: "Sao Paulo", country: "Brazil", score: 7.5, highlight: "World's biggest Pride parade", link: "/rencontre-gay/sao-paulo" },
  { rank: 21, name: "Milan", country: "Italy", score: 7.4, highlight: "Fashion capital with cosmopolitan appeal", link: "/rencontre-gay/milan" },
  { rank: 22, name: "Montreal", country: "Canada", score: 7.3, highlight: "French charm, Canadian openness", link: "/rencontre-gay/montreal" },
  { rank: 23, name: "Vienna", country: "Austria", score: 7.2, highlight: "Classical elegance meets modern pride", link: "/rencontre-gay/vienna" },
  { rank: 24, name: "Buenos Aires", country: "Argentina", score: 7.1, highlight: "South America's most progressive capital", link: "/rencontre-gay/buenos-aires" },
  { rank: 25, name: "Seoul", country: "South Korea", score: 7.0, highlight: "Hidden gems in a rapidly opening city", link: "/rencontre-gay/seoul" },
  { rank: 26, name: "Dublin", country: "Ireland", score: 6.9, highlight: "Historic gay rights victory + pub culture", link: "/rencontre-gay/dublin" },
  { rank: 27, name: "Brussels", country: "Belgium", score: 6.8, highlight: "European capital with a welcoming vibe", link: "/rencontre-gay/brussels" },
  { rank: 28, name: "Prague", country: "Czech Republic", score: 6.7, highlight: "Affordable, beautiful, and increasingly open", link: "/rencontre-gay/prague" },
  { rank: 29, name: "Budapest", country: "Hungary", score: 6.6, highlight: "Thermal baths + emerging LGBTQ scene", link: "/rencontre-gay/budapest" },
  { rank: 30, name: "Cape Town", country: "South Africa", score: 6.5, highlight: "Africa's most established gay destination", link: "/rencontre-gay/cape-town" },
];

export default function TopGayCitiesPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white text-center">
            Top 30 Gay Cities in 2026
          </h1>
          <p className="text-white/50 text-lg mb-10 leading-relaxed text-center max-w-2xl mx-auto">
            From Berlin's legendary clubs to Cape Town's rainbow streets — these are the
            cities where the gay community thrives. Ranked by nightlife, dating culture,
            safety, and LGBTQ rights.
          </p>

          <div className="space-y-2 mb-10">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 text-sm text-white/30 font-semibold uppercase tracking-wider border-b border-white/[0.06]">
              <span className="w-8 text-center">#</span>
              <span>City</span>
              <span>Score</span>
            </div>
            {cities.map((city) => (
              <Link
                key={city.rank}
                href={city.link}
                className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group items-center"
              >
                <span className="w-8 text-center text-white/40 text-sm font-mono">{city.rank}</span>
                <div>
                  <span className="text-white group-hover:text-white/90 transition-colors font-medium">{city.name}</span>
                  <span className="text-white/30 text-sm ml-2">{city.country}</span>
                  <p className="text-white/25 text-xs mt-0.5">{city.highlight}</p>
                </div>
                <span className="text-white/50 text-sm font-mono">{city.score}</span>
              </Link>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Find your city's community on Embir</h2>
            <p className="text-white/50 mb-6">Wherever you are, there are guys nearby looking to connect.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90">
              Create my free profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
