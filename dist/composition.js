// Semantic effects are independent of ingredient order. The expressive subject stays dominant.
globalThis.MischiefComposition = {
  plan(items) {
    // Collapse repeats and use a single established glyph for unambiguous emotional pairs.
    items=items.filter((item,i)=>items.findIndex(x=>x.emoji===item.emoji)===i);
    const pairs=[['❤️','🔥','❤️‍🔥'],['😊','❤️','🥰'],['😊','💋','😘'],['😊','😭','🥲']];
    const fusion=items.length===2?pairs.find(([a,b])=>items.some(x=>x.emoji===a)&&items.some(x=>x.emoji===b)):null;
    const families={crown:['👑'],frozen:['❄️','🧊','🌨️','☃️','⛄'],fire:['🔥','🌋'],sparkle:['✨','🌟'],electric:['⚡','🌩️','⛈️'],sleep:['💤'],rain:['🌧️','🌦️','☔','☂️','💦','💧','⛈️'],wave:['🌊'],heat:['☀️','🌞','🌡️'],wind:['🌬️','💨','🌪️'],fog:['🌫️'],cloud:['☁️','🌥️','⛅'],rainbow:['🌈'],night:['🌙','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘']};
    const modifiers=new Set(Object.values(families).flat());
    const subjects=items.filter(item=>!modifiers.has(item.emoji));
    const base=subjects.find(item=>item.category==='Faces'&&(!item.subgroup||item.subgroup.startsWith('face')))||subjects[0]||items[0];
    let removed=false;const other=items.filter(item=>{if(!removed&&item===base){removed=true;return false;}return true;});
    const effects=Object.fromEntries(Object.entries(families).map(([effect,emojis])=>[effect,other.some(x=>emojis.includes(x.emoji))]));
    return {base,effects,renderEmoji:fusion?.[2]||base.emoji,integratedFire:fusion?.[2]==='❤️‍🔥',accents:fusion?[]:other.filter(x=>!modifiers.has(x.emoji))};
  },
  draw(canvas,items,phase=null) {
    const {base,effects:e,accents,renderEmoji,integratedFire}=this.plan(items);const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/512,canvas.height/512);
    const font=' "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    const animated=phase!==null,t=(phase||0)*Math.PI*2;
    function glyph(target,emoji,x,y,size,angle=0){target.save();target.textAlign='left';target.textBaseline='alphabetic';let sx=1,sy=1;if(animated){if(emoji==='🔥'){sx=1+.02*Math.sin(t*2);sy=1+.03*Math.cos(t*2);angle+=.012*Math.sin(t*2);}else if(emoji==='❄️'){y+=6*Math.sin(t+x);angle+=t;size*=1+.05*Math.sin(t+y);}else if(emoji==='💧'){y+=10*Math.sin(t+x);sx=.88;sy=1.12;}else if(emoji==='✨'){size*=1+.08*Math.sin(t+x);angle+=.13*Math.sin(t);}else if(emoji==='⚡'){size*=1+.08*Math.sin(t*2);}else if(emoji==='💤'){y-=15*(1-Math.cos(t));size*=1+.12*Math.sin(t);}else if(emoji==='❤️'||emoji==='💋'||emoji==='❤️‍🔥'){sx=sy=1+.04*Math.pow((1+Math.cos(t*2))/2,4);}if(emoji===renderEmoji){if(e.frozen){x+=2*Math.sin(t*4);angle+=.008*Math.sin(t*4);}else if(e.sleep){sy=1+.012*(1+Math.sin(t))/2;}else if(!e.crown){angle+=.012*Math.sin(t);sy=1+.012*(1+Math.sin(t))/2;}}}target.translate(x,y);target.rotate(angle);target.scale(sx,sy);target.font=size+'px'+font;const m=target.measureText(emoji);const left=m.actualBoundingBoxLeft||0,right=m.actualBoundingBoxRight||m.width,ascent=m.actualBoundingBoxAscent||size*.8,descent=m.actualBoundingBoxDescent||size*.2;const fit=size/Math.max(left+right,ascent+descent,1);target.scale(fit,fit);target.fillText(emoji,(left-right)/2,(ascent-descent)/2);target.restore();return {width:(left+right)*fit,height:(ascent+descent)*fit};}
    const layeredFire=e.fire&&!integratedFire;
    const y=e.crown?310:layeredFire||e.electric?292:268,size=e.crown?292:308;
    if(e.rainbow)glyph(ctx,'🌈',256,221,388);
    if(e.cloud)glyph(ctx,'☁️',255,318,398);
    if(layeredFire)glyph(ctx,'🔥',256,251,398);
    // Tint only the subject's alpha silhouette, retaining facial detail and a transparent background.
    const subject=document.createElement('canvas');subject.width=subject.height=canvas.width;const sc=subject.getContext('2d');sc.scale(canvas.width/512,canvas.height/512);const subjectBounds=glyph(sc,renderEmoji,256,y,size,e.wind&&!e.crown?.065+(animated?.02*Math.sin(t):0):0);
    if(e.frozen){sc.globalCompositeOperation='source-atop';const ice=sc.createLinearGradient(130,100,350,420);ice.addColorStop(0,'rgba(233,253,255,0.55)');ice.addColorStop(.4,'rgba(77,191,245,0.32)');ice.addColorStop(.72,'rgba(171,234,255,0.42)');ice.addColorStop(1,'rgba(42,130,216,0.32)');sc.fillStyle=ice;sc.fillRect(0,0,512,512);sc.fillStyle='rgba(244,254,255,.18)';sc.beginPath();sc.moveTo(145,92);sc.lineTo(184,92);sc.lineTo(355,450);sc.lineTo(319,450);sc.closePath();sc.fill();sc.globalCompositeOperation='source-over';}
    if(e.heat||layeredFire){sc.save();sc.globalCompositeOperation='source-atop';const warmth=sc.createLinearGradient(120,130,330,430);warmth.addColorStop(0,'rgba(255,182,25,.12)');warmth.addColorStop(1,'rgba(235,66,27,.28)');sc.fillStyle=warmth;sc.fillRect(0,0,512,512);sc.restore();}
    if(e.wave){sc.save();sc.globalCompositeOperation='source-atop';const water=sc.createLinearGradient(0,y-40,0,y+size/2);water.addColorStop(0,'rgba(64,183,231,.08)');water.addColorStop(1,'rgba(34,139,215,.53)');sc.fillStyle=water;sc.fillRect(0,0,512,512);sc.restore();}
    if(e.rainbow){sc.save();sc.globalCompositeOperation='source-atop';const rainbow=sc.createLinearGradient(100,120,400,420);['rgba(255,105,129,.19)','rgba(255,199,65,.12)','rgba(85,218,166,.17)','rgba(100,156,255,.2)','rgba(190,130,241,.22)'].forEach((color,i)=>rainbow.addColorStop(i/4,color));sc.fillStyle=rainbow;sc.fillRect(0,0,512,512);sc.restore();}
    if(e.night){sc.save();sc.globalCompositeOperation='source-atop';const night=sc.createLinearGradient(80,100,360,400);night.addColorStop(0,'rgba(104,112,196,.36)');night.addColorStop(1,'rgba(57,63,129,.24)');sc.fillStyle=night;sc.fillRect(0,0,512,512);sc.restore();}
    if(e.fog){sc.save();sc.globalCompositeOperation='source-atop';sc.fillStyle='rgba(215,226,232,.25)';sc.fillRect(0,0,512,512);sc.restore();}
    if(e.electric){sc.save();sc.globalCompositeOperation='source-atop';const charge=animated?Math.pow(Math.max(0,Math.cos(t)),12):.7;sc.fillStyle='rgba(255,238,135,'+(.05+.2*charge)+')';sc.fillRect(0,0,512,512);sc.restore();}
    if(e.rain){sc.globalCompositeOperation='source-atop';const wet=sc.createLinearGradient(90,130,370,410);wet.addColorStop(0,'rgba(60,114,152,.22)');wet.addColorStop(.45,'rgba(193,235,255,.27)');wet.addColorStop(1,'rgba(45,102,151,.28)');sc.fillStyle=wet;sc.fillRect(0,0,512,512);sc.strokeStyle='rgba(236,251,255,.62)';sc.lineWidth=5;sc.lineCap='round';for(const x of [155,352]){sc.beginPath();sc.moveTo(x,195);sc.lineTo(x-9,231);sc.stroke();}sc.globalCompositeOperation='source-over';}
    // A soft contact shadow is clipped to the head under the crown's lower rim.
    if(e.crown){sc.save();sc.globalCompositeOperation='source-atop';sc.fillStyle='rgba(88,45,4,.22)';sc.filter='blur(5px)';sc.beginPath();sc.ellipse(256,y-subjectBounds.height/2+size*.12+3,size*.28,7,0,0,Math.PI*2);sc.fill();sc.restore();}
    ctx.drawImage(subject,0,0,512,512);
    if(e.rain){ctx.save();ctx.strokeStyle='rgba(87,160,210,.75)';ctx.lineWidth=3;ctx.lineCap='round';for(const [x,ry] of [[128,142],[199,99],[326,116],[391,210],[119,312],[371,369]]){const fall=animated?80+((ry-80+phase*340)%340):ry;ctx.globalAlpha=animated?Math.sin(Math.PI*(fall-80)/340)**2:1;ctx.beginPath();ctx.moveTo(x,fall);ctx.lineTo(x-9,fall+26);ctx.stroke();}ctx.restore();glyph(ctx,'💧',149,299,33,-.1);glyph(ctx,'💧',362,330,30,.08);}
    // A crown overlaps the subject's forehead, rather than floating beside it.
    if(e.crown){const crownSize=size*.66;ctx.font=crownSize+'px'+font;const cm=ctx.measureText('👑'),cw=(cm.actualBoundingBoxLeft||0)+(cm.actualBoundingBoxRight||cm.width),ch=(cm.actualBoundingBoxAscent||crownSize*.8)+(cm.actualBoundingBoxDescent||crownSize*.2);const crownHeight=ch*crownSize/Math.max(cw,ch,1);const crownY=y-subjectBounds.height/2+size*.12-crownHeight/2;glyph(ctx,'👑',256+(animated&&e.frozen?2*Math.sin(t*4):0),crownY,crownSize,0);if(animated){ctx.save();ctx.globalAlpha=.25+.65*Math.pow((1+Math.sin(t))/2,3);glyph(ctx,'✨',306,crownY-crownHeight*.23,23);ctx.restore();}}
    if(e.frozen){glyph(ctx,'❄️',132,217,39,-.12);glyph(ctx,'❄️',370,341,45,.12);}
    if(e.sparkle){glyph(ctx,'✨',373,184,62,.05);glyph(ctx,'✨',128,322,32,-.12);}
    if(e.electric){const charge=animated?Math.pow(Math.max(0,Math.cos(t)),12):.8;const hitY=e.crown?115:y-subjectBounds.height/2+24;const hitX=e.crown?309:271;ctx.save();ctx.globalAlpha=.65+.35*charge;ctx.shadowColor='rgba(255,208,43,.65)';ctx.shadowBlur=8+12*charge;glyph(ctx,'⚡',hitX+22,hitY-56,e.crown?115:152,.08);ctx.shadowBlur=0;ctx.globalAlpha=.25+.65*charge;glyph(ctx,'✨',hitX,hitY,38,0);ctx.restore();}
    if(e.heat){glyph(ctx,'💧',367,245,43,.08);ctx.save();ctx.strokeStyle='rgba(215,139,57,.52)';ctx.lineWidth=3;ctx.lineCap='round';for(const x of [140,366]){const drift=animated?8*Math.sin(t+x):0;ctx.beginPath();ctx.moveTo(x,173+drift);ctx.bezierCurveTo(x-15,155+drift,x+15,139+drift,x,123+drift);ctx.stroke();}ctx.restore();}
    if(e.wave){ctx.save();ctx.strokeStyle='rgba(87,195,235,.9)';ctx.lineWidth=9;ctx.lineCap='round';const waterY=y+size*.37+(animated?4*Math.sin(t):0);ctx.beginPath();ctx.moveTo(134,waterY);ctx.bezierCurveTo(195,waterY-17,221,waterY+17,263,waterY);ctx.bezierCurveTo(310,waterY-17,343,waterY+17,380,waterY);ctx.stroke();ctx.restore();glyph(ctx,'💧',373,327,31,.2);}
    if(e.wind){ctx.save();ctx.strokeStyle='rgba(119,155,172,.67)';ctx.lineWidth=4;ctx.lineCap='round';for(const [x,wy,length] of [[93,180,80],[335,282,77],[110,380,72]]){const drift=animated?12*Math.sin(t+wy):0;ctx.beginPath();ctx.moveTo(x+drift,wy);ctx.bezierCurveTo(x+length*.35+drift,wy-10,x+length*.6+drift,wy+8,x+length+drift,wy-3);ctx.stroke();}ctx.restore();}
    if(e.fog||e.cloud){ctx.save();ctx.globalAlpha=e.fog?.42:.75;glyph(ctx,'☁️',238+(animated?8*Math.sin(t):0),y+size*.4,e.fog?295:180);ctx.restore();}
    if(e.night){glyph(ctx,'🌙',369,165,67,.12);glyph(ctx,'✨',137,231,27);}
    if(e.sleep)glyph(ctx,'💤',365,176,102,-.1);
    const positions=accents.length===1?[[351,351,105,-.10]]:accents.length===2?[[138,220,95,-.16],[365,350,111,.1]]:[[125,211,90,-.12],[383,239,83,.12],[360,366,102,-.1]];
    accents.forEach((item,i)=>{if(items.length===2&&base.category==='Faces'&&item.emoji==='❤️'){glyph(ctx,item.emoji,136,229,65,-.18);glyph(ctx,item.emoji,372,196,78,.15);}else glyph(ctx,item.emoji,...positions[i]);});ctx.restore();
  }
};
