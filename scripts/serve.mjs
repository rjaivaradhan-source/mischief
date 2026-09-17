import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||4180);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8'};
export function resolveAsset(url){const pathname=decodeURIComponent(new URL(url,'http://localhost').pathname);const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(path.resolve(root)+path.sep))return null;return file;}
export const server=http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'}).end();return;}
  try{const file=resolveAsset(req.url);if(!file){res.writeHead(403).end();return;}const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);}
  catch(error){res.writeHead(error.code==='ENOENT'||error.code==='EISDIR'?404:400).end('File unavailable');}
});
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT must be an integer from 1 to 65535');
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Choose another PORT.`:error.message);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`Mischief: http://127.0.0.1:${port}\nPress Ctrl+C to stop.`));
}
