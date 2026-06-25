import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOTS = ["src", "messages"];

const forbidden = [
  { label: "free forever", pattern: /\bfree forever\b/i },
  { label: "100% free", pattern: /\b100\s*%\s*free\b/i },
  { label: "gratuit pour toujours", pattern: /\bgratuit(?:e)? pour toujours\b/i },
  { label: "100% gratuit", pattern: /\b100\s*%\s*gratuit(?:e)?\b/i },
  { label: "no paid features", pattern: /\bno paid features\b/i },
  { label: "lifetime premium", pattern: /\blifetime premium\b/i },
  { label: "unproven 10x connection claim", pattern: /10[×x]\s+(?:more connections|plus de connexions)/i },
];

const requiredHomepageCopy = [
  'hero_title_line1: "Rencontre les bonnes personnes,"',
  'hero_title_line2: "selon ton orientation et ton envie."',
  'hero_title_line1: "Meet the right people"',
  'hero_title_line2: "for your orientation and your intention."',
  "Filtrage bidirectionnel",
  "Two-way orientation matching",
];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolute)));
    } else if (/\.(?:ts|tsx|js|mjs|json)$/.test(entry.name)) {
      files.push(absolute);
    }
  }

  return files;
}

const files = (
  await Promise.all(SOURCE_ROOTS.map((directory) => listFiles(path.join(ROOT, directory))))
).flat();

const failures = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  const relative = path.relative(ROOT, file);

  for (const rule of forbidden) {
    if (rule.pattern.test(content)) {
      failures.push(`${relative}: ${rule.label}`);
    }
  }
}

const landingCopy = await readFile(path.join(ROOT, "src/lib/landing-copy.ts"), "utf8");
for (const required of requiredHomepageCopy) {
  if (!landingCopy.includes(required)) {
    failures.push(`src/lib/landing-copy.ts: missing required copy "${required}"`);
  }
}

const registerRoute = await readFile(
  path.join(ROOT, "src/app/api/auth/register/route.ts"),
  "utf8",
);
if (/2099-12-31/.test(registerRoute)) {
  failures.push("src/app/api/auth/register/route.ts: premium until 2099");
}
if (/role:\s*["']AMBASSADOR["']/.test(registerRoute)) {
  failures.push("src/app/api/auth/register/route.ts: ordinary signup creates ambassador");
}

if (failures.length > 0) {
  console.error("EMBIR CONTRACT: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`EMBIR CONTRACT: PASS (${files.length} source files checked)`);
