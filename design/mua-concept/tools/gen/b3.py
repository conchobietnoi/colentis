from lib import *
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
extra='''
.uc{position:relative;aspect-ratio:3/4;border-radius:6cqw;padding:3.6cqw;background:conic-gradient(from var(--r),#fff3c4,#FFB02E,#fff,#FF2E88,#8b5cff,#4CC9FF,#fff3c4);animation:spin 3s linear infinite,heart 1.7s ease-in-out infinite}
@keyframes heart{0%,100%{transform:scale(1)}8%{transform:scale(1.025)}16%{transform:scale(1)}24%{transform:scale(1.02)}32%{transform:scale(1)}}
.uc-aura{position:absolute;inset:-12%;border-radius:14cqw;z-index:-1;background:conic-gradient(from var(--r),#FFE45E,#FF2E88,#8b5cff,#4CC9FF,#FFE45E);filter:blur(7cqw);opacity:.9;animation:spin 3s linear infinite,aur2 1.7s ease-in-out infinite}
@keyframes aur2{0%,100%{opacity:.55}50%{opacity:1}}
.uc-in{position:relative;width:100%;height:100%;border-radius:3.4cqw;overflow:hidden;background:#05030f;isolation:isolate}
.uc-bg{position:absolute;inset:-12%;background:url(PANO) center/cover;filter:saturate(1.6) brightness(.85);animation:kb 10s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1.05) translateX(-6%)}to{transform:scale(1.25) translateX(6%)}}
.uc-pil{position:absolute;left:50%;top:-10%;width:30%;height:120%;margin-left:-15%;z-index:1;mix-blend-mode:screen;background:linear-gradient(90deg,transparent,rgba(255,240,180,.9),transparent);filter:blur(1.2cqw);animation:pil 1.7s ease-in-out infinite}
@keyframes pil{0%,100%{opacity:.35;transform:scaleX(.6)}50%{opacity:1;transform:scaleX(1.25)}}
.uc-ray{position:absolute;inset:-70%;z-index:2;mix-blend-mode:screen;opacity:.75;background:repeating-conic-gradient(from 0deg at 50% 62%,rgba(255,236,170,.95) 0 3deg,transparent 3deg 12deg);animation:spinr 14s linear infinite;-webkit-mask:radial-gradient(circle at 50% 62%,transparent 4%,#000 36%,transparent 72%);mask:radial-gradient(circle at 50% 62%,transparent 4%,#000 36%,transparent 72%)}
.uc-rg{position:absolute;left:50%;top:62%;width:60%;aspect-ratio:1;margin:-30% 0 0 -30%;border-radius:50%;border:.8cqw solid rgba(255,236,170,.95);z-index:3;box-shadow:0 0 4cqw rgba(255,226,140,.9),inset 0 0 4cqw rgba(255,226,140,.6);animation:ringx 2.8s ease-out infinite}
@keyframes ringx{0%{transform:scale(.2);opacity:1}100%{transform:scale(2.1);opacity:0}}
.uc-au{position:absolute;inset:0;z-index:5;mix-blend-mode:color-dodge;opacity:.7;background:linear-gradient(200deg,transparent 10%,rgba(255,0,150,.8) 30%,rgba(255,230,90,.8) 45%,rgba(60,255,190,.8) 58%,rgba(70,170,255,.8) 72%,transparent 90%);background-size:100% 300%;animation:aur 4s ease-in-out infinite}
@keyframes aur{0%,100%{background-position:0 0}50%{background-position:0 100%}}
.uc-pt{position:absolute;bottom:-4%;z-index:6;width:2.2cqw;height:2.2cqw;border-radius:50%;background:#fff;box-shadow:0 0 3cqw 1.2cqw rgba(255,226,140,.95);animation:rise 3.4s linear infinite}
@keyframes rise{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:1}100%{transform:translateY(-125cqw) scale(.3);opacity:0}}
.uc-p{position:absolute;left:50%;bottom:0;width:80%;transform:translateX(-50%);z-index:4;filter:drop-shadow(0 0 3cqw rgba(255,226,140,.8)) drop-shadow(0 0 1cqw #fff);animation:pf 3.4s ease-in-out infinite alternate}
@keyframes pf{from{transform:translateX(-50%) translateY(1%)}to{transform:translateX(-50%) translateY(-2%)}}
.uc-p img{width:100%;display:block;-webkit-mask:linear-gradient(180deg,#000 70%,transparent);mask:linear-gradient(180deg,#000 70%,transparent)}
.uc-bolt{position:absolute;inset:0;width:100%;height:100%;z-index:8;pointer-events:none;mix-blend-mode:screen}
.uc-bolt polyline{fill:none;stroke:#cfeeff;stroke-width:.9;stroke-linejoin:round;filter:drop-shadow(0 0 1.2px #7cf) drop-shadow(0 0 3px #7cf);animation:flk 2.2s steps(1) infinite;opacity:0}
.uc-bolt polyline.b2{animation-delay:.7s}.uc-bolt polyline.b3{animation-delay:1.3s}
@keyframes flk{0%,52%,100%{opacity:0}53%{opacity:1}55%{opacity:.2}57%{opacity:1}60%{opacity:0}}
.uc-t{position:absolute;left:0;right:0;top:4cqw;text-align:center;z-index:9}
.uc-t small{display:block;font:800 3cqw/1 'Be Vietnam Pro';letter-spacing:.4em;color:#FFE9A8;text-shadow:0 0 3cqw rgba(255,176,46,.9)}
.uc-t b{display:block;font:800 9.4cqw/1 'Unbounded';margin-top:2cqw;background:linear-gradient(180deg,#fff,#FFE45E 45%,#FFB02E 60%,#fff 80%);background-size:100% 300%;animation:ttlm 2.4s linear infinite;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 2cqw rgba(255,200,60,.9))}
@keyframes ttlm{from{background-position:0 0}to{background-position:0 300%}}
.uc-f{position:absolute;left:0;right:0;bottom:0;z-index:10;padding:9cqw 4cqw 4cqw;background:linear-gradient(0deg,rgba(5,3,15,.96) 34%,transparent);display:flex;justify-content:space-between;align-items:flex-end}
.uc-f b{font:800 6cqw/1 'Unbounded';color:#fff;text-shadow:0 0 2cqw #FFB02E}.uc-f i{font-style:normal;font:800 3cqw/1 'Be Vietnam Pro';letter-spacing:.14em;color:#FFE9A8}
.uc-sw{position:absolute;inset:-20%;z-index:11;mix-blend-mode:overlay;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,1) 50%,transparent 60%);background-size:300% 100%;animation:sweep 2.6s ease-in-out infinite}
.uc-pl{position:absolute;inset:0;border-radius:6cqw;border:1.1cqw solid #fff;filter:url(#plasma) drop-shadow(0 0 1.6cqw #FFE45E) drop-shadow(0 0 3.6cqw #FF2E88);z-index:12;pointer-events:none;mix-blend-mode:screen}
/* KHUNG TRÒN v2 */
.fx{position:relative;width:var(--w);height:var(--w);margin:0 auto}
.fx-aura{position:absolute;inset:-34%;border-radius:50%;background:conic-gradient(from var(--r),var(--a),transparent 20%,var(--c),transparent 45%,var(--a),transparent 70%,var(--c),transparent);filter:blur(var(--bl,10px));animation:spin 4s linear infinite,aur2 1.8s ease-in-out infinite;opacity:.9}
.fx-rays{position:absolute;inset:-48%;border-radius:50%;mix-blend-mode:screen;opacity:.7;background:repeating-conic-gradient(from 0deg,var(--c) 0 4deg,transparent 4deg 18deg);-webkit-mask:radial-gradient(circle,transparent 36%,#000 52%,transparent 72%);mask:radial-gradient(circle,transparent 36%,#000 52%,transparent 72%);animation:spinr 9s linear infinite}
.fr{position:absolute;inset:0;border-radius:50%;padding:8%;background:conic-gradient(from var(--r),var(--a),#fff,var(--c),#fff,var(--a));animation:spin 2.6s linear infinite,frg 1.8s ease-in-out infinite}
@keyframes frg{0%,100%{box-shadow:0 0 12px color-mix(in srgb,var(--a) 70%,transparent)}50%{box-shadow:0 0 34px 6px color-mix(in srgb,var(--a) 100%,transparent),0 0 60px color-mix(in srgb,var(--c) 70%,transparent)}}
.fr:before{content:"";position:absolute;inset:3.5%;border-radius:50%;border:2px dotted rgba(255,255,255,.85);animation:spinr 6s linear infinite reverse}
.fr img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.fx-o{position:absolute;inset:-4%;border-radius:50%;animation:spinr 2.2s linear infinite;pointer-events:none}
.fx-o:before{content:"";position:absolute;left:50%;top:-7%;width:13%;height:13%;margin-left:-6.5%;border-radius:50%;background:#fff;box-shadow:0 0 10px 4px #fff,0 0 22px 8px var(--a)}
.fx-o.o2{inset:-12%;animation-duration:3.4s;animation-direction:reverse}.fx-o.o2:before{background:var(--c);box-shadow:0 0 10px 4px var(--c),0 0 24px 8px var(--c);width:10%;height:10%}
.fx-s{position:absolute;width:20%;height:20%;background:#fff;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px var(--c));animation:tw 1.8s ease-in-out infinite}
.ttl{display:inline-block;padding:9px 26px;border-radius:99px;font:800 15px/1 'Unbounded';color:#1a0b00;background:linear-gradient(100deg,var(--b),var(--a),#fff,var(--a),var(--b));background-size:300% 100%;animation:ttlg 2.6s linear infinite,ttlp 1.8s ease-in-out infinite;position:relative;overflow:hidden}
@keyframes ttlg{from{background-position:0 0}to{background-position:300% 0}}
@keyframes ttlp{0%,100%{box-shadow:0 0 10px color-mix(in srgb,var(--a) 60%,transparent)}50%{box-shadow:0 0 30px 4px var(--a),0 0 50px color-mix(in srgb,var(--a) 60%,transparent)}}
@keyframes spinr{to{transform:rotate(360deg)}}
@keyframes sweep{0%{background-position:100% 0}100%{background-position:-70% 0}}
'''.replace('PANO',PANO)
BOLTS='<svg class="uc-bolt" viewBox="0 0 100 133" preserveAspectRatio="none"><polyline points="4,18 10,34 5,44 12,64 6,78 12,98"/><polyline class="b2" points="96,26 90,44 95,56 88,76 94,90 90,112"/><polyline class="b3" points="30,2 36,10 31,16 38,24"/></svg>'
PLASMA='<svg width="0" height="0" style="position:absolute"><filter id="plasma" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="3" result="t"><animate attributeName="seed" values="1;5;2;8;3;6" dur="1s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="t" scale="18"/></filter></svg>'
def ultra(i,w,no,name):
    pts=''.join(f'<span class="uc-pt" style="left:{x}%;animation-delay:{d}s"></span>' for x,d in [(8,0),(20,1.2),(34,.5),(48,2),(60,.9),(74,2.6),(86,.3),(94,1.7)])
    return f'''<div class="cw" style="width:{w}px">{PLASMA}<div class="tl"><div class="uc"><span class="uc-aura"></span><div class="uc-in"><div class="uc-bg"></div><div class="uc-pil"></div><div class="uc-ray"></div><span class="uc-rg"></span><span class="uc-rg" style="animation-delay:1.4s"></span><div class="uc-p"><img src="{M[i]}" alt="{name}"></div><div class="uc-au"></div>{pts}{BOLTS}<div class="uc-t"><small>ULTRA LIMITED</small><b>CONCEPT</b></div><div class="uc-f"><b>{name}</b><i>N°{no}/2</i></div><div class="uc-sw"></div></div><span class="uc-pl"></span></div></div></div>'''
