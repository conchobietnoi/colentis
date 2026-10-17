from lib import *
UBCSS=r'''
/* ===== ULTRA BACK v2: SÂN KHẤU ĐĨA VÀNG ===== */
.bz{position:relative;aspect-ratio:3/4;border-radius:6cqw;padding:3.6cqw;background:conic-gradient(from var(--r),#fff3c4,#b8731a,#fff,#FF2E88,#FFB02E,#4CC9FF,#fff3c4);animation:spin 3.4s linear infinite,heart 1.8s ease-in-out infinite}
.bz-aura{position:absolute;inset:-12%;border-radius:14cqw;z-index:-1;background:conic-gradient(from var(--r),#FFE45E,#FF2E88,#8b5cff,#4CC9FF,#FFE45E);filter:blur(7cqw);opacity:.85;animation:spin 3s linear infinite,aur2 1.8s ease-in-out infinite}
.bz-in{position:relative;width:100%;height:100%;border-radius:3.4cqw;overflow:hidden;background:radial-gradient(circle at 50% 38%,#2b0f48,#0c0418 58%,#030108);isolation:isolate}
.bz-sp{position:absolute;top:-8%;width:34%;height:130%;z-index:1;mix-blend-mode:screen;opacity:.8;transform-origin:50% 0;background:linear-gradient(180deg,rgba(255,255,255,.9),var(--c) 30%,transparent 92%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);animation:swing 3.6s ease-in-out infinite alternate}
.bz-sp.s1{left:2%;--c:rgba(255,46,136,.6)}.bz-sp.s2{left:33%;--c:rgba(255,226,120,.7);animation-delay:-1.2s;animation-duration:4.2s}.bz-sp.s3{left:64%;--c:rgba(76,201,255,.6);animation-delay:-2.4s}
@keyframes swing{from{transform:rotate(-20deg)}to{transform:rotate(20deg)}}
.bz-gl{position:absolute;inset:0;z-index:8;mix-blend-mode:screen;pointer-events:none}
.bz-gl.g1{background:radial-gradient(circle,#fff 0 .5cqw,transparent .65cqw) 0 0/6cqw 7cqw;animation:gl 1.2s steps(1) infinite}
.bz-gl.g2{background:radial-gradient(circle,#ffe45e 0 .45cqw,transparent .6cqw) 2.5cqw 3cqw/8cqw 6cqw;animation:gl 1.6s steps(1) infinite .4s}
.bz-gl.g3{background:radial-gradient(circle,#ff8ad8 0 .4cqw,transparent .55cqw) 4cqw 1cqw/7cqw 9cqw;animation:gl 1s steps(1) infinite .7s}
.bz-gl.g4{background:radial-gradient(circle,#9ff 0 .4cqw,transparent .55cqw) 1cqw 5cqw/9cqw 8cqw;animation:gl 1.9s steps(1) infinite .2s}
.bz-rib{position:absolute;left:0;right:0;top:4.4cqw;text-align:center;z-index:9}
.bz-rib small{display:block;font:800 2.8cqw/1 'Be Vietnam Pro';letter-spacing:.42em;color:#FFE9A8;text-shadow:0 0 3cqw rgba(255,176,46,.9)}
.bz-rib b{display:block;font:800 7.2cqw/1 'Unbounded';margin-top:1.8cqw;background:linear-gradient(180deg,#fff,#FFE45E 45%,#FF2E88 62%,#fff 85%);background-size:100% 300%;animation:ttlm 2.4s linear infinite;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 2cqw rgba(255,150,60,.9))}
.bz-disc{position:absolute;left:50%;top:41%;width:62cqw;height:62cqw;margin:-31cqw 0 0 -31cqw;z-index:4}
.bz-wv{position:absolute;inset:0;z-index:0}
.bz-wv u{position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(var(--a)) translateY(-37cqw)}
.bz-wv i{position:absolute;left:-.55cqw;top:0;width:1.1cqw;height:6cqw;border-radius:99px;transform-origin:50% 0;background:linear-gradient(180deg,#fff,var(--k));box-shadow:0 0 1.6cqw var(--k);animation:wvb .6s ease-in-out infinite alternate}
@keyframes wvb{from{transform:scaleY(.25)}to{transform:scaleY(1.45)}}
.bz-rec{position:absolute;inset:0;border-radius:50%;z-index:1;background:radial-gradient(circle,#000 0 3%,transparent 3.5%),repeating-radial-gradient(circle,rgba(0,0,0,.28) 0 .35cqw,rgba(255,255,255,.1) .35cqw .8cqw),conic-gradient(from 0deg,#fff3c4,#c8851c,#6b3a00,#ffd77a,#fff,#c8851c,#6b3a00,#ffd77a,#fff3c4);box-shadow:0 0 7cqw rgba(255,190,60,.85),inset 0 0 4cqw rgba(0,0,0,.5);animation:spinr 5s linear infinite}
.bz-rec:before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 30deg,transparent,rgba(255,255,255,.85),transparent 14%,transparent 50%,rgba(255,255,255,.7),transparent 64%)}
.bz-lb{position:absolute;left:50%;top:50%;width:22cqw;height:22cqw;margin:-11cqw 0 0 -11cqw;border-radius:50%;z-index:2;background:radial-gradient(circle,#ff2e88,#7a0f4a);border:.8cqw solid #FFE9A8;display:grid;place-items:center;text-align:center;box-shadow:0 0 3cqw rgba(255,46,136,.8);animation:spinr 5s linear infinite}
.bz-lb b{font:800 6.6cqw/1 'Unbounded';color:#fff;text-shadow:0 0 1.6cqw #000}
.bz-lb small{display:block;font:800 1.9cqw 'Be Vietnam Pro';letter-spacing:.2em;color:#FFE9A8;margin-top:.6cqw}
.bz-lb:after{content:"";position:absolute;left:50%;top:50%;width:2.2cqw;height:2.2cqw;margin:-1.1cqw;border-radius:50%;background:#050208;border:.4cqw solid #FFE9A8}
.bz-arm{position:absolute;right:3cqw;top:11cqw;width:36cqw;height:2cqw;z-index:6;transform-origin:92% 50%;transform:rotate(-142deg);animation:arm 6s ease-in-out infinite alternate}
.bz-arm:before{content:"";position:absolute;inset:0;border-radius:99px;background:linear-gradient(180deg,#fff,#b9a171 50%,#5b4620);box-shadow:0 1cqw 2cqw rgba(0,0,0,.6)}
.bz-arm:after{content:"";position:absolute;left:-3cqw;top:-1.6cqw;width:6.4cqw;height:5cqw;border-radius:1cqw;background:linear-gradient(180deg,#ffe9a8,#c8851c);box-shadow:0 0 2cqw rgba(255,200,60,.8)}
@keyframes arm{from{transform:rotate(-146deg)}to{transform:rotate(-136deg)}}
.bz-piv{position:absolute;right:1.4cqw;top:7.6cqw;width:9cqw;height:9cqw;border-radius:50%;z-index:7;background:radial-gradient(circle at 35% 30%,#fff3c4,#c8851c 55%,#5b3300);box-shadow:0 0 3cqw rgba(255,200,60,.9)}
.bz-sd{position:absolute;left:5cqw;right:5cqw;bottom:14.5cqw;z-index:9;display:flex;flex-direction:column;gap:1.6cqw}
.bz-sd div{display:flex;align-items:center;gap:2.4cqw;padding:1.8cqw 3cqw;border-radius:99px;background:linear-gradient(100deg,rgba(255,176,46,.28),rgba(255,46,136,.26));border:.45cqw solid rgba(255,233,168,.7);box-shadow:0 0 2.4cqw rgba(255,176,46,.5);overflow:hidden;position:relative}
.bz-sd div:after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.85) 50%,transparent 60%);background-size:300% 100%;animation:sweep 2.8s ease-in-out infinite;mix-blend-mode:overlay}
.bz-sd em{font-style:normal;font:800 2.6cqw/1 'Be Vietnam Pro';letter-spacing:.16em;color:#0c0418;background:#FFE9A8;border-radius:99px;padding:1.2cqw 2.2cqw;white-space:nowrap}
.bz-sd b{font:800 4.2cqw/1 'Unbounded';color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 0 1.6cqw #FFB02E}
.bz-sd span{margin-left:auto;font-size:4.2cqw;color:#FFE45E;text-shadow:0 0 1.6cqw #FFB02E}
.bz-ft{position:absolute;left:5cqw;right:5cqw;bottom:4.4cqw;z-index:9;display:flex;justify-content:space-between;align-items:flex-end}
.bz-ft small{display:block;font:800 2.3cqw/1 'Be Vietnam Pro';letter-spacing:.2em;color:#d8a24a}
.bz-ft b{display:block;font:800 4.4cqw/1.1 'Unbounded';color:#fff;margin-top:.8cqw}
.bz-seal{width:13cqw;height:13cqw;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff7a5a,#b3141c 55%,#5a0509);box-shadow:0 1cqw 3cqw rgba(0,0,0,.6),0 0 4cqw rgba(255,60,40,.5);display:grid;place-items:center;font:800 5cqw 'Unbounded';color:#ffd9b0;border:.6cqw dashed rgba(255,220,170,.7);animation:thump2 3s ease-in-out infinite}
.bz-nt{position:absolute;z-index:8;font-size:6.4cqw;color:#FFE45E;text-shadow:0 0 2cqw #FFB02E;animation:nrise2 3.6s ease-out infinite;opacity:0}
@keyframes nrise2{0%{transform:translateY(0) rotate(0);opacity:0}15%{opacity:1}100%{transform:translateY(-46cqw) rotate(24deg);opacity:0}}
.bz-sw{position:absolute;inset:-20%;z-index:12;mix-blend-mode:overlay;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,1) 50%,transparent 60%);background-size:300% 100%;animation:sweep 2.8s ease-in-out infinite}
.bz-st{position:absolute;z-index:10;width:7cqw;height:7cqw;background:#fff;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);filter:drop-shadow(0 0 1.8cqw #FFE45E) drop-shadow(0 0 3cqw #ff8ad8);animation:tw 2s ease-in-out infinite}
@keyframes thump2{0%,80%,100%{transform:scale(1)}88%{transform:scale(1.14)}}
@keyframes heart{0%,100%{transform:scale(1)}8%{transform:scale(1.025)}16%{transform:scale(1)}24%{transform:scale(1.02)}32%{transform:scale(1)}}
@keyframes aur2{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes ttlm{from{background-position:0 0}to{background-position:0 300%}}
@keyframes spinr{to{transform:rotate(360deg)}}
@keyframes sweep{0%{background-position:100% 0}100%{background-position:-70% 0}}
@keyframes tw{0%,100%{transform:scale(.2) rotate(0);opacity:0}50%{transform:scale(1) rotate(90deg);opacity:1}}
@keyframes gl{0%{opacity:.1}25%{opacity:1}50%{opacity:.2}75%{opacity:.9}100%{opacity:.1}}
'''
def back_u2(w=290,no=1,a='GO!',b='REDRED',owner='đời loz',date='30.10.2026'):
    cols=['#ff2e88','#ffe45e','#4cc9ff','#35d0a5','#ff8ad8','#fff']
    bars=''.join(f'<u style="--a:{k*360/44:.1f}deg"><i style="--k:{cols[k%6]};animation-delay:{(k*0.071)%0.6:.2f}s;animation-duration:{0.38+((k*29)%30)/100:.2f}s"></i></u>' for k in range(44))
    sts=''.join(f'<span class="bz-st" style="left:{x}%;top:{y}%;animation-delay:{d}s"></span>' for x,y,d in [(7,15,0),(86,14,.6),(5,50,1.1),(88,48,1.6),(46,2,.3),(80,70,.9),(10,72,1.9)])
    nts=''.join(f'<span class="bz-nt" style="left:{x}%;top:{y}%;animation-delay:{d}s">{s}</span>' for x,y,d,s in [(14,56,0,'♪'),(78,60,1.2,'♫'),(26,62,2.2,'♬'),(66,64,.6,'♪')])
    return f'''<div class="cw" style="width:{w}px"><div class="bz"><span class="bz-aura"></span><div class="bz-in"><span class="bz-sp s1"></span><span class="bz-sp s2"></span><span class="bz-sp s3"></span>
<div class="bz-rib"><small>ULTRA LIMITED · SOUND</small><b>ĐĨA VÀNG</b></div>
<div class="bz-disc"><div class="bz-wv">{bars}</div><div class="bz-rec"></div><div class="bz-lb"><div><b>{no}/2</b><small>CORTIS</small></div></div></div>
<span class="bz-piv"></span><span class="bz-arm"></span>
{sts}{nts}
<div class="bz-sd"><div><em>A</em><b>{a}</b><span>♪</span></div><div><em>B</em><b>{b}</b><span>♪</span></div></div>
<div class="bz-ft"><div><small>CHỦ SỞ HỮU</small><b>{owner}</b><small style="margin-top:1cqw">CẤP NGÀY {date}</small></div><div class="bz-seal">★</div></div>
<span class="bz-gl g1"></span><span class="bz-gl g2"></span><span class="bz-gl g3"></span><span class="bz-gl g4"></span><div class="bz-sw"></div></div></div></div>'''
