const $=id=>document.getElementById(id),isKeyboard=new URLSearchParams(location.search).get('mode')==='keyboard';
document.body.classList.toggle('keyboard',isKeyboard);
if(!isKeyboard){$('png').textContent='Share PNG';$('gif').textContent='Share GIF';$('text').textContent='Copy emojis';}
const kit=MischiefCatalog.items,lookup=emoji=>kit.find(x=>x.emoji===emoji);
let selected=[lookup('🤔'),lookup('👑')],slot=0,category='All',page=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,busy=false,frame=0,last=0;
const canvas=$('preview');
window.nativeStatus=text=>{$('status').textContent=text;};
const status=window.nativeStatus;
function button(text,label,action){const el=document.createElement('button');el.textContent=text;el.setAttribute('aria-label',label);el.onclick=action;return el;}
function slots(){const root=$('slots');root.replaceChildren();selected.forEach((item,i)=>{const el=button(item.emoji,'Change ingredient '+(i+1)+': '+item.name,()=>{slot=i;slots();});el.setAttribute('aria-pressed',String(slot===i));root.append(el);});if(selected.length<4)root.append(button('+','Add ingredient',()=>{selected.push(lookup('✨'));slot=selected.length-1;slots();draw();}));if(selected.length>2){const remove=button('−','Remove selected ingredient',()=>{selected.splice(slot,1);slot=Math.min(slot,selected.length-1);slots();draw();});remove.className='remove';root.append(remove);}}
const preferred=['😊','🤔','😂','🥹','😎','😭','😴','😡','❤️','🔥','👑','❄️','🌧️','✨','⚡','💋','💔','🥳','🫠','👻','🐱','🌈','💤','🎉'];
const ordered=[...preferred.map(lookup).filter(Boolean),...kit.filter(x=>!preferred.includes(x.emoji))];
function grid(){const query=$('search').value.trim().toLowerCase();const filtered=ordered.filter(x=>(category==='All'||x.category===category)&&(!query||`${x.name} ${x.subgroup} ${x.emoji}`.toLowerCase().includes(query)));const size=32;page=Math.max(0,Math.min(page,Math.ceil(filtered.length/size)-1));$('grid').replaceChildren(...filtered.slice(page*size,(page+1)*size).map(item=>button(item.emoji,item.name,()=>{selected[slot]=item;slot=(slot+1)%selected.length;slots();draw();})));$('previous').disabled=page===0;$('next').disabled=(page+1)*size>=filtered.length;$('count').textContent=filtered.length?`${page*size+1}–${Math.min((page+1)*size,filtered.length)} of ${filtered.length}`:'No matching emojis';}
for(const name of ['All',...new Set(kit.map(x=>x.category))]){const el=button(name,name,()=>{category=name;page=0;for(const child of $('categories').children)child.setAttribute('aria-pressed',String(child===el));grid();});el.setAttribute('aria-pressed',String(name==='All'));$('categories').append(el);}
$('search').oninput=()=>{page=0;grid();};$('previous').onclick=()=>{page--;grid();};$('next').onclick=()=>{page++;grid();};
function draw(phase=null){MischiefComposition.draw(canvas,selected,phase);canvas.setAttribute('aria-label',MischiefMeaning(selected).alt);}
function loop(time){if(playing&&time-last>32){draw((time%2000)/2000);last=time;}frame=requestAnimationFrame(loop);}requestAnimationFrame(loop);
$('pause').onclick=()=>{playing=!playing;$('pause').textContent=playing?'Ⅱ':'▶';$('pause').setAttribute('aria-label',playing?'Pause animation':'Play animation');if(!playing)draw();};
function native(method,...args){if(window.Android&&typeof Android[method]==='function'){if(method!=='text'&&args.length===3)args.push(Android.token());Android[method](...args);}else status('Native sharing is available in the Android app.');}
async function png(copy){await MischiefSpecial.ensure(selected);const output=document.createElement('canvas');output.width=output.height=1024;MischiefComposition.draw(output,selected);native(copy?'copy':'send',output.toDataURL('image/png').split(',')[1],'image/png',MischiefMeaning(selected).alt);}
$('png').onclick=()=>png(false);$('copy').onclick=()=>png(true);$('text').onclick=()=>native('text',selected.map(x=>x.emoji).join(''));
$('gif').onclick=async()=>{
  if(busy)return;busy=true;$('gif').disabled=true;const token=window.Android?Android.token():0,items=selected.slice(),output=document.createElement('canvas');output.width=output.height=512;const ctx=output.getContext('2d');let worker;
  try{
    await MischiefSpecial.ensure(items);
    worker=new Worker('gif-worker.mjs',{type:'module'});
    const bytes=await new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>reject(Error('Animation took too long. Try PNG.')),90000);
      window.cancelExport=()=>{clearTimeout(timeout);reject(Error('Animation cancelled because the input field changed.'));};
      worker.onerror=()=>{clearTimeout(timeout);reject(Error('Update Android System WebView or try PNG.'));};
      worker.onmessage=({data})=>{if(data.type==='done'){clearTimeout(timeout);resolve(data.bytes);}else if(data.type==='error'){clearTimeout(timeout);reject(Error(data.message));}else if(data.type==='progress'){status('Preparing animation '+Math.round(data.count*2)+'%');next();}};
      worker.postMessage({type:'start'});
      let index=0;function next(){if(index===50){worker.postMessage({type:'finish'});return;}MischiefComposition.draw(output,items,index/50);const pixels=ctx.getImageData(0,0,512,512).data;worker.postMessage({type:'frame',pixels:pixels.buffer,size:512,delay:40},[pixels.buffer]);index++;}next();
    });
    const reader=new FileReader();reader.onload=()=>native('send',reader.result.split(',')[1],'image/gif',MischiefMeaning(items).alt,token);reader.readAsDataURL(new Blob([bytes],{type:'image/gif'}));status('Animation ready.');
  }catch(error){status(error.message||'Animation unavailable. Try PNG.');}finally{worker?.terminate();window.cancelExport=null;busy=false;$('gif').disabled=false;}
};
slots();grid();draw();

window.addEventListener("mischief:artwork",()=>draw());
const library=document.createElement("div");library.className="special-picks";library.setAttribute("aria-label","Special Library");for(const entry of MischiefSpecial.entries){library.append(button(entry.pair.join(""),"Special Library: "+entry.name,()=>{selected=entry.pair.map(lookup);slot=0;slots();draw();}));}document.getElementById("slots").before(library);
