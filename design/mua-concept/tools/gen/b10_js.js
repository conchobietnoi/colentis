var CON = {
  1: { n: 'Urichinguchana', a: '#FFB02E', b: '#FFE3B0', ar: 3200 / 872, week: 'CHẶNG 1 · 18–20/10', open: '18/10', pano: '/_blob/f730f2dd4f477387495cedf54a3913b2' },
  2: { n: 'Aniyaaa', a: '#FF2E88', b: '#FFC1DB', ar: 3200 / 534, week: 'CHẶNG 2 · 21–23/10', open: '21/10', pano: '/_blob/484fcef07c4335075fec501a08f1b00d' },
  3: { n: 'Poyoyoi', a: '#4CC9FF', b: '#C7EEFF', ar: 3200 / 1023, week: 'CHẶNG 3 · 24–26/10', open: '24/10', pano: '/_blob/82135d43d2d2516c9c56952f8a7b2d7e' }
};
var IMG = {
  1: ['/_blob/9b3657bf78f9debc45654b412d45e46e', '/_blob/7f3a0d5d84f7f9d4291ccd84d6269872', '/_blob/e6664c8ce73f1683c62d87f9355da480', '/_blob/6910cde8e984b316e9ab26144bcacfb9', '/_blob/e8bc69d2a0ef3c5809440db91f604866'],
  2: ['/_blob/a4322f2c1c6e62b3912f802a7dcc6ce6', '/_blob/90bd6a80c9ec86fd707bc45d60eaa4f7', '/_blob/87e85549ca72b3c4f7122e2d9d87357c', '/_blob/1129421846df7be4127d35d7695e1a4b', '/_blob/07bcb16975b6f9ecb2df531abad5d56d'],
  3: ['/_blob/656b5da2ae3359ca633b20430f00cfc7', '/_blob/abf851c6f9764a7c72c682ce5d7035d0', '/_blob/f7972e8a903a9fb9e0c8c2821cd04871', '/_blob/f07c441f3163eeb01e8e1702e8cb0e9e', '/_blob/bbab3816b7dd5e6405fc9d8d756e4244']
};
var RAR = {
  common: { n: 'Thường', tag: 'THƯỜNG', a: '#8D94B8', tot: 30, ar: 0.74, p: 70 },
  rare: { n: 'Hiếm', tag: 'HIẾM', a: '#2F8CFF', tot: 30, ar: 0.74, p: 22 },
  legend: { n: 'Huyền Thoại', tag: 'HUYỀN THOẠI', a: '#9B5CFF', tot: 15, ar: 0.74, p: 7 },
  supreme: { n: 'Bá khí', tag: 'BÁ KHÍ', a: '#FF2E88', tot: 4, ar: 1.33, p: 1 }
};
var SUPIMG = ['/_blob/269d11cf44ab7ca2dcc2304847be20d5', '/_blob/c110bf7fbd2f4797c1244e4542f13074', '/_blob/415f4cc4535cbcd2862f5bf8c7c2ddfd', '/_blob/e5ff1702f705429cb50d2fc2ab673790'];
var SUPAR = [1.333, 1.333, 1.42, 1];
function appImg(r, i) { return r === 'supreme' ? SUPIMG[i] : IMG[1 + i % 3][i % 5]; }
function appAr(r, i) { return r === 'supreme' ? SUPAR[i] : 0.74; }
function appCls(r, i) { return 'r-' + r + (r === 'supreme' ? ' s s' + (i + 1) : '') + (r === 'rare' || r === 'legend' ? ' comet' : ''); }
function wheelR() { var r = Math.random() * 100; return r < 70 ? 'common' : r < 92 ? 'rare' : r < 99 ? 'legend' : 'supreme'; }
function appHave(bo, r) { var n = 0; for (var k in bo) if (k.indexOf(r + '-') === 0 && bo[k] > 0) n++; return n; }
var PT = [{ id: 'gb', n: 'Gia Bảo', ini: 'GB', a: '#4CC9FF' }, { id: 'tt', n: 'Thu Trang', ini: 'TT', a: '#FFE45E' }];
function ptName(id) { for (var i = 0; i < PT.length; i++) if (PT[i].id === id) return PT[i].n; return 'Người kia'; }
var MEM = ['JAMES', 'JUHOON', 'KEONHO', 'MARTIN', 'SEONGHYEON'];
var WD = ['T7', 'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN', 'T2', 'T3', 'T4'];
var WDL = ['Thứ Bảy', 'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư'];
var TASKS = [null,
  { t: 'Rạng Sáng', d: 'Tick xong 1 việc trước 9 giờ sáng.' },
  { t: 'Nhà Của Mình', d: 'Hoàn thành 1 việc nhà.' },
  { t: 'Khởi Động Tuần', d: 'Lên lịch ít nhất 1 việc cho ngày mai.' },
  { t: 'Gửi Yêu Thương', d: 'Hoàn thành 1 việc dành cho người khác.' },
  { t: 'Xếp Hình Giờ Giấc', d: 'Gắn giờ cho 1 việc bất kỳ.' },
  { t: 'Cú Đêm', d: 'Hoàn thành 1 việc sau 21 giờ.' },
  { t: 'Dọn Nhà Cuối Tuần', d: 'Hoàn thành 1 việc nhà.' },
  { t: 'Chốt Sổ', d: 'Hoàn thành 3 việc trong hôm nay.' },
  { t: 'Cả Nhà Cùng Làm', d: 'Hoàn thành 1 việc chung.' }
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

function ultraSfx5() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    if (window.__ugc) { try { var cp = window.__ugc.close(); if (cp && cp.catch) cp.catch(function () {}); } catch (e) {} }
    var c = new AC(); window.__ugc = c; if (c.resume) c.resume();
    var t = c.currentTime + 0.05, m = c.createGain(); m.gain.value = (window.__ugm ? 0.3 : 0.58); m.connect(c.destination);
    var nz = function (d) { var b = c.createBuffer(1, Math.floor(c.sampleRate * d), c.sampleRate), a = b.getChannelData(0); for (var i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; var s = c.createBufferSource(); s.buffer = b; return s; };
    var env = function (g, at, peak, dur, rel) { g.gain.setValueAtTime(0.0001, t + at); g.gain.exponentialRampToValueAtTime(peak, t + at + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur + rel); };
    var kick = function (at, v) { var o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(150, t + at); o.frequency.exponentialRampToValueAtTime(42, t + at + 0.18); o.connect(g); g.connect(m); env(g, at, v, 0.005, 0.3); o.start(t + at); o.stop(t + at + 0.4); };
    var snare = function (at, v) { var n = nz(0.2), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'highpass'; f.frequency.value = 1800; n.connect(f); f.connect(g); g.connect(m); env(g, at, v, 0.003, 0.14); n.start(t + at); n.stop(t + at + 0.25); };
    for (var k = 0; k < 6; k++) kick(1.0 + k * 0.5, 0.7);
    var at = 3.0, gap = 0.22, i2 = 0; while (at < 4.18) { snare(at, 0.18 + i2 * 0.035); at += gap; gap = Math.max(0.05, gap * 0.82); i2++; }
    var cr = nz(1.2), cb = c.createBiquadFilter(), cg = c.createGain(); cb.type = 'bandpass'; cb.Q.value = 0.6; cb.frequency.setValueAtTime(700, t + 0.9); cb.frequency.exponentialRampToValueAtTime(1800, t + 4.2);
    cr.loop = true; cr.connect(cb); cb.connect(cg); cg.connect(m); env(cg, 0.9, 0.12, 2.6, 0.2); cr.start(t + 0.9); cr.stop(t + 4.0);
    var bo = c.createOscillator(), bg = c.createGain(); bo.frequency.setValueAtTime(130, t + 4.2); bo.frequency.exponentialRampToValueAtTime(30, t + 5.4); bo.connect(bg); bg.connect(m); env(bg, 4.2, 1.0, 0.03, 1.4); bo.start(t + 4.2); bo.stop(t + 5.7);
    var cs = nz(3), ch = c.createBiquadFilter(), cgn = c.createGain(); ch.type = 'highpass'; ch.frequency.value = 5000; cs.connect(ch); ch.connect(cgn); cgn.connect(m); env(cgn, 4.2, 0.45, 0.01, 2.6); cs.start(t + 4.2); cs.stop(t + 7.4);
    var ck = nz(3.4), cf = c.createBiquadFilter(), ckg = c.createGain(); cf.type = 'bandpass'; cf.frequency.value = 1500; cf.Q.value = 0.5; ck.connect(cf); cf.connect(ckg); ckg.connect(m); env(ckg, 4.3, 0.22, 0.9, 2.4); ck.start(t + 4.3); ck.stop(t + 8);
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(m); env(g, 4.5 + i * 0.1, 0.07, 0.35, 3); o.start(t + 4.5 + i * 0.1); o.stop(t + 8.4); });
    [7.0, 8.2].forEach(function (a2) { [1318.5, 1976, 2637].forEach(function (f, i) { var o = c.createOscillator(), g = c.createGain(); o.frequency.value = f; o.connect(g); g.connect(m); env(g, a2 + 0.35, 0.16 / (i + 1), 0.01, 1.7); o.start(t + a2 + 0.35); o.stop(t + a2 + 2.4); }); kick(a2 + 0.3, 0.8); });
  } catch (e) {}
}

