// Tải 40 ảnh POLA DAY (local-cards/pola/*.webp) lên bucket riêng "pola". Dùng khóa service_role trong phiên PowerShell của bạn.
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Thieu SUPABASE_URL hoac SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const sb = createClient(url, key, { auth: { persistSession: false } })
const dir = path.resolve('local-cards/pola')
const files = fs.readdirSync(dir).filter((f) => /^[a-z]+-[1-8]\.webp$/.test(f))
let ok = 0, fail = 0
for (const f of files) {
  for (let t = 0; t < 4; t++) {
    const { error } = await sb.storage.from('pola').upload(f, fs.readFileSync(path.join(dir, f)), { contentType: 'image/webp', upsert: true })
    if (!error) { ok++; break }
    if (t === 3) { console.warn('Loi', f, error.message); fail++ } else await new Promise((r) => setTimeout(r, 1500 * (t + 1)))
  }
}
console.log(`Xong: ${ok}/${files.length} anh pola, ${fail} loi.`)
