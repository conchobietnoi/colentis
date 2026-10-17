PANO='/_blob/f730f2dd4f477387495cedf54a3913b2'
M_OLD=['/_blob/d3fbf8dea4d250524f14db9b20dd5431','/_blob/3a14f84c82690cee61c810f53afc5968','/_blob/0bf9b51a2c59accbeabe5d5c791115f7','/_blob/b9a49f78ee35869b7f3b54a6b227e197','/_blob/6572efd620667c1d713a94d31795aa23']
PANOS={1:'/_blob/f730f2dd4f477387495cedf54a3913b2',2:'/_blob/484fcef07c4335075fec501a08f1b00d',3:'/_blob/82135d43d2d2516c9c56952f8a7b2d7e'}
PANO_AR={1:3200/872,2:3200/534,3:3200/1023}
MM={1:['/_blob/9b3657bf78f9debc45654b412d45e46e','/_blob/7f3a0d5d84f7f9d4291ccd84d6269872','/_blob/e6664c8ce73f1683c62d87f9355da480','/_blob/6910cde8e984b316e9ab26144bcacfb9','/_blob/e8bc69d2a0ef3c5809440db91f604866'],
 2:['/_blob/a4322f2c1c6e62b3912f802a7dcc6ce6','/_blob/90bd6a80c9ec86fd707bc45d60eaa4f7','/_blob/87e85549ca72b3c4f7122e2d9d87357c','/_blob/1129421846df7be4127d35d7695e1a4b','/_blob/07bcb16975b6f9ecb2df531abad5d56d'],
 3:['/_blob/656b5da2ae3359ca633b20430f00cfc7','/_blob/abf851c6f9764a7c72c682ce5d7035d0','/_blob/f7972e8a903a9fb9e0c8c2821cd04871','/_blob/f07c441f3163eeb01e8e1702e8cb0e9e','/_blob/bbab3816b7dd5e6405fc9d8d756e4244']}
M=MM[1]
MEM=['JAMES','JUHOON','KEONHO','MARTIN','SEONGHYEON']
# vị trí mặt member trong panorama (x,y theo tỉ lệ ảnh) để ống kính zoom đúng chỗ
FACE={1:[(215/2000,268/545),(365/2000,205/545),(540/2000,255/545),(680/2000,190/545),(885/2000,230/545)],
 2:[(1600/2000,125/334),(1885/2000,150/334),(1195/2000,125/334),(632/2000,190/334),(400/2000,185/334)],
 3:[(1690/2000,180/640),(650/2000,215/640),(1250/2000,230/640),(1070/2000,180/640),(300/2000,190/640)]}
def lens_pos(con,i,z=2.6,wc=52):
    fx,fy=FACE[con][i]; ar=PANO_AR[con]
    wi=z*wc*ar; p=(fx*wi-wc/2)/(wi-wc)*100
    q=(fy*z-.5)/(z-1)*100
    return '%.1f%% %.1f%%'%(max(0,min(100,p)),max(0,min(100,q)))
C1,C2,C3='#FFB02E','#FF2E88','#4CC9FF'

