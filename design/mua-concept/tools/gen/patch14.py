j=open('b10_js.js',encoding='utf-8').read()
p=open('b10.py',encoding='utf-8').read()
c=open('b10css.py',encoding='utf-8').read()
def rep(s,a,b,n=1):
    assert s.count(a)==n,(a[:60],s.count(a))
    return s.replace(a,b)
# ---- state
j=rep(j,"who: '', ws: {}, pts: 0\n};","who: '', ws: {}, pts: 0, mr: {}, mc: {}, mo: '', xm: []\n};")
j=rep(j,"function dayCon(d)","""var MAILS = [
  { id: 'm1', day: 1, tag: 'SỰ KIỆN MỚI', tc: '#FFB02E', title: 'Mùa Concept đã mở · 17–25/10', sum: 'Gom thẻ, ghép panorama, nhận 2 thẻ Ultra Limited.',
    body: ['Mùa Concept kéo dài 9 ngày với 3 concept: Urichinguchana (ngày 1–3), Aniyaaa (ngày 4–6) và Poyoyoi (ngày 7–9).',
      'Mỗi ngày hoàn thành nhiệm vụ của concept để nhận 2 pack, mỗi pack 5 thẻ. Thẻ nào của bạn thì bạn tự rút. Thẻ trùng thì tặng được cho bạn bè, và bạn cũng có thể xin thẻ còn thiếu.',
      'Đủ 5 thẻ thường: mở panorama, khung tròn, danh hiệu và 1 pack thưởng thẻ app. Đủ cả 3 concept: nhận 2 thẻ Ultra Limited, tự chọn bài hát cho mỗi thẻ.'],
    rw: { n: 1, con: 1, t: '1 pack Urichinguchana' } },
  { id: 'm2', day: 4, tag: 'MỞ KHÓA', tc: '#FF2E88', title: 'Aniyaaa đã lên sàn', sum: 'Concept thứ hai mở từ hôm nay.',
    body: ['Từ hôm nay đến ngày 6, nhiệm vụ hằng ngày cho pack của Aniyaaa. Concept cũ vẫn mở, bạn có thể gom nốt thẻ còn thiếu.'],
    rw: { n: 1, con: 2, t: '1 pack Aniyaaa' } },
  { id: 'm3', day: 7, tag: 'MỞ KHÓA', tc: '#4CC9FF', title: 'Poyoyoi · concept cuối', sum: 'Hoàn thành cả ba để nhận 2 thẻ Ultra.',
    body: ['Đây là concept cuối cùng của mùa. Hoàn thành cả ba concept để nhận 2 thẻ Ultra Limited có nhạc và video.'],
    rw: { n: 1, con: 3, t: '1 pack Poyoyoi' } },
  { id: 'm4', day: 1, tag: 'SẮP TỚI', tc: '#B79CFF', title: 'Sự kiện bí mật · 01/11', sum: 'Chỉ biết nó liên quan đến Lịch.',
    body: ['Sau Mùa Concept sẽ có sự kiện mới vào 01/11. Hiện chỉ biết nó liên quan đến Lịch.', 'Thông tin đầy đủ sẽ được gửi vào hòm thư này khi tới ngày.'], rw: null }
];
function dayCon(d)""")
# ---- renderVals: mailbox
mail_js = """
    /* hòm thư */
    var mrd = s.mr || {}, mcl = s.mc || {};
    var gSend = []; (s.inbox || []).forEach(function (q) { if (gSend.indexOf(q.f) < 0) gSend.push(q.f); });
    var LT = gSend.map(function (f) {
      var ks = (s.inbox || []).filter(function (q) { return q.f === f; }).map(function (q) { return q.k; });
      return { id: 'g:' + f, gift: true, f: f, tag: 'QUÀ TỪ BẠN BÈ', tc: '#FF4FA3', title: ptName(f) + ' gửi bạn ' + ks.length + ' thẻ', sum: ks.slice(0, 3).map(nmOf).join(', ') + (ks.length > 3 ? '…' : ''), from: ptName(f), day: s.day, ks: ks,
        body: ['' + ptName(f) + ' vừa tặng bạn ' + ks.length + ' thẻ:'].concat(ks.map(function (k) { return '• ' + nmOf(k); })), rw: { gift: true, t: ks.length + ' thẻ từ ' + ptName(f) } };
    });
    var evL = MAILS.filter(function (m) { return m.day <= s.day; }).concat(s.xm || []);
    evL = evL.map(function (m, i) { return { m: m, o: i }; }).sort(function (a, b) { return (b.m.day || 0) - (a.m.day || 0) || a.o - b.o; }).map(function (z) { return z.m; });
    LT = LT.concat(evL.map(function (m) { var o = {}; for (var k in m) o[k] = m[k]; o.from = o.from || 'Colentis'; return o; }));
    var mNeed = function (l) { return l.gift || (l.rw && !mcl[l.id]) || !mrd[l.id]; };
    var mailN = LT.filter(mNeed).length;
    V.mailN = mailN; V.mailDot = mailN > 0 ? 'grid' : 'none';
    V.openMail = function () { set({ pg: 'mail', mo: '', sheet: '', fx: '' }); };
    V.mailBack = function () { if ((st().mo || '')) set({ mo: '' }); else { stopAudio(); set({ pg: '', ust: 'idle', flipped: false }); } };
    var curL = null; LT.forEach(function (l) { if (l.id === s.mo) curL = l; });
    V.mailMain = !curL; V.mailLet = !!curL;
    V.mailHead = curL ? 'Thư' : 'Hòm thư';
    V.mailEmpty = LT.length ? '' : 'Chưa có thư nào.';
    V.mailList = LT.map(function (l, i) {
      var st1 = l.gift ? ['Chưa nhận', 'gift'] : (l.rw && !mcl[l.id]) ? ['Quà chưa nhận', 'rw'] : !mrd[l.id] ? ['Mới', 'nw'] : ['Đã đọc', ''];
      return { i: i, id: l.id, tag: l.tag, tc: l.tc, title: l.title, sum: l.sum, from: l.from, date: l.day ? (16 + l.day) + '/10' : '', st: st1[0], stCls: st1[1], cls: mNeed(l) ? 'new' : '' };
    });
    V.mailPick = function (e) { var i = idxOf(e), x = st(), l = LT[i]; if (!l) return; var r = cl(x.mr || {}); r[l.id] = true; set({ mo: l.id, mr: r }); };
    if (curL) {
      V.mTag = curL.tag; V.mTc = curL.tc; V.mTitle = curL.title; V.mFrom = curL.from; V.mDate = curL.day ? 'Ngày ' + curL.day + ' · ' + (16 + curL.day) + '/10' : '';
      V.mBody = curL.body.map(function (t) { return { t: t }; });
      var done = !curL.gift && curL.rw && mcl[curL.id];
      V.mHasR = !!curL.rw; V.mRTxt = curL.rw ? curL.rw.t : ''; V.mRCls = done ? 'off' : '';
      V.mRBtn = curL.gift ? 'Nhận ' + curL.ks.length + ' thẻ' : done ? 'Đã nhận quà' : 'Nhận quà';
    } else { V.mTag = ''; V.mTc = '#ccc'; V.mTitle = ''; V.mFrom = ''; V.mDate = ''; V.mBody = []; V.mHasR = false; V.mRTxt = ''; V.mRCls = ''; V.mRBtn = ''; }
    V.mClaim = function () {
      var x = st(); if (!curL || !curL.rw) return;
      if (curL.gift) {
        var own = cl(x.owned), out = [], keep = [];
        (x.inbox || []).forEach(function (q) {
          if (q.f !== curL.f) { keep.push(q); return; }
          var k = q.k, con = Number(k.charAt(0)), holo = k.charAt(1) === 'h', slot = Number(k.slice(2)), before = own[k] || 0;
          own[k] = before + 1; out.push({ con: con, slot: slot, holo: holo, isNew: before === 0, count: before + 1, gift: true, from: ptName(q.f) });
        });
        if (!out.length) return;
        set({ owned: own, drawn: out, idx: 0, inbox: keep, mo: '', fx: 'reveal', flipped: false, pg: '', sheet: '', logs: lg(x, 'Nhận ' + out.length + ' thẻ quà từ thư') });
        return;
      }
      if ((x.mc || {})[curL.id]) { flash('Bạn đã nhận quà của thư này rồi'); return; }
      var m2 = cl(x.mc || {}); m2[curL.id] = true; var pk = x.packs.slice();
      for (var q = 0; q < curL.rw.n; q++) pk.push({ con: curL.rw.con, kind: 'daily' });
      set({ mc: m2, packs: pk, logs: lg(x, 'Nhận quà từ thư «' + curL.title + '» → +' + curL.rw.n + ' pack') });
      flash('Đã nhận ' + curL.rw.t + ' · mở ở tab Hôm nay');
    };
    V.mailNew = function () {
      var x = st(), n = (x.xm || []).length + 1, xm = (x.xm || []).concat([{ id: 'x' + n + 'd' + x.day, day: x.day, tag: 'SỰ KIỆN MỚI', tc: '#35D0A5', title: 'Sự kiện thử nghiệm #' + n, sum: 'Thư mẫu giới thiệu sự kiện mới.',
        body: ['Đây là thư mẫu để thử cách báo sự kiện mới trong hòm thư. Mỗi thư có thẻ nhãn, nội dung và có thể kèm quà nhận một lần.'], rw: { n: 1, con: dayCon(x.day) || 1, t: '1 pack quà thử' } }]);
      set({ xm: xm }); flash('Đã gửi thư sự kiện mới vào hòm thư');
    };
    V.mailReset = function () { set({ mr: {}, mc: {}, mo: '' }); flash('Đặt lại thư: chưa đọc, chưa nhận'); };
    V.mailTxt = LT.length + ' thư · ' + mailN + ' cần xử lý · đã nhận quà: ' + Object.keys(mcl).length;
"""
j=rep(j,"    /* hộp quà nhận */",mail_js+"    /* hộp quà nhận */")
j=rep(j,"pgHub: s.pg === 'hub', pgDet:","pgMail: s.pg === 'mail', pgHub: s.pg === 'hub', pgDet:")
# ---- markup
p=rep(p,'''<button class="ibtn" aria-label="Hòm thư">{ic("mail")}</button>\'''','''<button class="ibtn" aria-label="Hòm thư" onClick="{{{{openMail}}}}">{ic("mail")}<span class="dot-n" style="display:{{{{mailDot}}}}">{{{{mailN}}}}</span></button>\'''')
p=rep(p,'''<div class="hact"><button class="ibtn" aria-label="Hòm thư">\'\'\'+ic('mail')+\'\'\'</button>''','''<div class="hact"><button class="ibtn" aria-label="Hòm thư" onClick="{{openMail}}">\'\'\'+ic('mail')+\'\'\'<span class="dot-n" style="display:{{mailDot}}">{{mailN}}</span></button>''')
p=rep(p,'<em>Nhận quà</em>','<em>Mở thư</em>',2)
page='''\'\'\'+sif('pgMail',\'\'\'<div class="page on"><div class="ptop"><button class="ibtn" onClick="{{mailBack}}" aria-label="Quay lại">\'\'\'+ic('left')+\'\'\'</button><h1>{{mailHead}}</h1></div>
 <div class="pbody">
 \'\'\'+sif('mailMain',\'\'\'<div class="mbxl"><sc-for list="{{mailList}}" as="m" hint-placeholder-count="3"><button class="card-b mbxi {{m.cls}}" data-i="{{m.i}}" onClick="{{mailPick}}"><span class="mbxt" style="background:{{m.tc}}">{{m.tag}}</span><b>{{m.title}}</b><span class="mbxs">{{m.sum}}</span><span class="mbxf"><em>{{m.from}} · {{m.date}}</em><i class="mbxc {{m.stCls}}">{{m.st}}</i></span></button></sc-for></div>
 <p class="sub mbxn">{{mailEmpty}}</p>\'\'\','true')+sif('mailLet',\'\'\'<div class="mbxd"><span class="mbxt" style="background:{{mTc}}">{{mTag}}</span><h2>{{mTitle}}</h2><small>{{mFrom}} · {{mDate}}</small>
  <sc-for list="{{mBody}}" as="b" hint-placeholder-count="3"><p>{{b.t}}</p></sc-for>
  \'\'\'+sif('mHasR','<div class="mbxr"><span>'+ic('gift')+'</span><div><small>QUÀ ĐÍNH KÈM</small><b>{{mRTxt}}</b></div></div><button class="igo {{mRCls}}" onClick="{{mClaim}}">{{mRBtn}}</button>')+\'\'\'</div>\'\'\')+\'\'\'</div></div>\'\'\')+\'\'\''''
