import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 if(pathname==='/api/contact'){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Email delivery is not configured in local preview'}));}
 let file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 if(!path.extname(file))file+='.html';let status=200;if(!fs.existsSync(file)||!fs.statSync(file).isFile()){file=path.join(root,'404.html');status=404;}
 res.writeHead(status,{'Content-Type':({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'})[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('GMB preview on port '+(process.env.PORT||3000)));
