const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),pickOne=a=>a[Math.floor(Math.random()*a.length)];
const ic=(n,c='')=>`<svg class="i ${c}"><use href="#i-${n}"/></svg>`;
const NAME={common:'Thường',rare:'Hiếm',legend:'Huyền Thoại',supreme:'Bá khí'};
const TAG={common:'THƯỜNG',rare:'HIẾM',legend:'HUYỀN THOẠI',supreme:'BÁ KHÍ'};
const RCOL={common:'#8D94B8',rare:'#2F8CFF',legend:'#9B5CFF',supreme:'#FF2E88',event:'#FFB02E'};
const WD=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];

const key=(y,m,d)=>`${y}-${m+1}-${d}`;
const pad=n=>String(n).padStart(2,'0');
const isoOf=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=n=>{const p=String(n).trim().split(/\s+/).filter(Boolean);return ((p.length>1?p[0][0]+p[p.length-1][0]:(p[0]||'?').slice(0,2))).toUpperCase()};
/* ----- trạng thái dùng chung (được nạp từ server qua applySnapshot) ----- */
const TODAY={y:2026,m:0,d:1};
let todayKey=key(TODAY.y,TODAY.m,TODAY.d);
const ME={id:'me',uid:'',name:'',un:'',ini:'?',a:'#9AA6FF',b:'#4CC9FF',bd:'',admin:false,photoPath:null,photo:null};
const MEMBERS={me:ME};
const CALS=[];
const LABELS=[['Công việc','#FF2E88'],['Học tập','#4CC9FF'],['Cá nhân','#35D0A5'],['Sức khỏe','#FF9A5C']];
const TITLES=[],WELCOME=[],EVT=[],TMAP={};
const CARDS={common:[],rare:[],legend:[],supreme:[]},EV=[],ALLCARDS=[],CBY={},TOTAL={common:0,rare:0,legend:0,supreme:0};
let TOTALN=0;
const SUPFX=['s1','s2','s3','s4'];
const S={tab:'cal',month:[2026,0],sel:null,dark:false,reduce:false,offline:false,calIdx:0,
 own:{},streak:0,wait:false,rescue:0,taskTotal:0,claimed:false,groupReady:false,eventGot:false,
 equip:null,unlocked:new Set(),friends:[],tasks:{},locks:{},grants:{},catchup:[],tinfo:null,
 theme:{cf:'#C9CEF5',cn:'#1E1B5E',wk:'#5B5F9E',mo:'#1E1B5E',bg:'var(--sleeve)'},priv:{album:false,find:true,notif:true,bdshow:false,sound:false,haptic:true,cheer:true},
 tourSeen:false,mileSeen:{},cheered:{},regClosed:false,favs:[],streakSaved:0,pending:0,limits:{calendars:4,members:6,rescuePerMonth:5}};
