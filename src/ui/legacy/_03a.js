/* ===== hòm thư ===== */
const MAILS=[],NOTIFS=[];
const need=m=>!m.read||(m.gifts.length&&!m.claimed);
const mailUnread=()=>MAILS.filter(need).length;
let mfilter='all';
function giftChips(m){return m.gifts.map(g=>g.k==='event'?`<span class="gp2">${ic('cake')} 2 thẻ sự kiện</span>`:g.k==='cards'?`<span class="gp2">${ic('image')} 5 thẻ ngẫu nhiên</span>`:g.k==='pack'?`<span class="gp2">${ic('image')} Gói 5 thẻ</span>`:g.k==='frame'?`<span class="gp2">${ic('star')} Khung Tân binh</span>`:g.k==='card'?`<span class="gp2">${ic('image')} ${NAME[g.r]?'Thẻ '+NAME[g.r]:'Thẻ ngẫu nhiên'}</span>`:g.k==='saver'?`<span class="gp2">${ic('shield')} Thẻ cứu ×${g.n}</span>`:`<span class="gp2">${ic('star')} Danh hiệu</span>`).join('')}
function openMail(){renderMailList();openPage('pgMail')}
function renderMailList(){const list=MAILS.filter(m=>mfilter==='all'||(mfilter==='gift'&&m.gifts.length)||(mfilter==='event'&&m.type==='event')||(mfilter==='news'&&m.type==='news'));
 const unclaimed=MAILS.filter(m=>m.gifts.length&&!m.claimed&&m.kind!=='welcome').length;
 $('#pgMail').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgMail" aria-label="Quay lại">${ic('left')}</button><h1>Hòm thư</h1>${unclaimed?`<button class="btn-s pink" data-act="claimall">${ic('gift')} Nhận tất cả (${unclaimed})</button>`:''}</div>
 <div class="mfilter">${[['all','Tất cả'],['gift','Quà'],['event','Sự kiện'],['news','Thông báo']].map(f=>`<button class="chip ${mfilter===f[0]?'on':''}" data-act="mf" data-f="${f[0]}">${f[1]}</button>`).join('')}</div>
 <div class="pbody">${list.length?list.map(m=>`<button class="letter ${m.type} ${need(m)?'unread':'read'}" data-act="letter" data-id="${m.id}">${need(m)?`<span class="new">${m.gifts.length&&!m.claimed?'CÓ QUÀ':'MỚI'}</span>`:''}<div class="lbody"><span class="seal">${m.type==='event'?ic('cake'):m.type==='news'?ic('megaphone'):ic('gift')}</span><h3>${esc(m.t)}</h3><p>${esc(m.p)}</p><div class="meta"><span>${m.date}</span>${giftChips(m)}${m.claimed?`<span class="gp2">${ic('check')} Đã nhận</span>`:''}</div></div></button>`).join(''):`<div class="empty"><div class="ei">${ic('mail')}</div>Chưa có thư nào ở mục này.<br>Thư từ admin và sự kiện sẽ hiện ở đây.</div>`}</div>`}
function giftTile(g){if(g.k==='frame')return `<div class="gf" style="width:128px"><div style="margin:0 0 -4px">${avatar(ME,92,'welcome-1')}</div><div class="tfw" style="width:128px;height:30px;transform:none;margin-top:2px">${titleFrame('welcome-1','? ? ?',30)}</div><span class="qty">Khung Tân binh</span></div>`;if(g.k==='pack')return `<div class="gf"><div class="gi" style="background:linear-gradient(140deg,#9B5CFF,#2F8CFF 60%,#1a1650);box-shadow:0 0 24px #9B5CFF">${ic('image')}</div>Gói 5 thẻ<span class="qty">có ít nhất 1 Hiếm</span></div>`;if(g.k==='cards')return `<div class="gf"><div class="gi" style="background:linear-gradient(140deg,#9B5CFF,#2F8CFF 60%,#1a1650);box-shadow:0 0 24px #9B5CFF">${ic('image')}</div>5 thẻ ngẫu nhiên<span class="qty">có ít nhất 1 Hiếm</span></div>`;if(g.k==='event')return `<div class="gf"><div class="gi" style="background:linear-gradient(140deg,#7a2dbd,#ff5db6);box-shadow:0 0 24px rgba(255,93,182,.6)">${ic('cake')}</div>2 thẻ sự kiện<span class="qty">ngẫu nhiên trong 5 thẻ</span></div>`;
 if(g.k==='card'){const cl=RCOL[g.r]||'#9B5CFF';return `<div class="gf"><div class="gi" style="background:linear-gradient(140deg,${cl},#1a1650);box-shadow:0 0 24px ${cl}">${ic('image')}</div>${NAME[g.r]?'Thẻ '+NAME[g.r]:'Thẻ ngẫu nhiên'}<span class="qty">chưa lật</span></div>`}
 if(g.k==='saver')return `<div class="gf"><div class="gi sv">${ic('shield')}</div>Thẻ cứu ×${g.n}<span class="qty">streak</span></div>`;
 return `<div class="gf" style="width:140px"><div style="margin:2px 0">${avatar(ME,86,g.id)}</div><div class="tfw" style="width:140px;height:38px;transform:none">${titleFrame(g.id,null,38)}</div><span class="qty">${esc((TMAP[g.id]||{name:g.id}).name)}</span></div>`}
function openLetter(id){const m=MAILS.find(x=>x.id===id);if(!m)return;
 if(!m.read){m.read=true;API.markMailRead(id)}
 $('#pgLetter').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgLetter" aria-label="Quay lại">${ic('left')}</button><h1>${m.type==='event'?'Thư sự kiện':m.type==='news'?'Thông báo':'Thư quà tặng'}</h1></div>
 <div class="pbody"><div class="envwrap"><div class="env ${m.type}" id="env"><div class="back"></div><div class="let"><i></i><i></i><i></i><i></i></div><div class="front"></div><div class="flap"></div><div class="wax">${ic(m.type==='event'?'cake':m.type==='news'?'megaphone':'gift')}</div></div><div class="sparkles" id="spk"></div></div>
 <div class="paper"><div class="hd"><div class="lg"><i></i></div><div><b style="font-size:14px">Colentis</b><div class="sub">${m.date}</div></div></div><h2>${esc(m.t)}</h2><p>${esc(m.p)}</p>
 ${m.gifts.length?`<div class="gifts">${m.gifts.map(giftTile).join('')}</div><button class="claimbtn" data-act="claimmail" data-id="${m.id}" ${m.claimed?'disabled':''}>${m.claimed?`${ic('check')} Đã nhận`:`${ic('gift')} Nhận quà`}</button><div class="sub" style="text-align:center;margin-top:9px">${m.claimed?'Quà đã nằm trong album, bấm lại không nhận thêm.':'Quà nhận đúng một lần, kể cả khi đổi thiết bị.'}</div>`:''}</div></div>`;
 openPage('pgLetter');const env=$('#env'),sp=$('#spk');sp.style.cssText='position:absolute;inset:0;pointer-events:none';for(let i=0;i<10;i++)sp.insertAdjacentHTML('beforeend',`<i style="left:${R(18,82)}%;top:${R(6,70)}%;animation-delay:${R(0,1.6)}s"></i>`);
 setTimeout(()=>env&&env.classList.add('open'),260);renderMailList();syncBadges();renderCalOnlyIfOn()}
