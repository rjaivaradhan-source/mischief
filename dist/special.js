// Original pre-rendered artwork. No network AI calls or replacement of the Unicode catalog.
(() => {
  const entries = [
    {id:'thinking-king', name:'Thinking king', pair:['🤔','👑'], effect:'crown', mood:'A thoughtful decision', motion:'thoughtful'},
    {id:'frozen-smile', name:'Frozen smile', pair:['😊','❄️'], effect:'frozen', mood:'Happy, even in the cold', motion:'chill'},
    {id:'burning-heart', name:'Burning heart', pair:['❤️','🔥'], effect:'fire', mood:'Love with intensity', motion:'warm'},
    {id:'loved-up', name:'Loved up', pair:['😊','❤️'], effect:null, mood:'Feeling loved', motion:'gentle'},
    {id:'rainy-days', name:'Rainy days', pair:['😭','🌧️'], effect:'rain', mood:'A heavy-hearted day', motion:'gentle'},
    {id:'fiery-mood', name:'Fiery mood', pair:['😡','🔥'], effect:'fire', mood:'Running out of patience', motion:'warm'}
  ];
  const aliases = {crown:['👑'],frozen:['❄️','🧊','🌨️','☃️','⛄'],fire:['🔥','🌋'],rain:['🌧️','🌦️','☔','☂️','💦','💧','⛈️']};
  const baseURL = typeof document !== 'undefined' && document.currentScript ? new URL('.',document.currentScript.src).href : '';
  const records = new Map();
  const api = globalThis.MischiefSpecial = {
    entries, enabled:true,
    match(items,base) {
      if(!this.enabled)return null;
      const emojis=items.map(x=>x.emoji);
      // Keep the planner's dominant expression. Never turn an angry face into a happy one.
      return entries.find(entry=>entry.pair[0]===base.emoji && emojis.includes(entry.pair[0]) &&
        (entry.effect ? aliases[entry.effect].some(x=>emojis.includes(x)) : emojis.includes(entry.pair[1]))) || null;
    },
    record(entry){return entry ? records.get(entry.id) : null;},
    async ensure(items){
      const plan=globalThis.MischiefComposition.plan(items), entry=this.match(items,plan.base);
      if(entry)await records.get(entry.id)?.promise;
    },
    draw(target,record,x,y,size,phase) {
      const {image,bounds,entry}=record;
      const fit=size/Math.max(bounds.w,bounds.h), w=bounds.w*fit,h=bounds.h*fit;
      const t=(phase||0)*Math.PI*2;
      target.save();target.translate(x,y);
      if(phase!==null){
        target.translate(entry.motion==='chill'?.65*Math.sin(t*4):0,entry.motion==='warm'?-1.5*Math.sin(t*2):2*Math.sin(t));
        target.rotate(entry.motion==='thoughtful'?.007*Math.sin(t):0);
      }
      target.drawImage(image,bounds.x,bounds.y,bounds.w,bounds.h,-w/2,-h/2,w,h);
      target.restore();return {width:w,height:h};
    }
  };
  if(typeof Image==='undefined'){api.ready=Promise.resolve();return;}
  // Read alpha bounds once so inconsistent transparent padding never makes a character tiny.
  function boundsFor(image){
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let left=canvas.width,top=canvas.height,right=-1,bottom=-1;
    for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]>24){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    if(right<0)throw Error('Empty artwork');
    left=Math.max(0,left-3);top=Math.max(0,top-3);right=Math.min(canvas.width-1,right+3);bottom=Math.min(canvas.height-1,bottom+3);
    return {x:left,y:top,w:right-left+1,h:bottom-top+1};
  }
  for(const entry of entries){
    const image=new Image(),record={entry,image,state:'loading'};records.set(entry.id,record);
    record.promise=new Promise(resolve=>{
      let finished=false;
      const finish=state=>{if(finished)return;finished=true;clearTimeout(timer);record.state=state;resolve();globalThis.dispatchEvent(new Event('mischief:artwork'));};
      const timer=setTimeout(()=>finish('failed'),12000);
      image.onload=()=>{try{record.bounds=boundsFor(image);finish('ready');}catch{finish('failed');}};
      image.onerror=()=>finish('failed');
      image.src=baseURL+'special/'+entry.id+'.png';
    });
  }
  api.ready=Promise.all([...records.values()].map(record=>record.promise));
})();
