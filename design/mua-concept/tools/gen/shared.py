from lib import *
def _load(fn,stop,skip=()):
    src=open(fn,encoding='utf-8').read(); src=src[:src.index(stop)]
    for s in skip: src=src.replace(s,'')
    exec(src,globals())
_load('b3.py',"body=f'''<div style=\"padding:30px 36px\">")
EX3=extra
_load('b4.py',"body=f'''<div style=\"padding:30px 36px;width:1500px\">",("from b3 import ultra, extra as EX3","from ub import UBCSS, back_u2"))
EX4=extra
# b6 css (stage / vinyl)
_s=open('b6.py',encoding='utf-8').read()
_a=_s.index("css=EX3+r'''")+len("css=EX3+r'''"); _b=_s.index("'''\neq=")
EX6=_s[_a:_b]
