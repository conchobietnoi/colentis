from lib import *
from b3 import ultra, extra as EX3
from ub import UBCSS, back_u2
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
extra=r'''
/* ===== MẶT SAU THƯỜNG: HỒ SƠ GIẤY ===== */
.bn{position:relative;aspect-ratio:3/4;border-radius:6cqw;overflow:hidden;color:#2b1d0e;background:
 radial-gradient(circle at 20% 10%,rgba(255,255,255,.6),transparent 50%),
 repeating-linear-gradient(0deg,rgba(120,90,40,.05) 0 .3cqw,transparent .3cqw 1.6cqw),
 linear-gradient(160deg,#f7efdc,#e9dcbd);box-shadow:0 2.4cqw 6cqw rgba(0,0,0,.5)}
.bn:before{content:"";position:absolute;inset:3cqw;border-radius:3.6cqw;border:.5cqw solid var(--a);opacity:.7;pointer-events:none}
.bn-h{position:absolute;left:0;right:0;top:0;height:19cqw;background:linear-gradient(100deg,var(--a),color-mix(in srgb,var(--a) 60%,#3a1a00));display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff}
.bn-h:before{content:"";position:absolute;top:2.6cqw;left:50%;width:15cqw;height:3.4cqw;margin-left:-7.5cqw;border-radius:99px;background:#f3ead7;box-shadow:inset 0 .5cqw 1cqw rgba(0,0,0,.35)}
.bn-h small{margin-top:5cqw;font:800 2.8cqw/1 'Be Vietnam Pro';letter-spacing:.32em}
.bn-h b{font:800 5.6cqw/1.1 'Unbounded';margin-top:1.4cqw}
.bn-no{position:absolute;right:6cqw;top:22cqw;font:800 30cqw/.8 'Unbounded';color:var(--a);opacity:.16}
.bn-name{position:absolute;left:7cqw;top:23cqw;font:800 8cqw/1 'Unbounded';letter-spacing:-.02em}
.bn-name small{display:block;font:800 2.8cqw/1 'Be Vietnam Pro';letter-spacing:.22em;color:#8a6a3a;margin-bottom:1.6cqw}
.bn-rows{position:absolute;left:7cqw;right:7cqw;top:41cqw}
.bn-rows div{display:flex;align-items:baseline;gap:1.4cqw;font-size:3.6cqw;font-weight:700;margin-top:2.4cqw}
.bn-rows div:after{content:"";order:1;flex:1;border-bottom:.45cqw dotted #8a6a3a}
.bn-rows span{order:0;color:#8a6a3a;font-size:3cqw;font-weight:800;letter-spacing:.1em}
.bn-rows b{order:2;font-weight:900}
.bn-pz{position:absolute;left:7cqw;right:7cqw;top:67cqw}
.bn-pz small{display:block;font:800 2.6cqw/1 'Be Vietnam Pro';letter-spacing:.18em;color:#8a6a3a;margin-bottom:1.6cqw}
.bn-st{position:relative;height:17cqw;border-radius:1.6cqw;overflow:hidden;background:center/cover;border:.5cqw solid #2b1d0e}
.bn-st i{position:absolute;top:0;bottom:0;width:20%;background:rgba(30,18,6,.78)}
.bn-st b{position:absolute;top:0;bottom:0;width:20%;border:.8cqw solid #fff;box-shadow:0 0 3cqw 1cqw var(--a),inset 0 0 3cqw rgba(255,255,255,.6);animation:blk 1.6s ease-in-out infinite}
@keyframes blk{0%,100%{opacity:.55}50%{opacity:1}}
.bn-stamp{position:absolute;right:5cqw;top:52cqw;width:25cqw;height:25cqw;border-radius:50%;border:.9cqw double #c1272d;color:#c1272d;display:grid;place-items:center;text-align:center;font:800 3.2cqw/1.15 'Unbounded';transform:rotate(-14deg);opacity:.85;animation:thump 3.4s ease-in-out infinite;mix-blend-mode:multiply}
.bn-stamp small{display:block;font:800 2.2cqw 'Be Vietnam Pro';letter-spacing:.1em;margin-top:.8cqw}
@keyframes thump{0%,70%,100%{transform:rotate(-14deg) scale(1);opacity:.85}78%{transform:rotate(-14deg) scale(1.55);opacity:0}86%{transform:rotate(-14deg) scale(.92);opacity:1}}
.bn-bar{position:absolute;left:7cqw;right:7cqw;bottom:5cqw;display:flex;align-items:flex-end;justify-content:space-between}
.bn-bar i{display:block;width:44cqw;height:8cqw;background:repeating-linear-gradient(90deg,#2b1d0e 0 .6cqw,transparent .6cqw 1.2cqw,#2b1d0e 1.2cqw 2.4cqw,transparent 2.4cqw 2.9cqw,#2b1d0e 2.9cqw 3.3cqw,transparent 3.3cqw 4.4cqw)}
.bn-bar span{font:800 2.8cqw 'Be Vietnam Pro';letter-spacing:.14em;color:#8a6a3a;text-align:right}
/* ===== MẶT SAU HOLO: ỐNG KÍNH ===== */
.bh{position:relative;aspect-ratio:3/4;border-radius:6cqw;padding:3.4cqw;background:conic-gradient(from var(--r),#fff,#FF2E88,#FFE45E,#35D0A5,#4CC9FF,#8b5cff,#fff);animation:spin 3.6s linear infinite,glowH 2.2s ease-in-out infinite}
.bh-in{position:relative;width:100%;height:100%;border-radius:3.4cqw;overflow:hidden;background:radial-gradient(circle at 50% 44%,#14123e,#04030f 72%);isolation:isolate}
.bh-grid{position:absolute;inset:0;background:linear-gradient(rgba(120,220,255,.12) .3cqw,transparent .3cqw) 0 0/8cqw 8cqw,linear-gradient(90deg,rgba(120,220,255,.12) .3cqw,transparent .3cqw) 0 0/8cqw 8cqw;-webkit-mask:radial-gradient(circle at 50% 44%,#000,transparent 75%);mask:radial-gradient(circle at 50% 44%,#000,transparent 75%)}
.bh-hud{position:absolute;z-index:6;font:800 2.8cqw/1.3 'Be Vietnam Pro';letter-spacing:.14em;color:#8fe;text-shadow:0 0 1.4cqw #4cc9ff}
.bh-rec{left:5cqw;top:4.6cqw;display:flex;align-items:center;gap:1.4cqw}
.bh-rec:before{content:"";width:3cqw;height:3cqw;border-radius:50%;background:#ff2e4e;box-shadow:0 0 2cqw #ff2e4e;animation:blk 1s steps(1) infinite}
.bh-k{position:absolute;z-index:6;width:8cqw;height:8cqw;border:.7cqw solid #8fe;filter:drop-shadow(0 0 1cqw #4cc9ff)}
.bh-k.a{left:4cqw;top:4cqw;border-right:0;border-bottom:0}.bh-k.b{right:4cqw;top:4cqw;border-left:0;border-bottom:0}.bh-k.c{left:4cqw;bottom:4cqw;border-right:0;border-top:0}.bh-k.d{right:4cqw;bottom:4cqw;border-left:0;border-top:0}
.bh-lens{position:absolute;left:50%;top:44%;width:66cqw;height:66cqw;margin:-33cqw 0 0 -33cqw;border-radius:50%;z-index:3}
.bh-lens .ph{position:absolute;inset:7cqw;border-radius:50%;overflow:hidden;background-size:auto 260%;background-repeat:no-repeat;filter:saturate(1.5) contrast(1.1);animation:zoomL 6s ease-in-out infinite alternate}
@keyframes zoomL{from{transform:scale(1)}to{transform:scale(1.28)}}
.bh-lens .ph:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 36% 30%,rgba(255,255,255,.55),transparent 30%),radial-gradient(circle,transparent 55%,rgba(0,0,10,.7))}
.bh-ap{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(160,240,255,.95) 0 1.4deg,rgba(20,18,70,.88) 1.4deg 30deg);-webkit-mask:radial-gradient(circle,transparent 70%,#000 71%,#000 100%);mask:radial-gradient(circle,transparent 70%,#000 71%,#000 100%);animation:spinr 18s linear infinite}
.bh-r2{position:absolute;inset:3cqw;border-radius:50%;border:.8cqw dashed #fff;opacity:.8;animation:spinr 10s linear infinite reverse}
.bh-r3{position:absolute;inset:-2.4cqw;border-radius:50%;border:.5cqw solid #4cc9ff;box-shadow:0 0 4cqw #4cc9ff,inset 0 0 4cqw #4cc9ff;animation:glowP 2s ease-in-out infinite}
@keyframes glowP{0%,100%{opacity:.5}50%{opacity:1}}
.bh-fl{position:absolute;z-index:5;left:50%;top:44%;width:80cqw;height:.9cqw;margin:-.45cqw 0 0 -40cqw;background:linear-gradient(90deg,transparent,#fff,#4cc9ff,transparent);animation:flr 3s ease-in-out infinite;mix-blend-mode:screen}
@keyframes flr{0%,100%{opacity:0;transform:scaleX(.2)}50%{opacity:1;transform:scaleX(1)}}
.bh-sec{position:absolute;left:6cqw;right:6cqw;bottom:6cqw;z-index:6}
.bh-sec small{display:block;font:800 2.6cqw/1 'Be Vietnam Pro';letter-spacing:.28em;color:#ff7bd0}
.bh-sec b{display:block;font:800 5.4cqw/1.15 'Unbounded';margin-top:1.8cqw;background:linear-gradient(100deg,#fff,#aef,#ffe45e,#fff);background-size:250% 100%;animation:sweep 3s linear infinite;-webkit-background-clip:text;background-clip:text;color:transparent}
.bh-sec p{margin:1.8cqw 0 0;font-size:3cqw;font-weight:700;color:#9fb0ff;line-height:1.4}
.bh-bar{position:absolute;left:0;right:0;bottom:0;height:1.6cqw;z-index:6;background:linear-gradient(90deg,#ff2e88,#ffe45e,#35d0a5,#4cc9ff,#8b5cff,#ff2e88);background-size:200% 100%;animation:sweep 2s linear infinite}
/* ===== MẶT SAU ULTRA: HUY HIỆU VÀNG ===== */
.bu{position:relative;aspect-ratio:3/4;border-radius:6cqw;padding:3.6cqw;background:conic-gradient(from var(--r),#fff3c4,#b8731a,#fff3c4,#FFB02E,#6b3a00,#fff3c4);animation:spin 5s linear infinite,heart 2s ease-in-out infinite}
.bu-aura{position:absolute;inset:-12%;border-radius:14cqw;z-index:-1;background:radial-gradient(circle,rgba(255,200,60,.9),transparent 65%);filter:blur(6cqw);animation:aur2 2s ease-in-out infinite}
.bu-in{position:relative;width:100%;height:100%;border-radius:3.4cqw;overflow:hidden;background:radial-gradient(circle at 50% 38%,#3d2606,#120a02 62%,#050301);isolation:isolate}
.bu-gl{position:absolute;inset:0;background:repeating-radial-gradient(circle at 50% 38%,transparent 0 1.6cqw,rgba(255,200,80,.18) 1.6cqw 1.9cqw),repeating-conic-gradient(from 0deg at 50% 38%,rgba(255,200,80,.12) 0 .6deg,transparent .6deg 3deg);animation:glp 4s ease-in-out infinite alternate}
@keyframes glp{from{opacity:.35}to{opacity:1}}
.bu-med{position:absolute;left:50%;top:38%;width:68cqw;height:68cqw;margin:-34cqw 0 0 -34cqw}
.bu-med svg{position:absolute;inset:0;width:100%;height:100%}
.bu-ring{animation:spinr 26s linear infinite;transform-origin:50% 50%}
.bu-ring text{font:800 11px 'Be Vietnam Pro';letter-spacing:5px;fill:#FFE9A8}
.bu-core{position:absolute;inset:15cqw;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3c4,#FFB02E 45%,#6b3a00);box-shadow:0 0 6cqw rgba(255,200,60,.9),inset 0 0 4cqw rgba(0,0,0,.45);display:grid;place-items:center;overflow:hidden}
.bu-core:after{content:"";position:absolute;inset:-20%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.95) 50%,transparent 60%);background-size:300% 100%;animation:sweep 2.6s ease-in-out infinite;mix-blend-mode:overlay}
.bu-core svg{position:relative;inset:auto;width:70%;height:70%}
.bu-core circle.s{fill:#fff;filter:drop-shadow(0 0 2px #fff);animation:tw2 1.8s ease-in-out infinite}
@keyframes tw2{0%,100%{r:3}50%{r:5.5}}
.bu-core polyline{fill:none;stroke:#3b2200;stroke-width:1.6}
.bu-no{position:absolute;left:0;right:0;top:75cqw;text-align:center}
.bu-no small{display:block;font:800 2.8cqw/1 'Be Vietnam Pro';letter-spacing:.4em;color:#d8a24a}
.bu-no b{display:block;font:800 17cqw/1 'Unbounded';margin-top:1.4cqw;background:linear-gradient(180deg,#fff,#FFE45E 45%,#FFB02E 60%,#fff 85%);background-size:100% 300%;animation:ttlm 2.4s linear infinite;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 2cqw rgba(255,200,60,.8))}
.bu-own{position:absolute;left:7cqw;right:7cqw;bottom:6cqw;display:flex;justify-content:space-between;align-items:flex-end;font-size:3cqw;font-weight:700;color:#e9cf98}
.bu-own b{display:block;font:800 5cqw/1.1 'Unbounded';color:#fff;margin-top:1cqw}
.bu-own small{font-size:2.5cqw;font-weight:800;letter-spacing:.2em;color:#d8a24a}
.bu-seal{width:18cqw;height:18cqw;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff7a5a,#b3141c 55%,#5a0509);box-shadow:0 1cqw 3cqw rgba(0,0,0,.6),0 0 4cqw rgba(255,60,40,.5);display:grid;place-items:center;font:800 6cqw 'Unbounded';color:#ffd9b0;border:.7cqw dashed rgba(255,220,170,.7);animation:thump2 3s ease-in-out infinite}
@keyframes thump2{0%,80%,100%{transform:scale(1)}88%{transform:scale(1.14)}}
.bu-sw{position:absolute;inset:-20%;z-index:9;mix-blend-mode:overlay;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,1) 50%,transparent 60%);background-size:300% 100%;animation:sweep 3s ease-in-out infinite}
.bu-st{position:absolute;z-index:8;width:5cqw;height:5cqw;background:#fff;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);filter:drop-shadow(0 0 1.6cqw #FFE45E);animation:tw 2.2s ease-in-out infinite}
/* ===== LẬT THẺ ===== */
.fl{position:relative;aspect-ratio:3/4;transform-style:preserve-3d;animation:flipA 8s ease-in-out infinite}
.fl>.f{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.fl>.f.k{transform:rotateY(180deg)}
.fl .f>.cw>.tl,.fl .f>.cw{width:100%;height:100%}
.fl .f .bz,.fl .f .uc,.fl .f .nc,.fl .f .hc,.fl .f .bn,.fl .f .bh,.fl .f .bu{width:100%;height:100%;animation-play-state:running}
.fl .f .tl{animation:none}
@keyframes flipA{0%,34%{transform:rotateY(0)}44%,84%{transform:rotateY(180deg)}94%,100%{transform:rotateY(360deg)}}
.col{display:flex;flex-direction:column;gap:12px;align-items:flex-start}
.tg{display:inline-block;padding:4px 10px;border-radius:99px;font-size:10.5px;font-weight:900;letter-spacing:.08em;background:#201C52;border:1.5px solid #363078}
@keyframes heart{0%,100%{transform:scale(1)}8%{transform:scale(1.025)}16%{transform:scale(1)}24%{transform:scale(1.02)}32%{transform:scale(1)}}
@keyframes aur2{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes ttlm{from{background-position:0 0}to{background-position:0 300%}}
@keyframes spinr{to{transform:rotate(360deg)}}
@keyframes sweep{0%{background-position:100% 0}100%{background-position:-70% 0}}
@keyframes tw{0%,100%{transform:scale(.2) rotate(0);opacity:0}50%{transform:scale(1) rotate(90deg);opacity:1}}
'''.replace('PANO',PANO)

