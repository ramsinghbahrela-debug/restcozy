import test from 'node:test';
import assert from 'node:assert/strict';
import {toPublicCatalogue,toPublicProduct} from './public-catalog.mjs';
const product={id:'p1',slug:'comfort',name:'Comfort',status:'published',publicationApproved:true,
 variants:[{sku:'RC-Q',active:true,verified:true,mrpPaise:2000000,sellingPricePaise:1500000,stockQuantity:0,attributes:{size:'queen'}}],
 images:[{objectKey:'products/p1/hero.webp',approvedForPublication:true,sourceKind:'ai_concept',altText:'Illustrative mattress'}],
 internalCostPaise:500000,manufacturerContact:'private'};
test('public output contains safe fields and clearly flags AI concepts',()=>{
 const p=toPublicProduct(product);assert.equal(p.variants[0].inStock,false);assert.equal(p.images[0].illustrative,true);
 assert.equal('internalCostPaise' in p,false);assert.equal('manufacturerContact' in p,false);
});
test('draft, review, archived and unapproved records are never public',()=>{
 for(const status of ['draft','review','archived','active'])assert.equal(toPublicProduct({...product,status}),null);
 assert.equal(toPublicProduct({...product,publicationApproved:false}),null);
});
test('unverified variant or image cannot leak into public product',()=>{
 assert.equal(toPublicProduct({...product,variants:[{...product.variants[0],verified:false}]}),null);
 assert.equal(toPublicProduct({...product,images:[{...product.images[0],approvedForPublication:false}]}),null);
 assert.equal(toPublicProduct({...product,images:[{...product.images[0],sourceKind:'unverified'}]}),null);
});
test('mixed catalogue includes only verified publishable items',()=>{
 assert.equal(toPublicCatalogue([product,{...product,id:'draft',status:'draft'}]).length,1);
});
