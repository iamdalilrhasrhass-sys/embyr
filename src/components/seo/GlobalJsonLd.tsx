export default function GlobalJsonLd() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Embir",
      "url": "https://embir.xyz",
      "logo": "https://embir.xyz/logo.png",
      "sameAs": [
        "https://x.com/embir_xyz",
        "https://www.instagram.com/embir.xyz",
        "https://www.tiktok.com/@embir.xyz"
      ],
      "description": "Embir is an international dating platform focused on personal universes, verified profiles, and deep compatibility."
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
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
