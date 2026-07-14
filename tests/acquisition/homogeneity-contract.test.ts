import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { parseAnalyticsEnvelope } from "../../src/lib/analytics-events.ts";

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(location);
    return /\.(?:ts|tsx|json)$/.test(entry.name) ? [location] : [];
  }));
  return nested.flat();
}

test("landing CTAs preserve locale and emit first-party CTA events", async () => {
  const [nav, hero, universe, final] = await Promise.all([
    readFile("src/components/landing-2100/LandingNav.tsx", "utf8"),
    readFile("src/components/landing-2100/HeroChapter.tsx", "utf8"),
    readFile("src/components/landing-2100/UniverseArtifact.tsx", "utf8"),
    readFile("src/components/landing-2100/SeoContinuation.tsx", "utf8"),
  ]);
  const source = `${nav}\n${hero}\n${universe}\n${final}`;
  assert.match(source, /TrackedLink/);
  assert.match(source, /\/fr\/auth\/register/);
  assert.doesNotMatch(source, /href="\/auth\/register"/);
});

test("registration is localized end to end and sends locale plus attribution", async () => {
  const [page, route, footer] = await Promise.all([
    readFile("src/app/[locale]/auth/register/page.tsx", "utf8"),
    readFile("src/app/api/auth/register/route.ts", "utf8"),
    readFile("src/components/layout/Footer.tsx", "utf8"),
  ]);
  assert.match(page, /Create my universe/);
  assert.match(page, /Créer mon univers/);
  assert.match(page, /localePath\(locale, "\/onboarding"\)/);
  assert.match(page, /readAnalyticsAttribution/);
  for (const field of ["locale", "source", "medium", "campaign"]) {
    assert.match(page, new RegExp(`\\b${field}\\b`));
  }
  assert.match(route, /code: validation\.code/);
  assert.match(footer, /getLocale/);
  assert.match(footer, /localePath\(locale, href\)/);
});

test("public copy excludes unsupported absolute performance and safety claims", async () => {
  const files = await sourceFiles("src/app");
  const combined = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  for (const pattern of [
    /3x plus de matchs/i,
    /no ads, no tracking/i,
    /élimine radicalement les faux profils/i,
    /the only truly free option/i,
    /la seule grande application/i,
  ]) {
    assert.doesNotMatch(combined, pattern);
  }
});

test("referral and ambassador events are accepted without personal properties", () => {
  for (const envelope of [
    { event: "referral_link_copied", properties: {} },
    { event: "referral_share_clicked", properties: { channel: "whatsapp" } },
    { event: "ambassador_application_started", properties: {} },
    { event: "ambassador_application_submitted", properties: {} },
  ]) {
    assert.equal(parseAnalyticsEnvelope(envelope).ok, true);
  }
  assert.equal(
    parseAnalyticsEnvelope({ event: "ambassador_application_submitted", properties: { email: "private@example.com" } }).ok,
    false,
  );
});

test("ambassador application is real, bounded and never buys matching visibility", async () => {
  const [page, route] = await Promise.all([
    readFile("src/app/[locale]/ambassadeur/page.tsx", "utf8"),
    readFile("src/app/api/ambassadors/apply/route.ts", "utf8"),
  ]);
  assert.match(page, /fetch\("\/api\/ambassadors\/apply"/);
  assert.match(page, /no discovery placement or compatibility advantage/i);
  assert.doesNotMatch(page, /appears first in search|better visibility|priority verification/i);
  assert.match(route, /consumePublicForm/);
  assert.match(route, /MAX_BODY_BYTES/);
  assert.match(route, /consentImage: body\.consentImage === true/);
  assert.match(route, /priorityScore: 0/);
});
