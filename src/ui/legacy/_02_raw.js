/* ===== màn hình ===== */
const allOn=k=>S.tasks[k]||[];
function tasksOf(y,m,d){const c=curCal().id;return allOn(key(y,m,d)).filter(t=>t.cal===c)}
const myTasks=k=>allOn(k).filter(t=>t.owner==='me');
const cardOfDay=(iso,kinds)=>{const g=(S.grants[iso]||[]).find(x=>kinds.includes(x.source));return g?CBY[g.card]:null};
function dayStat(y,m,d){const iso=isoOf(y,m,d);
 if(iso>TODAY.iso)return {k:'fut'};
 const gr=S.grants[iso]||[],lk=S.locks[iso];
 if(lk==='rescue')return {k:'rs',p:1};
 const hasG=gr.some(g=>g.source==='group'),hasP=gr.some(g=>g.source==='personal'||g.source==='rescue');
 if(hasG||hasP||lk)return {k:'p',g:hasG,p:hasP};
 if(iso===TODAY.iso)return {k:'today'};
 if(S.catchup.includes(iso))return {k:'ms'};
 const mt=myTasks(key(y,m,d));
 if(mt.length&&mt.every(t=>t.done)&&daysBetween(iso,TODAY.iso)<=14)return {k:'cl'};
 return {k:'em'}}
function daysBetween(a,b){return Math.round((Date.parse(b)-Date.parse(a))/864e5)}
function cellHTML(y,m,d){const st=dayStat(y,m,d),iso=isoOf(y,m,d),isSel=S.sel===key(y,m,d);let cls='c',inner='',tcnt=tasksOf(y,m,d);
 const dots=()=>{const o=[...new Set(tcnt.map(t=>t.owner))];return o.length?`<span class="dots">${o.map(x=>`<i style="background:${mcol(x,curCal().id)}"></i>`).join('')}</span>`:''};
 const gC=cardOfDay(iso,['group']),pC=cardOfDay(iso,['personal','rescue']);
 if(st.k==='today'){cls+=' today';inner=`${d}${dots()}`}
 else if(st.k==='fut'){cls+=' fut';inner=`${d}${dots()}`}
 else if(st.k==='em'){cls+=' em';inner=`${d}<span class="ic">–</span>`}
 else if(st.k==='ms'){cls+=' ms';inner=`${d}<span class="ic">${ic('clock')}</span>`}
 else if(st.k==='cl'){cls+=' clm';inner=`${d}<span class="ic">${ic('gift')}</span>`}
 else if(st.k==='rs'){cls+=' sv';inner=`${d}<span class="ic">${ic('shield')}</span><span class="lk">${ic('lock')}</span>`}
 else{if(st.g&&gC){cls+=' gp';inner=`<img class="cv" loading="lazy" ${IMGA(gC,1)} alt=""><b>${d}</b><span class="gm">${ic('users')}</span><span class="lk">${ic('lock')}</span>${pC?`<span class="st"><img ${IMGA(pC,1)} alt=""></span>`:''}`}
  else inner=`${d}${pC?`<span class="st"><img ${IMGA(pC,1)} alt=""></span>`:''}<span class="lk">${ic('lock')}</span>`}
 if(isSel)cls+=' sel';
 return `<button class="${cls}" data-act="day" data-d="${d}" aria-label="Ngày ${d}">${inner}${bdMark(m,d)}${cxCellMark(y,m,d)}</button>`}
