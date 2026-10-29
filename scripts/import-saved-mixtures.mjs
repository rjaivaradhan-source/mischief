import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const source=fileURLToPath(new URL('../../mischief-special-library/smiley-mixtures/',import.meta.url));
const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const rows=JSON.parse(await readFile(path.join(source,'manifest.json'),'utf8'));
const keys=new Set();
for(const row of rows){
  if(!/^face-[a-f0-9-]+\/[a-z]+\.png$/.test(row.file))throw Error('Invalid artwork path: '+row.file);
  const key=[row.face,row.element].sort().join('|');
  if(keys.has(key))throw Error('Duplicate pair: '+key);
  keys.add(key);
  const target=path.join(dist,'mixtures',row.file);
  await mkdir(path.dirname(target),{recursive:true});
  await copyFile(path.join(source,row.file),target);
}
const markerStart='  // SAVED MIXTURES START';
const markerEnd='  // SAVED MIXTURES END';
const block=markerStart+'\n  const savedMixtures='+JSON.stringify(rows.map(r=>({id:'saved-'+r.file.replace(/[/.]/g,'-'),name:r.name+' + '+r.effect,emoji:r.face,pair:[r.face,r.element],src:'mixtures/'+r.file,fullComposition:true})))+';\n'+markerEnd;
const specialFile=path.join(dist,'special.js');
let code=await readFile(specialFile,'utf8');
if(code.includes(markerStart))code=code.slice(0,code.indexOf(markerStart))+block+code.slice(code.indexOf(markerEnd)+markerEnd.length);
else code=code.replace('  const records = new Map();',block+'\n  const records = new Map();');
await writeFile(specialFile,code);
await writeFile(path.join(dist,'mixtures','manifest.json'),JSON.stringify(rows,null,2)+'\n');
console.log('Imported '+rows.length+' saved mixtures without changing source artwork.');
