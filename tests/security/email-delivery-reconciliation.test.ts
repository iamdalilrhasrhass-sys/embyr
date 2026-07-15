import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeProviderEmailEvent,
  providerEventBlocksFutureDelivery,
  providerEventConfirmsDelivery,
} from "../../src/lib/email-delivery-reconciliation.ts";

test("provider delivery events are allowlisted and normalized", () => {
  assert.equal(normalizeProviderEmailEvent(" DELIVERED "), "delivered");
  assert.equal(normalizeProviderEmailEvent("BOUNCED"), "bounced");
  assert.equal(normalizeProviderEmailEvent("unexpected"), null);
  assert.equal(normalizeProviderEmailEvent({}), null);
});

test("only final provider failures block future delivery", () => {
  assert.equal(providerEventBlocksFutureDelivery("bounced"), true);
  assert.equal(providerEventBlocksFutureDelivery("complained"), true);
  assert.equal(providerEventBlocksFutureDelivery("failed"), true);
  assert.equal(providerEventBlocksFutureDelivery("delivery_delayed"), false);
  assert.equal(providerEventBlocksFutureDelivery("delivered"), false);
});

test("delivery, open, and click prove mailbox delivery", () => {
  assert.equal(providerEventConfirmsDelivery("delivered"), true);
  assert.equal(providerEventConfirmsDelivery("opened"), true);
  assert.equal(providerEventConfirmsDelivery("clicked"), true);
  assert.equal(providerEventConfirmsDelivery("sent"), false);
  assert.equal(providerEventConfirmsDelivery("bounced"), false);
});