function evMail(){return MAILS.find(m=>m.type==='event'&&!m.claimed)}
function renderCal(){const [y,m]=S.month,first=new Date(y,m,1).getDay(),off=(first+6)%7,nd=new Date(y,m+1,0).getDate();
 const cal=curCal();let g='';for(let i=0;i<off;i++)g+='<div class="c e"></div>';for(let d=1;d<=nd;d++)g+=cellHTML(y,m,d);
 const unread=mailUnread(),em=evMail();
 $('#cal').innerHTML=`<div class="head"><div><small data-act="cals">${esc(cal.name)} ${ic('down')}</small><div class="mnav"><button class="ibtn" data-act="mprev" aria-label="Tháng trước">${ic('left')}</button><h1>Tháng ${m+1}${y!==TODAY.y?` · ${y}`:''}</h1><button class="ibtn" data-act="mnext" aria-label="Tháng sau">${ic('right')}</button></div></div>
 <div class="hact"><div class="streak ${S.wait?'wait':''}">${slogo()} ${S.wait?S.streakSaved:S.streak}</div>${bellBtn()}<button class="ibtn ${unread?'ring':''}" data-act="mail" aria-label="Hòm thư">${ic('mail')}${unread?`<span class="dot-n">${unread}</span>`:''}</button></div></div>
 ${kmBanner()}
 ${cxBannerHTML()}
 ${em?`<button class="banner ev" data-act="evmail"><span class="bi">${ic('cake')}</span><span><b>${esc(em.t)}</b><small>Bạn có quà sự kiện. Mở thư để nhận.</small></span></button>`:''}
 <div class="dow" style="margin-top:10px"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>
 <div class="grid" id="grid">${g}</div>
 <div class="legend"><span><i style="background:linear-gradient(135deg,#7B61FF,#FF7AB8);border-color:#fff"></i>Thẻ nhóm phủ ô</span><span><i style="width:9px;height:12px;border-color:#fff;background:#4CC9FF"></i>Thẻ cá nhân</span><span><i style="background:repeating-linear-gradient(135deg,var(--paper) 0 3px,var(--line) 3px 5px)"></i>Ngày cứu</span><span><i style="border-style:dashed"></i>Ngày trống</span><span><i style="border-color:var(--amber);background:rgba(255,176,46,.25)"></i>Có thể tick bù / nhận thẻ</span></div>
 ${cxLegendHTML()}<div class="legend" style="padding-top:6px">${cal.members.map(x=>`<span><i style="width:9px;height:9px;border:0;border-radius:50%;background:${mcol(x,cal.id)}"></i>${esc(MEMBERS[x]?MEMBERS[x].name:'?')}${x==='me'?' (bạn)':''}</span>`).join('')}</div>
 ${calTasks()}
 <button class="fab" data-act="addtask" aria-label="Thêm việc">${ic('plus')}</button>`;
 }
/* ----- danh sách việc ----- */
function taskRow(t,lockedDay,canEdit){const mine=t.owner==='me',mm=MEMBERS[t.owner]||{name:'?',ini:'?'},lb=LABELS[t.label]||LABELS[0];
 const time=t.allday?'Cả ngày':(t.start+(t.end?'–'+t.end:''));
 return `<div class="t ${t.done?'d':''} ${mine?'':'oth'} ${lockedDay&&mine?'lockd':''}" data-id="${t.id}"><button class="ck" ${mine&&!lockedDay?`data-act="tick" data-id="${t.id}"`:'disabled'} aria-label="Hoàn thành"></button><span class="tt">${esc(t.t)}<small>${time}${t.cal!==curCal().id?' · '+esc((CALS.find(c=>c.id===t.cal)||{name:'Lịch khác'}).name):''}${t.pending?' · chờ đồng bộ':''}</small></span>${mine?'':`<span class="mem" style="background:${mcol(t.owner,t.cal)}" title="${esc(mm.name)}">${esc(mm.ini[0])}</span>`}<span class="lbl" style="background:${lb[1]}">${lb[0]}</span>${ciRowBtn(t,mine)}<button class="tchev ${NOTEOPEN.has(t.id)?'on':''}" data-act="tnote" data-id="${t.id}" aria-label="Xem ghi chú" aria-expanded="${NOTEOPEN.has(t.id)}">${ic('down')}</button>${mine&&!lockedDay&&canEdit?`<button class="ed" data-act="edit" data-id="${t.id}" aria-label="Sửa">${ic('pencil')}</button>`:''}${NOTEOPEN.has(t.id)?`<div class="tnb"><em class="tnote">${t.note?esc(t.note):'Chưa có ghi chú'}</em>${ciNote(t,mine)}</div>`:''}</div>`}
