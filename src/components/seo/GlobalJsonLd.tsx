export default function GlobalJsonLd() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Embir",
      "url": "https://embir.xyz",
      "logo": "https://embir.xyz/brand/embir-mark.svg",
      "sameAs": [
        "https://x.com/embir_xyz",
        "https://www.instagram.com/embir.xyz",
        "https://www.tiktok.com/@embir.xyz"
      ],
      "description": "Embir is an international dating platform focused on verified profiles, deep compatibility, and a safer community for every orientation — free at launch with a transparent freemium model.",
      "foundingDate": "2026",
      "areaServed": ["France", "United Kingdom", "United States", "Switzerland"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@embir.xyz",
        "availableLanguage": ["English", "French"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Embir",
      "url": "https://embir.xyz",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://embir.xyz/decouvrir?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Embir",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free at launch with transparent future freemium model."
      },
      "description": "Embir is a free-at-launch dating app for every orientation. Verified profiles, deep compatibility matching, human moderation and a safer community experience.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1"
      }
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
