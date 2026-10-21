/* ===== Check in bằng ảnh vuông (Colentis) =====
   Ảnh nằm ở bucket riêng tư `checkins`; mỗi việc có tối đa 1 ảnh, hiện trong ghi chú xổ xuống của việc.
   Thành viên chỉ chụp trực tiếp; admin có thêm nút chọn ảnh từ máy (căn vuông). Dấu mộc Colentis vẽ trên màn hình
   từ giờ máy chủ (taken_at) nên không giả ngày được. Thiết kế: design/checkin/checkin-mockup.html */
var COLTAB='cards';
const CI={tid:null,side:'back',zoom:1,flash:false,torch:false,stream:null,tok:0,open:false,busy:false,blob:null,url:null,src:'camera',prev:false};
const CIDOW=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
let CKM=null; /* tháng đang xem ở tab Ảnh của bản thân: [năm, tháng 0-11] */
let CKV=[],CKI=0;
document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><path id="cstampRing" d="M50,50 m-35.5,0 a35.5,35.5 0 1,1 71,0 a35.5,35.5 0 1,1 -71,0"/><linearGradient id="cstampG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF2E88"/><stop offset="1" stop-color="#FFB02E"/></linearGradient></defs></svg>');
const CIIC={
 cam:'<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.6"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 flip:'<path d="M4 8V5h3M20 16v3h-3"/><path d="M5.5 9A7.5 7.5 0 0119 8M18.5 15A7.5 7.5 0 015 16"/>',
 gal:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
 send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
 ck:'<path d="M5 12l5 5 9-10"/>',
 left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',
 rot:'<path d="M4 4v6h6"/><path d="M5 10a8 8 0 111.5 6"/>',sq:'<rect x="5" y="5" width="14" height="14" rx="3"/>',
 cal:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>'};
const ciIc=(n,w)=>`<svg class="ci-i" viewBox="0 0 24 24"${w?` style="width:${w}px;height:${w}px"`:''} aria-hidden="true">${CIIC[n]}</svg>`;
/* giờ Việt Nam từ một mốc thời gian */
function ciP(iso){const o={};new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(iso?new Date(iso):new Date(API.now())).forEach(p=>o[p.type]=p.value);
 const y=+o.year,m=+o.month,d=+o.day,dow=new Date(Date.UTC(y,m-1,d)).getUTCDay();
 return {y,m,d,dow,time:`${o.hour}:${o.minute}`,stamp:`${pad(d)}.${pad(m)}.${String(y).slice(2)}`,short:`${d}/${m}`,full:`${CIDOW[dow]}, ${d}/${m}/${y}`,key:`${y}-${pad(m)}-${pad(d)}`}}
const ciStamp=(iso,cls)=>`<span class="cstamp ${cls||''}" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="rgba(21,18,59,.66)" stroke="url(#cstampG)" stroke-width="3.2"/><circle cx="50" cy="50" r="27" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1"/><text font-family="Be Vietnam Pro,system-ui,sans-serif" font-size="10.6" font-weight="800" letter-spacing="1.4" fill="#fff"><textPath href="#cstampRing" startOffset="0">COLENTIS · CHECK IN · COLENTIS ·</textPath></text><circle cx="50" cy="42" r="12.5" fill="url(#cstampG)"/><path d="M44.2 42.2l4.4 4.4 7.4-8.6" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><text x="50" y="66" text-anchor="middle" font-family="Be Vietnam Pro,system-ui,sans-serif" font-size="9.5" font-weight="900" fill="#fff" letter-spacing=".5">${ciP(iso).stamp}</text></svg></span>`;
const ciPh=(path,iso,cls,local)=>`<span class="pw"><img alt="Ảnh check in" ${local?`src="${local}"`:`data-ph="${esc(path)}"`} draggable="false">${ciStamp(iso,cls)}</span>`;
/* tải ảnh bằng URL ký: img[data-ph] nào chưa có src thì điền */
let _ciHy=0;
function ciHydrate(){_ciHy=0;const im=[...document.querySelectorAll('img[data-ph]:not([src]):not([data-tried])')];if(!im.length)return;
 im.forEach(i=>i.dataset.tried=1);const ps=[...new Set(im.map(i=>i.dataset.ph))];
 API.photoUrls(ps).then(m=>im.forEach(i=>{const u=m[i.dataset.ph];if(u&&!i.getAttribute('src'))i.src=u})).catch(()=>{})}
new MutationObserver(()=>{if(!_ciHy)_ciHy=requestAnimationFrame(ciHydrate)}).observe(document.body,{childList:true,subtree:true});
/* ----- trong danh sách việc ----- */
function ciRowBtn(t,mine){const ph=S.photos&&S.photos[t.id];
 if(ph)return `<button class="ci-thumb ${mine?'':'oth'}" data-act="tnote" data-id="${t.id}" aria-label="Xem ảnh check in"><img alt="" data-ph="${esc(ph.p)}" draggable="false"></button>`;
 if(mine&&!t.pending)return `<button class="ci-cam" data-ci="cam" data-id="${t.id}" aria-label="Chụp ảnh check in">${ciIc('cam')}</button>`;
 return ''}
function ciNote(t,mine){const ph=S.photos&&S.photos[t.id];const mm=MEMBERS[t.owner]||{name:'Bạn bè'};
 if(ph){const p=ciP(ph.at),cn=(CALS.find(c=>c.id===t.cal)||{}).name||'này';
  return `<span class="ci-nph"><span class="ci-sq">${ciPh(ph.p,ph.at)}</span><span class="ci-meta"><span><b>${mine?'Bạn':esc(mm.name)}</b> check in lúc ${p.time}</span>${mine&&!t.pending?`<button class="ci-btn ghost sm" data-ci="cam" data-id="${t.id}">${ciIc('cam',15)}Chụp lại</button>`:''}</span><span class="ci-view">${ciIc('lock',13)}Cả lịch ${esc(cn)} đều xem được ảnh này</span></span>`}
 if(mine&&!t.pending)return `<span class="ci-nob">Chưa có ảnh check in cho việc này.<button class="ci-btn sm" data-ci="cam" data-id="${t.id}">${ciIc('cam',15)}Chụp ảnh check in</button></span>`;
 return mine?'':`<span class="ci-nob">${esc(mm.name)} chưa check in việc này.</span>`}
function ciFind(id){for(const k in S.tasks){const f=S.tasks[k].find(x=>x.id===id);if(f)return {t:f,k}}return null}
/* ----- máy ảnh ----- */
function ciCamHTML(t,hasPh){const adm=!!ME.admin;
 return `<div class="ci-scr on" id="ciCam"><div class="ci-top"><button class="ci-round" data-ci="close" aria-label="Đóng">${ciIc('x')}</button><div class="ci-brand"><b>COLENTIS</b><small>${hasPh?'CHỤP LẠI':'CHECK IN'}</small></div><button class="ci-round" id="ciFlashBtn" data-ci="flash" aria-label="Đèn flash" aria-pressed="false" style="visibility:hidden">${ciIc('bolt')}</button></div>
 <div class="ci-taskrow"><div class="ci-task">${ciIc('ck',15)}<span>${esc(t.t)}</span></div></div>
 <div class="ci-vfw"><div class="ci-vfx"><div class="ci-vf" id="ciVf"><video id="ciVid" playsinline muted autoplay></video><div class="ci-grid"></div><i class="ci-cn a"></i><i class="ci-cn b"></i><i class="ci-cn c"></i><i class="ci-cn d"></i>
  <div class="ci-rec"><i></i><span id="ciRec">CAM SAU</span></div>
  <div class="ci-zoom" id="ciZoom"><button class="on" data-ci="zoom" data-z="1">1×</button><button data-ci="zoom" data-z="2">2×</button></div>
  <div class="ci-cap"><input id="ciCap" maxlength="80" placeholder="Thêm vào ghi chú…" autocomplete="off"></div>
  <div class="ci-flash" id="ciFl"></div>
  <div class="ci-den" id="ciDen" hidden></div></div></div></div>
 <div class="ci-selrow" id="ciSel"><div class="ci-camsel" id="ciCamsel"><span class="ind" id="ciInd"></span><button class="on" data-ci="side" data-c="back">${ciIc('cam')}Cam sau</button><button data-ci="side" data-c="front">${ciIc('flip')}Cam trước</button></div></div>
 <div class="ci-ctl" id="ciCtlLive"><button class="ci-side ${adm?'adm':'empty'}" data-ci="gal" aria-label="Chọn ảnh từ máy (admin)">${ciIc('gal')}</button><button class="ci-shutter" data-ci="shot" aria-label="Chụp"><i></i></button><button class="ci-side" data-ci="flip" aria-label="Đổi camera">${ciIc('flip')}</button></div>
 <div class="ci-ctl" id="ciCtlPrev" hidden><button class="ci-side" data-ci="retake" aria-label="Chụp lại">${ciIc('x')}</button><button class="ci-send" data-ci="send" aria-label="Lưu vào ghi chú">${ciIc('send')}</button></div>
 <div class="ci-who" id="ciWho">${adm?'<span class="onlycam" style="color:var(--amber)">Admin: bấm biểu tượng ảnh bên trái để chọn ảnh từ máy</span>':`<span class="onlycam">${ciIc('lock',13)}Chỉ chụp trực tiếp, không chọn ảnh từ thư viện</span>`}</div></div>
 <div class="ci-scr" id="ciCrop"></div>
 <div class="ci-sent" id="ciDone"></div>
 <input type="file" id="ciFile" accept="image/*" hidden>`}
function ciOpenCam(id){const f=ciFind(id);if(!f||f.t.owner!=='me')return;
 if(!API.online()){toast('Cần có mạng để check in');return}
 CI.tid=id;CI.side='back';CI.zoom=1;CI.flash=false;CI.prev=false;CI.blob=null;CI.src='camera';CI.busy=false;CI.open=true;
 openPage('pgCam',ciCamHTML(f.t,!!(S.photos&&S.photos[id])));ciCapLimit(f.t);ciSide();ciStart()}
function ciCapLimit(t){const room=500-(t.note?t.note.length+1:0),i=$('#ciCap');if(!i)return;if(room<4){i.parentNode.style.visibility='hidden';i.dataset.off=1}else i.maxLength=Math.min(80,room)}
function ciSide(){const on=$(`#ciCamsel [data-c="${CI.side}"]`),ind=$('#ciInd');if(!on)return;
 $$('#ciCamsel button').forEach(b=>b.classList.toggle('on',b===on));ind.style.width=on.offsetWidth+'px';ind.style.transform=`translateX(${on.offsetLeft-4}px)`;
 $('#ciRec').textContent=CI.side==='front'?'CAM TRƯỚC · LẬT GƯƠNG':'CAM SAU';$('#ciZoom').style.display=CI.side==='front'?'none':'flex';ciVidFx()}
function ciVidFx(){const v=$('#ciVid');if(!v)return;v.style.transform=CI.side==='front'?'scaleX(-1)':`scale(${CI.zoom})`}
function ciStop(){CI.tok++;if(CI.stream){CI.stream.getTracks().forEach(t=>t.stop());CI.stream=null}CI.torch=false;const v=$('#ciVid');if(v)v.srcObject=null}
function ciDenied(e){const d=$('#ciDen');if(!d)return;const n=e&&e.name;
 const msg=n==='NotFoundError'?'Thiết bị này không có máy ảnh.':(n==='NotAllowedError'||n==='SecurityError')?'Colentis chưa được dùng máy ảnh. Hãy cho phép máy ảnh cho Colentis (hoặc trình duyệt) trong Cài đặt rồi thử lại.':'Chưa mở được máy ảnh. Hãy đóng các ứng dụng khác đang dùng máy ảnh rồi thử lại.';
 d.innerHTML=`${ciIc('cam',30)}<p>${msg}</p><button class="ci-btn sm" data-ci="retry">Thử lại</button>`;d.hidden=false}
async function ciStart(){ciStop();const tok=CI.tok;const d=$('#ciDen');if(d)d.hidden=true;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){ciDenied({name:'NotFoundError'});return}
 try{const st=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:CI.side==='front'?'user':'environment'},width:{ideal:1920},height:{ideal:1920}}});
  if(tok!==CI.tok||!CI.open||CI.prev){st.getTracks().forEach(t=>t.stop());return}
  CI.stream=st;const v=$('#ciVid');v.srcObject=st;v.play().catch(()=>{});
  const tr=st.getVideoTracks()[0],cap=tr&&tr.getCapabilities?tr.getCapabilities():{};CI.torch=!!cap.torch;
  const fb=$('#ciFlashBtn');if(fb)fb.style.visibility=CI.torch?'visible':'hidden';ciTorch(CI.flash)}
 catch(e){if(tok===CI.tok)ciDenied(e)}}
