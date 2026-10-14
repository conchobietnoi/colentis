/* ===== chỉnh sửa hồ sơ: ảnh (cắt tròn), tên hiển thị, username ===== */
const EP={name:'',un:'',bd:'',photo:null,rm:false,img:null,z:1,ox:0,oy:0,V:220,chk:0,unOk:true,unMsg:'',from:'form'};
function editProfile(){EP.name=ME.name;EP.un=ME.un;EP.bd=ME.bd||'';EP.photo=null;EP.rm=false;EP.unOk=true;EP.unMsg='Username hiện tại của bạn';renderEdit()}
function epUnLocal(v){if(v===ME.un)return{ok:true,msg:'Username hiện tại của bạn'};
 if(v.length<4||v.length>19||!/^[a-z0-9_]+$/.test(v))return{ok:false,msg:'4 đến 19 ký tự: chữ thường, số, gạch dưới'};return null}
function epAv(){const el=$('#epav');if(el)el.innerHTML=avatar({...ME,ini:initials(EP.name||'?'),photo:EP.photo,photoPath:EP.rm?null:ME.photoPath},132,S.equip)}
function epChanged(){return EP.name.trim()!==ME.name||EP.un!==ME.un||!!EP.photo||EP.rm||(EP.bd||'')!==(ME.bd||'')}
function epValid(){return EP.name.trim().length>=2&&EP.unOk&&EP.chk===0&&bdCheck(EP.bd).ok}
function epBtn(){const b=$('#eps');if(b)b.disabled=!(epValid()&&epChanged())}
function renderEdit(){
 openSheet(`<h2>Chỉnh sửa hồ sơ</h2><div class="sub">Tên và ảnh này hiện với bạn bè trong lịch chung.</div>
 <div class="ep-top"><button class="ep-ph" data-ep="pick" aria-label="Đổi ảnh đại diện"><span id="epav"></span><span class="cam">${ic('image')}</span></button>
  <div class="ep-acts"><button class="btn-s pink" data-ep="pick">${ic('image')} Chọn ảnh</button><button class="btn-s ghost" data-ep="rm" id="eprm" ${(EP.photo||(ME.photoPath&&!EP.rm))?'':'hidden'}>${ic('trash')} Gỡ ảnh</button></div>
  </div>
 <input type="file" id="epf" accept="image/*" hidden>
 <label class="epl" for="epn">Tên hiển thị <span id="epc">${EP.name.length}/24</span></label>
 <div class="fld ep">${ic('user')}<input id="epn" maxlength="24" value="${esc(EP.name)}" autocomplete="off"><div class="err" id="epne"></div></div>
 <label class="epl" for="epu">Username</label>
 <div class="fld ep"><b class="at">@</b><input id="epu" maxlength="19" value="${esc(EP.un)}" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="epst ${EP.unOk?'ok':'bad'}" id="epst">${esc(EP.unMsg)}</div></div>
 <label class="epl" for="epb">Ngày sinh <span>Không bắt buộc</span></label>
 <div class="fld ep">${ic('cake')}<input id="epb" type="date" value="${EP.bd}" min="1940-01-01" max="${TODAY.iso}"><div class="err" id="epbe">${esc(bdCheck(EP.bd).msg)}</div></div>
 <p class="sub" style="margin-top:8px">Dùng để đếm ngược sinh nhật và mở danh hiệu sinh nhật. Chỉ mình bạn thấy ngày sinh. Sinh ngày 29/2 thì tính 28/2 ở năm không nhuận.</p>
 <p class="sub" style="margin-top:10px">Bạn bè tìm thấy bạn bằng username (nếu bạn bật “Cho tìm thấy” trong Quyền riêng tư).</p>
 <button class="big" id="eps" disabled>Lưu thay đổi</button><button class="big gh" data-ep="close">Đóng</button>`);
 epAv();epBtn();
 const n=$('#epn'),u=$('#epu');
 n.oninput=()=>{EP.name=n.value;$('#epc').textContent=n.value.length+'/24';$('#epne').textContent=n.value.trim().length<2?'Nhập ít nhất 2 ký tự':'';epAv();epBtn()};
 const bdI=$('#epb');bdI.oninput=()=>{EP.bd=bdI.value;$('#epbe').textContent=bdCheck(EP.bd).msg;epBtn()};
 u.oninput=()=>{const v=u.value.toLowerCase().replace(/\s/g,'');if(u.value!==v)u.value=v;EP.un=v;const id=++EP.chk;const st=$('#epst');st.className='epst chk';st.innerHTML='<i class="spn"></i> Đang kiểm tra...';epBtn();
  setTimeout(async()=>{if(id!==EP.chk)return;let r=epUnLocal(v);if(!r){try{const ok=await API.usernameAvailable(v);r=ok?{ok:true,msg:'Có thể dùng'}:{ok:false,msg:'Username này đã có người dùng'}}catch(e){r={ok:false,msg:'Chưa kiểm tra được, thử lại'}}}if(id!==EP.chk)return;EP.chk=0;EP.unOk=r.ok;EP.unMsg=r.msg;st.className='epst '+(r.ok?'ok':'bad');st.textContent=r.msg;epBtn()},450)};
 $('#epf').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>12*1024*1024){toast('Ảnh quá lớn, chọn ảnh dưới 12 MB');return}const fr=new FileReader();fr.onload=()=>epCrop(fr.result);fr.readAsDataURL(f)};
 $('#eps').onclick=async()=>{if(!API.online()){toast('Cần có mạng để lưu hồ sơ');return}
  const b=$('#eps');b.innerHTML='<i class="spn"></i> Đang lưu...';b.disabled=true;
  try{const patch={display_name:EP.name.trim(),birthday:EP.bd||null};if(EP.un!==ME.un)patch.username=EP.un;
   if(EP.photo)patch.avatar_path=await API.uploadAvatar(EP.photo);else if(EP.rm)patch.avatar_path=null;
   await API.updateProfile(patch);ME.photo=null;await API.reload();closeSheet();renderAll();toast('Đã lưu hồ sơ')}
  catch(er){b.disabled=false;b.innerHTML='Lưu thay đổi';const c=er&&er.app&&er.app.code;if(c==='USERNAME_COOLDOWN'||c==='USERNAME_TAKEN'){EP.unOk=false;EP.unMsg=er.app.message;const st=$('#epst');if(st){st.className='epst bad';st.textContent=er.app.message}}else apiFail(er)}}}
