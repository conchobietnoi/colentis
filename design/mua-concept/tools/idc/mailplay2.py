import sys,os,json
sys.path[:0]=['.','../idc']
import mailmock as M
os.chdir('/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/idc')
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/MailPlay.dc.html'
C=json.load(open('cardhtml2.json'))
ic=M.ic
KEYS=['jm','jh','mt','sh','kh']
W,Hh=470,940
def top(t,back=''):
    return f'<div class="ptop"><button class="ibtn" aria-label="Quay lại" {('onClick="{{'+back+'}}"') if back else ''}>{ic("left")}</button><h1>{t}</h1></div>'
intro=M.letter_top.split('<div class="pbody">',1)[1].rsplit('</div></div></div>',1)[0]
cards=''.join(f'<sc-if value="{{{{c{i}}}}}" hint-placeholder-val="false"><div class="mqprev">{C[k]}</div></sc-if>' for i,k in enumerate(KEYS))
gifts=f'''<div class="mqs">QUÀ ĐÍNH KÈM · {{{{giftN}}}}</div>
<sc-if value="{{{{noId}}}}" hint-placeholder-val="true"><div class="mqg"><div class="mqgc">{C['blank']}</div>
 <div class="mqgt"><small>THẺ ĐẶC BIỆT</small><b>Thẻ ID Colentis</b><span>Thẻ trống. Chọn một thành viên CORTIS để gán, thêm ảnh và tên của bạn, rồi nhận khung tròn và danh hiệu riêng.</span></div>
 <button class="igo" style="margin-top:12px" onClick="{{{{openSheet}}}}">{ic("gift")} Nhận thẻ ID</button></div></sc-if>
<sc-if value="{{{{hasId}}}}" hint-placeholder-val="false"><div class="mqg mqg2 done"><span class="mqpk" style="background:{{{{lockC}}}};color:#fff">{ic("check")}</span><div class="mqgt" style="flex:1"><small>ĐÃ NHẬN · TRONG BỘ SƯU TẬP</small><b>Thẻ ID · {{{{lockN}}}}</b><span>Thêm ảnh và tên chủ thẻ ở mục Hồ sơ.</span></div></div></sc-if>
<sc-if value="{{{{noPack}}}}" hint-placeholder-val="true"><div class="mqg mqg2"><span class="mqpk">{ic("gift")}</span><div class="mqgt" style="flex:1"><small>PACK KHAI MẠC</small><b>1 pack Urichinguchana</b><span>Mở được từ 18/10 ở tab Hôm nay.</span></div><button class="mqmini" onClick="{{{{claimPack}}}}">Nhận</button></div></sc-if>
<sc-if value="{{{{hasPack}}}}" hint-placeholder-val="false"><div class="mqg mqg2 done"><span class="mqpk" style="background:#FFB02E;color:#fff">{ic("check")}</span><div class="mqgt" style="flex:1"><small>ĐÃ NHẬN</small><b>1 pack Urichinguchana</b><span>Đã vào kho, mở từ 18/10.</span></div></div></sc-if>
<p class="mqp" style="margin-top:16px">Chúc bạn một mùa gom thẻ thật vui.<br><b>— Colentis</b></p>
<sc-if value="{{{{showAll}}}}" hint-placeholder-val="true"><button class="igo" style="background:linear-gradient(100deg,#FFB02E,#FF2E88)" onClick="{{{{claimAll}}}}">Nhận tất cả quà</button></sc-if>'''
rows='''<sc-for list="{{rows}}" as="r" hint-placeholder-count="5"><button class="wr {{r.cls}}" data-i="{{r.i}}" onClick="{{pickM}}"><span class="wav" style="--a:{{r.c}}">{{r.ini}}</span><span class="wnm"><b>{{r.n}}</b><small>{{r.sub}}</small></span><span class="wck">{{r.ck}}</span></button></sc-for>'''

import math
BURST=''.join(f'<i style="--a:{int(i*360/16)}deg;--d:{110+(i%3)*30}px;background:{["#FFE45E","#FF4FA3","#4CC9FF","#fff"][i%4]};animation-delay:{(i%4)*.05}s"></i>' for i in range(16))
SP=''.join(f'<i style="left:{x}%;top:{y}%;animation-delay:{d}s"></i>' for x,y,d in [(8,12,0),(86,8,.6),(18,48,1.2),(92,40,.3),(70,70,.9),(30,82,1.5),(52,6,.4),(6,76,1.1)])
def slots(i):
    return ''.join(f'<i style="background-image:url({M.b10.PANOS[i]});background-size:500% 100%;background-position:{p}% 0"></i>' for p in (0,25,50,75,100))
