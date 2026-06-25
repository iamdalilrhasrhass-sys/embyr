import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  "src/components/landing/EmbirLandingExperience.tsx",
  "utf8",
);
const styles = await readFile("src/styles/embir-supernova.css", "utf8");

assert.doesNotMatch(
  source,
  /(<ScrollRevealCard key=\{i\}[^>]*>\s*)\1/,
  "a landing card wrapper must not be duplicated",
);

assert.match(
  source,
  /const registerHref = locale === "en" \? "\/auth\/register" : `\/\$\{locale\}\/auth\/register`;/,
  "landing registration links must preserve the active locale",
);

assert.match(
  styles,
  /\.emb-super-title\s*\{[^}]*font-size:\s*clamp\(/s,
  "the desktop hero title must define a responsive display size",
);

console.log("LANDING STRUCTURE: PASS");
