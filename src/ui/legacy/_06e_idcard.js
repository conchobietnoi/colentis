/* ===== Mùa Concept · thẻ ID + khung thành viên (giai đoạn 1) ===== */
const MC_EID='mua-concept-2026';
const IDM={
 james:{f:'jm',n:'JAMES',ac:'#FFB02E',fc:'#FFDBA1',ko:'제임스',han:'赵雨凡',full:'CHAO YUFAN',dob:'14/10/2005',blood:'A',nat:'Thái – Hoa',cd:'JM',song:'Young Crew',vn:'Triệu Vũ Phàm',ang:150.97,day:14},
 juhoon:{f:'jh',n:'JUHOON',ac:'#FF2E88',fc:'#FFA1C9',ko:'주훈',han:'김주훈',full:'KIM JU-HOON',dob:'03/01/2008',blood:'O',nat:'Hàn Quốc',cd:'JH',song:'TNT',vn:'Kim Chu Huân',ang:23.23,day:3},
 keonho:{f:'kh',n:'KEONHO',ac:'#8B5CFF',fc:'#CBB6FF',ko:'건호',han:'안건호',full:'AHN KEON-HO',dob:'04/02/2009',blood:'O',nat:'Hàn Quốc',cd:'KH',song:'Wassup',vn:'An Kiến Huy',ang:34.84,day:4},
 martin:{f:'mt',n:'MARTIN',ac:'#4CC9FF',fc:'#AEE7FF',ko:'마틴',han:'박우주',full:'PARK WOO-JOO',dob:'20/03/2008',blood:'O',nat:'Hàn – Canada',cd:'MT',song:'Blue Lips',vn:'Phan Mạnh Tiến',ang:220.65,day:20},
 seonghyeon:{f:'sh',n:'SEONGHYEON',ac:'#35D0A5',fc:'#A4EAD6',ko:'성현',han:'엄성현',full:'EOM SEONG-HYEON',dob:'13/01/2009',blood:'A',nat:'Hàn Quốc',cd:'SH',song:'ACAI',vn:'Nghiêm Sơn Hoàng',ang:139.35,day:13}
};
const IDORDER=['james','juhoon','keonho','martin','seonghyeon'];
const IDCON=[{n:'Urichinguchana',d:'18 — 20.10',c:'#FFB02E',k:'1'},{n:'Aniyaaa',d:'21 — 23.10',c:'#FF2E88',k:'2'},{n:'Poyoyoi',d:'24 — 26.10',c:'#4CC9FF',k:'3'}];
const idShade=h=>{const n=parseInt(h.slice(1),16);return `rgb(${Math.round((n>>16&255)*.62)},${Math.round((n>>8&255)*.62)},${Math.round((n&255)*.62)})`};
const idAsset=(k,mid)=>`${ASSETBASE}assets/idcard/${k}-${mid}.png`;
const idLogo=(cls,v)=>`<svg class="${cls}" viewBox="0 0 32 32"><rect x="2" y="4" width="28" height="26" rx="6" fill="#fff"></rect><rect x="2" y="4" width="28" height="9" rx="4.5" fill="#1E1B5E"></rect><circle cx="9" cy="20" r="2.3" fill="#1E1B5E"></circle><circle cx="16" cy="20" r="2.3" fill="#1E1B5E"></circle><circle cx="23" cy="20" r="2.3" fill="#1E1B5E"></circle><circle cx="9" cy="26" r="2.3" fill="#1E1B5E"></circle><circle cx="16" cy="26" r="2.3" fill="#1E1B5E"></circle><circle cx="23" cy="26" r="2.6" style="fill:var(${v})"></circle></svg>`;
const ID_SEAL='<svg class="idseal" viewBox="0 0 100 100"><defs><linearGradient id="idsg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE45E"></stop><stop offset=".35" stop-color="#FF4FA3"></stop><stop offset=".7" stop-color="#4CC9FF"></stop><stop offset="1" stop-color="#8B5CFF"></stop></linearGradient><path id="idsp" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"></path></defs><circle cx="50" cy="50" r="47" fill="url(#idsg)" opacity=".22"></circle><circle cx="50" cy="50" r="46" fill="none" stroke="url(#idsg)" stroke-width="2.4"></circle><circle cx="50" cy="50" r="27" fill="none" stroke="#1E1B5E" stroke-width=".8" stroke-dasharray="1.6 2.2"></circle><text font-size="8.6" font-weight="800" letter-spacing="2.1" fill="#1E1B5E" font-family="Unbounded,sans-serif"><textPath href="#idsp">COLENTIS · FAN ID · CORTIS · </textPath></text><rect x="36" y="38" width="28" height="25" rx="5" fill="#fff" stroke="#1E1B5E" stroke-width="1.6"></rect><rect x="36" y="38" width="28" height="8" rx="4" fill="#1E1B5E"></rect><circle cx="43" cy="52" r="2" fill="#1E1B5E"></circle><circle cx="50" cy="52" r="2" fill="#1E1B5E"></circle><circle cx="57" cy="52" r="2" fill="#1E1B5E"></circle><circle cx="43" cy="58" r="2" fill="#1E1B5E"></circle><circle cx="50" cy="58" r="2" fill="#1E1B5E"></circle><circle cx="57" cy="58" r="2.4" style="fill:var(--ac)"></circle></svg>';
const idCropCss=c=>{const z=Math.min(3,Math.max(1,+c.z||1)),x=+c.x,y=+c.y;return `width:${z*100}%;height:${z*100}%;left:${-(z-1)*(isNaN(x)?50:x)}%;top:${-(z-1)*(isNaN(y)?50:y)}%;object-fit:cover`};
const idDate=iso=>{if(!iso)return '—';const d=new Date(iso);if(isNaN(d))return '—';return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`};

/* ----- thẻ ID (mặt trước / sau) ----- */
function idFront(mid,c,o={}){const m=IDM[mid]||null,ac=m?m.ac:'#9AA6FF',crop=(c&&c.crop)||{z:1,x:50,y:50};
 const src=o.photoData?`src="${o.photoData}"`:(c&&c.photo_path?AVA(c.photo_path):'');
 const ph=src?`<img id="idphoto" ${src} alt="" style="${idCropCss(crop)}">`:`<div class="idphe"><svg viewBox="0 0 30 40" class="idsil"><circle cx="15" cy="15" r="6.5" fill="currentColor"></circle><path d="M3 40 C3 27 9 23 15 23 C21 23 27 27 27 40Z" fill="currentColor"></path></svg><small>Tải ảnh của bạn</small></div>`;
 const nm=m?m.n:'FAN ID',fs=nm.length>8?5.8:7.2,dash='— — —';
 return `<div class="idw"><div class="idc idf" style="--ac:${ac};--ac2:${idShade(ac)}"><div class="idrail"><span class="idrail-l">${idLogo('idlg','--ac')}<b>COLENTIS</b></span><i class="idpunch"></i><span class="idrail-r">FAN ID · 2026</span></div>
 <div class="idph"><div class="idphin">${ph}</div><i class="idc1"></i><i class="idc2"></i><i class="idc3"></i><i class="idc4"></i></div>
 <div class="idinf"><h3 class="idnm" style="font-size:${fs}cqw">${nm}</h3><div class="idko">${m?`${m.ko} · ${m.han}`:'Chọn thành viên của bạn'}</div>
 <div class="idrows"><div class="idrow"><span>Họ tên</span><b>${m?m.full:dash}</b></div><div class="idrow"><span>Ngày sinh</span><b>${m?m.dob:dash}</b></div><div class="idrow"><span>Nhóm máu</span><b>${m?m.blood:dash}</b></div><div class="idrow"><span>Quốc tịch</span><b>${m?m.nat:dash}</b></div></div></div>
 <div class="idcode ${m?'':'emp'}">${m?`<img class="idspi" src="${idAsset('sp',mid)}" alt="Mã Spotify">`:`<span class="idspb" style="height:7.4cqw;width:30cqw;border-radius:1.2cqw"></span>`}<span class="idsng"><small>BÀI ĐẠI DIỆN</small><b>${m?m.song:dash}</b></span></div></div></div>`}
function idBack(mid,c){const m=IDM[mid]||null,ac=m?m.ac:'#9AA6FF',holder=(c&&c.holder)||'';
 const days=Array.from({length:31},(_,i)=>`<i class="${m&&m.day===i+1?'on':''}"><u>${i+1}</u></i>`).join('');
 return `<div class="idw"><div class="idc idb" style="--ac:${ac};--ac2:${idShade(ac)}"><div class="iddays">${days}</div>
 <div class="idsigp"><small>CHỮ KÝ</small>${m?`<img src="${idAsset('sg',mid)}" alt="Chữ ký">`:''}</div><div class="idsealw">${ID_SEAL}</div>
 <div class="idbf"><div><small>CHỦ THẺ</small><b id="idholder" style="${holder?'':'opacity:.4'}">${holder?esc(holder):'Chưa nhập tên'}</b></div><div><small>CẤP NGÀY</small><b>${idDate(c&&c.granted_at)}</b></div><div><small>SỐ THẺ</small><b>${c&&c.serial?esc(c.serial):'—'}</b></div></div></div></div>`}

/* ----- khung tròn + khung danh hiệu của thành viên ----- */
function idInner(m){return m.photo?`<img src="${m.photo}" alt="">`:m.photoPath?`<img ${AVA(m.photoPath)} alt="">`:`<span style="display:grid;place-items:center;width:100%;height:100%;font:800 calc(var(--fw)*.2) 'Unbounded',sans-serif;color:#1E1B5E">${esc(m.ini||'?')}</span>`}
function idFrameAv(mid,s,m){const d=IDM[mid];if(!d)return '';
 const nums=[[d.day,24,0],[17,96,1.1],[10,168,2.2],[25,240,3.3],[d.day,312,4.4]];
 return `<div class="ifx" style="--fa:${d.ac};--fc:${d.fc};--fw:${s}px"><div class="idial"><div class="itg"></div><div class="itk"></div><div class="itk2"></div><div class="ibd" style="transform:rotate(${d.ang}deg)"></div></div><div class="idns">${nums.map(([n,a,l])=>`<span class="idn" style="--ang:${a}deg;--dl:${l}s"><i>${n}</i></span>`).join('')}</div><div class="iring"><div class="iav">${m?idInner(m):''}</div><i class="ish"></i></div><img class="isg" src="${idAsset('sg',mid)}" alt=""><span class="ibg">${idLogo('ilg','--fa')}</span></div>`}
function idTitlePill(mid,text,h){const d=IDM[mid];if(!d)return '';return `<span class="ittl" style="--fa:${d.ac};--fb:${d.fc};zoom:${(h||46)/46}">${idLogo('ilg','--fa')}<b>${esc(text||d.vn)}</b></span>`}

/* ----- trạng thái ----- */
const IDS={side:'f',photoData:null,crop:null,holder:null,pick:null,busy:false};
const idMine=()=>S.idc&&S.idc.member?S.idc.member:null;
function idDraft(){const c=S.idc||{};return {...c,holder:IDS.holder!==null?IDS.holder:(c.holder||''),crop:IDS.crop||c.crop||{z:1,x:50,y:50}}}

/* ----- thư poster ----- */
function idPoster(m){
 const got=m.claimed,c=S.idc;
 const ticker=Array(6).fill('MÙA CONCEPT · 18 — 26.10.2026 · COLENTIS × CORTIS · ').join('');
 const hero=`<div class="mph"><div class="mpphs">${IDCON.map(k=>`<i style="background-image:linear-gradient(170deg,${k.c} 0%,#14123F 85%)"></i>`).join('')}</div><div class="mpsp">${Array.from({length:10},()=>`<i style="left:${R(5,92)}%;top:${R(5,60)}%;animation-delay:${R(0,2)}s"></i>`).join('')}</div>
 <div class="mphx"><small>COLENTIS × CORTIS</small><b>Mùa<br>Concept</b><em>18 — 26.10.2026</em></div><div class="mptk"><div class="mptki">${ticker}</div></div></div>`;
 const stats=`<div class="mpst"><div><b>9</b><small>ngày</small></div><div><b>3</b><small>concept</small></div><div><b>2</b><small>thẻ Ultra</small></div><div><b>5</b><small>khung ID</small></div></div>`;
 const secs=`<div class="mpsec"><span class="mpk">3 CHẶNG · 9 NGÀY</span><h2>Mỗi chặng một <em>concept</em></h2><p class="mpd">Mỗi concept kéo dài ba ngày, với bộ thẻ riêng. Thẻ vẫn đang được giữ kín — chỉ khi mở ra bạn mới biết là gì.</p>
 ${IDCON.map(k=>`<div class="mpcn" style="--c:${k.c}"><div class="mpcnh"><b>${k.k}</b><div><strong>${k.n}</strong><small>${k.d}</small></div></div><div class="mpsl mq">${Array.from({length:5},()=>'<i>?</i>').join('')}</div></div>`).join('')}
 <div class="mprw"><span><i>★</i> Thẻ concept</span><span><i>★</i> Khung thành viên</span><span><i>★</i> Thẻ ID Fan</span><span><i>★</i> Thẻ Ultra</span></div></div>`;
 const ultra=`<div class="mpul"><div class="mpuS"></div><span class="mpk">GIỮ KÍN</span><h2>Hai thẻ <em>Ultra Limited</em></h2><div class="mpuc"><div class="mpu a"><div class="mpuf"></div><span class="mpq">?</span><small>ULTRA</small><i class="mpsw"></i></div><div class="mpu b"><div class="mpuf"></div><span class="mpq">?</span><small>ULTRA</small><i class="mpsw"></i></div></div><p class="mpd" style="text-align:center;color:#d9d6ff">Chỉ xuất hiện khi mùa sự kiện đi đến cuối. Chưa ai biết hình gì.</p></div>`;
 const how=`<div class="mpsec"><span class="mpk">QUÀ HÔM NAY</span><h2>Thẻ ID <em>Fan</em> của bạn</h2><div class="mpidc">${idFront(null,null)}</div>
 <ol class="mpids"><li><i>1</i><div><b>Chọn thành viên</b>Chọn một lần duy nhất. Màu thẻ, chữ ký và mã Spotify đổi theo thành viên bạn chọn.</div></li><li><i>2</i><div><b>Thêm ảnh của bạn</b>Chọn ảnh, phóng to và kéo cho vừa khung.</div></li><li><i>3</i><div><b>Viết tên của bạn</b>Tên hiện ở mặt sau thẻ, tối đa 20 ký tự.</div></li><li><i>4</i><div><b>Quét mã Spotify</b>Mở Spotify, chọn tìm kiếm, bấm biểu tượng máy ảnh rồi quét mã trên thẻ để nghe bài đại diện.</div></li></ol>
 <div class="mpunl">Có ảnh và tên rồi, <b>khung tròn</b> và <b>danh hiệu</b> của thành viên sẽ được mở khóa ở Hồ sơ.</div></div>`;
 const gf=(cls,t,b,e,done)=>`<div class="mpgf ${done?'done':''}" style="cursor:default;animation:none"><div class="mpgb ${cls} ${done?'mok mok2':''}"><i></i></div><div class="mpgt"><small>${t}</small><b>${b}</b><em>${e}</em></div></div>`;
 const gifts=`<div class="mpsec" style="padding-bottom:110px"><span class="mpk">QUÀ TRONG THƯ</span><h2>Ba món quà <em>cho bạn</em></h2>
 ${gf('ic1','THẺ','Thẻ ID Fan','Thêm ảnh, tên, mã Spotify',got)}${gf('ic2','KHUNG','Khung thành viên','Mở khi thẻ có ảnh và tên',got)}${gf('ic3','GÓI','1 gói Mùa Concept','Lưu vào Sự kiện, mở từ 18/10',got)}</div>`;
 const fab=got?`<button class="mpfab" data-id-act="open">Mở thẻ ID của bạn</button>`:`<button class="mpfab" data-id-act="claim" data-id="${m.id}">Nhận quà</button>`;
 $('#pgLetter').innerHTML=`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgLetter" aria-label="Quay lại">${ic('left')}</button><h1>Thư sự kiện</h1></div><div class="pbody" style="padding:0">${hero}${stats}${secs}${ultra}${how}${gifts}</div>${fab}`;
 openPage('pgLetter');renderMailList();syncBadges()}

