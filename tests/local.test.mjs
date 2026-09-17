import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {server,resolveAsset} from '../scripts/serve.mjs';
test('drafts validate and recover from disabled storage',()=>{
  const context={window:{},localStorage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}}};context.window.self=context.window.top={};vm.createContext(context);vm.runInContext(fs.readFileSync('dist/draft.js','utf8'),context);
  const draft=context.MischiefDraft;assert.equal(JSON.stringify(draft.read()),'{}');draft.save({motion:'auto'});
  assert.equal(JSON.stringify(draft.sanitize({emojis:['😊'],motion:'bad',playing:'yes'})),'{}');
  assert.equal(draft.sanitize({emojis:['😊','👑'],motion:'float',playing:false}).emojis.length,2);
});
test('local server serves assets and rejects writes and traversal',async()=>{
  assert.equal(resolveAsset('/%2e%2e%2fpackage.json'),null);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{const url=`http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(url)).status,200);
    assert.match((await fetch(url+'/motion.mjs')).headers.get('content-type'),/javascript/);
    assert.equal((await fetch(url+'/missing')).status,404);
    assert.equal((await fetch(url,{method:'POST'})).status,405);
    assert.equal((await fetch(url+'/icon-32.png?v=12')).status,200);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