const mine=k=>allOn(k).filter(t=>t.owner==='me');
/* các lịch có từ 2 người: trạng thái nhóm hôm nay */
function groupsToday(){const tdy=allOn(todayKey);
 return CALS.filter(c=>c.members.length>=2).map(c=>{const info=S.tinfo&&S.tinfo.groups.find(g=>g.calendarId===c.id);
  const others=c.members.filter(x=>x!=='me').map(x=>{const a=tdy.filter(t=>t.cal===c.id&&t.owner===x),q=info?info.members.find(mm=>mm.uid===x):null;
   const d=a.filter(t=>t.done).length;return {id:x,m:MEMBERS[x]||{name:'?',ini:'?'},d,n:a.length,ok:q?q.qualified:(a.length>0&&d===a.length)}});
  return {cal:c,others,eligible:!!(info&&info.eligible),claimed:!!(info&&info.claimed)}})}
function claimable(){const mt=mine(todayKey),all=mt.length&&mt.every(t=>t.done);
 return (all&&!(S.tinfo&&S.tinfo.personalClaimed))||groupsToday().some(g=>g.eligible&&!g.claimed)}
function weekStrip(){const out=[];const base=new Date(TODAY.y,TODAY.m,TODAY.d);
 for(let i=6;i>=0;i--){const dt=new Date(base);dt.setDate(base.getDate()-i);const y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),s=dayStat(y,m,d);
  const c=s.k==='today'?(S.claimed?'ok td':'td'):s.k==='ms'?'ms':s.k==='rs'?'rs':(s.k==='em')?'':'ok';
  out.push(`<div class="${c}">${['CN','T2','T3','T4','T5','T6','T7'][dt.getDay()]}<i>${s.k==='ms'?ic('clock'):s.k==='rs'?ic('shield'):c.includes('ok')?ic('check'):s.k==='em'?'–':''}</i></div>`)}
 return out.join('')}