/* ----- nhận quà: thẻ -> gói -> chọn thành viên ----- */
async function idClaim(id){const m=MAILS.find(x=>x.id===id);if(!m||m.claimed||IDS.busy)return;if(!API.online()){toast('Cần có mạng để nhận quà');return}
 IDS.busy=true;try{await API.claimMail(id);await API.reload();renderAll()}catch(e){IDS.busy=false;return apiFail(e,'claim')}IDS.busy=false;
 const mm=MAILS.find(x=>x.id===id);if(mm)idPoster(mm);idReveal(1)}
function idReveal(stage){let ov=$('#idrev');if(!ov){ov=document.createElement('div');ov.className='mprv';ov.id='idrev';document.body.appendChild(ov)}
 const burst=`<div class="mpbs">${Array.from({length:18},(_,i)=>`<i style="--a:${i*20}deg;--d:${R(110,190)}px;background:${['#FFE45E','#FF4FA3','#4CC9FF','#8B5CFF'][i%4]}"></i>`).join('')}</div>`;
 if(stage===1)ov.innerHTML=`<div class="mprays"></div>${burst}<div class="mprvc mpin"><div class="mpglow"></div>${idFront(null,null)}</div><span class="mprk">QUÀ 1 / 2</span><b class="mprh">Thẻ ID Fan</b><p class="mprt">Kèm khung thành viên. Chọn thành viên ngay để thẻ có màu riêng.</p><button class="mpgo" data-id-act="rev2">Tiếp tục</button>`;
 else ov.innerHTML=`<div class="mprays"></div>${burst}<div class="mppack mpin"><i class="mpshine"></i><span>MÙA CONCEPT</span><b>18/10</b><em>Gói đầu tiên</em></div><span class="mprk">QUÀ 2 / 2</span><b class="mprh">Đã lưu vào Sự kiện</b><p class="mprt">Gói này sẽ mở từ ngày 18/10.</p><button class="mpgo" data-id-act="rev3">Chọn thành viên</button>`}

