from lib import *
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
extra='''
.go{padding:10px 16px;border-radius:99px;font-size:13px;font-weight:900;color:#2A1400;background:linear-gradient(100deg,#FFB02E,#FF6B57);white-space:nowrap}
.sec{display:flex;justify-content:space-between;align-items:baseline;margin:22px 0 10px}
.sec b{font-size:15px;font-weight:900}.sec span{font-size:11px;font-weight:800;color:#A7A9E6;letter-spacing:.08em}
.day{aspect-ratio:1;border-radius:9px;display:grid;place-items:center;font-size:11px;font-weight:800;background:#201C52;border:1.5px solid #363078;color:#A7A9E6;position:relative}
.day.ok{background:var(--a);border-color:transparent;color:#1a0b00}
.day.now{border:2px solid #fff;color:#fff;box-shadow:0 0 14px rgba(255,255,255,.5)}
.day.pk:after{content:"";position:absolute;right:-2px;top:-2px;width:8px;height:8px;border-radius:50%;background:#FF2E88}
@keyframes sweep{0%{background-position:100% 0}100%{background-position:-70% 0}}
@keyframes drift{from{transform:translateX(-30px)}to{transform:translateX(30px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,176,46,.5)}50%{box-shadow:0 0 0 9px rgba(255,176,46,0)}}
.tk{width:30px;height:30px;border-radius:50%;border:2.5px solid #363078;flex:none;animation:pulse 2s infinite}
'''
def tl(week,con,d0,d1,done):
    n,a,b=CON[con]
    cells=''
    for d in range(d0,d1+1):
        cls='day'
        if d<15+0 and False:pass
        cells+=f'<div class="day{" ok" if d in done else ""}{" now" if d==17 else ""}{" pk" if d==17 else ""}">{d}</div>'
    return f'<div style="margin-bottom:10px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><i style="width:10px;height:10px;border-radius:50%;background:{a};box-shadow:0 0 8px {a}"></i><b style="font-size:12.5px">{'Ngày bù' if week==4 else 'Chặng '+str(week)} · {'Mọi concept' if week==4 else 'Concept '+str(con)+' · '+n}</b><span style="margin-left:auto;font-size:10.5px;font-weight:800;color:#A7A9E6">{d0}–{d1}/10</span></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;--a:{a}">{cells}</div></div>'

def conc(con,have,state):
    n,a,b=CON[con]
    tiles=''.join((f'<div class="cw" style="width:100%"><div style="aspect-ratio:3/4;border-radius:7px;overflow:hidden;border:1.5px solid {a}"><img src="{MM[con][i]}" style="width:100%;height:100%;object-fit:cover;display:block"></div></div>' if i<have else '<div class="lk" style="border-radius:7px"><i style="width:10px;height:10px"></i></div>') for i in range(5))
    lock = state=='lock'
    return f'''<div class="card" style="border-color:{a if not lock else '#363078'};opacity:{.62 if lock else 1}">
<div style="display:flex;align-items:center;gap:8px"><i style="width:11px;height:11px;border-radius:50%;background:{a};box-shadow:0 0 9px {a}"></i><b style="font-size:14.5px">Concept {con} · {n}</b><span style="margin-left:auto;font-size:11px;font-weight:800;color:{a}">{'MỞ '+('20/10' if con==2 else '23/10') if lock else str(have)+'/5'}</span></div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:11px">{tiles}</div>
<div style="position:relative;margin-top:10px;border-radius:9px;overflow:hidden;border:1.5px solid {'#363078' if lock else a}"><img src="{PANOS[con]}" style="width:100%;display:block;{'filter:brightness(.25) blur(2px)' if lock else ''}">{''.join(f'<span style="position:absolute;top:0;bottom:0;left:{k*20}%;width:20%;background:rgba(10,8,30,.93);border-right:1px solid #363078"></span>' for k in range(have,5)) if not lock else ''}</div>
</div>'''

