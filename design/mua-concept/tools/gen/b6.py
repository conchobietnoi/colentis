from lib import *
from b3 import ultra, extra as EX3
OUT='/tmp/claude-0/-home-claude/416de534-d838-563f-a6b2-7164a832bafe/scratchpad/design-col/project/'
css=EX3+r'''
.scr{width:390px;height:844px;display:flex;flex-direction:column;background:#15123B;color:#F1F0FF;overflow:hidden;position:relative}
.hd{padding:22px 16px 10px;flex:none}.hd small{display:block;font-size:11.5px;font-weight:700;color:#A7A9E6}.hd h1{margin:2px 0 0;font-size:21px;font-weight:900;letter-spacing:-.4px}
.sg{display:flex;align-items:center;gap:12px;width:100%;padding:11px 12px;border-radius:16px;background:#201C52;border:2px solid #363078;font-family:inherit;color:inherit;text-align:left;cursor:pointer}
.sg.on{border-color:#FFB02E;background:linear-gradient(100deg,rgba(255,176,46,.22),rgba(255,46,136,.16))}
.sg .v{width:44px;height:44px;border-radius:50%;flex:none;background:radial-gradient(circle,var(--c) 0 28%,#000 29% 32%,transparent 33%),repeating-radial-gradient(circle,#0b0b0b 0 1px,#22222a 1px 3px)}
.sg.on .v{animation:spinr 2.4s linear infinite}
.sg b{display:block;font-size:14.5px;font-weight:900}.sg small{display:block;font-size:11px;font-weight:700;color:#A7A9E6;margin-top:2px}
.sg .ck{margin-left:auto;width:26px;height:26px;border-radius:50%;border:2.5px solid #363078;flex:none;display:grid;place-items:center;font-size:14px;font-weight:900;color:transparent}
.sg.on .ck{background:#FFB02E;border-color:#FFB02E;color:#2A1400}
.btn{display:block;width:100%;min-height:50px;border:0;border-radius:16px;font-family:inherit;font-size:15px;font-weight:900;color:#2A1400;background:linear-gradient(100deg,#FFB02E,#FF6B57);box-shadow:0 8px 22px rgba(255,120,60,.35);cursor:pointer}
.btn.off{background:#363078;color:#8F8FD0;box-shadow:none}
.btn.ghost{background:#201C52;color:#F1F0FF;border:2px solid #363078;box-shadow:none}
@keyframes hp{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes beat{0%,100%{transform:scale(1)}12%{transform:scale(1.035)}40%{transform:scale(1)}}
@keyframes shock{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.5);opacity:0}}
@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.pgb{height:6px;border-radius:99px;background:#363078;overflow:hidden}.pgb i{display:block;height:100%;width:100%;transform-origin:left;background:linear-gradient(90deg,#FFB02E,#fff);box-shadow:0 0 8px #FFB02E;animation:prog 192s linear infinite}
.pl.ps *{animation-play-state:paused !important}
.st{position:relative;width:390px;height:380px;margin:0 auto}
.cardw{position:absolute;left:85px;top:30px;width:220px;z-index:3}
.tlw{position:relative}
.eq{position:absolute;left:5%;right:5%;bottom:20%;height:15%;z-index:30;display:flex;align-items:flex-end;gap:2.4%;opacity:0;transition:opacity .4s;pointer-events:none}
.st.pA .eq,.st.pB .eq{opacity:1}
.eq i{flex:1;border-radius:99px 99px 0 0;background:linear-gradient(0deg,#FFB02E,#fff);box-shadow:0 0 8px #FFB02E;height:20%;animation:eqb .5s ease-in-out infinite alternate}
@keyframes eqb{from{height:14%}to{height:100%}}
.shk{position:absolute;left:0;top:0;width:220px;height:293px;border-radius:22px;border:3px solid #FFE45E;opacity:0;pointer-events:none}
.st.pA .shk,.st.pB .shk{animation:shock 1.04s ease-out infinite}
.st.pA .tlw,.st.pB .tlw{animation:beat .52s ease-in-out infinite}
.dv{position:absolute;top:92px;width:176px;height:176px;border-radius:50%;z-index:1;cursor:pointer;background:radial-gradient(circle,#000 0 3%,transparent 3.5%),repeating-radial-gradient(circle,#0b0b0b 0 1.2px,#1d1d22 1.2px 3.2px);box-shadow:0 10px 34px rgba(0,0,0,.6);left:107px;transition:left .9s cubic-bezier(.2,.9,.2,1)}
.dv:before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,transparent,rgba(255,255,255,.22),transparent 20%,transparent 50%,rgba(255,255,255,.22),transparent 70%)}
.dv .lb{position:absolute;inset:31%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff8,var(--c) 42%,#000a);border:3px solid #FFE9A8;box-shadow:0 0 18px var(--c);display:grid;place-items:center;font:800 8.5px/1.1 'Unbounded';color:#fff;text-align:center;font-style:normal;padding:3px}
.st.ch .dA,.st.pA .dA{left:2px}.st.ch .dB,.st.pB .dB{left:212px}
.st.ch .dv{animation:vspin 6s linear infinite;box-shadow:0 10px 34px rgba(0,0,0,.6),0 0 22px var(--c)}
.st.pA .dA,.st.pB .dB{animation:vspin 2.4s linear infinite;box-shadow:0 10px 34px rgba(0,0,0,.6),0 0 34px var(--c)}
@keyframes vspin{to{transform:rotate(360deg)}}
.nt{position:absolute;z-index:4;font-size:26px;color:#FFE45E;text-shadow:0 0 12px #FFB02E;opacity:0}
.st.pA .nt,.st.pB .nt{animation:nrise 3s ease-out infinite}
@keyframes nrise{0%{transform:translateY(0) rotate(0);opacity:0}15%{opacity:1}100%{transform:translateY(-190px) rotate(24deg);opacity:0}}
.hint2{display:inline-block;padding:8px 16px;border-radius:99px;background:rgba(10,8,30,.82);border:2px solid #FFB02E;font:800 12px 'Be Vietnam Pro';letter-spacing:.12em;color:#FFE9A8;box-shadow:0 0 18px rgba(255,176,46,.6);animation:hp 1.6s ease-in-out infinite}
.chip{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px;border-radius:16px;background:#201C52;border:2px solid #363078;font-family:inherit;color:#F1F0FF;cursor:pointer}
.chip b{font-size:14px;font-weight:900}.chip small{font-size:10.5px;font-weight:800;color:#A7A9E6;letter-spacing:.1em}
'''
eq=''.join(f'<i style="animation-delay:{(k*0.13)%0.5:.2f}s;animation-duration:{0.35+(k*37%25)/100:.2f}s"></i>' for k in range(24))
notes=''.join(f'<span class="nt" style="left:{x}px;top:{y}px;animation-delay:{d}s">{s}</span>' for x,y,d,s in [(60,300,0,'♪'),(300,320,.8,'♫'),(120,260,1.6,'♬'),(250,280,2.2,'♪'),(30,340,.4,'♫'),(330,250,1.2,'♪')])
def stage(cls):
    return ('<div class="st '+cls+'">'
     '<div class="dv dA" style="--c:{{cA}}" onClick="{{playA}}"><i class="lb">{{titleA}}</i></div>'
     '<div class="dv dB" style="--c:{{cB}}" onClick="{{playB}}"><i class="lb">{{titleB}}</i></div>'
     +notes+'<div class="cardw"><span class="shk"></span><div class="tlw">'+ultra(0,220,1,'JAMES')+'<div class="eq">'+eq+'</div></div></div></div>')
