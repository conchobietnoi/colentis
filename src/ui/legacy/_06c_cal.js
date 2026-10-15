/* ===== Tab Lịch: việc của bạn + ghi chú gập/mở + chọn màu nền ===== */
const NOTEOPEN=new Set();
const slogo=(c='')=>`<i class="slogo ${c}" aria-hidden="true"></i>`;
function calTasks(){const sel=S.sel||todayKey,p=sel.split('-').map(Number);if(p.length<3||p.some(isNaN))return '';const [y,m,d]=p,iso=isoOf(y,m,d),st=dayStat(y,m,d);
 const all=tasksOf(y,m,d),isToday=iso===TODAY.iso,fut=st.k==='fut',locked=st.k==='p'||st.k==='rs';
 const canTick=!locked&&tickable(iso),canEdit=(fut||isToday)&&!locked,mt=all.filter(t=>t.owner==='me'),others=all.filter(t=>t.owner!=='me');
 const lbl=isToday?'Hôm nay':`${d}/${m+1}`;
 const byCal={};mt.forEach(t=>(byCal[t.cal]=byCal[t.cal]||[]).push(t));
 const cards=Object.keys(byCal).map(cid=>`<div class="card-b caltk"><h2>${esc((CALS.find(c=>c.id===cid)||{name:'Lịch khác'}).name)} · ${lbl} <em>${byCal[cid].filter(t=>t.done).length}/${byCal[cid].length}</em></h2>${locked?`<div class="lock-banner">${ic('lock')}<span>Việc của bạn trong ngày này đã khóa, chỉ xem lại.</span></div>`:''}<div style="margin-top:4px">${byCal[cid].map(t=>taskRow(t,!canTick,canEdit)).join('')}</div></div>`).join('');
 const empty=!mt.length?`<div class="card-b caltk"><h2>Việc của bạn · ${lbl} <em>0/0</em></h2><div class="empty" style="padding:16px 10px"><div class="ei">${ic('cal')}</div>${canEdit?'Chưa có việc nào. Thêm việc đầu tiên nhé.':'Ngày này không có việc.'}</div></div>`:'';
 const fr=others.length?`<div class="card-b caltk"><h2>Việc của bạn bè · ${lbl}</h2><div class="sub">Chỉ xem. Mỗi người tự hoàn thành việc của mình.</div><div style="margin-top:4px">${others.map(t=>taskRow(t,0,0)).join('')}</div></div>`:'';
 return `${cards}${empty}${fr}${canEdit?`<div class="btnrow" style="padding:0 14px;margin-top:10px"><button class="btn-s" data-act="addtask" data-k="${sel}">${ic('plus')} Thêm việc</button></div>`:''}<div style="height:90px"></div>`}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-act="tnote"]');if(!b)return;e.preventDefault();const id=b.dataset.id;
 if(NOTEOPEN.has(id))NOTEOPEN.delete(id);else NOTEOPEN.add(id);renderAll();if(sheetOpen&&S.sel){const p=S.sel.split('-').map(Number);if($('#sheet h2'))daySheet(p[2])}});
document.addEventListener('input',e=>{const t=e.target;if(!t||!t.dataset||t.dataset.act!=='bgc')return;THEME_DRAFT['--cal-bg']=t.value;$('#app').style.setProperty('--cal-bg',t.value)});
