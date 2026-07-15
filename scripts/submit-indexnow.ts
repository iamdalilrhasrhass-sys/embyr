#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HOST = "embir.xyz";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const DEFAULT_INDEXNOW_URLS = [
  `${ORIGIN}/fr/lausanne`,
  `${ORIGIN}/lausanne`,
] as const;

type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

export function normalizeIndexNowUrls(values: readonly string[]): string[] {
  const urls = values.map((value) => {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== HOST || url.port || url.username || url.password) {
      throw new Error(`IndexNow refuse une URL hors du domaine ${HOST}.`);
    }
    if (url.search || url.hash) {
      throw new Error("IndexNow exige ici des URL canoniques sans paramètres ni fragment.");
    }
    url.pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return url.toString();
  });
  return [...new Set(urls)];
}

export function buildIndexNowPayload(key: string, keyFileName: string, values: readonly string[]): IndexNowPayload {
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(key) || path.basename(keyFileName, ".txt") !== key) {
    throw new Error("La clé publique IndexNow locale est invalide.");
  }
  const urlList = normalizeIndexNowUrls(values);
  if (urlList.length === 0 || urlList.length > 10_000) {
    throw new Error("La liste IndexNow doit contenir entre 1 et 10 000 URL.");
  }
  return {
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${keyFileName}`,
    urlList,
  };
}

async function discoverPublicKey(): Promise<{ key: string; fileName: string }> {
  const publicDirectory = path.join(ROOT, "public");
  const files = (await readdir(publicDirectory)).filter((name) => name.endsWith(".txt")).sort();
  for (const fileName of files) {
    const key = (await readFile(path.join(publicDirectory, fileName), "utf8")).trim();
    if (/^[A-Za-z0-9_-]{8,128}$/.test(key) && path.basename(fileName, ".txt") === key) {
      return { key, fileName };
    }
  }
  throw new Error("Aucun fichier de clé publique IndexNow valide n’a été trouvé.");
}

function attribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match?.[1];
}

async function assertIndexableCanonical(url: string): Promise<void> {
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "Embir-IndexNow-Validator/1.0" },
  });
  if (response.status !== 200) {
    throw new Error(`La validation SEO a échoué pour ${url} (HTTP ${response.status}).`);
  }
  const html = await response.text();
  const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  const canonical = canonicalTag ? attribute(canonicalTag, "href") : undefined;
  if (!canonical || new URL(canonical, url).toString() !== url) {
    throw new Error(`La canonique de ${url} n’est pas auto-référente.`);
  }
  const robotsTag = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i)?.[0];
  const robots = robotsTag ? attribute(robotsTag, "content")?.toLowerCase() : undefined;
  if (robots?.includes("noindex")) {
    throw new Error(`La page ${url} est marquée noindex.`);
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const requestedUrls = process.argv.slice(2).filter((value) => value !== "--dry-run");
  const urls = normalizeIndexNowUrls(requestedUrls.length ? requestedUrls : DEFAULT_INDEXNOW_URLS);
  const { key, fileName } = await discoverPublicKey();
  const payload = buildIndexNowPayload(key, fileName, urls);

  const keyResponse = await fetch(payload.keyLocation, { redirect: "manual" });
  if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== key) {
    throw new Error("La clé publique IndexNow n’est pas accessible sur le domaine de production.");
  }
  await Promise.all(payload.urlList.map(assertIndexableCanonical));

  if (dryRun) {
    console.log(`IndexNow validation OK — ${payload.urlList.length} URL, aucune soumission.`);
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow a refusé la soumission (HTTP ${response.status}).`);
  }
  console.log(`IndexNow accepté — ${payload.urlList.length} URL (HTTP ${response.status}).`);
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Échec IndexNow inconnu.");
    process.exitCode = 1;
  });
}
