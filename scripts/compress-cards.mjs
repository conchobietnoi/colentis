// Nén ảnh thẻ cho nhẹ (mỗi tệp <= ~1.5 MB) và tạo thumbnail.
// Đọc:  local-cards/_ready/  (ảnh gốc, KHÔNG bị sửa)
// Ghi:  local-cards/_upload/ (cùng cấu trúc + thumbs/ + manifest.json) -> đây là thư mục để tải lên Storage
// Chạy: npm run compress
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const src = path.resolve('local-cards/_ready')
const dst = path.resolve('local-cards/_upload')
const LIMIT = 1.5 * 1024 * 1024
const MAX_SIDE = 1800
const manifest = JSON.parse(fs.readFileSync(path.join(src, 'manifest.json'), 'utf8'))
fs.mkdirSync(path.join(dst, 'thumbs'), { recursive: true })
fs.copyFileSync(path.join(src, 'manifest.json'), path.join(dst, 'manifest.json'))

let n = 0, before = 0, after = 0
for (const c of manifest) {
  const from = path.join(src, c.file)
  if (!fs.existsSync(from)) { console.warn('Thiếu', c.file); continue }
  const to = path.join(dst, c.file)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  let side = MAX_SIDE, q = 82, buf
  for (;;) {
    buf = await sharp(from).rotate().resize({ width: side, height: side, fit: 'inside', withoutEnlargement: true }).webp({ quality: q }).toBuffer()
    if (buf.length <= LIMIT || (q <= 50 && side <= 900)) break
    if (q > 50) q -= 8; else side = Math.round(side * 0.85)
  }
  fs.writeFileSync(to, buf)
  await sharp(from).rotate().resize({ width: 360, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(dst, 'thumbs', `${c.id}.webp`))
  before += fs.statSync(from).size; after += buf.length; n++
  console.log(`${c.file}: ${(fs.statSync(from).size / 1048576).toFixed(1)} MB -> ${(buf.length / 1048576).toFixed(2)} MB`)
}
console.log(`\nXong ${n} thẻ. Tổng ${(before / 1048576).toFixed(0)} MB -> ${(after / 1048576).toFixed(0)} MB. Tải thư mục local-cards\\_upload lên Storage.`)
