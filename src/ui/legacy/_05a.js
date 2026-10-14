/* ===== màn mở đầu: tải → đăng nhập/đăng ký → chọn thành viên → thư chào mừng ===== */
const PICKS=[['Juhoon','#FF8FB8','#FF5AA6'],['Keonho','#4CC9FF','#7B61FF'],['Martin','#FFB02E','#FF7A2F'],['Seonghyeon','#35D0A5','#4CC9FF'],['James','#B9A4FF','#FF8FB8']];
const INTRO={mode:'login',pick:-1,pw:false};
const WMEM=['juhoon','keonho','martin','seonghyeon','james'];
function introBase(){const el=$('#intro');
 el.innerHTML=`<div class="blobs"><i></i><i></i><i></i></div>
 <div class="ipane spl off" id="ps"><div class="lg"><div class="orb"><i></i><i></i></div><div class="mk"></div></div><h1>COLENTIS</h1><div class="tip" id="stip">Đang mở lịch nhóm...</div><div class="bar"><i id="sbar"></i></div><div class="foot">CÙNG NHAU HOÀN THÀNH, CÙNG NHAU SƯU TẦM</div></div>
 <div class="ipane aut off" id="pa"></div><div class="ipane pck off" id="pp"></div>`;return el}
function showPane(id){['ps','pa','pp'].forEach(p=>{const e=$('#'+p);if(e)e.classList.toggle('off',p!==id)})}
function runIntro(step){INTRO.tok=(INTRO.tok||0)+1;const el=$('#intro');introBase();el.classList.add('on');
 if(step==='splash'||!step){showPane('ps');splashAnim()}else if(step==='auth')authPane()}
let splashTm=[];
function splashAnim(){const tips=['Đang mở lịch nhóm...','Đang xếp thẻ vào album...','Đang kiểm tra quà trong hòm thư...','Sắp xong rồi!'],bar=$('#sbar'),tp=$('#stip');if(!bar)return;
 bar.style.transition='width 2.7s cubic-bezier(.4,.1,.3,1)';requestAnimationFrame(()=>requestAnimationFrame(()=>bar.style.width='100%'));
 splashTm.forEach(clearTimeout);splashTm=tips.map((t,i)=>setTimeout(()=>{const e=$('#stip');if(!e)return;e.style.opacity=0;setTimeout(()=>{e.textContent=t;e.style.opacity=1},180)},i*700))}
