/* ===== Sự kiện Khai Mạc (15–16/10/2026): 5 mốc quà + quà tổng chọn 1 pack ===== */
const KM_MEM=[['james','James'],['juhoon','Juhoon'],['keonho','Keonho'],['martin','Martin'],['seonghyeon','Seonghyeon']];
const KM_COL={james:['#FF6FB5','#47E58D'],juhoon:['#59B0FF','#BFE0FF'],keonho:['#34D98A','#FFE680'],martin:['#FF9F1C','#FF6B57'],seonghyeon:['#A878FF','#E4D4FF']};
const KM_NAME={james:'James',juhoon:'Juhoon',keonho:'Keonho',martin:'Martin',seonghyeon:'Seonghyeon'};
const kmT=m=>{const t=TMAP['limited-'+m];return t?t.name:''};
function kmOn(){return !!(S.km&&S.km.active)}
function kmBanner(){if(!kmOn())return '';const k=S.km,n=k.claimed.length,rd=Math.max(0,k.done-n);
 const sub=n>=5?(k.pack?'Bạn đã nhận đủ quà. Cảm ơn nhé!':'Đủ 5 mốc! Chọn 1 pack quà tổng'):rd>0?`Có ${rd} quà đang chờ bạn mở`:`Hoàn thành ${n+1} task để mở mốc kế tiếp`;
 return `<button class="banner km" data-km="open"><span class="bi">${ic('gift')}</span><span><b>Sự kiện Khai Mạc · ${n}/5 mốc</b><small>${sub}</small></span></button>`}
function kmClaimed(i){return S.km&&S.km.claimed.find(c=>c.milestone===i)}
function kmPage(){const k=S.km;if(!k)return;const n=k.claimed.length,pct=Math.min(100,k.done/5*100);
 const rows=[1,2,3,4,5].map(i=>{const c=kmClaimed(i),can=!c&&k.done>=i&&k.active;
  if(c){const m=c.member;return `<div class="kmr got" style="--kc:${KM_COL[m][0]}"><div class="kmv">${avatar(ME,76,'limited-'+m)}</div><div class="kmx"><small>Mốc ${i} · đã mở</small><b>${kmT(m)}</b><span>${KM_NAME[m]} · Limited</span></div><button class="kmth" data-act="view" data-cid="khaimac-${m}">${cardHTML(CBY['khaimac-'+m],{w:70,thumb:1})}</button></div>`}
  return `<div class="kmr ${can?'can':'lk'}"><div class="kmv q"><i>?</i></div><div class="kmx"><small>Mốc ${i}</small><b class="blur">? ? ? ? ?</b><span>${can?'Sẵn sàng để mở':`Hoàn thành ${i} task`}</span></div>${can?`<button class="kmgo" data-km="gift" data-i="${i}">${ic('gift')} Mở quà</button>`:`<span class="kmn">${Math.min(k.done,i)}/${i}</span>`}</div>`}).join('');
 let prize;
 if(k.pack){prize=`<div class="kmprz got"><small>Quà tổng đã nhận</small><div style="display:flex;justify-content:center;margin-top:8px">${cardHTML(CBY['khaimac-1y-'+k.pack],{w:150})}</div></div>`}
 else if(n>=5){prize=`<div class="kmprz can"><small>Quà tổng</small><b>Chọn 1 trong 5 pack Tag 1Y</b><p>Mỗi pack là một thẻ tag ảnh kỉ niệm 1 năm debut. Chỉ chọn được 1 pack.</p><button class="kmgo big" data-km="packs">${ic('gift')} Chọn pack</button></div>`}
 else{prize=`<div class="kmprz lk"><small>Quà tổng</small><b>Mở đủ 5 mốc để chọn 1 pack Tag 1Y</b><div class="kmpk">${[0,1,2,3,4].map(()=>'<i></i>').join('')}</div></div>`}
 openPage('pgKM',`<div class="ptop"><button class="ibtn" data-act="back" data-p="pgKM" aria-label="Quay lại">${ic('left')}</button><h1>Khai Mạc</h1></div>
 <div class="pbody"><div class="kmhero"><small>15–16/10/2026 · Sự kiện chào mừng</small><h2>${k.done}/5 task</h2><div class="kmbar"><i style="width:${pct}%"></i></div><p>Mỗi task hoàn thành mở một mốc. Việc chưa xong hôm nay được cộng dồn sang 16/10. Thứ tự thành viên là bí mật, mỗi người một khác.</p></div>
 <div class="kmlist">${rows}</div>${prize}</div>`)}
function kmFx(inner,cols,cb){let o=$('#kmfx');if(o)o.remove();o=document.createElement('div');o.id='kmfx';o.className='kmfx';o.innerHTML=`<div class="kmbg"></div><div class="kmcf" id="kmcf"></div><div class="kmst" id="kmst">${inner}</div>`;$('#app').appendChild(o);
 const cf=$('#kmcf');for(let i=0;i<50;i++){const c=document.createElement('i');c.style.cssText=`left:${R(0,100)}%;background:${pickOne(cols)};--d:${R(2.4,4.4)}s;--l:${R(0,1.2)}s;--x:${R(-70,70)}px;--r:${R(200,720)}deg;width:${R(6,11)}px;height:${R(9,16)}px`;cf.appendChild(c)}
 requestAnimationFrame(()=>o.classList.add('on'));return o}
