// Reproducible import of MIT-licensed Microsoft Fluent Emoji artwork.
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),c={};
vm.runInNewContext(await fs.readFile(new URL('dist/catalog.js',root),'utf8'),c);
const revision='1ffb34c752ecf5d402f04cfb4b392c77f57c54bc';
const response=await fetch('https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/'+revision+'?recursive=1');
if(!response.ok)throw Error('Asset tree: '+response.status);
const tree=await response.json();
const paths=tree.tree.filter(x=>/\/3D\/.*png$/.test(x.path));
const faces=c.MischiefCatalog.items.filter(x=>/^(face-|cat-face|monkey-face)/.test(x.subgroup));
const aliases={'🤗':'hugging face','😵':'knocked-out face','😡':'pouting face'};
const dir=new URL('dist/faces/',root);await fs.mkdir(dir,{recursive:true});
const manifest=[];
async function download(path){const r=await fetch('https://raw.githubusercontent.com/microsoft/fluentui-emoji/'+tree.sha+'/'+path.split('/').map(encodeURIComponent).join('/'));if(!r.ok)throw Error(path+': '+r.status);return Buffer.from(await r.arrayBuffer());}
let cursor=0;
await Promise.all(Array.from({length:8},async()=>{while(cursor<faces.length){const face=faces[cursor++],name=aliases[face.emoji]||face.name;const p=paths.find(p=>p.path.split('/')[1].toLowerCase()===name.toLowerCase());const id=Array.from(face.emoji).map(x=>x.codePointAt(0).toString(16)).join('-');const entry={emoji:face.emoji,name:face.name,id:'face-'+id,pair:[face.emoji],effect:null,motion:'gentle',baseArtwork:true};if(p){const bytes=await download(p.path);entry.src='faces/'+id+'.png';entry.width=bytes.readUInt32BE(16);entry.height=bytes.readUInt32BE(20);entry.source=p.path;await fs.writeFile(new URL(id+'.png',dir),bytes);}manifest.push(entry);}}));
manifest.sort((a,b)=>faces.findIndex(f=>f.emoji===a.emoji)-faces.findIndex(f=>f.emoji===b.emoji));
await fs.writeFile(new URL('dist/faces.js',root),'globalThis.MischiefFaces = '+JSON.stringify(manifest,null,2)+';\n');
await fs.writeFile(new URL('LICENSE.txt',dir),await download('LICENSE'));
await fs.writeFile(new URL('SOURCE.json',dir),JSON.stringify({repository:'https://github.com/microsoft/fluentui-emoji',commit:tree.sha,license:'MIT',note:'Original PNG dimensions retained; exports may be larger than source artwork.'},null,2));
console.log(JSON.stringify({faces:manifest.length,artwork:manifest.filter(x=>x.src).length,fallback:manifest.filter(x=>!x.src).map(x=>x.name),sizes:[...new Set(manifest.filter(x=>x.src).map(x=>x.width))]}));

