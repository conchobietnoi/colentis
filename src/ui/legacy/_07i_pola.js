/* ===== POLA DAY (04–08/11/2026): banner + việc ở Lịch, trang sự kiện (dây phơi 8 pola/ngày), máy ảnh rửa ảnh,
   sticker mỗi ngày, 40/40 → frame Thợ chụp pola + 4 hộp phim (mỗi hộp 5 thẻ). Server: migration 027 (pola_state, pola_develop).
   Ảnh ở bucket riêng `pola` (<id>.webp), chỉ đọc được tấm đã rửa. Mockup đã duyệt: scratchpad pd/poladay.html ===== */
const PLM={martin:'Martin',seonghyeon:'Seonghyeon',james:'James',keonho:'Keonho',juhoon:'Juhoon'};
const PLWD=['Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ nhật'];
const PLSTN=['Máy ảnh','Cuộn phim','Đèn flash','Ống kính','Xấp pola'];
const PLSTK=[
'<svg viewBox="0 0 100 100"><rect x="10" y="26" width="80" height="56" rx="12" fill="#fff"/><rect x="14" y="30" width="72" height="48" rx="9" fill="#2a1236"/><rect x="30" y="18" width="26" height="14" rx="4" fill="#fff"/><circle cx="50" cy="54" r="17" fill="#fff"/><circle cx="50" cy="54" r="13" fill="#16d6c5"/><circle cx="50" cy="54" r="6" fill="#06030c"/><circle cx="74" cy="40" r="4" fill="#ffe45e"/></svg>',
'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fff"/><rect x="26" y="22" width="34" height="56" rx="6" fill="#ffb02e"/><rect x="30" y="16" width="26" height="8" rx="2" fill="#2a1236"/><rect x="58" y="34" width="22" height="32" fill="#2a1236"/><rect x="62" y="38" width="5" height="5" fill="#ffe45e"/><rect x="62" y="47" width="5" height="5" fill="#ffe45e"/><rect x="62" y="56" width="5" height="5" fill="#ffe45e"/><text x="43" y="56" text-anchor="middle" font-size="11" font-weight="900" fill="#2a1236">400</text></svg>',
'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fff"/><path d="M56 12 L28 56 H48 L42 88 L74 40 H54 Z" fill="#ffe45e" stroke="#2a1236" stroke-width="4" stroke-linejoin="round"/></svg>',
'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#fff"/><circle cx="50" cy="50" r="36" fill="#1b1430"/><circle cx="50" cy="50" r="28" fill="#7b2cff"/><circle cx="50" cy="50" r="22" fill="#16d6c5"/><circle cx="50" cy="50" r="16" fill="#06030c"/><ellipse cx="42" cy="40" rx="6" ry="3.5" fill="#fff" opacity=".8"/></svg>',
'<svg viewBox="0 0 100 100"><rect x="18" y="22" width="44" height="54" rx="3" fill="#fff" stroke="#2a1236" stroke-width="3" transform="rotate(-12 40 49)"/><rect x="36" y="18" width="46" height="58" rx="3" fill="#fff" stroke="#2a1236" stroke-width="3" transform="rotate(8 59 47)"/><rect x="41" y="23" width="36" height="34" fill="#ff8fc8" transform="rotate(8 59 47)"/><circle cx="64" cy="36" r="6" fill="#ffe45e"/></svg>'];
const PL={view:1,busy:false};
const plS=()=>S.pola;
const plIso=d=>{const x=new Date(Date.UTC(2026,10,3+d));return x.toISOString().slice(0,10)};
const plToday=()=>(plS()&&plS().today)||TODAY.iso;
const plOn=()=>!!plS()&&plToday()>=plS().start&&plToday()<=plS().end;
const plCurDay=()=>{const t=plToday();for(let d=5;d>=1;d--)if(t>=plIso(d))return d;return 1};
const plItems=d=>(plS().items||[]).filter(i=>i.day===d);
const plDevN=d=>plItems(d).filter(i=>i.dev).length;
const plTotal=()=>(plS().items||[]).filter(i=>i.dev).length;
const plImg=(id,cls='')=>`<img class="${cls}" src="${API.imgNow('pola',id+'.webp')}" data-pi="pola|${id}.webp|" alt="">`;
async function plRefresh(){try{S.pola=await API.polaState()}catch(e){}}
/* ---------- Lịch: banner + việc hôm nay ---------- */
function plCalHTML(){if(!plOn())return '';const d=plCurDay(),n=plDevN(d),its=plItems(d);
 const ban=`<button class="plb" data-pl="open"><span class="plb-rope"></span>${its.slice(0,5).map((it,k)=>`<span class="plb-hp" style="left:${[47,58,69,80,91][k]}%;top:${[30,36,40,36,30][k]}px;rotate:${[-7,4,-3,6,-5][k]}deg;animation-delay:-${k*.7}s"><i class="plb-c"></i><span class="plb-p"><span class="plb-w">${it.dev?plImg(it.id):'?'}</span></span></span>`).join('')}
 <span class="plb-tx"><small>SỰ KIỆN · NGÀY ${d}/5</small><b>P<i class="plO"><i></i></i>LA<br>DAY</b><em>${n<8?`${8-n} tấm đang chờ rửa`:'Đã rửa đủ 8 tấm hôm nay'}</em></span>
 <span class="plb-led">'26 11 ${String(3+d).padStart(2,'0')}</span>
 <span class="plb-film"><span class="plb-strip">${its.map(i=>`<i class="${i.dev?'on':''}"></i>`).join('')}</span><span class="plb-cta">${n<8?'Rửa ảnh ›':plTotal()+'/40 ›'}</span></span></button>`;
 const ord=[...its.filter(i=>i.done&&!i.dev),...its.filter(i=>!i.done),...its.filter(i=>i.dev)],show=PL.exp?ord:ord.slice(0,3);
 const rows=show.map(it=>`<button class="plt ${it.dev?'plt-dv':it.done?'plt-rd':''}" data-pl="${it.dev?'view':it.done?'dev':'task'}" data-d="${it.day}" data-s="${it.slot}"><span class="plt-k">${it.dev?ic('check'):it.done?'📸':it.slot}</span><span class="plt-t">${esc(it.label)}<small>${it.dev?'Đã rửa · '+esc(PLM[it.member]||''):it.done?'Xong việc · bấm để rửa ảnh':'Mặt sau tấm pola số '+it.slot}</small></span></button>`).join('');
 return `${ban}<div class="card-b plts"><h2>Việc POLA DAY · ${PLWD[d-1]} ${3+d}/11 <em>${its.filter(i=>i.done).length}/8</em></h2><div class="sub" style="margin:-4px 0 8px">Làm trên lịch như bình thường, app tự kiểm tra. Xong việc nào thì tấm pola đó rửa được.</div>${rows}<button class="plt-more" data-pl="exp">${PL.exp?'Thu gọn':'Xem cả 8 việc'} <span style="display:inline-flex;${PL.exp?'transform:rotate(180deg)':''}">${ic('down')}</span></button></div>`}