function ciTorch(on){const tr=CI.stream&&CI.stream.getVideoTracks()[0];if(!tr||!CI.torch)return;tr.applyConstraints({advanced:[{torch:!!on}]}).catch(()=>{})}
function ciSetPrev(on,url){CI.prev=on;const vf=$('#ciVf');if(!vf)return;vf.classList.toggle('prev',on);
 $('#ciCtlLive').hidden=on;$('#ciCtlPrev').hidden=!on;$('#ciSel').style.display=on?'none':'flex';$('#ciWho').style.display=on?'none':'block';
 vf.querySelectorAll('.ci-pv,.cstamp').forEach(x=>x.remove());
 if(on){$('#ciVid').style.visibility='hidden';vf.insertAdjacentHTML('afterbegin',`<img class="ci-pv" src="${url}" alt="">`);vf.insertAdjacentHTML('beforeend',ciStamp(null,'thump'))}
 else{$('#ciVid').style.visibility='visible';const c=$('#ciCap');if(c)c.value=''}}
function ciSnap(){const v=$('#ciVid');if(!v||!v.videoWidth||CI.busy)return;
 const vw=v.videoWidth,vh=v.videoHeight,side=Math.min(vw,vh),z=CI.side==='front'?1:CI.zoom,sw=side/z,sx=(vw-sw)/2,sy=(vh-sw)/2,out=Math.max(240,Math.min(1080,Math.floor(sw)));
 const cv=document.createElement('canvas');cv.width=cv.height=out;const c=cv.getContext('2d');if(CI.side==='front'){c.translate(out,0);c.scale(-1,1)}
 c.drawImage(v,sx,sy,sw,sw,0,0,out,out);
 const f=$('#ciFl');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');sfx('tick');vib(15);
 cv.toBlob(b=>{if(!b){toast('Chưa chụp được, thử lại nhé');return}CI.blob=b;CI.src='camera';ciUrl(b);setTimeout(()=>{ciStop();ciSetPrev(true,CI.url)},150)},'image/jpeg',.86)}