body=f'''
<div style="position:relative;height:330px;overflow:hidden">
 <div style="position:absolute;inset:-20px;background:url({PANOS[2]}) center/cover;animation:drift 22s ease-in-out infinite alternate"></div>
 <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(21,18,59,.2),#15123B 92%)"></div>
 <div style="position:absolute;inset:-20%;mix-blend-mode:overlay;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.6) 50%,transparent 60%);background-size:300% 100%;animation:sweep 5s ease-in-out infinite"></div>
 <div style="position:absolute;left:14px;top:16px;width:38px;height:38px;border-radius:50%;background:rgba(10,8,30,.6);border:1.5px solid rgba(255,255,255,.3);display:grid;place-items:center;font-size:18px;font-weight:900">‹</div>
 <div style="position:absolute;left:16px;right:16px;bottom:18px">
  <div class="lab" style="color:#FFB02E">● ĐANG DIỄN RA · CÒN 10 NGÀY</div>
  <div style="font:800 34px/1 'Unbounded';margin-top:8px;letter-spacing:-.02em">MÙA<br>CONCEPT</div>
  <div style="margin-top:9px;font-size:12.5px;font-weight:600;color:#E6E5FF;line-height:1.5;max-width:300px">Mỗi ngày làm 1 việc trong lịch, nhận 2 pack thẻ. Gom 3 concept, mở 3 panorama.</div>
 </div>
</div>
<div style="padding:0 14px 30px">
 <div class="card" style="border-color:#FFB02E;background:linear-gradient(160deg,#2a2060,#201C52)">
  <div style="display:flex;justify-content:space-between;align-items:center"><span class="lab" style="color:#FFB02E">NHIỆM VỤ HÔM NAY · 17/10</span><span style="font-size:11px;font-weight:900;color:#FF2E88">0/1</span></div>
  <div style="display:flex;gap:12px;align-items:center;margin-top:12px"><div class="tk"></div><div><b style="font-size:16px;font-weight:900">Rạng Sáng</b><div style="font-size:12px;font-weight:600;color:#A7A9E6;margin-top:2px;line-height:1.4">Hoàn thành 1 việc trong lịch trước 9h sáng.</div></div></div>
  <div style="display:flex;align-items:center;gap:10px;margin-top:14px;padding-top:12px;border-top:1.5px dashed #363078"><div style="display:flex">{pack(1,34)}<div style="margin-left:-14px;margin-top:5px;transform:rotate(8deg)">{pack(1,34)}</div></div><span style="font-size:12px;font-weight:700;line-height:1.4">Thưởng <b style="color:#FFB02E">2 pack</b> · 10 thẻ concept<br><span class="dim" style="font-weight:600">Có thể trùng thẻ</span></span></div>
  <div class="go" style="text-align:center;margin-top:14px;padding:13px">Làm nhiệm vụ trong Lịch ›</div>
 </div>

 <div class="sec"><b>Lịch 10 ngày</b><span>0/10 NGÀY</span></div>
 <div class="card">{tl(1,1,17,19,[])}{tl(2,2,20,22,[])}{tl(3,3,23,25,[])}{tl(4,1,26,26,[])}<div style="font-size:11px;font-weight:600;color:#A7A9E6;line-height:1.5;margin-top:4px">Bỏ lỡ một ngày thì mất lượt của ngày đó, nhưng thẻ đã có vẫn giữ nguyên. Mỗi concept 3 ngày. Ngày 26/10 là ngày bù: pack mở được thẻ của cả 3 concept.</div></div>

 <div class="sec"><b>Bộ sưu tập concept</b><span>3 CONCEPT</span></div>
 <div style="display:flex;flex-direction:column;gap:11px">{conc(1,2,'live')}{conc(2,0,'lock')}{conc(3,0,'lock')}</div>

 <div class="sec"><b>Phần thưởng</b><span>MỤC TIÊU</span></div>
 <div class="card" style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:11px;align-items:center"><div style="width:44px;height:44px;border-radius:50%;padding:3px;background:linear-gradient(140deg,#fff,{C1},{C3});flex:none"><div style="width:100%;height:100%;border-radius:50%;background:url({M[3]}) center/cover"></div></div><div style="flex:1"><b style="font-size:13px">Mỗi concept đủ 5 thẻ thường</b><div style="font-size:11.5px;font-weight:600;color:#A7A9E6;margin-top:2px;line-height:1.4">Mở panorama · khung tròn · danh hiệu · 1 pack thẻ thường</div></div></div>
  <div style="height:1.5px;background:#363078"></div>
  <div style="display:flex;gap:11px;align-items:center"><div class="cw" style="width:44px;flex:none">{hcard(0,1,44,badge=False)}</div><div style="flex:1"><b style="font-size:13px">Đủ cả 3 concept</b><div style="font-size:11.5px;font-weight:600;color:#A7A9E6;margin-top:2px;line-height:1.4">2 thẻ <b style="color:#aef">Ultra Limited</b> hiệu ứng đặc biệt, chỉ có trong mùa này</div></div></div>
 </div>

 <div class="sec"><b>Tỉ lệ rơi mỗi thẻ</b><span>MINH BẠCH</span></div>
 <div class="card">
  <div style="display:flex;height:14px;border-radius:99px;overflow:hidden"><span style="flex:80;background:linear-gradient(90deg,{C1},#ffd98a)"></span><span style="flex:20;background:linear-gradient(90deg,#FF2E88,#FFE45E,#4CC9FF)"></span></div>
  <div style="display:flex;justify-content:space-between;margin-top:9px;font-size:12px;font-weight:800"><span style="color:{C1}">Thường 5 × 16% = 80%</span><span style="color:#aef">Holo 5 × 4% = 20%</span></div>
  <div style="font-size:11.5px;font-weight:600;color:#A7A9E6;line-height:1.5;margin-top:9px">Mỗi pack gồm 5 thẻ rút độc lập, nên có thể trùng. Thẻ trùng vẫn được giữ lại để tặng bạn bè.</div>
 </div>
 <div style="margin-top:22px;text-align:center;font-size:11px;font-weight:700;color:#6f72b8">Sự kiện kết thúc 26/10/2026 lúc 23:59</div>
</div>'''
open(OUT+'Hub.dc.html','w',encoding='utf-8').write(page('Trang Mùa Concept',390,2260,body,extra))

