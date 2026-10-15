/* ===== v3: chức năng bổ sung theo PLAN + ý tưởng ===== */
/* biểu tượng thêm */
document.querySelector('svg defs').insertAdjacentHTML('beforeend',`
<symbol id="i-bell" viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z"/><path d="M10 21a2.2 2.2 0 0 0 4 0"/></symbol>
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.5C5 15.5 3 12 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-2 6.5-9 11.5z"/></symbol>
<symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></symbol>
<symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5V21M8 7h8"/></symbol>
<symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></symbol>
<symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.2v.1"/></symbol>
<symbol id="i-send" viewBox="0 0 24 24"><path d="M3 11.5L21 4l-7.5 17-2.5-7.5z"/><path d="M11 13.5L21 4"/></symbol>
<symbol id="i-crown" viewBox="0 0 24 24"><path d="M3.5 8l4.5 4 4-7 4 7 4.5-4-1.5 11h-14z"/></symbol>
<symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></symbol>
<symbol id="i-share" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/></symbol>
<symbol id="i-vol" viewBox="0 0 24 24"><path d="M4 9.5v5h4l5 4v-13l-5 4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/></symbol>`);
const notifUnread=()=>S.priv.notif===false?0:NOTIFS.filter(n=>!n.read).length;
function bellBtn(){const n=notifUnread();return `<button class="ibtn ${n?'ring':''}" data-x="notif" aria-label="Thông báo">${ic('bell')}${n?`<span class="dot-n">${n}</span>`:''}</button>`}
/* ----- tiện ích ----- */
const dmy=(m,d,y)=>`${d}/${m}${y?'/'+y:''}`;
function confirmSheet(o){CFN=o.ok;openSheet(`<div class="cfm ${o.danger?'dg':''}"><div class="cfi">${ic(o.icon||'alert')}</div><h2>${o.title}</h2><p class="sub">${o.body}</p>${o.extra||''}<button class="big ${o.danger?'dg':''}" id="cfok" data-x="cfok" ${o.disabled?'disabled':''}>${o.okText}</button><button class="big gh" data-x="cfno">${o.noText||'Huỷ'}</button></div>`)}
let CFN=null;
/* ===== âm thanh và rung ===== */
let AC=null;
function sfx(k){if(!S.priv.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t0=AC.currentTime;
 const seq={tick:[[880,.07,0]],flip:[[330,.05,0],[494,.08,.05]],rare:[[523,.12,0],[659,.12,.1],[784,.22,.2]],legend:[[523,.1,0],[659,.1,.09],[784,.1,.18],[1047,.34,.27]],supreme:[[392,.1,0],[523,.1,.08],[659,.1,.16],[784,.1,.24],[1047,.14,.32],[1319,.5,.42]],ok:[[660,.08,0],[880,.14,.08]]}[k]||[];
 seq.forEach(([f,d,o])=>{const os=AC.createOscillator(),g=AC.createGain();os.type='sine';os.frequency.value=f;g.gain.setValueAtTime(0,t0+o);g.gain.linearRampToValueAtTime(.13,t0+o+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+o+d);os.connect(g);g.connect(AC.destination);os.start(t0+o);os.stop(t0+o+d+.03)})}catch(e){}}