function ciUrl(b){if(CI.url)URL.revokeObjectURL(CI.url);CI.url=URL.createObjectURL(b)}
async function ciSend(){if(CI.busy||!CI.blob)return;const f=ciFind(CI.tid);if(!f)return;CI.busy=true;const btn=$('#ciCtlPrev .ci-send');btn&&btn.classList.add('ld');
 try{const r=await API.uploadCheckin({id:f.t.id,cal:f.t.cal},CI.blob,CI.src);
  const cap=(($('#ciCap')||{}).value||'').trim();let capFail=false;
  if(cap){const nt=(f.t.note?f.t.note+'\n':'')+cap;if(nt.length<=500){try{await API.editTask(f.t.id,{note:nt})}catch(e){capFail=true}}}
  await API.reload('lite').catch(()=>{});
  const g=ciFind(CI.tid);let ticked=false;
  if(g&&!g.t.done&&isoOfKey(g.k)<=TODAY.iso&&tickable(isoOfKey(g.k))&&!(g.k===todayKey&&S.claimed)){try{await tickTask(g.t.id);ticked=true}catch(e){}}
  S.ckLoaded=0;
  $('#ciDone').innerHTML=`<div class="ci-sq">${ciPh('',r.taken_at,'thump',CI.url)}</div><h2>Đã check in!</h2><p>Ảnh đã nằm trong ghi chú của việc.<br>Cả lịch đều xem được.${ticked?'<br>Việc đã được đánh dấu xong.':''}${capFail?'<br>Chưa thêm được dòng ghi chú.':''}</p><button class="ci-btn" data-ci="done">Xem trong ghi chú</button>`;
  $('#ciDone').classList.add('on');renderAll();refreshOpen()}
 catch(e){apiFail(e)}finally{CI.busy=false;btn&&btn.classList.remove('ld')}}
