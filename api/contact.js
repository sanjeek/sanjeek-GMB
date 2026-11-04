const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
 // Same-origin browser requests only. Requests without Origin are rejected.
 const origin=req.headers.origin;
 const host=req.headers['x-forwarded-host']||req.headers.host;
 if(!origin||!host||origin!==`https://${host}`)return res.status(403).json({error:'Invalid origin'});
 const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body||{});
 if(Buffer.byteLength(raw)>12000)return res.status(413).json({error:'Enquiry too large'});
 let data;try{data=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'Invalid request'});}
 if(!data||typeof data!=='object')return res.status(400).json({error:'Invalid enquiry'});
 if(data.website)return res.status(400).json({error:'Invalid enquiry'});
 const limits={name:100,phone:30,email:200,suburb:100,message:3000,consultation:100};
 for(const [key,max] of Object.entries(limits)){if(typeof data[key]!=='string'||data[key].length>max)return res.status(400).json({error:'Please check your enquiry details'});}
 if(!data.name.trim()||!data.phone.trim()||!data.suburb.trim()||!/^\S+@\S+\.\S+$/.test(data.email)||data.consent!==true)return res.status(400).json({error:'Please complete the required fields'});
 const allowed=['Curtains & sheers','Indoor blinds','Plantation shutters','Outdoor blinds','Not sure yet'];
 if(!Array.isArray(data.products)||data.products.length>5||data.products.some(p=>!allowed.includes(p)))return res.status(400).json({error:'Invalid product selection'});
 const key=process.env.RESEND_API_KEY,from=process.env.CONTACT_FROM_EMAIL,to=process.env.CONTACT_TO_EMAIL;
 if(!key||!from||!to)return res.status(503).json({error:'Online enquiry delivery is not configured'});
 const fields=[['Name',data.name],['Phone',data.phone],['Email',data.email],['Suburb/postcode',data.suburb],['Products',data.products.join(', ')||'Advice needed'],['Consultation',data.consultation],['Message',data.message]];
 try{const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:data.email,subject:'New GMB website enquiry',text:fields.map(([label,value])=>`${label}: ${value}`).join('\n'),html:fields.map(([label,value])=>`<p><strong>${label}</strong><br>${escapeHTML(value).replaceAll('\n','<br>')}</p>`).join('')}),signal:AbortSignal.timeout(10000)});if(!response.ok)return res.status(502).json({error:'Email service unavailable'});return res.status(200).json({ok:true});}catch{return res.status(502).json({error:'Email service unavailable'});}
};
