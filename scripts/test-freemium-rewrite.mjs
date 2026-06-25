import assert from "node:assert/strict";
import { rewriteFreemiumCopy } from "./rewrite-freemium-contract.mjs";

const cases = [
  ["Embir is 100% free.", "Embir is free at launch."],
  ["Embir est 100% gratuit.", "Embir est gratuit au lancement."],
  ["L'application est 100% gratuite.", "L'application est gratuite au lancement."],
  ["Free forever", "Free at launch"],
  ["Gratuit pour toujours", "Gratuit au lancement"],
  ["Lifetime premium access", "Priority access to future premium options"],
  ["Accès premium à vie", "Avantages de lancement"],
  ["No premium tiers", "No premium paywall at launch"],
  [
    "We're not going to tell you everything will be free forever.",
    "We're not going to promise permanent universal access at no cost.",
  ],
  [
    "Why not just stay free forever?",
    "Why move to a transparent freemium model later?",
  ],
  [
    "Pourquoi ne pas rester gratuit pour toujours ?",
    "Pourquoi adopter ensuite un modèle freemium transparent ?",
  ],
];

for (const [input, expected] of cases) {
  assert.equal(rewriteFreemiumCopy(input), expected);
}

console.log("FREEMIUM REWRITE: PASS");
