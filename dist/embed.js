(()=>{
  const params=new URLSearchParams(location.search);if(params.get('embed')!=='1'||window.parent===window)return;
  let origin;try{origin=new URL(params.get('parentOrigin')).origin;if(!/^https?:/.test(origin))return;}catch{return;}
  document.body.classList.add('embedded');
  const actions=document.createElement('div');actions.className='embed-actions';
  const insert=document.createElement('button');insert.className='primary';insert.textContent='Use this sticker';
  const insertGif=document.createElement('button');insertGif.className='download';insertGif.textContent='Use generated animation';
  const status=document.createElement('p');status.setAttribute('role','status');status.className='small-note';
  actions.append(insert,insertGif,status);document.querySelector('.result').append(actions);
  function send(sticker){window.parent.postMessage({protocol:'mischief-v1',type:'select',sticker},origin);status.textContent='Added to your composer.';}
  insert.onclick=()=>send(window.MischiefExport());
  insertGif.onclick=async()=>{const animation=window.MischiefAnimation?.();if(!animation){status.textContent='Create your GIF with Download animation first.';return;}const reader=new FileReader();reader.onload=()=>send({...animation.metadata,dataUrl:reader.result,mimeType:'image/gif',width:512,height:512});reader.readAsDataURL(animation.blob);};
  window.addEventListener('message',event=>{if(event.source!==window.parent||event.origin!==origin||event.data?.protocol!=='mischief-v1'||event.data.type!=='configure')return;const {brand,accent}=event.data;if(typeof brand==='string')document.querySelector('.section-top h2').textContent=brand.slice(0,50)+' · Emoji kit';if(typeof accent==='string'&&/^#[0-9a-f]{6}$/i.test(accent))document.documentElement.style.setProperty('--brand-accent',accent);});
  window.parent.postMessage({protocol:'mischief-v1',type:'ready'},origin);
})();
