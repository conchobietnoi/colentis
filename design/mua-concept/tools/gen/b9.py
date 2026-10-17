import re,random
from shared import *
OUT2='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
REAL=open('../pc/real_scoped.css',encoding='utf-8').read()
SHELL=open('/home/claude/conchobietnoi/colentis/src/ui/shell.html',encoding='utf-8').read()
SPRITE=SHELL[SHELL.index('<svg width="0"'):]
RN=['tl','fr','fl','f','st','cardw','scr','hd','chip','ck','lb','ps','pill','lk','t']
def rcss(c):
    for n in RN: c=re.sub(r'\.'+n+r'(?![\w-])','.'+n+'x',c)
    return c
def rhtml(h):
    def f(m):
        return 'class="'+' '.join((t+'x' if t in RN else t) for t in m.group(1).split(' '))+'"'
    return re.sub(r'class="([^"]*)"',f,h)
def ic(n): return f'<svg class="i"><use href="#i-{n}"/></svg>'
def sif(k,inner,d='false'): return '<sc-if value="{{%s}}" hint-placeholder-val="{{%s}}">%s</sc-if>'%(k,d,inner)

# ---------- thẻ động (khuôn thật của thẻ, đổi ảnh/tên bằng lỗ) ----------
def dyn_n():
    s=ncard(0,1,250)
    s=s.replace(MM[1][0],'{{cImg}}').replace('JAMES','{{cName}}').replace('URICHINGUCHANA','{{cConUp}}')
    s=s.replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{cVars}}"').replace('<span class="nc-no">01<small>','<span class="nc-no">{{cNo}}<small>')
    return rhtml(s)
def dyn_h():
    s=hcard(0,1,250)
    return rhtml(s.replace(MM[1][0],'{{cImg}}').replace('JAMES','{{cName}}').replace('URICHINGUCHANA','{{cConUp}}').replace('<span class="hc-no">01</span>','<span class="hc-no">{{cNo}}</span>'))
BACKS=''
for c in (1,2,3):
    for i in range(5):
        BACKS+=sif(f'bk_{c}_n_{i}',rhtml(back_n(i,c,250)))+sif(f'bk_{c}_h_{i}',rhtml(back_h(i,c,250)))

# ---------- thẻ Ultra: mặt thẻ là video ----------
VID={1:'/_blob/454e864a2d56e54c6b58061b0bb07bea',2:'/_blob/7c3e22f3c3ab3a042759cb58ce8fe09e'}
THB={1:'/_blob/b5c79d13f84e9829e65af73eca31ca0a',2:'/_blob/708cf8c9d898e9aa8e253b422f762d90'}
def ultraV(no,w):
    pts=''.join(f'<span class="uc-pt" style="left:{x}%;animation-delay:{d}s"></span>' for x,d in [(8,0),(20,1.2),(34,.5),(48,2),(60,.9),(74,2.6),(86,.3),(94,1.7)])
    return rhtml(f'''<div class="cw" style="width:{w}px">{PLASMA}<div class="tl"><div class="uc"><span class="uc-aura"></span><div class="uc-in"><video class="uc-vid" src="{VID[no]}" poster="{THB[no]}" muted loop autoplay playsinline preload="auto"></video><div class="uc-au"></div>{pts}{BOLTS}<div class="uc-t"><small>ULTRA LIMITED</small><b>CONCEPT</b></div><div class="uc-f"><b>MÙA CONCEPT</b><i>N°{no}/2</i></div><div class="uc-sw"></div></div><span class="uc-pl"></span></div></div></div>''')

# ---------- khung tròn & danh hiệu ----------
FR=rhtml(fr(1,2,120)).replace('--w:120px;--a:#FFB02E;--c:#FFE3B0;--bl:13px','--w:120px;{{ucV}}').replace(MM[1][2],'{{ucFr}}')
TT=rhtml(ttl(1)).replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{ucT}}"').replace('Urichinguchana','{{ucName}}')
FR_S=rhtml(fr(1,2,76)).replace('--w:76px;--a:#FFB02E;--c:#FFE3B0;--bl:8px','--w:76px;{{r.v}}').replace(MM[1][2],'{{r.img}}')
TT_S=rhtml(ttl(1)).replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{r.t}}"').replace('Urichinguchana','{{r.n}}')
FR_H=rhtml(fr(1,2,66)).replace('--w:66px;--a:#FFB02E;--c:#FFE3B0;--bl:7px','--w:66px;{{c.v}}').replace(MM[1][2],'{{c.img}}')
assert '{{ucV}}' in FR and '{{r.v}}' in FR_S and '{{c.v}}' in FR_H

