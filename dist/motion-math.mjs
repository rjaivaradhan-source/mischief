export function motionAt(style, phase) {
  const angle = phase * Math.PI * 2;
  switch (style) {
    case 'bounce': return {x:0,y:-25*(1-Math.cos(angle)),rotation:0,sx:1+.045*Math.cos(angle),sy:1-.055*Math.cos(angle)};
    case 'heartbeat': { const pulse=Math.pow((1+Math.cos(angle))/2,6); return {x:0,y:0,rotation:0,sx:1+.11*pulse,sy:1+.11*pulse}; }
    case 'wiggle': return {x:0,y:0,rotation:.15*Math.sin(angle),sx:1,sy:1};
    case 'float': return {x:10*Math.sin(angle),y:15*Math.cos(angle),rotation:.045*Math.sin(angle),sx:1,sy:1};
    default: return {x:0,y:0,rotation:0,sx:1,sy:1};
  }
}
export function paintMotion(ctx, image, style, phase, size) {
  const m=motionAt(style,phase);
  ctx.clearRect(0,0,size,size); ctx.save();
  ctx.scale(size/512,size/512); ctx.translate(256+m.x,274+m.y);
  ctx.rotate(m.rotation); ctx.scale(.82*m.sx,.82*m.sy);
  ctx.drawImage(image,-256,-256,512,512); ctx.restore();
}
