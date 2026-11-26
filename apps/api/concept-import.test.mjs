import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareConcept,modelNames} from './concept-import.mjs';
const bytes=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.alloc(32)]);
const input={id:4,model:'Orthopedic Classic',source:'approved original concept 04',approved:true,bytes};
test('explicit model mapping and immutable provenance',()=>{const r=prepareConcept(input);assert.equal(modelNames.length,21);assert.equal(r.illustrative,true);assert.match(r.path,/^media\/concepts\/4-[a-f0-9]{64}\.png$/);assert.equal(r.sha256.length,64)});
test('reject unapproved, mismatched and unsupported inputs',()=>{for(const change of [{approved:false},{model:'Comfort Plus'},{id:22},{source:''},{bytes:Buffer.alloc(40)}])assert.throws(()=>prepareConcept({...input,...change}))});
