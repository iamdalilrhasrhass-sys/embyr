import Image from "next/image";
import UniverseArtifact from "./UniverseArtifact";
import type { LandingCopy } from "./landing-copy";

interface UniverseChapterProps {
  copy: LandingCopy["universe"];
}

export default function UniverseChapter({ copy }: UniverseChapterProps) {
  return (
    <section id="universe" className="e21-chapter e21-universe">
      <div className="e21-shell">
        <UniverseArtifact
          copy={copy}
          image={
            <Image
              src="/images/landing-2100/maya-universe.webp"
              width={1122}
              height={1402}
              sizes="(max-width: 760px) 92vw, (max-width: 1100px) 52vw, 38vw"
              alt={copy.demoNotice}
              className="e21-universe__image"
            />
          }
        />
      </div>
    </section>
  );
}
