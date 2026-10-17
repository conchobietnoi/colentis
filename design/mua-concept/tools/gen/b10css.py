from b9css import STAGE_FILTER, APPCSS as _A, CP as _C
APPCSS=_A+r'''
/* ---- bản nhẹ: bỏ hiệu ứng nặng ---- */
.mt.ho{animation:none}.mt.ho:before{animation:none}
.rapp .kmcf i{will-change:auto}
.ul{position:relative;width:100%;aspect-ratio:3/4;border-radius:14px;padding:4px;background:conic-gradient(from var(--r),#fff3c4,#FFB02E,#fff,#FF2E88,#8b5cff,#4CC9FF,#fff3c4);animation:spin 3s linear infinite;box-shadow:0 6px 16px rgba(30,27,94,.3)}
.ul img{display:block;width:100%;height:100%;object-fit:cover;border-radius:10px}
.ul-t{position:absolute;left:0;right:0;top:12px;text-align:center;font:800 7.5px 'Be Vietnam Pro';letter-spacing:.2em;color:#fff;text-shadow:0 1px 4px #000}
.ul-n{position:absolute;left:0;right:0;bottom:12px;text-align:center;font:800 15px 'Unbounded';color:#FFE45E;text-shadow:0 2px 6px #000}
.ul-p{position:absolute;right:12px;top:12px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-style:normal;font-size:9px;display:grid;place-items:center}
'''
APPCSS+=r'''
.rapp .banner.bnx{padding:14px;min-height:112px;align-items:stretch;justify-content:space-between;gap:10px;border:1.5px solid rgba(255,255,255,.18)}
.bnbg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.42;filter:saturate(1.3)}
.bnx:before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,rgba(13,16,48,.92) 8%,rgba(13,16,48,.45) 60%,color-mix(in srgb,var(--bc) 55%,transparent))}
.bnl,.bnr{position:relative;z-index:1}
.bnl{display:flex;flex-direction:column;min-width:0;flex:1;justify-content:center}
.bnl b{font:800 17px/1.15 'Unbounded';letter-spacing:-.3px;margin-top:3px}
.bnl .bnk{font-size:9.5px;font-weight:800;letter-spacing:.16em;color:var(--bc);margin:0;opacity:1;text-shadow:0 0 10px var(--bc)}
.bnd{display:flex;gap:3px;margin-top:9px}.bnd i{flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,.2)}
.bnd i.on{background:var(--c);box-shadow:0 0 6px var(--c)}.bnd i.now{background:#fff;box-shadow:0 0 8px #fff}
.bnr{display:flex;align-items:center;flex:none;padding-right:2px}
.bnf{position:relative;width:46px;height:46px;border-radius:50%;margin-left:-12px;border:3px solid var(--a);overflow:hidden;background:#000;box-shadow:0 4px 10px rgba(0,0,0,.45)}
.bnf:first-child{margin-left:0}
.bnf img{width:100%;height:100%;object-fit:cover;display:block}
.bnf em{position:absolute;left:0;right:0;bottom:0;text-align:center;font:800 8px/1.5 'Be Vietnam Pro';font-style:normal;color:#fff;background:rgba(0,0,0,.7)}
.bnf.lk img{filter:grayscale(1) brightness(.5)}.bnf.lk{border-color:rgba(255,255,255,.3)}
.bnf.ok{box-shadow:0 0 0 2px #fff,0 0 14px var(--a)}.bnf.ok em{background:var(--a);color:#1a0b00}
.bnp{position:absolute;right:-4px;top:-8px;min-width:22px;height:22px;padding:0 5px;border-radius:99px;background:#FF2E88;color:#fff;font:800 11px 'Be Vietnam Pro';place-items:center;box-shadow:0 0 0 2px #fff,0 0 12px #FF2E88}
'''
APPCSS+=r'''
.hxh{margin:0 0 12px;padding:16px 14px 14px;border-radius:22px;color:#fff;background:linear-gradient(135deg,#0d1030,#3a2a8a 60%,#6b3aa8);box-shadow:0 8px 24px rgba(90,60,200,.35)}
.hxh small{font-size:10.5px;font-weight:800;letter-spacing:.14em;opacity:.8}
.hxh h2{margin:4px 0 12px;font:800 20px/1.15 'Unbounded';display:block}
.hxrs{display:flex;gap:8px}
.hxr{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:5px;color:#fff;text-align:center}
.hxo{width:72px;height:72px;border-radius:50%;padding:4px;background:conic-gradient(var(--kc) calc(var(--p)*1%),rgba(255,255,255,.2) 0);display:block}
.hxo img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;border:3px solid #1a1450}
.hxr.hlk .hxo img{filter:grayscale(1) brightness(.55)}
.hxr b{font-size:11.5px;font-weight:800;line-height:1.2}.hxr em{font-style:normal;font-size:10.5px;font-weight:700;opacity:.8}
.hxr.hgot em{color:#7dffd2;opacity:1}
.hxt{margin-bottom:12px;padding:13px 14px;border-radius:18px;background:var(--paper);border:2px solid var(--line);border-left:6px solid var(--kc);display:flex;flex-direction:column;gap:3px}
.hxt small{font-size:10.5px;font-weight:800;letter-spacing:.1em;color:var(--soft)}
.hxt b{font-size:17px;font-weight:900}.hxt span{font-size:12.5px;font-weight:600;color:var(--soft)}
.hxok{margin-top:6px;font-size:12.5px;font-weight:900;color:var(--mint)}
.hxb1{margin-top:8px;width:100%;padding:11px;border-radius:14px;background:var(--ink);color:var(--paper);font:800 13px 'Be Vietnam Pro';display:flex;gap:7px;align-items:center;justify-content:center}
.hxs{display:flex;gap:6px;margin-bottom:12px}
.hxs div{flex:1;min-width:0;padding:10px 8px;border-radius:14px;background:var(--paper);border:2px dashed var(--line);text-align:center}
.hxs i{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--pink);color:#fff;font:800 11px 'Be Vietnam Pro';font-style:normal}
.hxs b{display:block;font-size:11.5px;font-weight:900;margin-top:4px;line-height:1.2}.hxs span{display:block;font-size:10px;font-weight:600;color:var(--soft);margin-top:2px}
.hxl{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
.hxc{display:flex;align-items:center;gap:10px;padding:12px 12px 12px 14px;border-radius:16px;background:var(--paper);border:2px solid var(--line);border-left:6px solid var(--kc)}
.hxc.hlk{opacity:.55}.hxc.hnow{border-color:var(--kc)}
.hxcn{flex:1;min-width:0}.hxcn small{display:block;font-size:10px;font-weight:800;letter-spacing:.08em;color:var(--soft)}
.hxcn b{display:block;font-size:15px;font-weight:900;margin-top:1px}.hxcn span{display:block;font-size:11.5px;font-weight:600;color:var(--soft);margin-top:1px}
.hxbar{height:6px;border-radius:99px;background:var(--line);margin-top:7px;overflow:hidden}.hxbar i{display:block;height:100%;background:var(--kc);border-radius:99px}
.hxgo{flex:none;padding:8px 14px;border-radius:99px;background:var(--kc);color:#1a0b00;font:800 12px 'Be Vietnam Pro'}
.hxu{padding:14px;border-radius:18px;background:var(--paper);border:2px dashed var(--line);text-align:center}
.hxu b{display:block;font-size:14px;font-weight:900}.hxu span{display:block;font-size:12px;font-weight:600;color:var(--soft);margin-top:3px}
.hxu.go{border-style:solid;border-color:#FFB02E;background:rgba(255,176,46,.14)}
'''
APPCSS+=r'''
.rapp .pbody>*{flex:none !important;min-height:0}
.hxl,.hxc,.hxh,.hxt,.hxs,.hxu{flex:none !important;height:auto !important}
'''
APPCSS+=r'''
@keyframes rvwkA{from{transform:scale(.2);opacity:.9}to{transform:scale(5.5);opacity:0}}
@keyframes rvfkA{0%{opacity:.95}100%{opacity:0}}
@keyframes rvskA{0%{transform:translate(0,0) scale(.3);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1.1);opacity:0}}
@keyframes rvrkA{0%{opacity:0;transform:rotate(0) scale(.4)}12%{opacity:1}100%{opacity:.85;transform:rotate(120deg) scale(1)}}
@keyframes rvdkA{0%{transform:translateY(-130%) rotateY(540deg) scale(.45);opacity:0}55%{opacity:1}78%{transform:translateY(4%) rotateY(-12deg) scale(1.07)}100%{transform:none;opacity:1}}
@keyframes rvbkA{0%{transform:scale(2.6) rotate(-8deg);opacity:0}60%{transform:scale(.92) rotate(2deg);opacity:1}100%{transform:none;opacity:1}}
@keyframes rvtkA{0%{transform:translate(-50%,0) scale(.3);opacity:0}30%{transform:translate(-50%,0) scale(1.25);opacity:1}70%{opacity:1}100%{transform:translate(-50%,-26px) scale(1);opacity:0}}
@keyframes rvhkA{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
.rvx.p0 .rvr{animation:rvrkA 5s .1s ease-out both}
.rvx.p0 .rvw{animation:rvwkA .95s .55s ease-out both}
.rvx.p0 .rvw.w2{animation-delay:.8s}
.rvx.p0 .rvf{animation:rvfkA .6s .5s ease-out both}
.rvx.p0 u{animation:rvskA 1.2s .55s ease-out both}
.df.p0{animation:rvdkA .95s cubic-bezier(.2,.9,.3,1) both}
.badge.p0{animation:rvbkA .5s .95s both}
.rvt.p0{animation:rvtkA 1.6s .6s both}
.df.p0 .dff:after{content:"";position:absolute;inset:0;border-radius:6cqw;pointer-events:none;z-index:9;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.75) 50%,transparent 65%);animation:rvhkA .9s 1s ease-out both}

@keyframes rvwkB{from{transform:scale(.2);opacity:.9}to{transform:scale(5.5);opacity:0}}
@keyframes rvfkB{0%{opacity:.95}100%{opacity:0}}
@keyframes rvskB{0%{transform:translate(0,0) scale(.3);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1.1);opacity:0}}
@keyframes rvrkB{0%{opacity:0;transform:rotate(0) scale(.4)}12%{opacity:1}100%{opacity:.85;transform:rotate(120deg) scale(1)}}
@keyframes rvdkB{0%{transform:translateY(-130%) rotateY(540deg) scale(.45);opacity:0}55%{opacity:1}78%{transform:translateY(4%) rotateY(-12deg) scale(1.07)}100%{transform:none;opacity:1}}
@keyframes rvbkB{0%{transform:scale(2.6) rotate(-8deg);opacity:0}60%{transform:scale(.92) rotate(2deg);opacity:1}100%{transform:none;opacity:1}}
@keyframes rvtkB{0%{transform:translate(-50%,0) scale(.3);opacity:0}30%{transform:translate(-50%,0) scale(1.25);opacity:1}70%{opacity:1}100%{transform:translate(-50%,-26px) scale(1);opacity:0}}
@keyframes rvhkB{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
.rvx.p1 .rvr{animation:rvrkB 5s .1s ease-out both}
.rvx.p1 .rvw{animation:rvwkB .95s .55s ease-out both}
.rvx.p1 .rvw.w2{animation-delay:.8s}
.rvx.p1 .rvf{animation:rvfkB .6s .5s ease-out both}
.rvx.p1 u{animation:rvskB 1.2s .55s ease-out both}
.df.p1{animation:rvdkB .95s cubic-bezier(.2,.9,.3,1) both}
.badge.p1{animation:rvbkB .5s .95s both}
.rvt.p1{animation:rvtkB 1.6s .6s both}
.df.p1 .dff:after{content:"";position:absolute;inset:0;border-radius:6cqw;pointer-events:none;z-index:9;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.75) 50%,transparent 65%);animation:rvhkB .9s 1s ease-out both}

.rapp .kmrv{position:relative}
.rvx{position:absolute;left:50%;top:48%;width:0;height:0;pointer-events:none;z-index:0}
.rvx *{position:absolute;display:block}
.rvr{left:-300px;top:-300px;width:600px;height:600px;border-radius:50%;background:repeating-conic-gradient(from 0deg,var(--kc) 0 5deg,transparent 5deg 18deg);-webkit-mask:radial-gradient(circle,#000 8%,transparent 68%);mask:radial-gradient(circle,#000 8%,transparent 68%)}
.rvx.holo .rvr{background:repeating-conic-gradient(from 0deg,#ff2e88 0 5deg,#ffe45e 5deg 10deg,#35d0a5 10deg 15deg,#4cc9ff 15deg 20deg,#8b5cff 20deg 25deg,transparent 25deg 36deg)}
.rvw{left:-70px;top:-70px;width:140px;height:140px;border-radius:50%;border:5px solid var(--kc);box-shadow:0 0 24px var(--kc),inset 0 0 24px var(--kc)}
.rvx.holo .rvw{border-color:#fff}
.rvf{left:-360px;top:-360px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,255,255,.6) 25%,transparent 62%)}
.rvx u{left:-6px;top:-6px;width:12px;height:12px;background:#fff;text-decoration:none;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);filter:drop-shadow(0 0 5px var(--kc))}
.rvx.holo u{width:16px;height:16px}
.rapp .kmrv .df,.rapp .kmrv .badge,.rapp .kmrv .kmrn,.rapp .kmrv .dts{position:relative;z-index:1}
.rvt{position:absolute;left:50%;top:38%;display:none;padding:6px 16px;border-radius:99px;font:800 20px 'Unbounded';color:#1a0b00;background:linear-gradient(100deg,#ff2e88,#ffe45e,#35d0a5,#4cc9ff);box-shadow:0 0 24px rgba(255,255,255,.7);z-index:3;pointer-events:none;opacity:0}
.rvt.holo{display:block}
'''
APPCSS+=r'''
.ugx{overflow:hidden}
.ugsky{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.ugsk{position:absolute;bottom:-90px;width:2px;border-radius:2px;background:linear-gradient(0deg,transparent,#fff 70%,#FFE45E);box-shadow:0 0 6px #FFE45E;animation:ugup var(--d) var(--l) linear infinite}
@keyframes ugup{from{transform:translateY(0);opacity:0}10%{opacity:1}to{transform:translateY(-860px);opacity:0}}
.ugtw{position:absolute;width:5px;height:5px;background:#fff;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:ugtwk 1.6s ease-in-out infinite}
@keyframes ugtwk{0%,100%{opacity:.15;transform:scale(.5)}50%{opacity:1;transform:scale(1.4)}}
.ugst{position:absolute;left:0;right:0;top:78px;height:330px;perspective:800px}
.ugtilt{position:absolute;inset:0;transform:rotateX(-14deg);transform-style:preserve-3d}
.ugring{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d;animation:ugspin 4s cubic-bezier(.25,.1,.2,1) both}
@keyframes ugspin{from{transform:rotateY(0)}to{transform:rotateY(1080deg)}}
.ugk{position:absolute;left:-36px;top:-52px;width:72px;height:104px;border-radius:9px;border:2.5px solid #fff;background:repeating-linear-gradient(45deg,#2B2470 0 6px,#3A2BCB 6px 12px);transform:rotateY(var(--a)) translateZ(150px);box-shadow:0 6px 16px rgba(0,0,0,.5);animation:ugout .5s 3.7s forwards}
.ugk.u{border-color:#FFE45E;background:radial-gradient(circle at 50% 40%,#fff6c8,#FFB02E 55%,#b8731a);box-shadow:0 0 22px 8px rgba(255,226,94,.85),0 0 50px 14px rgba(255,46,136,.5);display:grid;place-items:center}
.ugk.u em{font-style:normal;font-size:30px;color:#fff;text-shadow:0 0 10px #fff}
@keyframes ugout{to{opacity:0}}
.ugbeam{position:absolute;left:50%;bottom:-20px;width:150px;height:560px;margin-left:-75px;background:linear-gradient(0deg,rgba(255,236,160,.95),rgba(255,236,160,.25) 60%,transparent);opacity:0;filter:blur(10px);animation:ugbm 1.4s 3.7s ease-out forwards}
@keyframes ugbm{0%{opacity:0;transform:scaleX(.2)}30%{opacity:1}100%{opacity:.0;transform:scaleX(1.6)}}
.ugflash{position:absolute;left:50%;top:50%;width:700px;height:700px;margin:-350px 0 0 -350px;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,240,180,.7) 28%,transparent 64%);opacity:0;animation:ugfl .8s 3.75s ease-out forwards}
@keyframes ugfl{0%{opacity:0;transform:scale(.2)}25%{opacity:1}100%{opacity:0;transform:scale(1.3)}}
.ugfin{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:14px;opacity:0;animation:ugin .8s 3.85s cubic-bezier(.2,1.3,.3,1) forwards}
@keyframes ugin{0%{opacity:0;transform:scale(.15) rotate(-14deg)}100%{opacity:1;transform:none}}
.ugc{flex:none;filter:drop-shadow(0 0 16px rgba(255,226,94,.8))}
.ugtxt{position:absolute;left:0;right:0;bottom:22px;padding:0 22px;text-align:center;color:#fff;opacity:0;animation:ugtx .6s 4.7s forwards}
@keyframes ugtx{to{opacity:1}}
.ugtxt small{display:block;font-size:11px;font-weight:800;letter-spacing:.18em;color:#FFE45E}
.ugtxt h2{margin:4px 0 6px;font:800 22px 'Unbounded';color:#fff}
.ugtxt p{margin:0 0 12px;font-size:12px;font-weight:600;opacity:.8;line-height:1.5}
'''
APPCSS+=r'''
/* ---- Ultra kiểu Wish ---- */
.ugshake{position:absolute;inset:0;animation:ugsh .6s 2.55s linear 1}
@keyframes ugsh{0%,100%{transform:none}15%{transform:translate(-7px,4px)}30%{transform:translate(6px,-5px)}45%{transform:translate(-5px,-3px)}60%{transform:translate(4px,5px)}80%{transform:translate(-2px,2px)}}
.mtw{position:absolute;top:0;width:0;height:0}
.mtw.m1{left:0;transform:rotate(50deg)}
.mtw.m2{left:100%;transform:rotate(130deg)}
.mth{position:absolute;left:0;top:-14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,#fff 0 35%,#FFE45E 60%,transparent 72%);box-shadow:0 0 26px 10px rgba(255,214,90,.9),0 0 60px 20px rgba(255,150,60,.6);opacity:0;animation:mtgo 2.3s .35s cubic-bezier(.55,0,.9,.55) both}
.mth:before{content:"";position:absolute;right:50%;top:50%;width:300px;height:10px;margin-top:-5px;border-radius:10px;background:linear-gradient(270deg,#fff,#FFE45E 18%,rgba(255,150,60,.5) 55%,transparent);filter:blur(1.5px)}
.mtw.m2 .mth{box-shadow:0 0 26px 10px rgba(255,120,200,.9),0 0 60px 20px rgba(255,60,150,.6);animation-delay:.6s;animation-duration:2.05s}
.mtw.m2 .mth:before{background:linear-gradient(270deg,#fff,#FFB0DC 18%,rgba(255,60,150,.5) 55%,transparent)}
@keyframes mtgo{0%{opacity:0;transform:translateX(-40px)}8%{opacity:1}92%{opacity:1}100%{opacity:0;transform:translateX(300px)}}
.ugflash{position:absolute;left:50%;top:230px;width:800px;height:800px;margin:-400px 0 0 -400px;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,240,180,.75) 26%,transparent 62%);opacity:0;animation:ugfl 1s 2.65s ease-out forwards}
.ugw{position:absolute;left:50%;top:230px;width:140px;height:140px;margin:-70px 0 0 -70px;border-radius:50%;border:5px solid #FFE45E;box-shadow:0 0 26px #FFE45E,inset 0 0 26px #FFE45E;opacity:0;animation:ugwv 1.1s 2.7s ease-out forwards}
.ugw.w2{border-color:#FF2E88;box-shadow:0 0 26px #FF2E88,inset 0 0 26px #FF2E88;animation-delay:2.95s}
@keyframes ugwv{0%{opacity:.95;transform:scale(.2)}100%{opacity:0;transform:scale(5.5)}}
.ugbeam{position:absolute;left:50%;bottom:0;width:190px;height:700px;margin-left:-95px;background:linear-gradient(0deg,rgba(255,236,160,.95),rgba(255,236,160,.3) 55%,transparent);filter:blur(12px);opacity:0;animation:ugbm 2.2s 2.7s ease-out forwards}
@keyframes ugbm{0%{opacity:0;transform:scaleX(.15)}25%{opacity:1}100%{opacity:0;transform:scaleX(1.5)}}
.ugray{position:absolute;left:50%;top:230px;width:760px;height:760px;margin:-380px 0 0 -380px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,226,94,.85) 0 5deg,transparent 5deg 16deg);-webkit-mask:radial-gradient(circle,#000 6%,transparent 66%);mask:radial-gradient(circle,#000 6%,transparent 66%);opacity:0;animation:ugrayin .8s 3.3s ease-out forwards,ugrot 24s 3.3s linear infinite}
@keyframes ugrayin{to{opacity:.8}}@keyframes ugrot{to{transform:rotate(360deg)}}
.ugst{position:absolute;left:0;right:0;top:130px;height:200px;display:flex;justify-content:center;gap:16px;perspective:900px}
.ugc{transform-style:preserve-3d;width:150px;height:200px;opacity:0;animation:ugrise .9s calc(2.8s + var(--dl)) cubic-bezier(.2,1.2,.3,1) forwards}
@keyframes ugrise{0%{opacity:0;transform:translateY(120px) scale(.2)}100%{opacity:1;transform:none}}
.ugf{position:relative;width:100%;height:100%;transform-style:preserve-3d;animation:ugfp 4.2s calc(2.8s + var(--fd)) ease-in-out forwards}
@keyframes ugfp{0%{transform:rotateY(180deg)}22%{transform:rotateY(166deg) translateY(-8px)}44%{transform:rotateY(194deg) translateY(4px)}62%{transform:rotateY(180deg)}100%{transform:rotateY(360deg) scale(1.04)}}
.ugfr,.ugbk{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.ugfr .cw{width:150px !important}
.ugbk{transform:rotateY(180deg);border-radius:14px;border:3px solid #FFE45E;background:radial-gradient(circle at 50% 38%,#fff6c8,#FFB02E 50%,#8a4a08);box-shadow:0 0 30px 8px rgba(255,226,94,.7),0 0 70px 16px rgba(255,46,136,.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#4a2400;overflow:hidden}
.ugbk b{font-size:54px;line-height:1;color:#fff;text-shadow:0 0 16px #fff,0 2px 0 #b8731a}
.ugbk small{font:800 15px 'Unbounded';letter-spacing:.1em}.ugbk em{font-style:normal;font-size:9px;font-weight:800;letter-spacing:.3em}
.ugbk i{position:absolute;bottom:10px;font:800 11px 'Unbounded';font-style:normal}
.ugbk:after{content:"";position:absolute;inset:-20%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%);background-size:300% 100%;animation:sweep 1.8s linear infinite;mix-blend-mode:overlay}
.ugsp{position:absolute;top:230px;width:0;height:0;pointer-events:none}
.ugsp u{position:absolute;left:-7px;top:-7px;width:14px;height:14px;background:#fff;text-decoration:none;opacity:0;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);filter:drop-shadow(0 0 6px #FFE45E);animation:ugsb 1.3s ease-out both}
@keyframes ugsb{0%{opacity:1;transform:translate(0,0) scale(.3)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2)}}
.ugtxt{animation-delay:7s !important}
'''
APPCSS+=r'''
/* ---- Ultra điện ảnh ---- */
.cnx{overflow:hidden;background:#020108}
.cnworld{position:absolute;inset:0;transform-origin:50% 42%;animation:cnpush 10s linear forwards}
@keyframes cnpush{from{transform:scale(1)}to{transform:scale(1.13)}}
.cnstars{position:absolute;inset:0}
.cnsr{position:absolute;width:var(--z);height:var(--z);border-radius:50%;background:#fff;box-shadow:0 0 6px #cfe8ff;opacity:0;animation:cnsrk 3.2s ease-in-out infinite}
@keyframes cnsrk{0%,100%{opacity:.1}50%{opacity:.95}}
.cnglow{position:absolute;left:50%;top:330px;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#fff;box-shadow:0 0 30px 12px rgba(160,200,255,.9),0 0 90px 40px rgba(120,90,255,.6);opacity:0;animation:cngl 3.4s .7s ease-in forwards}
@keyframes cngl{0%{opacity:0;transform:scale(.2)}60%{opacity:.9;transform:scale(1.4)}100%{opacity:0;transform:scale(2)}}
.cnmw{position:absolute;top:30px;width:0;height:0}
.cnmw.a{left:0;transform:rotate(56deg)}.cnmw.b{left:100%;transform:rotate(124deg)}
.cnm{position:absolute;left:0;top:-14px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,#fff 0 38%,#FFE45E 62%,transparent 74%);box-shadow:0 0 30px 12px rgba(255,214,90,.9),0 0 70px 26px rgba(255,150,60,.55);opacity:0;animation:cnmg 2.4s 1.5s cubic-bezier(.6,0,.95,.5) forwards}
.cnm:before{content:"";position:absolute;right:50%;top:50%;width:340px;height:12px;margin-top:-6px;border-radius:12px;background:linear-gradient(270deg,#fff,#FFE45E 14%,rgba(255,140,50,.55) 50%,transparent);filter:blur(2px)}
.cnm:after{content:"";position:absolute;right:50%;top:50%;width:200px;height:3px;margin-top:-1.5px;background:linear-gradient(270deg,#fff,transparent);filter:blur(.5px)}
.cnmw.b .cnm{box-shadow:0 0 30px 12px rgba(255,120,200,.9),0 0 70px 26px rgba(255,60,150,.55);animation-delay:1.8s;animation-duration:2.1s}
.cnmw.b .cnm:before{background:linear-gradient(270deg,#fff,#FFB0DC 14%,rgba(255,60,150,.55) 50%,transparent)}
@keyframes cnmg{0%{opacity:0;transform:translateX(-60px) scale(.25)}10%{opacity:1}92%{opacity:1}100%{opacity:0;transform:translateX(340px) scale(1.7)}}
.cnsh{position:absolute;inset:0;animation:cnshk 1.1s 3.9s linear 1}
@keyframes cnshk{0%,100%{transform:none}8%{transform:translate(-11px,6px)}18%{transform:translate(10px,-8px)}30%{transform:translate(-8px,-5px)}44%{transform:translate(6px,7px)}60%{transform:translate(-4px,3px)}80%{transform:translate(2px,-2px)}}
.cnflash{position:absolute;left:50%;top:330px;width:900px;height:900px;margin:-450px 0 0 -450px;border-radius:50%;background:radial-gradient(circle,#fff 0,#fff 14%,rgba(255,240,190,.7) 34%,transparent 64%);opacity:0;animation:cnfl 1.6s 3.9s ease-out forwards}
@keyframes cnfl{0%{opacity:0;transform:scale(.1)}12%{opacity:1;transform:scale(.9)}100%{opacity:0;transform:scale(1.5)}}
.cnflare{position:absolute;left:50%;top:330px;width:980px;height:3px;margin:-1.5px 0 0 -490px;background:linear-gradient(90deg,transparent,#8fd0ff 25%,#fff 50%,#8fd0ff 75%,transparent);box-shadow:0 0 20px 5px rgba(120,200,255,.85);opacity:0;transform:scaleX(0);animation:cnfa 2.2s 3.9s ease-out forwards}
@keyframes cnfa{0%{opacity:1;transform:scaleX(0)}25%{opacity:1;transform:scaleX(1)}100%{opacity:0;transform:scaleX(1.1)}}
.cnring{position:absolute;left:50%;top:330px;width:140px;height:140px;margin:-70px 0 0 -70px;border-radius:50%;border:4px solid #FFE45E;box-shadow:0 0 28px #FFE45E,inset 0 0 28px #FFE45E;opacity:0;animation:cnrg 1.5s 3.95s ease-out forwards}
.cnring.r2{border-color:#FF2E88;box-shadow:0 0 28px #FF2E88,inset 0 0 28px #FF2E88;animation-delay:4.25s}
@keyframes cnrg{0%{opacity:.95;transform:scale(.15)}100%{opacity:0;transform:scale(7)}}
.cnrays{position:absolute;left:50%;top:330px;width:820px;height:820px;margin:-410px 0 0 -410px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,226,94,.8) 0 4deg,transparent 4deg 14deg);-webkit-mask:radial-gradient(circle,#000 4%,transparent 64%);mask:radial-gradient(circle,#000 4%,transparent 64%);opacity:0;animation:cnry 1.2s 4.4s ease-out forwards,cnrt 30s 4.4s linear infinite}
@keyframes cnry{to{opacity:.75}}@keyframes cnrt{to{transform:rotate(360deg)}}
.cnem{position:absolute;bottom:90px;border-radius:50%;background:#FFE45E;box-shadow:0 0 8px #FFB02E;opacity:0;animation:cnrs var(--d) calc(4.8s + var(--l)) linear infinite}
@keyframes cnrs{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}100%{opacity:0;transform:translate(var(--x),-520px)}}
.cnemb{position:absolute;inset:0;pointer-events:none}
.cnst{position:absolute;left:0;right:0;top:230px;height:200px;display:flex;justify-content:center;gap:16px;perspective:1000px}
.cnc{position:relative;width:150px;height:200px;transform-style:preserve-3d;opacity:0;animation:cnem 1.9s 4.25s cubic-bezier(.15,.8,.25,1) forwards}
@keyframes cnem{0%{opacity:0;transform:scale(.06) translateY(30px)}25%{opacity:1}100%{opacity:1;transform:none}}
.cnf{position:relative;width:100%;height:100%;transform-style:preserve-3d;animation:cnspin 1.9s 4.25s cubic-bezier(.15,.8,.25,1) both,cnwob 2.2s 6.2s ease-in-out infinite alternate,cnflip 1.2s calc(var(--fd)*1s) cubic-bezier(.4,0,.2,1) forwards}
@keyframes cnspin{from{transform:rotateY(1260deg)}to{transform:rotateY(180deg)}}
@keyframes cnwob{from{transform:rotateY(176deg) translateY(0)}to{transform:rotateY(184deg) translateY(-9px)}}
@keyframes cnflip{0%{transform:rotateY(180deg)}55%{transform:rotateY(335deg) scale(1.14)}100%{transform:rotateY(360deg) scale(1.06)}}
.cnfr,.cnbk{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.cnfr .cw{width:150px !important}
.cnfr{filter:drop-shadow(0 0 18px rgba(255,226,94,.85))}
.cnbk{transform:rotateY(180deg);border-radius:14px;border:3px solid #FFE45E;background:radial-gradient(circle at 50% 38%,#fff6c8,#FFB02E 50%,#8a4a08);box-shadow:0 0 34px 10px rgba(255,226,94,.75),0 0 80px 20px rgba(255,46,136,.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#4a2400;overflow:hidden}
.cnbk b{font-size:54px;line-height:1;color:#fff;text-shadow:0 0 16px #fff,0 2px 0 #b8731a}
.cnbk small{font:800 15px 'Unbounded';letter-spacing:.1em}.cnbk em{font-style:normal;font-size:9px;font-weight:800;letter-spacing:.3em}
.cnbk i{position:absolute;bottom:10px;font:800 11px 'Unbounded';font-style:normal}
.cnbk:after{content:"";position:absolute;inset:-20%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%);background-size:300% 100%;animation:sweep 1.8s linear infinite;mix-blend-mode:overlay}
.cncap{position:absolute;left:0;right:0;top:214px;text-align:center;color:#fff;opacity:0;animation:cncp 2.4s calc(var(--fd)*1s + .5s) ease-out forwards}
@keyframes cncp{0%{opacity:0;transform:translateY(10px);letter-spacing:.6em}25%{opacity:1;transform:none;letter-spacing:.2em}100%{opacity:1;letter-spacing:.2em}}
.cncap small{display:block;font-size:9px;font-weight:800;letter-spacing:.3em;color:#FFE45E}
.cncap b{display:block;font:800 17px 'Unbounded';margin-top:2px;text-shadow:0 0 12px #FFB02E}
.cnvig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,transparent 45%,rgba(0,0,0,.7) 100%)}
.cnbar{position:absolute;left:0;right:0;height:64px;background:#000;z-index:5;pointer-events:none}
.cnbar.t{top:0;animation:cnbt 10s forwards}.cnbar.b{bottom:0;animation:cnbb 10s forwards}
@keyframes cnbt{0%{transform:translateY(-100%)}6%,90%{transform:none}100%{transform:translateY(-100%)}}
@keyframes cnbb{0%{transform:translateY(100%)}6%,90%{transform:none}100%{transform:translateY(100%)}}
.cntxt{position:absolute;left:0;right:0;bottom:20px;padding:0 22px;text-align:center;color:#fff;opacity:0;z-index:6;animation:cntx .7s 9.4s forwards}
@keyframes cntx{to{opacity:1}}
.cntxt small{display:block;font-size:11px;font-weight:800;letter-spacing:.18em;color:#FFE45E}
.cntxt h2{margin:4px 0 6px;font:800 22px 'Unbounded';color:#fff}
.cntxt p{margin:0 0 12px;font-size:12px;font-weight:600;opacity:.8;line-height:1.5}
'''
APPCSS+=r'''
/* ---- Ultra sân khấu concert ---- */
.sgx{overflow:hidden;background:#030208}
.sgworld{position:absolute;inset:0;transform-origin:50% 55%;animation:cnpush 10s linear forwards}
.sgfloor{position:absolute;left:-10%;right:-10%;bottom:0;height:360px;background:radial-gradient(ellipse at 50% 0,rgba(120,80,220,.35),transparent 60%),repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 40px),linear-gradient(0deg,#0d0820,transparent);transform:perspective(500px) rotateX(58deg);transform-origin:50% 100%;opacity:0;animation:sgfi 1.2s 2.4s forwards}
@keyframes sgfi{to{opacity:1}}
.sgbeams{position:absolute;inset:0;pointer-events:none}
.sgb{position:absolute;top:-10px;width:230px;height:760px;margin-left:-115px;transform-origin:50% 0;clip-path:polygon(46% 0,54% 0,100% 100%,0 100%);mix-blend-mode:screen;filter:blur(2.5px);opacity:0;background:linear-gradient(180deg,var(--c),transparent 92%)}
.sgb.b1{left:12%;--c:rgba(255,226,94,.95);animation:sgon .3s 1s steps(2) forwards,sgsw 3.2s 1.3s ease-in-out infinite alternate;--a0:-14deg;--a1:22deg}
.sgb.b2{left:88%;--c:rgba(255,60,150,.95);animation:sgon .3s 1.5s steps(2) forwards,sgsw 2.8s 1.8s ease-in-out infinite alternate;--a0:14deg;--a1:-24deg}
.sgb.b3{left:50%;--c:rgba(220,240,255,.95);animation:sgon .3s 2s steps(2) forwards,sgsw 3.6s 2.3s ease-in-out infinite alternate;--a0:-9deg;--a1:9deg}
.sgb.b4{left:30%;--c:rgba(80,200,255,.9);animation:sgon .3s 2.6s steps(2) forwards,sgsw 2.5s 2.9s ease-in-out infinite alternate;--a0:18deg;--a1:-16deg}
.sgb.b5{left:70%;--c:rgba(255,200,70,.9);animation:sgon .3s 2.9s steps(2) forwards,sgsw 3s 3.2s ease-in-out infinite alternate;--a0:-20deg;--a1:14deg}
@keyframes sgon{0%{opacity:0}50%{opacity:.2}100%{opacity:.85}}
@keyframes sgsw{from{transform:rotate(var(--a0))}to{transform:rotate(var(--a1))}}
.sgtruss{position:absolute;left:0;right:0;top:70px;height:20px}
.sgl{position:absolute;top:0;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#fff;box-shadow:0 0 14px 5px rgba(255,255,255,.9);opacity:.08;animation:sgls 1.2s calc(3.3s + var(--i)*.12s) ease-out 1 forwards,sgst 1.1s 4.2s steps(2) 4}
@keyframes sgls{0%{opacity:.08}30%{opacity:1}100%{opacity:.6}}
@keyframes sgst{0%{opacity:1}50%{opacity:.1}}
.sgsmoke{position:absolute;left:-20%;right:-20%;bottom:140px;height:260px;pointer-events:none}
.sgsmoke i{position:absolute;left:0;right:0;bottom:0;height:200px;background:radial-gradient(ellipse at 40% 70%,rgba(200,180,255,.32),transparent 65%);filter:blur(14px);opacity:0;animation:sgsm 9s 1.6s ease-in-out forwards}
.sgsmoke i.s2{background:radial-gradient(ellipse at 65% 60%,rgba(255,170,220,.28),transparent 60%);animation-delay:2.4s;animation-duration:10s}
@keyframes sgsm{0%{opacity:0;transform:translateX(-30px)}30%{opacity:1}100%{opacity:.8;transform:translateX(40px)}}
.sgflash{position:absolute;left:50%;top:400px;width:1000px;height:1000px;margin:-500px 0 0 -500px;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,240,200,.7) 24%,transparent 60%);opacity:0;animation:cnfl 1.6s 4.2s ease-out forwards}
.sgfire{position:absolute;bottom:200px;width:0;height:0}
.sgfire.f1{left:10%}.sgfire.f2{left:90%}
.sgfire i{position:absolute;left:0;top:0;border-radius:50%;background:#ffe45e;box-shadow:0 0 8px 2px #ffb02e;opacity:0;animation:sgsp 1.3s ease-out infinite}
@keyframes sgsp{0%{opacity:1;transform:translate(0,0)}60%{opacity:1}100%{opacity:0;transform:translate(var(--dx),calc(var(--dy) + 160px))}}
.sgst{position:absolute;left:0;right:0;top:300px;height:200px;display:flex;justify-content:center;gap:16px;perspective:1000px}
.sgc{position:relative;width:150px;height:200px;transform-style:preserve-3d;opacity:0;animation:sgdrop 1.9s 4.3s cubic-bezier(.2,.9,.25,1) forwards}
.sgc:before{content:"";position:absolute;left:50%;bottom:100%;width:2px;height:700px;margin-left:-1px;background:linear-gradient(0deg,#fff,rgba(255,226,94,.2));box-shadow:0 0 8px #ffe45e}
@keyframes sgdrop{0%{opacity:0;transform:translateY(-640px) rotate(6deg)}15%{opacity:1}70%{transform:translateY(14px) rotate(-1deg)}100%{opacity:1;transform:none}}
.sgf{position:relative;width:100%;height:100%;transform-style:preserve-3d;animation:sgspin 1.9s 4.3s cubic-bezier(.2,.9,.25,1) both,cnwob 2.2s 6.3s ease-in-out infinite alternate,cnflip 1.2s calc(var(--fd)*1s) cubic-bezier(.4,0,.2,1) forwards}
@keyframes sgspin{from{transform:rotateY(900deg)}to{transform:rotateY(180deg)}}
.sgspot{position:absolute;left:50%;bottom:-44px;width:190px;height:46px;margin-left:-95px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,226,94,.85),rgba(255,46,136,.3) 55%,transparent 72%);opacity:0;animation:cnry 1s 5.6s forwards;filter:blur(2px)}
.sgc .cncap{top:236px}
.sgcrowd{position:absolute;left:0;right:0;bottom:56px;height:80px;opacity:0;animation:sgfi 1.2s 3s forwards;pointer-events:none}
.sgh{position:absolute;width:var(--sz);height:var(--sz);margin-left:calc(var(--sz)/-2);border-radius:50% 50% 8px 8px;background:#05030c;box-shadow:0 -2px 0 rgba(255,255,255,.08)}
.sgh b{position:absolute;left:50%;bottom:60%;width:3px;height:34px;margin-left:-1.5px;border-radius:3px;background:var(--c);box-shadow:0 0 10px 3px var(--c);transform-origin:50% 100%;animation:sgstk 1.1s var(--dl) ease-in-out infinite alternate}
@keyframes sgstk{from{transform:rotate(-26deg)}to{transform:rotate(26deg)}}
'''
APPCSS+=r'''
.ugwrap{position:absolute;inset:0}
.sxcore{position:absolute;left:50%;top:330px;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:radial-gradient(circle,#fff 0 30%,rgba(255,230,160,.9) 55%,transparent 72%);box-shadow:0 0 40px 14px rgba(255,200,120,.8),0 0 120px 50px rgba(180,90,255,.55);opacity:0;animation:sxcr 3.3s .7s cubic-bezier(.5,0,.9,.55) forwards}
@keyframes sxcr{0%{opacity:0;transform:scale(.1)}25%{opacity:.7;transform:scale(.7)}95%{opacity:1;transform:scale(3.6)}100%{opacity:0;transform:scale(4.2)}}
.sxorb{position:absolute;inset:0}
.sxa{position:absolute;left:50%;top:330px;width:0;height:0;animation:sxrot 3.2s calc(.7s + var(--k)*.05s) cubic-bezier(.5,0,.9,.55) both,sxop 3.2s calc(.7s + var(--k)*.05s) linear both}
.sxa i{position:absolute;left:0;top:0;width:var(--s);height:var(--s);margin:calc(var(--s)/-2);border-radius:50%;background:radial-gradient(circle,#fff 0 34%,var(--c) 62%,transparent 76%);box-shadow:0 0 calc(var(--s)*.9) calc(var(--s)*.3) var(--c);animation:sxrad 3.2s calc(.7s + var(--k)*.05s) cubic-bezier(.5,0,.9,.55) both}
@keyframes sxrot{from{transform:rotate(var(--a0))}to{transform:rotate(calc(var(--a0) + 1800deg))}}
@keyframes sxrad{from{transform:translateX(215px)}to{transform:translateX(0)}}
@keyframes sxop{0%{opacity:0}7%{opacity:var(--o)}90%{opacity:var(--o)}100%{opacity:0}}
'''
APPCSS+=r'''
/* ---- Ultra đĩa than ---- */
.vdfloor{position:absolute;left:-20%;right:-20%;top:395px;height:430px;background:radial-gradient(ellipse at 50% 18%,rgba(255,200,120,.16),transparent 55%),repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 2px,transparent 2px 44px),linear-gradient(180deg,rgba(40,25,80,.7),transparent);transform:perspective(520px) rotateX(58deg);transform-origin:50% 0;opacity:0;animation:sgfi 1s .2s forwards}
.vdshk{position:absolute;inset:0;animation:vdsk 3.7s linear 1 both}
@keyframes vdsk{0%,100%{transform:none}30.5%{transform:none}31.5%{transform:translate(-5px,6px)}33%{transform:translate(4px,-4px)}35%{transform:none}46.5%{transform:none}47.5%{transform:translate(5px,7px)}49.5%{transform:translate(-4px,-3px)}52%{transform:none}}
.vdw{position:absolute;top:330px;width:0;height:0;z-index:1;animation:vdup 1s 4.4s cubic-bezier(.3,.9,.3,1.1) both}
@keyframes vdup{from{transform:translateY(210px)}to{transform:translateY(0)}}
.vdfl{position:absolute;left:0;top:0;width:0;height:0;animation:vdfall 1.5s calc(var(--fl)*1s) cubic-bezier(.5,0,.8,.5) both}
@keyframes vdfall{0%{transform:translateY(-900px)}70%{transform:translateY(0)}78%{transform:translateY(-26px)}86%{transform:translateY(0)}92%{transform:translateY(-6px)}100%{transform:translateY(0)}}
.vdtl{position:absolute;left:0;top:0;width:0;height:0;transform:perspective(500px) rotateX(64deg);animation:vdtilt 1s 4.4s cubic-bezier(.3,.9,.3,1.1) both}
@keyframes vdtilt{from{transform:perspective(500px) rotateX(64deg)}to{transform:perspective(500px) rotateX(0deg) scale(1.06)}}
.vdi{position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#0a0a0d 0 5%,var(--c) 6% 24%,#111 25% 28%,transparent 29%),repeating-radial-gradient(circle,#09090c 0 1.2px,#24242c 1.2px 3px);box-shadow:0 0 26px 3px var(--c);animation:vdsp .55s linear infinite}
@keyframes vdsp{to{transform:rotate(360deg)}}
.vdh{position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;background:conic-gradient(from 20deg,transparent 0 18%,rgba(255,255,255,.4) 25%,transparent 32% 66%,rgba(255,255,255,.3) 75%,transparent 82%);mix-blend-mode:screen;pointer-events:none}
.vdsh{position:absolute;top:535px;width:120px;height:30px;margin-left:-60px;border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.8),transparent 70%);opacity:0;animation:vdshd 1.5s calc(var(--fl)*1s) ease-in both;z-index:0}
@keyframes vdshd{0%{opacity:0;transform:scale(.3)}70%{opacity:.9;transform:scale(1)}100%{opacity:.9;transform:scale(1)}}
.vdrp{position:absolute;top:540px;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;border:3px solid rgba(255,226,140,.9);box-shadow:0 0 14px rgba(255,226,140,.8);opacity:0;transform:scaleY(.28);animation:vdr 1s calc(var(--fl)*1s) ease-out both;z-index:0}
.vdrp.r2{border-color:rgba(255,120,190,.9)}
@keyframes vdr{0%{opacity:.95;transform:scale(.2,.06)}100%{opacity:0;transform:scale(2.4,.7)}}
.vdbm{position:absolute;bottom:260px;width:130px;height:620px;margin-left:-65px;background:linear-gradient(0deg,var(--c),transparent 90%);clip-path:polygon(30% 100%,70% 100%,100% 0,0 0);mix-blend-mode:screen;filter:blur(6px);opacity:0;animation:vdbm 1.4s 3.3s ease-out forwards}
.vdbm.a{left:57px;--c:rgba(255,210,74,.85)}.vdbm.b{left:333px;--c:rgba(255,79,163,.85);animation-delay:3.8s}
@keyframes vdbm{0%{opacity:0}25%{opacity:.9}100%{opacity:.25}}
.vdflash{position:absolute;left:50%;top:330px;width:900px;height:900px;margin:-450px 0 0 -450px;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,240,190,.7) 28%,transparent 62%);opacity:0;animation:cnfl 1.4s 4.85s ease-out forwards}
.vdst{position:absolute;left:0;right:0;top:230px;height:200px;display:flex;justify-content:center;gap:10px;perspective:1000px;z-index:3}
.vdc{position:relative;width:150px;height:200px;transform-style:preserve-3d;opacity:0;animation:vdce 1.4s 4.95s cubic-bezier(.2,.9,.25,1) forwards}
@keyframes vdce{0%{opacity:0;transform:translateX(var(--sx)) scale(.1)}20%{opacity:1}100%{opacity:1;transform:none}}
.vdf{position:relative;width:100%;height:100%;transform-style:preserve-3d;animation:cnspin 1.5s 4.95s cubic-bezier(.2,.9,.25,1) both,cnwob 2.2s 6.5s ease-in-out infinite alternate,cnflip 1.2s calc(var(--fd)*1s) cubic-bezier(.4,0,.2,1) forwards}
'''
APPCSS+=r'''
/* ---- mặt lưng Ultra mới ---- */
.cnbk{display:block !important;padding:0 !important;gap:0 !important;border:3px solid transparent !important;color:#fff !important;
 background:linear-gradient(160deg,#241552,#0a0620 60%,#160a3a) padding-box,conic-gradient(from var(--r),#fff3c4,#FFB02E,#FF2E88,#8b5cff,#4CC9FF,#fff3c4) border-box !important;
 box-shadow:0 0 30px 6px rgba(255,200,90,.55),0 0 70px 14px rgba(255,46,136,.35) !important;animation:spin 4s linear infinite}
.cnbk:before{content:"";position:absolute;inset:0;border-radius:11px;background:repeating-linear-gradient(45deg,rgba(255,226,94,.07) 0 1px,transparent 1px 8px),repeating-linear-gradient(-45deg,rgba(255,226,94,.07) 0 1px,transparent 1px 8px);pointer-events:none}
.cnbk:after{content:"";position:absolute;inset:5px;border-radius:9px;border:1.5px solid rgba(255,226,94,.55);background:none !important;animation:none !important;mix-blend-mode:normal !important}
.cbt{position:absolute;top:13px;left:0;right:0;text-align:center;font:800 7.5px 'Be Vietnam Pro';letter-spacing:.34em;color:#FFE45E}
.cbe{position:absolute;left:50%;top:50%;width:112px;height:112px;margin:-62px 0 0 -56px;animation:cbrot 16s linear infinite;filter:drop-shadow(0 0 6px rgba(255,200,90,.7))}
.cbs{position:absolute;left:50%;top:50%;width:112px;height:112px;margin:-62px 0 0 -56px;filter:drop-shadow(0 0 8px #fff) drop-shadow(0 0 16px #FFB02E);animation:cbtw 2.4s ease-in-out infinite}
@keyframes cbrot{to{transform:rotate(360deg)}}
@keyframes cbtw{0%,100%{transform:scale(.9);opacity:.85}50%{transform:scale(1.08);opacity:1}}
.cbn{position:absolute;bottom:30px;left:0;right:0;text-align:center;font:800 13px/1.15 'Unbounded';letter-spacing:.08em;background:linear-gradient(180deg,#fff,#FFE45E 55%,#FFB02E);-webkit-background-clip:text;background-clip:text;color:transparent}
.cbi{position:absolute;bottom:13px;left:0;right:0;text-align:center;font:800 9px 'Be Vietnam Pro';letter-spacing:.3em;color:#FFC1DB}
.cbc{position:absolute;font-size:9px;color:#FFE45E;text-shadow:0 0 6px #FFB02E}
.cbc.c1{left:11px;top:11px}.cbc.c2{right:11px;top:11px}.cbc.c3{left:11px;bottom:11px}.cbc.c4{right:11px;bottom:11px}
'''
APPCSS+=r'''
/* ---- mặt lưng Ultra: cùng khung với mặt trước ---- */
.cnbk2{position:absolute;inset:0;transform:rotateY(180deg);backface-visibility:hidden;-webkit-backface-visibility:hidden;filter:drop-shadow(0 0 18px rgba(255,226,94,.85))}
.cnbk2 .cw{width:150px !important}
.ub-sky{position:absolute;inset:0;background:radial-gradient(circle at 50% 44%,#3b1a78 0,#1a0b44 38%,#05030f 78%)}
.ub-stars{position:absolute;left:0;top:0;width:1px;height:1px;border-radius:50%;box-shadow:34cqw 79cqw 0 0.5cqw rgba(255,255,255,0.5),51cqw 121cqw 0 0.5cqw rgba(255,255,255,0.7),84cqw 78cqw 0 0.25cqw rgba(255,255,255,0.9),5cqw 120cqw 0 0.35cqw rgba(255,255,255,0.7),74cqw 33cqw 0 0.25cqw rgba(255,255,255,0.9),64cqw 73cqw 0 0.5cqw rgba(255,255,255,0.7),54cqw 85cqw 0 0.25cqw rgba(255,255,255,0.5),85cqw 23cqw 0 0.5cqw rgba(255,255,255,0.7),5cqw 89cqw 0 0.25cqw rgba(255,255,255,0.5),79cqw 9cqw 0 0.35cqw rgba(255,255,255,0.5),38cqw 64cqw 0 0.5cqw rgba(255,255,255,0.9),53cqw 95cqw 0 0.35cqw rgba(255,255,255,0.7),77cqw 60cqw 0 0.25cqw rgba(255,255,255,0.7),16cqw 8cqw 0 0.25cqw rgba(255,255,255,0.7),31cqw 37cqw 0 0.5cqw rgba(255,255,255,0.7),84cqw 113cqw 0 0.35cqw rgba(255,255,255,0.7),68cqw 110cqw 0 0.35cqw rgba(255,255,255,0.9),48cqw 72cqw 0 0.5cqw rgba(255,255,255,0.7),78cqw 33cqw 0 0.35cqw rgba(255,255,255,0.9),7cqw 113cqw 0 0.35cqw rgba(255,255,255,0.9),89cqw 93cqw 0 0.25cqw rgba(255,255,255,0.9),45cqw 73cqw 0 0.5cqw rgba(255,255,255,0.9),17cqw 95cqw 0 0.5cqw rgba(255,255,255,0.5),85cqw 110cqw 0 0.5cqw rgba(255,255,255,0.7),40cqw 19cqw 0 0.25cqw rgba(255,255,255,0.7),85cqw 65cqw 0 0.25cqw rgba(255,255,255,0.7),12cqw 56cqw 0 0.25cqw rgba(255,255,255,0.5),41cqw 58cqw 0 0.35cqw rgba(255,255,255,0.5),9cqw 81cqw 0 0.5cqw rgba(255,255,255,0.5),52cqw 95cqw 0 0.5cqw rgba(255,255,255,0.7),74cqw 116cqw 0 0.35cqw rgba(255,255,255,0.9),34cqw 8cqw 0 0.35cqw rgba(255,255,255,0.5),13cqw 17cqw 0 0.5cqw rgba(255,255,255,0.9),8cqw 125cqw 0 0.25cqw rgba(255,255,255,0.7);animation:tw 3s ease-in-out infinite alternate}
.ub-ray{position:absolute;left:50%;top:44%;width:150cqw;height:150cqw;margin:-75cqw 0 0 -75cqw;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,226,94,.5) 0 3deg,transparent 3deg 12deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 62%);mask:radial-gradient(circle,#000 0,transparent 62%);animation:ubrot 40s linear infinite}
@keyframes ubrot{to{transform:rotate(360deg)}}
.ub-em{position:absolute;left:50%;top:44%;width:86cqw;height:86cqw;margin:-43cqw 0 0 -43cqw;z-index:2;filter:drop-shadow(0 0 1.5cqw rgba(255,200,90,.9))}
.ub-em g{transform-box:view-box;transform-origin:50% 50%}
.ub-r1{animation:ubrot 18s linear infinite}.ub-r2{animation:ubrot 11s linear infinite}.ub-r3{animation:ubrot 13s linear infinite reverse}
.ub-core{position:absolute;left:50%;top:44%;width:16cqw;height:16cqw;margin:-8cqw 0 0 -8cqw;border-radius:50%;z-index:3;background:radial-gradient(circle,#fff 0 30%,rgba(255,226,140,.9) 55%,transparent 72%);box-shadow:0 0 6cqw 2cqw rgba(255,200,90,.9),0 0 16cqw 6cqw rgba(255,46,136,.5);animation:ubpl 2s ease-in-out infinite}
@keyframes ubpl{0%,100%{transform:scale(.85)}50%{transform:scale(1.15)}}
.ub-st{position:absolute;left:50%;top:44%;width:46cqw;height:46cqw;margin:-23cqw 0 0 -23cqw;z-index:4;filter:drop-shadow(0 0 2cqw #fff) drop-shadow(0 0 5cqw #FFB02E);animation:ubpl 2s ease-in-out infinite reverse}
.ub-fl{position:absolute;left:0;right:0;top:44%;height:.9cqw;margin-top:-.45cqw;z-index:4;background:linear-gradient(90deg,transparent,#8fd0ff 20%,#fff 50%,#8fd0ff 80%,transparent);box-shadow:0 0 3cqw 1cqw rgba(120,200,255,.8);animation:ubfl 3s ease-in-out infinite}
@keyframes ubfl{0%,100%{opacity:.25;transform:scaleX(.5)}50%{opacity:1;transform:scaleX(1)}}
.ub-n{position:absolute;left:0;right:0;bottom:17cqw;text-align:center;z-index:9}
.ub-n b{display:block;font:800 13cqw/1 'Unbounded';background:linear-gradient(180deg,#fff,#FFE45E 45%,#FFB02E 60%,#fff 80%);background-size:100% 300%;animation:ttlm 2.4s linear infinite;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 2cqw rgba(255,200,60,.9))}
.ub-n em{display:block;font:800 3.4cqw/1 'Be Vietnam Pro';font-style:normal;letter-spacing:.5em;margin-top:1.6cqw;color:#FFC1DB;text-shadow:0 0 3cqw #FF2E88}
'''
CP=r'''
.cp{width:690px;height:844px;overflow-y:auto;padding:16px 16px 20px;border-radius:22px;background:#1b1747;border:2px solid #363078;flex:none;scrollbar-width:thin;color:#F1F0FF}
.cp h3{margin:0;font:800 17px 'Unbounded';letter-spacing:-.3px}
.cpn{margin:5px 0 0;font-size:11px;font-weight:600;color:#A7A9E6;line-height:1.5}
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.cp .cs{padding:11px;border-radius:14px;background:#171340;border:2px solid #2c2766;min-width:0}
.cp .cs.w2{grid-column:1/3}
.cp .cl{font-size:10.5px;font-weight:800;letter-spacing:.12em;color:#A7A9E6;margin-bottom:8px;display:flex;gap:7px;align-items:center}
.cp .cl b{width:18px;height:18px;border-radius:50%;background:#FFB02E;color:#2A1400;display:grid;place-items:center;font-size:10px;letter-spacing:0;flex:none}
.cp .cpg{display:flex;gap:6px;flex-wrap:wrap}
.cp .kv{margin-bottom:8px;padding:8px 10px;border-radius:11px;background:#201C52}
.cp .kv small{display:block;font-size:9.5px;font-weight:800;letter-spacing:.12em;color:#A7A9E6}
.cp .kv b{display:block;font-size:13px;margin-top:2px}
.cp .kv span{display:block;font-size:11px;font-weight:600;color:#C7C6F5;margin-top:2px;line-height:1.4}
.cpb{padding:8px 11px;border-radius:11px;border:2px solid #363078;background:#201C52;color:#F1F0FF;font:800 11.5px 'Be Vietnam Pro';cursor:pointer}
.cpb:hover{border-color:#8F8FD0}.cpb.on{border-color:#FFB02E;background:rgba(255,176,46,.2)}
.cpb.gold{border-color:transparent;background:linear-gradient(100deg,#FFB02E,#FF6B57);color:#2A1400}
.cpb.red{border-color:#FF2E88;color:#FFC1DB}
.dchips{display:grid;grid-template-columns:repeat(12,1fr);gap:4px}
.dchips button{padding:6px 0;border-radius:10px;border:2px solid #363078;background:#201C52;color:#C7C6F5;font:800 10.5px/1.25 'Be Vietnam Pro';cursor:pointer;position:relative}
.dchips button.on{border-color:#fff;background:#3a3490;color:#fff}
.dchips button small{display:block;font-size:8.5px;opacity:.7}
.dchips button i{position:absolute;left:50%;bottom:2px;width:14px;height:3px;margin-left:-7px;border-radius:2px;background:var(--c)}
.cr{display:flex;align-items:center;gap:7px;padding:8px 9px;border-radius:12px;background:#201C52;border:2px solid #363078;margin-bottom:6px}
.cr .cpnm{flex:1;min-width:0;font-size:11.5px;font-weight:800}.cr .cpnm small{display:block;font-size:10px;color:#A7A9E6;margin-top:1px}
.cr .cpb{padding:6px 8px;font-size:10.5px}
.cpst{white-space:pre-line;font-size:11px;font-weight:700;color:#C7C6F5;line-height:1.6;background:#201C52;border-radius:12px;padding:9px 11px}
.cpchk>div{display:flex;gap:8px;align-items:flex-start;padding:5px 2px;font-size:11.5px;font-weight:700;color:#C7C6F5;line-height:1.4}
.cpchk i{font-style:normal;flex:none;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:900}
.cpchk .ok i{background:#35D0A5;color:#06281f}.cpchk .bad i{background:#FF2E88;color:#fff}.cpchk .bad{color:#FFC1DB}
.cplg div{font-size:11px;font-weight:600;color:#A7A9E6;padding:3px 0;border-top:1px dashed #2c2766}
'''