function renderCalOnlyIfOn(){({cal:renderCal,today:renderToday,col:renderCol,fr:renderFr,pro:renderPro})[S.tab]()}
const failMsg=e=>(e&&e.app&&e.app.message)||'Có lỗi xảy ra, hãy thử lại.';
function apiFail(e,kind){const a=e&&e.app;if(a&&a.offline){toast('Cần có mạng để làm việc này');return}if(a&&a.code==='NOT_AUTHENTICATED'){showErr('session');return}if(kind)showErr(kind);else toast(failMsg(e))}
function itemsFromResult(res){const q=[];
 (res.grants||[]).forEach(g=>{const c=CBY[g.card_id];if(c)q.push({type:c.r==='event'?'event':'card',card:c,src:SRCLBL[g.source]||'Quà',isNew:g.is_new,n:g.count})});
 if(res.rescue_added>0)q.push({type:'saver',n:res.rescue_added});
 (res.new_titles||[]).forEach(t=>{if(TMAP[t])q.push({type:'title',id:t})});return q}
async function claimMail(id){const m=MAILS.find(x=>x.id===id);if(!m||m.claimed)return;if(!API.online()){toast('Cần có mạng để nhận quà');return}
 if(m.kind==='welcome'){runWelcomeClaim(m);return}
 let res;try{res=await API.claimMail(id)}catch(e){return apiFail(e,'claim')}
 closePage('pgLetter');closePage('pgMail');await API.reload();renderAll();
 runGacha(itemsFromResult(res),()=>{renderMailList();renderAll()})}
/* ===== viewer thẻ ===== */
function openViewer(cid){const c=CBY[cid],o=S.own[cid];if(!c)return;if(o&&o.fresh){o.fresh=false;const k='seen:'+ME.uid,a=new Set(lsGet(k,[]));a.add(cid);lsSet(k,[...a])}
 const w=c.land?300:Math.min(250,Math.round(240*Math.min(1,c.ar*1.3)));
 const col=c.r==='event'?(c.tier==='LTD'?'Khai Mạc · Limited':c.tier==='TAG'?'Khai Mạc · Tag 1Y':'Sự kiện '+c.tier):NAME[c.r];
 $('#pgView').innerHTML=`<div class="ptop" style="color:#fff"><button class="ibtn" style="background:rgba(255,255,255,.14);border-color:transparent;color:#fff" data-act="back" data-p="pgView" aria-label="Quay lại">${ic('left')}</button><h1 style="color:#fff">${esc(c.name)}</h1></div>
 <div class="stagev" id="sv"><div class="tiltable" id="tv"><div class="flipper" id="fp" style="width:${w}px">${cardHTML(c,{w:w})}<div class="bkface" style="--w:${w}px">${backHTML(c,{w:w,fill:1})}</div></div></div></div>
 <div class="info2"><h2 style="color:${c.r==='event'?'#ffd23f':RCOL[c.r]};text-shadow:0 0 16px ${c.r==='event'?'#ffd23f':RCOL[c.r]}">${col}${c.r==='event'?'':''}</h2><p>${c.land?'Thẻ ngang':'Thẻ dọc'} · đã có ×${o?o.n:0}${o?` · nhận lần đầu ${esc(o.date)} (${esc(o.src)})`:''}</p>
 <div class="vbtns"><button data-act="flip">${ic('sync')} Xem mặt sau</button><button data-act="fxoff" id="fxb">${ic('spark')} Hiệu ứng: bật</button><button data-x="dlcard" data-cid="${cid}">${ic('download')} Lưu ảnh</button></div></div>`;
 openPage('pgView');const pc=$('#fp .pc');liveCard(pc);tiltOn($('#sv'),$('#tv'))}