function kmClose(){const o=$('#kmfx');if(o){o.classList.remove('on');setTimeout(()=>o.remove(),300)}}
function kmGiftBox(col,label){return `<div class="kmbox" id="kmbox" style="--kc:${col}"><div class="lid"></div><div class="bdy"></div><div class="rib"></div><div class="glow"></div></div><p class="kmhint" id="kmhint">${label}</p>`}
function kmRevealPlay(box,hint,reveal,col){let done=false;const go=()=>{if(done)return;done=true;hint.style.opacity=0;vib([30,40,30]);box.classList.add('shake');
  setTimeout(()=>{box.classList.remove('shake');box.classList.add('open');$('#kmfx').classList.add('flash');vib([60,40,90]);setTimeout(()=>{reveal()},S.reduce?50:650)},S.reduce?50:850)};
 box.onclick=go}
async function kmOpenGift(i){const k=S.km;if(!API.online())return toast('Cần có mạng để mở quà');
 let res;try{res=await API.claimKhaiMac(i)}catch(e){return toast(failMsg(e))}
 const m=res.member,col=KM_COL[m];
 const o=kmFx(kmGiftBox(col[0],'Chạm để mở quà'),[col[0],col[1],'#fff','#ffd23f']);
 kmRevealPlay($('#kmbox'),$('#kmhint'),()=>{
  $('#kmst').innerHTML=`<div class="kmrv" style="--kc:${col[0]}"><small class="kmk">MỐC ${i}/5 · LIMITED</small><div class="kmrav">${avatar(ME,190,'limited-'+m)}</div><div class="kmrt">${titleFrame('limited-'+m,kmT(m),64)}</div><p class="kmrn">Danh hiệu <b>${kmT(m)}</b> · ${KM_NAME[m]}</p><div class="kmrc">${cardHTML(CBY['khaimac-'+m],{w:250})}</div><span class="badge ${res.is_new===false?'dup':'nw'}">${res.is_new===false?'Bạn đã có thẻ này':ic('spark')+' THẺ MỚI'}</span><button class="igo kmok" id="kmok">Tuyệt vời</button></div>`;
  $('#kmok').onclick=async()=>{kmClose();try{await API.reload('lite')}catch(e){}try{lsSet('titles:'+ME.uid,[...S.unlocked])}catch(e){}renderAll();kmPage()}},col[0]);
 try{await API.reload('lite')}catch(e){}}
function kmPacks(){const k=S.km;
 openSheet(`<h3>Chọn 1 pack quà tổng</h3><p class="sub">Chỉ được chọn 1 pack và không đổi được. Mỗi pack là thẻ tag ảnh 1Y của một thành viên.</p><div class="kmpgrid">${['martin','keonho','juhoon','seonghyeon','james'].map(m=>`<button class="kmpk2" data-km="pick" data-m="${m}" style="--kc:${KM_COL[m][0]}"><i></i><b>${KM_NAME[m]}</b><small>Pack Tag 1Y</small></button>`).join('')}</div>`)}
function kmConfirm(m){openSheet(`<div class="cfm"><h3>Chọn pack ${KM_NAME[m]}?</h3><p class="sub">Bạn chỉ được nhận 1 pack, không đổi lại được.</p><div class="btnrow"><button class="btn-s" data-km="packs">Chọn lại</button><button class="igo" data-km="confirm" data-m="${m}">Xác nhận</button></div></div>`)}
async function kmOpenPack(m){if(!API.online())return toast('Cần có mạng để nhận quà');
 let res;try{res=await API.claimKhaiMacPack(m)}catch(e){return toast(failMsg(e))}
 closeSheet();
 const col=KM_COL[m];kmFx(kmGiftBox(col[0],'Chạm để mở pack'),[col[0],col[1],'#fff','#ffd23f']);
 kmRevealPlay($('#kmbox'),$('#kmhint'),()=>{
  $('#kmst').innerHTML=`<div class="kmrv" style="--kc:${col[0]}"><small class="kmk">QUÀ TỔNG · TAG 1Y</small><div class="kmrc">${cardHTML(CBY['khaimac-1y-'+m],{w:220})}</div><p class="kmrn">Tag 1Y · <b>${KM_NAME[m]}</b></p><button class="igo kmok" id="kmok">Tuyệt vời</button></div>`;
  $('#kmok').onclick=async()=>{kmClose();try{await API.reload('lite')}catch(e){}renderAll();kmPage()}},col[0]);
 try{await API.reload('lite')}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-km]');if(!b)return;e.preventDefault();
 const a=b.dataset.km;if(a==='open')kmPage();else if(a==='gift')kmOpenGift(+b.dataset.i);else if(a==='packs')kmPacks();else if(a==='pick')kmConfirm(b.dataset.m);else if(a==='confirm')kmOpenPack(b.dataset.m)});
