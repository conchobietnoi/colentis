/* ===== Bá khí đợt 2: 12 hiệu ứng riêng (s5..s16), CSS ở src/ui/supreme2.css =====
   Mỗi thẻ: lớp nền chung (viền năng lượng xoay, tia sáng, vòng nổ định kỳ, hạt quay quanh) + hiệu ứng riêng.
   Hạt chỉ tạo khi thẻ đang hiển thị (pcFx gọi hàm này); tắt khi bật giảm chuyển động. */
const SUPCOL={s1:['#35e07a','#ff3b4e'],s2:['#ffffff','#9fb0ff'],s3:['#ffb02e','#ff3d1f'],s4:['#ffc46b','#3a7bff'],
 s5:['#ffd23f','#4cc9ff'],s6:['#ff2a3a','#c8f02a'],s7:['#ffb347','#7ad7ff'],s8:['#ff3d8b','#7bd957'],s9:['#ff2a2a','#ffffff'],s10:['#ff3b30','#ffe27a'],
 s11:['#ff2d95','#00e5ff'],s12:['#d0284a','#f6dcc4'],s13:['#5ad1ff','#ff4a4a'],s14:['#ff2b2b','#3a7bff'],s15:['#ffc13b','#4cc9ff'],s16:['#3a7bff','#b57cff']};