/* ----- chọn thành viên ----- */
function idMemberSheet(){if(!S.idc){toast('Bạn chưa có thẻ ID');return}if(idMine()){idOpenPage();return}
 const p=IDS.pick;
 openSheet(`<div class="sh-in" style="padding:6px 4px 8px"><h3 style="margin:0 0 4px;font:800 18px 'Be Vietnam Pro'">Chọn thành viên của bạn</h3><p style="margin:0 0 6px;font:600 12.5px/1.5 'Be Vietnam Pro';color:var(--soft)">Chọn một lần duy nhất, không đổi lại được.</p>
 ${IDORDER.map(k=>{const d=IDM[k];return `<button class="idmr ${p===k?'on':''}" style="--c:${d.ac}" data-id-act="pick" data-m="${k}"><span style="width:44px;height:44px;display:grid;place-items:center">${idFrameAv(k,44,ME)}</span><span><b>${d.n}</b><small>${esc(d.vn)} · ${esc(d.song)}</small></span></button>`}).join('')}
 <button class="mpbtn" style="width:100%;margin-top:14px;padding:14px;${p?'':'opacity:.4;pointer-events:none'}" data-id-act="confirm">${p?`Chọn ${IDM[p].n}`:'Chọn một thành viên'}</button></div>`)}
