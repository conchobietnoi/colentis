var CON = {
  1: { n: 'Urichinguchana', a: '#FFB02E', b: '#FFE3B0', ar: 3200 / 872, week: 'CHẶNG 1 · 17–19/10', open: '17/10', pano: '/_blob/f730f2dd4f477387495cedf54a3913b2' },
  2: { n: 'Aniyaaa', a: '#FF2E88', b: '#FFC1DB', ar: 3200 / 534, week: 'CHẶNG 2 · 20–22/10', open: '20/10', pano: '/_blob/484fcef07c4335075fec501a08f1b00d' },
  3: { n: 'Poyoyoi', a: '#4CC9FF', b: '#C7EEFF', ar: 3200 / 1023, week: 'CHẶNG 3 · 23–25/10', open: '23/10', pano: '/_blob/82135d43d2d2516c9c56952f8a7b2d7e' }
};
var IMG = {
  1: ['/_blob/9b3657bf78f9debc45654b412d45e46e', '/_blob/7f3a0d5d84f7f9d4291ccd84d6269872', '/_blob/e6664c8ce73f1683c62d87f9355da480', '/_blob/6910cde8e984b316e9ab26144bcacfb9', '/_blob/e8bc69d2a0ef3c5809440db91f604866'],
  2: ['/_blob/a4322f2c1c6e62b3912f802a7dcc6ce6', '/_blob/90bd6a80c9ec86fd707bc45d60eaa4f7', '/_blob/87e85549ca72b3c4f7122e2d9d87357c', '/_blob/1129421846df7be4127d35d7695e1a4b', '/_blob/07bcb16975b6f9ecb2df531abad5d56d'],
  3: ['/_blob/656b5da2ae3359ca633b20430f00cfc7', '/_blob/abf851c6f9764a7c72c682ce5d7035d0', '/_blob/f7972e8a903a9fb9e0c8c2821cd04871', '/_blob/f07c441f3163eeb01e8e1702e8cb0e9e', '/_blob/bbab3816b7dd5e6405fc9d8d756e4244']
};
var MEM = ['JAMES', 'JUHOON', 'KEONHO', 'MARTIN', 'SEONGHYEON'];
var WD = ['T6', 'T7', 'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2', 'T3'];
var WDL = ['Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật', 'Thứ Hai', 'Thứ Ba'];
var TASKS = [null,
  { t: 'Rạng Sáng', d: 'Tick xong 1 việc trước 9 giờ sáng.' },
  { t: 'Nhà Của Mình', d: 'Hoàn thành 1 việc nhà.' },
  { t: 'Khởi Động Tuần', d: 'Lên lịch ít nhất 1 việc cho ngày mai.' },
  { t: 'Gửi Yêu Thương', d: 'Hoàn thành 1 việc dành cho người khác.' },
  { t: 'Xếp Hình Giờ Giấc', d: 'Gắn giờ cho 1 việc bất kỳ.' },
  { t: 'Cú Đêm', d: 'Hoàn thành 1 việc sau 21 giờ.' },
  { t: 'Dọn Nhà Cuối Tuần', d: 'Hoàn thành 1 việc nhà.' },
  { t: 'Chốt Sổ', d: 'Hoàn thành 3 việc trong hôm nay.' },
  { t: 'Cả Nhà Cùng Làm', d: 'Hoàn thành 1 việc chung.' },
  { t: 'Ngày Bù', d: 'Hoàn thành 1 việc bất kỳ, mở pack cho concept nào cũng được.' }
];
var SONGS = [
  { t: 'GO!', c: '#ffb02e', len: '3:06', src: '/_blob/7052519a9d3e5bb5c017f9f31db8a775' },
  { t: 'TNT', c: '#35d0a5', len: '3:04', src: '/_blob/e1ee7cf46bf466fb6bcd54f5b179f66b' },
  { t: 'FaSHioN', c: '#ff2e88', len: '2:59', src: '/_blob/df1028c1095ea48bf5d9dd78b3ec8d63' },
  { t: 'JoyRide', c: '#4cc9ff', len: '2:38', src: '/_blob/ef4840ed944bcf2262523d13b78400cd' },
  { t: 'REDRED', c: '#ff2e4e', len: '3:28', src: '/_blob/016209e87bcc1da2e1543824ae55d59b' },
  { t: 'ACAI', c: '#8b5cff', len: '2:54', src: '/_blob/6a45bc9e9f1279324b687d070573c987' },
  { t: 'Blue Lips', c: '#4cc9ff', len: '2:22', src: '/_blob/339418b6e2452137e0e6c012fb23d53b' }
];
var TABS = ['cal', 'today', 'col', 'fr', 'pro'];
function fmt(x) { x = Math.floor(x || 0); return Math.floor(x / 60) + ':' + ('0' + (x % 60)).slice(-2); }
function stopAudio() { try { if (window.__ca) { window.__ca.pause(); window.__ca.onended = null; window.__ca.ontimeupdate = null; window.__ca = null; } } catch (e) {} }


