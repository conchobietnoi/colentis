import sys,os,json,re,hashlib
sys.path[:0]=['.','../idc']
import mailplay2 as P
M=P.M
ROOT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/'
os.chdir(ROOT+'idc')
OUT=ROOT+'design-col/project/MailPlay.dc.html'
PT=json.load(open('parts.json')); C=json.load(open('cardhtml2.json'))
ic=M.ic
KEYS=['jm','jh','mt','sh','kh']
MEM=[('JAMES','Triệu Vũ Phàm','14/10','Young Crew','#FFB02E','JM'),('JUHOON','Kim Chu Huân','03/01','TNT','#FF2E88','JH'),('MARTIN','Phan Mạnh Tiến','20/03','Blue Lips','#4CC9FF','MT'),('SEONGHYEON','Nghiêm Sơn Hoàng','13/01','ACAI','#35D0A5','SH'),('KEONHO','An Kiến Huy','14/02','Wassup','#8B5CFF','KH')]
W,Hh=470,980
# ---------- dedupe data URIs
IMG={}
def dd(h):
    def f(m):
        pre,src,post=m.group(1),m.group(2),m.group(3)
        k='dd'+hashlib.md5(src.encode()).hexdigest()[:8]; IMG[k]=src
        a=pre+post
        a=a.replace('class="','class="'+k+' ',1) if 'class="' in a else a+f' class="{k}"'
        return '<img'+a+'>'
    return re.sub(r'<img([^>]*?)\ssrc="(data:[^"]{300,})"([^>]*)>',f,h)
def sc(c,h,v='false'): return f'<sc-if value="{{{{{c}}}}}" hint-placeholder-val="{v}">{h}</sc-if>'
SIL='<svg viewBox="0 0 30 40" class="mpsilv"><circle cx="15" cy="15" r="6.5" fill="currentColor"/><path d="M3 40 C3 27 9 23 15 23 C21 23 27 27 27 40Z" fill="currentColor"/></svg>'
PHF=sc('noPh','@@IDPHE@@','true')+sc('hasPh','<img src="{{phSrc}}" alt="" style="width:100%;height:100%;object-fit:cover;object-position:{{phPos}};transform:scale({{pz}})">')
def front(k):
    h=PT['front'][k]
    h=re.sub(r'<div class="idphe">.*?</small></div>',lambda m:PHF.replace('@@IDPHE@@',m.group(0)),h,count=1,flags=re.S)
    return dd(h)
def back(k):
    h=PT['back'][k].replace('value=""','value="{{holder}}" onChange="{{onHolder}}"',1)
    return dd(h)
def fv(t): return re.sub(r'--([abcw])(?![\w-])',r'--f\1',t)
def ifx(k):
    h=fv(PT['ifx'][k]).replace('--fw:104px','--fw:168px')
    h=re.sub(r'<div class="iav"><img src="data:[^"]*" alt=""></div>','<div class="iav">'+sc('hasPh','<img src="{{phSrc}}" alt="" style="object-position:{{phPos}};transform:scale({{pz}})">')+sc('noPh','<span class="mpsil">'+SIL+'</span>','true')+'</div>',h,count=1)
    return dd(h)
BLANK=dd(C['blank'])
FR=lambda pre,fn:''.join(sc(f'{pre}{i}',fn(k)) for i,k in enumerate(KEYS))
# ---------- frame css
raw=open(ROOT+'design-col/project/IdFrames.dc.html',encoding='utf-8').read()
css=raw[raw.index('<style>')+7:raw.index('</style>')]
def blocks(s):
    i=0;out=[]
    while i<len(s):
        j=s.find('{',i)
        if j<0:break
        d=1;k=j+1
        while d and k<len(s):
            d+= (s[k]=='{')-(s[k]=='}');k+=1
        out.append((s[i:j].strip(),s[j+1:k-1],s[i:k].strip()));i=k
    return out
KEEP=('.ifx','.idial','.itk','.itg','.ibd','.idns','.idn','.iring','.iav','.ish','.isg','.ibg','.ilg','.iorb','.ittl')
REN={'spin':'pfspin','spinr':'pfspinr','aur2':'pfaur2','tw':'pftw','ttlg':'pfttlg','ipul':'pfipul','idnf':'pfidnf','ishm':'pfishm','iwr':'pfiwr'}
def ren(t):
    t=re.sub(r'--r(?![\w-])','--pfr',t)
    for a,b in REN.items():
        t=re.sub(r'@keyframes '+a+r'\b','@keyframes '+b,t)
        t=re.sub(r'(animation(?:-name)?\s*:[^;}]*?)(?<![\w-])'+a+r'(?![\w-])',lambda m:m.group(1)+b,t)
    return t
FCSS=''
for pre,body,full in blocks(css):
    if pre.startswith('@property') or pre.startswith('@keyframes'):
        FCSS+=ren(full)+'\n'
    elif pre.startswith(KEEP) and not pre.startswith('@'):
        sel=','.join('.rapp '+x.strip() for x in pre.split(','))
        FCSS+=ren(sel+'{'+body+'}')+'\n'
