// Tạo ảnh thu nhỏ (thumbnail) cho mọi thẻ từ local-cards/_ready/manifest.json.
// Chạy: npm run thumbs      Kết quả: local-cards/_ready/thumbs/<id>.webp (rộng 360px)
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve('local-cards/_ready')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'))
const out = path.join(root, 'thumbs')
fs.mkdirSync(out, { recursive: true })
let n = 0
for (const c of manifest) {
  const src = path.join(root, c.file)
  if (!fs.existsSync(src)) { console.warn('Thiếu', c.file); continue }
  await sharp(src).resize({ width: 360, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(out, `${c.id}.webp`))
  n++
}
console.log(`Đã tạo ${n} thumbnail trong ${out}`)
