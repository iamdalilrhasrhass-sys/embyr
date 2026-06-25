import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOTS = ["src", "messages"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".json"]);

function preserveInitialCase(source, replacement) {
  if (/^[A-ZÀ-ÖØ-Þ]/.test(source)) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

export function rewriteFreemiumCopy(input) {
  let output = input
    .replace(
      /We're not going to tell you everything will be free forever\./gi,
      "We're not going to promise permanent universal access at no cost.",
    )
    .replace(
      /Why not just stay free forever\?/gi,
      "Why move to a transparent freemium model later?",
    )
    .replace(
      /Pourquoi ne pas rester gratuit pour toujours\s*\?/gi,
      "Pourquoi adopter ensuite un modèle freemium transparent ?",
    )
    .replace(
      /100\s*%\s*free during (?:our |the )?launch/gi,
      (match) => preserveInitialCase(match, "free at launch"),
    )
    .replace(
      /100\s*%\s*gratuit(?:e)? au lancement/gi,
      (match) =>
        preserveInitialCase(
          match,
          /gratuite/i.test(match) ? "gratuite au lancement" : "gratuit au lancement",
        ),
    )
    .replace(
      /lifetime premium access/gi,
      (match) =>
        preserveInitialCase(match, "priority access to future premium options"),
    )
    .replace(
      /acc[eè]s premium [aà] vie/gi,
      (match) => preserveInitialCase(match, "avantages de lancement"),
    )
    .replace(
      /premium [aà] vie/gi,
      (match) => preserveInitialCase(match, "avantages de lancement"),
    )
    .replace(
      /lifetime premium/gi,
      (match) => preserveInitialCase(match, "launch benefits"),
    )
    .replace(
      /no premium tiers/gi,
      (match) => preserveInitialCase(match, "no premium paywall at launch"),
    )
    .replace(
      /no paid features/gi,
      (match) => preserveInitialCase(match, "no paid features at launch"),
    )
    .replace(
      /gratis para siempre/gi,
      (match) => preserveInitialCase(match, "gratis en el lanzamiento"),
    )
    .replace(
      /premium de por vida/gi,
      (match) => preserveInitialCase(match, "ventajas de lanzamiento"),
    )
    .replace(
      /100\s*%\s*free/gi,
      (match) => preserveInitialCase(match, "free at launch"),
    )
    .replace(
      /100\s*%\s*gratuite/gi,
      (match) => preserveInitialCase(match, "gratuite au lancement"),
    )
    .replace(
      /100\s*%\s*gratuit/gi,
      (match) => preserveInitialCase(match, "gratuit au lancement"),
    )
    .replace(
      /free forever/gi,
      (match) => preserveInitialCase(match, "free at launch"),
    )
    .replace(
      /gratuite? pour toujours/gi,
      (match) =>
        preserveInitialCase(
          match,
          /gratuite/i.test(match) ? "gratuite au lancement" : "gratuit au lancement",
        ),
    );

  return output;
}

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolute)));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(absolute);
    }
  }
  return files;
}

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const files = (
    await Promise.all(ROOTS.map((root) => listFiles(path.resolve(root))))
  ).flat();
  const changed = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const rewritten = rewriteFreemiumCopy(source);
    if (rewritten === source) continue;
    changed.push(path.relative(process.cwd(), file));
    if (shouldWrite) await writeFile(file, rewritten);
  }

  console.log(JSON.stringify({
    mode: shouldWrite ? "write" : "dry-run",
    checkedFiles: files.length,
    changedFiles: changed.length,
    files: changed,
  }, null, 2));
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await main();
}
