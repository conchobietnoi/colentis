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
tpl=f'''{M.b10.SPRITE}<div class="rapp" style="width:{W}px;height:{Hh}px;padding:30px 40px;display:flex;flex-direction:column;align-items:center;gap:18px;background:#cfd3f8;background-image:radial-gradient(500px 400px at 15% 0,#d9d4ff,transparent),radial-gradient(500px 500px at 100% 100%,#ffd1ea,transparent)">
<div class="phone" style="width:390px;max-width:390px;height:844px;flex:none;border-radius:32px;box-shadow:0 0 0 8px #14123F,0 30px 60px rgba(20,18,63,.4);position:relative"><div class="sbsp"></div>
<sc-if value="{{{{isList}}}}" hint-placeholder-val="true"><div class="page on">{top("Hòm thư")}<div class="pbody"><div class="mbxl" style="margin:0 16px 0 -14px;width:auto">
<button class="card-b mbxi {{{{newCls}}}}" onClick="{{{{openLetter}}}}"><span class="mbxt" style="background:#FFB02E">SỰ KIỆN MỚI</span><b>Mùa Concept mở từ 18/10</b><span class="mbxs">Gom thẻ, ghép panorama, nhận thẻ Ultra Limited. Kèm quà thẻ ID Colentis.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc {{{{badgeCls}}}}">{{{{badge}}}}</i></span></button>
<button class="card-b mbxi"><span class="mbxt" style="background:#B79CFF">SẮP TỚI</span><b>Sự kiện bí mật · 01/11</b><span class="mbxs">Chỉ biết nó liên quan đến Lịch.</span><span class="mbxf"><em>Colentis · 17/10</em><i class="mbxc">Đã đọc</i></span></button>
</div><p class="mqhint">Bấm vào thư đầu tiên để mở</p></div></div></sc-if>
<sc-if value="{{{{isLetter}}}}" hint-placeholder-val="false"><div class="page on">{top("Thư","back")}<div class="pbody">{intro.split('</div></div>',0)[0]}{gifts}</div></div></div></sc-if>
<sc-if value="{{{{sheet}}}}" hint-placeholder-val="false"><div class="bd on" onClick="{{{{closeSheet}}}}"></div><div class="sheet on" style="visibility:visible;transform:none;max-height:94%">
<h3 style="font-size:19px;margin:6px 0 4px">{{{{shTitle}}}}</h3><p class="sub" style="margin:0 0 10px">{{{{shSub}}}}</p>
<sc-if value="{{{{anyC}}}}" hint-placeholder-val="false">{cards}</sc-if>
<sc-if value="{{{{noC}}}}" hint-placeholder-val="true"><div class="mqprev">{C['blank']}</div></sc-if>
<sc-if value="{{{{picking}}}}" hint-placeholder-val="true"><div class="whol" style="margin-top:12px">{rows}</div></sc-if>
<button class="igo {{{{okCls}}}}" onClick="{{{{confirm}}}}">{{{{okTxt}}}}</button></div></sc-if>
<sc-if value="{{{{toast}}}}" hint-placeholder-val="false"><div class="mqtoast">{{{{toast}}}}</div></sc-if>
</div>
<button class="mqreset" onClick="{{{{reset}}}}">Chơi lại từ đầu</button></div>'''
# intro: hero + mqb open (content), need to close mqb after gifts
tpl=tpl.replace(intro.split('</div></div>',0)[0]+gifts, intro+gifts)
EXTRA='''
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
    V.openSheet=function(){self.setState({sheet:true,sel:-1});};
    V.closeSheet=function(){self.setState({sheet:false});};
    V.pickM=function(e){var el=e.target&&e.target.closest?e.target.closest('[data-i]'):e.currentTarget;self.setState({sel:Number(el.getAttribute('data-i'))});};
    V.confirm=function(){
      if(lock>=0){self.setState({sheet:false});return;}
      if(sel<0)return;
      self.setState({lock:sel});flash('Đã gán thẻ ID cho '+MEM[sel][0].charAt(0)+MEM[sel][0].slice(1).toLowerCase());};
    V.claimPack=function(){self.setState({pack:true});flash('Đã nhận 1 pack Urichinguchana');};
    V.claimAll=function(){if(!pack)self.setState({pack:true});if(lock<0)self.setState({sheet:true,sel:-1});else flash('Đã nhận hết quà');};
    V.reset=function(){self.setState({scr:0,read:false,sheet:false,sel:-1,lock:-1,pack:false,toast:''});};
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
