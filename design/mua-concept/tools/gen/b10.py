import re,random
from shared import *
OUT2='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
REAL=open('../pc/real_scoped.css',encoding='utf-8').read()
SHELL=open('/home/claude/conchobietnoi/colentis/src/ui/shell.html',encoding='utf-8').read()
SPRITE=SHELL[SHELL.index('<svg width="0"'):]
_a=open('/home/claude/conchobietnoi/colentis/src/ui/legacy/_07a.js',encoding='utf-8').read()
EXSYM=''.join(re.findall(r'<symbol id="i-bell".*?</symbol>',_a))
assert EXSYM
SPRITE=SPRITE.replace('<symbol id="i-cal"',EXSYM+'<symbol id="i-cal"',1)
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
APPCARD='<div class="apw"><div class="pc {{appCls}}" style="{{appVars}}"><div class="pc-glow"></div><div class="pc-fx"><i class="ringx" style="--l:0s;--d:3s"></i><i class="ringx" style="--l:1.4s;--d:3s"></i></div><span class="pc-tag">{{appTag}}</span><div class="pc-frame"><div class="pc-face"><img src="{{appImg}}" alt="x"></div></div></div></div>'
APPBACK='<div class="apk"><i></i><b>COLENTIS</b><small>{{appTag}}</small></div>'
BACKS=''
for c in (1,2,3):
    for i in range(5):
        BACKS+=sif(f'bk_{c}_n_{i}',rhtml(back_n(i,c,250)))+sif(f'bk_{c}_h_{i}',rhtml(back_h(i,c,250)))

# ---------- thẻ Ultra: mặt thẻ là video ----------
VID={1:'/_blob/454e864a2d56e54c6b58061b0bb07bea',2:'/_blob/7c3e22f3c3ab3a042759cb58ce8fe09e'}
THB={1:'/_blob/b5c79d13f84e9829e65af73eca31ca0a',2:'/_blob/708cf8c9d898e9aa8e253b422f762d90'}
def ultraLite(no):
    return f'<div class="ul"><img src="{THB[no]}" alt="Thẻ Ultra {no}"><span class="ul-t">ULTRA LIMITED</span><b class="ul-n">N°{no}/2</b><i class="ul-p">▶</i></div>'
def ultraV(no,w,vid=True):
    pts=''.join(f'<span class="uc-pt" style="left:{x}%;animation-delay:{d}s"></span>' for x,d in [(8,0),(20,1.2),(34,.5),(48,2),(60,.9),(74,2.6),(86,.3),(94,1.7)])
    MEDIA=(f'<video class="uc-vid" src="{VID[no]}" poster="{THB[no]}" muted loop autoplay playsinline preload="auto"></video>' if vid else f'<img class="uc-vid" src="{THB[no]}" alt="">')
    return rhtml(f'''<div class="cw" style="width:{w}px">{PLASMA}<div class="tl"><div class="uc"><span class="uc-aura"></span><div class="uc-in">{MEDIA}<div class="uc-au"></div>{pts}{BOLTS}<div class="uc-t"><small>ULTRA LIMITED</small><b>CONCEPT</b></div><div class="uc-f"><b>MÙA CONCEPT</b><i>N°{no}/2</i></div><div class="uc-sw"></div></div><span class="uc-pl"></span></div></div></div>''')


def ultraBack(n,w):
    pts=''.join(f'<span class="uc-pt" style="left:{x}%;animation-delay:{d}s"></span>' for x,d in [(14,0),(38,1.1),(62,.5),(84,1.8)])
    return f'''<div class="cw" style="width:{w}px"><div class="tl"><div class="uc"><span class="uc-aura"></span><div class="uc-in ub"><i class="ub-sky"></i><i class="ub-stars"></i><i class="ub-ray"></i>
<svg class="ub-em" viewBox="0 0 100 100"><defs><linearGradient id="ubg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE45E"/><stop offset=".5" stop-color="#FF2E88"/><stop offset="1" stop-color="#4CC9FF"/></linearGradient></defs>
<g class="ub-r1"><circle cx="50" cy="50" r="45" fill="none" stroke="url(#ubg)" stroke-width=".8" stroke-dasharray="1 2.4"/><circle cx="50" cy="5" r="2.8" fill="#FFD24A"/></g>
<g class="ub-r2"><ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="url(#ubg)" stroke-width="1.1" transform="rotate(60 50 50)"/><circle cx="50" cy="50" r="3.2" fill="#FF4FA3" transform="rotate(60 50 50) translate(42 0)"/></g>
<g class="ub-r3"><ellipse cx="50" cy="50" rx="42" ry="15" fill="none" stroke="url(#ubg)" stroke-width="1.1" transform="rotate(-60 50 50)"/><circle cx="50" cy="50" r="3.2" fill="#4CC9FF" transform="rotate(-60 50 50) translate(-42 0)"/></g>
<circle cx="50" cy="50" r="19" fill="none" stroke="#FFE45E" stroke-opacity=".55" stroke-width=".7"/></svg>
<i class="ub-core"></i><svg class="ub-st" viewBox="0 0 100 100"><path d="M50 14 L58 42 L86 50 L58 58 L50 86 L42 58 L14 50 L42 42Z" fill="#fff"/></svg><i class="ub-fl"></i>
<div class="uc-au"></div>{pts}
<div class="uc-t"><small>MÙA CONCEPT</small></div>
<div class="ub-n"><b>ULTRA</b><em>LIMITED</em></div>
<div class="uc-f"><b>N°{n}</b><i>♪ CORTIS</i></div><div class="uc-sw"></div></div></div></div></div>'''

# ---------- khung tròn & danh hiệu ----------
FR=rhtml(fr(1,2,120)).replace('--w:120px;--a:#FFB02E;--c:#FFE3B0;--bl:13px','--w:120px;{{ucV}}').replace(MM[1][2],'{{ucFr}}')
TT=rhtml(ttl(1)).replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{ucT}}"').replace('Urichinguchana','{{ucName}}')
FR_S=rhtml(fr(1,2,76)).replace('--w:76px;--a:#FFB02E;--c:#FFE3B0;--bl:8px','--w:76px;{{r.v}}').replace(MM[1][2],'{{r.img}}')
TT_S=rhtml(ttl(1)).replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{r.t}}"').replace('Urichinguchana','{{r.n}}')
FR_P=re.sub(r'style="--w:96px;[^"]*"','style="--w:96px;{{eqV}}"',rhtml(fr(1,2,96))).replace(MM[1][2],'{{eqImg}}')
TT_P=rhtml(ttl(1)).replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{eqT}}"').replace('Urichinguchana','{{eqName}}')
assert '{{eqV}}' in FR_P and '{{eqImg}}' in FR_P
FR_H=rhtml(fr(1,2,66)).replace('--w:66px;--a:#FFB02E;--c:#FFE3B0;--bl:7px','--w:66px;{{c.v}}').replace(MM[1][2],'{{c.img}}')
assert '{{ucV}}' in FR and '{{r.v}}' in FR_S and '{{c.v}}' in FR_H

# ---------- sân khấu đĩa than ----------
eq=''.join(f'<i style="animation-delay:{(k*0.13)%0.5:.2f}s;animation-duration:{0.35+(k*37%25)/100:.2f}s"></i>' for k in range(16))
notes=''.join(f'<span class="nt" style="left:{x}px;top:{y}px;animation-delay:{d}s">{s}</span>' for x,y,d,s in [(60,300,0,'♪'),(300,320,.8,'♫'),(120,260,1.6,'♬'),(250,280,2.2,'♪'),(30,340,.4,'♫'),(330,250,1.2,'♪')])
STAGE=rhtml('<div class="st {{stCls}}"><div class="dv dA" style="--c:{{cA}}" onClick="{{playA}}"><i class="lb">{{titleA}}</i></div><div class="dv dB" style="--c:{{cB}}" onClick="{{playB}}"><i class="lb">{{titleB}}</i></div>'
 +notes+'<div class="cardw"><span class="shk"></span><div class="tlw">'+sif('uIs1',ultraV(1,220),'true')+sif('uIs2',ultraV(2,220))+'<div class="eq">'+eq+'</div></div></div></div>')
# làm lại phần phát: dùng cardw đã đổi tên
KMCF=''.join(f'<i style="left:{random.Random(k).randint(0,100)}%;background:{["#FFB02E","#FF2E88","#4CC9FF","#fff","#ffd23f"][k%5]};--d:{2.4+k%5*.4:.1f}s;--l:{(k%7)*.17:.2f}s;--x:{(k*13%140)-70}px;--r:{200+k*37%520}deg;width:{6+k%5}px;height:{9+k%7}px"></i>' for k in range(22))

def tabs(act):
    items=[('cal','Lịch','cal'),('today','Hôm nay','sun'),('col','Thẻ','cards'),('fr','Bạn bè','users'),('pro','Hồ sơ','user')]
    return '<nav class="tabs">'+''.join(f'<button class="{{{{tb_{k}}}}}" data-i="{i}" onClick="{{{{goTab}}}}">{ic(i_)}{t}{"<span class=dot-n style=display:{{tdot}}>!</span>" if k=="today" else ""}</button>' for i,(k,t,i_) in enumerate(items))+'</nav>'
