/**
 * Pure INR/paise pricing functions. Prices must be stored as integer paise.
 * Never trust a browser-calculated total at checkout.
 */
export function assertPaise(value, name = "amount") {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(name + " must be nonnegative integer paise");
  return value;
}
export function discountPricePaise(basePaise, percentBps = 0) {
  assertPaise(basePaise, "basePaise");
  if (!Number.isInteger(percentBps) || percentBps < 0 || percentBps > 10000)
    throw new RangeError("discount basis points must be an integer from 0 to 10000");
  // BigInt avoids overflow from intermediate multiplication and rounds half-up.
  const result = (BigInt(basePaise) * BigInt(10000 - percentBps) + 5000n) / 10000n;
  if (result > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError("price exceeds safe integer range");
  return Number(result);
}
export function activeDiscountBps(discount, now = new Date()) {
  if (!discount || discount.enabled !== true) return 0;
  if (!Number.isInteger(discount.percentBps) || discount.percentBps < 0 || discount.percentBps > 10000)
    throw new RangeError("invalid discount");
  const instant = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (!Number.isFinite(instant)) throw new RangeError("invalid time");
  if (discount.startsAt && instant < new Date(discount.startsAt).getTime()) return 0;
  if (discount.endsAt && instant >= new Date(discount.endsAt).getTime()) return 0;
  return discount.percentBps;
}
export function quoteCart(lines, productById, now = new Date()) {
  if (!Array.isArray(lines) || lines.length > 100) throw new RangeError("invalid cart");
  let total = 0n;
  const items = lines.map(line => {
    if (!line || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 20)
      throw new RangeError("quantity must be 1 to 20");
    const product = productById.get(line.productId);
    if (!product || product.active !== true) throw new Error("unavailable product");
    const unitPaise = discountPricePaise(product.pricePaise, activeDiscountBps(product.discount, now));
    const subtotal = BigInt(unitPaise) * BigInt(line.quantity);
    total += subtotal;
    if (subtotal > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError("subtotal too large");
    return { productId: line.productId, quantity: line.quantity, unitPaise, subtotalPaise: Number(subtotal) };
  });
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError("cart total too large");
  return { currency: "INR", items, subtotalPaise: Number(total) };
}
export function formatINR(paise) {
  assertPaise(paise);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);
}
