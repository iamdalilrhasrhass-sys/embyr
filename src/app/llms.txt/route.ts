import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallback = `# Embir (embir.xyz)

Embir is a dating platform focused on verified profiles, reciprocal compatibility, inclusive discovery and a free-at-launch model.

Canonical site: https://embir.xyz
Sitemap: https://embir.xyz/sitemap.xml
`;

export async function GET() {
  let body = fallback;

  try {
    body = await readFile(join(process.cwd(), "public", "llms.txt"), "utf8");
  } catch {
    // Keep the AI discovery endpoint available even if the static file is absent.
  }

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