function epCrop(src){const im=new Image();im.onload=()=>{EP.img=im;EP.src=src;EP.z=1;EP.ox=0;EP.oy=0;renderCrop()};im.src=src}
function epBox(){const im=EP.img,V=EP.V,s0=V/Math.min(im.naturalWidth,im.naturalHeight),dw=im.naturalWidth*s0*EP.z,dh=im.naturalHeight*s0*EP.z,mx=(dw-V)/2,my=(dh-V)/2;EP.ox=Math.max(-mx,Math.min(mx,EP.ox));EP.oy=Math.max(-my,Math.min(my,EP.oy));return{dw,dh,l:V/2-dw/2+EP.ox,t:V/2-dh/2+EP.oy}}
function epPlace(){const b=epBox(),i=$('#cimg');i.style.cssText=`width:${b.dw}px;height:${b.dh}px;left:${b.l}px;top:${b.t}px`}
function renderCrop(){openSheet(`<h2>Cắt ảnh đại diện</h2><div class="sub">Kéo ảnh để chọn phần hiển thị, dùng thanh để phóng to.</div>
 <div class="crop" id="crop"><img id="cimg" src="${EP.src}" alt=""><i class="ring"></i></div>
 <div class="zrow">${ic('image')}<input type="range" id="cz" min="1" max="3" step="0.01" value="${EP.z}" aria-label="Phóng to"><span style="font-size:18px">${ic('image')}</span></div>
 <button class="big" data-ep="use">${ic('check')} Dùng ảnh này</button><button class="big gh" data-ep="cancel">Huỷ</button>`);
 epPlace();const c=$('#crop');let d=null;
 c.onpointerdown=e=>{d={x:e.clientX,y:e.clientY,ox:EP.ox,oy:EP.oy};c.setPointerCapture(e.pointerId);c.classList.add('drag')};
 c.onpointermove=e=>{if(!d)return;const sc=$('#app').getBoundingClientRect().width/390;EP.ox=d.ox+(e.clientX-d.x)/sc;EP.oy=d.oy+(e.clientY-d.y)/sc;epPlace()};
 c.onpointerup=c.onpointercancel=()=>{d=null;c.classList.remove('drag')};
 $('#cz').oninput=e=>{EP.z=+e.target.value;epPlace()}}
function epUse(){const im=EP.img,b=epBox(),k=320/EP.V;let out=EP.src;
 try{const cv=document.createElement('canvas');cv.width=cv.height=320;const x=cv.getContext('2d');x.drawImage(im,b.l*k,b.t*k,b.dw*k,b.dh*k);out=cv.toDataURL('image/jpeg',.86)}catch(e){}
 EP.photo=out;EP.rm=false;renderEdit()}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-act=editprof]')){editProfile();return}
 const b=e.target.closest('[data-ep]');if(!b)return;const a=b.dataset.ep;
 if(a==='pick'){const f=$('#epf');if(f){f.value='';f.click()}}
 else if(a==='rm'){EP.photo=null;EP.rm=true;epAv();$('#eprm').hidden=true;epBtn()}
 else if(a==='use')epUse();
 else if(a==='cancel')renderEdit();
 else if(a==='close')closeSheet()});
