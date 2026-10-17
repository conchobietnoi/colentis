import json,urllib.parse
from idc import members, LOGO
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/IdFrames.dc.html'
VN={'jh':'Kim Chu Huân','jm':'Triệu Vũ Phàm','mt':'Phan Mạnh Tiến','sh':'Nghiêm Sơn Hoàng','kh':'An Kiến Huy'}
BD={'jm':14,'jh':3,'mt':20,'sh':13,'kh':4}
ORDER=['jh','jm','mt','sh','kh']
data=[]
for i in ORDER:
    m=[x for x in members if x['id']==i][0]
    data.append(dict(id=i,s=m['s'],ko=m['ko'],ac=m['ac'],vn=VN[i],day=BD[i],sg=m['sg'],full=m['full']))
LG=LOGO.replace('class="idlg"','class="ilg"').replace('var(--ac)','var(--a)')
def frame(o,w,avatar='{{av}}'):
    return f'''<div class="ifx" style="--a:{{{{{o}.a}}}};--c:{{{{{o}.c}}}};--w:{w}px"><div class="idial"><div class="itg"></div><div class="itk"></div><div class="itk2"></div><div class="ibd" style="transform:rotate({{{{{o}.ang}}}}deg)"></div></div><div class="idns"><sc-for list="{{{{{o}.ns}}}}" as="n" hint-placeholder-count="5"><span class="idn" style="--ang:{{{{n.a}}}}deg;--dl:{{{{n.d}}}}s"><i>{{{{n.t}}}}</i></span></sc-for></div><div class="iring"><div class="iav"><img src="{avatar}" alt=""></div><i class="ish"></i></div><img class="isg" src="{{{{{o}.sg}}}}" alt="Chữ ký"><span class="ibg">{LG}</span></div>'''
def title(o):
    return f'''<span class="ittl" style="--a:{{{{{o}.a}}}};--b:{{{{{o}.c}}}}">{LG}<b>{{{{{o}.vn}}}}</b></span>'''