function fmtLeft(iso){const end=Date.parse(iso)+(24+48)*3600e3-7*3600e3;let ms=end-API.now();if(ms<0)ms=0;const h=Math.floor(ms/3600e3),mn=Math.floor(ms%3600e3/60e3);return `${h} giờ ${pad(mn)} phút`}
const dmOf=iso=>{const [,m,d]=iso.split('-').map(Number);return `${d}/${m}`};
function renderToday(){const k=todayKey,mt=mine(k),done=mt.filter(t=>t.done).length,all=mt.length&&done===mt.length;const pct=mt.length?Math.round(done/mt.length*100):0,unread=mailUnread();
 const grp=groupsToday(),em=evMail(),cl=claimable();
 const byCal={};mt.forEach(t=>(byCal[t.cal]=byCal[t.cal]||[]).push(t));
 const others=allOn(k).filter(t=>t.owner!=='me');
 const wd=new Date(TODAY.y,TODAY.m,TODAY.d).getDay();
 $('#today').innerHTML=`<div class="head"><div><small>${WD[wd]}, ${TODAY.d}/${TODAY.m+1}/${TODAY.y}</small><h1>Hôm nay</h1></div><div class="hact">${bellBtn()}<button class="ibtn ${unread?'ring':''}" data-act="mail" aria-label="Hòm thư">${ic('mail')}${unread?`<span class="dot-n">${unread}</span>`:''}</button></div></div>
 <div class="hero">${slogo('fl2')}<small>Chuỗi hiện tại</small><h2>${S.wait?S.streakSaved:S.streak} ngày liền</h2><small>Dài nhất ${Math.max(S.best||0,S.streak)} · Thẻ cứu còn ${S.rescueMonthly}/${S.limits.rescuePerMonth} tháng này${S.rescueBonus?` · +${S.rescueBonus} quà tặng`:''}</small><div class="wk">${weekStrip()}</div></div>
 ${em?`<button class="banner ev" data-act="evmail"><span class="bi">${ic('cake')}</span><span><b>${esc(em.t)}</b><small>Quà sự kiện đang chờ bạn. Mở thư để nhận.</small></span></button>`:''}
 ${kmBanner()}
 ${cxBannerHTML()}
 ${evCard()}
 ${cxGiftHTML()}${cxTodayTaskHTML()}
 ${S.catchup.map(iso=>`<div class="banner warn" style="cursor:default"><span class="bi">${ic('clock')}</span><span><b>${dmOf(iso)} chưa xong, chuỗi đang chờ nối</b><small>Còn ${fmtLeft(iso)} để tick bù hoặc dùng thẻ cứu.</small><div class="btnrow"><button class="btn-s" data-act="catch" data-iso="${iso}">Tick bù</button><button class="btn-s ghost" data-act="saver" data-iso="${iso}">${ic('shield')} Dùng thẻ cứu</button></div></span></div>`).join('')}
 <div class="card-b"><div style="display:flex;gap:14px;align-items:center"><div class="ring-p" style="--p:${pct}"><i>${done}/${mt.length}</i></div><div style="flex:1;min-width:0"><h2 style="display:block;font-size:16px">${S.claimed&&!cl?'Hôm nay hoàn thành':all?'Hoàn thành hết rồi!':mt.length?'Việc của bạn':'Chưa có việc hôm nay'}</h2><div class="sub" style="margin-top:3px">${S.claimed&&!cl?'Ngày đã khóa, chỉ xem lại.':all?'Xác nhận để nhận thẻ hôm nay.':mt.length?`Còn ${mt.length-done} việc nữa để nhận thẻ.`:'Thêm việc đầu tiên để bắt đầu.'}</div></div></div>
  ${grp.map(g=>`<div style="margin-top:12px"><div class="sub" style="font-weight:800;display:flex;gap:6px;align-items:center">${ic('users')} ${esc(g.cal.name)}</div><div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap">${g.others.map(o=>`<span class="chip" style="display:flex;gap:6px;align-items:center;padding:5px 11px 5px 5px"><span class="mem" style="background:${mcol(o.id,g.cal.id)};width:20px;height:20px">${esc(o.m.ini[0])}</span>${esc(o.m.name)} ${o.d}/${o.n}${o.ok?' ✓':''}</span>`).join('')}</div><div class="sub" style="margin-top:6px">${g.claimed?'Bạn đã nhận thẻ nhóm hôm nay.':g.eligible?'Cả nhóm đủ điều kiện: có thẻ nhóm hôm nay.':'Khi cả nhóm xong, thẻ nhóm phủ ô ngày của bạn.'}</div>${cheerRow(g)}</div>`).join('')||`<div class="sub" style="margin-top:8px;display:flex;gap:6px;align-items:center">${ic('users')} Mời bạn vào một lịch để cùng nhận thẻ nhóm.</div>`}</div>
 ${cl?`<button class="claimcta" data-act="claim">${ic('gift')} Nhận thẻ hôm nay</button>`:''}
 ${cxClaimHTML()}
 ${S.claimed?`<div class="card-b"><h2>Thẻ đã nhận hôm nay <em>${S.todayCards.length}</em></h2><div class="lock-banner">${ic('lock')}<span>Việc của bạn trong ngày đã khóa. Thẻ chỉ để xem lại.</span></div><div class="cstrip">${S.todayCards.map(c=>cardHTML(c,{w:c.land?150:104,thumb:1})).join('')}</div></div>`:''}
 <div class="btnrow" style="padding:0 14px;margin-top:12px"><button class="btn-s" data-act="addtask">${ic('plus')} Thêm việc</button></div>`}
/* ----- bộ sưu tập ----- */
let colFilter='all';
function renderCol(){if(COLTAB==='photos')return ciRenderPhotos();const rs=['common','rare','legend','supreme'];const have=r=>CARDS[r].filter(c=>S.own[c.id]).length;
 const fl=[['all','Tất cả'],...rs.map(r=>[r,NAME[r]]),['event','Sự kiện']];
 const sec=(r,list,title,colr)=>{const owned=list.filter(c=>S.own[c.id]).length;let shown=list;if(colFilter==='all'&&list.length>9)shown=list.slice(0,9);
  return `<div class="sec" style="--rc:${colr}"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:${colr};box-shadow:0 0 8px ${colr}"></i>${title}</span><small>${owned}/${list.length}${colFilter==='all'&&list.length>9?' · 9 thẻ đầu':''}</small></div><div class="gal">${shown.map(c=>slotHTML(c)).join('')}</div>${colFilter==='all'&&list.length>9?`<div style="text-align:center"><button class="chip" data-act="colf" data-f="${r}">Xem tất cả ${list.length} thẻ ${NAME[r]}</button></div>`:''}`};
 let body=idColTile();
 const show=colFilter==='all'?rs:colFilter==='event'?[]:[colFilter];
 show.forEach(r=>body+=sec(r,CARDS[r],NAME[r],RCOL[r]));
 if((colFilter==='all'||colFilter==='event')&&EV.length){const grp=[['birthday-james-2026','Sinh nhật James 2026'],['khai-mac-2026','Khai Mạc · Limited & Tag 1Y']];
  grp.forEach(([eid,nm])=>{const l=EV.filter(c=>c.ev===eid);if(!l.length)return;const h=l.filter(c=>S.own[c.id]).length;
   body+=`<div class="sec"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,#ffd23f,#ff5db6,#4cd2ff)"></i>${nm}</span><small>${h}/${l.length} · Sự kiện</small></div><div class="gal">${l.map(c=>slotHTML(c)).join('')}</div>`});
  body+=`<div class="sub" style="padding:0 16px 6px">Thẻ sự kiện có nhãn riêng, không tính vào “đủ bộ”. Thẻ chưa sở hữu được ẩn cho đến khi bạn nhận.</div>`}
 $('#col').innerHTML=`<div class="head"><div><small>Bộ sưu tập của bạn</small><h1>Thẻ ảnh</h1></div><div class="hact"><button class="ibtn" data-x="dup" aria-label="Thẻ trùng">${ic('copy')}</button><button class="ibtn" data-act="mail" aria-label="Hòm thư">${ic('mail')}</button></div></div>
 ${ciColSeg()}${cxColConcept()?cxColHTML():`${cxColActive()?cxColChipsHTML():''}<div class="rbar">${rs.map(r=>`<div style="--rc:${RCOL[r]}"><b>${have(r)}/${TOTAL[r]}</b>${NAME[r]}<div class="bar"><i style="width:${TOTAL[r]?have(r)/TOTAL[r]*100:0}%"></i></div></div>`).join('')}</div>
 <div class="fl">${fl.map(f=>`<button class="chip ${colFilter===f[0]?'on':''}" data-act="colf" data-f="${f[0]}">${f[1]}</button>`).join('')}</div>${body}`}`}