const MAILRE=/^\S+@\S+\.\S+$/;
function authPane(){const pa=$('#pa');if(!pa)return;const reg=INTRO.mode==='reg';
 const imgs=`<div class="hph" style="background-image:url(${HERO})"></div>`;
 pa.innerHTML=`<div class="hero">${imgs}<div class="brand"><b>COLENTIS</b><span>Lịch chung có thưởng, dành cho fan CORTIS</span></div></div>
 <div class="panel2"><div class="iseg ${reg?'r':''}"><i></i><button class="${reg?'':'on'}" data-im="login">Đăng nhập</button><button class="${reg?'on':''}" data-im="reg">Đăng ký</button></div>
 <form id="aform" novalidate>
  <div class="fld x ${reg?'on':''}" data-f="name">${ic('user')}<input id="fn" placeholder="Tên hiển thị" maxlength="24" autocomplete="nickname"><div class="err"></div></div>
  <div class="fld x fbd ${reg?'on':''}" data-f="bd">${ic('cake')}<span class="blab">Ngày sinh · không bắt buộc</span><input id="fb" type="date" min="1940-01-01" max="${TODAY.iso||'2100-01-01'}"><div class="err"></div></div>
  <div class="fld" data-f="email">${ic('mail')}<input id="fe" type="email" placeholder="Email" autocomplete="email" autocapitalize="off"><div class="err"></div></div>
  <div class="fld" data-f="pw">${ic('lock')}<input id="fp2" type="${INTRO.pw?'text':'password'}" placeholder="Mật khẩu (từ 6 ký tự)" autocomplete="${reg?'new-password':'current-password'}"><button type="button" class="eye" data-eye aria-label="Hiện mật khẩu">${ic(INTRO.pw?'unlock':'lock')}</button><div class="err"></div></div>
  ${reg?'':'<button type="button" class="forg" data-forg>Quên mật khẩu?</button>'}
  <button class="igo" id="agb" type="submit">${reg?'Tạo tài khoản':'Đăng nhập'} ${ic('right')}</button></form>
  ${API.googleOn?`<div class="or">hoặc</div><button class="gg" data-gg><b></b> Tiếp tục với Google</button>`:''}
  <div class="legal">Bằng việc tiếp tục, bạn đồng ý với Điều khoản và Chính sách quyền riêng tư của Colentis.</div></div>`;
 showPane('pa');
 $$('[data-im]',pa).forEach(b=>b.onclick=()=>{INTRO.mode=b.dataset.im;authPane()});
 if(reg){API.registrationOpen().then(ok=>{S.regClosed=!ok;if(!ok&&INTRO.mode==='reg'&&$('#pa'))closedPane($('#pa'))}).catch(()=>{})}
 $('[data-eye]',pa).onclick=e=>{INTRO.pw=!INTRO.pw;$('#fp2').type=INTRO.pw?'text':'password';e.currentTarget.innerHTML=ic(INTRO.pw?'unlock':'lock')};
 const f=$('#aform');const bad=(k,m)=>{const d=$(`[data-f=${k}]`,pa);d.classList.add('bad');$('.err',d).textContent=m;setTimeout(()=>d.classList.remove('bad'),400);return 1};
 $$('input',pa).forEach(i=>i.addEventListener('input',()=>{const d=i.closest('.fld');d.classList.remove('bad');$('.err',d).textContent=''}));
 const fgp=$('[data-forg]',pa);if(fgp)fgp.onclick=()=>forgotFlow(1,($('#fe').value||'').trim());
 const gg=$('[data-gg]',pa);if(gg)gg.onclick=()=>API.signInGoogle().catch(e=>toast(failMsg(e)));
 f.onsubmit=async e=>{e.preventDefault();if(!API.online())return toast('Cần có mạng để đăng nhập');
  const nm=$('#fn').value.trim(),em=$('#fe').value.trim(),pw=$('#fp2').value;let n=0;
  if(reg&&nm.length<2)n+=bad('name','Hãy nhập tên hiển thị (ít nhất 2 ký tự)');
  if(reg){const br=bdCheck($('#fb').value);if(!br.ok)n+=bad('bd',br.msg)}
  if(!MAILRE.test(em))n+=bad('email','Email chưa đúng, thử lại nhé');
  if(pw.length<6)n+=bad('pw','Mật khẩu cần từ 6 ký tự');
  if(n)return;
  const b=$('#agb');b.classList.add('ld');b.innerHTML='<span class="sp"></span> Đang xử lý...';
  try{
   if(reg){const r=await API.signUp({email:em,password:pw,name:nm,birthday:$('#fb').value||''});
    if(r.needsConfirm){b.classList.remove('ld');b.innerHTML=`Tạo tài khoản ${ic('right')}`;infoPane('Kiểm tra email của bạn','Colentis đã gửi thư xác nhận tới '+esc(em)+'. Bấm liên kết trong thư rồi quay lại đăng nhập.');return}}
   else await API.signIn(em,pw);
   await enterApp(reg)
  }catch(er){b.classList.remove('ld');b.innerHTML=`${reg?'Tạo tài khoản':'Đăng nhập'} ${ic('right')}`;const a=er&&er.app;const c=a&&a.code;
   if(c==='BAD_LOGIN')bad('pw',a.message);else if(c==='EMAIL_TAKEN')bad('email',a.message);else if(c==='REGISTRATION_CLOSED'){S.regClosed=true;closedPane(pa)}else toast(failMsg(er))}}}
function infoPane(t,p){const p2=$('.panel2',$('#pa'));p2.innerHTML=`<div class="clsd"><div class="cli">${ic('mail')}</div><h3>${t}</h3><p>${p}</p><button class="igo" id="clgo">Về đăng nhập ${ic('right')}</button></div>`;$('#clgo').onclick=()=>{INTRO.mode='login';authPane()}}
/* vào app sau khi đăng nhập/đăng ký thành công */
async function enterApp(isNew){try{await API.boot()}catch(e){showErr('load');return}
 renderAll();const wm=MAILS.find(m=>m.kind==='welcome'&&!m.claimed);
 closeIntro(!!wm&&(isNew||true),wm?wm.id:null);
 if(!wm)setTimeout(()=>toast('Chào mừng trở lại, '+ME.name+'!'),600);
 API.startRealtime();newTitlesPrompt()}
