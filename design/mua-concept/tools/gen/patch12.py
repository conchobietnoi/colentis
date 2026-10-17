import re
t=open('b10_js.js',encoding='utf-8').read()
def rep(a,b):
    global t
    assert t.count(a)==1,(a[:80],t.count(a))
    t=t.replace(a,b)
# state
rep("sent: 0, stA: 0, stBP: 0","sent: 0, stA: 0, stBP: 0, who: '', ws: {}, pts: 0")
rep("var MEM = [","var PT = [{ id: 'gb', n: 'Gia Bảo', ini: 'GB', a: '#4CC9FF' }, { id: 'tt', n: 'Thu Trang', ini: 'TT', a: '#FFE45E' }];\nfunction ptName(id) { for (var i = 0; i < PT.length; i++) if (PT[i].id === id) return PT[i].n; return 'Người kia'; }\nvar MEM = [")
rep("      shSongs: s.sheet === 'songs',","      shSongs: s.sheet === 'songs', shWho: s.sheet === 'who',")
# detail vars
a=t.index("    V.dtGive = inDet && own1 > 1;");b=t.index("    V.dfLk =")
t=t[:a]+"""    var rqK = (s.rq || {})[dKey] || {}, rqN = PT.filter(function (p) { return rqK[p.id]; }).length;
    var pqN = PT.filter(function (p) { return (s.preq || []).some(function (q) { return q.k === dKey && q.f === p.id; }); }).map(function (p) { return p.n; });
    V.dtGive = inDet && own1 > 1; V.dtSpare = own1 - 1; V.dtKeep = inDet && own1 === 1;
    V.dtAskOn = inDet && own1 === 0; V.dtAskTxt = rqN ? 'Đã xin ' + rqN + ' người · xin thêm' : 'Xin thẻ này'; V.dtAskCls = rqN ? 'sent' : '';
    V.dtReq = inDet && pqN.length > 0; V.dtReqTxt = pqN.join(', ') + ' đang xin thẻ này';
"""+t[b:]
rep("(cur.gift ? 'QUÀ TỪ NGƯỜI KIA · ' : '')","(cur.gift ? 'QUÀ TỪ ' + (cur.from || 'NGƯỜI KIA').toUpperCase() + ' · ' : '')")
# block A
a=t.index("    /* ---- trao đổi với người kia (thẻ concept trùng) ---- */");b=t.index("    var nOwn = ct <= 3")
blockA = """    /* ---- tặng / xin thẻ: chọn người ---- */
    var dtKeyNow = function () { var x = st(), d = x.detail; return d ? d.con + (d.holo ? 'h' : 'n') + d.slot : ''; };
    var nmOf = function (k) { return MEM[Number(k.slice(2))] + (k.charAt(1) === 'h' ? ' (holo)' : ''); };
    V.dtGiveF = function () { var x = st(); if ((x.owned[dtKeyNow()] || 0) < 2) { flash('Chỉ còn 1 bản, không tặng được'); return; } set({ sheet: 'who', who: 'give', ws: {} }); };
    V.dtAskF = function () { set({ sheet: 'who', who: 'ask', ws: {} }); };
    var wd = s.detail, wk = wd ? wd.con + (wd.holo ? 'h' : 'n') + wd.slot : '';
    var wGive = s.who === 'give', wSel = s.ws || {}, wSpare = (owned[wk] || 0) - 1;
    var wN = PT.filter(function (p) { return wSel[p.id]; }).length;
    V.whoTitle = wd ? (wGive ? 'Tặng ' : 'Xin ') + nmOf(wk) + (wGive ? ' cho ai?' : ' từ ai?') : '';
    V.whoSub = wGive ? 'Tích chọn người nhận. Bạn dư ×' + wSpare + ' nên tặng tối đa ' + wSpare + ' người.' : 'Tích chọn người bạn muốn xin. Họ nhận thông báo và tự quyết định có tặng không.';
    V.whoList = PT.map(function (p, i) {
      var has = ((s.po || {})[p.id] || {})[wk] || 0, asked = ((s.rq || {})[wk] || {})[p.id];
      return { i: i, n: p.n, ini: p.ini, a: p.a, cls: (wSel[p.id] ? 'on ' : '') + (asked && !wGive ? 'dis' : ''), ck: wSel[p.id] ? '✓' : '', sub: wGive ? (has ? 'Đã có ×' + has : 'Chưa có thẻ này') : (asked ? 'Đã xin rồi' : 'Bạn trong lịch') };
    });
    V.whoGoTxt = wGive ? (wN ? 'Tặng cho ' + wN + ' người' : 'Chọn người nhận') : (wN ? 'Gửi lời xin cho ' + wN + ' người' : 'Chọn người để xin'); V.whoGoCls = wN ? '' : 'off';
    V.whoTog = function (e) {
      var i = idxOf(e), x = st(), p = PT[i], sel = cl(x.ws || {}), give = x.who === 'give';
      var k = dtKeyNow(); if (!p) return;
      if (!give && (((x.rq || {})[k] || {})[p.id])) return;
      if (sel[p.id]) delete sel[p.id];
      else {
        var sp = (x.owned[k] || 0) - 1;
        if (give && Object.keys(sel).length >= sp) { flash('Chỉ dư ×' + sp + ' nên tặng tối đa ' + sp + ' người'); return; }
        sel[p.id] = true;
      }
      set({ ws: sel });
    };
    V.whoGo = function () {
      var x = st(), k = dtKeyNow(), ids = PT.filter(function (p) { return (x.ws || {})[p.id]; }).map(function (p) { return p.id; });
      if (!k || !ids.length) { flash('Chưa chọn người nào'); return; }
      var names = ids.map(ptName).join(', ');
      if (x.who === 'give') {
        var o = cl(x.owned), po = cl(x.po || {}); if ((o[k] || 0) - 1 < ids.length) { flash('Không đủ bản dư'); return; }
        ids.forEach(function (id) { o[k]--; po[id] = po[id] || {}; po[id][k] = (po[id][k] || 0) + 1; });
        set({ owned: o, po: po, sent: x.sent + ids.length, sheet: '', ws: {}, preq: (x.preq || []).filter(function (q) { return !(q.k === k && ids.indexOf(q.f) >= 0); }), logs: lg(x, 'Tặng ' + nmOf(k) + ' cho ' + names) });
        flash('Đã tặng ' + nmOf(k) + ' cho ' + names);
      } else {
        var rq = cl(x.rq || {}); rq[k] = rq[k] || {}; ids.forEach(function (id) { rq[k][id] = true; });
        set({ rq: rq, sheet: '', ws: {}, logs: lg(x, 'Xin ' + nmOf(k) + ' từ ' + names) });
        flash('Đã gửi lời xin ' + nmOf(k) + ' cho ' + names);
      }
    };
    /* hộp quà nhận */
    var inb = s.inbox || [];
    var senders = []; inb.forEach(function (q) { var n = ptName(q.f); if (senders.indexOf(n) < 0) senders.push(n); });
    V.hasGift = inb.length > 0; V.giftN = inb.length;
    V.giftHead = senders.length === 1 ? senders[0] + ' gửi bạn ' + inb.length + ' thẻ' : inb.length + ' thẻ quà từ ' + senders.join(', ');
    V.giftTxt = inb.slice(0, 3).map(function (q) { return nmOf(q.k); }).join(', ') + (inb.length > 3 ? '…' : '');
    V.giftOpen = function () {
      var x = st(), own = cl(x.owned), out = [];
      (x.inbox || []).forEach(function (q) {
        var k = q.k, con = Number(k.charAt(0)), holo = k.charAt(1) === 'h', slot = Number(k.slice(2)), before = own[k] || 0;
        own[k] = before + 1; out.push({ con: con, slot: slot, holo: holo, isNew: before === 0, count: before + 1, gift: true, from: ptName(q.f) });
      });
      if (!out.length) return;
      set({ owned: own, drawn: out, idx: 0, inbox: [], fx: 'reveal', flipped: false, pg: '', sheet: '', logs: lg(x, 'Nhận ' + out.length + ' thẻ quà') });
    };
"""
t=t[:a]+blockA+t[b:]
# block B
a=t.index("    /* ---- người kia (giả lập) ---- */");b=t.index("    V.clearSongs = function")
blockB = """    /* ---- bạn bè (giả lập) ---- */
    var lim = Math.max(openC, 1), psI = s.pts || 0, PS = PT[psI];
    V.ptChips = PT.map(function (p, i) { return { i: i, n: p.n, cls: i === psI ? 'on' : '' }; });
    V.ptSel = function (e) { set({ pts: idxOf(e) }); };
    V.ptName = PS.n;
    V.ptGift = function () {
      var x = st(), cands = [], key;
      for (var c = 1; c <= lim; c++) for (var i = 0; i < 5; i++) if (!x.owned[c + 'n' + i]) cands.push(c + 'n' + i);
      if (cands.length && Math.random() < 0.8) key = cands[rnd(cands.length)]; else { var c2 = 1 + rnd(lim); key = c2 + (Math.random() < 0.2 ? 'h' : 'n') + rnd(5); }
      set({ inbox: (x.inbox || []).concat([{ k: key, f: PS.id }]), logs: lg(x, PS.n + ' gửi quà: ' + nmOf(key)) });
      flash(PS.n + ' vừa gửi bạn 1 thẻ');
    };
    V.ptAsk = function () {
      var x = st(), ks = Object.keys(x.owned).filter(function (k) { return x.owned[k] > 0; });
      if (!ks.length) { flash('Bạn chưa có thẻ nào để ' + PS.n + ' xin'); return; }
      var k = ks[rnd(ks.length)], pq = (x.preq || []).slice();
      if (!pq.some(function (q) { return q.k === k && q.f === PS.id; })) pq.push({ k: k, f: PS.id });
      set({ preq: pq, logs: lg(x, PS.n + ' xin ' + nmOf(k)) });
      flash(PS.n + ' đang xin ' + nmOf(k) + (x.owned[k] > 1 ? ' · bạn có bản dư' : ' · bạn chỉ còn 1 bản'));
    };
    V.ptPack = function () {
      var x = st(), po = cl(x.po || {}), con = 1 + rnd(lim); po[PS.id] = po[PS.id] || {};
      for (var p = 0; p < 5; p++) { var r = Math.random() * 100, holo = r >= 80, slot = holo ? Math.floor((r - 80) / 4) : Math.floor(r / 16); var k = con + (holo ? 'h' : 'n') + slot; po[PS.id][k] = (po[PS.id][k] || 0) + 1; }
      set({ po: po, logs: lg(x, PS.n + ' mở 1 pack ' + CON[con].n) }); flash(PS.n + ' vừa mở 1 pack ' + CON[con].n);
    };
    V.ptReply = function () {
      var x = st(), rq = cl(x.rq || {}), po = cl(x.po || {}), g = [], mine = po[PS.id] || {};
      Object.keys(rq).forEach(function (k) { if (rq[k][PS.id] && (mine[k] || 0) > 1) { mine[k]--; g.push({ k: k, f: PS.id }); delete rq[k][PS.id]; } });
      if (!g.length) { flash(PS.n + ' chưa có bản dư của thẻ bạn xin'); return; }
      po[PS.id] = mine;
      set({ rq: rq, po: po, inbox: (x.inbox || []).concat(g), logs: lg(x, PS.n + ' nhận lời xin, gửi ' + g.length + ' thẻ') }); flash(PS.n + ' gửi bạn ' + g.length + ' thẻ');
    };
    V.ptClear = function () { var x = st(); set({ po: {}, inbox: [], preq: [], rq: {}, sent: 0, logs: lg(x, 'Xóa kho bạn bè') }); };
    var poS = (s.po || {})[PS.id] || {}, pN = 0, pH = 0, pSp = 0; Object.keys(poS).forEach(function (k) { if (poS[k] > 0) { if (k.charAt(1) === 'h') pH++; else pN++; pSp += poS[k] - 1; } });
    var rqCnt = 0; Object.keys(s.rq || {}).forEach(function (k) { rqCnt += Object.keys(s.rq[k]).length; });
    V.ptTxt = PS.n + ' có ' + pN + ' thẻ thường · ' + pH + ' holo · ' + pSp + ' bản dư\\nQuà đang chờ bạn nhận: ' + (s.inbox || []).length + ' · Bạn đã tặng: ' + s.sent + '\\nLời xin bạn đã gửi: ' + rqCnt + ' · Đang xin bạn: ' + (s.preq || []).length;
"""
t=t[:a]+blockB+t[b:]
# CK
rep("Object.keys(s.po || {}).every(function (k) { return s.po[k] >= 0; })","Object.keys(s.po || {}).every(function (id) { return Object.keys(s.po[id]).every(function (k) { return s.po[id][k] >= 0; }); })")
open('b10_js.js','w',encoding='utf-8').write(t)

