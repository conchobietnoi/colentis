from shared import *
from b7_css import APPCSS
OUT2='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'

def dyn_n():
    s=ncard(0,1,250)
    s=s.replace(MM[1][0],'{{cImg}}').replace('JAMES','{{cName}}').replace('URICHINGUCHANA','{{cConUp}}')
    s=s.replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{cVars}}"').replace('<span class="nc-no">01<small>','<span class="nc-no">{{cNo}}<small>')
    return s
def dyn_h():
    s=hcard(0,1,250)
    s=s.replace(MM[1][0],'{{cImg}}').replace('JAMES','{{cName}}').replace('URICHINGUCHANA','{{cConUp}}').replace('<span class="hc-no">01</span>','<span class="hc-no">{{cNo}}</span>')
    return s
def sif(k,inner,d='false'):
    return '<sc-if value="{{%s}}" hint-placeholder-val="{{%s}}">%s</sc-if>'%(k,d,inner)
BACKS=''
for c in (1,2,3):
    for i in range(5):
        BACKS+=sif(f'bk_{c}_n_{i}',back_n(i,c,250))+sif(f'bk_{c}_h_{i}',back_h(i,c,250))
def nav(act):
    items=[('home','Lịch','goHome'),('hub','Sự kiện','goHub'),('col','Thẻ','goCol'),('rew','Thưởng','goRew')]
    return '<div class="nav">'+''.join(f'<button class="{"on" if k==act else ""}" onClick="{{{{{fn}}}}}"><i></i>{t}</button>' for k,t,fn in items)+'</div>'
def hdr(small,h,back=None):
    b=f'<button class="link" onClick="{{{{{back}}}}}" style="text-decoration:none;font-size:22px;color:#fff">‹</button>' if back else ''
    return f'<div class="hd" style="display:flex;align-items:center;gap:10px">{b}<span><small>{small}</small><h1>{h}</h1></span></div>'

eq=''.join(f'<i style="animation-delay:{(k*0.13)%0.5:.2f}s;animation-duration:{0.35+(k*37%25)/100:.2f}s"></i>' for k in range(24))
notes=''.join(f'<span class="nt" style="left:{x}px;top:{y}px;animation-delay:{d}s">{s}</span>' for x,y,d,s in [(60,300,0,'♪'),(300,320,.8,'♫'),(120,260,1.6,'♬'),(250,280,2.2,'♪'),(30,340,.4,'♫'),(330,250,1.2,'♪')])
def stage(cls):
    return ('<div class="st '+cls+'"><div class="dv dA" style="--c:{{cA}}" onClick="{{playA}}"><i class="lb">{{titleA}}</i></div><div class="dv dB" style="--c:{{cB}}" onClick="{{playB}}"><i class="lb">{{titleB}}</i></div>'
     +notes+'<div class="cardw"><span class="shk"></span><div class="tlw">'
     +sif('uIs1',ultra(0,220,1,'JAMES'),'true')+sif('uIs2',ultra(4,220,2,'SEONGHYEON'))
     +'<div class="eq">'+eq+'</div></div></div></div>')

FR=fr(1,2,130).replace('--w:130px;--a:#FFB02E;--c:#FFE3B0;--bl:14px','--w:130px;{{ucV}}').replace(MM[1][2],'{{ucFr}}')
TT=ttl(1).replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{ucT}}"').replace('Urichinguchana','{{ucName}}')
FR_S=fr(1,2,84).replace('--w:84px;--a:#FFB02E;--c:#FFE3B0;--bl:9px','--w:84px;{{r.v}}').replace(MM[1][2],'{{r.img}}')
TT_S=ttl(1).replace('style="--a:#FFB02E;--b:#FFE3B0"','style="{{r.t}}"').replace('Urichinguchana','{{r.n}}')
assert '{{ucV}}' in FR and '{{r.v}}' in FR_S and '{{ucT}}' in TT, (FR[:200],)

