/* ===== Mùa Concept: lớp giao diện bám sát design/mua-concept/boards/AppBuild.dc.html =====
   Mẫu giao diện (CXT, tệp _06g) và CSS (concept.css) được sinh nguyên văn từ bản thiết kế.
   Mọi kết quả (nhiệm vụ, mở pack, mở khóa, tặng/xin thẻ, khóa nhạc) do server quyết định qua API.cx*. */
const CXN={
 1:{n:'Urichinguchana',a:'#FFB02E',b:'#FFE3B0',ar:3200/872,week:'CHẶNG 1 · 18–20/10',open:'18/10'},
 2:{n:'Aniyaaa',a:'#FF2E88',b:'#FFC1DB',ar:3200/534,week:'CHẶNG 2 · 21–23/10',open:'21/10'},
 3:{n:'Poyoyoi',a:'#4CC9FF',b:'#C7EEFF',ar:3200/1023,week:'CHẶNG 3 · 24–26/10',open:'24/10'}};
const CXTASKS=[null,
 {t:'Rạng Sáng',d:'Hoàn thành 1 việc bất kỳ trong hôm nay.'},{t:'Nhà Của Mình',d:'Hoàn thành 1 việc nhà.'},
 {t:'Khởi Động Tuần',d:'Lên lịch ít nhất 1 việc cho ngày mai.'},{t:'Gửi Yêu Thương',d:'Hoàn thành 1 việc dành cho người khác.'},
 {t:'Xếp Hình Giờ Giấc',d:'Gắn giờ cho 1 việc bất kỳ.'},{t:'Cú Đêm',d:'Hoàn thành 1 việc sau 21 giờ.'},
 {t:'Dọn Nhà Cuối Tuần',d:'Hoàn thành 1 việc nhà.'},{t:'Chốt Sổ',d:'Hoàn thành 3 việc trong hôm nay.'},
 {t:'Cả Nhà Cùng Làm',d:'Hoàn thành 1 việc chung.'}];
const CXSONGS=[{t:'GO!',c:'#ffb02e',len:'3:06'},{t:'TNT',c:'#35d0a5',len:'3:04'},{t:'FaSHioN',c:'#ff2e88',len:'2:59'},
 {t:'JoyRide',c:'#4cc9ff',len:'2:38'},{t:'REDRED',c:'#ff2e4e',len:'3:28'},{t:'ACAI',c:'#8b5cff',len:'2:54'},{t:'Blue Lips',c:'#4cc9ff',len:'2:22'}];
const CXMEM=['JAMES','JUHOON','KEONHO','MARTIN','SEONGHYEON'];
const CXWDL=['Thứ Bảy','Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư'];
const CXRAR={common:{n:'Thường',tag:'THƯỜNG',a:'#8D94B8'},rare:{n:'Hiếm',tag:'HIẾM',a:'#2F8CFF'},legend:{n:'Huyền Thoại',tag:'HUYỀN THOẠI',a:'#9B5CFF'},supreme:{n:'Bá khí',tag:'BÁ KHÍ',a:'#FF2E88'}};
const CXPAL=['#4CC9FF','#FFE45E','#FF7AB8','#35D0A5','#B9A4FF','#FF9A5C'];
const CX={s:null,people:null,sg:{},ver:0,vv:-1,V:null,H:{},busy:false,loaded:false,
 u:{pg:'',fx:'',sheet:'',colCon:5,drawn:[],idx:0,detail:null,flipped:false,tearing:false,uc:1,u:1,sel:[0,4],disc:'A',paused:false,ust:'idle',pan:18,ugSk:false,ugm:true,ugs:30,who:'',ws:{},queue:[],last:null}};
const cxE=v=>v==null?'':String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cxR=v=>v==null?'':String(v);
const cxCl=o=>JSON.parse(JSON.stringify(o));

/* ----- bộ biên dịch mẫu {{x}} / <sc-if> / <sc-for> của bản thiết kế ----- */
const CXC={};
function cxCompile(name){
 if(CXC[name])return CXC[name];
 let src=CXT[name];if(src==null)return ()=>'';
 src=src.split('<!--BK-->').join(CXT.bks);
 const parts=src.split(/(<sc-if\b[^>]*>|<\/sc-if>|<sc-for\b[^>]*>|<\/sc-for>)/),loops=[];
 let code='let o="";\n';
 const ref=p=>loops.indexOf(p.split('.')[0])>=0?p:'V.'+p;
 for(const part of parts){
  let m;
  if(/^<sc-if\b/.test(part)){m=part.match(/value="\{\{([\w.]+)\}\}"/);code+='if('+ref(m[1])+'){\n'}
  else if(part==='</sc-if>')code+='}\n';
  else if(/^<sc-for\b/.test(part)){m=part.match(/list="\{\{([\w.]+)\}\}"/);const as=part.match(/\bas="(\w+)"/)[1];code+='for(const '+as+' of ('+ref(m[1])+'||[])){\n';loops.push(as)}
  else if(part==='</sc-for>'){code+='}\n';loops.pop()}
  else if(part){
   const t=part.replace(/\sonClick="\{\{(\w+)\}\}"/g,' data-cx="$1"').replace(/\sonInput="\{\{(\w+)\}\}"/g,' data-cxi="$1"');
   const bits=t.split(/\{\{(&?)([\w.]+)\}\}/);
   for(let i=0;i<bits.length;i+=3){
    if(bits[i])code+='o+='+JSON.stringify(bits[i])+';\n';
    if(i+2<bits.length)code+='o+='+(bits[i+1]?'R':'E')+'('+ref(bits[i+2])+');\n'}}}
 code+='return o';
 return CXC[name]=new Function('V','E','R',code);
}
function cxTpl(name,V){return cxCompile(name)(V,cxE,cxR)}

/* ----- cập nhật DOM tại chỗ (giữ nguyên hoạt ảnh của các phần tử không đổi) ----- */
function cxAttrs(x,y){
 for(const a of [...x.attributes])if(!y.hasAttribute(a.name))x.removeAttribute(a.name);
 for(const a of [...y.attributes])if(x.getAttribute(a.name)!==a.value)x.setAttribute(a.name,a.value);
 if(x.tagName==='INPUT'&&x.type==='range'&&document.activeElement!==x)x.value=y.getAttribute('value')}
function cxKids(a,b){
 const A=[...a.childNodes],B=[...b.childNodes];
 for(let i=0;i<B.length;i++){const x=A[i],y=B[i];
  if(!x){a.appendChild(y);continue}
  if(x.nodeType!==y.nodeType||(x.nodeType===1&&x.tagName!==y.tagName)){a.replaceChild(y,x);continue}
  if(x.nodeType!==1){if(x.nodeValue!==y.nodeValue)x.nodeValue=y.nodeValue;continue}
  cxAttrs(x,y);
  if(x.tagName==='VIDEO')continue;
  cxKids(x,y)}
 while(a.childNodes.length>B.length)a.removeChild(a.lastChild)}
function cxMorph(host,html){const t=document.createElement('template');t.innerHTML=html;cxKids(host,t.content)}

