// Đợt thẻ 2: xử lý 612 ảnh từ thư mục Drive đã tải về theo bảng chia hạng scripts/batch2-map.json.
// Chạy:  node scripts/prepare-batch2.mjs "D:\\tai-ve\\app"        (thư mục chứa ảnh, quét cả thư mục con)
// Kết quả: local-cards/_ready/b2/<độ hiếm>/<id>.webp, local-cards/_ready/thumbs/<id>.webp, local-cards/_ready/manifest-b2.json
// Khớp theo tên file (bỏ đuôi và hậu tố " (1)"), không phân biệt hoa thường. Ảnh gốc không bị sửa, KHÔNG commit local-cards.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const src = process.argv[2]
if (!src || !fs.existsSync(src)) { console.error('Dùng: node scripts/prepare-batch2.mjs <thư mục ảnh Drive đã tải về>'); process.exit(1) }
const map = JSON.parse(fs.readFileSync(new URL('./batch2-map.json', import.meta.url), 'utf8'))
const OUT = path.resolve('local-cards/_ready')
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])
const key = (f) => path.parse(f).name.replace(/ \(\d+\)$/, '').toLowerCase()

const files = []
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (EXT.has(path.extname(e.name).toLowerCase())) files.push(p) } }
walk(path.resolve(src))
const pool = new Map()
for (const f of files.sort()) { const k = key(f); if (!pool.has(k)) pool.set(k, []); pool.get(k).push(f) }

const manifest = [], missing = [], failed = []
for (const m of map) {
  const q = pool.get(m.stem.toLowerCase())
  const f = q && q.shift()
  if (!f) { missing.push(`${m.id} ← ${m.stem}`); continue }
  const rel = `b2/${m.rarity}/${m.id}.webp`
  fs.mkdirSync(path.join(OUT, 'b2', m.rarity), { recursive: true }); fs.mkdirSync(path.join(OUT, 'thumbs'), { recursive: true })
  try {
    const info = await sharp(f).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(OUT, rel))
    await sharp(path.join(OUT, rel)).resize({ width: 360, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(OUT, 'thumbs', `${m.id}.webp`))
    manifest.push({ id: m.id, rarity: m.rarity, file: rel, width: info.width, height: info.height, bytes: info.size })
  } catch (e) { failed.push(`${m.id} ← ${path.basename(f)}: ${e.message}`) }
}
fs.writeFileSync(path.join(OUT, 'manifest-b2.json'), JSON.stringify(manifest, null, 1))
const left = [...pool.values()].flat()
console.log(`Xong ${manifest.length}/${map.length} ảnh -> ${OUT}`)
if (missing.length) console.log(`THIẾU ${missing.length} ảnh (không thấy trong thư mục):\n  ` + missing.join('\n  '))
if (failed.length) console.log(`LỖI ${failed.length} ảnh (HEIC cần đổi sang JPG trước):\n  ` + failed.join('\n  '))
if (left.length) console.log(`Còn ${left.length} tệp trong thư mục không nằm trong bảng (bỏ qua).`)
