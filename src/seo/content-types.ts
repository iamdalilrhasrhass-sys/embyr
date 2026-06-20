export interface ComparisonSection {
  title: string;
  content: string;
  highlights?: string[];
}

export interface ComparisonTableRow {
  criteria: string;
  competitor: string;
  embir: string;
  winner: "embir" | "competitor" | "tie";
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ComparisonContent {
  slug: string;
  intro: string;
  comparisonTable: ComparisonTableRow[];
  sections: ComparisonSection[];
  verdict: string;
  ctaText: string;
  faq: FaqItem[];
}

export interface CityContent {
  slug: string;
  cityName: string;
  intro: string;
  sections: { title: string; content: string }[];
  ctaText: string;
  faq: FaqItem[];
  nearbyCities: { name: string; href: string }[];
}

export interface GuideContent {
  slug: string;
  intro: string;
  sections: { title: string; content: string; tips?: string[] }[];
  ctaText: string;
  faq: FaqItem[];
}