function vib(p){if(S.priv.haptic===false)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function sfxReveal(it){let k='flip',v=20;if(it.type==='card'||it.type==='event'){const r=it.card.r;if(r==='rare'){k='rare';v=[30,40,30]}else if(r==='legend'||(r==='event'&&['SS','SSS'].includes(it.card.tier))){k='legend';v=[40,40,40,40,80]}else if(r==='supreme'||(r==='event'&&it.card.tier==='AURA')){k='supreme';v=[60,40,60,40,60,40,160]}else if(r==='event'){k='rare';v=[30,40,30]}}else if(it.type==='title'){k='rare';v=[30,40,30]}
 sfx(k);vib(v)}
/* ===== thông báo trong app ===== */
function openNotif(){renderNotif();openPage('pgNotif')}
function renderNotif(){const un=NOTIFS.filter(n=>!n.read),rd=NOTIFS.filter(n=>n.read);
 const row=n=>{let act='';
  if(n.kind==='req')act=`<div class="nbtn"><button class="btn-s pink" data-x="nacc" data-id="${n.id}">Chấp nhận</button><button class="btn-s ghost" data-x="ndec" data-id="${n.id}">Từ chối</button></div>`;
  if(n.kind==='inv')act=`<div class="nbtn"><button class="btn-s pink" data-x="nacc" data-id="${n.id}">Tham gia</button><button class="btn-s ghost" data-x="ndec" data-id="${n.id}">Từ chối</button></div><small class="nlim ${CALS.length>=S.limits.calendars?'bad':''}">Lịch của bạn: ${CALS.length}/${S.limits.calendars}${CALS.length>=S.limits.calendars?'. Cần rời một lịch trước khi tham gia.':''}</small>`;
  return `<div class="nrow ${n.read?'':'un'}" data-x="nopen" data-id="${n.id}"><span class="ni t-${n.tone}">${ic(n.ic)}</span><div class="nb"><b>${esc(n.h)}</b><small>${esc(n.s)}</small>${act}<em>${esc(n.time)}</em></div>${n.read?'':'<i class="nd"></i>'}</div>`};
 $('#pgNotif').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgNotif" aria-label="Quay lại">${ic('left')}</button><h1>Thông báo</h1>${un.length?`<button class="btn-s ghost" data-x="nall">Đọc hết</button>`:''}</div>
 <div class="pbody">${S.priv.notif?'':`<div class="nwarn">${ic('bell')}<span>Bạn đang tắt thông báo trong app. Thông báo mới sẽ không hiện chấm đỏ.</span><button class="btn-s" data-x="non">Bật lại</button></div>`}
 ${NOTIFS.length?`${un.length?`<div class="nsec">Mới</div>${un.map(row).join('')}`:''}${rd.length?`<div class="nsec">Trước đó</div>${rd.map(row).join('')}`:''}`:`<div class="empty"><div class="ei">${ic('bell')}</div>Chưa có thông báo nào.<br>Lời mời, nhắc việc và cổ vũ từ bạn bè sẽ hiện ở đây.</div>`}</div>`}
async function respondNotif(id,accept){const n=NOTIFS.find(x=>x.id===id);if(!n)return;
 try{if(n.kind==='req'){await API.respondFriend(n.ref,accept);toast(accept?'Đã kết bạn':'Đã từ chối')}
  else{if(accept&&CALS.length>=S.limits.calendars){toast('Bạn đã đủ '+S.limits.calendars+' lịch, hãy rời một lịch trước');return}await API.respondInvite(n.ref,accept);toast(accept?'Đã tham gia lịch':'Đã từ chối')}
  await API.reload();renderAll();if($('#pgNotif').classList.contains('on'))renderNotif();newTitlesPrompt()}catch(e){apiFail(e)}}
/* ===== quản lý lịch ===== */
const isOwner=c=>c.owner==='me';
const calSub=c=>`${c.members.length} người${isOwner(c)?' · bạn là chủ lịch':''}`;
function calsSheet(){openSheet(`<h2>Lịch của bạn (${CALS.length}/${S.limits.calendars})</h2><div class="sub">Tối đa ${S.limits.calendars} lịch, tính cả lịch được mời. Mỗi lịch có giao diện riêng.</div>${CALS.map((c,i)=>{const m=MEMBERS[c.members[Math.min(1,c.members.length-1)]]||ME;return `<div class="fr"><div class="av" data-act="pickcal" data-i="${i}" style="--s:46px;--ca:${m.a};--cb:${m.b};cursor:pointer"><div class="pt" style="font-size:14px">${esc(c.name)[0]}</div></div><div class="mid" data-act="pickcal" data-i="${i}" style="cursor:pointer"><b>${esc(c.name)}</b><small>${calSub(c)}</small></div>${(S.calIdx||0)===i?'<span class="chip on">Đang xem</span>':''}<button class="ibtn sm" data-x="mcal" data-i="${i}" aria-label="Quản lý lịch">${ic('gear')}</button></div>`}).join('')}
 <button class="big" data-x="ncal" ${CALS.length>=S.limits.calendars?'disabled':''}>${ic('plus')} Tạo lịch mới${CALS.length>=S.limits.calendars?` (đã đủ ${S.limits.calendars} lịch)`:''}</button>`)}
function newCalSheet(){openSheet(`<h2>Tạo lịch mới</h2><div class="sub">Bạn là chủ lịch. Mời bạn bè sau khi tạo.</div><input class="in" id="ncn" maxlength="30" placeholder="Tên lịch, ví dụ: Gia đình" autocomplete="off"><div class="err" id="ncerr"></div><button class="big" data-x="ncok">Tạo lịch</button><button class="big gh" data-x="cals">Quay lại</button>`);setTimeout(()=>$('#ncn')&&$('#ncn').focus(),350)}
function manageCal(i){const c=CALS[i];if(!c)return;const own=isOwner(c);
 openSheet(`<h2>${esc(c.name)}</h2><div class="sub">${c.members.length}/${S.limits.members} thành viên · ${own?'Bạn là chủ lịch':'Chủ lịch: '+esc((MEMBERS[c.owner]||{name:'?'}).name)}</div>
 <div class="mlist">${c.members.map(id=>{const m=MEMBERS[id]||ME,isO=id===c.owner;return `<div class="fr">${avatar(m,44,id==='me'?S.equip:m.frame)}<div class="mid"><b>${esc(m.name)}${id==='me'?' (bạn)':''}</b><small>${isO?'Chủ lịch':'Thành viên'}</small></div>${own&&id!=='me'?`<div class="fract"><button class="chip" data-x="cown" data-i="${i}" data-m="${id}">Chuyển chủ</button><button class="chip" data-x="crem" data-i="${i}" data-m="${id}">Xóa</button></div>`:isO?'<span class="chip on">Chủ lịch</span>':''}</div>`}).join('')}</div>
 <div class="btnrow" style="margin-top:6px">${own&&c.members.length<S.limits.members?`<button class="btn-s ghost" data-x="cinv" data-i="${i}">${ic('users')} Mời bạn bè</button>`:''}${own?`<button class="btn-s ghost" data-x="cren" data-i="${i}">${ic('pencil')} Đổi tên</button>`:''}</div>
 <div class="dz"><button class="menu dgm" data-x="cleave" data-i="${i}"><span class="l">${ic('x')}<span>Rời lịch<small>Việc của bạn biến mất khỏi lịch chung. Thẻ và danh hiệu đã nhận vẫn giữ.</small></span></span></button>
 ${own?`<button class="menu dgm" data-x="cdel" data-i="${i}"><span class="l">${ic('trash')}<span>Xóa lịch<small>Xóa việc của mọi người trong lịch. Không thu hồi phần thưởng đã nhận.</small></span></span></button>`:''}</div>
 <button class="big gh" data-x="cals">Quay lại danh sách lịch</button>`)}
function leaveCal(i){const c=CALS[i];
 if(CALS.length<=1){toast('Bạn cần giữ ít nhất 1 lịch');return}
 if(isOwner(c)&&c.members.length>1){const others=c.members.filter(x=>x!=='me');
  openSheet(`<div class="cfm"><div class="cfi">${ic('crown')}</div><h2>Bạn là chủ lịch</h2><p class="sub">Hãy chuyển chủ lịch cho một thành viên trước khi rời, hoặc xóa lịch.</p>
  ${others.map(id=>`<div class="fr">${avatar(MEMBERS[id],44,MEMBERS[id].frame)}<div class="mid"><b>${esc(MEMBERS[id].name)}</b><small>Thành viên</small></div><button class="chip on" data-x="cown" data-i="${i}" data-m="${id}">Chuyển chủ</button></div>`).join('')}
  <button class="big dg" data-x="cdel" data-i="${i}">${ic('trash')} Xóa lịch thay vì rời</button><button class="big gh" data-x="mcal" data-i="${i}">Quay lại</button></div>`);return}
 if(isOwner(c)){delCal(i);return}
 confirmSheet({icon:'x',title:`Rời “${esc(c.name)}”?`,body:'Việc của bạn sẽ biến mất khỏi lịch chung và không chuyển cho ai. Thẻ và danh hiệu bạn đã nhận vẫn giữ nguyên.',okText:'Rời lịch',danger:1,ok:async()=>{try{await API.leaveCalendar(c.id);S.calIdx=0;await API.reload();closeSheet();renderAll();toast('Đã rời “'+c.name+'”')}catch(e){apiFail(e)}}})}
function delCal(i){const c=CALS[i];
 if(CALS.length<=1){toast('Bạn cần giữ ít nhất 1 lịch');return}
 confirmSheet({icon:'trash',title:`Xóa “${esc(c.name)}”?`,body:`Toàn bộ việc của ${c.members.length} người trong lịch này sẽ bị xóa và không khôi phục được. Phần thưởng đã nhận không bị thu hồi. Gõ tên lịch để xác nhận.`,extra:`<input class="in" id="cfin" placeholder="${esc(c.name)}" autocomplete="off">`,okText:'Xóa lịch vĩnh viễn',danger:1,disabled:1,ok:async()=>{try{await API.deleteCalendar(c.id,$('#cfin').value.trim());S.calIdx=0;await API.reload();closeSheet();renderAll();toast('Đã xóa “'+c.name+'”')}catch(e){apiFail(e)}}});
 const inp=$('#cfin');inp.oninput=()=>{$('#cfok').disabled=inp.value.trim()!==c.name}}
function transferCal(i,id){const c=CALS[i],m=MEMBERS[id];
 confirmSheet({icon:'crown',title:`Chuyển chủ lịch cho ${m.name}?`,body:`${m.name} sẽ quản lý lịch “${esc(c.name)}” và thành viên. Bạn trở thành thành viên thường và không lấy lại quyền được nếu không được chuyển lại.`,okText:'Chuyển chủ lịch',ok:async()=>{try{await API.transferOwner(c.id,m.uid);await API.reload();manageCal(i);toast('Đã chuyển chủ lịch cho '+m.name);renderAll()}catch(e){apiFail(e)}}})}
function removeMember(i,id){const c=CALS[i],m=MEMBERS[id];
 confirmSheet({icon:'x',title:`Xóa ${m.name} khỏi lịch?`,body:`Việc của ${m.name} sẽ biến mất khỏi “${esc(c.name)}”. Bạn bè có thể được mời lại sau.`,okText:'Xóa khỏi lịch',danger:1,ok:async()=>{try{await API.removeMember(c.id,m.uid);await API.reload();manageCal(i);toast('Đã xóa '+m.name+' khỏi lịch');renderAll()}catch(e){apiFail(e)}}})}
function inviteSheet(i){const c=CALS[i];const list=S.friends.filter(f=>!c.members.includes(f.id));
 openSheet(`<h2>Mời vào “${esc(c.name)}”</h2><div class="sub">Còn ${S.limits.members-c.members.length} chỗ. Người được mời sẽ nhận thông báo.</div>${list.length?list.map(f=>`<div class="fr">${avatar(f,44,f.frame)}<div class="mid"><b>${esc(f.name)}</b><small>@${esc(f.un)}</small></div><button class="chip ${f._inv&&f._inv[c.id]?'':'on'}" data-x="cinv1" data-i="${i}" data-id="${f.id}">${f._inv&&f._inv[c.id]?'Đã mời':'Mời'}</button></div>`).join(''):'<div class="empty" style="padding:20px">Tất cả bạn bè đã ở trong lịch này.</div>'}<button class="big gh" data-x="mcal" data-i="${i}">Quay lại</button>`)}
function renameSheet(i){const c=CALS[i];openSheet(`<h2>Đổi tên lịch</h2><input class="in" id="rnn" maxlength="30" value="${esc(c.name)}" autocomplete="off"><div class="err" id="rnerr"></div><button class="big" data-x="rnok" data-i="${i}">Lưu tên</button><button class="big gh" data-x="mcal" data-i="${i}">Quay lại</button>`)}
/* ===== thẻ trùng ===== */
function openDup(){const own=Object.entries(S.own).map(([id,o])=>({c:CBY[id],o})).filter(x=>x.c);
 const tot=own.reduce((s,x)=>s+x.o.n,0),dups=own.filter(x=>x.o.n>1),extra=own.reduce((s,x)=>s+x.o.n-1,0);
 const top=[...own].sort((a,b)=>b.o.n-a.o.n)[0];
 const ord=['supreme','legend','rare','common','event'];
 const group=ord.map(r=>({r,list:dups.filter(x=>x.c.r===r).sort((a,b)=>b.o.n-a.o.n)})).filter(g=>g.list.length);
 $('#pgDup').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgDup" aria-label="Quay lại">${ic('left')}</button><h1>Thẻ trùng</h1></div>
 <div class="pbody"><div class="stats" style="margin:4px 14px 0"><div><b>${tot}</b><small>Lượt đã nhận</small></div><div><b>${own.length}</b><small>Thẻ khác nhau</small></div><div><b>${extra}</b><small>Lượt trùng</small></div></div>
 ${top?`<div class="card-b dupt"><span class="dtr">${ic('crown')}</span><div style="min-width:0"><small>Nhận nhiều nhất</small><b>${esc(top.c.name)}</b></div><span class="dtn">×${top.o.n}</span></div>`:''}
 <div class="sub" style="padding:10px 18px 0">Thẻ trùng vẫn có giá trị: số lần nhận được lưu để bạn biết thẻ nào “có duyên” với mình. Thẻ sự kiện tính riêng, không vào “đủ bộ”.</div>
 ${group.length?group.map(g=>`<div class="sec" style="--rc:${RCOL[g.r]}"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:${RCOL[g.r]};box-shadow:0 0 8px ${RCOL[g.r]}"></i>${g.r==='event'?'Sự kiện':NAME[g.r]}</span><small>${g.list.length} thẻ trùng</small></div><div class="card-b" style="margin-top:4px;padding:6px 14px">${g.list.map(x=>`<button class="duprow" data-act="view" data-cid="${x.c.id}"><span class="dth">${cardHTML(x.c,{w:'100%',thumb:1})}</span><span class="dtx"><b>${esc(x.c.name)}</b><small>Lần đầu ${esc(x.o.date)} · ${esc(x.o.src)}</small></span><span class="dtn">×${x.o.n}</span></button>`).join('')}</div>`).join(''):`<div class="empty"><div class="ei">${ic('cards')}</div>Bạn chưa có thẻ trùng nào.</div>`}</div>`;openPage('pgDup')}
/* ===== trang admin gửi thư ===== */
const ADM={to:'all',users:[],gifts:[],kind:'card',rar:'any',saver:1,title:'',sched:'now',cid:'',cf:'event',hist:[]};
function admKeep(fn){const keep={t:($('#att')||{}).value||'',b:($('#atb')||{}).value||''};fn();renderAdmin();$('#att').value=keep.t;$('#atb').value=keep.b;$('#atc').textContent=keep.b.length+'/600'}
const CFLT=[['event','Sự kiện'],['supreme','Bá khí'],['legend','Huyền Thoại'],['rare','Hiếm'],['common','Thường']];
const GRAR={any:'Ngẫu nhiên',common:'Thường',rare:'Hiếm',legendary:'Huyền Thoại',supreme:'Bá khí'};
const GIFTLBL=g=>g.type==='card'?`1 thẻ ${GRAR[g.rarity]||'ngẫu nhiên'}`:g.type==='rescue'?`${g.qty} thẻ cứu`:g.type==='card_id'?`Thẻ: ${(CBY[g.id]||{name:g.id}).name}`:`Khung/danh hiệu: ${(TMAP[g.id]||{name:g.id}).name}`;
async function openAdmin(){if(!ADM.title&&TITLES[0])ADM.title=TITLES[0].id;renderAdmin();openPage('pgAdmin');try{const h=await API.adminSent();ADM.hist=h.map(x=>({t:x.title,to:`${x.recipients} người`,g:x.gifts.length?x.gifts.map(GIFTLBL).join(', '):'Không có quà',d:fmtDT(x.created_at)}));renderAdmin()}catch(e){}}
const fmtDT=iso=>{const d=new Date(iso);return `${pad(d.getDate())}/${pad(d.getMonth()+1)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`};
function renderAdmin(){const A=ADM;const tl=[...EVT,...WELCOME,...TITLES];
 $('#pgAdmin').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgAdmin" aria-label="Quay lại">${ic('left')}</button><h1>Gửi thư (admin)</h1><span class="chip on" style="font-size:10.5px">${ic('crown')} Admin</span></div>
 <div class="pbody"><div class="card-b" style="margin-top:6px"><h2>Người nhận</h2>
  <div class="iseg a2 ${A.to==='some'?'r':''}" style="margin-top:8px"><i></i><button class="${A.to==='all'?'on':''}" data-x="ato" data-v="all">Tất cả</button><button class="${A.to==='some'?'on':''}" data-x="ato" data-v="some">Theo username</button></div>
  ${A.to==='some'?`<div class="achips">${A.users.map((u,i)=>`<span class="chip on">@${esc(u)} <b data-x="aur" data-i="${i}" style="cursor:pointer">×</b></span>`).join('')}</div><div class="arow"><input class="in" id="aun" placeholder="username, rồi bấm Thêm" autocomplete="off" autocapitalize="off"><button class="btn-s" data-x="aua">Thêm</button></div>`:`<div class="sub" style="margin-top:8px">Gửi cho toàn bộ tài khoản đang hoạt động.</div>`}</div>
 <div class="card-b"><h2>Nội dung thư</h2><input class="in" id="att" maxlength="60" placeholder="Tiêu đề (tối đa 60 ký tự)" autocomplete="off"><textarea class="in" id="atb" rows="4" maxlength="600" placeholder="Lời nhắn gửi bạn bè..."></textarea><div class="sub" id="atc">0/600</div></div>
 <div class="card-b"><h2>Quà đính kèm <em>${A.gifts.length}</em></h2><div class="sub">Quà admin là quà bổ sung, không tính vào hạn mức 2 thẻ mỗi ngày và không khóa ngày.</div>
  <div class="gsel"><button class="chip ${A.kind==='card'?'on':''}" data-x="agk" data-v="card">Thẻ ngẫu nhiên</button><button class="chip ${A.kind==='cardid'?'on':''}" data-x="agk" data-v="cardid">Thẻ cụ thể</button><button class="chip ${A.kind==='rescue'?'on':''}" data-x="agk" data-v="rescue">Thẻ cứu</button><button class="chip ${A.kind==='title'?'on':''}" data-x="agk" data-v="title">Khung và danh hiệu</button></div>
  ${A.kind==='card'?`<div class="gsel">${['any','common','rare','legendary','supreme'].map(r=>`<button class="chip ${A.rar===r?'on':''}" data-x="agr" data-v="${r}">${GRAR[r]}</button>`).join('')}</div>`:''}
  ${A.kind==='rescue'?`<div class="step"><button class="ibtn sm" data-x="ags" data-v="-1">−</button><b>${A.saver}</b><button class="ibtn sm" data-x="ags" data-v="1">+</button><span class="sub">thẻ cứu (tối đa 5)</span></div>`:''}
  ${A.kind==='cardid'?`<div class="gsel">${CFLT.map(x=>`<button class="chip ${A.cf===x[0]?'on':''}" data-x="agf" data-v="${x[0]}">${x[1]}</button>`).join('')}</div><div class="agrid">${ALLCARDS.filter(c=>c.r===A.cf).sort((a,b)=>(a.ev<b.ev?-1:a.ev>b.ev?1:0)||a.sort-b.sort).map(c=>`<button class="agc ${A.cid===c.id?'on':''}" data-x="agc" data-v="${c.id}"><span class="agth" style="--ar:${c.ar}">${cardHTML(c,{w:'100%',thumb:1})}</span><small>${esc(c.name)}</small></button>`).join('')||'<div class="sub">Không có thẻ nào.</div>'}</div>`:''}
  ${A.kind==='title'?`<div class="agrid t2">${tl.map(t=>`<button class="agc agt ${A.title===t.id?'on':''}" data-x="agp" data-v="${t.id}"><span class="agav">${avatar(ME,64,t.id)}</span><span class="agtf">${titleFrame(t.id,t.name,30)}</span><small>${esc(t.name)}</small></button>`).join('')}</div>`:''}
  <button class="btn-s pink" data-x="aga" style="margin-top:8px">${ic('plus')} Thêm quà này</button>
  <div class="achips">${A.gifts.map((g,i)=>`<span class="chip on">${esc(GIFTLBL(g))} <b data-x="agd" data-i="${i}" style="cursor:pointer">×</b></span>`).join('')}</div></div>
 <div class="card-b"><h2>Thời gian gửi</h2><div class="iseg a2 ${A.sched==='later'?'r':''}" style="margin-top:8px"><i></i><button class="${A.sched==='now'?'on':''}" data-x="asc" data-v="now">Gửi ngay</button><button class="${A.sched==='later'?'on':''}" data-x="asc" data-v="later">Hẹn giờ</button></div>${A.sched==='later'?`<input class="in" id="adt" type="datetime-local">`:''}</div>
 <div style="padding:0 14px"><button class="big alt" data-x="aprev">${ic('mail')} Xem trước thư</button><button class="big" data-x="asend">${ic('send')} Gửi thư</button><div class="sub" style="text-align:center;margin-top:8px">Mỗi thư chỉ gửi một lần. Quà đã gửi không thu hồi được.</div></div>
 <div class="nsec" style="margin-top:14px">Đã gửi gần đây</div>${A.hist.map(h=>`<div class="card-b" style="margin-top:8px;padding:11px 14px"><b style="font-size:13.5px">${esc(h.t)}</b><div class="sub" style="margin-top:2px">${esc(h.to)} · ${esc(h.g)} · ${esc(h.d)}</div></div>`).join('')}</div>`;
 const tb=$('#atb');if(tb)tb.oninput=()=>{$('#atc').textContent=tb.value.length+'/600'}}
function adminDraft(){const t=($('#att')||{}).value||'',b=($('#atb')||{}).value||'';return {t:t.trim(),b:b.trim()}}
function adminCheck(){const d=adminDraft();if(!d.t)return 'Nhập tiêu đề thư';if(!d.b)return 'Nhập nội dung thư';if(ADM.to==='some'&&!ADM.users.length)return 'Thêm ít nhất 1 username người nhận';if(ADM.sched==='later'&&!($('#adt')||{}).value)return 'Chọn thời gian hẹn giờ';return ''}
function adminPreview(){const e=adminCheck();if(e){toast(e);return}const d=adminDraft();
 openSheet(`<h2>Xem trước</h2><div class="sub">Người nhận sẽ thấy thư như thế này.</div><div class="letter gift" style="margin:12px 0 0;width:100%;cursor:default"><div class="lbody"><span class="seal">${ic('gift')}</span><h3>${esc(d.t)}</h3><p>${esc(d.b)}</p><div class="meta"><span>${ADM.sched==='now'?'Vừa xong':'Hẹn giờ'}</span>${ADM.gifts.map(g=>`<span class="gp2">${esc(GIFTLBL(g))}</span>`).join('')}</div></div></div><button class="big gh" data-x="cfno">Đóng</button>`)}
function adminSend(){const e=adminCheck();if(e){toast(e);return}const d=adminDraft(),n=ADM.to==='all'?0:ADM.users.length,at=ADM.sched==='later'?new Date($('#adt').value).toISOString():null;
 confirmSheet({icon:'send',title:`Gửi cho ${ADM.to==='all'?'tất cả tài khoản':n+' người'}?`,body:`Thư “${esc(d.t)}”${ADM.gifts.length?` kèm ${ADM.gifts.map(GIFTLBL).join(', ')}`:''}${ADM.sched==='later'?' sẽ được hẹn giờ gửi':' sẽ gửi ngay'}. Không thể thu hồi sau khi gửi.`,okText:'Xác nhận gửi',ok:async()=>{
  try{await API.adminSendMail({title:d.t,body:d.b,gifts:ADM.gifts,usernames:ADM.to==='all'?null:ADM.users,at});ADM.gifts=[];ADM.users=[];closeSheet();await API.reload();renderAll();openAdmin();toast(ADM.sched==='now'?'Đã gửi thư':'Đã hẹn giờ gửi thư')}
  catch(er){const m=String((er&&er.message)||'');if(/UNKNOWN_USERNAMES:(.*)/.test(m))toast('Không có username: '+m.match(/UNKNOWN_USERNAMES:(.*)/)[1]);else apiFail(er)}}})}
/* ===== màn lỗi ===== */
const ERRS={
 load:{ic:'wifioff',tone:'#4CC9FF',t:'Chưa tải được dữ liệu',p:'Có thể mạng đang chậm. Dữ liệu của bạn vẫn an toàn, bạn chưa mất gì.',b:[['Thử lại','retry'],['Xem bản đã lưu','dis','gh']]},
 claim:{ic:'gift',tone:'#FF2E88',t:'Chưa nhận được thẻ',p:'Thẻ chưa bị mất và việc hôm nay chưa bị khóa. Hãy thử lại để nhận.',b:[['Thử nhận lại','retry'],['Để sau','dis','gh']]},
 session:{ic:'lock',tone:'#9B5CFF',t:'Phiên đăng nhập đã hết hạn',p:'Vì an toàn, bạn cần đăng nhập lại. Việc và thẻ của bạn vẫn còn nguyên.',b:[['Đăng nhập lại','login']]},
 locked:{ic:'shield',tone:'#FFB02E',t:'Tài khoản đang bị tạm khóa',p:'Tài khoản này đang bị tạm khóa. Hãy nhắn admin trong nhóm để được xem lại. Thẻ và danh hiệu của bạn vẫn được giữ.',b:[['Nhắn admin','admin'],['Đăng xuất','login','gh']]},
 quota:{ic:'cal',tone:'#35D0A5',t:'Colentis đang nghỉ một chút',p:'Hệ thống miễn phí đang quá tải tạm thời. Mọi dữ liệu vẫn được giữ, bạn thử lại sau ít phút hoặc sáng mai nhé.',b:[['Thử lại','retry'],['Đóng','dis','gh']]}};
function showErr(k){const e=ERRS[k];if(!e)return;ERR_K=k;const o=$('#errv');
 o.innerHTML=`<div class="errc"><div class="erri" style="--c:${e.tone}"><i></i><span>${ic(e.ic)}</span></div><h2>${e.t}</h2><p>${e.p}</p>${e.b.map(b=>`<button class="big ${b[2]||''}" data-x="err" data-v="${b[1]}">${b[0]}</button>`).join('')}</div>`;o.classList.add('on')}
let ERR_K='';
function errAct(v,btn){const o=$('#errv');
 if(v==='retry'){btn.innerHTML='<i class="spn"></i> Đang thử lại...';btn.disabled=true;o.classList.remove('on');
  const job=ERR_RETRY?ERR_RETRY():API.reload().then(()=>renderAll());Promise.resolve(job).then(()=>{toast('Đã kết nối lại')}).catch(()=>{o.classList.add('on');btn.disabled=false;btn.innerHTML='Thử lại';toast('Vẫn chưa kết nối được, thử lại sau ít phút')})}
 else if(v==='dis')o.classList.remove('on');
 else if(v==='login'){o.classList.remove('on');API.signOut().then(()=>{INTRO.mode='login';runIntro('auth')})}
 else if(v==='admin'){toast('Hãy nhắn admin qua kênh chat của nhóm')}}
/* ===== ngày sinh các thành viên và đếm ngược ===== */
const BDAYS=[{n:'Juhoon',m:1,d:3,y:2008},{n:'Seonghyeon',m:1,d:13,y:2009},{n:'Keonho',m:2,d:14,y:2009},{n:'Martin',m:3,d:20,y:2008},{n:'James',m:10,d:14,y:2005}].map(b=>{const p=PICKS.find(x=>x[0]===b.n);return {...b,a:p[1],b:p[2]}});
function bdInfo(b){const t0=new Date(TODAY.y,TODAY.m,TODAY.d);let dt=new Date(TODAY.y,b.m-1,b.d);if(dt<t0)dt=new Date(TODAY.y+1,b.m-1,b.d);const days=Math.round((dt-t0)/864e5);return {days,year:dt.getFullYear(),age:dt.getFullYear()-b.y,wd:WD[dt.getDay()]}}
function nextBdays(){return BDAYS.map(b=>({b,...bdInfo(b)})).sort((a,c)=>a.days-c.days)}
function closedPane(pa){const p2=$('.panel2',pa);[...p2.children].forEach(c=>{if(!c.classList.contains('iseg'))c.remove()});
 p2.insertAdjacentHTML('beforeend',`<div class="clsd"><div class="cli">${ic('lock')}</div><h3>Đăng ký đang đóng</h3><p>Colentis là nhóm kín dành cho fan CORTIS và hiện đã đủ chỗ. Nếu bạn đã có tài khoản, hãy đăng nhập. Nếu bạn được mời, hãy nhờ admin mở thêm chỗ.</p><button class="igo" id="clgo">Đăng nhập ${ic('right')}</button></div>`);
 $('#clgo').onclick=()=>{INTRO.mode='login';authPane()}}
function myBdInfo(){if(!ME.bd)return null;const [y,m,d]=ME.bd.split('-').map(Number);const lp=q=>q%4===0&&(q%100!==0||q%400===0),mk=q=>new Date(q,m-1,(m===2&&d===29&&!lp(q))?28:d);
 const t0=new Date(TODAY.y,TODAY.m,TODAY.d);let dt=mk(TODAY.y);if(dt<t0)dt=mk(TODAY.y+1);return {b:{n:'Bạn',m:dt.getMonth()+1,d:dt.getDate(),y,a:ME.a,b:ME.b},days:Math.round((dt-t0)/864e5),year:dt.getFullYear(),age:dt.getFullYear()-y,wd:WD[dt.getDay()]}}
function bdMark(m,d){const x=BDAYS.find(b=>b.m===m+1&&b.d===d);return x?`<span class="bdm" title="Sinh nhật ${x.n}">${ic('cake')}</span>`:''}
function evCard(){const nx=nextBdays();const j=nx[0];const first=nx.find(x=>x.days>0)||nx[0];const f=first,pct=Math.max(4,Math.min(100,100-f.days/365*100));
 return `<button class="card-b evc" data-x="events"><div class="evh"><span class="evi" style="--ca:${f.b.a};--cb:${f.b.b}">${ic('cake')}</span><div><small>Sinh nhật sắp tới</small><b>${f.b.n} · ${dmy(f.b.m,f.b.d)}</b></div><span class="evd"><i>${f.days}</i><small>ngày nữa</small></span></div><div class="evbar"><i style="width:${pct}%"></i></div><div class="evf"><span>${nx.filter(x=>x.days>0).slice(0,3).map(x=>`${x.b.n} ${dmy(x.b.m,x.b.d)}`).join(' · ')}</span>${ic('right')}</div></button>`}
function eventsSheet(){const nx=nextBdays(),mine=myBdInfo();
 const row=(x,me)=>{const t=x.days===0;return `<div class="fr bdr ${t?'today':''}"><div class="bda" style="--ca:${x.b.a};--cb:${x.b.b}">${me?initials(ME.name):x.b.n[0]}</div><div class="mid"><b>${me?'Sinh nhật của bạn':esc(x.b.n)}</b><small>${dmy(x.b.m,x.b.d)} · ${x.wd} · tròn ${x.age} tuổi${x.b.n==='James'||me?'':''}</small></div><div class="bdd">${t?'<b class="tdy">Hôm nay</b>':`<b>${x.days}</b><small>ngày nữa</small>`}</div></div>`};
 openSheet(`<h2>Sự kiện sắp tới</h2><div class="sub">Ngày sinh các thành viên CORTIS. Hôm nay là ${TODAY.d}/${TODAY.m+1}/${TODAY.y}.</div>
 ${mine?`<div class="evme">${row(mine,1)}</div>`:`<button class="evme add" data-x="setbd">${ic('plus')} Thêm ngày sinh của bạn để đếm ngược</button>`}
 ${nx.map(x=>row(x)).join('')}
 <div class="evnote">${ic('gift')}<span>${evMail()?'Quà sự kiện đang chờ trong hòm thư.':'Quà sự kiện sẽ gửi vào hòm thư đúng ngày.'} Quà sự kiện các thành viên khác chưa công bố.</span></div>
 <button class="big gh" data-x="cfno">Đóng</button>`)}
/* ===== quên mật khẩu ===== */
function pwScore(p){let s=0;if(p.length>=6)s++;if(p.length>=10)s++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p))s++;if(/\d/.test(p)&&/[^A-Za-z0-9]/.test(p))s++;return Math.min(3,Math.max(p.length?1:0,s>=4?3:s>=2?2:1))}
function forgotFlow(step,email){const pa=$('#pa');if(!pa)return;const p2=$('.panel2',pa);if(!p2)return;FG.step=step;if(email!==undefined)FG.email=email;
 const back=`<button class="fgb" data-fg="back">${ic('left')} Quay lại đăng nhập</button>`;
 if(step===1)p2.innerHTML=`${back}<h2 class="fgh">Quên mật khẩu?</h2><p class="fgp">Nhập email bạn đã đăng ký. Nếu email có trong hệ thống, Colentis sẽ gửi liên kết để đặt mật khẩu mới.</p><form id="fgf" novalidate><div class="fld" data-f="email">${ic('mail')}<input id="fge" type="email" placeholder="Email" value="${esc(FG.email||'')}" autocomplete="off"><div class="err"></div></div><button class="igo" id="fgs" type="submit">Gửi liên kết ${ic('right')}</button></form>`;
 if(step===2){const m=String(FG.email).replace(/^(.).*(@.*)$/,'$1•••$2');p2.innerHTML=`${back}<div class="fgmail"><span>${ic('mail')}</span><i></i></div><h2 class="fgh" style="text-align:center">Kiểm tra email của bạn</h2><p class="fgp" style="text-align:center">Nếu <b>${esc(m)}</b> đã đăng ký, một liên kết đặt lại mật khẩu vừa được gửi. Liên kết có hiệu lực trong 60 phút. Đừng quên xem cả thư rác.</p><button class="fgresend" id="fgr" data-fg="resend" disabled>Gửi lại sau <b id="fgt">30</b>s</button>`;
  let n=30;clearInterval(FG.tm);FG.tm=setInterval(()=>{n--;const t=$('#fgt'),r=$('#fgr');if(!t||!r){clearInterval(FG.tm);return}if(n<=0){clearInterval(FG.tm);r.disabled=false;r.textContent='Gửi lại email'}else t.textContent=n},1000)}
 if(step===3)p2.innerHTML=`<h2 class="fgh">Đặt mật khẩu mới</h2><p class="fgp">Chọn mật khẩu từ 6 ký tự. Mật khẩu mạnh hơn khi dài, có chữ hoa, số và ký hiệu.</p><form id="fgn" novalidate><div class="fld" data-f="p1">${ic('lock')}<input id="fgp1" type="password" placeholder="Mật khẩu mới" autocomplete="off"><div class="err"></div></div><div class="pwm"><i></i><i></i><i></i><span id="pwl">Nhập mật khẩu</span></div><div class="fld" data-f="p2">${ic('lock')}<input id="fgp2" type="password" placeholder="Nhập lại mật khẩu" autocomplete="off"><div class="err"></div></div><button class="igo" type="submit">Lưu mật khẩu ${ic('right')}</button></form>`;
 if(step===4)p2.innerHTML=`<div class="fgok"><span>${ic('check')}</span></div><h2 class="fgh" style="text-align:center">Đã đổi mật khẩu</h2><p class="fgp" style="text-align:center">Mật khẩu mới đã có hiệu lực. Các thiết bị khác sẽ cần đăng nhập lại.</p><button class="igo" data-fg="login">Đăng nhập ${ic('right')}</button>`;
 const bad=(k,m)=>{const d=$(`[data-f=${k}]`,p2);d.classList.add('bad');$('.err',d).textContent=m;setTimeout(()=>d.classList.remove('bad'),400);return 1};
 $$('input',p2).forEach(i=>i.addEventListener('input',()=>{const d=i.closest('.fld');d.classList.remove('bad');$('.err',d).textContent=''}));
 const f1=$('#fgf');if(f1)f1.onsubmit=async e=>{e.preventDefault();if(!API.online())return toast('Cần có mạng để gửi email');const v=$('#fge').value.trim();if(!/^\S+@\S+\.\S+$/.test(v))return void bad('email','Email chưa đúng, thử lại nhé');const b=$('#fgs');b.classList.add('ld');b.innerHTML='<span class="sp"></span> Đang gửi...';try{await API.resetPassword(v)}catch(er){}forgotFlow(2,v)};
 const p=$('#fgp1');if(p)p.oninput=()=>{const s=pwScore(p.value);$$('.pwm i',p2).forEach((x,i)=>x.className=i<s?'s'+s:'');$('#pwl').textContent=['Nhập mật khẩu','Yếu','Tạm được','Mạnh'][s]};
 const f3=$('#fgn');if(f3)f3.onsubmit=e=>{e.preventDefault();let n=0;const a=$('#fgp1').value,b=$('#fgp2').value;if(a.length<6)n+=bad('p1','Mật khẩu cần từ 6 ký tự');if(b!==a)n+=bad('p2','Hai mật khẩu chưa giống nhau');if(n)return;const sb=$('button[type=submit]',f3);sb.disabled=true;API.updatePassword(a).then(()=>forgotFlow(4)).catch(er=>{sb.disabled=false;toast(failMsg(er))})}}
const FG={step:0,email:'',tm:0};
document.addEventListener('click',e=>{const b=e.target.closest('[data-fg]');if(!b)return;const a=b.dataset.fg;
 if(a==='back'||a==='login'){clearInterval(FG.tm);INTRO.mode='login';authPane()}
 else if(a==='open')forgotFlow(3);
 else if(a==='resend'){API.resetPassword(FG.email).catch(()=>{});toast('Đã gửi lại email');forgotFlow(2)}});
/* ===== tổng kết tháng ===== */
function recap(){const y=TODAY.y,m=TODAY.m;let days=0,full=0,tot=0,done=0;const wd=[0,0,0,0,0,0,0];
 for(let d=1;d<=TODAY.d;d++){const ts=myTasks(key(y,m,d));if(!ts.length)continue;days++;tot+=ts.length;const dn=ts.filter(t=>t.done).length;done+=dn;if(dn===ts.length)full++;wd[new Date(y,m,d).getDay()]+=dn}
 const pre=`${y}-${pad(m+1)}-`,got=[];Object.keys(S.grants).forEach(iso=>{if(iso.startsWith(pre))S.grants[iso].forEach(g=>{const c=CBY[g.card];if(c)got.push(c)})});
 let rare=null;for(const r of ['supreme','legend','rare','common']){const f=got.find(c=>c.r===r);if(f){rare=f;break}}
 const bi=wd.indexOf(Math.max(...wd));return {days,full,tot,done,cards:got.length,rare,best:WD[bi],bestN:wd[bi],pct:tot?Math.round(done/tot*100):0}}
async function openRecap(){try{await API.ensureMonth(TODAY.y,TODAY.m)}catch(e){}const r=recap();
 $('#pgRecap').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgRecap" aria-label="Quay lại">${ic('left')}</button><h1>Tổng kết tháng</h1></div>
 <div class="pbody"><div class="rcp"><div class="rcg"></div><small>THÁNG ${TODAY.m+1} / ${TODAY.y} · ĐẾN ${TODAY.d}/${TODAY.m+1}</small><h2>Bạn làm được<br><em>${r.done}</em> việc</h2><div class="rcpct"><i style="width:${r.pct}%"></i></div><p>${r.pct}% việc đã lên lịch trong tháng được hoàn thành</p>
  <div class="rcs"><div><b>${r.full}</b><small>Ngày xong 100%</small></div><div><b>${S.streak}</b><small>Chuỗi hiện tại</small></div><div><b>${r.cards}</b><small>Thẻ nhận được</small></div></div>
  ${r.rare?`<div class="rcr"><div class="rcc">${cardHTML(r.rare,{w:r.rare.land?132:86,thumb:1})}</div><div><small>Thẻ hiếm nhất tháng này</small><b>${esc(r.rare.name)}</b><span style="color:${RCOL[r.rare.r]}">${NAME[r.rare.r]}</span></div></div>`:''}
  <div class="rcb">${ic('flame')}<span>${r.done?`Ngày bạn làm nhiều nhất: <b>${r.best}</b> (${r.bestN} việc)`:'Hoàn thành vài việc để có thống kê nhé'}</span></div><div class="rcw">${ic('cake')}<span>Colentis · @${esc(ME.un)}</span></div></div>
  <div style="padding:0 14px"><button class="big" data-x="rcshot">${ic('download')} Lưu ảnh tổng kết</button><button class="big alt" data-x="rcshare">${ic('share')} Chia sẻ</button><div class="sub" style="text-align:center;margin-top:8px">Ảnh chỉ có số liệu của bạn, không chứa ảnh thẻ riêng tư của ai khác.</div></div></div>`;openPage('pgRecap')}
function recapCanvas(){const r=recap(),cv=document.createElement('canvas');cv.width=1080;cv.height=1350;const x=cv.getContext('2d');
 const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#2b2575');g.addColorStop(.6,'#5a39d6');g.addColorStop(1,'#ff5db6');x.fillStyle=g;x.fillRect(0,0,1080,1350);
 x.fillStyle='rgba(255,255,255,.1)';x.beginPath();x.arc(940,180,260,0,7);x.fill();x.beginPath();x.arc(120,1200,300,0,7);x.fill();
 const F='"Be Vietnam Pro",system-ui,sans-serif';x.fillStyle='#fff';x.textBaseline='alphabetic';
 x.font=`800 34px ${F}`;x.globalAlpha=.8;x.fillText(`THÁNG ${TODAY.m+1} / ${TODAY.y} · ĐẾN ${TODAY.d}/${TODAY.m+1}`,90,150);x.globalAlpha=1;
 x.font=`900 84px ${F}`;x.fillText('Bạn làm được',90,290);x.font=`900 190px ${F}`;x.fillStyle='#FFE45E';x.fillText(String(r.done),90,470);const nw=x.measureText(String(r.done)).width;x.fillStyle='#fff';x.font=`900 84px ${F}`;x.fillText('việc',90+nw+24,470);
 x.fillStyle='rgba(255,255,255,.25)';x.beginPath();x.roundRect(90,540,900,26,13);x.fill();x.fillStyle='#FFE45E';x.beginPath();x.roundRect(90,540,Math.max(26,900*r.pct/100),26,13);x.fill();
 x.fillStyle='#fff';x.font=`700 36px ${F}`;x.fillText(r.pct+'% việc đã lên lịch được hoàn thành',90,630);
 [[r.full,'Ngày xong 100%'],[S.streak,'Chuỗi hiện tại'],[r.cards,'Thẻ nhận được']].forEach((s,i)=>{const px=90+i*306;x.fillStyle='rgba(255,255,255,.16)';x.beginPath();x.roundRect(px,710,288,210,32);x.fill();x.fillStyle='#fff';x.font=`900 90px ${F}`;x.fillText(String(s[0]),px+30,820);x.font=`700 28px ${F}`;x.globalAlpha=.85;x.fillText(s[1],px+30,880);x.globalAlpha=1});
 x.font=`700 38px ${F}`;if(r.done)x.fillText('Ngày bạn làm nhiều nhất: '+r.best+' ('+r.bestN+' việc)',90,1030);
 if(r.rare){x.font=`700 34px ${F}`;x.globalAlpha=.85;x.fillText('Thẻ hiếm nhất tháng này',90,1110);x.globalAlpha=1;x.font=`900 46px ${F}`;x.fillText(r.rare.name+' · '+NAME[r.rare.r],90,1170)}
 x.font=`800 34px ${F}`;x.globalAlpha=.8;x.fillText('Colentis · @'+ME.un,90,1280);x.globalAlpha=1;return cv}
/* ===== lưu ảnh thẻ ===== */
function shotSheet(cv,fname,title){let url='';try{url=cv.toDataURL('image/png')}catch(e){url=''}
 SHOT={url,fname};openSheet(`<h2>${title}</h2><div class="sub">${url?'Ảnh đã sẵn sàng. Bấm Tải ảnh, hoặc giữ ngón tay trên ảnh để lưu.':'Chưa xuất được ảnh trên trình duyệt này.'}</div>${url?`<img class="shot" src="${url}" alt="">`:`<div class="empty" style="padding:24px 10px"><div class="ei">${ic('image')}</div>Không xuất được ảnh ở chế độ này.</div>`}
 ${url?`<a class="big" href="${url}" download="${fname}">${ic('download')} Tải ảnh</a>`:''}<button class="big alt" data-x="shshare">${ic('share')} Chia sẻ</button><button class="big gh" data-x="cfno">Đóng</button>`)}
let SHOT={};
function shotShare(){if(!SHOT.url){toast('Chưa có ảnh để chia sẻ');return}
 fetch(SHOT.url).then(r=>r.blob()).then(b=>{const f=new File([b],SHOT.fname,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))return navigator.share({files:[f],title:'Colentis'});throw 0}).catch(()=>toast('Thiết bị chưa hỗ trợ chia sẻ trực tiếp, hãy bấm Tải ảnh'))}
function cardShot(cid){const c=CBY[cid];if(!c)return;const col=c.r==='event'?'#FFB02E':RCOL[c.r];const im=new Image();
 im.onload=()=>{const W=900,H=1240,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d'),F='"Be Vietnam Pro",system-ui,sans-serif';
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#14103f');g.addColorStop(1,'#2b2575');x.fillStyle=g;x.fillRect(0,0,W,H);
  const px=60,py=60,pw=780,ph=1000;x.shadowColor=col;x.shadowBlur=60;x.fillStyle=col;x.beginPath();x.roundRect(px-8,py-8,pw+16,ph+16,40);x.fill();x.shadowBlur=0;
  x.save();x.beginPath();x.roundRect(px,py,pw,ph,32);x.clip();const sc=Math.max(pw/im.naturalWidth,ph/im.naturalHeight)*(c.z||1),dw=im.naturalWidth*sc,dh=im.naturalHeight*sc,pp=(c.pos||'50% 50%').split(' ').map(v=>parseFloat(v)/100);
  x.drawImage(im,px-(dw-pw)*pp[0],py-(dh-ph)*pp[1],dw,dh);x.restore();
  x.fillStyle=col;x.font=`900 30px ${F}`;x.fillText((c.r==='event'?'SỰ KIỆN '+c.tier:TAG[c.r]),60,1118);x.fillStyle='#fff';x.font=`900 50px ${F}`;x.fillText(c.name,60,1180);
  x.font=`700 26px ${F}`;x.globalAlpha=.7;x.textAlign='right';x.fillText('Colentis · @'+ME.un,W-60,1180);x.textAlign='left';x.globalAlpha=1;shotSheet(cv,'colentis-'+c.id+'.png','Ảnh thẻ của bạn')};
 im.onerror=()=>shotSheet(document.createElement('canvas'),'x.png','Ảnh thẻ của bạn');im.src=API.imgNow('cards',c.path)}
/* ===== thẻ yêu thích ===== */
function favHTML(){return `<div style="text-align:left;margin-top:16px;display:flex;justify-content:space-between;align-items:baseline"><h2 style="font-size:16px">Thẻ yêu thích</h2><span class="sub">Bạn bè thấy 3 thẻ này</span></div><div class="favs">${[0,1,2].map(i=>{const c=CBY[S.favs[i]];return c&&S.own[c.id]?`<button class="fav" data-x="fav" data-i="${i}">${cardHTML(c,{w:'100%',thumb:1})}</button>`:`<button class="fav emp" data-x="fav" data-i="${i}">${ic('plus')}<small>Chọn thẻ</small></button>`}).join('')}</div>`}
function favPick(i){const ord=['supreme','legend','rare','common','event'];const own=Object.keys(S.own).map(id=>CBY[id]).filter(Boolean).sort((a,b)=>ord.indexOf(a.r)-ord.indexOf(b.r));
 openSheet(`<h2>Chọn thẻ yêu thích</h2><div class="sub">Ô ${i+1}/3. Bạn bè thấy được 3 thẻ này trên hồ sơ của bạn, kể cả khi album để riêng tư.</div><div class="fgrid">${own.map(c=>`<button class="fpk ${S.favs.includes(c.id)?'on':''}" data-x="favset" data-i="${i}" data-cid="${c.id}">${cardHTML(c,{w:'100%',thumb:1})}${S.favs.includes(c.id)?'<span class="fck">'+ic('check')+'</span>':''}</button>`).join('')}</div>${S.favs[i]?`<button class="big gh" data-x="favrm" data-i="${i}">Gỡ thẻ khỏi ô này</button>`:''}<button class="big gh" data-x="cfno">Đóng</button>`)}
function friendFavs(ids){const l=(ids||[]).map(i=>CBY[i]).filter(Boolean);if(!l.length)return '';return `<div class="ffav"><small>Thẻ yêu thích</small><div class="favs">${l.map(c=>`<span class="fav">${cardHTML(c,{w:'100%',thumb:1})}</span>`).join('')}</div></div>`}
async function saveFavs(list){try{await API.setFavs(list.filter(Boolean));await API.reload();closeSheet();renderPro()}catch(e){apiFail(e)}}
/* ===== cổ vũ bạn bè ===== */
const CHEERS=[['Cố lên!','flame'],['Sắp xong rồi!','star'],['Cùng làm nào!','spark']];
const cheerKey=id=>'cheer:'+TODAY.iso+':'+id;
function cheerRow(g){const os=g.others.filter(o=>!o.ok);if(!os.length)return '';
 return `<div class="cheer"><small>Bạn bè chưa xong việc, cổ vũ họ nhé</small><div>${os.map(o=>{const sent=lsGet(cheerKey(o.id),false);return `<button class="chip ${sent?'':'on'}" data-x="cheer" data-id="${o.id}" ${sent?'disabled':''}>${ic('heart')} ${sent?'Đã cổ vũ '+esc(o.m.name):'Cổ vũ '+esc(o.m.name)}</button>`}).join('')}</div></div>`}
function cheerSheet(id){const m=MEMBERS[id];if(!m)return;openSheet(`<h2>Cổ vũ ${esc(m.name)}</h2><div class="sub">Mỗi người nhận 1 lời cổ vũ mỗi ngày từ bạn. ${esc(m.name)} sẽ thấy trong Thông báo.</div><button class="menu" data-x="cheerok" data-id="${id}"><span class="l">${ic('flame')}<span>Cố lên!</span></span>${ic('send')}</button><button class="big gh" data-x="cfno">Để sau</button>`)}
/* ===== mốc streak ===== */
const MILES=[3,7,14,30,60,100,365];
function showMile(n){const t=TMAP['streak-'+n];sfx('legend');vib([40,40,40,40,120]);const o=$('#mile');
 o.innerHTML=`<div class="mlbg"></div><div class="mlc"><div class="mlf">${ic('flame')}<i></i><i></i><i></i></div><small>CHUỖI LIÊN TIẾP</small><h2><b id="mln">0</b> ngày</h2><p>${n>=100?'Một trăm ngày không bỏ cuộc. Quá đỉnh!':n>=30?'Cả tháng liền! Bạn đang tạo thói quen thật sự.':n>=7?'Một tuần liền! Giữ nhịp này nhé.':'Ngọn lửa đầu tiên đã cháy.'}</p>
 ${t?`<div class="mlt"><small>Danh hiệu ${S.unlocked.has('streak-'+n)?'đã mở':'mới'}</small>${titleFrame('streak-'+n,null,58)}</div>`:''}
 <button class="big" data-x="mlx">Tiếp tục</button>${t?`<button class="big gh" data-x="mlt" data-n="${n}">Xem danh hiệu</button>`:''}</div><div class="confetti" id="mlcf"></div>`;o.classList.add('on');
 const cf=$('#mlcf');cf.innerHTML=Array.from({length:46},()=>`<i style="left:${R(0,100)}%;background:${pickOne(CONF)};--d:${R(2.4,4.4).toFixed(2)}s;--l:${R(0,2.2).toFixed(2)}s;transform:rotate(${R(0,360)}deg)"></i>`).join('');
 let v=0;const tm=setInterval(()=>{v=Math.min(n,v+Math.max(1,Math.ceil(n/28)));const e=$('#mln');if(!e){clearInterval(tm);return}e.textContent=v;if(v>=n)clearInterval(tm)},40)}
function mileCheck(){const n=S.streak,k='mile:'+ME.uid,seen=lsGet(k,{});if(MILES.includes(n)&&!seen[n]){seen[n]=1;lsSet(k,seen);setTimeout(()=>showMile(n),500)}}
/* ===== hướng dẫn 3 trang ===== */
const TOUR=[
 {ic:'check',ic2:'gift',tone:'#FF2E88',t:'Tick xong, nhận thẻ',p:['Hoàn thành 100% việc của bạn trong ngày để nhận 1 ảnh cá nhân.','Khi cả nhóm cùng xong, bạn nhận thêm 1 ảnh nhóm.','Mỗi ngày tối đa 2 ảnh.']},
 {ic:'lock',ic2:'cal',tone:'#7B61FF',t:'Nhận ảnh thì ngày được khóa',p:['Trước khi nhận, Colentis luôn hỏi xác nhận để bạn không bị khóa bất ngờ.','Sau khi nhận, việc trong ngày chỉ để xem lại.','Ảnh bạn nhận hiện ngay trên ô ngày của lịch.']},
 {ic:'flame',ic2:'shield',tone:'#FFB02E',t:'Giữ chuỗi bằng tick bù và thẻ cứu',p:['Mỗi ngày làm ít nhất 1 việc thì chuỗi tăng thêm 1.','Lỡ một ngày: tick bù trong 48 giờ hoặc dùng thẻ cứu.','Thẻ cứu có tối đa 5 lần mỗi tháng. Thẻ cứu còn lại hiện trên Hôm nay.']}];
function openTour(){lsSet('tour',true);TOURI=0;const o=$('#tour');o.classList.add('on');renderTour()}
let TOURI=0;
function renderTour(){const t=TOUR[TOURI],last=TOURI===TOUR.length-1,o=$('#tour');
 o.innerHTML=`<div class="tc" style="--c:${t.tone}"><button class="tskip" data-x="tskip">${last?'':'Bỏ qua'}</button><div class="tart"><i></i><span class="a1">${ic(t.ic)}</span><span class="a2">${ic(t.ic2)}</span></div><h2>${t.t}</h2><ul>${t.p.map(x=>`<li>${x}</li>`).join('')}</ul><div class="tdots">${TOUR.map((_,i)=>`<i class="${i===TOURI?'on':''}"></i>`).join('')}</div><div class="tbtns">${TOURI?`<button class="big gh" data-x="tprev">Trước</button>`:''}<button class="big" data-x="tnext">${last?'Bắt đầu thôi':'Tiếp'}</button></div></div>`}
/* ===== ngày sinh người dùng: kiểm tra ===== */
function bdCheck(v){if(!v)return {ok:true,msg:''};const d=new Date(v+'T00:00:00');if(isNaN(d))return {ok:false,msg:'Ngày sinh chưa đúng'};
 if(d>new Date(TODAY.y,TODAY.m,TODAY.d))return {ok:false,msg:'Ngày sinh không thể ở tương lai'};if(d<new Date(1940,0,1))return {ok:false,msg:'Hãy nhập năm sinh từ 1940'};return {ok:true,msg:''}}
/* ===== điều khiển ===== */
document.addEventListener('click',e=>{const t=e.target.closest('[data-x]');if(!t)return;const a=t.dataset.x,d=t.dataset;
 switch(a){
 case 'notif':openNotif();break;
 case 'nopen':{const n=NOTIFS.find(x=>x.id===d.id);if(!n)break;if(n.kind==='req'||n.kind==='inv')break;if(!n.read){n.read=true;API.markNotifRead(n.ref)}if(n.go){closePage('pgNotif');renderAll();if(n.go==='mail')openMail();else go(n.go)}else{renderNotif();renderAll()}break}
 case 'nall':NOTIFS.forEach(n=>n.read=true);API.markNotifRead(null);renderNotif();renderAll();break;
 case 'non':API.updateProfile({notif_enabled:true}).then(()=>API.reload()).then(()=>{renderNotif();renderAll()}).catch(apiFail);break;
 case 'nacc':respondNotif(d.id,true);break;
 case 'ndec':respondNotif(d.id,false);break;
 case 'cals':calsSheet();break;
 case 'mcal':manageCal(+d.i);break;
 case 'ncal':newCalSheet();break;
 case 'ncok':{const v=$('#ncn').value.trim();if(v.length<2){$('#ncerr').textContent='Tên lịch cần ít nhất 2 ký tự';break}if(CALS.length>=S.limits.calendars){toast('Bạn đã đủ '+S.limits.calendars+' lịch');break}
  t.disabled=true;API.createCalendar(v).then(async id=>{await API.reload();S.calIdx=Math.max(0,CALS.findIndex(c=>c.id===id));lsSet('cal',curCal().id);closeSheet();renderAll();toast('Đã tạo lịch “'+v+'”')}).catch(er=>{t.disabled=false;apiFail(er)});break}
 case 'cown':transferCal(+d.i,d.m);break;
 case 'crem':removeMember(+d.i,d.m);break;
 case 'cleave':leaveCal(+d.i);break;
 case 'cdel':delCal(+d.i);break;
 case 'cinv':inviteSheet(+d.i);break;
 case 'cinv1':{const f=S.friends.find(x=>x.id===d.id),c=CALS[+d.i];if(!f||!c)break;API.inviteToCalendar(c.id,f.uid).then(()=>{f._inv=f._inv||{};f._inv[c.id]=1;if($('#sheet h2')&&/Mời vào/.test($('#sheet h2').textContent))inviteSheet(+d.i);else renderFr();toast('Đã gửi lời mời cho '+f.name)}).catch(apiFail);break}
 case 'cren':renameSheet(+d.i);break;
 case 'rnok':{const v=$('#rnn').value.trim();if(v.length<2){$('#rnerr').textContent='Tên lịch cần ít nhất 2 ký tự';break}API.renameCalendar(CALS[+d.i].id,v).then(async()=>{await API.reload();manageCal(+d.i);renderAll();toast('Đã đổi tên lịch')}).catch(apiFail);break}
 case 'cfok':if(CFN)CFN();break;
 case 'cfno':closeSheet();break;
 case 'dup':openDup();break;
 case 'admin':openAdmin();break;
 case 'ato':ADM.to=d.v;renderAdmin();break;
 case 'aua':{const i=$('#aun'),v=i.value.trim().toLowerCase().replace(/^@/,'');if(!/^[a-z0-9_]{4,19}$/.test(v)){toast('Username 4 đến 19 ký tự: chữ thường, số, gạch dưới');break}if(!ADM.users.includes(v))ADM.users.push(v);renderAdmin();break}
 case 'aur':ADM.users.splice(+d.i,1);renderAdmin();break;
 case 'agk':admKeep(()=>{ADM.kind=d.v});break;
 case 'agr':admKeep(()=>{ADM.rar=d.v});break;
 case 'ags':admKeep(()=>{ADM.saver=Math.max(1,Math.min(5,ADM.saver+(+d.v)))});break;
 case 'agf':admKeep(()=>{ADM.cf=d.v});break;
 case 'agc':admKeep(()=>{ADM.cid=d.v});break;
 case 'agp':admKeep(()=>{ADM.title=d.v});break;
 case 'aga':{const k=ADM.kind;const sel=$('#agt');if(sel)ADM.title=sel.value;
  if(k==='cardid'&&!ADM.cid){toast('Chọn một thẻ trước');break}
  const g=k==='card'?{type:'card',rarity:ADM.rar}:k==='cardid'?{type:'card_id',id:ADM.cid}:k==='rescue'?{type:'rescue',qty:ADM.saver}:{type:'title',id:ADM.title};
  if(ADM.gifts.length>=4){toast('Mỗi thư đính kèm tối đa 4 quà');break}const keep={t:($('#att')||{}).value,b:($('#atb')||{}).value};ADM.gifts.push(g);renderAdmin();$('#att').value=keep.t||'';$('#atb').value=keep.b||'';$('#atc').textContent=($('#atb').value.length)+'/600';break}
 case 'agd':{const keep={t:$('#att').value,b:$('#atb').value};ADM.gifts.splice(+d.i,1);renderAdmin();$('#att').value=keep.t;$('#atb').value=keep.b;$('#atc').textContent=keep.b.length+'/600';break}
 case 'asc':{const keep={t:$('#att').value,b:$('#atb').value};ADM.sched=d.v;renderAdmin();$('#att').value=keep.t;$('#atb').value=keep.b;$('#atc').textContent=keep.b.length+'/600';break}
 case 'aprev':adminPreview();break;
 case 'asend':adminSend();break;
 case 'err':errAct(d.v,t);break;
 case 'events':eventsSheet();break;
 case 'setbd':editProfile();break;
 case 'recap':openRecap();break;
 case 'rcshot':shotSheet(recapCanvas(),`colentis-thang-${TODAY.m+1}.png`,`Ảnh tổng kết tháng ${TODAY.m+1}`);break;
 case 'rcshare':{SHOT={};try{const cv=recapCanvas();SHOT={url:cv.toDataURL('image/png'),fname:`colentis-thang-${TODAY.m+1}.png`}}catch(er){}shotShare();break}
 case 'dlcard':cardShot(d.cid);break;
 case 'shshare':shotShare();break;
 case 'fav':favPick(+d.i);break;
 case 'favset':{const i=+d.i,cid=d.cid;const list=[0,1,2].map(j=>S.favs[j]||null).map((x,j)=>j!==i&&x===cid?null:x);list[i]=cid;saveFavs(list);toast('Đã chọn thẻ yêu thích');break}
 case 'favrm':{const list=[0,1,2].map(j=>S.favs[j]||null);list[+d.i]=null;saveFavs(list);toast('Đã gỡ thẻ');break}
 case 'cheer':cheerSheet(d.id);break;
 case 'cheerok':{const m=MEMBERS[d.id];API.sendCheer(m.uid).then(()=>{lsSet(cheerKey(d.id),true);closeSheet();renderToday();toast('Đã gửi lời cổ vũ cho '+m.name);vib(20);sfx('ok')}).catch(er=>{closeSheet();const c=er&&er.app&&er.app.code;if(c==='CHEER_LIMIT'){lsSet(cheerKey(d.id),true);renderToday()}apiFail(er)});break}
 case 'mlx':$('#mile').classList.remove('on');break;
 case 'mlt':$('#mile').classList.remove('on');go('pro');setTimeout(()=>achSheet('streak-'+d.n),350);break;
 case 'tskip':case 'tfinish':$('#tour').classList.remove('on');break;
 case 'tprev':TOURI=Math.max(0,TOURI-1);renderTour();break;
 case 'tnext':if(TOURI>=TOUR.length-1){$('#tour').classList.remove('on');toast('Chúc bạn một ngày nhiều tick!')}else{TOURI++;renderTour()}break;
 case 'tour':openTour();break;
 case 'unfriend':{const f=S.friends.find(x=>x.id===d.id);if(!f)break;confirmSheet({icon:'x',title:`Hủy kết bạn với ${esc(f.name)}?`,body:'Hai bạn sẽ không còn xem được album riêng tư của nhau. Vẫn có thể kết bạn lại sau.',okText:'Hủy kết bạn',danger:1,ok:async()=>{try{await API.removeFriend(f.uid);await API.reload();closeSheet();renderAll();toast('Đã hủy kết bạn')}catch(e){apiFail(e)}}});break}
 case 'signout':confirmSheet({icon:'x',title:'Đăng xuất?',body:'Việc và thẻ của bạn vẫn được lưu trên tài khoản. Đăng nhập lại để dùng tiếp.',okText:'Đăng xuất',danger:1,ok:async()=>{closeSheet();await API.signOut();INTRO.mode='login';runIntro('auth')}});break;
 }});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const t=$('#tour'),m=$('#mile'),er=$('#errv');if(t&&t.classList.contains('on'))t.classList.remove('on');else if(m&&m.classList.contains('on'))m.classList.remove('on')}});
/* ===== mặt sau thẻ theo độ hiếm ===== */
function backHTML(c,o){const w=o.w;let cls;
 if(c.r==='event')cls='pb-e pbe-'+c.tier;else if(c.r==='supreme')cls='pb-s pbs'+(String(c.fx).replace('s','')||1);else cls='pb-'+({legend:'l',rare:'r'}[c.r]||'c');
 const st=o.fill?`width:100%;height:100%;aspect-ratio:auto;--w:${w}px`:`--w:${w}px;--ar:${o.ar};width:${w}px;aspect-ratio:${o.ar}`;
 const inner=c.r==='event'?`<svg class="pbk" viewBox="0 0 96 108"><use href="#cake"/></svg><b class="pbt">${c.tier}</b>`:'';
 const sp=c.r==='common'||c.r==='rare'?'':'<u></u><u></u><u></u><u></u><u></u><u></u>';
 return `<div class="pb ${cls}" style="${st}"><span class="pbx"></span><span class="pby"></span>${sp}${inner}<i></i></div>`}
