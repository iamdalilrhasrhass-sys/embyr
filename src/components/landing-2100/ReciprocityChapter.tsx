import ReciprocityInstrument from "./ReciprocityInstrument";
import type { LandingCopy } from "./landing-copy";

interface ReciprocityChapterProps {
  copy: LandingCopy["reciprocity"];
}

export default function ReciprocityChapter({ copy }: ReciprocityChapterProps) {
  return (
    <section id="compatibility" className="e21-chapter">
      <div className="e21-shell e21-reciprocity__layout">
        <div>
          <h2 className="e21-chapter__title">{copy.title}</h2>
          <p className="e21-chapter__body">{copy.body}</p>
          <a className="e21-chapter__link" href="#safety">
            {copy.cta}
          </a>
        </div>
        <ReciprocityInstrument copy={copy} />
      </div>
    </section>
  );
}
