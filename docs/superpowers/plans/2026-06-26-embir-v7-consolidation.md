# Embir v7 Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the live Landing 2100 and existing SEO corpus into a truthful mobile acquisition funnel backed only by real anonymized profiles, while reducing the indexable programmatic surface to a qualified French pilot.

**Architecture:** Add a pure discovery-preview domain module shared by a minimal public API and a localized client experience. Keep the approved landing composition, route its primary CTA through discovery, and centralize programmatic SEO eligibility in one policy consumed by static params, metadata, links, and sitemap generation. Extend only the remaining touch gap in the Personal Universe artifact.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Prisma 7.8, next-intl routing conventions, Node test runner, Puppeteer, CSS/SVG.

---

## File Structure

### Create

- `src/lib/discovery-preview.ts` — input normalization, safe preview mapping, public types.
- `src/app/api/discovery-preview/route.ts` — real-profile preview API.
- `src/components/acquisition/DiscoveryExperience.tsx` — localized form and preview states.
- `src/components/acquisition/discovery-copy.ts` — locked FR/EN copy.
- `src/components/acquisition/discovery.css` — scoped mobile-first presentation.
- `src/components/landing-2100/universe-tilt.ts` — pure bounded pointer-to-tilt helper.
- `src/seo/programmatic-policy.ts` — qualified cities and indexation rules.
- `tests/acquisition/discovery-preview.test.ts` — domain behavior.
- `tests/acquisition/source-contract.test.ts` — API/UI privacy and truthfulness.
- `tests/landing-2100/universe-tilt.test.ts` — touch geometry.
- `tests/seo/programmatic-policy.test.ts` — pilot and sitemap contracts.
- `scripts/qa-v7-consolidation.mjs` — end-to-end browser checks.
- `docs/acquisition/launch-2026-06/*.md` — canonical launch posts and checklist.

### Modify

- `src/app/[locale]/decouvrir/page.tsx` — server shell, metadata and localized client.
- `src/components/landing-2100/HeroChapter.tsx` — localized discovery destination.
- `src/components/landing-2100/Landing2100.tsx` — provide locale to hero.
- `src/components/landing-2100/UniverseArtifact.tsx` — touch pointer capture.
- `src/components/landing-2100/landing-2100.css` — active touch behavior.
- `src/app/[locale]/rencontre/[slug]/[city]/page.tsx` — policy, truthful copy and funnel CTA.
- `src/seo/seo-cities.ts` — curated local context for qualified cities.
- `src/app/sitemap.ts` — include only qualified intent × city URLs.
- `package.json` — acquisition, SEO policy, and QA commands.

## Task 1: Lock the acquisition and SEO contracts

**Files:**

- Create: `tests/acquisition/discovery-preview.test.ts`
- Create: `tests/acquisition/source-contract.test.ts`
- Create: `tests/seo/programmatic-policy.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing discovery domain tests**

Test the wished-for API:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDiscoveryQuery,
  toPublicPreview,
} from "../../src/lib/discovery-preview.ts";

test("normalizes bounded visitor input", () => {
  assert.deepEqual(
    normalizeDiscoveryQuery({
      gender: " HOMME ",
      seeking: "femme",
      intent: "amour",
      city: "  Paris  ",
    }),
    { gender: "homme", seeking: "femme", intent: "AMOUR", city: "Paris" },
  );
});

test("maps a real profile to a non-identifying preview", () => {
  const preview = toPublicPreview({
    id: "profile-secret",
    age: 29,
    city: "Paris",
    intentions: ["AMOUR"],
  });
  assert.deepEqual(Object.keys(preview).sort(), [
    "ageBand", "cityLabel", "intentLabel", "visualSeed",
  ]);
  assert.doesNotMatch(JSON.stringify(preview), /profile-secret/);
});
```

- [ ] **Step 2: Write the failing source/privacy contract**

Assert:

- the API does not import mock data;
- its Prisma `select` excludes names, username, description, media, verification, premium, and activity;
- the visitor page contains explicit results, empty, and unavailable states;
- the page is localized;
- no anonymous favorite or like request exists.

- [ ] **Step 3: Write the failing SEO policy tests**

Assert:

```ts
assert.equal(INDEXABLE_PROGRAMMATIC_CITIES.length, 12);
assert.equal(qualifiedProgrammaticParams().length, 72);
assert.equal(isProgrammaticIndexable("fr", "amour", "paris"), true);
assert.equal(isProgrammaticIndexable("en", "amour", "paris"), false);
assert.equal(isProgrammaticIndexable("fr", "amour", "chicago"), false);
```

Read `src/app/sitemap.ts` and require `qualifiedProgrammaticParams`. Read the route template and require `robots` metadata driven by `isProgrammaticIndexable`.

- [ ] **Step 4: Add test scripts**

Add:

```json
"test:acquisition": "node --experimental-strip-types --test tests/acquisition/*.test.ts",
"test:seo-policy": "node --experimental-strip-types --test tests/seo/programmatic-policy.test.ts",
"qa:v7": "node scripts/qa-v7-consolidation.mjs"
```

- [ ] **Step 5: Run RED**

```bash
npm run test:acquisition
npm run test:seo-policy
```

Expected: fail because the new modules and integration do not exist.

- [ ] **Step 6: Commit the red contracts**

```bash
git add package.json tests/acquisition tests/seo/programmatic-policy.test.ts
git commit -m "test: define Embir v7 acquisition and SEO contracts"
```

## Task 2: Implement safe real-profile previews

**Files:**

- Create: `src/lib/discovery-preview.ts`
- Create: `src/app/api/discovery-preview/route.ts`

- [ ] **Step 1: Implement pure normalization**

Support only:

```ts
type DiscoveryGender = "homme" | "femme" | "autre";
type DiscoverySeeking = "homme" | "femme" | "tout";
type DiscoveryIntent =
  | "AMOUR"
  | "AMIS"
  | "FUN"
  | "PLAN_CUL"
  | "SPORT"
  | "EVENEMENTS";
```

Trim city whitespace, collapse repeated whitespace, remove control characters, and cap it at 80 characters.

- [ ] **Step 2: Implement irreversible preview mapping**

Return:

```ts
export interface PublicDiscoveryPreview {
  ageBand: "18–24" | "25–34" | "35–44" | "45–54" | "55+";
  cityLabel: string;
  intentLabel: string;
  visualSeed: number;
}
```

Derive `visualSeed` through a one-way SHA-256 hash and return only a bounded integer. Never return the source ID.

- [ ] **Step 3: Implement the API route**

Query at most six profiles with:

- `publicVisibility: true`;
- associated user `deletedAt: null` and `bannedAt: null`;
- optional city case-insensitive match;
- optional intention membership;
- selected fields limited to `id`, `age`, `city`, and `intentions`.

Return:

```ts
{ status: "results", previews: PublicDiscoveryPreview[] }
{ status: "empty", previews: [] }
```

On database failure return HTTP 503:

```ts
{ status: "unavailable", previews: [] }
```

- [ ] **Step 4: Run GREEN**

```bash
npm run test:acquisition
npm run test:security
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/discovery-preview.ts src/app/api/discovery-preview tests/acquisition
git commit -m "feat: add privacy-safe discovery previews"
```

## Task 3: Build the localized visitor funnel

**Files:**

- Create: `src/components/acquisition/discovery-copy.ts`
- Create: `src/components/acquisition/DiscoveryExperience.tsx`
- Create: `src/components/acquisition/discovery.css`
- Modify: `src/app/[locale]/decouvrir/page.tsx`
- Modify: `src/components/landing-2100/HeroChapter.tsx`
- Modify: `src/components/landing-2100/Landing2100.tsx`

- [ ] **Step 1: Extend the source contract**

Require:

- FR heading `Découvrez des profils compatibles, sans vous inscrire d’abord.`;
- EN heading `Explore compatible profiles before you sign up.`;
- disclosure that previews are anonymized and come from real published profiles;
- no profile names;
- primary hero CTA uses `/${locale === "fr" ? "fr/" : ""}decouvrir`;
- `/decouvrir` metadata uses `robots: { index: false, follow: true }`.

- [ ] **Step 2: Run RED**

```bash
npm run test:acquisition
```

- [ ] **Step 3: Implement copy and form**

Use semantic fieldsets and native buttons. Submit only after identity, seeking, and intent are selected. Keep city optional.

- [ ] **Step 4: Implement states**