# ---------- sân khấu đĩa than ----------
eq=''.join(f'<i style="animation-delay:{(k*0.13)%0.5:.2f}s;animation-duration:{0.35+(k*37%25)/100:.2f}s"></i>' for k in range(24))
notes=''.join(f'<span class="nt" style="left:{x}px;top:{y}px;animation-delay:{d}s">{s}</span>' for x,y,d,s in [(60,300,0,'♪'),(300,320,.8,'♫'),(120,260,1.6,'♬'),(250,280,2.2,'♪'),(30,340,.4,'♫'),(330,250,1.2,'♪')])
STAGE=rhtml('<div class="st {{stCls}}"><div class="dv dA" style="--c:{{cA}}" onClick="{{playA}}"><i class="lb">{{titleA}}</i></div><div class="dv dB" style="--c:{{cB}}" onClick="{{playB}}"><i class="lb">{{titleB}}</i></div>'
 +notes+'<div class="cardw"><span class="shk"></span><div class="tlw">'+sif('uIs1',ultraV(1,220),'true')+sif('uIs2',ultraV(2,220))+'<div class="eq">'+eq+'</div></div></div></div>')
# làm lại phần phát: dùng cardw đã đổi tên
KMCF=''.join(f'<i style="left:{random.Random(k).randint(0,100)}%;background:{["#FFB02E","#FF2E88","#4CC9FF","#fff","#ffd23f"][k%5]};--d:{2.4+k%5*.4:.1f}s;--l:{(k%7)*.17:.2f}s;--x:{(k*13%140)-70}px;--r:{200+k*37%520}deg;width:{6+k%5}px;height:{9+k%7}px"></i>' for k in range(40))

def tabs(act):
    items=[('cal','Lịch','cal'),('today','Hôm nay','sun'),('col','Thẻ','cards'),('fr','Bạn bè','users'),('pro','Hồ sơ','user')]
    return '<nav class="tabs">'+''.join(f'<button class="{{{{tb_{k}}}}}" data-i="{i}" onClick="{{{{goTab}}}}">{ic(i_)}{t}{"<span class=dot-n style=display:{{tdot}}>!</span>" if k=="today" else ""}</button>' for i,(k,t,i_) in enumerate(items))+'</nav>'
HEAD_ICONS=f'<button class="ibtn" aria-label="Thông báo">{ic("megaphone")}</button><button class="ibtn" aria-label="Hòm thư">{ic("mail")}</button>'
TASKS_BLOCK=f'''<div class="card-b" style="margin-top:12px"><div style="display:flex;gap:14px;align-items:center"><div class="ring-p" style="--p:{{{{ringP}}}}"><i>{{{{ringTxt}}}}</i></div><div style="flex:1;min-width:0"><h2 style="display:block;font-size:16px">{{{{taskHead}}}}</h2><div class="sub" style="margin-top:3px">{{{{taskSub}}}}</div></div></div>
 <div style="margin-top:10px">
 {sif('evTask',f'<div class="t {{{{tkOn}}}}"><button class="ck" onClick="{{{{tick}}}}" aria-label="Hoàn thành"></button><span class="tt">{{{{taskT}}}}<small>{{{{taskD}}}}</small></span><span class="lbl" style="background:{{{{dayA}}}};color:#1E1B5E">Mùa Concept</span></div>','true')}
 <div class="t"><button class="ck" disabled></button><span class="tt">Đi chợ cuối tuần<small>Cả ngày</small></span><span class="lbl" style="background:#4CC9FF;color:#1E1B5E">Cá nhân</span></div>
 <div class="t d"><button class="ck"></button><span class="tt">Gọi cho ba mẹ<small>20:00</small></span><span class="lbl" style="background:#35D0A5;color:#1E1B5E">Gia đình</span></div></div></div>'''