/* ---------- trang sự kiện ---------- */
function plOpen(day){if(!plS())return;PL.view=day||plCurDay();let pg=document.getElementById('plPg');if(!pg){pg=document.createElement('div');pg.id='plPg';pg.className='pl-pg';document.body.appendChild(pg)}plRender();pg.classList.add('on');pg.scrollTop=0}
function plClose(){const pg=document.getElementById('plPg');if(pg)pg.classList.remove('on');renderAll()}
function plRender(){const pg=document.getElementById('plPg');if(!pg||!plS())return;const d=PL.view,cur=plCurDay(),n=plDevN(d),tot=plTotal(),rw=plS().rewards||{};
 const ended=plToday()>plS().end;
 pg.innerHTML=`<div class="pl-top"><button class="pl-ib" data-pl="close" aria-label="Quay lại">${ic('left')}</button><h1>P<i class="plO"><i></i></i>LA DAY</h1><span class="pl-pill">${tot}/40</span></div>
 <div class="pl-days">${[1,2,3,4,5].map(k=>{const lk=plToday()<plIso(k),full=plDevN(k)===8;return `<button class="${k===d?'on':''} ${lk?'lock':''} ${full?'full':''}" data-pl="day" data-d="${k}"><b>Ngày ${k}</b>${3+k}/11<span>${lk?'🔒':full?'đủ 8':k<cur?'rửa bù':plDevN(k)+'/8'}</span></button>`}).join('')}</div>
 <div class="pl-prog"><div><i style="width:${n/8*100}%"></i></div><span>${n}/8 tấm · ${PLWD[d-1]} ${3+d}/11</span></div>
 <div class="pl-room"><div class="pl-line">${plItems(d).map(it=>{const i=it.slot-1,rd=it.done&&!it.dev;return `<button class="pl-pz ${rd?'ready':''}" data-pl="${it.dev?'view':rd?'dev':'task'}" data-d="${d}" data-s="${it.slot}" style="--r:${[-6,4,-3,7,-5,3,-7,5][i]}deg;left:${[3,27,51,75][i%4]}%;top:${i<4?34:156}px;animation-delay:-${i*.6}s"><i class="pl-clip"></i><span class="pl-card">${it.dev?`<span class="pl-front">${plImg(it.id)}</span>`:`<span class="pl-back"><em>${esc(it.label)}</em><small>${rd?'XONG · RỬA ĐƯỢC':'CHƯA XONG'}</small></span>`}</span>${it.dev?`<span class="pl-nm">${esc(PLM[it.member]||'')}</span>`:''}</button>`}).join('')}</div>
 <div class="pl-leg"><span><i style="background:#efe6d6"></i>Úp mặt: việc chưa xong</span><span><i style="background:#ffe45e"></i>Rửa được</span><span><i style="background:#ff8fc8"></i>Đã rửa</span></div></div>
 ${ended?'<div class="pl-box"><h3>Sự kiện đã kết thúc</h3><p>Ảnh đã rửa vẫn nằm trong bộ sưu tập thẻ.</p></div>':''}
 <div class="pl-box"><h3>Sticker mỗi ngày</h3><p>Rửa đủ 8 tấm trong một ngày để nhận sticker của ngày đó.</p><div class="pl-stk">${PLSTK.map((s,k)=>`<div class="${rw['sticker-'+(k+1)]?'got':''}" title="${PLSTN[k]}">${rw['sticker-'+(k+1)]?s:'<b>'+(k+1)+'</b>'}</div>`).join('')}</div></div>
 <div class="pl-box" style="margin-bottom:28px"><h3>Rửa đủ 40 tấm</h3><p>${rw.final?'Đã mở khóa danh hiệu Thợ chụp pola và nhận 4 hộp phim.':'Một danh hiệu bí mật và 4 hộp phim (mỗi hộp 5 thẻ) đang chờ. Còn '+(40-tot)+' tấm.'}</p></div>`}