- loading: skeleton cards and `aria-live`;
- results: six locked anonymous cards;
- empty: `Embir se construit ville par ville. Soyez parmi les premiers.`;
- unavailable: retry action with no implication that the community is empty.

The results CTA builds:

```text
/fr/auth/register?gender=homme&seeking=femme&intent=AMOUR&city=Paris
```

or the non-prefixed English equivalent.

- [ ] **Step 5: Preserve Landing 2100**

Change only the primary hero destination. Do not add form controls above the fold.

- [ ] **Step 6: Run GREEN**

```bash
npm run test:acquisition
npm run test:landing
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/decouvrir src/components/acquisition src/components/landing-2100
git commit -m "feat: route visitors through honest discovery funnel"
```

## Task 4: Close the remaining touch gap

**Files:**

- Create: `src/components/landing-2100/universe-tilt.ts`
- Create: `tests/landing-2100/universe-tilt.test.ts`
- Modify: `src/components/landing-2100/UniverseArtifact.tsx`
- Modify: `src/components/landing-2100/landing-2100.css`

- [ ] **Step 1: Write failing pure tests**

```ts
test("maps pointer delta to bounded tilt", () => {
  assert.deepEqual(tiltFromPointerDelta(500, -500), { x: 12, y: 12 });
  assert.deepEqual(tiltFromPointerDelta(-500, 500), { x: -12, y: -12 });
});
```

Source contract requires `setPointerCapture`, `releasePointerCapture`, `onPointerCancel`, and no `pointerType === "touch"` early return.

- [ ] **Step 2: Run RED**

```bash
node --experimental-strip-types --test tests/landing-2100/universe-tilt.test.ts
npm run test:landing
```

- [ ] **Step 3: Implement pointer capture**

Only apply tilt after pointer down. Store the starting coordinates and reset on up/cancel. Use `touch-action: pan-y` while idle and `touch-action: none` during active drag through a data attribute.

- [ ] **Step 4: Run GREEN**

```bash
npm run test:landing
```

- [ ] **Step 5: Commit**

```bash
git add src/components/landing-2100 tests/landing-2100
git commit -m "fix: add touch drag to personal universe"
```

## Task 5: Qualify the existing programmatic SEO cluster

**Files:**

- Create: `src/seo/programmatic-policy.ts`
- Modify: `src/seo/seo-cities.ts`
- Modify: `src/app/[locale]/rencontre/[slug]/[city]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/seo/programmatic-policy.test.ts`

- [ ] **Step 1: Implement the shared policy**

Export:

```ts
export const INDEXABLE_PROGRAMMATIC_CITIES = [
  "paris", "lyon", "marseille", "toulouse", "bordeaux", "lille",
  "nantes", "nice", "strasbourg", "montpellier", "rennes", "grenoble",
] as const;

export function isProgrammaticIndexable(
  locale: string,
  intent: string,
  city: string,
): boolean;

export function qualifiedProgrammaticParams(): Array<{
  locale: "fr";
  slug: string;
  city: string;
}>;
```

- [ ] **Step 2: Add curated city context**

Add `contextFr` for the twelve qualified cities. Each sentence must describe a real local characteristic without claiming member activity.

- [ ] **Step 3: Replace unsupported claims**

Remove from the template:

- `Profils verifies`;
- `100% gratuit, sans pub, sans abonnement`;
- selfie verification guarantees;
- unlimited likes or all-feature claims;
- statements that a local community already exists.

Use truthful launch language:

- free profile creation during launch;
- optional verified badge where available;
- reciprocal preference concept;
- city-by-city growth.

- [ ] **Step 4: Apply robots policy**

Qualified:

```ts
robots: { index: true, follow: true }
```

Non-qualified:

```ts
robots: { index: false, follow: true }
```

Generate static params only for the 72 qualified routes.

- [ ] **Step 5: Restrict links and sitemap**

Use only qualified cities in nearby-city links. Build sitemap dynamic entries solely from `qualifiedProgrammaticParams()`.

- [ ] **Step 6: Point the primary CTA to discovery**

Example:

```text
/fr/decouvrir?intent=AMOUR&city=Paris
```

- [ ] **Step 7: Run GREEN**