p=rep(p,"\'\'\'+sif('pgHub',\'\'\'<div class=\"page on\">",page+"\n\'\'\'+sif('pgHub',\'\'\'<div class=\"page on\">")
panel=''' <div class="cs w2"><div class="cl"><b>13</b> HÒM THƯ &amp; PHÚC LỢI</div>
  <div class="cpst">{{mailTxt}}</div>
  <div class="cpg" style="margin-top:8px"><button class="cpb gold" onClick="{{mailNew}}">Gửi thư sự kiện mới</button><button class="cpb" onClick="{{openMail}}">Mở hòm thư</button><button class="cpb" onClick="{{mailReset}}">Đặt lại thư (chưa đọc, chưa nhận)</button></div>
  <p class="cpn">Thư theo ngày: ngày 1 khai mạc + thư bí mật 01/11, ngày 4 Aniyaaa, ngày 7 Poyoyoi, mỗi thư mở khóa kèm 1 pack nhận một lần. Quà tặng từ bạn bè cũng nằm trong hòm thư.</p>
 </div>

 <div class="cs w2"><div class="cl"><b>9</b> NHẢY TỚI MÀN</div>'''
p=rep(p,''' <div class="cs w2"><div class="cl"><b>9</b> NHẢY TỚI MÀN</div>''',panel)
css='''
.mbxl{display:flex;flex-direction:column;gap:10px;padding:4px 16px 16px}
.mbxi{text-align:left;width:100%;display:flex;flex-direction:column;gap:6px;margin:0;border:1.5px solid var(--line)}
.mbxi.new{border-color:#ff2e88;box-shadow:0 0 0 3px rgba(255,46,136,.12)}
.mbxt{align-self:flex-start;font-size:9.5px;font-weight:900;letter-spacing:.12em;padding:3px 9px;border-radius:99px;color:#1E1B5E}
.mbxi b{font-size:15px}
.mbxs{font-size:12.5px;color:var(--soft);font-weight:600;line-height:1.45}
.mbxf{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:11px;color:var(--soft);font-weight:700}
.mbxf em{font-style:normal}
.mbxc{font-style:normal;font-weight:900;font-size:10.5px;padding:3px 9px;border-radius:99px;background:var(--line);color:var(--soft);white-space:nowrap}
.mbxc.gift{background:#ff2e88;color:#fff}.mbxc.rw{background:#FFE45E;color:#1E1B5E}.mbxc.nw{background:#4CC9FF;color:#1E1B5E}
.mbxn{text-align:center;padding:20px}
.mbxd{padding:6px 18px 24px}
.mbxd h2{display:block;font-size:20px;line-height:1.3;margin:10px 0 4px}
.mbxd small{display:block;color:var(--soft);font-weight:700;font-size:12px}
.mbxd p{font-size:14px;line-height:1.6;font-weight:600;margin:12px 0}
.mbxr{display:flex;gap:12px;align-items:center;margin:16px 0 12px;padding:12px 14px;border-radius:18px;background:linear-gradient(120deg,rgba(255,228,94,.35),rgba(255,46,136,.16))}
.mbxr>span{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:#fff;color:#ff2e88}
.mbxr small{font-size:10px;letter-spacing:.14em;font-weight:900}.mbxr b{display:block;font-size:15px;margin-top:2px}
'''
i=c.rfind("\'\'\'"); c=c[:i]+css+c[i:]
open('b10_js.js','w',encoding='utf-8').write(j);open('b10.py','w',encoding='utf-8').write(p);open('b10css.py','w',encoding='utf-8').write(c)
print('patched')
