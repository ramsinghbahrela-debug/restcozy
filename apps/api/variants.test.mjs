import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVariant } from './variants.mjs';
const good={sku:'RC-COMFORT-QN-6',mrpPaise:1499900,sellingPricePaise:1299900,stockQuantity:0,attributes:{size:'queen',thickness_cm:15.24}};
test('accepts size-specific INR paise price and mattress attributes',()=>{const v=validateVariant(good);assert.equal(v.attributes.size,'queen');assert.equal(v.sellingPricePaise,1299900);});
test('accepts future furniture colour and material variants',()=>assert.equal(validateVariant({...good,attributes:{colour:'sage',material:'wood'}}).attributes.colour,'sage'));
test('rejects selling price above MRP',()=>assert.throws(()=>validateVariant({...good,sellingPricePaise:1500000}),/above MRP/));
test('rejects negative stock and floating price',()=>{assert.throws(()=>validateVariant({...good,stockQuantity:-2}));assert.throws(()=>validateVariant({...good,mrpPaise:999.5}));});
test('rejects arbitrary and nested product specification injection',()=>assert.throws(()=>validateVariant({...good,attributes:{size:{foo:'bar'}}}),/Invalid variant attribute/));