CSS='''
*{box-sizing:border-box}
body{margin:0;font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#15123B;color:#F1F0FF}
button{font-family:inherit}
@property --r{syntax:'<angle>';inherits:false;initial-value:0deg}
.cw{container-type:inline-size}
/* ---------- THẺ THƯỜNG: "phim slide" ---------- */
.nc{position:relative;aspect-ratio:3/4;border-radius:6cqw;padding:3cqw;background:linear-gradient(150deg,var(--b),var(--a) 52%,color-mix(in srgb,var(--a) 50%,#1a0b00));box-shadow:0 2.4cqw 6cqw rgba(0,0,0,.5),inset 0 0 0 .7cqw rgba(255,255,255,.6)}
.nc-in{position:relative;width:100%;height:100%;border-radius:3.6cqw;overflow:hidden;background:#000}
.nc-in img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.nc-in:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.28),transparent 24%,transparent 56%,rgba(5,3,14,.92));pointer-events:none}
.nc-no{position:absolute;left:3.4cqw;top:2.8cqw;z-index:2;font:800 6.4cqw/1 'Unbounded',sans-serif;color:#fff;text-shadow:0 .4cqw 1.6cqw rgba(0,0,0,.6)}
.nc-no small{font-size:3.1cqw;font-weight:600;opacity:.8;margin-left:.6cqw}
.nc-tag{position:absolute;right:3cqw;top:3cqw;z-index:2;padding:1.3cqw 2.6cqw;border-radius:99px;background:rgba(10,8,30,.62);border:.35cqw solid rgba(255,255,255,.5);font-size:2.9cqw;font-weight:800;letter-spacing:.12em;color:#fff;backdrop-filter:blur(2px)}
.nc-cap{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:2.6cqw 3.6cqw 3.4cqw;border-top:.45cqw dashed rgba(255,255,255,.55);margin:0 0 0;display:flex;justify-content:space-between;align-items:flex-end}
.nc-cap b{font:800 5.6cqw/1.05 'Unbounded',sans-serif;color:#fff;letter-spacing:-.01em}
.nc-cap i{font-style:normal;font-size:2.8cqw;font-weight:800;letter-spacing:.1em;color:var(--b)}
.nc-k{position:absolute;width:5cqw;height:5cqw;border:.7cqw solid rgba(255,255,255,.9);z-index:3}
.nc-k.a{left:5.2cqw;top:5.2cqw;border-right:0;border-bottom:0;border-radius:1.4cqw 0 0 0;display:none}
/* ---------- THẺ HOLO: "lăng kính" ---------- */
.hc{position:relative;aspect-ratio:3/4;border-radius:6cqw;padding:3.4cqw;background:conic-gradient(from var(--r),#fff,#FF2E88,#FFE45E,#35D0A5,#4CC9FF,#8b5cff,#fff);animation:spin 5s linear infinite;box-shadow:0 0 7cqw rgba(123,97,255,.55),0 2.4cqw 6cqw rgba(0,0,0,.55)}
@keyframes spin{to{--r:360deg}}
.hc-in{position:relative;width:100%;height:100%;border-radius:3.4cqw;overflow:hidden;background:#06041a;isolation:isolate}
.hc-in img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;filter:saturate(1.2) contrast(1.05)}
.hc-tex{position:absolute;inset:0;z-index:2;mix-blend-mode:overlay;background:repeating-linear-gradient(62deg,rgba(255,255,255,.22) 0 .35cqw,transparent .35cqw 2.6cqw),repeating-linear-gradient(-28deg,rgba(255,255,255,.1) 0 .3cqw,transparent .3cqw 3.4cqw)}
.hc-foil{position:absolute;inset:-10%;z-index:3;mix-blend-mode:color-dodge;opacity:.78;background:linear-gradient(115deg,transparent 22%,rgba(255,0,150,.65) 32%,rgba(255,230,90,.65) 41%,rgba(60,255,190,.65) 50%,rgba(70,170,255,.65) 59%,rgba(150,90,255,.65) 68%,transparent 80%);background-size:280% 100%;animation:sweep 3.8s ease-in-out infinite}
@keyframes sweep{0%{background-position:100% 0}100%{background-position:-70% 0}}
.hc-sh{position:absolute;z-index:4;mix-blend-mode:screen;background:linear-gradient(135deg,rgba(255,255,255,.75),rgba(120,200,255,.0));animation:shard 3.8s ease-in-out infinite}
.hc-sh.s1{left:-8%;top:8%;width:46%;height:34%;clip-path:polygon(0 0,100% 18%,34% 100%)}
.hc-sh.s2{right:-6%;top:34%;width:40%;height:30%;clip-path:polygon(100% 0,100% 100%,0 62%);animation-delay:1.1s}
.hc-sh.s3{left:20%;bottom:20%;width:34%;height:22%;clip-path:polygon(0 100%,70% 0,100% 100%);animation-delay:2s}
@keyframes shard{0%,100%{opacity:0}45%,55%{opacity:.7}}
.hc-st{position:absolute;z-index:5;width:5.4cqw;height:5.4cqw;background:#fff;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);animation:tw 2.4s ease-in-out infinite}
@keyframes tw{0%,100%{transform:scale(.2) rotate(0);opacity:0}50%{transform:scale(1) rotate(90deg);opacity:1}}
.hc-badge{position:absolute;right:3cqw;top:3cqw;z-index:6;padding:1.4cqw 3cqw;border-radius:99px;font:800 3cqw/1 'Unbounded',sans-serif;letter-spacing:.1em;color:#0a0818;background:linear-gradient(100deg,#fff,#FFE45E,#4CC9FF,#fff);background-size:220% 100%;animation:sweep 3s linear infinite}
.hc-no{position:absolute;left:3.4cqw;top:2.8cqw;z-index:6;font:800 6.4cqw/1 'Unbounded',sans-serif;color:#fff;text-shadow:0 0 2cqw rgba(120,200,255,.9)}
.hc-cap{position:absolute;left:0;right:0;bottom:0;z-index:6;padding:7cqw 3.6cqw 3.4cqw;background:linear-gradient(0deg,rgba(6,4,26,.95) 30%,transparent);display:flex;justify-content:space-between;align-items:flex-end}
.hc-cap b{font:800 5.6cqw/1.05 'Unbounded',sans-serif;background:linear-gradient(100deg,#fff,#aef,#fff);-webkit-background-clip:text;background-clip:text;color:transparent}
.hc-cap i{font-style:normal;font-size:2.8cqw;font-weight:800;letter-spacing:.1em;color:#8fe}
/* ---------- LOCK ---------- */
.lk{aspect-ratio:3/4;border-radius:9px;border:2px dashed #363078;background:#201C52;display:grid;place-items:center}
.lk i{display:block;width:16px;height:16px;border-radius:3px;background:#363078;transform:rotate(45deg)}
/* ---------- PACK ---------- */
.pk{position:relative;aspect-ratio:2/3.3;border-radius:3cqw;overflow:hidden;background:linear-gradient(160deg,var(--b),var(--a) 50%,color-mix(in srgb,var(--a) 40%,#12002a));box-shadow:0 4cqw 9cqw rgba(0,0,0,.55),0 0 10cqw color-mix(in srgb,var(--a) 45%,transparent)}
.pk-cr{position:absolute;left:0;right:0;height:8cqw;background:repeating-linear-gradient(90deg,rgba(0,0,0,.28) 0 1.1cqw,rgba(255,255,255,.4) 1.1cqw 2.2cqw);z-index:3}
.pk-cr.t{top:0}.pk-cr.b{bottom:0}
.pk-band{position:absolute;left:0;right:0;top:34%;height:22%;z-index:1;background:url(PANO) center/cover;border-block:.8cqw solid rgba(255,255,255,.8)}
.pk-band:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--a),transparent 30%,transparent 70%,var(--a));mix-blend-mode:multiply;opacity:.55}

.pk-ttl{position:absolute;left:0;right:0;top:12%;text-align:center;z-index:2;font:800 6.2cqw/1 'Unbounded',sans-serif;color:#fff;text-shadow:0 .8cqw 3cqw rgba(0,0,0,.45);letter-spacing:-.02em}
.pk-ttl small{display:block;font:800 3.2cqw/1 'Be Vietnam Pro';letter-spacing:.3em;margin-bottom:2.4cqw;color:rgba(255,255,255,.9)}
.pk-n{position:absolute;left:0;right:0;bottom:15%;text-align:center;z-index:2}
.pk-n b{display:inline-block;padding:2cqw 6cqw;border-radius:99px;background:rgba(8,6,24,.72);border:.5cqw solid rgba(255,255,255,.7);font:800 5cqw/1 'Unbounded';color:#fff}
.pk-sheen{position:absolute;inset:-20%;z-index:4;mix-blend-mode:overlay;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.85) 50%,transparent 60%);background-size:300% 100%;animation:sweep 3.2s ease-in-out infinite}
/* ---------- UI chung ---------- */
.pill{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:99px;font-size:11px;font-weight:800;background:#201C52;border:1.5px solid #363078;color:#F1F0FF}
.btn{display:block;width:100%;min-height:50px;border:0;border-radius:15px;font-size:15px;font-weight:900;color:#2A1400;background:linear-gradient(100deg,#FFB02E,#FF6B57);box-shadow:0 8px 22px rgba(255,120,60,.35)}
.btn.ghost{background:#201C52;color:#F1F0FF;border:2px solid #363078;box-shadow:none}
.card{background:#201C52;border:2px solid #363078;border-radius:18px;padding:14px}
.lab{font-size:11px;font-weight:800;letter-spacing:.14em;color:#A7A9E6}
.dim{color:#A7A9E6}
'''.replace('PANO',PANO)

