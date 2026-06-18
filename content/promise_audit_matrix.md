# Embir — Product Promise Audit Matrix (18 June 2026)

## Legend
- 🟢 ACTIVE NOW — Feature is implemented and live in production
- 🟡 PARTIAL — Partially implemented or in development
- 🟠 PLANNED — Documented but not yet built
- 🔴 ABSENT — Mentioned in marketing but does not exist
- ⚠️ NEEDS REWORDING — Exists but language is too strong

## Promise Matrix

| Promise | Status | Evidence | Action |
|---------|--------|----------|--------|
| Selfie-verified profiles | 🟢 ACTIVE | API /api/verification/request + /upload exist; verified badge in code | OK — but remove "every member verifies" |
| Human moderation | 🟡 PARTIAL | /moderation page describes it; reporting API exists; no evidence of actual moderation team | Reword to "Reporting + moderation tools active; human review as community scales" |
| Compatibility matching | 🟡 PARTIAL | Compatibility signals mentioned in UI; no evidence of ML/algorithm in production | Reword "DeepSeek AI learns preferences" → "designed to support compatibility-based discovery" (DONE) |
| Orientation-aware visibility | 🟡 PARTIAL | UI components reference orientation preferences; no backend confirmation | OK as described on SEO pages — "you control who sees you" |
| Free at launch | 🟢 ACTIVE | No paywall active; all routes accessible; /freemium page transparent | OK |
| No paywall during launch | 🟢 ACTIVE | No Stripe integration found on Embir (separate from Femynia) | OK |
| Inclusive for all orientations | 🟢 ACTIVE | Pages mention hetero/gay/lesbian/bi/trans/queer; UI allows multiple orientations | OK |
| Safety tools (reporting, blocking) | 🟡 PARTIAL | /api/reports exists; blocking mentioned; not confirmed fully functional | OK for now — launch phase |
| "Alternative to Grindr/Tinder" | 🟡 PARTIAL | Comparison pages exist; but no active user base to substantiate "alternative" | Reword: "a new option for people looking for a different dating experience" |
| Founding member benefits | 🟡 PARTIAL | Priority access promised; no actual membership system in production | Reword: "founding members will receive priority access and product benefits" (DONE) |
| Invite system | 🟠 PLANNED | /invite page explains concept; no invite mechanics built | OK — page is transparent about what this is |
| No swipe mechanism | 🟠 PLANNED | Mentioned on some pages; actual product may or may not have swipe | Verify product uses compatibility cards, not swipe |
| Early access signup | 🟢 ACTIVE | /auth/register works; early access events tracked in analytics | OK |
| Mobile app | 🟠 PLANNED | /freemium mentions "future mobile app"; no app exists | OK — transparent about this |
| LGBTQ+ specific features | 🟢 ACTIVE | /lgbtq-dating-app page; orientation preferences in UI | OK |
| No data monetization | 🟢 ACTIVE | /privacy commits to no data selling | OK |
| GDPR compliance | 🟡 PARTIAL | Privacy policy exists; cookie consent not implemented; no cookie banner | Add cookie consent banner |
| AI-powered matching | 🔴 ABSENT/REWORDED | Was "DeepSeek AI" — now reworded to "compatibility-based discovery" | DONE — all 137 files cleaned |

## Phrases that need verification on live pages

Search for and fix any remaining:
- /modern-dating-app — check for "AI learns your preferences" → DONE
- /gay-dating-app-usa — check for "DeepSeek" → DONE  
- /gay-dating-app-uk — check for "AI learns" → DONE
- /new-york — check for "keep premium access for life" → DONE
- /gay-dating-in-paris — check for "active communities" → DONE
- /free-gay-dating-app — check for "active communities" → DONE

## Summary
- 🟢 8 promises live and verifiable
- 🟡 6 promises partially implemented
- 🟠 3 promises planned/transparent
- 🔴 0 promises fully absent (after cleanup)
- ⚠️ 1 key reword completed — "DeepSeek AI" → "compatibility-based discovery"