/* ===== sheets ===== */
const tickable=iso=>iso>=TODAY.iso||daysBetween(iso,TODAY.iso)<=2;
function openDayIso(iso){const [y,m,d]=iso.split('-').map(Number);S.month=[y,m-1];daySheet(d)}
function daySheet(d){const [y,m]=S.month,k=key(y,m,d),iso=isoOf(y,m,d),st=dayStat(y,m,d),dt=new Date(y,m,d),ts=tasksOf(y,m,d),isToday=iso===TODAY.iso;
 S.sel=k;const locked=st.k==='p'||st.k==='rs';const fut=st.k==='fut',ms=st.k==='ms',em=st.k==='em',cl=st.k==='cl';
 let banner='';
 if(locked)banner=`<div class="lock-banner">${ic('lock')}<span>${st.k==='rs'?'Ngày được cứu bằng thẻ cứu. Việc của bạn trong ngày đã khóa.':'Bạn đã nhận thẻ ngày này nên việc của bạn đã khóa, chỉ xem lại.'}</span></div>`;
 if(ms)banner=`<div class="banner warn" style="cursor:default;margin:10px 0 0;width:100%"><span class="bi">${ic('clock')}</span><span><b>Chưa xong, còn ${fmtLeft(iso)}</b><small>Tick bù các việc đã có từ trước, hoặc dùng thẻ cứu (còn ${S.rescue}). Không tạo việc mới cho ngày đã qua.</small></span></div>`;
 if(cl)banner=`<div class="banner warn" style="cursor:default;margin:10px 0 0;width:100%"><span class="bi">${ic('gift')}</span><span><b>Bạn đã xong hết việc ngày này</b><small>Chưa nhận thẻ. Còn hạn nhận trong 14 ngày.</small></span></div>`;
 if(em&&!ts.length)banner=`<div class="lock-banner">${ic('check')}<span>Ngày trống vẫn tính vào chuỗi. Ngày trống không tự có thẻ cá nhân.</span></div>`;
 const cards=(S.grants[iso]||[]).map(g=>CBY[g.card]).filter(Boolean);
 const canEdit=(fut||isToday)&&!locked,canTick=!locked&&tickable(iso);
 openSheet(`<h2>${WD[dt.getDay()]}, ${d}/${m+1}</h2><div class="sub">${isToday?'Hôm nay':fut?'Sắp tới':'Đã qua'} · ${esc(curCal().name)}</div>${banner}
 <div style="margin-top:6px">${ts.length?ts.map(t=>taskRow(t,!canTick,canEdit)).join(''):`<div class="empty" style="padding:22px 10px"><div class="ei">${ic('cal')}</div>${fut||isToday?'Chưa có việc nào. Thêm việc đầu tiên cho ngày này.':'Ngày này không có việc.'}</div>`}</div>
 ${cards.length?`<h3 style="font-size:14px;margin-top:12px;display:flex;justify-content:space-between;align-items:center">Thẻ đã nhận<button class="btn-s ghost" id="tgc" data-act="tgc">${ic('lock')} Ẩn thẻ</button></h3><div class="cstrip" id="cs">${cards.map(c=>cardHTML(c,{w:c.land?150:104,thumb:1})).join('')}</div>`:''}
 ${canEdit?`<button class="big" data-act="addtask" data-k="${k}">${ic('plus')} Thêm việc</button>`:''}
 ${ms?`<button class="big alt" data-act="saver" data-iso="${iso}">${ic('shield')} Dùng thẻ cứu cho ${d}/${m+1}</button>`:''}
 ${cl||(isToday&&claimable())?`<button class="big" data-act="${cl?'claimday':'claim'}" data-iso="${iso}">${ic('gift')} Nhận thẻ ngày ${d}/${m+1}</button>`:''}`)}
function taskSheet(k,editId){let t=null;const ts=S.tasks[k]||[];if(editId)t=ts.find(x=>x.id===editId);const m=t||{t:'',note:'',allday:false,start:'09:00',end:'',label:0,cal:curCal().id};const dd=k.split('-').map(Number);
 openSheet(`<h2>${t?'Sửa việc':'Việc mới'}</h2><div class="sub">${WD[new Date(dd[0],dd[1]-1,dd[2]).getDay()]}, ${dd[2]}/${dd[1]} · chỉ bạn sửa được việc của mình</div>
 <input class="in" id="ntitle" placeholder="Việc cần làm, ví dụ gọi lại cho khách" value="${esc(m.t)}" maxlength="80"><textarea class="in" id="nnote" rows="2" placeholder="Ghi chú (không bắt buộc)" style="resize:none">${esc(m.note)}</textarea>
 <div class="row">Cả ngày <button class="tog ${m.allday?'on':''}" id="allday" aria-label="Cả ngày"></button><span style="margin-left:auto;display:flex;gap:6px;align-items:center" id="times" ${m.allday?'hidden':''}><input class="in" type="time" id="ts" style="width:104px;margin:0;padding:9px" value="${m.start}"><span>–</span><input class="in" type="time" id="te" style="width:104px;margin:0;padding:9px" value="${m.end}"></span></div>
 <div class="row">Nhãn ${LABELS.map((l,i)=>`<button class="chip lb ${m.label===i?'on':''}" data-i="${i}" style="${m.label===i?`background:${l[1]};border-color:${l[1]};color:#fff`:`border-color:${l[1]};color:${l[1]}`}">${l[0]}</button>`).join('')}</div>
 <div class="row">Lịch ${CALS.map(c=>`<button class="chip cl ${m.cal===c.id?'on':''}" data-i="${c.id}">${esc(c.name)}</button>`).join('')}</div>
 <button class="big" id="savet" data-k="${k}" data-e="${editId||''}">${t?'Lưu thay đổi':'Lưu việc'}</button>${t?`<button class="big gh" id="delt" data-k="${k}" data-e="${editId}">${ic('trash')} Xóa việc</button>`:''}`);
 $('#allday').onclick=e=>{e.currentTarget.classList.toggle('on');$('#times').hidden=e.currentTarget.classList.contains('on')};
 $$('.lb').forEach(b=>b.onclick=()=>{$$('.lb').forEach(x=>{const l=LABELS[+x.dataset.i];x.classList.remove('on');x.style.cssText=`border-color:${l[1]};color:${l[1]}`});b.classList.add('on');const l=LABELS[+b.dataset.i];b.style.cssText=`background:${l[1]};border-color:${l[1]};color:#fff`});
 $$('.cl').forEach(b=>b.onclick=()=>{$$('.cl').forEach(x=>x.classList.remove('on'));b.classList.add('on')});
 $('#savet').onclick=e=>saveTask(e.currentTarget.dataset.k,e.currentTarget.dataset.e||null);
 const dl=$('#delt');if(dl)dl.onclick=e=>{const k=e.currentTarget.dataset.k,id=e.currentTarget.dataset.e;confirmSheet({icon:'trash',title:'Xóa việc này?',body:'Việc sẽ biến mất khỏi lịch và không khôi phục được.',okText:'Xóa việc',danger:1,ok:()=>deleteTaskUi(k,id)})}}