var D = {
  tab: 'cal', pg: '', fx: '', sheet: '', ust: 'idle', dk: false,
  day: 1, done: {}, packs: [], owned: {}, cel: {}, force: 0,
  colCon: 1, drawn: [], idx: 0, detail: null, flipped: false,
  tearing: false, pickCon: 0, ult: {}, u: 1, sel: [0, 4], disc: 'A', paused: false,
  toast: '', log: 'Chưa mở pack nào.', stN: 0, stH: 0, stP: 0, pan: 18, uc: 1
};
function dayCon(d) { return d >= 1 && d <= 3 ? 1 : d >= 4 && d <= 6 ? 2 : d >= 7 && d <= 9 ? 3 : 0; }
function openN(d) { return d >= 7 ? 3 : d >= 4 ? 2 : d >= 1 ? 1 : 0; }
function cl(o) { return JSON.parse(JSON.stringify(o)); }
function cnt(owned, c, h) { var n = 0; for (var i = 0; i < 5; i++) if (owned[c + (h ? 'h' : 'n') + i]) n++; return n; }
function rnd(n) { return Math.floor(Math.random() * n); }
function idxOf(e) {
  var t = e && e.target; var el = t && t.closest ? t.closest('[data-i]') : null;
  if (!el && e && e.currentTarget && e.currentTarget.getAttribute) el = e.currentTarget;
  return el ? Number(el.getAttribute('data-i')) : 0;
}

