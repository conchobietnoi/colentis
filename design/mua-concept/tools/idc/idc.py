import json
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/IdCard.dc.html'
LOGO='<svg class="idlg" viewBox="0 0 32 32"><rect x="2" y="4" width="28" height="26" rx="6" fill="#fff"/><rect x="2" y="4" width="28" height="9" rx="4.5" fill="#1E1B5E"/><circle cx="9" cy="20" r="2.3" fill="#1E1B5E"/><circle cx="16" cy="20" r="2.3" fill="#1E1B5E"/><circle cx="23" cy="20" r="2.3" fill="#1E1B5E"/><circle cx="9" cy="26" r="2.3" fill="#1E1B5E"/><circle cx="16" cy="26" r="2.3" fill="#1E1B5E"/><circle cx="23" cy="26" r="2.6" style="fill:var(--ac)"/></svg>'
SEAL='''<svg class="idseal" viewBox="0 0 100 100"><defs><linearGradient id="idsg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE45E"/><stop offset=".35" stop-color="#FF4FA3"/><stop offset=".7" stop-color="#4CC9FF"/><stop offset="1" stop-color="#8B5CFF"/></linearGradient><path id="idsp" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"/></defs>
<circle cx="50" cy="50" r="47" fill="url(#idsg)" opacity=".22"/><circle cx="50" cy="50" r="46" fill="none" stroke="url(#idsg)" stroke-width="2.4"/><circle cx="50" cy="50" r="27" fill="none" stroke="#1E1B5E" stroke-width=".8" stroke-dasharray="1.6 2.2"/>
<text font-size="8.6" font-weight="800" letter-spacing="2.1" fill="#1E1B5E" font-family="Unbounded,sans-serif"><textPath href="#idsp">COLENTIS · FAN ID · CORTIS · </textPath></text>
<rect x="36" y="38" width="28" height="25" rx="5" fill="#fff" stroke="#1E1B5E" stroke-width="1.6"/><rect x="36" y="38" width="28" height="8" rx="4" fill="#1E1B5E"/><circle cx="43" cy="52" r="2" fill="#1E1B5E"/><circle cx="50" cy="52" r="2" fill="#1E1B5E"/><circle cx="57" cy="52" r="2" fill="#1E1B5E"/><circle cx="43" cy="58" r="2" fill="#1E1B5E"/><circle cx="50" cy="58" r="2" fill="#1E1B5E"/><circle cx="57" cy="58" r="2.4" style="fill:var(--ac)"/></svg>'''
SIL='<svg viewBox="0 0 30 40" class="idsil"><circle cx="15" cy="15" r="6.5" fill="currentColor"/><path d="M3 40 C3 27 9 23 15 23 C21 23 27 27 27 40Z" fill="currentColor"/></svg>'
front='''<div class="idc idf" style="--ac:{{ac}};--ac2:{{ac2}}">
  <div class="idrail"><span class="idrail-l">'''+LOGO+'''<b>COLENTIS</b></span><i class="idpunch"></i><span class="idrail-r">FAN ID · 2026</span></div>
  <div class="idph {{phCls}}"><div class="idphin">
    <sc-if value="{{hasPh}}" hint-placeholder-val="false"><img src="{{phSrc}}" alt="" style="{{phStyle}}"></sc-if>
    <sc-if value="{{noPh}}" hint-placeholder-val="true"><div class="idphe">'''+SIL+'''<small>{{phHint}}</small></div></sc-if>
  </div><i class="idc1"></i><i class="idc2"></i><i class="idc3"></i><i class="idc4"></i></div>
  <div class="idinf">
    <h3 class="idnm" style="font-size:{{nmSz}}cqw">{{stage}}</h3><div class="idko">{{ko}}</div>
    <div class="idrows"><sc-for list="{{rows}}" as="r" hint-placeholder-count="4"><div class="idrow"><span>{{r.l}}</span><b class="{{r.c}}">{{r.v}}</b></div></sc-for></div>
  </div>
  <div class="idcode {{codeCls}}">
    <sc-if value="{{hasSp}}" hint-placeholder-val="false"><img class="idspi" src="{{spSrc}}" alt="Mã Spotify"></sc-if>
    <sc-if value="{{noSp}}" hint-placeholder-val="true"><div class="idspb"><i class="idspd"></i><div class="idbars"><sc-for list="{{bars}}" as="b" hint-placeholder-count="23"><i style="height:{{b}}%"></i></sc-for></div></div></sc-if>
    <span class="idsng"><small>BÀI ĐẠI DIỆN</small><b>{{song}}</b></span>
  </div>
</div>'''
back='''<div class="idc idb" style="--ac:{{ac}};--ac2:{{ac2}}">
  <div class="iddays"><sc-for list="{{days}}" as="d" hint-placeholder-count="31"><i class="{{d.c}}"><u>{{d.n}}</u></i></sc-for></div>
  <div class="idsigp">
    <small>CHỮ KÝ</small>
    <sc-if value="{{hasSg}}" hint-placeholder-val="false"><img src="{{sgSrc}}" alt="Chữ ký"></sc-if>
    <sc-if value="{{noSg}}" hint-placeholder-val="true"><svg viewBox="0 0 200 80" class="idsig"><path d="{{sigD}}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></sc-if>
  </div>
  <div class="idsealw">'''+SEAL+'''</div>
  <div class="idbf"><div><small>CHỦ THẺ · TỰ NHẬP</small><input class="idhin" value="{{holder}}" onChange="{{onHolder}}" placeholder="Nhập tên của bạn" maxlength="20" aria-label="Tên chủ thẻ"></div><div><small>CẤP NGÀY</small><b>17/10/2026</b></div><div><small>SỐ THẺ</small><b>{{serial}}</b></div></div>
</div>'''
import base64 as _b
def _d(p): return 'data:image/png;base64,'+_b.b64encode(open(p,'rb').read()).decode()
SONG={'jm':'Young Crew','jh':'TNT','mt':'Blue Lips','sh':'ACAI','kh':'Wassup'}
members=[
 dict(id='jm',s='JAMES',ko='제임스',full='CHAO YUFAN',han='赵雨凡',dob='14/10/2005',blood='A',nat='Thái – Hoa',ac='#FFB02E',cd='JM'),
 dict(id='jh',s='JUHOON',ko='주훈',full='KIM JU-HOON',han='김주훈',dob='03/01/2008',blood='O',nat='Hàn Quốc',ac='#FF2E88',cd='JH'),
 dict(id='mt',s='MARTIN',ko='마틴',full='PARK WOO-JOO',han='박우주',dob='20/03/2008',blood='O',nat='Hàn – Canada',ac='#4CC9FF',cd='MT'),
 dict(id='sh',s='SEONGHYEON',ko='성현',full='EOM SEONG-HYEON',han='엄성현',dob='13/01/2009',blood='A',nat='Hàn Quốc',ac='#35D0A5',cd='SH'),
 dict(id='kh',s='KEONHO',ko='건호',full='AHN KEON-HO',han='안건호',dob='14/02/2009',blood='O',nat='Hàn Quốc',ac='#8B5CFF',cd='KH'),
]
for _m in members:
    _m['sg']=_d('assets/sg_%s.png'%_m['id']); _m['sp']=_d('assets/spS_%s.png'%_m['id']); _m['song']=SONG[_m['id']]