function ultraSfx3() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    if (window.__ugc) { try { var cp = window.__ugc.close(); if (cp && cp.catch) cp.catch(function () {}); } catch (e) {} }
    var c = new AC(); window.__ugc = c; if (c.resume) c.resume();
    var t = c.currentTime + 0.05, m = c.createGain(); m.gain.value = (window.__ugm ? 0.3 : 0.58); m.connect(c.destination);
    var nz = function (d) { var b = c.createBuffer(1, Math.floor(c.sampleRate * d), c.sampleRate), a = b.getChannelData(0); for (var i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; var s = c.createBufferSource(); s.buffer = b; return s; };
    var env = function (g, at, peak, dur, rel) { g.gain.setValueAtTime(0.0001, t + at); g.gain.exponentialRampToValueAtTime(peak, t + at + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur + rel); };
    [0, 1].forEach(function (q) { var o = c.createOscillator(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(180 * (1 + q * 0.5), t + 0.7); o.frequency.exponentialRampToValueAtTime(2400 * (1 + q * 0.5), t + 3.9);
      l.frequency.setValueAtTime(3, t + 0.7); l.frequency.exponentialRampToValueAtTime(30, t + 3.9); lg.gain.value = 0.12; l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(m); env(g, 0.7, 0.22, 3.0, 0.1); o.start(t + 0.7); o.stop(t + 4.1); l.start(t + 0.7); l.stop(t + 4.1); });
    var dr = c.createOscillator(), dg = c.createGain(), lp = c.createBiquadFilter(); dr.type = 'sawtooth'; dr.frequency.setValueAtTime(44, t + 0.5); dr.frequency.exponentialRampToValueAtTime(100, t + 3.9); lp.type = 'lowpass'; lp.frequency.value = 400;
    dr.connect(lp); lp.connect(dg); dg.connect(m); env(dg, 0.5, 0.3, 3.3, 0.2); dr.start(t + 0.5); dr.stop(t + 4.2);
    var rs = nz(4), bp = c.createBiquadFilter(), rg = c.createGain(); bp.type = 'bandpass'; bp.Q.value = 1.2; bp.frequency.setValueAtTime(300, t + 1.6); bp.frequency.exponentialRampToValueAtTime(5200, t + 3.9);
    rs.connect(bp); bp.connect(rg); rg.connect(m); env(rg, 1.6, 0.4, 2.3, 0.15); rs.start(t + 1.6); rs.stop(t + 4.1);
    var bo = c.createOscillator(), bg = c.createGain(); bo.frequency.setValueAtTime(150, t + 3.9); bo.frequency.exponentialRampToValueAtTime(32, t + 5.2); bo.connect(bg); bg.connect(m); env(bg, 3.9, 1.0, 0.04, 1.4); bo.start(t + 3.9); bo.stop(t + 5.4);
    var bn = nz(1.6), bl = c.createBiquadFilter(), bng = c.createGain(); bl.type = 'lowpass'; bl.frequency.setValueAtTime(3200, t + 3.9); bl.frequency.exponentialRampToValueAtTime(160, t + 5.3); bn.connect(bl); bl.connect(bng); bng.connect(m); env(bng, 3.9, 0.7, 0.03, 1.4); bn.start(t + 3.9); bn.stop(t + 5.6);
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { var o = c.createOscillator(), g = c.createGain(); o.frequency.value = f; o.connect(g); g.connect(m); env(g, 4.4 + i * 0.09, 0.07, 0.35, 3.2); o.start(t + 4.4 + i * 0.09); o.stop(t + 8.5); });
    [7.0, 8.2].forEach(function (at) { [1318.5, 1976, 2637].forEach(function (f, i) { var o = c.createOscillator(), g = c.createGain(); o.frequency.value = f; o.connect(g); g.connect(m); env(g, at + 0.35, 0.16 / (i + 1), 0.01, 1.7); o.start(t + at + 0.35); o.stop(t + at + 2.4); }); });
  } catch (e) {}
}

