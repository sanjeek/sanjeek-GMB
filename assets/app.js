'use strict';
const menuToggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
function closeMobile(){if(!menuToggle||!mobileMenu)return;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');mobileMenu.hidden=true;document.body.classList.remove('menu-open');}
menuToggle?.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');mobileMenu.hidden=open;document.body.classList.toggle('menu-open',!open);});
const productButton=document.querySelector('.nav-products button');
const productMenu=document.querySelector('#product-menu');
function closeProducts(){if(!productButton||!productMenu)return;productButton.setAttribute('aria-expanded','false');productMenu.hidden=true;}
productButton?.addEventListener('click',()=>{const open=productButton.getAttribute('aria-expanded')==='true';productButton.setAttribute('aria-expanded',String(!open));productMenu.hidden=open;});
document.addEventListener('click',event=>{if(!event.target.closest('.nav-products'))closeProducts();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){const mobileOpen=menuToggle?.getAttribute('aria-expanded')==='true';const productsOpen=productButton?.getAttribute('aria-expanded')==='true';closeMobile();closeProducts();if(mobileOpen)menuToggle.focus();else if(productsOpen)productButton.focus();}if(event.key==='Tab'&&menuToggle?.getAttribute('aria-expanded')==='true'){const focusable=[menuToggle,...mobileMenu.querySelectorAll('a')];const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
window.matchMedia('(max-width: 800px)').addEventListener('change',e=>{if(!e.matches)closeMobile();});
for(const link of document.querySelectorAll('.mobile-menu a'))link.addEventListener('click',closeMobile);
for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{const filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=filter!=='0'&&card.dataset.category!==filter;});});
const form=document.querySelector('#enquiry-form');
if(form){const choice=new URLSearchParams(location.search).get('product');if(choice){const checkbox=[...form.querySelectorAll('input[name=products]')].find(x=>x.value===choice);if(checkbox)checkbox.checked=true;else form.elements.message.value='I’m interested in '+choice+'.';}
form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button[type=submit]');const status=document.querySelector('#form-status');const fallback=document.querySelector('#email-fallback');const data=new FormData(form);const enquiry={name:data.get('name').trim(),phone:data.get('phone').trim(),email:data.get('email').trim(),suburb:data.get('suburb').trim(),products:data.getAll('products'),consultation:data.get('consultation'),message:data.get('message').trim(),website:data.get('website'),consent:data.get('consent')==='on'};
const body=`Name: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email}\nSuburb/postcode: ${enquiry.suburb}\nInterested in: ${enquiry.products.join(', ')||'Advice needed'}\nConsultation: ${enquiry.consultation}\n\n${enquiry.message}`;
document.querySelector('#email-draft').href='mailto:info@gmbcurtainsandblinds.com.au?subject='+encodeURIComponent('Website enquiry - '+enquiry.name)+'&body='+encodeURIComponent(body);
button.disabled=true;status.textContent='Sending your enquiry…';fallback.hidden=true;try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(enquiry),signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok||result.ok!==true)throw new Error(result.error||'Delivery unavailable');status.textContent='Thank you. Your enquiry has been sent to the GMB team. If you need to reach us sooner, call 0426 598 500.';form.reset();}catch(error){status.textContent='Your enquiry has not been sent online. Please use the email option below or call 0426 598 500.';fallback.hidden=false;}finally{button.disabled=false;}});}

// Motion is an enhancement: content stays visible if JavaScript is unavailable.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const homeHero=document.querySelector('.hero');
const carousel=document.querySelector('.hero-carousel');
if(carousel){
 const slides=[...carousel.querySelectorAll('.hero-slide')];
 const controls=carousel.querySelector('.carousel-controls');
 const dots=[...carousel.querySelectorAll('[data-slide-to]')];
 const pause=carousel.querySelector('.carousel-pause');
 const status=carousel.querySelector('.carousel-status');
 const count=document.querySelector('.hero-slide-count');
 const destination=document.querySelector('.hero-image-link');
 let current=0,timer=null,userPaused=false,hovered=false,focused=false,inView=true,changeId=0;
 const stop=()=>{clearTimeout(timer);timer=null;};
 const shouldRotate=()=>!motionPreference.matches&&!userPaused&&!hovered&&!focused&&inView&&!document.hidden;
 function sync(){stop();const rotating=shouldRotate();carousel.classList.toggle('is-paused',!rotating);carousel.classList.toggle('motion-enabled',!motionPreference.matches);pause.setAttribute('aria-label',userPaused?'Resume image rotation':'Pause image rotation');pause.firstElementChild.textContent=userPaused?'▶':'Ⅱ';pause.hidden=motionPreference.matches;if(rotating)timer=setTimeout(()=>show((current+1)%slides.length,false),7000);}
 async function show(index,manual){if(index===current){if(manual){userPaused=true;sync();}return;}const request=++changeId;stop();const image=slides[index].querySelector('img');image.loading='eager';try{if(!image.complete)await image.decode();if(!image.naturalWidth)throw new Error('Image unavailable');}catch{if(request===changeId){sync();}return;}if(request!==changeId)return;if(!manual&&!shouldRotate()){sync();return;}slides[current].classList.remove('is-active');slides[current].setAttribute('aria-hidden','true');current=index;slides[current].classList.add('is-active');slides[current].setAttribute('aria-hidden','false');dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));count.textContent=String(current+1).padStart(2,'0')+' / 04';destination.href=slides[current].dataset.url;destination.firstElementChild.textContent=slides[current].dataset.title;if(manual){userPaused=true;status.textContent='Image '+(current+1)+' of '+slides.length+': '+slides[current].dataset.title;}sync();}
 controls.hidden=false;
 dots.forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.slideTo),true)));
 pause.addEventListener('click',()=>{userPaused=!userPaused;sync();});
 carousel.addEventListener('mouseenter',()=>{hovered=true;sync();});carousel.addEventListener('mouseleave',()=>{hovered=false;sync();});
 const imageArea=carousel.closest('.hero-image');imageArea.addEventListener('focusin',()=>{focused=true;sync();});imageArea.addEventListener('focusout',event=>{if(!imageArea.contains(event.relatedTarget)){focused=false;sync();}});
 document.addEventListener('visibilitychange',sync);motionPreference.addEventListener('change',sync);
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:.15});observer.observe(carousel);}
 if(!motionPreference.matches)homeHero.classList.add('motion-ready');sync();
}
if(homeHero&&'IntersectionObserver'in window){
 const targets=[...document.querySelectorAll('.collection .section-heading,.collection-card,.story-copy,.process-title,.steps article,.faq-section>div,.showroom-bar')];
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 if(!motionPreference.matches)targets.forEach((element,index)=>{if(element.getBoundingClientRect().top>window.innerHeight){element.classList.add('reveal-ready');element.style.setProperty('--reveal-delay',(index%2)*90+'ms');observer.observe(element);}});
 motionPreference.addEventListener('change',event=>{if(event.matches){observer.disconnect();targets.forEach(element=>element.classList.add('is-visible'));homeHero.classList.remove('motion-ready');}});
}
