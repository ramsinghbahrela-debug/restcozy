import test from 'node:test';
import assert from 'node:assert/strict';
import {applyStockEvent as apply} from './warehouse.mjs';
const zero={onHand:0,reserved:0,damaged:0};
test('receive, reserve and dispatch stock',()=>{let b=apply(zero,'receive',10); b=apply(b,'reserve',3);assert.equal(b.available,7);b=apply(b,'dispatch',3);assert.deepEqual(b,{onHand:7,reserved:0,damaged:0,available:7});});
test('reject overselling and unreserved dispatch',()=>{assert.throws(()=>apply(zero,'reserve',1));assert.throws(()=>apply({onHand:5,reserved:0,damaged:0},'dispatch',1));});
test('returned mattresses quarantined until inspection',()=>{let b=apply(zero,'return',2);assert.equal(b.available,0);b=apply(b,'restore',1);assert.equal(b.available,1);});
test('release and damage cannot consume other reservations',()=>{const b={onHand:5,reserved:4,damaged:0};assert.throws(()=>apply(b,'damage',2));assert.throws(()=>apply(b,'release',5));assert.equal(apply(b,'release',2).available,3);});
test('reject invalid counts',()=>{for(const q of [0,-1,1.5,NaN])assert.throws(()=>apply(zero,'receive',q));assert.throws(()=>apply(zero,'fake',1));});
