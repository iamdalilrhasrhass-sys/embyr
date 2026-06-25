import Link from "next/link";
import type { LandingCopy } from "./landing-copy";

interface JournalIndexProps {
  copy: LandingCopy["journal"];
}

export default function JournalIndex({ copy }: JournalIndexProps) {
  return (
    <section id="journal" className="e21-chapter e21-journal">
      <div className="e21-shell">
        <h2 className="e21-journal__title">{copy.title}</h2>
        <div className="e21-journal__list">
          {copy.items.map((item, index) => (
            <Link href={item.href} className="e21-journal__row" key={item.label}>
              <span className="e21-journal__number">0{index + 1}</span>
              <h3>{item.label}</h3>
              <span className="e21-journal__media" aria-hidden="true" />
              <span className="e21-journal__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
