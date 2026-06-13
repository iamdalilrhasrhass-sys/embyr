export default function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Embir",
    "url": "https://embir.xyz",
    "operatingSystem": "Web, iOS, Android",
    "applicationCategory": "DatingApplication",
    "description": "Embir is a free gay dating app for authentic connections worldwide. No ads, no paywalls, real profiles.",
    "inLanguage": ["en", "fr", "es", "de", "pt", "it", "nl", "ru", "zh", "ja", "ko", "ar", "hi", "tr", "pl", "sv", "da", "fi", "no", "th", "vi", "id", "ms", "ro", "uk"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Embir",
      "url": "https://embir.xyz"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