TPL=f'''<div class="bd">
 <div class="bt">Khung kèm thẻ ID<small>Kiểu con dấu và vé lịch, khác hẳn 3 khung concept · chữ ký đứng yên, hiệu ứng nằm ở thước ngày quanh khung</small></div>
 <div class="cols"><sc-for list="{{{{cols}}}}" as="m" hint-placeholder-count="5"><div class="icol">{frame('m',148)}<div class="gp"></div>{title('m')}<div class="inm"><b>{{{{m.s}}}}</b><small>{{{{m.ko}}}} · {{{{m.full}}}}</small></div></div></sc-for></div>
 <div class="low">
  <div class="pro">
   <div class="lab">TRONG HỒ SƠ · CHỌN THÀNH VIÊN</div>
   <div class="chips"><sc-for list="{{{{chips}}}}" as="c" hint-placeholder-count="5"><button class="chip {{{{c.cls}}}}" style="--c:{{{{c.ac}}}}" data-i="{{{{c.i}}}}" onClick="{{{{pick}}}}"><i></i>{{{{c.n}}}}</button></sc-for></div>
   <div class="prof"><div class="pfa">{frame('q',104)}</div><div class="pft"><small>Khung tròn &amp; danh hiệu</small><h2>Hồ sơ của bạn</h2><div class="pfp">{title('q')}</div><p>Người kia thấy khung này quanh ảnh đại diện và danh hiệu dưới tên bạn.</p></div></div>
  </div>
  <div class="nts">
   <div class="lab">CÁCH LÀM</div>
   <ul class="nt">
    <li><i>1</i><span><b>Mặt đồng hồ lịch</b> màu xanh tím đậm quanh ảnh, khắc thước ngày 1–31 như dải ngày ở mặt sau thẻ. Không có quầng sáng hay tia như khung concept.</span></li>
    <li><i>2</i><span><b>Ngày sinh</b> là vạch màu thành viên nổi trên thước. Juhoon ngày 3, Keonho ngày 4, Seonghyeon ngày 13, James ngày 14, Martin ngày 20.</span></li>
    <li><i>3</i><span><b>Chữ ký</b> trắng nằm yên trên ảnh. Hiệu ứng nằm quanh khung: tia sáng quét lần lượt qua từng vạch ngày, viền ánh cầu vồng chậm trên mặt đồng hồ, ngày sinh nổi sóng lan ra, các con số ngày 17, 10, 25 và ngày sinh trôi ra từ thước như tờ lịch.</span></li>
    <li><i>4</i><span><b>Huy hiệu lịch</b> nhỏ ở góc là dấu Colentis, trùng logo trên thẻ.</span></li>
    <li><i>5</i><span><b>Danh hiệu ngang</b> là tên Hán–Việt, dạng vé lịch có khuyết hai bên và viền đứt nét, không phải viên thuốc ánh kim.</span></li></ul>
  </div>
 </div>
</div>'''
CSS='''
*{box-sizing:border-box}
body{margin:0;font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#15123B;color:#F1F0FF}
button{font-family:inherit;cursor:pointer}
@property --r{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes spin{to{--r:360deg}}@keyframes spinr{to{transform:rotate(360deg)}}
@keyframes aur2{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes tw{0%,100%{opacity:.4;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}
@keyframes ttlg{from{background-position:0 0}to{background-position:300% 0}}
.bd{position:relative;width:1170px;height:904px;overflow:hidden;background:radial-gradient(900px 600px at 20% 0,#2a2160,#15123B 70%)}
.bt{position:absolute;left:24px;top:18px;font:800 20px 'Unbounded',sans-serif}
.bt small{display:block;font:700 12px 'Be Vietnam Pro';color:#B8B4E8;margin-top:5px}
.cols{position:absolute;left:24px;right:24px;top:92px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.icol{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:36px 8px 18px;display:flex;flex-direction:column;align-items:center}
.gp{height:36px}
.inm{margin-top:14px;text-align:center}.inm b{display:block;font:800 13px 'Unbounded',sans-serif;letter-spacing:.04em}.inm small{display:block;margin-top:4px;font:700 11px 'Be Vietnam Pro';color:#B8B4E8}
.ifx{position:relative;width:var(--w);height:var(--w);flex:none}
.idial{position:absolute;inset:-14%;border-radius:50%;background:radial-gradient(circle closest-side,#2c2878 0 70%,#1E1B5E 71%);box-shadow:0 8px 20px rgba(0,0,0,.5),inset 0 0 0 1.5px rgba(255,255,255,.14)}
.itk{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from -.7deg,rgba(255,255,255,.75) 0 1.4deg,transparent 1.4deg 11.6129deg);-webkit-mask:radial-gradient(circle closest-side,transparent 76%,#000 77%,#000 88%,transparent 89%);mask:radial-gradient(circle closest-side,transparent 76%,#000 77%,#000 88%,transparent 89%)}
.idial:after{content:"";position:absolute;inset:0;border-radius:50%;pointer-events:none;background:conic-gradient(from var(--r),rgba(255,228,94,0),rgba(255,79,163,.34),rgba(76,201,255,.34),rgba(139,92,255,.34),rgba(255,228,94,0));mix-blend-mode:screen;animation:spin 16s linear infinite;-webkit-mask:radial-gradient(circle closest-side,transparent 71%,#000 72%);mask:radial-gradient(circle closest-side,transparent 71%,#000 72%)}
.itk2{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from var(--r),transparent 0 74%,color-mix(in srgb,var(--a) 75%,transparent) 90%,#fff 99.4%,transparent 100%);animation:spin 3.4s linear infinite;-webkit-mask:radial-gradient(circle closest-side,transparent 76%,#000 77%,#000 88%,transparent 89%);mask:radial-gradient(circle closest-side,transparent 76%,#000 77%,#000 88%,transparent 89%)}
.itg{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from var(--r),transparent 0 70%,color-mix(in srgb,var(--a) 55%,transparent) 96%,transparent 100%);filter:blur(5px);animation:spin 3.4s linear infinite;-webkit-mask:radial-gradient(circle closest-side,transparent 72%,#000 80%,#000 94%,transparent 100%);mask:radial-gradient(circle closest-side,transparent 72%,#000 80%,#000 94%,transparent 100%)}
.ibd:after{content:"";position:absolute;left:50%;top:11.5%;width:13%;height:13%;margin:-6.5% 0 0 -6.5%;border-radius:50%;border:2px solid var(--c);animation:ipul 2.6s ease-out infinite}
@keyframes ipul{0%{transform:scale(.25);opacity:1}100%{transform:scale(2.4);opacity:0}}
.idns{position:absolute;inset:0;pointer-events:none}
.idn{position:absolute;left:50%;top:50%;width:0;height:0;opacity:0;transform:rotate(var(--ang));animation:idnf 5s ease-out infinite;animation-delay:var(--dl)}
.idn i{position:absolute;left:0;top:0;display:block;font:800 calc(var(--w)*.085)/1 'Unbounded',sans-serif;font-style:normal;color:var(--c);text-shadow:0 0 8px var(--a);transform:translate(-50%,-50%) rotate(calc(var(--ang)*-1))}
@keyframes idnf{0%{opacity:0;transform:rotate(var(--ang)) translateY(calc(var(--w)*-.6))}18%{opacity:.95}70%{opacity:.7}100%{opacity:0;transform:rotate(var(--ang)) translateY(calc(var(--w)*-.76))}}
.ibd{position:absolute;inset:0}
.ibd:before{content:"";position:absolute;left:50%;top:5%;width:4%;height:13%;margin-left:-2%;border-radius:3px;background:var(--a);box-shadow:0 0 0 1.5px #fff,0 0 10px var(--a)}
.iring{position:absolute;inset:0;border-radius:50%;padding:6.5%;background:linear-gradient(160deg,var(--c),var(--a) 55%,color-mix(in srgb,var(--a) 70%,#000));box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6),0 3px 10px rgba(0,0,0,.45);overflow:hidden}
.iav{position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;background:linear-gradient(160deg,#dcd9f2,#bfbbe6);box-shadow:0 0 0 2.5px #fff}
.iav img{width:100%;height:100%;object-fit:cover;display:block}
.ish{position:absolute;inset:0;border-radius:50%;pointer-events:none;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.6) 50%,transparent 58%);background-size:300% 100%;background-position:120% 0;animation:ishm 5s ease-in-out infinite}
@keyframes ishm{0%,55%{background-position:120% 0}85%,100%{background-position:-20% 0}}
@keyframes iwr{0%{clip-path:inset(0 100% 0 0);opacity:1}38%,88%{clip-path:inset(0 0 0 0);opacity:1}96%{clip-path:inset(0 0 0 0);opacity:0}100%{clip-path:inset(0 100% 0 0);opacity:0}}
.isg{position:absolute;left:50%;bottom:10%;transform:translateX(-50%) rotate(-7deg);width:auto;height:auto;max-width:88%;max-height:40%;bottom:8%;filter:brightness(0) invert(1) drop-shadow(0 0 .6px #fff) drop-shadow(0 0 .6px #fff) drop-shadow(0 1px 1.5px rgba(10,5,40,.95)) drop-shadow(0 0 4px rgba(10,5,40,.8)) ;pointer-events:none}
.ibg{position:absolute;left:-5%;top:-3%;width:27%;height:27%;border-radius:50%;background:#fff;border:2.5px solid var(--a);display:grid;place-items:center;box-shadow:0 3px 10px rgba(0,0,0,.35)}
.ibg .ilg{width:64%;height:64%}
.ilg{display:block;width:18px;height:18px}
.iorb{position:absolute;inset:-5%;border-radius:50%;animation:spinr 2.6s linear infinite;pointer-events:none}
.iorb:before{content:"";position:absolute;left:50%;top:-6%;width:11%;height:11%;margin-left:-5.5%;border-radius:50%;background:#fff;box-shadow:0 0 8px 3px #fff,0 0 16px 6px var(--a)}
.ittl{position:relative;display:inline-flex;align-items:center;gap:8px;padding:9px 20px 9px 12px;border-radius:8px;color:#1E1B5E;background:linear-gradient(180deg,var(--b),var(--a));white-space:nowrap;filter:drop-shadow(0 4px 8px rgba(0,0,0,.4));-webkit-mask:radial-gradient(circle 6px at 0 50%,transparent 97%,#000) left/51% 100% no-repeat,radial-gradient(circle 6px at 100% 50%,transparent 97%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 6px at 0 50%,transparent 97%,#000) left/51% 100% no-repeat,radial-gradient(circle 6px at 100% 50%,transparent 97%,#000) right/51% 100% no-repeat}
.ittl:after{content:"";position:absolute;inset:3px 7px;border:1.5px dashed rgba(30,27,94,.42);border-radius:5px;pointer-events:none}
.ittl:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 42%,rgba(255,255,255,.65) 50%,transparent 58%);background-size:300% 100%;background-position:120% 0;animation:ishm 5s ease-in-out infinite;pointer-events:none}
.ittl b{font:800 12.5px/1 'Unbounded',sans-serif}
.ittl .ilg{width:20px;height:20px;flex:none;filter:drop-shadow(0 1px 1px rgba(0,0,0,.2))}
.low{position:absolute;left:24px;right:24px;top:452px;display:grid;grid-template-columns:1.25fr 1fr;gap:16px}
.pro,.nts{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:16px 18px}
.lab{font:800 11px 'Be Vietnam Pro';letter-spacing:.2em;color:#FFE45E;margin:0 0 10px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1.5px solid rgba(255,255,255,.22);background:transparent;color:#F1F0FF;border-radius:99px;padding:6px 11px;font:800 12px 'Be Vietnam Pro';display:flex;align-items:center;gap:6px}
.chip i{width:9px;height:9px;border-radius:50%;background:var(--c)}
.chip.on{background:#fff;color:#1E1B5E;border-color:#fff}
.prof{margin-top:14px;display:flex;gap:26px;align-items:center;background:#F6F4FF;color:#1E1B5E;border-radius:20px;padding:34px 26px 26px}
.pfa{flex:none;padding:10px 14px}
.pft small{font:800 10px 'Be Vietnam Pro';letter-spacing:.16em;color:#7c78b8}
.pft h2{margin:3px 0 12px;font:800 22px 'Unbounded',sans-serif}
.pfp{margin-bottom:10px}
.pft p{margin:0;font:600 12px/1.5 'Be Vietnam Pro';color:#59558f;max-width:260px}
.nt{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:9px;font:600 12px/1.5 'Be Vietnam Pro';color:#DAD8F7}
.nt b{color:#fff}.nt li{display:grid;grid-template-columns:22px 1fr;gap:7px}
.nt li>i{font-style:normal;width:22px;height:22px;border-radius:50%;background:#FF2E88;color:#fff;display:grid;place-items:center;font:900 11px 'Be Vietnam Pro'}
'''
def mix(hexc):
    n=int(hexc[1:],16);r,g,b=n>>16,(n>>8)&255,n&255
    f=lambda v:round(v+(255-v)*.55)
    return '#%02X%02X%02X'%(f(r),f(g),f(b))