async function idConfirm(){const p=IDS.pick;if(!p||IDS.busy)return;if(!API.online()){toast('Cần có mạng');return}
 IDS.busy=true;try{await API.idCardChoose(p);await API.reload();renderAll()}catch(e){IDS.busy=false;return apiFail(e)}IDS.busy=false;IDS.pick=null;closeSheet();idOpenPage()}

/* ----- trang thẻ ID: xem + chỉnh ----- */
function idOpenPage(){IDS.side='f';IDS.photoData=null;IDS.crop=null;IDS.holder=null;idRenderPage();openPage('pgId')}
function idRenderPage(){const c=S.idc;if(!c){return}const mid=c.member,d=idDraft(),has=!!(c.photo_path||IDS.photoData),nameOk=!!d.holder.trim();
 const dirty=!!IDS.photoData||(IDS.crop&&JSON.stringify(IDS.crop)!==JSON.stringify(c.crop))||(IDS.holder!==null&&IDS.holder!==(c.holder||''));
 const steps=[!!mid,has,nameOk,!!mid],done=steps.filter(Boolean).length;
 const cr=d.crop;
 const frameOk=!!c.frame;
 $('#pgId').innerHTML=`<div class="ptop" style="color:#fff"><button class="ibtn" data-act="back" data-p="pgId" aria-label="Quay lại">${ic('left')}</button><h1>Thẻ ID Fan</h1></div>
 <div class="pbody"><div class="mpvs"><div id="idcardv">${IDS.side==='f'?idFront(mid,d,{photoData:IDS.photoData}):idBack(mid,d)}</div><div class="mpfl"><button data-id-act="flip">${ic('sync')} ${IDS.side==='f'?'Xem mặt sau':'Xem mặt trước'}</button></div></div>
 <div class="mped"><h3>Chỉnh thẻ của bạn</h3><div class="mppr"><i style="width:${done/4*100}%"></i></div>
 <div class="mpstp"><div class="mpsh"><b><i class="${mid?'mok':''}">${mid?'✓':'1'}</i>Thành viên</b><small>${mid?IDM[mid].n:'Chưa chọn'}</small></div>${mid?'':`<div class="mpbt"><button class="mpbtn" data-id-act="members">Chọn thành viên</button></div>`}</div>
 <div class="mpstp"><div class="mpsh"><b><i class="${has?'mok':''}">${has?'✓':'2'}</i>Ảnh của bạn</b><small>${has?'Đã có ảnh':'Chưa có'}</small></div>
 <div class="mpbt"><label class="mpbtn" style="cursor:pointer">${has?'Đổi ảnh':'Chọn ảnh'}<input type="file" accept="image/*" id="idfile" hidden></label></div>
 ${has?`<div class="mpsl2"><label>Phóng<input type="range" min="1" max="3" step="0.05" value="${cr.z}" data-id-rng="z"></label><label>Ngang<input type="range" min="0" max="100" step="1" value="${cr.x}" data-id-rng="x"></label><label>Dọc<input type="range" min="0" max="100" step="1" value="${cr.y}" data-id-rng="y"></label></div>`:''}</div>
 <div class="mpstp"><div class="mpsh"><b><i class="${nameOk?'mok':''}">${nameOk?'✓':'3'}</i>Tên chủ thẻ</b><small>Tối đa 20 ký tự</small></div><input class="mpinp" id="idname" maxlength="20" placeholder="Nhập tên của bạn" value="${esc(d.holder)}"></div>
 <div class="mpstp"><div class="mpsh"><b><i class="${mid?'mok':''}">${mid?'✓':'4'}</i>Mã Spotify</b><small>${mid?esc(IDM[mid].song):'Sau khi chọn thành viên'}</small></div><p class="mpsub" style="margin:0 0 8px">Mở Spotify, chọn Tìm kiếm, bấm biểu tượng máy ảnh rồi quét mã ở mặt trước thẻ.</p>${mid?`<button class="mpbtn gh" data-id-act="spot">Cách quét mã</button>`:''}</div>
 <div class="mpunl2 ${frameOk?'':'off'}"><b>${frameOk?'Khung thành viên đã mở':'Khung thành viên đang khóa'}</b><span>${frameOk?'Vào Hồ sơ → Danh hiệu để đeo khung.':'Cần chọn thành viên, thêm ảnh và viết tên (đã lưu).'}</span></div>
 <button class="mpgo sm" style="width:100%;${dirty&&!IDS.busy?'':'opacity:.4;pointer-events:none'}" data-id-act="save">${IDS.busy?'Đang lưu…':'Lưu thẻ'}</button></div></div>`;
 }