CON=[('01','Urichinguchana','18 – 20/10','#FFB02E',1),('02','Aniyaaa','21 – 23/10','#FF2E88',2),('03','Poyoyoi','24 – 26/10','#4CC9FF',3)]
cons=''.join(f"""<div class="mpcn" style="--c:{c}"><div class="mpcnh"><b>{n}</b><span><strong>{nm}</strong><small>{d} · 3 ngày</small></span></div><div class="mpsl">{slots(i)}</div></div>""" for n,nm,d,c,i in CON)
POSTER=f"""
<div class="mph"><div class="mpphs"><i style="background-image:url({M.b10.PANOS[1]})"></i><i style="background-image:url({M.b10.PANOS[2]})"></i><i style="background-image:url({M.b10.PANOS[3]})"></i></div><div class="mpsp">{SP}</div>
<div class="mphx"><small>COLENTIS PRESENTS</small><b>MÙA<br>CONCEPT</b><em>18 — 26 . 10</em></div>
<div class="mptk"><div class="mptki"><span>URICHINGUCHANA ✦ ANIYAAA ✦ POYOYOI ✦ </span><span>URICHINGUCHANA ✦ ANIYAAA ✦ POYOYOI ✦ </span></div></div></div>
<div class="mpst"><div><b>9</b><small>ngày</small></div><div><b>3</b><small>concept</small></div><div><b>18</b><small>pack</small></div><div><b>2</b><small>thẻ Ultra</small></div></div>
<div class="mpsec"><small class="mpk">MỖI NGÀY</small><h2>Làm nhiệm vụ, mở <em>2 pack</em></h2><p class="mpd">Mỗi pack 5 thẻ. Thẻ nào của bạn thì bạn tự rút, thẻ trùng đem tặng, thẻ thiếu thì xin.</p></div>
<div class="mpsec"><small class="mpk">BA CHẶNG · MỖI CHẶNG 5 THẺ</small><h2>Gom đủ 5 thẻ, <em>mở nguyên tấm</em></h2>
"""+cons+"""
<div class="mprw"><span><i>◈</i>Panorama</span><span><i>◉</i>Khung tròn</span><span><i>✦</i>Danh hiệu</span><span><i>▣</i>Pack thẻ app</span></div>
<p class="mpd">Mỗi concept hoàn thành đều mở đủ bốn phần thưởng này.</p></div>
<div class="mpul"><div class="mpuS"></div><small class="mpk" style="color:#FFE45E">BÍ MẬT CUỐI MÙA</small><h2 style="color:#fff">Hai thẻ <em>Ultra Limited</em></h2>
<div class="mpuc"><div class="mpu a"><div class="mpuf"></div><span class="mpq">?</span><small>ULTRA · 01</small><i class="mpsw"></i></div><div class="mpu b"><div class="mpuf"></div><span class="mpq">?</span><small>ULTRA · 02</small><i class="mpsw"></i></div></div>
<p class="mpd" style="color:#d9d6ff;text-align:center">Chỉ người gom đủ cả 3 concept mới thấy mặt thẻ. Bảy bài hát, mỗi thẻ một bài, bạn tự chọn.</p>
<div class="mplk">KHÓA · MỞ KHI ĐỦ 3 CONCEPT</div></div>
<div class="mpsec"><small class="mpk">QUÀ KHAI MẠC · TẶNG RIÊNG BẠN</small><h2>Hai món quà <em>đang chờ</em></h2>
<sc-if value="{{noId}}" hint-placeholder-val="true"><button class="mpgf" onClick="{{giftId}}"><span class="mpgb"><i></i></span><span class="mpgt"><small>THẺ ĐẶC BIỆT</small><b>Thẻ ID Colentis</b><em>Chạm để mở quà</em></span></button></sc-if>
<sc-if value="{{hasId}}" hint-placeholder-val="false"><div class="mpgf done"><span class="mpgb ok" style="background:{{lockC}}">✓</span><span class="mpgt"><small>ĐÃ NHẬN</small><b>Thẻ ID · {{lockN}}</b><em>Thêm ảnh và tên ở mục Hồ sơ</em></span></div></sc-if>
<sc-if value="{{noPack}}" hint-placeholder-val="true"><button class="mpgf" onClick="{{claimPack}}"><span class="mpgb pk"><i></i></span><span class="mpgt"><small>PACK KHAI MẠC</small><b>1 pack Urichinguchana</b><em>Chạm để mở quà</em></span></button></sc-if>
<sc-if value="{{hasPack}}" hint-placeholder-val="false"><div class="mpgf done"><span class="mpgb ok" style="background:#FFB02E">✓</span><span class="mpgt"><small>ĐÃ NHẬN</small><b>1 pack Urichinguchana</b><em>Mở được từ 18/10</em></span></div></sc-if>
<p class="mpsg">— Colentis</p></div><div style="height:90px"></div>
"""
tpl=f'''{M.b10.SPRITE}<div class="rapp" style="width:{W}px;height:{Hh}px;padding:30px 40px;display:flex;flex-direction:column;align-items:center;gap:18px;background:#cfd3f8;background-image:radial-gradient(500px 400px at 15% 0,#d9d4ff,transparent),radial-gradient(500px 500px at 100% 100%,#ffd1ea,transparent)">
<div class="phone" style="width:390px;max-width:390px;height:844px;flex:none;border-radius:32px;box-shadow:0 0 0 8px #14123F,0 30px 60px rgba(20,18,63,.4);position:relative"><div class="sbsp"></div>
<sc-if value="{{{{isList}}}}" hint-placeholder-val="true"><div class="page on">{top("Hòm thư")}<div class="pbody"><div class="mbxl" style="margin:0 16px 0 -14px;width:auto">
<button class="card-b mbxi {{{{newCls}}}}" onClick="{{{{openLetter}}}}"><span class="mbxt" style="background:#FFB02E">SỰ KIỆN MỚI</span><b>Mùa Concept mở từ 18/10</b><span class="mbxs">Gom thẻ, ghép panorama, nhận thẻ Ultra Limited. Kèm quà thẻ ID Colentis.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc {{{{badgeCls}}}}">{{{{badge}}}}</i></span></button>
<button class="card-b mbxi"><span class="mbxt" style="background:#B79CFF">SẮP TỚI</span><b>Sự kiện bí mật · 01/11</b><span class="mbxs">Chỉ biết nó liên quan đến Lịch.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc">Đã đọc</i></span></button>
</div><p class="mqhint">Bấm vào thư đầu tiên để mở</p></div></div></sc-if>
<sc-if value="{{{{isLetter}}}}" hint-placeholder-val="false"><div class="page on">{top("Thư","back")}<div class="pbody" id="mpscroll">{POSTER}</div>
<sc-if value="{{{{showAll}}}}" hint-placeholder-val="true"><button class="mpfab" onClick="{{{{claimAll}}}}">{ic("gift")} Nhận quà · {{{{leftN}}}}</button></sc-if></div></sc-if>
<sc-if value="{{{{sheet}}}}" hint-placeholder-val="false"><div class="bd on" onClick="{{{{closeSheet}}}}"></div><div class="sheet on" style="visibility:visible;transform:none;max-height:94%">
<h3 style="font-size:19px;margin:6px 0 4px">{{{{shTitle}}}}</h3><p class="sub" style="margin:0 0 10px">{{{{shSub}}}}</p>
<sc-if value="{{{{anyC}}}}" hint-placeholder-val="false"><div style="position:relative"><sc-if value="{{{{hasId}}}}" hint-placeholder-val="false"><div class="mpbs mpbs2">{BURST}</div></sc-if>{cards}</div></sc-if>
<sc-if value="{{{{noC}}}}" hint-placeholder-val="true"><div class="mqprev">{C['blank']}</div></sc-if>
<sc-if value="{{{{picking}}}}" hint-placeholder-val="true"><div class="whol" style="margin-top:12px">{rows}</div></sc-if>
<button class="igo {{{{okCls}}}}" onClick="{{{{confirm}}}}">{{{{okTxt}}}}</button></div></sc-if>
<sc-if value="{{{{rv}}}}" hint-placeholder-val="false"><div class="mprv"><div class="mprays"></div>
<sc-if value="{{{{rv1}}}}" hint-placeholder-val="false"><div class="mpbox"><i class="mpbl"></i><i class="mpbb"></i><i class="mprb"></i><i class="mprb2"></i></div><p class="mprt">Đang mở quà…</p></sc-if>
<sc-if value="{{{{rv2}}}}" hint-placeholder-val="false"><div class="mpbs">{BURST}</div>
<sc-if value="{{{{rvId}}}}" hint-placeholder-val="false"><div class="mprvc mpin"><div class="mpglow"></div>{C['blank']}</div><small class="mprk">QUÀ KHAI MẠC · THẺ ĐẶC BIỆT</small><b class="mprh">Thẻ ID Colentis</b><p class="mprt">Thẻ trống của riêng bạn. Chọn một thành viên CORTIS để gán, rồi thêm ảnh và tên.</p><button class="mpgo" onClick="{{{{toSheet}}}}">Chọn thành viên</button></sc-if>
<sc-if value="{{{{rvPack}}}}" hint-placeholder-val="false"><div class="mppack mpin"><div class="mpglow"></div><span>URICHINGUCHANA</span><b>PACK</b><em>5 thẻ</em><i class="mpshine"></i></div><small class="mprk">QUÀ KHAI MẠC</small><b class="mprh">1 pack Urichinguchana</b><p class="mprt">Mở được từ 18/10 ở tab Hôm nay.</p><button class="mpgo" onClick="{{{{takePack}}}}">Thu vào kho</button></sc-if></sc-if></div></sc-if>
<sc-if value="{{{{toast}}}}" hint-placeholder-val="false"><div class="mqtoast">{{{{toast}}}}</div></sc-if>
</div>
<button class="mqreset" onClick="{{{{reset}}}}">Chơi lại từ đầu</button></div>'''
# intro: hero + mqb open (content), need to close mqb after gifts
tpl=tpl.replace(intro.split('</div></div>',0)[0]+gifts, intro+gifts)
EXTRA='''
.rapp .mph{position:relative;height:430px;margin-top:-4px;background:#14123F;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end}
.rapp .mpphs{position:absolute;inset:0;display:flex;gap:6px;padding:0 10px;transform:skewY(-6deg) scale(1.2);transform-origin:center}
.rapp .mpphs i{flex:1;background-size:cover;background-position:center;background-color:#4b3f9c;opacity:.85;animation:mppan 8s ease-in-out infinite alternate}
.rapp .mpphs i:nth-child(2){animation-delay:-3s;background-color:#a0306b}.rapp .mpphs i:nth-child(3){animation-delay:-5s;background-color:#2c7fa3}.rapp .mpphs i:first-child{background-color:#b9771f}
@keyframes mppan{from{background-position:30% 50%}to{background-position:70% 50%}}
.rapp .mph:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,18,63,.1),rgba(20,18,63,.2) 35%,#14123F 94%)}
.rapp .mpsp{position:absolute;inset:0;z-index:2;pointer-events:none}
.rapp .mpsp i,.rapp .mpul i.sp{position:absolute;width:10px;height:10px;background:#fff;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:mptw 2.4s ease-in-out infinite}
@keyframes mptw{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1.5) rotate(90deg)}}
.rapp .mphx{position:relative;z-index:3;padding:0 22px 52px;color:#fff}
.rapp .mphx small{font:800 10px 'Be Vietnam Pro';letter-spacing:.3em;color:#FFE45E}
.rapp .mphx b{display:block;margin-top:8px;font:800 58px/.92 'Unbounded',sans-serif;letter-spacing:-.02em;background:linear-gradient(100deg,#fff 30%,#FFE45E 55%,#FF8CC6 80%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 18px rgba(255,46,136,.5))}
.rapp .mphx em{display:block;margin-top:12px;font:800 19px 'Unbounded',sans-serif;font-style:normal;letter-spacing:.12em;color:#fff}
.rapp .mptk{position:absolute;z-index:3;left:0;right:0;bottom:0;height:32px;background:linear-gradient(90deg,#FFB02E,#FF2E88,#4CC9FF);overflow:hidden;display:flex;align-items:center}
.rapp .mptki{display:flex;white-space:nowrap;animation:mptk 16s linear infinite;font:800 12px 'Unbounded',sans-serif;letter-spacing:.12em;color:#14123F}
@keyframes mptk{to{transform:translateX(-50%)}}
.rapp .mpst{display:grid;grid-template-columns:repeat(4,1fr);background:#14123F;color:#fff;padding:14px 8px 18px;text-align:center}
.rapp .mpst b{display:block;font:800 24px 'Unbounded',sans-serif;color:#FFE45E}.rapp .mpst small{font:700 10.5px 'Be Vietnam Pro';opacity:.8}
.rapp .mpsec{padding:26px 18px 6px}
.rapp .mpk{display:block;font:800 10.5px 'Be Vietnam Pro';letter-spacing:.2em;color:#ff2e88}
.rapp .mpsec h2,.rapp .mpul h2{margin:6px 0 0;font:800 24px/1.15 'Unbounded',sans-serif;color:var(--ink);text-wrap:balance}
.rapp .mpsec h2 em,.rapp .mpul h2 em{font-style:normal;background:linear-gradient(100deg,#FF2E88,#FFB02E);-webkit-background-clip:text;background-clip:text;color:transparent}
.rapp .mpd{margin:10px 0 0;font:600 13.5px/1.6 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpcn{margin-top:14px;border-radius:20px;padding:14px;background:var(--paper);border:1.5px solid var(--line);border-left:6px solid var(--c);box-shadow:0 8px 20px rgba(30,27,94,.08)}
.rapp .mpcnh{display:flex;align-items:center;gap:12px}.rapp .mpcnh>b{font:800 30px 'Unbounded',sans-serif;color:var(--c)}
.rapp .mpcnh strong{display:block;font:800 16px 'Be Vietnam Pro'}.rapp .mpcnh small{font:700 12px 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpsl{display:flex;gap:5px;margin-top:12px}.rapp .mpsl i{flex:1;aspect-ratio:3/4;border-radius:8px;background-color:var(--c);background-repeat:no-repeat;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7)}
.rapp .mprw{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
.rapp .mprw span{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:14px;background:linear-gradient(120deg,rgba(255,228,94,.35),rgba(255,46,136,.16));font:800 12.5px 'Be Vietnam Pro'}
.rapp .mprw i{font-style:normal;font-size:16px;color:#ff2e88}
.rapp .mpul{position:relative;margin-top:26px;padding:34px 18px 30px;background:radial-gradient(420px 300px at 50% 35%,#3a2a8c,#14123F 70%);overflow:hidden;color:#fff}
.rapp .mpul .mpk{text-align:center}.rapp .mpul h2{text-align:center}
.rapp .mpuS{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 42%,rgba(255,228,94,.09) 0 6deg,transparent 6deg 18deg);animation:mpspin 40s linear infinite}
@keyframes mpspin{to{transform:rotate(360deg)}}
.rapp .mpuc{position:relative;display:flex;justify-content:center;gap:18px;margin:26px 0 22px;perspective:700px}
.rapp .mpu{position:relative;width:132px;height:196px;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#1b1650,#0b0a24);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:mpfl 4s ease-in-out infinite}
.rapp .mpu.a{transform:rotate(-7deg)}.rapp .mpu.b{transform:rotate(7deg);animation-delay:-2s}
@keyframes mpfl{50%{translate:0 -10px}}
.rapp .mpuf{position:absolute;inset:0;border-radius:16px;padding:2.5px;background:conic-gradient(from var(--mpr,0deg),#FFE45E,#FF4FA3,#4CC9FF,#8B5CFF,#FFE45E);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:mprot 3s linear infinite}
@property --mpr{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes mprot{to{--mpr:360deg}}
.rapp .mpq{font:800 64px 'Unbounded',sans-serif;background:linear-gradient(160deg,#FFE45E,#FF4FA3,#4CC9FF);-webkit-background-clip:text;background-clip:text;color:transparent;filter:blur(1.5px) drop-shadow(0 0 14px rgba(255,228,94,.7));animation:mppu 2.4s ease-in-out infinite}
@keyframes mppu{50%{transform:scale(1.12);opacity:.75}}
.rapp .mpu small{position:absolute;bottom:12px;font:800 9.5px 'Be Vietnam Pro';letter-spacing:.22em;color:#FFE45E}
.rapp .mpsw{position:absolute;top:-30%;bottom:-30%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);animation:mpsw 3.2s ease-in-out infinite}
.rapp .mpu.b .mpsw{animation-delay:-1.6s}
@keyframes mpsw{0%{left:-60%}60%,100%{left:130%}}
.rapp .mplk{position:relative;width:max-content;margin:18px auto 0;padding:9px 16px;border-radius:99px;border:1.5px solid rgba(255,228,94,.6);font:800 10.5px 'Be Vietnam Pro';letter-spacing:.16em;color:#FFE45E}
.rapp .mpgf{display:flex;align-items:center;gap:14px;width:100%;margin-top:14px;padding:14px;border-radius:20px;border:0;text-align:left;font-family:inherit;color:var(--ink);background:linear-gradient(120deg,#fff,#fff0f8);box-shadow:0 0 0 2px #ff2e88,0 10px 26px rgba(255,46,136,.28);animation:mpgl 2s ease-in-out infinite;cursor:pointer}
.rapp .mpgf.done{animation:none;box-shadow:0 0 0 2px rgba(53,208,165,.6);background:rgba(53,208,165,.12);cursor:default}
@keyframes mpgl{50%{box-shadow:0 0 0 2px #FFB02E,0 10px 34px rgba(255,176,46,.5)}}
.rapp .mpgb{flex:none;position:relative;width:58px;height:58px;border-radius:16px;background:linear-gradient(150deg,#FF4FA3,#FF2E88);display:grid;place-items:center;color:#fff;font:900 24px 'Be Vietnam Pro'}
.rapp .mpgb.pk{background:linear-gradient(150deg,#FFE45E,#FFB02E)}
.rapp .mpgb i{position:absolute;left:50%;top:0;bottom:0;width:10px;margin-left:-5px;background:rgba(255,255,255,.8)}.rapp .mpgb:before{content:"";position:absolute;left:0;right:0;top:50%;height:10px;margin-top:-5px;background:rgba(255,255,255,.8)}
.rapp .mpgb.ok i,.rapp .mpgb.ok:before{display:none}
.rapp .mpgt small{display:block;font:800 10px 'Be Vietnam Pro';letter-spacing:.16em;color:#ff2e88}.rapp .mpgt b{display:block;margin-top:2px;font:800 16px 'Be Vietnam Pro'}.rapp .mpgt em{display:block;margin-top:3px;font:700 12px 'Be Vietnam Pro';font-style:normal;color:var(--soft)}
.rapp .mpsg{margin:20px 0 0;text-align:center;font:800 14px 'Be Vietnam Pro'}
.rapp .mpfab{position:absolute;z-index:20;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);translate:-50% 0;display:flex;align-items:center;gap:8px;border:0;border-radius:99px;padding:15px 26px;font:800 15px 'Be Vietnam Pro';color:#fff;background:linear-gradient(100deg,#FFB02E,#FF2E88);box-shadow:0 10px 28px rgba(255,46,136,.55);animation:mpfb 1.6s ease-in-out infinite;cursor:pointer}
@keyframes mpfb{50%{scale:1.06}}
.rapp .mprv{position:absolute;inset:0;z-index:60;background:radial-gradient(500px 500px at 50% 40%,#3a2a8c,#0b0a24 75%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;padding:0 28px;overflow:hidden;animation:mpfi .3s ease-out}
@keyframes mpfi{from{opacity:0}}
.rapp .mprays{position:absolute;left:50%;top:40%;width:900px;height:900px;margin:-450px;background:repeating-conic-gradient(rgba(255,228,94,.18) 0 7deg,transparent 7deg 20deg);-webkit-mask:radial-gradient(circle,#000 10%,transparent 62%);mask:radial-gradient(circle,#000 10%,transparent 62%);animation:mpspin 22s linear infinite}
.rapp .mpbox{position:relative;width:130px;height:130px;animation:mpsh .5s ease-in-out infinite}
@keyframes mpsh{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) scale(1.05)}}
.rapp .mpbb{position:absolute;left:0;right:0;bottom:0;height:90px;border-radius:12px;background:linear-gradient(150deg,#FF4FA3,#FF2E88)}
.rapp .mpbl{position:absolute;left:-8px;right:-8px;top:14px;height:34px;border-radius:10px;background:linear-gradient(150deg,#ff7ab9,#FF2E88);z-index:2}
.rapp .mprb{position:absolute;left:50%;margin-left:-9px;width:18px;top:14px;bottom:0;background:#FFE45E;z-index:3}
.rapp .mprb2{position:absolute;left:50%;margin-left:-26px;width:52px;height:26px;top:-8px;border-radius:50% 50% 50% 50%;border:9px solid #FFE45E;z-index:3}
.rapp .mprvc{position:relative;width:292px}.rapp .mprvc .idw{box-shadow:0 18px 40px rgba(0,0,0,.5)}
.rapp .mpin{animation:mpin .9s cubic-bezier(.2,1.3,.4,1) both}
@keyframes mpin{from{transform:translateY(160px) scale(.3) rotate(-14deg);opacity:0}}
.rapp .mpglow{position:absolute;inset:-26px;border-radius:30px;background:radial-gradient(circle,rgba(255,228,94,.75),rgba(255,46,136,.35) 55%,transparent 72%);filter:blur(10px);animation:mppu 1.8s ease-in-out infinite;z-index:-1}
.rapp .mprk{position:relative;margin-top:26px;font:800 10.5px 'Be Vietnam Pro';letter-spacing:.22em;color:#FFE45E}
.rapp .mprh{position:relative;display:block;margin-top:6px;font:800 24px 'Unbounded',sans-serif}
.rapp .mprt{position:relative;margin:10px 0 0;font:600 13.5px/1.6 'Be Vietnam Pro';color:#d9d6ff}
.rapp .mpgo{position:relative;margin-top:22px;border:0;border-radius:99px;padding:15px 34px;font:800 15px 'Be Vietnam Pro';color:#fff;background:linear-gradient(100deg,#FFB02E,#FF2E88);box-shadow:0 10px 28px rgba(255,46,136,.55);cursor:pointer}
.rapp .mppack{position:relative;width:170px;height:240px;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#FFE45E,#FFB02E 55%,#ff8a3d);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#5a2a00;box-shadow:0 18px 40px rgba(0,0,0,.5)}
.rapp .mppack span{font:800 10px 'Be Vietnam Pro';letter-spacing:.2em}.rapp .mppack b{font:800 44px 'Unbounded',sans-serif}.rapp .mppack em{font:800 13px 'Be Vietnam Pro';font-style:normal}
.rapp .mpshine{position:absolute;top:-30%;bottom:-30%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);animation:mpsw 2.4s ease-in-out infinite}
.rapp .mpbs{position:absolute;left:50%;top:38%;width:0;height:0;pointer-events:none;z-index:5}
.rapp .mpbs i{position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;animation:mpbs 1.2s ease-out both}
@keyframes mpbs{from{transform:rotate(var(--a)) translateY(0) scale(1);opacity:1}to{transform:rotate(var(--a)) translateY(calc(var(--d)*-1)) scale(.2);opacity:0}}
.rapp .mpbs2{top:45%}

.rapp .mqhint{margin:14px 0 0;text-align:center;font:700 12px 'Be Vietnam Pro';color:var(--soft)}
.rapp .mqg.done{background:rgba(53,208,165,.14);border-color:rgba(53,208,165,.5)}
.rapp .mqtoast{position:absolute;left:20px;right:20px;top:64px;z-index:30;padding:12px 16px;border-radius:14px;background:#1E1B5E;color:#fff;font:700 13px 'Be Vietnam Pro';text-align:center;box-shadow:0 10px 24px rgba(20,18,63,.4)}
.rapp .mqreset{border:0;border-radius:12px;padding:10px 18px;background:#1E1B5E;color:#fff;font:800 13px 'Be Vietnam Pro';cursor:pointer}
.rapp .igo.off{opacity:.4;pointer-events:none}
.rapp .phone{overflow:hidden}
'''
MEM=[('JAMES','Triệu Vũ Phàm','14/10','Young Crew','#FFB02E','JM'),('JUHOON','Kim Chu Huân','03/01','TNT','#FF2E88','JH'),('MARTIN','Phan Mạnh Tiến','20/03','Blue Lips','#4CC9FF','MT'),('SEONGHYEON','Nghiêm Sơn Hoàng','13/01','ACAI','#35D0A5','SH'),('KEONHO','An Kiến Huy','04/02','Wassup','#8B5CFF','KH')]
js='''var MEM=%s;
class Component extends DCLogic {
  renderVals() {
    var self=this,t=self.state||{},V={};
    var scr=t.scr||0,read=!!t.read,sheet=!!t.sheet,sel=t.sel==null?-1:t.sel,lock=t.lock==null?-1:t.lock,pack=!!t.pack,toast=t.toast||'';
    var hasId=lock>=0, show=sheet?(lock>=0?lock:sel):-1;
    V.isList=scr===0; V.isLetter=scr===1; V.sheet=sheet; V.toast=toast;
    V.newCls=read?'':'new';
    var left=(hasId?0:1)+(pack?0:1);
    V.badge=left?left+' quà chưa nhận':'Đã nhận hết'; V.badgeCls=left?'rw':'';
    V.giftN=(hasId?0:1)+(pack?0:1)?String(2):'2'; V.giftN=left?String(left)+' / 2':'đã nhận hết';
    V.noId=!hasId; V.hasId=hasId; V.noPack=!pack; V.hasPack=pack; V.showAll=left>0;
    V.lockN=hasId?MEM[lock][0].charAt(0)+MEM[lock][0].slice(1).toLowerCase():''; V.lockC=hasId?MEM[lock][4]:'#999';
    for(var i=0;i<5;i++)V['c'+i]=show===i;
    V.anyC=show>=0; V.noC=show<0; V.picking=hasId?false:true;
    V.shTitle=hasId?'Đã gán thẻ ID cho '+V.lockN:'Gán thẻ ID cho ai?';
    V.shSub=hasId?'Thẻ đã vào bộ sưu tập của bạn và đã khóa.':(sel<0?'Chọn một thành viên. Chọn xong là khóa, không đổi được.':'Thẻ tự điền thông tin của thành viên đã chọn.');
    V.okTxt=hasId?'Xong':(sel<0?'Chọn một thành viên':'Xác nhận · gán cho '+MEM[sel][0].charAt(0)+MEM[sel][0].slice(1).toLowerCase());
    V.okCls=(!hasId&&sel<0)?'off':'';
    V.rows=MEM.map(function(m,i){var n=m[0].charAt(0)+m[0].slice(1).toLowerCase();return{i:i,c:m[4],ini:m[5],n:n+' · '+m[1],sub:'Sinh '+m[2]+' · Bài đại diện: '+m[3],cls:i===sel?'on':'',ck:i===sel?'✓':''};});
    function flash(s){self.setState({toast:s});setTimeout(function(){self.setState({toast:''});},2200);}
    V.openLetter=function(){self.setState({scr:1,read:true});};
    V.back=function(){self.setState({scr:0});};
    V.rv=!!t.rv;V.rv1=t.rv&&t.rs===1;V.rv2=t.rv&&t.rs===2;V.rvId=t.rv==='id';V.rvPack=t.rv==='pack';V.leftN=left;
    function reveal(k){self.setState({rv:k,rs:1});setTimeout(function(){self.setState({rs:2});},k==='id'?1300:900);}
    V.giftId=function(){reveal('id');};
    V.toSheet=function(){self.setState({rv:null,rs:0,sheet:true,sel:-1});};
    V.takePack=function(){self.setState({rv:null,rs:0,pack:true});flash('Đã thu 1 pack Urichinguchana vào kho');};
    V.openSheet=function(){self.setState({sheet:true,sel:-1});};
    V.closeSheet=function(){self.setState({sheet:false});};
    V.pickM=function(e){var el=e.target&&e.target.closest?e.target.closest('[data-i]'):e.currentTarget;self.setState({sel:Number(el.getAttribute('data-i'))});};
    V.confirm=function(){
      if(lock>=0){self.setState({sheet:false});return;}
      if(sel<0)return;
      self.setState({lock:sel});flash('Đã gán thẻ ID cho '+MEM[sel][0].charAt(0)+MEM[sel][0].slice(1).toLowerCase());};
    V.claimPack=function(){reveal('pack');};
    V.claimAll=function(){if(lock<0)reveal('id');else if(!pack)reveal('pack');};
    V.reset=function(){self.setState({scr:0,read:false,sheet:false,sel:-1,lock:-1,pack:false,toast:'',rv:null,rs:0});};
    return V;
  }
}
'''%json.dumps(MEM,ensure_ascii=False)
html=f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Chạy thử nhận thư</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Unbounded:wght@600;800&family=Noto+Sans+KR:wght@700&display=swap">
<style>*{{box-sizing:border-box}}body{{margin:0}}
{M.CSSALL}
{EXTRA}</style>
</helmet>
<div style="width:{W}px;height:{Hh}px;overflow:hidden;position:relative">
{tpl}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{W},"height":{Hh}}}}}'>
{js}</script>
</body>
</html>
'''
open(OUT,'w',encoding='utf-8').write(html);print(len(html))