function plFind(d,s){return (plS().items||[]).find(i=>i.day===d&&i.slot===s)}
function plTaskSheet(it){openSheet(`<div class="pl-sh"><div class="pl-big"><span class="pl-card"><span class="pl-back"><em>${esc(it.label)}</em><small>${it.open?'CHƯA XONG':'MỞ NGÀY '+(3+it.day)+'/11'}</small></span></span></div><h2>Mặt sau ghi gì?</h2><p class="sub">${it.open?'Làm xong việc này trên lịch thì tấm pola rửa được. App tự biết khi bạn làm xong.':'Tấm này mở vào '+PLWD[it.day-1]+' '+(3+it.day)+'/11.'}</p><button class="big" data-pl="gocal">Mở Lịch</button><button class="big gh" data-x="cfno">Đóng</button></div>`,'pl-sheet')}
function plViewSheet(it){openSheet(`<div class="pl-sh"><div class="pl-big"><span class="pl-card"><span class="pl-front">${plImg(it.id)}</span></span></div><h2>${esc(PLM[it.member]||'')}</h2><p class="sub">POLA DAY 2026 · ${esc(it.label)}</p><button class="big gh" data-x="cfno">Đóng</button></div>`,'pl-sheet')}
/* ---------- máy ảnh rửa ảnh ---------- */
function plCamera(it){if(PL.busy)return;if(!API.online()){toast('Cần có mạng để rửa ảnh');return}
 const o=document.createElement('div');o.className='pl-cam';document.body.appendChild(o);
 o.innerHTML=`<small class="pl-ck">RỬA ẢNH · TẤM ${it.slot}/8 · NGÀY ${it.day}</small><div class="k-cam" id="plCamB"><div class="k-body"><div class="k-plate"></div><div class="k-vf"></div><div class="k-led"></div><div class="k-fl"></div><div class="k-stripe"></div><img class="k-logo" src="${LOGO}" alt=""><div class="k-lens"></div><div class="k-lcd">${String(plTotal()+1).padStart(2,'0')}</div><div class="k-brand">COLENTIS</div></div><div class="k-shb"></div><div class="k-slot"></div><div class="k-fx"></div><div class="k-out"><div class="k-ej"><span class="pl-front" id="plEjF"></span><span class="pl-dev"><i></i></span></div></div></div>
 <div class="pl-camsp"></div><button class="pl-shoot" aria-label="Chụp"></button><div class="pl-cap" id="plCap">Bấm nút chụp để rửa tấm này</div><button class="pl-x" aria-label="Đóng">${ic('x')}</button>`;
 const close=()=>{o.remove();PL.busy=false};
 o.querySelector('.pl-x').onclick=close;
 o.querySelector('.pl-shoot').onclick=async()=>{if(PL.busy)return;PL.busy=true;o.querySelector('.pl-x').style.display='none';o.querySelector('.pl-shoot').style.visibility='hidden';
  const cam=o.querySelector('#plCamB'),cap=o.querySelector('#plCap');cam.classList.add('k-press');if(S.haptic!==false&&navigator.vibrate)try{navigator.vibrate(25)}catch(e){}
  cap.textContent='Đang nhả ảnh…';
  let r;try{r=await API.polaDevelop(it.day,it.slot)}catch(e){close();const c=e&&e.app&&e.app.code||'';toast(/NOT_DONE/.test(c+'')||/NOT_DONE/.test(JSON.stringify(e))?'Việc ở mặt sau chưa xong':/LOCKED/.test(JSON.stringify(e))?'Tấm này chưa tới ngày mở':/ENDED/.test(JSON.stringify(e))?'POLA DAY đã kết thúc':failMsg(e));return}
  let url='';try{url=await API.loadImg('pola',r.id+'.webp',null)}catch(e){}
  o.querySelector('#plEjF').innerHTML=url?`<img src="${url}" alt="">`:'<span class="pl-miss">Ảnh đang được tải lên, xem lại sau nhé</span>';
  setTimeout(()=>{cam.classList.remove('k-press');cam.classList.add('k-shot')},250);
  setTimeout(()=>{o.querySelector('.pl-dev').classList.add('go');cap.textContent='Ảnh đang hiện dần…'},1900);
  setTimeout(async()=>{cap.innerHTML=`<b>Là ${esc(PLM[r.member]||'')}!</b>Đã vào bộ sưu tập thẻ · ${r.total}/40`;
   const b=document.createElement('button');b.className='pl-btn';b.textContent='Tiếp tục';o.appendChild(b);
   await plRefresh();
   b.onclick=()=>{close();plRender();renderAll();if(r.sticker)plStickerOv(r.day,()=>{if(r.final)plFinal(r.final)});else if(r.final)plFinal(r.final)}},4800)}}