HEAD_ICONS=f'<button class="ibtn" aria-label="Thông báo">{ic("bell")}</button><button class="ibtn" aria-label="Hòm thư" onClick="{{{{openMail}}}}">{ic("mail")}<span class="dot-n" style="display:{{{{mailDot}}}}">{{{{mailN}}}}</span></button>'
TASKS_BLOCK=f'''<div class="card-b" style="margin-top:12px"><div style="display:flex;gap:14px;align-items:center"><div class="ring-p" style="--p:{{{{ringP}}}}"><i>{{{{ringTxt}}}}</i></div><div style="flex:1;min-width:0"><h2 style="display:block;font-size:16px">{{{{taskHead}}}}</h2><div class="sub" style="margin-top:3px">{{{{taskSub}}}}</div></div></div>
 <div style="margin-top:10px">
 {sif('evTask',f'<div class="t {{{{tkOn}}}}"><button class="ck" onClick="{{{{tick}}}}" aria-label="Hoàn thành"></button><span class="tt">{{{{taskT}}}}<small>{{{{taskD}}}}</small></span><span class="lbl" style="background:{{{{dayA}}}};color:#1E1B5E">Mùa Concept</span></div>','true')}
 <div class="t"><button class="ck" disabled></button><span class="tt">Đi chợ cuối tuần<small>Cả ngày</small></span><span class="lbl" style="background:#4CC9FF;color:#1E1B5E">Cá nhân</span></div>
 <div class="t d"><button class="ck"></button><span class="tt">Gọi cho ba mẹ<small>20:00</small></span><span class="lbl" style="background:#35D0A5;color:#1E1B5E">Gia đình</span></div></div></div>'''