def fr(con,i,w):
    n,a,b=CON[con]
    stars=''.join(f'<span class="fx-s" style="{p};animation-delay:{d}s"></span>' for p,d in [('left:-14%;top:6%',0),('right:-16%;top:30%',.6),('left:8%;bottom:-18%',1.2)])
    return f'<div class="fx" style="--w:{w}px;--a:{a};--c:{b};--bl:{max(6,w//9)}px"><div class="fx-aura"></div><div class="fx-rays"></div><div class="fr"><img src="{MM[con][i]}"></div><i class="fx-o"></i><i class="fx-o o2"></i>{stars}</div>'
def ttl(con):
    n,a,b=CON[con]
    return f'<span class="ttl" style="--a:{a};--b:{b}">{n}</span>'
body=f'''<div style="padding:30px 36px">
<div class="lab" style="color:#FFB02E">PHẦN THƯỞNG · MÙA CONCEPT</div>
<h1 style="margin:4px 0 22px;font-size:28px;font-weight:900;letter-spacing:-.6px">Khung, danh hiệu &amp; thẻ Ultra</h1>
<div style="display:flex;gap:34px;align-items:flex-start">
 <div style="width:560px">
  <div class="lab" style="margin-bottom:12px">MỖI CONCEPT ĐỦ 5 THẺ THƯỜNG → KHUNG TRÒN + DANH HIỆU</div>
  <div style="display:flex;gap:22px;justify-content:space-between">
   {''.join(f'<div style="text-align:center">{fr(c,c+1,96)}<div style="margin-top:34px">{ttl(c)}</div><div style="margin-top:8px;font-size:11px;font-weight:700;color:#A7A9E6">Concept {c}</div></div>' for c in (1,2,3))}
  </div>
  <div class="card" style="margin-top:28px"><b style="font-size:13px">Cách hiển thị</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.6">Khung tròn bọc ảnh đại diện, viền màu concept tự xoay và có vòng chấm trắng. Danh hiệu là viên thuốc ánh kim có vệt sáng quét. Mỗi concept một bảng màu riêng nên nhìn qua là biết ai gom concept nào.</p></div>
  <div class="card" style="margin-top:12px"><b style="font-size:13px">Panorama</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.6">Chạm panorama trong bộ sưu tập để xem toàn màn hình, xoay điện thoại thì ảnh đi theo, có nút thoát.</p></div>
  <div class="card" style="margin-top:12px"><b style="font-size:13px">Hiệu ứng thẻ Ultra</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.6">Viền vàng pha cầu vồng tự xoay · ảnh nền panorama trôi chậm · tia sáng xoay quanh member · cực quang quét dọc · hạt sáng bay lên · vệt bóng quét ngang. Nhiều lớp hơn hẳn thẻ Holo.</p></div>
 </div>
 <div>
  <div class="lab" style="margin-bottom:12px;color:#FFE9A8">ĐỦ CẢ 3 CONCEPT → 2 THẺ ULTRA LIMITED</div>
  <div style="display:flex;gap:22px">{ultra(0,230,1,'JAMES')}{ultra(4,230,2,'SEONGHYEON')}</div>
 </div>
</div></div>'''
open(OUT+'Rewards.dc.html','w',encoding='utf-8').write(page('Phần thưởng Mùa Concept',1280,820,body,extra))