function plOv(html){const o=document.createElement('div');o.className='pl-ov';o.innerHTML=html;document.body.appendChild(o);return o}
function plStickerOv(d,done){const o=plOv(`<small>NGÀY ${d} · ĐỦ 8 TẤM</small><div class="pl-stk1">${PLSTK[d-1]}</div><h2>Sticker ${PLSTN[d-1]}</h2><p>Đã dán vào bộ sticker POLA DAY.</p><button class="pl-btn">Nhận</button>`);
 o.querySelector('.pl-btn').onclick=()=>{o.remove();plRender();done&&done()}}
/* ---------- 40/40: frame + 4 hộp phim ---------- */
function plFinal(fin){titleSeen('pola-day');const o=plOv(`<div class="pl-flash"></div><small>40 / 40 · ĐÃ RỬA XONG</small><div class="pl-fr"><div class="pl-fav">${avatar(ME,240,'pola-day')}</div><div class="pl-iris"></div><div class="pl-ring"></div>${Array.from({length:10},(_,k)=>`<i class="pl-cf" style="--a:${k*36}deg;--d:${(k%3)*.08}s"></i>`).join('')}</div><div class="pl-ftf">${titleFrame('pola-day',null,56)}</div>
 <div class="pl-late"><h2>Thợ chụp pola</h2><p>Danh hiệu mới và khung ống kính biết chớp flash.</p><button class="pl-btn" data-e>Đeo ngay</button><button class="pl-btn gh" data-l>Để sau</button></div>`);
 const go=()=>{o.remove();plPacks(fin.grants||[],0)};
 o.querySelector('[data-l]').onclick=go;
 o.querySelector('[data-e]').onclick=async e=>{e.currentTarget.disabled=true;try{await API.equip('pola-day');S.equip='pola-day';ME.frame='pola-day';toast('Đã đeo Thợ chụp pola')}catch(er){apiFail(er)}go()}}