async function saveTask(k,e){const title=$('#ntitle').value.trim();if(!title){toast('Nhập tên việc trước khi lưu');$('#ntitle').focus();return}
 const [y,mo,d]=k.split('-').map(Number),day=`${y}-${pad(mo)}-${pad(d)}`;
 const allday=$('#allday').classList.contains('on');
 const o={title,note:$('#nnote').value.trim()||null,all_day:allday,start_time:allday?null:($('#ts').value||'09:00'),end_time:allday?null:($('#te').value||null),label:LABELS[+($('.lb.on')||{dataset:{i:0}}).dataset.i][0],calendar_id:($('.cl.on')||{dataset:{i:curCal().id}}).dataset.i};
 if(o.end_time&&o.start_time&&o.end_time<o.start_time){toast('Giờ kết thúc cần sau giờ bắt đầu');return}
 const b=$('#savet');if(b){b.disabled=true}
 try{const r=e?await API.editTask(e,o):await API.addTask({...o,day});closeSheet();if(!(r&&r.queued))await API.reload('lite').catch(()=>{});renderAll();toast(r&&r.queued?'Đã lưu, chờ đồng bộ khi có mạng':e?'Đã cập nhật việc':'Đã thêm việc')}
 catch(er){if(b)b.disabled=false;apiFail(er)}}
async function deleteTaskUi(k,e){try{await API.deleteTask(e);closeSheet();await API.reload('lite').catch(()=>{});renderAll();toast('Đã xóa việc')}catch(er){apiFail(er)}}
const PROG={'streak-60':[12,60],'streak-100':[12,100],'streak-365':[12,365],'tasks-500':null,'tasks-1000':null};
function achSheet(id){const a=TMAP[id],un=S.unlocked.has(id),eq=S.equip===id;let pr='';const wlk=id.startsWith('welcome-')&&!un;
 const num=a.id.startsWith('streak-')?[Math.max(S.best||0,S.streak),+a.id.split('-')[1]]:a.id.startsWith('tasks-')?[S.taskTotal,+a.id.split('-')[1]]:null;
 if(!un&&num)pr=`<div class="sub" style="margin-top:10px;display:flex;justify-content:space-between"><span>Tiến độ</span><b>${num[0]}/${num[1]}</b></div><div style="height:8px;border-radius:9px;background:var(--line);overflow:hidden;margin-top:5px"><i style="display:block;height:100%;width:${Math.max(3,num[0]/num[1]*100)}%;background:var(--pink)"></i></div>`;
 openSheet(`<div style="text-align:center"><div style="display:grid;place-items:center;${un?'':'filter:grayscale(1) opacity(.55)'}">${avatar(ME,170,id)}</div><div style="margin:4px 0 8px;${un?'':'filter:grayscale(1) opacity(.55)'}">${titleFrame(id,wlk?'? ? ?':null,72)}</div><div class="sub">Điều kiện: <b>${wlk?'Nhận Quà Tân binh CORTIS trong hòm thư':esc(a.unlock)}</b></div>${pr}
 <button class="big ${un?'':'gh'}" data-act="equip" data-id="${id}" ${!un||eq?'disabled':''}>${eq?`${ic('check')} Đang đeo`:un?`${ic('star')} Đeo cặp khung này`:`${ic('lock')} Chưa mở khóa`}</button><div class="sub" style="margin-top:8px">Mỗi danh hiệu một cặp khung riêng. Tên hiển thị do bạn đặt.</div></div>`,'cc')}
async function friendSheet(id){const f=S.friends.find(x=>x.id===id)||MEMBERS[id];if(!f)return;
 const draw=(fv)=>openSheet(`<div style="text-align:center"><div style="display:grid;place-items:center">${avatar(f,140,f.frame)}</div><h2 style="margin-top:2px">${esc(f.name)}</h2><div class="sub">@${esc(f.un)}</div><div style="margin:8px 0">${titleFrame(f.frame,null,60)}</div><div class="stats"><div><b>${fv?fv.streak:'…'}</b><small>Streak</small></div><div><b>${f.frame?'1':'0'}</b><small>Danh hiệu đeo</small></div><div><b>${CALS.some(c=>c.members.includes(f.id))?'Chung':'–'}</b><small>Lịch</small></div></div>${fv&&fv.fav_cards&&fv.fav_cards.length?friendFavs(fv.fav_cards):''}${fv&&fv.birthday?`<div class="sub" style="margin-top:8px">${ic('cake')} Sinh nhật ${fmtBd(fv.birthday)}</div>`:''}<div class="sub" style="margin-top:10px">Bạn bè chỉ xem mục hồ sơ người đó bật. Album cá nhân mặc định riêng tư.</div>${f.friendshipId?`<button class="big gh" data-x="unfriend" data-id="${f.id}">Hủy kết bạn</button>`:''}</div>`);
 draw(null);try{const fv=await API.friendView(f.id);if(sheetOpen)draw(fv)}catch(e){}}
const fmtBd=iso=>{const [,m,d]=iso.split('-').map(Number);return `${d}/${m}`};
function claimSheet(iso){iso=iso||TODAY.iso;const [y,m,d]=iso.split('-').map(Number);openSheet(`<div style="text-align:center"><div style="width:74px;height:74px;border-radius:24px;margin:4px auto 10px;background:linear-gradient(135deg,#ff2e88,#7b61ff);display:grid;place-items:center;font-size:34px;color:#fff">${ic('gift')}</div><h2>Nhận thẻ ngày ${d}/${m}?</h2><p class="sub" style="margin-top:6px;line-height:1.5">Nhận thẻ sẽ khóa việc của bạn trong ngày ${d}/${m}: không thêm, sửa, xóa hay bỏ tick nữa. Thẻ được lưu ngay khi bạn xác nhận.</p><button class="big" data-act="claimgo" data-iso="${iso}">${ic('gift')} Nhận thẻ</button><button class="big gh" data-act="close">Để sau</button></div>`)}
function setSheet(){const row=(k,l,sub)=>`<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span>${l}<div class="sub" style="font-weight:600">${sub}</div></span><button class="tog ${k==='dark'?(S.dark?'on':''):k==='reduce'?(S.reduce?'on':''):(S.priv[k]?'on':'')}" data-act="tg" data-k="${k}" aria-label="${l}"></button></div>`;
 openSheet(`<h2>Cài đặt</h2>${row('dark','Chế độ tối','Theo máy hoặc chọn tay')}${row('reduce','Giảm chuyển động','Tắt hiệu ứng thẻ và khung động')}${row('notif','Thông báo trong app','Thư mới, lời mời, nhắc việc')}${row('cheer','Nhận lời cổ vũ từ bạn bè','Bạn bè có thể gửi lời cổ vũ khi bạn chưa xong việc')}${row('sound','Âm thanh','Tiếng nhỏ khi tick việc và mở thẻ')}${row('haptic','Rung','Rung nhẹ trên điện thoại khi mở thẻ')}${row('bdshow','Hiện ngày sinh với bạn bè','Tắt thì chỉ mình bạn thấy ngày sinh')}${row('album','Album cá nhân riêng tư','Bật để bạn bè được xem album')}${row('find','Cho tìm thấy bằng username','Người lạ chỉ thấy tên và avatar')}`)}
