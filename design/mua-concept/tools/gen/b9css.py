import re
def STAGE_FILTER(c):
    out=[]
    for ln in c.split('\n'):
        if re.match(r'^\.(scr|hd|sg|btn|chip)\b',ln): continue
        out.append(ln)
    return '\n'.join(out)
APPCSS=r'''
.rapp .phone{display:flex}
.mt{position:relative;width:100%;aspect-ratio:3/4;border-radius:9px;overflow:hidden;border:2px solid var(--a);background:#000;box-shadow:0 3px 8px rgba(30,27,94,.25)}
.mt img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.mt b{position:absolute;left:0;right:0;bottom:0;padding:9px 1px 2px;text-align:center;font:800 6.5px 'Be Vietnam Pro';letter-spacing:.06em;color:#fff;background:linear-gradient(0deg,rgba(0,0,0,.85),transparent)}
.mt.ho{border:0;padding:2px;background:conic-gradient(from var(--r),#fff,#FF2E88,#FFE45E,#35D0A5,#4CC9FF,#8b5cff,#fff);animation:spin 3s linear infinite}
.mt.ho img{inset:2px;width:calc(100% - 4px);height:calc(100% - 4px);border-radius:7px}
.mt.ho:before{content:"";position:absolute;inset:2px;border-radius:7px;z-index:2;pointer-events:none;mix-blend-mode:color;opacity:.5;background:linear-gradient(120deg,#ff2e88,#ffe45e,#35d0a5,#4cc9ff,#8b5cff,#ff2e88);background-size:300% 300%;animation:hmove 5s linear infinite}
.shot{position:relative;border-radius:11px;overflow:hidden}.shot img{display:block;width:100%}
.shot .bd2{position:absolute;top:0;bottom:0;width:20%;background:rgba(5,4,15,.93);border-left:1px solid #363078}
.shot .bd2.get{display:none}
.df{position:relative;width:250px;height:333px;margin:0 auto;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.3,.8,.3,1);cursor:pointer}
.df.on{transform:rotateY(180deg)}
.df.p0{animation:pop2 .55s cubic-bezier(.2,1.2,.3,1)}.df.p1{animation:pop2b .55s cubic-bezier(.2,1.2,.3,1)}
@keyframes pop2{from{transform:scale(.7) rotate(-6deg);opacity:0}to{transform:none;opacity:1}}
@keyframes pop2b{from{transform:scale(.7) rotate(6deg);opacity:0}to{transform:none;opacity:1}}
.dff,.dfb{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.dfb{transform:rotateY(180deg)}
.dts{display:flex;gap:7px;justify-content:center;margin:6px 0 0}.dts i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.28)}.dts i.on{background:var(--kc,#FFB02E);box-shadow:0 0 8px var(--kc,#FFB02E)}
.dg{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}
.dg i{aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font:800 10px 'Be Vietnam Pro';font-style:normal;background:var(--paper);border:2px solid var(--line);color:var(--soft)}
.dg i.done{background:var(--c);border-color:var(--c);color:#1a0b00}
.dg i.today{border-color:var(--pink);color:var(--pink);box-shadow:0 0 0 2px rgba(255,46,136,.25)}
.dg i.miss{opacity:.4;text-decoration:line-through}.dg i.bu{border-style:dashed}
.dsc{width:46px;height:46px;border-radius:50%;flex:none;background:radial-gradient(circle,var(--c) 0 26%,#000 27% 31%,transparent 32%),repeating-radial-gradient(circle,#0b0b0b 0 1px,#22222a 1px 3px)}
.kmr.got .dsc{animation:vspin 3s linear infinite}
.tr{display:block;margin:0 auto;border:0;background:none;cursor:pointer;padding:0}
.tr.go{animation:shk .12s linear 8,boom .5s ease-in 1s forwards}
@keyframes shk{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-6px) rotate(-2deg)}75%{transform:translateX(6px) rotate(2deg)}}
@keyframes boom{to{transform:scale(1.6);opacity:0;filter:brightness(3)}}
#pgi{animation:none !important;transition:width .4s linear}
.kmr .kmgo{flex:none}
.uc-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.uc-in .uc-au{opacity:.4}
.igo.off{background:rgba(120,120,160,.45);box-shadow:none}
.chip.on{background:var(--pink);border-color:var(--pink);color:#fff}
.kmfx .chip{color:#fff;border-color:rgba(255,255,255,.35)}
'''
CP=r'''
.cp{width:420px;height:844px;overflow-y:auto;padding:16px 16px 20px;border-radius:22px;background:#1b1747;border:2px solid #363078;flex:none;scrollbar-width:thin;color:#F1F0FF}
.cp h3{margin:0;font:800 17px 'Unbounded';letter-spacing:-.3px}
.cp .cs{margin-top:14px;padding-top:12px;border-top:2px dashed #363078}
.cp .cl{font-size:10.5px;font-weight:800;letter-spacing:.14em;color:#A7A9E6;margin-bottom:8px}
.cp .g{display:flex;gap:6px;flex-wrap:wrap}
.pb{padding:8px 11px;border-radius:11px;border:2px solid #363078;background:#201C52;color:#F1F0FF;font:800 11.5px 'Be Vietnam Pro';cursor:pointer}
.pb:hover{border-color:#8F8FD0}.pb.on{border-color:#FFB02E;background:rgba(255,176,46,.2)}
.pb.gold{border-color:transparent;background:linear-gradient(100deg,#FFB02E,#FF6B57);color:#2A1400}
.pb.red{border-color:#FF2E88;color:#FFC1DB}
.dchips{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}
.dchips button{padding:6px 0;border-radius:10px;border:2px solid #363078;background:#201C52;color:#C7C6F5;font:800 10.5px/1.25 'Be Vietnam Pro';cursor:pointer;position:relative}
.dchips button.on{border-color:#fff;background:#3a3490;color:#fff}
.dchips button small{display:block;font-size:8.5px;opacity:.7}
.dchips button i{position:absolute;left:50%;bottom:2px;width:14px;height:3px;margin-left:-7px;border-radius:2px;background:var(--c)}
.cr{display:flex;align-items:center;gap:7px;padding:8px 9px;border-radius:12px;background:#201C52;border:2px solid #363078;margin-bottom:6px}
.cr .nm{flex:1;min-width:0;font-size:11.5px;font-weight:800}.cr .nm small{display:block;font-size:10px;color:#A7A9E6;margin-top:1px}
.cr .pb{padding:6px 8px;font-size:10.5px}
.stats{white-space:pre-line;font-size:11px;font-weight:700;color:#C7C6F5;line-height:1.6;background:#201C52;border-radius:12px;padding:9px 11px}
'''
