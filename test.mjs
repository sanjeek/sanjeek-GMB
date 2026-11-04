import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const handler=require('./api/contact.js');
const files=fs.readdirSync('dist').filter(x=>x.endsWith('.html')&&x!=='404.html');
const home=fs.readFileSync('dist/index.html','utf8');
assert.ok(!home.includes('class="trust-strip"'),'Requested trust strip must be removed');
assert.ok(!home.includes('class="hero-note"'),'Small hero badge must be removed');
assert.ok(!home.includes('↗'),'Arrows must use SVG rather than emoji');
assert.ok(home.includes('/assets/refinement.css'),'Editorial stylesheet must load');
assert.ok(home.includes('/assets/interior-1200.webp'),'Opening image must use the new curtain interior');
for(const font of ['InstrumentSerif-Regular.ttf','InstrumentSerif-Italic.ttf','DMSans.ttf'])assert.ok(fs.existsSync('dist/assets/fonts/'+font));
const titles=new Set();
for(const file of files){const html=fs.readFileSync('dist/'+file,'utf8');assert.equal((html.match(/<h1>/g)||[]).length,1,`${file} must have one h1`);assert.ok(html.includes('lang="en-AU"'));assert.ok(html.includes('noindex,nofollow'));const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),'Titles must be unique');titles.add(title);assert.match(html,/<meta name="description" content="[^"]+">/);assert.match(html,/<link rel="canonical"/);const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.ok(schema.some(x=>x['@type']==='HomeGoodsStore'));for(const match of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){const href=match[1];const target=href==='/'?'dist/index.html':href.includes('.')?'dist'+href:'dist'+href+'.html';assert.ok(fs.existsSync(target),`Broken internal link ${href} in ${file}`);}for(const tag of html.matchAll(/<img\b[^>]*>/g)){assert.match(tag[0],/alt="[^"]+"/);assert.match(tag[0],/width="\d+"/);assert.match(tag[0],/height="\d+"/);}}
function response(){return{code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},json(body){this.body=body;return this}}}
const body={name:'Jane Example',email:'jane@example.com',phone:'0400 000 000',suburb:'Cranbourne',message:'Curtains for a bedroom',consultation:'In-home measure & quote',products:['Curtains & sheers'],consent:true,website:''};
const req={method:'POST',headers:{origin:'https://gmb.example',host:'gmb.example'},body};
let res=response();await handler({...req,method:'GET'},res);assert.equal(res.code,405);
res=response();await handler({...req,headers:{origin:'https://evil.example',host:'gmb.example'}},res);assert.equal(res.code,403);
res=response();await handler({...req,body:{...body,email:'invalid'}},res);assert.equal(res.code,400);
res=response();await handler({...req,body:{...body,consent:false}},res);assert.equal(res.code,400);
res=response();await handler({...req,body:{...body,website:'spam'}},res);assert.equal(res.code,400);
res=response();await handler({...req,body:{...body,products:['invented']}},res);assert.equal(res.code,400);
const env={...process.env};delete process.env.RESEND_API_KEY;delete process.env.CONTACT_FROM_EMAIL;delete process.env.CONTACT_TO_EMAIL;
res=response();await handler(req,res);assert.equal(res.code,503);assert.notEqual(res.body.ok,true);
process.env.RESEND_API_KEY='test';process.env.CONTACT_FROM_EMAIL='test@example.com';process.env.CONTACT_TO_EMAIL='destination@example.com';
const originalFetch=globalThis.fetch;let payload;
globalThis.fetch=async(url,options)=>{payload=JSON.parse(options.body);return{ok:true}};
res=response();await handler({...req,body:{...body,message:'<script>alert(1)</script>'}},res);assert.equal(res.code,200);assert.equal(res.body.ok,true);assert.ok(payload.html.includes('&lt;script&gt;'));assert.ok(!payload.html.includes('<script>'));
globalThis.fetch=async()=>({ok:false});res=response();await handler(req,res);assert.equal(res.code,502);
globalThis.fetch=async()=>{throw new Error('timeout')};res=response();await handler(req,res);assert.equal(res.code,502);
globalThis.fetch=originalFetch;for(const key of ['RESEND_API_KEY','CONTACT_FROM_EMAIL','CONTACT_TO_EMAIL']){if(env[key]===undefined)delete process.env[key];else process.env[key]=env[key];}
console.log(`PASS: ${files.length} pages, internal links, unique titles, headings, metadata, image accessibility, structured data and 10 contact API scenarios.`);
