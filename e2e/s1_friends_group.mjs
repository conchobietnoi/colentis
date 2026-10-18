import { CTL, launch, login, tab, addTaskUi, claimUi, mkUser, sql, ok, finish, shot } from './helpers.mjs'
console.log('S1: kết bạn, lịch chung, thẻ nhóm')
await CTL('now', { iso: '2026-10-14T10:00:00+07:00' })
const A = await mkUser('Ánh Dương'), B = await mkUser('Bình Minh')
const a = await launch(), b = await launch()
await login(a.page, A.email)
await tab(a.page, 'Bạn bè'); await a.page.fill('#q', B.username); await a.page.waitForSelector('[data-x=addf]', { timeout: 8000 }); await a.page.click('[data-x=addf]'); await a.page.waitForTimeout(1200)
ok((await sql(`select status from friendships where requester=$1`, [A.id]))[0]?.status === 'pending', 'A gửi lời mời kết bạn qua giao diện')
await login(b.page, B.email); await tab(b.page, 'Bạn bè')
await b.page.waitForSelector('[data-x=nacc]', { timeout: 8000 }); await b.page.click('[data-x=nacc]'); await b.page.waitForTimeout(1500)
ok((await sql(`select status from friendships where requester=$1`, [A.id]))[0]?.status === 'accepted', 'B chấp nhận lời mời')
await shot(b.page, 's1-b-friends')
// tạo lịch chung và mời bằng API
const cal = (await A.call('create_calendar', { nm: 'Nhóm học' })).body
const inv = (await A.call('invite_to_calendar', { cal, friend: B.id })).body
ok(!!inv, 'A mời B vào lịch chung')
await b.page.reload(); await b.page.waitForTimeout(2500)
await b.page.click('[data-x=notif]:visible'); await b.page.waitForTimeout(800)
await shot(b.page, 's1-b-notif')
const accBtn = await b.page.$('[data-x=nacc]:visible')
if (accBtn) { await accBtn.click(); await b.page.waitForTimeout(1500) }
ok((await sql(`select count(*)::int n from calendar_members where calendar_id=$1 and left_on is null`, [cal]))[0].n === 2, 'B vào lịch qua giao diện')
// thẻ nhóm chỉ tính từ ngày sau khi vào lịch: tua sang hôm sau
await CTL('now', { iso: '2026-10-15T10:00:00+07:00' })
// cả hai thêm việc trong lịch chung, tick xong, nhận thẻ
await a.page.reload(); await a.page.waitForTimeout(2500); await b.page.reload(); await b.page.waitForTimeout(2500)
for (const [p, n] of [[a.page, 'A'], [b.page, 'B']]) {
  await tab(p, 'Hôm nay')
  await p.click('[data-act=addtask]:visible'); await p.waitForTimeout(500)
  await p.fill('#ntitle', 'Việc nhóm ' + n)
  const chips = await p.$$('.cl'); for (const c of chips) if ((await c.textContent()).includes('Nhóm học')) await c.click()
  await p.click('#savet'); await p.waitForTimeout(1800)
}
ok((await sql(`select count(*)::int n from tasks where calendar_id=$1`, [cal]))[0].n === 2, 'hai việc nằm trong lịch chung')
for (const p of [a.page, b.page]) { await tab(p, 'Lịch'); await p.click('[data-act=cals]'); await p.waitForTimeout(500); await p.click('.mid[data-act=pickcal]:has-text("Nhóm học")'); await p.waitForTimeout(900); const cks = await p.$$('.t:not(.oth) .ck:visible'); for (const c of cks) { await c.click(); await p.waitForTimeout(1000) } }
ok((await sql(`select count(*)::int n from tasks where calendar_id=$1 and done`, [cal]))[0].n === 2, 'cả hai tick xong')
await tab(a.page, 'Hôm nay'); await claimUi(a.page); await tab(b.page, 'Hôm nay'); await claimUi(b.page)
const g = await sql(`select user_id, card_id from reward_grants where source='group' and calendar_id=$1`, [cal])
ok(g.length === 2 && g[0].card_id === g[1].card_id, 'cả nhóm nhận cùng một thẻ nhóm: ' + g.map((x) => x.card_id).join(','))
ok((await sql(`select count(*)::int n from reward_grants where source='personal' and user_id in ($1,$2)`, [A.id, B.id]))[0].n === 2, 'mỗi người một thẻ cá nhân')
const errs = [...a.logs, ...b.logs]; ok(errs.length === 0, 'không có lỗi JS/console: ' + errs.join(' | ').slice(0, 300))
await CTL('now', { iso: null })
await a.browser.close(); await b.browser.close()
process.exit(await finish() ? 1 : 0)
