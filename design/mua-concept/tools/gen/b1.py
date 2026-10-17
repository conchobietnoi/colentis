from lib import *
import os
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'

# ================= FRAMES =================
names=['MEMBER 1','MEMBER 2','MEMBER 3','MEMBER 4','MEMBER 5']
def lab(t,s=''):return f'<div style="margin:0 0 10px"><div class="lab">{t}</div><div style="font-size:12px;font-weight:600;color:#A7A9E6;margin-top:3px">{s}</div></div>'
body=f'''
<div style="padding:30px 36px">
<div class="lab" style="color:#FFB02E">KHUNG THẺ · MÙA CONCEPT</div>
<h1 style="margin:4px 0 4px;font-size:28px;font-weight:900;letter-spacing:-.6px">Thẻ thường &amp; thẻ Holo</h1>
<p style="margin:0;font-size:13px;font-weight:600;color:#A7A9E6;max-width:640px;line-height:1.55">Cùng một tấm ảnh, hai cách làm khác hẳn nhau. Thẻ thường là tấm phim slide ấm có số thứ tự và đường xé. Thẻ Holo là lăng kính: viền quay vòng, ánh cầu vồng quét ngang, các mảnh kính lóe lên và sao lấp lánh.</p>
<div style="display:flex;gap:44px;margin-top:26px;align-items:flex-start">
 <div>{lab('THẺ THƯỜNG','Tỉ lệ rơi 16% mỗi thẻ, 5 thẻ')}{ncard(0,1,300,name='JAMES')}</div>
 <div>{lab('THẺ HOLO','Tỉ lệ rơi 4% mỗi thẻ, 5 thẻ')}{hcard(0,1,300,name='JAMES')}</div>
 <div style="flex:1;min-width:0;padding-top:30px;display:flex;flex-direction:column;gap:14px">
  <div class="card"><b style="font-size:13px">Thường</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Viền kim loại màu theo concept. Số thứ tự lớn góc trái, nhãn concept góc phải, tên thành viên ở dải xé cuối thẻ.</p></div>
  <div class="card"><b style="font-size:13px">Holo</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Viền cầu vồng tự xoay. Ba lớp ánh sáng: vân kim loại, dải cầu vồng quét, các mảnh kính lóe. Hiếm hơn nên đẹp hơn rõ rệt.</p></div>
  <div class="card"><b style="font-size:13px">Cùng ảnh, khác hạng</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Mỗi member có 1 thẻ thường và 1 thẻ holo cùng ảnh. Đủ 10 thẻ là đủ bộ.</p></div>
 </div>
</div>
<div class="lab" style="margin:30px 0 12px">ĐỦ 5 THẺ MỖI LOẠI · 3 CONCEPT = 3 BẢNG MÀU</div>
<div style="display:flex;gap:12px;align-items:flex-start">
{''.join(ncard(i,1,92,name=MEM[i]) for i in range(5))}
</div>
<div style="display:flex;gap:12px;margin-top:12px">
{''.join(hcard(i,1,92,name=MEM[i],badge=False) for i in range(5))}
</div>
<div style="display:flex;gap:12px;margin-top:12px">
{''.join(ncard(i,2,92,name=MEM[i]) for i in range(3))}
{''.join(ncard(i,3,92,name=MEM[i]) for i in range(3,5))}
<div class="lk" style="width:92px;border-radius:9px"><i></i></div>
</div>
</div>
'''
open(OUT+'Frames.dc.html','w',encoding='utf-8').write(page('Khung thẻ Concept',1000,1100,body))