/* ----- trạng thái từ server ----- */
const cxOn=()=>!!(CX.s&&CX.s.today);
function cxDay(){if(!cxOn())return 0;const[y,m,d]=CX.s.today.split('-').map(Number);return Math.round((Date.UTC(y,m-1,d)-Date.UTC(2026,9,17))/864e5)}
const cxLive=()=>cxOn()&&cxDay()>=1;
const cxDayCon=d=>d>=1&&d<=3?1:d>=4&&d<=6?2:d>=7&&d<=9?3:0;
const cxOpenN=d=>d>=7?3:d>=4?2:d>=1?1:0;
function cxOwned(){const o={};((CX.s&&CX.s.cards)||[]).forEach(c=>{o[c.con+(c.holo?'h':'n')+c.slot]=c.count});return o}
const cxCnt=(o,c,h)=>{let n=0;for(let i=0;i<5;i++)if(o[c+(h?'h':'n')+i])n++;return n};
const cxKey=d=>d?d.con+(d.holo?'h':'n')+d.slot:'';
const cxNm=k=>CXMEM[Number(k.slice(2))]+(k.charAt(1)==='h'?' (holo)':'');
const cxFmt=x=>{x=Math.floor(x||0);return Math.floor(x/60)+':'+('0'+(x%60)).slice(-2)};
const cxIdx=e=>{const t=e&&e.target,el=t&&t.closest?t.closest('[data-i]'):null;return el?Number(el.getAttribute('data-i')):0};
function cxPeople(){return (CX.people||[]).map((p,i)=>({id:p.id,n:p.name,ini:initials(p.name),a:CXPAL[i%CXPAL.length]}))}
const cxPName=id=>{const p=(CX.people||[]).find(x=>x.id===id);return p?p.name:''};

/* ----- ảnh/video/nhạc trong bucket riêng tư `concept` ----- */
function cxImg(path){
 const u=RAW.imgNow('concept',path);if(u!==RAW.BLANK)return u;
 if(!CX['l:'+path]){CX['l:'+path]=1;RAW.loadImg('concept',path).then(()=>{CX.ver++;cxHydrate()}).catch(()=>{CX['l:'+path]=0})}
 return RAW.BLANK+'#cx='+path}