NAMES=MEM
FACTS={1:['áo khoác caro, mắt nhìn thẳng vào máy','áo track navy, tay đặt lên vai bạn','áo len xanh, mái tóc rẽ giữa','áo xanh chuối, vẻ lười biếng','áo ba lỗ trắng, cúi sát ống kính'],
 2:['cầm chai nước, ngó quanh phòng','áo track navy, quay đầu nhìn sang','há miệng ăn, chiếc thìa nhỏ trong tay','ngồi ăn cốc đá bào cạnh bàn mixing','trùm mũ, hút cốc nước tím'],
 3:['giơ tay đỡ cần micro','đeo tai nghe, mắt tròn xoe','đút bạn ăn, cốc nước tím trên tay','gầm gừ trước micro, đeo tai nghe','áp khăn lên tai như nghe lén']}
def back_n(i,con=1,w=290):
    n,a,b=CON[con]
    slices=''.join(f'<i style="left:{k*20}%"></i>' for k in range(5) if k!=i)
    return f'''<div class="cw" style="width:{w}px"><div class="bn" style="--a:{a}"><div class="bn-h"><small>MÙA CONCEPT 2026</small><b>HỒ SƠ · {n.upper()}</b></div><div class="bn-no">{i+1:02d}</div><div class="bn-name"><small>THÀNH VIÊN</small>{NAMES[i]}</div><div class="bn-rows"><div><span>CONCEPT</span><b>{n}</b></div><div><span>MẢNH</span><b>{i+1} / 5</b></div><div><span>HẠNG</span><b>Thường</b></div></div><div class="bn-stamp"><div>ĐÃ GOM<small>17.10.2026</small></div></div><div class="bn-pz"><small>VỊ TRÍ TRONG PANORAMA</small><div class="bn-st" style="background-image:url({PANOS[con]})">{slices}<b style="left:{i*20}%"></b></div></div><div class="bn-bar"><i></i><span>SỐ SERI<br>CC-{con}{i+1:02d}-0417</span></div></div></div>'''
