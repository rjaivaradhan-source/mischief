import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const context={};vm.createContext(context);for(const file of ['catalog.js','composition.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context);
const get=emoji=>context.MischiefCatalog.items.find(x=>x.emoji===emoji);
const families={frozen:['🧊','🌨️','☃️','⛄'],fire:['🌋'],electric:['⚡','🌩️','⛈️'],rain:['💧','☂️','⛈️'],wave:['🌊'],heat:['☀️','🌞','🌡️'],wind:['🌬️','💨','🌪️'],fog:['🌫️'],cloud:['☁️','🌥️','⛅'],rainbow:['🌈'],night:['🌙','🌕']};
let draws=0;
function canvas(){const ctx=new Proxy({measureText:()=>({width:280,actualBoundingBoxAscent:240,actualBoundingBoxDescent:40}),createLinearGradient:()=>({addColorStop(){}})},{get:(obj,key)=>obj[key]||((...args)=>{for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg),key);}),set:(obj,key,value)=>{obj[key]=value;return true;}});return {width:512,height:512,getContext:()=>ctx};}
context.document={createElement:()=>canvas()};
for(const [effect,emojis] of Object.entries(families))for(const emoji of emojis)for(const subject of ['😊','🤔','❤️','🐱','🍕'])for(const pair of [[get(subject),get(emoji)],[get(emoji),get(subject)]]){
  assert.ok(pair.every(Boolean),emoji);const plan=context.MischiefComposition.plan(pair);assert.equal(plan.base.emoji,subject);assert.equal(plan.effects[effect],true);assert.equal(plan.accents.length,0);
  for(const phase of [null,0,.25,.5,.75,1]){context.MischiefComposition.draw(canvas(),pair,phase);draws++;}
}
console.log('PASS: elemental families, ingredient order, preserved subjects and '+draws+' render frames.');