/* ảnh chưa tải mang đuôi #cx=đường-dẫn; tải xong thì thay src/style tại chỗ (không dựng lại giao diện) */
function cxHydrate(){
 document.querySelectorAll('img[src*="#cx="]').forEach(i=>{const p=i.getAttribute('src').split('#cx=')[1],u=RAW.imgNow('concept',p);if(u!==RAW.BLANK)i.setAttribute('src',u)});
 document.querySelectorAll('[style*="#cx="]').forEach(e=>{e.setAttribute('style',e.getAttribute('style').replace(/data:image\/gif;base64,[^)"'#\s]*#cx=([^)"'\s]+)/g,(m,p)=>{const u=RAW.imgNow('concept',p);return u!==RAW.BLANK?u:m}))})}
let cxHydT=0;
{const ap=document.getElementById('app');if(ap)new MutationObserver(()=>{if(cxHydT)return;cxHydT=requestAnimationFrame(()=>{cxHydT=0;cxHydrate()})}).observe(ap,{childList:true,subtree:true})}
const cxCard=(c,s)=>cxImg('c'+c+'-'+s+'.webp');
/* tải sẵn bài vào bộ nhớ (blob) để tua/phát tức thì, không phải chờ mạng lúc hiệu ứng Ultra */
function cxWarm(k){if(CX.bl&&CX.bl[k])return Promise.resolve(CX.bl[k]);if(CX['w:'+k])return CX['w:'+k];
 const p=cxSign([k]).then(()=>fetch(CX.sg[k])).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>{CX.bl=CX.bl||{};return CX.bl[k]=URL.createObjectURL(b)}).catch(()=>{CX['w:'+k]=0;return ''});
 CX['w:'+k]=p;return p}
async function cxSign(paths){
 let ch=false;
 await Promise.all(paths.map(async p=>{if(CX.sg[p])return;try{CX.sg[p]=await API.cxSigned(p);ch=true}catch(e){}}));
 if(ch){CX.ver++;cxPaint()}}

/* ----- tải/làm mới trạng thái ----- */
async function cxReload(){
 try{CX.s=await API.cxState();CX.loaded=true}catch(e){CX.s=CX.s||null}
 CX.ver++;if(CX.s&&(CX.s.unlocks||[]).length>=2)cxPrefetch('songs/0.m4a')}
async function cxEnsurePeople(){if(CX.people)return;try{CX.people=await API.cxPeople()}catch(e){CX.people=[]}}
async function cxCall(p){try{return await p}catch(e){apiFail(e);return null}}

/* ----- vẽ lại ----- */
function cxPaint(){
 const host=$('#cx');if(!host||!cxOn())return;
 const u=CX.u,V=cxV();let h='';
 if(u.pg==='hub')h+=cxTpl('hub',V);else if(u.pg==='det')h+=cxTpl('det',V);else if(u.pg==='pano')h+=cxTpl('pano',V);else if(u.pg==='ucard')h+=cxTpl('ucard',V);
 if(u.sheet==='songs')h+=cxTpl('songs',V);else if(u.sheet==='who')h+=cxTpl('who',V);
 if(u.fx==='pack')h+=cxTpl('pack',V);else if(u.fx==='reveal')h+=cxTpl('rv',V);else if(u.fx==='unlock')h+=cxTpl('unlock',V);else if(u.fx==='uget')h+=cxTpl('uget',V);
 cxMorph(host,h);
 host.classList.toggle('on',!!h);
 try{observeCards()}catch(e){}
 cxUgWatch()}
function cxRefreshAll(){try{renderAll()}catch(e){}cxPaint()}
function cxTouch(){CX.ver++;cxRefreshAll()}
function cxSet(p){Object.assign(CX.u,p);CX.ver++;cxPaint()}
function cxSetAll(p){Object.assign(CX.u,p);CX.ver++;cxRefreshAll()}
const cxFlash=m=>toast(m);

/* ===== view-model (cổng vào của mẫu) ===== */
function cxV(){if(CX.vv===CX.ver&&CX.V)return CX.V;CX.V=cxBuild();CX.vv=CX.ver;return CX.V}
function cxBuild(){
 const s=CX.s,u=CX.u,H=CX.H={},V={};
 const owned=cxOwned(),cel={},done={};(s.unlocks||[]).forEach(c=>cel[c]=1);(s.ticks||[]).forEach(d=>done[d]=1);
 const ult={};(s.ultra||[]).forEach(x=>{ult[x.n]=x.songs});
 const day=cxDay(),packs=s.packs||[],celN=(cel[1]?1:0)+(cel[2]?1:0)+(cel[3]?1:0),allCel=celN===3;
 const dc=cxDayCon(day),openC=cxOpenN(day),live=day>=1&&day<=9,taskDone=!!done[day];
 const task=live?CXTASKS[day]:{t:'Ngoài thời gian sự kiện',d:day<1?'Sự kiện bắt đầu 18/10.':'Sự kiện đã kết thúc 26/10.'};
 const dayA=live?(dc?CXN[dc].a:'#FFE45E'):'#C9CEF5',pn=packs.length;
 let firstIncomplete=1;for(let q=1;q<=3;q++){if(q<=Math.max(openC,1)&&cxCnt(owned,q)<5){firstIncomplete=q;break}}
 const ptc=cxPeople();

 /* ---- banner ---- */
 let bt='',bsub='';const nxt=live&&dc?CXN[dc].n:'';
 if(day<1){bt='Sắp diễn ra';bsub='Bắt đầu 18/10'}else if(day>9){bt='Đã kết thúc';bsub='Bộ sưu tập của bạn được giữ nguyên'}
 else if(allCel&&!(ult[1]&&ult[2])){bt='Đủ 3/3 concept';bsub=(ult[1]||ult[2])?'Còn 1 thẻ Ultra đang chờ bạn':'Thẻ Ultra đang chờ bạn'}
 else if(allCel){bt='Đủ 3/3 concept';bsub='Đã nhận 2 thẻ Ultra · nghe nhạc ở Bộ sưu tập'}
 else if(pn>0){bt=pn+' pack đang chờ';bsub='Chạm để vào sự kiện và mở pack'}
 else if(taskDone){bt='Hôm nay xong rồi';bsub='Đủ '+celN+'/3 concept · hẹn bạn ngày mai'}
 else{bt=nxt;bsub='Nhiệm vụ: '+task.t}
 const bcol=dc?CXN[dc].a:(day>9?'#8F8FD0':'#FFE45E');
 V.bnBg='linear-gradient(120deg,#0d1030,#3a2a8a 50%,'+(day<1?'#8b5cff':bcol)+')';
 V.bnKick=live?'MÙA CONCEPT · NGÀY '+day+'/9':'MÙA CONCEPT';V.bnC=live&&dc?CXN[dc].a:'#FFE45E';
 V.bnPano=cxImg('pano-'+(dc||(day>9?3:1))+'.webp');
 V.bnDays=[];for(let bd=1;bd<=9;bd++){const c=cxDayCon(bd);V.bnDays.push({cls:done[bd]?'on':(bd===day?'now':''),c:c?CXN[c].a:'#FFE45E'})}
 V.bnCons=[1,2,3].map(c=>{const ok=!!cel[c];return {a:CXN[c].a,img:cxCard(c,c+1),cls:ok?'ok':(c>openC?'lk':''),mk:ok?'✓':cxCnt(owned,c)+'/5'}});
 V.bnPd=pn>0?'grid':'none';V.bnPk='+'+pn;V.bnTitle=bt;V.bnSub=bsub;
 H.bnGo=()=>{if(cxDay()<1){cxFlash('Sự kiện bắt đầu 18/10');return}cxSet({pg:'hub',fx:'',sheet:''})};

 /* ---- nhiệm vụ / Hôm nay ---- */
 V.dayA=dayA;V.evTask=live;V.tkOn=taskDone?'d':'';const tk=CX.s.task||{need:1,have:0},tkOk=tk.have>=tk.need;V.taskT=task.t;V.taskD=taskDone?task.d:task.d+(tkOk?' · Đã đủ, chạm để nhận thưởng':' · Tiến độ '+tk.have+'/'+tk.need+' (làm thật trong Lịch rồi quay lại nhận)');
 V.hasPacks=pn>0;V.packN=pn;V.celN=celN;
 H.tick=async()=>{
  if(!live){cxFlash('Ngoài thời gian sự kiện');return}
  if(taskDone){cxFlash('Hôm nay đã xong rồi');return}
  if(!tkOk){cxFlash('Chưa đủ: '+task.d+' ('+tk.have+'/'+tk.need+')');return}
  if(CX.busy)return;CX.busy=true;
  const r=await cxCall(API.cxTick());CX.busy=false;
  if(r){CX.s=r;cxTouch();cxFlash('Xong nhiệm vụ · nhận 2 pack')}};
 H.openPack=()=>{if(!(CX.s.packs||[]).length){cxFlash('Chưa có pack nào để mở');return}cxSet({pg:'',sheet:'',fx:'pack',tearing:false})};

 /* ---- trang sự kiện ---- */
 V.hubTag=live?'NHIỆM VỤ HÔM NAY · '+CXN[dc].n.toUpperCase():'NHIỆM VỤ';
 V.hubDone=live&&taskDone;V.hubOpen=live&&!taskDone;
 V.concs=[1,2,3].map(c=>{const n=cxCnt(owned,c),h=cxCnt(owned,c,true),lk=c>openC,ok=n===5;
  return {i:c,a:CXN[c].a,n:CXN[c].n,week:lk?'MỞ '+CXN[c].open:CXN[c].week,cls:ok?'hgot':(lk?'hlk':(c===dc?'hnow':'')),
   line:lk?'Chưa mở':(ok?'Đủ bộ · '+h+'/5 holo':n+'/5 thường · '+h+'/5 holo'),v:'',img:cxCard(c,c+1),p:n/5*100,st:lk?'Mở '+CXN[c].open:(ok?'Đủ bộ ✓':n+'/5 thẻ')}});
 V.hubWhen=live?'18–26/10 · ngày '+day+'/9':(day<1?'18–26/10 · chưa bắt đầu':'18–26/10 · đã kết thúc');
 V.tdays=[];for(let t=1;t<=9;t++){const tc=cxDayCon(t);let cl='';if(done[t])cl='done';else if(t===day)cl='today';else if(t<day)cl='miss';V.tdays.push({d:17+t,cls:cl,c:tc?CXN[tc].a:'#FFE45E'})}
 const ultN=(ult[1]?1:0)+(ult[2]?1:0);V.ultSt1=!allCel;V.ultSt2=allCel&&ultN<2;V.ultLeftTxt=ultN===1?'Còn 1 thẻ Ultra đang chờ bạn':'2 thẻ Ultra đang chờ bạn';
 H.hubCal=()=>{cxSet({pg:''});go('cal')};
 H.openCon=e=>{CX.u.pg='';CX.u.colCon=cxIdx(e);go('col');cxSetAll({})};
 H.closePg=()=>{cxStopAudio();cxSet({pg:'',ust:'idle',flipped:false})};

 /* ---- mở pack ---- */
 const pk0=packs[0]||{con:1,kind:'daily'};const pcon=pk0.con||firstIncomplete;
 V.pkA=CXN[pcon].a;V.pkPick=false;
 for(let k=1;k<=3;k++){V['pc'+k]=pcon===k?'on':'';V['pk'+k+'d']=pcon===k&&pk0.kind!=='bonus';V['pk'+k+'b']=pcon===k&&pk0.kind==='bonus'}
 V.pkLabel=pk0.kind==='bonus'?'Pack thưởng · hoàn thành concept':'Pack '+CXN[pcon].n+' · còn '+pn;
 V.pkSub=pk0.kind==='bonus'?'5 thẻ app · Thường 70% · Hiếm 22% · Huyền Thoại 7% · Bá khí 1%':'5 thẻ · thường 16% mỗi thẻ, holo 4% mỗi thẻ';
 V.trCls=u.tearing?'go':'';V.tearTxt=u.tearing?'Đang xé…':'Chạm để xé pack';
 H.pickC=()=>{};
 H.tear=()=>{if(CX.u.tearing||!(CX.s.packs||[]).length)return;cxOpenPack()};
 H.closeFx=()=>cxSet({fx:'',tearing:false,ugSk:false});
 H.ugSkip=()=>cxSet({ugSk:true});
 V.skCls=u.ugSk?'skp':'';

 /* ---- xem thẻ (reveal + chi tiết) ---- */
 const isReveal=u.fx==='reveal';
 let cur=isReveal?(u.drawn[u.idx]||u.drawn[0]):u.detail;
 cur=cur||{con:1,slot:0,holo:false,isNew:true,count:1};
 const isApp=!!cur.app,RA=isApp?CXRAR[cur.r]||CXRAR.common:null,cc=CXN[cur.con]||CXN[1];
 V.shA=cc.a;V.cImg=cxCard(cur.con||1,cur.slot||0);V.cName=CXMEM[cur.slot||0];V.cNo=('0'+((cur.slot||0)+1)).slice(-2);
 V.cConUp=cc.n.toUpperCase();V.cConName=cc.n;V.cVars='--a:'+cc.a+';--b:'+cc.b;
 V.showNorm=!cur.holo&&!isApp;V.showHolo=!!cur.holo&&!isApp;V.showApp=isApp;V.bkApp=isApp;
 for(let c=1;c<=3;c++)for(let b=0;b<5;b++){V['bk_'+c+'_n_'+b]=cur.con===c&&cur.slot===b&&!cur.holo&&!isApp;V['bk_'+c+'_h_'+b]=cur.con===c&&cur.slot===b&&!!cur.holo&&!isApp}
 for(let c=1;c<=3;c++)V['pano'+c]=cxImg('pano-'+c+'.webp');
 const first=((s.cards||[]).find(c=>c.con===cur.con&&c.slot===cur.slot&&!!c.holo===!!cur.holo)||{}).first_at;
 V.gotDate=first?new Date(first).toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'.'):cxFmtToday();
 V.shNo=u.idx+1;V.shTot=(u.drawn&&u.drawn.length)||5;V.shKind=isApp?RA.tag:(cur.holo?'HOLO':'THƯỜNG');V.shLabel=isApp?'Thẻ '+RA.n:(cur.holo?'Thẻ holo':'Thẻ thường');
 const hiR=isApp&&cur.r!=='common';
 V.rvTxt=isApp?(cur.r==='supreme'?'BÁ KHÍ!':cur.r==='legend'?'HUYỀN THOẠI!':'HIẾM!'):'HOLO!';
 V.appFront='';V.appBack='';V.dfSt='';V.appVars='';
 if(isApp){
  const cd=cur.card;V.shA=RA.a;V.cName=cd?cd.name:'Thẻ app';V.cConName='thẻ app';
  const ar=cd?cd.ar:0.74;V.dfSt='height:'+Math.round(237.5/ar+12.5)+'px';
  V.appFront=cd?'<div class="apw">'+cardHTML(cd,{w:250})+'</div>':'';
  V.appBack='<div class="apk"><i></i><b>COLENTIS</b><small>'+RA.tag+'</small></div>'}
 V.flipCls=u.flipped?'on':'';V.popCls='p'+(u.idx%2);
 V.rvCls=(cur.holo||hiR?'holo ':'')+(isReveal&&cur.isNew?'nw ':'')+'p'+(u.idx%2);
 H.flipCard=()=>cxSet({flipped:!CX.u.flipped});
 const own1=owned[cxKey(cur)]||0,dKey=cxKey(cur),inDet=!isReveal&&!isApp&&u.pg==='det';
 const outTo=(s.asks_out||[]).filter(r=>cxKey(r)===dKey).map(r=>r.to);
 const inFrom=(s.asks_in||[]).filter(r=>cxKey(r)===dKey).map(r=>r.name);
 V.badgeTxt=isReveal?(cur.gift?'QUÀ TỪ '+(cur.from||'NGƯỜI KIA').toUpperCase()+' · ':'')+(cur.isNew?'THẺ MỚI':'ĐÃ CÓ · ×'+cur.count):(own1?'Sở hữu ×'+own1:'Chưa sở hữu');
 V.badgeCls=isReveal&&!cur.isNew?'dup':'nw';
 V.dtGive=inDet&&own1>1;V.dtSpare=own1-1;V.dtKeep=inDet&&own1===1;V.dtAskOn=inDet&&own1===0;
 V.dtAskTxt=outTo.length?'Đã xin '+outTo.length+' người · xin thêm':'Xin thẻ này';V.dtAskCls=outTo.length?'sent':'';
 V.dtReq=inDet&&inFrom.length>0;V.dtReqTxt=inFrom.join(', ')+' đang xin thẻ này';
 V.dfLk=inDet&&own1===0?'lkd':'';
 const nDr=(u.drawn&&u.drawn.length)||5;
 V.dots=[];for(let j=0;j<nDr;j++)V.dots.push({cls:j<=u.idx?'on':''});
 V.nextTxt=u.idx>=nDr-1?'Xong':'Tiếp';
 H.nextCard=()=>{const x=CX.u;if(x.idx<(x.drawn.length||5)-1)cxSet({idx:x.idx+1,flipped:false});else cxFinishReveal()};

 /* ---- tặng / xin thẻ ---- */
 H.dtGiveF=()=>{const d=CX.u.detail;if(!d)return;if((cxOwned()[cxKey(d)]||0)<2){cxFlash('Chỉ còn 1 bản, không tặng được');return}cxEnsurePeople().then(()=>cxSet({sheet:'who',who:'give',ws:{}}))};
 H.dtAskF=()=>{cxEnsurePeople().then(()=>cxSet({sheet:'who',who:'ask',ws:{}}))};
 const wd=u.detail,wk=cxKey(wd),wGive=u.who==='give',wSel=u.ws||{},wSpare=(owned[wk]||0)-1;
 const wN=ptc.filter(p=>wSel[p.id]).length;
 V.whoTitle=wd?(wGive?'Tặng ':'Xin ')+cxNm(wk)+(wGive?' cho ai?':' từ ai?'):'';
 V.whoSub=wGive?'Tích chọn người nhận. Bạn dư ×'+wSpare+' nên tặng tối đa '+wSpare+' người.':'Tích chọn người bạn muốn xin. Họ nhận thông báo và tự quyết định có tặng không.';
 V.whoList=ptc.map((p,i)=>{const asked=outTo.indexOf(p.id)>=0;
  return {i,n:p.n,ini:p.ini,a:p.a,cls:(wSel[p.id]?'on ':'')+(asked&&!wGive?'dis':''),ck:wSel[p.id]?'✓':'',sub:wGive?'Bạn trong lịch':(asked?'Đã xin rồi':'Bạn trong lịch')}});
 V.whoGoTxt=wGive?(wN?'Tặng cho '+wN+' người':'Chọn người nhận'):(wN?'Gửi lời xin cho '+wN+' người':'Chọn người để xin');V.whoGoCls=wN?'':'off';
 H.whoTog=e=>{const i=cxIdx(e),p=cxPeople()[i];if(!p)return;const x=CX.u,sel=cxCl(x.ws||{}),give=x.who==='give',k=cxKey(x.detail);
  if(!give&&(CX.s.asks_out||[]).some(r=>cxKey(r)===k&&r.to===p.id))return;
  if(sel[p.id])delete sel[p.id];
  else{const sp=(cxOwned()[k]||0)-1;if(give&&Object.keys(sel).length>=sp){cxFlash('Chỉ dư ×'+sp+' nên tặng tối đa '+sp+' người');return}sel[p.id]=true}
  cxSet({ws:sel})};
 H.whoGo=async()=>{const x=CX.u,k=cxKey(x.detail),ids=cxPeople().filter(p=>(x.ws||{})[p.id]).map(p=>p.id);
  if(!k||!ids.length){cxFlash('Chưa chọn người nào');return}
  if(CX.busy)return;CX.busy=true;
  const d=x.detail,names=ids.map(cxPName).join(', ');
  const r=await cxCall(x.who==='give'?API.cxGive(ids,d.con,d.slot,!!d.holo):API.cxAsk(ids,d.con,d.slot,!!d.holo));CX.busy=false;
  if(!r)return;CX.s=r;cxSet({sheet:'',ws:{}});cxTouch();
  cxFlash(x.who==='give'?'Đã tặng '+cxNm(k)+' cho '+names:'Đã gửi lời xin '+cxNm(k)+' cho '+names)};
 H.closeSheet=()=>cxSet({sheet:''});

 /* ---- hộp quà bạn bè ---- */
 const gf=s.gifts||[],senders=[];gf.forEach(g=>{if(senders.indexOf(g.name)<0)senders.push(g.name)});
 V.hasGift=gf.length>0;V.giftN=gf.length;
 V.giftHead=senders.length===1?senders[0]+' gửi bạn '+gf.length+' thẻ':gf.length+' thẻ quà từ '+senders.join(', ');
 V.giftTxt=gf.slice(0,3).map(g=>cxNm(cxKey(g))).join(', ')+(gf.length>3?'…':'');
 H.giftOpen=async()=>{if(CX.busy)return;CX.busy=true;const r=await cxCall(API.cxClaim(null));CX.busy=false;if(!r)return;
  await cxReload();
  cxSetAll({drawn:r.cards.map(c=>({con:c.con,slot:c.slot,holo:c.holo,isNew:c.is_new,count:c.count,gift:true,from:c.from_name})),idx:0,fx:'reveal',flipped:false,pg:'',sheet:'',queue:(r.unlocked||[]).slice(),last:{unlocked:r.unlocked||[]}})};

 /* ---- bộ sưu tập ---- */
 const ct=u.colCon,ccol=CXN[ct]||CXN[1],locked=ct<=3&&ct>openC;
 const ultCount=(ult[1]?1:0)+(ult[2]?1:0);
 V.rbar=[1,2,3].map(c=>({a:CXN[c].a,n:CXN[c].n.slice(0,7),v:cxCnt(owned,c)+'/5',p:(cxCnt(owned,c)/5*100)+'%'})).concat([{a:'#FFE45E',n:'Ultra',v:ultCount+'/2',p:(ultCount/2*100)+'%'}]);
 V.chips=[1,2,3,4,5].map(c=>({i:c,n:c===5?'Thẻ app':c===4?'Ultra':CXN[c].n,cls:ct===c?'on':''}));
 H.setTab=e=>{CX.u.colCon=cxIdx(e);cxSetAll({})};
 V.tabA=ct===4?'#FFE45E':ct===5?'#9B5CFF':ccol.a;V.colName=ct===4?'Ultra Limited':ct===5?'Thẻ app':ccol.n;
 V.colOpen=ct<=3&&!locked;V.colLocked=locked;V.colUltra=ct===4;V.colApp=false;V.lockDate=ccol.open+'/2026';
 const mk=h=>{const o=[];for(let i=0;i<5;i++){const c=owned[ct+(h?'h':'n')+i]||0;o.push({i:i+(h?10:0),cls:c?'':'lk',img:ct<=3?cxCard(ct,i):'',nm:CXMEM[i],x:c,xd:c>1?'block':'none',nd:'none'})}return o};
 V.tilesN=mk(false);V.tilesH=mk(true);
 const nOwn=ct<=3?cxCnt(owned,ct):0,hOwn=ct<=3?cxCnt(owned,ct,true):0;
 V.colN=nOwn;V.colH=hOwn;V.colPano=cxImg('pano-'+(ct<=3?ct:1)+'.webp');V.panoOk=nOwn===5;
 V.panoRim=nOwn===5?'linear-gradient(100deg,#fff,'+ccol.a+',#4CC9FF,#fff)':'var(--line)';V.panoState=nOwn===5?'Đã mở':nOwn+'/5 mảnh';
 V.bands=[0,1,2,3,4].map(i=>({left:(i*20)+'%',cls:owned[ct+'n'+i]?'get':''}));
 H.tileOpen=e=>{const v=cxIdx(e),h=v>=10,sl=v%10,x=CX.u;if(x.colCon>3)return;cxSet({pg:'det',detail:{con:x.colCon,slot:sl,holo:h,isNew:false,count:1},flipped:false})};
 H.goPano=()=>{const x=CX.u,c=x.colCon<=3?x.colCon:1;if(cxCnt(cxOwned(),c)<5){cxFlash('Gom đủ 5 thẻ thường để mở panorama');return}cxSet({pg:'pano',fx:'',sheet:'',colCon:c,pan:18});cxStartTilt()};
 const IMGW=520*ccol.ar,VW=390,fov=VW/IMGW*100;
 V.imgW=Math.round(IMGW);V.panVal=u.pan;V.panX=(-(u.pan/100)*(IMGW-VW)).toFixed(1)+'px';
 V.fovW=fov.toFixed(2)+'%';V.fovX=((u.pan/100)*(100-fov)).toFixed(2)+'%';
 H.onPan=e=>{CX.u.pan=Number(e.target.value);CX.ver++;cxPaint()};

 /* ---- mở khóa concept ---- */
 const uc=CXN[u.uc]||CXN[1];
 V.ucA=uc.a;V.ucName=uc.n;V.ucPano=cxImg('pano-'+u.uc+'.webp');V.ucFr=cxCard(u.uc,u.uc+1);
 V.ucV='--a:'+uc.a+';--c:'+uc.b+';--bl:13px';V.ucT='--a:'+uc.a+';--b:'+uc.b;
 H.unPack=()=>{if(!(CX.s.packs||[]).length){cxFlash('Chưa có pack nào để mở');return}cxSet({fx:'pack',tearing:false})};
 V.unNextTxt=(CX.u.queue&&CX.u.queue.length)?'Concept tiếp theo':(allCel?'Tiếp: nhận thẻ Ultra':'Về bộ sưu tập');
 H.unNext=()=>{const x=CX.u;
  if(x.queue&&x.queue.length){const c=x.queue.shift();cxSet({uc:c,fx:'unlock'});return}
  if(Object.keys(cxCl(cel)).length===3){cxSet({fx:'uget',ugSk:false})}else{CX.u.colCon=cxLastCon();cxSet({fx:''});go('col');cxSetAll({})}};

 /* ---- hồ sơ: phần thưởng ---- */
 const eqId=(S.equip&&String(S.equip).startsWith('concept-'))?Number(String(S.equip).slice(8)):0;
 V.rews=[1,2,3].map(c=>{const ok=!!cel[c];
  return {a:CXN[c].a,n:CXN[c].n,st:ok?'ĐÃ MỞ · CONCEPT '+c:'CHƯA MỞ · CONCEPT '+c,dim:ok?'':'opacity:.4;filter:grayscale(.9)',
   v:'--a:'+CXN[c].a+';--c:'+CXN[c].b+';--bl:8px',t:'--a:'+CXN[c].a+';--b:'+CXN[c].b,img:cxCard(c,c+1),i:c,
   eqc:eqId===c?'pink':(ok?'':'ghost'),eqt:!ok?'Chưa mở khóa':(eqId===c?'Đang dùng · bỏ dùng':'Dùng khung & danh hiệu')}});
 H.equip=async e=>{const c=cxIdx(e);if(!cel[c]){cxFlash('Cần mở khóa concept này trước');return}
  if(CX.busy)return;CX.busy=true;
  const r=await cxCall(API.equip(eqId===c?null:'concept-'+c));CX.busy=false;
  if(r===null&&false)return;
  try{await API.reload('lite')}catch(err){}
  cxTouch()};

 /* ---- Ultra ---- */
 V.ultraSt=allCel?'Đã mở khóa':'Cần đủ 3 concept';
 for(let q=1;q<=2;q++){V['u'+q+'Ready']=allCel&&!!ult[q];V['u'+q+'New']=allCel&&!ult[q];V['u'+q+'Lock']=!allCel;
  V['u'+q+'Songs']=ult[q]?CXSONGS[ult[q][0]].t+' · '+CXSONGS[ult[q][1]].t:'';V['uPoster'+q]=cxImg('ultra-'+q+'.webp');V['uVid'+q]=CX.sg['ultra-'+q+'.mp4']||''}
 H.openU=e=>{const n=cxIdx(e);cxSet({u:n,sheet:'',pg:'ucard',ust:'idle',paused:false,disc:'A'});
  const p=ult[n]||[0,4];cxSign(['ultra-'+n+'.mp4','songs/'+p[0]+'.m4a','songs/'+p[1]+'.m4a']);cxPrefetch('songs/'+p[0]+'.m4a');cxPrefetch('songs/'+p[1]+'.m4a')};
 H.startU=e=>cxSet({u:cxIdx(e),sheet:'songs',sel:[0,4]});
 H.jumpU=()=>{
  if(!allCel){cxFlash('Cần đủ 3 concept trước');CX.u.colCon=4;cxSet({fx:'',pg:'',sheet:''});go('col');cxSetAll({});return}
  /* phát lại hiệu ứng nhận 2 thẻ Ultra + nhạc GO; mở khóa Web Audio ngay trong cú chạm này */
  cxAC();cxBuf('songs/0.m4a');
  window.__ugOn=false;
  cxSet({fx:'uget',ugSk:false})};
 H.startU1=()=>{CX.u.colCon=4;cxSet({fx:'',pg:'',u:1,sheet:'songs',sel:[0,4]});go('col');cxSetAll({})};
 V.u=u.u;V.uIs1=u.u===1;V.uIs2=u.u===2;
 const sel=u.sel;
 V.songs=CXSONGS.map((x,i)=>{const on=sel.indexOf(i)>=0;return {i,t:x.t,len:x.len,c:x.c,cls:on?'got':'',ck:on?'✓':''}});
 H.pickSong=e=>{const i=cxIdx(e),n=CX.u.sel.slice(),k=n.indexOf(i);if(k>=0)n.splice(k,1);else if(n.length<2)n.push(i);else{n.shift();n.push(i)}cxSet({sel:n})};
 const ready=sel.length===2;V.lockCls=ready?'':'off';V.lockTxt=ready?'Khóa 2 bài vào thẻ (không đổi được)':'Chọn đủ 2 bài ('+sel.length+'/2)';
 H.lock=async()=>{const x=CX.u;if(x.sel.length!==2||CX.busy)return;CX.busy=true;
  const r=await cxCall(API.cxUltraLock(x.u,x.sel.slice()));CX.busy=false;if(!r)return;CX.s=r;
  cxSetAll({sheet:'',pg:'ucard',ust:'idle',paused:false,disc:'A'});
  const p=x.sel;cxSign(['ultra-'+x.u+'.mp4','songs/'+p[0]+'.m4a','songs/'+p[1]+'.m4a'])};
 const pair=ult[u.u]||[0,4],A=CXSONGS[pair[0]],B=CXSONGS[pair[1]],curS=u.disc==='B'?B:A;
 V.titleA=A.t;V.titleB=B.t;V.cA=A.c;V.cB=B.c;
 V.stCls=u.ust==='idle'?'idle':u.ust==='ch'?'ch':(u.disc==='B'?'pB':'pA');
 V.curT=curS.t;V.curLen=curS.len;V.psCls=u.paused?'psx':'';V.pauseTxt=u.paused?'▶  Tiếp tục':'❚❚  Tạm dừng';
 V.ustIdle=u.ust==='idle';V.ustCh=u.ust==='ch';V.ustPlay=u.ust==='play';
 H.tapStage=()=>{if(CX.u.ust==='idle')cxSet({ust:'ch'})};
 H.goChoose=()=>{cxStopAudio();cxSet({ust:'ch',paused:false})};
 H.closeU=()=>{cxStopAudio();CX.u.colCon=4;cxSet({pg:'',ust:'idle',paused:false});go('col');cxSetAll({})};
 H.playA=()=>{const x=CX.u;if(x.ust==='idle')return;cxSet({ust:'play',disc:'A',paused:false});cxStartAudio((ult[x.u]||[0,4])[0])};
 H.playB=()=>{const x=CX.u;if(x.ust==='idle')return;cxSet({ust:'play',disc:'B',paused:false});cxStartAudio((ult[x.u]||[0,4])[1])};
 H.togglePause=()=>{const x=CX.u,a=window.__ca;
  if(x.paused){if(a&&a.started){const pr=a.play();if(pr&&pr.catch)pr.catch(()=>{})}else cxStartAudio((ult[x.u]||[0,4])[x.disc==='B'?1:0])}else if(a)a.pause();
  cxSet({paused:!x.paused})};
 V.ugv3=true;V.ugv5=false;V.ugv4=false;V.skCls=u.ugSk?'skp':'';
 return V}

const cxFmtToday=()=>{const t=CX.s&&CX.s.today?CX.s.today.split('-'):['2026','10','18'];return t[2]+'.'+t[1]+'.'+t[0]};
const cxLastCon=()=>{const d=CX.u.last;return d&&d.con?d.con:(CX.u.colCon<=4?CX.u.colCon:1)};

/* ===== thao tác có animation ===== */
async function cxOpenPack(){
 if(CX.busy)return;CX.busy=true;cxSet({tearing:true});
 const t0=Date.now(),pk=(CX.s.packs||[])[0];
 const r=await cxCall(API.cxOpen(pk?pk.id:null));
 if(!r){CX.busy=false;cxSet({tearing:false});await cxReload();cxTouch();return}
 /* tải trạng thái + ảnh thẻ song song với animation xé gói, không đợi nối tiếp */
 if(!r.app)r.cards.forEach(c=>{try{cxCard(c.con,c.slot)}catch(e){}});
 const rl=cxReload();
 const lite=r.app?API.reload('lite').catch(()=>{}):null;
 const w=Math.max(0,1500-(Date.now()-t0));await new Promise(res=>setTimeout(res,w));
 CX.busy=false;
 await rl;
 if(r.app){
  const drawn=r.app.map(a=>{const cd=CBY[a.card_id];return {app:true,card:cd,r:cd?cd.r:'common',isNew:a.is_new,count:a.count}});
  cxSetAll({drawn,idx:0,tearing:false,fx:'reveal',flipped:false,queue:[],last:{unlocked:[],app:true}});lite.then(()=>{})}
 else{
  const drawn=r.cards.map(c=>({con:c.con,slot:c.slot,holo:c.holo,isNew:c.is_new,count:c.count}));
  cxSetAll({drawn,idx:0,tearing:false,fx:'reveal',flipped:false,colCon:r.pack.con,queue:(r.unlocked||[]).slice(),last:{unlocked:r.unlocked||[],con:r.pack.con}})}}
async function cxFinishReveal(){
 const x=CX.u;
 if(x.queue&&x.queue.length){const c=x.queue.shift();
  try{await API.reload('lite')}catch(e){}
  CX.u.colCon=c;cxSetAll({fx:'unlock',uc:c,flipped:false});return}
 const d0=x.drawn[0]||{};
 CX.u.colCon=d0.app?5:(d0.con||x.colCon);
 cxSet({fx:'',flipped:false});go('col');cxSetAll({})}

/* ===== nhạc thẻ Ultra ===== */
/* 2 phần tử audio dùng chung, mở khóa ở lần chạm đầu tiên để trình duyệt (iOS/Safari) không chặn phát về sau */
const CXSIL='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
function cxAudEl(k){if(!window[k]){const a=new Audio();a.preload='none';window[k]=a}return window[k]}
(function(){let ok=false;const EV=['click','touchend','pointerup','keydown'];
 const un=()=>{try{const c=cxAC();if(c&&!ok){const o=c.createBuffer(1,1,22050),sr=c.createBufferSource();sr.buffer=o;sr.connect(c.destination);sr.start(0)}}catch(e){}if(ok)return;['__sa','__ugA'].forEach(k=>{try{const a=cxAudEl(k);if(a.src&&!a.paused)return;a.muted=true;a.src=CXSIL;const p=a.play();const done=g=>{try{a.pause();a.muted=false;a.removeAttribute('src');if(g&&!ok){ok=true;EV.forEach(e=>document.removeEventListener(e,un,true))}}catch(e){}};if(p&&p.then)p.then(()=>done(true),()=>done(false));else done(true)}catch(e){}})};
 EV.forEach(e=>document.addEventListener(e,un,true))})();
/* Nhạc chạy bằng Web Audio (đã chạy được trên iPhone: tiếng hiệu ứng nghe được), giải mã cả bài nên không phụ thuộc Range/moov của file m4a */
const CXA={ctx:null,bufs:{},ld:{},raw:{}};
function cxAC(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
 try{if(!CXA.ctx||CXA.ctx.state==='closed'){try{CXA.ctx=new AC({sampleRate:32000})}catch(e){CXA.ctx=new AC()}}if(CXA.ctx.state!=='running'){const r=CXA.ctx.resume();if(r&&r.catch)r.catch(()=>{})}}catch(e){return null}
 return CXA.ctx}
/* tải sẵn dữ liệu nén (~2MB) nhưng chưa giải mã: giải mã cả bài tốn ~70MB nên chỉ làm khi cần phát */
function cxPrefetch(k){if(CXA.raw[k])return CXA.raw[k];
 const st=e=>{CXA.err=e;throw e};
 const p=cxSign([k]).then(()=>{if(!CX.sg[k])st('ký link');return fetch(CX.sg[k]).catch(()=>st('tải'))})
  .then(r=>{if(!r.ok)st('tải '+r.status);return r.arrayBuffer()}).catch(e=>{if(typeof e==='string')CXA.err=e;CXA.raw[k]=0;return null});
 CXA.raw[k]=p;return p}
function cxBuf(k){if(CXA.bufs[k])return Promise.resolve(CXA.bufs[k]);if(CXA.ld[k])return CXA.ld[k];
 const p=cxPrefetch(k).then(ab=>{if(!ab)return null;return new Promise(res=>{const c=cxAC();if(!c){CXA.err='không có Web Audio';return res(null)}let done=false;const ok=b=>{if(!done){done=true;res(b)}},no=()=>{if(!done){done=true;CXA.err='giải mã';res(null)}};try{const r=c.decodeAudioData(ab.slice(0),ok,no);if(r&&r.then)r.then(ok,no)}catch(e){no()}})})
  .then(b=>{if(b)CXA.bufs[k]=b;else CXA.ld[k]=0;return b});
 CXA.ld[k]=p;return p}
/* giải phóng bộ nhớ: chỉ giữ bản giải mã của bài đang dùng */
function cxFreeBufs(keep){Object.keys(CXA.bufs).forEach(k=>{if(k!==keep){delete CXA.bufs[k];delete CXA.ld[k]}})}
function cxMkPlayer(){const c=cxAC();let node=null,start=0,dur=0,poll=0,stopped=false;
 const sh={paused:false,started:false,ontimeupdate:null,onended:null,
  get currentTime(){return c?Math.max(0,c.currentTime-start):0},get duration(){return dur},
  begin(b){if(!c||stopped)return;sh.started=true;node=c.createBufferSource();node.buffer=b;dur=b.duration;node.connect(c.destination);start=c.currentTime;
   node.onended=()=>{if(!stopped&&sh.onended)sh.onended()};node.start(0);
   if(c.state!=='running'){const re=()=>{document.removeEventListener('click',re,true);document.removeEventListener('touchend',re,true);try{c.resume()}catch(e){}};document.addEventListener('click',re,true);document.addEventListener('touchend',re,true);cxFlash('Chạm lại màn hình để phát nhạc')}
   poll=setInterval(()=>{if(sh.ontimeupdate)sh.ontimeupdate()},250)},
  play(){sh.paused=false;try{if(c)c.resume()}catch(e){}return Promise.resolve()},
  pause(){sh.paused=true;try{if(c)c.suspend()}catch(e){}},
  stop(){stopped=true;clearInterval(poll);try{if(node){node.onended=null;node.stop()}}catch(e){}try{if(c)c.resume()}catch(e){}}};
 return sh}
function cxStopAudio(){try{if(window.__ca){if(window.__ca.stop)window.__ca.stop();else window.__ca.pause();window.__ca.onended=null;window.__ca.ontimeupdate=null;window.__ca=null}}catch(e){}}
function cxStartAudio(i){
 cxStopAudio();
 const sh=cxMkPlayer();window.__ca=sh;const k='songs/'+i+'.m4a';
 sh.ontimeupdate=()=>{const el=document.getElementById('pgi'),tx=document.getElementById('pgt');if(el&&sh.duration)el.style.width=(sh.currentTime/sh.duration*100)+'%';if(tx)tx.textContent=cxFmt(sh.currentTime)};
 sh.onended=()=>cxSet({paused:true});
 cxFreeBufs(k);
 if(!CXA.bufs[k])cxFlash('Đang tải nhạc…');
 cxBuf(k).then(b=>{if(window.__ca!==sh)return;if(!b){cxFlash('Không phát được nhạc ('+(CXA.err||'lỗi')+'), bấm Tiếp tục để thử lại');cxSet({paused:true});return}sh.begin(b)})}

/* ===== panorama: nghiêng điện thoại để nhìn quanh (có thanh kéo dự phòng) ===== */
let cxTiltOn=false;
function cxStartTilt(){
 if(cxTiltOn)return;
 const hand=e=>{if(CX.u.pg!=='pano'||e.gamma==null)return;const g=Math.max(-35,Math.min(35,e.gamma));CX.u.pan=Math.round((g+35)/70*100);CX.ver++;cxPaint()};
 const on=()=>{cxTiltOn=true;window.addEventListener('deviceorientation',hand)};
 try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted')on()}).catch(()=>{});else if(window.DeviceOrientationEvent)on()}catch(e){}}

/* ===== âm thanh mở thẻ Ultra: 2 sao xoắn (bản 3) ===== */
function cxUltraSfx3() {
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
function cxStopUltraMusic() {
  window.__ugTk = (window.__ugTk || 0) + 1;
  try { if (window.__ugT) { clearInterval(window.__ugT); window.__ugT = 0; } if (window.__ugO) { clearTimeout(window.__ugO); window.__ugO = 0; }
    var n = window.__ugN; window.__ugN = null;
    if (n) { try { n.g.gain.cancelScheduledValues(0); n.g.gain.setValueAtTime(n.g.gain.value, n.c.currentTime); n.g.gain.linearRampToValueAtTime(0, n.c.currentTime + 0.25); n.s.stop(n.c.currentTime + 0.3); } catch (e) {} } } catch (e) {}
}
function cxUltraMusic(imp) {
  try {
    cxStopUltraMusic();
    var tk = window.__ugTk, k0 = 'songs/0.m4a', c = cxAC(); if (!c) return;
    cxBuf(k0).then(function (b) {
      if (!b || !window.__ugOn || tk !== window.__ugTk) return;
      var st = Math.max(0, (window.__ugs || 30) - imp), t = c.currentTime;
      var g = c.createGain(), s = c.createBufferSource(); s.buffer = b; s.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(1, t + 1.3);
      var endAt = t + imp + 9.2; g.gain.setValueAtTime(1, endAt); g.gain.linearRampToValueAtTime(0, endAt + 1);
      s.start(0, Math.min(st, Math.max(0, b.duration - 1))); s.stop(endAt + 1.05);
      window.__ugN = { s: s, g: g, c: c }; setTimeout(function () { if (!window.__ca) cxFreeBufs(''); }, (imp + 11) * 1000);
    });
  } catch (e) {}
}

/* ===== chạy hiệu ứng Ultra khi màn uget bật ===== */
function cxUgWatch(){
 const on=CX.u.fx==='uget';
 if(on&&!window.__ugOn){window.__ugOn=true;window.__ugs=CX.u.ugs;window.__ugm=CX.u.ugm;cxUltraSfx3();if(window.__ugm)cxUltraMusic(3.9)}
 else if(!on&&window.__ugOn){window.__ugOn=false;try{if(window.__ugc){const cp=window.__ugc.close();if(cp&&cp.catch)cp.catch(()=>{})}}catch(e){}cxStopUltraMusic()}}

/* ===== mảnh giao diện chèn vào các tab hiện có ===== */
const cxFrag=(name,extra)=>{if(!cxOn())return '';try{return cxTpl(name,cxV())}catch(e){console.error('cx',name,e);return ''}};
function cxBannerHTML(){return cxLive()?cxFrag('bnx'):''}
function cxTaskHTML(){return cxLive()&&cxDay()<=9?cxFrag('taskRow'):''}
function cxClaimHTML(){return cxLive()&&(CX.s.packs||[]).length?cxFrag('claim'):''}
function cxGiftHTML(){return cxOn()&&(CX.s.gifts||[]).length?cxFrag('gift'):''}
function cxRewardsHTML(){return ''}
function cxColChipsHTML(){return cxFrag('colchips')}
function cxColHTML(){return cxFrag('col')}
const cxColActive=()=>cxLive()||(CX.s&&((CX.s.cards||[]).length||(CX.s.unlocks||[]).length));
const cxColConcept=()=>cxColActive()&&CX.u.colCon<=4;

function cxTodayTaskHTML(){const r=cxTaskHTML();return r?`<div class="card-b" style="margin-top:12px"><h2 style="display:block;font-size:16px">Nhiệm vụ Mùa Concept</h2><div class="sub" style="margin-top:3px">${esc(cxTagLine())}</div><div style="margin-top:10px">${r}</div></div>`:''}
function cxCalTaskHTML(){const r=cxTaskHTML();return r?`<div class="card-b caltk"><h2>Mùa Concept · Hôm nay <em>${CX.s.ticks.indexOf(cxDay())>=0?1:0}/1</em></h2><div style="margin-top:4px">${r}</div></div>`:''}
const cxTagLine=()=>{const d=cxDay();return d>=1&&d<=9?'NGÀY '+d+'/9 · '+CXN[cxDayCon(d)].n.toUpperCase():'NGOÀI SỰ KIỆN'};
function cxCellMark(y,m,d){if(!cxOn()||y!==2026||m!==9||d<18||d>26)return '';
 const di=d-17,c=cxDayCon(di),ck=(CX.s.ticks||[]).indexOf(di)>=0;
 return `<span class="cxdot${ck?' ck':''}" style="--c:${CXN[c].a}">${ck?'✓':''}</span>`}
function cxLegendHTML(){return cxLive()?`<div class="legend" style="padding-top:6px"><span><i style="background:${cxDayCon(cxDay())?CXN[cxDayCon(cxDay())].a:'#FFE45E'};border-color:#fff;width:9px;height:9px;border-radius:50%"></i>Ngày có nhiệm vụ Mùa Concept</span></div>`:''}

/* ----- hòm thư: thư Mùa Concept theo kiểu thiết kế ----- */
const cxIsMail=m=>m.eid==='mua-concept-2026'&&m.kind!=='event';
const cxMailDay=m=>m.date.split(' ')[0];
function cxMailStat(m){return m.gifts.length&&!m.claimed?['Quà chưa nhận','rw']:!m.read?['Mới','nw']:['Đã đọc','']}
function cxMailItemHTML(m){const st=cxMailStat(m),t=m.tag?`<span class="mbxt" style="background:${esc(m.tc||'#FFE45E')}">${esc(m.tag)}</span>`:'';
 return `<button class="card-b mbxi ${need(m)?'new':''}" data-act="letter" data-id="${m.id}">${t}<b>${esc(m.t)}</b>${m.sum?`<span class="mbxs">${esc(m.sum)}</span>`:''}<span class="mbxf"><em>Colentis · ${esc(cxMailDay(m))}</em><i class="mbxc ${st[1]}">${st[0]}</i></span></button>`}
function cxGiftLetters(){const gf=(CX.s&&CX.s.gifts)||[],by={};gf.forEach(g=>{(by[g.from]=by[g.from]||{name:g.name,ks:[]}).ks.push(cxKey(g))});
 return Object.keys(by).map(f=>{const x=by[f];
  return `<button class="card-b mbxi new" data-cx-gift="${f}"><span class="mbxt" style="background:#FF4FA3">QUÀ TỪ BẠN BÈ</span><b>${esc(x.name)} gửi bạn ${x.ks.length} thẻ</b><span class="mbxs">${esc(x.ks.slice(0,3).map(cxNm).join(', ')+(x.ks.length>3?'…':''))}</span><span class="mbxf"><em>${esc(x.name)}</em><i class="mbxc gift">Chưa nhận</i></span></button>`}).join('')}
function cxMailDetailHTML(m){const st=m.tag?`<span class="mbxt" style="background:${esc(m.tc||'#FFE45E')}">${esc(m.tag)}</span>`:'';
 const g=m.gifts.find(x=>x.k==='cpack'),gt=g?`${g.n} pack ${CXN[g.con]?CXN[g.con].n:''}`:'';
 return `<div class="ptop"><button class="ibtn" data-act="back" data-p="pgLetter" aria-label="Quay lại">${ic('left')}</button><h1>Thư</h1></div><div class="pbody"><div class="mbxd">${st}<h2>${esc(m.t)}</h2><small>Colentis · ${esc(m.date)}</small>${m.p.split(/\n+/).map(t=>`<p>${esc(t)}</p>`).join('')}${g?`<div class="mbxr"><span>${ic('gift')}</span><div><small>QUÀ ĐÍNH KÈM</small><b>${esc(gt)}</b></div></div><button class="igo ${m.claimed?'off':''}" data-act="claimmail" data-id="${m.id}" ${m.claimed?'disabled':''}>${m.claimed?'Đã nhận quà':'Nhận quà'}</button>`:''}</div></div>`}
async function cxClaimMail(m){
 if(!API.online()){toast('Cần có mạng để nhận quà');return}
 let res;try{res=await API.claimMail(m.id)}catch(e){return apiFail(e,'claim')}
 try{await API.reload('lite')}catch(e){}
 const g=m.gifts.find(x=>x.k==='cpack');
 renderMailList();$('#pgLetter').innerHTML=cxMailDetailHTML(MAILS.find(x=>x.id===m.id)||m);renderAll();cxPaint();
 toast('Đã nhận '+(g?g.n+' pack '+(CXN[g.con]||{}).n:'quà')+' · mở ở tab Hôm nay')}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-cx-gift]');if(!b)return;e.preventDefault();
 const f=b.getAttribute('data-cx-gift');closePage('pgMail');
 (async()=>{if(CX.busy)return;CX.busy=true;const r=await cxCall(API.cxClaim(f));CX.busy=false;if(!r)return;await cxReload();
  cxSetAll({drawn:r.cards.map(c=>({con:c.con,slot:c.slot,holo:c.holo,isNew:c.is_new,count:c.count,gift:true,from:c.from_name})),idx:0,fx:'reveal',flipped:false,pg:'',sheet:'',queue:(r.unlocked||[]).slice(),last:{unlocked:r.unlocked||[]}})})()});

/* ----- khung tròn + danh hiệu Mùa Concept (dùng trong avatar()/titleFrame()) ----- */
function cxFrameAv(n,s,m){const c=CXN[n];if(!c)return '';
 return `<div class="fx" style="--w:${s}px;--a:${c.a};--c:${c.b};--bl:${Math.max(4,Math.round(s*.105))}px"><div class="fx-aura"></div><div class="fx-rays"></div><div class="frx">${m?idInner(m):''}</div><i class="fx-o"></i><i class="fx-o o2"></i><span class="fx-s" style="left:-14%;top:6%;animation-delay:0s"></span><span class="fx-s" style="right:-16%;top:30%;animation-delay:0.6s"></span><span class="fx-s" style="left:8%;bottom:-18%;animation-delay:1.2s"></span></div>`}
function cxTitlePill(n,text,h){const c=CXN[n];if(!c)return '';
 return `<span class="ttl" style="--a:${c.a};--b:${c.b};${h&&h<56?'zoom:'+(h/56)+';':''}">${esc(text||c.n)}</span>`}

/* ----- sự kiện bấm / nhập ----- */
document.addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('[data-cx]');if(!el)return;
 if(!CX.V)return;const f=CX.H[el.getAttribute('data-cx')];if(f){e.preventDefault();f(e)}});
document.addEventListener('input',e=>{const el=e.target.closest&&e.target.closest('[data-cxi]');if(!el)return;const f=CX.H[el.getAttribute('data-cxi')];if(f)f(e)});

/* ----- nạp trạng thái từ snapshot (gọi trong applySnapshot) ----- */
function cxApply(sn){
 const had=!!CX.s;CX.s=sn.cx||null;CX.ver++;
 if(CX.s&&!had)cxEnsurePeople()}