function plPacks(gr,k){const P=[1,2,3,4].map(p=>gr.filter(g=>g.pack===p).map(g=>CBY[g.card_id]).filter(Boolean));if(!P[k]||!P[k].length){plPackSum(P);return}
 const o=plOv(`<small>QUÀ 40/40 · HỘP PHIM ${k+1}/4</small><div class="pl-dots">${[0,1,2,3].map(j=>`<i class="${j<k?'d':j===k?'c':''}"></i>`).join('')}</div><button class="pl-cart"><span class="k-bx"><span class="k-win"></span><span class="k-lb">POLA FILM<small>5 THẺ · EXP ${k+1}</small></span></span><span class="k-sl"></span></button><div class="pl-ejs"></div><p class="pl-h">Chạm hộp phim để nhả thẻ</p>`);
 const cart=o.querySelector('.pl-cart'),ej=o.querySelector('.pl-ejs'),h=o.querySelector('.pl-h');
 cart.onclick=()=>{if(cart.dataset.done)return;cart.dataset.done=1;cart.classList.add('shk');if(S.haptic!==false&&navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
  ej.innerHTML=P[k].map((c,j)=>`<button class="pl-ec" data-j="${j}"><span class="ci"><span class="b"><img src="${LOGO}" alt=""></span><span class="f">${cardHTML(c,{w:c.land?120:88,thumb:1})}</span></span></button>`).join('');
  const pos=[[-118,30,-12],[-60,10,-6],[0,0,0],[60,10,6],[118,30,12]];let fl=0;
  [...ej.children].forEach((e,j)=>{setTimeout(()=>{e.style.opacity=1;e.style.transform=`translate(${pos[j][0]}px,${pos[j][1]}px) rotate(${pos[j][2]}deg)`},420+j*170);
   e.onclick=()=>{if(e.classList.contains('k-up'))return;e.classList.add('k-up');fl++;const r=P[k][j].r;if(r==='legend'||r==='supreme')toast(r==='supreme'?'BÁ KHÍ!':'HUYỀN THOẠI!');
    if(fl===P[k].length){h.outerHTML=`<button class="pl-btn" data-n>${k<3?'Hộp phim tiếp theo':'Xem 20 thẻ'}</button>`;o.querySelector('[data-n]').onclick=()=>{o.remove();if(k<3)plPacks(gr,k+1);else plPackSum(P)}}}});
  setTimeout(()=>{h.textContent='Chạm từng thẻ để lật'},1300)}}
function plPackSum(P){const all=P.flat(),c={};all.forEach(x=>c[x.r]=(c[x.r]||0)+1);
 const o=plOv(`<small>QUÀ 40/40</small><h2>${all.length} thẻ mới</h2><div class="pl-sg">${all.map(x=>`<i>${cardHTML(x,{w:52,thumb:1})}</i>`).join('')}</div><p>${['supreme','legend','rare','common'].filter(r=>c[r]).map(r=>NAME[r]+' ×'+c[r]).join(' · ')}</p><button class="pl-btn">Xong</button>`);
 o.querySelector('.pl-btn').onclick=async()=>{o.remove();await API.reload();renderAll();plRender()}}
/* ---------- bộ sưu tập: nhóm Sự kiện ---------- */
function plColHTML(){if(!plS())return '';const its=plS().items||[],tot=plTotal();if(!plOn()&&!tot)return '';
 const mem=['martin','seonghyeon','james','keonho','juhoon'],got=its.filter(i=>i.dev);
 return `<div class="sec"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,#ff6a78,#ffe45e,#7b2cff)"></i>POLA DAY 2026</span><small>${tot}/40 · Sự kiện</small></div>
 ${mem.map(m=>{const l=got.filter(i=>i.member===m).sort((a,b)=>a.id<b.id?-1:1);return `<div class="pl-cm"><h4>${PLM[m]}<small>${l.length}/8</small></h4><div class="pl-cg">${l.map(i=>`<button data-pl="cview" data-d="${i.day}" data-s="${i.slot}">${plImg(i.id)}<b>POLA</b></button>`).join('')}${Array.from({length:8-l.length},()=>'<span>?</span>').join('')}</div></div>`}).join('')}`}
/* ---------- sự kiện click ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-pl]');if(!t)return;const a=t.dataset.pl,d=+t.dataset.d,s=+t.dataset.s;
 if(a==='exp'){PL.exp=!PL.exp;renderCal();return}
 if(a==='open')plOpen();else if(a==='close')plClose();else if(a==='day'){if(plToday()<plIso(d)){toast('Mở vào '+PLWD[d-1]+' '+(3+d)+'/11');return}PL.view=d;plRender()}
 else if(a==='gocal'){closeSheet();plClose();go('cal')}
 else{const it=plFind(d,s);if(!it)return;if(a==='dev')plCamera(it);else if(a==='view'||a==='cview')plViewSheet(it);else plTaskSheet(it)}});
