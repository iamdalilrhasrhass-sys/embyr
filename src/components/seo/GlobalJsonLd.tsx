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
      "description": "Embir is a dating platform with reciprocal preferences, an optional selfie badge, reporting, blocking, and free core connections.",
      "foundingDate": "2026",
      "areaServed": "Worldwide",
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
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "core connection features are free with a transparent optional-services model."
      },
      "description": "Embir is a web dating app with free core connections, reciprocal preferences, an optional selfie badge, reporting, and blocking."
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