function isoOfKey(k){const [y,m,d]=k.split('-').map(Number);return isoOf(y,m-1,d)}
function ciCloseCam(){CI.open=false;ciStop();CI.tid=null;if(CI.url){URL.revokeObjectURL(CI.url);CI.url=null}CI.blob=null;closePage('pgCam');setTimeout(()=>{if(!CI.open)$('#pgCam').innerHTML=''},450)}
function ciGoNote(tid){const f=ciFind(tid);ciCloseCam();closePage('pgPhoto');if(!f){return}NOTEOPEN.add(tid);refreshOpen();
 setTimeout(()=>{const el=document.querySelector(`.t[data-id="${tid}"]`);if(el)el.scrollIntoView({behavior:'smooth',block:'center'})},200)}
/* ----- admin: chọn ảnh từ máy rồi căn vuông ----- */
const CR={w:1,h:1,rot:0,x:0,y:0,s:1,base:1,img:null};
const ciBox=()=>$('#ciCropBox').clientWidth;
function ciCropApply(){const B=ciBox(),iw=CR.rot%180?CR.h:CR.w,ih=CR.rot%180?CR.w:CR.h;CR.base=Math.max(B/iw,B/ih);const sc=CR.base*CR.s;
 CR.x=Math.min(0,Math.max(B-iw*sc,CR.x));CR.y=Math.min(0,Math.max(B-ih*sc,CR.y));
 const el=$('#ciCropImg');el.style.width=CR.w+'px';el.style.height=CR.h+'px';
 el.style.transform=`translate(${CR.x}px,${CR.y}px) scale(${sc}) translate(${CR.rot%180?CR.h/2:CR.w/2}px,${CR.rot%180?CR.w/2:CR.h/2}px) rotate(${CR.rot}deg) translate(${-CR.w/2}px,${-CR.h/2}px)`}