body='''
<sc-if value="{{isPick}}" hint-placeholder-val="{{true}}">
<div class="scr">
 <div class="hd"><small>Bạn vừa nhận thẻ Ultra Limited #1</small><h1>Chọn 2 bài cho thẻ</h1></div>
 <div style="flex:1;min-height:0;overflow-y:auto;padding:0 14px;display:flex;flex-direction:column;gap:9px">
  <sc-for list="{{songs}}" as="s" hint-placeholder-count="7"><button class="sg {{s.cls}}" style="--c:{{s.c}}" onClick="{{s.pick}}"><span class="v"></span><span><b>{{s.t}}</b><small>{{s.al}}</small></span><span class="ck">✓</span></button></sc-for>
  <p style="margin:4px 2px 12px;font-size:11.5px;font-weight:600;color:#A7A9E6;line-height:1.5">7 bài trong danh sách. Thẻ này mang đúng 2 bài bạn chọn và khóa vĩnh viễn. Thẻ Ultra còn lại có thể chọn 2 bài khác.</p>
 </div>
 <div style="padding:10px 14px 22px;flex:none"><button class="btn {{lockCls}}" onClick="{{lock}}">{{lockTxt}}</button></div>
</div></sc-if>

<sc-if value="{{isCard}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(520px 520px at 50% 40%,#3a1c6a,#0a0818 74%)">
 <div class="hd"><small>Bộ sưu tập · Ultra #1</small><h1>Thẻ Ultra</h1></div>
 <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px" onClick="{{openChoose}}">
  '''+stage('idle')+'''
  <span class="hint2">♪ CHẠM THẺ ĐỂ NGHE NHẠC</span>
 </div>
 <div style="padding:0 14px 22px"><button class="btn ghost" onClick="{{goPick}}" style="min-height:46px;font-size:13px">Xem lại màn chọn bài (chỉ có trong demo)</button></div>
</div></sc-if>

<sc-if value="{{isChoose}}" hint-placeholder-val="{{false}}">
<div class="scr" style="background:radial-gradient(520px 520px at 50% 36%,#3a1c6a,#05030d 76%)">
 <div class="hd" style="text-align:center"><small>Hai đĩa trượt ra khỏi thẻ</small><h1>Chọn 1 đĩa để phát</h1></div>
 <div style="margin-top:10px">'''+stage('ch')+'''</div>
 <div style="display:flex;gap:12px;padding:6px 18px 0"><button class="chip" onClick="{{playA}}"><small>MẶT A</small><b>{{titleA}}</b></button><button class="chip" onClick="{{playB}}"><small>MẶT B</small><b>{{titleB}}</b></button></div>
 <p style="margin:18px 24px 0;text-align:center;font-size:12px;font-weight:600;color:#A7A9E6;line-height:1.55">Mỗi lần chạm thẻ đều hiện 2 đĩa. Chọn 1 bài, nghe hết bài mà không cần thoát thẻ.</p>
 <div style="margin-top:auto;padding:0 14px 22px"><button class="btn ghost" onClick="{{goCard}}" style="min-height:46px;font-size:13px">Đóng</button></div>
</div></sc-if>

<sc-if value="{{isPlay}}" hint-placeholder-val="{{false}}">
<div class="scr pl {{psCls}}" style="background:radial-gradient(520px 520px at 50% 34%,#4a1c7a,#05030d 76%)">
 <div class="hd" style="display:flex;justify-content:space-between;align-items:center"><span><small>Đang phát từ thẻ</small><h1>Thẻ Ultra</h1></span><button onClick="{{goCard}}" aria-label="Đóng thẻ" style="width:42px;height:42px;border-radius:50%;border:1.5px solid rgba(255,255,255,.32);background:rgba(10,8,30,.55);color:#fff;font-size:16px;font-weight:900;font-family:inherit;cursor:pointer">✕</button></div>
 <div style="margin-top:8px">'''+stage('{{stCls}}')+'''</div>
 <div style="padding:10px 20px 0">
  <div style="min-width:0"><b style="display:block;font:800 19px 'Unbounded'">{{curT}}</b><small style="display:block;font-size:11.5px;font-weight:700;color:#A7A9E6;margin-top:3px">CORTIS · {{curAl}}</small></div>
  <div class="pgb" style="margin-top:16px"><i></i></div>
  <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;font-weight:800;color:#A7A9E6"><span>đang phát</span><span>{{curLen}}</span></div>
  <div style="display:flex;gap:10px;margin-top:14px"><button class="btn" onClick="{{togglePause}}" style="flex:1.3">{{pauseTxt}}</button><button class="btn ghost" onClick="{{goChoose}}" style="flex:1">Đổi đĩa</button></div>
  <p style="margin:12px 0 0;text-align:center;font-size:11px;font-weight:600;color:#8F8FD0;line-height:1.5">Nghe hết bài ngay trên thẻ. Bấm ✕ để đóng thẻ thì nhạc dừng.</p>
 </div>
</div></sc-if>
'''
html=page('Ultra nghe nhạc',390,844,body,css)
script=r'''class Component extends DCLogic {
  renderVals() {
    var self = this, s = this.state || {};
    var screen = s.screen || 'pick';
    var SONGS = [
      { t: 'GO!', al: 'COLOR OUTSIDE THE LINE', c: '#ffb02e', len: '3:00' },
      { t: 'What You Want', al: 'COLOR OUTSIDE THE LINE', c: '#35d0a5', len: '3:12' },
      { t: 'FaSHioN', al: 'COLOR OUTSIDE THE LINE', c: '#ff2e88', len: '2:58' },
      { t: 'JoyRide', al: 'COLOR OUTSIDE THE LINE', c: '#4cc9ff', len: '3:05' },
      { t: 'REDRED', al: 'GREENGREEN', c: '#ff2e4e', len: '3:10' },
      { t: 'ACAI', al: 'GREENGREEN', c: '#8b5cff', len: '2:49' },
      { t: 'Blue Lips', al: 'GREENGREEN', c: '#4cc9ff', len: '3:20' }
    ];
    var sel = s.sel || [0, 4];
    var songs = SONGS.map(function (x, i) {
      var on = sel.indexOf(i) >= 0;
      return { t: x.t, al: x.al, c: x.c, cls: on ? 'on' : '', pick: function () {
        var n = sel.slice(); var k = n.indexOf(i);
        if (k >= 0) n.splice(k, 1); else if (n.length < 2) n.push(i); else { n.shift(); n.push(i); }
        self.setState({ sel: n });
      } };
    });
    var ready = sel.length === 2;
    var A = SONGS[sel[0] !== undefined ? sel[0] : 0], B = SONGS[sel[1] !== undefined ? sel[1] : 4];
    var cur = s.disc === 'B' ? B : A;
    var paused = !!s.paused;
    return {
      isPick: screen === 'pick', isCard: screen === 'card', isChoose: screen === 'choose', isPlay: screen === 'play',
      songs: songs, lockCls: ready ? '' : 'off', lockTxt: ready ? 'Khóa 2 bài vào thẻ (không đổi được)' : 'Chọn đủ 2 bài (' + sel.length + '/2)',
      lock: function () { if (ready) self.setState({ screen: 'card' }); },
      titleA: A.t, titleB: B.t, cA: A.c, cB: B.c,
      stCls: s.disc === 'B' ? 'pB' : 'pA',
      curT: cur.t, curAl: cur.al, curLen: '0:00 / ' + cur.len,
      psCls: paused ? 'ps' : '', pauseTxt: paused ? '▶  Tiếp tục' : '❚❚  Tạm dừng',
      goPick: function () { self.setState({ screen: 'pick' }); },
      goCard: function () { self.setState({ screen: 'card', paused: false }); },
      goChoose: function () { self.setState({ screen: 'choose' }); },
      openChoose: function () { self.setState({ screen: 'choose' }); },
      playA: function () { self.setState({ screen: 'play', disc: 'A', paused: false }); },
      playB: function () { self.setState({ screen: 'play', disc: 'B', paused: false }); },
      togglePause: function () { self.setState({ paused: !paused }); }
    };
  }
}'''
a=html.index('class Component extends DCLogic')
b=html.index('</script>',a)
html=html[:a]+script+'\n'+html[b:]
open(OUT+'UltraSong.dc.html','w',encoding='utf-8').write(html)
print('ok')