FCSS=re.sub(r'--([abcw])(?![\w-])',r'--f\1',FCSS)
# ---------- poster (reuse from P with mystery slots + ID explainer + new gifts)
SP=P.SP; BURST=P.BURST
CON=[('01','Urichinguchana','18 – 20/10','#FFB02E'),('02','Aniyaaa','21 – 23/10','#FF2E88'),('03','Poyoyoi','24 – 26/10','#4CC9FF')]
cons=''.join(f'<div class="mpcn" style="--c:{c}"><div class="mpcnh"><b>{n}</b><span><strong>{nm}</strong><small>{d} · 3 ngày</small></span></div><div class="mpsl mq">'+'<i>?</i>'*5+'</div></div>' for n,nm,d,c in CON)
POSTER=f'''<div class="mph"><div class="mpphs"><i style="background-image:url({M.b10.PANOS[1]})"></i><i style="background-image:url({M.b10.PANOS[2]})"></i><i style="background-image:url({M.b10.PANOS[3]})"></i></div><div class="mpsp">{SP}</div>
<div class="mphx"><small>COLENTIS PRESENTS</small><b>MÙA<br>CONCEPT</b><em>18 — 26 . 10</em></div>
<div class="mptk"><div class="mptki"><span>URICHINGUCHANA ✦ ANIYAAA ✦ POYOYOI ✦ </span><span>URICHINGUCHANA ✦ ANIYAAA ✦ POYOYOI ✦ </span></div></div></div>
<div class="mpst"><div><b>9</b><small>ngày</small></div><div><b>3</b><small>concept</small></div><div><b>18</b><small>pack</small></div><div><b>2</b><small>thẻ Ultra</small></div></div>
<div class="mpsec"><small class="mpk">MỖI NGÀY</small><h2>Làm nhiệm vụ, mở <em>2 pack</em></h2><p class="mpd">Mỗi pack 5 thẻ. Thẻ nào của bạn thì bạn tự rút, thẻ trùng đem tặng, thẻ thiếu thì xin.</p></div>
<div class="mpsec"><small class="mpk">BA CHẶNG · MỖI CHẶNG 5 THẺ BÍ MẬT</small><h2>Gom đủ 5 thẻ, <em>mở nguyên tấm</em></h2>{cons}
<div class="mprw"><span><i>◈</i>Panorama</span><span><i>◉</i>Khung tròn</span><span><i>✦</i>Danh hiệu</span><span><i>▣</i>Pack thẻ app</span></div>
<p class="mpd">Mỗi concept hoàn thành đều mở đủ bốn phần thưởng này.</p></div>
<div class="mpul"><div class="mpuS"></div><small class="mpk" style="color:#FFE45E">BÍ MẬT CUỐI MÙA</small><h2 style="color:#fff">Hai thẻ <em>Ultra Limited</em></h2>
<div class="mpuc"><div class="mpu a"><div class="mpuf"></div><span class="mpq">?</span><small>ULTRA · 01</small><i class="mpsw"></i></div><div class="mpu b"><div class="mpuf"></div><span class="mpq">?</span><small>ULTRA · 02</small><i class="mpsw"></i></div></div>
<p class="mpd" style="color:#d9d6ff;text-align:center">Chỉ người gom đủ cả 3 concept mới thấy mặt thẻ. Bảy bài hát, mỗi thẻ một bài, bạn tự chọn.</p>
<div class="mplk">KHÓA · MỞ KHI ĐỦ 3 CONCEPT</div></div>
<div class="mpsec"><small class="mpk">QUÀ KHAI MẠC · THẺ ID COLENTIS</small><h2>Thẻ fan của <em>riêng bạn</em></h2>
<div class="mpidc">{BLANK}</div>
<ol class="mpids">
<li><i>1</i><span><b>Chọn thành viên</b>Gán một trong 5 người CORTIS. Thông tin, màu và chữ ký tự điền sẵn. Chọn xong là khóa.</span></li>
<li><i>2</i><span><b>Thêm ảnh của bạn</b>Tải ảnh từ điện thoại, kéo và phóng để căn vừa khung.</span></li>
<li><i>3</i><span><b>Ghi tên chủ thẻ</b>Tự gõ tên của bạn ở mặt sau thẻ.</span></li>
<li><i>4</i><span><b>Quét mã Spotify</b>Mã dưới tên là mã bài hát đại diện của thành viên. Mở Spotify, quét mã để nghe ngay.<em class="mpspo"><u></u><u></u><u></u><u></u><u></u><u></u><u></u><u></u><u></u><u></u><u></u><u></u></em></span></li></ol>
<div class="mpunl"><b>Thẻ có ảnh và tên</b> sẽ mở khung tròn và danh hiệu riêng trong Hồ sơ.</div></div>
<div class="mpsec"><small class="mpk">QUÀ CỦA BẠN · 3 MÓN</small><h2>Nhận ngay, <em>mở ngày mai</em></h2>
{sc('noId','<button class="mpgf" onClick="{{giftId}}"><span class="mpgb ic1"><i></i></span><span class="mpgt"><small>THẺ ĐẶC BIỆT</small><b>Thẻ ID Colentis</b><em>Chạm để nhận</em></span></button>','true')}
{sc('hasId','<div class="mpgf done"><span class="mpgb mok" style="background:{{lockC}}">✓</span><span class="mpgt"><small>ĐÃ NHẬN · TRONG BỘ SƯU TẬP</small><b>Thẻ ID · {{lockN}}</b><em>Chạm để thêm ảnh và tên</em></span><button class="mpmini" onClick="{{goCol}}">Xem</button></div>')}
{sc('noId','<div class="mpgf lock"><span class="mpgb ic2"><i></i></span><span class="mpgt"><small>ĐI KÈM THẺ ID</small><b>Khung tròn + danh hiệu</b><em>Nhận cùng thẻ ID</em></span></div>','true')}
{sc('hasId','<div class="mpgf done"><span class="mpgb ic2 mok2"><i></i></span><span class="mpgt"><small>ĐÃ NHẬN · TRONG HỒ SƠ</small><b>Khung thẻ ID {{lockN}}</b><em>{{frameSt}}</em></span><button class="mpmini" onClick="{{goProf}}">Xem</button></div>')}
{sc('noPack','<button class="mpgf" onClick="{{claimPack}}"><span class="mpgb ic3"><i></i></span><span class="mpgt"><small>PACK KHAI MẠC</small><b>1 pack Urichinguchana</b><em>Chạm để nhận</em></span></button>','true')}
{sc('hasPack','<div class="mpgf done"><span class="mpgb ic3 mok2"><i></i></span><span class="mpgt"><small>ĐÃ LƯU VÀO SỰ KIỆN</small><b>1 pack Urichinguchana</b><em>Mở được từ 18/10</em></span></div>')}
<p class="mpsg">— Colentis</p></div><div style="height:90px"></div>'''
def top(t,back='',cls=''):
    b=f' onClick="{{{{{back}}}}}"' if back else ''
    return f'<div class="ptop {cls}"><button class="ibtn" aria-label="Quay lại"{b}>{ic("left")}</button><h1>{t}</h1></div>'
