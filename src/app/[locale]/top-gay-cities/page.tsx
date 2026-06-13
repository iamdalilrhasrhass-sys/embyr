import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top 20 des Villes Gay Friendly dans le Monde — Rencontres Gay | Embir",
  description:
    "Découvre le top 20 des villes gay friendly les plus incroyables pour les rencontres entre hommes. De Paris à Tokyo, trouve ta prochaine destination idéale avec Embir.",
  keywords: [
    "villes gay friendly",
    "top villes gay",
    "meilleures villes gay",
    "voyage gay",
    "destination gay friendly",
    "rencontre gay voyage",
    "capitale gay",
    "ville lgbt",
  ],
  alternates: { canonical: "https://embir.xyz/top-gay-cities" },
  openGraph: {
    title: "Top 20 des Villes Gay Friendly pour les Rencontres Gay",
    description:
      "Les meilleures villes du monde pour les rencontres entre hommes. Trouve ta prochaine destination avec Embir.",
    url: "https://embir.xyz/top-gay-cities",
    type: "article",
    siteName: "Embir",
    locale: "fr_FR",
  },
};

const cities = [
  {
    name: "Paris",
    country: "France",
    slug: "paris",
    emoji: "🗼",
    description:
      "Capitale mondiale du romantisme, Paris brille par son village gay dynamique au Marais. Bars, clubs et saunas gay s'y côtoient dans une atmosphère ouverte et festive. La Parisienne Pride attire des milliers de participants chaque année.",
    population: "2.1M habitants",
    gayScore: "5/5",
  },
  {
    name: "New York",
    country: "États-Unis",
    slug: "new-york",
    emoji: "🗽",
    description:
      "New York est le berceau du mouvement LGBTQ+ moderne. Greenwich Village, Hell's Kitchen et Brooklyn regorgent de lieux gay friendly. La NYC Pride est l'une des plus grandes du monde.",
    population: "8.4M habitants",
    gayScore: "5/5",
  },
  {
    name: "Barcelona",
    country: "Espagne",
    slug: "barcelona",
    emoji: "🌊",
    description:
      "Barcelona vibre au rythme de sa communauté gay, concentrée autour de l'Eixample (Gaixample). Plages, clubs en bord de mer et une ambiance méditerranéenne incomparable.",
    population: "1.6M habitants",
    gayScore: "5/5",
  },
  {
    name: "San Francisco",
    country: "États-Unis",
    slug: "san-francisco",
    emoji: "🌉",
    description:
      "Le Castro est LE quartier gay le plus emblématique au monde. San Francisco incarne la liberté LGBTQ+ avec une scène bouillonnante de bars, de clubs et d'associations.",
    population: "880K habitants",
    gayScore: "5/5",
  },
  {
    name: "Berlin",
    country: "Allemagne",
    slug: "berlin",
    emoji: "🇩🇪",
    description:
      "Berlin est la capitale européenne de la culture queer. Schöneberg et Neukölln concentrent bars, clubs techno gay et une vie nocturne légendaire. La CSD Berlin (Christopher Street Day) est un événement monumental.",
    population: "3.6M habitants",
    gayScore: "5/5",
  },
  {
    name: "Amsterdam",
    country: "Pays-Bas",
    slug: "amsterdam",
    emoji: "🌷",
    description:
      "Premier pays à avoir légalisé le mariage gay, Amsterdam est une référence en matière de droits LGBTQ+. Le Reguliersdwarsstraat est l'artère gay principale de la ville.",
    population: "870K habitants",
    gayScore: "5/5",
  },
  {
    name: "Madrid",
    country: "Espagne",
    slug: "madrid",
    emoji: "🇪🇸",
    description:
      "Le quartier de Chueca est le cœur gay de Madrid : bars, restaurants, clubs et une énergie contagieuse. Le MADO (Madrid Orgullo) est l'une des plus grandes Pride d'Europe.",
    population: "3.2M habitants",
    gayScore: "5/5",
  },
  {
    name: "Los Angeles",
    country: "États-Unis",
    slug: "los-angeles",
    emoji: "🎬",
    description:
      "West Hollywood (WeHo) est l'épicentre gay de Los Angeles. Santa Monica Boulevard concentre les clubs et bars gay les plus mythiques de la côte ouest.",
    population: "3.9M habitants",
    gayScore: "5/5",
  },
  {
    name: "Sydney",
    country: "Australie",
    slug: "sydney",
    emoji: "🦘",
    description:
      "Sydney et son quartier d'Oxford Street accueillent chaque année la Mardi Gras, l'un des événements LGBTQ+ les plus spectaculaires du monde. Plages, soleil et communauté vibrante.",
    population: "5.3M habitants",
    gayScore: "5/5",
  },
  {
    name: "Londres",
    country: "Royaume-Uni",
    slug: "london",
    emoji: "🇬🇧",
    description:
      "Soho et Vauxhall sont les quartiers gay emblématiques de Londres. Théâtres, clubs et pubs, la capitale britannique offre une scène gay riche et diversifiée.",
    population: "8.9M habitants",
    gayScore: "5/5",
  },
  {
    name: "Montréal",
    country: "Canada",
    slug: "montreal",
    emoji: "🍁",
    description:
      "Le Village gai de Montréal est l'un des plus grands d'Amérique du Nord. Toute l'année, bars, spectacles et événements animent ce quartier emblématique.",
    population: "1.7M habitants",
    gayScore: "5/5",
  },
  {
    name: "Rio de Janeiro",
    country: "Brésil",
    slug: "rio-de-janeiro",
    emoji: "🏖️",
    description:
      "Ipanema et Copacabana sont les plages gay friendly de Rio. La ville respire la diversité et la fête, avec l'une des communautés LGBTQ+ les plus visibles d'Amérique latine.",
    population: "6.7M habitants",
    gayScore: "5/5",
  },
  {
    name: "Tokyo",
    country: "Japon",
    slug: "tokyo",
    emoji: "🗾",
    description:
      "Ni-chōme à Shinjuku est le quartier gay de Tokyo, avec des centaines de bars nichés dans des ruelles. Une scène unique, discrète mais incroyablement riche.",
    population: "13.9M habitants",
    gayScore: "5/5",
  },
  {
    name: "Toronto",
    country: "Canada",
    slug: "toronto",
    emoji: "🇨🇦",
    description:
      "Church-Wellesley Village est le cœur gay de Toronto. La ville est reconnue pour son inclusivité et sa Pride Week parmi les plus festives du continent.",
    population: "2.7M habitants",
    gayScore: "5/5",
  },
  {
    name: "Buenos Aires",
    country: "Argentine",
    slug: "buenos-aires",
    emoji: "🇦🇷",
    description:
      "Buenos Aires est la ville la plus gay friendly d'Amérique du Sud. Palermo et San Telmo concentrent bars et clubs dans une ambiance latino unique.",
    population: "2.9M habitants",
    gayScore: "5/5",
  },
  {
    name: "Stockholm",
    country: "Suède",
    slug: "stockholm",
    emoji: "🇸🇪",
    description:
      "Stockholm brille par son ouverture d'esprit et sa scène gay moderne. Södermalm est le quartier prisé, avec bars et cafés LGBTQ+ dans un cadre scandinave magnifique.",
    population: "975K habitants",
    gayScore: "5/5",
  },
  {
    name: "Rome",
    country: "Italie",
    slug: "rome",
    emoji: "🏛️",
    description:
      "Rome allie histoire antique et vie gay moderne. Gay Street à Colosseo et le quartier Monti accueillent une communauté gay chaleureuse et fière.",
    population: "2.8M habitants",
    gayScore: "5/5",
  },
  {
    name: "Mexico",
    country: "Mexique",
    slug: "mexico-city",
    emoji: "🇲🇽",
    description:
      "Zona Rosa est le quartier gay historique de Mexico. La ville est une référence en matière de droits LGBTQ+ en Amérique latine, avec une scène culturelle queer florissante.",
    population: "8.8M habitants",
    gayScore: "5/5",
  },
  {
    name: "Prague",
    country: "République Tchèque",
    slug: "prague",
    emoji: "🇨🇿",
    description:
      "Prague attire une communauté gay cosmopolite. Vinohrady et le centre-ville offrent bars et clubs gay dans un décor architectural à couper le souffle.",
    population: "1.3M habitants",
    gayScore: "5/5",
  },
  {
    name: "Vancouver",
    country: "Canada",
    slug: "vancouver",
    emoji: "🌲",
    description:
      "Davie Village est le quartier gay de Vancouver, entouré de montagnes et d'océan. La ville est réputée pour son atmosphère décontractée et inclusive.",
    population: "631K habitants",
    gayScore: "5/5",
  },
];