function installSheet(){openSheet(`<h2>Cài Colentis</h2><div class="sub">Dùng như app, mở nhanh và xem được khi mất mạng.</div><div class="card-b" style="margin:12px 0 0"><h2 style="font-size:14px">iPhone (Safari)</h2><p class="sub" style="line-height:1.6;margin-top:4px">1. Mở trang bằng Safari.<br>2. Bấm nút Chia sẻ ở thanh dưới.<br>3. Chọn “Thêm vào Màn hình chính”.</p></div><div class="card-b" style="margin:10px 0 0"><h2 style="font-size:14px">Android (Chrome)</h2><p class="sub" style="line-height:1.6;margin-top:4px">1. Mở trang bằng Chrome.<br>2. Bấm dấu ba chấm.<br>3. Chọn “Cài đặt ứng dụng”.</p></div>`)}
/* ===== giao diện lịch ===== */
function themePage(){const cols=['#1E1B5E','#FF2E88','#2F8CFF','#9B5CFF','#E0A800','#1FA37F'];const sw=(k)=>cols.map(c=>`<button class="dotc" style="background:${c}" data-act="swatch" data-k="${k}" data-c="${c}" aria-label="${c}"></button>`).join('');
 openPage('pgTheme',`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgTheme" aria-label="Quay lại">${ic('left')}</button><h1>Giao diện lịch</h1></div><div class="pbody" style="padding:0 16px"><div class="sub">Áp dụng riêng cho “${esc(curCal().name)}”</div>
 <div class="card-b" style="margin:10px 0 0;background:var(--cal-bg)" id="pv"><div class="dow" style="padding:0"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div><div class="grid" style="padding:0;margin-top:4px"><div class="c">12</div><div class="c" style="border-style:dashed">13</div><div class="c today">14</div><div class="c fut">15</div><div class="c fut">16</div><div class="c fut">17</div><div class="c fut">18</div></div></div>
 <div class="row">Màu khung<span style="display:flex;gap:6px;flex-wrap:wrap">${sw('--cf')}</span></div><div class="row">Số ngày<span style="display:flex;gap:6px;flex-wrap:wrap">${sw('--cn')}</span></div><div class="row">Thứ<span style="display:flex;gap:6px;flex-wrap:wrap">${sw('--wk')}</span></div><div class="row">Tên tháng<span style="display:flex;gap:6px;flex-wrap:wrap">${sw('--mo')}</span></div>
  <div class="row">Nền mẫu <button class="chip" data-act="bg" data-b="var(--sleeve)">Mặc định</button><button class="chip" data-act="bg" data-b="linear-gradient(160deg,#C9B8FF,#FFD1E8)">Tím mơ</button><button class="chip" data-act="bg" data-b="linear-gradient(160deg,#FFD6A5,#FF9AC1)">Hoàng hôn</button><button class="chip" data-act="bg" data-b="linear-gradient(160deg,#B8F0E0,#BDD8FF)">Bạc hà</button></div>
  <div class="row">Nền đơn sắc<span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">${['#FFFFFF','#F4F1FF','#FFE9F3','#E8F4FF','#E9FBF3','#FFF6DA','#1E1B5E','#111827'].map(c=>`<button class="dotc" style="background:${c};border:2px solid var(--line)" data-act="bg" data-b="${c}" aria-label="Nền ${c}"></button>`).join('')}<label class="bgpick" aria-label="Chọn màu bất kỳ"><input type="color" data-act="bgc" value="#F4F1FF"><span>Chọn màu</span></label></span></div>
  <div class="row" style="justify-content:space-between">Chế độ tối <button class="tog ${S.dark?'on':''}" data-act="tg" data-k="dark" aria-label="Chế độ tối"></button></div><button class="big" data-act="savetheme">Lưu giao diện</button></div>`)}
/* ===== GACHA ===== */
const STARC=['#cfd3ee','#4CC9FF','#9B5CFF','#FF2E88','#FFD75E'];
function infoFor(it){if(it.type==='event'){const c0=it.card,c={...c0,tier:(c0.tier==='LTD'||c0.tier==='TAG')?'SSS':c0.tier},col={A:'#ffd23f',S:'#ff8a1f',SS:'#ff2d3d',SSS:'#ffc83a',AURA:'#ff5db6'}[c.tier];return {col,txt:c.tier,parts:{A:30,S:44,SS:56,SSS:80,AURA:110}[c.tier],rings:{A:1,S:2,SS:3,SSS:3,AURA:4}[c.tier],big:c.tier==='AURA'||c.tier==='SSS',ev:1,cols:ECOL[c.tier]}}
 if(it.type==='card'){const r=it.card.r,col=r==='supreme'?[ '#35e07a','#ffffff','#ffb02e','#ffc46b'][SUPFX.indexOf(it.card.fx)]:RCOL[r];return {col,txt:NAME[r],parts:{common:16,rare:34,legend:64,supreme:110}[r],rings:{common:1,rare:2,legend:3,supreme:4}[r],big:r==='legend'||r==='supreme',cols:r==='supreme'?[col,{s1:'#ff3b4e',s2:'#9fb0ff',s3:'#ff3d1f',s4:'#3a7bff'}[it.card.fx],'#fff']:[col,'#fff']}}
 if(it.type==='title')return {col:'#FFE45E',txt:'Danh hiệu mới!',parts:70,rings:3,big:true,cols:['#FFE45E','#ff5db6','#4cc9ff','#fff']};
 return {col:'#4CC9FF',txt:'Thẻ cứu streak',parts:30,rings:2,big:false,cols:['#4CC9FF','#fff']}}
