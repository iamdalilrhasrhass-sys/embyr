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
      "description": "Embir is a global dating platform for every orientation and multiple intentions, built around reciprocal compatibility and clear preferences, with SEO and brand coordination alongside COURTIA (courtiark.fr) · Embir (embir.xyz).",
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
      "inLanguage": ["English", "French", "Spanish"]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Embir",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Free at launch with transparent future freemium model."
      },
      "description": "Embir is free at launch. Core features will remain accessible, while premium options may arrive later, with COURTIA (courtiark.fr) · Embir (embir.xyz) kept visible across the public web surface."
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