# ================= BANNER STATES =================
def bnr(kind):
    base='position:relative;border-radius:22px;overflow:hidden;min-height:162px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;border:2px solid rgba(255,255,255,.18)'
    if kind=='soon':
        return f'''<div style="{base};background:#0c0a24">
<div style="position:absolute;inset:-12px;background:url({PANOS[2]}) center/cover;filter:blur(7px) saturate(.5) brightness(.55);animation:drift 24s ease-in-out infinite alternate"></div>
<div style="position:absolute;inset:0;background:linear-gradient(110deg,rgba(21,18,59,.9),rgba(21,18,59,.35))"></div>
<div style="position:relative"><div class="lab" style="color:#C7C6F5">SẮP DIỄN RA · 17/10 – 26/10</div><div style="font:800 25px/1.05 'Unbounded';margin-top:6px">MÙA<br>CONCEPT</div></div>
<div style="position:relative;display:flex;gap:7px;align-items:flex-end;justify-content:space-between">
 <div style="display:flex;gap:6px">
  <div class="cd">02<small>NGÀY</small></div><div class="cd">02<small>GIỜ</small></div><div class="cd">14<small>PHÚT</small></div></div>
 <span style="font-size:11px;font-weight:800;color:#C7C6F5;text-align:right;line-height:1.35">3 concept<br>10 ngày</span>
</div></div>'''
    if kind=='live':
        return f'''<div style="{base};background:#150f33">
<div style="position:absolute;inset:-12px;background:url({PANOS[2]}) center/cover;animation:drift 20s ease-in-out infinite alternate"></div>
<div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(15,10,45,.92) 20%,rgba(15,10,45,.15))"></div>
<div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start">
 <div><div class="lab" style="color:#FFB02E">● ĐANG DIỄN RA · NGÀY 1/10</div><div style="font:800 25px/1.05 'Unbounded';margin-top:6px">MÙA<br>CONCEPT</div></div>
 <div style="display:flex;gap:5px;margin-top:3px"><i class="dot" style="background:{C1}"></i><i class="dot" style="background:#363078"></i><i class="dot" style="background:#363078"></i></div>
</div>
<div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:10px">
 <span style="font-size:12px;font-weight:700;line-height:1.35;color:#E6E5FF">Nhiệm vụ hôm nay<br><b style="color:#FFB02E;font-size:14px">Rạng Sáng</b> · xong 1 việc trước 9h</span>
 <span class="go">Làm ngay ›</span></div></div>'''
    if kind=='pack':
        return f'''<div style="{base};background:#1d0d33">
<div style="position:absolute;inset:-12px;background:url({PANOS[2]}) center/cover;filter:saturate(1.3);animation:drift 20s ease-in-out infinite alternate"></div>
<div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(40,10,60,.92) 28%,rgba(40,10,60,.1))"></div>
<div style="position:relative"><div class="lab" style="color:#FF7BB7">● PACK ĐANG CHỜ</div><div style="font:800 25px/1.05 'Unbounded';margin-top:6px">2 PACK<br>MỚI</div></div>
<div style="position:relative;display:flex;align-items:center;justify-content:space-between"><span style="font-size:12px;font-weight:700;color:#FFD0E6">Hoàn thành nhiệm vụ rồi.<br>Mỗi pack 5 thẻ.</span><span class="go" style="background:linear-gradient(100deg,#FF2E88,#FF7B57);color:#fff">Mở pack ›</span></div>
<div style="position:absolute;right:20px;top:14px;display:flex;animation:bob 2.2s ease-in-out infinite">{pack(1,50)}<div style="margin-left:-22px;margin-top:8px;transform:rotate(9deg)">{pack(1,50)}</div></div>
</div>'''
    if kind=='con':
        return f'''<div style="{base};background:#2a1a00;border-color:#FFD58A">
<div style="position:absolute;inset:-12px;background:url({PANOS[2]}) center/cover;filter:saturate(1.4) brightness(1.1);animation:drift 14s ease-in-out infinite alternate"></div>
<div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(40,22,0,.9) 24%,rgba(40,22,0,.05))"></div>
<div style="position:absolute;inset:-20%;mix-blend-mode:overlay;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%);background-size:300% 100%;animation:sweep 3.2s ease-in-out infinite"></div>
<div style="position:relative"><div class="lab" style="color:#FFD58A">★ CONCEPT 1 HOÀN TẤT</div><div style="font:800 20px/1.1 'Unbounded';margin-top:6px">URICHINGUCHANA<br>ĐÃ ĐỦ BỘ</div></div>
<div style="position:relative;display:flex;align-items:center;justify-content:space-between"><span style="font-size:12px;font-weight:700;color:#FFE9C2">Khung tròn · danh hiệu<br>· 1 pack thẻ thường</span><span class="go">Nhận quà ›</span></div></div>'''
    return f'''<div style="{base};background:#06041a;border-color:transparent">
<div style="position:absolute;inset:-3px;border-radius:24px;background:conic-gradient(from var(--r),#fff,#FF2E88,#FFE45E,#35D0A5,#4CC9FF,#8b5cff,#fff);animation:spin 5s linear infinite;z-index:0"></div>
<div style="position:absolute;inset:2px;border-radius:20px;background:url({PANOS[2]}) center/cover;z-index:0"></div>
<div style="position:absolute;inset:2px;border-radius:20px;background:linear-gradient(105deg,rgba(6,4,26,.92) 24%,rgba(6,4,26,.2));z-index:0"></div>
<div style="position:relative;z-index:1"><div class="lab" style="color:#aef">✦ HOÀN THÀNH MÙA</div><div style="font:800 24px/1.05 'Unbounded';margin-top:6px">ĐỦ CẢ 3<br>CONCEPT</div></div>
<div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between"><span style="font-size:12px;font-weight:700;color:#C7F0FF">2 thẻ Ultra Limited<br>đang chờ bạn</span><span class="go" style="background:linear-gradient(100deg,#fff,#aef,#fff);color:#06041a">Nhận Ultra ›</span></div></div>'''
extra='''
.run{position:absolute;inset:0;border-radius:22px;padding:3px;pointer-events:none;z-index:9;background:conic-gradient(from var(--r),transparent 0 55%,#FFB02E 75%,#fff 88%,transparent 100%);animation:spin 2.6s linear infinite;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
@keyframes bglow{0%,100%{box-shadow:0 0 10px rgba(255,176,46,.25)}50%{box-shadow:0 0 34px rgba(255,176,46,.7)}}
@keyframes sweep{0%{background-position:100% 0}100%{background-position:-70% 0}}

.cd{min-width:42px;padding:6px 7px;border-radius:9px;background:rgba(10,8,30,.7);border:1.5px solid rgba(255,255,255,.28);font:800 18px/1 'Unbounded';text-align:center}
.cd small{display:block;font:800 8px/1 'Be Vietnam Pro';letter-spacing:.14em;margin-top:5px;color:#C7C6F5}
.dot{display:block;width:10px;height:10px;border-radius:50%}
.go{padding:10px 16px;border-radius:99px;font-size:13px;font-weight:900;color:#2A1400;background:linear-gradient(100deg,#FFB02E,#FF6B57);white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.4)}
@keyframes drift{from{transform:translateX(-30px)}to{transform:translateX(30px)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
'''
rows=''.join(f'<div style="margin-bottom:14px"><div class="lab" style="margin:0 2px 7px">{t}</div><div style="position:relative;animation:bglow 2.4s ease-in-out infinite;border-radius:22px">{bnr(k)}<span class="run"></span></div></div>' for k,t in [('soon','1 · TRƯỚC NGÀY BẮT ĐẦU'),('live','2 · ĐANG DIỄN RA, CHƯA LÀM NHIỆM VỤ'),('pack','3 · XONG NHIỆM VỤ, CÓ PACK'),('con','4 · GOM ĐỦ 1 CONCEPT'),('all','5 · GOM ĐỦ CẢ 3 CONCEPT')])
body=f'<div style="padding:22px 14px"><div class="lab" style="color:#FFB02E">BANNER · 5 TRẠNG THÁI</div><h1 style="margin:3px 0 14px;font-size:21px;font-weight:900">Banner tự đổi theo tiến độ</h1>{rows}</div>'
open(OUT+'BannerStates.dc.html','w',encoding='utf-8').write(page('Banner sự kiện',390,1260,body,extra))
print('ok')