CSS='''
*{box-sizing:border-box}
body{margin:0;font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#15123B;color:#F1F0FF}
button{font-family:inherit;cursor:pointer}
.idw{container-type:inline-size;width:100%}
.idc{position:relative;width:100cqw;height:63.1cqw;border-radius:4.2cqw;overflow:hidden;color:#1E1B5E;box-shadow:0 2.4cqw 6cqw rgba(0,0,0,.5),inset 0 0 0 .5cqw rgba(255,255,255,.5)}
.idf{background-color:#FBF8F1;background-image:linear-gradient(rgba(30,27,94,.055) .25cqw,transparent .25cqw),linear-gradient(90deg,rgba(30,27,94,.055) .25cqw,transparent .25cqw);background-size:5cqw 5cqw}
.idrail{position:absolute;left:0;right:0;top:0;height:12cqw;background:linear-gradient(100deg,var(--ac),var(--ac2));display:flex;align-items:center;justify-content:space-between;padding:0 4.6cqw}
.idrail-l{display:flex;align-items:center;gap:2.2cqw;color:#fff}
.idrail-l b{font:800 4.2cqw 'Unbounded',sans-serif;letter-spacing:.14em;text-shadow:0 .3cqw 1cqw rgba(0,0,0,.25)}
.idlg{width:6.6cqw;height:6.6cqw;display:block}
.idrail-r{font:800 2.5cqw 'Be Vietnam Pro';letter-spacing:.22em;color:#fff;opacity:.92}
.idpunch{position:absolute;left:50%;top:2.6cqw;width:11cqw;height:2.8cqw;margin-left:-5.5cqw;border-radius:99px;background:rgba(20,15,60,.55);box-shadow:inset 0 .3cqw .8cqw rgba(0,0,0,.5)}
.idph{position:absolute;right:5cqw;top:16.5cqw;width:30cqw;height:40cqw;border-radius:2.6cqw;background:#fff;padding:.9cqw;box-shadow:0 1.2cqw 3cqw rgba(30,27,94,.28)}
.idphin{position:relative;width:100%;height:100%;border-radius:1.9cqw;overflow:hidden;background:linear-gradient(160deg,#dcd9f2,#bfbbe6)}
.idphin img{position:absolute;max-width:none;display:block;user-select:none;-webkit-user-drag:none}
.idphe{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;color:rgba(30,27,94,.28)}
.idsil{width:78%;display:block}
.idphe small{position:absolute;top:14%;left:0;right:0;text-align:center;font:800 2.5cqw/1.3 'Be Vietnam Pro';color:#1E1B5E;opacity:.7;padding:0 2cqw}
.idc1,.idc2,.idc3,.idc4{position:absolute;width:3.4cqw;height:3.4cqw;border:.55cqw solid var(--ac);pointer-events:none}
.idc1{left:-.9cqw;top:-.9cqw;border-right:0;border-bottom:0;border-radius:1.6cqw 0 0 0}.idc2{right:-.9cqw;top:-.9cqw;border-left:0;border-bottom:0;border-radius:0 1.6cqw 0 0}
.idc3{left:-.9cqw;bottom:-.9cqw;border-right:0;border-top:0;border-radius:0 0 0 1.6cqw}.idc4{right:-.9cqw;bottom:-.9cqw;border-left:0;border-top:0;border-radius:0 0 1.6cqw 0}
.idinf{position:absolute;left:5cqw;top:15.2cqw;width:56cqw}
.idnm{margin:0;font:800 7.2cqw/1 'Unbounded',sans-serif;letter-spacing:-.01em;color:#1E1B5E}
.idko{margin-top:1cqw;font:700 3.1cqw 'Noto Sans KR','Be Vietnam Pro',sans-serif;color:var(--ac);filter:brightness(.78) saturate(1.2)}
.idrows{margin-top:1.8cqw}
.idrow{display:flex;align-items:baseline;gap:2cqw;padding:.85cqw 0;border-bottom:.3cqw dotted rgba(30,27,94,.35)}
.idrow span{flex:none;width:17cqw;font:800 1.95cqw 'Be Vietnam Pro';letter-spacing:.12em;text-transform:uppercase;color:rgba(30,27,94,.6)}
.idrow b{font:800 3cqw 'Be Vietnam Pro';color:#1E1B5E;white-space:nowrap}
.idrow b.ph{color:rgba(30,27,94,.3);font-weight:700}
.idcode{position:absolute;left:5cqw;bottom:2.2cqw;width:56cqw;height:7.4cqw;display:flex;align-items:center;gap:2cqw}
.idspb{flex:none;width:34cqw;height:7.4cqw;border-radius:99px;background:#16131f;display:flex;align-items:center;gap:1.4cqw;padding:0 2.4cqw 0 1.6cqw}
.idspd{flex:none;width:4.6cqw;height:4.6cqw;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 12%,transparent 13%),#1ed760}
.idbars{flex:1;height:100%;display:flex;align-items:center;justify-content:space-between;padding:1.4cqw 0}
.idbars i{display:block;width:.95cqw;border-radius:99px;background:#fff}
.idspi{flex:none;height:7.4cqw;width:auto;border-radius:1.2cqw;display:block}
.idsng{min-width:0;display:flex;flex-direction:column;gap:.5cqw}
.idsng small{font:800 1.8cqw 'Be Vietnam Pro';letter-spacing:.16em;color:rgba(30,27,94,.55)}
.idsng b{font:800 2.7cqw/1.15 'Be Vietnam Pro';overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.idcode.emp .idspb{background:transparent;border:.4cqw dashed rgba(30,27,94,.35)}
.idcode.emp .idbars i{background:rgba(30,27,94,.25)}
.idcode.emp .idspd{background:rgba(30,27,94,.2)}
.idb{background-color:color-mix(in srgb,var(--ac) 20%,#fff);background-image:linear-gradient(rgba(30,27,94,.06) .25cqw,transparent .25cqw),linear-gradient(90deg,rgba(30,27,94,.06) .25cqw,transparent .25cqw);background-size:5cqw 5cqw}
.iddays{position:absolute;left:0;right:0;top:0;height:10.5cqw;background:#1E1B5E;display:flex;align-items:flex-end;padding:0 3.2cqw 1.6cqw;gap:0}
.iddays i{flex:1;height:100%;position:relative;display:flex;align-items:flex-end;justify-content:center}
.iddays i:before{content:"";position:absolute;bottom:3.6cqw;left:50%;width:.3cqw;height:1.8cqw;margin-left:-.15cqw;background:rgba(255,255,255,.5)}
.iddays u{text-decoration:none;font:700 1.7cqw 'Be Vietnam Pro';color:rgba(255,255,255,.55)}
.iddays i.on:before{height:3.6cqw;width:.8cqw;margin-left:-.4cqw;background:var(--ac)}
.iddays i.on u{color:var(--ac);font-weight:900;font-size:2cqw;filter:brightness(1.25)}
.idsigp{position:absolute;left:5cqw;top:14.5cqw;width:57cqw;height:29cqw;border-radius:2.6cqw;background:rgba(255,255,255,.72);border:.35cqw solid rgba(30,27,94,.16);display:grid;place-items:center;padding:2cqw}
.idsigp small{position:absolute;left:2.4cqw;top:2cqw;font:800 1.9cqw 'Be Vietnam Pro';letter-spacing:.16em;color:rgba(30,27,94,.5)}
.idsigp img{position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);max-width:90%;max-height:80%;width:auto;height:auto;display:block}
.idsig{width:88%;color:#1E1B5E;display:block}
.idsealw{position:absolute;right:5.5cqw;top:14.5cqw;width:26cqw;height:26cqw;transform:rotate(-8deg);filter:drop-shadow(0 .6cqw 1.2cqw rgba(30,27,94,.25))}
.idseal{width:100%;height:100%;display:block}
.idbf{position:absolute;left:5cqw;right:5cqw;bottom:3.2cqw;display:grid;grid-template-columns:1.25fr 1fr 1.25fr;gap:3cqw}
.idbf small{display:block;font:800 1.9cqw 'Be Vietnam Pro';letter-spacing:.16em;color:rgba(30,27,94,.55)}
.idhin{display:block;width:100%;margin-top:.6cqw;padding:.9cqw 0 0;border:0;border-top:.3cqw dotted rgba(30,27,94,.4);border-radius:0;background:transparent;color:#1E1B5E;font:800 3cqw 'Be Vietnam Pro';outline:none;min-width:0}
.idhin::placeholder{color:rgba(30,27,94,.32);font-weight:700}
.idhin:focus{border-top:.4cqw solid var(--ac);background:rgba(255,255,255,.5)}
.idbf b{display:block;margin-top:.6cqw;font:800 3cqw 'Be Vietnam Pro';padding-top:.9cqw;border-top:.3cqw dotted rgba(30,27,94,.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* ----- bố cục bảng ----- */
.bd{position:relative;width:1170px;height:904px;overflow:hidden;background:radial-gradient(900px 600px at 20% 0,#2a2160,#15123B 70%)}
.bt{position:absolute;left:24px;top:18px;font:800 20px 'Unbounded',sans-serif}
.bt small{display:block;font:700 12px 'Be Vietnam Pro';color:#B8B4E8;margin-top:5px;letter-spacing:.02em}
.cola{position:absolute;left:24px;top:84px;width:500px}
.lab{font:800 11px 'Be Vietnam Pro';letter-spacing:.2em;color:#B8B4E8;margin:0 0 8px;display:flex;justify-content:space-between}
.lab em{font-style:normal;color:#FFE45E}
.gap{height:22px}
.colb{position:absolute;left:548px;top:84px;width:308px;display:flex;flex-direction:column;gap:12px}
.colc{position:absolute;left:880px;top:84px;width:266px;display:flex;flex-direction:column;gap:12px}
.pn{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:12px 14px}
.pn h4{margin:0 0 8px;font:800 11px 'Be Vietnam Pro';letter-spacing:.18em;color:#FFE45E}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1.5px solid rgba(255,255,255,.22);background:transparent;color:#F1F0FF;border-radius:99px;padding:6px 11px;font:800 12px 'Be Vietnam Pro';display:flex;align-items:center;gap:6px}
.chip i{width:9px;height:9px;border-radius:50%;background:var(--c)}
.chip.on{background:#fff;color:#1E1B5E;border-color:#fff}
.btn{border:0;border-radius:11px;padding:9px 12px;font:800 12px 'Be Vietnam Pro';background:#FF2E88;color:#fff}
.btn.g{background:rgba(255,255,255,.14);color:#F1F0FF}
.btn.off{opacity:.4;pointer-events:none}
.row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.fl{position:relative;overflow:hidden;display:inline-block}
.fl input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;font-size:0}
.crop{position:relative;width:150px;height:200px;margin:8px auto;border-radius:12px;overflow:hidden;background:#2b2766;touch-action:none;cursor:grab;border:2px solid #fff}
.crop img{position:absolute;max-width:none;user-select:none;-webkit-user-drag:none;pointer-events:none}
.crop:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.35) 1px,transparent 1px) 0 33.3%/100% 33.4% repeat-y,linear-gradient(90deg,rgba(255,255,255,.35) 1px,transparent 1px) 33.3% 0/33.4% 100% repeat-x;pointer-events:none}
.crop.none{display:grid;place-items:center;color:#B8B4E8;font:700 12px 'Be Vietnam Pro';text-align:center;padding:14px;cursor:default}
.crop.none:after{display:none}
.sl{display:grid;grid-template-columns:50px 1fr;gap:8px;align-items:center;font:800 11px 'Be Vietnam Pro';color:#B8B4E8;margin-top:4px}
.sl input{width:100%;accent-color:#FF2E88}
.in{width:100%;border-radius:10px;border:1.5px solid rgba(255,255,255,.22);background:rgba(0,0,0,.22);color:#fff;padding:8px 10px;font:700 13px 'Be Vietnam Pro'}
.nt{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;font:600 11.5px/1.5 'Be Vietnam Pro';color:#DAD8F7}
.nt b{color:#fff}
.nt li{display:grid;grid-template-columns:20px 1fr;gap:6px}
.nt li>i{font-style:normal;width:20px;height:20px;border-radius:50%;background:#FF2E88;color:#fff;display:grid;place-items:center;font:900 11px 'Be Vietnam Pro'}
.tb{font:700 10.5px/1.4 'Be Vietnam Pro';color:#DAD8F7}
.tr{display:grid;grid-template-columns:1.5fr 1.1fr .5fr;gap:4px;padding:4px 2px;border-bottom:1px solid rgba(255,255,255,.1);white-space:nowrap}
.tr.th{font:800 9px 'Be Vietnam Pro';letter-spacing:.1em;color:#FFE45E}
.tb i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;background:var(--c)}
.st{font:700 11px 'Be Vietnam Pro';color:#B8B4E8;margin-top:6px;line-height:1.45}
'''
TPL='''<div class="bd">
 <div class="bt">Thẻ ID Colentis<small>Thẻ tặng kèm trong thư sự kiện · 2 mặt · 5 thành viên CORTIS</small></div>
 <div class="cola">
  <div class="lab"><span>MẶT TRƯỚC</span><em>{{stateTxt}}</em></div>
  <div class="idw">'''+front+'''</div>
  <div class="gap"></div>
  <div class="lab"><span>MẶT SAU</span></div>
  <div class="idw">'''+back+'''</div>
 </div>
 <div class="colb">
  <div class="pn"><h4>1 · THÀNH VIÊN CỦA THẺ</h4>
   <div class="chips"><sc-for list="{{chips}}" as="c" hint-placeholder-count="6"><button class="chip {{c.cls}}" style="--c:{{c.ac}}" data-i="{{c.i}}" onClick="{{pick}}"><i></i>{{c.n}}</button></sc-for></div>
   <div class="st">{{pickNote}}</div></div>
  <div class="pn"><h4>2 · ẢNH · KÉO ĐỂ CĂN, KHUNG 3:4</h4>
   <div class="crop {{cropCls}}" onPointerDown="{{dragS}}" onPointerMove="{{dragM}}" onPointerUp="{{dragE}}">
    <sc-if value="{{hasPh}}" hint-placeholder-val="false"><img src="{{phSrc}}" alt="" style="{{phStyle}}"></sc-if>
    <sc-if value="{{noPh}}" hint-placeholder-val="true"><span>{{cropMsg}}</span></sc-if></div>
   <div class="sl"><span>Phóng</span><input type="range" min="100" max="300" value="{{zV}}" onInput="{{onZ}}"></div>
   <div class="sl"><span>Ngang</span><input type="range" min="0" max="100" value="{{xV}}" onInput="{{onX}}"></div>
   <div class="sl"><span>Dọc</span><input type="range" min="0" max="100" value="{{yV}}" onInput="{{onY}}"></div>
   <div class="row" style="margin-top:8px"><span class="btn fl {{dis}}">Tải ảnh lên<input type="file" accept="image/*" onChange="{{onPhoto}}"></span><button class="btn g {{dis}}" onClick="{{samplePh}}">Ảnh mẫu</button><button class="btn g {{dis}}" onClick="{{resetPh}}">Căn lại</button><button class="btn g {{dis}}" onClick="{{clearPh}}">Xóa</button></div></div>
  <div class="pn"><h4>3 · CHỮ KÝ · MÃ SPOTIFY</h4>
   <div class="row"><span class="btn fl g {{dis}}">Tải chữ ký<input type="file" accept="image/*" onChange="{{onSig}}"></span><button class="btn g {{dis}}" onClick="{{clearSig}}">Chữ ký gốc</button></div>
   <div class="row" style="margin-top:6px"><span class="btn fl g {{dis}}">Tải mã Spotify<input type="file" accept="image/*" onChange="{{onSp}}"></span><button class="btn g {{dis}}" onClick="{{clearSp}}">Mã gốc</button></div>
   <div class="st">Tên chủ thẻ do người chơi tự gõ ngay trên mặt sau của thẻ (tối đa 20 ký tự).</div></div>
 </div>
 <div class="colc">
  <div class="pn"><h4>CƠ CHẾ ĐỀ XUẤT</h4><ul class="nt">
   <li><i>1</i><span><b>Thẻ trống</b> đính kèm thư sự kiện. Nhận về là vào bộ sưu tập, mỗi người chỉ có 1 thẻ ID.</span></li>
   <li><i>2</i><span><b>Gán thành viên</b>: bấm thẻ trống, chọn tên, xác nhận. Nên khóa luôn như nhạc Ultra để thẻ có giá trị.</span></li>
   <li><i>3</i><span><b>Ảnh</b>: chọn từ máy, kéo và phóng trong khung 3:4, lưu bản nén khoảng 600×800.</span></li>
   <li><i>4</i><span><b>Mã Spotify</b>: dùng đúng 5 ảnh mã gốc bạn gửi, lưu sẵn trong app, không cần API. Quét bằng camera trong Spotify để nghe bài.</span></li>
   <li><i>5</i><span><b>Dấu Colentis</b>: logo lịch, dải ngày sáng đúng ngày sinh, con dấu tròn và số thẻ.</span></li></ul></div>
  <div class="pn"><h4>THÔNG TIN THÀNH VIÊN</h4>
   <div class="tb"><div class="tr th"><span>NGHỆ DANH</span><span>SINH</span><span>MÁU</span></div>
   <sc-for list="{{tbl}}" as="m" hint-placeholder-count="5"><div class="tr"><span><i style="--c:{{m.ac}}"></i>{{m.s}}</span><span>{{m.dob}}</span><span>{{m.blood}}</span></div></sc-for></div>
   <div class="st">Quốc tịch và tên đầy đủ hiện trên thẻ. Chữ ký, ảnh và mã Spotify do bạn cung cấp.</div></div>
 </div>
</div>'''
SCRIPT='''
var MEM = '''+json.dumps(members,ensure_ascii=False)+''';
var SIG = [
 'M14 52 C30 8 52 6 44 34 C40 52 24 66 34 58 C56 40 66 20 84 30 C100 40 80 60 104 44 C124 30 150 22 170 34 C150 44 120 62 176 58',
 'M12 46 C34 20 62 14 70 38 C74 58 46 66 52 44 C60 22 98 20 112 46 C124 66 150 20 176 30 C186 34 170 58 150 62',
 'M10 60 C28 14 40 12 44 50 C48 24 70 18 78 46 C84 18 106 20 112 48 C120 34 150 10 168 40 C176 56 150 62 190 50',
 'M16 44 C20 20 46 20 46 44 C46 64 24 62 28 46 C34 28 70 26 86 44 C100 60 118 30 140 38 C160 46 150 62 186 40',
 'M14 62 C22 18 44 14 48 40 C50 60 70 56 74 36 C78 14 104 18 100 44 C98 62 130 52 142 34 C150 22 168 22 178 38'];
var D = { sel: '', ph: {}, sg: {}, sp: {}, holder: '', f: {} };
function sample() {
  var s = '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e6ff"/><stop offset="1" stop-color="#b9b3f0"/></linearGradient></defs><rect width="900" height="1200" fill="url(#g)"/><circle cx="470" cy="470" r="190" fill="#3b2d6e"/><path d="M110 1200 C110 880 290 760 470 760 C650 760 830 880 830 1200Z" fill="#1E1B5E"/><path d="M400 760 L470 900 L540 760Z" fill="#fff"/><circle cx="470" cy="470" r="160" fill="#f2cfb8"/><path d="M300 450 C300 300 640 300 640 450 C600 380 380 380 300 450Z" fill="#2a1d4c"/></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
}
function spBars(seed) { var a = [], x = seed * 9301 + 49297; for (var i = 0; i < 23; i++) { x = (x * 9301 + 49297) % 233280; a.push(26 + Math.floor(x / 233280 * 7) * 10); } return a; }
function mem(id) { for (var i = 0; i < MEM.length; i++) if (MEM[i].id === id) return MEM[i]; return null; }
function shade(hex) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; var f = function (v) { return Math.max(0, Math.round(v * 0.62)); }; return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')'; }
function cl(o) { return JSON.parse(JSON.stringify(o)); }
function geom(p) {
  var k = Math.max(3 / p.nw, 4 / p.nh), w = p.nw * k * p.z / 3 * 100, h = p.nh * k * p.z / 4 * 100;
  var lx = 1 - w / 200, hx = w / 200, ly = 1 - h / 200, hy = h / 200;
  var cx = Math.min(hx, Math.max(lx, p.cx)), cy = Math.min(hy, Math.max(ly, p.cy));
  return { w: w, h: h, lx: lx, hx: hx, ly: ly, hy: hy, cx: cx, cy: cy, left: cx * 100 - w / 2, top: cy * 100 - h / 2 };
}
class Component extends DCLogic {
  renderVals() {
    var self = this, t = self.state || {};
    var s = {}; for (var k in D) s[k] = t[k] !== undefined ? t[k] : D[k];
    var set = function (p) { self.setState(p); };
    var st = function () { var o = {}; var tt = self.state || {}; for (var k in D) o[k] = tt[k] !== undefined ? tt[k] : D[k]; return o; };
    var m = mem(s.sel), V = {};
    var ac = m ? m.ac : '#9A97C9', ac2 = m ? shade(m.ac) : '#5B5894';
    V.ac = ac; V.ac2 = ac2;
    V.stateTxt = m ? 'ĐÃ GÁN · ' + m.s : 'THẺ TRỐNG · CHƯA GÁN';
    V.stage = m ? m.s : 'CHƯA GÁN'; V.nmSz = m && m.s.length > 8 ? 5.8 : 7.2; V.ko = m ? m.ko + ' · ' + m.han : 'Chọn thành viên để điền thông tin';
    var ph = (m ? '' : ' ph');
    V.rows = [
      { l: 'Họ tên', v: m ? m.full : '— — —', c: m ? '' : 'ph' },
      { l: 'Ngày sinh', v: m ? m.dob : '— / — / —', c: m ? '' : 'ph' },
      { l: 'Nhóm máu', v: m ? m.blood : '—', c: m ? '' : 'ph' },
      { l: 'Quốc tịch', v: m ? m.nat : '— — —', c: m ? '' : 'ph' }];
    var p = m ? s.ph[m.id] : null, g = p ? geom(p) : null;
    V.hasPh = !!p; V.noPh = !p; V.phSrc = p ? p.src : '';
    V.phStyle = g ? 'width:' + g.w + '%;height:' + g.h + '%;left:' + g.left + '%;top:' + g.top + '%' : '';
    V.phHint = m ? 'Tải ảnh của bạn' : 'Ảnh thẻ'; V.phCls = '';
    var sp = m ? (s.sp[m.id] || m.sp) : null, sgi = m ? (s.sg[m.id] || m.sg) : null;
    V.hasSp = !!sp; V.noSp = !sp; V.spSrc = sp || ''; V.codeCls = m ? '' : 'emp';
    V.bars = spBars(m ? MEM.indexOf(m) + 3 : 11);
    V.song = m ? m.song : 'Chọn thành viên';
    V.hasSg = !!sgi; V.noSg = !sgi; V.sgSrc = sgi || ''; V.sigD = '';
    V.days = []; for (var d = 1; d <= 31; d++) V.days.push({ n: d, c: m && Number(m.dob.slice(0, 2)) === d ? 'on' : '' });
    V.holder = s.holder; V.serial = m ? 'CLN-26-' + m.cd + '-0001' : 'CLN-26-••-0000';
    V.chips = [{ i: -1, n: 'Thẻ trống', ac: '#9A97C9', cls: !m ? 'on' : '' }].concat(MEM.map(function (x, i) { return { i: i, n: x.s.charAt(0) + x.s.slice(1).toLowerCase(), ac: x.ac, cls: m && m.id === x.id ? 'on' : '' }; }));
    V.pick = function (e) { var el = e.target && e.target.closest ? e.target.closest('[data-i]') : e.currentTarget; var i = Number(el.getAttribute('data-i')); set({ sel: i < 0 ? '' : MEM[i].id }); };
    V.pickNote = m ? 'Thẻ này mặc định là của ' + m.s + '. Thông tin, màu thẻ và ngày sinh trên dải ngày tự điền.' : 'Đây là thẻ trống nhận từ thư. Chọn một thành viên để gán.';
    V.dis = m ? '' : 'off';
    V.tbl = MEM.map(function (x) { return { s: x.s, dob: x.dob, blood: x.blood, ac: x.ac }; });
    /* crop */
    V.cropCls = p ? '' : 'none'; V.cropMsg = m ? 'Chưa có ảnh. Tải ảnh lên hoặc dùng ảnh mẫu.' : 'Chọn thành viên trước.';
    V.zV = p ? Math.round(p.z * 100) : 100;
    V.xV = g && g.hx - g.lx > 1e-6 ? Math.round((g.cx - g.lx) / (g.hx - g.lx) * 100) : 50; V.yV = g && g.hy - g.ly > 1e-6 ? Math.round((g.cy - g.ly) / (g.hy - g.ly) * 100) : 50;
    var upd = function (fn) { var x = st(); var mm = mem(x.sel); if (!mm || !x.ph[mm.id]) return; var nph = cl(x.ph); fn(nph[mm.id]); set({ ph: nph }); };
    V.onZ = function (e) { var v = Number(e.target.value) / 100; upd(function (q) { q.z = v; }); };
    V.onX = function (e) { var v = Number(e.target.value) / 100; upd(function (q) { var gg = geom(q); q.cx = gg.lx + (gg.hx - gg.lx) * v; }); };
    V.onY = function (e) { var v = Number(e.target.value) / 100; upd(function (q) { var gg = geom(q); q.cy = gg.ly + (gg.hy - gg.ly) * v; }); };
    V.resetPh = function () { upd(function (q) { q.z = 1; q.cx = .5; q.cy = .5; }); };
    V.clearPh = function () { var x = st(); var mm = mem(x.sel); if (!mm) return; var nph = cl(x.ph); delete nph[mm.id]; set({ ph: nph }); };
    var setImg = function (key, src, withSize) {
      var x = st(), mm = mem(x.sel); if (!mm) return;
      if (!withSize) { var o = cl(x[key]); o[mm.id] = src; var u = {}; u[key] = o; set(u); return; }
      var im = new Image(); im.onload = function () { var y = st(); var nph = cl(y.ph); nph[mm.id] = { src: src, nw: im.naturalWidth || 900, nh: im.naturalHeight || 1200, z: 1, cx: .5, cy: .5 }; set({ ph: nph }); }; im.src = src;
    };
    V.samplePh = function () { setImg('ph', sample(), true); };
    var readFile = function (e, cb) { var f = e.target.files && e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { cb(String(r.result)); }; r.readAsDataURL(f); try { e.target.value = ''; } catch (er) {} };
    V.onPhoto = function (e) { readFile(e, function (src) { setImg('ph', src, true); }); };
    V.onSig = function (e) { readFile(e, function (src) { setImg('sg', src, false); }); };
    V.onSp = function (e) { readFile(e, function (src) { setImg('sp', src, false); }); };
    V.clearSig = function () { var x = st(), mm = mem(x.sel); if (!mm) return; var o = cl(x.sg); delete o[mm.id]; set({ sg: o }); };
    V.clearSp = function () { var x = st(), mm = mem(x.sel); if (!mm) return; var o = cl(x.sp); delete o[mm.id]; set({ sp: o }); };
    V.onHolder = function (e) { set({ holder: e.target.value }); };
    /* kéo ảnh */
    V.dragS = function (e) { var x = st(), mm = mem(x.sel), q = mm && x.ph[mm.id]; if (!q) return; var gg = geom(q); window.__dg = { x: e.clientX, y: e.clientY, cx: gg.cx, cy: gg.cy }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (er) {} };
    V.dragM = function (e) { var d = window.__dg; if (!d) return; var W = 150, H = 200; upd(function (q) { q.cx = d.cx + (e.clientX - d.x) / W; q.cy = d.cy + (e.clientY - d.y) / H; var gg = geom(q); q.cx = gg.cx; q.cy = gg.cy; }); };
    V.dragE = function () { window.__dg = null; };
    return V;
  }
}
'''
html='''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Thẻ ID Colentis</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@600;700;800;900&family=Unbounded:wght@600;800&family=Noto+Sans+KR:wght@700&display=swap">
<style>'''+CSS+'''</style>
</helmet>
'''+TPL+'''
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1170,"height":904}}'>'''+SCRIPT+'''</script>
</body>
</html>
'''
open(OUT,'w',encoding='utf-8').write(html)
print(len(html))