function ultraSfx4() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    if (window.__ugc) { try { var cp = window.__ugc.close(); if (cp && cp.catch) cp.catch(function () {}); } catch (e) {} }
    var c = new AC(); window.__ugc = c; if (c.resume) c.resume();
    var t = c.currentTime + 0.05, m = c.createGain(); m.gain.value = (window.__ugm ? 0.3 : 0.58); m.connect(c.destination);
    var nz = function (d) { var b = c.createBuffer(1, Math.floor(c.sampleRate * d), c.sampleRate), a = b.getChannelData(0); for (var i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; var s = c.createBufferSource(); s.buffer = b; return s; };
    var env = function (g, at, peak, dur, rel) { g.gain.setValueAtTime(0.0001, t + at); g.gain.exponentialRampToValueAtTime(peak, t + at + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur + rel); };
    var kick = function (at, v, f0) { var o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(f0 || 150, t + at); o.frequency.exponentialRampToValueAtTime(40, t + at + 0.2); o.connect(g); g.connect(m); env(g, at, v, 0.005, 0.3); o.start(t + at); o.stop(t + at + 0.45); };
    var sweep = function (at, dur, f0, f1, v) { var n = nz(dur + 0.1), bp = c.createBiquadFilter(), g = c.createGain(); bp.type = 'bandpass'; bp.Q.value = 2; bp.frequency.setValueAtTime(f0, t + at); bp.frequency.exponentialRampToValueAtTime(f1, t + at + dur); n.connect(bp); bp.connect(g); g.connect(m); env(g, at, v, dur * 0.4, dur * 0.6); n.start(t + at); n.stop(t + at + dur + 0.2); };
    kick(0.6, 0.5); kick(1.0, 0.4);
    sweep(1.1, 1.4, 3000, 200, 0.5); sweep(1.7, 1.4, 3000, 200, 0.5);
    kick(2.6, 0.95, 120); kick(3.2, 0.95, 120);
    [2.6, 3.2].forEach(function (a) { var n = nz(0.15), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'lowpass'; f.frequency.value = 900; n.connect(f); f.connect(g); g.connect(m); env(g, a, 0.5, 0.004, 0.12); n.start(t + a); n.stop(t + a + 0.2); });
    var cr = nz(2.2), ch = c.createBiquadFilter(), cg = c.createGain(); ch.type = 'highpass'; ch.frequency.value = 6500; cr.connect(ch); ch.connect(cg); cg.connect(m); env(cg, 3.4, 0.06, 0.4, 1.6); cr.start(t + 3.4); cr.stop(t + 5.8);
    var ri = c.createOscillator(), rg = c.createGain(), rf = c.createBiquadFilter(); ri.type = 'sawtooth'; ri.frequency.setValueAtTime(90, t + 3.6); ri.frequency.exponentialRampToValueAtTime(900, t + 4.85); rf.type = 'lowpass'; rf.frequency.setValueAtTime(300, t + 3.6); rf.frequency.exponentialRampToValueAtTime(5000, t + 4.85);
    ri.connect(rf); rf.connect(rg); rg.connect(m); env(rg, 3.6, 0.22, 1.1, 0.1); ri.start(t + 3.6); ri.stop(t + 4.95);
    sweep(4.35, 0.7, 400, 4000, 0.45);
    var bo = c.createOscillator(), bg = c.createGain(); bo.frequency.setValueAtTime(140, t + 4.9); bo.frequency.exponentialRampToValueAtTime(30, t + 6); bo.connect(bg); bg.connect(m); env(bg, 4.9, 1.0, 0.03, 1.3); bo.start(t + 4.9); bo.stop(t + 6.3);
    var cs = nz(2.8), cf = c.createBiquadFilter(), csg = c.createGain(); cf.type = 'highpass'; cf.frequency.value = 5000; cs.connect(cf); cf.connect(csg); csg.connect(m); env(csg, 4.9, 0.4, 0.01, 2.4); cs.start(t + 4.9); cs.stop(t + 7.6);
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { var o = c.createOscillator(), g = c.createGain(); o.frequency.value = f; o.connect(g); g.connect(m); env(g, 5.0 + i * 0.1, 0.07, 0.35, 3); o.start(t + 5.0 + i * 0.1); o.stop(t + 8.8); });
    [7.0, 8.2].forEach(function (at) { [1318.5, 1976, 2637].forEach(function (f, i) { var o = c.createOscillator(), g = c.createGain(); o.frequency.value = f; o.connect(g); g.connect(m); env(g, at + 0.35, 0.16 / (i + 1), 0.01, 1.7); o.start(t + at + 0.35); o.stop(t + at + 2.4); }); kick(at + 0.3, 0.7); });
  } catch (e) {}
}
function ultraSfx(v) { if (v === 3) ultraSfx3(); else if (v === 4) ultraSfx4(); else ultraSfx5(); if (window.__ugm) ultraMusic(v === 3 ? 3.9 : v === 4 ? 4.9 : 4.2); }

function stopUltraMusic() {
  try { var a = window.__ugA; if (window.__ugT) { clearInterval(window.__ugT); window.__ugT = 0; } if (window.__ugO) { clearTimeout(window.__ugO); window.__ugO = 0; } if (a) a.pause(); } catch (e) {}
}
function ultraMusic(imp) {
  try {
    stopUltraMusic();
    var a = window.__ugA; if (!a) { a = new Audio(SONGS[0].src); a.preload = 'auto'; window.__ugA = a; }
    var st = Math.max(0, (window.__ugs || 30) - imp);
    var go = function () {
      try { a.currentTime = st; } catch (e) {}
      a.volume = 0; var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
      var v = 0; window.__ugT = setInterval(function () { v = Math.min(1, v + 0.08); try { a.volume = v; } catch (e) {} if (v >= 1) { clearInterval(window.__ugT); window.__ugT = 0; } }, 60);
      window.__ugO = setTimeout(function () { var w = 1; window.__ugT = setInterval(function () { w = Math.max(0, w - 0.1); try { a.volume = w; } catch (e) {} if (w <= 0) { clearInterval(window.__ugT); window.__ugT = 0; a.pause(); } }, 90); }, (imp + 9.2) * 1000);
    };
    if (a.readyState >= 2) go(); else { var f = function () { a.removeEventListener('canplay', f); go(); }; a.addEventListener('canplay', f); a.load(); }
  } catch (e) {}
}
var TABS = ['cal', 'today', 'col', 'fr', 'pro'];
function fmt(x) { x = Math.floor(x || 0); return Math.floor(x / 60) + ':' + ('0' + (x % 60)).slice(-2); }
function stopAudio() { try { if (window.__ca) { window.__ca.pause(); window.__ca.onended = null; window.__ca.ontimeupdate = null; window.__ca = null; } } catch (e) {} }