# ================= PACK FLOW =================
def phone(inner,cap,bg='#15123B',h=640):
    return f'<div style="width:290px;flex:none"><div class="lab" style="margin:0 0 8px">{cap}</div><div style="height:{h}px;border-radius:26px;border:2px solid #363078;overflow:hidden;position:relative;background:{bg}">{inner}</div></div>'
glow=lambda c:f'<div style="position:absolute;left:50%;top:44%;width:420px;height:420px;margin:-210px;background:radial-gradient(circle,{c},transparent 62%);opacity:.7"></div>'
s1=f'''{glow('rgba(255,176,46,.55)')}
<div style="position:absolute;left:0;right:0;top:34px;text-align:center"><div class="lab" style="color:#FFB02E">PACK 1 / 2</div><div style="font:800 21px 'Unbounded';margin-top:6px">Phòng Thu</div></div>
<div style="position:absolute;left:50%;top:104px;margin-left:-82px;animation:bob 2.4s ease-in-out infinite">{pack(1,164)}</div>
<div style="position:absolute;left:18px;right:18px;bottom:30px;text-align:center"><div style="font-size:12px;font-weight:700;color:#C7C6F5;margin-bottom:12px">Vuốt ngang để xé pack</div><div style="height:46px;border-radius:99px;border:2px solid rgba(255,255,255,.35);position:relative"><span style="position:absolute;left:4px;top:4px;width:62px;height:34px;border-radius:99px;background:linear-gradient(100deg,{C1},#FF6B57)"></span><span style="position:absolute;right:20px;top:12px;font-size:16px;font-weight:900;color:#fff">› › ›</span></div></div>'''
s2=f'''<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,#fff 0,rgba(255,226,150,.9) 12%,rgba(255,176,46,.5) 30%,transparent 62%)"></div>
<div style="position:absolute;inset:-30%;mix-blend-mode:screen;background:repeating-conic-gradient(from 0deg at 50% 42%,rgba(255,255,255,.75) 0 4deg,transparent 4deg 15deg);animation:spinr 8s linear infinite;opacity:.6"></div>
<div style="position:absolute;left:50%;top:176px;margin-left:-82px;transform:translateY(-34px) rotate(-7deg);transform-origin:left bottom"><div style="height:48px;width:164px;overflow:hidden;border-radius:12px 12px 0 0">{pack(1,164)}</div></div>
<div style="position:absolute;left:50%;top:238px;margin-left:-82px;height:236px;width:164px;overflow:hidden;border-radius:0 0 12px 12px"><div style="margin-top:-116px">{pack(1,164)}</div></div>
<div style="position:absolute;left:0;right:0;bottom:44px;text-align:center;font:800 22px 'Unbounded';color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.4)">XÉ!</div>'''
s3=f'''{glow('rgba(76,201,255,.55)')}
<div style="position:absolute;left:0;right:0;top:30px;text-align:center"><div class="lab" style="color:#aef">THẺ 4 / 5</div><div style="display:flex;gap:6px;justify-content:center;margin-top:8px">{''.join('<i style="width:22px;height:4px;border-radius:2px;background:%s"></i>'%('#aef' if k<4 else '#363078') for k in range(5))}</div></div>
<div style="position:absolute;left:50%;top:84px;margin-left:-110px;transform:rotate(-2deg)">{hcard(3,1,220)}</div>
<div style="position:absolute;left:50%;top:402px;margin-left:-60px;width:120px;text-align:center;padding:5px 0;border-radius:99px;background:#FF2E88;font-size:12px;font-weight:900;letter-spacing:.12em;box-shadow:0 0 20px rgba(255,46,136,.7)">THẺ MỚI</div>
<div style="position:absolute;left:0;right:0;top:452px;text-align:center;font:800 17px 'Unbounded';background:linear-gradient(100deg,#fff,#aef,#FFE45E,#fff);-webkit-background-clip:text;background-clip:text;color:transparent">HOLO!</div>
<div style="position:absolute;left:18px;right:18px;bottom:26px"><div class="go" style="text-align:center;padding:14px;font-size:15px">Tiếp ›</div></div>'''
tiles=''.join(f'<div style="position:relative">{(hcard(i,1,78,badge=False) if h else ncard(i,1,78,name="M%d"%(i+1),tag=False))}{"<span style=\'position:absolute;left:4px;top:-5px;padding:2px 6px;border-radius:99px;background:#FF2E88;font-size:8px;font-weight:900;z-index:9\'>MỚI</span>" if nw else "<span style=\'position:absolute;right:4px;top:-5px;padding:2px 6px;border-radius:99px;background:#363078;font-size:8px;font-weight:900;z-index:9\'>×2</span>"}</div>' for i,h,nw in [(0,False,True),(2,False,True),(2,False,False),(3,True,True),(4,False,True)])
s4=f'''<div style="position:absolute;left:0;right:0;top:30px;text-align:center"><div class="lab" style="color:#FFB02E">KẾT QUẢ PACK</div><div style="font:800 19px 'Unbounded';margin-top:5px">4 thẻ mới</div></div>
<div style="position:absolute;left:14px;right:14px;top:92px;display:grid;grid-template-columns:repeat(3,1fr);gap:11px 9px;justify-items:center">{tiles}</div>
<div style="position:absolute;left:14px;right:14px;top:420px" class="card"><div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800"><span>Phòng Thu</span><span style="color:{C1}">3/5 thẻ thường</span></div><div style="height:9px;border-radius:99px;background:#363078;margin-top:8px;overflow:hidden"><span style="display:block;width:60%;height:100%;background:linear-gradient(90deg,{C1},#FFD98A)"></span></div><div style="font-size:11px;font-weight:600;color:#A7A9E6;margin-top:7px">Còn 2 thẻ nữa là mở panorama.</div></div>
<div style="position:absolute;left:18px;right:18px;bottom:26px;display:flex;flex-direction:column;gap:9px"><div class="go" style="text-align:center;padding:14px;font-size:15px">Mở pack tiếp theo (1 còn lại)</div><div style="text-align:center;font-size:12.5px;font-weight:800;color:#A7A9E6">Xem bộ sưu tập</div></div>'''
ex2=extra+'''@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}@keyframes spinr{to{transform:rotate(360deg)}}'''
body=f'''<div style="padding:28px 30px"><div class="lab" style="color:#FFB02E">MỞ PACK · 4 BƯỚC</div><h1 style="margin:4px 0 20px;font-size:26px;font-weight:900;letter-spacing:-.5px">Từ chạm pack đến kết quả</h1>
<div style="display:flex;gap:24px">{phone(s1,'1 · GIỮ PACK','radial-gradient(circle at 50% 38%,#3a2a8a,#0a0818 75%)')}{phone(s2,'2 · XÉ PACK','#1a1040')}{phone(s3,'3 · LẬT TỪNG THẺ','radial-gradient(circle at 50% 38%,#17306b,#070a22 76%)')}{phone(s4,'4 · TỔNG KẾT','#15123B')}</div></div>'''
open(OUT+'PackFlow.dc.html','w',encoding='utf-8').write(page('Luồng mở pack',1360,780,body,ex2))
print('ok')
