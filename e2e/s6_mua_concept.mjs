import { launch, login, tab, mkUser, sql, ok, finish, shot, clearG } from './helpers.mjs'
import fs from 'node:fs'
console.log('S6: Mùa Concept — thư poster, thẻ ID, khung')
const U = await mkUser('Lan Mùa')
const a = await launch(); const { page } = a
await login(page, U.email)
await page.click('[data-act=mail]:visible'); await page.waitForTimeout(900)
const letter = await page.$('.letter:has-text("Mùa Concept")'); ok(!!letter, 'thư Mùa Concept có trong hòm thư'); await letter?.click(); await page.waitForTimeout(1200)
await shot(page, 's6-poster')
ok(!!(await page.$('.mph:visible')), 'poster hiện')
await page.click('[data-id-act=claim]', { force: true }); await page.waitForSelector('#idrev', { timeout: 10000 }); await page.waitForTimeout(1200)
await shot(page, 's6-reveal1')
await page.click('[data-id-act=rev2]', { force: true }); await page.waitForTimeout(900); await shot(page, 's6-reveal2')
await page.click('[data-id-act=rev3]', { force: true }); await page.waitForTimeout(800); await shot(page, 's6-members')
const st = (await sql(`select (select count(*)::int from id_cards where user_id=$1) c,(select count(*)::int from event_stash where user_id=$1) s`, [U.id]))[0]
ok(st.c === 1 && st.s === 1, 'nhận thẻ ID và gói vào kho sự kiện: ' + JSON.stringify(st))
await page.click('[data-id-act=pick][data-m=martin]'); await page.waitForTimeout(300)
await page.click('[data-id-act=confirm]'); await page.waitForSelector('#pgId.on', { timeout: 8000 }); await page.waitForTimeout(1000)
await shot(page, 's6-card')
ok((await sql(`select member from id_cards where user_id=$1`, [U.id]))[0].member === 'martin', 'chọn Martin được lưu')
await page.setInputFiles('#idfile', '/tmp/av.png'); await page.waitForTimeout(900)
await page.fill('#idname', 'Lan Mùa'); await page.waitForTimeout(300)
await page.fill('[data-id-rng=z]', '1.6'); await page.waitForTimeout(300)
await shot(page, 's6-edit')
await page.click('[data-id-act=save]'); await page.waitForTimeout(3500)
const r = (await sql(`select holder, photo_path, crop from id_cards where user_id=$1`, [U.id]))[0]
ok(r.holder === 'Lan Mùa' && r.photo_path?.startsWith(U.id + '/idcard-'), 'lưu tên và ảnh: ' + JSON.stringify(r))
ok((await sql(`select count(*)::int n from user_titles where user_id=$1 and title_id='idcard-martin'`, [U.id]))[0].n === 1, 'mở khóa danh hiệu khung Martin')
await shot(page, 's6-saved'); await clearG(page)
await page.click('[data-act=back][data-p=pgId]'); await page.waitForTimeout(500)
await page.click('[data-act=mail]:visible').catch(()=>{});
await sql(`update profiles set equipped_title='idcard-martin' where id=$1`, [U.id]); await page.reload(); await page.waitForTimeout(2500)
await tab(page, 'Hồ sơ'); await page.waitForTimeout(900); await shot(page, 's6-profile')
await tab(page, 'Ảnh'); await page.waitForTimeout(900); await shot(page, 's6-col')
const real = a.logs.filter(l => !/status of 400/.test(l)) // shim không có event_assets / ảnh panorama: dự phòng im lặng
ok(real.length === 0, 'không lỗi JS: ' + real.join('|').slice(0, 400))
await a.browser.close()
process.exit(await finish() ? 1 : 0)
