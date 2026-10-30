// (Tùy chọn) Tải ảnh thẻ lên Storage riêng "cards" thay vì kéo thả trong Dashboard.
// Dùng khóa service_role TRONG PHIÊN TERMINAL CỦA BẠN. Không ghi vào file, không gửi cho ai, không commit.
//   PowerShell:  $env:SUPABASE_URL="https://xxxx.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="..."; npm run upload-cards
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong biến môi trường.'); process.exit(1) }
const sb = createClient(url, key, { auth: { persistSession: false } })
// Mặc định tải manifest.json; có thể chỉ định thêm: npm run upload-cards -- manifest-b2.json manifest-b2-supreme.json
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['manifest.json']
// Thư mục gốc = thư mục đầu tiên (_upload rồi _ready) có chứa manifest được chỉ định
const root = path.resolve(['local-cards/_upload', 'local-cards/_ready'].find((d) => fs.existsSync(path.join(d, names[0]))) || 'local-cards/_ready')
const manifest = names.flatMap((n) => JSON.parse(fs.readFileSync(path.join(root, n), 'utf8')))
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
