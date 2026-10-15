/* ===== khởi động ===== */
let ERR_RETRY=null;
{const root=document.documentElement;root.style.setProperty('--logo',`url(${LOGO})`);
 setDark(lsGet('dark',window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches));
 setReduce(lsGet('reduce',window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches));
 S.priv.sound=lsGet('sound',false);S.priv.haptic=lsGet('haptic',true)}
API.bind({
 background(){if(GST||WZ||!ME.uid)return;const open=sheetOpen&&$('#sheet .cfm,#sheet input,#sheet textarea');if(!open&&$('#intro.on'))return;
  renderAll();if($('#pgNotif').classList.contains('on'))renderNotif();if($('#pgMail').classList.contains('on'))renderMailList();newTitlesPrompt()},
 offline(){offlinePill()},
 signedOut(){if(ME.uid){ME.uid='';INTRO.mode='login';runIntro('auth')}},
 recovery(){INTRO.mode='login';runIntro('auth');setTimeout(()=>forgotFlow(3),300)}});
window.addEventListener('online',()=>{offlinePill();API.flush().then(()=>API.reload('lite')).then(()=>{S.pending=API.pendingCount();offlinePill();renderAll()}).catch(()=>{})});
window.addEventListener('offline',offlinePill);
(async function boot(){
 INTRO.mode='login';runIntro('splash');
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const t0=Date.now();let signed=false;try{signed=await API.hasSession()}catch(e){}
 if(API.isRecovery()){await wait(600);INTRO.mode='login';authPane();forgotFlow(3);return}
 if(signed){
  const go1=async()=>{try{await API.boot();const left=(S.reduce?500:1600)-(Date.now()-t0);if(left>0)await wait(left);await enterApp(false)}catch(e){ERR_RETRY=go1;if(e&&e.app&&e.app.code==='NOT_AUTHENTICATED'){runIntro('auth')}else showErr('load')}};
  await go1()}
 else{const left=(S.reduce?500:1600)-(Date.now()-t0);if(left>0)await wait(left);authPane()}
})();
/* Bản mới tự áp dụng: khi service worker mới nhận quyền, tải lại một lần (trừ lúc đang mở quà) */
if('serviceWorker' in navigator){const had=!!navigator.serviceWorker.controller;let done=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||done)return;done=true;const go=()=>{if(GST||WZ)return void setTimeout(go,4000);location.reload()};go()})}