const SUPNAME={s5:'Pháo hoa kỷ niệm',s6:'Đèn flash tạp chí',s7:'Ánh nến & vòng neon',s8:'Nổ truyện tranh',s9:'Pháo sáng sân cổ động',s10:'Vuốt hổ',s11:'Glitch neon',s12:'Lụa bordeaux',s13:'Ánh nhìn quét',s14:'Tốc độ phố',s15:'Nắng Barcelona',s16:'Buồng photobooth'};
function pcFxS2(k,el,fx){
 const ov=h=>fx.insertAdjacentHTML('beforeend','<div class="ov">'+h+'</div>');
 const ex=h=>fx.insertAdjacentHTML('beforeend',h);
 const rep=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
 const [c1,c2]=SUPCOL[k]||['#fff','#aaf'];
 const w=parseFloat(el.style.getPropertyValue('--w'))||200;
 el.classList.add('s2x');
 /* ---- lớp chung: viền năng lượng, tia sáng, vòng nổ, hạt quay quanh, sao lấp lánh ---- */
 el.insertAdjacentHTML('afterbegin','<div class="rays sbrays"></div><div class="rays b sbrays"></div>');
 ex('<i class="sbr"></i><i class="sbr b"></i><i class="sbur"></i><i class="sbur" style="animation-delay:-1.8s"></i>');
 ex(`<div class="orbit" style="--d:6s;--rd:${w*.66}px">${rep(10,j=>`<i style="--wd:${j%2?5:8}px;--a2:${j*36}deg"></i>`)}</div>`);
 ex(rep(30,()=>`<i class="twk" style="left:${R(-10,108)}%;top:${R(-10,108)}%;--s:${R(8,17)}px;--l:${R(0,3)}s;--d:${R(1.1,2.4)}s;--k:${pickOne([c1,c2,'#fff'])}"></i>`));
 /* ---- hiệu ứng riêng ---- */
 if(k==='s5'){ /* pháo hoa lớn + confetti + bóng bay */
  const cols=['#ffd23f','#4cc9ff','#ff5db6','#fff','#7dffb0','#ff8a3d'];
  ex(rep(10,i=>{const k2=cols[i%cols.length];return `<div class="bst" style="--x:${R(-12,112)}%;--y:${R(-12,112)}%;--d:${R(1.5,2.2)}s;--l:${(i*.42).toFixed(2)}s;--r:${R(70,130)}px;--k:${k2}"><b></b>${rep(24,j=>`<i style="--a:${j*15}deg;--k:${j%3?k2:'#fff'}"></i>`)}</div>`}));
  ov(rep(54,()=>`<i class="cf" style="--x:${R(0,100)}%;--k:${pickOne(cols)};--d:${R(1.8,3.6)}s;--l:${R(0,4)}s;--rt:${R(300,1100)}deg"></i>`)+'<i class="glt"></i>')}
 if(k==='s6'){ /* đèn flash paparazzi + đèn sân khấu quét + vệt bóng */
  ov('<i class="fl6"></i><i class="sw6"></i><i class="sw6 b"></i><i class="spot"></i><i class="spot r"></i>');
  ex(rep(16,i=>`<i class="pz" style="left:${R(-10,106)}%;top:${R(-10,106)}%;--s:${R(40,88)}px;--l:${(i*.21+R(0,.2)).toFixed(2)}s;--k:${i%2?c2:'#fff'}"></i>`))}
 if(k==='s7'){ /* ánh nến + vòng neon cầu vồng + cột sáng + tàn lửa */
  ex('<i class="hoop"></i><i class="hoop b"></i><i class="col7"></i>');ov('<i class="warm"></i><i class="warm b"></i>');
  ex(rep(60,()=>`<i class="em7" style="left:${R(6,94)}%;--wd:${R(2,6)}px;--x:${R(-44,44)}px;--d:${R(1.6,3.8)}s;--l:${R(0,3.5)}s"></i>`))}
 if(k==='s8'){ /* nổ truyện tranh: POW, tia chấn động, chấm bán sắc */
  const star=(a0,r1,r2,n)=>{let p='';for(let i=0;i<n*2;i++){const a=i/(n*2)*6.2832+a0,r=i%2?r2:r1;p+=`${(50+Math.cos(a)*r).toFixed(1)}% ${(50+Math.sin(a)*r).toFixed(1)}%,`}return p.slice(0,-1)};
  ex(`<i class="pow" style="clip-path:polygon(${star(0,50,30,14)})"></i><i class="pow b" style="clip-path:polygon(${star(.2,50,34,11)})"></i>`);
  ov(`<i class="hb"></i><i class="hb b"></i><i class="ht"></i><b class="tx" style="--r:-12deg;left:8%;top:10%">POW!</b><b class="tx" style="--r:9deg;right:6%;bottom:12%;--l:.7s">BÙM!</b>`)}
 if(k==='s9'){ /* pháo sáng đỏ: cột sáng, khói dày, tàn lửa, loé trắng */
  ex('<i class="pil" style="left:12%"></i><i class="pil" style="left:48%;--l:-.6s"></i><i class="pil" style="left:84%;--l:-1.2s"></i>');
  ex(rep(12,i=>`<i class="sm" style="left:${R(-8,78)}%;--w2:${R(40,76)}%;--d:${R(2.6,4.6)}s;--l:${(i*.4).toFixed(2)}s;--x:${R(-40,40)}px"></i>`));
  ov('<i class="fg"></i><i class="fg b"></i>');ex(rep(46,()=>`<i class="em7 hot" style="left:${R(4,96)}%;--wd:${R(2,6)}px;--x:${R(-34,34)}px;--d:${R(.9,2.2)}s;--l:${R(0,2.5)}s"></i>`))}
 if(k==='s10'){ /* vuốt hổ: 6 vệt cào, sóng đỏ, rung mạnh */
  ov(`<i class="rf"></i><i class="rf b"></i>${rep(3,i=>`<i class="cl" style="--t:${12+i*17}%;--r:${-26+i*2}deg;--l:${(i*.1).toFixed(2)}s"></i>`)}${rep(3,i=>`<i class="cl b" style="--t:${56+i*14}%;--r:${-24+i*2}deg;--l:${(1.6+i*.1).toFixed(2)}s"></i>`)}`);
  ex('<i class="roar"></i><i class="roar" style="animation-delay:-1.6s"></i>');
  ex(rep(24,()=>`<i class="em7 hot" style="left:${R(0,100)}%;bottom:auto;top:${R(10,90)}%;--wd:${R(3,7)}px;--x:${R(-60,60)}px;--d:${R(.8,1.8)}s;--l:${R(0,3)}s"></i>`))}
 if(k==='s11'){ /* glitch neon: nhiễu, màn quét, chớp hồng-lam, lưới neon */
  ov(`<i class="gr"></i><i class="sc"></i><i class="sl"></i><i class="tint a"></i><i class="tint b"></i>${rep(8,i=>`<i class="gb" style="--t:${R(4,90)}%;--h:${R(3,10)}%;--l:${(i*.33).toFixed(2)}s;--tx:${R(-26,26)}px;--k:${i%2?c1:c2}"></i>`)}${rep(10,()=>`<i class="px" style="left:${R(0,96)}%;top:${R(0,96)}%;--s:${R(6,20)}px;--l:${R(0,2.6).toFixed(2)}s;--k:${pickOne([c1,c2,'#fff'])}"></i>`)}`)}
 if(k==='s12'){ /* lụa bordeaux: dải lụa lớn, ruy băng, bụi vàng */
  ov('<i class="sk" style="--l:0s"></i><i class="sk b" style="--l:-2.4s"></i><i class="sk c" style="--l:-4s"></i>');
  ex(rep(12,i=>`<i class="rb" style="left:${i%2?R(66,98):R(-12,22)}%;top:${R(0,96)}%;--w2:${R(34,66)}%;--r:${R(-70,70)}deg;--d:${R(2.2,4)}s;--k:${i%3?c2:c1}"></i>`));
  ex(rep(40,()=>`<i class="em7 gold" style="left:${R(0,100)}%;--wd:${R(2,5)}px;--x:${R(-30,30)}px;--d:${R(2,4)}s;--l:${R(0,4)}s"></i>`))}
 if(k==='s13'){ /* quét ánh nhìn: tia quét, radar, ngắm bắn xoay, báo động */
  ov('<i class="vg"></i><i class="bm"></i><i class="bm b"></i><i class="rg"></i><i class="rg" style="animation-delay:-1.1s"></i><i class="lock"></i><i class="alr"></i><b class="br a"></b><b class="br b"></b><b class="br c"></b><b class="br d"></b>')}
 if(k==='s14'){ /* tốc độ phố: vệt tốc độ, đèn pha, vệt đèn xe */
  ov(`<i class="hl"></i><i class="hl b"></i>${rep(40,i=>`<i class="spd" style="top:${R(0,100)}%;--w2:${R(40,110)}%;--d:${R(.35,.9)}s;--l:${R(0,1.2)}s;--h:${i%6===0?3:2}px;--k:${i%5===0?c1:i%5===1?c2:'#fff'}"></i>`)}`);
  ex('<i class="trl"></i><i class="trl b"></i>')}
 if(k==='s15'){ /* nắng: vầng mặt trời + tia xoay + lens flare + lấp lánh */
  ex('<i class="sd"></i><i class="sun"></i>');
  ov(`<i class="lk"></i><i class="an" style="--t:20%"></i><i class="an b" style="--t:66%"></i>${rep(7,i=>`<i class="gh" style="--s:${R(14,40)}%;--k:${i%2?c1:c2};--l:${(-i*.8).toFixed(2)}s"></i>`)}`)}
 if(k==='s16'){ /* buồng photobooth: 4 lần chớp, dải phim, đèn màu, confetti */
  ex('<div class="aur"><i></i><i></i><i></i><i></i></div>');
  ov('<i class="fl16"></i><i class="fs"></i><i class="fs r"></i><i class="sc16"></i><i class="cd"></i>');
  const cs=[c1,c2,'#7cff6b','#ffe45e','#ff6bd6'];
  ex(rep(34,i=>`<i class="stk s${i%3}" style="left:${R(-8,104)}%;--s:${R(10,22)}px;--k:${cs[i%cs.length]};--d:${R(2.4,5)}s;--l:${R(0,4)}s;--x:${R(-34,34)}px"></i>`))}
}
