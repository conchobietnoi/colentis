/* ===== Thư POLA DAY dạng poster quảng cáo "phòng tối rửa ảnh". Mở từ openLetter khi m.eid==='pola-day-2026'.
   Không dùng ảnh thật: pola để đen/úp mặt, flash chỉ lóe màu mờ. Hiệu ứng tắt khi bật giảm chuyển động. ===== */
function plStrip(){return Array.from({length:14},()=>'<i></i>').join('')}
function plPoster(m){
 const got=m.claimed;
 const ticker=Array(6).fill('POLA DAY · 02 — 06.11.2026 · 40 SHOTS · AI Ở TRONG ẢNH? · ').join('');
 const backs=['đi bộ<br>15 phút','uống<br>đủ nước','dọn<br>góc bàn','gọi cho<br>người thân'];
 const hero=`<div class="plh"><div class="plsafe"></div><div class="pldust">${Array.from({length:16},()=>`<i style="left:${R(2,96)}%;top:${R(4,92)}%;animation-delay:-${R(0,9)}s;animation-duration:${R(7,13)}s"></i>`).join('')}</div>
 <div class="plline"></div>
 <div class="plbk b1"><span class="plclip"></span><div class="plback"><em>${backs[0]}</em></div></div><div class="plbk b2"><span class="plclip"></span><div class="plback"><em>${backs[1]}</em></div></div>
 <div class="plmain"><span class="plclip"></span><div class="plpol"><div class="plwin"><div class="plghost"></div><span class="plq">?</span><div class="plsheen"></div></div><div class="plcap">AI ĐÂY?</div><div class="pldate">'26 11 02</div></div></div>
 <div class="plbk b3"><span class="plclip"></span><div class="plback"><em>${backs[2]}</em></div></div><div class="plbk b4"><span class="plclip"></span><div class="plback"><em>${backs[3]}</em></div></div>
 <div class="pltt"><small>COLENTIS PRESENTS</small><h1>P<span class="plO"><i></i></span>LA<br>DAY</h1><p>40 tấm ảnh. Không ai biết ai ở trong đó.<br><b>…cho tới khi bạn rửa nó ra.</b></p></div>
 <div class="plflash"></div><div class="pltk"><div class="pltki">${ticker}</div></div></div>`;
 const steps=`<div class="plsec"><span class="plk">CÁCH CHƠI · 02 → 06.11</span><h2>Ba bước <em>rửa ảnh</em></h2>
 <div class="plfilm"><div class="plholes">${plStrip()}</div><div class="plfr">
 <div><b>01</b><strong>8 tấm úp mặt</strong><small>Mỗi ngày bạn nhận 8 pola, mặt sau ghi một việc nhỏ viết tay.</small></div>
 <div><b>02</b><strong>Làm việc đó</strong><small>Xong việc thật thì app tự biết, không cần bấm xác nhận.</small></div>
 <div><b>03</b><strong>Rửa ảnh</strong><small>Bấm Rửa ảnh, tấm pola hiện dần từ màn đen. Lúc đó mới biết ai trong ảnh.</small></div></div><div class="plholes">${plStrip()}</div></div>
 <p class="pld">Ngày nào lỡ vẫn rửa bù được tới hết 6/11. Ảnh được xếp vào bộ sưu tập theo từng thành viên.</p></div>`;
 const rewards=`<div class="plsec"><span class="plk">PHẦN THƯỞNG</span><h2>Rửa đủ <em>40 tấm</em></h2>
 <div class="plrw"><div class="plrc"><b>8/ngày</b><span>Một sticker cho mỗi ngày rửa đủ 8 tấm</span></div><div class="plrc gold"><b>40/40</b><span>Một danh hiệu bí mật, chưa ai được thấy</span></div></div>
 <div class="pllock"><div class="plhid"><div class="plav">${avatar(ME,150,'pola-day')}</div><div class="pltf">${titleFrame('pola-day','? ? ?',46)}</div><div class="plveil"><span>?</span><small>ẢNH CHƯA RỬA</small></div></div><span class="plkb">Rửa đủ 40 tấm để biết</span></div></div>`;
 const gtile=(img,t,s)=>`<div class="plg"><div class="plgi">${img}</div><b>${t}</b><small>${s}</small></div>`;
 const gifts=`<div class="plsec" style="padding-bottom:120px"><span class="plk">QUÀ MỞ MÀN · CÓ NGAY HÔM NAY</span><h2>Ba món <em>cho bạn</em></h2>
 <div class="plgs">${gtile(`<img src="${ASSETBASE}assets/balls/ball-1.webp" alt="">`,'Ball bạc hà','Treo lên frame danh hiệu')}
 ${gtile(`<div class="plgav">${avatar(ME,84,'ball-mint')}</div>`,'Frame Ball-chan','Khung tròn và khung ngang')}
 ${gtile(`<div class="plpk"><i></i><i></i><i></i></div>`,'5 gói thẻ','Mỗi gói 5 thẻ, ít nhất 1 Hiếm')}</div></div>`;
 const fab=got?`<button class="plfab done" disabled>${ic('check')} Đã nhận quà mở màn</button>`:`<button class="plfab" data-act="claimmail" data-id="${m.id}">${ic('gift')} Nhận quà mở màn</button>`;
 $('#pgLetter').innerHTML=`<div class="ptop plptop"><button class="ibtn" data-act="back" data-p="pgLetter" aria-label="Quay lại">${ic('left')}</button><h1>Thư sự kiện</h1></div><div class="pbody pl" style="padding:0">${hero}${steps}${rewards}${gifts}</div>${fab}`;
 openPage('pgLetter');renderMailList();syncBadges()}
