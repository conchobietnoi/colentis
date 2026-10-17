/* ===== điều khiển chung ===== */
function openDay(d){daySheet(d)}
const THEME_KEYS=['--cf','--cn','--wk','--mo','--cal-bg'];
let THEME_DRAFT={};
function applyTheme(){const app=$('#app');THEME_KEYS.forEach(k=>app.style.removeProperty(k));
 const th=(S.prefs&&S.prefs[curCal().id])||lsGet('theme:'+curCal().id,null)||{};Object.entries({...th,...THEME_DRAFT}).forEach(([k,v])=>{if(THEME_KEYS.includes(k)&&typeof v==='string'&&/^[#a-zA-Z0-9(),.%\- ]+$/.test(v))app.style.setProperty(k,v)})}
async function claimAll(){const list=MAILS.filter(m=>m.gifts.length&&!m.claimed&&m.kind!=='welcome'&&m.eid!=='mua-concept-2026');if(!list.length)return;if(!API.online()){toast('Cần có mạng để nhận quà');return}
 const q=[];for(const m of list){try{q.push(...itemsFromResult(await API.claimMail(m.id)))}catch(e){apiFail(e);break}}
 closePage('pgLetter');closePage('pgMail');await API.reload();renderAll();runGacha(q,()=>{renderAll()})}
const PRIVMAP={notif:'notif_enabled',cheer:'cheer_enabled',album:'album_public',find:'findable',bdshow:'show_birthday'};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,d=t.dataset;
 switch(a){
 case 'day':openDay(+d.d);break;
 case 'mprev':case 'mnext':{let [y,m]=S.month;m+=a==='mnext'?1:-1;if(m<0){m=11;y--}if(m>11){m=0;y++}S.month=[y,m];renderCal();API.ensureMonth(y,m).then(ch=>{if(ch&&S.tab==='cal')renderCal()}).catch(()=>{});break}
 case 'cals':calsSheet();break;
 case 'pickcal':S.calIdx=+d.i;lsSet('cal',curCal().id);applyTheme();closeSheet();renderAll();toast('Đang xem '+curCal().name);break;
 case 'mail':openMail();break;
 case 'evmail':{const em=evMail();openMail();if(em)openLetter(em.id);break}
 case 'back':closePage(d.p);if(d.p==='pgTheme'){THEME_DRAFT={};applyTheme()}if(d.p==='pgLetter')renderMailList();break;
 case 'mf':mfilter=d.f;renderMailList();break;
 case 'letter':openLetter(d.id);break;
 case 'claimmail':claimMail(d.id);break;
 case 'claimall':claimAll();break;
 case 'addtask':{const k=d.k||todayKey;closeSheet();setTimeout(()=>taskSheet(k),60);break}
 case 'edit':{const kk=Object.keys(S.tasks).find(x=>S.tasks[x].some(y=>y.id===d.id));taskSheet(kk,d.id);break}
 case 'tick':tickTask(d.id);break;
 case 'catch':openDayIso(d.iso);break;
 case 'saver':useSaver(d.iso);break;
 case 'claim':if(!API.online())toast('Cần có mạng để nhận thẻ');else claimSheet(d.iso||TODAY.iso);break;
 case 'claimday':claimSheet(d.iso);break;
 case 'claimgo':doClaim(d.iso);break;
 case 'close':closeSheet();break;
 case 'colf':colFilter=d.f;renderCol();$('#col').scrollTop=0;observeCards();break;
 case 'view':openViewer(d.cid);break;
 case 'flip':{const f=$('#fp');f.classList.toggle('flip');t.innerHTML=ic('sync')+(f.classList.contains('flip')?' Xem mặt trước':' Xem mặt sau');break}
 case 'fxoff':{const pc=$('#fp .pc'),on=!pc.classList.contains('quiet');pc.classList.toggle('quiet',on);const fx=$('.pc-fx',pc);if(fx)fx.style.display=on?'none':'';$$('.rays',pc).forEach(r=>r.style.display=on?'none':'');t.innerHTML=ic('spark')+' Hiệu ứng: '+(on?'tắt':'bật');break}
 case 'friend':friendSheet(d.id);break;
 case 'toast':toast(d.m);break;
 case 'set':setSheet();break;
 case 'tg':{const k=d.k;
  if(k==='dark'){setDark(!S.dark);t.classList.toggle('on',S.dark)}
  else if(k==='reduce'){setReduce(!S.reduce);t.classList.toggle('on',S.reduce)}
  else if(k==='sound'||k==='haptic'){S.priv[k]=!S.priv[k];lsSet(k,S.priv[k]);t.classList.toggle('on',S.priv[k]);if(k==='sound'&&S.priv.sound)sfx('ok');if(k==='haptic'&&S.priv.haptic)vib(40)}
  else if(PRIVMAP[k]){const v=!S.priv[k];S.priv[k]=v;t.classList.toggle('on',v);API.updateProfile({[PRIVMAP[k]]:v}).catch(er=>{S.priv[k]=!v;t.classList.toggle('on',!v);apiFail(er)})}
  break}
 case 'ach':achSheet(d.id);break;
 case 'equip':API.equip(d.id).then(()=>{S.equip=d.id;ME.frame=d.id;closeSheet();renderPro();toast('Đã đeo cặp khung: '+TMAP[d.id].name)}).catch(apiFail);break;
 case 'theme':themePage();break;
 case 'install':installSheet();break;
 case 'swatch':$$('[data-k="'+d.k+'"]').forEach(x=>x.classList.toggle('on',x===t));THEME_DRAFT[d.k]=d.c;$('#app').style.setProperty(d.k,d.c);$('#pv').style.setProperty(d.k,d.c);break;
 case 'bg':THEME_DRAFT['--cal-bg']=d.b;$('#app').style.setProperty('--cal-bg',d.b);break;
 case 'savetheme':{const th={...((S.prefs&&S.prefs[curCal().id])||{}),...THEME_DRAFT};lsSet('theme:'+curCal().id,th);API.saveTheme(curCal().id,th).then(()=>{S.prefs[curCal().id]=th;THEME_DRAFT={};closePage('pgTheme');toast('Đã lưu giao diện cho '+curCal().name)}).catch(apiFail);break}
 case 'tgc':{const cs=$('#cs');cs.hidden=!cs.hidden;t.innerHTML=ic(cs.hidden?'unlock':'lock')+(cs.hidden?' Hiện thẻ':' Ẩn thẻ');break}
 }});
document.addEventListener('click',e=>{if(e.target.id==='bd')closeSheet();const tb=e.target.closest('#tabs button');if(tb)go(tb.dataset.go)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(GST)finishAll();else if(sheetOpen)closeSheet();else $$('.page.on').pop()?.classList.remove('on')}});
/* tìm bạn bằng username */
let qTimer=0;
document.addEventListener('input',e=>{if(e.target.id!=='q')return;const v=e.target.value.trim().toLowerCase().replace(/^@/,''),r=$('#res');clearTimeout(qTimer);
 if(!v){r.innerHTML='Không có gợi ý. Chỉ hiện khi nhập đúng username.';return}
 if(v.length<4){r.textContent='Cần ít nhất 4 ký tự.';return}
 r.textContent='Đang tìm...';
 qTimer=setTimeout(async()=>{try{const p=await API.findUser(v);if($('#q')&&$('#q').value.trim().toLowerCase().replace(/^@/,'')!==v)return;
  if(!p){r.textContent='Không tìm thấy người dùng này.';return}
  const already=S.friends.some(f=>f.uid===p.id);const pm={a:'#9AA6FF',b:'#4CC9FF',ini:initials(p.display_name),photoPath:p.avatar_path};
  r.innerHTML=`<div class="fr">${avatar(pm,50,null)}<div class="mid"><b>${esc(p.display_name)}</b><small>@${esc(p.username)}</small></div>${already?'<span class="chip">Đã là bạn</span>':`<button class="chip on" data-x="addf" data-u="${esc(p.username)}">Kết bạn</button>`}</div>`}
  catch(er){r.textContent=failMsg(er)}},400)});
document.addEventListener('click',e=>{const t=e.target.closest('[data-x=addf]');if(!t)return;t.disabled=true;
 API.sendFriendRequest(t.dataset.u).then(async()=>{toast('Đã gửi lời mời kết bạn');t.textContent='Đã gửi';await API.reload();newTitlesPrompt()}).catch(er=>{t.disabled=false;apiFail(er)})});
function setDark(v){S.dark=v;lsSet('dark',v);$('#app').classList.toggle('dk',v);document.body.classList.toggle('pdark',v)}
function setReduce(v){S.reduce=v;lsSet('reduce',v);$('#app').classList.toggle('reduce',v);document.body.classList.toggle('rdm',v);if(v)$$('.pc-fx').forEach(f=>f.style.display='none');else if(S.uid!==undefined||ME.uid)renderAll()}
