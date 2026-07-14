import Link from "next/link";
import TrackedLink from "@/components/TrackedLink";
import type { LandingCopy } from "./landing-copy";

interface SeoContinuationProps {
  copy: LandingCopy["seo"];
  finalCopy: LandingCopy["final"];
  locale: "fr" | "en";
}

function LinkColumn({
  title,
  items,
}: {
  title: string;
  items: LandingCopy["seo"]["intentions"];
}) {
  return (
    <section className="e21-seo__column">
      <h2>{title}</h2>
      <div className="e21-seo__links">
        {items.map((item) => (
          <Link href={item.href} key={`${item.href}-${item.label}`} className="inline-flex min-h-11 min-w-11 items-center">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function SeoContinuation({
  copy,
  finalCopy,
  locale,
}: SeoContinuationProps) {
  const emphasizedTitle = finalCopy.title.replace(
    /honnête\.|honest intention\./i,
    "",
  );
  const emphasis = finalCopy.title.slice(emphasizedTitle.length);
  const registerPath = locale === "fr" ? "/fr/auth/register" : "/auth/register";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <section className="e21-final">
        <div className="e21-shell">
          <h2>
            {emphasizedTitle}
            <em>{emphasis}</em>
          </h2>
          <div className="e21-actions">
            <TrackedLink href={registerPath} label={finalCopy.primary} location="landing_final" className="e21-button e21-button--primary">
              {finalCopy.primary}
            </TrackedLink>
            <a href="#discover" className="e21-button e21-button--secondary">
              {finalCopy.secondary}
            </a>
          </div>
        </div>
      </section>

      <section id="safety" className="e21-seo">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <div className="e21-shell">
          <div className="e21-seo__grid">
            <LinkColumn title={copy.intentionsTitle} items={copy.intentions} />
            <LinkColumn title={copy.orientationsTitle} items={copy.orientations} />
            <LinkColumn title={copy.citiesTitle} items={copy.cities} />
            <LinkColumn title={copy.safetyTitle} items={copy.safety} />
          </div>
          <div className="e21-faq">
            <h2>{copy.faqTitle}</h2>
            <div>
              {copy.faq.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
