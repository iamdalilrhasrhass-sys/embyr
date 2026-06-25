import SchemaOrg from "@/components/seo/SchemaOrg";
import HeroChapter from "./HeroChapter";
import IntentionsRail from "./IntentionsRail";
import JournalIndex from "./JournalIndex";
import LandingNav from "./LandingNav";
import ReciprocityChapter from "./ReciprocityChapter";
import SeoContinuation from "./SeoContinuation";
import UniverseChapter from "./UniverseChapter";
import { landingCopy, type LandingLocale } from "./landing-copy";
import "./landing-2100.css";

interface Landing2100Props {
  locale: LandingLocale;
}

export default function Landing2100({ locale }: Landing2100Props) {
  const copy = landingCopy[locale];

  return (
    <main className="embir2100">
      <SchemaOrg />
      <LandingNav copy={copy.nav} />
      <HeroChapter copy={copy.hero} />
      <ReciprocityChapter copy={copy.reciprocity} />
      <UniverseChapter copy={copy.universe} />
      <IntentionsRail copy={copy.intentions} />
      <JournalIndex copy={copy.journal} />
      <SeoContinuation copy={copy.seo} finalCopy={copy.final} />
    </main>
  );
}
