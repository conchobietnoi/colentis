import { CTL, launch, login, tab, mkUser, sql, ok, finish, shot } from './helpers.mjs'
console.log('S3: lỡ ngày, tick bù, thẻ cứu')
const D1 = '2026-10-14', NOW1 = '2026-10-14T10:00:00+07:00', NOW2 = '2026-10-15T10:00:00+07:00'
await CTL('now', { iso: '2026-10-13T10:00:00+07:00' })
const R = await mkUser('Rescue'), T = await mkUser('TickBu')
await sql(`update profiles set created_at = $1 where id in ($2,$3)`, ['2026-10-13T10:00:00+07:00', R.id, T.id])
await CTL('now', { iso: NOW1 })
for (const u of [R, T]) { const cal = (await u.table('calendars', 'GET')).body[0].id; const r = await u.table('tasks', 'POST', { calendar_id: cal, day: D1, title: 'Việc hôm qua' }); if (!r.ok) throw new Error(JSON.stringify(r.body)) }
await CTL('now', { iso: NOW2 })
// R: dùng thẻ cứu
const a = await launch(); await login(a.page, R.email); await tab(a.page, 'Hôm nay')
await shot(a.page, 's3-today')
const banner = await a.page.$('.banner.warn'); ok(!!banner, 'hiện banner "chưa xong, chuỗi đang chờ nối"')
const sv = await a.page.$('.banner.warn [data-act=saver]')
ok(!!sv, 'có nút dùng thẻ cứu')
if (sv) { await sv.click(); await a.page.waitForTimeout(1200) }
const cf = await a.page.$('[data-x=cfok]:visible'); if (cf) { await cf.click(); await a.page.waitForTimeout(1800) }
ok((await sql(`select reason from day_locks where user_id=$1 and day=$2`, [R.id, D1]))[0]?.reason === 'rescue', 'ngày được khóa bằng thẻ cứu')
// T: tick bù
const b = await launch(); await login(b.page, T.email); await tab(b.page, 'Hôm nay')
await b.page.click('.banner.warn [data-act=catch]'); await b.page.waitForTimeout(900)
await shot(b.page, 's3-daysheet2')
const ck = await b.page.$('#sheet .ck:visible'); ok(!!ck, 'trong ngày bị lỡ có thể tick bù')
if (ck) { await ck.click(); await b.page.waitForTimeout(1800) }
ok((await sql(`select done from tasks where owner_id=$1`, [T.id]))[0].done === true, 'tick bù được ghi')
await b.page.reload(); await b.page.waitForTimeout(2500); await shot(b.page, 's3-after')
const streak = (await T.call('me')).body.streak
ok(streak >= 1, 'chuỗi được nối lại, streak=' + streak)
await CTL('now', { iso: null })
ok(a.logs.length + b.logs.length === 0, 'không lỗi JS: ' + [...a.logs, ...b.logs].join('|').slice(0, 300))
await a.browser.close(); await b.browser.close()
process.exit(await finish() ? 1 : 0)