let GST=null;
function runGacha(items,done){const g=$('#g');if(!items.length){done&&done();return}
 g.className='g on';g.innerHTML=`<div class="stars">${Array.from({length:34},()=>`<i style="left:${R(0,100)}%;top:${R(0,100)}%;animation-delay:${R(0,3)}s;width:${R(2,4)}px;height:${R(2,4)}px"></i>`).join('')}</div><div class="gr"></div><div class="gr b"></div><div class="vig"></div>
 <div class="gtop"><span class="pill" id="gcnt"></span><button id="gskip">Bỏ qua</button></div><div class="gtitle" id="gtit"></div><div class="packw" id="pkw"></div><div class="pwr" id="pwr"></div><div class="hintg" id="hint"></div><div class="flashg" id="fls"></div><div class="shk-r" id="sr"></div><div class="cardw" id="cw"></div><div class="rname" id="rn"></div><div class="ginfo" id="gi"></div><div class="gbtns" id="gb"></div><div class="gsum" id="gs"></div><div class="confetti" id="cf"></div>`;
 GST={items,i:0,done,got:[]};stageItem()}
function stageItem(){const g=$('#g'),G=GST,it=G.items[G.i];if(!it){summary();return}
 const inf=infoFor(it);let res={};
 if(it.type==='card'||it.type==='event'){res={isNew:it.isNew,n:it.n}}
 G.got.push({it,res});
 g.classList.remove('chg','shk');g.style.setProperty('--rc',inf.col);g.style.setProperty('--ch',0);
 $$('#g .gr').forEach(r=>r.style.opacity=0);
 $('#gcnt').textContent=`${G.i+1} / ${G.items.length}`;
 $('#gtit').innerHTML=it.type==='event'&&it.card.ev==='khai-mac-2026'?`Quà Khai Mạc<small>15—16/10/2026</small>`:it.type==='event'?`Quà sinh nhật James<small>14/10/2026 · thẻ sự kiện ${G.i+1}/${G.items.filter(x=>x.type==='event').length}</small>`:it.type==='title'?`Danh hiệu mới<small>Đã thêm vào Hồ sơ</small>`:it.type==='saver'?`Thẻ cứu streak<small>Cộng vào kho thẻ cứu</small>`:`Thẻ mới<small>${it.src||''}</small>`;
 $('#cw').innerHTML='';$('#cw').className='cardw';$('#rn').className='rname';$('#gi').className='ginfo';$('#gb').className='gbtns';$('#gb').innerHTML='';$('#cf').innerHTML='';$('#gs').className='gsum';
 const pk=$('#pkw');pk.style.display='';
 pk.innerHTML=`<div class="pack ${it.type==='event'?'ev':''}" id="pack" style="--gc:#a9a0ff"><div class="pin"><div class="half h1"></div><div class="half h2"></div><div class="shine"></div><div class="seal2"></div>${it.type==='event'?'<svg class="evi" viewBox="0 0 96 108"><use href="#cake"/></svg>':''}</div></div>`;
 $('#hint').className='hintg';$('#hint').innerHTML=`Giữ để mở<small>hoặc chạm liên tục</small>`;
 const pack=$('#pack'),pin=$('.pin',pack);
 let charge=0,hold=false,t0=0,last=performance.now(),burst=false,tIdle=performance.now(),cur=0;
 const setCol=c=>{pack.style.setProperty('--gc',c);$('#pwr').style.setProperty('--gc',c)};
 const loop=now=>{if(!GST||GST!==G||G.items[G.i]!==it||burst)return;const dt=Math.min(.05,(now-last)/1000);last=now;
  if(hold)charge+=dt*.62;else charge=Math.max(0,charge-dt*.16);
  if(S.reduce)charge=1;
  const c=Math.min(1,charge);g.style.setProperty('--ch',c*100);$('#pwr').style.setProperty('--ch',c*100);g.classList.toggle('chg',c>.02);
  const amp=c*c*9;pin.style.transform=`translate(${R(-amp,amp)}px,${R(-amp,amp)}px) rotate(${R(-amp,amp)*.4}deg) scale(${1+c*.1})`;
  const stage=c<.25?0:c<.5?1:c<.75?2:3,col=c>.86?inf.col:STARC[stage];setCol(col);pack.querySelectorAll('.half').forEach(h=>h.style.setProperty('--gl',20+c*70+'px'));
  $$('#g .gr').forEach(r=>r.style.opacity=c*(inf.big?.7:.4));
  if(c>.55&&Math.random()<c*.5)spawnSpark(inf,'up');
  if(c>=1){burst=true;doBurst();return}requestAnimationFrame(loop)};
 const down=e=>{if(e.target.closest('button'))return;hold=true;t0=performance.now();tIdle=t0};
 const up=()=>{if(!hold)return;hold=false;if(performance.now()-t0<260){charge+=.26;pack.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:180})}};
 g.onpointerdown=down;g.onpointerup=up;g.onpointerleave=up;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){charge+=.3}};
 $('#gskip').onclick=()=>{if(!burst){burst=true;doBurst()}else finishAll()};
 requestAnimationFrame(loop);
 function spawnSpark(inf,dir){const s=document.createElement('i');s.className='gp2';const sz=R(5,11),a=R(0,6.28),r=R(40,110);s.style.cssText=`--s:${sz}px;--pc:${pickOne(inf.cols)};--dx:${Math.cos(a)*r}px;--dy:${dir==='up'?-R(80,200):Math.sin(a)*r}px;--r:${R(-90,90)}deg;--d:${R(.8,1.4)}s;margin-left:${R(-60,60)}px;margin-top:${R(-30,90)}px`;g.appendChild(s);void s.offsetWidth;s.classList.add('go');setTimeout(()=>s.remove(),1500)}
 function doBurst(){g.classList.remove('chg');g.onpointerdown=g.onpointerup=g.onpointerleave=null;$('#hint').className='hintg';$('#hint').innerHTML='';
  if(inf.big&&!S.reduce){g.classList.add('shk');setTimeout(()=>g.classList.remove('shk'),inf.txt==='AURA'||it.card&&it.card.r==='supreme'?900:520)}
  const f=$('#fls');f.style.background=inf.col==='#FFE45E'?'#fff6c8':'#fff';f.classList.remove('go');void f.offsetWidth;f.classList.add('go');
  const sr=$('#sr');sr.style.setProperty('--rc',inf.col);
  for(let i=0;i<inf.rings;i++){const r=document.createElement('div');r.className='shk-r go';r.style.cssText=`--rc:${i%2?inf.cols[1]||'#fff':inf.col};--dl:${i*.16}s`;g.appendChild(r);setTimeout(()=>r.remove(),1600)}
  for(let i=0;i<inf.parts;i++){const s=document.createElement('i');const cf=i%4===0;s.className='gp2 '+(cf?'cf':'');const a=R(0,6.28),r=R(120,380);s.style.cssText=`--s:${R(8,18)}px;--pc:${pickOne(inf.cols)};--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r}px;--r:${R(-360,360)}deg;--d:${R(.9,1.8)}s`;g.appendChild(s);void s.offsetWidth;s.classList.add('go');setTimeout(()=>s.remove(),2000)}
  pack.animate([{opacity:1}],{duration:1});$$('.half',pack).forEach((h,i)=>h.animate([{transform:'none',opacity:1},{transform:`translate(${i?30:-30}px,${i?150:-150}px) rotate(${i?14:-14}deg)`,opacity:0}],{duration:620,easing:'cubic-bezier(.5,0,.8,.4)',fill:'forwards'}));
  $('.seal2',pack).animate([{transform:'scale(1)',opacity:1},{transform:'scale(5)',opacity:0}],{duration:500,fill:'forwards'});const ei=$('.evi',pack);if(ei)ei.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'});
  $$('#g .gr').forEach(r=>r.style.opacity=inf.big?.85:.5);
  if(it.type==='event'||inf.big)confetti(it.type==='event'?inf.cols:inf.cols);
  setTimeout(()=>reveal(it,inf,res),S.reduce?60:inf.big?760:560)}
 function reveal(it,inf,res){sfxReveal(it);$('#pkw').style.display='none';const cw=$('#cw'),gH=g.clientHeight,cy=gH*.42;
  if(it.type==='card'||it.type==='event'){const c=it.card,w=c.land?292:(c.ar>.9?250:218),h=w/c.ar+w*.05;
   cw.innerHTML=`<div class="tl"><div class="tiltable" id="tlt"><div class="flipper" id="fl" style="width:${w}px">${cardHTML(c,{w:w})}<div class="bkface" style="--w:${w}px">${backHTML(c,{w:w,fill:1})}</div></div></div></div>`;
   cw.classList.add('show');
   setTimeout(()=>{cw.classList.add('rev');setTimeout(()=>{const pc=$('#fl .pc');if(!S.reduce)pcFx(pc);slam(inf.txt,cy+h/2+26);info(it,res)},560)},S.reduce?50:620);
   tiltOn(g,$('#tlt'));
   const ta=$('#tlt');ta.parentNode.style.pointerEvents='none'}
  else if(it.type==='title'){cw.innerHTML='';const tr=document.createElement('div');tr.className='ttlrev show';tr.innerHTML=`${avatar(ME,170,it.id)}<div>${titleFrame(it.id,null,76)}</div>`;g.appendChild(tr);slam(inf.txt,cy+170);setTimeout(()=>info(it,res),500)}
  else{const tr=document.createElement('div');tr.className='ttlrev show';tr.innerHTML=`<div class="gf" style="width:auto"><div class="gi sv" style="width:150px;height:150px;font-size:70px;border-radius:40px">${ic('shield')}</div></div><b style="font-size:30px;margin-top:-4px">+${it.n}</b>`;g.appendChild(tr);slam(inf.txt,cy+140);setTimeout(()=>info(it,res),500)}}
 function slam(txt,top){const rn=$('#rn');if(!rn)return;rn.textContent=txt;rn.style.top=top+'px';rn.style.fontSize=txt.length>8?'30px':'38px';rn.classList.add('go')}
 function info(it,res){const gi=$('#gi');if(!gi)return;let b='',n='',s='';
  if(it.type==='card'||it.type==='event'){const c=it.card;b=c.name;s=`${c.land?'Thẻ ngang':'Thẻ dọc'} · ${it.src||'Hoàn thành hôm nay'}`;n=res.isNew?`<span class="badge nw">${ic('spark')} THẺ MỚI</span>`:`<span class="badge dup">Bạn đã có thẻ này · ×${res.n}</span>`}
  else if(it.type==='title'){b=(TMAP[it.id]||{name:it.id}).name;s='Đã thêm cả khung tròn và khung ngang vào Hồ sơ';n=`<span class="badge nw">${ic('star')} DANH HIỆU MỚI</span>`}
  else{b=`Thẻ cứu streak ×${it.n}`;s=`Bạn có ${S.rescue} thẻ cứu để giữ chuỗi trong 48 giờ`;n=`<span class="badge nw">${ic('shield')} QUÀ</span>`}
  gi.innerHTML=`${n}<b>${b}</b><span>${s}</span>`;gi.classList.add('go');
  const last=GST.i===GST.items.length-1,multi=GST.items.length>1;
  $('#gb').innerHTML=`<button data-gnext>${last?(multi?'Xem tổng kết':'Xong'):'Tiếp tục'} ${ic('right')}</button>`;$('#gb').classList.add('go');$('#gb [data-gnext]').onclick=()=>{GST.i++;if(GST.i>=GST.items.length){multi?summary():finishAll()}else stageItem()};
  if(it.type==='title'){$('#gb').insertAdjacentHTML('afterbegin',`<button class="gh" data-geq>Đeo ngay</button>`);$('#gb [data-geq]').onclick=async e=>{const bt=e.currentTarget;try{await API.equip(it.id);S.equip=it.id;ME.frame=it.id;bt.textContent='Đang đeo';toast('Đã đeo cặp khung mới')}catch(er){apiFail(er)}}}}
 function confetti(cols){const cf=$('#cf');cf.innerHTML='';const n=it.type==='event'?46:26;for(let i=0;i<n;i++){const c=document.createElement('i');c.style.cssText=`left:${R(0,100)}%;background:${pickOne(cols)};--d:${R(2.4,4.4)}s;--l:${R(0,1.6)}s;--x:${R(-70,70)}px;--r:${R(200,720)}deg;width:${R(6,11)}px;height:${R(9,16)}px`;cf.appendChild(c)}}
}
function summary(){const g=$('#g'),G=GST;G.sum=true;const gs=$('#gs');$('#cw').innerHTML='';$('#rn').className='rname';$('#gi').className='ginfo';$('#gb').className='gbtns';$$('#g .ttlrev,#g .gp2,#g .shk-r').forEach(x=>x.remove());$('#pkw').style.display='none';$('#gtit').innerHTML='';
 const cards=G.got.filter(x=>x.it.card),extras=G.got.filter(x=>!x.it.card);
 gs.innerHTML=`<h2>Bạn nhận được</h2><div class="row2">${cards.map(x=>cardHTML(x.it.card,{w:x.it.card.land?150:112,thumb:1})).join('')}</div>${extras.map(x=>x.it.type==='title'?`<div style="display:grid;place-items:center;gap:6px">${avatar(ME,110,x.it.id)}${titleFrame(x.it.id,null,50)}</div>`:`<div class="chip" style="color:#fff;border-color:rgba(255,255,255,.3);display:flex;gap:7px;align-items:center">${ic('shield')} Thẻ cứu ×${x.it.n}</div>`).join('')}<div class="sub" style="color:#fff;opacity:.8">Tất cả đã nằm trong album và hồ sơ của bạn.</div>
 <div class="gbtns go" style="position:static;opacity:1;flex-direction:column;align-items:center"><button data-gcol>${ic('image')} Xem bộ sưu tập</button><button class="gh" data-gx>Đóng</button></div>`;gs.classList.add('on');$$('#g .gr').forEach(r=>r.style.opacity=.18);$('#cf').innerHTML='';$('[data-gcol]',gs).onclick=()=>{finishAll();go('col')};$('[data-gx]',gs).onclick=finishAll}
