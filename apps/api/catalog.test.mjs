import test from 'node:test';
import assert from 'node:assert/strict';
import {createAdminCatalogService} from './catalog.mjs';
const editor={verified:true,subject:'auth|123',role:'catalog_editor',disabled:false};
const calls=[];
const repo={listCategories:async()=>[{id:'root',parentId:null},{id:'child',parentId:'root'}],
 saveCategory:async x=>(calls.push(['category',x]),x),saveProduct:async x=>(calls.push(['product',x]),x),
 saveDiscount:async (id,x)=>(calls.push(['discount',id,x]),x),saveImage:async (id,x)=>(calls.push(['image',id,x]),x)};
const svc=createAdminCatalogService(repo);
test('admin writes fail closed for unverified or disabled users',async()=>{
 for(const who of [null,{}, {...editor,verified:false},{...editor,disabled:true},{...editor,role:'customer'}])
  await assert.rejects(svc.saveProduct(who,{name:'A'}),/Forbidden/);
 assert.equal(calls.length,0);
});
test('valid product stores integer paise and draft by default',async()=>{
 const x=await svc.saveProduct(editor,{name:' Comfort Plus ',sku:'RC-01',slug:'comfort-plus',pricePaise:1599900,specifications:{foam:'PU'}});
 assert.equal(x.pricePaise,1599900);assert.equal(x.status,'draft');assert.equal(x.name,'Comfort Plus');
 await assert.rejects(svc.saveProduct(editor,{...x,pricePaise:15999.50}),/integer paise/);
});
test('category editing rejects cycles and invalid parent',async()=>{
 await assert.rejects(svc.saveCategory(editor,{id:'root',name:'Root',slug:'root',parentId:'child'}),/cycle/);
 await assert.rejects(svc.saveCategory(editor,{name:'New',slug:'new',parentId:'missing'}),/Parent not found/);
 const x=await svc.saveCategory(editor,{name:'Cooling',slug:'cooling',parentId:'root'});
 assert.equal(x.parentId,'root');
});
test('discounts validate bounds, booleans and time windows',async()=>{
 assert.equal((await svc.saveDiscount(editor,'product1',{percentBps:1000,enabled:true})).percentBps,1000);
 await assert.rejects(svc.saveDiscount(editor,'product1',{percentBps:10001,enabled:true}),/Invalid discount/);
 await assert.rejects(svc.saveDiscount(editor,'product1',{percentBps:500,enabled:true,startsAt:'2026-12-01',endsAt:'2026-11-01'}),/period/);
});
test('image metadata cannot reference foreign path or unsafe mime/size',async()=>{
 const id='p1'; const base={objectKey:'products/p1/hero.webp',contentType:'image/webp',sizeBytes:2000,altText:'Mattress'};
 assert.equal((await svc.saveImage(editor,id,base)).objectKey,base.objectKey);
 for(const bad of [{...base,objectKey:'products/p2/hero.webp'},{...base,contentType:'image/svg+xml'},{...base,sizeBytes:999999999}])
   await assert.rejects(svc.saveImage(editor,id,bad),/Invalid image metadata/);
});