var D = {
  tab: 'cal', pg: '', fx: '', sheet: '', ust: 'idle', dk: false,
  day: 1, done: {}, packs: [], owned: {}, cel: {}, force: 0,
  colCon: 1, drawn: [], idx: 0, detail: null, flipped: false,
  tearing: false, pickCon: 0, eq: 0, sim: '', logs: [], stB: 0, ugv: 5, ugSk: false, ugm: true, ugs: 30, ult: {}, u: 1, sel: [0, 4], disc: 'A', paused: false,
  toast: '', log: 'Chưa mở pack nào.', stN: 0, stH: 0, stP: 0, pan: 18, uc: 1,
  bo: {}, bl: [], po: {}, inbox: [], preq: [], rq: {}, sent: 0, stA: 0, stBP: 0, who: '', ws: {}, pts: 0, mr: {}, mc: {}, mo: '', xm: []
};
var MAILS = [
  { id: 'm1', day: 0, tag: 'SỰ KIỆN MỚI', tc: '#FFB02E', title: 'Mùa Concept mở từ 18/10', sum: 'Gom thẻ, ghép panorama, nhận 2 thẻ Ultra Limited.',
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
function dayCon(d) { return d >= 1 && d <= 3 ? 1 : d >= 4 && d <= 6 ? 2 : d >= 7 && d <= 9 ? 3 : 0; }
function openN(d) { return d >= 7 ? 3 : d >= 4 ? 2 : d >= 1 ? 1 : 0; }
function cl(o) { return JSON.parse(JSON.stringify(o)); }
function cnt(owned, c, h) { var n = 0; for (var i = 0; i < 5; i++) if (owned[c + (h ? 'h' : 'n') + i]) n++; return n; }
function lg(x, m) { return [m].concat(x.logs || []).slice(0, 6); }
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
    var live = day >= 1 && day <= 9;
    var taskDone = !!s.done[day];
    var task = live ? TASKS[day] : { t: 'Ngoài thời gian sự kiện', d: day < 1 ? 'Sự kiện bắt đầu 18/10.' : 'Sự kiện đã kết thúc 26/10.' };
    var dayA = live ? (dc ? CON[dc].a : '#FFE45E') : '#C9CEF5';
    var pn = packs.length;
    var firstIncomplete = 1;
    for (var q = 1; q <= 3; q++) { if (q <= Math.max(openC, 1) && cnt(owned, q) < 5) { firstIncomplete = q; break; } }
    var clean = function () { return { pg: '', fx: '', sheet: '' }; };

    /* ---- thao tác ---- */
    var tickF = function () {
      var x = st();
      if (x.day < 1 || x.day > 9) { flash('Ngoài thời gian sự kiện'); return; }
      if (x.done[x.day]) { flash('Hôm nay đã xong rồi'); return; }
      var d = cl(x.done); d[x.day] = true;
      var c = dayCon(x.day), pk = x.packs.slice();
      pk.push({ con: c, kind: 'daily' }); pk.push({ con: c, kind: 'daily' });
      set({ done: d, packs: pk, logs: lg(x, 'Ngày ' + x.day + ': xong «' + TASKS[x.day].t + '» → +2 pack') }); flash('Xong nhiệm vụ · nhận 2 pack');
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
      set({ logs: lg(x, 'Mở khóa concept ' + CON[c].n + ' → panorama, khung, danh hiệu, +1 pack thưởng (thẻ app)'), cel: c2, packs: x.packs.concat([{ con: c, kind: 'bonus' }]), uc: c, colCon: c, pg: '', sheet: '', fx: 'unlock' });
    };
    var doOpen = function () {
      var x = st(); var pk = x.packs[0]; if (!pk) return;
      if (pk.kind === 'bonus') {
        var bo = cl(x.bo), outA = [], dupA = 0, cntR = { common: 0, rare: 0, legend: 0, supreme: 0 };
        for (var p = 0; p < 5; p++) {
          var rar = wheelR(), tot = RAR[rar].tot, idx = rnd(tot), miss = [];
          for (var m = 0; m < tot; m++) if (!bo[rar + '-' + m]) miss.push(m);
          if (miss.length && Math.random() < 0.8) idx = miss[rnd(miss.length)];
          var bk = rar + '-' + idx, bef = bo[bk] || 0;
          bo[bk] = bef + 1; if (bef) dupA++; cntR[rar]++;
          outA.push({ app: true, r: rar, i: idx, isNew: bef === 0, count: bef + 1 });
        }
        var sumA = cntR.common + ' Thường, ' + cntR.rare + ' Hiếm, ' + cntR.legend + ' Huyền Thoại, ' + cntR.supreme + ' Bá khí';
        set({ bo: bo, bl: outA.concat(x.bl || []).slice(0, 8), drawn: outA, idx: 0, packs: x.packs.slice(1), tearing: false, fx: 'reveal', flipped: false,
          log: 'Pack thưởng: ' + sumA + ', ' + dupA + ' trùng.', stA: x.stA + 5, stBP: x.stBP + 1, logs: lg(x, 'Mở pack thưởng: ' + sumA) });
        return;
      }
      var con = pk.con || x.pickCon || 1;
      var own = cl(x.owned), out = [], nn = 0, hh = 0, dup = 0;
      for (var p2 = 0; p2 < 5; p2++) {
        var holo = false, slot = 0;
        if (x.force === 1) { holo = true; slot = rnd(5); }
        else if (x.force === 2) {
          var ms = []; for (var i = 0; i < 5; i++) if (!own[con + 'n' + i]) ms.push(i);
          slot = ms.length ? ms[rnd(ms.length)] : rnd(5);
        } else { var r = Math.random() * 100; if (r < 80) slot = Math.floor(r / 16); else { holo = true; slot = Math.floor((r - 80) / 4); } }
        var key = con + (holo ? 'h' : 'n') + slot, before = own[key] || 0;
        own[key] = before + 1;
        if (holo) hh++; else nn++;
        if (before > 0) dup++;
        out.push({ con: con, slot: slot, holo: holo, isNew: before === 0, count: before + 1 });
      }
      set({ owned: own, drawn: out, idx: 0, packs: x.packs.slice(1), tearing: false, fx: 'reveal', flipped: false, colCon: con,
        log: 'Pack ' + CON[con].n + ': ' + nn + ' thường, ' + hh + ' holo, ' + dup + ' trùng.',
        stN: x.stN + nn, stH: x.stH + hh, stP: x.stP + 1, logs: lg(x, 'Mở pack ' + CON[con].n + ': ' + nn + ' thường, ' + hh + ' holo, ' + dup + ' trùng') });
    };
    var finishReveal = function () {
      var x = st();
      for (var c = 1; c <= 3; c++) { if (cnt(x.owned, c) === 5 && !x.cel[c]) { startUnlock(c); return; } }
      var d0 = x.drawn[0] || {};
      set({ fx: '', flipped: false, tab: 'col', colCon: d0.app ? 5 : (d0.con || x.colCon) });
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
      pgMail: s.pg === 'mail', pgHub: s.pg === 'hub', pgDet: s.pg === 'det', pgPano: s.pg === 'pano', pgUcard: s.pg === 'ucard',
      shSongs: s.sheet === 'songs', shWho: s.sheet === 'who',
      fxPack: s.fx === 'pack', fxReveal: s.fx === 'reveal', fxUnlock: s.fx === 'unlock', fxUget: s.fx === 'uget',
      skCls: s.ugSk ? 'skp' : '', toast: s.toast, toastCls: s.toast ? 'on' : '', dkCls: s.dk ? 'dk' : '', dkOn: s.dk ? 'on' : '', tdot: pn > 0 ? 'grid' : 'none'
    };
    TABS.forEach(function (t) { V['tb_' + t] = s.tab === t && !s.pg ? 'on' : (s.tab === t ? 'on' : ''); });
    V.goTab = function (e) { var t = TABS[idxOf(e)]; stopAudio(); set({ tab: t, pg: '', fx: '', sheet: '', ust: 'idle' }); };
    V.toggleDk = function () { set({ dk: !s.dk }); };

    /* ---- banner, lịch, hôm nay ---- */
    var bn = { title: '', sub: '', bg: 'linear-gradient(120deg,#0d1030,#3a2a8a 50%,#ff6fb5)' };
    var bcol = (dc ? CON[dc].a : (day > 9 ? '#8F8FD0' : '#FFE45E'));
    bn.bg = 'linear-gradient(120deg,#0d1030,#3a2a8a 50%,' + (day < 1 ? '#8b5cff' : bcol) + ')';
    var nxt = live ? (dc ? CON[dc].n : '') : '';
    if (day < 1) { bn.title = 'Sắp diễn ra'; bn.sub = 'Bắt đầu 18/10 · còn ' + (18 - (17 + day)) + ' ngày'; }
    else if (day > 9) { bn.title = 'Đã kết thúc'; bn.sub = 'Bộ sưu tập của bạn được giữ nguyên'; }
    else if (allCel) { bn.title = 'Đủ 3/3 concept'; bn.sub = 'Thẻ Ultra đang chờ bạn'; }
    else if (pn > 0) { bn.title = pn + ' pack đang chờ'; bn.sub = 'Chạm để vào sự kiện và mở pack'; }
    else if (taskDone) { bn.title = 'Hôm nay xong rồi'; bn.sub = 'Đủ ' + celN + '/3 concept · hẹn bạn ngày mai'; }
    else { bn.title = nxt; bn.sub = 'Nhiệm vụ: ' + task.t; }
    V.bnKick = live ? 'MÙA CONCEPT · NGÀY ' + day + '/9' : 'MÙA CONCEPT';
    V.bnC = live && dc ? CON[dc].a : '#FFE45E';
    V.bnPano = CON[dc || (day > 9 ? 3 : 1)].pano;
    V.bnDays = []; for (var bd = 1; bd <= 9; bd++) { var bdc = dayCon(bd); V.bnDays.push({ cls: s.done[bd] ? 'on' : (bd === day ? 'now' : ''), c: bdc ? CON[bdc].a : '#FFE45E' }); }
    V.bnCons = [1, 2, 3].map(function (c) { var ok = !!cel[c]; return { a: CON[c].a, img: IMG[c][c + 1], cls: ok ? 'ok' : (c > openC ? 'lk' : ''), mk: ok ? '✓' : cnt(owned, c) + '/5' }; });
    V.bnPd = pn > 0 ? 'grid' : 'none'; V.bnPk = '+' + pn;
    V.bnTitle = bn.title; V.bnSub = bn.sub; V.bnBg = bn.bg;
    V.bnGo = function () { var x = st(); if (x.day < 1) { flash('Sự kiện bắt đầu 18/10'); return; } set({ pg: 'hub' }); };
    V.dateLbl = WDL[day] + ', ' + (17 + day) + '/10/2026';
    V.dayA = dayA;
    V.cells = [];
    for (var d = 1; d <= 31; d++) {
      var di = d - 16, cls = '', img = false, dot = false, ck = false;
      if (d < 16) { if (d % 4) { cls = 'gp'; img = true; } else cls = 'em'; }
      else if (di === day) cls = 'today';
      else if (di > day) cls = 'fut';
      if (di >= 1 && di <= 9) { dot = true; if (s.done[di]) ck = true; }
      V.cells.push({ i: d, d: d, cls: cls, imgd: img ? 'block' : 'none', src: IMG[1 + d % 3][d % 5], dd: dot ? 'flex' : 'none', dc: di >= 1 && di <= 9 ? (dayCon(di) ? CON[dayCon(di)].a : '#FFE45E') : 'transparent', gd: ck ? 'block' : 'none' });
    }
    V.pickDay = function (e) { var d = idxOf(e), di = d - 16; if (di >= 1 && di <= 9) flash('Ngày ' + d + '/10 · ' + TASKS[di].t); };
    var doneCnt = 1 + (taskDone && live ? 1 : 0), totCnt = live ? 3 : 2;
    V.ringP = Math.round(doneCnt / totCnt * 100); V.ringTxt = doneCnt + '/' + totCnt;
    V.taskHead = doneCnt === totCnt ? 'Hoàn thành hết rồi!' : 'Việc của bạn';
    V.taskSub = doneCnt === totCnt ? 'Hôm nay xong hết, hẹn bạn ngày mai.' : 'Còn ' + (totCnt - doneCnt) + ' việc nữa.';
    V.evTask = live; V.tkOn = taskDone ? 'd' : ''; V.taskT = task.t; V.taskD = task.d;
    V.tick = tickF;
    V.hasPacks = pn > 0; V.packN = pn; V.celN = celN; V.celPct = (celN / 3 * 100) + '%';
    V.openPack = openPackF;

    /* ---- trang sự kiện ---- */
    V.hubTag = live ? 'NHIỆM VỤ HÔM NAY · ' + CON[dc].n.toUpperCase() : 'NHIỆM VỤ';
    V.hubDone = live && taskDone; V.hubOpen = live && !taskDone;
    V.concs = [1, 2, 3].map(function (c) {
      var n = cnt(owned, c), h = cnt(owned, c, true), lk = c > openC, ok = n === 5;
      return { i: c, a: CON[c].a, n: CON[c].n, week: lk ? 'MỞ ' + CON[c].open : CON[c].week, cls: ok ? 'hgot' : (lk ? 'hlk' : (c === dc ? 'hnow' : '')),
        line: lk ? 'Chưa mở' : (ok ? 'Đủ bộ · ' + h + '/5 holo' : n + '/5 thường · ' + h + '/5 holo'),
        v: '', img: IMG[c][c + 1], p: n / 5 * 100, st: lk ? 'Mở ' + CON[c].open : (ok ? 'Đủ bộ ✓' : n + '/5 thẻ') };
    });
    V.hubWhen = live ? '18–26/10 · ngày ' + day + '/9' : (day < 1 ? '18–26/10 · bắt đầu sau ' + (18 - (17 + day)) + ' ngày' : '18–26/10 · đã kết thúc');
    V.hubCal = function () { set({ pg: '', tab: 'cal' }); };
    V.openCon = function (e) { set({ pg: '', tab: 'col', colCon: idxOf(e) }); };
    V.tdays = [];
    for (var t = 1; t <= 9; t++) {
      var tc = dayCon(t), tcl = '';
      if (s.done[t]) tcl = 'done'; else if (t === day) tcl = 'today'; else if (t < day) tcl = 'miss';
      V.tdays.push({ d: 17 + t, cls: tcl, c: tc ? CON[tc].a : '#FFE45E' });
    }
    V.ultSt1 = !allCel; V.ultSt2 = allCel;
    V.closePg = function () { stopAudio(); set({ pg: '', ust: 'idle', flipped: false }); };

    /* ---- mở pack ---- */
    var pk0 = packs[0] || { con: 0, kind: 'daily' };
    var pcon = pk0.con || s.pickCon || firstIncomplete;
    V.pkA = CON[pcon].a; V.pkPick = pk0.con === 0 && pn > 0;
    for (var k = 1; k <= 3; k++) { V['pc' + k] = pcon === k ? 'on' : ''; V['pk' + k + 'd'] = pcon === k && pk0.kind !== 'bonus'; V['pk' + k + 'b'] = pcon === k && pk0.kind === 'bonus'; }
    V.pickC = function (e) { set({ pickCon: idxOf(e) }); };
    V.pkLabel = pk0.kind === 'bonus' ? 'Pack thưởng · hoàn thành concept' : 'Pack ' + CON[pcon].n + ' · còn ' + pn;
    V.pkSub = pk0.kind === 'bonus' ? '5 thẻ app · Thường 70% · Hiếm 22% · Huyền Thoại 7% · Bá khí 1%' : '5 thẻ · thường 16% mỗi thẻ, holo 4% mỗi thẻ';
    V.trCls = s.tearing ? 'go' : ''; V.tearTxt = s.tearing ? 'Đang xé…' : 'Chạm để xé pack';
    V.tear = function () { var x = st(); if (x.tearing || !x.packs.length) return; set({ tearing: true }); setTimeout(doOpen, 1500); };
    V.closeFx = function () { set({ fx: '', tearing: false, ugSk: false }); };
    V.ugSkip = function () { set({ ugSk: true }); };

    /* ---- xem thẻ ---- */
    var isReveal = s.fx === 'reveal';
    var cur = isReveal ? (s.drawn[s.idx] || s.drawn[0]) : s.detail;
    cur = cur || { con: 1, slot: 0, holo: false, isNew: true, count: 1 };
    var isApp = !!cur.app, RA = isApp ? RAR[cur.r] : null;
    var cc = CON[cur.con] || CON[1];
    V.shA = cc.a; V.cImg = IMG[cur.con || 1][cur.slot || 0]; V.cName = MEM[cur.slot || 0]; V.cNo = ('0' + (cur.slot + 1)).slice(-2);
    V.cConUp = cc.n.toUpperCase(); V.cConName = cc.n; V.cVars = '--a:' + cc.a + ';--b:' + cc.b;
    V.showNorm = !cur.holo && !isApp; V.showHolo = !!cur.holo && !isApp; V.showApp = isApp; V.bkApp = isApp;
    for (var bc2 = 1; bc2 <= 3; bc2++) for (var bs = 0; bs < 5; bs++) { V['bk_' + bc2 + '_n_' + bs] = cur.con === bc2 && cur.slot === bs && !cur.holo; V['bk_' + bc2 + '_h_' + bs] = cur.con === bc2 && cur.slot === bs && !!cur.holo; }
    V.shNo = s.idx + 1; V.shTot = (s.drawn && s.drawn.length) || 5; V.shKind = isApp ? RA.tag : (cur.holo ? 'HOLO' : 'THƯỜNG'); V.shLabel = isApp ? 'Thẻ ' + RA.n : (cur.holo ? 'Thẻ holo' : 'Thẻ thường');
    var hiR = isApp && cur.r !== 'common';
    V.rvTxt = isApp ? (cur.r === 'supreme' ? 'BÁ KHÍ!' : cur.r === 'legend' ? 'HUYỀN THOẠI!' : 'HIẾM!') : 'HOLO!';
    if (isApp) {
      V.shA = RA.a; V.cName = 'Thẻ ' + RA.n + ' #' + ('0' + (cur.i + 1)).slice(-2); V.cConName = 'thẻ app';
      V.appCls = appCls(cur.r, cur.i); V.appImg = appImg(cur.r, cur.i); V.appTag = RA.tag;
      var aAr = appAr(cur.r, cur.i); V.appAr = aAr; V.dfSt = 'height:' + Math.round(237.5 / aAr + 12.5) + 'px'; V.appVars = '--w:250px;--ar:' + aAr;
    } else { V.dfSt = ''; V.appVars = ''; V.appCls = ''; V.appImg = ''; V.appTag = ''; V.appAr = 1; }
    V.flipCls = s.flipped ? 'on' : ''; V.popCls = 'p' + (s.idx % 2);
    V.rvCls = (cur.holo || hiR ? 'holo ' : '') + (isReveal && cur.isNew ? 'nw ' : '') + 'p' + (s.idx % 2);
    V.flipCard = function () { set({ flipped: !s.flipped }); };
    var own1 = owned[cur.con + (cur.holo ? 'h' : 'n') + cur.slot] || 0;
    V.badgeTxt = isReveal ? (cur.gift ? 'QUÀ TỪ ' + (cur.from || 'NGƯỜI KIA').toUpperCase() + ' · ' : '') + (cur.isNew ? 'THẺ MỚI' : 'ĐÃ CÓ · ×' + cur.count) : (own1 ? 'Sở hữu ×' + own1 : 'Chưa sở hữu');
    V.badgeCls = isReveal && !cur.isNew ? 'dup' : 'nw';
    var dKey = cur.con + (cur.holo ? 'h' : 'n') + cur.slot, inDet = !isReveal && !isApp;
    var rqK = (s.rq || {})[dKey] || {}, rqN = PT.filter(function (p) { return rqK[p.id]; }).length;
    var pqN = PT.filter(function (p) { return (s.preq || []).some(function (q) { return q.k === dKey && q.f === p.id; }); }).map(function (p) { return p.n; });
    V.dtGive = inDet && own1 > 1; V.dtSpare = own1 - 1; V.dtKeep = inDet && own1 === 1;
    V.dtAskOn = inDet && own1 === 0; V.dtAskTxt = rqN ? 'Đã xin ' + rqN + ' người · xin thêm' : 'Xin thẻ này'; V.dtAskCls = rqN ? 'sent' : '';
    V.dtReq = inDet && pqN.length > 0; V.dtReqTxt = pqN.join(', ') + ' đang xin thẻ này';
    V.dfLk = inDet && own1 === 0 ? 'lkd' : '';
    var nDr = (s.drawn && s.drawn.length) || 5;
    V.dots = []; for (var dj = 0; dj < nDr; dj++) V.dots.push({ cls: dj <= s.idx ? 'on' : '' });
    V.nextTxt = s.idx >= nDr - 1 ? 'Xong' : 'Tiếp';
    V.nextCard = function () { var x = st(); if (x.idx < (x.drawn.length || 5) - 1) set({ idx: x.idx + 1, flipped: false }); else finishReveal(); };

    /* ---- bộ sưu tập ---- */
    var ct = s.colCon, ccol = CON[ct] || CON[1];
    var locked = ct <= 3 && ct > openC;
    V.rbar = [1, 2, 3].map(function (c) { return { a: CON[c].a, n: CON[c].n.slice(0, 7), v: cnt(owned, c) + '/5', p: (cnt(owned, c) / 5 * 100) + '%' }; })
      .concat([{ a: '#FFE45E', n: 'Ultra', v: (ultCount()) + '/2', p: (ultCount() / 2 * 100) + '%' }]);
    function ultCount() { return (s.ult[1] ? 1 : 0) + (s.ult[2] ? 1 : 0); }
    V.chips = [1, 2, 3, 4, 5].map(function (c) { return { i: c, n: c === 5 ? 'Thẻ app' : c === 4 ? 'Ultra' : CON[c].n, cls: ct === c ? 'on' : '' }; });
    V.setTab = function (e) { set({ colCon: idxOf(e) }); };
    V.tabA = ct === 4 ? '#FFE45E' : ct === 5 ? '#9B5CFF' : ccol.a; V.colName = ct === 4 ? 'Ultra Limited' : ct === 5 ? 'Thẻ app' : ccol.n;
    V.colOpen = ct <= 3 && !locked; V.colLocked = locked; V.colUltra = ct === 4; V.colApp = ct === 5; V.lockDate = ccol.open + '/2026';
    var mkTiles = function (h) {
      var o = [];
      for (var i = 0; i < 5; i++) {
        var c = (owned[ct + (h ? 'h' : 'n') + i] || 0);
        o.push({ i: i + (h ? 10 : 0), cls: c ? '' : 'lk', img: IMG[ct] ? IMG[ct][i] : '', nm: MEM[i], x: c, xd: c > 1 ? 'block' : 'none', nd: 'none' });
      }
      return o;
    };
    V.tilesN = mkTiles(false); V.tilesH = mkTiles(true);
    /* ---- thẻ app (từ pack thưởng) ---- */
    var boS = s.bo || {};
    V.appRows = ['common', 'rare', 'legend', 'supreme'].map(function (r) { var h = appHave(boS, r); return { a: RAR[r].a, n: RAR[r].n, v: h + '/' + RAR[r].tot, p: (h / RAR[r].tot * 100) + '%' }; });
    V.appRecent = (s.bl || []).slice(0, 8).map(function (c, k) { var ar = appAr(c.r, c.i); return { cls: appCls(c.r, c.i), ar: ar, w: ar > 1 ? 98 : 64, img: appImg(c.r, c.i), tag: RAR[c.r].tag, x: c.count > 1 ? '×' + c.count : '' }; });
    V.hasRecent = (s.bl || []).length > 0; V.noRecent = !V.hasRecent;
    /* ---- tặng / xin thẻ: chọn người ---- */
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
      return { i: i, id: l.id, tag: l.tag, tc: l.tc, title: l.title, sum: l.sum, from: l.from, date: l.day != null ? (17 + l.day) + '/10' : '', st: st1[0], stCls: st1[1], cls: mNeed(l) ? 'new' : '' };
    });
    V.mailPick = function (e) { var i = idxOf(e), x = st(), l = LT[i]; if (!l) return; var r = cl(x.mr || {}); r[l.id] = true; set({ mo: l.id, mr: r }); };
    if (curL) {
      V.mTag = curL.tag; V.mTc = curL.tc; V.mTitle = curL.title; V.mFrom = curL.from; V.mDate = curL.day != null ? (curL.day ? 'Ngày ' + curL.day + ' · ' : 'Trước sự kiện · ') + (17 + curL.day) + '/10' : '';
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
    var nOwn = ct <= 3 ? cnt(owned, ct) : 0, hOwn = ct <= 3 ? cnt(owned, ct, true) : 0;
    V.colN = nOwn; V.colH = hOwn; V.colPano = ccol.pano; V.panoOk = nOwn === 5;
    V.panoRim = nOwn === 5 ? 'linear-gradient(100deg,#fff,' + ccol.a + ',#4CC9FF,#fff)' : 'var(--line)'; V.panoState = nOwn === 5 ? 'Đã mở' : nOwn + '/5 mảnh';
    V.bands = [0, 1, 2, 3, 4].map(function (i) { return { left: (i * 20) + '%', cls: owned[ct + 'n' + i] ? 'get' : '' }; });
    V.tileOpen = function (e) {
      var v = idxOf(e), h = v >= 10, sl = v % 10, x = st();
      if (x.colCon > 3) return;
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
    V.unNext = function () { var x = st(); var all = x.cel[1] && x.cel[2] && x.cel[3]; if (all) set({ fx: 'uget', ugSk: false }); else set({ fx: '', tab: 'col' }); };

    /* ---- hồ sơ ---- */
    var eE = s.eq === -1 ? 0 : (s.eq || (cel[3] ? 3 : cel[2] ? 2 : cel[1] ? 1 : 0));
    V.rews = [1, 2, 3].map(function (c) {
      var ok = cnt(owned, c) === 5;
      return { a: CON[c].a, n: CON[c].n, st: ok ? 'ĐÃ MỞ · CONCEPT ' + c : 'CHƯA MỞ · CONCEPT ' + c, dim: ok ? '' : 'opacity:.4;filter:grayscale(.9)',
        v: '--a:' + CON[c].a + ';--c:' + CON[c].b + ';--bl:8px', t: '--a:' + CON[c].a + ';--b:' + CON[c].b, img: IMG[c][c + 1],
        i: c, eqc: eE === c ? 'pink' : (cel[c] ? '' : 'ghost'), eqt: !cel[c] ? 'Chưa mở khóa' : (eE === c ? 'Đang dùng · bỏ dùng' : 'Dùng khung & danh hiệu') };
    });
    var ec = CON[eE] || CON[1];
    V.eqNone = !eE; V.eqOn = !!eE; V.eqName = ec.n; V.eqImg = IMG[eE || 1][(eE || 1) + 1];
    V.eqV = '--a:' + ec.a + ';--c:' + ec.b + ';--bl:10px'; V.eqT = '--a:' + ec.a + ';--b:' + ec.b;
    V.equip = function (e) {
      var c = idxOf(e), x = st();
      if (!x.cel[c]) { flash('Cần mở khóa concept này trước'); return; }
      var cur = x.eq === -1 ? 0 : (x.eq || (x.cel[3] ? 3 : x.cel[2] ? 2 : x.cel[1] ? 1 : 0));
      set({ eq: cur === c ? -1 : c, logs: lg(x, cur === c ? 'Bỏ dùng khung' : 'Dùng khung & danh hiệu ' + CON[c].n) });
    };

    /* ---- Ultra ---- */
    var ult = s.ult;
    V.ultraSt = allCel ? 'Đã mở khóa' : 'Cần đủ 3 concept';
    for (var uu = 1; uu <= 2; uu++) {
      V['u' + uu + 'Ready'] = allCel && !!ult[uu]; V['u' + uu + 'New'] = allCel && !ult[uu]; V['u' + uu + 'Lock'] = !allCel;
      V['u' + uu + 'Songs'] = ult[uu] ? SONGS[ult[uu][0]].t + ' · ' + SONGS[ult[uu][1]].t : '';
    }
    V.openU = function (e) { set({ u: idxOf(e), sheet: '', pg: 'ucard', ust: 'idle', paused: false, disc: 'A' }); };
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
    V.lock = function () { var x = st(); if (x.sel.length !== 2) return; var u2 = cl(x.ult); u2[x.u] = x.sel.slice(); set({ ult: u2, sheet: '', pg: 'ucard', ust: 'idle', paused: false, disc: 'A', logs: lg(x, 'Khóa nhạc thẻ Ultra #' + x.u + ': ' + SONGS[x.sel[0]].t + ' + ' + SONGS[x.sel[1]].t) }); flash('Đã khóa 2 bài vào thẻ #' + x.u); };
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
    V.dayLbl = WDL[day] + ' ' + (17 + day) + '/10' + (live ? ' · ngày ' + day + '/9' : (day < 1 ? ' · trước sự kiện' : ' · sau sự kiện'));
    V.dchips = [];
    for (var dd = 0; dd <= 10; dd++) { V.dchips.push({ i: dd, dt: (17 + dd), wd: WD[dd], cls: dd === day ? 'on' : '', c: dayCon(dd) ? CON[dayCon(dd)].a : 'transparent' }); }
    V.setDay = function (e) { set({ day: idxOf(e) }); };
    V.dayPrev = function () { set({ day: Math.max(0, day - 1) }); }; V.dayNext = function () { set({ day: Math.min(10, day + 1) }); };
    V.untick = function () {
      var x = st(); if (!x.done[x.day]) { flash('Hôm nay chưa tick'); return; }
      var d = cl(x.done); delete d[x.day]; var pk = x.packs.slice(), c = dayCon(x.day), rm = 2;
      for (var i = pk.length - 1; i >= 0 && rm > 0; i--) if (pk[i].kind === 'daily' && pk[i].con === c) { pk.splice(i, 1); rm--; }
      set({ done: d, packs: pk }); flash('Đã hoàn tác nhiệm vụ');
    };
    V.addDaily = function () { var x = st(); set({ packs: x.packs.concat([{ con: dayCon(x.day), kind: 'daily' }]) }); flash('+1 pack ngày'); };
    V.addBonus = function () { var x = st(); set({ packs: x.packs.concat([{ con: x.colCon <= 3 ? x.colCon : 1, kind: 'bonus' }]) }); flash('+1 pack thưởng (thẻ app)'); };
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
      set({ owned: o, cel: cx, pg: '', sheet: '', fx: 'uget', ugSk: false, day: Math.max(x.day, 7) });
    };
    V.jCal = function () { stopAudio(); set({ tab: 'cal', pg: '', fx: '', sheet: '' }); };
    V.jToday = function () { stopAudio(); set({ tab: 'today', pg: '', fx: '', sheet: '' }); };
    V.jHub = function () { stopAudio(); set({ tab: 'today', pg: 'hub', fx: '', sheet: '' }); };
    V.jCol = function () { stopAudio(); set({ tab: 'col', pg: '', fx: '', sheet: '' }); };
    V.jPro = function () { stopAudio(); set({ tab: 'pro', pg: '', fx: '', sheet: '' }); };
    V.prevUnlock = function () { set({ fx: 'unlock', pg: '', sheet: '', uc: s.colCon <= 3 ? s.colCon : 1 }); };
    V.panoForce = function (e) { var c = idxOf(e); set({ pg: 'pano', fx: '', sheet: '', colCon: c, pan: 18 }); };
    /* ---- bạn bè (giả lập) ---- */
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
    V.ptTxt = PS.n + ' có ' + pN + ' thẻ thường · ' + pH + ' holo · ' + pSp + ' bản dư\nQuà đang chờ bạn nhận: ' + (s.inbox || []).length + ' · Bạn đã tặng: ' + s.sent + '\nLời xin bạn đã gửi: ' + rqCnt + ' · Đang xin bạn: ' + (s.preq || []).length;
    V.clearSongs = function () { set({ ult: {} }); flash('Đã xóa nhạc đã khóa'); };
    V.tkTag = live ? 'NGÀY ' + day + '/9 · ' + CON[dc].n.toUpperCase() : 'NGOÀI SỰ KIỆN';
    var nd = 0, nb = 0; packs.forEach(function (p) { if (p.kind === 'bonus') nb++; else nd++; });
    V.packSum = pn + ' pack · ' + nd + ' pack ngày, ' + nb + ' pack thưởng';
    V.eqTxt = eE ? CON[eE].n : 'Không dùng';
    V.ultTxt = (allCel ? 'Đã mở khóa' : 'Chưa đủ 3 concept') + ' · #1: ' + (ult[1] ? SONGS[ult[1][0]].t + ' + ' + SONGS[ult[1][1]].t : 'chưa chọn') + ' · #2: ' + (ult[2] ? SONGS[ult[2][0]].t + ' + ' + SONGS[ult[2][1]].t : 'chưa chọn');
    V.simRun = function () {
      var NN = [0, 0, 0, 0, 0], HH = [0, 0, 0, 0, 0], tn = 0, th = 0, i, j, r;
      for (i = 0; i < 1000; i++) for (j = 0; j < 5; j++) { r = Math.random() * 100; if (r < 80) { NN[Math.floor(r / 16)]++; tn++; } else { HH[Math.floor((r - 80) / 4)]++; th++; } }
      var tr = 3000, p6 = 0, p4 = 0, sum = 0;
      for (i = 0; i < tr; i++) { var have = {}, k = 0, n = 0; while (k < 5 && n < 200) { n++; for (j = 0; j < 5; j++) { r = Math.random() * 100; if (r < 80) { var sl = Math.floor(r / 16); if (!have[sl]) { have[sl] = 1; k++; } } } } sum += n; if (n <= 6) p6++; if (n <= 4) p4++; }
      set({ sim: '5000 thẻ từ 1000 pack: ' + tn + ' thường (' + (tn / 50).toFixed(1) + '%), ' + th + ' holo (' + (th / 50).toFixed(1) + '%)\nThường theo thành viên: ' + NN.join(' / ') + '  (kỳ vọng 800 mỗi ô)\nHolo theo thành viên: ' + HH.join(' / ') + '  (kỳ vọng 200 mỗi ô)\nĐủ 5 thẻ thường trung bình sau ' + (sum / tr).toFixed(1) + ' pack · trong 6 pack (đủ 3 ngày): ' + (p6 / tr * 100).toFixed(0) + '% · trong 4 pack (lỡ 1 ngày): ' + (p4 / tr * 100).toFixed(0) + '%' });
    };
    V.simTxt = s.sim || 'Chưa chạy. Bấm «Mô phỏng 1000 pack» để kiểm tra tỉ lệ thường 16% mỗi thẻ, holo 4% mỗi thẻ và số pack cần để đủ bộ.';
    var CK = [];
    var okAll = function (f) { for (var c = 1; c <= 3; c++) if (!f(c)) return false; return true; };
    CK.push([okAll(function (c) { return !cel[c] || cnt(owned, c) === 5; }), 'Concept chỉ mở khóa khi đủ 5 thẻ thường']);
    CK.push([s.stN + s.stH === 5 * s.stP, 'Số thẻ rút = 5 × số pack đã mở (' + (s.stN + s.stH) + ' = 5 × ' + s.stP + ')']);
    CK.push([s.stA === 5 * s.stBP, 'Pack thưởng chỉ ra thẻ app: ' + s.stA + ' = 5 × ' + s.stBP + ' pack, không ra thẻ concept']);
    CK.push([Object.keys(s.bo || {}).every(function (k) { var p = k.split('-'); return RAR[p[0]] && Number(p[1]) < RAR[p[0]].tot && s.bo[k] > 0; }), 'Thẻ app chỉ thuộc 4 độ hiếm hợp lệ (Thường, Hiếm, Huyền Thoại, Bá khí)']);
    CK.push([Object.keys(owned).every(function (k) { return owned[k] >= 0; }) && Object.keys(s.po || {}).every(function (id) { return Object.keys(s.po[id]).every(function (k) { return s.po[id][k] >= 0; }); }), 'Tặng thẻ không làm số bản của ai bị âm (luôn giữ lại 1 bản)']);
    CK.push([!(ult[1] || ult[2]) || allCel, 'Thẻ Ultra chỉ có khi đủ 3 concept']);
    CK.push([!eE || !!cel[eE], 'Khung đang dùng thuộc concept đã mở khóa']);
    CK.push([[1, 2].every(function (u) { return !ult[u] || (ult[u].length === 2 && ult[u][0] !== ult[u][1]); }), 'Mỗi thẻ Ultra khóa đúng 2 bài khác nhau']);
    V.checks = CK.map(function (k) { return { cls: k[0] ? 'ok' : 'bad', m: k[0] ? '✓' : '!', t: k[1] }; });
    V.logs = s.logs.length ? s.logs.map(function (t) { return { t: t }; }) : [{ t: 'Chưa có thao tác nào.' }];
    V.ugmOn = s.ugm ? 'on' : ''; V.ugmTxt = s.ugm ? 'Nhạc GO!: Bật' : 'Nhạc GO!: Tắt'; V.setUgm = function () { set({ ugm: !s.ugm }); }; V.ugsTxt = 'Điệp khúc bắt đầu ở ' + fmt(s.ugs); V.ugsM = function () { set({ ugs: Math.max(0, s.ugs - 1) }); }; V.ugsP = function () { set({ ugs: Math.min(170, s.ugs + 1) }); };
    V.ug5On = s.ugv === 5 ? 'on' : ''; V.ug4On = s.ugv === 4 ? 'on' : ''; V.ugv4 = s.ugv === 4; V.setUg4 = function () { set({ ugv: 4 }); }; V.ug3On = s.ugv === 3 ? 'on' : ''; V.ugv5 = s.ugv === 5; V.ugv3 = s.ugv === 3;
    V.setUg5 = function () { set({ ugv: 5 }); }; V.setUg3 = function () { set({ ugv: 3 }); };
    V.replayUg = function () { set({ fx: '', pg: '', sheet: '' }); setTimeout(function () { set({ fx: 'uget', ugSk: false }); }, 80); };
    V.reset = function () { stopAudio(); var o = {}; for (var k in D) o[k] = cl({ v: D[k] }).v; set(o); };
    var rate = (s.stN + s.stH) ? (s.stH / (s.stN + s.stH) * 100).toFixed(1) : '0';
    V.stats = 'Pack đang chờ: ' + pn + ' · Đã mở: ' + s.stP + ' pack ngày + ' + s.stBP + ' pack thưởng (' + s.stA + ' thẻ app)' + '\nThẻ rút: ' + s.stN + ' thường, ' + s.stH + ' holo (' + rate + '% holo, mục tiêu 20%)\nLần mở gần nhất: ' + s.log;
    window.__ugs = s.ugs; window.__ugm = s.ugm;
    if (s.fx === 'uget') { if (!window.__ugOn) { window.__ugOn = true; ultraSfx(s.ugv); } }
    else if (window.__ugOn) { window.__ugOn = false; try { if (window.__ugc) var cp = window.__ugc.close(); if (cp && cp.catch) cp.catch(function () {}); } catch (e) {} stopUltraMusic(); }
    return V;
  }
}
