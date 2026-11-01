/* ===== Ball sưu tầm: 8 con, mỗi con là quà do admin tặng qua thư. Ảnh ở public/assets/balls/ball-N.webp.
   Con chưa có hiện ô tối dấu "?" (không dùng hình thật để khỏi lộ). Quyền sở hữu do server giữ (user_balls). ===== */
const BALL_TOTAL=8;
const BALL_NAME={'ball-1':'Ball bạc hà'};
function ballOwned(id){return (S.balls||[]).some(b=>b.id===id)}
function ballRender(){
 const own=(S.balls||[]).length;
 const cells=Array.from({length:BALL_TOTAL},(_,i)=>{const id='ball-'+(i+1),has=ballOwned(id);
  return has?`<button class="bl-cell on" data-x="ballview" data-id="${id}" aria-label="${esc(BALL_NAME[id]||'Ball')}"><span class="bl-fx"></span><img src="${ASSETBASE}assets/balls/${id}.webp" alt="${esc(BALL_NAME[id]||'Ball')}" loading="lazy"><b>${esc(BALL_NAME[id]||'Ball '+(i+1))}</b></button>`
   :`<div class="bl-cell off" aria-label="Ball chưa mở"><span class="bl-q">?</span><b>Ball ${i+1}</b></div>`}).join('');
 $('#col').innerHTML=`<div class="head"><div><small>Bộ sưu tập của bạn</small><h1>Ball</h1></div><div class="hact"><button class="ibtn" data-act="mail" aria-label="Hòm thư">${ic('mail')}</button></div></div>${ciColSeg()}
 <div class="ci-stat"><div><b>${own}/${BALL_TOTAL}</b><small>Ball đã có</small></div><div><b>${BALL_TOTAL-own}</b><small>Còn lại</small></div></div>
 <div class="bl-grid">${cells}</div><div class="sub" style="text-align:center;padding:10px 24px">Ball mới sẽ được tặng qua hòm thư trong các sự kiện sắp tới.</div><div style="height:90px"></div>`}
function ballView(id){
 openSheet(`<div style="text-align:center"><div class="bl-big"><span class="bl-fx"></span><img src="${ASSETBASE}assets/balls/${esc(id)}.webp" alt="${esc(BALL_NAME[id]||'Ball')}"></div><h2>${esc(BALL_NAME[id]||'Ball')}</h2><div class="sub">Quà sưu tầm, không tính vào bộ thẻ.</div><button class="big gh" data-x="cfno">Đóng</button></div>`)}
function ballReveal(id){COLTAB='ball';go('col');renderCol();toast('Ball mới đã vào bộ sưu tập');setTimeout(()=>ballView(id),350)}
