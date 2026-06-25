import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("public/sw.js", "utf8");

assert.match(source, /CACHE_NAME\s*=\s*['"]embir-v2['"]/);
assert.doesNotMatch(
  source,
  /STATIC_ASSETS\s*=\s*\[[\s\S]*?['"]\/['"]/,
  "the homepage must not be permanently precached",
);
assert.match(
  source,
  /request\.mode\s*===\s*['"]navigate['"][\s\S]*?fetch\(request\)/,
  "navigation requests must use the network before cached HTML",
);

console.log("SERVICE WORKER CACHE: PASS");
