from lib import *
from b3 import ultra, extra as EX3
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
css=r'''
.ms{position:relative;width:560px;height:520px;cursor:pointer;user-select:none}
.msc{position:absolute;left:0;top:30px;width:300px;z-index:2}
.msc .tlw{position:relative}
.ms.on .tlw{animation:beat .52s ease-in-out infinite}
@keyframes beat{0%,100%{transform:scale(1)}12%{transform:scale(1.035)}40%{transform:scale(1)}}
.vin{position:absolute;left:44px;top:120px;width:250px;height:250px;border-radius:50%;z-index:1;background:radial-gradient(circle,#000 0 3%,transparent 3.5%),repeating-radial-gradient(circle,#0b0b0b 0 1.2px,#1d1d22 1.2px 3.2px);box-shadow:0 10px 34px rgba(0,0,0,.6);transition:left .9s cubic-bezier(.2,.9,.2,1)}
.ms.on .vin{left:290px;animation:vspin 2.4s linear infinite;transition:left .9s cubic-bezier(.2,.9,.2,1)}
@keyframes vspin{to{transform:rotate(360deg)}}
.vin:before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,transparent,rgba(255,255,255,.2),transparent 20%,transparent 50%,rgba(255,255,255,.2),transparent 70%)}
.vin .lb{position:absolute;inset:32%;border-radius:50%;background:url(__M0__) center/cover;border:3px solid #FFB02E;box-shadow:0 0 18px rgba(255,176,46,.8)}
.vin .lb:after{content:"";position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px;border-radius:50%;background:#0b0b0b;border:2px solid #FFE9A8}
.eq{position:absolute;left:5%;right:5%;bottom:20%;height:15%;z-index:30;display:flex;align-items:flex-end;gap:2.4%;opacity:0;transition:opacity .4s;pointer-events:none}
.ms.on .eq{opacity:1}
.eq i{flex:1;border-radius:99px 99px 0 0;background:linear-gradient(0deg,#FFB02E,#fff);box-shadow:0 0 8px #FFB02E;height:20%;animation:eqb .5s ease-in-out infinite alternate}
@keyframes eqb{from{height:14%}to{height:100%}}
.shk{position:absolute;left:50%;top:50%;width:300px;height:400px;margin:-170px 0 0 -150px;border-radius:30px;border:3px solid #FFE45E;z-index:0;opacity:0;pointer-events:none}
.ms.on .shk{animation:shock 1.04s ease-out infinite}
@keyframes shock{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.55);opacity:0}}
.hint{position:absolute;left:50%;top:-6px;transform:translateX(-50%);z-index:40;padding:8px 16px;border-radius:99px;background:rgba(10,8,30,.82);border:2px solid #FFB02E;font:800 12px 'Be Vietnam Pro';letter-spacing:.12em;color:#FFE9A8;white-space:nowrap;box-shadow:0 0 18px rgba(255,176,46,.6);animation:hp 1.6s ease-in-out infinite}
@keyframes hp{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.07)}}
.nt{position:absolute;z-index:3;font-size:26px;color:#FFE45E;text-shadow:0 0 12px #FFB02E;opacity:0}
.ms.on .nt{animation:nrise 3s ease-out infinite}
@keyframes nrise{0%{transform:translateY(0) rotate(0);opacity:0}15%{opacity:1}100%{transform:translateY(-190px) rotate(24deg);opacity:0}}
.pg{position:absolute;left:0;top:468px;width:300px;transition:opacity .4s;opacity:.0}
.ms.on .pg{opacity:1}
.pg b{display:block;font:800 14px 'Unbounded';color:#fff}
.pg small{display:block;font:700 11px 'Be Vietnam Pro';color:#A7A9E6;margin-top:3px}
.pg span{display:block;height:5px;border-radius:99px;background:#363078;margin-top:9px;overflow:hidden}
.pg span i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#FFB02E,#fff);transform-origin:left;animation:prog 30s linear infinite;box-shadow:0 0 8px #FFB02E}
@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.ms.on .bu-p,.ms.on .uc-bg{animation-duration:1.04s}
'''.replace('__M0__',M[0])
eq=''.join(f'<i style="animation-delay:{(k*0.13)%0.5:.2f}s;animation-duration:{0.35+(k*37%25)/100:.2f}s"></i>' for k in range(24))
notes=''.join(f'<span class="nt" style="left:{x}px;top:{y}px;animation-delay:{d}s">{s}</span>' for x,y,d,s in [(330,260,0,'♪'),(420,300,.8,'♫'),(380,230,1.6,'♪'),(470,280,2.2,'♬'),(350,330,.4,'♫')])
body=f'''<div style="padding:30px 36px">
<div class="lab" style="color:#FFE45E">ULTRA LIMITED · NGHE NHẠC</div>
<h1 style="margin:4px 0 4px;font-size:28px;font-weight:900;letter-spacing:-.6px">Chạm thẻ để bật nhạc</h1>
<p style="margin:0;font-size:13px;font-weight:600;color:#A7A9E6;max-width:700px;line-height:1.55">Chạm vào thẻ ở dưới để thử. Thẻ đập theo nhịp, sóng sáng nổ ra, đĩa than trượt khỏi sau thẻ và quay, thanh equalizer nhảy, nốt nhạc bay lên.</p>
<div style="display:flex;gap:40px;margin-top:26px">
<div onClick="{{{{toggle}}}}" class="ms {{{{cls}}}}">
 <div class="vin"><div class="lb"></div></div>
 {notes}
 <div class="msc"><span class="shk"></span><div class="hint">{{{{lbl}}}}</div><div class="tlw">{ultra(0,300,1,'MEMBER 1')}<div class="eq">{eq}</div></div></div>
 <div class="pg"><b>[Tên bài hát]</b><small>CORTIS · đoạn nghe thử 30 giây</small><span><i></i></span></div>
</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:12px;padding-top:34px">
 <div class="card"><b style="font-size:13px">Chỉ dành cho Ultra</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Thẻ thường và Holo không có nhạc. Có nhạc là dấu hiệu nhận ra Ultra ngay khi cầm, và lý do để mở thẻ ra khoe với bạn bè.</p></div>
 <div class="card"><b style="font-size:13px">Mỗi thẻ một bài</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Thẻ 1/2 và 2/2 phát hai đoạn nhạc khác nhau, cũng là lý do để gom đủ cả hai.</p></div>
 <div class="card"><b style="font-size:13px">Cách chạy trong app</b><p style="margin:5px 0 0;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Chỉ phát khi người chơi chạm, nên trình duyệt điện thoại cho phép. Chạm lần nữa để dừng, thoát màn hình thì tự tắt. Có nút tắt tiếng và hiệu ứng vẫn chạy ở chế độ im lặng.</p></div>
</div></div></div>'''
html=page('Ultra nghe nhạc',1160,680,body,EX3+css)
html=html.replace("class Component extends DCLogic {\n  renderVals() { return {}; }\n}","class Component extends DCLogic {\n  renderVals() {\n    var self = this; var on = !!(this.state && this.state.on);\n    return { cls: on ? 'on' : '', lbl: on ? '♪ ĐANG PHÁT · CHẠM ĐỂ DỪNG' : '♪ CHẠM ĐỂ NGHE', toggle: function () { self.setState({ on: !on }); } };\n  }\n}")
open(OUT+'UltraMusic.dc.html','w',encoding='utf-8').write(html)
print('toggle' in html and 'self.setState' in html)