function finishAll(){const g=$('#g'),G=GST;GST=null;g.className='g';g.innerHTML='';g.onpointerdown=g.onpointerup=g.onpointerleave=g.onpointermove=null;if(G&&G.done)G.done();renderAll()}
/* ===== quy trình hàng ngày ===== */
async function tickTask(id){let t=null,k=null;for(const kk in S.tasks){const f=S.tasks[kk].find(x=>x.id===id);if(f){t=f;k=kk}}if(!t)return;
 if(k===todayKey&&S.claimed){toast('Ngày đã khóa, chỉ xem lại');return}
 sfx('tick');vib(12);const was=t.done,wasWait=S.wait;t.done=!t.done;S.taskTotal+=t.done?1:-1;
 if(k===todayKey){const mt=mine(k);if(mt.every(x=>x.done)&&t.done)toast(API.online()?'Đủ việc! Nhận thẻ hôm nay ở tab Hôm nay':'Đủ việc. Cần có mạng để nhận thẻ')}
 refreshOpen();
 try{const r=await API.setDone(t,t.done);if(r&&r.queued){t.pending=true;S.pending=API.pendingCount();offlinePill()}else{await API.reload('lite');await newTitlesPrompt();if(wasWait&&!S.wait)toast('Đã nối lại chuỗi: '+S.streak+' ngày');refreshOpen()}}
 catch(e){t.done=was;S.taskTotal+=was?1:-1;refreshOpen();apiFail(e)}}