function slotHTML(c){const o=S.own[c.id];if(!o)return `<div class="slot lk" title="Chưa có"></div>`;
 return `<button class="slot" data-act="view" data-cid="${c.id}"><div class="sw">${cardHTML(c,{w:'100%',thumb:1})}${o.n>1?`<span class="cnt">×${o.n}</span>`:''}${o.fresh?'<span class="nw">MỚI</span>':''}</div></button>`}
/* ----- bạn bè ----- */
function renderFr(){const pf=S.friends,reqs=NOTIFS.filter(n=>n.kind==='req'),cal=curCal();
 $('#fr').innerHTML=`<div class="head"><div><small>Kết bạn bằng username</small><h1>Bạn bè</h1></div><div class="hact">${bellBtn()}<button class="ibtn" data-act="mail" aria-label="Hòm thư">${ic('mail')}</button></div></div>
 <div style="padding:0 14px"><div style="position:relative"><input class="in" id="q" placeholder="Nhập đúng username (từ 4 ký tự)" autocomplete="off" autocapitalize="off" style="padding-left:42px"><span style="position:absolute;left:14px;top:19px;color:var(--soft)">${ic('search')}</span></div>
 <div id="res" class="sub" style="margin:2px 2px 4px">Không có gợi ý. Chỉ hiện khi nhập đúng username.</div></div>
 ${reqs.length?`<div class="card-b"><h2>Lời mời <em>${reqs.length}</em></h2>${reqs.map(r=>{return `<div class="fr"><div class="mid"><b>${esc(r.h.replace(' gửi lời mời kết bạn',''))}</b><small>${esc(r.s)}</small></div><button class="chip on" data-x="nacc" data-id="${r.id}">Chấp nhận</button><button class="chip" data-x="ndec" data-id="${r.id}">Từ chối</button></div>`}).join('')}</div>`:''}
 <div class="card-b"><h2>Bạn của bạn <em>${pf.length}</em></h2>${pf.length?pf.map(f=>`<div class="fr" data-act="friend" data-id="${f.id}" style="cursor:pointer">${avatar(f,50,f.frame)}<div class="mid"><b>${esc(f.name)}</b><small>@${esc(f.un)}${f.streak!=null?' · streak '+f.streak:''}</small></div>${cal.members.includes(f.id)?`<span class="chip">Cùng lịch</span>`:(isOwner(cal)&&cal.members.length<S.limits.members?`<button class="chip on" data-x="cinv1" data-i="${CALS.indexOf(cal)}" data-id="${f.id}">Mời vào lịch</button>`:'')}</div>`).join(''):`<div class="empty" style="padding:18px 10px"><div class="ei">${ic('users')}</div>Chưa có bạn nào. Gõ đúng username của bạn bè ở ô trên để kết bạn.</div>`}</div>
 <div class="card-b"><h2>Thành viên “${esc(cal.name)}” <em>${cal.members.length}/${S.limits.members}</em></h2><div class="sub">${isOwner(cal)?'Bạn là chủ lịch.':'Chủ lịch: '+esc((MEMBERS[cal.owner]||{name:'?'}).name)+'.'} Chủ lịch quản lý thành viên. Không ai sửa hay tick việc của người khác.</div><div class="btnrow"><button class="btn-s ghost" data-x="cinv" data-i="${CALS.indexOf(cal)}">${ic('users')} Mời thêm</button><button class="btn-s" data-x="mcal" data-i="${CALS.indexOf(cal)}">${ic('gear')} Quản lý lịch</button></div></div>`}
