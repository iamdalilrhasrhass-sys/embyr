import Link from "next/link";
import type { ResolvedSeoPage } from "@/seo/catalog";
import { absoluteUrl } from "@/seo/url";
import {
  getComparisonContent,
  getCityContent,
  COMPARISON_CONTENT_MAP,
} from "@/seo/content-loader";
import type {
  ComparisonContent,
  CityContent,
  ComparisonTableRow,
  ComparisonSection,
  FaqItem,
} from "@/seo/content-types";

// ── Helper components ──

function RichJsonLd({
  page,
  content,
}: {
  page: ResolvedSeoPage;
  content: ComparisonContent | CityContent;
}) {
  const url = absoluteUrl(
    page.kind === "comparison"
      ? page.locale === "fr"
        ? `/fr/comparaison/${page.slug}`
        : `/comparison/${page.slug}`
      : page.locale === "fr"
        ? `/fr/rencontre/${page.slug}`
        : `/rencontre/${page.slug}`
  );

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      name: page.title,
      headline: page.h1,
      description: page.description,
      isPartOf: { "@type": "WebSite", name: "Embir", url: "https://embir.xyz" },
      url,
      author: {
        "@type": "Organization",
        name: page.locale === "fr" ? "Équipe Embir" : "Embir Team",
      },
      dateModified: "2026-06-20",
      datePublished: "2026-06-15",
      about: [
        "dating platform",
        "verified profiles",
        "compatibility",
        "preferences",
        "safety",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://embir.xyz",
        },
        {
          "@type": "ListItem",
          position: 2,
          name:
            page.kind === "comparison"
              ? page.locale === "fr"
                ? "Comparatifs"
                : "Comparisons"
              : page.locale === "fr"
                ? "Rencontre"
                : "Dating",
          item: absoluteUrl(
            page.kind === "comparison"
              ? page.locale === "fr"
                ? "/fr/comparaison/alternative-tinder"
                : "/comparison/tinder-alternative"
              : "/"
          ),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.h1,
          item: url,
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}

function ComparisonTable({ rows }: { rows: ComparisonTableRow[] }) {
  const isFr = rows[0]?.criteria.includes("Modèle") || rows[0]?.criteria.includes(" modèle");
  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl text-white">
        {isFr ? "Tableau comparatif" : "Comparison table"}
      </h2>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.03]">
              <th className="p-4 font-semibold text-white/70">
                {isFr ? "Critère" : "Criteria"}
              </th>
              <th className="p-4 font-semibold text-white/50">
                {isFr ? "Concurrent" : "Competitor"}
              </th>
              <th className="p-4 font-semibold text-embir-rose">Embir</th>
              <th className="p-4 font-semibold text-white/70 text-center">
                {isFr ? "Gagnant" : "Winner"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-white/[0.04] ${
                  i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                }`}
              >
                <td className="p-4 font-medium text-white/70">{row.criteria}</td>
                <td className="p-4 text-white/45">{row.competitor}</td>
                <td className="p-4 text-embir-rose/90 font-medium">{row.embir}</td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      row.winner === "embir"
                        ? "bg-embir-rose/15 text-embir-rose"
                        : row.winner === "tie"
                          ? "bg-white/[0.06] text-white/50"
                          : "bg-white/[0.04] text-white/40"
                    }`}
                  >
                    {row.winner === "embir" ? "Embir ✓" : row.winner === "tie" ? "Égalité" : "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ContentSection({
  section,
  isFr,
}: {
  section: ComparisonSection;
  isFr: boolean;
}) {
  return (
    <div>
      <h2 className="font-serif text-3xl text-white">{section.title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-white/52">
        {section.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {section.highlights && section.highlights.length > 0 && (
        <ul className="mt-4 space-y-2">
          {section.highlights.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-white/58"
            >
              <span className="mt-1 text-embir-rose">✦</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RichFAQ({
  faq,
  isFr,
}: {
  faq: FaqItem[];
  isFr: boolean;
}) {
  return (
    <section className="mt-16">
      <h2 className="font-serif text-3xl text-white">
        {isFr ? "Questions fréquentes" : "Frequently asked questions"}
      </h2>
      <div className="mt-6 space-y-3">
        {faq.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <summary className="cursor-pointer flex items-center justify-between text-sm font-semibold text-white/80 list-none">
              {item.q}
              <span className="ml-4 text-embir-rose text-lg group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-white/48">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTAFooter({ text, isFr }: { text: string; isFr: boolean }) {
  return (
    <section className="mt-16 rounded-3xl border border-embir-rose/15 bg-embir-rose/[0.04] p-8 text-center">
      <h2 className="font-serif text-3xl text-white">{text}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/45">
        {isFr
          ? "Crée ton profil gratuitement, sans carte bancaire et rejoins la communauté fondatrice qui construit une plateforme de rencontre plus sûre, plus inclusive et plus compatible."
          : "Create your profile without a credit card and join the founding community building a safer, more inclusive and more compatible dating platform."}
      </p>
      <Link
        href="/auth/register"
        prefetch={false}
        className="mt-7 inline-flex rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush transition"
      >
        {isFr ? "Créer mon profil gratuit" : "Create my free profile"}
      </Link>
    </section>
  );
}

function RelatedComparisons({ locale }: { locale: "en" | "fr" }) {
  const isFr = locale === "fr";
  const links = isFr
    ? [
        { href: "/fr/comparaison/alternative-grindr", label: "Embir vs Grindr" },
        { href: "/fr/comparaison/alternative-bumble", label: "Embir vs Bumble" },
        { href: "/fr/comparaison/alternative-hinge", label: "Embir vs Hinge" },
        { href: "/fr/comparaison/meetic-vs-embir", label: "Embir vs Meetic" },
        { href: "/fr/comparaison/meilleure-application-rencontre-2026", label: "Meilleure app 2026" },
      ]
    : [
        { href: "/comparison/grindr-alternative", label: "Embir vs Grindr" },
        { href: "/comparison/bumble-alternative", label: "Embir vs Bumble" },
        { href: "/comparison/hinge-alternative", label: "Embir vs Hinge" },
        { href: "/comparison/meetic-vs-embir", label: "Embir vs Meetic" },
        { href: "/comparison/best-dating-app-2026", label: "Best dating app 2026" },
      ];

  return (
    <section className="mt-14 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-7">
      <h2 className="font-serif text-2xl text-white">
        {isFr ? "Comparatifs similaires" : "Related comparisons"}
      </h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-embir-rose/30 hover:text-embir-rose"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Main content renderers ──

export async function RichComparisonContent({ page }: { page: ResolvedSeoPage }) {
  const contentKey = COMPARISON_CONTENT_MAP[page.slug] || page.slug;
  const content = await getComparisonContent(contentKey, page.locale);
  const isFr = page.locale === "fr";

  if (!content) {
    return (
      <section className="mt-12 text-white/45">
        <p>
          {isFr
            ? "Contenu détaillé en cours de rédaction. Reviens bientôt pour une comparaison complète."
            : "Detailed content coming soon. Check back for a full comparison."}
        </p>
      </section>
    );
  }

  return (
    <>
      <RichJsonLd page={page} content={content} />

      {/* Intro */}
      <section className="mt-12">
        <div className="text-lg leading-relaxed text-white/55">
          {content.intro.split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <ComparisonTable rows={content.comparisonTable} />

      {/* Editorial sections */}
      <section className="mt-12 space-y-12">
        {content.sections.map((section, i) => (
          <ContentSection key={i} section={section} isFr={isFr} />
        ))}
      </section>

      {/* Verdict */}
      <section className="mt-12 rounded-3xl border border-embir-rose/15 bg-embir-rose/[0.03] p-8">
        <h2 className="font-serif text-3xl text-white">
          {isFr ? "Le verdict" : "The verdict"}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-white/55">
          {content.verdict.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <RichFAQ faq={content.faq} isFr={isFr} />

      {/* Related comparisons */}
      <RelatedComparisons locale={page.locale} />

      {/* CTA */}
      <CTAFooter text={content.ctaText} isFr={isFr} />
    </>
  );
}

export async function RichCityContent({ page }: { page: ResolvedSeoPage }) {
  const content = await getCityContent(page.slug, page.locale);
  const isFr = page.locale === "fr";

  if (!content) {
    return (
      <section className="mt-12 text-white/45">
        <p>
          {isFr
            ? "Page ville en cours de création. Reviens bientôt."
            : "City page coming soon. Check back later."}
        </p>
      </section>
    );
  }

  return (
    <>
      <RichJsonLd page={page} content={content} />

      <section className="mt-12">
        <div className="text-lg leading-relaxed text-white/55">
          {content.intro.split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-12">
        {content.sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-serif text-3xl text-white">{s.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-white/52">
              {s.content.split("\n\n").map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <RichFAQ faq={content.faq} isFr={isFr} />
      <CTAFooter text={content.ctaText} isFr={isFr} />
    </>
  );
}
