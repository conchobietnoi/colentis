import re
j=open('b10_js.js',encoding='utf-8').read()
j=j.replace("if (all) set({ fx: 'uget' });","if (all) set({ fx: 'uget', ugSk: false });")
j=j.replace("fx: 'uget', day: Math.max(x.day, 7) });","fx: 'uget', ugSk: false, day: Math.max(x.day, 7) });")
j=j.replace("setTimeout(function () { set({ fx: 'uget' }); }, 80);","setTimeout(function () { set({ fx: 'uget', ugSk: false }); }, 80);")
j=j.replace("ugv: 5, ugm: true,","ugv: 5, ugSk: false, ugm: true,")
j=j.replace("V.closeFx = function () { set({ fx: '', tearing: false }); };","V.closeFx = function () { set({ fx: '', tearing: false, ugSk: false }); };\n    V.ugSkip = function () { set({ ugSk: true }); };")
j=j.replace("toast: s.toast, toastCls:","skCls: s.ugSk ? 'skp' : '', toast: s.toast, toastCls:")
open('b10_js.js','w',encoding='utf-8').write(j)
p=open('b10.py',encoding='utf-8').read()
n=p.count('<div class="kmfx on cnx">')
p=p.replace('<div class="kmfx on cnx">','<div class="kmfx on cnx {{skCls}}"><button class="ugskip" onClick="{{ugSkip}}">Bỏ qua ›</button>')
print(n)
open('b10.py','w',encoding='utf-8').write(p)
c=open('b10css.py',encoding='utf-8').read()
add='''
.rapp .toast{top:calc(env(safe-area-inset-top,0px) + 64px);bottom:auto;transform:translate(-50%,-18px);z-index:200}
.rapp .toast.on{transform:translate(-50%,0)}
#col .kmprz.can,#col .kmprz.lk{min-height:262px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 8px}
.rapp .cntxt{bottom:0;padding:70px 22px 22px;background:linear-gradient(to top,rgba(2,1,8,.96) 58%,rgba(2,1,8,0));z-index:7}
.ugskip{position:absolute;right:14px;top:calc(env(safe-area-inset-top,0px) + 16px);z-index:9;padding:7px 14px;border-radius:99px;background:rgba(255,255,255,.16);color:#fff;font:800 12px 'Plus Jakarta Sans',system-ui,sans-serif;border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(6px);animation:ugskf .4s 1s both}
.cnx.skp .ugskip{display:none}
.cnx.skp *{animation-duration:.01s !important;animation-delay:0s !important}
@keyframes ugskf{from{opacity:0}to{opacity:1}}
'''
i=c.rfind("'''")
c=c[:i]+add+c[i:]
open('b10css.py','w',encoding='utf-8').write(c)
