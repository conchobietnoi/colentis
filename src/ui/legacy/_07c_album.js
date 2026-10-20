/* ===== Album sưu tầm (quà admin): kệ 3D + trình đọc lật trang ở public/album/reader.html (chạy trong iframe cùng nguồn) =====
   Ảnh nằm ở bucket riêng tư `album`; chỉ người đã nhận album mới ký được URL. Trình đọc không tự gọi Supabase: app gửi URL qua postMessage. */
const ALBUM_DEF=[{id:'greengreen-street',title:'GREENGREEN',sub:'STREET ver.',pages:20}];
const albumName=id=>{const a=ALBUM_DEF.find(x=>x.id===id);return a?`${a.title} · ${a.sub}`:id};
function albumProMenu(){const n=(S.albums||[]).length;if(!n)return '';
 return `<button class="menu" data-x="albums"><span class="l">${ic('book')}<span>Album của mình<small>${n} cuốn · lật như sách thật, xoay ngang và toàn màn hình</small></span></span>${ic('right')}</button>`}
let ALBUM_OPEN=null;
async function albumInit(frame,openId){
  const out=[];
  for(const a of (S.albums||[])){
    const names=['cover.jpg','back.jpg'];for(let i=1;i<=a.pages;i++)names.push(String(i+2).padStart(2,'0')+'.jpg');
    let urls={};try{urls=await API.albumUrls(a.id,names)}catch(e){}
    out.push({id:a.id,title:a.title,subtitle:a.subtitle,pages:a.pages,urls});
  }
  if(frame.contentWindow)frame.contentWindow.postMessage({t:'alb-init',albums:out,open:openId||null},'*');
}
function openAlbums(openId){
  if(!(S.albums||[]).length){toast('Bạn chưa có album nào');return}
  if(!API.online()){toast('Cần có mạng để xem album');return}
  ALBUM_OPEN=openId||null;
  openPage('pgAlbum',`<iframe class="albfr" id="albFr" title="Album" allow="fullscreen" src="${API.albumReaderUrl}"></iframe>`);
}
function closeAlbums(){try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}closePage('pgAlbum');$('#pgAlbum').innerHTML=''}
addEventListener('message',e=>{
  const d=e.data,fr=$('#albFr');if(!d||!fr||e.source!==fr.contentWindow)return;
  if(d.t==='alb-ready')albumInit(fr,ALBUM_OPEN);
  else if(d.t==='alb-close')closeAlbums();
});