body='''
<div class="rapp {{dkCls}}" style="width:1170px;height:904px;padding:30px;display:flex;gap:30px;align-items:flex-start;background:#cfd3f8;background-image:radial-gradient(900px 600px at 15% 0,#d9d4ff,transparent),radial-gradient(900px 700px at 100% 100%,#ffd1ea,transparent)">
<div class="phone" id="app" style="width:390px;max-width:390px;height:844px;flex:none;border-radius:32px;box-shadow:0 0 0 8px #14123F,0 30px 60px rgba(20,18,63,.4)">
<div class="sbsp"></div>

<!-- ================= LỊCH ================= -->
'''+sif('tabCal','''<section class="scr on" id="cal">
 <div class="head"><div><small>Lịch của tôi '''+ic('down')+'''</small><div class="mnav"><button class="ibtn" aria-label="Tháng trước">'''+ic('left')+'''</button><h1>Tháng 10</h1><button class="ibtn" aria-label="Tháng sau">'''+ic('right')+'''</button></div></div><div class="hact"><div class="streak">'''+ic('flame')+''' 12</div>'''+HEAD_ICONS+'''</div></div>
 <button class="banner km bnx" data-i="0" onClick="{{bnGo}}" style="--bc:{{bnC}};background:{{bnBg}}"><span class="bnbg" style="background-image:url({{bnPano}})"></span><span class="bnl"><small class="bnk">{{bnKick}}</small><b>{{bnTitle}}</b><small>{{bnSub}}</small><span class="bnd"><sc-for list="{{bnDays}}" as="d" hint-placeholder-count="10"><i class="{{d.cls}}" style="--c:{{d.c}}"></i></sc-for></span></span><span class="bnr"><sc-for list="{{bnCons}}" as="c" hint-placeholder-count="3"><span class="bnf {{c.cls}}" style="--a:{{c.a}}"><img src="{{c.img}}" alt=""><em>{{c.mk}}</em></span></sc-for><span class="bnp" style="display:{{bnPd}}">{{bnPk}}</span></span></button>
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
 <button class="banner km bnx" data-i="0" onClick="{{bnGo}}" style="--bc:{{bnC}};background:{{bnBg}}"><span class="bnbg" style="background-image:url({{bnPano}})"></span><span class="bnl"><small class="bnk">{{bnKick}}</small><b>{{bnTitle}}</b><small>{{bnSub}}</small><span class="bnd"><sc-for list="{{bnDays}}" as="d" hint-placeholder-count="10"><i class="{{d.cls}}" style="--c:{{d.c}}"></i></sc-for></span></span><span class="bnr"><sc-for list="{{bnCons}}" as="c" hint-placeholder-count="3"><span class="bnf {{c.cls}}" style="--a:{{c.a}}"><img src="{{c.img}}" alt=""><em>{{c.mk}}</em></span></sc-for><span class="bnp" style="display:{{bnPd}}">{{bnPk}}</span></span></button>
 '''+sif('hasGift','<button class="gfc" onClick="{{giftOpen}}">'+ic('gift')+'<span><b>{{giftHead}}</b><small>{{giftTxt}}</small></span><em>Mở thư</em></button>')+TASKS_BLOCK+sif('hasPacks','<button class="claimcta" onClick="{{openPack}}">'+ic('gift')+' Mở pack Mùa Concept · còn {{packN}}</button>','false')+'''
</section>''')+'''

<!-- ================= THẺ ẢNH ================= -->
'''+sif('tabCol','''<section class="scr on" id="col">
 <div class="head"><div><small>Bộ sưu tập của bạn</small><h1>Thẻ ảnh</h1></div><div class="hact"><button class="ibtn" aria-label="Hòm thư" onClick="{{openMail}}">'''+ic('mail')+'''<span class="dot-n" style="display:{{mailDot}}">{{mailN}}</span></button></div></div>
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
 ''','true')+sif('colApp','''<div class="sec"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,#8D94B8,#2F8CFF,#9B5CFF,#FF2E88)"></i>Thẻ app · từ pack thưởng</span></div>
 <div class="rbar" style="margin-top:2px"><sc-for list="{{appRows}}" as="r" hint-placeholder-count="4"><div style="--rc:{{r.a}}"><b>{{r.v}}</b>{{r.n}}<div class="bar"><i style="width:{{r.p}}"></i></div></div></sc-for></div>
 <div class="sec"><span>Mới nhận</span></div>
 '''+sif('hasRecent','<div class="aprc"><sc-for list="{{appRecent}}" as="c" hint-placeholder-count="4"><div class="pc thumb {{c.cls}}" style="--w:{{c.w}}px;--ar:{{c.ar}}"><div class="pc-glow"></div><span class="pc-tag">{{c.tag}}</span><div class="pc-frame"><div class="pc-face"><img src="{{c.img}}" alt="x"></div></div></div></sc-for></div>')+sif('noRecent','<div class="empty"><div class="ei">'+ic('gift')+'</div>Chưa có thẻ app. Hoàn thành một concept để nhận pack thưởng.</div>','true')+'''
 <div class="sub" style="padding:8px 16px">Mỗi lần hoàn thành một concept, bạn nhận 1 pack thưởng: 5 thẻ Thường, Hiếm, Huyền Thoại hoặc Bá khí của kho thẻ app (70 / 22 / 7 / 1%).</div>''')+sif('colLocked','<div class="empty"><div class="ei">'+ic('lock')+'</div>{{colName}} mở vào {{lockDate}}.</div>')+sif('colUltra','''<div class="sec"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,#ffd23f,#ff2e88,#8b5cff)"></i>Ultra Limited</span><small>{{ultraSt}}</small></div>
 <div style="display:flex;gap:12px;padding:8px 14px">
  <div style="flex:1;min-width:0;text-align:center">'''+sif('u1Ready','<button data-i="1" onClick="{{openU}}" style="display:block;width:100%;padding:0">'+ultraV(1,166,False)+'</button><div class="sub" style="margin-top:12px;font-weight:800;color:var(--ink)">{{u1Songs}}</div>')+sif('u1New','<div class="kmprz can" style="margin:0;padding:34px 8px"><small>ULTRA #1</small><b>Chưa có nhạc</b><button class="kmgo" data-i="1" onClick="{{startU}}" style="margin:12px auto 0">Chọn 2 bài</button></div>')+sif('u1Lock','<div class="kmprz lk" style="margin:0;padding:48px 8px"><small>ULTRA #1</small><b>Gom đủ 3 concept</b></div>','true')+'''</div>
  <div style="flex:1;min-width:0;text-align:center">'''+sif('u2Ready','<button data-i="2" onClick="{{openU}}" style="display:block;width:100%;padding:0">'+ultraV(2,166,False)+'</button><div class="sub" style="margin-top:12px;font-weight:800;color:var(--ink)">{{u2Songs}}</div>')+sif('u2New','<div class="kmprz can" style="margin:0;padding:34px 8px"><small>ULTRA #2</small><b>Chưa có nhạc</b><button class="kmgo" data-i="2" onClick="{{startU}}" style="margin:12px auto 0">Chọn 2 bài</button></div>')+sif('u2Lock','<div class="kmprz lk" style="margin:0;padding:48px 8px"><small>ULTRA #2</small><b>Gom đủ 3 concept</b></div>','true')+'''</div>
 </div>
 <div class="sub" style="padding:6px 16px">Mặt thẻ là video lặp. Chạm thẻ để mở 2 đĩa than và nghe bài đã chọn.</div>''')+'''
</section>''')+'''

<!-- ================= BẠN BÈ ================= -->
'''+sif('tabFr','''<section class="scr on" id="fr"><div class="head"><div><small>Kết bạn bằng username</small><h1>Bạn bè</h1></div><div class="hact">'''+HEAD_ICONS+'''</div></div>
 <div class="card-b"><h2>Bạn của bạn <em>0</em></h2><div class="empty" style="padding:18px 10px"><div class="ei">'''+ic('users')+'''</div>Màn này không đổi trong sự kiện Mùa Concept.</div></div></section>''')+'''

<!-- ================= HỒ SƠ ================= -->
'''+sif('tabPro','''<section class="scr on" id="pro"><div class="head"><div><small>Khung tròn &amp; danh hiệu</small><h1>Hồ sơ</h1></div><div class="hact"><button class="ibtn" aria-label="Cài đặt">'''+ic('gear')+'''</button></div></div>
 <div class="card-b" style="text-align:center">'''+sif('eqNone','<div class="ei" style="width:96px;height:96px;margin:10px auto 0;border-radius:50%;background:var(--sleeve);border:2px dashed var(--line);display:grid;place-items:center;color:var(--soft)">'+ic('user')+'</div><div style="margin-top:10px;font-weight:900;font-size:16px">đời loz</div><div class="sub">Chưa dùng khung nào</div>','true')+sif('eqOn','<div style="padding:10px 0 24px">'+FR_P+'</div><div>'+TT_P+'</div><div style="margin-top:10px;font-weight:900;font-size:16px">đời loz</div>')+'''</div>
 <div class="sec"><span>Mùa Concept</span><small>{{celN}}/3 đã mở</small></div>
 <sc-for list="{{rews}}" as="r" hint-placeholder-count="3"><div class="card-b" style="text-align:center;{{r.dim}}"><small class="sub" style="font-weight:800;letter-spacing:.1em;color:{{r.a}}">{{r.st}}</small><div style="padding:14px 0 26px">'''+FR_S+'''</div><div>'''+TT_S+'''</div><div class="btnrow" style="justify-content:center"><button class="btn-s {{r.eqc}}" data-i="{{r.i}}" onClick="{{equip}}">{{r.eqt}}</button></div></div></sc-for>
 <div class="card-b" style="text-align:center"><h2 style="display:block">Thẻ Ultra Limited</h2><div class="sub" style="margin-top:4px">{{ultraSt}} · gom đủ 3 concept để nhận 2 thẻ</div></div>
</section>''')+'''

'''+tabs('x')+'''

<!-- ================= TRANG SỰ KIỆN ================= -->
'''+sif('pgMail','''<div class="page on"><div class="ptop"><button class="ibtn" onClick="{{mailBack}}" aria-label="Quay lại">'''+ic('left')+'''</button><h1>{{mailHead}}</h1></div>
 <div class="pbody">
 '''+sif('mailMain','''<div class="mbxl"><sc-for list="{{mailList}}" as="m" hint-placeholder-count="3"><button class="card-b mbxi {{m.cls}}" data-i="{{m.i}}" onClick="{{mailPick}}"><span class="mbxt" style="background:{{m.tc}}">{{m.tag}}</span><b>{{m.title}}</b><span class="mbxs">{{m.sum}}</span><span class="mbxf"><em>{{m.from}} · {{m.date}}</em><i class="mbxc {{m.stCls}}">{{m.st}}</i></span></button></sc-for></div>
 <p class="sub mbxn">{{mailEmpty}}</p>''','true')+sif('mailLet','''<div class="mbxd"><span class="mbxt" style="background:{{mTc}}">{{mTag}}</span><h2>{{mTitle}}</h2><small>{{mFrom}} · {{mDate}}</small>
  <sc-for list="{{mBody}}" as="b" hint-placeholder-count="3"><p>{{b.t}}</p></sc-for>
  '''+sif('mHasR','<div class="mbxr"><span>'+ic('gift')+'</span><div><small>QUÀ ĐÍNH KÈM</small><b>{{mRTxt}}</b></div></div><button class="igo {{mRCls}}" onClick="{{mClaim}}">{{mRBtn}}</button>')+'''</div>''')+'''</div></div>''')+'''
'''+sif('pgHub','''<div class="page on"><div class="ptop"><button class="ibtn" onClick="{{closePg}}" aria-label="Quay lại">'''+ic('left')+'''</button><h1>Mùa Concept</h1></div>
 <div class="pbody">
  <div class="hxh"><small>{{hubWhen}}</small><h2>Gom đủ 3 concept</h2>
   <div class="hxrs"><sc-for list="{{concs}}" as="c" hint-placeholder-count="3"><button class="hxr {{c.cls}}" data-i="{{c.i}}" onClick="{{openCon}}" style="--kc:{{c.a}};--p:{{c.p}}"><span class="hxo"><img src="{{c.img}}" alt=""></span><b>{{c.n}}</b><em>{{c.st}}</em></button></sc-for></div>
  </div>
  '''+sif('hasGift','<button class="gfc" onClick="{{giftOpen}}">'+ic('gift')+'<span><b>{{giftHead}}</b><small>{{giftTxt}}</small></span><em>Mở thư</em></button>')+'''<div class="hxt" style="--kc:{{dayA}}"><small>{{hubTag}}</small><b>{{taskT}}</b><span>{{taskD}}</span>
   '''+sif('hubDone','<div class="hxok">✓ Đã xong hôm nay · nhận 2 pack</div>')+sif('hubOpen','<button class="hxb1" onClick="{{hubCal}}">'+ic('check')+' Làm nhiệm vụ trong Lịch</button>','true')+sif('hasPacks','<button class="kmgo" onClick="{{openPack}}" style="margin-top:8px;width:100%;justify-content:center">'+ic('gift')+' Mở pack · còn {{packN}}</button>')+'''</div>
  <div class="hxs"><div><i>1</i><b>Làm nhiệm vụ</b><span>1 việc mỗi ngày</span></div><div><i>2</i><b>Mở 2 pack</b><span>mỗi pack 5 thẻ</span></div><div><i>3</i><b>Đủ 5 thẻ thường</b><span>nhận pack thưởng</span></div></div>
  <div class="hxl"><sc-for list="{{concs}}" as="c" hint-placeholder-count="3"><div class="hxc {{c.cls}}" style="--kc:{{c.a}}"><div class="hxcn"><small>{{c.week}}</small><b>{{c.n}}</b><span>{{c.line}}</span><div class="hxbar"><i style="width:{{c.p}}%"></i></div></div><button class="hxgo" data-i="{{c.i}}" onClick="{{openCon}}">Xem</button></div></sc-for></div>
  '''+sif('ultSt1','<div class="hxu"><b>Quà tổng</b><span>Đủ 3 concept nhận 2 thẻ Ultra Limited có nhạc</span></div>','true')+sif('ultSt2','<div class="hxu go"><b>2 thẻ Ultra đang chờ bạn</b><span>Chọn 2 trong 7 bài CORTIS cho mỗi thẻ</span><button class="kmgo big" onClick="{{jumpU}}">'+ic('gift')+' Nhận thẻ</button></div>')+'''
 </div></div>''')+'''

<!-- ================= XEM THẺ ================= -->
'''+sif('pgDet','''<div class="page viewer on"><div class="ptop" style="color:#fff"><button class="ibtn" style="background:rgba(255,255,255,.14);border-color:transparent;color:#fff" onClick="{{closePg}}" aria-label="Quay lại">'''+ic('left')+'''</button><h1>{{cName}}</h1></div>
 <div class="stagev"><div class="df {{flipCls}} {{dfLk}}" onClick="{{flipCard}}"><div class="dff">'''+sif('showNorm',dyn_n(),'true')+sif('showHolo',dyn_h())+sif('showApp',APPCARD)+'''<span class="dlk">'''+ic('lock')+'''</span></div><div class="dfb">'''+BACKS+sif('bkApp',APPBACK)+'''</div></div></div>
 <div class="info2"><h2>{{cConName}}</h2><p>{{badgeTxt}} · {{shLabel}}</p><div class="vbtns"><button onClick="{{flipCard}}">'''+ic('sync')+''' Lật mặt sau</button>'''+sif('dtGive','<button class="vgive" onClick="{{dtGiveF}}">'+ic('gift')+' Tặng · dư ×{{dtSpare}}</button>')+sif('dtAskOn','<button class="vask {{dtAskCls}}" onClick="{{dtAskF}}">'+ic('gift')+' {{dtAskTxt}}</button>')+'''</div>'''+sif('dtKeep','<p class="vhint">Chỉ còn 1 bản · giữ lại, có bản dư mới tặng được</p>')+sif('dtReq','<p class="vhint vpq">{{dtReqTxt}}</p>')+'''</div></div>''')+'''

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
 <button class="igo {{lockCls}}" onClick="{{lock}}">{{lockTxt}}</button></div>''')+''''''+sif('shWho','''<div class="bd on" onClick="{{closeSheet}}"></div><div class="sheet on"><h3 style="font-size:19px">{{whoTitle}}</h3><p class="sub">{{whoSub}}</p>
 <div class="whol"><sc-for list="{{whoList}}" as="w" hint-placeholder-count="2"><button class="wr {{w.cls}}" data-i="{{w.i}}" onClick="{{whoTog}}"><span class="wav" style="--a:{{w.a}}">{{w.ini}}</span><span class="wnm"><b>{{w.n}}</b><small>{{w.sub}}</small></span><span class="wck">{{w.ck}}</span></button></sc-for></div>
 <button class="igo {{whoGoCls}}" onClick="{{whoGo}}">{{whoGoTxt}}</button></div>''')+'''

<!-- ================= HIỆU ỨNG TOÀN MÀN (PACK / LẬT THẺ / MỞ KHÓA) ================= -->
'''+sif('fxPack','''<div class="kmfx on"><div class="kmbg"></div><div class="kmcf">'''+KMCF+'''</div><div class="kmst"><div class="kmrv" style="--kc:{{pkA}};justify-content:center;min-height:100%">
  '''+sif('pkPick','<div style="display:flex;gap:6px;margin-bottom:8px"><button class="chip {{pc1}}" data-i="1" onClick="{{pickC}}">Urichinguchana</button><button class="chip {{pc2}}" data-i="2" onClick="{{pickC}}">Aniyaaa</button><button class="chip {{pc3}}" data-i="3" onClick="{{pickC}}">Poyoyoi</button></div>')+'''
  <button class="tr {{trCls}}" onClick="{{tear}}" aria-label="Xé pack">@@PK@@</button>
  <p class="kmhint">{{tearTxt}}</p><p class="kmrn"><b>{{pkLabel}}</b><br>{{pkSub}}</p>
  <button class="chip" onClick="{{closeFx}}" style="color:#fff;border-color:rgba(255,255,255,.4);margin-top:8px">Để sau</button></div></div></div>''')+'''
'''+sif('fxReveal','''<div class="kmfx on"><div class="kmbg"></div><div class="kmcf">'''+KMCF+'''</div><div class="kmst"><div class="kmrv" style="--kc:{{shA}}"><div class="rvx {{rvCls}}" style="--kc:{{shA}}"><i class="rvr"></i><i class="rvw"></i><i class="rvw w2"></i><i class="rvf"></i><u style="--dx:191px;--dy:0px;animation-delay:0.00s"></u><u style="--dx:161px;--dy:91px;animation-delay:0.05s"></u><u style="--dx:49px;--dy:207px;animation-delay:0.10s"></u><u style="--dx:-49px;--dy:186px;animation-delay:0.15s"></u><u style="--dx:-126px;--dy:126px;animation-delay:0.00s"></u><u style="--dx:-176px;--dy:0px;animation-delay:0.05s"></u><u style="--dx:-130px;--dy:-120px;animation-delay:0.10s"></u><u style="--dx:-63px;--dy:-150px;animation-delay:0.15s"></u><u style="--dx:55px;--dy:-153px;animation-delay:0.00s"></u><u style="--dx:177px;--dy:-120px;animation-delay:0.05s"></u></div><b class="rvt {{rvCls}}">{{rvTxt}}</b><small class="kmk">THẺ {{shNo}}/{{shTot}} · {{shKind}}</small>
  <div class="df {{flipCls}} {{popCls}}" onClick="{{flipCard}}" style="margin:8px auto;{{dfSt}}"><div class="dff">'''+sif('showNorm',dyn_n(),'true')+sif('showHolo',dyn_h())+sif('showApp',APPCARD)+'''</div><div class="dfb">'''+BACKS+sif('bkApp',APPBACK)+'''</div></div>
  <span class="badge {{badgeCls}} {{popCls}}">{{badgeTxt}}</span><p class="kmrn"><b>{{cName}}</b> · {{cConName}}<br><span style="opacity:.7;font-size:11.5px">Chạm thẻ để lật mặt sau</span></p>
  <div class="dts"><sc-for list="{{dots}}" as="d" hint-placeholder-count="5"><i class="{{d.cls}}"></i></sc-for></div>
  <button class="igo kmok" onClick="{{nextCard}}">{{nextTxt}}</button></div></div></div>''')+'''
'''+sif('fxUnlock','''<div class="kmfx on"><div class="kmbg"></div><div class="kmcf">'''+KMCF+'''</div><div class="kmst"><div class="kmrv" style="--kc:{{ucA}}"><small class="kmk">ĐỦ 5/5 THẺ THƯỜNG</small><h2 style="font:800 24px 'Unbounded'">{{ucName}}</h2>
  <div style="padding:10px 0 4px">'''+FR+'''</div><div style="margin-top:26px">'''+TT+'''</div>
  <div style="width:100%;margin:18px 0 0;padding:2.5px;border-radius:13px;background:linear-gradient(100deg,#fff,{{ucA}},#4CC9FF,#fff)"><div class="shot"><img src="{{ucPano}}" alt="Panorama đã mở"></div></div>
  <p class="kmrn" style="text-align:left;line-height:1.9;margin-top:10px">✓ Panorama {{ucName}} đã mở<br>✓ Khung tròn và danh hiệu mới<br>✓ 1 pack thưởng: thẻ Thường, Hiếm, Huyền Thoại, Bá khí</p>
  <button class="igo" onClick="{{unPack}}">'''+ic('gift')+''' Mở pack thưởng</button><button class="igo" onClick="{{unNext}}" style="background:rgba(255,255,255,.16);box-shadow:none;margin-top:8px">{{unNextTxt}}</button></div></div></div>''')+'''
'''+sif('fxUget','''<div class="ugwrap">'''+sif('ugv5','''<div class="kmfx on sgx {{skCls}}"><button class="ugskip" onClick="{{ugSkip}}">Bỏ qua ›</button><div class="kmbg" style="background:radial-gradient(500px 420px at 50% 55%,#1b1030,#030208 72%)"></div>
 <div class="sgworld">
  <i class="sgfloor"></i>
  <div class="sgbeams"><i class="sgb b1"></i><i class="sgb b2"></i><i class="sgb b3"></i><i class="sgb b4"></i><i class="sgb b5"></i></div>
  <div class="sgtruss"><i class="sgl" style="left:6.0%;--i:0"></i><i class="sgl" style="left:18.6%;--i:1"></i><i class="sgl" style="left:31.2%;--i:2"></i><i class="sgl" style="left:43.8%;--i:3"></i><i class="sgl" style="left:56.4%;--i:4"></i><i class="sgl" style="left:69.0%;--i:5"></i><i class="sgl" style="left:81.6%;--i:6"></i><i class="sgl" style="left:94.2%;--i:7"></i></div>
  <div class="sgsmoke"><i></i><i class="s2"></i></div>
  <i class="sgflash"></i>
  <div class="sgfire f1"><i style="--dx:102px;--dy:-239px;animation-delay:4.20s;width:3px;height:3px"></i><i style="--dx:-43px;--dy:-123px;animation-delay:4.27s;width:4px;height:4px"></i><i style="--dx:-45px;--dy:-202px;animation-delay:4.34s;width:5px;height:5px"></i><i style="--dx:18px;--dy:-228px;animation-delay:4.41s;width:3px;height:3px"></i><i style="--dx:-71px;--dy:-140px;animation-delay:4.48s;width:4px;height:4px"></i><i style="--dx:120px;--dy:-187px;animation-delay:4.20s;width:5px;height:5px"></i><i style="--dx:144px;--dy:-231px;animation-delay:4.27s;width:3px;height:3px"></i><i style="--dx:73px;--dy:-126px;animation-delay:4.34s;width:4px;height:4px"></i><i style="--dx:-80px;--dy:-138px;animation-delay:4.41s;width:5px;height:5px"></i><i style="--dx:57px;--dy:-116px;animation-delay:4.48s;width:3px;height:3px"></i><i style="--dx:-123px;--dy:-157px;animation-delay:4.20s;width:4px;height:4px"></i><i style="--dx:-40px;--dy:-174px;animation-delay:4.27s;width:5px;height:5px"></i><i style="--dx:60px;--dy:-220px;animation-delay:4.34s;width:3px;height:3px"></i><i style="--dx:-15px;--dy:-250px;animation-delay:4.41s;width:4px;height:4px"></i><i style="--dx:117px;--dy:-253px;animation-delay:4.48s;width:5px;height:5px"></i><i style="--dx:12px;--dy:-207px;animation-delay:4.20s;width:3px;height:3px"></i></div><div class="sgfire f2"><i style="--dx:-2px;--dy:-131px;animation-delay:4.20s;width:3px;height:3px"></i><i style="--dx:-6px;--dy:-226px;animation-delay:4.27s;width:4px;height:4px"></i><i style="--dx:83px;--dy:-205px;animation-delay:4.34s;width:5px;height:5px"></i><i style="--dx:-105px;--dy:-160px;animation-delay:4.41s;width:3px;height:3px"></i><i style="--dx:-178px;--dy:-200px;animation-delay:4.48s;width:4px;height:4px"></i><i style="--dx:42px;--dy:-205px;animation-delay:4.20s;width:5px;height:5px"></i><i style="--dx:90px;--dy:-144px;animation-delay:4.27s;width:3px;height:3px"></i><i style="--dx:145px;--dy:-206px;animation-delay:4.34s;width:4px;height:4px"></i><i style="--dx:-97px;--dy:-116px;animation-delay:4.41s;width:5px;height:5px"></i><i style="--dx:110px;--dy:-169px;animation-delay:4.48s;width:3px;height:3px"></i><i style="--dx:-13px;--dy:-237px;animation-delay:4.20s;width:4px;height:4px"></i><i style="--dx:145px;--dy:-183px;animation-delay:4.27s;width:5px;height:5px"></i><i style="--dx:-88px;--dy:-236px;animation-delay:4.34s;width:3px;height:3px"></i><i style="--dx:-38px;--dy:-227px;animation-delay:4.41s;width:4px;height:4px"></i><i style="--dx:-57px;--dy:-205px;animation-delay:4.48s;width:5px;height:5px"></i><i style="--dx:-84px;--dy:-155px;animation-delay:4.20s;width:3px;height:3px"></i></div>
  <div class="sgst"><div class="sgc" style="--n:1"><div class="sgf" style="--fd:7.0s"><div class="cnfr">'''+ultraV(1,150,False)+'''</div><div class="cnbk2">'''+ultraBack(1,150)+'''</div></div><i class="sgspot"></i><div class="cncap" style="--fd:7.0s"><small>ULTRA LIMITED</small><b>N°1/2</b></div></div><div class="sgc" style="--n:2"><div class="sgf" style="--fd:8.2s"><div class="cnfr">'''+ultraV(2,150,False)+'''</div><div class="cnbk2">'''+ultraBack(2,150)+'''</div></div><i class="sgspot"></i><div class="cncap" style="--fd:8.2s"><small>ULTRA LIMITED</small><b>N°2/2</b></div></div></div>
  <div class="sgcrowd"><i class="sgh" style="left:9.0%;bottom:14px;--sz:18px;--c:#ff2e88;--dl:0.25s;opacity:0.9"><b></b></i><i class="sgh" style="left:16.5%;bottom:14px;--sz:18px;--c:#4cc9ff;--dl:1.23s;opacity:0.9"><b></b></i><i class="sgh" style="left:28.0%;bottom:14px;--sz:18px;--c:#ffe45e;--dl:0.72s;opacity:0.9"><b></b></i><i class="sgh" style="left:40.5%;bottom:14px;--sz:18px;--c:#35d0a5;--dl:1.36s;opacity:0.9"><b></b></i><i class="sgh" style="left:48.0%;bottom:14px;--sz:18px;--c:#8b5cff;--dl:1.47s;opacity:0.9"><b></b></i><i class="sgh" style="left:61.5%;bottom:14px;--sz:18px;--c:#ff2e88;--dl:1.42s;opacity:0.9"><b></b></i><i class="sgh" style="left:70.0%;bottom:14px;--sz:18px;--c:#4cc9ff;--dl:1.45s;opacity:0.9"><b></b></i><i class="sgh" style="left:82.5%;bottom:14px;--sz:18px;--c:#ffe45e;--dl:0.72s;opacity:0.9"><b></b></i><i class="sgh" style="left:91.0%;bottom:14px;--sz:18px;--c:#35d0a5;--dl:1.42s;opacity:0.9"><b></b></i><i class="sgh" style="left:99.5%;bottom:14px;--sz:18px;--c:#8b5cff;--dl:0.45s;opacity:0.9"><b></b></i><i class="sgh" style="left:2.0%;bottom:0px;--sz:24px;--c:#4cc9ff;--dl:0.78s;opacity:1"><b></b></i><i class="sgh" style="left:10.5%;bottom:0px;--sz:24px;--c:#ffe45e;--dl:1.11s;opacity:1"><b></b></i><i class="sgh" style="left:24.0%;bottom:0px;--sz:24px;--c:#35d0a5;--dl:1.22s;opacity:1"><b></b></i><i class="sgh" style="left:33.5%;bottom:0px;--sz:24px;--c:#8b5cff;--dl:1.39s;opacity:1"><b></b></i><i class="sgh" style="left:46.0%;bottom:0px;--sz:24px;--c:#ff2e88;--dl:1.15s;opacity:1"><b></b></i><i class="sgh" style="left:53.5%;bottom:0px;--sz:24px;--c:#4cc9ff;--dl:0.18s;opacity:1"><b></b></i><i class="sgh" style="left:63.0%;bottom:0px;--sz:24px;--c:#ffe45e;--dl:0.48s;opacity:1"><b></b></i><i class="sgh" style="left:75.5%;bottom:0px;--sz:24px;--c:#35d0a5;--dl:1.49s;opacity:1"><b></b></i><i class="sgh" style="left:84.0%;bottom:0px;--sz:24px;--c:#8b5cff;--dl:1.12s;opacity:1"><b></b></i><i class="sgh" style="left:94.5%;bottom:0px;--sz:24px;--c:#ff2e88;--dl:0.98s;opacity:1"><b></b></i></div>
 </div>
 <div class="cnvig"></div><i class="cnbar t"></i><i class="cnbar b"></i>
 <div class="cntxt"><small>ĐỦ CẢ 3 CONCEPT</small><h2>2 thẻ Ultra Limited</h2><p>Mỗi thẻ mang 2 bài hát bạn chọn trong 7 bài của CORTIS. Chọn xong là khóa vĩnh viễn.</p>
  <button class="igo" onClick="{{startU1}}">Chọn nhạc cho thẻ #1</button><button class="igo" onClick="{{closeFx}}" style="background:rgba(255,255,255,.16);box-shadow:none;margin-top:8px">Để sau</button></div></div>''','true')+sif('ugv3','''<div class="kmfx on cnx {{skCls}}"><button class="ugskip" onClick="{{ugSkip}}">Bỏ qua ›</button><div class="kmbg" style="background:radial-gradient(520px 520px at 50% 42%,#1a0d3d,#020108 70%)"></div>
 <div class="cnworld">
  <div class="cnstars"><b class="cnsr" style="left:34%;top:49%;--z:2px;animation-delay:0.72s"></b><b class="cnsr" style="left:16%;top:45%;--z:4px;animation-delay:2.86s"></b><b class="cnsr" style="left:80%;top:38%;--z:2px;animation-delay:1.67s"></b><b class="cnsr" style="left:86%;top:72%;--z:2px;animation-delay:2.55s"></b><b class="cnsr" style="left:5%;top:71%;--z:2px;animation-delay:2.38s"></b><b class="cnsr" style="left:26%;top:72%;--z:4px;animation-delay:0.55s"></b><b class="cnsr" style="left:43%;top:23%;--z:2px;animation-delay:1.65s"></b><b class="cnsr" style="left:35%;top:76%;--z:4px;animation-delay:0.61s"></b><b class="cnsr" style="left:26%;top:17%;--z:2px;animation-delay:2.54s"></b><b class="cnsr" style="left:91%;top:79%;--z:4px;animation-delay:1.79s"></b><b class="cnsr" style="left:70%;top:17%;--z:2px;animation-delay:2.52s"></b><b class="cnsr" style="left:92%;top:35%;--z:3px;animation-delay:2.55s"></b><b class="cnsr" style="left:14%;top:81%;--z:4px;animation-delay:2.48s"></b><b class="cnsr" style="left:70%;top:21%;--z:3px;animation-delay:1.33s"></b><b class="cnsr" style="left:72%;top:23%;--z:3px;animation-delay:2.81s"></b><b class="cnsr" style="left:9%;top:59%;--z:2px;animation-delay:0.66s"></b><b class="cnsr" style="left:62%;top:59%;--z:2px;animation-delay:2.31s"></b><b class="cnsr" style="left:51%;top:9%;--z:2px;animation-delay:0.16s"></b><b class="cnsr" style="left:82%;top:13%;--z:3px;animation-delay:2.28s"></b><b class="cnsr" style="left:57%;top:23%;--z:3px;animation-delay:2.96s"></b><b class="cnsr" style="left:74%;top:70%;--z:2px;animation-delay:1.95s"></b><b class="cnsr" style="left:90%;top:20%;--z:2px;animation-delay:0.89s"></b><b class="cnsr" style="left:13%;top:10%;--z:4px;animation-delay:2.75s"></b><b class="cnsr" style="left:98%;top:61%;--z:2px;animation-delay:0.19s"></b><b class="cnsr" style="left:63%;top:26%;--z:2px;animation-delay:2.10s"></b><b class="cnsr" style="left:32%;top:19%;--z:4px;animation-delay:0.34s"></b><b class="cnsr" style="left:51%;top:68%;--z:2px;animation-delay:2.65s"></b><b class="cnsr" style="left:19%;top:38%;--z:3px;animation-delay:0.63s"></b><b class="cnsr" style="left:13%;top:28%;--z:2px;animation-delay:0.45s"></b><b class="cnsr" style="left:8%;top:37%;--z:4px;animation-delay:2.90s"></b><b class="cnsr" style="left:75%;top:84%;--z:4px;animation-delay:1.47s"></b><b class="cnsr" style="left:36%;top:84%;--z:2px;animation-delay:1.41s"></b><b class="cnsr" style="left:55%;top:45%;--z:3px;animation-delay:0.86s"></b><b class="cnsr" style="left:26%;top:10%;--z:4px;animation-delay:0.21s"></b></div>
  <i class="sxcore"></i>
  <div class="sxorb"><span class="sxa" style="--a0:0deg;--k:0;--o:1.00"><i style="--s:30.0px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:1;--o:0.93"><i style="--s:28.2px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:2;--o:0.85"><i style="--s:26.4px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:3;--o:0.78"><i style="--s:24.6px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:4;--o:0.70"><i style="--s:22.8px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:5;--o:0.62"><i style="--s:21.0px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:6;--o:0.55"><i style="--s:19.2px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:7;--o:0.47"><i style="--s:17.4px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:8;--o:0.40"><i style="--s:15.6px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:9;--o:0.32"><i style="--s:13.8px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:10;--o:0.25"><i style="--s:12.0px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:0deg;--k:11;--o:0.18"><i style="--s:10.2px;--c:#FFD24A"></i></span><span class="sxa" style="--a0:180deg;--k:0;--o:1.00"><i style="--s:30.0px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:1;--o:0.93"><i style="--s:28.2px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:2;--o:0.85"><i style="--s:26.4px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:3;--o:0.78"><i style="--s:24.6px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:4;--o:0.70"><i style="--s:22.8px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:5;--o:0.62"><i style="--s:21.0px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:6;--o:0.55"><i style="--s:19.2px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:7;--o:0.47"><i style="--s:17.4px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:8;--o:0.40"><i style="--s:15.6px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:9;--o:0.32"><i style="--s:13.8px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:10;--o:0.25"><i style="--s:12.0px;--c:#FF4FA3"></i></span><span class="sxa" style="--a0:180deg;--k:11;--o:0.18"><i style="--s:10.2px;--c:#FF4FA3"></i></span></div>
  <div class="cnsh">
   <i class="cnflash"></i><i class="cnflare"></i><i class="cnring"></i><i class="cnring r2"></i><i class="cnrays"></i>
   <div class="cnemb"><i class="cnem" style="left:10%;--d:5.2s;--l:0.0s;--x:12px;width:2px;height:3px"></i><i class="cnem" style="left:18%;--d:5.3s;--l:0.5s;--x:30px;width:5px;height:4px"></i><i class="cnem" style="left:66%;--d:5.6s;--l:1.6s;--x:22px;width:5px;height:3px"></i><i class="cnem" style="left:91%;--d:4.3s;--l:0.8s;--x:25px;width:2px;height:4px"></i><i class="cnem" style="left:48%;--d:5.7s;--l:2.3s;--x:-7px;width:5px;height:5px"></i><i class="cnem" style="left:72%;--d:4.6s;--l:2.9s;--x:-14px;width:5px;height:4px"></i><i class="cnem" style="left:18%;--d:3.8s;--l:0.3s;--x:-22px;width:4px;height:2px"></i><i class="cnem" style="left:35%;--d:5.7s;--l:1.8s;--x:5px;width:2px;height:2px"></i><i class="cnem" style="left:83%;--d:3.4s;--l:2.1s;--x:-22px;width:4px;height:3px"></i><i class="cnem" style="left:91%;--d:5.9s;--l:0.2s;--x:3px;width:5px;height:2px"></i><i class="cnem" style="left:46%;--d:3.2s;--l:1.4s;--x:9px;width:2px;height:2px"></i><i class="cnem" style="left:65%;--d:5.2s;--l:0.4s;--x:-5px;width:2px;height:5px"></i><i class="cnem" style="left:8%;--d:3.3s;--l:1.1s;--x:-22px;width:2px;height:4px"></i><i class="cnem" style="left:84%;--d:5.8s;--l:1.9s;--x:22px;width:3px;height:2px"></i><i class="cnem" style="left:16%;--d:3.1s;--l:3.0s;--x:16px;width:5px;height:2px"></i><i class="cnem" style="left:30%;--d:5.2s;--l:0.6s;--x:6px;width:4px;height:4px"></i><i class="cnem" style="left:68%;--d:3.7s;--l:1.5s;--x:-3px;width:5px;height:3px"></i><i class="cnem" style="left:59%;--d:5.1s;--l:0.6s;--x:9px;width:4px;height:4px"></i><i class="cnem" style="left:51%;--d:5.9s;--l:1.3s;--x:2px;width:4px;height:3px"></i><i class="cnem" style="left:40%;--d:4.1s;--l:0.7s;--x:-20px;width:4px;height:3px"></i><i class="cnem" style="left:41%;--d:4.6s;--l:1.3s;--x:-11px;width:5px;height:3px"></i><i class="cnem" style="left:20%;--d:4.4s;--l:2.0s;--x:-13px;width:4px;height:3px"></i><i class="cnem" style="left:9%;--d:5.7s;--l:1.7s;--x:-3px;width:5px;height:5px"></i><i class="cnem" style="left:21%;--d:5.1s;--l:2.4s;--x:4px;width:4px;height:5px"></i><i class="cnem" style="left:70%;--d:5.7s;--l:2.7s;--x:-6px;width:5px;height:5px"></i><i class="cnem" style="left:86%;--d:5.3s;--l:0.1s;--x:8px;width:4px;height:4px"></i><i class="cnem" style="left:64%;--d:4.5s;--l:1.3s;--x:6px;width:2px;height:2px"></i><i class="cnem" style="left:57%;--d:4.0s;--l:2.9s;--x:12px;width:4px;height:2px"></i><i class="cnem" style="left:52%;--d:4.1s;--l:0.4s;--x:14px;width:3px;height:3px"></i><i class="cnem" style="left:14%;--d:4.5s;--l:0.9s;--x:-8px;width:2px;height:4px"></i></div>
   <div class="cnst"><div class="cnc"><div class="cnf" style="--fd:7.0"><div class="cnfr">'''+ultraV(1,150,False)+'''</div><div class="cnbk2">'''+ultraBack(1,150)+'''</div></div><div class="cncap" style="--fd:7.0"><small>ULTRA LIMITED</small><b>N°1/2</b></div></div><div class="cnc"><div class="cnf" style="--fd:8.2"><div class="cnfr">'''+ultraV(2,150,False)+'''</div><div class="cnbk2">'''+ultraBack(2,150)+'''</div></div><div class="cncap" style="--fd:8.2"><small>ULTRA LIMITED</small><b>N°2/2</b></div></div></div>
  </div>
 </div>
 <div class="cnvig"></div><i class="cnbar t"></i><i class="cnbar b"></i>
 <div class="cntxt"><small>ĐỦ CẢ 3 CONCEPT</small><h2>2 thẻ Ultra Limited</h2><p>Mỗi thẻ mang 2 bài hát bạn chọn trong 7 bài của CORTIS. Chọn xong là khóa vĩnh viễn.</p>
  <button class="igo" onClick="{{startU1}}">Chọn nhạc cho thẻ #1</button><button class="igo" onClick="{{closeFx}}" style="background:rgba(255,255,255,.16);box-shadow:none;margin-top:8px">Để sau</button></div></div>''')+sif('ugv4','''<div class="kmfx on cnx {{skCls}}"><button class="ugskip" onClick="{{ugSkip}}">Bỏ qua ›</button><div class="kmbg" style="background:radial-gradient(520px 520px at 50% 62%,#1b1030,#020108 72%)"></div>
 <div class="cnworld">
  <div class="cnstars"><b class="cnsr" style="left:12%;top:83%;--z:2px;animation-delay:2.90s"></b><b class="cnsr" style="left:88%;top:28%;--z:2px;animation-delay:2.85s"></b><b class="cnsr" style="left:97%;top:64%;--z:2px;animation-delay:1.37s"></b><b class="cnsr" style="left:34%;top:39%;--z:2px;animation-delay:1.81s"></b><b class="cnsr" style="left:49%;top:70%;--z:2px;animation-delay:2.89s"></b><b class="cnsr" style="left:29%;top:57%;--z:2px;animation-delay:2.30s"></b><b class="cnsr" style="left:13%;top:65%;--z:3px;animation-delay:1.63s"></b><b class="cnsr" style="left:40%;top:57%;--z:3px;animation-delay:2.35s"></b><b class="cnsr" style="left:46%;top:56%;--z:3px;animation-delay:2.94s"></b><b class="cnsr" style="left:85%;top:78%;--z:2px;animation-delay:0.52s"></b><b class="cnsr" style="left:24%;top:57%;--z:3px;animation-delay:1.12s"></b><b class="cnsr" style="left:73%;top:35%;--z:2px;animation-delay:2.35s"></b><b class="cnsr" style="left:68%;top:15%;--z:2px;animation-delay:1.28s"></b><b class="cnsr" style="left:70%;top:33%;--z:2px;animation-delay:2.82s"></b><b class="cnsr" style="left:57%;top:61%;--z:3px;animation-delay:2.17s"></b><b class="cnsr" style="left:38%;top:75%;--z:2px;animation-delay:2.31s"></b><b class="cnsr" style="left:79%;top:80%;--z:2px;animation-delay:2.03s"></b><b class="cnsr" style="left:45%;top:65%;--z:3px;animation-delay:2.46s"></b><b class="cnsr" style="left:27%;top:52%;--z:2px;animation-delay:2.36s"></b><b class="cnsr" style="left:9%;top:87%;--z:2px;animation-delay:0.54s"></b><b class="cnsr" style="left:95%;top:73%;--z:2px;animation-delay:0.66s"></b><b class="cnsr" style="left:76%;top:78%;--z:2px;animation-delay:1.80s"></b><b class="cnsr" style="left:54%;top:13%;--z:2px;animation-delay:2.48s"></b><b class="cnsr" style="left:43%;top:77%;--z:2px;animation-delay:0.05s"></b></div>
  <i class="vdfloor"></i>
  <div class="vdshk">
   <i class="vdbm a"></i><i class="vdbm b"></i>
   <div class="vdw" style="left:57px"><div class="vdfl" style="--fl:1.1s"><div class="vdtl"><div class="vdi" style="--c:#FFD24A"></div><div class="vdh"></div></div></div></div><i class="vdsh" style="left:57px;--fl:1.1s"></i><i class="vdrp" style="left:57px;--fl:2.6s"></i><i class="vdrp r2" style="left:57px;--fl:2.72s"></i><div class="vdw" style="left:333px"><div class="vdfl" style="--fl:1.7s"><div class="vdtl"><div class="vdi" style="--c:#FF4FA3"></div><div class="vdh"></div></div></div></div><i class="vdsh" style="left:333px;--fl:1.7s"></i><i class="vdrp" style="left:333px;--fl:3.2s"></i><i class="vdrp r2" style="left:333px;--fl:3.3200000000000003s"></i>
   <i class="vdflash"></i><i class="cnring" style="animation-delay:4.9s"></i><i class="cnring r2" style="animation-delay:5.2s"></i><i class="cnrays" style="animation-delay:5.2s,5.2s"></i>
   <div class="cnemb"><i class="cnem" style="left:84%;--d:4.2s;--l:2.7s;--x:2px;width:4px;height:3px"></i><i class="cnem" style="left:55%;--d:4.1s;--l:1.2s;--x:11px;width:3px;height:3px"></i><i class="cnem" style="left:80%;--d:4.5s;--l:1.7s;--x:29px;width:3px;height:5px"></i><i class="cnem" style="left:44%;--d:5.4s;--l:2.7s;--x:-13px;width:3px;height:2px"></i><i class="cnem" style="left:27%;--d:3.4s;--l:1.8s;--x:9px;width:5px;height:3px"></i><i class="cnem" style="left:20%;--d:4.4s;--l:0.9s;--x:-1px;width:4px;height:5px"></i><i class="cnem" style="left:75%;--d:4.3s;--l:2.9s;--x:10px;width:4px;height:3px"></i><i class="cnem" style="left:91%;--d:5.1s;--l:2.1s;--x:12px;width:5px;height:2px"></i><i class="cnem" style="left:28%;--d:5.7s;--l:0.6s;--x:-4px;width:4px;height:4px"></i><i class="cnem" style="left:68%;--d:4.7s;--l:0.4s;--x:-12px;width:4px;height:2px"></i><i class="cnem" style="left:36%;--d:5.7s;--l:0.4s;--x:5px;width:5px;height:3px"></i><i class="cnem" style="left:27%;--d:5.1s;--l:0.9s;--x:-21px;width:2px;height:4px"></i><i class="cnem" style="left:72%;--d:3.8s;--l:1.5s;--x:-13px;width:4px;height:5px"></i><i class="cnem" style="left:18%;--d:3.8s;--l:0.1s;--x:-21px;width:3px;height:2px"></i><i class="cnem" style="left:78%;--d:5.5s;--l:0.6s;--x:29px;width:2px;height:3px"></i><i class="cnem" style="left:28%;--d:3.6s;--l:2.6s;--x:16px;width:2px;height:5px"></i><i class="cnem" style="left:35%;--d:5.1s;--l:0.3s;--x:-2px;width:4px;height:4px"></i><i class="cnem" style="left:73%;--d:4.0s;--l:2.6s;--x:5px;width:3px;height:4px"></i><i class="cnem" style="left:27%;--d:3.8s;--l:0.6s;--x:3px;width:4px;height:3px"></i><i class="cnem" style="left:17%;--d:4.7s;--l:0.4s;--x:8px;width:5px;height:5px"></i><i class="cnem" style="left:49%;--d:4.8s;--l:1.9s;--x:-29px;width:2px;height:4px"></i><i class="cnem" style="left:35%;--d:4.0s;--l:0.4s;--x:8px;width:3px;height:3px"></i><i class="cnem" style="left:27%;--d:5.6s;--l:2.4s;--x:-1px;width:3px;height:5px"></i><i class="cnem" style="left:58%;--d:3.2s;--l:2.3s;--x:-15px;width:5px;height:4px"></i></div>
   <div class="sgsp" style="left:115px;top:330px"><u style="--dx:150px;--dy:0px;animation-delay:4.95s"></u><u style="--dx:84px;--dy:40px;animation-delay:4.99s"></u><u style="--dx:93px;--dy:117px;animation-delay:5.03s"></u><u style="--dx:23px;--dy:102px;animation-delay:4.95s"></u><u style="--dx:-22px;--dy:100px;animation-delay:4.99s"></u><u style="--dx:-61px;--dy:76px;animation-delay:5.03s"></u><u style="--dx:-139px;--dy:67px;animation-delay:4.95s"></u><u style="--dx:-146px;--dy:0px;animation-delay:4.99s"></u><u style="--dx:-89px;--dy:-42px;animation-delay:5.03s"></u><u style="--dx:-61px;--dy:-76px;animation-delay:4.95s"></u><u style="--dx:-26px;--dy:-114px;animation-delay:4.99s"></u><u style="--dx:30px;--dy:-131px;animation-delay:5.03s"></u><u style="--dx:99px;--dy:-125px;animation-delay:4.95s"></u><u style="--dx:108px;--dy:-52px;animation-delay:4.99s"></u></div><div class="sgsp" style="left:275px;top:330px"><u style="--dx:157px;--dy:0px;animation-delay:4.95s"></u><u style="--dx:129px;--dy:62px;animation-delay:4.99s"></u><u style="--dx:97px;--dy:121px;animation-delay:5.03s"></u><u style="--dx:28px;--dy:126px;animation-delay:4.95s"></u><u style="--dx:-28px;--dy:125px;animation-delay:4.99s"></u><u style="--dx:-93px;--dy:117px;animation-delay:5.03s"></u><u style="--dx:-90px;--dy:43px;animation-delay:4.95s"></u><u style="--dx:-100px;--dy:0px;animation-delay:4.99s"></u><u style="--dx:-123px;--dy:-59px;animation-delay:5.03s"></u><u style="--dx:-77px;--dy:-97px;animation-delay:4.95s"></u><u style="--dx:-25px;--dy:-113px;animation-delay:4.99s"></u><u style="--dx:34px;--dy:-150px;animation-delay:5.03s"></u><u style="--dx:71px;--dy:-89px;animation-delay:4.95s"></u><u style="--dx:119px;--dy:-57px;animation-delay:4.99s"></u></div>
   <div class="vdst"><div class="vdc" style="--sx:58px"><div class="vdf" style="--fd:7.0"><div class="cnfr">'''+ultraV(1,150,False)+'''</div><div class="cnbk2">'''+ultraBack(1,150)+'''</div></div><div class="cncap" style="--fd:7.0"><small>ULTRA LIMITED</small><b>N°1/2</b></div></div><div class="vdc" style="--sx:-58px"><div class="vdf" style="--fd:8.2"><div class="cnfr">'''+ultraV(2,150,False)+'''</div><div class="cnbk2">'''+ultraBack(2,150)+'''</div></div><div class="cncap" style="--fd:8.2"><small>ULTRA LIMITED</small><b>N°2/2</b></div></div></div>
  </div>
 </div>
 <div class="cnvig"></div><i class="cnbar t"></i><i class="cnbar b"></i>
 <div class="cntxt"><small>ĐỦ CẢ 3 CONCEPT</small><h2>2 thẻ Ultra Limited</h2><p>Mỗi thẻ mang 2 bài hát bạn chọn trong 7 bài của CORTIS. Chọn xong là khóa vĩnh viễn.</p>
  <button class="igo" onClick="{{startU1}}">Chọn nhạc cho thẻ #1</button><button class="igo" onClick="{{closeFx}}" style="background:rgba(255,255,255,.16);box-shadow:none;margin-top:8px">Để sau</button></div></div>''')+'''</div>''')+'''
<div class="toast {{toastCls}}">{{toast}}</div>
</div>

<!-- ================= BẢNG ĐIỀU KHIỂN ================= -->
<div class="cp">
 <h3>Bảng điều khiển sự kiện</h3>
 <p class="cpn">Chỉ có trong bản thử nghiệm, không thuộc app. Mỗi khối là một chức năng của Mùa Concept; thao tác ở đây chạy đúng logic như trong app.</p>
 <div class="cgrid">

 <div class="cs w2"><div class="cl"><b>1</b> NGÀY &amp; GIAO DIỆN · {{dayLbl}}</div>
  <div class="dchips"><sc-for list="{{dchips}}" as="d" hint-placeholder-count="12"><button class="{{d.cls}}" data-i="{{d.i}}" onClick="{{setDay}}">{{d.dt}}<small>{{d.wd}}</small><i style="--c:{{d.c}}"></i></button></sc-for></div>
  <div class="cpg" style="margin-top:8px"><button class="cpb" onClick="{{dayPrev}}">‹ Lùi 1 ngày</button><button class="cpb" onClick="{{dayNext}}">Tiến 1 ngày ›</button><button class="cpb {{dkOn}}" onClick="{{toggleDk}}">Chế độ tối</button></div>
  <p class="cpn" style="margin-top:8px">Sự kiện 18–26/10 (9 ngày). Mốc 17/10 và 27/10 để thử trạng thái trước và sau. Concept mở theo ngày: 18–20 là 1, 21–23 là 2, 24–26 là 3.</p>
 </div>

 <div class="cs"><div class="cl"><b>2</b> NHIỆM VỤ NGÀY</div>
  <div class="kv"><small>{{tkTag}}</small><b>{{taskT}}</b><span>{{taskD}}</span></div>
  <div class="cpg"><button class="cpb gold" onClick="{{tick}}">Hoàn thành (+2 pack)</button><button class="cpb" onClick="{{untick}}">Hoàn tác</button></div>
 </div>

 <div class="cs"><div class="cl"><b>3</b> HÀNG ĐỢI PACK</div>
  <div class="kv"><small>ĐANG CHỜ</small><b>{{packSum}}</b></div>
  <div class="cpg"><button class="cpb" onClick="{{addDaily}}">+1 pack ngày</button><button class="cpb" onClick="{{addBonus}}">+1 pack thưởng (thẻ app)</button><button class="cpb gold" onClick="{{openPack}}">Mở pack</button><button class="cpb red" onClick="{{clearPacks}}">Xóa pack</button></div>
 </div>

 <div class="cs w2"><div class="cl"><b>4</b> RÚT THẺ &amp; TỈ LỆ</div>
  <div class="cpg"><button class="cpb {{f1}}" data-i="0" onClick="{{setForce}}">Ngẫu nhiên 16% / 4%</button><button class="cpb {{f2}}" data-i="1" onClick="{{setForce}}">Ép toàn holo</button><button class="cpb {{f3}}" data-i="2" onClick="{{setForce}}">Ưu tiên thẻ chưa có</button><button class="cpb gold" onClick="{{simRun}}">Mô phỏng 1000 pack</button></div>
  <div class="cpst" style="margin-top:8px">{{simTxt}}</div>
 </div>

 <div class="cs w2"><div class="cl"><b>5</b> CONCEPT &amp; BỘ SƯU TẬP</div>
  <sc-for list="{{crows}}" as="r" hint-placeholder-count="3"><div class="cr"><span style="width:10px;height:10px;border-radius:50%;background:{{r.a}};flex:none"></span><span class="cpnm">{{r.n}}<small>{{r.line}}</small></span><button class="cpb" data-i="{{r.i}}" onClick="{{c4}}">4/5</button><button class="cpb gold" data-i="{{r.i}}" onClick="{{c5}}">5/5</button><button class="cpb" data-i="{{r.i}}" onClick="{{cH}}">+holo</button><button class="cpb red" data-i="{{r.i}}" onClick="{{cX}}">Xóa</button></div></sc-for>
  <p class="cpn">4/5 để thử đúng thẻ cuối cùng; 5/5 chạy thẳng màn mở khóa concept.</p>
 </div>

 <div class="cs"><div class="cl"><b>6</b> PANORAMA</div>
  <div class="cpg"><button class="cpb" data-i="1" onClick="{{panoForce}}">Concept 1</button><button class="cpb" data-i="2" onClick="{{panoForce}}">Concept 2</button><button class="cpb" data-i="3" onClick="{{panoForce}}">Concept 3</button></div>
  <p class="cpn">Mở thẳng trình xem, bỏ qua điều kiện. Trong app, chạm panorama ở tab Thẻ chỉ mở khi đủ 5 thẻ thường.</p>
 </div>

 <div class="cs"><div class="cl"><b>7</b> KHUNG &amp; DANH HIỆU</div>
  <div class="kv"><small>ĐANG DÙNG</small><b>{{eqTxt}}</b></div>
  <div class="cpg"><button class="cpb" data-i="1" onClick="{{equip}}">Dùng 1</button><button class="cpb" data-i="2" onClick="{{equip}}">Dùng 2</button><button class="cpb" data-i="3" onClick="{{equip}}">Dùng 3</button><button class="cpb" onClick="{{jPro}}">Mở Hồ sơ</button></div>
 </div>

 <div class="cs w2"><div class="cl"><b>8</b> THẺ ULTRA &amp; NHẠC</div>
  <div class="kv"><small>TRẠNG THÁI</small><b>{{ultTxt}}</b></div>
  <div class="cpg"><button class="cpb gold" onClick="{{fullAll}}">Hoàn thành cả 3 concept</button><button class="cpb" onClick="{{jumpU}}">Tới tab Ultra</button><button class="cpb" data-i="1" onClick="{{startU}}">Chọn nhạc #1</button><button class="cpb" data-i="2" onClick="{{startU}}">Chọn nhạc #2</button><button class="cpb" data-i="1" onClick="{{openU}}">Mở thẻ #1</button><button class="cpb" data-i="2" onClick="{{openU}}">Mở thẻ #2</button><button class="cpb red" onClick="{{clearSongs}}">Xóa nhạc đã khóa</button></div>
  <div class="cl" style="margin-top:10px">KIỂU HIỆU ỨNG NHẬN THẺ</div>
  <div class="cpg"><button class="cpb {{ug5On}}" onClick="{{setUg5}}">5 · Sân khấu concert</button><button class="cpb {{ug3On}}" onClick="{{setUg3}}">3 · Hai sao xoắn</button><button class="cpb {{ug4On}}" onClick="{{setUg4}}">4 · Đĩa than rơi</button><button class="cpb {{ugmOn}}" onClick="{{setUgm}}">{{ugmTxt}}</button><button class="cpb" onClick="{{ugsM}}">−1s</button><button class="cpb" onClick="{{ugsP}}">+1s</button><span class="cpn" style="align-self:center">{{ugsTxt}}</span><button class="cpb gold" onClick="{{replayUg}}">Xem lại hiệu ứng</button></div>
 </div>

 <div class="cs w2"><div class="cl"><b>12</b> BẠN BÈ (GIẢ LẬP) · TẶNG &amp; XIN THẺ</div>
  <div class="cpg"><sc-for list="{{ptChips}}" as="p" hint-placeholder-count="2"><button class="cpb {{p.cls}}" data-i="{{p.i}}" onClick="{{ptSel}}">{{p.n}}</button></sc-for></div>
  <div class="cpst" style="margin-top:8px">{{ptTxt}}</div>
  <div class="cpg" style="margin-top:8px"><button class="cpb gold" onClick="{{ptGift}}">{{ptName}} tặng tôi 1 thẻ</button><button class="cpb" onClick="{{ptAsk}}">{{ptName}} xin 1 thẻ của tôi</button><button class="cpb" onClick="{{ptPack}}">{{ptName}} mở 1 pack</button><button class="cpb" onClick="{{ptReply}}">{{ptName}} trả lời lời xin</button><button class="cpb red" onClick="{{ptClear}}">Xóa kho người kia</button></div>
  <p class="cpn">Bạn tặng và xin thẻ trong màn xem thẻ, tích chọn người nhận. Ở đây chọn một người bạn rồi giả lập phía họ: gửi quà, xin thẻ của bạn, mở pack để có bản dư rồi trả lời lời xin.</p>
 </div>

 <div class="cs w2"><div class="cl"><b>13</b> HÒM THƯ &amp; PHÚC LỢI</div>
  <div class="cpst">{{mailTxt}}</div>
  <div class="cpg" style="margin-top:8px"><button class="cpb gold" onClick="{{mailNew}}">Gửi thư sự kiện mới</button><button class="cpb" onClick="{{openMail}}">Mở hòm thư</button><button class="cpb" onClick="{{mailReset}}">Đặt lại thư (chưa đọc, chưa nhận)</button></div>
  <p class="cpn">Thư theo ngày: ngày 1 khai mạc + thư bí mật 01/11, ngày 4 Aniyaaa, ngày 7 Poyoyoi, mỗi thư mở khóa kèm 1 pack nhận một lần. Quà tặng từ bạn bè cũng nằm trong hòm thư.</p>
 </div>

 <div class="cs w2"><div class="cl"><b>9</b> NHẢY TỚI MÀN</div>
  <div class="cpg"><button class="cpb" onClick="{{jCal}}">Lịch</button><button class="cpb" onClick="{{jToday}}">Hôm nay</button><button class="cpb" onClick="{{jHub}}">Trang sự kiện</button><button class="cpb" onClick="{{jCol}}">Thẻ</button><button class="cpb" onClick="{{jPro}}">Hồ sơ</button><button class="cpb" onClick="{{prevUnlock}}">Màn mở khóa</button></div>
 </div>

 <div class="cs w2"><div class="cl"><b>10</b> KIỂM TRA LOGIC TỰ ĐỘNG</div>
  <div class="cpchk"><sc-for list="{{checks}}" as="k" hint-placeholder-count="7"><div class="{{k.cls}}"><i>{{k.m}}</i><span>{{k.t}}</span></div></sc-for></div>
 </div>

 <div class="cs w2"><div class="cl"><b>11</b> THỐNG KÊ &amp; NHẬT KÝ</div>
  <div class="cpst">{{stats}}</div>
  <div class="cplg" style="margin-top:8px"><sc-for list="{{logs}}" as="l" hint-placeholder-count="4"><div>{{l.t}}</div></sc-for></div>
 </div>

 <div class="cs w2"><button class="cpb red" onClick="{{reset}}" style="width:100%;padding:11px">Đặt lại toàn bộ</button></div>
 </div>
</div>
</div>'''
def _pk(c,k,lab):
    h=pack(c,190,lab)
    if k=='b':
        n,a,b=CON[c]
        h=h.replace(n.upper(),'THẺ APP').replace(f'--a:{a};--b:{b}','--a:#9B5CFF;--b:#FFC1F0').replace(f'url({PANOS[c]})','linear-gradient(100deg,#8D94B8,#2F8CFF,#9B5CFF,#FF2E88)')
    return rhtml(h)
