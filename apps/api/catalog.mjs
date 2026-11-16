/**
 * Portable, fail-closed admin catalog service.
 * A trusted server auth adapter MUST verify identity before passing principal.
 * No public admin routes should be mounted without a real session verifier.
 */
import { assertPaise } from '../../packages/shared/pricing.mjs';

const ROLES = new Set(['owner','admin','catalog_editor']);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEY = /^[a-zA-Z0-9][a-zA-Z0-9/_.-]{0,255}$/;
const TYPES = new Set(['image/jpeg','image/png','image/webp','image/avif']);
const MAX_BYTES = 8 * 1024 * 1024;
const textField = (v, max=200) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
function requireEditor(principal) {
  if (!principal || principal.verified !== true || principal.disabled === true ||
      !textField(principal.subject, 255) || !ROLES.has(principal.role)) {
    const error = new Error('Forbidden'); error.status = 403; throw error;
  }
}
function validateCategory(data) {
  if (!data || !textField(data.name,100) || !SLUG.test(data.slug ?? '')) throw new TypeError('Invalid category');
  if (data.parentId != null && !textField(data.parentId,100)) throw new TypeError('Invalid parent');
  return {name:data.name.trim(),slug:data.slug,parentId:data.parentId ?? null,active:data.active !== false};
}
function validateProduct(data) {
  if (!data || !textField(data.name,200) || !textField(data.sku,80) || !SLUG.test(data.slug ?? '') ||
      !['draft','active','archived'].includes(data.status ?? 'draft')) throw new TypeError('Invalid product');
  assertPaise(data.pricePaise,'pricePaise');
  if (data.specifications != null && (typeof data.specifications !== 'object' || Array.isArray(data.specifications) || data.specifications === null)) throw new TypeError('Invalid specifications');
  return {name:data.name.trim(),sku:data.sku.trim(),slug:data.slug,pricePaise:data.pricePaise,
    status:data.status ?? 'draft',description:typeof data.description === 'string' ? data.description.slice(0,10000) : '',
    categoryId:data.categoryId ?? null,specifications:data.specifications ?? {}};
}
function validateDiscount(data) {
  if (!data || !Number.isInteger(data.percentBps) || data.percentBps < 0 || data.percentBps > 10000 ||
      typeof data.enabled !== 'boolean') throw new TypeError('Invalid discount');
  const starts = data.startsAt == null ? null : new Date(data.startsAt);
  const ends = data.endsAt == null ? null : new Date(data.endsAt);
  if ((starts && !Number.isFinite(starts.getTime())) || (ends && !Number.isFinite(ends.getTime())) ||
      (starts && ends && ends <= starts)) throw new TypeError('Invalid discount period');
  return {percentBps:data.percentBps,enabled:data.enabled,startsAt:starts?.toISOString() ?? null,endsAt:ends?.toISOString() ?? null};
}
function validateImage(data, productId) {
  if (!data || !textField(productId,100) || !KEY.test(data.objectKey ?? '') || (data.objectKey ?? '').split('/').some(segment => segment === '.' || segment === '..') ||
      !data.objectKey.startsWith('products/' + productId + '/') ||
      !TYPES.has(data.contentType) || !Number.isSafeInteger(data.sizeBytes) ||
      data.sizeBytes < 1 || data.sizeBytes > MAX_BYTES ||
      (data.altText != null && (typeof data.altText !== 'string' || data.altText.length > 250)))
    throw new TypeError('Invalid image metadata');
  return {objectKey:data.objectKey,contentType:data.contentType,sizeBytes:data.sizeBytes,altText:data.altText ?? ''};
}
/**
 * Adapter methods must use parameterized SQL, transactions, and enforce unique
 * constraints. Category graph is validated here but must be locked/checked in
 * a DB transaction to avoid concurrent cycles.
 */
export function createAdminCatalogService(repo) {
  if (!repo || !['saveCategory','saveProduct','saveDiscount','saveImage','listCategories'].every(k => typeof repo[k] === 'function'))
    throw new TypeError('Missing repository adapter');
  return {
    async saveCategory(principal, data) {
      requireEditor(principal);
      const category=validateCategory(data);
      const categories=await repo.listCategories();
      const id=data.id ?? null;
      const byId=new Map(categories.map(c=>[c.id,c]));
      if (category.parentId && !byId.has(category.parentId)) throw new TypeError('Parent not found');
      let cursor=category.parentId; const visited=new Set();
      while (cursor) {
        if (cursor === id || visited.has(cursor)) throw new TypeError('Category cycle');
        visited.add(cursor); cursor=byId.get(cursor)?.parentId ?? null;
      }
      return repo.saveCategory({...category,id});
    },
    async saveProduct(principal,data) {requireEditor(principal);return repo.saveProduct({...validateProduct(data),id:data.id ?? null});},
    async saveDiscount(principal,productId,data) {
      requireEditor(principal);
      if (!textField(productId,100)) throw new TypeError('Invalid product ID');
      return repo.saveDiscount(productId,validateDiscount(data));
    },
    async saveImage(principal,productId,data) {
      requireEditor(principal);
      // This only records validated metadata. Actual uploads require signed
      // object-store PUT URLs and independent server-side object verification.
      return repo.saveImage(productId,validateImage(data,productId));
    }
  };
}
