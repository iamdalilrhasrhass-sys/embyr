# Embir v7 Consolidation — Design Specification

**Date:** 2026-06-26  
**Status:** Approved for autonomous execution  
**Scope:** Consolidate the live Landing 2100, visitor conversion funnel, programmatic SEO cluster, and launch content without regressing the P0 security work already deployed.

## 1. Current State

The original v7 mega-prompt no longer describes production accurately:

- Landing 2100 is live on `embir.xyz`.
- Production runs `main` at `dbfa8e4` with build ID `U92EW0Ac2mGxGtihTJ44D`.
- The reciprocal compass already supports pointer capture, touch dragging, inertia, keyboard input, and reduced motion.
- P0 contracts for authentication, consent, real profiles, mutual matching, and upload policy pass on `main`.
- `/fr/decouvrir` exists, but it is not a safe acquisition funnel: it fetches identifiable profile fields, uses English-only interface text, and attempts authenticated favorite actions for anonymous visitors.
- The public sitemap exposes approximately 2,626 URLs, including 504 highly templated locale × intent × city routes.
- Existing programmatic pages contain claims that are not consistently supportable, including universal verification, no paid features, and permanently free access.

The mission is therefore a consolidation and quality-control pass, not a greenfield implementation.

## 2. Approaches Considered

### A. Reapply the mega-prompt literally

Create new acquisition components, another SEO data model, and 20–130 new routes.

**Rejected:** it would duplicate live routes, overwrite newer security work, and increase scaled-content risk.

### B. Leave production unchanged and deliver only an audit

Document the mismatches but avoid code changes.

**Rejected:** it would preserve a weak anonymous funnel and unsupported public claims.

### C. Consolidate the live system in place

Keep Landing 2100 and the P0 fixes, replace the anonymous discovery flow, qualify the existing programmatic cluster, and refresh launch content.

**Selected:** it produces measurable value with the smallest safe production change.

## 3. Product Decisions

### 3.1 Truthfulness

- No demonstration or fabricated profile may appear in visitor discovery.
- Preview cards derive only from real, public, non-deleted database profiles.
- Preview payloads never expose name, username, profile ID, description, exact activity, verification status, premium status, or media URL.
- If no matching profiles exist, the page displays an honest early-community state.
- A database failure is not represented as an empty community; it displays a temporary-unavailability state.
- No member count or “online now” count is added.

### 3.2 Conversion path

The public path becomes:

`Landing or SEO CTA → /[locale]/decouvrir → 3-step intent form → anonymized real previews or honest empty state → /[locale]/auth/register with preserved intent and city`

The landing keeps its approved visual hierarchy. Its primary hero action changes destination from direct registration to discovery. The secondary action remains an explanation anchor.

SEO intent × city pages send their primary CTA to discovery with `intent` and `city` presets. Registration remains the final gate, not the first interaction.

### 3.3 Discovery inputs

The form requests only information needed for the preview:

- identity group: man, woman, or another identity;
- sought group: men, women, or open;
- intention: love, friendship, fun, casual, sport, or events;
- city: optional free-text value with a bounded length.

The visitor input is not persisted before consent and registration.

## 4. Architecture

### 4.1 Shared acquisition model

Create `src/lib/discovery-preview.ts` with:

- query normalization;
- intent mapping;
- safe city normalization;
- deterministic anonymous visual seed generation;
- a public preview type containing only `ageBand`, `cityLabel`, `intentLabel`, and `visualSeed`;
- a Prisma selection builder limited to public profiles whose users are not banned or deleted.

The route `src/app/api/discovery-preview/route.ts` validates query parameters, fetches at most six records, and maps records to the safe public type.

### 4.2 Visitor page

`src/app/[locale]/decouvrir/page.tsx` becomes a thin server page with localized metadata and `noindex, follow`.

`src/components/acquisition/DiscoveryExperience.tsx` owns:

- form state;
- URL preset hydration;
- loading, results, empty, and unavailable states;
- registration URL construction;
- accessible status announcements.

The preview cards use generated CSS geometry from `visualSeed`; they do not receive member images.

### 4.3 Landing and SEO integration

