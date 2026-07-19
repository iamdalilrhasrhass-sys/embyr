import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import EmbirLogo from "../../src/components/brand/EmbirLogo.tsx";
import { EmbirMark } from "../../src/components/brand/EmbirMark.tsx";
import geometry from "../../src/components/brand/embir-mark.json";

const migratedSources = [
  "src/app/[locale]/auth/login/page.tsx",
  "src/app/[locale]/auth/register/page.tsx",
  "src/app/[locale]/ambassadeur/page.tsx",
  "src/app/[locale]/onboarding/page.tsx",
  "src/app/[locale]/dashboard/page.tsx",
  "src/app/[locale]/faq/page.tsx",
  "src/app/[locale]/inviter/page.tsx",
  "src/app/[locale]/lausanne/page.tsx",
  "src/app/[locale]/messages/page.tsx",
  "src/app/[locale]/profiles/[id]/page.tsx",
  "src/app/referral/page.tsx",
  "src/app/u/[username]/page.tsx",
  "src/components/auth/AuthModal.tsx",
  "src/components/acquisition/discovery.css",
  "src/components/connection-os/ConnectionJourney.tsx",
  "src/components/connection-os/SignalPanel.tsx",
  "src/components/landing-2100/CompatibilityCompass.tsx",
  "src/components/landing-2100/ReciprocityInstrument.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/layout/Navbar.tsx",
  "src/components/seo-pages.tsx",
];

const retiredBrandColors =
  /#(?:06030f|0a0614|120b1f|130b0d|d4a574|e8c4a2|e3bc94|e4a187|ff5e36|ff1f5a|ffa333|ff8a5c|ff8a65|f7d1bd|f06d55|a86f50|f1d6b6|f0b083|f2d6b8|c56f4e)|rgba\((?:212,\s*165,\s*116|255,\s*94,\s*54|255,\s*31,\s*90|255,\s*163,\s*51|240,\s*109,\s*85)/i;

test("the canonical mark contains exactly two durable reciprocal paths", () => {
  assert.equal(geometry.viewBox, "0 0 96 96");
  assert.equal(geometry.strokeWidth, 5.5);
  assert.equal(geometry.paths.length, 2);
  assert.equal(new Set(geometry.paths).size, 2);
  assert.doesNotMatch(JSON.stringify(geometry), /circle|ellipse|diamond|jewel|star|head/i);
});

test("mark and logo expose one intentional accessible name", () => {
  const informativeMark = renderToStaticMarkup(
    createElement(EmbirMark, { decorative: false, title: "Embir symbol" }),
  );
  const decorativeMark = renderToStaticMarkup(
    createElement(EmbirMark, { decorative: true }),
  );
  const lockup = renderToStaticMarkup(createElement(EmbirLogo));
  const hiddenLockup = renderToStaticMarkup(
    createElement(EmbirLogo, { decorative: true }),
  );

  assert.match(informativeMark, /role="img"/);
  assert.match(informativeMark, /aria-label="Embir symbol"/);
  assert.match(decorativeMark, /aria-hidden="true"/);
  assert.equal((lockup.match(/aria-label=/g) ?? []).length, 0);
  assert.equal((lockup.match(/>Embir</g) ?? []).length, 1);
  assert.match(hiddenLockup, /^<span aria-hidden="true"/);
});

