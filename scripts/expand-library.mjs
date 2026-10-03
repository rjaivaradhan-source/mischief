import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createCanvas,Image} from '@napi-rs/canvas';
const root=new URL('../dist/',import.meta.url),out=path.resolve(process.argv[2]||'../mischief-special-library/smiley-mixtures');
await fs.mkdir(out,{recursive:true});
const context={URL,Event,setTimeout,clearTimeout,dispatchEvent(){},Image:class extends Image{set src(value){super.src=value.startsWith('file:')?fileURLToPath(value):value;}get src(){return super.src;}},document:{currentScript:{src:new URL('special.js',root).href},createElement:()=>createCanvas(512,512)}};
vm.createContext(context);for(const file of ['catalog.js','faces.js','special.js','composition.js'])vm.runInContext(await fs.readFile(new URL(file,root),'utf8'),context);
const effects=[['👑','crown'],['❄️','frozen'],['🔥','fire'],['🌧️','rain'],['⚡','lightning'],['☀️','heat'],['🌊','water'],['🌬️','wind'],['🌫️','fog'],['☁️','cloud'],['🌈','rainbow'],['🌙','night'],['✨','sparkle'],['💤','sleep'],['❤️','love']];
const catalog=context.MischiefCatalog.items,manifest=[];
for(const face of context.MischiefFaces){
  const folder=path.join(out,face.id);await fs.mkdir(folder,{recursive:true});
  for(const [emoji,effect] of effects){
    const items=[catalog.find(x=>x.emoji===face.emoji),catalog.find(x=>x.emoji===emoji)];
    await context.MischiefSpecial.ensure(items);const canvas=createCanvas(512,512);context.MischiefComposition.draw(canvas,items);
    const file=face.id+'/'+effect+'.png';await fs.writeFile(path.join(out,file),await canvas.encode('png'));
    manifest.push({face:face.emoji,name:face.name,element:emoji,effect,file,artwork:face.src?'bundled face':'device font fallback'});
  }
}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
const data=JSON.stringify(manifest).replaceAll('<','\\u003c');
await fs.writeFile(path.join(out,'index.html'),`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mischief · All face mixes</title><style>body{font:16px system-ui;background:#f5f7ef;color:#243020;margin:40px auto;max-width:1200px;padding:20px}input,select{font:inherit;padding:12px;margin:12px;border-radius:10px;border:1px solid #bac4b1}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:15px}article{background:white;border-radius:18px;padding:15px}img{width:100%}a{color:inherit}button{padding:12px;margin:20px}</style></head><body><h1>Every face. Every element.</h1><p>131 expressions × 15 treatments = 1,965 PNG compositions. These use shared effects; nine signature pairs have individually designed artwork. Two expressions use the local emoji font. Source face artwork is 256 px; exports are 512 px.</p><input id="search" placeholder="Find a face"><select id="effect"><option value="">All treatments</option>${effects.map(([,e])=>'<option>'+e+'</option>').join('')}</select><p id="count"></p><main id="grid"></main><button id="more">Show more</button><script>const data=${data};let limit=60;function render(){const q=document.getElementById('search').value.toLowerCase(),e=document.getElementById('effect').value,a=data.filter(x=>(!q||(x.name+x.face).toLowerCase().includes(q))&&(!e||x.effect===e));document.getElementById('count').textContent=a.length+' mixes';document.getElementById('grid').innerHTML=a.slice(0,limit).map(x=>'<article><a href="'+x.file+'" download><img loading="lazy" src="'+x.file+'" alt="'+x.name+' '+x.effect+'"><p>'+x.face+' '+x.element+' · '+x.name+'</p><small>'+x.effect+' · Download PNG</small></a></article>').join('');document.getElementById('more').hidden=limit>=a.length;}for(const id of ['search','effect'])document.getElementById(id).oninput=()=>{limit=60;render();};document.getElementById('more').onclick=()=>{limit+=60;render();};render();</script></body></html>`);
console.log('Exported '+manifest.length+' PNGs to '+out);
