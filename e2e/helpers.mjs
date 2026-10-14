import { launch, shot, sql, CTL } from './lib.mjs'
export { launch, shot, sql, CTL }
const BASE = 'http://localhost:54399'
await sql("update app_config set value='5000' where key='signup_cap'")
export const results = []
export const ok = (cond, msg) => { results.push([!!cond, msg]); console.log((cond ? '  ✓ ' : '  ✗ ') + msg) }
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Tạo người dùng qua API (không qua giao diện), đã nhận xong quà Tân binh. */
export async function mkUser(name, { welcome = true } = {}) {
  const rnd = Math.floor(Math.random() * 9000 + 1000)
  const email = `t${Date.now()}${rnd}@example.com`
  const username = email.split('@')[0].slice(0, 19)
  const r = await fetch(BASE + '/auth/v1/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'secret123', data: { username, display_name: name } }) })
  const s = await r.json()
  if (!s.access_token) throw new Error('signup failed ' + JSON.stringify(s))
  const call = async (fn, args = {}) => {
    const x = await fetch(BASE + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + s.access_token }, body: JSON.stringify(args) })
    const t = await x.text()
    return { ok: x.ok, status: x.status, body: t ? JSON.parse(t) : null }
  }
  const table = async (t, method = 'GET', body, qs = '') => {
    const x = await fetch(`${BASE}/rest/v1/${t}${qs}`, { method, headers: { 'content-type': 'application/json', authorization: 'Bearer ' + s.access_token, prefer: 'return=representation' }, body: body ? JSON.stringify(body) : undefined })
    const t2 = await x.text()
    return { ok: x.ok, status: x.status, body: t2 ? JSON.parse(t2) : null }
  }
  const u = { email, username, name, id: s.user.id, token: s.access_token, call, table }
  if (welcome) {
    const mid = (await sql('select mail_id from mail_recipients where user_id=$1 and mail_id in (select id from mails where kind=$2)', [u.id, 'welcome']))[0].mail_id
    await call('choose_welcome_member', { m: 'juhoon' })
    await call('claim_mail', { mid })
  }
  return u
}
export async function login(page, email, pw = 'secret123') {
  await page.goto(BASE + '/')
  await page.waitForSelector('#fe'); await page.fill('#fe', email); await page.fill('#fp2', pw); await page.click('#agb')
  await page.waitForSelector('#tabs', { state: 'visible' }); await page.waitForTimeout(1200)
  if (await page.$('#tour.on')) { await page.click('#tour [data-x=tskip]'); await page.waitForTimeout(500) }
}
/** Đóng lớp mở quà (gacha) đang hiện, nếu có. */
export async function clearG(page) {
  for (let i = 0; i < 14; i++) {
    if (!(await page.$('#g.on'))) return
    const sk = await page.$('#gskip'); if (sk && await sk.isVisible()) await sk.click().catch(() => {})
    await page.waitForTimeout(700)
    const nx = await page.$('#gb [data-gnext]'); if (nx && await nx.isVisible()) await nx.click().catch(() => {})
    const sm = await page.$('#g [data-x=gclose], #g .gdone, #g button:has-text("Đóng"), #g button:has-text("Xong")'); if (sm && await sm.isVisible()) await sm.click().catch(() => {})
    await page.waitForTimeout(600)
  }
}
export async function tab(page, name) { await clearG(page); await page.click(`#tabs >> text=${name}`); await page.waitForTimeout(500) }
export async function addTaskUi(page, title) {
  await page.click('[data-act=addtask]:visible'); await page.waitForTimeout(500)
  await page.fill('#ntitle', title); await page.click('#savet'); await page.waitForTimeout(1800)
}
/** Nhận thẻ trong ngày: bấm CTA, xác nhận, bỏ qua hoạt ảnh. */
export async function claimUi(page) {
  await page.click('[data-act=claim]:visible'); await page.waitForTimeout(800)
  await page.click('[data-act=claimgo]'); await page.waitForSelector('#gskip', { timeout: 10000 }); await page.waitForTimeout(800)
  for (let i = 0; i < 6; i++) { const b = await page.$('#gskip'); if (!b || !(await b.isVisible())) break; await b.click().catch(() => {}); await page.waitForTimeout(900) }
  await clearG(page)
  await page.waitForTimeout(800)
}
export async function finish() {
  const bad = results.filter((r) => !r[0])
  console.log(`\n${results.length - bad.length}/${results.length} đạt`)
  bad.forEach((b) => console.log('  ✗', b[1]))
  return bad.length
}