def back_h(i,con=1,w=290):
    n,a,b=CON[con]
    px=['0%','25%','50%','75%','100%'][i]
    return f'''<div class="cw" style="width:{w}px"><div class="bh"><div class="bh-in"><div class="bh-grid"></div><span class="bh-k a"></span><span class="bh-k b"></span><span class="bh-k c"></span><span class="bh-k d"></span><div class="bh-hud bh-rec">REC · 17:10:26</div><div class="bh-hud" style="right:6cqw;top:4.6cqw;text-align:right">ISO 400<br>f/1.8</div><div class="bh-lens"><div class="ph" style="background-image:url({PANOS[con]});background-position:{lens_pos(con,i)}"></div><div class="bh-ap"></div><div class="bh-r2"></div><div class="bh-r3"></div></div><span class="bh-fl"></span><div class="bh-hud" style="left:6cqw;top:80cqw;transform:rotate(-90deg);transform-origin:left top;display:none">ZOOM</div><div class="bh-sec"><small>CẬN CẢNH BÍ MẬT · ZOOM 5×</small><b>Mảnh {i+1:02d} giấu một chi tiết</b><p>Nhìn kỹ trong ống kính: {FACTS[con][i]}. Chỉ thẻ Holo mới thấy.</p></div><span class="bh-bar"></span></div></div></div>'''
