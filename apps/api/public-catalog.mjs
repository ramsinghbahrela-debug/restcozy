/**
 * Public catalogue projection: fail-closed, safe for a future authenticated
 * database-backed API. It never exposes drafts or unpublished concept items.
 * The caller must query the database and use this function on returned rows.
 */
import {isPubliclyVisible} from './publishing.mjs';
export function toPublicProduct(product) {
  if (!isPubliclyVisible(product) || product.publicationApproved !== true)
    return null;
  const variants=(Array.isArray(product.variants)?product.variants:[])
    .filter(v=>v.active===true && v.verified===true &&
      Number.isSafeInteger(v.sellingPricePaise) && v.sellingPricePaise>0 &&
      Number.isSafeInteger(v.mrpPaise) && v.mrpPaise>=v.sellingPricePaise &&
      Number.isSafeInteger(v.stockQuantity) && v.stockQuantity>=0)
    .map(v=>({sku:v.sku,attributes:v.attributes??{},mrpPaise:v.mrpPaise,
      sellingPricePaise:v.sellingPricePaise,inStock:v.stockQuantity>0}));
  const images=(Array.isArray(product.images)?product.images:[])
    .filter(i=>i.approvedForPublication===true && i.sourceKind!=='unverified' &&
      typeof i.objectKey==='string' && i.objectKey.startsWith('products/'))
    .map(i=>({objectKey:i.objectKey,altText:i.altText??'',
      illustrative:i.sourceKind==='ai_concept'}));
  if(!variants.length || !images.length) return null;
  return {id:product.id,slug:product.slug,name:product.name,
    description:product.description??'',categorySlug:product.categorySlug??null,
    variants,images};
}
export function toPublicCatalogue(products) {
  if(!Array.isArray(products)) throw new TypeError('Invalid catalogue');
  return products.map(toPublicProduct).filter(Boolean);
}