/* ----- hồ sơ ----- */
function renderPro(){const eq=S.equip,un=S.unlocked,tot=TITLES.length;
 const wl=WELCOME.find(w=>un.has(w.id)),ord=[wl||WELCOME[0],...EVT.filter(t=>un.has(t.id)),...[...TITLES].sort((a,b)=>(un.has(b.id)-un.has(a.id)))].filter(Boolean);
 const ownN=Object.keys(S.own).filter(i=>CBY[i]&&CBY[i].r!=='event').length;
 $('#pro').innerHTML=`<div class="head"><div><small>Hồ sơ</small><h1>${esc(ME.name)}</h1></div><div class="hact"><button class="ibtn" data-act="mail" aria-label="Hòm thư">${ic('mail')}</button><button class="ibtn" data-act="set" aria-label="Cài đặt">${ic('gear')}</button></div></div>
 <div class="ctr"><div style="display:grid;place-items:center;position:relative"><button data-act="editprof" aria-label="Chỉnh sửa hồ sơ" style="border-radius:50%">${avatar(ME,148,eq)}</button></div><div class="un">@${esc(ME.un)}</div><button class="btn-s ghost" data-act="editprof" style="margin:8px auto 0">${ic('pencil')} Chỉnh sửa hồ sơ</button><div style="margin-top:8px">${titleFrame(eq,null,64)}</div><p class="sub" style="margin-top:8px">Làm xong việc rồi mới được ngắm ảnh.</p>
 <div class="stats"><div><b>${S.streak}</b><small>Streak</small></div><div><b>${Math.max(S.best||0,S.streak)}</b><small>Dài nhất</small></div><div><b>${ownN}/${TOTALN}</b><small>Thẻ đã có</small></div></div>
 <div class="stats" style="margin-top:8px"><div><b>${S.rescue}</b><small>Thẻ cứu còn lại</small></div><div><b>${CALS.length}/${S.limits.calendars}</b><small>Lịch</small></div><div><b>${[...un].filter(x=>!x.startsWith('welcome-')&&x!=='birthday-james').length}/${tot}</b><small>Danh hiệu</small></div></div>
 ${favHTML()}
 <div style="text-align:left;margin-top:16px;display:flex;justify-content:space-between;align-items:baseline"><h2 style="font-size:16px">Danh hiệu và khung</h2><span class="sub">Chạm để xem và đeo</span></div>
 <div class="ach">${ord.map(a=>`<button class="${un.has(a.id)?'':'lk'} ${eq===a.id?'eq':''}" data-act="ach" data-id="${a.id}">${avatar(ME,62,a.id)}<span class="nm">${a.id.startsWith('welcome-')&&!un.has(a.id)?'Tân binh':esc(a.name)}</span></button>`).join('')}</div>
 ${cxRewardsHTML()}
 ${idProMenu()}
 ${albumProMenu()}
 <button class="menu" data-x="recap"><span class="l">${ic('chart')}<span>Tổng kết tháng ${TODAY.m+1}<small>Số việc, thẻ hiếm nhất, ảnh để chia sẻ</small></span></span>${ic('right')}</button>
 <button class="menu" data-x="events"><span class="l">${ic('cake')}<span>Sự kiện sắp tới<small>Ngày sinh các thành viên, đếm ngược</small></span></span>${ic('right')}</button>
 <button class="menu" data-act="theme"><span class="l">${ic('image')}<span>Giao diện lịch<small>Màu, nền, chế độ tối</small></span></span>${ic('right')}</button>
 <button class="menu" data-act="set"><span class="l">${ic('lock')}<span>Quyền riêng tư<small>Album riêng tư, cho tìm thấy bằng username</small></span></span>${ic('right')}</button>
 <button class="menu" data-act="install"><span class="l">${ic('sun')}<span>Cài app lên màn hình chính<small>iPhone và Android</small></span></span>${ic('right')}</button>
 <button class="menu" data-x="tour"><span class="l">${ic('book')}<span>Hướng dẫn nhanh<small>3 trang: tick, khóa ngày, chuỗi và thẻ cứu</small></span></span>${ic('right')}</button>
 ${ME.admin?`<button class="menu" data-x="admin"><span class="l">${ic('crown')}<span>Trang admin<small>Gửi thư và quà cho bạn bè</small></span></span>${ic('right')}</button>`:''}
 <button class="menu" data-x="signout"><span class="l">${ic('x')}<span>Đăng xuất</span></span></button></div>`}
function renderAll(){try{applyTheme()}catch(e){}renderCal();renderToday();renderCol();renderFr();renderPro();syncBadges()}
function syncBadges(){const n=mailUnread();$$('.tabbadge').forEach(b=>{b.textContent=n;b.style.display=n?'grid':'none'});const t=$('#tdot');if(t){t.style.display=claimable()?'grid':'none'}}
function go(id){S.tab=id;$$('.scr').forEach(s=>s.classList.toggle('on',s.id===id));$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.go===id));({cal:renderCal,today:renderToday,col:renderCol,fr:renderFr,pro:renderPro})[id]();$('#'+id).scrollTop=0;observeCards()}
function observeCards(){$$('.pc:not(.thumb)').forEach(liveCard)}
