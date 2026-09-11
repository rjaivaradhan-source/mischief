// Semantic effects are independent of ingredient order. The expressive subject stays dominant.
globalThis.MischiefComposition = {
  plan(items) {
    const modifiers=new Set(['👑','❄️','🔥','✨','⚡','💤','🌧️','🌦️','☔','💦']);
    const subjects=items.filter(item=>!modifiers.has(item.emoji));
    const base=subjects.find(item=>item.category==='Faces'&&(!item.subgroup||item.subgroup.startsWith('face')))||subjects[0]||items[0];
    let removed=false;const other=items.filter(item=>{if(!removed&&item===base){removed=true;return false;}return true;});
    const effects={crown:other.some(x=>x.emoji==='👑'),frozen:other.some(x=>x.emoji==='❄️'),fire:other.some(x=>x.emoji==='🔥'),sparkle:other.some(x=>x.emoji==='✨'),electric:other.some(x=>x.emoji==='⚡'),sleep:other.some(x=>x.emoji==='💤'),rain:other.some(x=>['🌧️','🌦️','☔','💦'].includes(x.emoji))};
    return {base,effects,accents:other.filter(x=>!modifiers.has(x.emoji))};
  },
  draw(canvas,items) {
    const {base,effects:e,accents}=this.plan(items);const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/512,canvas.height/512);
    const font=' "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    function glyph(target,emoji,x,y,size,angle=0){target.save();target.textAlign='center';target.textBaseline='middle';target.translate(x,y);target.rotate(angle);target.font=size+font;const width=target.measureText(emoji).width;if(width>size*1.15){const fit=size*1.15/width;target.scale(fit,fit);}target.fillText(emoji,0,0);target.restore();}
    const y=e.crown?292:e.fire?300:268,size=e.fire?245:e.crown?277:306;
    if(e.fire)glyph(ctx,'🔥',256,239,404);
    // Tint only the subject's alpha silhouette, retaining facial detail and a transparent background.
    const subject=document.createElement('canvas');subject.width=subject.height=canvas.width;const sc=subject.getContext('2d');sc.scale(canvas.width/512,canvas.height/512);glyph(sc,base.emoji,256,y,size);
    if(e.frozen){sc.globalCompositeOperation='source-atop';const ice=sc.createLinearGradient(130,100,350,420);ice.addColorStop(0,'rgba(233,253,255,0.85)');ice.addColorStop(.4,'rgba(77,191,245,0.48)');ice.addColorStop(.72,'rgba(171,234,255,0.65)');ice.addColorStop(1,'rgba(42,130,216,0.48)');sc.fillStyle=ice;sc.fillRect(0,0,512,512);sc.fillStyle='rgba(244,254,255,.32)';sc.beginPath();sc.moveTo(145,92);sc.lineTo(184,92);sc.lineTo(355,450);sc.lineTo(319,450);sc.closePath();sc.fill();sc.globalCompositeOperation='source-over';}
    if(e.rain){sc.globalCompositeOperation='source-atop';const wet=sc.createLinearGradient(90,130,370,410);wet.addColorStop(0,'rgba(60,114,152,.22)');wet.addColorStop(.45,'rgba(193,235,255,.27)');wet.addColorStop(1,'rgba(45,102,151,.28)');sc.fillStyle=wet;sc.fillRect(0,0,512,512);sc.strokeStyle='rgba(236,251,255,.62)';sc.lineWidth=5;sc.lineCap='round';for(const x of [166,210,319,350]){sc.beginPath();sc.moveTo(x,195);sc.lineTo(x-9,231);sc.stroke();}sc.globalCompositeOperation='source-over';}
    ctx.drawImage(subject,0,0,512,512);
    if(e.rain){ctx.save();ctx.strokeStyle='rgba(87,160,210,.65)';ctx.lineWidth=3;ctx.lineCap='round';for(const [x,ry] of [[121,149],[185,88],[318,94],[402,185],[104,293],[391,350],[192,418],[301,411]]){ctx.beginPath();ctx.moveTo(x,ry);ctx.lineTo(x-9,ry+26);ctx.stroke();}ctx.restore();glyph(ctx,'💧',164,310,44,-.1);glyph(ctx,'💧',345,282,36,.08);glyph(ctx,'💧',291,407,35,0);}
    // A crown overlaps the subject's forehead, rather than floating beside it.
    if(e.crown)glyph(ctx,'👑',256,y-size*.52,192,-.035);
    if(e.frozen){glyph(ctx,'❄️',137,211,57,-.12);glyph(ctx,'❄️',373,304,66,.12);glyph(ctx,'❄️',182,398,40,.08);}
    if(e.sparkle){glyph(ctx,'✨',378,173,82,.05);glyph(ctx,'✨',125,314,49,-.12);}
    if(e.electric){glyph(ctx,'⚡',367,196,97,.12);glyph(ctx,'⚡',143,347,66,-.15);}
    if(e.sleep)glyph(ctx,'💤',365,176,102,-.1);
    const positions=accents.length===1?[[356,357,121,-.16]]:accents.length===2?[[138,220,95,-.16],[365,350,111,.1]]:[[125,211,90,-.12],[383,239,83,.12],[360,366,102,-.1]];
    accents.forEach((item,i)=>glyph(ctx,item.emoji,...positions[i]));ctx.restore();
  }
};
