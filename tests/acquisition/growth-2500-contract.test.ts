import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  GROWTH_CAMPAIGN_LINKS,
  GROWTH_STAGE_TARGETS,
  GROWTH_TARGET_TOTAL,
  GROWTH_ZONE_TARGETS,
  buildGrowthCampaignUrl,
  dailyPaceNeeded,
  growthProgress,
} from "../../src/lib/growth-targets.ts";

test("the 2,500 objective preserves local density and explicit quality stages", () => {
  assert.equal(GROWTH_TARGET_TOTAL, 2_500);
  assert.equal(GROWTH_ZONE_TARGETS.reduce((total, zone) => total + zone.target, 0), 2_500);
  assert.deepEqual(
    GROWTH_ZONE_TARGETS.map((zone) => [zone.key, zone.target]),
    [["lausanne", 750], ["riviera", 500], ["geneva", 750], ["other_romandie", 500]],
  );
  assert.equal(GROWTH_STAGE_TARGETS.find((stage) => stage.key === "qualifiedInTargetZones")?.target, 2_500);
  assert.equal(GROWTH_STAGE_TARGETS.find((stage) => stage.key === "reciprocalConnections")?.target, 300);
  assert.equal(growthProgress(1_250, 2_500), 50);
  assert.equal(dailyPaceNeeded(0, 2_500, 180), 13.9);
});

test("campaign links follow one privacy-safe UTM convention", () => {
  for (const campaign of GROWTH_CAMPAIGN_LINKS) {
    const url = new URL(buildGrowthCampaignUrl(campaign));
    assert.equal(url.origin, "https://embir.xyz");
    assert.equal(url.pathname, "/fr/lausanne");
    assert.equal(url.searchParams.get("utm_source"), campaign.source);
    assert.equal(url.searchParams.get("utm_medium"), campaign.medium);
    assert.equal(url.searchParams.get("utm_campaign"), campaign.campaign);
    assert.equal(url.searchParams.has("email"), false);
    assert.equal(url.searchParams.has("referralCode"), false);
  }
});

test("the Lausanne landing is local, honest, measured and conversion-ready", async () => {
  const source = await readFile("src/app/[locale]/lausanne/page.tsx", "utf8");
  assert.match(source, /Moins de profils à faire défiler/);
  assert.match(source, /Nous n’affichons ni faux compteur, ni faux profil/);
  assert.match(source, /utm_campaign=lausanne_launch_2500/);
  assert.match(source, /PageTypeTracker type="city" city="Lausanne" country="CH"/);
  assert.match(source, /TrackedLink/);
  assert.match(source, /FAQPage/);
  assert.match(source, /Sans carte bancaire/);
  assert.doesNotMatch(source, /déjà des milliers|garanti|100 % de vrais profils/i);
});

test("growth reporting excludes demos, deleted accounts, staff and banned accounts", async () => {
  const [growth, admin, aggregate, migration] = await Promise.all([
    readFile("src/lib/growth-metrics.ts", "utf8"),
    readFile("src/lib/admin-metrics.ts", "utf8"),
    readFile("src/lib/aggregate-reports.ts", "utf8"),
    readFile("prisma/migrations/20260715000000_growth_2500_truth/migration.sql", "utf8"),
  ]);
  for (const source of [growth, admin, aggregate]) {
    assert.match(source, /profileSource/);
    assert.match(source, /user_registration/);
    assert.match(source, /deletedAt/);
    assert.match(source, /bannedAt/);
    assert.match(source, /isAdultConfirmed/);
  }
  assert.match(growth, /qualifiedInTargetZones/);
  assert.match(growth, /activationQualified/);
  assert.match(growth, /emailVerified/);
  assert.match(growth, /consentSensitiveData/);
  assert.match(growth, /consent\.type = 'cgu'/);
  assert.match(growth, /consent\.type = 'privacy'/);
  assert.match(growth, /AcquisitionEvent/);
  assert.match(growth, /primaryIntent/);
  assert.match(growth, /seekingGenders/);
  assert.match(growth, /LOWER\(TRIM\(duplicate\.email\)\)/);
  assert.match(growth, /NOT LIKE '%embir-qa%'/);
  assert.match(growth, /NOT LIKE '%@test\.%'/);
  assert.match(growth, /NOT LIKE '%\.local'/);
  assert.match(growth, /example\\\.\(com\|org\|net\|invalid\)/);
  assert.match(migration, /demo_vitrine/);
  assert.match(migration, /"visibilityStatus" = 'HIDDEN'/);
  assert.match(migration, /NOT EXISTS[\s\S]*"User"/);
});

test("public discovery never serves legacy showcase profiles", async () => {
  const files = [
    "src/lib/matching.ts",
    "src/app/[locale]/u/[username]/page.tsx",
    "src/app/u/[username]/page.tsx",
    "src/app/[locale]/universe-of-the-day/page.tsx",
    "src/app/api/discovery-preview/route.ts",
    "src/app/api/public-profile/route.ts",
    "src/app/api/profiles/[id]/route.ts",
    "src/app/api/match/action/route.ts",
    "src/app/api/compatibility/route.ts",
    "src/app/api/views/route.ts",
    "src/app/api/favorites/route.ts",
    "src/app/api/favorites/[userId]/route.ts",
  ];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.match(source, /profileSource:\s*"user_registration"/, file);
  }
});

test("growth measurement separates operational API telemetry from user-journey quality", async () => {
  const [growth, commandCenter] = await Promise.all([
    readFile("src/lib/growth-metrics.ts", "utf8"),
    readFile("src/components/admin/GrowthCommandCenter.tsx", "utf8"),
  ]);

  assert.match(growth, /measurement_events AS/);
  assert.match(growth, /WHERE "eventName" <> 'api_request'/);
  assert.match(growth, /"excludedOperationalEvents"/);
  assert.match(growth, /MAX\("occurredAt"\) FROM measurement_events/);
  assert.match(commandCenter, /Événements techniques séparés/);
  assert.match(commandCenter, /requêtes API techniques sont suivies séparément/);
});