def back_u(no,w=290):
    st=''.join(f'<span class="bu-st" style="left:{x}%;top:{y}%;animation-delay:{d}s"></span>' for x,y,d in [(10,12,0),(86,16,.6),(8,56,1.1),(88,52,1.7),(48,6,.3)])
    return f'''<div class="cw" style="width:{w}px"><div class="bu"><span class="bu-aura"></span><div class="bu-in"><div class="bu-gl"></div>{st}
<div class="bu-med"><svg class="bu-ring" viewBox="0 0 200 200"><defs><path id="cp{no}" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"/></defs><circle cx="100" cy="100" r="97" fill="none" stroke="#FFB02E" stroke-width="1.5" stroke-dasharray="2 5"/><text><textPath href="#cp{no}">MÙA CONCEPT ✦ ULTRA LIMITED ✦ 2026 ✦ CHỈ 2 THẺ ✦ </textPath></text></svg>
<div class="bu-core"><svg viewBox="0 0 100 100"><polyline points="50,16 82,72 18,72 50,16"/><circle class="s" cx="50" cy="16" r="3.5"/><circle class="s" cx="82" cy="72" r="3.5" style="animation-delay:.6s"/><circle class="s" cx="18" cy="72" r="3.5" style="animation-delay:1.2s"/></svg></div></div>
<div class="bu-no"><small>SỐ THỨ TỰ</small><b>{no} / 2</b></div>
<div class="bu-own"><div><small>CHỦ SỞ HỮU</small><b>đời loz</b><small style="display:block;margin-top:1.6cqw">CẤP NGÀY 30.10.2026</small></div><div class="bu-seal">★</div></div><div class="bu-sw"></div></div></div></div>'''
def flip(front,back,w):
    return f'<div class="cw" style="width:{w}px"><div class="fl"><div class="f">{front}</div><div class="f k">{back}</div></div></div>'

