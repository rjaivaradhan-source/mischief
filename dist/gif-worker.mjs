import { GIFEncoder, quantize, applyPalette } from './vendor/gifenc.mjs';
let encoder, count=0;
self.onmessage=({data})=>{
  try {
    if(data.type==='start'){encoder=GIFEncoder();count=0;return;}
    if(data.type==='frame'){
      const rgba=new Uint8ClampedArray(data.pixels);
      const colors=quantize(rgba,255,{format:'rgb565'});
      const index=applyPalette(rgba,colors,'rgb565');
      for(let i=0;i<index.length;i++)index[i]=rgba[i*4+3]<128?0:index[i]+1;
      encoder.writeFrame(index,data.size,data.size,{palette:[[0,0,0],...colors],delay:data.delay||80,repeat:0,transparent:true,transparentIndex:0,dispose:2});
      self.postMessage({type:'progress',count:++count});return;
    }
    if(data.type==='finish'){encoder.finish();const bytes=encoder.bytes();self.postMessage({type:'done',bytes},[bytes.buffer]);encoder=null;}
  }catch(error){self.postMessage({type:'error',message:error.message});}
};
