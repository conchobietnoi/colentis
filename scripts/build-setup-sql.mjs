// Gộp supabase/migrations/*.sql thành một tệp dán vào SQL Editor một lần: supabase/setup-all.sql
import fs from 'node:fs'
const dir = 'supabase/migrations'
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
const body = files.map((f) => `-- ============================================================\n-- ${f}\n-- ============================================================\n${fs.readFileSync(`${dir}/${f}`, 'utf8')}`).join('\n\n')
fs.writeFileSync('supabase/setup-all.sql', `-- Colentis: toàn bộ cơ sở dữ liệu. Dán cả tệp vào Supabase > SQL Editor > Run (chỉ chạy MỘT lần trên dự án mới).\n\n${body}\n`)
console.log('Đã tạo supabase/setup-all.sql từ', files.length, 'tệp')