body=f'''<div style="padding:30px 36px;width:1500px">
<div class="lab" style="color:#FFB02E">MẶT SAU THẺ · MÙA CONCEPT</div>
<h1 style="margin:4px 0 6px;font-size:28px;font-weight:900;letter-spacing:-.6px">Mỗi hạng thẻ một mặt sau khác hẳn</h1>
<p style="margin:0;font-size:13px;font-weight:600;color:#A7A9E6;max-width:760px;line-height:1.55">Không chỉ đổi hiệu ứng: mỗi loại là một vật thể khác. Thẻ thường là hồ sơ giấy có tem đóng dấu. Thẻ Holo là ống kính máy ảnh nhìn xuyên vào panorama. Thẻ Ultra chỉ có một mặt: đĩa than trượt ra khỏi thẻ để nghe nhạc.</p>
<div style="display:flex;gap:44px;margin-top:28px;align-items:flex-start">
 <div class="col"><span class="tg" style="color:#FFB02E;border-color:#FFB02E">THƯỜNG · HỒ SƠ GIẤY</span>{back_n(0,1,300)}
  <div style="max-width:300px;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.6"><b style="color:#F1F0FF">Vì sao muốn gom:</b> mặt sau cho thấy tấm này là mảnh số mấy của panorama (ô sáng nhấp nháy). Dấu "ĐÃ GOM" đóng lên kèm ngày nhận thật. Số seri riêng cho từng thẻ.</div></div>
 <div class="col"><span class="tg" style="color:#aef;border-color:#4cc9ff">HOLO · ỐNG KÍNH</span>{back_h(0,1,300)}
  <div style="max-width:300px;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.6"><b style="color:#F1F0FF">Vì sao muốn gom:</b> ống kính zoom 5× vào đúng mảnh panorama của thẻ, lộ ra một chi tiết nhỏ mà thẻ thường không có. Mỗi thẻ Holo một chi tiết bí mật khác nhau, gom đủ 5 là đọc hết.</div></div>
 <div class="col"><span class="tg" style="color:#FFE45E;border-color:#FFB02E">ULTRA · MỘT MẶT</span>
  <div style="width:300px;aspect-ratio:3/4;border-radius:18px;border:2px dashed #FFB02E;display:grid;place-items:center;text-align:center;padding:26px;font-size:13px;font-weight:700;color:#FFE9A8;line-height:1.6">Thẻ Ultra không có mặt sau.<br>Chạm thẻ, hai đĩa than trượt ra từ sau thẻ để chọn bài nghe.<br><br><span style="color:#A7A9E6;font-weight:600;font-size:12px">Xem bảng "Ultra · chọn đĩa &amp; nghe nhạc".</span></div></div>
</div>
<div class="lab" style="margin:34px 0 14px">LẬT THẺ (BẤM VÀO THẺ TRONG APP): MẶT TRƯỚC → MẶT SAU</div>
<div style="display:flex;gap:44px">
 {flip(ncard(2,1,200),back_n(2,1,200),200)}
 {flip(hcard(2,1,200),back_h(2,1,200),200)}
</div>
<div class="lab" style="margin:34px 0 14px">THẺ THƯỜNG · 3 CONCEPT = 3 MÀU GIẤY &amp; ĐẦU PHIẾU</div>
<div style="display:flex;gap:18px">{back_n(0,1,200)}{back_n(1,2,200)}{back_n(2,3,200)}{back_n(3,1,200)}{back_n(4,2,200)}</div>
<div class="lab" style="margin:34px 0 14px">THẺ HOLO · MỖI THẺ ZOOM VÀO MỘT ĐOẠN KHÁC CỦA PANORAMA</div>
<div style="display:flex;gap:18px">{''.join(back_h(i,1,200) for i in range(5))}</div>
</div>'''
open(OUT+'Backs.dc.html','w',encoding='utf-8').write(page('Mặt sau thẻ',1572,2380,body,EX3+extra+UBCSS))
print('ok')
