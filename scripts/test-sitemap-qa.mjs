import assert from "node:assert/strict";
import { extractSitemapUrls, selectDeterministicSample } from "./qa-sitemap-100.mjs";

const xml = `<?xml version="1.0"?>
<urlset>
  <url><loc>https://embir.xyz/</loc></url>
  <url><loc>https://embir.xyz/fr</loc></url>
  <url><loc>https://embir.xyz/amour</loc></url>
  <url><loc>https://embir.xyz/fr/amour</loc></url>
</urlset>`;

assert.deepEqual(extractSitemapUrls(xml), [
  "https://embir.xyz/",
  "https://embir.xyz/fr",
  "https://embir.xyz/amour",
  "https://embir.xyz/fr/amour",
]);

assert.deepEqual(
  selectDeterministicSample(
    Array.from({ length: 10 }, (_, index) => `https://embir.xyz/${index}`),
    4,
  ),
  [
    "https://embir.xyz/0",
    "https://embir.xyz/3",
    "https://embir.xyz/6",
    "https://embir.xyz/9",
  ],
);

console.log("SITEMAP QA UNIT: PASS");