function refreshOpen(){const sel=S.sel;if(sheetOpen&&sel){const p=sel.split('-').map(Number);if($('#sheet h2')&&$('#sheet .lock-banner,.t,.empty,.banner'))daySheet(p[2])}renderAll()}
async function useSaver(iso){closeSheet();if(!API.online()){toast('Cần có mạng để dùng thẻ cứu');return}
 iso=iso||S.catchup[0];if(!iso)return;let res;try{res=await API.useRescue(iso)}catch(e){return apiFail(e,'claim')}
 await API.reload();renderAll();const [,m,d]=iso.split('-').map(Number);toast(`Đã dùng thẻ cứu cho ${d}/${m}, còn ${S.rescue}`);
 runGacha(itemsFromResult(res).map(x=>x.type==='card'?{...x,src:'Thẻ cứu ngày '+d+'/'+m}:x),()=>{renderAll();mileCheck()})}
async function doClaim(iso){closeSheet();if(!API.online()){toast('Cần có mạng để nhận thẻ');return}
 iso=iso||TODAY.iso;let res;try{res=await API.claimDay(iso)}catch(e){const c=e&&e.app&&e.app.code;if(c==='NOTHING_TO_CLAIM'){await API.reload();renderAll();toast('Chưa có thẻ nào để nhận');return}return apiFail(e,'claim')}
 await API.reload();renderAll();
 runGacha(itemsFromResult(res),()=>{toast(`Thẻ đã lưu, ngày ${iso.split('-')[2]}/${iso.split('-')[1]} đã khóa`);renderAll();mileCheck()})}
async function newTitlesPrompt(){const k='titles:'+ME.uid,seen=new Set(lsGet(k,null)||[]);const first=lsGet(k,null)===null;const all=[...S.unlocked];
 lsSet(k,all);if(first)return false;const fresh=all.filter(t=>!seen.has(t)&&TMAP[t]&&!t.startsWith('welcome-'));
 if(!fresh.length||GST||WZ)return false;runGacha(fresh.map(id=>({type:'title',id})),()=>renderAll());return true}
function offlinePill(){const p=$('#off');const off=!API.online();p.classList.toggle('on',off||S.pending>0);$('#offt').textContent=S.pending?`${off?'Mất mạng':'Đang đồng bộ'} · ${S.pending} thay đổi chờ đồng bộ`:'Mất mạng · vẫn xem và ghi việc được'}
