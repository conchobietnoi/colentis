import fs from 'node:fs'
import { chromium } from 'playwright'
export const URL = 'http://localhost:54399/'
export const CTL = async (p, body = {}) => (await fetch('http://localhost:54399/__ctl/' + p, { method: 'POST', body: JSON.stringify(body) })).json()
export const sql = (s, params) => CTL('sql', { sql: s, params })
export async function launch(opts = {}) {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
  const ctx = await browser.newContext({ viewport: { width: 420, height: 860 }, serviceWorkers: 'block', locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh', ...opts })
  const page = await ctx.newPage()
  const logs = []
  page.on('console', (m) => { if (m.type() === 'error' && !/WebSocket|realtime|net::ERR/i.test(m.text())) logs.push('console.error: ' + m.text().slice(0, 300)) })
  page.on('pageerror', (e) => logs.push('PAGEERROR: ' + e.message + '\n' + (e.stack ?? '').split('\n').slice(0, 5).join('\n')))
  if (process.env.DEBUGNET) page.on('response', async (r) => { if (r.status() >= 400) console.log('  [net]', r.status(), r.request().method(), r.url().replace(URL, '/'), (await r.text().catch(() => '')).slice(0, 160)) })
  return { browser, ctx, page, logs }
}
export const shot = (page, n) => (fs.mkdirSync('e2e/out', { recursive: true }), page).screenshot({ path: `e2e/out/${n}.png` })