```bash
npm run test:seo-policy
npm run lint
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add src/seo src/app/sitemap.ts src/app/[locale]/rencontre/[slug]/[city]/page.tsx tests/seo
git commit -m "fix: qualify programmatic SEO indexation"
```

## Task 6: Refresh the manual launch kit

**Files:**

- Create: `docs/acquisition/launch-2026-06/01-founder-fr.md`
- Create: `docs/acquisition/launch-2026-06/02-founder-en.md`
- Create: `docs/acquisition/launch-2026-06/03-reddit-dating.md`
- Create: `docs/acquisition/launch-2026-06/04-reddit-datingapps.md`
- Create: `docs/acquisition/launch-2026-06/05-reddit-lgbtq.md`
- Create: `docs/acquisition/launch-2026-06/06-show-hn.md`
- Create: `docs/acquisition/launch-2026-06/07-product-hunt.md`
- Create: `docs/acquisition/launch-2026-06/08-forums-fr.md`
- Create: `docs/acquisition/launch-2026-06/POSTING-CHECKLIST.md`

- [ ] **Step 1: Write current, truthful copy**

Every post states that Embir is early stage and that matching is based on declared preferences and reciprocal relevance. No post promises a user count, guaranteed verification, permanent free access, or acquisition outcome.

- [ ] **Step 2: Add UTM checklist**

Use:

```text
utm_source=<platform>
utm_medium=community
utm_campaign=launch_2026_06
utm_content=<post_slug>
```

- [ ] **Step 3: Scan prohibited claims**

```bash
rg -ni "zero users|0 user|100% free|free forever|every profile|all profiles|guaranteed|200-500" docs/acquisition/launch-2026-06
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add docs/acquisition/launch-2026-06
git commit -m "docs: refresh Embir launch kit"
```

## Task 7: Browser QA, build, production deployment, and evidence

**Files:**

- Create: `scripts/qa-v7-consolidation.mjs`
- Modify: `package.json`
- Create: `docs/superpowers/evidence/v7-consolidation/qa-report.json`

- [ ] **Step 1: Implement browser QA**

Test FR and EN at desktop and mobile. On mobile:

- drag the compass with touch pointer events;
- drag the universe artifact;
- complete the discovery form;
- verify the request URL;
- intercept preview API for results, empty, and unavailable states;
- verify no horizontal overflow.

Check representative SEO pages:

- `/fr/rencontre/amour/paris` has no `noindex`;
- `/fr/rencontre/amour/chicago` has `noindex`;
- both respond 200.

- [ ] **Step 2: Run the complete local verification**

```bash
npm run test:landing
npm run test:security
node --experimental-strip-types --test tests/ui/*.test.ts
npm run test:acquisition
npm run test:seo-policy
npm run lint
npx tsc --noEmit
npm run build
```

- [ ] **Step 3: Run browser QA**

Start:

```bash
npm run start -- -p 3200
```

Then:

```bash
LANDING_BASE_URL=http://127.0.0.1:3200 npm run qa:v7
```

- [ ] **Step 4: Review the diff**

```bash
git diff --check origin/main...HEAD
git status --short
```

- [ ] **Step 5: Push and fast-forward main**

```bash
git push -u origin feat/v7-consolidation
git push origin HEAD:main
```

- [ ] **Step 6: Deploy safely**

On VPS:

```bash
cd /root/embyr
git status --short
git pull --ff-only origin main
npm install
npm run build
pm2 restart embyr-web --update-env
```

The untracked `.reddit_env` must remain untouched.

- [ ] **Step 7: Verify production**

Check HTTP, robots metadata, sitemap pilot count, API privacy, and PM2 status. Record the new `.next/BUILD_ID`.

- [ ] **Step 8: Write Obsidian evidence**

Create:

- `30_EMBYR/2026-06-26_PHASE1_MOBILE_DONE.md`
- `30_EMBYR/2026-06-26_PHASE2_SEO_DONE.md`
- `30_EMBYR/2026-06-26_PHASE3_SOCIAL_DONE.md`
- `30_EMBYR/2026-06-26_CODEX_V7_FINAL.md`

- [ ] **Step 9: Final commit if evidence scripts changed**

```bash
git add scripts package.json docs/superpowers/evidence
git commit -m "test: verify Embir v7 consolidation"
git push origin HEAD:main
```