test("all logo variants, tones, sizes and optional tagline render stably", () => {
  for (const variant of ["mark", "wordmark", "lockup", "stacked"] as const) {
    assert.match(
      renderToStaticMarkup(createElement(EmbirLogo, { variant })),
      new RegExp(`embir-logo--${variant}`),
    );
  }
  for (const tone of ["light", "dark", "rose", "mono"] as const) {
    const html = renderToStaticMarkup(createElement(EmbirLogo, { tone }));
    assert.match(html, /var\(--embir-|currentColor/);
  }
  const expectedMarkSizes = { xs: 20, sm: 30, md: 40, lg: 56, xl: 72 } as const;
  for (const [size, pixels] of Object.entries(expectedMarkSizes)) {
    const html = renderToStaticMarkup(
      createElement(EmbirLogo, { variant: "mark", size: size as keyof typeof expectedMarkSizes }),
    );
    assert.match(html, new RegExp(`width="${pixels}"`));
    assert.match(html, new RegExp(`height="${pixels}"`));
  }
  assert.doesNotMatch(renderToStaticMarkup(createElement(EmbirLogo)), /embir-logo__tagline/);
  assert.match(
    renderToStaticMarkup(createElement(EmbirLogo, { tagline: "Shared intentions" })),
    />Shared intentions</,
  );
});

test("static brand rendering stays server-safe and reciprocity motion is reduced-motion aware", async () => {
  const [logo, mark, motion] = await Promise.all([
    readFile("src/components/brand/EmbirLogo.tsx", "utf8"),
    readFile("src/components/brand/EmbirMark.tsx", "utf8"),
    readFile("src/components/brand/EmbirReciprocityMotion.tsx", "utf8"),
  ]);
  assert.doesNotMatch(logo + mark, /["']use client["']|framer-motion/);
  assert.match(motion, /useReducedMotion/);
  assert.match(motion, /decorative/);
  assert.doesNotMatch(mark, /<circle|<ellipse|<filter/i);
});

test("Brand OS tokens are canonical and shared utility classes are unique", async () => {
  const [tokens, globals] = await Promise.all([
    readFile("src/styles/embir-brand-tokens.css", "utf8"),
    readFile("src/app/globals.css", "utf8"),
  ]);
  const official = new Map([
    ["embir-void-950", "#09060c"], ["embir-void-900", "#100a12"],
    ["embir-plum-900", "#2a1328"], ["embir-plum-800", "#35172f"],
    ["embir-plum-700", "#4b1f3d"], ["embir-rose-600", "#bf6f8d"],
    ["embir-rose-500", "#d88ba7"], ["embir-rose-400", "#e7a8bc"],
    ["embir-blush-300", "#f4c7d5"], ["embir-blush-200", "#f8dbe4"],
    ["embir-blush-100", "#fcebf0"], ["embir-bone-100", "#f2ede4"],
    ["embir-ivory-50", "#fff8fa"],
  ]);
  for (const [name, color] of official) {
    assert.equal(
      (tokens.match(new RegExp(`--${name}:\\s*${color}`, "gi")) ?? []).length,
      1,
      `--${name} must be declared once`,
    );
    assert.doesNotMatch(globals, new RegExp(color, "i"));
  }
  for (const utility of ["emb-card", "emb-glass", "emb-badge"]) {
    assert.equal(
      (globals.match(new RegExp(`^\\.${utility}\\s*\\{`, "gm")) ?? []).length,
      1,
      `.${utility} must have one definition`,
    );
  }
  assert.doesNotMatch(globals, /emb-diamond|@keyframes\s+embPulse/);
  await assert.rejects(readFile("src/styles/embir-tokens.css", "utf8"));
});

test("migrated product and public surfaces do not reintroduce retired brand colors", async () => {
  for (const file of migratedSources) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, retiredBrandColors, file);
    assert.doesNotMatch(source, /--e21-(?:bone|ember|coral)/, file);
  }
});

test("generated assets match their required dimensions and canonical paths", async () => {
  const required = [
    ["public/icon-192.png", 192, 192],
    ["public/icon-512.png", 512, 512],
    ["public/icon-maskable-512.png", 512, 512],
    ["public/apple-touch-icon.png", 180, 180],
    ["public/og-image.png", 1200, 630],
    ["public/brand/embir-email-logo.png", 240, 72],
  ] as const;
  for (const [file, width, height] of required) {
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.width, width, file);
    assert.equal(metadata.height, height, file);
  }

  for (const file of [
    "public/brand/embir-mark.svg",
    "public/brand/embir-app-icon.svg",
    "public/brand/embir-app-icon-light.svg",
    "public/brand/embir-app-icon-maskable.svg",
    "src/app/icon.svg",
  ]) {
    const svg = await readFile(file, "utf8");
    for (const path of geometry.paths) assert.equal(svg.split(path).length - 1, 1, file);
    assert.doesNotMatch(svg, /<circle|<ellipse|diamond|jewel|star/i);
  }
});

test("manifest, service worker, OG and email surfaces reference current assets", async () => {
  const [manifest, legacyManifest, sw, og, email] = await Promise.all([
    readFile("src/app/manifest.ts", "utf8"),
    readFile("public/manifest.json", "utf8"),
    readFile("public/sw.js", "utf8"),
    readFile("src/app/api/og/route.tsx", "utf8"),
    readFile("src/emails/templates.ts", "utf8"),
  ]);
  for (const source of [manifest, legacyManifest]) {
    assert.match(source, /icon-maskable-512\.png/);
    assert.match(source, /#09060c/);
  }
  assert.match(sw, /icon-maskable-512\.png/);
  assert.match(sw, /embir-brand-os-v1/);
  assert.match(og, /EMBIR_MARK_PATHS/);
  assert.doesNotMatch(og, />\s*E\s*</);
  assert.match(email, /https:\/\/embir\.xyz\/brand\/embir-email-logo\.png/);
  assert.match(email, /alt="Embir"/);
  assert.match(email, /Shared intentions\. Reciprocal connections\./);
  assert.match(email, /Intenciones compartidas\. Conexiones recíprocas\./);
  assert.doesNotMatch(manifest + og, /Dating Without Swipe Fatigue/);
});

function relativeLuminance(hex: string): number {
  const channels = hex.match(/[a-f\d]{2}/gi)?.map((channel) => parseInt(channel, 16) / 255) ?? [];
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(foreground: string, background: string): number {
  const high = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const low = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (high + 0.05) / (low + 0.05);
}

test("official text and CTA color pairs meet WCAG AA", () => {
  assert.ok(contrast("f2ede4", "09060c") >= 4.5);
  assert.ok(contrast("d88ba7", "09060c") >= 4.5);
  assert.ok(contrast("09060c", "f4c7d5") >= 4.5);
});
