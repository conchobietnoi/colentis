/* ===== Ball sưu tầm: 8 con, mỗi con là quà do admin tặng qua thư. Ảnh ở public/assets/balls/ball-N.webp.
   Con chưa có hiện ô tối dấu "?" (không dùng hình thật để khỏi lộ). Quyền sở hữu do server giữ (user_balls). ===== */
const BALL_TOTAL=8;
const BALL_NAME={'ball-1':'Ball bạc hà'};
function ballOwned(id){return (S.balls||[]).some(b=>b.id===id)}
const ballWorn=()=>{const b=(S.balls||[]).find(x=>x.worn);return b?b.id:null};
/* móc khóa 3D: hai mặt trước/sau xoay nhẹ khi đung đưa, treo từ góc trái frame ngang */
function ballKey(id,fh){if(!id)return '';const h=Math.round(fh*1.5);
 return `<span class="bk" style="--bh:${h}px"><span class="bk-sw"><span class="bk-3d"><img class="bk-f" src="${ASSETBASE}assets/balls/${esc(id)}-front.webp" alt="" draggable="false"><img class="bk-b" src="${ASSETBASE}assets/balls/${esc(id)}-back.webp" alt="" draggable="false"></span></span></span>`}
function ballRender(){
 const own=(S.balls||[]).length;
 const cells=Array.from({length:BALL_TOTAL},(_,i)=>{const id='ball-'+(i+1),has=ballOwned(id);
  return has?`<button class="bl-cell on" data-x="ballview" data-id="${id}" aria-label="${esc(BALL_NAME[id]||'Ball')}"><span class="bl-fx"></span><img src="${ASSETBASE}assets/balls/${id}.webp" alt="${esc(BALL_NAME[id]||'Ball')}" loading="lazy"><b>${esc(BALL_NAME[id]||'Ball '+(i+1))}</b>${ballWorn()===id?'<em class="bl-w">Đang đeo</em>':''}</button>`
   :`<div class="bl-cell off" aria-label="Ball chưa mở"><span class="bl-q">?</span><b>Ball ${i+1}</b></div>`}).join('');
 $('#col').innerHTML=`<div class="head"><div><small>Bộ sưu tập của bạn</small><h1>Ball</h1></div><div class="hact"><button class="ibtn" data-act="mail" aria-label="Hòm thư">${ic('mail')}</button></div></div>${ciColSeg()}
 <div class="ci-stat"><div><b>${own}/${BALL_TOTAL}</b><small>Ball đã có</small></div><div><b>${BALL_TOTAL-own}</b><small>Còn lại</small></div></div>
 <div class="bl-grid">${cells}</div><div class="sub" style="text-align:center;padding:10px 24px">Ball mới sẽ được tặng qua hòm thư trong các sự kiện sắp tới.</div><div style="height:90px"></div>`}
function ballView(id){
 const w=ballWorn()===id;
 openSheet(`<div style="text-align:center"><div class="bl-stage">${ballKey(id,150)}</div><h2>${esc(BALL_NAME[id]||'Ball')}</h2><div class="sub">${w?'Đang treo cạnh frame danh hiệu trên Hồ sơ của bạn.':'Đeo lên để treo cạnh frame danh hiệu, đung đưa trên Hồ sơ.'}</div><button class="big" data-x="ballwear" data-id="${id}">${w?'Gỡ ball':'Đeo ball'}</button><button class="big gh" data-x="cfno">Đóng</button></div>`)}
async function ballWear(id){if(!API.online()){toast('Cần có mạng để đổi');return}
 const w=ballWorn()===id;try{S.balls=await API.wornBall(w?null:id)}catch(e){return apiFail(e)}
 closeSheet();renderAll();if(S.tab==='col'&&COLTAB==='ball')renderCol();toast(w?'Đã gỡ ball':'Đã đeo ball')}
function ballReveal(id){COLTAB='ball';go('col');renderCol();toast('Ball mới đã vào bộ sưu tập');setTimeout(()=>ballView(id),350)}
