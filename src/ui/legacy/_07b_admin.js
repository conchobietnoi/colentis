/* ===== Trang admin v2: Tổng quan · Gửi thư · Thành viên · Lịch sử (theo mockup admin đã duyệt) ===== */
const ADM={tab:'ov',ov:null,mem:[],hist:[],hseg:'sch',mf:'all',mq:'',sq:'',to:'all',users:[],gifts:[],kind:'card',rar:'any',saver:1,cf:'event',cid:'',title:'',con:1,pq:1,
 tpl:'welcome',t:'',b:'',sched:false,at:'',editId:null,loading:false,draft:false};
const ADCOL=['#FF2E88','#7B61FF','#35D0A5','#FFB02E','#4CC9FF'],ADDK=['#fff','#fff','#1E1B5E','#1E1B5E','#1E1B5E'];
const ADTPL=[['welcome','Chào mừng','Chào mừng Mùa Concept','Mùa Concept bắt đầu rồi! Mở thẻ ID của bạn và nhận quà khởi đầu nhé. Chúc cả nhà thật vui.'],
 ['remind','Nhắc điểm danh','Nhắc điểm danh','Hôm nay bạn chưa điểm danh, vào lấy thẻ trước nửa đêm nhé.'],
 ['cheer','Chúc mừng','Chúc mừng bạn!','Cảm ơn bạn đã luôn đồng hành cùng Colentis. Một chút quà nhỏ dành cho bạn nhé.'],
 ['blank','Trống','','']];
const CFLT=[['event','Sự kiện'],['supreme','Bá khí'],['legend','Huyền Thoại'],['rare','Hiếm'],['common','Thường']];
const GRAR={any:'Ngẫu nhiên',common:'Thường',rare:'Hiếm',legendary:'Huyền Thoại',supreme:'Bá khí'};
const GIFTLBL=g=>g.type==='card'?`1 thẻ ${GRAR[g.rarity]||'ngẫu nhiên'}`:g.type==='rescue'?`${g.qty} thẻ cứu`:g.type==='card_id'?`Thẻ: ${(CBY[g.id]||{name:g.id}).name}`:g.type==='concept_pack'?`${g.qty||1} gói Concept ${g.con}`:`Khung/danh hiệu: ${(TMAP[g.id]||{name:g.id}).name}`;
const fmtDT=iso=>{const d=new Date(iso);return `${pad(d.getDate())}/${pad(d.getMonth()+1)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`};
function admAgo(iso){if(!iso)return 'chưa vào';const s=Math.max(0,(Date.now()-new Date(iso).getTime())/1000);
 if(s<90)return 'vừa xong';if(s<3600)return Math.round(s/60)+' phút trước';if(s<86400)return Math.round(s/3600)+' giờ trước';const d=Math.round(s/86400);return d===1?'hôm qua':d+' ngày trước'}
const admAv=(name,i)=>`<span class="adav" style="background:${ADCOL[i%5]};color:${ADDK[i%5]}">${esc((name||'?').trim().charAt(0).toUpperCase())}</span>`;
const admDraftKey='colentis_adm_draft';
function admSave(){try{localStorage.setItem(admDraftKey,JSON.stringify({t:ADM.t,b:ADM.b,to:ADM.to,users:ADM.users,gifts:ADM.gifts,sched:ADM.sched,at:ADM.at,tpl:ADM.tpl}));ADM.draft=!!(ADM.t||ADM.b||ADM.gifts.length)}catch(e){}}
function admLoadDraft(){try{const d=JSON.parse(localStorage.getItem(admDraftKey)||'null');if(d){Object.assign(ADM,{t:d.t||'',b:d.b||'',to:d.to||'all',users:d.users||[],gifts:d.gifts||[],sched:!!d.sched,at:d.at||'',tpl:d.tpl||'blank'});ADM.draft=!!(ADM.t||ADM.b||ADM.gifts.length)}}catch(e){}}
function admClearDraft(){try{localStorage.removeItem(admDraftKey)}catch(e){}Object.assign(ADM,{t:'',b:'',to:'all',users:[],gifts:[],sched:false,at:'',tpl:'blank',editId:null,draft:false})}
function admLate(){return ADM.mem.filter(m=>!m.done_today)}
function admRecipients(){if(ADM.to==='all')return ADM.mem.map(m=>m.username);if(ADM.to==='late')return admLate().map(m=>m.username);return ADM.users}
async function admLoad(){ADM.loading=true;renderAdmin();
 const [ov,mem,hist]=await Promise.allSettled([API.adminOverview(),API.adminMembers(),API.adminSent()]);
 if(ov.status==='fulfilled')ADM.ov=ov.value;if(mem.status==='fulfilled')ADM.mem=mem.value;if(hist.status==='fulfilled')ADM.hist=hist.value;
 ADM.loading=false;renderAdmin()}
