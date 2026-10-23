import { launch, login, tab, mkUser, sql, ok, finish, shot, addTaskUi, clearG } from './helpers.mjs'
import zlib from 'node:zlib'
import fs from 'node:fs'
console.log('S10: check in bằng ảnh vuông')
const A = await mkUser('Alice Chụp'), AD = await mkUser('Admin Chụp')
await sql('update profiles set is_admin=true where id=$1', [AD.id])
const mk = async (page, title) => { await tab(page, 'Lịch'); await addTaskUi(page, title) }
const CAM = { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'], permissions: ['camera'] }
// ---- thành viên ----
const a = await launch(CAM); const { page } = a
await login(page, A.email)
await mk(page, 'Chạy bộ 3km')
await page.waitForSelector('.t .ci-cam'); ok(true, 'việc của mình có nút máy ảnh')
await shot(page, 's10-row')
await page.click('.t .ci-cam'); await page.waitForTimeout(1200)
ok(await page.isVisible('#pgCam #ciVid'), 'mở màn máy ảnh')
ok(!(await page.isVisible('#ciCtlLive .ci-side.adm')), 'thành viên không có nút chọn ảnh từ máy')
ok((await page.$$('#ciCamsel button')).length === 2, 'có chọn cam sau / cam trước')
const vw = await page.evaluate(() => document.querySelector('#ciVid').videoWidth)
ok(vw > 0, 'camera giả lập có hình (' + vw + ')')
await shot(page, 's10-cam')
await page.click('[data-ci=side][data-c=front]'); await page.waitForTimeout(900)
ok((await page.textContent('#ciRec')).includes('TRƯỚC'), 'đổi sang cam trước')
await page.click('[data-ci=side][data-c=back]'); await page.waitForTimeout(900)
await page.click('[data-ci=zoom][data-z="2"]'); await page.waitForTimeout(300)
await page.click('[data-ci=shot]'); await page.waitForTimeout(900)
ok(await page.isVisible('#ciVf.prev .ci-pv'), 'có ảnh xem trước')
ok(await page.isVisible('#ciVf .cstamp'), 'dấu mộc Colentis trên ảnh xem trước')
await page.fill('#ciCap', 'Trời mát')
await shot(page, 's10-prev')
await page.click('[data-ci=send]'); await page.waitForSelector('#ciDone.on', { timeout: 10000 }); await page.waitForTimeout(500)
const row = (await sql(`select tp.source, tp.path, t.done, t.note from task_photos tp join tasks t on t.id=tp.task_id where tp.owner_id=$1`, [A.id]))[0]
ok(row && row.source === 'camera' && /\/cam-\d+\.jpg$/.test(row.path), 'ảnh lưu ở bucket với nguồn camera')
ok(row.done === true, 'check in xong thì việc được đánh dấu xong')
ok(row.note === 'Trời mát', 'dòng thêm được nối vào ghi chú')
const bytes = (await sql(`select count(*)::int n from storage.objects where bucket_id='checkins'`))[0].n
ok(bytes === 1, 'có 1 tệp trong bucket checkins')
await shot(page, 's10-done')
await clearG(page); ok((await sql(`select count(*)::int n from user_titles where user_id=$1 and title_id='photo-1'`, [A.id]))[0].n === 1, 'ảnh đầu tiên nhận danh hiệu sống ảo có tâm')
await page.click('[data-ci=done]'); await page.waitForTimeout(1200)
ok(await page.isVisible('.t .ci-nph .cstamp'), 'ảnh + dấu mộc nằm trong ghi chú xổ xuống')
const loaded = await page.evaluate(() => { const i = document.querySelector('.t .ci-nph img'); return i && i.complete && i.naturalWidth > 0 })
ok(loaded, 'ảnh trong ghi chú tải được qua URL ký')
ok(await page.isVisible('.t .ci-nph [data-ci=cam]'), 'có nút Chụp lại')
await shot(page, 's10-note')
// chụp lại thay ảnh cũ
await page.click('.t .ci-nph [data-ci=cam]'); await page.waitForTimeout(1200)
await page.click('[data-ci=shot]'); await page.waitForTimeout(900); await page.click('[data-ci=send]'); await page.waitForSelector('#ciDone.on', { timeout: 10000 }); await clearG(page)
ok((await sql(`select count(*)::int n from storage.objects where bucket_id='checkins'`))[0].n === 1, 'chụp lại: tệp cũ bị xóa, còn đúng 1 tệp')
await page.click('[data-ci=done]'); await page.waitForTimeout(800)
// bộ sưu tập
await tab(page, 'Ảnh'); await page.click('[data-ci=tab][data-t=photos]'); await page.waitForTimeout(1500)
ok((await page.$$('.ci-pc')).length === 1, 'tab Ảnh của bản thân có 1 ảnh')
ok((await page.textContent('.ci-pc')).includes('Chạy bộ 3km'), 'ảnh ghi rõ tên nhiệm vụ')
await shot(page, 's10-col')
await page.click('.ci-pc'); await page.waitForTimeout(700)
ok(await page.isVisible('#pgPhoto .ci-vinfo h2'), 'mở trình xem ảnh')
await shot(page, 's10-view')
await page.click('[data-ci=vgo]'); await page.waitForTimeout(1500)
ok(await page.isVisible('.t .ci-nph'), '"Xem trong ghi chú" mở đúng việc')
// người cùng lịch thấy ảnh (RLS)
ok(!(await A.call('my_checkins', {})).body.length === false, 'my_checkins trả ảnh')
const real = a.logs.filter(l => !/status of 4/.test(l))
ok(real.length === 0, 'không lỗi JS (thành viên): ' + real.join('|').slice(0, 500))
await a.browser.close()
// ---- admin ----
function png(w, h) {
  const raw = Buffer.alloc((w * 3 + 1) * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = x * 255 / w; raw[o + 1] = y * 255 / h; raw[o + 2] = 160 }
  const crc = (b) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } let r = -1; for (const x of b) r = t[(r ^ x) & 255] ^ (r >>> 8); return (r ^ -1) >>> 0 }
  const ch = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]) }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))])
}
fs.mkdirSync('e2e/out', { recursive: true }); fs.writeFileSync('e2e/out/wide.png', png(400, 240))
const b = await launch(CAM); const p2 = b.page
await login(p2, AD.email)
await mk(p2, 'Ảnh từ máy')
await p2.click('.t .ci-cam'); await p2.waitForTimeout(1200)
ok(await p2.isVisible('#ciCtlLive .ci-side.adm'), 'admin có nút chọn ảnh từ máy')
await p2.setInputFiles('#ciFile', 'e2e/out/wide.png'); await p2.waitForTimeout(1200)
ok(await p2.isVisible('#ciCropBox'), 'hiện màn căn ảnh 1:1')
await p2.click('[data-ci=rot]'); await p2.fill('#ciZm', '1.6'); await p2.dispatchEvent('#ciZm', 'input'); await p2.waitForTimeout(300)
await shot(p2, 's10-crop')
await p2.click('[data-ci=usecrop]'); await p2.waitForTimeout(800)
ok(await p2.isVisible('#ciVf.prev .ci-pv'), 'ảnh cắt hiện ở bước xem trước')
await p2.click('[data-ci=send]'); await p2.waitForSelector('#ciDone.on', { timeout: 10000 }); await clearG(p2)
const r2 = (await sql(`select source, path from task_photos where owner_id=$1`, [AD.id]))[0]
ok(r2 && r2.source === 'upload' && /\/up-\d+\.jpg$/.test(r2.path), 'ảnh admin tải lên có nguồn upload')
// thành viên thường không ghi được đường dẫn up-
const t = (await sql(`select id, calendar_id from tasks where owner_id=$1`, [A.id]))[0]
const bad = await A.call('set_task_photo', { tid: t.id, p_path: `${t.calendar_id}/${t.id}/up-1.jpg`, p_source: 'upload' })
ok(!bad.ok, 'thành viên thường không gắn được ảnh nguồn upload')
const real2 = b.logs.filter(l => !/status of 4/.test(l))
ok(real2.length === 0, 'không lỗi JS (admin): ' + real2.join('|').slice(0, 500))
await b.browser.close()
process.exit((await finish()) ? 1 : 0)
