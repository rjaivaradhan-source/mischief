import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const rows=JSON.parse(fs.readFileSync('dist/mixtures/manifest.json'));
const c={};vm.createContext(c);
for(const file of ['special.js','composition.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),c);
const items=row=>[row.face,row.element].map(emoji=>({emoji,category:'Faces'}));
test('all 1965 saved pairs are exact copies and match in both orders',()=>{
 assert.equal(rows.length,1965);assert.equal(new Set(rows.map(r=>r.face)).size,131);
 const hash=data=>createHash('sha256').update(data).digest('hex');
 for(const row of rows){
  assert.equal(hash(fs.readFileSync('dist/mixtures/'+row.file)),hash(fs.readFileSync('../mischief-special-library/smiley-mixtures/'+row.file)));
  for(const pair of [items(row),items(row).reverse()]){
   const entry=c.MischiefSpecial.match(pair,pair[0]);assert.equal(entry.src,'mixtures/'+row.file);assert.equal(entry.fullComposition,true);
  }
 }
});
test('saved pair renders once at full canvas size without extra effect layers',()=>{
 const row=rows[0],calls=[];const ctx={clearRect(){},save(){},restore(){},translate(){},drawImage(...args){calls.push(args);}};
 c.MischiefSpecial.record=entry=>({entry,state:'ready',image:'saved-image'});
 const canvas={width:1024,height:1024,getContext:()=>ctx};
 c.MischiefComposition.draw(canvas,items(row));assert.deepEqual(calls,[['saved-image',0,0,1024,1024]]);
 assert.notEqual(c.MischiefSpecial.match([...items(row),{emoji:'🔥'}],items(row)[0])?.fullComposition,true);
 c.MischiefSpecial.enabled=false;assert.equal(c.MischiefSpecial.match(items(row),items(row)[0]),null);
});