s=open('b10.py',encoding='utf-8').read()
def reps(a,b):
    global s
    assert s.count(a)>=1,(a[:80],s.count(a))
    s=s.replace(a,b)
reps("<b>Người kia gửi bạn {{giftN}} thẻ</b>","<b>{{giftHead}}</b>")
reps("<p class=\"vhint vpq\">Người kia đang xin thẻ này</p>","<p class=\"vhint vpq\">{{dtReqTxt}}</p>")
reps("Tặng người kia · dư ×{{dtSpare}}","Tặng · dư ×{{dtSpare}}")
# who sheet
WHO = """'''+sif('shWho','''<div class="bd on" onClick="{{closeSheet}}"></div><div class="sheet on"><h3 style="font-size:19px">{{whoTitle}}</h3><p class="sub">{{whoSub}}</p>
 <div class="whol"><sc-for list="{{whoList}}" as="w" hint-placeholder-count="2"><button class="wr {{w.cls}}" data-i="{{w.i}}" onClick="{{whoTog}}"><span class="wav" style="--a:{{w.a}}">{{w.ini}}</span><span class="wnm"><b>{{w.n}}</b><small>{{w.sub}}</small></span><span class="wck">{{w.ck}}</span></button></sc-for></div>
 <button class="igo {{whoGoCls}}" onClick="{{whoGo}}">{{whoGoTxt}}</button></div>''')+'''"""
