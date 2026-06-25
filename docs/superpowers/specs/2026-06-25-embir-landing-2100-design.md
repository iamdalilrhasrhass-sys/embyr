# Embir Landing 2100 — Design Specification

**Date:** 2026-06-25  
**Status:** Approved direction under the user's carte blanche and `GO`  
**Scope:** First implementation slice of the global Embir redesign: public landing page, shared visual language, responsive behavior, interaction model, SEO-visible content, and reusable primitives for the rest of the site.

## 1. Objective

Replace the current card-heavy landing page with an original, premium and interactive experience that expresses Embir's real product difference: a person is shown only when compatibility works in both directions.

The page must feel like a living instrument rather than a dating-app template. It combines:

- the explanatory precision and manipulable diagrams of an interactive mathematics experience;
- disciplined editorial typography and confident negative space;
- a tactile, premium configurable object;
- a living personal-universe artifact;
- the rhythm of a broadcast/editorial content platform.

The result must remain warm, intimate, accessible and credible. It must not become cyberpunk, decorative science fiction, a phone mockup, a swipe-card clone, or a stack of glass cards.

## 2. Selected Approach

### Recommended: Progressive “living editorial instrument”

Build the page as four connected interactive chapters rendered mostly as Server Components, with small isolated Client Components for pointer, keyboard and canvas/SVG behavior.

This approach is selected because it:

- creates a distinct Embir identity without rewriting the whole application at once;
- keeps the SEO copy present in server-rendered HTML;
- avoids shipping a large WebGL framework for effects that SVG, CSS and a lightweight canvas can handle;
- produces reusable visual and interaction primitives for onboarding, dashboard and profiles;
- allows section-by-section visual verification against the concept images.

### Rejected alternatives

1. **Full WebGL cinematic site:** visually impressive but too expensive for mobile performance, accessibility and maintenance.
2. **Static editorial redesign:** faster, but it would fail the user's requirement for innovation and would not demonstrate reciprocal matching.
3. **Existing landing with improved cards:** insufficiently differentiated and structurally too close to the current result.

## 3. Visual References

These four generated concepts are the visual source of truth:

1. [Hero — Compatibility Compass](assets/embir-landing-2100/01-hero-compatibility-compass.png)
2. [Reciprocity Engine](assets/embir-landing-2100/02-reciprocity-engine.png)
3. [Personal Universe](assets/embir-landing-2100/03-personal-universe.png)
4. [Intentions, Journal and Final CTA](assets/embir-landing-2100/04-intentions-journal-cta.png)

The implementation must preserve their hierarchy, palette, typography character, open container model, density changes and signature interaction concepts. Image-generated text is illustrative; production text remains code-native.

## 4. Information Architecture

The landing becomes a seven-part page:

1. Quiet global navigation.
2. Hero with the Compatibility Compass.
3. Reciprocity Engine.
4. Personal Universe.
5. Intentions rail.
6. Journal index.
7. Final CTA, SEO continuation, FAQ and footer.

The existing markets, cities, safety, orientation and FAQ information remains available for SEO and navigation, but it is integrated into editorial rails and text bands instead of repetitive card grids.

## 5. Design System

### Palette

- `void`: `#09060C`
- `void-raised`: `#100A12`
- `bone`: `#F2EDE4`
- `bone-muted`: `rgba(242, 237, 228, 0.62)`
- `hairline`: `rgba(242, 237, 228, 0.14)`
- `ember`: `#C56F4E`
- `ember-bright`: `#F06D55`
- `copper`: `#A86F50`
- `focus`: `#FFD2B8`

Backgrounds remain near-black aubergine. No generic purple gradient, blue neon, rainbow glow or cream page background is allowed.

### Typography

- Display: existing site serif until a locally hosted production-safe high-contrast serif is selected.
- UI/body: existing sans stack.
- Technical labels: existing mono stack.

Display headings use strong editorial scale and controlled line breaks. Buttons and controls use deliberate mono/grotesk sizing; browser-default typography is prohibited.

### Container model

- Open full-width bands.
- Hairline separators.
- One visual instrument or artifact per chapter.
- No default bento grids.
- No giant rounded wrapper around every section.
- Rounded shapes are reserved for the Compatibility Compass, Personal Universe portal and actual controls.

### Motion

- Slow orbital drift for the compass and universe artifact.
- Pointer movement changes orientation by a limited amount.
- SVG paths morph or reveal when controls change.
- Journal rows reveal media edges on hover/focus.
- All motion stops or simplifies under `prefers-reduced-motion`.
- Motion must never move body text or block interaction.

## 6. Chapter Specifications