def page(title,w,h,body,extra=''):
    return f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Unbounded:wght@600;800&display=swap">
<style>{CSS}{extra}</style>
</helmet>
<div style="width:{w}px;height:{h}px;overflow:hidden;background:#15123B;color:#F1F0FF;position:relative">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''

CON={1:('Urichinguchana',C1,'#FFE3B0'),2:('Aniyaaa',C2,'#FFC1DB'),3:('Poyoyoi',C3,'#C7EEFF')}
def ncard(i,con=1,w=150,no=None,name=None,tag=True):
    n,a,b=CON[con]
    name=name or MEM[i]
    return f'''<div class="cw" style="width:{w}px"><div class="nc" style="--a:{a};--b:{b}"><div class="nc-in"><img src="{MM[con][i]}" alt="{name}"><span class="nc-no">{(i+1):02d}<small>/05</small></span>{'<span class="nc-tag">'+n.upper()+'</span>' if tag else ''}<div class="nc-cap"><b>{name}</b><i>THƯỜNG</i></div></div></div></div>'''
def hcard(i,con=1,w=150,name=None,badge=True):
    n,a,b=CON[con]
    name=name or MEM[i]
    st=''.join(f'<span class="hc-st" style="left:{x}%;top:{y}%;animation-delay:{d}s"></span>' for x,y,d in [(70,18,0),(20,38,.7),(78,58,1.3),(30,74,.4),(52,30,1.9)])
    return f'''<div class="cw" style="width:{w}px"><div class="hc"><div class="hc-in"><img src="{MM[con][i]}" alt="{name} holo"><span class="hc-tex"></span><span class="hc-foil"></span><span class="hc-sh s1"></span><span class="hc-sh s2"></span><span class="hc-sh s3"></span>{st}<span class="hc-no">{(i+1):02d}</span>{'<span class="hc-badge">HOLO</span>' if badge else ''}<div class="hc-cap"><b>{name}</b><i>{n.upper()}</i></div></div></div></div>'''
