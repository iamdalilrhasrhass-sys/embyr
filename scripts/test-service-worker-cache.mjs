import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("public/sw.js", "utf8");
const registrationSource = await readFile("src/components/ServiceWorkerRegister.tsx", "utf8");

assert.match(source, /CACHE_NAME\s*=\s*['"]embir-brand-os-v1['"]/);
assert.match(source, /\/icon-maskable-512\.png/, "the maskable Brand OS icon must be precached");
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
assert.match(
  registrationSource,
  /updateViaCache:\s*['"]none['"]/,
  "registration must bypass the browser HTTP cache",
);
assert.match(source, /_next\/static/, "versioned Next.js assets should remain cacheable");
assert.match(
  source,
  /request\.mode\s*===\s*['"]navigate['"][\s\S]*?event\.respondWith\(fetch\(request\)\)[\s\S]*?return;/,
  "navigation handling must return before runtime caching",
);

console.log("SERVICE WORKER CACHE: PASS");
