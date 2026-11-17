import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
test('approved brand and business identity remain visible',()=>{
 assert.match(page,/Comfort for Every Corner/);
 assert.match(page,/Bahrela Brothers Private Limited/);
 assert.match(page,/Sector XU-3/);
 assert.match(page,/#819c82/);
});
test('all 21 mattress concepts retain distinct size selection',()=>{
 assert.match(page,/const products=collections\.flatMap/);
 assert.match(page,/const sizes=\[/);
 assert.match(page,/data-size="\$\{p\.id\}"/);
 assert.match(page,/sizePrice\(p,key\)/);
});
test('preview cart identifies variants and checkout stays disabled',()=>{
 assert.match(page,/x\.id===id&&x\.size===size/);
 assert.match(page,/data-variant="\$\{x\.size\}"/);
 assert.match(page,/Checkout coming soon/);
 assert.match(page,/Shopping bag preview only/);
});