PK=''.join(sif(f'pk{c}{k}',_pk(c,k,lab),'true' if (c==1 and k=='d') else 'false') for c in (1,2,3) for k,lab in (('d','MÙA CONCEPT'),('b','PACK THƯỞNG')))
body=body.replace('@@PK@@',PK)
assert '@@' not in body
import b10css as b9css
APPCSS=b9css.APPCSS
mycss=rcss(EX3+EX4)
stage_css=rcss(b9css.STAGE_FILTER(EX6))
cp_css=b9css.CP
SCRIPT=open('b10_js.js',encoding='utf-8').read()
css=REAL+'\n'+mycss+'\n'+stage_css+'\n'+APPCSS+'\n'+cp_css
html=page('Bản dựng đầy đủ Mùa Concept',1170,904,body.replace('<div class="rapp','<div class="rapp'),css)
html=html.replace('<div style="width:1170px;height:904px;overflow:hidden;background:#15123B;color:#F1F0FF;position:relative">','<div style="width:1170px;height:904px;overflow:hidden;position:relative">')
a=html.index('class Component extends DCLogic'); b=html.index('</script>',a)
html=html[:a]+SCRIPT+'\n'+html[b:]
# sprite icon ở đầu
html=html.replace('<div class="rapp ',SPRITE+'<div class="rapp ',1)
import re as _re
_n0=len(html)
html=_re.sub(r'(^|\n)\.lk\{[^}]*\}','\\1',html)
html=_re.sub(r'(^|\n)\.lk i\{[^}]*\}','\\1',html)
html=html.replace('@property --a{','@property --ra{').replace('{to{--a:360deg}}','{to{--ra:360deg}}').replace('from var(--a,0deg)','from var(--ra,0deg)')
assert len(html)<_n0
open(OUT2+'AppBuild.dc.html','w',encoding='utf-8').write(html)
print('ok',len(html))
