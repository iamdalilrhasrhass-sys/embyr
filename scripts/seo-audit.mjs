#!/usr/bin/env node

import fs from "node:fs";

const BASE_URL = process.env.EMBIR_BASE_URL || "https://embir.xyz";
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const SAMPLE_FILE = process.env.EMBIR_SEO_SAMPLE_FILE || "/tmp/embir_100_urls.txt";

const thresholds = {
  totalUrls: 500,
  franceUrls: 80,
  usaUrls: 30,
  ukUrls: 30,
  switzerlandUrls: 10,
  blogUrls: 150,
  guideUrls: 120,
  comparisonUrls: 40,
  hreflangLinks: 80,
};

const homepageRequired = [
  "Free Inclusive Dating App for Every Orientation",
  "France",
  "Switzerland",
  "UK",
  "United States",
  "Free at launch",
  "freemium",
  "orientation",
  "preferences",
  "compatibility",
  "verified profiles",
  "Join the founding community",
];

const homepageForbidden = [
  "Gay Dating App",
  "designed for Paris",
  "Grindr vs Embir",
  "Ready to meet real guys",
  "real guys",
  "Where glances ignite",
  "new dating app for men",
];

const coreUrls = [
  BASE_URL,
  `${BASE_URL}/us/free-dating-app`,
  `${BASE_URL}/uk/free-dating-app`,
  `${BASE_URL}/switzerland`,
  `${BASE_URL}/switzerland/zurich`,
  `${BASE_URL}/fr/suisse`,
  `${BASE_URL}/fr/suisse/geneve`,
  `${BASE_URL}/fr/gratuit-au-lancement`,
  `${BASE_URL}/fr/application-rencontre-gratuite`,
  `${BASE_URL}/fr/alternative-tinder`,
  `${BASE_URL}/fr/alternative-grindr`,
  `${BASE_URL}/fr/rencontre-lgbt`,
  `${BASE_URL}/fr/profils-verifies`,
  `${BASE_URL}/comparison/grindr-vs-embir`,
  `${BASE_URL}/blog/how-to-write-a-good-dating-profile`,
];

async function get(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "embir-seo-audit/1.0",
      },
    });

    const text = await response.text();
    return {
      url,
      finalUrl: response.url,
      status: response.status,
      text,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function withAuditBase(url) {
  const parsed = new URL(url);
  const base = new URL(BASE_URL);
  parsed.protocol = base.protocol;
  parsed.host = base.host;
  return parsed.toString().replace(/\/$/, "");
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => withAuditBase(match[1]));
}

function unique(items) {
  return [...new Set(items)];
}

function getMeta(html, name) {
  const pattern = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  return html.match(pattern)?.[1]?.trim() || "";
}

function getTitle(html) {
  return html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || "";
}

