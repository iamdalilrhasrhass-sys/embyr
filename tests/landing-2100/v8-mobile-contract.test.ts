import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("V8 landing uses an airy five-section mobile-first composition", async () => {
  const [composition, css] = await Promise.all([
    readFile("src/components/landing-2100/Landing2100.tsx", "utf8"),
    readFile("src/components/landing-2100/landing-2100.css", "utf8"),
  ]);

  assert.doesNotMatch(composition, /JournalIndex/);
  assert.match(css, /\.e21-chapter\s*\{[\s\S]*padding-block:\s*clamp\(6rem,\s*14vw,\s*12rem\)/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.e21-chapter\s*\{[\s\S]*min-height:\s*100svh/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.e21-hero\s*\{[\s\S]*height:\s*100svh/);
});

test("V8 landing adds invitation motion while respecting reduced motion", async () => {
  const css = await readFile("src/components/landing-2100/landing-2100.css", "utf8");

  assert.match(css, /@keyframes\s+e21-invite/);
  assert.match(css, /\.e21-button--primary\s*\{[\s\S]*animation:\s*e21-invite/);
  assert.match(css, /@keyframes\s+e21-reveal/);
  assert.match(css, /animation-timeline:\s*view\(\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*animation:\s*none/);
});

test("mobile intentions become readable touch chips instead of an overloaded rail", async () => {
  const css = await readFile("src/components/landing-2100/landing-2100.css", "utf8");

  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.e21-intentions__rail\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*\.e21-intentions__item\s*\{[\s\S]*font-size:\s*clamp\(1\.05rem,\s*5vw,\s*1\.35rem\)/);
});