function closeIntro(openWelcome,mailId){const el=$('#intro');el.classList.remove('on');setTimeout(()=>{el.innerHTML=''},520);renderAll();
 if(openWelcome){go('today');setTimeout(()=>{openLetter(mailId)},700)}else go(S.tab||'cal')}

/* ===================== Quà Tân binh CORTIS ===================== */
let WZ=null;
const wzEl=()=>$('#wz');
function wzFx(cols,n,pow,ox,oy,sz=[7,14]){const box=$('#wzp');if(!box)return;const W=wzEl().clientWidth,H=wzEl().clientHeight;
 for(let i=0;i<n;i++){const e=document.createElement('i'),a=R(0,6.28),d=R(pow*.35,pow);e.style.cssText=`left:${(ox??.5)*W}px;top:${(oy??.45)*H}px;width:${R(sz[0],sz[1])}px;height:${R(sz[0]*1.2,sz[1]*1.5)}px;background:${pickOne(cols)};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d+R(0,80)}px;--r:${R(-540,540)}deg;--d:${R(.9,1.7)}s`;box.appendChild(e);setTimeout(()=>e.remove(),1800)}}
function wzFlash(c){const f=$('#wzfl');if(!f)return;f.style.background=c||'#fff';f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
function wzShake(ms=500){const w=wzEl();if(S.reduce)return;w.classList.add('shk');setTimeout(()=>w.classList.remove('shk'),ms)}
function wzDots(n){$('#wzdots').innerHTML=[1,2,3,4,5].map(i=>`<i class="${i<n?'dn':i===n?'on':''}"></i>`).join('')}
const CONF=['#FFE45E','#FF2E88','#4CC9FF','#A5CDAB','#B9A4FF','#fff'];
function runWelcomeClaim(m){if(!API.online()){toast('Cần có mạng để nhận quà');return}
 WZ={m,pick:ME.welcomeMember?WMEM.indexOf(ME.welcomeMember):-1,cards:null,res:[],i:0,got:[],rescue:2};closePage('pgLetter');closePage('pgMail');
 const el=wzEl();el.innerHTML=`<div class="wzst">${Array.from({length:30},()=>`<i style="left:${R(0,100)}%;top:${R(0,100)}%;animation-delay:${R(0,3)}s"></i>`).join('')}</div><div class="wzdots" id="wzdots"></div><div class="wzb" id="wzb"></div><div class="wzfl" id="wzfl"></div><div class="wzp" id="wzp"></div>`;
 el.className='wz on';wzStep(1)}
function wzStep(n){WZ.step=n;wzDots(Math.min(n,5));const b=$('#wzb');b.innerHTML='';[null,wz1,wz2,wz3,wz4,wz5,wz6][n]()}
/* 1. nhận khung */
function wz1(){const b=$('#wzb');
 b.innerHTML=`<div class="wzs s1"><div class="rays"></div><div class="fav">${avatar(ME,236,'welcome-1')}</div><div class="ftl">${titleFrame('welcome-1','? ? ?',64)}</div><h2>Khung Tân binh CORTIS</h2><p>Một cặp khung tròn và khung ngang dành riêng cho thành viên mới. Tên danh hiệu sẽ được tiết lộ sau khi bạn chọn thành viên.</p><button class="wzbtn" id="wzn" disabled>Nhận khung</button></div>`;
 setTimeout(()=>{wzFlash('#fff6c8');wzFx(CONF,46,230,.5,.3);wzShake(300)},S.reduce?0:500);
 setTimeout(()=>{const n=$('#wzn');if(n){n.disabled=false;n.onclick=()=>wzStep(2)}},S.reduce?100:1700)}
/* 2. chọn thành viên, danh hiệu ẩn */
function wz2(){const b=$('#wzb');
 b.innerHTML=`<div class="wzs s2"><h2>Bạn là fan của ai?</h2><p>Chọn một thành viên. Danh hiệu Tân binh của bạn sẽ được tiết lộ ngay sau khi chọn.</p>
 <div class="stg" id="stg"><div class="glow"></div>${avatar({a:'#8f93c9',b:'#5b5f9e',ini:ME.ini},118,'welcome-1')}<div id="ttl">${titleFrame('welcome-1','? ? ?',50).replace('class="tf tn"','class="tf tn mys"')}</div><div class="who" id="who">Chạm vào một thành viên bên dưới</div></div>
 <div class="lst">${PICKS.map((p,i)=>`<button class="mrow" style="--mc:${p[1]}" data-pk="${i}"><span class="dot">${p[0][0]}</span><b>${p[0]}</b><span class="ck">${ic('check')}</span></button>`).join('')}</div>
 <button class="wzbtn" id="wzn" disabled>Chọn một thành viên</button></div>`;
 let done=false;const pre=WZ.pick>=0;
 $$('[data-pk]',b).forEach(r=>r.onclick=()=>{if(done||pre)return;WZ.pick=+r.dataset.pk;const p=PICKS[WZ.pick];
  $$('[data-pk]',b).forEach(x=>x.classList.toggle('on',x===r));
  const av=$('.av',b);av.style.setProperty('--ca',p[1]);av.style.setProperty('--cb',p[2]);$('.glow',b).style.setProperty('--gc',p[1]);$('#who').innerHTML=`Fan của <b>${p[0]}</b>`;
  const n=$('#wzn');n.disabled=false;n.innerHTML=`Chọn ${p[0]} ${ic('right')}`;wzFx([p[1],'#fff',p[2]],26,170,.5,.3)});
 if(pre){const p=PICKS[WZ.pick];$$('[data-pk]',b).forEach(x=>x.classList.toggle('on',+x.dataset.pk===WZ.pick));const av0=$('.av',b);av0.style.setProperty('--ca',p[1]);av0.style.setProperty('--cb',p[2]);$('#who').innerHTML=`Fan của <b>${p[0]}</b>`;const n0=$('#wzn');n0.disabled=false;n0.innerHTML=`Chọn ${p[0]} ${ic('right')}`}
 $('#wzn').onclick=async()=>{if(!done){done=true;const k=WZ.pick,p=PICKS[k],n=$('#wzn');n.disabled=true;n.textContent='Đang mở danh hiệu...';
   let res;try{if(!pre)await API.chooseWelcome(WMEM[k]);res=await API.claimMail(WZ.m.id)}catch(er){done=false;n.disabled=false;n.innerHTML=`Chọn ${p[0]} ${ic('right')}`;$$('[data-pk]',b).forEach(x=>x.classList.remove('lock'));$('#ttl .tf').classList.remove('shake');apiFail(er);return}
   WZ.result=res;WZ.cards=res.grants.filter(g=>g.source==='welcome').map(g=>CBY[g.card_id]);WZ.res=res.grants.filter(g=>g.source==='welcome').map(g=>({isNew:g.is_new,n:g.count}));WZ.rescue=res.rescue_added||2;
   $$('[data-pk]',b).forEach(x=>x.classList.add('lock'));
   const tf=$('#ttl .tf');tf.classList.add('shake');wzShake(700);
   setTimeout(()=>{wzFlash('#fff');wzFx(CONF,60,260,.5,.28);tf.classList.remove('mys','shake');const sp=$('span',tf);sp.textContent=WELCOME[k].name;sp.style.letterSpacing='0';tf.classList.add('rvl');
    $('#who').innerHTML=`Danh hiệu Tân binh của bạn: <b>${esc(WELCOME[k].name)}</b>`;
    n.disabled=false;n.innerHTML=`Tiếp tục ${ic('right')}`},S.reduce?50:800)}
   else wzStep(3)}}
/* 3. thẻ cứu */
function wz3(){const b=$('#wzb');const add=WZ.rescue||2;
 b.innerHTML=`<div class="wzs s3"><h2>Thẻ cứu streak</h2><p>Giữ chuỗi của bạn khi lỡ một ngày, trong vòng 48 giờ.</p><div class="sbig"><div class="sh">${ic('shield')}</div></div><div class="cnt" id="cnt">+0</div><div class="cnt2">Bạn nhận thêm ${add} thẻ cứu tặng</div><button class="wzbtn" id="wzn">Tiếp tục ${ic('right')}</button></div>`;
 let v=0;const t=setInterval(()=>{v++;const c=$('#cnt');if(!c){clearInterval(t);return}c.textContent='+'+v;wzFx(['#4CC9FF','#fff','#9ee8ff'],14,150,.5,.36);if(v>=add)clearInterval(t)},S.reduce?10:520);
 $('#wzn').onclick=()=>wzStep(4)}
/* 4. xé gói */
function wz4(){const b=$('#wzb'),W=212;
 b.innerHTML=`<div class="wzs s4"><h2>Gói thẻ Tân binh</h2><p>5 thẻ ngẫu nhiên, chắc chắn có thẻ Hiếm. Thẻ Huyền Thoại và Bá khí cũng có thể xuất hiện.</p>
 <div class="beam" id="beam"></div>
 <div class="wpk" id="wpk"><div class="fl"><div class="glow" id="pgl"></div><div class="pbody"><div class="lb">THẺ TÂN BINH</div></div><div class="slit" id="slit" style="clip-path:inset(0 100% 0 0)"></div><div class="ps" id="psb"><b>VUỐT ĐỂ XÉ ▸</b></div><div class="ps" id="psa" style="display:none"></div><div class="fng" id="fng">👆</div></div></div>
 <div class="hint" id="hint2">Vuốt ngang qua miệng gói để xé<small>hoặc chạm vào gói</small></div></div>`;
 const wpk=$('#wpk'),psa=$('#psa'),psb=$('#psb'),slit=$('#slit'),gl=$('#pgl'),st=$('.s4',b);
 let p=0,down=false,x0=0,t0=0,moved=0,torn=false,raf=0;
 const jag=(x,top)=>{let s='';for(let y=0;y<=64;y+=8){const o=((y/8)%2?-5:5);s+=`${x+o}px ${y}px,`}return s.slice(0,-1)};
 const paint=()=>{const x=p*(W+8);
  psb.style.clipPath=`polygon(${x}px 0,${W}px 0,${W}px 64px,${Math.max(0,x)}px 64px,${jag(x).split(',').reverse().join(',')})`;
  psa.style.display=p>0.01?'block':'none';
  psa.style.clipPath=`polygon(0 0,${x}px 0,${jag(x)},0 64px)`;
  psa.style.transform=`translateY(${-p*10}px) rotate(${-p*12}deg)`;
  slit.style.clipPath=`inset(0 ${100-p*100}% 0 0)`;gl.style.setProperty('--pg',.25+p*.6);
  wpk.style.transform=p>0.05&&!torn?`translate(${R(-1,1)*p*5}px,${R(-1,1)*p*3}px)`:'';
  $('#fng').style.display=p>0.02?'none':''};
 const tear=()=>{if(torn)return;torn=true;p=1;paint();
  psa.style.display='none';
  const fly=document.createElement('div');fly.className='ps';fly.style.cssText='position:absolute;left:0;right:0;top:0;pointer-events:none';fly.innerHTML='<b></b>';wpk.firstChild.appendChild(fly);
  fly.animate([{transform:'none',opacity:1},{transform:'translate(-150px,-250px) rotate(-55deg)',opacity:0}],{duration:760,easing:'cubic-bezier(.3,0,.7,.4)',fill:'forwards'});
  psb.style.display='none';wzFlash('#fff6c8');wzShake(520);$('#beam').classList.add('go');
  wzFx(['#fff','#FFE45E','#cfd3ee','#9B8CFF','#FF2E88'],70,330,.5,.44,[6,13]);
  setTimeout(()=>wzFx(['#fff','#FFE45E','#4CC9FF'],40,260,.5,.44),180);
  $('#hint2').style.opacity=0;
  wpk.animate([{transform:'none',opacity:1},{transform:'translateY(60px) scale(.9)',opacity:0}],{duration:700,delay:260,easing:'ease-in',fill:'forwards'});
  setTimeout(()=>wzStep(5),S.reduce?150:1200)};
 const ease=()=>{cancelAnimationFrame(raf);const f=()=>{if(down||torn)return;p=Math.max(0,p-.06);paint();if(p>0)raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f)};
 const auto=()=>{cancelAnimationFrame(raf);const s=performance.now(),p0=p;const f=now=>{if(torn)return;const k=Math.min(1,(now-s)/(S.reduce?10:650));p=p0+(1-p0)*(k*k*(3-2*k));paint();if(k<1)raf=requestAnimationFrame(f);else tear()};raf=requestAnimationFrame(f)};
 st.addEventListener('pointerdown',e=>{if(torn)return;down=true;x0=e.clientX;t0=performance.now();moved=0;cancelAnimationFrame(raf)});
 st.addEventListener('pointermove',e=>{if(!down||torn)return;const dx=e.clientX-x0;moved=Math.max(moved,Math.abs(dx));p=Math.max(p,Math.min(1,dx/(W*1.0)));paint();if(p>=1)tear()});
 const up=()=>{if(!down)return;down=false;if(torn)return;if(moved<10&&performance.now()-t0<400)auto();else ease()};
 st.addEventListener('pointerup',up);st.addEventListener('pointerleave',up)}
/* 5. lật từng thẻ */
function wzSize(c){return c.land?292:(c.ar>.9?250:218)}
function wz5(){const b=$('#wzb'),cards=WZ.cards,tc={common:'rgba(255,255,255,.5)',rare:'#4CC9FF',legend:'#B57CFF',supreme:'#FF2E88'};
 b.innerHTML=`<div class="wzs rv" id="rv"><div class="wzhd" id="wzhd"></div><div class="wzstack" id="wzstack"></div><div class="wzcw" id="wzcw"></div><div class="rname wzrn" id="wzrn"></div><div class="wzinfo" id="wzinfo"></div><div class="wzhint" id="wzh"></div><div class="wztray" id="wztray">${cards.map((c,i)=>`<div class="sl" id="sl${i}">${i+1}</div>`).join('')}</div><button class="wzbtn" id="wzn"></button></div>`;
 const rv=$('#rv');
 const showTop=()=>{const i=WZ.i,left=cards.slice(i),c=cards[i];$('#wzhd').innerHTML=`Thẻ ${i+1} / ${cards.length}<small>${i===cards.length-1?'Thẻ cuối cùng':'Chạm vào thẻ để lật'}</small>`;
  $('#wzh').textContent='Chạm để lật thẻ';$('#wzh').style.display='';$('#wzinfo').classList.remove('go');$('#wzrn').className='rname wzrn';$('#wzn').classList.remove('on');$('#wzcw').className='wzcw';$('#wzcw').innerHTML='';
  const bw=c.land?236:176;
  $('#wzstack').classList.remove('away');$('#wzstack').innerHTML=left.map((x,k)=>{const top=k===0,w=top?bw:176,ar=top?c.ar:.7;const ox=(k*5)+'px',oy=(k*-4)+'px',rt=(k?(k%2?3:-3)*k*.7:0)+'deg';
   return `<div class="bk ${top?'top '+(c.r!=='common'?'tell':''):''}" data-k="${k}" style="--ox:${ox};--oy:${oy};--rt:${rt};--tc:${tc[c.r]};z-index:${20-k};--dl:${(left.length-1-k)*.08}s">${backHTML(x,{w:w,ar:ar})}</div>`}).reverse().join('');
  const topEl=$('.bk.top');topEl.onclick=flip};
 const flip=()=>{sfxReveal({type:'card',card:cards[WZ.i]});const i=WZ.i,c=cards[i],it={type:'card',card:c},inf=infoFor(it),w=wzSize(c),h=w/c.ar;
  const topEl=$('.bk.top');topEl.onclick=null;topEl.classList.add('hide');setTimeout(()=>$('#wzstack').classList.add('away'),120);$('#wzh').style.display='none';
  const res=WZ.res[i];WZ.got.push({c,res});
  const cw=$('#wzcw');cw.innerHTML=`<div class="tl"><div class="tiltable" id="wztlt"><div class="flipper" style="width:${w}px">${cardHTML(c,{w:w})}<div class="bkface" style="--w:${w}px">${backHTML(c,{w:w,fill:1})}</div></div></div></div>`;
  cw.classList.add('show');
  const tension=c.r==='common'?0:c.r==='rare'?500:c.r==='legend'?950:1500;
  setTimeout(()=>{if(tension&&!S.reduce){cw.classList.add('chg');wzFx([inf.col,'#fff'],c.r==='common'?0:14,120,.5,.41,[4,8])}},560);
  setTimeout(()=>{cw.classList.remove('chg');cw.classList.add('rev');
   setTimeout(()=>{const pc=$('#wzcw .pc');if(!S.reduce)pcFx(pc);
    const k=c.r==='supreme'?1.2:c.r==='legend'?1:c.r==='rare'?.7:.35;
    if(c.r!=='common'){wzFlash(inf.col==='#FFE45E'?'#fff6c8':'#fff');wzFx(inf.cols,Math.round(inf.parts*.9),260*k+120,.5,.41)}
    if(c.r==='legend'||c.r==='supreme')wzShake(c.r==='supreme'?900:520);
    const rn=$('#wzrn');rn.textContent=inf.txt;rn.style.setProperty('--rc',inf.col);rn.style.top=(wzEl().clientHeight*.41+h/2+22)+'px';rn.style.fontSize=inf.txt.length>8?'30px':'38px';rn.classList.add('go');
    $('#wzinfo').innerHTML=`${res.isNew?`<span class="badge nw">${ic('spark')} THẺ MỚI</span>`:`<span class="badge dup">Bạn đã có thẻ này · ×${res.n}</span>`}<b>${c.name}</b><span>${c.land?'Thẻ ngang':'Thẻ dọc'} · Quà Tân binh</span>`;$('#wzinfo').classList.add('go');
    const nb=$('#wzn');nb.innerHTML=(i===cards.length-1?'Xem tổng kết':'Thẻ tiếp theo')+' '+ic('right');nb.classList.add('on');nb.onclick=next;
    tiltOn(rv,$('#wztlt'))},S.reduce?60:700)},S.reduce?60:560+tension)};
 const next=()=>{const i=WZ.i,c=cards[i],nb=$('#wzn');nb.onclick=null;nb.classList.remove('on');$('#wzinfo').classList.remove('go');$('#wzrn').className='rname wzrn';rv.onpointermove=null;
  const cw=$('#wzcw');cw.classList.add('out');
  setTimeout(()=>{const sl=$('#sl'+i);sl.className='sl f';sl.innerHTML=cardHTML(c,{w:c.land?58:40,thumb:1});$('#wzcw').innerHTML='';
   WZ.i++;if(WZ.i>=cards.length)setTimeout(()=>wzStep(6),300);else showTop()},S.reduce?30:480)};
 showTop()}
/* 6. tổng kết */
function wz6(){const b=$('#wzb'),k=WZ.pick,t=WELCOME[k]||{name:''};
 API.reload().then(()=>renderAll());
 b.innerHTML=`<div class="wzs s6"><h2>Chào mừng, Tân binh ${esc(PICKS[k][0])}!</h2><p>Mọi thứ đã nằm trong album và Hồ sơ của bạn.</p>
 <div class="grd">${WZ.cards.map((c,i)=>`<div style="animation-delay:${i*.1}s">${cardHTML(c,{w:c.land?112:68,thumb:1})}</div>`).join('')}</div>
 <div class="chips"><span>${ic('image')} 5 thẻ mới</span><span>${ic('shield')} Thẻ cứu ×${WZ.rescue}</span><span>${ic('star')} ${esc(t.name)}</span></div>
 <div class="fin"><button class="wzbtn" id="wcol">${ic('image')} Xem bộ sưu tập</button><button class="wzbtn gh" id="wx">Vào Colentis</button></div></div>`;
 wzFx(CONF,50,280,.5,.2);
 const close=(tab)=>{const el=wzEl();el.classList.remove('on');setTimeout(()=>{el.innerHTML='';WZ=null},500);renderAll();if(tab)go(tab);else go('pro');setTimeout(()=>toast('Đã đeo danh hiệu Tân binh: '+t.name),700);if(!lsGet('tour',false))setTimeout(openTour,2600)};
 $('#wcol').onclick=()=>close('col');$('#wx').onclick=()=>close('pro')}