function idLive(){const c=S.idc;if(!c)return;const d=idDraft(),im=$('#idphoto');if(im)im.style.cssText=idCropCss(d.crop);const h=$('#idholder');if(h){h.textContent=d.holder||'Chưa nhập tên';h.style.opacity=d.holder?'':'.4'}}
function idPickFile(f){if(!f)return;if(!/^image\//.test(f.type)){toast('Hãy chọn một tệp ảnh');return}
 const img=new Image(),url=URL.createObjectURL(f);img.onload=()=>{const M=1200,k=Math.min(1,M/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(url);
  IDS.photoData=cv.toDataURL('image/jpeg',.86);IDS.crop={z:1,x:50,y:50};idRenderPage()};
 img.onerror=()=>{URL.revokeObjectURL(url);toast('Không đọc được ảnh này')};img.src=url}
async function idSave(){const c=S.idc;if(!c||IDS.busy)return;if(!API.online()){toast('Cần có mạng để lưu thẻ');return}
 const d=idDraft();IDS.busy=true;idRenderPage();
 try{let path=null;if(IDS.photoData)path=await API.uploadIdPhoto(IDS.photoData);
  await API.idCardSave(d.holder.trim(),path,{z:+(+d.crop.z).toFixed(2),x:Math.round(d.crop.x),y:Math.round(d.crop.y)});
  IDS.photoData=null;IDS.crop=null;IDS.holder=null;IDS.busy=false;await API.reload();renderAll();idRenderPage();toast('Đã lưu thẻ');newTitlesPrompt()}
 catch(e){IDS.busy=false;idRenderPage();apiFail(e)}}

/* ----- ô trong Bộ sưu tập + mục ở Hồ sơ ----- */
function idColTile(){const c=S.idc;if(!c||!(colFilter==='all'||colFilter==='event'))return '';
 const mid=c.member,has=!!c.photo_path,nameOk=!!(c.holder||'').trim(),need=!mid||!has||!nameOk;
 const st=(ok,t)=>`<span class="${ok?'mok':''}">${ok?'✓ ':''}${t}</span>`;
 const pk=(S.stash||[]).filter(x=>x.event_id===MC_EID&&!x.opened_at);
 return `<div class="mpctile" style="margin-bottom:12px"><button class="mpcbtn" data-id-act="open">${need?'<span class="mpnew">Mới</span>':''}${idFront(mid,c)}<div class="mpcap"><b>Thẻ ID Fan</b><span>${need?'Bấm để hoàn thiện thẻ của bạn':'Bấm để xem hoặc chỉnh thẻ'}</span></div></button><div class="mpchk">${st(!!mid,'Thành viên')}${st(has,'Ảnh')}${st(nameOk,'Tên')}</div>
 ${pk.length?`<p class="mpsub" style="margin:12px 0 0">${pk.length} gói Mùa Concept đang chờ trong Sự kiện (mở từ 18/10).</p>`:''}</div>`}
function idProMenu(){if(!S.idc)return '';const mid=idMine();return `<button class="menu" data-id-act="open"><span class="l">${ic('image')}<span>Thẻ ID Fan<small>${mid?'Chỉnh ảnh, tên và mở khung '+IDM[mid].n:'Chọn thành viên, thêm ảnh và tên'}</small></span></span>${ic('right')}</button>`}

/* ----- bắt sự kiện ----- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-id-act]');if(!b)return;const a=b.dataset.idAct;
 if(a==='claim')idClaim(b.dataset.id);
 else if(a==='rev2')idReveal(2);
 else if(a==='rev3'){const ov=$('#idrev');if(ov)ov.remove();idMemberSheet()}
 else if(a==='open'){if(!S.idc)return;if(!idMine())idMemberSheet();else idOpenPage()}
 else if(a==='members')idMemberSheet();
 else if(a==='pick'){IDS.pick=b.dataset.m;idMemberSheet()}
 else if(a==='confirm')idConfirm();
 else if(a==='flip'){IDS.side=IDS.side==='f'?'b':'f';idRenderPage()}
 else if(a==='save')idSave();
 else if(a==='spot')openSheet(`<div style="padding:6px 4px 10px"><h3 style="margin:0 0 8px;font:800 18px 'Be Vietnam Pro'">Quét mã Spotify</h3><p style="margin:0;font:600 13.5px/1.6 'Be Vietnam Pro';color:var(--soft)">Mở Spotify, chọn Tìm kiếm, bấm biểu tượng máy ảnh, rồi hướng camera vào mã ở mặt trước thẻ. Bài đại diện sẽ mở ra ngay.</p></div>`)});
document.addEventListener('input',e=>{const t=e.target;
 if(t.id==='idname'){IDS.holder=t.value.slice(0,20);idLive();const s=$('#pgId .mpgo.sm');if(s){s.style.opacity='';s.style.pointerEvents=''}}
 else if(t.dataset&&t.dataset.idRng){const c=S.idc;if(!c)return;IDS.crop={...(IDS.crop||c.crop||{z:1,x:50,y:50}),[t.dataset.idRng]:+t.value};idLive();const s=$('#pgId .mpgo.sm');if(s){s.style.opacity='';s.style.pointerEvents=''}}});
document.addEventListener('change',e=>{if(e.target.id==='idfile')idPickFile(e.target.files&&e.target.files[0])});