function ciCropCenter(){const B=ciBox(),iw=CR.rot%180?CR.h:CR.w,ih=CR.rot%180?CR.w:CR.h;CR.base=Math.max(B/iw,B/ih);const sc=CR.base*CR.s;CR.x=(B-iw*sc)/2;CR.y=(B-ih*sc)/2;ciCropApply()}
function ciOpenCrop(file){if(!ME.admin||!file)return;ciStop();
 const url=URL.createObjectURL(file),im=new Image();
 im.onload=()=>{CR.img=im;CR.w=im.naturalWidth;CR.h=im.naturalHeight;CR.rot=0;CR.s=1;
  $('#ciCrop').innerHTML=`<div class="ci-top"><button class="ci-round" data-ci="cropx" aria-label="Hủy">${ciIc('x')}</button><div class="ci-brand"><b>COLENTIS</b><small>CĂN ẢNH 1:1</small></div><span style="width:40px"></span></div>
  <div class="ci-cropbox" id="ciCropBox"><img id="ciCropImg" alt="" src="${url}"><div class="ci-cframe"></div></div>
  <div class="ci-tools"><button class="ci-ibtn" data-ci="rot" aria-label="Xoay 90 độ">${ciIc('rot')}</button><input type="range" id="ciZm" min="1" max="3" step="0.01" value="1" aria-label="Phóng to"><button class="ci-ibtn" data-ci="rst" aria-label="Đặt lại">${ciIc('sq')}</button></div>
  <div class="ci-crow"><button class="ci-btn ghost" data-ci="another">Chọn ảnh khác</button><button class="ci-btn" data-ci="usecrop">Dùng ảnh này</button></div>`;
  $('#ciCam').classList.remove('on');$('#ciCrop').classList.add('on');
  requestAnimationFrame(()=>{ciCropCenter();ciCropBind()});
  CR.url=url};
 im.onerror=()=>{URL.revokeObjectURL(url);toast('Không đọc được ảnh này')};im.src=url}
function ciCropBind(){const bx=$('#ciCropBox');let d=null;
 bx.onpointerdown=e=>{d={x:e.clientX,y:e.clientY,ox:CR.x,oy:CR.y};bx.setPointerCapture(e.pointerId)};
 bx.onpointermove=e=>{if(!d)return;CR.x=d.ox+e.clientX-d.x;CR.y=d.oy+e.clientY-d.y;ciCropApply()};
 bx.onpointerup=bx.onpointercancel=()=>{d=null}}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='ciZm'){const B=ciBox(),old=CR.base*CR.s,cx=(B/2-CR.x)/old,cy=(B/2-CR.y)/old;CR.s=+e.target.value;const n=CR.base*CR.s;CR.x=B/2-cx*n;CR.y=B/2-cy*n;ciCropApply()}});
