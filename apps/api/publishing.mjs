/**
 * RestCozy publication policy. Pure checks shared by future authenticated API.
 * These checks do NOT authenticate callers or persist changes.
 * The API must derive principal from a verified server-side session and enforce
 * transaction boundaries, audit logging and ownership checks.
 */
const PUBLISH_ROLES = new Set(['owner','admin']);
const EDIT_ROLES = new Set(['owner','admin','catalog_editor']);
const STATUSES = new Set(['draft','review','published','archived']);
export function canEdit(principal) {
  return !!(principal?.verified === true && principal.disabled !== true &&
    typeof principal.subject === 'string' && principal.subject.length > 0 &&
    EDIT_ROLES.has(principal.role));
}
export function canPublish(principal) {
  return canEdit(principal) && PUBLISH_ROLES.has(principal.role);
}
export function validateTransition(principal, from, to) {
  if (!STATUSES.has(from) || !STATUSES.has(to)) throw new TypeError('Invalid publication status');
  if (!canEdit(principal)) throw Object.assign(new Error('Forbidden'),{status:403});
  if (from === 'archived' && to !== 'draft' && to !== 'archived')
    throw new TypeError('Archived product must be restored to draft');
  if (to === 'published' && !canPublish(principal))
    throw Object.assign(new Error('Publishing requires approval'),{status:403});
  if (from === 'draft' && to === 'published')
    throw new TypeError('Submit for review before publishing');
  return {from,to,requiresApproval:to === 'published'};
}
export function assertReadyToPublish(product) {
  if (!product || product.status !== 'review') throw new TypeError('Product not in review');
  if (product.manufacturerVerified !== true) throw new TypeError('Manufacturer not verified');
  if (product.specificationsVerified !== true) throw new TypeError('Specifications not verified');
  if (product.shippingPolicyVerified !== true) throw new TypeError('Shipping not verified');
  if (!Array.isArray(product.variants) || product.variants.length === 0)
    throw new TypeError('Missing variants');
  for (const v of product.variants) {
    if (!Number.isSafeInteger(v.sellingPricePaise) || v.sellingPricePaise < 1 ||
        !Number.isSafeInteger(v.mrpPaise) || v.mrpPaise < v.sellingPricePaise ||
        !Number.isSafeInteger(v.stockQuantity) || v.stockQuantity < 0 ||
        v.verified !== true) throw new TypeError('Unverified variant');
  }
  if (!Array.isArray(product.images) || !product.images.some(i=>i.approvedForPublication === true))
    throw new TypeError('No approved images');
  return true;
}
export function isPubliclyVisible(product) {
  return product?.status === 'published' && product?.isDeleted !== true;
}
