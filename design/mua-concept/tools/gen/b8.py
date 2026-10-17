from shared import *
OUT2='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
W=1560
css=EX3+EX4+'''
.sp{padding:34px 40px;width:%dpx}
.sp h1{margin:4px 0 6px;font-size:34px;font-weight:900;letter-spacing:-.8px}
.sp h2{margin:0;font-size:22px;font-weight:900;letter-spacing:-.4px}
.sp .sub{font-size:13px;font-weight:600;color:#A7A9E6;line-height:1.6;max-width:760px}
.blk{margin-top:36px;padding:26px 28px;border-radius:26px;background:#1b1747;border:2px solid #363078}
.row{display:flex;gap:18px;align-items:flex-start}
.pn{border-radius:14px;overflow:hidden;border:2px solid #363078}.pn img{display:block;width:100%%}
.cap{font-size:11px;font-weight:800;letter-spacing:.14em;color:#A7A9E6;margin:0 0 10px}
.chipx{display:inline-block;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:800;letter-spacing:.08em;color:#1a0b00}
''' % W
SCHED=[('17–19/10','Concept 1','Urichinguchana',1),('20–22/10','Concept 2','Aniyaaa',2),('23–25/10','Concept 3','Poyoyoi',3)]
def conc(c):
    n,a,b=CON[c]
    nr=''.join(ncard(i,c,132,sm=True,tag=False) for i in range(5))
    hr=''.join(hcard(i,c,132,sm=True) for i in range(5))
    d=SCHED[c-1]
    return f'''<div class="blk" style="border-color:{a}66">
<div style="display:flex;align-items:center;gap:16px;margin-bottom:18px"><span style="width:16px;height:16px;border-radius:50%%;background:{a};box-shadow:0 0 14px {a}"></span><h2>{d[1]} · {n}</h2><span class="chipx" style="background:{a}">{d[0]}</span><span style="margin-left:auto;font-size:12px;font-weight:700;color:#A7A9E6">5 thẻ thường (16%% mỗi thẻ) · 5 thẻ holo (4%% mỗi thẻ) · 1 panorama</span></div>
<div class="row"><div><p class="cap">THƯỜNG</p><div class="row" style="gap:14px">{nr}</div></div></div>
<div class="row" style="margin-top:20px"><div><p class="cap">HOLO</p><div class="row" style="gap:14px">{hr}</div></div></div>
<div class="row" style="margin-top:22px;align-items:center;gap:30px">
 <div style="flex:1;min-width:0"><p class="cap">PANORAMA · TỈ LỆ GỐC</p><div class="pn" style="border-color:{a}"><img src="{PANOS[c]}" alt="Panorama {n}"></div></div>
 <div style="text-align:center;width:150px">{fr(c,c+1 if c<4 else 0,110)}<div style="margin-top:34px">{ttl(c)}</div><p class="cap" style="margin:10px 0 0">KHUNG TRÒN + DANH HIỆU</p></div>
 <div style="width:150px">{pack(c,150)}<p class="cap" style="margin:12px 0 0;text-align:center">PACK 5 THẺ</p></div>
</div></div>'''
body=f'''<div class="sp">
<div class="lab" style="color:#FFB02E">MÙA CONCEPT · BẢNG MẪU ĐẦY ĐỦ</div>
<h1>Toàn bộ thiết kế sự kiện</h1>
<p class="sub">3 concept × (5 thẻ thường + 5 thẻ holo + 1 panorama), kèm pack, khung tròn, danh hiệu và 2 thẻ Ultra Limited. Mặt sau thẻ và các màn hình nằm ở các board khác; bản chơi thử có bảng điều khiển nằm ngay bên phải.</p>
{conc(1)}{conc(2)}{conc(3)}
<div class="blk" style="border-color:#FFE45E88">
<div style="display:flex;align-items:center;gap:16px;margin-bottom:18px"><h2>Ultra Limited · phần thưởng gom đủ 3 concept</h2><span class="chipx" style="background:linear-gradient(100deg,#FFE45E,#FF2E88)">CHỈ 2 THẺ</span></div>
<div class="row" style="gap:40px;align-items:center">
 {ultra(0,260,1,'JAMES')}{ultra(4,260,2,'SEONGHYEON')}
 <div style="flex:1;min-width:0;max-width:520px"><p class="cap" style="color:#FFE9A8">MỘT MẶT · CHẠM THẺ ĐỂ NGHE NHẠC</p><p class="sub" style="margin:0">Mặt thẻ là video 28 giây lặp, chỉ chạy khi thẻ đang hiện. Chạm vào thẻ: hai đĩa than trượt ra hai bên, mỗi đĩa là một bài đã chọn khi nhận thẻ (chọn 2 trong 7 bài, khóa vĩnh viễn). Chạm đĩa để nghe cả bài, thẻ vẫn mở, đóng thẻ thì nhạc dừng.</p>
 <div class="row" style="margin-top:16px;gap:8px;flex-wrap:wrap">{''.join(f'<span class="chipx" style="background:{c}">{t}</span>' for t,c in [('GO!','#ffb02e'),('What You Want','#35d0a5'),('FaSHioN','#ff2e88'),('JoyRide','#4cc9ff'),('REDRED','#ff2e4e'),('ACAI','#8b5cff'),('Blue Lips','#4cc9ff')])}</div></div>
</div></div>
<div class="blk" style="border-color:#8b5cff88">
<h2 style="margin-bottom:6px">Mặt sau thẻ</h2><p class="sub" style="margin:0 0 18px">Thẻ thường là hồ sơ giấy có tem "ĐÃ GOM" và vị trí mảnh trong panorama. Thẻ holo là ống kính máy ảnh zoom đúng vào member trong panorama. Thẻ Ultra không có mặt sau.</p>
<div class="row" style="gap:22px">{back_n(0,1,200)}{back_n(2,2,200)}{back_n(4,3,200)}{back_h(1,1,200)}{back_h(3,2,200)}{back_h(0,3,200)}</div></div>
</div>'''
h=3 # placeholder
open(OUT2+'Specimen.dc.html','w',encoding='utf-8').write(page('Bảng mẫu Mùa Concept',W,3900,body,css))
print('ok')
