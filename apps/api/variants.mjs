// Pure, AWS-portable validation for category-configured product variants.
// Backend must still authenticate and authorize all writes and use transactions.
import { assertPaise } from '../../packages/shared/pricing.mjs';
const SKU = /^[A-Z0-9][A-Z0-9._-]{1,79}$/;
const MAX_ATTRS = 30;
export function validateVariant(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Invalid variant');
  if (typeof input.sku !== 'string' || !SKU.test(input.sku)) throw new TypeError('Invalid variant SKU');
  assertPaise(input.mrpPaise, 'mrpPaise');
  assertPaise(input.sellingPricePaise, 'sellingPricePaise');
  if (input.sellingPricePaise > input.mrpPaise) throw new TypeError('Selling price above MRP');
  if (!Number.isSafeInteger(input.stockQuantity) || input.stockQuantity < 0) throw new TypeError('Invalid stock');
  const attrs=input.attributes ?? {};
  if (!attrs || typeof attrs !== 'object' || Array.isArray(attrs) || Object.keys(attrs).length > MAX_ATTRS) throw new TypeError('Invalid attributes');
  for (const [key,val] of Object.entries(attrs)) {
    if (!/^[a-z][a-z0-9_]{0,63}$/.test(key) ||
        !((typeof val === 'string' && val.length <= 160) ||
        (typeof val === 'number' && Number.isFinite(val) && val >= 0) ||
        typeof val === 'boolean')) throw new TypeError('Invalid variant attribute');
  }
  return {sku:input.sku,mrpPaise:input.mrpPaise,sellingPricePaise:input.sellingPricePaise,
    stockQuantity:input.stockQuantity,attributes:{...attrs},active:input.active !== false};
}
export function validateProductCategory(category, parentId) {
  if (!category || !category.id || category.active === false) throw new TypeError('Inactive or missing category');
  if (parentId != null && parentId === category.id) throw new TypeError('Circular category');
  return true;
}
