import Link from "next/link";
import CompatibilityCompass from "./CompatibilityCompass";
import type { LandingCopy } from "./landing-copy";

interface HeroChapterProps {
  copy: LandingCopy["hero"];
  locale: "fr" | "en";
}

export default function HeroChapter({ copy, locale }: HeroChapterProps) {
  const discoveryHref = locale === "fr" ? "/fr/decouvrir" : "/decouvrir";

  return (
    <section id="discover" className="e21-hero">
      <div className="e21-shell e21-hero__grid">
        <div className="e21-hero__copy">
          <h1>{copy.title}</h1>
          <p className="e21-hero__body">{copy.body}</p>
          <div className="e21-actions">
            <Link href={discoveryHref} className="e21-button e21-button--primary">
              {copy.primary}
            </Link>
            <a href="#compatibility" className="e21-button e21-button--secondary">
              {copy.secondary}
            </a>
          </div>
        </div>
        <div className="e21-hero__visual">
          <CompatibilityCompass labels={copy.labels} help={copy.orientationHelp} />
        </div>
      </div>
    </section>
  );
}