document.addEventListener('change',e=>{if(e.target&&e.target.id==='ciFile'){const f=e.target.files&&e.target.files[0];e.target.value='';if(f)ciOpenCrop(f)}});
function ciCropEnd(){if(CR.url){URL.revokeObjectURL(CR.url);CR.url=null}CR.img=null}
function ciCropUse(){if(!CR.img)return;const B=ciBox(),sc=CR.base*CR.s,out=1080,cv=document.createElement('canvas');cv.width=cv.height=out;const c=cv.getContext('2d'),k=out/B;
 c.fillStyle='#000';c.fillRect(0,0,out,out);c.save();c.scale(k,k);c.translate(CR.x,CR.y);c.scale(sc,sc);c.translate(CR.rot%180?CR.h/2:CR.w/2,CR.rot%180?CR.w/2:CR.h/2);c.rotate(CR.rot*Math.PI/180);c.translate(-CR.w/2,-CR.h/2);c.drawImage(CR.img,0,0,CR.w,CR.h);c.restore();
 cv.toBlob(b=>{if(!b){toast('Chưa cắt được ảnh');return}CI.blob=b;CI.src='upload';ciUrl(b);ciCropEnd();$('#ciCrop').classList.remove('on');$('#ciCam').classList.add('on');ciSetPrev(true,CI.url);toast('Đã căn vuông. Bấm gửi để đóng dấu Colentis')},'image/jpeg',.9)}
/* ----- bấm nút ----- */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ci]');if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.ci;
 switch(a){
 case 'cam':ciOpenCam(b.dataset.id);break;
 case 'close':ciCloseCam();break;
 case 'flash':CI.flash=!CI.flash;b.setAttribute('aria-pressed',CI.flash);b.classList.toggle('fl-on',CI.flash);ciTorch(CI.flash);break;
 case 'zoom':CI.zoom=+b.dataset.z;$$('#ciZoom button').forEach(x=>x.classList.toggle('on',x===b));ciVidFx();break;
 case 'side':case 'flip':{const n=a==='side'?b.dataset.c:(CI.side==='back'?'front':'back');if(n!==CI.side){CI.side=n;ciSide();ciStart()}break}
 case 'shot':ciSnap();break;
 case 'retake':ciSetPrev(false);ciStart();break;
 case 'retry':ciStart();break;
 case 'send':ciSend();break;
 case 'gal':if(ME.admin)$('#ciFile').click();break;
 case 'cropx':ciCropEnd();$('#ciCrop').classList.remove('on');$('#ciCam').classList.add('on');ciStart();break;
 case 'another':$('#ciFile').click();break;
 case 'rot':CR.rot=(CR.rot+90)%360;CR.s=1;$('#ciZm').value=1;ciCropCenter();break;
 case 'rst':CR.rot=0;CR.s=1;$('#ciZm').value=1;ciCropCenter();break;
 case 'usecrop':ciCropUse();break;
 case 'done':{const id=CI.tid;$('#ciDone').classList.remove('on');ciGoNote(id);break}
 case 'tab':COLTAB=b.dataset.t;if(COLTAB==='photos'&&!CKM)CKM=[TODAY.y,TODAY.m];renderCol();$('#col').scrollTop=0;break;
 case 'mprev':case 'mnext':{let [y,m]=CKM;m+=a==='mnext'?1:-1;if(m<0){m=11;y--}if(m>11){m=0;y++}CKM=[y,m];ciRenderPhotos();break}
 case 'pview':ciOpenViewer(+b.dataset.i);break;
 case 'vx':closePage('pgPhoto');break;
 case 'vprev':ciOpenViewer(CKI-1);break;
 case 'vnext':ciOpenViewer(CKI+1);break;
 case 'vgo':{const p=CKV[CKI];if(!p)break;closePage('pgPhoto');const [y,m]=p.day.split('-').map(Number);
  API.ensureMonth(y,m-1).catch(()=>{}).then(()=>{NOTEOPEN.add(p.task_id);go('cal');openDayIso(p.day);setTimeout(()=>{const el=document.querySelector(`.t[data-id="${p.task_id}"]`);if(el)el.scrollIntoView({behavior:'smooth',block:'center'})},350)});break}
 }},true);