class Component extends DCLogic {
  renderVals() {
    var self = this;
    var st = function () { var t = self.state || {}, o = {}; for (var k in D) o[k] = t[k] !== undefined ? t[k] : D[k]; return o; };
    var set = function (p) { self.setState(p); };
    var flash = function (m) { set({ toast: m }); setTimeout(function () { if ((self.state || {}).toast === m) set({ toast: '' }); }, 2100); };
    var s = st();
    var day = s.day, owned = s.owned, cel = s.cel, packs = s.packs;
    var celN = (cel[1] ? 1 : 0) + (cel[2] ? 1 : 0) + (cel[3] ? 1 : 0);
    var allCel = celN === 3;
    var dc = dayCon(day), openC = openN(day);
    var live = day >= 1 && day <= 10;
    var taskDone = !!s.done[day];
    var task = live ? TASKS[day] : { t: 'Ngoài thời gian sự kiện', d: day < 1 ? 'Sự kiện bắt đầu 17/10.' : 'Sự kiện đã kết thúc 26/10.' };
    var dayA = live ? (dc ? CON[dc].a : '#FFE45E') : '#C9CEF5';
    var pn = packs.length;
    var firstIncomplete = 1;
    for (var q = 1; q <= 3; q++) { if (q <= Math.max(openC, 1) && cnt(owned, q) < 5) { firstIncomplete = q; break; } }
    var clean = function () { return { pg: '', fx: '', sheet: '' }; };

    /* ---- thao tác ---- */
    var tickF = function () {
      var x = st();
      if (x.day < 1 || x.day > 10) { flash('Ngoài thời gian sự kiện'); return; }
      if (x.done[x.day]) { flash('Hôm nay đã xong rồi'); return; }
      var d = cl(x.done); d[x.day] = true;
      var c = dayCon(x.day), pk = x.packs.slice();
      pk.push({ con: c, kind: 'daily' }); pk.push({ con: c, kind: 'daily' });
      set({ done: d, packs: pk }); flash('Xong nhiệm vụ · nhận 2 pack');
    };
    var openPackF = function () {
      var x = st();
      if (!x.packs.length) { flash('Chưa có pack nào để mở'); return; }
      var p0 = x.packs[0], pc = p0.con || x.pickCon || 0;
      if (!pc) { pc = 1; for (var z = 1; z <= 3; z++) { if (cnt(x.owned, z) < 5) { pc = z; break; } } }
      set({ pg: '', sheet: '', fx: 'pack', tearing: false, pickCon: p0.con ? 0 : pc });
    };
    var startUnlock = function (c) {
      var x = st(); var c2 = cl(x.cel); c2[c] = true;
      set({ cel: c2, packs: x.packs.concat([{ con: c, kind: 'bonus' }]), uc: c, colCon: c, pg: '', sheet: '', fx: 'unlock' });
    };
    var doOpen = function () {
      var x = st(); var pk = x.packs[0]; if (!pk) return;
      var con = pk.con || x.pickCon || 1;
      var own = cl(x.owned), out = [], nn = 0, hh = 0, dup = 0;
      for (var p = 0; p < 5; p++) {
        var holo = false, slot = 0;
        if (pk.kind === 'bonus') { slot = rnd(5); }
        else if (x.force === 1) { holo = true; slot = rnd(5); }
        else if (x.force === 2) {
          var miss = []; for (var i = 0; i < 5; i++) if (!own[con + 'n' + i]) miss.push(i);
          slot = miss.length ? miss[rnd(miss.length)] : rnd(5);
        } else { var r = Math.random() * 100; if (r < 80) slot = Math.floor(r / 16); else { holo = true; slot = Math.floor((r - 80) / 4); } }
        var key = con + (holo ? 'h' : 'n') + slot, before = own[key] || 0;
        own[key] = before + 1;
        if (holo) hh++; else nn++;
        if (before > 0) dup++;
        out.push({ con: con, slot: slot, holo: holo, isNew: before === 0, count: before + 1 });
      }
      set({ owned: own, drawn: out, idx: 0, packs: x.packs.slice(1), tearing: false, fx: 'reveal', flipped: false, colCon: con,
        log: 'Pack ' + CON[con].n + (pk.kind === 'bonus' ? ' (tặng)' : '') + ': ' + nn + ' thường, ' + hh + ' holo, ' + dup + ' trùng.',
        stN: x.stN + nn, stH: x.stH + hh, stP: x.stP + 1 });
    };
    var finishReveal = function () {
      var x = st();
      for (var c = 1; c <= 3; c++) { if (cnt(x.owned, c) === 5 && !x.cel[c]) { startUnlock(c); return; } }
      set({ fx: '', flipped: false, tab: 'col' });
    };
    var startAudio = function (i) {
      stopAudio();
      try {
        var a = new Audio(SONGS[i].src); window.__ca = a; a.preload = 'auto';
        a.ontimeupdate = function () {
          var el = document.getElementById('pgi'), tx = document.getElementById('pgt');
          if (el && a.duration) el.style.width = (a.currentTime / a.duration * 100) + '%';
          if (tx) tx.textContent = fmt(a.currentTime);
        };
        a.onended = function () { set({ paused: true }); };
        var pr = a.play(); if (pr && pr.catch) pr.catch(function () { flash('Trình duyệt chặn phát nhạc, bấm Tạm dừng rồi Tiếp tục'); set({ paused: true }); });
      } catch (e) {}
    };

    /* ---- cờ màn hình ---- */
    var V = {
      tabCal: s.tab === 'cal', tabToday: s.tab === 'today', tabCol: s.tab === 'col', tabFr: s.tab === 'fr', tabPro: s.tab === 'pro',
      pgHub: s.pg === 'hub', pgDet: s.pg === 'det', pgPano: s.pg === 'pano', pgUcard: s.pg === 'ucard',
      shSongs: s.sheet === 'songs',
      fxPack: s.fx === 'pack', fxReveal: s.fx === 'reveal', fxUnlock: s.fx === 'unlock', fxUget: s.fx === 'uget',
      toast: s.toast, toastCls: s.toast ? 'on' : '', dkCls: s.dk ? 'dk' : '', dkOn: s.dk ? 'on' : '', tdot: pn > 0 ? 'grid' : 'none'
    };
    TABS.forEach(function (t) { V['tb_' + t] = s.tab === t && !s.pg ? 'on' : (s.tab === t ? 'on' : ''); });
    V.goTab = function (e) { var t = TABS[idxOf(e)]; stopAudio(); set({ tab: t, pg: '', fx: '', sheet: '', ust: 'idle' }); };
    V.toggleDk = function () { set({ dk: !s.dk }); };

    /* ---- banner, lịch, hôm nay ---- */
    var bn = { title: '', sub: '', bg: 'linear-gradient(120deg,#0d1030,#3a2a8a 50%,#ff6fb5)' };
    var bcol = (dc ? CON[dc].a : (day > 10 ? '#8F8FD0' : '#FFE45E'));
    bn.bg = 'linear-gradient(120deg,#0d1030,#3a2a8a 50%,' + (day < 1 ? '#8b5cff' : bcol) + ')';
    if (day < 1) { bn.title = 'Mùa Concept sắp diễn ra'; bn.sub = 'Bắt đầu 17/10 · còn ' + (17 - (16 + day)) + ' ngày'; }
    else if (day > 10) { bn.title = 'Mùa Concept đã kết thúc'; bn.sub = 'Bộ sưu tập của bạn được giữ nguyên'; }
    else if (allCel) { bn.title = 'Mùa Concept · đủ 3/3 concept'; bn.sub = 'Thẻ Ultra đang chờ bạn'; }
    else if (pn > 0) { bn.title = 'Mùa Concept · ' + pn + ' pack đang chờ'; bn.sub = 'Chạm để vào sự kiện và mở pack'; }
    else if (taskDone) { bn.title = 'Mùa Concept · ngày ' + day + '/10'; bn.sub = 'Hôm nay đã xong · đủ ' + celN + '/3 concept'; }
    else { bn.title = 'Mùa Concept · ngày ' + day + '/10'; bn.sub = 'Nhiệm vụ: ' + task.t; }
    V.bnTitle = bn.title; V.bnSub = bn.sub; V.bnBg = bn.bg;
    V.bnGo = function () { var x = st(); if (x.day < 1) { flash('Sự kiện bắt đầu 17/10'); return; } set({ pg: 'hub' }); };
    V.dateLbl = WDL[day] + ', ' + (16 + day) + '/10/2026';
    V.dayA = dayA;
    V.cells = [];
    for (var d = 1; d <= 31; d++) {
      var di = d - 16, cls = '', img = false, dot = false, ck = false;
      if (d < 16) { if (d % 4) { cls = 'gp'; img = true; } else cls = 'em'; }
      else if (di === day) cls = 'today';
      else if (di > day) cls = 'fut';
      if (di >= 1 && di <= 10) { dot = true; if (s.done[di]) ck = true; }
      V.cells.push({ i: d, d: d, cls: cls, imgd: img ? 'block' : 'none', src: IMG[1 + d % 3][d % 5], dd: dot ? 'flex' : 'none', dc: di >= 1 && di <= 10 ? (dayCon(di) ? CON[dayCon(di)].a : '#FFE45E') : 'transparent', gd: ck ? 'block' : 'none' });
    }
    V.pickDay = function (e) { var d = idxOf(e), di = d - 16; if (di >= 1 && di <= 10) flash('Ngày ' + d + '/10 · ' + TASKS[di].t); };
    var doneCnt = 1 + (taskDone && live ? 1 : 0), totCnt = live ? 3 : 2;
    V.ringP = Math.round(doneCnt / totCnt * 100); V.ringTxt = doneCnt + '/' + totCnt;
    V.taskHead = doneCnt === totCnt ? 'Hoàn thành hết rồi!' : 'Việc của bạn';
    V.taskSub = doneCnt === totCnt ? 'Hôm nay xong hết, hẹn bạn ngày mai.' : 'Còn ' + (totCnt - doneCnt) + ' việc nữa.';
    V.evTask = live; V.tkOn = taskDone ? 'd' : ''; V.taskT = task.t; V.taskD = task.d;
    V.tick = tickF;
    V.hasPacks = pn > 0; V.packN = pn; V.celN = celN; V.celPct = (celN / 3 * 100) + '%';
    V.openPack = openPackF;

    /* ---- trang sự kiện ---- */
    V.hubTag = day === 10 ? 'NGÀY BÙ' : (live ? 'NHIỆM VỤ HÔM NAY · ' + CON[dc].n.toUpperCase() : 'NHIỆM VỤ');
    V.hubDone = live && taskDone; V.hubOpen = live && !taskDone;
    V.concs = [1, 2, 3].map(function (c) {
      var n = cnt(owned, c), h = cnt(owned, c, true), lk = c > openC, ok = n === 5;
      return { i: c, a: CON[c].a, n: CON[c].n, week: lk ? 'MỞ ' + CON[c].open : CON[c].week, cls: ok ? 'got' : 'lk',
        line: lk ? 'Chưa mở' : (ok ? 'Đủ bộ · ' + h + '/5 holo' : n + '/5 thường · ' + h + '/5 holo'),
        v: '--a:' + CON[c].a + ';--c:' + CON[c].b + ';--bl:7px', img: IMG[c][c + 1] };
    });
    V.openCon = function (e) { set({ pg: '', tab: 'col', colCon: idxOf(e) }); };
    V.tdays = [];
    for (var t = 1; t <= 10; t++) {
      var tc = dayCon(t), tcl = '';
      if (s.done[t]) tcl = 'done'; else if (t === day) tcl = 'today'; else if (t < day) tcl = 'miss';
      if (t === 10) tcl += ' bu';
      V.tdays.push({ d: 16 + t, cls: tcl, c: tc ? CON[tc].a : '#FFE45E' });
    }
    V.ultSt1 = !allCel; V.ultSt2 = allCel;
    V.closePg = function () { stopAudio(); set({ pg: '', ust: 'idle', flipped: false }); };

    /* ---- mở pack ---- */
    var pk0 = packs[0] || { con: 0, kind: 'daily' };
    var pcon = pk0.con || s.pickCon || firstIncomplete;
    V.pkA = CON[pcon].a; V.pkPick = pk0.con === 0 && pn > 0;
    for (var k = 1; k <= 3; k++) { V['pc' + k] = pcon === k ? 'on' : ''; V['pk' + k + 'd'] = pcon === k && pk0.kind !== 'bonus'; V['pk' + k + 'b'] = pcon === k && pk0.kind === 'bonus'; }
    V.pickC = function (e) { set({ pickCon: idxOf(e) }); };
    V.pkLabel = pk0.kind === 'bonus' ? 'Pack quà tặng · ' + CON[pcon].n : 'Pack ' + CON[pcon].n + ' · còn ' + pn;
    V.pkSub = pk0.kind === 'bonus' ? '5 thẻ thường' : '5 thẻ · thường 16% mỗi thẻ, holo 4% mỗi thẻ';
    V.trCls = s.tearing ? 'go' : ''; V.tearTxt = s.tearing ? 'Đang xé…' : 'Chạm để xé pack';
    V.tear = function () { var x = st(); if (x.tearing || !x.packs.length) return; set({ tearing: true }); setTimeout(doOpen, 1500); };
    V.closeFx = function () { set({ fx: '', tearing: false }); };

    /* ---- xem thẻ ---- */
    var isReveal = s.fx === 'reveal';
    var cur = isReveal ? (s.drawn[s.idx] || s.drawn[0]) : s.detail;
    cur = cur || { con: 1, slot: 0, holo: false, isNew: true, count: 1 };
    var cc = CON[cur.con];
    V.shA = cc.a; V.cImg = IMG[cur.con][cur.slot]; V.cName = MEM[cur.slot]; V.cNo = ('0' + (cur.slot + 1)).slice(-2);
    V.cConUp = cc.n.toUpperCase(); V.cConName = cc.n; V.cVars = '--a:' + cc.a + ';--b:' + cc.b;
    V.showNorm = !cur.holo; V.showHolo = !!cur.holo;
    for (var bc2 = 1; bc2 <= 3; bc2++) for (var bs = 0; bs < 5; bs++) { V['bk_' + bc2 + '_n_' + bs] = cur.con === bc2 && cur.slot === bs && !cur.holo; V['bk_' + bc2 + '_h_' + bs] = cur.con === bc2 && cur.slot === bs && !!cur.holo; }
    V.shNo = s.idx + 1; V.shKind = cur.holo ? 'HOLO' : 'THƯỜNG'; V.shLabel = cur.holo ? 'Thẻ holo' : 'Thẻ thường';
    V.flipCls = s.flipped ? 'on' : ''; V.popCls = 'p' + (s.idx % 2);
    V.flipCard = function () { set({ flipped: !s.flipped }); };
    var own1 = owned[cur.con + (cur.holo ? 'h' : 'n') + cur.slot] || 0;
    V.badgeTxt = isReveal ? (cur.isNew ? 'THẺ MỚI' : 'ĐÃ CÓ · ×' + cur.count) : 'Sở hữu ×' + own1;
    V.badgeCls = isReveal && !cur.isNew ? 'dup' : 'nw';
    V.dots = [0, 1, 2, 3, 4].map(function (d) { return { cls: d <= s.idx ? 'on' : '' }; });
    V.nextTxt = s.idx >= 4 ? 'Xong' : 'Tiếp';
    V.nextCard = function () { var x = st(); if (x.idx < 4) set({ idx: x.idx + 1, flipped: false }); else finishReveal(); };

    /* ---- bộ sưu tập ---- */
    var ct = s.colCon, ccol = CON[ct] || CON[1];
    var locked = ct <= 3 && ct > openC;
    V.rbar = [1, 2, 3].map(function (c) { return { a: CON[c].a, n: CON[c].n.slice(0, 7), v: cnt(owned, c) + '/5', p: (cnt(owned, c) / 5 * 100) + '%' }; })
      .concat([{ a: '#FFE45E', n: 'Ultra', v: (ultCount()) + '/2', p: (ultCount() / 2 * 100) + '%' }]);
    function ultCount() { return (s.ult[1] ? 1 : 0) + (s.ult[2] ? 1 : 0); }
    V.chips = [1, 2, 3, 4].map(function (c) { return { i: c, n: c === 4 ? 'Ultra' : CON[c].n, cls: ct === c ? 'on' : '' }; });
    V.setTab = function (e) { set({ colCon: idxOf(e) }); };
    V.tabA = ct === 4 ? '#FFE45E' : ccol.a; V.colName = ct === 4 ? 'Ultra Limited' : ccol.n;
    V.colOpen = ct <= 3 && !locked; V.colLocked = locked; V.colUltra = ct === 4; V.lockDate = ccol.open + '/2026';
    var mkTiles = function (h) {
      var o = [];
      for (var i = 0; i < 5; i++) {
        var c = (owned[ct + (h ? 'h' : 'n') + i] || 0);
        o.push({ i: i + (h ? 10 : 0), cls: c ? '' : 'lk', img: IMG[ct] ? IMG[ct][i] : '', nm: MEM[i], x: c, xd: c > 1 ? 'block' : 'none', nd: 'none' });
      }
      return o;
    };
    V.tilesN = mkTiles(false); V.tilesH = mkTiles(true);
    var nOwn = ct <= 3 ? cnt(owned, ct) : 0, hOwn = ct <= 3 ? cnt(owned, ct, true) : 0;
    V.colN = nOwn; V.colH = hOwn; V.colPano = ccol.pano; V.panoOk = nOwn === 5;
    V.panoRim = nOwn === 5 ? 'linear-gradient(100deg,#fff,' + ccol.a + ',#4CC9FF,#fff)' : 'var(--line)'; V.panoState = nOwn === 5 ? 'Đã mở' : nOwn + '/5 mảnh';
    V.bands = [0, 1, 2, 3, 4].map(function (i) { return { left: (i * 20) + '%', cls: owned[ct + 'n' + i] ? 'get' : '' }; });
    V.tileOpen = function (e) {
      var v = idxOf(e), h = v >= 10, sl = v % 10, x = st();
      if (!x.owned[x.colCon + (h ? 'h' : 'n') + sl]) return;
      set({ pg: 'det', detail: { con: x.colCon, slot: sl, holo: h, isNew: false, count: 1 }, flipped: false });
    };
    V.goPano = function () {
      var x = st(); var c = x.colCon <= 3 ? x.colCon : 1;
      if (cnt(x.owned, c) < 5) { flash('Gom đủ 5 thẻ thường để mở panorama'); set({ tab: 'col', pg: '', fx: '', colCon: c }); return; }
      set({ pg: 'pano', fx: '', sheet: '', colCon: c, pan: 18 });
    };
    var IMGW = 520 * ccol.ar, VW = 390, fov = VW / IMGW * 100;
    V.imgW = Math.round(IMGW); V.panVal = s.pan; V.panX = (-(s.pan / 100) * (IMGW - VW)).toFixed(1) + 'px';
    V.fovW = fov.toFixed(2) + '%'; V.fovX = ((s.pan / 100) * (100 - fov)).toFixed(2) + '%';
    V.onPan = function (e) { set({ pan: Number(e.target.value) }); };

    /* ---- mở khóa concept ---- */
    var uc = CON[s.uc] || CON[1];
    V.ucA = uc.a; V.ucName = uc.n; V.ucPano = uc.pano; V.ucFr = IMG[s.uc][2];
    V.ucV = '--a:' + uc.a + ';--c:' + uc.b + ';--bl:13px'; V.ucT = '--a:' + uc.a + ';--b:' + uc.b;
    V.unPack = openPackF;
    V.unNextTxt = allCel ? 'Tiếp: nhận thẻ Ultra' : 'Về bộ sưu tập';
    V.unNext = function () { var x = st(); var all = x.cel[1] && x.cel[2] && x.cel[3]; if (all) set({ fx: 'uget' }); else set({ fx: '', tab: 'col' }); };

    /* ---- hồ sơ ---- */
    V.rews = [1, 2, 3].map(function (c) {
      var ok = cnt(owned, c) === 5;
      return { a: CON[c].a, n: CON[c].n, st: ok ? 'ĐÃ MỞ · CONCEPT ' + c : 'CHƯA MỞ · CONCEPT ' + c, dim: ok ? '' : 'opacity:.4;filter:grayscale(.9)',
        v: '--a:' + CON[c].a + ';--c:' + CON[c].b + ';--bl:8px', t: '--a:' + CON[c].a + ';--b:' + CON[c].b, img: IMG[c][c + 1] };
    });

    /* ---- Ultra ---- */
    var ult = s.ult;
    V.ultraSt = allCel ? 'Đã mở khóa' : 'Cần đủ 3 concept';
    for (var uu = 1; uu <= 2; uu++) {
      V['u' + uu + 'Ready'] = allCel && !!ult[uu]; V['u' + uu + 'New'] = allCel && !ult[uu]; V['u' + uu + 'Lock'] = !allCel;
      V['u' + uu + 'Songs'] = ult[uu] ? SONGS[ult[uu][0]].t + ' · ' + SONGS[ult[uu][1]].t : '';
    }
    V.openU = function (e) { set({ u: idxOf(e), pg: 'ucard', ust: 'idle', paused: false, disc: 'A' }); };
    V.startU = function (e) { set({ u: idxOf(e), sheet: 'songs', sel: [0, 4] }); };
    V.startU1 = function () { set({ fx: '', pg: '', tab: 'col', colCon: 4, u: 1, sheet: 'songs', sel: [0, 4] }); };
    V.jumpU = function () { var x = st(); if (!(x.cel[1] && x.cel[2] && x.cel[3])) flash('Cần đủ 3 concept trước'); set({ tab: 'col', pg: '', fx: '', sheet: '', colCon: 4 }); };
    V.u = s.u; V.uIs1 = s.u === 1; V.uIs2 = s.u === 2;
    var sel = s.sel;
    V.songs = SONGS.map(function (x, i) { var on = sel.indexOf(i) >= 0; return { i: i, t: x.t, len: x.len, c: x.c, cls: on ? 'got' : '', ck: on ? '✓' : '' }; });
    V.pickSong = function (e) {
      var i = idxOf(e), n = sel.slice(), k = n.indexOf(i);
      if (k >= 0) n.splice(k, 1); else if (n.length < 2) n.push(i); else { n.shift(); n.push(i); }
      set({ sel: n });
    };
    var ready = sel.length === 2;
    V.lockCls = ready ? '' : 'off'; V.lockTxt = ready ? 'Khóa 2 bài vào thẻ (không đổi được)' : 'Chọn đủ 2 bài (' + sel.length + '/2)';
    V.lock = function () { var x = st(); if (x.sel.length !== 2) return; var u2 = cl(x.ult); u2[x.u] = x.sel.slice(); set({ ult: u2, sheet: '', pg: 'ucard', ust: 'idle', paused: false, disc: 'A' }); flash('Đã khóa 2 bài vào thẻ #' + x.u); };
    V.closeSheet = function () { set({ sheet: '' }); };
    var pair = ult[s.u] || [0, 4];
    var A = SONGS[pair[0]], B = SONGS[pair[1]], curS = s.disc === 'B' ? B : A;
    V.titleA = A.t; V.titleB = B.t; V.cA = A.c; V.cB = B.c;
    V.stCls = s.ust === 'idle' ? 'idle' : s.ust === 'ch' ? 'ch' : (s.disc === 'B' ? 'pB' : 'pA');
    V.curT = curS.t; V.curLen = curS.len; V.psCls = s.paused ? 'psx' : '';
    V.pauseTxt = s.paused ? '▶  Tiếp tục' : '❚❚  Tạm dừng';
    V.ustIdle = s.ust === 'idle'; V.ustCh = s.ust === 'ch'; V.ustPlay = s.ust === 'play';
    V.tapStage = function () { var x = st(); if (x.ust === 'idle') set({ ust: 'ch' }); };
    V.goChoose = function () { stopAudio(); set({ ust: 'ch', paused: false }); };
    V.closeU = function () { stopAudio(); set({ pg: '', ust: 'idle', tab: 'col', colCon: 4, paused: false }); };
    V.playA = function () { var x = st(); if (x.ust === 'idle') return; var p = (x.ult[x.u] || [0, 4])[0]; set({ ust: 'play', disc: 'A', paused: false }); startAudio(p); };
    V.playB = function () { var x = st(); if (x.ust === 'idle') return; var p = (x.ult[x.u] || [0, 4])[1]; set({ ust: 'play', disc: 'B', paused: false }); startAudio(p); };
    V.togglePause = function () {
      var x = st(), a = window.__ca;
      if (x.paused) { if (a) { var pr = a.play(); if (pr && pr.catch) pr.catch(function () {}); } else { startAudio((x.ult[x.u] || [0, 4])[x.disc === 'B' ? 1 : 0]); } }
      else if (a) a.pause();
      set({ paused: !x.paused });
    };

    /* ---- bảng điều khiển ---- */
    V.dayLbl = WDL[day] + ' ' + (16 + day) + '/10' + (live ? ' · ngày ' + day + '/10' : (day < 1 ? ' · trước sự kiện' : ' · sau sự kiện'));
    V.dchips = [];
    for (var dd = 0; dd <= 11; dd++) { V.dchips.push({ i: dd, dt: (16 + dd), wd: WD[dd], cls: dd === day ? 'on' : '', c: dayCon(dd) ? CON[dayCon(dd)].a : (dd === 10 ? '#FFE45E' : 'transparent') }); }
    V.setDay = function (e) { set({ day: idxOf(e) }); };
    V.dayPrev = function () { set({ day: Math.max(0, day - 1) }); }; V.dayNext = function () { set({ day: Math.min(11, day + 1) }); };
    V.untick = function () {
      var x = st(); if (!x.done[x.day]) { flash('Hôm nay chưa tick'); return; }
      var d = cl(x.done); delete d[x.day]; var pk = x.packs.slice(), c = dayCon(x.day), rm = 2;
      for (var i = pk.length - 1; i >= 0 && rm > 0; i--) if (pk[i].kind === 'daily' && pk[i].con === c) { pk.splice(i, 1); rm--; }
      set({ done: d, packs: pk }); flash('Đã hoàn tác nhiệm vụ');
    };
    V.addDaily = function () { var x = st(); set({ packs: x.packs.concat([{ con: dayCon(x.day), kind: 'daily' }]) }); flash('+1 pack ngày'); };
    V.addBonus = function () { var x = st(); set({ packs: x.packs.concat([{ con: x.colCon <= 3 ? x.colCon : 1, kind: 'bonus' }]) }); flash('+1 pack tặng'); };
    V.clearPacks = function () { set({ packs: [] }); flash('Đã xóa hết pack'); };
    V.f1 = s.force === 0 ? 'on' : ''; V.f2 = s.force === 1 ? 'on' : ''; V.f3 = s.force === 2 ? 'on' : '';
    V.setForce = function (e) { set({ force: idxOf(e) }); };
    V.crows = [1, 2, 3].map(function (c) { return { i: c, a: CON[c].a, n: CON[c].n, line: cnt(owned, c) + '/5 thường · ' + cnt(owned, c, true) + '/5 holo' + (cel[c] ? ' · đã mở khóa' : '') }; });
    V.c4 = function (e) {
      var c = idxOf(e), x = st(), o = cl(x.owned), keep = rnd(5), cx = cl(x.cel);
      for (var i = 0; i < 5; i++) { if (i === keep) delete o[c + 'n' + i]; else o[c + 'n' + i] = o[c + 'n' + i] || 1; }
      delete cx[c]; set({ owned: o, cel: cx }); flash('Concept ' + c + ': 4/5 thường');
    };
    V.c5 = function (e) {
      var c = idxOf(e), x = st(), o = cl(x.owned);
      for (var i = 0; i < 5; i++) o[c + 'n' + i] = o[c + 'n' + i] || 1;
      set({ owned: o });
      if (!x.cel[c]) { setTimeout(function () { startUnlock(c); }, 0); } else flash('Concept ' + c + ' đã mở khóa trước đó');
    };
    V.cH = function (e) {
      var c = idxOf(e), x = st(), o = cl(x.owned), miss = [];
      for (var i = 0; i < 5; i++) if (!o[c + 'h' + i]) miss.push(i);
      var sl = miss.length ? miss[rnd(miss.length)] : rnd(5); o[c + 'h' + sl] = (o[c + 'h' + sl] || 0) + 1; set({ owned: o }); flash('+1 holo ' + MEM[sl]);
    };
    V.cX = function (e) {
      var c = idxOf(e), x = st(), o = cl(x.owned), cx = cl(x.cel);
      for (var i = 0; i < 5; i++) { delete o[c + 'n' + i]; delete o[c + 'h' + i]; }
      delete cx[c]; set({ owned: o, cel: cx }); flash('Đã xóa thẻ concept ' + c);
    };
    V.fullAll = function () {
      var x = st(), o = cl(x.owned), cx = cl(x.cel);
      for (var c = 1; c <= 3; c++) { for (var i = 0; i < 5; i++) o[c + 'n' + i] = o[c + 'n' + i] || 1; cx[c] = true; }
      set({ owned: o, cel: cx, pg: '', sheet: '', fx: 'uget', day: Math.max(x.day, 7) });
    };
    V.jCal = function () { stopAudio(); set({ tab: 'cal', pg: '', fx: '', sheet: '' }); };
    V.jToday = function () { stopAudio(); set({ tab: 'today', pg: '', fx: '', sheet: '' }); };
    V.jHub = function () { stopAudio(); set({ tab: 'today', pg: 'hub', fx: '', sheet: '' }); };
    V.jCol = function () { stopAudio(); set({ tab: 'col', pg: '', fx: '', sheet: '' }); };
    V.jPro = function () { stopAudio(); set({ tab: 'pro', pg: '', fx: '', sheet: '' }); };
    V.prevUnlock = function () { set({ fx: 'unlock', pg: '', sheet: '', uc: s.colCon <= 3 ? s.colCon : 1 }); };
    V.reset = function () { stopAudio(); var o = {}; for (var k in D) o[k] = cl({ v: D[k] }).v; set(o); };
    var rate = (s.stN + s.stH) ? (s.stH / (s.stN + s.stH) * 100).toFixed(1) : '0';
    V.stats = 'Pack đang chờ: ' + pn + ' · Đã mở: ' + s.stP + '\nThẻ rút: ' + s.stN + ' thường, ' + s.stH + ' holo (' + rate + '% holo, mục tiêu 20%)\nLần mở gần nhất: ' + s.log;
    return V;
  }
}
