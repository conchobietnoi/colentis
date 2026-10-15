/* ===== Tab Lịch: việc của bạn + ghi chú gập/mở + chọn màu nền ===== */
const NOTEOPEN=new Set();
function calTasks(){const sel=S.sel||todayKey,p=sel.split('-').map(Number);if(p.length<3||p.some(isNaN))return '';const [y,m,d]=p,iso=isoOf(y,m,d),st=dayStat(y,m,d);
 const ts=tasksOf(y,m,d).filter(t=>t.owner==='me'),isToday=iso===TODAY.iso,fut=st.k==='fut',locked=st.k==='p'||st.k==='rs';
 const canTick=!locked&&tickable(iso),canEdit=(fut||isToday)&&!locked,done=ts.filter(t=>t.done).length;
 return `<div class="card-b caltk"><h2>Việc của bạn · ${isToday?'Hôm nay':d+'/'+(m+1)} <em>${done}/${ts.length}</em></h2>${locked?`<div class="lock-banner">${ic('lock')}<span>Việc của bạn trong ngày này đã khóa, chỉ xem lại.</span></div>`:''}
 <div style="margin-top:4px">${ts.length?ts.map(t=>taskRow(t,!canTick,canEdit)).join(''):`<div class="empty" style="padding:16px 10px"><div class="ei">${ic('cal')}</div>${canEdit?'Chưa có việc nào. Thêm việc đầu tiên nhé.':'Ngày này không có việc.'}</div>`}</div>
 ${canEdit?`<button class="btn-s" style="margin-top:8px" data-act="addtask" data-k="${sel}">${ic('plus')} Thêm việc</button>`:''}</div>`}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act="tnote"]');if(!b)return;e.preventDefault();const id=b.dataset.id;
 if(NOTEOPEN.has(id))NOTEOPEN.delete(id);else NOTEOPEN.add(id);renderAll();if(sheetOpen&&S.sel){const p=S.sel.split('-').map(Number);if($('#sheet h2'))daySheet(p[2])}});
document.addEventListener('input',e=>{const t=e.target;if(!t||!t.dataset||t.dataset.act!=='bgc')return;THEME_DRAFT['--cal-bg']=t.value;$('#app').style.setProperty('--cal-bg',t.value)});
