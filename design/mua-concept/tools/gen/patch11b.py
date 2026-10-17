t=open('b10_js.js',encoding='utf-8').read()
a="p: h / RAR[r].tot * 100 };"
t=t.replace(a,"p: (h / RAR[r].tot * 100) + '%' };")
open('b10_js.js','w',encoding='utf-8').write(t)

s=open('b10.py',encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a)
    assert c>=1 and (n==0 or c==n),(a[:90],c)
    s=s.replace(a,b)
rep("""<small class="kmk">THẺ {{shNo}}/5 · {{shKind}}</small>""","""<small class="kmk">THẺ {{shNo}}/{{shTot}} · {{shKind}}</small>""")
rep("""<b class="rvt {{rvCls}}">HOLO!</b>""","""<b class="rvt {{rvCls}}">{{rvTxt}}</b>""")
rep("""<div class="df {{flipCls}} {{popCls}}" onClick="{{flipCard}}" style="margin:8px auto">""","""<div class="df {{flipCls}} {{popCls}}" onClick="{{flipCard}}" style="margin:8px auto;{{dfSt}}">""")
rep("""+sif('showHolo',dyn_h())+'''</div><div class="dfb">'''+BACKS+'''</div></div>""","""+sif('showHolo',dyn_h())+sif('showApp',APPCARD)+'''</div><div class="dfb">'''+BACKS+sif('bkApp',APPBACK)+'''</div></div>""",2)
rep("✓ 1 pack thẻ thường tặng kèm","✓ 1 pack thưởng: thẻ Thường, Hiếm, Huyền Thoại, Bá khí")
rep(" Mở pack tặng</button>"," Mở pack thưởng</button>")
rep("<span>mở quà concept</span>","<span>nhận pack thưởng</span>")
rep("BACKS=''\n","""APPCARD='<div class="apw"><div class="pc {{appCls}}" style="{{appVars}}"><div class="pc-glow"></div><div class="pc-fx"><i class="ringx" style="--l:0s;--d:3s"></i><i class="ringx" style="--l:1.4s;--d:3s"></i></div><span class="pc-tag">{{appTag}}</span><div class="pc-frame"><div class="pc-face"><img src="{{appImg}}" alt="x"></div></div></div></div>'
APPBACK='<div class="apk"><i></i><b>COLENTIS</b><small>{{appTag}}</small></div>'
BACKS=''
""")
rep("""<div class="sec"><span>Panorama</span><small>{{panoState}}</small></div>""","""<div class="sec"><span>Trao đổi với người kia</span><small>thẻ trùng để tặng</small></div>
 <div class="gx">'''+sif('hasSpare','<div class="gxl"><small>Bản dư của bạn</small><sc-for list="{{spare}}" as="g" hint-placeholder-count="2"><div class="gxr {{g.ho}}"><img src="{{g.img}}" alt="x"><span><b>{{g.nm}} · {{g.k}}</b><em>{{g.x}}{{g.ask}}</em></span><button class="gxb" data-i="{{g.i}}" onClick="{{giftTo}}">Tặng</button></div></sc-for></div>')+sif('noSpare','<p class="gxe">Chưa có bản dư để tặng. Thẻ trùng sẽ hiện ở đây.</p>','true')+sif('hasMiss','<div class="gxl"><small>Đang thiếu · bấm để xin người kia</small><div class="gxms"><sc-for list="{{missL}}" as="m" hint-placeholder-count="3"><button class="gxm {{m.cls}}" data-i="{{m.i}}" onClick="{{askCard}}">{{m.nm}} <i>{{m.k}}</i> <b>{{m.t}}</b></button></sc-for></div></div>')+'''</div>
 <div class="sec"><span>Panorama</span><small>{{panoState}}</small></div>""")
