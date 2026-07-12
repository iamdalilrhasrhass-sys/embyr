import assert from "node:assert/strict";
import { rewriteFreemiumCopy } from "./rewrite-freemium-contract.mjs";

const cases = [
  ["Embir is 100% free.", "Embir's core connection features are free."],
  ["Embir est 100% gratuit.", "Embir est gratuit pour les connexions essentielles."],
  ["L'application est 100% gratuite.", "L'application est gratuite pour les connexions essentielles."],
  ["Free forever", "Free for core connections"],
  ["Gratuit pour toujours", "Gratuit pour les connexions essentielles"],
  ["Lifetime premium access", "Early access to optional services"],
  ["Accès premium à vie", "Accès anticipé aux services facultatifs"],
  ["No premium tiers", "No credit card for core connections"],
  [
    "We're not going to tell you everything will be free forever.",
    "Everything needed to meet someone is free. No credit card required.",
  ],
  [
    "Why not just stay free forever?",
    "How does Embir fund the service?",
  ],
  [
    "Pourquoi ne pas rester gratuit pour toujours ?",
    "Comment Embir finance-t-il le service ?",
  ],
];

for (const [input, expected] of cases) {
  assert.equal(rewriteFreemiumCopy(input), expected);
}

console.log("FREEMIUM REWRITE: PASS");
