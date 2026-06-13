# CHANGELOG — Embir SEO Overhaul

## 2026-06-13 — Session "Surpasser"

### Phase 1: Brand Unification
- Replaced all "Embir"/"Ember" → "Embir" in 27 files
- Renamed `components/embyr/` → `components/embir/`
- Renamed 8 component files (Embir* → Embir*)
- Zero remaining occurrences verified
- Commit: `ac6fba9`

### Phase 2: Technical SEO
- Added hreflang tags for 25 languages (`alternates.languages`)
- Regenerated dynamic sitemap.ts (30 blog articles, 20 cities, 25 locales)
- Added Schema.org JSON-LD (WebApplication type)
- Optimized meta title: "Embir — Gay Dating App for Authentic Connections | Free & Safe"
- Updated OG/Twitter cards for global audience
- Static sitemap.xml regenerated with 402+ URLs
- IndexNow key file deployed and verified
- Commit: `8970e24`

### Phase 3: Content Strategy
- Created blog category architecture: safety/, culture/, dating-tips/, city-guides/
- Wrote 12 new articles (23,582 words total):
  - 6 dating-tips articles
  - 2 safety articles
  - 3 culture articles
  - 1 city-guide article
- Updated blog index: 30 articles organized by category
- Created reusable BlogArticle component with markdown rendering
- Updated sitemap with 12 new article URLs
- Commit: `[pending]`

### Previous Session (June 14)
- 18 blog slugs FR → EN
- 402 URLs in sitemap
- Google Search Console: embir.xyz verified
- README.md updated with SEO backlinks
- Dev.to + Reddit accounts created (pending posting)
- Commit: `023f0f8`, `42be4dc`

### Stats
| Metric | Before | After |
|--------|--------|-------|
| Blog articles | 18 (FR slugs) | 30 (EN slugs) |
| Sitemap URLs | ~374 | 500+ |
| hreflang tags | None | 25 languages |
| Schema.org | None | WebApplication |
| "Embir" occurrences | 32+ files | 0 |
| Total words blog | ~10k | ~33k |