const lsGet=(k,d)=>{try{const v=localStorage.getItem('colentis:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem('colentis:'+k,JSON.stringify(v))}catch(e){}};
const curCal=()=>CALS[Math.min(S.calIdx||0,Math.max(0,CALS.length-1))]||{id:'',name:'Lịch',members:['me'],owner:'me',colors:{}};
const mcol=(id,cal)=>{const c=CALS.find(x=>x.id===cal)||curCal();return (c.colors&&c.colors[id])||'#9AA6FF'};
const SRCLBL={personal:'Hoàn thành cá nhân',group:'Thẻ nhóm',rescue:'Thẻ cứu',welcome:'Quà Tân binh',event:'Quà sự kiện',admin:'Quà từ Admin'};
function applySnapshot(sn){
 Object.assign(TODAY,sn.today);todayKey=key(TODAY.y,TODAY.m,TODAY.d);TODAY.iso=sn.today.iso;
 if(!S.mInit){S.mInit=1;S.month=[TODAY.y,TODAY.m]}
 const m=sn.me,mm=sn.members.me;
 Object.assign(ME,{uid:m.uid,name:m.name,un:m.un,ini:initials(m.name),a:mm.a,b:mm.b,bd:m.bd||'',admin:m.admin,photoPath:m.photoPath,welcomeMember:m.welcomeMember,createdAt:m.createdAt,frame:m.equip});
 if(ME.photo&&ME.photoPath)ME.photo=null;
 Object.keys(MEMBERS).forEach(k=>{if(k!=='me')delete MEMBERS[k]});
 Object.entries(sn.members).forEach(([k,v])=>{if(k!=='me')MEMBERS[k]=v});
 CALS.length=0;sn.cals.forEach(c=>CALS.push(c));
 if(S.calIdx>=CALS.length)S.calIdx=0;
 /* danh hiệu */
 TITLES.length=0;WELCOME.length=0;EVT.length=0;Object.keys(TMAP).forEach(k=>delete TMAP[k]);
 sn.titles.forEach(t=>{const o={id:t.id,name:t.name,unlock:t.unlock,rarity:t.rarity,tw:t.tw};TMAP[t.id]=o;
  if(t.id.startsWith('welcome-'))WELCOME.push(o);else if(t.id==='birthday-james'||t.id.startsWith('limited-')||t.id.startsWith('secret-')||t.id.startsWith('idcard-'))EVT.push(o);else TITLES.push(o)});
 WELCOME.sort((a,b)=>a.id.localeCompare(b.id));
 /* thẻ */
 if(!ALLCARDS.length||ALLCARDS.length!==sn.cards.length){
  ['common','rare','legend','supreme'].forEach(r=>{CARDS[r].length=0});EV.length=0;ALLCARDS.length=0;Object.keys(CBY).forEach(k=>delete CBY[k]);
  sn.cards.forEach(c=>{const o={...c,pos:'50% 50%',z:1};CBY[c.id]=o;ALLCARDS.push(o);if(c.r==='event')EV.push(o);else CARDS[c.r].push(o)});
  const TO=['A','S','SS','SSS','AURA','LTD','TAG'];EV.sort((a,b)=>(a.ev===b.ev?0:(a.ev<b.ev?-1:1))||TO.indexOf(a.tier)-TO.indexOf(b.tier)||a.sort-b.sort);
  Object.keys(TOTAL).forEach(r=>TOTAL[r]=CARDS[r].length);TOTALN=Object.values(TOTAL).reduce((a,b)=>a+b,0)}
 const seen=new Set(lsGet('seen:'+m.uid,null)||[]);const first=lsGet('seen:'+m.uid,null)===null;
 Object.keys(S.own).forEach(k=>delete S.own[k]);
 Object.entries(sn.own).forEach(([id,o])=>{S.own[id]={n:o.n,src:o.src,date:o.date,fresh:!first&&!seen.has(id)}});
 if(first)lsSet('seen:'+m.uid,Object.keys(sn.own));
 S.unlocked=new Set(sn.unlocked);S.equip=m.equip;
 S.streak=sn.streak;S.streakSaved=sn.streakIfSaved;S.catchup=sn.catchup.slice();S.wait=S.catchup.length>0;
 S.rescue=sn.rescueMonthlyLeft+sn.rescueBonus;S.rescueMonthly=sn.rescueMonthlyLeft;S.rescueBonus=sn.rescueBonus;S.taskTotal=sn.taskTotal;
 S.limits=sn.limits;S.best=m.best;
 /* task: giữ các tháng đã nạp, ghi đè theo snapshot */
 S.tasks=sn.tasks;S.locks=sn.locks;S.grants=sn.grants;S.tinfo=sn.today_info;
 S.friends=sn.friends;S.favs=m.favs.slice();
 S.priv.album=m.album;S.priv.find=m.findable;S.priv.notif=m.notif;S.priv.cheer=m.cheer;S.priv.bdshow=m.showBd;
 S.prefs=sn.prefs;
 S.claimed=!!S.locks[TODAY.iso]||(S.grants[TODAY.iso]||[]).some(g=>g.source==='personal'||g.source==='rescue');
 S.km=sn.km||null;S.idc=sn.idc||null;S.stash=sn.stash||[];S.eventGot=Object.values(sn.eventDone).every(Boolean)&&Object.keys(sn.eventDone).length>0;
 S.todayCards=(S.grants[TODAY.iso]||[]).map(g=>CBY[g.card]).filter(Boolean);
 S.groupReady=(S.tinfo?S.tinfo.groups:[]).some(g=>g.claimed);
 MAILS.length=0;sn.mails.forEach(x=>MAILS.push(x));
 NOTIFS.length=0;sn.notifs.forEach(x=>NOTIFS.push(x));
}
/* ----- tài nguyên ----- */
const IMGA=(c,thumb)=>{const p=thumb?(c.thumb||c.path):c.path;return `src="${API.imgNow('cards',p,thumb?c.path:null)}" data-pi="cards|${p}|${thumb?c.path:''}"`};
const AVA=p=>`src="${API.imgNow('avatars',p)}" data-pi="avatars|${p}|"`;
const arOfCard=c=>c.ar;
const ASSETBASE=API.base;
const frameImg=(id,kind)=>`${ASSETBASE}assets/frames/titles/${String(id).startsWith('welcome-')?'welcome':id}-${kind}.svg`;
const LOGO=`${ASSETBASE}assets/brand/cortis-logo-white.png`;
const HERO=`${ASSETBASE}hero-auth.jpg`;

/* ----- avatar + khung tròn / khung ngang ----- */
function avatar(m,s=124,frameId){const f=frameId===undefined?m.frame:frameId;
 if(f&&String(f).startsWith('idcard-')&&typeof idFrameAv==='function')return `<div class="av none" style="--s:${s}px;display:grid;place-items:center">${idFrameAv(String(f).slice(7),s,m)}</div>`;
 return `<div class="av ${f?'':'none'} ${String(f).startsWith('birthday-james')||String(f).startsWith('secret-')?'j':''} ${String(f).startsWith('limited-')?'lt':''}" style="--s:${s}px;--ca:${m.a};--cb:${m.b}"><div class="pt">${m.photo?`<img src="${m.photo}" alt="">`:m.photoPath?`<img ${AVA(m.photoPath)} alt="">`:m.ini}</div>${f?`<img class="fr" src="${frameImg(f,'avatar')}" alt="" loading="lazy">`:''}</div>`}
function titleFrame(id,text,h=56){const t=TMAP[id];if(t&&String(id).startsWith('idcard-'))return idTitlePill(String(id).slice(7),text||t.name,h);if(!t)return `<span class="tf none" style="--h:${h}px">Chưa đeo danh hiệu</span>`;
 const W=t.tw;return `<span class="tf tn ${String(id).startsWith('limited-')?'lt':''}" style="--h:${h}px;--ar:${W/200};--l:${180/W*100}%"><img src="${frameImg(id,'title')}" alt="" loading="lazy"><span>${text||t.name}</span></span>`}
/* ----- thẻ ảnh ----- */
const CAKE='<svg class="cake" viewBox="0 0 96 108"><use href="#cake"/></svg>';
function cardHTML(c,o={}){if(c.ev==='khai-mac-2026')return kmCardHTML(c,o);const cls=['pc'];
 if(c.r==='event'){cls.push('ev','t-'+c.tier)}else{cls.push('r-'+c.r);if(c.r==='supreme')cls.push('s',c.fx);if(c.r==='rare'||c.r==='legend')cls.push('comet')}
 if(o.thumb)cls.push('thumb');
 const tag=c.r==='event'?c.tier:TAG[c.r];
 const kc=(c.ev==='khai-mac-2026'&&KM_COL[String(c.id).replace('khaimac-1y-','').replace('khaimac-','')])||null;
 const st=`--w:${typeof o.w==='string'?o.w:(o.w||200)+'px'};--ar:${c.ar}${kc?`;--c:${kc[0]};--c2:${kc[1]}`:''}${c.r==='legend'?';--ch:#fff6c8;--ct:2s':''}`;
 return `<div class="${cls.join(' ')}" style="${st}" data-cid="${c.id}"><div class="pc-glow"></div><div class="pc-fx"></div><span class="pc-tag">${tag}</span><div class="pc-frame"><div class="pc-face"><img ${IMGA(c,o.thumb)} alt="" style="object-position:${c.pos};${c.z>1?`transform:scale(${c.z})`:''}">${c.r==='common'&&!o.thumb?'<div class="pc-holo"></div>':''}</div></div>${c.r==='event'&&!String(c.ev||'').startsWith('khai')?CAKE:''}</div>`}
/* hạt cho hiệu ứng (hiệu ứng chỉ chạy khi thẻ đang hiện trên màn hình) */
function edge(){const s=Math.floor(R(0,4)),t=R(0,100);return s==0?[t,0,0,-1]:s==1?[100,t,1,0]:s==2?[t,100,0,1]:[0,t,-1,0]}
const ECOL={A:['#ffe27a','#ffd23f','#fff3b0'],S:['#ff8a1f','#ffb347','#ff5a00'],SS:['#ff2d3d','#ff6b6b','#ffd0d0'],SSS:['#ffc83a','#ff2d3d','#ffe27a'],AURA:['#ff5db6','#ffd23f','#5be584','#4cd2ff','#8a5bff']};
function pcFx(el){if(!el||el.classList.contains('thumb')||document.body.classList.contains('rdm'))return;const fx=$('.pc-fx',el);if(!fx||fx.dataset.on)return;fx.dataset.on=1;
 const mk=(c,st)=>{const d=document.createElement('i');d.className=c;d.style.cssText=st;fx.appendChild(d)};
 const P=(o)=>{const e=document.createElement('i');e.className='p '+o.k;e.style.cssText=`left:${o.x}%;top:${o.y}%;--s:${o.s}px;--pc:${o.c};--dx:${o.dx}px;--dy:${o.dy}px;--d:${o.d}s;--dl:${-R(0,o.d)}s;--r:${o.r||0}deg`;fx.appendChild(e)};
 const cl=el.classList,ex=h=>fx.insertAdjacentHTML('beforeend',h);
 if(cl.contains('ev')){const t=[...cl].find(x=>x.startsWith('t-')).slice(2),cols=ECOL[t],pk=()=>pickOne(cols);
  if(t==='A'){for(let i=0;i<18;i++){const[x,y,nx,ny]=edge();P({k:'spark',x:x*.7+15,y:y*.7+15,s:R(7,15),c:pk(),dx:nx*R(10,40)+R(-14,14),dy:ny*R(10,40)-R(10,40),d:R(2.4,4.2)})}ex('<div class="ringe" style="animation-duration:3.6s"></div>')}
  if(t==='S'){for(let i=0;i<30;i++)P({k:'ember',x:R(14,86),y:R(60,92),s:R(5,12),c:pk(),dx:R(-34,34),dy:-R(90,220),d:R(1.8,3.4)});ex('<div class="ringe" style="animation-duration:2.2s"></div>')}
  if(t==='SS'){for(let i=0;i<20;i++){const[x,y,nx,ny]=edge();P({k:'spark',x:x*.7+15,y:y*.7+15,s:R(8,16),c:pk(),dx:nx*R(40,90),dy:ny*R(40,90),d:R(1.2,2.2)})}ex('<div class="ringe"></div><div class="ringe" style="animation-delay:-.9s"></div><div class="ringe" style="animation-delay:-1.8s"></div>')}
  if(t==='SSS'){el.insertAdjacentHTML('afterbegin','<div class="rays"></div>');for(let i=0;i<34;i++){const[x,y,nx,ny]=edge();P({k:'spark',x:x*.7+15,y:y*.7+15,s:R(9,19),c:pk(),dx:nx*R(60,150),dy:ny*R(60,150),d:R(1.4,2.8)})}ex('<div class="ringe"></div><div class="ringe" style="animation-delay:-1.3s"></div>')}
  if(t==='AURA'){el.insertAdjacentHTML('afterbegin','<div class="rays"></div><div class="aur"><i></i><i></i><i></i><i></i></div>');for(let i=0;i<44;i++){const[x,y,nx,ny]=edge();P({k:i%3?'spark':'conf',x:x*.7+15,y:y*.7+15,s:R(8,18),c:pk(),dx:nx*R(40,120)+R(-30,30),dy:ny*R(30,100)-R(30,130),d:R(1.8,3.6),r:R(-200,200)})}ex('<div class="ringe" style="border-color:#fff"></div><div class="ringe" style="animation-delay:-1.3s;border-color:#ffd23f"></div>')}
  return}
 if(cl.contains('r-common')){for(let i=0;i<2;i++)mk('ringx',`--l:${i*1.5}s;--d:3.4s`);for(let i=0;i<10;i++)mk('e2',`left:${R(0,100)}%;bottom:0;width:3px;height:3px;background:#fff;box-shadow:0 0 6px #cfe0ff;animation:ember ${R(3,5)}s ${R(0,3)}s infinite;--x:${R(-20,20)}px`)}
 if(cl.contains('r-rare')){for(let i=0;i<3;i++)mk('ringx',`--l:${i*.9}s;--d:2.7s`);for(let i=0;i<5;i++)mk('beam',`left:${8+i*20}%;--d:${R(2,3.2)}s;--l:${R(0,2)}s`);for(let i=0;i<34;i++)mk('e2',`left:${R(-4,104)}%;bottom:0;width:${R(3,6)}px;height:${R(3,6)}px;background:#e8f8ff;box-shadow:0 0 8px 2px var(--c);animation:ember ${R(1.4,3)}s ${R(0,3)}s infinite;--x:${R(-30,30)}px`)}
 if(cl.contains('r-legend')){mk('flare','');el.insertAdjacentHTML('afterbegin','<div class="rays"></div><div class="rays b"></div>');for(let i=0;i<3;i++)mk('ringx',`--l:${i*1.1}s;--d:3.3s;border-color:#ffd75e`);
  const w=parseFloat(el.style.getPropertyValue('--w'))||200;const o=document.createElement('div');o.className='orbit';o.style.cssText=`--d:7s;--rd:${w*.62}px`;o.innerHTML=Array.from({length:8},(_,j)=>`<i style="--wd:${j%2?5:7}px;--a2:${j*45}deg"></i>`).join('');fx.appendChild(o);
  for(let i=0;i<40;i++)mk('e2',`left:${R(-8,108)}%;top:${R(-8,108)}%;width:${R(5,10)}px;height:${R(5,10)}px;border-radius:0;background:#fff6c8;filter:drop-shadow(0 0 4px #ffd75e);clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);animation:tw2 ${R(1.2,2.6)}s ${R(0,3)}s infinite`)}
 if(cl.contains('s1')){for(let i=0;i<22;i++){const a=R(0,6.28),r=R(150,230);mk('spk',`--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r}px;--d:${R(.8,1.6)}s;--l:${R(0,1.5)}s`)}
  let h='<svg class="bolt" viewBox="0 0 100 100" preserveAspectRatio="none">';for(let i=0;i<14;i++){const a=i/14*6.28+R(-.15,.15);let x=50,y=50,p='M50 50';for(let j=0;j<9;j++){x+=Math.cos(a)*7.5+R(-5,5);y+=Math.sin(a)*7.5+R(-5,5);p+=` L${x.toFixed(1)} ${y.toFixed(1)}`}h+=`<path class="bl" style="--l:${(i%5*.28).toFixed(2)}s" d="${p}"/>`}ex(h+'</svg>')}
 if(cl.contains('s2')){mk('rays2','');for(let i=0;i<4;i++)mk('ring2',`--l:${i*.55}s`);for(let i=0;i<30;i++)mk('fl',`left:${R(-10,110)}%;--x:${R(-30,30)}px;--d:${R(2,4)}s;--l:${R(0,4)}s`)}
 if(cl.contains('s3')){mk('fire','');fx.lastChild.innerHTML=Array.from({length:6},()=>`<i style="--d:${R(.35,.8)}s"></i>`).join('');for(let i=0;i<50;i++)mk('e',`left:${R(0,100)}%;--wd:${R(3,9)}px;--x:${R(-60,60)}px;--d:${R(1.6,3.2)}s;--l:${R(0,3)}s`)}
 if(cl.contains('s4')){for(let i=0;i<4;i++)mk('ring2',`--l:${i*.9}s`);for(let i=0;i<14;i++){const z=R(10,26);mk('bk',`left:${R(-10,105)}%;top:${R(-10,105)}%;width:${z}px;height:${z}px;--d:${R(3,6)}s;--l:${R(0,5)}s`)}}
}
/* hiệu ứng chỉ chạy khi thấy: bật/tắt theo IntersectionObserver */
const IO=new IntersectionObserver(es=>es.forEach(e=>{const f=$('.pc-fx',e.target);if(f)f.style.visibility=e.isIntersecting?'visible':'hidden'}),{threshold:0});
function liveCard(el){if(!el)return;pcFx(el);IO.observe(el)}
function tiltOn(host,target){host.onpointermove=e=>{const r=host.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;target.style.transform=`perspective(800px) rotateY(${x*20}deg) rotateX(${-y*20}deg) scale(1.03)`};host.onpointerleave=()=>target.style.transform=''}
/* toast / sheet / page */
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2000)}
let sheetOpen=false;
function openSheet(html,cls=''){const s=$('#sheet');s.className='sheet '+cls;s.innerHTML=html;void s.offsetWidth;s.classList.add('on');$('#bd').classList.add('on');sheetOpen=true;s.scrollTop=0}
function closeSheet(){$('#sheet').classList.remove('on');$('#bd').classList.remove('on');sheetOpen=false}
function openPage(id,html){const p=$('#'+id);if(html!==undefined)p.innerHTML=html;p.classList.add('on')}
function closePage(id){$('#'+id).classList.remove('on')}
