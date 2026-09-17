// Device-local UI preferences only. Embedded kits do not share the standalone draft.
globalThis.MischiefDraft={
  key:'mischief-draft-v1',
  sanitize(value){
    if(!value||typeof value!=='object')return {};
    const result={};
    if(Array.isArray(value.emojis)&&value.emojis.length>=2&&value.emojis.length<=4&&value.emojis.every(x=>typeof x==='string'&&x.length<=50))result.emojis=value.emojis;
    if(['auto','bounce','heartbeat','wiggle','float'].includes(value.motion))result.motion=value.motion;
    if(typeof value.playing==='boolean')result.playing=value.playing;
    return result;
  },
  read(){try{if(window.self!==window.top)return {};return this.sanitize(JSON.parse(localStorage.getItem(this.key)||'{}'));}catch{return {};}},
  save(patch){try{if(window.self!==window.top)return;localStorage.setItem(this.key,JSON.stringify(this.sanitize({...this.read(),...patch})));}catch{/* Browsers may disable storage. Mixing still works. */}}
};
