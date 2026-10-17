from PIL import Image, ImageFilter, ImageChops
import numpy as np
U='/root/.claude/uploads/416de534-d838-563f-a6b2-7164a832bafe/'
# ---- Spotify codes
codes={'mt':'dcaf3cb2','jh':'b739f616','kh':'4771bea2','sh':'d7b6ce1d','jm':'400059ba'}
for k,f in codes.items():
    im=Image.open(U+f+'-image.png').convert('RGB'); a=np.array(im).astype(int)
    # pink band: r>180,g<130,b<140 in lower area
    m=(a[:,:,0]>170)&(a[:,:,1]<130)&(a[:,:,2]<140)&(a[:,:,0]-a[:,:,1]>70)
    ys,xs=np.where(m); 
    y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    print(k,x0,x1,y0,y1)
    im.crop((x0,y0,x1+1,y1+1)).save(f'assets/sp_{k}.png')
# ---- signatures
S=Image.open(U+'a5476724-image.png').convert('L')
boxes={'mt':(30,10,350,205),'jm':(420,5,700,205),'jh':(10,300,350,435),'sh':(410,255,735,440),'kh':(55,480,350,655)}
white_label={'jh':[(120,428,270,460)],'sh':[(510,372,736,415)],'kh':[(200,640,350,700)],'mt':[],'jm':[]}
for k,b in boxes.items():
    im=S.copy().convert('L')
    arr=np.array(im)
    for (x0,y0,x1,y1) in white_label[k]: arr[y0:y1,x0:x1]=255
    c=arr[b[1]:b[3],b[0]:b[2]]
    h,w=c.shape
    big=Image.fromarray(c).resize((w*4,h*4),Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.1))
    g=np.array(big).astype(float)
    alpha=np.clip((200-g)/(200-70),0,1)  # sharpen levels
    alpha=alpha**0.85
    ys,xs=np.where(alpha>0.12)
    pad=20
    box=(max(xs.min()-pad,0),max(ys.min()-pad,0),min(xs.max()+pad,alpha.shape[1]),min(ys.max()+pad,alpha.shape[0]))
    alpha=alpha[box[1]:box[3],box[0]:box[2]]
    rgba=np.zeros(alpha.shape+(4,),dtype=np.uint8); rgba[:,:,0]=0x1E;rgba[:,:,1]=0x1B;rgba[:,:,2]=0x5E;rgba[:,:,3]=(alpha*255).astype(np.uint8)
    o=Image.fromarray(rgba,'RGBA'); o.thumbnail((700,700),Image.LANCZOS); o.save(f'assets/sg_{k}.png',optimize=True)
    print(k,o.size)
# preview sheet
sheet=Image.new('RGB',(1500,420),(240,236,255)); x=10
for k in boxes:
    o=Image.open(f'assets/sg_{k}.png'); sheet.paste(o,(x,10),o); x+=o.width+10
sheet.save('assets/prev_sig.png')
sp=Image.new('RGB',(1500,170),(21,18,59)); x=5
for k in codes:
    o=Image.open(f'assets/sp_{k}.png');o.thumbnail((290,150));sp.paste(o,(x,10));x+=o.width+10
sp.save('assets/prev_sp.png')