rows='<sc-for list="{{rows}}" as="r" hint-placeholder-count="5"><button class="wr {{r.cls}}" data-i="{{r.i}}" onClick="{{pickM}}"><span class="wav" style="--a:{{r.c}}">{{r.ini}}</span><span class="wnm"><b>{{r.n}}</b><small>{{r.sub}}</small></span><span class="wck">{{r.ck}}</span></button></sc-for>'
LIST=f'''<div class="page on">{top("Hòm thư")}<div class="pbody"><div class="mbxl" style="margin:0 16px 0 -14px;width:auto">
<button class="card-b mbxi {{{{newCls}}}}" onClick="{{{{openLetter}}}}"><span class="mbxt" style="background:#FFB02E">SỰ KIỆN MỚI</span><b>Mùa Concept mở từ 18/10</b><span class="mbxs">Gom thẻ, ghép panorama, 2 thẻ Ultra Limited. Kèm quà: thẻ ID, khung, 1 pack.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc {{{{badgeCls}}}}">{{{{badge}}}}</i></span></button>
<button class="card-b mbxi"><span class="mbxt" style="background:#B79CFF">SẮP TỚI</span><b>Sự kiện bí mật · 01/11</b><span class="mbxs">Chỉ biết nó liên quan đến Lịch.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc">Đã đọc</i></span></button>
</div><p class="mqhint">Bấm vào thư đầu tiên để mở</p></div></div>'''
LETTER=f'''<div class="page on">{top("Thư","back")}<div class="pbody" id="mpscroll">{POSTER}</div>{sc('showAll','<button class="mpfab" onClick="{{claimAll}}">Nhận quà · {{leftN}}</button>','true')}</div>'''
COLL=f'''<div class="page on">{top("Bộ sưu tập","back")}<div class="pbody"><div class="mptabs2"><span>Concept</span><span>Thẻ app</span><span class="on">Thẻ ID</span></div>
{sc('noId','<div class="mpemp"><b>Chưa có thẻ ID</b><span>Nhận thẻ ID trong thư sự kiện ở Hòm thư.</span></div>','true')}
{sc('hasId','<div class="mpctile"><button class="mpcbtn" onClick="{{openViewer}}"><span class="mpnew">MỚI</span>'+FR('l',front)+'</button><div class="mpcap"><b>Thẻ ID Colentis · {{lockN}}</b><span>Chạm vào thẻ để chỉnh: thêm ảnh, nhập tên.</span></div><div class="mpchk"><span class="{{okPh}}">Ảnh</span><span class="{{okNm}}">Tên</span><span class="{{okFr}}">Khung</span></div></div>')}
<div class="mpcl"><small>CONCEPT · MỞ TỪ 18/10</small><div><i>?</i><i>?</i><i>?</i><i>?</i><i>?</i></div></div></div></div>'''
VIEW=f'''<div class="page on mpdark">{top("Thẻ ID của bạn","goCol","mpdk")}<div class="pbody">
<div class="mpvs">{FR('vf',front)}{FR('vb',back)}</div><div class="mpfl"><button onClick="{{flipC}}">{{{{flipTxt}}}}</button></div>
<div class="mped"><h3>Hoàn thiện thẻ</h3><div class="mppr"><i style="width:{{{{prog}}}}%"></i></div>
<div class="mpstp"><div class="mpsh"><b><i class="{{{{okPh}}}}">1</i> Ảnh của bạn</b><small>Khung 3:4</small></div>
<div class="mpbt"><label class="mpbtn" for="mpfile">Chọn ảnh từ điện thoại</label><button class="mpbtn gh" onClick="{{{{samplePh}}}}">Ảnh mẫu</button>{sc('hasPh','<button class="mpbtn gh" onClick="{{{{clearPh}}}}">Xóa</button>')}<input id="mpfile" type="file" accept="image/*" onChange="{{{{onFile}}}}" style="display:none"></div>
{sc('hasPh','<div class="mpsl2"><label>Phóng<input type="range" min="1" max="3" step="0.05" value="{{{{pz}}}}" onInput="{{{{onZ}}}}"></label><label>Ngang<input type="range" min="0" max="100" step="1" value="{{{{px}}}}" onInput="{{{{onX}}}}"></label><label>Dọc<input type="range" min="0" max="100" step="1" value="{{{{py}}}}" onInput="{{{{onY}}}}"></label></div>')}</div>
<div class="mpstp"><div class="mpsh"><b><i class="{{{{okNm}}}}">2</i> Tên chủ thẻ</b><small>Hiện ở mặt sau</small></div><input class="mpinp" value="{{{{holder}}}}" placeholder="Nhập tên của bạn" maxlength="20" onChange="{{{{onHolder}}}}"></div>
<div class="mpstp"><div class="mpsh"><b><i class="mok">3</i> Mã Spotify</b><small>Đã gắn sẵn</small></div><p class="mpd" style="margin:0">Mã dưới tên là bài <b>{{{{song}}}}</b>. Mở Spotify, chạm thanh tìm kiếm, chọn biểu tượng máy ảnh rồi quét mã trên thẻ.</p><button class="mpbtn gh" style="margin-top:10px" onClick="{{{{scan}}}}">Thử quét mã</button></div>
{sc('unlock','<div class="mpunl2"><b>Khung đã mở</b><span>Khung tròn và danh hiệu đã vào Hồ sơ của bạn.</span><button class="mpgo sm" onClick="{{{{goProf}}}}">Xem trong Hồ sơ</button></div>')}
{sc('lockF','<div class="mpunl2 off"><b>Còn thiếu để mở khung</b><span>{{{{missing}}}}</span></div>')}
</div></div></div>'''
PROF=f'''<div class="page on">{top("Hồ sơ","back")}<div class="pbody"><div class="mppf">
<div class="mpav">{FR('f',ifx)}{sc('lockF','<div class="mpav0"><div class="mpav1">'+sc('hasPh','<img src="{{phSrc}}" alt="" style="object-position:{{phPos}};transform:scale({{pz}})">')+sc('noPh','<span class="mpsil">'+SIL+'</span>','true')+'</div><span class="mplkb">KHUNG ĐANG KHÓA</span></div>')}</div>
<h2 class="mpnm">{{{{pname}}}}</h2>
<div class="mpttl">{sc('unlock',FR('l',lambda k:fv(PT['ittl'][k])))}{sc('lockF','<span class="mpttl0">Danh hiệu chưa mở</span>')}</div>
<p class="mpsub">Người kia thấy khung này quanh ảnh và danh hiệu dưới tên bạn.</p></div>
<div class="mpcard"><small>KHUNG THẺ ID · {{{{lockN2}}}}</small><ul class="mpcl2"><li class="{{{{okId}}}}"><i></i>Có thẻ ID, gán thành viên</li><li class="{{{{okPh}}}}"><i></i>Thêm ảnh trên thẻ</li><li class="{{{{okNm}}}}"><i></i>Nhập tên chủ thẻ</li></ul><button class="mpgo sm" onClick="{{{{openViewer}}}}">Chỉnh thẻ ID</button></div>
<div class="mpcard"><small>KHUNG CONCEPT · MỞ TỪ 18/10</small><div class="mpfr3"><span style="--c:#FFB02E"><i></i>Urichi</span><span style="--c:#FF2E88"><i></i>Aniyaaa</span><span style="--c:#4CC9FF"><i></i>Poyoyoi</span></div></div></div></div>'''
SHEET=f'''<div class="bd on" onClick="{{{{closeSheet}}}}"></div><div class="sheet on" style="visibility:visible;transform:none;max-height:94%">
<h3 style="font-size:19px;margin:6px 0 4px">{{{{shTitle}}}}</h3><p class="sub" style="margin:0 0 10px">{{{{shSub}}}}</p>
{sc('anyC','<div style="position:relative">'+sc('hasId','<div class="mpbs mpbs2">'+BURST+'</div>')+FR('c',front)+'</div>')}
{sc('noC','<div class="mpidc" style="width:84%;margin:0 auto">'+BLANK+'</div>','true')}
{sc('picking','<div class="whol" style="margin-top:12px">'+rows+'</div>','true')}
<button class="igo {{{{okCls}}}}" onClick="{{{{confirm}}}}">{{{{okTxt}}}}</button></div>'''
REVEAL=f'''<div class="mprv"><div class="mprays"></div><div class="mpbs">{BURST}</div>
{sc('rvId','<div class="mprvc mpin"><div class="mpglow"></div>'+BLANK+'</div><small class="mprk">QUÀ KHAI MẠC · THẺ ĐẶC BIỆT</small><b class="mprh">Thẻ ID Colentis</b><p class="mprt">Thẻ trống của riêng bạn. Chọn một thành viên CORTIS để gán, rồi thêm ảnh và tên. Khung tròn và danh hiệu đi kèm.</p><button class="mpgo" onClick="{{{{toSheet}}}}">Chọn thành viên</button>')}
{sc('rvPack','<div class="mppack mpin"><div class="mpglow"></div><span>URICHINGUCHANA</span><b>PACK</b><em>5 thẻ</em><i class="mpshine"></i></div><small class="mprk">QUÀ KHAI MẠC</small><b class="mprh">1 pack Urichinguchana</b><p class="mprt">Sẽ lưu vào mục Sự kiện để bạn mở từ ngày mai, 18/10.</p><button class="mpgo" onClick="{{{{takePack}}}}">Lưu vào Sự kiện</button>')}</div>'''
TPL=M.b10.SPRITE+f'''<div class="rapp" style="width:{W}px;height:{Hh}px;padding:26px 40px;display:flex;flex-direction:column;align-items:center;gap:14px;background:#cfd3f8;background-image:radial-gradient(500px 400px at 15% 0,#d9d4ff,transparent),radial-gradient(500px 500px at 100% 100%,#ffd1ea,transparent)">
<div class="phone" style="width:390px;max-width:390px;height:844px;flex:none;border-radius:32px;box-shadow:0 0 0 8px #14123F,0 30px 60px rgba(20,18,63,.4);position:relative"><div class="sbsp"></div>
{sc('isList',LIST,'true')}{sc('isLetter',LETTER)}{sc('isColl',COLL)}{sc('isView',VIEW)}{sc('isProf',PROF)}
{sc('sheet',SHEET)}{sc('rv',REVEAL)}{sc('toast','<div class="mqtoast">{{toast}}</div>')}</div>
<div class="mpnav"><button class="{{{{n0}}}}" onClick="{{{{goList}}}}">Hòm thư</button><button class="{{{{n1}}}}" onClick="{{{{goCol}}}}">Bộ sưu tập</button><button class="{{{{n2}}}}" onClick="{{{{goProf}}}}">Hồ sơ</button><button class="rs" onClick="{{{{reset}}}}">Chơi lại</button></div></div>'''.replace('{{{{','{{').replace('}}}}','}}')
EXTRA2=r'''
.rapp .mpgb{overflow:hidden}
.rapp .mpgb.ic1{background:linear-gradient(150deg,#1E1B5E,#4b3f9c)}.rapp .mpgb.ic1 i{position:static;width:34px;height:24px;margin:0;border-radius:5px;background:#f6f0e4;box-shadow:inset 0 7px 0 #FF4FA3}.rapp .mpgb.ic1:before{display:none}
.rapp .mpgb.ic2{background:linear-gradient(150deg,#1E1B5E,#3a2a8c)}.rapp .mpgb.ic2 i{position:static;width:30px;height:30px;margin:0;border-radius:50%;background:transparent;border:5px solid #FFE45E;box-shadow:0 0 0 2px #FF4FA3}.rapp .mpgb.ic2:before{display:none}
.rapp .mpgb.ic3 i{position:static;width:30px;height:40px;margin:0;border-radius:5px;background:#fff;opacity:.9}.rapp .mpgb.ic3:before{display:none}
.rapp .mpgb.mok i,.rapp .mpgb.mok:before{display:none}
.rapp .mpgb.mok2{background:#35D0A5}.rapp .mpgb.mok2 i{opacity:.35}
.rapp .mpgf.lock{opacity:.55;animation:none;box-shadow:0 0 0 2px var(--line);background:var(--paper);cursor:default}
.rapp .mpgf .mpmini{margin-left:auto}
.rapp .mpsl.mq i{aspect-ratio:3/4;display:grid;place-items:center;background:linear-gradient(160deg,#1b1650,#0b0a24);color:rgba(255,255,255,.55);font:800 15px 'Unbounded',sans-serif;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.25);font-style:normal}
.rapp .mpidc{width:86%;margin:16px auto 6px;filter:drop-shadow(0 10px 18px rgba(30,27,94,.3))}
.rapp .mpids{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-direction:column;gap:12px}
.rapp .mpids li{display:grid;grid-template-columns:28px 1fr;gap:12px;font:600 13px/1.55 'Be Vietnam Pro'}
.rapp .mpids li>i{font-style:normal;width:28px;height:28px;border-radius:50%;background:#ff2e88;color:#fff;display:grid;place-items:center;font:900 13px 'Be Vietnam Pro'}
.rapp .mpids b{display:block;font:800 14px 'Be Vietnam Pro'}
.rapp .mpspo{display:flex;align-items:center;gap:3px;height:34px;margin-top:8px;padding:0 12px;width:max-content;border-radius:10px;background:#1DB954;font-style:normal}
.rapp .mpspo u{width:3px;border-radius:2px;background:#111;height:10px;animation:mpbar 1s ease-in-out infinite}
.rapp .mpspo u:nth-child(odd){height:18px;animation-delay:-.4s}.rapp .mpspo u:nth-child(3n){height:24px;animation-delay:-.7s}
@keyframes mpbar{50%{transform:scaleY(.5)}}
.rapp .mpunl{margin-top:16px;padding:12px 14px;border-radius:14px;background:linear-gradient(120deg,rgba(255,228,94,.35),rgba(255,46,136,.16));font:600 13px/1.5 'Be Vietnam Pro'}
.rapp .mptabs2{display:flex;gap:8px;padding:6px 18px 14px}.rapp .mptabs2 span{padding:8px 16px;border-radius:99px;background:var(--paper);border:1.5px solid var(--line);font:800 12.5px 'Be Vietnam Pro';color:var(--soft)}.rapp .mptabs2 .on{background:#1E1B5E;color:#fff;border-color:#1E1B5E}
.rapp .mpctile{margin:0 18px;padding:16px;border-radius:22px;background:var(--paper);border:1.5px solid var(--line);box-shadow:0 8px 22px rgba(30,27,94,.1)}
.rapp .mpcbtn{position:relative;display:block;width:100%;border:0;padding:0;background:none;cursor:pointer;text-align:left}.rapp .mpcbtn .idw{pointer-events:none}
.rapp .mpnew{position:absolute;z-index:3;top:-10px;right:-6px;padding:4px 10px;border-radius:99px;background:#ff2e88;color:#fff;font:900 10px 'Be Vietnam Pro';letter-spacing:.12em;box-shadow:0 4px 10px rgba(255,46,136,.5)}
.rapp .mpcap b{display:block;margin-top:14px;font:800 15px 'Be Vietnam Pro'}.rapp .mpcap span{display:block;margin-top:3px;font:600 12.5px/1.5 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpchk{display:flex;gap:8px;margin-top:12px}.rapp .mpchk span{padding:6px 12px;border-radius:99px;font:800 11.5px 'Be Vietnam Pro';background:var(--line);color:var(--soft)}.rapp .mpchk span.mok{background:rgba(53,208,165,.2);color:#0b7a5c}
.rapp .mpemp{margin:10px 18px;padding:26px;border-radius:20px;border:2px dashed var(--line);text-align:center}.rapp .mpemp b{display:block;font:800 15px 'Be Vietnam Pro'}.rapp .mpemp span{display:block;margin-top:6px;font:600 13px 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpcl{margin:18px 18px 0}.rapp .mpcl small{font:800 10.5px 'Be Vietnam Pro';letter-spacing:.16em;color:var(--soft)}.rapp .mpcl div{display:flex;gap:6px;margin-top:8px}.rapp .mpcl i{flex:1;aspect-ratio:3/4;border-radius:8px;background:linear-gradient(160deg,#1b1650,#0b0a24);display:grid;place-items:center;color:rgba(255,255,255,.5);font:800 13px 'Unbounded';font-style:normal}
.rapp .mpdark{background:#14123F;color:#fff}.rapp .mpdark .ptop h1{color:#fff}.rapp .mpdark .ibtn{background:rgba(255,255,255,.12);color:#fff;border-color:transparent}
.rapp .mpvs{padding:6px 22px 0}.rapp .mpvs .idw{filter:drop-shadow(0 14px 24px rgba(0,0,0,.5))}
.rapp .mpfl{text-align:center;margin:12px 0}.rapp .mpfl button{border:1.5px solid rgba(255,255,255,.4);background:transparent;color:#fff;border-radius:99px;padding:8px 18px;font:800 12.5px 'Be Vietnam Pro';cursor:pointer}
.rapp .mped{background:var(--sleeve);color:var(--ink);border-radius:26px 26px 0 0;padding:18px 18px 40px}
.rapp .mped h3{margin:0;font:800 18px 'Be Vietnam Pro'}
.rapp .mppr{height:8px;border-radius:99px;background:var(--line);margin:10px 0 14px;overflow:hidden}.rapp .mppr i{display:block;height:100%;background:linear-gradient(90deg,#FFB02E,#ff2e88);transition:width .3s}
.rapp .mpstp{padding:14px;margin-bottom:10px;border-radius:18px;background:var(--paper);border:1.5px solid var(--line)}
.rapp .mpsh{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.rapp .mpsh b{display:flex;align-items:center;gap:8px;font:800 14px 'Be Vietnam Pro'}.rapp .mpsh small{font:700 11.5px 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpsh i{font-style:normal;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--line);color:var(--soft);font:900 11px 'Be Vietnam Pro'}.rapp .mpsh i.mok{background:#35D0A5;color:#fff}
.rapp .mpbt{display:flex;gap:8px;flex-wrap:wrap}
.rapp .mpbtn{border:0;border-radius:12px;padding:10px 14px;background:#ff2e88;color:#fff;font:800 12.5px 'Be Vietnam Pro';cursor:pointer;display:inline-block}.rapp .mpbtn.gh{background:var(--line);color:var(--ink)}
.rapp .mpsl2{margin-top:12px;display:flex;flex-direction:column;gap:6px}.rapp .mpsl2 label{display:grid;grid-template-columns:52px 1fr;align-items:center;font:700 12px 'Be Vietnam Pro';color:var(--soft)}.rapp .mpsl2 input{accent-color:#ff2e88}
.rapp .mpinp{width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);font:700 15px 'Be Vietnam Pro';background:#fff;color:var(--ink)}
.rapp .mpunl2{padding:16px;border-radius:18px;background:linear-gradient(120deg,rgba(53,208,165,.25),rgba(255,228,94,.3));text-align:center}.rapp .mpunl2 b{display:block;font:800 16px 'Be Vietnam Pro'}.rapp .mpunl2 span{display:block;margin-top:4px;font:600 12.5px 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpunl2.off{background:var(--line)}
.rapp .mpgo.sm{margin-top:12px;padding:12px 24px;font-size:14px}
.rapp .mppf{padding:6px 18px 0;text-align:center}
.rapp .mpav{display:grid;place-items:center;min-height:220px}
.rapp .mpav .ifx{margin:auto}
.rapp .mpnm{margin:4px 0 0;font:800 24px 'Be Vietnam Pro'}
.rapp .mpttl{margin-top:8px;display:flex;justify-content:center}
.rapp .mpttl0{padding:7px 14px;border-radius:99px;border:1.5px dashed var(--line);font:700 12px 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpsub{margin:10px 0 0;font:600 12.5px/1.5 'Be Vietnam Pro';color:var(--soft)}
.rapp .mpdark .pbody{padding-bottom:0;display:flex;flex-direction:column}.rapp .mped{flex:1 0 auto}
.rapp .mpav0{margin-bottom:14px;position:relative;width:150px;height:150px}.rapp .mpav1{width:150px;height:150px;border-radius:50%;overflow:hidden;background:#cfc8f7;display:grid;place-items:center;filter:grayscale(.6)}.rapp .mpav1 img{width:100%;height:100%;object-fit:cover}
.rapp .mplkb{position:absolute;left:50%;bottom:-8px;translate:-50% 0;padding:5px 10px;border-radius:99px;background:#1E1B5E;color:#fff;font:800 9.5px 'Be Vietnam Pro';letter-spacing:.12em;white-space:nowrap}
.rapp .mpsil,.rapp .mpsilv{display:block;width:100%;height:100%;color:#8c84cf}.rapp .mpsil{display:grid;place-items:end center;background:#d9d4ff}.rapp .mpsil .mpsilv{width:70%;height:80%}
.rapp .mpcard{margin:14px 18px 0;padding:16px;border-radius:20px;background:var(--paper);border:1.5px solid var(--line)}
.rapp .mpcard small{display:block;font:800 10.5px 'Be Vietnam Pro';letter-spacing:.16em;color:#ff2e88}
.rapp .mpcl2{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:8px;font:700 13.5px 'Be Vietnam Pro'}.rapp .mpcl2 li{display:flex;align-items:center;gap:10px;color:var(--soft)}.rapp .mpcl2 li i{width:18px;height:18px;border-radius:50%;border:2px solid var(--line)}.rapp .mpcl2 li.mok{color:var(--ink)}.rapp .mpcl2 li.mok i{background:#35D0A5;border-color:#35D0A5}
.rapp .mpfr3{display:flex;gap:10px;margin-top:12px}.rapp .mpfr3 span{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;font:800 11px 'Be Vietnam Pro';color:var(--soft)}.rapp .mpfr3 i{width:54px;height:54px;border-radius:50%;border:4px solid var(--c);opacity:.45;background:var(--line)}
.rapp .mpnav{display:flex;gap:8px}.rapp .mpnav button{border:0;border-radius:12px;padding:10px 14px;background:rgba(30,27,94,.12);color:#1E1B5E;font:800 12.5px 'Be Vietnam Pro';cursor:pointer}.rapp .mpnav button.on{background:#1E1B5E;color:#fff}.rapp .mpnav .rs{background:#ff2e88;color:#fff}
.rapp .mpbs i{opacity:0}
'''
DDCSS=''.join(f'.rapp img.{k}{{content:url("{v}")}}\n' for k,v in IMG.items())
JS='''var MEM=%s;
function nm(m){return m[0].charAt(0)+m[0].slice(1).toLowerCase();}
class Component extends DCLogic {
  renderVals() {
    var self=this,t=self.state||{},V={};
    var scr=t.scr||0,sheet=!!t.sheet,sel=t.sel==null?-1:t.sel,lock=t.lock==null?-1:t.lock,pack=!!t.pack,toast=t.toast||'';
    var ph=t.ph||'',pz=t.pz||1,px=t.px==null?50:t.px,py=t.py==null?50:t.py,holder=t.holder||'',flip=!!t.flip;
    var hasId=lock>=0, show=sheet?(hasId?lock:sel):-1;
    var okPh=hasId&&!!ph, okNm=hasId&&holder.trim().length>0, unlock=okPh&&okNm;
    V.isList=scr===0;V.isLetter=scr===1;V.isColl=scr===2;V.isView=scr===3;V.isProf=scr===4;V.sheet=sheet;V.toast=toast;
    V.n0=scr<=1?'on':'';V.n1=(scr===2||scr===3)?'on':'';V.n2=scr===4?'on':'';
    V.newCls=t.read?'':'new';
    var left=(hasId?0:2)+(pack?0:1);
    V.badge=left?left+' quà chưa nhận':'Đã nhận hết';V.badgeCls=left?'rw':'';
    V.leftN=left;V.showAll=left>0;
    V.noId=!hasId;V.hasId=hasId;V.noPack=!pack;V.hasPack=pack;
    V.lockN=hasId?nm(MEM[lock]):'';V.lockN2=hasId?nm(MEM[lock]).toUpperCase():'CHƯA GÁN';V.lockC=hasId?MEM[lock][4]:'#999';V.song=hasId?MEM[lock][3]:'';
    for(var i=0;i<5;i++){V['c'+i]=show===i;V['l'+i]=lock===i;V['f'+i]=lock===i&&unlock;V['vf'+i]=lock===i&&!flip;V['vb'+i]=lock===i&&flip;}
    V.anyC=show>=0;V.noC=show<0;V.picking=!hasId;
    V.shTitle=hasId?'Đã gán thẻ ID cho '+V.lockN:'Gán thẻ ID cho ai?';
    V.shSub=hasId?'Thẻ đã vào bộ sưu tập, khung đã vào Hồ sơ.':(sel<0?'Chọn một thành viên. Chọn xong là khóa, không đổi được.':'Thẻ tự điền thông tin của thành viên đã chọn.');
    V.okTxt=hasId?'Xong':(sel<0?'Chọn một thành viên':'Xác nhận · gán cho '+nm(MEM[sel]));
    V.okCls=(!hasId&&sel<0)?'off':'';
    V.rows=MEM.map(function(m,i){return{i:i,c:m[4],ini:m[5],n:nm(m)+' · '+m[1],sub:'Sinh '+m[2]+' · Bài đại diện: '+m[3],cls:i===sel?'on':'',ck:i===sel?'✓':''};});
    V.rv=!!t.rv;V.rvId=t.rv==='id';V.rvPack=t.rv==='pack';
    V.hasPh=!!ph;V.noPh=!ph;V.phSrc=ph;V.phPos=px+'%% '+py+'%%';V.pz=pz;V.px=px;V.py=py;V.holder=holder;
    V.okPh=okPh?'mok':'';V.okNm=okNm?'mok':'';V.okFr=unlock?'mok':'';V.okId=hasId?'mok':'';
    V.unlock=unlock;V.lockF=!unlock;
    V.prog=Math.round(((hasId?1:0)+(okPh?1:0)+(okNm?1:0))/3*100);
    V.missing=!hasId?'Cần nhận thẻ ID trước.':(!okPh&&!okNm?'Thêm ảnh và nhập tên chủ thẻ.':(!okPh?'Thêm ảnh trên thẻ.':'Nhập tên chủ thẻ.'));
    V.frameSt=unlock?'Đã mở, đang dùng ở Hồ sơ':'Mở khi thẻ có ảnh và tên';
    V.flipTxt=flip?'Xem mặt trước':'Lật thẻ xem mặt sau';
    V.pname=holder.trim()||'Tên của bạn';
    function flash(s){self.setState({toast:s});setTimeout(function(){self.setState({toast:''});},2400);}
    V.openLetter=function(){self.setState({scr:1,read:true});};
    V.back=function(){self.setState({scr:0});};
    V.goList=function(){self.setState({scr:0,sheet:false,rv:null});};
    V.goCol=function(){self.setState({scr:2,sheet:false,rv:null,flip:false});};
    V.goProf=function(){self.setState({scr:4,sheet:false,rv:null});};
    V.openViewer=function(){self.setState({scr:3,flip:false});};
    V.flipC=function(){self.setState({flip:!flip});};
    V.giftId=function(){self.setState({rv:'id'});};
    V.toSheet=function(){self.setState({rv:null,sheet:true,sel:-1});};
    V.takePack=function(){self.setState({rv:null,pack:true});flash('Pack đã lưu vào Sự kiện, mở từ 18/10');};
    V.closeSheet=function(){self.setState({sheet:false});};
    V.pickM=function(e){var el=e.target&&e.target.closest?e.target.closest('[data-i]'):e.currentTarget;self.setState({sel:Number(el.getAttribute('data-i'))});};
    V.confirm=function(){
      if(lock>=0){self.setState({sheet:false});flash('Thẻ vào Bộ sưu tập, khung vào Hồ sơ');return;}
      if(sel<0)return;
      self.setState({lock:sel});};
    V.claimPack=function(){self.setState({rv:'pack'});};
    V.claimAll=function(){if(lock<0)self.setState({rv:'id'});else if(!pack)self.setState({rv:'pack'});};
    V.samplePh=function(){self.setState({ph:SAMPLE,pz:1,px:50,py:50});};
    V.clearPh=function(){self.setState({ph:''});};
    V.onFile=function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){self.setState({ph:r.result,pz:1,px:50,py:50});};r.readAsDataURL(f);};
    V.onZ=function(e){self.setState({pz:Number(e.target.value)});};
    V.onX=function(e){self.setState({px:Number(e.target.value)});};
    V.onY=function(e){self.setState({py:Number(e.target.value)});};
    V.onHolder=function(e){self.setState({holder:e.target.value});};
    V.scan=function(){flash('Đang mở Spotify để quét mã…');};
    V.reset=function(){self.setState({scr:0,read:false,sheet:false,sel:-1,lock:-1,pack:false,toast:'',rv:null,ph:'',holder:'',flip:false,pz:1,px:50,py:50});};
    return V;
  }
}
'''%json.dumps(MEM,ensure_ascii=False)
SAMPLE='data:image/svg+xml;utf8,'+__import__('urllib.parse').parse.quote('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e6ff"/><stop offset="1" stop-color="#b9b3f0"/></linearGradient></defs><rect width="900" height="1200" fill="url(#g)"/><circle cx="470" cy="470" r="190" fill="#3b2d6e"/><path d="M110 1200 C110 880 290 760 470 760 C650 760 830 880 830 1200Z" fill="#1E1B5E"/><path d="M400 760 L470 900 L540 760Z" fill="#fff"/><circle cx="470" cy="470" r="160" fill="#f2cfb8"/><path d="M300 450 C300 300 640 300 640 450 C600 380 380 380 300 450Z" fill="#2a1d4c"/></svg>')
JS="var SAMPLE='"+SAMPLE+"';\n"+JS
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
{P.EXTRA}
{FCSS}
{EXTRA2}
{DDCSS}</style>
</helmet>
<div style="width:{W}px;height:{Hh}px;overflow:hidden;position:relative">
{TPL}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{W},"height":{Hh}}}}}'>
{JS}</script>
</body>
</html>
'''
open(OUT,'w',encoding='utf-8').write(html);print('size',len(html))