export default function TopGayCitiesPage() {
  return (
    <main className="emb-page min-h-screen">
      <section className="py-24 px-4 sm:px-6">
        <div className="emb-container max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Top 20 des{" "}
            <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-purple-300 bg-clip-text text-transparent">
              Villes Gay Friendly
            </span>
          </h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Tu cherches les meilleures destinations pour{" "}
            <strong className="text-white/70">rencontrer des mecs</strong> dans le monde ?
            Voici notre sélection des 20 villes les plus gay friendly de la planète. Que tu sois
            en voyage ou que tu cherches à t&apos;installer, ces villes sont des incontournables pour
            la communauté LGBTQ+.
          </p>

          <div className="grid gap-4 sm:grid-cols-4 mb-12">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-white font-bold">20 Villes</div>
              <div className="text-white/40 text-sm mt-1">Dans le monde</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
               
              <div className="text-white font-bold">Gay Friendly</div>
              <div className="text-white/40 text-sm mt-1">Scène LGBTQ+ active</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
               
              <div className="text-white font-bold">Embir</div>
              <div className="text-white/40 text-sm mt-1">Connecte-toi partout</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <div className="text-3xl mb-2">🌆</div>
              <div className="text-white font-bold">Gratuit</div>
              <div className="text-white/40 text-sm mt-1">Rencontres sans limite</div>
            </div>
          </div>

          <div className="space-y-6">
            {cities.map((city, index) => (
              <div
                key={city.slug}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{city.emoji}</span>
                      <h2 className="text-xl font-bold text-white">
                        {index + 1}. {city.name}
                      </h2>
                      <span className="text-white/30 text-sm">{city.country}</span>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{city.gayScore} · {city.population}</p>
                    <p className="text-white/50 leading-relaxed">{city.description}</p>
                    <Link
                      href={`/rencontre-gay/${city.slug}`}
                      className="inline-block mt-3 text-rose-400/70 hover:text-rose-300 text-sm underline"
                    >
                      Rencontre gay à {city.name} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-rose-400/10 bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.04] p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Prêt à rencontrer des mecs dans ta ville ?
            </h2>
            <p className="text-white/50 mb-6">
              Rejoins Embir gratuitement et connecte-toi avec des hommes près de chez toi, où que tu sois dans le monde.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/40 hover:scale-[1.02]"
            >
              Créer mon profil gratuitement
            </Link>
          </div>

          <div className="mt-12 prose prose-invert max-w-none text-white/50 space-y-4">
            <h2 className="text-white text-xl font-bold">
              Pourquoi choisir une ville gay friendly pour tes rencontres ?
            </h2>
            <p>
              Vivre ou voyager dans une <strong className="text-white/70">ville gay friendly</strong>{" "}
              transforme complètement ton expérience des rencontres. Tu peux être toi-même sans
              crainte, flâner main dans la main dans la rue, et trouver des lieux où la communauté
              LGBTQ+ se rassemble naturellement.
            </p>
            <p>
              Sur <strong className="text-white/70">Embir</strong>, tu peux te connecter avec des mecs
              dans chacune de ces villes, où que tu sois. Que tu prépares un voyage, que tu
              déménages ou que tu cherches simplement à élargir ton cercle de rencontres,
              l&apos;app est là pour toi — <strong>100% gratuite, sans pubs, sans limite de messages</strong>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
