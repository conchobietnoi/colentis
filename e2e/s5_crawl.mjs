import { CTL, launch, login, tab, mkUser, sql, ok, finish, shot, clearG } from './helpers.mjs'
console.log('S5: duyệt qua mọi màn hình, tìm lỗi JS')
const A = await mkUser('Khánh Linh'), B = await mkUser('Gia Bảo')
await A.call('send_friend_request', { u: B.username }); const f = (await sql('select id from friendships where requester=$1', [A.id]))[0].id; await B.call('respond_friend', { fid: f, accept: true })
const cal = (await A.call('create_calendar', { nm: 'Lịch nhóm' })).body; await A.call('invite_to_calendar', { cal, friend: B.id })
const inv = (await sql('select id from calendar_invites where invitee=$1', [B.id]))[0].id; await B.call('respond_invite', { inv, accept: true })
await A.table('tasks', 'POST', { calendar_id: cal, day: '2026-10-14', title: 'Họp nhóm' })
const a = await launch(); const { page } = a
await login(page, A.email); await clearG(page)
const SKIP = /signout|delete|del\b|leave|unfriend|claim|rm\b|send|cfok|saver|catch|addtask|tick|nacc|ndec|reset|remove|transfer|pick|gskip|gnext/
const seen = new Set()
for (const t of ['Lịch', 'Hôm nay', 'Ảnh', 'Bạn bè', 'Hồ sơ']) {
  await tab(page, t)
  const sels = await page.$$eval(`#${{ 'Lịch': 'cal', 'Hôm nay': 'today', 'Ảnh': 'col', 'Bạn bè': 'fr', 'Hồ sơ': 'pro' }[t]} [data-act], #${{ 'Lịch': 'cal', 'Hôm nay': 'today', 'Ảnh': 'col', 'Bạn bè': 'fr', 'Hồ sơ': 'pro' }[t]} [data-x]`, (els) => els.map((e) => (e.dataset.act ? `[data-act="${e.dataset.act}"]` : `[data-x="${e.dataset.x}"]`)))
  for (const s of [...new Set(sels)]) {
    if (SKIP.test(s) || seen.has(t + s)) continue
    seen.add(t + s)
    const el = await page.$(`#tabs ~ *, body`).then(() => page.$(`${s}:visible`)).catch(() => null)
    if (!el) continue
    const before = a.logs.length
    await el.click({ timeout: 3000 }).catch(() => {})
    await page.waitForTimeout(700)
    await clearG(page)
    if (a.logs.length > before) console.log('  ✗ lỗi sau khi bấm', t, s, a.logs.slice(before).join(' | ').slice(0, 240))
    await shot(page, 's5-x-' + (t + s).replace(/\W/g, '').slice(0, 40))
    await page.reload(); await page.waitForTimeout(1800); await clearG(page)
    if (await page.$('#tour.on')) await page.click('#tour [data-x=tskip]').catch(() => {})
    await tab(page, t)
  }
  await shot(page, 's5-' + t.replace(/\W/g, ''))
}
console.log('  đã bấm', seen.size, 'điều khiển')
ok(a.logs.length === 0, 'không lỗi JS khi duyệt: ' + a.logs.join(' | ').slice(0, 500))
await a.browser.close()
process.exit(await finish() ? 1 : 0)