def pack(con=1,w=150,label='MÙA CONCEPT'):
    n,a,b=CON[con]
    return f'''<div class="cw" style="width:{w}px"><div class="pk" style="--a:{a};--b:{b}"><span class="pk-cr t"></span><div class="pk-ttl"><small>{label}</small>{n.upper()}</div><div class="pk-band" style="background-image:url({PANOS[con]})"></div><div class="pk-n"><b>5 THẺ</b></div><span class="pk-cr b"></span><span class="pk-sheen"></span></div></div>'''

# ======================= V2: HIỆU ỨNG MẠNH =======================
CSS+='''
.cw{perspective:900px}
.tl{transform-style:preserve-3d;animation:tiltA 7s ease-in-out infinite}
.tl.sm{animation-name:tiltB}
@keyframes tiltA{0%,100%{transform:rotateY(-12deg) rotateX(6deg)}50%{transform:rotateY(12deg) rotateX(-6deg)}}
@keyframes tiltB{0%,100%{transform:rotateY(-6deg) rotateX(3deg)}50%{transform:rotateY(6deg) rotateX(-3deg)}}
@keyframes hmove{from{background-position:0 0}to{background-position:300% 300%}}
/* THƯỜNG v2 */
.nc{animation:glowN 3s ease-in-out infinite}
@keyframes glowN{0%,100%{box-shadow:0 2.4cqw 6cqw rgba(0,0,0,.5),0 0 4cqw color-mix(in srgb,var(--a) 30%,transparent)}50%{box-shadow:0 2.4cqw 6cqw rgba(0,0,0,.5),0 0 12cqw color-mix(in srgb,var(--a) 90%,transparent)}}
.nc-in img{animation:kbN 9s ease-in-out infinite alternate}
@keyframes kbN{from{transform:scale(1.04) translateX(-2%)}to{transform:scale(1.16) translateX(2%)}}
.nc-run{position:absolute;inset:0;border-radius:6cqw;padding:1.1cqw;pointer-events:none;z-index:9;background:conic-gradient(from var(--r),transparent 0 58%,var(--b) 78%,#fff 90%,transparent 100%);animation:spin 2.4s linear infinite;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
.nc-sw{position:absolute;inset:-20%;z-index:4;mix-blend-mode:overlay;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.95) 50%,transparent 62%);background-size:300% 100%;animation:sweep 3.4s ease-in-out infinite}
.nc-dust{position:absolute;inset:0;z-index:3;mix-blend-mode:screen;opacity:.75;background:radial-gradient(circle,#fff 0 .35cqw,transparent .5cqw) 0 0/9cqw 11cqw,radial-gradient(circle,var(--b) 0 .3cqw,transparent .45cqw) 4cqw 5cqw/13cqw 9cqw;animation:dust 3.6s steps(6) infinite}
@keyframes dust{0%,100%{opacity:.15}50%{opacity:.85}}
.nc-lt{position:absolute;inset:0;z-index:3;background:radial-gradient(circle at var(--lx,30%) 24%,color-mix(in srgb,var(--b) 80%,transparent),transparent 42%);mix-blend-mode:soft-light;animation:lt 6s ease-in-out infinite alternate}
@keyframes lt{from{--lx:15%;opacity:.5}to{--lx:85%;opacity:1}}
/* HOLO v2 */
.hc{animation:spin 3.6s linear infinite,glowH 2.2s ease-in-out infinite}
@keyframes glowH{0%,100%{box-shadow:0 0 6cqw rgba(123,97,255,.65),0 0 15cqw rgba(255,46,136,.35),0 2.4cqw 6cqw rgba(0,0,0,.55)}50%{box-shadow:0 0 13cqw rgba(76,201,255,.95),0 0 30cqw rgba(255,228,94,.55),0 2.4cqw 6cqw rgba(0,0,0,.55)}}
.hc-in img.base{animation:kbN 8s ease-in-out infinite alternate}
.hc-hue{position:absolute;inset:0;z-index:2;mix-blend-mode:color;opacity:.7;background:linear-gradient(120deg,#ff2e88,#ffe45e,#35d0a5,#4cc9ff,#8b5cff,#ff2e88,#ffe45e);background-size:300% 300%;animation:hmove 5s linear infinite}
.hc-rg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:3;mix-blend-mode:screen;opacity:0}
.hc-rg.r{filter:sepia(1) saturate(9) hue-rotate(-45deg);animation:glR 3.2s steps(1) infinite}
.hc-rg.c{filter:sepia(1) saturate(9) hue-rotate(150deg);animation:glC 3.2s steps(1) infinite}
@keyframes glR{0%,36%,46%,100%{opacity:0;transform:none}37%{opacity:.9;transform:translateX(-2.4cqw)}40%{opacity:.9;transform:translate(2cqw,.8cqw)}43%{opacity:.7;transform:translateX(-1cqw)}}
@keyframes glC{0%,36%,46%,100%{opacity:0;transform:none}37%{opacity:.9;transform:translateX(2.4cqw)}40%{opacity:.9;transform:translate(-2cqw,-.8cqw)}43%{opacity:.7;transform:translateX(1cqw)}}
.hc-scan{position:absolute;left:0;right:0;height:16%;z-index:5;mix-blend-mode:screen;background:linear-gradient(0deg,transparent,rgba(170,245,255,.85) 50%,transparent);animation:scanH 2.8s linear infinite}
@keyframes scanH{from{top:-18%}to{top:104%}}
.hc-bm{position:absolute;z-index:4;width:30%;height:170%;top:-35%;mix-blend-mode:screen;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);transform:rotate(24deg);animation:bm 3.4s ease-in-out infinite}
.hc-bm.b2{width:14%;animation-delay:1.1s;animation-duration:4s;background:linear-gradient(90deg,transparent,rgba(120,220,255,.9),transparent)}
@keyframes bm{0%{left:-45%}100%{left:130%}}
.hc-gl{position:absolute;inset:0;z-index:5;mix-blend-mode:screen}
.hc-gl.g1{background:radial-gradient(circle,#fff 0 .45cqw,transparent .6cqw) 0 0/7cqw 8.5cqw;animation:gl 1.4s steps(1) infinite}
.hc-gl.g2{background:radial-gradient(circle,#ffe45e 0 .4cqw,transparent .55cqw) 3cqw 4cqw/9cqw 7cqw;animation:gl 1.9s steps(1) infinite .5s}
.hc-gl.g3{background:radial-gradient(circle,#8fe 0 .4cqw,transparent .55cqw) 5cqw 2cqw/8cqw 10cqw;animation:gl 1.1s steps(1) infinite .3s}
@keyframes gl{0%{opacity:.1}25%{opacity:1}50%{opacity:.2}75%{opacity:.9}100%{opacity:.1}}
.hc-st{width:8cqw;height:8cqw;filter:drop-shadow(0 0 1.8cqw #fff) drop-shadow(0 0 3.5cqw #8ff)}
.hc-fl{position:absolute;z-index:6;width:22cqw;height:22cqw;mix-blend-mode:screen;background:radial-gradient(circle,#fff 0 6%,rgba(160,240,255,.7) 14%,transparent 60%);animation:fl 2.6s ease-in-out infinite}
.hc-fl:before,.hc-fl:after{content:"";position:absolute;left:50%;top:50%;width:140%;height:.8cqw;margin:-.4cqw 0 0 -70%;background:linear-gradient(90deg,transparent,#fff,transparent)}
.hc-fl:after{width:.8cqw;height:140%;margin:-70% 0 0 -.4cqw;background:linear-gradient(0deg,transparent,#fff,transparent)}
@keyframes fl{0%,100%{transform:scale(.3) rotate(0);opacity:0}50%{transform:scale(1.15) rotate(45deg);opacity:1}}
/* PACK v2 */
.pk{animation:pkw 3.6s ease-in-out infinite}
@keyframes pkw{0%,100%{box-shadow:0 4cqw 9cqw rgba(0,0,0,.55),0 0 6cqw color-mix(in srgb,var(--a) 40%,transparent)}50%{box-shadow:0 4cqw 9cqw rgba(0,0,0,.55),0 0 18cqw color-mix(in srgb,var(--a) 95%,transparent)}}
.pk-rb{position:absolute;inset:0;z-index:3;mix-blend-mode:color-dodge;opacity:.55;background:linear-gradient(115deg,transparent 18%,rgba(255,0,150,.7) 30%,rgba(255,230,90,.7) 40%,rgba(60,255,190,.7) 50%,rgba(70,170,255,.7) 60%,rgba(150,90,255,.7) 70%,transparent 82%);background-size:300% 100%;animation:sweep 3s ease-in-out infinite}
.pk-st{position:absolute;z-index:5;width:12cqw;height:12cqw;background:#fff;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);filter:drop-shadow(0 0 2cqw #fff);animation:tw 2s ease-in-out infinite}
'''

