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
  { t: 'GO!', al: 'COLOR OUTSIDE THE LINES', c: '#ffb02e', len: '3:00' },
  { t: 'What You Want', al: 'COLOR OUTSIDE THE LINES', c: '#35d0a5', len: '3:12' },
  { t: 'FaSHioN', al: 'COLOR OUTSIDE THE LINES', c: '#ff2e88', len: '2:58' },
  { t: 'JoyRide', al: 'COLOR OUTSIDE THE LINES', c: '#4cc9ff', len: '3:05' },
  { t: 'REDRED', al: 'GREENGREEN', c: '#ff2e4e', len: '3:10' },
  { t: 'ACAI', al: 'GREENGREEN', c: '#8b5cff', len: '2:49' },
  { t: 'Blue Lips', al: 'GREENGREEN', c: '#4cc9ff', len: '3:20' }
];
var D = {
  screen: 'home', day: 1, done: {}, packs: [], owned: {}, cel: {}, force: 0,
  colCon: 1, drawn: [], idx: 0, showMode: 'reveal', detail: null, flipped: false,
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
    var firstIncomplete = 1;
    for (var q = 1; q <= 3; q++) { if (q <= Math.max(openC, 1) && cnt(owned, q) < 5) { firstIncomplete = q; break; } }

    /* ------------- thao tác ------------- */
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
      var p0 = x.packs[0];
      var pc = p0.con || x.pickCon || 0;
      if (!pc) { var fi = 1; for (var z = 1; z <= 3; z++) { if (cnt(x.owned, z) < 5) { fi = z; break; } } pc = fi; }
      set({ screen: 'pack', tearing: false, pickCon: p0.con ? 0 : pc });
    };
    var startUnlock = function (c) {
      var x = st(); var c2 = cl(x.cel); c2[c] = true;
      set({ cel: c2, packs: x.packs.concat([{ con: c, kind: 'bonus' }]), uc: c, colCon: c, screen: 'unlock' });
    };
    var doOpen = function () {
      var x = st(); var pk = x.packs[0]; if (!pk) return;
      var con = pk.con || x.pickCon || 1;
      var own = cl(x.owned), got = {}, out = [], nn = 0, hh = 0, dup = 0;
      for (var p = 0; p < 5; p++) {
        var holo = false, slot = 0;
        if (pk.kind === 'bonus') { slot = rnd(5); }
        else if (x.force === 1) { holo = true; slot = rnd(5); }
        else if (x.force === 2) {
          var miss = []; for (var i = 0; i < 5; i++) if (!own[con + 'n' + i]) miss.push(i);
          if (miss.length) slot = miss[rnd(miss.length)]; else slot = rnd(5);
        } else { var r = Math.random() * 100; if (r < 80) slot = Math.floor(r / 16); else { holo = true; slot = Math.floor((r - 80) / 4); } }
        var key = con + (holo ? 'h' : 'n') + slot, before = own[key] || 0;
        own[key] = before + 1;
        if (holo) hh++; else nn++;
        if (before > 0) dup++;
        out.push({ con: con, slot: slot, holo: holo, isNew: before === 0, count: before + 1 });
      }
      set({ owned: own, drawn: out, idx: 0, packs: x.packs.slice(1), tearing: false, screen: 'show', showMode: 'reveal', flipped: false, colCon: con,
        log: 'Pack ' + CON[con].n + (pk.kind === 'bonus' ? ' (tặng)' : '') + ': ' + nn + ' thường, ' + hh + ' holo, ' + dup + ' trùng.',
        stN: x.stN + nn, stH: x.stH + hh, stP: x.stP + 1 });
    };
    var finishReveal = function () {
      var x = st();
      for (var c = 1; c <= 3; c++) { if (cnt(x.owned, c) === 5 && !x.cel[c]) { startUnlock(c); return; } }
      set({ screen: x.packs.length ? 'hub' : 'col', flipped: false });
    };

    /* ------------- màn hình & dữ liệu hiển thị ------------- */
    var scr = s.screen;
    var cur = s.showMode === 'reveal' ? (s.drawn[s.idx] || s.drawn[0]) : s.detail;
    cur = cur || { con: 1, slot: 0, holo: false, isNew: true, count: 1 };
    var cc = CON[cur.con];
    var V = {
      isHome: scr === 'home', isHub: scr === 'hub', isPack: scr === 'pack', isShow: scr === 'show', isCol: scr === 'col',
      isUnlock: scr === 'unlock', isUGet: scr === 'uget', isView: scr === 'view', isRew: scr === 'rew',
      isUpick: scr === 'upick', isUcard: scr === 'ucard', isUchoose: scr === 'uchoose', isUplay: scr === 'uplay',
      hasToast: !!s.toast, toast: s.toast
    };

    /* banner & lịch */
    var bn = { tag: '', title: '', sub: '', run: '', a: '#FFB02E', pano: CON[1].pano, prog: false, cta: false, ctaTxt: '', go: function () { set({ screen: 'hub' }); } };
    var pn = packs.length;
    if (day < 1) { bn.tag = 'SẮP DIỄN RA'; bn.title = 'Mùa Concept'; bn.sub = 'Bắt đầu 17/10 · còn ' + (17 - (16 + day)) + ' ngày'; bn.a = '#8b5cff'; }
    else if (day > 10) { bn.tag = 'ĐÃ KẾT THÚC'; bn.title = 'Mùa Concept đã khép lại'; bn.sub = 'Bộ sưu tập của bạn được giữ nguyên.'; bn.a = '#8F8FD0'; bn.cta = true; bn.ctaTxt = 'Xem bộ sưu tập'; bn.go = function () { set({ screen: 'col' }); }; bn.prog = true; }
    else if (allCel) { bn.tag = 'HOÀN THÀNH'; bn.title = 'Đã gom đủ 3 concept'; bn.sub = 'Thẻ Ultra đang chờ bạn.'; bn.a = '#FFE45E'; bn.run = 'run'; bn.cta = true; bn.ctaTxt = 'Nhận thẻ Ultra'; bn.prog = true; bn.go = function () { set({ screen: 'col', colCon: 4 }); }; }
    else {
      var bc = dc || firstIncomplete; bn.a = CON[bc].a; bn.pano = CON[bc].pano; bn.run = 'run';
      bn.tag = 'ĐANG DIỄN RA · NGÀY ' + day + '/10'; bn.prog = true; bn.cta = true;
      if (pn > 0) { bn.title = pn + ' pack đang chờ bạn mở'; bn.sub = CON[bc].n; bn.ctaTxt = 'Mở pack'; bn.go = function () { openPackF(); }; }
      else if (celN > 0 && !taskDone) { bn.title = 'Đủ ' + celN + '/3 concept'; bn.sub = 'Làm nhiệm vụ hôm nay để lấy pack.'; bn.ctaTxt = 'Vào sự kiện'; }
      else if (taskDone) { bn.title = 'Nhiệm vụ hôm nay đã xong'; bn.sub = 'Hẹn bạn ngày mai.'; bn.ctaTxt = 'Vào sự kiện'; }
      else { bn.title = 'Nhiệm vụ: ' + task.t; bn.sub = task.d; bn.ctaTxt = 'Vào sự kiện'; }
    }
    V.dateLbl = WDL[day] + ', ' + (16 + day) + '/10/2026';
    V.bnTag = bn.tag; V.bnTitle = bn.title; V.bnSub = bn.sub; V.bnRun = bn.run; V.bnA = bn.a; V.bnPano = bn.pano;
    V.bnProg = bn.prog; V.bnPct = (celN / 3 * 100) + '%'; V.bnCta = bn.cta; V.bnCtaTxt = bn.ctaTxt; V.bnGo = bn.go;
    V.evTask = live; V.tkOn = taskDone ? 'on' : ''; V.taskT = task.t; V.taskD = task.d;
    V.doneToday = ((taskDone ? 1 : 0) + 1) + '/' + (live ? 3 : 2) + ' xong';
    V.showUp = day < 1;
    V.tick = tickF;

    /* trang sự kiện */
    V.hubSub = live ? 'Ngày ' + day + '/10 · ' + WDL[day] : (day < 1 ? 'Sắp diễn ra' : 'Đã kết thúc');
    V.hubTag = day === 10 ? 'NGÀY BÙ' : (live ? 'NHIỆM VỤ HÔM NAY · ' + CON[dc].n.toUpperCase() : 'NHIỆM VỤ');
    V.hubDone = live && taskDone; V.hubOpen = live && !taskDone;
    V.hasPacks = pn > 0; V.noPacks = pn === 0; V.packN = pn; V.celN = celN;
    V.concs = [1, 2, 3].map(function (c) {
      var n = cnt(owned, c), h = cnt(owned, c, true), lk = c > openC;
      return { i: c, a: CON[c].a, n: CON[c].n, week: lk ? 'MỞ ' + CON[c].open : CON[c].week, pano: CON[c].pano, pct: (n / 5 * 100) + '%',
        cls: lk ? 'lk' : (cel[c] ? 'done' : ''), line: lk ? 'Chưa mở' : (cel[c] ? 'Đủ bộ · ' + n + '/5 thường, ' + h + '/5 holo' : n + '/5 thường · ' + h + '/5 holo') };
    });
    V.openCon = function (e) { set({ screen: 'col', colCon: idxOf(e) }); };
    V.tdays = [];
    for (var t = 1; t <= 10; t++) {
      var tc = dayCon(t), cls = '';
      if (s.done[t]) cls = 'done'; else if (t === day) cls = 'today'; else if (t < day) cls = 'miss';
      if (t === 10) cls += ' bu';
      V.tdays.push({ d: 16 + t, cls: cls, c: tc ? CON[tc].a : '#FFE45E' });
    }

    /* mở pack */
    var pk0 = packs[0] || { con: 0, kind: 'daily' };
    var pcon = pk0.con || s.pickCon || firstIncomplete;
    V.pkA = CON[pcon].a; V.pkPick = pk0.con === 0 && pn > 0;
    for (var k = 1; k <= 3; k++) { V['pc' + k] = pcon === k ? 'on' : ''; V['pk' + k + 'd'] = pcon === k && pk0.kind !== 'bonus'; V['pk' + k + 'b'] = pcon === k && pk0.kind === 'bonus'; }
    V.pickC = function (e) { set({ pickCon: idxOf(e) }); };
    V.pkHead = 'Còn ' + pn + ' pack'; V.pkLabel = pk0.kind === 'bonus' ? 'Pack quà tặng · ' + CON[pcon].n : 'Pack ' + CON[pcon].n;
    V.pkSub = pk0.kind === 'bonus' ? '5 thẻ thường' : '5 thẻ · thường 16% mỗi thẻ, holo 4% mỗi thẻ';
    V.trCls = s.tearing ? 'go' : ''; V.tearTxt = s.tearing ? 'Đang xé…' : 'Xé pack';
    V.tear = function () { var x = st(); if (x.tearing || !x.packs.length) return; set({ tearing: true }); setTimeout(doOpen, 1500); };
    V.openPack = openPackF;

    /* xem thẻ */
    V.shA = cc.a; V.cImg = IMG[cur.con][cur.slot]; V.cName = MEM[cur.slot]; V.cNo = ('0' + (cur.slot + 1)).slice(-2);
    V.cConUp = cc.n.toUpperCase(); V.cConName = cc.n; V.cVars = '--a:' + cc.a + ';--b:' + cc.b;
    V.showNorm = !cur.holo; V.showHolo = !!cur.holo;
    for (var bc2 = 1; bc2 <= 3; bc2++) for (var bs = 0; bs < 5; bs++) { V['bk_' + bc2 + '_n_' + bs] = cur.con === bc2 && cur.slot === bs && !cur.holo; V['bk_' + bc2 + '_h_' + bs] = cur.con === bc2 && cur.slot === bs && !!cur.holo; }
    V.isReveal = s.showMode === 'reveal'; V.isDetail = s.showMode !== 'reveal';
    V.shLabel = V.isReveal ? 'Thẻ ' + (s.idx + 1) + '/5 · ' + (cur.holo ? 'HOLO' : 'THƯỜNG') : 'Chi tiết thẻ · ' + (cur.holo ? 'HOLO' : 'THƯỜNG');
    V.flipCls = s.flipped ? 'on' : ''; V.popCls = 'p' + (s.idx % 2);
    V.flipCard = function () { set({ flipped: !s.flipped }); };
    var isNewB = V.isReveal ? cur.isNew : true;
    V.badgeTxt = V.isReveal ? (cur.isNew ? 'THẺ MỚI' : 'ĐÃ CÓ · ×' + cur.count) : 'SỞ HỮU ×' + (owned[cur.con + (cur.holo ? 'h' : 'n') + cur.slot] || 0);
    V.badgeBg = isNewB ? '#FF2E88' : 'rgba(255,255,255,.16)'; V.badgeFg = isNewB ? '#fff' : '#C7C6F5';
    V.dots = [0, 1, 2, 3, 4].map(function (d) { return { cls: d <= s.idx ? 'on' : '' }; });
    V.nextTxt = s.idx >= 4 ? 'Xong' : 'Tiếp';
    V.nextCard = function () { var x = st(); if (x.idx < 4) set({ idx: x.idx + 1, flipped: false }); else finishReveal(); };
    V.closeShow = function () { set({ screen: 'col', flipped: false }); };

    /* bộ sưu tập */
    var ct = s.colCon, ccol = CON[ct] || CON[1];
    var locked = ct <= 3 && ct > openC;
    V.tb1 = ct === 1 ? 'on' : ''; V.tb2 = ct === 2 ? 'on' : ''; V.tb3 = ct === 3 ? 'on' : ''; V.tb4 = ct === 4 ? 'on' : '';
    V.tabA = ct === 4 ? '#FFE45E' : ccol.a; V.colName = ct === 4 ? 'Ultra Limited' : ccol.n;
    V.colOpen = ct <= 3 && !locked; V.colLocked = locked; V.colUltra = ct === 4; V.lockDate = ccol.open + '/2026';
    V.setTab = function (e) { set({ colCon: idxOf(e) }); };
    var mkTiles = function (h) {
      var o = [];
      for (var i = 0; i < 5; i++) {
        var c = (owned[ct + (h ? 'h' : 'n') + i] || 0);
        o.push({ i: i + (h ? 10 : 0), cls: c ? (h ? 'ho' : '') : 'lk', img: IMG[ct] ? IMG[ct][i] : '', nm: MEM[i], x: c, xd: c > 1 ? 'block' : 'none' });
      }
      return o;
    };
    V.tilesN = mkTiles(false); V.tilesH = mkTiles(true);
    var nOwn = ct <= 3 ? cnt(owned, ct) : 0, hOwn = ct <= 3 ? cnt(owned, ct, true) : 0;
    V.colN = nOwn; V.colH = hOwn; V.colTotal = nOwn + hOwn;
    V.colPano = ccol.pano; V.panoOk = nOwn === 5;
    V.panoRim = nOwn === 5 ? 'linear-gradient(100deg,#fff,' + ccol.a + ',#4CC9FF,#fff)' : '#363078'; V.panoState = nOwn === 5 ? 'ĐÃ MỞ' : nOwn + '/5 MẢNH';
    V.bands = [0, 1, 2, 3, 4].map(function (i) { return { left: (i * 20) + '%', cls: owned[ct + 'n' + i] ? 'get' : '' }; });
    V.tileOpen = function (e) {
      var v = idxOf(e), h = v >= 10, sl = v % 10, x = st();
      if (!x.owned[x.colCon + (h ? 'h' : 'n') + sl]) { flash('Chưa có thẻ này'); return; }
      set({ screen: 'show', showMode: 'detail', detail: { con: x.colCon, slot: sl, holo: h, isNew: false, count: 1 }, flipped: false });
    };
    V.goView = function () {
      var x = st(); var c = x.colCon <= 3 ? x.colCon : 1;
      if (cnt(x.owned, c) < 5) { flash('Gom đủ 5 thẻ thường để mở panorama'); if (x.screen !== 'col') set({ screen: 'col', colCon: c }); return; }
      set({ screen: 'view', colCon: c, pan: 18 });
    };
    var IMGW = 520 * ccol.ar, VW = 390, fov = VW / IMGW * 100;
    V.imgW = Math.round(IMGW); V.panVal = s.pan; V.panX = (-(s.pan / 100) * (IMGW - VW)).toFixed(1) + 'px';
    V.fovW = fov.toFixed(2) + '%'; V.fovX = ((s.pan / 100) * (100 - fov)).toFixed(2) + '%';
    V.onPan = function (e) { set({ pan: Number(e.target.value) }); };

    /* mở khóa concept */
    var uc = CON[s.uc] || CON[1];
    V.ucA = uc.a; V.ucName = uc.n; V.ucPano = uc.pano; V.ucFr = IMG[s.uc][2];
    V.ucV = '--a:' + uc.a + ';--c:' + uc.b + ';--bl:14px'; V.ucT = '--a:' + uc.a + ';--b:' + uc.b;
    V.unPack = openPackF;
    V.unNextTxt = allCel ? 'Tiếp: nhận thẻ Ultra' : 'Về bộ sưu tập';
    V.unNext = function () { var x = st(); var all = x.cel[1] && x.cel[2] && x.cel[3]; set({ screen: all ? 'uget' : 'col' }); };

    /* phần thưởng */
    V.rews = [1, 2, 3].map(function (c) {
      var ok = cnt(owned, c) === 5;
      return { a: CON[c].a, n: CON[c].n, st: ok ? 'ĐÃ MỞ · CONCEPT ' + c : 'CHƯA MỞ · CONCEPT ' + c, dim: ok ? '' : 'opacity:.38;filter:grayscale(.9)',
        v: '--a:' + CON[c].a + ';--c:' + CON[c].b + ';--bl:9px', t: '--a:' + CON[c].a + ';--b:' + CON[c].b, img: IMG[c][c + 1] };
    });
    V.goHome = function () { set({ screen: 'home' }); }; V.goHub = function () { set({ screen: 'hub' }); };
    V.goCol = function () { set({ screen: 'col' }); }; V.goRew = function () { set({ screen: 'rew' }); };

    /* Ultra */
    var uAll = allCel;
    var ult = s.ult;
    V.ultraSt = uAll ? 'ĐÃ MỞ KHÓA' : 'CẦN ĐỦ 3 CONCEPT';
    for (var uu = 1; uu <= 2; uu++) {
      V['u' + uu + 'Ready'] = uAll && !!ult[uu]; V['u' + uu + 'New'] = uAll && !ult[uu]; V['u' + uu + 'Lock'] = !uAll;
      V['u' + uu + 'Songs'] = ult[uu] ? SONGS[ult[uu][0]].t + ' · ' + SONGS[ult[uu][1]].t : '';
    }
    V.openU = function (e) { set({ u: idxOf(e), screen: 'ucard' }); };
    V.startU = function (e) { set({ u: idxOf(e), screen: 'upick', sel: [0, 4] }); };
    V.startU1 = function () { set({ u: 1, screen: 'upick', sel: [0, 4] }); };
    V.jumpU = function () { var x = st(); if (x.cel[1] && x.cel[2] && x.cel[3]) set({ screen: 'col', colCon: 4 }); else { flash('Cần đủ 3 concept trước'); set({ screen: 'col', colCon: 4 }); } };
    V.u = s.u; V.uIs1 = s.u === 1; V.uIs2 = s.u === 2;
    var sel = s.sel;
    V.songs = SONGS.map(function (x, i) { return { i: i, t: x.t, al: x.al, c: x.c, cls: sel.indexOf(i) >= 0 ? 'on' : '' }; });
    V.pickSong = function (e) {
      var i = idxOf(e), n = sel.slice(), k = n.indexOf(i);
      if (k >= 0) n.splice(k, 1); else if (n.length < 2) n.push(i); else { n.shift(); n.push(i); }
      set({ sel: n });
    };
    var ready = sel.length === 2;
    V.lockCls = ready ? '' : 'off'; V.lockTxt = ready ? 'Khóa 2 bài vào thẻ (không đổi được)' : 'Chọn đủ 2 bài (' + sel.length + '/2)';
    V.lock = function () { var x = st(); if (x.sel.length !== 2) return; var u2 = cl(x.ult); u2[x.u] = x.sel.slice(); set({ ult: u2, screen: 'ucard' }); flash('Đã khóa 2 bài vào thẻ #' + x.u); };
    var pair = ult[s.u] || [0, 4];
    var A = SONGS[pair[0]], B = SONGS[pair[1]], curS = s.disc === 'B' ? B : A;
    V.titleA = A.t; V.titleB = B.t; V.cA = A.c; V.cB = B.c;
    V.stCls = s.disc === 'B' ? 'pB' : 'pA'; V.curT = curS.t; V.curAl = curS.al; V.curLen = '0:00 / ' + curS.len;
    V.psCls = s.paused ? 'ps' : ''; V.pauseTxt = s.paused ? '▶  Tiếp tục' : '❚❚  Tạm dừng';
    V.openChoose = function () { set({ screen: 'uchoose' }); }; V.goUcard = function () { set({ screen: 'ucard', paused: false }); };
    V.goChoose = function () { set({ screen: 'uchoose' }); }; V.backCol = function () { set({ screen: 'col', colCon: 4 }); };
    V.playA = function () { set({ screen: 'uplay', disc: 'A', paused: false }); }; V.playB = function () { set({ screen: 'uplay', disc: 'B', paused: false }); };
    V.togglePause = function () { set({ paused: !s.paused }); };

    /* ------------- bảng điều khiển ------------- */
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
      set({ owned: o, cel: cx, screen: 'uget', day: Math.max(x.day, 7) });
    };
    V.prevUnlock = function () { set({ screen: 'unlock', uc: s.colCon <= 3 ? s.colCon : 1 }); };
    V.reset = function () { var o = {}; for (var k in D) o[k] = cl({ v: D[k] }).v; set(o); };
    var rate = (s.stN + s.stH) ? (s.stH / (s.stN + s.stH) * 100).toFixed(1) : '0';
    V.stats = 'Pack đang chờ: ' + pn + ' · Đã mở: ' + s.stP + '\nThẻ rút: ' + s.stN + ' thường, ' + s.stH + ' holo (' + rate + '% holo, mục tiêu 20%)\nLần mở gần nhất: ' + s.log;
    return V;
  }
}
