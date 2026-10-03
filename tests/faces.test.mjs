import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function setup(){const c={};vm.createContext(c);for(const f of ['catalog.js','faces.js','special.js','composition.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),c);return c;}
test('every smiley is represented and bundled art preserves its exact expression',()=>{
  const c=setup(),faces=c.MischiefCatalog.items.filter(x=>/^(face-|cat-face|monkey-face)/.test(x.subgroup));
  assert.equal(faces.length,131);assert.equal(c.MischiefFaces.length,faces.length);
  for(const face of faces){const entry=c.MischiefFaces.find(x=>x.emoji===face.emoji);assert.ok(entry);if(entry.src){const bytes=fs.readFileSync('dist/'+entry.src);assert.equal(bytes.readUInt32BE(16),entry.width);assert.equal(bytes.readUInt32BE(20),entry.height);}}
  assert.equal(c.MischiefFaces.filter(x=>x.src).length,129);
  for(const emoji of ['😡','😴','🤔','😺']){const items=[faces.find(x=>x.emoji===emoji),c.MischiefCatalog.items.find(x=>x.emoji==='🌊')],entry=c.MischiefSpecial.match(items,c.MischiefComposition.plan(items).base);assert.equal(entry.emoji,emoji);}
});
test('all smileys retain all 14 element families in either ingredient order',()=>{
  const c=setup(),get=e=>c.MischiefCatalog.items.find(x=>x.emoji===e);
  const effects={crown:'👑',frozen:'❄️',fire:'🔥',rain:'🌧️',electric:'⚡',heat:'☀️',wave:'🌊',wind:'🌬️',fog:'🌫️',cloud:'☁️',rainbow:'🌈',night:'🌙',sparkle:'✨',sleep:'💤'};
  for(const face of c.MischiefFaces)for(const [effect,emoji] of Object.entries(effects))for(const items of [[get(face.emoji),get(emoji)],[get(emoji),get(face.emoji)]]){const plan=c.MischiefComposition.plan(items);assert.equal(plan.base.emoji,face.emoji);assert.equal(plan.effects[effect],true);}
});
test('unrelated categories keep the intended subject and all extra ingredients',()=>{
  const c=setup(),get=e=>c.MischiefCatalog.items.find(x=>x.emoji===e);
  for(const subject of ['🐱','🍕','🚗','⚽','🌹','❤️']){const plan=c.MischiefComposition.plan([subject,'❄️','👑','☕'].map(get));assert.equal(plan.base.emoji,subject);assert.ok(plan.effects.frozen&&plan.effects.crown);assert.equal(plan.accents[0].emoji,'☕');}
});
