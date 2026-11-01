/* ===== Hiệu ứng nhận quà thư POLA DAY: xé từng gói 5 thẻ -> tổng kết -> Ball 3D rơi xuống -> frame Ball-chan hiện ra.
   Dữ liệu lấy từ kết quả claim_mail (grants có trường pack, ball; new_titles). Mockup đã duyệt: scratchpad mail/claim.html ===== */
const PXN={common:'THƯỜNG',rare:'HIẾM',legend:'HUYỀN THOẠI',supreme:'BÁ KHÍ'};
function plClaimFX(res,done){
 const gr=res.grants||[],packs=[];
 gr.forEach(g=>{if(g.pack&&CBY[g.card_id]){(packs[g.pack-1]=packs[g.pack-1]||[]).push(CBY[g.card_id])}});
 const P=packs.filter(Boolean),hasBall=gr.some(g=>g.ball),hasFrame=(res.new_titles||[]).includes('ball-mint')||!!(S.unlocked&&S.unlocked.has&&S.unlocked.has('ball-mint'));
 const ov=document.createElement('div');ov.className='px-ov';document.body.appendChild(ov);
 let pi=0,fl=0,torn=false,prog=0,tearing=false,sx=0,holdT=null,ballBox=null;
 const end=()=>{if(ballBox)KCSTOP.add(ballBox);clearInterval(holdT);ov.remove();removeEventListener('pointerup',pu);done&&done()};
 const steps=[];if(P.length)steps.push('pack','sum');if(hasBall)steps.push('ball');if(hasFrame)steps.push('frame');
 let si=-1;const next=()=>{si++;const s=steps[si];if(!s)return end();({pack:()=>packScene(0),sum:sumScene,ball:ballScene,frame:frameScene})[s]()};
 const bg=(x='')=>`<div class="px-bg ${x}"></div>`;
 const wf=c=>c.land?112:Math.max(80,Math.min(112,Math.round(160*(c.ar||.7))));
 function packScene(i){pi=i;fl=0;torn=false;prog=0;
  ov.innerHTML=`${bg()}<div class="px-top"><span class="px-pill">GÓI ${i+1} / ${P.length}</span><button class="px-skip">Mở nhanh ›</button></div><div class="px-dots">${P.map((_,k)=>`<i class="${k<i?'d':k===i?'c':''}"></i>`).join('')}</div>
  <div class="px-stage"><div class="px-pack"><div class="px-pk"><div class="px-cr t"></div><div class="px-cr b"></div><div class="px-lab"><small>COLENTIS</small><b>P<span class="o"></span>LA<br>DAY</b><em>5 THẺ</em></div><img class="px-logo" src="${LOGO}" alt=""></div><div class="px-strip"><span>✂ XÉ Ở ĐÂY</span></div><div class="px-tl"></div></div></div>
  <div class="px-burst"></div><div class="px-fan"></div><div class="px-slam"></div><div class="px-hint">Vuốt ngang để xé gói<small>hoặc bấm giữ vào gói</small></div><button class="px-btn" data-n>Gói tiếp theo</button>`;
  ov.querySelector('.px-skip').onclick=e=>{e.stopPropagation();sumScene()};
  ov.querySelector('[data-n]').onclick=e=>{e.stopPropagation();if(pi<P.length-1)packScene(pi+1);else{si=steps.indexOf('sum');sumScene()}};
  ov.onpointerdown=e=>{if(torn||e.target.closest('button'))return;tearing=true;sx=e.clientX;ov.querySelector('.px-pack').classList.add('shk');clearInterval(holdT);holdT=setInterval(()=>{prog+=.035;upd()},40)};
  ov.onpointermove=e=>{if(!tearing)return;prog+=Math.abs(e.clientX-sx)/220;sx=e.clientX;upd()};
  if(S.reduce){setTimeout(tear,300)}}
 function pu(){tearing=false;clearInterval(holdT);const pk=ov.querySelector('.px-pack');if(pk&&!torn)pk.classList.remove('shk')}
 addEventListener('pointerup',pu);
 function upd(){prog=Math.min(1,prog);const tl=ov.querySelector('.px-tl');if(tl)tl.style.width=prog*100+'%';if(prog>=1&&!torn)tear()}
 function tear(){torn=true;clearInterval(holdT);const pk=ov.querySelector('.px-pack');if(!pk)return;pk.classList.remove('shk');ov.querySelector('.px-strip').classList.add('fly');ov.querySelector('.px-burst').classList.add('go');ov.querySelector('.px-hint').style.display='none';
  if(S.haptic!==false&&navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
  setTimeout(()=>{pk.classList.add('gone');deal()},420)}
 function deal(){const f=ov.querySelector('.px-fan'),cs=P[pi];
  f.innerHTML=cs.map((c,k)=>`<div class="px-cd px-${c.r}" data-k="${k}" style="opacity:0;transform:translate(0,120px) scale(.6)"><div class="px-cdi"><div class="px-bc"><img src="${LOGO}" alt=""></div><div class="px-fc">${cardHTML(c,{w:wf(c),thumb:1})}<b>${PXN[c.r]||''}</b></div></div></div>`).join('');
  const cards=[...f.children],pos=[[-118,-60,-14],[-60,-92,-7],[0,-102,0],[60,-92,7],[118,-60,14]];
  cards.forEach((c,k)=>setTimeout(()=>{c.style.opacity=1;c.style.transform=`translate(${pos[k][0]}px,${pos[k][1]}px) rotate(${pos[k][2]}deg) scale(.84)`},80*k));
  setTimeout(()=>{const h=ov.querySelector('.px-hint');h.style.display='';h.innerHTML='Chạm để lật thẻ<small>chạm chỗ trống để lật lần lượt</small>'},600);
  cards.forEach(c=>c.onclick=e=>{e.stopPropagation();flip(c)});
  ov.onclick=e=>{if(e.target.closest('button'))return;const n=cards.find(c=>!c.classList.contains('fl'));n&&flip(n)}}
 function flip(c){if(c.classList.contains('fl'))return;c.classList.add('fl');fl++;const r=P[pi][+c.dataset.k].r;
  if(r==='legend'||r==='supreme'){const s=ov.querySelector('.px-slam');s.textContent=PXN[r];s.className='px-slam '+r;void s.offsetWidth;s.classList.add('go');if(r==='supreme')ov.animate([{transform:'translate(0,0)'},{transform:'translate(-6px,3px)'},{transform:'translate(5px,-4px)'},{transform:'translate(0,0)'}],{duration:350,iterations:2})}
  if(fl===P[pi].length){ov.onclick=null;ov.querySelector('.px-hint').style.display='none';const b=ov.querySelector('[data-n]');b.textContent=pi<P.length-1?`Gói tiếp theo (${pi+2}/${P.length})`:`Xem tất cả ${P.flat().length} thẻ`;b.classList.add('on')}}
 function sumScene(){ov.onpointerdown=ov.onpointermove=ov.onclick=null;si=steps.indexOf('sum');const all=P.flat(),cnt={};all.forEach(c=>cnt[c.r]=(cnt[c.r]||0)+1);
  ov.innerHTML=`${bg()}<div class="px-top"><span class="px-pill">${P.length} / ${P.length} GÓI</span><span></span></div><div class="px-sum"><small>ĐÃ RỬA XONG</small><h2>${all.length} thẻ mới</h2><div class="px-sg">${all.map((c,k)=>`<i class="px-${c.r}" style="animation-delay:${k*45}ms">${cardHTML(c,{w:56,thumb:1})}</i>`).join('')}</div>
  <div class="px-cnt">${['supreme','legend','rare','common'].filter(k=>cnt[k]).map(k=>`<span class="px-${k}">${PXN[k]} ×${cnt[k]}</span>`).join('')}</div></div><button class="px-btn on" data-n>${steps.length>si+1?'Còn quà nữa ›':'Xong'}</button>`;
  ov.querySelector('[data-n]').onclick=e=>{e.stopPropagation();next()}}
 function ballScene(){ov.onpointerdown=ov.onpointermove=ov.onclick=null;
  ov.innerHTML=`${bg()}<div class="px-spot"></div><div class="px-b3d"></div><div class="px-notes">${[[-110,-25,2],[110,25,2.4],[-60,-10,2.8],[70,15,3.2]].map(([x,r,d],k)=>`<i style="--x:${x}px;--r:${r}deg;animation-delay:${d}s">${k%2?'♫':'♪'}</i>`).join('')}</div>
  <div class="px-rt"><small>QUÀ MỞ MÀN</small><h2>Ball bạc hà</h2><p>Con đầu tiên trong 8 Ball. Treo lên frame danh hiệu để nó đung đưa trên Hồ sơ của bạn.</p></div><button class="px-btn px-b2 on" data-l>Để sau</button><button class="px-btn on" data-w>Đeo lên frame</button>`;
  ballBox=document.createElement('div');ballBox.className='kc-cv';ov.querySelector('.px-b3d').appendChild(ballBox);
  KC.lib().then(L=>{if(!ballBox.isConnected)return;const sc=L.sceneStrap(ballBox,{px:0,py:3.7,scale:.62,auto:false,camY:.1,look:.1,camZ:16});const tg=3.7,t0=performance.now();
   if(KCRM()){sc.pivot.position.y=tg;return}sc.pivot.position.y=tg+9;const st=t=>{const k=Math.min(1,(t-t0-300)/1100);if(k<0)return requestAnimationFrame(st);sc.pivot.position.y=tg+9*Math.pow(1-k,3);if(k<1)requestAnimationFrame(st);else sc.st.vel=.9};requestAnimationFrame(st)}).catch(()=>{});
  ov.querySelector('[data-l]').onclick=e=>{e.stopPropagation();KCSTOP.add(ballBox);next()};
  ov.querySelector('[data-w]').onclick=async e=>{e.stopPropagation();const b=e.currentTarget;b.disabled=true;try{S.balls=await API.wornBall('ball-1');toast('Đã đeo Ball lên frame')}catch(er){apiFail(er)}KCSTOP.add(ballBox);next()}}
 function frameScene(){
  ov.innerHTML=`${bg('mint')}<div class="px-flash"></div><div class="px-fw"><div class="px-av">${avatar(ME,250,'ball-mint')}</div><div class="px-dev"></div><div class="px-ring"></div></div>
  <div class="px-tfw">${titleFrame('ball-mint',null,62)}</div><div class="px-ft"><small>DANH HIỆU MỚI</small><h2>${esc((TMAP['ball-mint']||{name:'Ball-chan'}).name)}</h2><p>Khung tròn và khung ngang đã vào Hồ sơ.</p></div><button class="px-btn px-b2 on" data-l>Để sau</button><button class="px-btn on" data-e>Đeo ngay</button>`;
  ov.querySelector('[data-l]').onclick=e=>{e.stopPropagation();next()};
  ov.querySelector('[data-e]').onclick=async e=>{e.stopPropagation();const b=e.currentTarget;b.disabled=true;try{await API.equip('ball-mint');S.equip='ball-mint';ME.frame='ball-mint';toast('Đã đeo Ball-chan')}catch(er){apiFail(er)}next()}}
 next()}