function canonicalPresent(html) {
  return /rel=["']canonical["']/i.test(html);
}

function noindexPresent(html) {
  return /\bnoindex\b/i.test(html);
}

function ctaPresent(html) {
  return /\/auth\/register|Join the founding community|Create my free profile|Rejoindre/i.test(html);
}

function faqPresent(html) {
  return /FAQPage|FAQ|Frequently asked questions|Quick answers|Questions frequentes|Questions/i.test(html);
}

function internalLinksPresent(html) {
  const rootLinks = (html.match(/href=["']\/(fr|en|auth|blog|guide|guides|comparison|comparaison|rencontre|us|uk)/g) || [])
    .length;
  const absoluteLinks = (html.match(/href=["']https:\/\/embir\.xyz\//g) || []).length;
  return rootLinks + absoluteLinks >= 3;
}

function isSeoPage(url) {
  return /\/(fr\/|us\/|uk\/|blog\/|guides?\/|comparison\/|comparaison\/|dating\/|rencontre\/)/.test(
    new URL(url).pathname,
  );
}

function readSampleUrls(locs) {
  if (fs.existsSync(SAMPLE_FILE)) {
    return fs
      .readFileSync(SAMPLE_FILE, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return locs
    .filter((url) => isSeoPage(url))
    .slice(0, 100);
}

function countDuplicateValues(values) {
  const seen = new Map();
  for (const value of values.filter(Boolean)) {
    seen.set(value, (seen.get(value) || 0) + 1);
  }

  return [...seen.values()].filter((count) => count > 1).reduce((sum, count) => sum + count, 0);
}

function summarizeSitemap(locs, xml) {
  const paths = locs.map((url) => new URL(url).pathname);

  return {
    totalUrls: locs.length,
    franceUrls: paths.filter((path) => path.startsWith("/fr/")).length,
    usaUrls: paths.filter((path) => path.startsWith("/us/") || path === "/us").length,
    ukUrls: paths.filter((path) => path.startsWith("/uk/") || path === "/uk").length,
    switzerlandUrls: paths.filter((path) => path.startsWith("/switzerland") || path.startsWith("/fr/suisse")).length,
    blogUrls: paths.filter((path) => path.includes("/blog/")).length,
    guideUrls: paths.filter((path) => path.includes("/guide")).length,
    comparisonUrls: paths.filter((path) => path.includes("/comparison/") || path.includes("/comparaison/")).length,
    hreflangLinks: (xml.match(/hreflang|xhtml:link/g) || []).length,
  };
}

async function main() {
  const sitemapResponse = await get(SITEMAP_URL);
  if (sitemapResponse.status !== 200) {
    throw new Error(`Sitemap HTTP status is ${sitemapResponse.status}, expected 200.`);
  }

  const locs = parseSitemap(sitemapResponse.text);
  const sitemap = summarizeSitemap(locs, sitemapResponse.text);
  const thresholdFailures = Object.entries(thresholds)
    .filter(([key, min]) => sitemap[key] < min)
    .map(([key, min]) => `${key}: ${sitemap[key]} < ${min}`);

  const sampleUrls = unique([...coreUrls, ...readSampleUrls(locs)]).slice(0, 140);
  const pages = [];

  for (const url of sampleUrls) {
    const response = await get(url);
    const title = getTitle(response.text);
    const description = getMeta(response.text, "description");
    pages.push({
      url,
      status: response.status,
      title,
      description,
      canonical: canonicalPresent(response.text),
      noindex: noindexPresent(response.text),
      cta: ctaPresent(response.text),
      faq: faqPresent(response.text),
      internalLinks: internalLinksPresent(response.text),
    });
  }

  const seoPages = pages.filter((page) => isSeoPage(page.url));
  const homepage = pages.find((page) => page.url === BASE_URL);
  const homepageHtml = (await get(BASE_URL)).text;
  const homepageMissingRequired = homepageRequired.filter((text) => !homepageHtml.includes(text));
  const homepageForbiddenFound = homepageForbidden.filter((text) => homepageHtml.includes(text));

  const result = {
    baseUrl: BASE_URL,
    sitemapUrl: SITEMAP_URL,
    sampledPages: pages.length,
    sitemap,
    thresholds,
    titleMissingUrls: pages.filter((page) => !page.title).map((p) => p.url),
    descriptionMissingUrls: pages.filter((page) => !page.description).map((p) => p.url),
    duplicateTitles: countDuplicateValues(pages.map((page) => page.title)),
    duplicateDescriptions: countDuplicateValues(pages.map((page) => page.description)),
    canonicalMissingUrls: pages.filter((page) => !page.canonical).map((p) => p.url),
    pagesWithoutCtaUrls: seoPages.filter((page) => !page.cta).map((p) => p.url),
    pagesWithoutFaqUrls: seoPages.filter((page) => !page.faq).map((p) => p.url),
    pagesWithoutInternalLinksUrls: seoPages.filter((page) => !page.internalLinks).map((p) => p.url),
    noindexAccidentalUrls: seoPages.filter((page) => page.noindex).map((p) => p.url),
    homepageMissingRequired,
    homepageForbiddenFound,
    badStatusPages: pages.filter((page) => page.status !== 200).map((page) => `${page.status} ${page.url}`),
    homepageStatus: homepage?.status || null,
  };

  const failures = [
    ...thresholdFailures,
    ...result.badStatusPages,
    ...homepageMissingRequired.map((text) => `homepage missing required text: ${text}`),
    ...homepageForbiddenFound.map((text) => `homepage forbidden text found: ${text}`),
  ];

  if (result.titleMissingUrls.length > 0) failures.push(`titleMissing: ${result.titleMissingUrls.join(', ')}`);
  if (result.descriptionMissingUrls.length > 0) failures.push(`descriptionMissing: ${result.descriptionMissingUrls.join(', ')}`);
  if (result.canonicalMissingUrls.length > 0) failures.push(`canonicalMissing: ${result.canonicalMissingUrls.join(', ')}`);
  if (result.pagesWithoutCtaUrls.length > 0) failures.push(`pagesWithoutCta: ${result.pagesWithoutCtaUrls.join(', ')}`);
  if (result.pagesWithoutFaqUrls.length > 0) failures.push(`pagesWithoutFaq: ${result.pagesWithoutFaqUrls.join(', ')}`);
  if (result.pagesWithoutInternalLinksUrls.length > 0) failures.push(`pagesWithoutInternalLinks: ${result.pagesWithoutInternalLinksUrls.join(', ')}`);
  if (result.noindexAccidentalUrls.length > 0) failures.push(`noindexAccidental: ${result.noindexAccidentalUrls.join(', ')}`);

  console.log(JSON.stringify(result, null, 2));

  if (failures.length > 0) {
    console.error("SEO audit failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("SEO audit passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
