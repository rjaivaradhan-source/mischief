/** Mischief Web SDK v0.1: mount in an app-owned composer. Self-host these files. */
export function mountMischief(container,{brand='Mischief',accent='#c6fa57',onSelect=()=>{}}={}) {
  if(!(container instanceof HTMLElement))throw new TypeError('Expected a container element');
  const origin=new URL(import.meta.url).origin;
  const url=new URL('./index.html',import.meta.url);url.searchParams.set('embed','1');url.searchParams.set('parentOrigin',location.origin);
  const iframe=document.createElement('iframe');iframe.title=brand+' emoji mixer';iframe.src=url.href;iframe.style.cssText='width:100%;height:780px;border:0;border-radius:16px;background:#f8f9f4';
  iframe.allow='clipboard-write; web-share';
  function onMessage(event){
    if(event.source!==iframe.contentWindow||event.origin!==origin||event.data?.protocol!=='mischief-v1')return;
    if(event.data.type==='ready'){iframe.contentWindow.postMessage({protocol:'mischief-v1',type:'configure',brand:String(brand).slice(0,50),accent},origin);return;}
    if(event.data.type!=='select')return;
    const p=event.data.sticker;
    if(!p||!['image/png','image/gif'].includes(p.mimeType)||typeof p.dataUrl!=='string'||p.dataUrl.length>20_000_000||!p.dataUrl.startsWith('data:'+p.mimeType+';base64,')||typeof p.alt!=='string'||p.alt.length>1000)return;
    try{const bytes=Uint8Array.from(atob(p.dataUrl.split(',')[1]),c=>c.charCodeAt(0));const blob=new Blob([bytes],{type:p.mimeType});onSelect({blob,mimeType:p.mimeType,alt:p.alt,meaning:p.meaning,ingredients:p.ingredients,animated:p.mimeType==='image/gif',width:p.width,height:p.height});}catch(error){console.error('Mischief sticker callback failed',error);}
  }
  window.addEventListener('message',onMessage);container.append(iframe);
  return {iframe,destroy(){window.removeEventListener('message',onMessage);iframe.remove();}};
}
