/* ===== Bá khí đợt 2: 12 hiệu ứng riêng (s5..s16), CSS ở src/ui/supreme2.css =====
   Mỗi thẻ một kiểu, màu lấy theo ảnh. Hạt chỉ tạo khi thẻ đang hiển thị (pcFx gọi hàm này). */
const SUPCOL={s1:['#35e07a','#ff3b4e'],s2:['#ffffff','#9fb0ff'],s3:['#ffb02e','#ff3d1f'],s4:['#ffc46b','#3a7bff'],
 s5:['#ffd23f','#4cc9ff'],s6:['#ff2a3a','#c8f02a'],s7:['#ffb347','#7ad7ff'],s8:['#ff3d8b','#7bd957'],s9:['#ff2a2a','#ffffff'],s10:['#ff3b30','#ffe27a'],
 s11:['#ff2d95','#00e5ff'],s12:['#d0284a','#f6dcc4'],s13:['#5ad1ff','#ff4a4a'],s14:['#ff2b2b','#3a7bff'],s15:['#ffc13b','#4cc9ff'],s16:['#3a7bff','#b57cff']};
const SUPNAME={s5:'Pháo hoa kỷ niệm',s6:'Đèn flash tạp chí',s7:'Ánh nến & vòng neon',s8:'Nổ truyện tranh',s9:'Pháo sáng sân cổ động',s10:'Vuốt hổ',s11:'Glitch neon',s12:'Lụa bordeaux',s13:'Ánh nhìn quét',s14:'Tốc độ phố',s15:'Nắng Barcelona',s16:'Buồng photobooth'};
function pcFxS2(k,el,fx){
 const ov=h=>fx.insertAdjacentHTML('beforeend','<div class="ov">'+h+'</div>');
 const ex=h=>fx.insertAdjacentHTML('beforeend',h);
 const rep=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
 const [c1,c2]=SUPCOL[k]||['#fff','#aaf'];
 if(k==='s5'){ /* pháo hoa + confetti */
  const cols=['#ffd23f','#4cc9ff','#ff5db6','#fff','#7dffb0'];
  ex(rep(6,i=>{const k2=cols[i%cols.length];return `<div class="bst" style="--x:${R(-4,104)}%;--y:${R(-4,104)}%;--d:${R(1.6,2.4)}s;--l:${(i*.55).toFixed(2)}s;--r:${R(46,86)}px">${rep(16,j=>`<i style="--a:${j*22.5}deg;--k:${k2}"></i>`)}</div>`}));
  ov(rep(26,()=>`<i class="cf" style="--x:${R(0,100)}%;--k:${pickOne(cols)};--d:${R(2.4,4.2)}s;--l:${R(0,4)}s;--rt:${R(300,900)}deg"></i>`))}
 if(k==='s6'){ /* đèn flash paparazzi + vệt bóng */
  ov('<i class="fl6"></i><i class="sw6"></i>');
  ex(rep(9,i=>`<i class="pz" style="left:${R(-6,100)}%;top:${R(-6,100)}%;--s:${R(22,44)}px;--l:${(i*.37+R(0,.3)).toFixed(2)}s;--k:${i%2?c2:'#fff'}"></i>`))}
 if(k==='s7'){ /* ánh nến + vòng neon + tàn lửa */
  ex('<i class="hoop"></i>');ov('<i class="warm"></i>');
  ex(rep(26,()=>`<i class="em7" style="left:${R(14,86)}%;--wd:${R(2,5)}px;--x:${R(-34,34)}px;--d:${R(1.8,3.6)}s;--l:${R(0,3.5)}s"></i>`))}
 if(k==='s8'){ /* nổ truyện tranh */
  let p='';for(let i=0;i<24;i++){const a=i/24*6.2832,r=i%2?32:50;p+=`${(50+Math.cos(a)*r).toFixed(1)}% ${(50+Math.sin(a)*r).toFixed(1)}%,`}
  ex(`<i class="pow" style="clip-path:polygon(${p.slice(0,-1)})"></i>`);ov('<i class="hb"></i><i class="ht"></i>')}
 if(k==='s9'){ /* pháo sáng đỏ + khói */
  ex(rep(9,i=>`<i class="sm" style="left:${R(0,80)}%;--w2:${R(34,62)}%;--d:${R(3,5)}s;--l:${(i*.5).toFixed(2)}s;--x:${R(-30,30)}px"></i>`));
  ov('<i class="fg"></i>');ex(rep(20,()=>`<i class="em7 hot" style="left:${R(8,92)}%;--wd:${R(2,5)}px;--x:${R(-26,26)}px;--d:${R(1,2)}s;--l:${R(0,2.5)}s"></i>`))}
 if(k==='s10'){ /* vuốt hổ: 3 vệt cào */
  ov(`<i class="rf"></i>${rep(3,i=>`<i class="cl" style="--t:${14+i*17}%;--r:${-24+i*2}deg;--l:${(i*.12).toFixed(2)}s"></i>`)}${rep(3,i=>`<i class="cl b" style="--t:${58+i*13}%;--r:${-22+i*2}deg;--l:${(1.6+i*.12).toFixed(2)}s"></i>`)}`)}
 if(k==='s11'){ /* glitch neon */
  ov(`<i class="sc"></i><i class="sl"></i>${rep(5,i=>`<i class="gb" style="--t:${R(6,86)}%;--h:${R(3,9)}%;--l:${(i*.53).toFixed(2)}s;--tx:${R(-18,18)}px;--k:${i%2?c1:c2}"></i>`)}`)}
 if(k==='s12'){ /* lụa bordeaux + dải ruy băng */
  ov('<i class="sk" style="--l:0s"></i><i class="sk b" style="--l:-2.4s"></i>');
  ex(rep(7,i=>`<i class="rb" style="left:${i%2?R(70,96):R(-8,18)}%;top:${R(4,92)}%;--w2:${R(26,52)}%;--r:${R(-70,70)}deg;--d:${R(2.6,4.4)}s;--k:${i%3?c2:c1}"></i>`))}
 if(k==='s13'){ /* quét ánh nhìn */
  ov('<i class="vg"></i><i class="bm"></i><i class="rg"></i><b class="br a"></b><b class="br b"></b><b class="br c"></b><b class="br d"></b>')}
 if(k==='s14'){ /* tốc độ phố */
  ov(`<i class="hl"></i>${rep(18,i=>`<i class="spd" style="top:${R(2,98)}%;--w2:${R(30,80)}%;--d:${R(.45,1.1)}s;--l:${R(0,1.2)}s;--k:${i%5===0?c1:i%5===1?c2:'#fff'}"></i>`)}`)}
 if(k==='s15'){ /* nắng, lens flare */
  ex('<i class="sd"></i>');
  ov(`<i class="lk"></i><i class="an" style="--t:22%"></i><i class="an b" style="--t:68%"></i>${rep(5,i=>`<i class="gh" style="--s:${R(14,38)}%;--k:${i%2?c1:c2};--l:${(-i*.9).toFixed(2)}s"></i>`)}`);
  ex(rep(16,()=>`<i class="tw" style="left:${R(-6,106)}%;top:${R(-6,106)}%;--s:${R(7,14)}px;--l:${R(0,3)}s;--d:${R(1.2,2.6)}s"></i>`))}
 if(k==='s16'){ /* buồng photobooth */
  ov('<i class="fl16"></i><i class="fs"></i><i class="fs r"></i><i class="sc16"></i>');
  const cs=[c1,c2,'#7cff6b','#ffe45e','#ff6bd6'];
  ex(rep(14,i=>`<i class="stk s${i%3}" style="left:${R(-8,104)}%;--s:${R(9,18)}px;--k:${cs[i%cs.length]};--d:${R(3,5.5)}s;--l:${R(0,4)}s;--x:${R(-26,26)}px"></i>`))}
}
