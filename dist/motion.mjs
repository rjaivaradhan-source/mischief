import {paintMotion} from './motion-math.mjs?v=15';
const el=id=>document.getElementById(id);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const savedMotion=MischiefDraft.read();
let playing=!reduced.matches&&(savedMotion.playing??true),style=savedMotion.motion||'auto',snapshot=document.createElement('canvas'),recipe='',lastFrame=0,busy=false,gifBlob=null,gifName='',gifMetadata=null,items=[];
snapshot.width=snapshot.height=512;
function resolvedStyle(){if(style!=='auto')return style;const effects=MischiefComposition.plan(items).effects;return Object.values(effects).some(Boolean)?'still':'bounce';}
function sync(){items=window.MischiefExport().ingredients;recipe=el('resultName').textContent;snapshot.getContext('2d').clearRect(0,0,512,512);snapshot.getContext('2d').drawImage(el('preview'),0,0);gifBlob=null;el('shareGif').hidden=true;el('actionStatus').textContent='';if(!playing)paintMotion(el('preview').getContext('2d'),snapshot,'still',0,512);}
function setPlaying(value){playing=value;document.body.classList.toggle('motion-paused',!playing);el('motionToggle').setAttribute('aria-pressed',playing);el('motionToggle').textContent=playing?'Ⅱ Pause animation':'▶ Play animation';if(!playing)paintMotion(el('preview').getContext('2d'),snapshot,'still',0,512);}
el('motionStyle').value=style;sync();setPlaying(playing);
window.addEventListener('mischief:mix',sync);
el('motionStyle').onchange=()=>{style=el('motionStyle').value;MischiefDraft.save({motion:style});gifBlob=null;el('shareGif').hidden=true;};
el('motionToggle').onclick=()=>{setPlaying(!playing);MischiefDraft.save({playing});};
reduced.addEventListener('change',event=>{if(event.matches)setPlaying(false)});
function loop(time){if(playing&&!document.hidden&&time-lastFrame>25){const phase=(time%2000)/2000;MischiefComposition.draw(snapshot,items,phase);paintMotion(el('preview').getContext('2d'),snapshot,resolvedStyle(),phase,512);lastFrame=time;}requestAnimationFrame(loop);}
requestAnimationFrame(loop);
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
el('downloadGif').onclick=async()=>{
  if(busy)return;busy=true;el('downloadGif').disabled=true;
  let worker,timer;
  try{
    await MischiefSpecial.ensure(window.MischiefIngredients());
    const source=document.createElement('canvas');source.width=source.height=512;source.getContext('2d').drawImage(snapshot,0,0);
    const exportedName=recipe,exportedStyle=resolvedStyle(),exportedMetadata=window.MischiefExport();
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d',{willReadFrequently:true});
    worker=new Worker('./gif-worker.mjs?v=15',{type:'module'});
    const completed=new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),90000);worker.onerror=()=>reject(Error('worker'));worker.onmessage=({data})=>{if(data.type==='progress')el('actionStatus').textContent=`Making your animation… ${Math.round(data.count/50*100)}%`;if(data.type==='done')resolve(new Blob([data.bytes],{type:'image/gif'}));if(data.type==='error')reject(Error(data.message));};});
    worker.postMessage({type:'start'});
    for(let i=0;i<50;i++){MischiefComposition.draw(source,exportedMetadata.ingredients,i/50);paintMotion(ctx,source,exportedStyle,i/50,512);const pixels=ctx.getImageData(0,0,512,512).data;worker.postMessage({type:'frame',pixels:pixels.buffer,size:512,delay:40},[pixels.buffer]);}
    worker.postMessage({type:'finish'});
    gifBlob=await completed;gifMetadata=exportedMetadata;gifName='mischief-'+exportedName.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.gif';
    download(gifBlob,gifName);el('shareGif').hidden=false;el('actionStatus').textContent='GIF ready! Attach it in an app that supports animated images.';
  }catch{el('actionStatus').textContent='Animation export could not finish. Try again or download the PNG.';}
  finally{clearTimeout(timer);worker?.terminate();busy=false;el('downloadGif').disabled=false;}
};
el('shareGif').onclick=async()=>{if(!gifBlob)return;const file=new File([gifBlob],gifName,{type:'image/gif'});try{if(!navigator.canShare?.({files:[file]})){el('actionStatus').textContent='Attach the downloaded GIF in your messaging app.';return;}await navigator.share({files:[file]});}catch(error){if(error.name!=='AbortError')el('actionStatus').textContent='Sharing failed. Attach the downloaded GIF instead.';}};

window.MischiefAnimation=()=>gifBlob?{blob:gifBlob,metadata:gifMetadata}:null;