cols=[dict(a=d['ac'],c=mix(d['ac']),ang=round((d['day']-1)/31*360,2),ns=[dict(t=str(t),a=ang,d=dl) for t,ang,dl in [(d['day'],24,0),(17,96,1.1),(10,168,2.2),(25,240,3.3),(d['day'],312,4.4)]],sg=d['sg'],vn=d['vn'],s=d['s'],ko=d['ko'],full=d['full'],i=k) for k,d in enumerate(data)]
SIL='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e6ff"/><stop offset="1" stop-color="#b9b3f0"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="250" r="118" fill="#3b2d6e"/><path d="M60 600 C60 440 180 400 300 400 C420 400 540 440 540 600Z" fill="#1E1B5E"/><path d="M255 400 L300 480 L345 400Z" fill="#fff"/><circle cx="300" cy="250" r="100" fill="#f2cfb8"/><path d="M196 238 C196 150 404 150 404 238 C380 196 220 196 196 238Z" fill="#2a1d4c"/></svg>'
AV='data:image/svg+xml;charset=utf-8,'+urllib.parse.quote(SIL)
SCRIPT='''
var COLS = '''+json.dumps(cols,ensure_ascii=False)+''';
var AV = '''+json.dumps(AV)+''';
var D = { sel: 0 };
class Component extends DCLogic {
  renderVals() {
    var self = this, t = self.state || {}, sel = t.sel !== undefined ? t.sel : D.sel, V = {};
    V.av = AV; V.cols = COLS; V.q = COLS[sel];
    V.chips = COLS.map(function (c, i) { var n = c.s.charAt(0) + c.s.slice(1).toLowerCase(); return { i: i, n: n, ac: c.a, cls: i === sel ? 'on' : '' }; });
    V.pick = function (e) { var el = e.target && e.target.closest ? e.target.closest('[data-i]') : e.currentTarget; self.setState({ sel: Number(el.getAttribute('data-i')) }); };
    return V;
  }
}
'''
html='''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Khung thẻ ID</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Unbounded:wght@600;800&display=swap">
<style>'''+CSS+'''</style>
</helmet>
'''+TPL+'''
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1170,"height":904}}'>'''+SCRIPT+'''</script>
</body>
</html>
'''
open(OUT,'w',encoding='utf-8').write(html);print(len(html))