body='''
<div class="app">
<div class="ph">

<!-- ============ LỊCH ============ -->
<sc-if value="{{isHome}}" hint-placeholder-val="{{true}}">
<div class="scr">
 @@H_HOME@@
 <div class="body">
  <div class="bn2 {{bnRun}}" style="--a:{{bnA}}">
   <div class="bn2-band" style="background-image:url({{bnPano}})"></div>
   <small>{{bnTag}}</small>
   <b>{{bnTitle}}</b>
   <p>{{bnSub}}</p>
   <sc-if value="{{bnProg}}" hint-placeholder-val="{{true}}"><div class="pgx"><u style="width:{{bnPct}}"></u></div></sc-if>
   <sc-if value="{{bnCta}}" hint-placeholder-val="{{true}}"><button class="btn2" onClick="{{bnGo}}" style="margin-top:12px;max-width:190px;min-height:40px;font-size:13px">{{bnCtaTxt}}</button></sc-if>
  </div>
  <div class="sec" style="padding-top:16px"><span>VIỆC HÔM NAY</span><span>{{doneToday}}</span></div>
  <sc-if value="{{evTask}}" hint-placeholder-val="{{true}}">
   <button class="tk ev {{tkOn}}" onClick="{{tick}}"><span class="cb2">✓</span><span style="flex:1;min-width:0"><b>{{taskT}}</b><small>{{taskD}}</small></span><span class="tg">MÙA CONCEPT</span></button>
  </sc-if>
  <div class="tk"><span class="cb2">✓</span><span><b>Đi chợ cuối tuần</b><small>Việc cá nhân</small></span></div>
  <div class="tk on"><span class="cb2">✓</span><span><b>Gọi cho ba mẹ</b><small>Đã xong</small></span></div>
  <sc-if value="{{showUp}}" hint-placeholder-val="{{false}}">
   <div class="sec" style="padding-top:16px"><span>SỰ KIỆN SẮP TỚI</span><span>1</span></div>
   <div class="card" style="display:flex;gap:12px;align-items:center"><span style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#FFB02E,#FF2E88,#4CC9FF)"></span><span><b style="font-size:14px">Mùa Concept</b><small style="display:block;font-size:11px;font-weight:700;color:#A7A9E6;margin-top:2px">17/10 – 26/10 · 3 concept, 10 ngày</small></span></div>
  </sc-if>
 </div>
 @@NAV_home@@
</div></sc-if>

<!-- ============ TRANG SỰ KIỆN ============ -->
<sc-if value="{{isHub}}" hint-placeholder-val="{{false}}">
<div class="scr">
 @@H_HUB@@
 <div class="body">
  <div class="card" style="border-color:#FFB02E">
   <small style="font-size:10px;font-weight:800;color:#FFB02E;letter-spacing:.12em">{{hubTag}}</small>
   <b style="display:block;font-size:17px;font-weight:900;margin-top:3px">{{taskT}}</b>
   <p style="margin:4px 0 11px;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.5">{{taskD}}</p>
   <sc-if value="{{hubDone}}" hint-placeholder-val="{{false}}"><div style="font-size:12.5px;font-weight:900;color:#35D0A5;margin-bottom:10px">✓ Đã xong · nhận 2 pack</div></sc-if>
   <sc-if value="{{hubOpen}}" hint-placeholder-val="{{true}}"><div style="font-size:12.5px;font-weight:800;color:#FFB02E;margin-bottom:10px">Chưa xong · tick việc trong Lịch</div></sc-if>
   <sc-if value="{{hasPacks}}" hint-placeholder-val="{{true}}"><button class="btn2" onClick="{{openPack}}">Mở pack · còn {{packN}}</button></sc-if>
   <sc-if value="{{noPacks}}" hint-placeholder-val="{{false}}"><button class="btn2" onClick="{{goHome}}" style="background:#363078;color:#F1F0FF;box-shadow:none">Về Lịch làm nhiệm vụ</button></sc-if>
  </div>
  <div class="sec" style="padding-top:14px"><span>3 CONCEPT</span><span>{{celN}}/3 ĐỦ BỘ</span></div>
  <sc-for list="{{concs}}" as="c" hint-placeholder-count="3">
   <button class="cbk {{c.cls}}" style="--a:{{c.a}}" data-i="{{c.i}}" onClick="{{openCon}}"><img src="{{c.pano}}" alt=""><div class="in"><small>{{c.week}}</small><b>{{c.n}}</b><span>{{c.line}}</span><div class="bar"><u style="width:{{c.pct}}"></u></div></div></button>
  </sc-for>
  <div class="sec" style="padding-top:8px"><span>10 NGÀY</span><span>KẾT THÚC 26/10 · 23:59</span></div>
  <div class="card" style="padding:12px"><div class="dayg">
   <sc-for list="{{tdays}}" as="t" hint-placeholder-count="10"><i class="{{t.cls}}" style="--c:{{t.c}}">{{t.d}}</i></sc-for>
  </div>
  <p style="margin:10px 0 0;font-size:11px;font-weight:700;color:#A7A9E6;line-height:1.5">17–19 Urichinguchana · 20–22 Aniyaaa · 23–25 Poyoyoi · 26 ngày bù, mở pack cho concept nào cũng được.</p></div>
  <div class="card" style="margin-top:12px;border-color:#FFE45E88"><b style="font-size:13px">Ultra Limited</b><p style="margin:4px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.5">Gom đủ cả 3 concept để nhận 2 thẻ Ultra có nhạc. Đã đủ {{celN}}/3.</p></div>
 </div>
 @@NAV_hub@@
</div></sc-if>

<!-- ============ MỞ PACK ============ -->
<sc-if value="{{isPack}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(500px 500px at 50% 40%,color-mix(in srgb,{{pkA}} 40%,#15123B),#0a0818 78%)">
 @@H_PACK@@
 <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
  <sc-if value="{{pkPick}}" hint-placeholder-val="{{false}}"><div style="display:flex;gap:8px;padding:0 14px"><button class="pb {{pc1}}" data-i="1" onClick="{{pickC}}">Urichinguchana</button><button class="pb {{pc2}}" data-i="2" onClick="{{pickC}}">Aniyaaa</button><button class="pb {{pc3}}" data-i="3" onClick="{{pickC}}">Poyoyoi</button></div></sc-if>
  <button class="tr {{trCls}}" onClick="{{tear}}" aria-label="Xé pack">
   @@PK@@
  </button>
  <div style="text-align:center"><b style="font-size:15px;font-weight:900">{{pkLabel}}</b><small style="display:block;margin-top:3px;font-size:12px;font-weight:700;color:#A7A9E6">{{pkSub}}</small></div>
 </div>
 <div style="padding:0 14px 22px"><button class="btn2" onClick="{{tear}}">{{tearTxt}}</button></div>
</div></sc-if>

<!-- ============ XEM THẺ ============ -->
<sc-if value="{{isShow}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(520px 520px at 50% 38%,color-mix(in srgb,{{shA}} 38%,#15123B),#06041a 78%)">
 <div class="hd" style="display:flex;justify-content:space-between;align-items:center"><span><small>{{shLabel}}</small><h1>{{cConName}}</h1></span>
  <sc-if value="{{isDetail}}" hint-placeholder-val="{{false}}"><button onClick="{{closeShow}}" aria-label="Đóng" style="width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(255,255,255,.32);background:rgba(10,8,30,.55);color:#fff;font-size:16px;font-weight:900;font-family:inherit;cursor:pointer">✕</button></sc-if></div>
 <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px">
  <div class="df {{flipCls}} {{popCls}}" onClick="{{flipCard}}">
   <div class="dff">'''+sif('showNorm',dyn_n(),'true')+sif('showHolo',dyn_h())+'''</div>
   <div class="dfb">'''+BACKS+'''</div>
  </div>
  <span style="padding:6px 16px;border-radius:99px;font-size:12px;font-weight:900;letter-spacing:.08em;background:{{badgeBg}};color:{{badgeFg}}">{{badgeTxt}}</span>
  <div style="font-size:11.5px;font-weight:700;color:#A7A9E6">Chạm thẻ để lật mặt sau</div>
 </div>
 <div style="padding:0 14px 22px;flex:none">
  <sc-if value="{{isReveal}}" hint-placeholder-val="{{true}}"><div class="dots" style="margin-bottom:12px"><sc-for list="{{dots}}" as="d" hint-placeholder-count="5"><i class="{{d.cls}}"></i></sc-for></div><button class="btn2" onClick="{{nextCard}}">{{nextTxt}}</button></sc-if>
  <sc-if value="{{isDetail}}" hint-placeholder-val="{{false}}"><button class="btn2" onClick="{{closeShow}}" style="background:#363078;color:#F1F0FF;box-shadow:none">Đóng</button></sc-if>
 </div>
</div></sc-if>

<!-- ============ BỘ SƯU TẬP ============ -->
<sc-if value="{{isCol}}" hint-placeholder-val="{{false}}">
<div class="scr">
 @@H_COL@@
 <div class="tabs" style="--a:{{tabA}}">
  <button class="{{tb1}}" style="--a:#FFB02E" data-i="1" onClick="{{setTab}}">Urichi…</button><button class="{{tb2}}" style="--a:#FF2E88" data-i="2" onClick="{{setTab}}">Aniyaaa</button><button class="{{tb3}}" style="--a:#4CC9FF" data-i="3" onClick="{{setTab}}">Poyoyoi</button><button class="{{tb4}}" style="--a:#FFE45E" data-i="4" onClick="{{setTab}}">Ultra</button>
 </div>
 <div class="body">
  <sc-if value="{{colOpen}}" hint-placeholder-val="{{true}}">
   <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 2px 10px"><span style="display:flex;gap:8px;align-items:center;font-size:15px;font-weight:900"><i style="width:11px;height:11px;border-radius:50%;background:{{tabA}};box-shadow:0 0 9px {{tabA}}"></i>{{colName}}</span><span style="font-size:11px;font-weight:800;color:{{tabA}}">{{colTotal}}/10</span></div>
   <div class="sec"><span>THƯỜNG</span><span>{{colN}}/5</span></div>
   <div class="row5" style="--a:{{tabA}}"><sc-for list="{{tilesN}}" as="t" hint-placeholder-count="5"><button class="tile {{t.cls}}" style="--a:{{tabA}}" data-i="{{t.i}}" onClick="{{tileOpen}}"><img src="{{t.img}}" alt="{{t.nm}}"><span class="nm">{{t.nm}}</span><span class="x" style="display:{{t.xd}}">×{{t.x}}</span></button></sc-for></div>
   <div class="sec" style="padding-top:13px"><span>HOLO</span><span>{{colH}}/5</span></div>
   <div class="row5"><sc-for list="{{tilesH}}" as="t" hint-placeholder-count="5"><button class="tile {{t.cls}}" style="--a:{{tabA}}" data-i="{{t.i}}" onClick="{{tileOpen}}"><img src="{{t.img}}" alt="{{t.nm}}"><span class="nm">{{t.nm}}</span><span class="x" style="display:{{t.xd}}">×{{t.x}}</span></button></sc-for></div>
   <div class="sec" style="padding-top:14px"><span>PANORAMA</span><span>{{panoState}}</span></div>
   <button onClick="{{goView}}" aria-label="Mở panorama" style="display:block;width:100%;border:0;padding:2px;border-radius:12px;background:{{panoRim}};cursor:pointer"><span class="shot" style="display:block"><img src="{{colPano}}" alt="Panorama {{colName}}"><sc-for list="{{bands}}" as="b" hint-placeholder-count="5"><span class="bd {{b.cls}}" style="left:{{b.left}}"></span></sc-for></span></button>
   <sc-if value="{{panoOk}}" hint-placeholder-val="{{false}}"><p style="margin:9px 2px 0;font-size:12px;font-weight:800;color:{{tabA}};text-align:center">Chạm panorama để xem toàn màn hình</p></sc-if>
   <sc-if value="{{hasPacks}}" hint-placeholder-val="{{true}}"><button class="btn2" onClick="{{openPack}}" style="margin-top:12px">Mở pack · còn {{packN}}</button></sc-if>
  </sc-if>
  <sc-if value="{{colLocked}}" hint-placeholder-val="{{false}}"><div class="card" style="text-align:center;padding:36px 20px;margin-top:20px"><div style="font:800 40px 'Unbounded';color:#363078">?</div><b style="display:block;font-size:16px;margin-top:10px">{{colName}}</b><p style="margin:6px 0 0;font-size:12.5px;font-weight:600;color:#A7A9E6">Concept này mở vào {{lockDate}}.</p></div></sc-if>
  <sc-if value="{{colUltra}}" hint-placeholder-val="{{false}}">
   <div class="sec"><span>ULTRA LIMITED</span><span>{{ultraSt}}</span></div>
   <div style="display:flex;gap:12px">
    <div style="flex:1;min-width:0;text-align:center">
     '''+sif('u1Ready','<button data-i="1" onClick="{{openU}}" style="border:0;background:none;padding:0;cursor:pointer;display:block;width:100%">'+ultra(0,166,1,'JAMES')+'</button><div style="margin-top:12px;font-size:12px;font-weight:800;color:#FFE9A8">{{u1Songs}}</div>')+sif('u1New','<div class="card" style="aspect-ratio:3/4;display:flex;flex-direction:column;justify-content:center;gap:10px;align-items:center;border-color:#FFE45E"><div style="font:800 11px Unbounded;color:#FFE9A8">ULTRA #1</div><button class="pb gold" data-i="1" onClick="{{startU}}">Chọn 2 bài</button></div>')+sif('u1Lock','<div class="card" style="aspect-ratio:3/4;display:grid;place-items:center;opacity:.6"><div><div style="font:800 34px Unbounded;color:#363078;text-align:center">?</div><small style="font-weight:800;color:#8F8FD0">Gom đủ 3 concept</small></div></div>','true')+'''
    </div>
    <div style="flex:1;min-width:0;text-align:center">
     '''+sif('u2Ready','<button data-i="2" onClick="{{openU}}" style="border:0;background:none;padding:0;cursor:pointer;display:block;width:100%">'+ultra(4,166,2,'SEONGHYEON')+'</button><div style="margin-top:12px;font-size:12px;font-weight:800;color:#FFE9A8">{{u2Songs}}</div>')+sif('u2New','<div class="card" style="aspect-ratio:3/4;display:flex;flex-direction:column;justify-content:center;gap:10px;align-items:center;border-color:#FFE45E"><div style="font:800 11px Unbounded;color:#FFE9A8">ULTRA #2</div><button class="pb gold" data-i="2" onClick="{{startU}}">Chọn 2 bài</button></div>')+sif('u2Lock','<div class="card" style="aspect-ratio:3/4;display:grid;place-items:center;opacity:.6"><div><div style="font:800 34px Unbounded;color:#363078;text-align:center">?</div><small style="font-weight:800;color:#8F8FD0">Gom đủ 3 concept</small></div></div>','true')+'''
    </div>
   </div>
   <p style="margin:14px 2px 0;font-size:11.5px;font-weight:600;color:#A7A9E6;line-height:1.55">Mặt thẻ là video lặp 28 giây. Chạm thẻ để mở 2 đĩa than và nghe bài đã chọn.</p>
  </sc-if>
 </div>
 @@NAV_col@@
</div></sc-if>

<!-- ============ MỞ KHÓA CONCEPT ============ -->
<sc-if value="{{isUnlock}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(560px 560px at 50% 30%,color-mix(in srgb,{{ucA}} 50%,#15123B),#06041a 78%)">
 <div class="body" style="padding-top:26px;text-align:center">
  <small style="font-size:11px;font-weight:800;letter-spacing:.2em;color:{{ucA}}">ĐỦ 5/5 THẺ THƯỜNG</small>
  <h1 style="margin:6px 0 22px;font:800 25px 'Unbounded'">{{ucName}}</h1>
  <div style="padding:6px 0 10px">'''+FR+'''</div>
  <div style="margin-top:34px">'''+TT+'''</div>
  <div style="margin:22px 0 0;padding:2px;border-radius:12px;background:linear-gradient(100deg,#fff,{{ucA}},#4CC9FF,#fff)"><div class="shot"><img src="{{ucPano}}" alt="Panorama đã mở"></div></div>
  <div class="card" style="margin-top:16px;text-align:left;font-size:12.5px;font-weight:700;line-height:1.9">✓ Panorama {{ucName}} đã mở<br>✓ Khung tròn và danh hiệu mới<br>✓ 1 pack thẻ thường tặng kèm</div>
 </div>
 <div style="padding:8px 14px 22px;flex:none;display:flex;flex-direction:column;gap:8px"><button class="btn2" onClick="{{unPack}}">Mở pack tặng</button><button class="btn2" onClick="{{unNext}}" style="background:#363078;color:#F1F0FF;box-shadow:none">{{unNextTxt}}</button></div>
</div></sc-if>

<!-- ============ NHẬN ULTRA ============ -->
<sc-if value="{{isUGet}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(560px 560px at 50% 32%,#4a1c7a,#05030d 76%)">
 <div class="body" style="padding-top:30px;text-align:center">
  <small style="font-size:11px;font-weight:800;letter-spacing:.2em;color:#FFE9A8">ĐỦ CẢ 3 CONCEPT</small>
  <h1 style="margin:6px 0 24px;font:800 24px 'Unbounded'">2 thẻ Ultra Limited</h1>
  <div style="display:flex;gap:14px;justify-content:center">'''+ultra(0,160,1,'JAMES')+ultra(4,160,2,'SEONGHYEON')+'''</div>
  <p style="margin:22px 14px 0;font-size:13px;font-weight:600;color:#C7C6F5;line-height:1.6">Mỗi thẻ mang 2 bài hát bạn chọn trong 7 bài của CORTIS. Chọn xong là khóa vĩnh viễn.</p>
 </div>
 <div style="padding:8px 14px 22px;flex:none;display:flex;flex-direction:column;gap:8px"><button class="btn2" onClick="{{startU1}}">Chọn nhạc cho thẻ #1</button><button class="btn2" onClick="{{goCol}}" style="background:#363078;color:#F1F0FF;box-shadow:none">Để sau</button></div>
</div></sc-if>

<!-- ============ PANORAMA TOÀN MÀN HÌNH ============ -->
<sc-if value="{{isView}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:#05040f">
 <div style="position:absolute;left:0;right:0;top:0;z-index:3;display:flex;justify-content:space-between;align-items:flex-start;padding:16px 14px;background:linear-gradient(180deg,rgba(5,4,15,.88),transparent)"><span><small style="display:block;font-size:9.5px;font-weight:800;letter-spacing:.16em;color:{{tabA}}">PANORAMA 360°</small><b style="font-size:16px;font-weight:900">{{colName}}</b></span><button onClick="{{goCol}}" aria-label="Thoát" style="width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(255,255,255,.32);background:rgba(10,8,30,.55);color:#fff;font-size:16px;font-weight:900;font-family:inherit;cursor:pointer">✕</button></div>
 <div style="flex:1;min-height:0;position:relative;overflow:hidden"><img src="{{colPano}}" alt="Panorama" style="position:absolute;left:0;top:50%;height:520px;width:{{imgW}}px;max-width:none;display:block;transform:translate({{panX}},-50%);transition:transform .12s linear"></div>
 <div style="position:absolute;left:0;right:0;bottom:0;z-index:3;padding:14px;background:linear-gradient(0deg,rgba(5,4,15,.94),rgba(5,4,15,.75) 62%,transparent)">
  <p style="margin:0 0 4px;text-align:center;font-size:13px;font-weight:900">Nghiêng điện thoại để nhìn quanh</p>
  <div style="position:relative;height:28px;border-radius:7px;overflow:hidden;border:1.5px solid rgba(255,255,255,.22);margin-top:8px"><img src="{{colPano}}" alt="" style="width:100%;height:100%;object-fit:cover;opacity:.5;display:block"><span style="position:absolute;top:0;bottom:0;width:{{fovW}};left:{{fovX}};border:2px solid {{tabA}};border-radius:5px;background:rgba(255,255,255,.18)"></span></div>
  <div style="margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(32,28,82,.85);border:1.5px dashed #363078"><small style="display:block;font-size:9.5px;font-weight:800;letter-spacing:.12em;color:#A7A9E6;margin-bottom:6px">GIẢ LẬP XOAY ĐIỆN THOẠI (CHỈ CÓ TRONG BẢN DEMO)</small><input id="panr" type="range" min="0" max="100" value="{{panVal}}" onInput="{{onPan}}" aria-label="Xoay điện thoại" style="width:100%;accent-color:#FFB02E"></div>
 </div>
</div></sc-if>

<!-- ============ PHẦN THƯỞNG ============ -->
<sc-if value="{{isRew}}" hint-placeholder-val="{{false}}">
<div class="scr">
 @@H_REW@@
 <div class="body">
  <sc-for list="{{rews}}" as="r" hint-placeholder-count="3">
   <div class="card" style="margin-bottom:12px;text-align:center;{{r.dim}}">
    <small style="font-size:10px;font-weight:800;letter-spacing:.14em;color:{{r.a}}">{{r.st}}</small>
    <div style="padding:14px 0 26px">'''+FR_S+'''</div>
    <div>'''+TT_S+'''</div>
   </div>
  </sc-for>
  <div class="card" style="text-align:center;border-color:#FFE45E88"><b style="font-size:14px">Thẻ Ultra Limited</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6">{{ultraSt}} · cần đủ 3 concept</p></div>
 </div>
 @@NAV_rew@@
</div></sc-if>

<!-- ============ ULTRA ============ -->
<sc-if value="{{isUpick}}" hint-placeholder-val="{{false}}">
<div class="scr">
 <div class="hd"><small>Bạn vừa nhận thẻ Ultra Limited #{{u}}</small><h1>Chọn 2 bài cho thẻ</h1></div>
 <div style="flex:1;min-height:0;overflow-y:auto;padding:0 14px;display:flex;flex-direction:column;gap:9px">
  <sc-for list="{{songs}}" as="s" hint-placeholder-count="7"><button class="sg {{s.cls}}" style="--c:{{s.c}}" data-i="{{s.i}}" onClick="{{pickSong}}"><span class="v"></span><span><b>{{s.t}}</b><small>{{s.al}}</small></span><span class="ck">✓</span></button></sc-for>
  <p style="margin:4px 2px 12px;font-size:11.5px;font-weight:600;color:#A7A9E6;line-height:1.5">Thẻ mang đúng 2 bài bạn chọn và khóa vĩnh viễn.</p>
 </div>
 <div style="padding:10px 14px 22px;flex:none"><button class="btn {{lockCls}}" onClick="{{lock}}">{{lockTxt}}</button></div>
</div></sc-if>
<sc-if value="{{isUcard}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(520px 520px at 50% 40%,#3a1c6a,#0a0818 74%)">
 <div class="hd" style="display:flex;justify-content:space-between;align-items:center"><span><small>Bộ sưu tập · Ultra #{{u}}</small><h1>Thẻ Ultra</h1></span><button onClick="{{backCol}}" aria-label="Đóng" style="width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(255,255,255,.32);background:rgba(10,8,30,.55);color:#fff;font-size:16px;font-weight:900;font-family:inherit;cursor:pointer">✕</button></div>
 <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px" onClick="{{openChoose}}">'''+stage('idle')+'''<span class="hint2">♪ CHẠM THẺ ĐỂ NGHE NHẠC</span></div>
 <div style="padding:0 14px 22px"></div>
</div></sc-if>
<sc-if value="{{isUchoose}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(520px 520px at 50% 36%,#3a1c6a,#05030d 76%)">
 <div class="hd" style="text-align:center"><small>Hai đĩa trượt ra khỏi thẻ</small><h1>Chọn 1 đĩa để phát</h1></div>
 <div style="margin-top:10px">'''+stage('ch')+'''</div>
 <div style="display:flex;gap:12px;padding:6px 18px 0"><button class="chip" onClick="{{playA}}"><small>MẶT A</small><b>{{titleA}}</b></button><button class="chip" onClick="{{playB}}"><small>MẶT B</small><b>{{titleB}}</b></button></div>
 <p style="margin:18px 24px 0;text-align:center;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Nghe hết bài mà không cần thoát thẻ.</p>
 <div style="margin-top:auto;padding:0 14px 22px"><button class="btn ghost" onClick="{{goUcard}}" style="min-height:46px;font-size:13px">Đóng</button></div>
</div></sc-if>
<sc-if value="{{isUplay}}" hint-placeholder-val="{{false}}">
<div class="scr pl {{psCls}}" style="background:radial-gradient(520px 520px at 50% 34%,#4a1c7a,#05030d 76%)">
 <div class="hd" style="display:flex;justify-content:space-between;align-items:center"><span><small>Đang phát từ thẻ</small><h1>Thẻ Ultra</h1></span><button onClick="{{goUcard}}" aria-label="Đóng thẻ" style="width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(255,255,255,.32);background:rgba(10,8,30,.55);color:#fff;font-size:16px;font-weight:900;font-family:inherit;cursor:pointer">✕</button></div>
 <div style="margin-top:8px">'''+stage('{{stCls}}')+'''</div>
 <div style="padding:10px 20px 0"><div style="min-width:0"><b style="display:block;font:800 19px 'Unbounded'">{{curT}}</b><small style="display:block;font-size:11.5px;font-weight:700;color:#A7A9E6;margin-top:3px">CORTIS · {{curAl}}</small></div>
  <div class="pgb" style="margin-top:16px"><i></i></div>
  <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;font-weight:800;color:#A7A9E6"><span>đang phát</span><span>{{curLen}}</span></div>
  <div style="display:flex;gap:10px;margin-top:14px"><button class="btn" onClick="{{togglePause}}" style="flex:1.3">{{pauseTxt}}</button><button class="btn ghost" onClick="{{goChoose}}" style="flex:1">Đổi đĩa</button></div></div>
</div></sc-if>

<sc-if value="{{hasToast}}" hint-placeholder-val="{{false}}"><div class="toast">{{toast}}</div></sc-if>
</div>

<!-- ============ BẢNG ĐIỀU KHIỂN ============ -->
<div class="cp">
 <h3>Bảng điều khiển</h3>
 <p style="margin:4px 0 0;font-size:11.5px;font-weight:600;color:#A7A9E6;line-height:1.5">Chỉ có trong bản thử nghiệm. Dùng để nhảy ngày, cấp pack, ép kết quả và kiểm tra từng trạng thái.</p>
 <div class="cs"><div class="cl">NGÀY HIỆN TẠI · {{dayLbl}}</div>
  <div class="dchips"><sc-for list="{{dchips}}" as="d" hint-placeholder-count="12"><button class="{{d.cls}}" data-i="{{d.i}}" onClick="{{setDay}}">{{d.dt}}<small>{{d.wd}}</small><i style="--c:{{d.c}}"></i></button></sc-for></div>
  <div class="g" style="margin-top:8px"><button class="pb" onClick="{{dayPrev}}">‹ Lùi 1 ngày</button><button class="pb" onClick="{{dayNext}}">Tiến 1 ngày ›</button></div>
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
  <div class="g"><button class="pb" onClick="{{goHome}}">Lịch</button><button class="pb" onClick="{{goHub}}">Trang sự kiện</button><button class="pb" onClick="{{openPack}}">Mở pack</button><button class="pb" onClick="{{goCol}}">Bộ sưu tập</button><button class="pb" onClick="{{goView}}">Panorama</button><button class="pb" onClick="{{goRew}}">Phần thưởng</button><button class="pb" onClick="{{jumpU}}">Ultra</button><button class="pb" onClick="{{prevUnlock}}">Màn mở khóa</button></div>
 </div>
 <div class="cs"><div class="cl">THỐNG KÊ</div><div class="stats">{{stats}}</div></div>
 <div class="cs"><button class="pb red" onClick="{{reset}}" style="width:100%;padding:11px">Đặt lại toàn bộ</button></div>
</div>
</div>
'''
PK=''.join(sif(f'pk{c}{k}',pack(c,190,lab),'true' if (c==1 and k=='d') else 'false') for c in (1,2,3) for k,lab in (('d','MÙA CONCEPT'),('b','QUÀ TẶNG')))
body=body.replace('@@PK@@',PK)
for k,t,sm in (('home','Lịch','Thứ Bảy 17/10'),):
    pass
body=body.replace('@@H_HOME@@','<div class="hd"><small>{{dateLbl}}</small><h1>Lịch của bạn</h1></div>')
body=body.replace('@@H_HUB@@',hdr('{{hubSub}}','Mùa Concept','goHome'))
body=body.replace('@@H_PACK@@',hdr('{{pkHead}}','Mở pack','goHub'))
body=body.replace('@@H_COL@@',hdr('Bộ sưu tập của bạn','Thẻ ảnh'))
body=body.replace('@@H_REW@@',hdr('Khung tròn &amp; danh hiệu','Phần thưởng'))
for a in ('home','hub','col','rew'): body=body.replace('@@NAV_%s@@'%a,nav(a))
assert '@@' not in body
SCRIPT=open('b7_js.js',encoding='utf-8').read()
css=EX3+EX4+EX6+APPCSS
html=page('Bản thử nghiệm Mùa Concept',910,904,body,css)
a=html.index('class Component extends DCLogic'); b=html.index('</script>',a)
html=html[:a]+SCRIPT+'\n'+html[b:]
open(OUT2+'Build.dc.html','w',encoding='utf-8').write(html)
print('ok',len(html))