anchor="""
<!-- ================= HIỆU ỨNG TOÀN MÀN (PACK / LẬT THẺ / MỞ KHÓA) ================= -->"""
assert s.count(anchor)==1
s=s.replace(anchor,WHO.replace("'''+sif(","''' + sif(",1)[0:0]+"",1) if False else s
# insert after shSongs sheet end: find "</div>''')+'''\n\n<!-- ================= HIỆU ỨNG"
marker="""<button class="igo {{lockCls}}" onClick="{{lock}}">{{lockTxt}}</button></div>''')+'''"""
assert s.count(marker)==1
s=s.replace(marker,marker+WHO)
# panel
reps("""<div class="cpst">{{ptTxt}}</div>""","""<div class="cpg"><sc-for list="{{ptChips}}" as="p" hint-placeholder-count="2"><button class="cpb {{p.cls}}" data-i="{{p.i}}" onClick="{{ptSel}}">{{p.n}}</button></sc-for></div>
  <div class="cpst" style="margin-top:8px">{{ptTxt}}</div>""")
reps("Người kia tặng tôi 1 thẻ","{{ptName}} tặng tôi 1 thẻ")
reps("Người kia xin 1 thẻ của tôi","{{ptName}} xin 1 thẻ của tôi")
reps("Cho người kia 1 pack","{{ptName}} mở 1 pack")
reps("Người kia trả lời lời xin","{{ptName}} trả lời lời xin")
reps("NGƯỜI KIA (GIẢ LẬP) · TẶNG &amp; XIN THẺ","BẠN BÈ (GIẢ LẬP) · TẶNG &amp; XIN THẺ")
reps("Bạn tặng thẻ trùng ở tab Thẻ. Ở đây giả lập phía người kia: gửi quà cho bạn, xin thẻ của bạn, mở pack để có bản dư rồi trả lời lời xin của bạn.","Bạn tặng và xin thẻ trong màn xem thẻ, tích chọn người nhận. Ở đây chọn một người bạn rồi giả lập phía họ: gửi quà, xin thẻ của bạn, mở pack để có bản dư rồi trả lời lời xin.")
open('b10.py','w',encoding='utf-8').write(s)
print('ok')
