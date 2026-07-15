import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_INDEXNOW_URLS,
  buildIndexNowPayload,
  normalizeIndexNowUrls,
} from "../../scripts/submit-indexnow.ts";

test("IndexNow stays bounded to the two changed Lausanne campaign pages", () => {
  assert.deepEqual(DEFAULT_INDEXNOW_URLS, [
    "https://embir.xyz/fr/lausanne",
    "https://embir.xyz/lausanne",
  ]);
  assert.deepEqual(normalizeIndexNowUrls([...DEFAULT_INDEXNOW_URLS, DEFAULT_INDEXNOW_URLS[0]]), DEFAULT_INDEXNOW_URLS);
  assert.throws(() => normalizeIndexNowUrls(["https://example.com/fr/lausanne"]), /hors du domaine/);
  assert.throws(() => normalizeIndexNowUrls(["https://embir.xyz/fr/lausanne?utm_source=test"]), /sans paramètres/);
});

test("IndexNow builds the official payload without changing canonical URLs", () => {
  const key = "indexnowtestkey";
  const payload = buildIndexNowPayload(key, `${key}.txt`, DEFAULT_INDEXNOW_URLS);
  assert.equal(payload.host, "embir.xyz");
  assert.equal(payload.keyLocation, `https://embir.xyz/${key}.txt`);
  assert.deepEqual(payload.urlList, DEFAULT_INDEXNOW_URLS);
  assert.throws(() => buildIndexNowPayload(key, "wrong.txt", DEFAULT_INDEXNOW_URLS), /clé publique/);
});
