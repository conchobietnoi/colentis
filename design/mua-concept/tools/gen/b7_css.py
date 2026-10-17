APPCSS = r'''
.app{display:flex;gap:30px;padding:30px;background:#0e0b2a;width:910px;height:904px;align-items:flex-start}
.ph{width:390px;height:844px;border-radius:40px;overflow:hidden;position:relative;box-shadow:0 0 0 8px #05040f,0 0 0 10px #363078,0 24px 60px rgba(0,0,0,.6);flex:none;background:#15123B}
.body{flex:1;min-height:0;overflow-y:auto;padding:4px 14px 12px;scrollbar-width:none}
.body::-webkit-scrollbar{display:none}
.card{border-radius:18px;background:#201C52;border:2px solid #363078;padding:13px 14px}
.sec{display:flex;justify-content:space-between;align-items:center;padding:2px 2px 8px;font-size:10.5px;font-weight:800;letter-spacing:.12em;color:#A7A9E6}
.link{background:none;border:0;color:#A7A9E6;font:700 12px 'Be Vietnam Pro';text-decoration:underline;cursor:pointer}
.nav{flex:none;display:flex;padding:8px 10px 16px;background:#100d33;border-top:2px solid #2a2568}
.nav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:0;color:#8F8FD0;font:800 10.5px 'Be Vietnam Pro';cursor:pointer;padding:4px 0}
.nav button i{width:22px;height:22px;border-radius:7px;border:2.5px solid currentColor;display:block}
.nav button.on{color:#FFB02E}.nav button.on i{background:rgba(255,176,46,.25)}
.toast{position:absolute;left:50%;bottom:92px;transform:translateX(-50%);z-index:50;padding:10px 18px;border-radius:99px;background:rgba(10,8,30,.94);border:2px solid #FFB02E;font:800 12.5px 'Be Vietnam Pro';color:#FFE9A8;box-shadow:0 0 22px rgba(255,176,46,.5);white-space:nowrap;animation:pop .35s}
@keyframes pop{from{transform:translateX(-50%) scale(.8);opacity:0}to{transform:translateX(-50%) scale(1);opacity:1}}
@keyframes pop2{from{transform:scale(.7) rotate(-6deg);opacity:0}to{transform:none;opacity:1}}
/* banner */
.bn2{position:relative;border-radius:20px;overflow:hidden;padding:14px 15px;border:2px solid var(--a);background:linear-gradient(120deg,#0d1030,#2d2270 60%,color-mix(in srgb,var(--a) 70%,#15123B))}
.bn2-band{position:absolute;right:0;top:0;bottom:0;width:46%;background-size:cover;background-position:center;opacity:.55;-webkit-mask:linear-gradient(90deg,transparent,#000 60%);mask:linear-gradient(90deg,transparent,#000 60%)}
.bn2>*{position:relative}
.bn2 small{display:block;font-size:10px;font-weight:800;letter-spacing:.12em;color:#FFE9A8}
.bn2 b{display:block;font:800 18px/1.15 'Unbounded';margin:5px 0 4px;max-width:78%}
.bn2 p{margin:0;font-size:12px;font-weight:700;color:#E5E4FF;max-width:74%}
.bn2 .pgx{height:7px;border-radius:99px;background:rgba(255,255,255,.2);margin-top:10px;overflow:hidden;max-width:70%}.bn2 .pgx u{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#FFE45E,#FF6B57)}
.bn2.run:after{content:"";position:absolute;inset:0;border-radius:18px;padding:3px;pointer-events:none;background:conic-gradient(from var(--r),transparent 0 58%,var(--a) 78%,#fff 90%,transparent 100%);animation:spin 2.4s linear infinite;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
.tk{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:14px;background:#201C52;border:2px solid #363078;margin-top:8px;width:100%;font-family:inherit;color:inherit;text-align:left}
.tk .cb2{width:26px;height:26px;border-radius:8px;border:2.5px solid #5a54a8;flex:none;display:grid;place-items:center;font-size:15px;font-weight:900;color:transparent}
.tk.on .cb2{background:#35D0A5;border-color:#35D0A5;color:#06281f}
.tk.ev{border-color:#FFB02E;background:linear-gradient(100deg,rgba(255,176,46,.18),#201C52)}
.tk b{display:block;font-size:13.5px;font-weight:800}.tk small{display:block;font-size:11px;font-weight:700;color:#A7A9E6;margin-top:1px}
.tk .tg{margin-left:auto;padding:3px 9px;border-radius:99px;font-size:9.5px;font-weight:800;letter-spacing:.08em;background:#FFB02E;color:#2A1400;flex:none}
/* hub */
.cbk{display:block;width:100%;position:relative;border-radius:18px;overflow:hidden;border:2px solid var(--a);padding:0;margin-bottom:10px;text-align:left;font-family:inherit;color:inherit;background:#201C52;cursor:pointer}
.cbk img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.4}
.cbk .in{position:relative;padding:12px 14px;background:linear-gradient(90deg,rgba(21,18,59,.95) 30%,rgba(21,18,59,.2))}
.cbk small{font-size:10px;font-weight:800;letter-spacing:.12em;color:var(--a)}
.cbk b{display:block;font:800 17px 'Unbounded';margin:3px 0 6px}
.cbk span{font-size:11.5px;font-weight:700;color:#E5E4FF}
.cbk .bar{height:6px;border-radius:99px;background:rgba(255,255,255,.18);margin-top:8px;overflow:hidden}.cbk .bar u{display:block;height:100%;background:var(--a);border-radius:99px}
.cbk.lk{border-color:#363078}.cbk.lk img{opacity:.12;filter:grayscale(1)}.cbk.lk small{color:#8F8FD0}
.cbk.done{box-shadow:0 0 22px color-mix(in srgb,var(--a) 55%,transparent)}
.dayg{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}
.dayg i{aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font:800 10px 'Be Vietnam Pro';font-style:normal;background:#201C52;border:2px solid #363078;color:#8F8FD0}
.dayg i.done{background:var(--c);border-color:var(--c);color:#1a0b00}
.dayg i.today{border-color:#fff;color:#fff;box-shadow:0 0 10px #fff}
.dayg i.miss{opacity:.4;text-decoration:line-through}
.dayg i.bu{border-style:dashed}
/* tiles */
.tabs{display:flex;gap:6px;padding:0 14px 10px;flex:none}
.tabs button{flex:1;padding:8px 2px;border-radius:12px;border:2px solid #363078;background:#201C52;color:#C7C6F5;font:800 10.5px 'Be Vietnam Pro';cursor:pointer}
.tabs button.on{border-color:var(--a);background:color-mix(in srgb,var(--a) 22%,#201C52);color:#fff}
.row5{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.tile{position:relative;aspect-ratio:3/4;border-radius:10px;overflow:hidden;border:2px solid var(--a);background:#000;cursor:pointer;padding:0;font-family:inherit}
.tile img{width:100%;height:100%;object-fit:cover;display:block}
.tile .nm{position:absolute;left:0;right:0;bottom:0;padding:8px 2px 2px;text-align:center;font:800 6.5px 'Be Vietnam Pro';letter-spacing:.06em;color:#fff;background:linear-gradient(0deg,rgba(0,0,0,.85),transparent)}
.tile .x{position:absolute;right:2px;top:2px;min-width:16px;padding:1px 4px;border-radius:99px;background:#FF2E88;color:#fff;font:800 8.5px 'Be Vietnam Pro';text-align:center}
.tile.lk{border:2px dashed #363078;background:#1b1747;cursor:default}
.tile.lk img,.tile.lk .nm,.tile.lk .x{display:none}
.tile.lk:after{content:"?";position:absolute;inset:0;display:grid;place-items:center;font:800 20px 'Unbounded';color:#363078}
.tile.ho{border:0;padding:2px;background:conic-gradient(from var(--r),#fff,#FF2E88,#FFE45E,#35D0A5,#4CC9FF,#8b5cff,#fff);animation:spin 3s linear infinite}
.tile.ho img{border-radius:8px}
.tile.ho:before{content:"";position:absolute;inset:2px;border-radius:8px;z-index:2;pointer-events:none;mix-blend-mode:color;opacity:.55;background:linear-gradient(120deg,#ff2e88,#ffe45e,#35d0a5,#4cc9ff,#8b5cff,#ff2e88);background-size:300% 300%;animation:hmove 5s linear infinite}
.shot{position:relative;border-radius:10px;overflow:hidden}.shot img{display:block;width:100%}
.shot .bd{position:absolute;top:0;bottom:0;width:20%;background:rgba(5,4,15,.93);border-left:1px solid #363078}
.shot .bd.get{display:none}
.btn2{display:block;width:100%;min-height:46px;border:0;border-radius:14px;font:900 14px 'Be Vietnam Pro';color:#2A1400;background:linear-gradient(100deg,#FFB02E,#FF6B57);box-shadow:0 8px 20px rgba(255,120,60,.3);cursor:pointer}
/* flip card */
.df{position:relative;width:250px;height:333px;margin:0 auto;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.3,.8,.3,1);cursor:pointer}
.df.on{transform:rotateY(180deg)}
.df.p0{animation:pop2 .55s cubic-bezier(.2,1.2,.3,1)}.df.p1{animation:pop2b .55s cubic-bezier(.2,1.2,.3,1)}
@keyframes pop2b{from{transform:scale(.7) rotate(6deg);opacity:0}to{transform:none;opacity:1}}
.dff,.dfb{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.dfb{transform:rotateY(180deg)}
.dots{display:flex;gap:7px;justify-content:center}.dots i{width:9px;height:9px;border-radius:50%;background:#363078}.dots i.on{background:#FFB02E;box-shadow:0 0 8px #FFB02E}
/* tear */
.tr{display:block;margin:0 auto;border:0;background:none;cursor:pointer;padding:0}
.tr.go{animation:shk .12s linear 8,boom .5s ease-in 1s forwards}
@keyframes shk{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-6px) rotate(-2deg)}75%{transform:translateX(6px) rotate(2deg)}}
@keyframes boom{to{transform:scale(1.6);opacity:0;filter:brightness(3)}}
/* panel */
.cp{width:420px;height:844px;overflow-y:auto;padding:16px 16px 20px;border-radius:22px;background:#1b1747;border:2px solid #363078;flex:none;scrollbar-width:thin}
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