- `HeroChapter` links to localized discovery.
- Personal-universe CTAs remain registration-oriented because that section demonstrates profile creation.
- Programmatic intent × city primary CTA links to discovery with presets.
- Programmatic page links preserve locale.

### 4.4 Touch interaction

The compass already satisfies the touch requirement and must not be rewritten.

The Personal Universe object still ignores touch. It receives a bounded pointer-capture drag interaction with:

- a pure tilt helper;
- touch and mouse parity;
- vertical-scroll protection limited to the active object;
- pointer cancel cleanup;
- reduced-motion static behavior.

## 5. SEO Quality Policy

Google’s scaled-content policy targets large quantities of unoriginal pages created primarily to manipulate rankings. It does not prescribe a magic word count or a universal rollout size. The current June 2026 spam update also makes uncontrolled expansion inappropriate.

The existing 504 intent × city routes remain accessible, but indexation becomes an explicit quality decision.

### 5.1 Qualified pilot

Only French pages for these twelve cities are indexable in this pass:

`paris`, `lyon`, `marseille`, `toulouse`, `bordeaux`, `lille`, `nantes`, `nice`, `strasbourg`, `montpellier`, `rennes`, `grenoble`.

With six intentions, the qualified cluster contains 72 pages.

### 5.2 Non-qualified routes

- remain HTTP 200 and self-canonical;
- receive `robots: noindex, follow`;
- are absent from the sitemap;
- are not linked from the qualified cluster;
- are not pre-rendered through `generateStaticParams`.

This avoids destructive route deletion while reducing indexable low-value surface.

### 5.3 Content requirements

Qualified pages receive:

- a unique city context paragraph from curated data;
- intention-specific positioning and FAQ;
- truthful launch wording;
- no claims that every profile is verified;
- no claim that all functionality is permanently free;
- no invented local-community activity;
- internal links only to other qualified routes and established editorial pages.

The policy lives in `src/seo/programmatic-policy.ts` and is shared by metadata, static params, links, sitemap generation, and tests.

## 6. Social Launch Kit

Refresh the existing social material into one canonical folder:

`docs/acquisition/launch-2026-06/`

It contains:

- one French founder post;
- one English founder post;
- two community-first Reddit variants;
- one LGBTQ+ community variant;
- one Show HN post;
- one Product Hunt listing and founder comment;
- one French forum variant;
- a manual-posting checklist with UTM naming.

Claims must match production. The material may say “early stage” and “building city by city”; it may not claim zero users, verified profiles for everyone, permanent free access, or guaranteed acquisition results.

No external post is published automatically.

## 7. Testing

### Automated contracts

- discovery input normalization and safe output shape;
- API source contract forbidding identifying fields and fabricated data;
- localized visitor funnel copy and state coverage;
- registration URL preservation;
- Personal Universe pointer/touch source contract and pure tilt tests;
- SEO policy count, sitemap inclusion, non-qualified noindex, and prohibited-claim scan;
- existing Landing, security, and UI tests remain green.

### Browser verification

Verify:

- landing at 390×844 and 320×720;
- compass touch drag;
- Personal Universe touch drag;
- FR and EN discovery form;
- result, empty, and unavailable states through controlled API responses;
- no horizontal overflow;
- registration URL preserves selected data;
- representative qualified and non-qualified SEO pages expose the expected robots metadata.

### Production verification

After a successful build and safe fast-forward deployment:

- `200` for home, discovery, qualified SEO page, non-qualified SEO page, sitemap, and preview API;
- sitemap contains exactly 72 intent × city pilot URLs;
- qualified page has no `noindex`;
- non-qualified page has `noindex, follow`;
- discovery HTML contains no real member name;
- PM2 `embyr-web` remains online.

## 8. Delivery and Safety

- Work executes on `feat/v7-consolidation`, based on current `origin/main`.
- No secret value is written to Git or Obsidian.
- The untracked VPS file `.reddit_env` is preserved.
- No database migration is required.
- Deployment uses a fast-forward update only after tests, lint, build, and browser QA pass.
- Obsidian receives the initial-state note, phase evidence, and final action report before completion is claimed.