### 6.1 Navigation and Hero

Visible copy:

- Brand: `Embir`
- Navigation: `Découvrir`, `Compatibilité`, `Sécurité`, `Le journal`
- Primary navigation action: `Créer mon univers`
- H1: `Rencontrez ceux qui vous cherchent aussi.`
- Supporting line: `Embir croise orientations, intentions et affinités dans les deux sens — avant même le premier message.`
- Primary CTA: `Explorer mes compatibilités`
- Secondary CTA: `Voir comment ça fonctionne`

English receives meaning-equivalent native copy, not literal mixed-language fragments.

The compass is a code-native SVG/canvas instrument. Two trajectory families meet in a reciprocal center. Pointer and keyboard input rotate its orientation ring. Labels remain HTML for accessibility.

The first viewport must show a controlled preview of the next chapter without pushing the primary CTA below the fold on a 1440×900 viewport.

### 6.2 Reciprocity Engine

Visible copy:

- `La compatibilité n’est pas une case. C’est une réciprocité.`
- `Vous choisissez qui vous souhaitez rencontrer. Embir vérifie que cette personne souhaite aussi rencontrer quelqu’un comme vous.`
- Axes: `Orientation`, `Intention`, `Affinités`
- Result: `Compatibilité réciproque`
- Outcomes: `Vous la recherchez`, `Elle vous recherche aussi`
- CTA: `Comprendre le matching`

Three semantic range-like controls update a deterministic visualization. The demo illustrates the rule and must not claim to expose the production matching algorithm.

The visualization uses an SVG with paths generated from small pure functions. It must be keyboard-operable and announce the active state through accessible text.

### 6.3 Personal Universe

Visible copy:

- `Un profil ne devrait pas résumer une personne.`
- `Chez Embir, chacun construit un univers : ce qui l’anime, ce qu’il cherche, sa manière d’être au monde.`
- Controls: `Atmosphère`, `Intentions`, `Rythme`, `Détails`
- Demonstration profile: `Maya, 29`
- Descriptor: `Architecte sonore · Genève`
- Quote: `Je préfère une conversation qui dévie à une bio qui se récite.`
- Intentions: `Amour`, `Concerts`, `Randonnée`
- CTAs: `Entrer dans son univers`, `Personnaliser le mien`

Maya is clearly a design demonstration, not a claim that a real member is available. The portrait/artifact is a production image derived from the concept and served through `next/image`.

Tabs change a limited set of visual layers and descriptive text. Pointer drag creates a restrained parallax/orbit effect; keyboard tabs provide the complete equivalent workflow.

### 6.4 Intentions Rail

Visible copy:

- `Une même personne peut chercher plusieurs formes de lien.`
- `Choisissez aujourd’hui. Faites évoluer demain.`
- `Amour`, `Amitié`, `Casual`, `Sport`, `Sorties`, `Conversation`

This is a horizontal typographic rail, not six cards. Selecting an intention updates a short, truthful preview sentence and links to the corresponding public hub where one exists.

### 6.5 Journal

Visible copy:

- `Le journal des liens humains`
- `Dire clairement ce que l’on cherche`
- `Construire un profil qui ressemble vraiment`
- `Quand une conversation mérite de sortir de l’écran`

The index uses numbered editorial rows and restrained media crops. Existing real articles should be used when their slugs and content match. Otherwise the rows link to the blog hub until dedicated articles exist; no fake article metadata is shown.

### 6.6 Final CTA and SEO Continuation

Visible copy:

- `Votre univers commence par une intention honnête.`
- `Créer mon univers`
- `Découvrir Embir`

Below the cinematic CTA, server-rendered sections preserve required orientation, intention, city, safety and FAQ content. These sections use open lists, columns, rules and typographic indexes rather than card grids.

## 7. Responsive Design

### Desktop

- Hero uses an asymmetric 48/52 split.
- Visual instruments remain large enough to be read as product demonstrations.
- Editorial rails use horizontal interaction.

### Tablet

- Hero stacks headline above the instrument.
- Compatibility controls wrap into two rows.
- Universe information becomes a two-column composition.

### Mobile

- Navigation becomes a minimal accessible drawer.
- H1 remains the sole dominant element.
- Compass becomes a square instrument below the CTA.
- Compatibility controls become a vertical stepped control group.
- Personal Universe becomes: artifact, identity, tabs, CTA.
- Intentions rail is native horizontal scroll with snap points.
- Journal becomes numbered rows with one media crop per row.
- No horizontal overflow at 320, 360, 390 and 430 CSS pixels.

## 8. Component Architecture

The landing page remains a Server Component and composes focused chapters:

