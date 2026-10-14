// (Tùy chọn) Tải ảnh thẻ lên Storage riêng "cards" thay vì kéo thả trong Dashboard.
// Dùng khóa service_role TRONG PHIÊN TERMINAL CỦA BẠN. Không ghi vào file, không gửi cho ai, không commit.
//   PowerShell:  $env:SUPABASE_URL="https://xxxx.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="..."; npm run upload-cards
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong biến môi trường.'); process.exit(1) }
const sb = createClient(url, key, { auth: { persistSession: false } })
const root = path.resolve(fs.existsSync('local-cards/_upload') ? 'local-cards/_upload' : 'local-cards/_ready')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'))
let ok = 0, fail = 0
const put = async (rel, file) => {
  if (!fs.existsSync(file)) { console.warn('Thiếu', rel); fail++; return }
  const { error } = await sb.storage.from('cards').upload(rel, fs.readFileSync(file), { contentType: 'image/webp', upsert: true, cacheControl: '31536000' })
  if (error) { console.error('Lỗi', rel, error.message); fail++ } else ok++
}
for (const c of manifest) {
  await put(c.file, path.join(root, c.file))
  await put(`thumbs/${c.id}.webp`, path.join(root, 'thumbs', `${c.id}.webp`))
}
console.log(`Xong: ${ok} tệp đã tải, ${fail} lỗi/thiếu.`)