async function openAdmin(){if(!ADM.title&&TITLES[0])ADM.title=TITLES[0].id;admLoadDraft();ADM.tab='ov';renderAdmin();openPage('pgAdmin');await admLoad()}
const ADTABS=[['ov','Tổng quan','home'],['send','Gửi thư','mail'],['mem','Thành viên','users'],['hist','Lịch sử','clock']];
function renderAdmin(){const A=ADM,cur=ADTABS.find(t=>t[0]===A.tab);
 const body=A.tab==='ov'?admOv():A.tab==='send'?admSendTab():A.tab==='mem'?admMemTab():admHist();
 $('#pgAdmin').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgAdmin" aria-label="Quay lại">${ic('left')}</button><div style="flex:1;min-width:0"><small class="adk">Quản trị</small><h1 style="display:block">${cur[1]}</h1></div><span class="adbdg">ADMIN</span></div>
 <div class="pbody" id="admBody">${A.loading&&!A.ov?'<div class="empty">Đang tải…</div>':body}</div>
 <nav class="adtabs" aria-label="Điều hướng admin">${ADTABS.map(t=>`<button class="${A.tab===t[0]?'on':''}" data-x="adt" data-v="${t[0]}">${ic(t[2]==='home'?'cal':t[2])}${t[1]}${t[0]==='hist'&&A.hist.filter(h=>h.scheduled).length?`<i class="adn">${A.hist.filter(h=>h.scheduled).length}</i>`:''}</button>`).join('')}</nav>`;
 admBind()}
function admBind(){const t=$('#att'),b=$('#atb'),q=$('#asq'),m=$('#amq'),d=$('#adt');
 if(t)t.oninput=()=>{ADM.t=t.value;admSave()};
 if(b)b.oninput=()=>{ADM.b=b.value;$('#atc').textContent=b.value.length+'/600';admSave()};
 if(d)d.onchange=()=>{ADM.at=d.value;admSave()};
 if(q)q.oninput=()=>{ADM.sq=q.value;$('#admWho').innerHTML=admWho()};
 if(m)m.oninput=()=>{ADM.mq=m.value;$('#admMl').innerHTML=admMemList()}}
/* --- Tổng quan --- */
function admOv(){const o=ADM.ov;if(!o)return '<div class="empty">Chưa tải được dữ liệu. Kéo xuống để thử lại.</div>';
 const day=o.concept_day,act=o.activity||[];
 const st=(bg,l,n,s)=>`<div class="adst" style="background:${bg}"><span>${l}</span><b>${n}</b><i>${s}</i></div>`;
 return `<div class="adstats">${st('#FFE45E','Thành viên',o.members,`${o.active_today} đang hoạt động hôm nay`)}${st('#C9F3E6','Thư đã gửi',o.mails_sent,`${o.claim_pct}% đã nhận quà`)}${st('#FFD1EA','Thẻ đã mở',o.cards_total,`+${o.cards_today} hôm nay`)}${st('#D6E8FF','Hẹn giờ',o.scheduled,o.next_at?'gần nhất: '+fmtDT(o.next_at):'chưa có')}</div>
 <div class="adq">${[['send','mail','#FF2E88','Gửi thư'],['gift','gift','#7B61FF','Tặng quà'],['mem','users','#35D0A5','Thành viên'],['sch','clock','#4CC9FF','Hẹn giờ']].map(q=>`<button data-x="adq" data-v="${q[0]}"><span style="background:${q[2]}">${ic(q[1])}</span>${q[3]}</button>`).join('')}</div>
 <div class="adev"><h2><span>Mùa Concept</span><span>${day?`Ngày ${day}/9`:'Ngoài sự kiện'}</span></h2><p>18 – 26/10/2026</p><div class="adbar"><i style="width:${day?Math.round(day/9*100):0}%"></i></div></div>
 <div class="card-b"><h2>Hoạt động gần đây</h2>${act.length?act.map((a,i)=>`<div class="adar">${admAv(a.name,i)}<div><b>${esc(a.name)}</b> ${a.kind==='claim'?`nhận quà thư “${esc(a.text)}”`:a.kind==='tick'?`xong nhiệm vụ Mùa Concept (${esc(a.text)})`:'nhận thẻ mới'}</div><time>${admAgo(a.at)}</time></div>`).join(''):'<div class="sub">Chưa có hoạt động nào.</div>'}</div>`}
/* --- Gửi thư --- */
function admWho(){const q=ADM.sq.trim().toLowerCase(),list=ADM.mem.filter(m=>!q||m.name.toLowerCase().includes(q)||m.username.includes(q));
 return list.map(m=>{const i=ADM.mem.indexOf(m),sel=ADM.users.includes(m.username);return `<button class="adpp ${sel?'sel':''}" data-x="adu" data-v="${esc(m.username)}">${admAv(m.name,i)}<span>${esc(m.name)}</span></button>`}).join('')||'<div class="sub">Không có ai khớp.</div>'}
function admSendTab(){const A=ADM,n=admRecipients().length,tpl=ADTPL,preview=A.t||A.b?`<div class="lb2">Xem trước thư</div><div class="adpv"><div class="tt">${esc(A.t||'(chưa có tiêu đề)')}</div><p>${esc(A.b||'(chưa có nội dung)')}</p>${A.gifts.length?`<div class="gf">Quà: ${A.gifts.map(GIFTLBL).map(esc).join(', ')}</div>`:''}</div>`:'';
 const tl=[...EVT,...WELCOME,...TITLES];
 return `${A.editId?'<div class="card-b adedit">Đang sửa thư hẹn giờ. Bấm gửi để thay thư cũ bằng thư này.</div>':''}
 <div class="card-b"><h2>1 · Người nhận <em>${n} người</em></h2>
  <div class="gsel"><button class="chip ${A.to==='all'?'on':''}" data-x="ato" data-v="all">Tất cả</button><button class="chip ${A.to==='some'?'on':''}" data-x="ato" data-v="some">Chọn người</button><button class="chip ${A.to==='late'?'on':''}" data-x="ato" data-v="late">Chưa điểm danh</button></div>
  ${A.to==='some'?`<div class="adwho" id="admWho">${admWho()}</div><input class="in" id="asq" placeholder="Tìm theo tên hoặc tên đăng nhập…" autocomplete="off" value="${esc(A.sq)}">`:A.to==='late'?`<div class="sub" style="margin-top:8px">${n?admLate().map(m=>esc(m.name)).join(', '):'Hôm nay mọi người đều đã điểm danh.'}</div>`:`<div class="sub" style="margin-top:8px">Gửi cho toàn bộ tài khoản.</div>`}</div>
 <div class="card-b"><h2>2 · Nội dung <em>Mẫu</em></h2>
  <div class="gsel">${tpl.map(t=>`<button class="chip ${A.tpl===t[0]?'on':''}" data-x="adp" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>
  <input class="in" id="att" maxlength="60" placeholder="Tiêu đề (tối đa 60 ký tự)" autocomplete="off" value="${esc(A.t)}"><textarea class="in" id="atb" rows="4" maxlength="600" placeholder="Lời nhắn gửi bạn bè...">${esc(A.b)}</textarea><div class="sub" id="atc" style="text-align:right">${A.b.length}/600</div></div>
 <div class="card-b"><h2>3 · Quà đính kèm <em>${A.gifts.length}/4</em></h2><div class="sub">Quà admin là quà bổ sung, không tính vào hạn mức 2 thẻ mỗi ngày và không khóa ngày.</div>
  <div class="gsel"><button class="chip ${A.kind==='card'?'on':''}" data-x="agk" data-v="card">Thẻ ngẫu nhiên</button><button class="chip ${A.kind==='cardid'?'on':''}" data-x="agk" data-v="cardid">Thẻ cụ thể</button><button class="chip ${A.kind==='pack'?'on':''}" data-x="agk" data-v="pack">Gói Concept</button><button class="chip ${A.kind==='rescue'?'on':''}" data-x="agk" data-v="rescue">Thẻ cứu</button><button class="chip ${A.kind==='title'?'on':''}" data-x="agk" data-v="title">Khung và danh hiệu</button></div>
  ${A.kind==='card'?`<div class="gsel">${['any','common','rare','legendary','supreme'].map(r=>`<button class="chip ${A.rar===r?'on':''}" data-x="agr" data-v="${r}">${GRAR[r]}</button>`).join('')}</div>`:''}
  ${A.kind==='rescue'?`<div class="step"><button class="ibtn sm" data-x="ags" data-v="-1">−</button><b>${A.saver}</b><button class="ibtn sm" data-x="ags" data-v="1">+</button><span class="sub">thẻ cứu (tối đa 5)</span></div>`:''}
  ${A.kind==='pack'?`<div class="gsel">${[1,2,3].map(c=>`<button class="chip ${A.con===c?'on':''}" data-x="agv" data-v="${c}">${(typeof CXN!=='undefined'&&CXN[c]&&CXN[c].n)||'Concept '+c}</button>`).join('')}</div><div class="step"><button class="ibtn sm" data-x="agq" data-v="-1">−</button><b>${A.pq}</b><button class="ibtn sm" data-x="agq" data-v="1">+</button><span class="sub">gói (tối đa 5), mỗi gói 5 thẻ</span></div>`:''}
  ${A.kind==='cardid'?`<div class="gsel">${CFLT.map(x=>`<button class="chip ${A.cf===x[0]?'on':''}" data-x="agf" data-v="${x[0]}">${x[1]}</button>`).join('')}</div><div class="agrid">${ALLCARDS.filter(c=>c.r===A.cf).sort((a,b)=>(a.ev<b.ev?-1:a.ev>b.ev?1:0)||a.sort-b.sort).map(c=>`<button class="agc ${A.cid===c.id?'on':''}" data-x="agc" data-v="${c.id}"><span class="agth" style="--ar:${c.ar}">${cardHTML(c,{w:'100%',thumb:1})}</span><small>${esc(c.name)}</small></button>`).join('')||'<div class="sub">Không có thẻ nào.</div>'}</div>`:''}
  ${A.kind==='title'?`<div class="agrid t2">${tl.map(t=>`<button class="agc agt ${A.title===t.id?'on':''}" data-x="agp" data-v="${t.id}"><span class="agav">${avatar(ME,64,t.id)}</span><span class="agtf">${titleFrame(t.id,t.name,30)}</span><small>${esc(t.name)}</small></button>`).join('')}</div>`:''}
  <button class="btn-s pink" data-x="aga" style="margin-top:8px">${ic('plus')} Thêm quà này</button>
  <div class="achips">${A.gifts.map((g,i)=>`<span class="chip on">${esc(GIFTLBL(g))} <b data-x="agd" data-i="${i}" style="cursor:pointer">×</b></span>`).join('')}</div></div>
 <div class="card-b"><h2>4 · Thời gian gửi</h2><div class="adrow"><span>Hẹn giờ gửi</span><button class="adsw ${A.sched?'on':''}" data-x="asc" role="switch" aria-checked="${A.sched}" aria-label="Hẹn giờ gửi"><i></i></button></div>${A.sched?`<input class="in" id="adt" type="datetime-local" value="${esc(A.at)}">`:`<div class="sub">Thư gửi ngay khi bạn xác nhận.</div>`}</div>
 ${preview}
 <div class="adsend"><button class="big alt" data-x="adtest">Gửi thử cho mình</button><button class="big" data-x="asend">${A.sched?'Hẹn gửi':'Gửi'} cho ${n} người</button></div>
 <div class="sub" style="text-align:center;padding:6px 14px 0">${A.draft?'Đã lưu nháp trên máy này · <b data-x="adclr" style="cursor:pointer;color:var(--pink)">Xoá nháp</b><br>':''}Mỗi thư chỉ gửi một lần. Quà đã gửi không thu hồi được.</div>`}
function admCheck(){const e=!ADM.t.trim()?'Nhập tiêu đề thư':!ADM.b.trim()?'Nhập nội dung thư':!admRecipients().length?(ADM.to==='late'?'Hôm nay mọi người đều đã điểm danh':'Chọn ít nhất 1 người nhận'):ADM.sched&&!ADM.at?'Chọn thời gian hẹn giờ':ADM.sched&&new Date(ADM.at)<=new Date()?'Thời gian hẹn phải ở tương lai':'';return e}
async function admDoSend(usernames,at,msg){
 try{const r=await API.adminSendMail({title:ADM.t.trim(),body:ADM.b.trim(),gifts:ADM.gifts,usernames,at});
  if(ADM.editId){try{await API.adminCancelMail(ADM.editId)}catch(e){toast('Đã gửi thư mới nhưng chưa huỷ được thư cũ')}ADM.editId=null}
  return r}catch(er){const m=String((er&&er.message)||'');if(/UNKNOWN_USERNAMES:(.*)/.test(m))toast('Không có username: '+m.match(/UNKNOWN_USERNAMES:(.*)/)[1]);else apiFail(er);return null}}
function admSend(test){const e=admCheck();if(e){toast(e);return}
 const un=test?[ME.un]:admRecipients(),n=un.length,at=!test&&ADM.sched?new Date(ADM.at).toISOString():null;
 confirmSheet({icon:'send',title:test?'Gửi thử cho riêng bạn?':`${ADM.sched?'Hẹn gửi':'Gửi'} cho ${ADM.to==='all'?'tất cả ('+n+' người)':n+' người'}?`,
  body:`Thư “${esc(ADM.t.trim())}”${ADM.gifts.length?` kèm ${ADM.gifts.map(GIFTLBL).join(', ')}`:''}${test?' sẽ gửi ngay vào hòm thư của bạn (quà đính kèm bạn vẫn nhận được).':at?' sẽ được hẹn giờ gửi.':' sẽ gửi ngay.'} Không thể thu hồi quà sau khi gửi.`,okText:test?'Gửi thử':'Xác nhận gửi',
  ok:async()=>{const r=await admDoSend(un,at);if(!r)return;closeSheet();if(!test){admClearDraft()}await API.reload();renderAll();await admLoad();if(!test)ADM.tab='hist',ADM.hseg=at?'sch':'sent';renderAdmin();toast(test?'Đã gửi thử':at?'Đã hẹn giờ gửi thư':'Đã gửi thư')}})}
/* --- Thành viên --- */
function admMemList(){const q=ADM.mq.trim().toLowerCase(),now=Date.now();
 let list=ADM.mem.filter(m=>!q||m.name.toLowerCase().includes(q)||m.username.includes(q));
 const sameDay=iso=>iso&&new Date(iso).toDateString()===new Date().toDateString();
 if(ADM.mf==='today')list=list.filter(m=>sameDay(m.last_active)||m.done_today);
 if(ADM.mf==='late')list=list.filter(m=>!m.done_today);
 if(ADM.mf==='away')list=list.filter(m=>!m.last_active||now-new Date(m.last_active).getTime()>7*864e5);
 return list.map(m=>{const i=ADM.mem.indexOf(m),on=m.last_active&&now-new Date(m.last_active).getTime()<10*60e3,away=m.last_active&&now-new Date(m.last_active).getTime()>3*864e5;
  const tag=on?['Đang online','#C9F3E6']:m.done_today?['Đã điểm danh','#C9F3E6']:away?['Vắng '+Math.round((now-new Date(m.last_active).getTime())/864e5)+' ngày','#FFD1EA']:['Chưa điểm danh','#FFE45E'];
  return `<div class="adm"><div class="admt">${admAv(m.name,i)}<div><b>${esc(m.name)}</b><span>@${esc(m.username)} · ${admAgo(m.last_active)}</span></div><span class="adtag" style="background:${tag[1]}">${tag[0]}</span></div>
  <div class="admi"><div>Chuỗi<b>${m.streak}</b></div><div>Thẻ<b>${m.cards}/${m.cards_total}</b></div><div>Thư chưa nhận<b>${m.unclaimed}</b></div></div>
  <div class="admac">${m.done_today?`<button class="p" data-x="admg" data-v="${esc(m.username)}">Tặng quà</button><button data-x="admm" data-v="${esc(m.username)}">Gửi thư</button>`:`<button class="p" data-x="admn" data-v="${esc(m.username)}">Nhắc điểm danh</button><button data-x="admg" data-v="${esc(m.username)}">Tặng quà</button>`}<button data-x="admi" data-v="${esc(m.username)}">Chi tiết</button></div></div>`}).join('')||'<div class="empty">Không có thành viên nào khớp.</div>'}
function admMemTab(){const F=[['all','Tất cả'],['today','Hoạt động hôm nay'],['late','Chưa điểm danh'],['away','Chưa vào 7 ngày']];
 return `<div class="adsrch"><input class="in" id="amq" placeholder="Tìm tên hoặc tên đăng nhập" autocomplete="off" value="${esc(ADM.mq)}"></div><div class="gsel" style="padding:0 14px">${F.map(f=>`<button class="chip ${ADM.mf===f[0]?'on':''}" data-x="admf" data-v="${f[0]}">${f[1]}</button>`).join('')}</div><div id="admMl">${admMemList()}</div>`}
/* --- Lịch sử --- */
function admHist(){const sch=ADM.hist.filter(h=>h.scheduled),sent=ADM.hist.filter(h=>!h.scheduled),list=ADM.hseg==='sch'?sch:sent;
 const gl=h=>h.gifts.length?`<span class="adtag" style="background:#FFE45E">Quà: ${esc(h.gifts.map(GIFTLBL).join(', '))}</span>`:`<span class="adtag" style="background:var(--sleeve)">Không quà</span>`;
 return `<div class="adseg"><button class="${ADM.hseg==='sch'?'on':''}" data-x="adhs" data-v="sch">Hẹn giờ${sch.length?`<b>${sch.length}</b>`:''}</button><button class="${ADM.hseg==='sent'?'on':''}" data-x="adhs" data-v="sent">Đã gửi</button></div>`+
 (list.length?list.map(h=>ADM.hseg==='sch'?`<div class="adit"><div class="adtop"><b>${esc(h.title)}</b><time>${fmtDT(h.deliver_at)}</time></div><p>${esc(h.body)}</p><div class="admeta"><span class="adtag" style="background:#E3DCFF">Hẹn giờ</span>${gl(h)}<span class="adtag" style="background:#C9F3E6">${h.recipients} người</span></div><div class="admac"><button data-x="ade" data-v="${h.id}">Sửa</button><button data-x="adsn" data-v="${h.id}">Gửi ngay</button><button class="dn" data-x="adx" data-v="${h.id}">Huỷ hẹn</button></div></div>`
  :`<div class="adit"><div class="adtop"><b>${esc(h.title)}</b><time>${fmtDT(h.deliver_at)}</time></div><div class="admeta"><span class="adtag" style="background:#C9F3E6">${h.recipients} người</span>${gl(h)}</div>${h.gifts.length?`<div class="adpr"><i style="width:${h.recipients?Math.round(h.claimed/h.recipients*100):0}%"></i></div>`:''}<div class="adtop"><span class="sub" style="margin:0">${h.gifts.length?`${h.claimed}/${h.recipients} đã nhận quà · `:''}${h.read}/${h.recipients} đã đọc</span>${h.gifts.length&&h.claimed<h.recipients?`<button class="adlnk" data-x="adnu" data-v="${h.id}">Nhắc người chưa nhận</button>`:''}</div></div>`).join(''):`<div class="empty">${ADM.hseg==='sch'?'Chưa có thư nào đang hẹn giờ.':'Chưa gửi thư nào.'}</div>`)}
/* --- điều khiển (gọi từ bộ xử lý click chung) --- */
function admAct(a,d){
 const re=()=>renderAdmin();
 switch(a){
  case 'adt':ADM.tab=d.v;re();return true;
  case 'adq':if(d.v==='sch'){ADM.tab='hist';ADM.hseg='sch'}else if(d.v==='gift'){ADM.tab='send';ADM.kind='card'}else ADM.tab=d.v;re();return true;
  case 'ato':ADM.to=d.v;admSave();re();return true;
  case 'adu':{const i=ADM.users.indexOf(d.v);if(i>=0)ADM.users.splice(i,1);else ADM.users.push(d.v);admSave();re();$('#asq')&&($('#asq').value=ADM.sq);return true}
  case 'adp':{const t=ADTPL.find(x=>x[0]===d.v);ADM.tpl=d.v;if(t){ADM.t=t[2];ADM.b=t[3]}admSave();re();return true}
  case 'agk':ADM.kind=d.v;re();return true;
  case 'agr':ADM.rar=d.v;re();return true;
  case 'ags':ADM.saver=Math.max(1,Math.min(5,ADM.saver+(+d.v)));re();return true;
  case 'agv':ADM.con=+d.v;re();return true;
  case 'agq':ADM.pq=Math.max(1,Math.min(5,ADM.pq+(+d.v)));re();return true;
  case 'agf':ADM.cf=d.v;re();return true;
  case 'agc':ADM.cid=d.v;re();return true;
  case 'agp':ADM.title=d.v;re();return true;
  case 'aga':{const k=ADM.kind;if(k==='cardid'&&!ADM.cid){toast('Chọn một thẻ trước');return true}
   if(ADM.gifts.length>=4){toast('Mỗi thư đính kèm tối đa 4 quà');return true}
   ADM.gifts.push(k==='card'?{type:'card',rarity:ADM.rar}:k==='cardid'?{type:'card_id',id:ADM.cid}:k==='rescue'?{type:'rescue',qty:ADM.saver}:k==='pack'?{type:'concept_pack',con:ADM.con,qty:ADM.pq}:{type:'title',id:ADM.title});admSave();re();return true}
  case 'agd':ADM.gifts.splice(+d.i,1);admSave();re();return true;
  case 'asc':ADM.sched=!ADM.sched;admSave();re();return true;
  case 'asend':admSend(false);return true;
  case 'adtest':admSend(true);return true;
  case 'adclr':admClearDraft();re();toast('Đã xoá nháp');return true;
  case 'admf':ADM.mf=d.v;re();return true;
  case 'admg':case 'admm':case 'admn':{ADM.to='some';ADM.users=[d.v];ADM.tab='send';ADM.sq='';
   if(a==='admn'){const t=ADTPL.find(x=>x[0]==='remind');ADM.tpl='remind';ADM.t=t[2];ADM.b=t[3]}
   if(a==='admg')ADM.kind='card';admSave();re();return true}
  case 'admi':{const m=ADM.mem.find(x=>x.username===d.v);if(!m)return true;
   openSheet(`<h2>${esc(m.name)}</h2><div class="sub">@${esc(m.username)} · tham gia ${fmtDT(m.created_at)} · ${m.member?'Thành viên yêu thích: '+esc(m.member):'Chưa chọn thành viên'}</div><div class="admi" style="margin-top:12px"><div>Chuỗi<b>${m.streak}</b></div><div>Thẻ<b>${m.cards}/${m.cards_total}</b></div><div>Thư chưa nhận<b>${m.unclaimed}</b></div></div><button class="big gh" data-x="cfno">Đóng</button>`);return true}
  case 'adhs':ADM.hseg=d.v;re();return true;
  case 'ade':{const h=ADM.hist.find(x=>x.id===d.v);if(!h)return true;
   ADM.t=h.title;ADM.b=h.body;ADM.gifts=h.gifts.slice();ADM.to='some';ADM.users=(h.usernames||[]).slice();ADM.sched=true;
   const dt=new Date(h.deliver_at),loc=new Date(dt.getTime()-dt.getTimezoneOffset()*60000).toISOString().slice(0,16);ADM.at=loc;ADM.editId=h.id;ADM.tpl='blank';ADM.tab='send';admSave();re();return true}
  case 'adsn':confirmSheet({icon:'send',title:'Gửi ngay?',body:'Thư sẽ được gửi ngay cho mọi người nhận.',okText:'Gửi ngay',ok:async()=>{try{await API.adminSendNow(d.v);closeSheet();await admLoad();ADM.hseg='sent';re();toast('Đã gửi thư')}catch(er){apiFail(er)}}});return true;
  case 'adx':confirmSheet({icon:'alert',danger:true,title:'Huỷ thư hẹn giờ?',body:'Thư sẽ bị xoá và không ai nhận được.',okText:'Huỷ hẹn',ok:async()=>{try{await API.adminCancelMail(d.v);closeSheet();await admLoad();toast('Đã huỷ thư hẹn giờ')}catch(er){apiFail(er)}}});return true;
  case 'adnu':(async()=>{try{const n=await API.adminNudgeMail(d.v);toast(n?`Đã nhắc ${n} người`:'Mọi người đều đã nhận quà')}catch(er){apiFail(er)}})();return true;
 }
 return false}
