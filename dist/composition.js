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
  draw(canvas,items,phase=null) {
    const {base,effects:e,accents}=this.plan(items);const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/512,canvas.height/512);
    const font=' "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    const animated=phase!==null,t=(phase||0)*Math.PI*2;
    function glyph(target,emoji,x,y,size,angle=0){target.save();target.textAlign='left';target.textBaseline='alphabetic';let sx=1,sy=1;if(animated){if(emoji==='🔥'){sx=1+.02*Math.sin(t*2);sy=1+.03*Math.cos(t*2);angle+=.012*Math.sin(t*2);}else if(emoji==='❄️'){y+=6*Math.sin(t+x);angle+=t;size*=1+.05*Math.sin(t+y);}else if(emoji==='💧'){y+=10*Math.sin(t+x);sx=.88;sy=1.12;}else if(emoji==='✨'){size*=1+.08*Math.sin(t+x);angle+=.13*Math.sin(t);}else if(emoji==='⚡'){size*=1+.08*Math.sin(t*2);}else if(emoji==='💤'){y-=15*(1-Math.cos(t));size*=1+.12*Math.sin(t);}else if(emoji==='❤️'||emoji==='💋'){sx=sy=1+.14*Math.pow((1+Math.cos(t*2))/2,4);}if(emoji===base.emoji){if(e.frozen){x+=2*Math.sin(t*4);angle+=.008*Math.sin(t*4);}else if(e.sleep){sy=1+.012*(1+Math.sin(t))/2;}else if(!e.crown){angle+=.012*Math.sin(t);sy=1+.012*(1+Math.sin(t))/2;}}}target.translate(x,y);target.rotate(angle);target.scale(sx,sy);target.font=size+'px'+font;const m=target.measureText(emoji);const left=m.actualBoundingBoxLeft||0,right=m.actualBoundingBoxRight||m.width,ascent=m.actualBoundingBoxAscent||size*.8,descent=m.actualBoundingBoxDescent||size*.2;const fit=size/Math.max(left+right,ascent+descent,1);target.scale(fit,fit);target.fillText(emoji,(left-right)/2,(ascent-descent)/2);target.restore();}
    const y=e.crown?292:e.fire?302:268,size=e.fire?258:e.crown?292:308;
    if(e.fire)glyph(ctx,'🔥',256,251,398);
    // Tint only the subject's alpha silhouette, retaining facial detail and a transparent background.
    const subject=document.createElement('canvas');subject.width=subject.height=canvas.width;const sc=subject.getContext('2d');sc.scale(canvas.width/512,canvas.height/512);glyph(sc,base.emoji,256,y,size);
    if(e.frozen){sc.globalCompositeOperation='source-atop';const ice=sc.createLinearGradient(130,100,350,420);ice.addColorStop(0,'rgba(233,253,255,0.55)');ice.addColorStop(.4,'rgba(77,191,245,0.32)');ice.addColorStop(.72,'rgba(171,234,255,0.42)');ice.addColorStop(1,'rgba(42,130,216,0.32)');sc.fillStyle=ice;sc.fillRect(0,0,512,512);sc.fillStyle='rgba(244,254,255,.18)';sc.beginPath();sc.moveTo(145,92);sc.lineTo(184,92);sc.lineTo(355,450);sc.lineTo(319,450);sc.closePath();sc.fill();sc.globalCompositeOperation='source-over';}
    if(e.rain){sc.globalCompositeOperation='source-atop';const wet=sc.createLinearGradient(90,130,370,410);wet.addColorStop(0,'rgba(60,114,152,.22)');wet.addColorStop(.45,'rgba(193,235,255,.27)');wet.addColorStop(1,'rgba(45,102,151,.28)');sc.fillStyle=wet;sc.fillRect(0,0,512,512);sc.strokeStyle='rgba(236,251,255,.62)';sc.lineWidth=5;sc.lineCap='round';for(const x of [155,352]){sc.beginPath();sc.moveTo(x,195);sc.lineTo(x-9,231);sc.stroke();}sc.globalCompositeOperation='source-over';}
    ctx.drawImage(subject,0,0,512,512);
    if(e.rain){ctx.save();ctx.strokeStyle='rgba(87,160,210,.75)';ctx.lineWidth=3;ctx.lineCap='round';for(const [x,ry] of [[128,142],[199,99],[326,116],[391,210],[119,312],[371,369]]){const fall=animated?80+((ry-80+phase*340)%340):ry;ctx.beginPath();ctx.moveTo(x,fall);ctx.lineTo(x-9,fall+26);ctx.stroke();}ctx.restore();glyph(ctx,'💧',149,299,33,-.1);glyph(ctx,'💧',362,330,30,.08);}
    // A crown overlaps the subject's forehead, rather than floating beside it.
    if(e.crown){glyph(ctx,'👑',256+(animated&&e.frozen?2*Math.sin(t*4):0),y-size*.44,205,-.025);if(animated){ctx.save();ctx.globalAlpha=.25+.65*Math.pow((1+Math.sin(t))/2,3);glyph(ctx,'✨',316,y-size*.44-43,27);ctx.restore();}}
    if(e.frozen){glyph(ctx,'❄️',132,217,39,-.12);glyph(ctx,'❄️',370,341,45,.12);}
    if(e.sparkle){glyph(ctx,'✨',373,184,62,.05);glyph(ctx,'✨',128,322,32,-.12);}
    if(e.electric){glyph(ctx,'⚡',367,196,97,.12);glyph(ctx,'⚡',143,347,66,-.15);}
    if(e.sleep)glyph(ctx,'💤',365,176,102,-.1);
    const positions=accents.length===1?[[351,351,105,-.10]]:accents.length===2?[[138,220,95,-.16],[365,350,111,.1]]:[[125,211,90,-.12],[383,239,83,.12],[360,366,102,-.1]];
    accents.forEach((item,i)=>{if(items.length===2&&base.category==='Faces'&&item.emoji==='❤️'){glyph(ctx,item.emoji,136,229,65,-.18);glyph(ctx,item.emoji,372,196,78,.15);}else glyph(ctx,item.emoji,...positions[i]);});ctx.restore();
  }
};