body='''
<div class="rapp {{dkCls}}" style="width:910px;height:904px;padding:30px;display:flex;gap:30px;align-items:flex-start;background:#cfd3f8;background-image:radial-gradient(900px 600px at 15% 0,#d9d4ff,transparent),radial-gradient(900px 700px at 100% 100%,#ffd1ea,transparent)">
<div class="phone" id="app" style="width:390px;max-width:390px;height:844px;flex:none;border-radius:32px;box-shadow:0 0 0 8px #14123F,0 30px 60px rgba(20,18,63,.4)">
<div class="sbsp"></div>

<!-- ================= LỊCH ================= -->
'''+sif('tabCal','''<section class="scr on" id="cal">
 <div class="head"><div><small>Lịch của tôi '''+ic('down')+'''</small><div class="mnav"><button class="ibtn" aria-label="Tháng trước">'''+ic('left')+'''</button><h1>Tháng 10</h1><button class="ibtn" aria-label="Tháng sau">'''+ic('right')+'''</button></div></div><div class="hact"><div class="streak">'''+ic('flame')+''' 12</div>'''+HEAD_ICONS+'''</div></div>
 <button class="banner km" data-i="0" onClick="{{bnGo}}" style="background:{{bnBg}}"><span class="bi">'''+ic('spark')+'''</span><span><b>{{bnTitle}}</b><small>{{bnSub}}</small></span></button>
 <div class="dow" style="margin-top:10px"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>
 <div class="grid" id="grid">
  <div class="c e"></div><div class="c e"></div><div class="c e"></div>
  <sc-for list="{{cells}}" as="x" hint-placeholder-count="31"><button class="c {{x.cls}}" data-i="{{x.i}}" onClick="{{pickDay}}"><img class="cv" style="display:{{x.imgd}}" src="{{x.src}}" alt=""><b>{{x.d}}</b><span class="dots" style="display:{{x.dd}}"><i style="background:{{x.dc}}"></i></span><span class="gm" style="display:{{x.gd}}">'''+ic('check')+'''</span></button></sc-for>
 </div>
 <div class="legend"><span><i style="background:{{dayA}};border-color:#fff;width:9px;height:9px;border-radius:50%"></i>Ngày có nhiệm vụ Mùa Concept</span><span><i style="width:9px;height:12px;border-color:#fff;background:#4CC9FF"></i>Thẻ cá nhân</span><span><i style="border-style:dashed"></i>Ngày trống</span></div>
 '''+TASKS_BLOCK+'''
 <button class="fab" aria-label="Thêm việc">'''+ic('plus')+'''</button>
</section>''','true')+'''

<!-- ================= HÔM NAY ================= -->
'''+sif('tabToday','''<section class="scr on" id="today">
 <div class="head"><div><small>{{dateLbl}}</small><h1>Hôm nay</h1></div><div class="hact">'''+HEAD_ICONS+'''</div></div>
 <div class="hero"><small>Chuỗi hiện tại</small><h2>12 ngày liền</h2><small>Dài nhất 21 · Thẻ cứu còn 2/3 tháng này</small><div class="wk"><div class="ok">T2<i>'''+ic('check')+'''</i></div><div class="ok">T3<i>'''+ic('check')+'''</i></div><div class="ok">T4<i>'''+ic('check')+'''</i></div><div class="ok">T5<i>'''+ic('check')+'''</i></div><div class="ok">T6<i>'''+ic('check')+'''</i></div><div class="ok">T7<i>'''+ic('check')+'''</i></div><div class="td">CN<i></i></div></div></div>
 <button class="banner km" data-i="0" onClick="{{bnGo}}" style="background:{{bnBg}}"><span class="bi">'''+ic('spark')+'''</span><span><b>{{bnTitle}}</b><small>{{bnSub}}</small></span></button>
 '''+TASKS_BLOCK+sif('hasPacks','<button class="claimcta" onClick="{{openPack}}">'+ic('gift')+' Mở pack Mùa Concept · còn {{packN}}</button>','false')+'''
</section>''')+'''

<!-- ================= THẺ ẢNH ================= -->
'''+sif('tabCol','''<section class="scr on" id="col">
 <div class="head"><div><small>Bộ sưu tập của bạn</small><h1>Thẻ ảnh</h1></div><div class="hact"><button class="ibtn" aria-label="Hòm thư">'''+ic('mail')+'''</button></div></div>
 <div class="rbar"><sc-for list="{{rbar}}" as="r" hint-placeholder-count="4"><div style="--rc:{{r.a}}"><b>{{r.v}}</b>{{r.n}}<div class="bar"><i style="width:{{r.p}}"></i></div></div></sc-for></div>
 <div class="fl"><sc-for list="{{chips}}" as="h" hint-placeholder-count="4"><button class="chip {{h.cls}}" data-i="{{h.i}}" onClick="{{setTab}}">{{h.n}}</button></sc-for></div>
 '''+sif('colOpen','''<div class="sec" style="--rc:{{tabA}}"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:{{tabA}};box-shadow:0 0 8px {{tabA}}"></i>{{colName}} · Thường</span><small>{{colN}}/5</small></div>
 <div class="gal" style="grid-template-columns:repeat(5,1fr);gap:6px"><sc-for list="{{tilesN}}" as="t" hint-placeholder-count="5"><button class="slot {{t.cls}}" data-i="{{t.i}}" onClick="{{tileOpen}}"><div class="sw" style="width:100%;position:relative"><div class="mt" style="--a:{{tabA}}"><img src="{{t.img}}" alt="{{t.nm}}"><b>{{t.nm}}</b></div><span class="cnt" style="display:{{t.xd}}">×{{t.x}}</span><span class="nw" style="display:{{t.nd}}">MỚI</span></div></button></sc-for></div>
 <div class="sec"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,#ffd23f,#ff5db6,#4cd2ff)"></i>{{colName}} · Holo</span><small>{{colH}}/5</small></div>
 <div class="gal" style="grid-template-columns:repeat(5,1fr);gap:6px"><sc-for list="{{tilesH}}" as="t" hint-placeholder-count="5"><button class="slot {{t.cls}}" data-i="{{t.i}}" onClick="{{tileOpen}}"><div class="sw" style="width:100%;position:relative"><div class="mt ho" style="--a:{{tabA}}"><img src="{{t.img}}" alt="{{t.nm}}"><b>{{t.nm}}</b></div><span class="cnt" style="display:{{t.xd}}">×{{t.x}}</span></div></button></sc-for></div>
 <div class="sec"><span>Panorama</span><small>{{panoState}}</small></div>
 <div style="padding:6px 14px"><button onClick="{{goPano}}" aria-label="Mở panorama" style="display:block;width:100%;border:0;padding:2.5px;border-radius:13px;background:{{panoRim}};cursor:pointer"><span class="shot" style="display:block"><img src="{{colPano}}" alt="Panorama {{colName}}"><sc-for list="{{bands}}" as="b" hint-placeholder-count="5"><span class="bd2 {{b.cls}}" style="left:{{b.left}}"></span></sc-for></span></button></div>
 '''+sif('panoOk','<div class="sub" style="text-align:center;padding:2px 16px 6px;font-weight:800;color:var(--pink)">Chạm panorama để xem toàn màn hình</div>','false')+'''
 <div class="sub" style="padding:4px 16px 6px">Thẻ chưa sở hữu được ẩn cho đến khi bạn nhận. Gom đủ 5 thẻ thường để mở panorama, khung tròn và danh hiệu.</div>
 ''','true')+sif('colLocked','<div class="empty"><div class="ei">'+ic('lock')+'</div>{{colName}} mở vào {{lockDate}}.</div>')+sif('colUltra','''<div class="sec"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,#ffd23f,#ff2e88,#8b5cff)"></i>Ultra Limited</span><small>{{ultraSt}}</small></div>
 <div style="display:flex;gap:12px;padding:8px 14px">
  <div style="flex:1;min-width:0;text-align:center">'''+sif('u1Ready','<button data-i="1" onClick="{{openU}}" style="display:block;width:100%;padding:0">'+ultraV(1,166)+'</button><div class="sub" style="margin-top:12px;font-weight:800;color:var(--ink)">{{u1Songs}}</div>')+sif('u1New','<div class="kmprz can" style="margin:0;padding:34px 8px"><small>ULTRA #1</small><b>Chưa có nhạc</b><button class="kmgo" data-i="1" onClick="{{startU}}" style="margin:12px auto 0">Chọn 2 bài</button></div>')+sif('u1Lock','<div class="kmprz lk" style="margin:0;padding:48px 8px"><small>ULTRA #1</small><b>Gom đủ 3 concept</b></div>','true')+'''</div>
  <div style="flex:1;min-width:0;text-align:center">'''+sif('u2Ready','<button data-i="2" onClick="{{openU}}" style="display:block;width:100%;padding:0">'+ultraV(2,166)+'</button><div class="sub" style="margin-top:12px;font-weight:800;color:var(--ink)">{{u2Songs}}</div>')+sif('u2New','<div class="kmprz can" style="margin:0;padding:34px 8px"><small>ULTRA #2</small><b>Chưa có nhạc</b><button class="kmgo" data-i="2" onClick="{{startU}}" style="margin:12px auto 0">Chọn 2 bài</button></div>')+sif('u2Lock','<div class="kmprz lk" style="margin:0;padding:48px 8px"><small>ULTRA #2</small><b>Gom đủ 3 concept</b></div>','true')+'''</div>
 </div>
 <div class="sub" style="padding:6px 16px">Mặt thẻ là video lặp. Chạm thẻ để mở 2 đĩa than và nghe bài đã chọn.</div>''')+'''
</section>''')+'''

<!-- ================= BẠN BÈ ================= -->
'''+sif('tabFr','''<section class="scr on" id="fr"><div class="head"><div><small>Kết bạn bằng username</small><h1>Bạn bè</h1></div><div class="hact">'''+HEAD_ICONS+'''</div></div>
 <div class="card-b"><h2>Bạn của bạn <em>0</em></h2><div class="empty" style="padding:18px 10px"><div class="ei">'''+ic('users')+'''</div>Màn này không đổi trong sự kiện Mùa Concept.</div></div></section>''')+'''

<!-- ================= HỒ SƠ ================= -->
'''+sif('tabPro','''<section class="scr on" id="pro"><div class="head"><div><small>Khung tròn &amp; danh hiệu</small><h1>Hồ sơ</h1></div><div class="hact"><button class="ibtn" aria-label="Cài đặt">'''+ic('gear')+'''</button></div></div>
 <div class="sec"><span>Mùa Concept</span><small>{{celN}}/3 đã mở</small></div>
 <sc-for list="{{rews}}" as="r" hint-placeholder-count="3"><div class="card-b" style="text-align:center;{{r.dim}}"><small class="sub" style="font-weight:800;letter-spacing:.1em;color:{{r.a}}">{{r.st}}</small><div style="padding:14px 0 26px">'''+FR_S+'''</div><div>'''+TT_S+'''</div></div></sc-for>
 <div class="card-b" style="text-align:center"><h2 style="display:block">Thẻ Ultra Limited</h2><div class="sub" style="margin-top:4px">{{ultraSt}} · gom đủ 3 concept để nhận 2 thẻ</div></div>
</section>''')+'''

'''+tabs('x')+'''

<!-- ================= TRANG SỰ KIỆN ================= -->
'''+sif('pgHub','''<div class="page on"><div class="ptop"><button class="ibtn" onClick="{{closePg}}" aria-label="Quay lại">'''+ic('left')+'''</button><h1>Mùa Concept</h1></div>
 <div class="pbody"><div class="kmhero"><small>17–26/10/2026 · Sự kiện 3 concept</small><h2>{{celN}}/3 concept</h2><div class="kmbar"><i style="width:{{celPct}}"></i></div><p>Mỗi ngày một nhiệm vụ lịch, hoàn thành nhận 2 pack 5 thẻ. Gom đủ 5 thẻ thường của một concept để mở panorama, khung tròn và danh hiệu. Đủ cả 3 concept nhận 2 thẻ Ultra.</p></div>
 <div class="card-b"><small class="sub" style="font-weight:800">{{hubTag}}</small><b style="display:block;font-size:16px;margin-top:3px">{{taskT}}</b><div class="sub" style="margin:4px 0 10px">{{taskD}}</div>
  '''+sif('hubDone','<div style="font-size:12.5px;font-weight:900;color:var(--mint)">✓ Đã xong · nhận 2 pack</div>')+sif('hubOpen','<div style="font-size:12.5px;font-weight:800;color:#d98400">Chưa xong · tick việc trong Lịch</div>','true')+sif('hasPacks','<button class="kmgo" onClick="{{openPack}}" style="margin-top:10px">'+ic('gift')+' Mở pack · còn {{packN}}</button>')+'''</div>
 <div class="kmlist"><sc-for list="{{concs}}" as="c" hint-placeholder-count="3"><div class="kmr {{c.cls}}" style="--kc:{{c.a}}"><div class="kmv">'''+FR_H+'''</div><div class="kmx"><small>{{c.week}}</small><b>{{c.n}}</b><span>{{c.line}}</span></div><button class="kmgo" data-i="{{c.i}}" onClick="{{openCon}}">Xem</button></div></sc-for></div>
 <div class="card-b"><h2 style="display:block;font-size:14px">10 ngày</h2><div class="dg" style="margin-top:10px"><sc-for list="{{tdays}}" as="t" hint-placeholder-count="10"><i class="{{t.cls}}" style="--c:{{t.c}}">{{t.d}}</i></sc-for></div><div class="sub" style="margin-top:9px;line-height:1.5">17–19 Urichinguchana · 20–22 Aniyaaa · 23–25 Poyoyoi · 26 ngày bù. Kết thúc 26/10/2026 lúc 23:59.</div></div>
 '''+sif('ultSt1','<div class="kmprz lk"><small>Quà tổng</small><b>Gom đủ 3 concept để nhận 2 thẻ Ultra</b><div class="kmpk"><i></i><i></i></div></div>','true')+sif('ultSt2','<div class="kmprz can"><small>Quà tổng</small><b>2 thẻ Ultra đang chờ bạn</b><p>Chọn 2 trong 7 bài của CORTIS cho mỗi thẻ.</p><button class="kmgo big" onClick="{{jumpU}}">'+ic('gift')+' Nhận thẻ</button></div>')+'''
 </div></div>''')+'''

<!-- ================= XEM THẺ ================= -->
'''+sif('pgDet','''<div class="page viewer on"><div class="ptop" style="color:#fff"><button class="ibtn" style="background:rgba(255,255,255,.14);border-color:transparent;color:#fff" onClick="{{closePg}}" aria-label="Quay lại">'''+ic('left')+'''</button><h1>{{cName}}</h1></div>
 <div class="stagev"><div class="df {{flipCls}}" onClick="{{flipCard}}"><div class="dff">'''+sif('showNorm',dyn_n(),'true')+sif('showHolo',dyn_h())+'''</div><div class="dfb">'''+BACKS+'''</div></div></div>
 <div class="info2"><h2>{{cConName}}</h2><p>{{badgeTxt}} · {{shLabel}}</p><div class="vbtns"><button onClick="{{flipCard}}">'''+ic('sync')+''' Lật mặt sau</button></div></div></div>''')+'''

<!-- ================= PANORAMA ================= -->
'''+sif('pgPano','''<div class="page viewer on"><div class="ptop" style="color:#fff"><button class="ibtn" style="background:rgba(255,255,255,.14);border-color:transparent;color:#fff" onClick="{{closePg}}" aria-label="Thoát">'''+ic('x')+'''</button><h1>Panorama · {{colName}}</h1></div>
 <div style="flex:1;min-height:0;position:relative;overflow:hidden"><img src="{{colPano}}" alt="Panorama" style="position:absolute;left:0;top:50%;height:520px;width:{{imgW}}px;max-width:none;display:block;transform:translate({{panX}},-50%);transition:transform .12s linear"></div>
 <div class="info2" style="padding-top:12px"><h2 style="font-size:16px">Nghiêng điện thoại để nhìn quanh</h2>
  <div style="position:relative;height:28px;border-radius:7px;overflow:hidden;border:1.5px solid rgba(255,255,255,.22);margin-top:10px"><img src="{{colPano}}" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.5;display:block"><span style="position:absolute;top:0;bottom:0;width:{{fovW}};left:{{fovX}};border:2px solid {{tabA}};border-radius:5px;background:rgba(255,255,255,.18)"></span></div>
  <div style="margin-top:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.1);border:1.5px dashed rgba(255,255,255,.3);text-align:left"><small style="display:block;font-size:9.5px;font-weight:800;letter-spacing:.12em;opacity:.7;margin-bottom:6px">GIẢ LẬP XOAY ĐIỆN THOẠI (CHỈ CÓ TRONG BẢN DEMO)</small><input id="panr" type="range" min="0" max="100" value="{{panVal}}" onInput="{{onPan}}" aria-label="Xoay điện thoại" style="width:100%;accent-color:#FF2E88"></div></div></div>''')+'''

<!-- ================= THẺ ULTRA ================= -->
'''+sif('pgUcard','''<div class="page viewer on" style="background:radial-gradient(520px 520px at 50% 40%,#3a1c6a,#05030d 76%)"><div class="ptop" style="color:#fff"><button class="ibtn" style="background:rgba(255,255,255,.14);border-color:transparent;color:#fff" onClick="{{closeU}}" aria-label="Đóng thẻ">'''+ic('x')+'''</button><h1>Thẻ Ultra #{{u}}</h1></div>
 <div class="uwrap pl {{psCls}}" style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center">
  <div onClick="{{tapStage}}">'''+STAGE+'''</div>
  '''+sif('ustIdle','<div style="text-align:center;margin-top:10px"><span class="hint2">♪ CHẠM THẺ ĐỂ NGHE NHẠC</span></div>','true')+sif('ustCh','<div class="info2" style="padding-top:6px"><h2 style="font-size:17px">Chọn 1 đĩa để phát</h2><p>Hai đĩa trượt ra khỏi thẻ. Nghe hết bài mà không cần thoát thẻ.</p></div>')+sif('ustPlay','''<div style="padding:12px 24px 0"><b style="display:block;font:800 19px 'Unbounded'">{{curT}}</b><small style="display:block;font-size:11.5px;font-weight:700;opacity:.7;margin-top:3px">CORTIS</small>
   <div class="pgb" style="margin-top:14px"><i id="pgi" style="width:0%"></i></div><div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;font-weight:800;opacity:.75"><span id="pgt">0:00</span><span>{{curLen}}</span></div>
   <div class="vbtns"><button onClick="{{togglePause}}">{{pauseTxt}}</button><button onClick="{{goChoose}}">Đổi đĩa</button></div></div>''')+'''
 </div></div>''')+'''

<!-- ================= BẢNG CHỌN BÀI (SHEET) ================= -->
'''+sif('shSongs','''<div class="bd on" onClick="{{closeSheet}}"></div><div class="sheet on"><h3 style="font-size:19px">Chọn 2 bài cho thẻ Ultra #{{u}}</h3><p class="sub">Thẻ mang đúng 2 bài bạn chọn trong 7 bài của CORTIS. Chọn xong là khóa vĩnh viễn.</p>
 <div class="kmlist" style="margin:12px 0 0;gap:8px"><sc-for list="{{songs}}" as="s" hint-placeholder-count="7"><button class="kmr {{s.cls}}" style="--kc:{{s.c}};text-align:left;width:100%" data-i="{{s.i}}" onClick="{{pickSong}}"><span class="dsc" style="--c:{{s.c}}"></span><span class="kmx"><b style="font-size:15px">{{s.t}}</b><span>CORTIS · {{s.len}}</span></span><span class="kmn">{{s.ck}}</span></button></sc-for></div>
 <button class="igo {{lockCls}}" onClick="{{lock}}">{{lockTxt}}</button></div>''')+'''

<!-- ================= HIỆU ỨNG TOÀN MÀN (PACK / LẬT THẺ / MỞ KHÓA) ================= -->
'''+sif('fxPack','''<div class="kmfx on"><div class="kmbg"></div><div class="kmcf">'''+KMCF+'''</div><div class="kmst"><div class="kmrv" style="--kc:{{pkA}};justify-content:center;min-height:100%">
  '''+sif('pkPick','<div style="display:flex;gap:6px;margin-bottom:8px"><button class="chip {{pc1}}" data-i="1" onClick="{{pickC}}">Urichinguchana</button><button class="chip {{pc2}}" data-i="2" onClick="{{pickC}}">Aniyaaa</button><button class="chip {{pc3}}" data-i="3" onClick="{{pickC}}">Poyoyoi</button></div>')+'''
  <button class="tr {{trCls}}" onClick="{{tear}}" aria-label="Xé pack">@@PK@@</button>
  <p class="kmhint">{{tearTxt}}</p><p class="kmrn"><b>{{pkLabel}}</b><br>{{pkSub}}</p>
  <button class="chip" onClick="{{closeFx}}" style="color:#fff;border-color:rgba(255,255,255,.4);margin-top:8px">Để sau</button></div></div></div>''')+'''
'''+sif('fxReveal','''<div class="kmfx on"><div class="kmbg"></div><div class="kmcf">'''+KMCF+'''</div><div class="kmst"><div class="kmrv" style="--kc:{{shA}}"><small class="kmk">THẺ {{shNo}}/5 · {{shKind}}</small>
  <div class="df {{flipCls}} {{popCls}}" onClick="{{flipCard}}" style="margin:8px auto"><div class="dff">'''+sif('showNorm',dyn_n(),'true')+sif('showHolo',dyn_h())+'''</div><div class="dfb">'''+BACKS+'''</div></div>
  <span class="badge {{badgeCls}}">{{badgeTxt}}</span><p class="kmrn"><b>{{cName}}</b> · {{cConName}}<br><span style="opacity:.7;font-size:11.5px">Chạm thẻ để lật mặt sau</span></p>
  <div class="dts"><sc-for list="{{dots}}" as="d" hint-placeholder-count="5"><i class="{{d.cls}}"></i></sc-for></div>
  <button class="igo kmok" onClick="{{nextCard}}">{{nextTxt}}</button></div></div></div>''')+'''
'''+sif('fxUnlock','''<div class="kmfx on"><div class="kmbg"></div><div class="kmcf">'''+KMCF+'''</div><div class="kmst"><div class="kmrv" style="--kc:{{ucA}}"><small class="kmk">ĐỦ 5/5 THẺ THƯỜNG</small><h2 style="font:800 24px 'Unbounded'">{{ucName}}</h2>
  <div style="padding:10px 0 4px">'''+FR+'''</div><div style="margin-top:26px">'''+TT+'''</div>
  <div style="width:100%;margin:18px 0 0;padding:2.5px;border-radius:13px;background:linear-gradient(100deg,#fff,{{ucA}},#4CC9FF,#fff)"><div class="shot"><img src="{{ucPano}}" alt="Panorama đã mở"></div></div>
  <p class="kmrn" style="text-align:left;line-height:1.9;margin-top:10px">✓ Panorama {{ucName}} đã mở<br>✓ Khung tròn và danh hiệu mới<br>✓ 1 pack thẻ thường tặng kèm</p>
  <button class="igo" onClick="{{unPack}}">'''+ic('gift')+''' Mở pack tặng</button><button class="igo" onClick="{{unNext}}" style="background:rgba(255,255,255,.16);box-shadow:none;margin-top:8px">{{unNextTxt}}</button></div></div></div>''')+'''
'''+sif('fxUget','''<div class="kmfx on"><div class="kmbg" style="background:radial-gradient(560px 560px at 50% 32%,#4a1c7a,#05030d 76%)"></div><div class="kmcf">'''+KMCF+'''</div><div class="kmst"><div class="kmrv" style="--kc:#FFE45E"><small class="kmk">ĐỦ CẢ 3 CONCEPT</small><h2 style="font:800 22px 'Unbounded'">2 thẻ Ultra Limited</h2>
  <div style="display:flex;gap:12px;justify-content:center;margin:14px 0">'''+ultraV(1,148)+ultraV(2,148)+'''</div>
  <p class="kmrn">Mỗi thẻ mang 2 bài hát bạn chọn trong 7 bài của CORTIS. Chọn xong là khóa vĩnh viễn.</p>
  <button class="igo" onClick="{{startU1}}">Chọn nhạc cho thẻ #1</button><button class="igo" onClick="{{closeFx}}" style="background:rgba(255,255,255,.16);box-shadow:none;margin-top:8px">Để sau</button></div></div></div>''')+'''
<div class="toast {{toastCls}}">{{toast}}</div>
</div>

<!-- ================= BẢNG ĐIỀU KHIỂN ================= -->
<div class="cp">
 <h3>Bảng điều khiển</h3>
 <p style="margin:4px 0 0;font-size:11.5px;font-weight:600;color:#A7A9E6;line-height:1.5">Chỉ có trong bản thử nghiệm, không thuộc app. Dùng để nhảy ngày, cấp pack, ép kết quả và kiểm tra từng trạng thái.</p>
 <div class="cs"><div class="cl">NGÀY HIỆN TẠI · {{dayLbl}}</div>
  <div class="dchips"><sc-for list="{{dchips}}" as="d" hint-placeholder-count="12"><button class="{{d.cls}}" data-i="{{d.i}}" onClick="{{setDay}}">{{d.dt}}<small>{{d.wd}}</small><i style="--c:{{d.c}}"></i></button></sc-for></div>
  <div class="g" style="margin-top:8px"><button class="pb" onClick="{{dayPrev}}">‹ Lùi 1 ngày</button><button class="pb" onClick="{{dayNext}}">Tiến 1 ngày ›</button><button class="pb {{dkOn}}" onClick="{{toggleDk}}">Chế độ tối</button></div>
 </div>
 <div class="cs"><div class="cl">NHIỆM VỤ &amp; PACK</div>
  <div class="g"><button class="pb gold" onClick="{{tick}}">Xong nhiệm vụ hôm nay (+2 pack)</button><button class="pb" onClick="{{untick}}">Hoàn tác</button><button class="pb" onClick="{{addDaily}}">+1 pack ngày</button><button class="pb" onClick="{{addBonus}}">+1 pack tặng</button><button class="pb red" onClick="{{clearPacks}}">Xóa pack</button></div>
 </div>
 <div class="cs"><div class="cl">ÉP KẾT QUẢ MỞ PACK</div>
  <div class="g"><button class="pb {{f1}}" data-i="0" onClick="{{setForce}}">Ngẫu nhiên 16% / 4%</button><button class="pb {{f2}}" data-i="1" onClick="{{setForce}}">Toàn holo</button><button class="pb {{f3}}" data-i="2" onClick="{{setForce}}">Ưu tiên thẻ chưa có</button></div>
 </div>
 <div class="cs"><div class="cl">THẺ THEO CONCEPT</div>
  <sc-for list="{{crows}}" as="r" hint-placeholder-count="3"><div class="cr"><span style="width:10px;height:10px;border-radius:50%;background:{{r.a}};flex:none"></span><span class="nm">{{r.n}}<small>{{r.line}}</small></span><button class="pb" data-i="{{r.i}}" onClick="{{c4}}">4/5</button><button class="pb gold" data-i="{{r.i}}" onClick="{{c5}}">5/5</button><button class="pb" data-i="{{r.i}}" onClick="{{cH}}">+holo</button><button class="pb red" data-i="{{r.i}}" onClick="{{cX}}">Xóa</button></div></sc-for>
  <div class="g"><button class="pb gold" onClick="{{fullAll}}">Hoàn thành cả 3 concept → Ultra</button></div>
 </div>
 <div class="cs"><div class="cl">NHẢY TỚI MÀN</div>
  <div class="g"><button class="pb" onClick="{{jCal}}">Lịch</button><button class="pb" onClick="{{jToday}}">Hôm nay</button><button class="pb" onClick="{{jHub}}">Trang sự kiện</button><button class="pb" onClick="{{openPack}}">Mở pack</button><button class="pb" onClick="{{jCol}}">Thẻ ảnh</button><button class="pb" onClick="{{goPano}}">Panorama</button><button class="pb" onClick="{{jPro}}">Hồ sơ</button><button class="pb" onClick="{{jumpU}}">Ultra</button><button class="pb" onClick="{{prevUnlock}}">Màn mở khóa</button></div>
 </div>
 <div class="cs"><div class="cl">THỐNG KÊ</div><div class="stats">{{stats}}</div></div>
 <div class="cs"><button class="pb red" onClick="{{reset}}" style="width:100%;padding:11px">Đặt lại toàn bộ</button></div>
</div>
</div>'''
PK=''.join(sif(f'pk{c}{k}',rhtml(pack(c,190,lab)),'true' if (c==1 and k=='d') else 'false') for c in (1,2,3) for k,lab in (('d','MÙA CONCEPT'),('b','QUÀ TẶNG')))
body=body.replace('@@PK@@',PK)
assert '@@' not in body
import b9css
APPCSS=b9css.APPCSS
mycss=rcss(EX3+EX4)
stage_css=rcss(b9css.STAGE_FILTER(EX6))
cp_css=b9css.CP
SCRIPT=open('b9_js.js',encoding='utf-8').read()
css=REAL+'\n'+mycss+'\n'+stage_css+'\n'+APPCSS+'\n'+cp_css
html=page('Bản thử nghiệm Mùa Concept',910,904,body.replace('<div class="rapp','<div class="rapp'),css)
html=html.replace('<div style="width:910px;height:904px;overflow:hidden;background:#15123B;color:#F1F0FF;position:relative">','<div style="width:910px;height:904px;overflow:hidden;position:relative">')
a=html.index('class Component extends DCLogic'); b=html.index('</script>',a)
html=html[:a]+SCRIPT+'\n'+html[b:]
# sprite icon ở đầu
html=html.replace('<div class="rapp ',SPRITE+'<div class="rapp ',1)
open(OUT2+'Build.dc.html','w',encoding='utf-8').write(html)
print('ok',len(html))