APPSEC = """''','true')+sif('colApp','''<div class="sec"><span style="display:flex;gap:8px;align-items:center"><i style="width:11px;height:11px;border-radius:50%;background:linear-gradient(135deg,#8D94B8,#2F8CFF,#9B5CFF,#FF2E88)"></i>Thẻ app · từ pack thưởng</span></div>
 <div class="rbar" style="margin-top:2px"><sc-for list="{{appRows}}" as="r" hint-placeholder-count="4"><div style="--rc:{{r.a}}"><b>{{r.v}}</b>{{r.n}}<div class="bar"><i style="width:{{r.p}}"></i></div></div></sc-for></div>
 <div class="sec"><span>Mới nhận</span></div>
 '''+sif('hasRecent','<div class="aprc"><sc-for list="{{appRecent}}" as="c" hint-placeholder-count="4"><div class="pc thumb {{c.cls}}" style="--w:{{c.w}}px;--ar:{{c.ar}}"><div class="pc-glow"></div><span class="pc-tag">{{c.tag}}</span><div class="pc-frame"><div class="pc-face"><img src="{{c.img}}" alt="x"></div></div></div></sc-for></div>')+sif('noRecent','<div class="empty"><div class="ei">'+ic('gift')+'</div>Chưa có thẻ app. Hoàn thành một concept để nhận pack thưởng.</div>','true')+'''
 <div class="sub" style="padding:8px 16px">Mỗi lần hoàn thành một concept, bạn nhận 1 pack thưởng: 5 thẻ Thường, Hiếm, Huyền Thoại hoặc Bá khí của kho thẻ app (70 / 22 / 7 / 1%).</div>''')+sif('colLocked',"""
rep("""''','true')+sif('colLocked',""",APPSEC)
GF="""sif('hasGift','<button class="gfc" onClick="{{giftOpen}}">'+ic('gift')+'<span><b>Người kia gửi bạn {{giftN}} thẻ</b><small>{{giftTxt}}</small></span><em>Nhận quà</em></button>')+"""
rep(""" '''+TASKS_BLOCK+sif('hasPacks','<button class="claimcta\"""",""" '''+"""+GF+"""TASKS_BLOCK+sif('hasPacks','<button class="claimcta\"""")
rep("""  <div class="hxt" style="--kc:{{dayA}}">""","""  '''+"""+GF+"""'''<div class="hxt" style="--kc:{{dayA}}">""")
rep("""<button class="cpb" onClick="{{addFree}}">+1 pack ngày bù</button>""","")
rep("""{{addBonus}}">+1 pack tặng</button>""","""{{addBonus}}">+1 pack thưởng (thẻ app)</button>""")
rep("Mốc 16/10 và 27/10 để thử trạng thái trước và sau sự kiện. Concept mở theo ngày: 17–19 là 1, 20–22 là 2, 23–25 là 3, 26 là ngày bù.","Sự kiện 17–25/10 (9 ngày). Mốc 16/10 và 26/10 để thử trạng thái trước và sau. Concept mở theo ngày: 17–19 là 1, 20–22 là 2, 23–25 là 3.")
PT = """ <div class="cs w2"><div class="cl"><b>12</b> NGƯỜI KIA (GIẢ LẬP) · TẶNG &amp; XIN THẺ</div>
  <div class="cpst">{{ptTxt}}</div>
  <div class="cpg" style="margin-top:8px"><button class="cpb gold" onClick="{{ptGift}}">Người kia tặng tôi 1 thẻ</button><button class="cpb" onClick="{{ptAsk}}">Người kia xin 1 thẻ của tôi</button><button class="cpb" onClick="{{ptPack}}">Cho người kia 1 pack</button><button class="cpb" onClick="{{ptReply}}">Người kia trả lời lời xin</button><button class="cpb red" onClick="{{ptClear}}">Xóa kho người kia</button></div>
  <p class="cpn">Bạn tặng thẻ trùng ở tab Thẻ. Ở đây giả lập phía người kia: gửi quà cho bạn, xin thẻ của bạn, mở pack để có bản dư rồi trả lời lời xin của bạn.</p>
 </div>

 <div class="cs w2"><div class="cl"><b>9</b>"""
rep(""" <div class="cs w2"><div class="cl"><b>9</b>""",PT)
open('b10.py','w',encoding='utf-8').write(s)
print('ok')