document.addEventListener('visibilitychange',()=>{if(!CI.open||CI.prev)return;if(document.hidden)ciStop();else if(!$('#ciCrop.on'))ciStart()});
/* ----- Bộ sưu tập: tab "Ảnh của bản thân" ----- */
function ciColSeg(){return `<div class="seg ci-seg"><button class="${COLTAB==='cards'?'on':''}" data-ci="tab" data-t="cards">Thẻ</button><button class="${COLTAB==='photos'?'on':''}" data-ci="tab" data-t="photos">Ảnh của bản thân</button></div>`}
function ciRenderPhotos(){
 if(!S.ckLoaded){S.ckLoaded=1;S.ck=S.ck||[];S.ckBusy=1;API.myCheckins().then(r=>{S.ck=r||[];S.ckBusy=0;if(COLTAB==='photos'&&S.tab==='col')ciRenderPhotos()}).catch(e=>{S.ckLoaded=0;S.ckBusy=0;if(!API.online())toast('Cần có mạng để tải ảnh')})}
 const all=(S.ck||[]).map(r=>({...r,P:ciP(r.taken_at)})),[y,m]=CKM||[TODAY.y,TODAY.m],ym=`${y}-${pad(m+1)}`;
 const list=all.filter(r=>r.P.key.slice(0,7)===ym);CKV=list;
 const days=new Set(all.map(r=>r.P.key));let streak=0;{let d=new Date(Date.UTC(TODAY.y,TODAY.m,TODAY.d));if(!days.has(d.toISOString().slice(0,10)))d=new Date(d.getTime()-864e5);while(days.has(d.toISOString().slice(0,10))){streak++;d=new Date(d.getTime()-864e5)}}
 const gal=list.length?list.map((r,i)=>`<button class="ci-pc" data-ci="pview" data-i="${i}"><span class="ci-sq">${ciPh(r.path,r.taken_at)}<em>${r.P.short}</em></span><b>${CIDOW[r.P.dow]}, ${r.P.short}</b><small class="t">${esc(r.title)}</small></button>`).join('')
  :`<div class="empty" style="grid-column:1/-1;padding:30px 12px"><div class="ei">${ic('image')}</div>${S.ckBusy?'Đang tải ảnh…':all.length?'Tháng này chưa có ảnh check in.':'Chưa có ảnh check in nào. Bấm biểu tượng máy ảnh cạnh một việc để chụp.'}</div>`;
 $('#col').innerHTML=`<div class="head"><div><small>Bộ sưu tập của bạn</small><h1>Ảnh của bản thân</h1></div><div class="hact"><button class="ibtn" data-act="mail" aria-label="Hòm thư">${ic('mail')}</button></div></div>${ciColSeg()}
 <div class="ci-stat"><div><b>${all.length}</b><small>Ảnh check in</small></div><div><b>${list.length}</b><small>Trong tháng này</small></div><div><b>${streak}</b><small>Ngày liên tiếp</small></div></div>
 <div class="ci-month"><button data-ci="mprev" aria-label="Tháng trước">${ciIc('left',16)}</button><span>Tháng ${m+1}/${y}</span><button data-ci="mnext" aria-label="Tháng sau">${ciIc('right',16)}</button></div>
 <div class="ci-gal">${gal}</div><div style="height:90px"></div>`}
function ciOpenViewer(i){if(!CKV.length)return;CKI=(i+CKV.length)%CKV.length;const r=CKV[CKI];
 openPage('pgPhoto',`<button class="ci-ibtn ci-vx" data-ci="vx" aria-label="Đóng">${ciIc('x')}</button><div class="ci-vwrap"><div class="ci-sq">${ciPh(r.path,r.taken_at)}</div>
 <div class="ci-vinfo"><div class="d">${r.P.full} · ${r.P.time}</div><h2>${esc(r.title)}</h2><span class="ci-pill">${ciIc('cal',14)}${esc(r.calendar||'')}</span></div>
 <div class="ci-vnav"><button class="ci-ibtn" data-ci="vprev" aria-label="Ảnh trước">${ciIc('left')}</button><button class="ci-btn ghost" data-ci="vgo">Xem trong ghi chú</button><button class="ci-ibtn" data-ci="vnext" aria-label="Ảnh sau">${ciIc('right')}</button></div></div>`)}
