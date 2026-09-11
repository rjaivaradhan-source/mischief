export function motionAt(style, phase) {
  const angle = phase * Math.PI * 2;
  switch (style) {
    case 'bounce': return {x:0,y:-6*(1-Math.cos(angle)),rotation:0,sx:1,sy:1};
    case 'heartbeat': { const pulse=Math.pow((1+Math.cos(angle))/2,3); return {x:0,y:0,rotation:0,sx:1+.035*pulse,sy:1+.035*pulse}; }
    case 'wiggle': return {x:0,y:0,rotation:.035*Math.sin(angle),sx:1,sy:1};
    case 'float': return {x:3*Math.sin(angle),y:5*Math.cos(angle),rotation:.015*Math.sin(angle),sx:1,sy:1};
    case 'rain': return {x:0,y:4*Math.cos(angle),rotation:.015*Math.sin(angle),sx:1,sy:1};
    default: return {x:0,y:0,rotation:0,sx:1,sy:1};
  }
}
export function paintMotion(ctx, image, style, phase, size) {
  const m=motionAt(style,phase);
  ctx.clearRect(0,0,size,size); ctx.save();
  ctx.scale(size/512,size/512); ctx.translate(256+m.x,256+m.y);
  ctx.rotate(m.rotation); ctx.scale(m.sx,m.sy);
  ctx.drawImage(image,-256,-256,512,512); ctx.restore();
  if(style==='rain'){ctx.save();ctx.scale(size/512,size/512);ctx.strokeStyle='rgba(81,159,218,.65)';ctx.lineWidth=2.5;ctx.lineCap='round';for(let i=0;i<14;i++){const y=90+((phase+i/14)%1)*334,x=110+(i*47)%294;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7,y+20);ctx.stroke();}ctx.restore();}
}