def _stars(pts):
    return ''.join(f'<span class="hc-st" style="left:{x}%;top:{y}%;animation-delay:{d}s"></span>' for x,y,d in pts)
def ncard(i,con=1,w=150,no=None,name=None,tag=True,sm=False):
    n,a,b=CON[con]
    name=name or MEM[i]
    return f'''<div class="cw" style="width:{w}px"><div class="tl{' sm' if sm else ''}"><div class="nc" style="--a:{a};--b:{b}"><div class="nc-in"><img src="{MM[con][i]}" alt="{name}"><span class="nc-lt"></span><span class="nc-dust"></span><span class="nc-sw"></span><span class="nc-no">{(i+1):02d}<small>/05</small></span>{'<span class="nc-tag">'+n.upper()+'</span>' if tag else ''}<div class="nc-cap"><b>{name}</b><i>THƯỜNG</i></div></div><span class="nc-run"></span></div></div></div>'''
def hcard(i,con=1,w=150,name=None,badge=True,sm=False):
    n,a,b=CON[con]
    name=name or MEM[i]
    st=_stars([(72,16,0),(18,36,.7),(80,56,1.3),(28,72,.4),(52,28,1.9)])
    return f'''<div class="cw" style="width:{w}px"><div class="tl{' sm' if sm else ''}"><div class="hc"><div class="hc-in"><img class="base" src="{MM[con][i]}" alt="{name} holo"><span class="hc-hue"></span><img class="hc-rg r" src="{MM[con][i]}"><img class="hc-rg c" src="{MM[con][i]}"><span class="hc-tex"></span><span class="hc-foil"></span><span class="hc-bm"></span><span class="hc-bm b2"></span><span class="hc-sh s1"></span><span class="hc-sh s2"></span><span class="hc-sh s3"></span><span class="hc-gl g1"></span><span class="hc-gl g2"></span><span class="hc-gl g3"></span><span class="hc-scan"></span>{st}<span class="hc-fl" style="left:-6%;top:-6%"></span><span class="hc-fl" style="right:-6%;bottom:-6%;animation-delay:1.3s"></span><span class="hc-no">{(i+1):02d}</span>{'<span class="hc-badge">HOLO</span>' if badge else ''}<div class="hc-cap"><b>{name}</b><i>{n.upper()}</i></div></div></div></div></div>'''
def pack(con=1,w=150,label='MÙA CONCEPT'):
    n,a,b=CON[con]
    return f'''<div class="cw" style="width:{w}px"><div class="tl sm"><div class="pk" style="--a:{a};--b:{b}"><span class="pk-cr t"></span><div class="pk-ttl"><small>{label}</small>{n.upper()}</div><div class="pk-band" style="background-image:url({PANOS[con]})"></div><div class="pk-n"><b>5 THẺ</b></div><span class="pk-cr b"></span><span class="pk-rb"></span><span class="pk-sheen"></span><span class="pk-st" style="left:8%;top:30%"></span><span class="pk-st" style="right:6%;top:60%;animation-delay:1s"></span></div></div></div>'''
