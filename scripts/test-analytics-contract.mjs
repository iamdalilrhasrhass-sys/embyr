import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const analytics = await readFile("src/lib/analytics.ts", "utf8");
const landing = await readFile(
  "src/components/landing/EmbirLandingExperience.tsx",
  "utf8",
);
const register = await readFile(
  "src/app/[locale]/auth/register/page.tsx",
  "utf8",
);
const trackedLink = await readFile("src/components/TrackedLink.tsx", "utf8");

for (const eventName of [
  "page_view",
  "hero_cta_click",
  "register_view",
  "register_start",
  "register_success",
  "register_error",
  "seo_page_cta_click",
  "blog_cta_click",
]) {
  assert.match(
    analytics,
    new RegExp(`['"]${eventName}['"]`),
    `analytics must declare and emit ${eventName}`,
  );
}

assert.match(
  landing,
  /trackHeroCTAClick/,
  "the landing hero must emit hero_cta_click",
);
for (const tracker of [
  "trackRegisterView",
  "trackRegisterStart",
  "trackRegisterSuccess",
  "trackRegisterError",
]) {
  assert.match(
    register,
    new RegExp(`\\b${tracker}\\b`),
    `the register funnel must use ${tracker}`,
  );
}
assert.match(
  trackedLink,
  /seo_page_cta_click|blog_cta_click/,
  "tracked links must support distinct SEO and blog CTA events",
);

console.log("ANALYTICS CONTRACT: PASS");