APPCSS+=r'''
/* ===== v11: thẻ app (pack thưởng), trao đổi với người kia ===== */
.apw{position:absolute;inset:0;display:grid;place-items:center}
.apk{position:absolute;inset:0;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 38%,#2a2466,#0d0b16 72%);border:2px solid var(--kc,#fff);box-shadow:0 0 22px var(--kc,#fff);display:grid;place-content:center;gap:8px;text-align:center}
.apk i{position:absolute;inset:-45%;background:conic-gradient(from 0deg,transparent,var(--kc,#fff) 9%,transparent 24%,transparent 50%,var(--kc,#fff) 59%,transparent 74%);opacity:.28;animation:spinr 9s linear infinite}
.apk b,.apk small{position:relative}
.apk b{font:800 20px 'Unbounded',sans-serif;letter-spacing:.14em;color:#fff}
.apk small{font-weight:900;letter-spacing:.2em;color:var(--kc,#fff);font-size:11px}
.aprc{display:flex;flex-wrap:wrap;gap:16px 10px;padding:16px 16px 8px;align-items:flex-end}
.gx{padding:2px 14px 4px;display:flex;flex-direction:column;gap:12px}
.gxl small{display:block;font-weight:800;font-size:11px;letter-spacing:.05em;color:var(--soft);margin-bottom:6px}
.gxr{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1.5px solid var(--line);border-radius:14px;background:var(--paper);margin-bottom:6px}
.gxr.ho{border-color:#ff5db6;box-shadow:0 0 0 1px rgba(255,93,182,.25)}
.gxr img{width:34px;height:44px;border-radius:7px;object-fit:cover;flex:none}
.gxr span{flex:1;min-width:0;display:flex;flex-direction:column}
.gxr b{font-size:13px;color:var(--ink)}
.gxr em{font-style:normal;font-size:11px;font-weight:700;color:var(--soft)}
.gxb{flex:none;padding:8px 16px;border-radius:99px;border:0;background:linear-gradient(100deg,#ff2e88,#ff7a59);color:#fff;font-weight:900;font-size:12px;cursor:pointer;box-shadow:0 6px 14px rgba(255,46,136,.35)}
.gxms{display:flex;flex-wrap:wrap;gap:6px}
.gxm{padding:7px 10px;border-radius:99px;border:1.5px dashed var(--line);background:transparent;color:var(--ink);font-weight:800;font-size:11.5px;cursor:pointer;display:inline-flex;gap:5px;align-items:center}
.gxm i{font-style:normal;font-weight:700;color:var(--soft);font-size:10.5px}
.gxm b{padding:2px 8px;border-radius:99px;background:var(--ink);color:var(--paper);font-size:10.5px}
.gxm.ho{border-color:#ff5db6}
.gxm.sent{border-style:solid;border-color:#35D0A5}.gxm.sent b{background:#35D0A5;color:#06281f}
.gxe{font-size:12px;font-weight:700;color:var(--soft);padding:2px 2px 4px}
.gfc{display:flex;align-items:center;gap:12px;width:calc(100% - 28px);margin:12px 14px 0;padding:12px 14px;border-radius:18px;border:0;text-align:left;cursor:pointer;color:#fff;background:linear-gradient(100deg,#8b5cff,#ff2e88);box-shadow:0 10px 24px rgba(139,92,255,.4);position:relative;overflow:hidden}
.gfc:after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);transform:translateX(-120%);animation:gfs 2.6s ease-in-out infinite}
@keyframes gfs{to{transform:translateX(120%)}}
.gfc svg{width:26px;height:26px;flex:none}
.gfc span{flex:1;min-width:0;display:flex;flex-direction:column}
.gfc b{font-size:14px}.gfc small{font-size:11.5px;font-weight:700;opacity:.9}
.gfc em{font-style:normal;font-weight:900;font-size:12px;padding:7px 13px;border-radius:99px;background:#fff;color:#7b3cff;flex:none}
'''
APPCSS+=r'''
#col .fl{gap:5px}#col .fl .chip{padding:8px 9px;font-size:11px}
'''
APPCSS+=r'''
.rapp .slot.lk{cursor:pointer}
.dlk{display:none}.df.lkd .dlk{display:grid;position:absolute;inset:0;place-items:center;color:#fff;z-index:6}
.df.lkd .dlk svg{width:54px;height:54px;filter:drop-shadow(0 4px 14px rgba(0,0,0,.6))}
.df.lkd .dff{filter:grayscale(1) brightness(.38)}.df.lkd .dlk{filter:none}
.vbtns{flex-wrap:wrap;justify-content:center;gap:8px}
.vgive,.vask{display:inline-flex;gap:6px;align-items:center;padding:9px 16px;border-radius:99px;border:0;font-weight:900;font-size:12.5px;color:#fff;cursor:pointer;background:linear-gradient(100deg,#ff2e88,#ff7a59);box-shadow:0 8px 20px rgba(255,46,136,.4)}
.vask{background:linear-gradient(100deg,#8b5cff,#4cc9ff);box-shadow:0 8px 20px rgba(139,92,255,.4)}
.vask.sent{background:rgba(255,255,255,.14);box-shadow:none;border:1.5px solid #35D0A5;color:#7ff0cf}
.vgive svg,.vask svg{width:16px;height:16px}
.vhint{margin-top:10px;font-size:11.5px;font-weight:700;color:rgba(255,255,255,.65);text-align:center}
.vhint.vpq{color:#ffc1db;font-weight:900}
'''
APPCSS+=r'''
.whol{display:flex;flex-direction:column;gap:8px;margin:14px 0 4px}
.wr{display:flex;align-items:center;gap:12px;width:100%;padding:11px 12px;border-radius:16px;border:2px solid var(--line);background:var(--paper);text-align:left;cursor:pointer;color:var(--ink)}
.wr.on{border-color:#ff2e88;box-shadow:0 0 0 3px rgba(255,46,136,.18)}
.wr.dis{opacity:.5;cursor:default}
.wav{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:13px;color:#1a0b00;background:var(--a)}
.wnm{flex:1;min-width:0;display:flex;flex-direction:column}.wnm b{font-size:14px}.wnm small{font-size:11.5px;font-weight:700;color:var(--soft)}
.wck{flex:none;width:26px;height:26px;border-radius:8px;border:2px solid var(--line);display:grid;place-items:center;font-weight:900;font-size:15px;color:#fff}
.wr.on .wck{background:#ff2e88;border-color:#ff2e88}
.igo.off{opacity:.45;box-shadow:none}

.rapp .toast{top:calc(env(safe-area-inset-top,0px) + 64px);bottom:auto;transform:translate(-50%,-18px);z-index:200}
.rapp .toast.on{transform:translate(-50%,0)}
#col .kmprz.can,#col .kmprz.lk{min-height:262px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 8px}
.rapp .cntxt{bottom:0;padding:70px 22px 22px;background:linear-gradient(to top,rgba(2,1,8,.96) 58%,rgba(2,1,8,0));z-index:7}
.ugskip{position:absolute;right:14px;top:calc(env(safe-area-inset-top,0px) + 16px);z-index:9;padding:7px 14px;border-radius:99px;background:rgba(255,255,255,.16);color:#fff;font:800 12px 'Plus Jakarta Sans',system-ui,sans-serif;border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(6px);animation:ugskf .4s 1s both}
.cnx.skp .ugskip{display:none}
.cnx.skp *{animation-duration:.01s !important;animation-delay:0s !important}
@keyframes ugskf{from{opacity:0}to{opacity:1}}
.sgx.skp .ugskip{display:none}
.sgx.skp *{animation-duration:.01s !important;animation-delay:0s !important}
.cnbar.b{display:none}.cnx.skp .cnbar{display:none}
.ugskip{z-index:30;font-size:13px;padding:8px 16px;background:rgba(0,0,0,.55)}

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
