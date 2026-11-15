import test from "node:test";
import assert from "node:assert/strict";
import { assertPaise, discountPricePaise, activeDiscountBps, quoteCart, formatINR } from "./pricing.mjs";
test("integer paise validation", () => {
  assert.equal(assertPaise(1099), 1099);
  for (const value of [-1, 1.5, NaN, Infinity, "100"]) assert.throws(() => assertPaise(value));
});
test("discount uses basis points and rounds to nearest paise", () => {
  assert.equal(discountPricePaise(99900, 1000), 89910);
  assert.equal(discountPricePaise(101, 5000), 51);
  assert.equal(discountPricePaise(123, 0), 123);
  assert.equal(discountPricePaise(123, 10000), 0);
  assert.throws(() => discountPricePaise(100, 10001));
});
test("discount date window is start-inclusive, end-exclusive", () => {
  const d = { enabled: true, percentBps: 1500, startsAt: "2026-11-15T00:00:00Z", endsAt: "2026-11-16T00:00:00Z" };
  assert.equal(activeDiscountBps(d, "2026-11-14T23:59:59Z"), 0);
  assert.equal(activeDiscountBps(d, "2026-11-15T00:00:00Z"), 1500);
  assert.equal(activeDiscountBps(d, "2026-11-16T00:00:00Z"), 0);
  assert.equal(activeDiscountBps({ ...d, enabled: false }, "2026-11-15T12:00:00Z"), 0);
});
test("server quote ignores client supplied price and rejects invalid items", () => {
  const products = new Map([["m1", { active: true, pricePaise: 200000, discount: { enabled: true, percentBps: 1000 } }]]);
  const quote = quoteCart([{ productId: "m1", quantity: 2, pricePaise: 1 }], products);
  assert.equal(quote.subtotalPaise, 360000);
  assert.equal(quote.items[0].unitPaise, 180000);
  assert.throws(() => quoteCart([{ productId: "m1", quantity: 21 }], products));
  assert.throws(() => quoteCart([{ productId: "unknown", quantity: 1 }], products));
  assert.throws(() => quoteCart([{ productId: "m1", quantity: 0 }], products));
});
test("INR formatter", () => assert.match(formatINR(1234567), /12,345\.67/));
