import json,sys,re
sys.path[:0]=['.','../idc']
import b10,os
os.chdir('/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/idc')
from b10 import PANOS
from idc import CSS as IDCSS
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/MailMock.dc.html'
H=json.load(open('cardhtml.json'))
def ic(n): return f'<svg class="i"><use href="#i-{n}"/></svg>'
CARDCSS=IDCSS[:IDCSS.index('/* ----- bố cục bảng')]
CARDCSS=CARDCSS.replace("*{box-sizing:border-box}\nbody{margin:0;font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#15123B;color:#F1F0FF}\nbutton{font-family:inherit;cursor:pointer}","")
W,Hh=1760,960
def phone(label,sub,inner,extra=''):
    return f'''<div class="mqw"><div class="mql"><b>{label}</b><small>{sub}</small></div><div class="phone" style="width:390px;max-width:390px;height:844px;flex:none;border-radius:32px;box-shadow:0 0 0 8px #14123F,0 30px 60px rgba(20,18,63,.4)"><div class="sbsp"></div>{inner}</div></div>'''
def top(t): return f'<div class="ptop"><button class="ibtn" aria-label="Quay lại">{ic("left")}</button><h1>{t}</h1></div>'
# ---- 1. hòm thư
list_html=f'''<div class="page on">{top("Hòm thư")}<div class="pbody"><div class="mbxl" style="margin:0 16px 0 -14px;width:auto">
<button class="card-b mbxi new"><span class="mbxt" style="background:#FFB02E">SỰ KIỆN MỚI</span><b>Mùa Concept mở từ 18/10</b><span class="mbxs">Gom thẻ, ghép panorama, nhận thẻ Ultra Limited. Kèm quà thẻ ID Colentis.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc rw">2 quà chưa nhận</i></span></button>
<button class="card-b mbxi new"><span class="mbxt" style="background:#FF4FA3">QUÀ TỪ BẠN BÈ</span><b>Thu Trang gửi bạn 2 thẻ</b><span class="mbxs">KEONHO, JUHOON (holo)</span><span class="mbxf"><em>Thu Trang · 17/10</em><i class="mbxc gift">Chưa nhận</i></span></button>
<button class="card-b mbxi"><span class="mbxt" style="background:#B79CFF">SẮP TỚI</span><b>Sự kiện bí mật · 01/11</b><span class="mbxs">Chỉ biết nó liên quan đến Lịch.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc">Đã đọc</i></span></button>
</div></div></div>'''
# ---- 2. thư (đầu)
hero=f'''<div class="mqh"><i style="background-image:url({PANOS[1]})"></i><i style="background-image:url({PANOS[2]})"></i><i style="background-image:url({PANOS[3]})"></i><span class="mqhs"></span><div class="mqht"><small>SỰ KIỆN MỚI · TỪ 18/10</small><b>Mùa Concept</b><em>18 – 26/10 · 9 ngày · 3 concept</em></div></div>'''
letter_top=f'''<div class="page on">{top("Thư")}<div class="pbody">{hero}<div class="mqb">
<small class="mqk">COLENTIS · 17/10</small>
<p class="mqp">Chào bạn, từ ngày <b>18/10</b> Colentis mở <b>Mùa Concept</b>, một mùa gom thẻ kéo dài 9 ngày dành cho hai người.</p>
<div class="mqs">BA CHẶNG</div>
<div class="mqc" style="--c:#FFB02E"><i></i><span><b>Urichinguchana</b><small>Chặng 1 · 18 – 20/10</small></span></div>
<div class="mqc" style="--c:#FF2E88"><i></i><span><b>Aniyaaa</b><small>Chặng 2 · 21 – 23/10</small></span></div>
<div class="mqc" style="--c:#4CC9FF"><i></i><span><b>Poyoyoi</b><small>Chặng 3 · 24 – 26/10</small></span></div>
<div class="mqs">CÁCH CHƠI</div>
<ol class="mqo"><li><i>1</i><span>Mỗi ngày hoàn thành nhiệm vụ của concept để nhận <b>2 pack</b>, mỗi pack 5 thẻ.</span></li>
<li><i>2</i><span>Thẻ nào của bạn thì bạn tự rút. Thẻ trùng thì tặng được cho bạn bè, thẻ còn thiếu thì xin.</span></li>
<li><i>3</i><span>Đủ 5 thẻ thường: mở <b>panorama</b>, khung tròn, danh hiệu và 1 pack thẻ app.</span></li>
<li><i>4</i><span>Đủ cả 3 concept: nhận <b>2 thẻ Ultra Limited</b>, tự chọn bài hát cho mỗi thẻ.</span></li></ol>
</div></div></div>'''
# ---- 3. thư (cuối, quà đính kèm)
letter_end=f'''<div class="page on">{top("Thư")}<div class="pbody"><div class="mqb" style="padding-top:6px">
<div class="mqs">QUÀ ĐÍNH KÈM · 2</div>
<div class="mqg">
 <div class="mqgc">{H['blank']}</div>
 <div class="mqgt"><small>THẺ ĐẶC BIỆT</small><b>Thẻ ID Colentis</b><span>Thẻ trống. Chọn một thành viên CORTIS để gán, thêm ảnh và tên của bạn, rồi nhận khung tròn và danh hiệu riêng.</span></div>
 <button class="igo" style="margin-top:12px">{ic("gift")} Nhận thẻ ID</button>
</div>
<div class="mqg mqg2"><span class="mqpk">{ic("gift")}</span><div class="mqgt" style="flex:1"><small>PACK KHAI MẠC</small><b>1 pack Urichinguchana</b><span>Mở được từ 18/10 ở tab Hôm nay.</span></div><button class="mqmini">Nhận</button></div>
<p class="mqp" style="margin-top:16px">Chúc bạn một mùa gom thẻ thật vui.<br><b>— Colentis</b></p>
<button class="igo" style="background:linear-gradient(100deg,#FFB02E,#FF2E88)">Nhận tất cả quà</button>
</div></div></div>'''
# ---- 4. chọn thành viên
mem=[('JAMES','Triệu Vũ Phàm','14/10','Young Crew','#FFB02E','JM'),('JUHOON','Kim Chu Huân','03/01','TNT','#FF2E88','JH'),('MARTIN','Phan Mạnh Tiến','20/03','Blue Lips','#4CC9FF','MT'),('SEONGHYEON','Nghiêm Sơn Hoàng','13/01','ACAI','#35D0A5','SH'),('KEONHO','An Kiến Huy','04/02','Wassup','#8B5CFF','KH')]
rows=''.join(f'<button class="wr {"on" if n=="JUHOON" else ""}"><span class="wav" style="--a:{c}">{ini}</span><span class="wnm"><b>{n.capitalize()} · {vn}</b><small>Sinh {d} · Bài đại diện: {s}</small></span><span class="wck">{"✓" if n=="JUHOON" else ""}</span></button>' for n,vn,d,s,c,ini in mem)
sheet=f'''<div class="page on">{top("Thư")}<div class="pbody"><div class="mqb" style="padding-top:6px"><div class="mqs">QUÀ ĐÍNH KÈM · 2</div><div class="mqg"><div class="mqgc">{H['blank']}</div></div></div></div></div>
<div class="bd on"></div><div class="sheet on" style="visibility:visible;transform:none;max-height:94%"><h3 style="font-size:19px;margin:6px 0 4px">Gán thẻ ID cho ai?</h3><p class="sub" style="margin:0 0 10px">Chọn một thành viên. Chọn xong là khóa, không đổi được.</p>
<div class="mqprev">{H['jh']}</div>
<div class="whol" style="margin-top:12px">{rows}</div>
<button class="igo">Xác nhận · gán cho Juhoon</button></div>'''
MQCSS='''
.mqw{display:flex;flex-direction:column;gap:16px;flex:none}
.mql{color:#1E1B5E}.mql b{display:block;font:800 13px 'Unbounded',sans-serif}.mql small{display:block;margin-top:4px;font:700 12px 'Be Vietnam Pro';color:#4d4a86}
.rapp .mqh{position:relative;margin:4px 14px 0;height:176px;border-radius:22px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 10px 24px rgba(30,27,94,.25)}
.rapp .mqh i{flex:1;background-size:cover;background-position:center;background-color:#8d94b8}
.rapp .mqhs{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,18,63,.25),rgba(20,18,63,.78))}
.rapp .mqht{position:absolute;left:18px;right:18px;bottom:16px;color:#fff}
.rapp .mqht small{display:block;font:800 10px 'Be Vietnam Pro';letter-spacing:.2em;color:#FFE45E}
.rapp .mqht b{display:block;margin-top:4px;font:800 30px/1.05 'Unbounded',sans-serif;text-shadow:0 2px 12px rgba(0,0,0,.5)}
.rapp .mqht em{display:block;margin-top:6px;font:700 12px 'Be Vietnam Pro';font-style:normal;opacity:.92}
.rapp .mqb{padding:14px 18px 20px}
.rapp .mqk{display:block;font:800 10.5px 'Be Vietnam Pro';letter-spacing:.14em;color:var(--soft)}
.rapp .mqp{margin:8px 0 0;font:600 14px/1.6 'Be Vietnam Pro';color:var(--ink)}
.rapp .mqs{margin:18px 0 8px;font:800 11px 'Be Vietnam Pro';letter-spacing:.18em;color:#ff2e88}
.rapp .mqc{display:flex;align-items:center;gap:12px;padding:10px 12px;margin-bottom:8px;border-radius:14px;background:var(--paper);border:1.5px solid var(--line)}
.rapp .mqc>i{flex:none;width:30px;height:30px;border-radius:10px;background:var(--c)}
.rapp .mqc b{display:block;font:800 14px 'Be Vietnam Pro'}.rapp .mqc small{display:block;margin-top:1px;font:700 12px 'Be Vietnam Pro';color:var(--soft)}
.rapp .mqo{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.rapp .mqo li{display:grid;grid-template-columns:24px 1fr;gap:10px;font:600 13.5px/1.55 'Be Vietnam Pro'}
.rapp .mqo li>i{font-style:normal;width:24px;height:24px;border-radius:50%;background:#ff2e88;color:#fff;display:grid;place-items:center;font:900 12px 'Be Vietnam Pro'}
.rapp .mqg{margin-top:6px;border-radius:20px;padding:14px;background:linear-gradient(160deg,rgba(255,228,94,.3),rgba(255,46,136,.14));border:1.5px solid rgba(255,46,136,.35)}
.rapp .mqgc{pointer-events:none}
.rapp .mqgt{margin-top:12px}.rapp .mqgt small{display:block;font:800 10px 'Be Vietnam Pro';letter-spacing:.16em;color:#ff2e88}
.rapp .mqgt b{display:block;margin-top:3px;font:800 17px 'Be Vietnam Pro'}.rapp .mqgt span{display:block;margin-top:5px;font:600 12.5px/1.5 'Be Vietnam Pro';color:var(--soft)}
.rapp .mqg2{display:flex;align-items:center;gap:12px;margin-top:10px;padding:12px 14px}
.rapp .mqg2 .mqgt{margin-top:0}
.rapp .mqpk{flex:none;width:44px;height:44px;border-radius:14px;background:#fff;color:#ff2e88;display:grid;place-items:center}
.rapp .mqmini{border:0;border-radius:12px;padding:10px 16px;background:#ff2e88;color:#fff;font:800 13px 'Be Vietnam Pro'}
.rapp .mqprev{width:84%;margin:0 auto}
.rapp .sheet .wr{padding:7px 10px}
'''
CSSALL=b10.REAL+'\n'+b10.APPCSS+'\n'+CARDCSS+'\n'+MQCSS
body=f'''{b10.SPRITE}<div class="rapp" style="width:{W}px;height:{Hh}px;padding:30px;display:flex;gap:34px;align-items:flex-start;background:#cfd3f8;background-image:radial-gradient(900px 600px at 15% 0,#d9d4ff,transparent),radial-gradient(900px 700px at 100% 100%,#ffd1ea,transparent)">
{phone("1 · Hòm thư","Thư sự kiện mới nằm đầu, có huy hiệu 2 quà chưa nhận",list_html)}
{phone("2 · Mở thư: giới thiệu sự kiện","Banner 3 concept, 3 chặng theo ngày, cách chơi",letter_top)}
{phone("3 · Cuối thư: quà đính kèm","Thẻ ID là thẻ trống, kèm 1 pack khai mạc",letter_end)}
{phone("4 · Bấm Nhận thẻ ID","Chọn thành viên rồi xác nhận, thẻ tự điền",sheet)}
</div>'''
html=f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Thư sự kiện kèm thẻ ID</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Unbounded:wght@600;800&family=Noto+Sans+KR:wght@700&display=swap">
<style>*{{box-sizing:border-box}}body{{margin:0}}
{CSSALL}</style>
</helmet>
<div style="width:{W}px;height:{Hh}px;overflow:hidden;position:relative">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{W},"height":{Hh}}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''
open(OUT,'w',encoding='utf-8').write(html);print(len(html))
