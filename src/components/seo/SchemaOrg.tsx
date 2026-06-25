export default function SchemaOrg() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Embir",
      url: "https://embir.xyz",
      inLanguage: ["en", "fr"],
      potentialAction: {
        "@type": "SearchAction",
        target: "https://embir.xyz/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Embir",
      url: "https://embir.xyz",
      logo: "https://embir.xyz/brand/embir-mark.svg",
      sameAs: ["https://embir.xyz"],
      areaServed: ["France", "Switzerland", "United Kingdom", "United States"],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Embir",
      url: "https://embir.xyz",
      operatingSystem: "Web",
      applicationCategory: "DatingApplication",
      description: "Embir is a free-at-launch international dating platform for France, Switzerland, the UK, and the United States. Built for every orientation with reciprocal compatibility, personal universes, and safety tools.",
      inLanguage: ["en", "fr"],
      areaServed: [
        { "@type": "Country", name: "France" },
        { "@type": "Country", name: "Switzerland" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United States" },
      ],
      audience: {
        "@type": "Audience",
        audienceType: "Adults 18+ looking for dating across all orientations",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Free at launch. Future freemium model.",
      },
      author: {
        "@type": "Organization",
        name: "Embir",
        url: "https://embir.xyz",
      },
      browserRequirements: "Works on modern versions of Chrome, Safari, Firefox, and Edge.",
      permissions: "Location (optional), Camera (optional, for profile verification)",
      featureList: "https://embir.xyz/us/free-dating-app",
      screenshot: "https://embir.xyz/og-image.png",
      releaseNotes: "https://embir.xyz/about",
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
