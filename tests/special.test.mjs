import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
function setup(){const c={};vm.createContext(c);for(const file of ['catalog.js','special.js','composition.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),c);return c;}
const c=setup(),get=emoji=>c.MischiefCatalog.items.find(item=>item.emoji===emoji);
const calls=[];
function canvas(){const ctx=new Proxy({measureText:()=>({width:280,actualBoundingBoxAscent:240,actualBoundingBoxDescent:40}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||((...args)=>{for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg),k);calls.push([k,...args]);}),set:(o,k,v)=>{o[k]=v;return true;}});return {width:1024,height:1024,getContext:()=>ctx};}
c.document={createElement:canvas};
test('special matching preserves expressions, order, aliases and opt-out',()=>{
  for(const entry of c.MischiefSpecial.entries){
    for(const pair of [entry.pair,[...entry.pair].reverse()]){const items=pair.map(get);assert.equal(c.MischiefSpecial.match(items,c.MischiefComposition.plan(items).base)?.id,entry.id);}
    const png=fs.readFileSync('dist/special/'+entry.id+'.png');assert.ok(png.readUInt32BE(16)>=1024,'Artwork must support high-resolution export');assert.equal(png[25],6,'Artwork must include an alpha channel');
  }
  for(const emojis of [['😡','👑'],['🤔','❄️'],['😴','❤️']]){const items=emojis.map(get);assert.equal(c.MischiefSpecial.match(items,c.MischiefComposition.plan(items).base),null);}
  const ice=['😊','🧊'].map(get);assert.equal(c.MischiefSpecial.match(ice,c.MischiefComposition.plan(ice).base).id,'frozen-smile');
  c.MischiefSpecial.enabled=false;assert.equal(c.MischiefSpecial.match(ice,get('😊')),null);c.MischiefSpecial.enabled=true;
});
test('ready artwork replaces its pair, retains extra ingredients and closes its motion loop',()=>{
  c.MischiefSpecial.record=entry=>entry?{entry,state:'ready',image:{asset:entry.id},bounds:{x:20,y:15,w:1000,h:1100}}:null;
  calls.length=0;c.MischiefComposition.draw(canvas(),['🤔','👑','☕','🦋'].map(get),.25);
  assert.ok(calls.some(x=>x[0]==='drawImage'&&x[1]?.asset==='thinking-king'));
  for(const extra of ['☕','🦋'])assert.ok(calls.some(x=>x[0]==='fillText'&&x[1]===extra));
  assert.ok(!calls.some(x=>x[0]==='fillText'&&['🤔','👑'].includes(x[1])));
  for(const entry of c.MischiefSpecial.entries){
    const record=c.MischiefSpecial.record(entry),ctx=canvas().getContext('2d');
    calls.length=0;c.MischiefSpecial.draw(ctx,record,256,268,356,0);const first=JSON.parse(JSON.stringify(calls));
    calls.length=0;c.MischiefSpecial.draw(ctx,record,256,268,356,1);
    assert.equal(calls.length,first.length);calls.forEach((call,i)=>call.forEach((value,j)=>{if(typeof value==='number')assert.ok(Math.abs(value-first[i][j])<1e-8);}));
  }
});
test('every catalog emoji remains a valid third ingredient for every special pair',()=>{
  for(const entry of c.MischiefSpecial.entries)for(const item of c.MischiefCatalog.items){calls.length=0;c.MischiefComposition.draw(canvas(),[...entry.pair.map(get),item],.3);}
});
test('failed artwork returns to the standard renderer',()=>{
  c.MischiefSpecial.record=()=>({state:'failed'});calls.length=0;
  c.MischiefComposition.draw(canvas(),['🤔','👑'].map(get));assert.ok(calls.some(x=>x[0]==='fillText'&&x[1]==='🤔'));
});
test('asset failure settles loading promises without blocking export',async()=>{
  const images=[],events=[];const env={Image:class{constructor(){images.push(this);}},document:{currentScript:null},setTimeout:()=>1,clearTimeout(){},Event:class{constructor(type){this.type=type;}},dispatchEvent:event=>events.push(event)};
  vm.createContext(env);vm.runInContext(fs.readFileSync('dist/special.js','utf8'),env);for(const image of images)image.onerror();await env.MischiefSpecial.ready;
  assert.equal(events.length,6);for(const entry of env.MischiefSpecial.entries)assert.equal(env.MischiefSpecial.record(entry).state,'failed');
});