# ================= UPCOMING + LICH TAB =================
def evrow(t,sub,date,state,col):
    lock = state!='live'
    return f'''<div style="display:flex;gap:12px;align-items:center;padding:12px;border-radius:16px;background:#201C52;border:2px solid {'#363078' if state!='live' else col};position:relative;overflow:hidden">
<div style="width:54px;height:54px;border-radius:14px;flex:none;background:linear-gradient(140deg,{col},#15123B);display:grid;place-items:center;font:800 18px 'Unbounded'">{'★' if state=='live' else '?'}</div>
<div style="flex:1;min-width:0"><b style="font-size:14px;font-weight:900;display:block">{t}</b><div style="font-size:11.5px;font-weight:600;color:#A7A9E6;margin-top:2px;line-height:1.4">{sub}</div></div>
<span style="font-size:10.5px;font-weight:900;padding:5px 10px;border-radius:99px;white-space:nowrap;background:{col if state=='live' else '#363078'};color:{'#1a0b00' if state=='live' else '#C7C6F5'}">{date}</span></div>'''
body=f'''<div style="padding:22px 14px">
<div style="font-size:11.5px;font-weight:700;color:#A7A9E6">Hôm nay · Thứ năm 15/10</div>
<h1 style="margin:2px 0 14px;font-size:23px;font-weight:900;letter-spacing:-.5px">Sự kiện</h1>
<div class="lab" style="margin:0 2px 8px">SẮP DIỄN RA</div>
<div style="display:flex;flex-direction:column;gap:10px">
{evrow('Mùa Concept','3 concept, 3 panorama, 2 thẻ Ultra · 17/10 – 26/10','17/10','soon',C1)}
{evrow('Sự kiện bí mật','Tiết lộ khi đến ngày, chỉ biết nó liên quan đến Lịch','01/11','soon','#7B61FF')}
{evrow('???','Sự kiện chưa công bố','15/11','soon','#35D0A5')}
</div>
<div class="lab" style="margin:22px 2px 8px">ĐÃ KẾT THÚC</div>
{evrow('Khai Mạc','5 mốc · 1 trong 5 Tag 1Y · 15/10 – 16/10','Xong','done','#FF2E88')}
<div style="margin-top:22px;padding:14px;border-radius:16px;border:2px dashed #363078;text-align:center;font-size:12px;font-weight:700;color:#A7A9E6;line-height:1.55">Đến ngày bắt đầu, sự kiện tự chuyển lên<br>banner ở đầu tab Lịch và Hôm nay.</div>
</div>'''
open(OUT+'Upcoming.dc.html','w',encoding='utf-8').write(page('Sự kiện sắp tới',390,760,body,extra))
print('ok')