- `src/components/landing-2100/Landing2100.tsx` — server composition.
- `src/components/landing-2100/LandingNav.tsx` — responsive navigation.
- `src/components/landing-2100/HeroChapter.tsx` — server copy and structure.
- `src/components/landing-2100/CompatibilityCompass.tsx` — isolated client instrument.
- `src/components/landing-2100/ReciprocityChapter.tsx` — server chapter shell.
- `src/components/landing-2100/ReciprocityInstrument.tsx` — isolated client controls/SVG.
- `src/components/landing-2100/UniverseChapter.tsx` — server chapter shell.
- `src/components/landing-2100/UniverseArtifact.tsx` — isolated client tabs/parallax.
- `src/components/landing-2100/IntentionsRail.tsx` — isolated client rail.
- `src/components/landing-2100/JournalIndex.tsx` — server-rendered article index.
- `src/components/landing-2100/SeoContinuation.tsx` — server-rendered internal links and FAQ.
- `src/components/landing-2100/landing-copy.ts` — typed FR/EN copy.
- `src/components/landing-2100/landing-2100.css` — page-scoped tokens and presentation.
- `src/components/landing-2100/geometry.ts` — pure visualization helpers.

Client boundaries receive only small serializable props. No whole-page `"use client"` boundary is permitted.

## 9. Data and Navigation

- Locale comes from the existing `[locale]` route.
- Copy comes from a typed local dictionary in the first slice, then may migrate into the shared next-intl messages when stable.
- All public links use real existing routes or a verified replacement.
- CTA attribution is preserved through query parameters only when already supported.
- No database request is required to render the landing.
- No FOMO counter or unverified member count appears.

## 10. SEO and Truthfulness

- All meaningful copy is server rendered.
- Home metadata remains unique per locale and contains no invented keywords, reviews, ratings or user counts.
- Structured data contains only verifiable organization/software facts.
- The hero and interactive sections provide HTML headings and explanatory text independent of canvas/SVG.
- Internal links cover the six intention hubs, orientation pages, priority city pages, safety, about and blog.
- The FAQ remains visible and synchronized with `FAQPage` data where valid.

## 11. Accessibility

- Full keyboard workflow for every interactive chapter.
- Visible focus states use the `focus` token.
- SVG/canvas visuals have a text explanation and do not carry essential meaning alone.
- Controls use semantic buttons, tabs or sliders.
- Minimum body contrast meets WCAG AA.
- `prefers-reduced-motion` removes orbital/parallax movement and uses static final states.
- Touch targets are at least 44×44 CSS pixels.

## 12. Performance Budget

- No Three.js or additional 3D runtime in this slice.
- Initial client JavaScript for landing-specific interactions targets less than 70 KB gzip.
- Canvas/SVG animation pauses off-screen.
- Decorative layers use CSS transforms and opacity only.
- The Personal Universe raster asset is responsive AVIF/WebP through `next/image`.
- No autoplay video.
- Mobile Lighthouse targets: Performance ≥85, Accessibility ≥90, Best Practices ≥95, SEO ≥98.

## 13. Testing and Verification

### Automated

- Pure geometry tests for reciprocal path output and clamping.
- Copy contract tests for required FR/EN strings and prohibited claims.
- Static SEO contract: Server Component page, headings, real links, FAQ/schema agreement.
- Reduced-motion and keyboard-state component tests where supported.
- `npx tsc --noEmit`.
- `npm run lint`.
- `npm run build`.

### Browser

- Compare each chapter to its corresponding concept image.
- Verify desktop at 1536×1024 and 1440×900.
- Verify mobile at 390×844 and 320×720.
- Exercise compass, compatibility controls, universe tabs, intention rail, navigation and CTAs.
- Check console errors, layout overflow, focus order and reduced-motion behavior.

### Fidelity ledger

Before completion, record at least:

1. first-viewport hierarchy and line breaks;
2. compass size, position and material treatment;
3. reciprocity visualization geometry and control typography;
4. universe artifact framing, image integration and tab states;
5. intentions/journal rhythm and final CTA;
6. mobile collapse and absence of overflow.

## 14. Delivery Sequence

This landing redesign is the first slice of the complete site overhaul. Its tokens and primitives become the basis for:

1. registration and onboarding;
2. authenticated shell and dashboard;
3. profile universe pages;
4. matching and discovery;
5. messaging and safety;
6. public SEO templates and blog.

Security and data-integrity P0 corrections remain mandatory in parallel before any production release. The new landing must not be deployed on top of the known registration, mock-profile and deployment inconsistencies without those blockers being addressed.
