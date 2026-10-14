// Chạy: npm i -D sharp   (một lần)   rồi   node scripts/prepare-cards.mjs
// Đọc ảnh gốc trong local-cards/{common,rare,legendary,supreme}/ (mọi tỉ lệ, jpg/png/webp),
// thu nhỏ cạnh dài tối đa 1600px, KHÔNG cắt, xuất .webp vào local-cards/_ready/<độ hiếm>/
// và ghi local-cards/_ready/manifest.json (id, độ hiếm, rộng, cao). Ảnh gốc không bị sửa.
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('local-cards')
const OUT = path.join(ROOT, '_ready')
const RARITIES = ['common', 'rare', 'legendary', 'supreme']
// Thẻ sự kiện: KHÔNG nằm trong kho quay ngẫu nhiên, chỉ tặng theo sự kiện.
// Mọi thư mục bắt đầu bằng 'event-' đều là thẻ sự kiện (mỗi năm một bộ mới, ví dụ event-birthday-james-2027).
const EVENTS = (await fs.readdir(ROOT, { withFileTypes: true })).filter(d => d.isDirectory() && d.name.startsWith('event-')).map(d => d.name)
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MAX = 1600

const manifest = []
for (const rarity of [...RARITIES, ...EVENTS]) {
  const dir = path.join(ROOT, rarity)
  let files = []
  try { files = (await fs.readdir(dir)).filter(f => EXT.has(path.extname(f).toLowerCase())).sort() } catch { continue }
  await fs.mkdir(path.join(OUT, rarity), { recursive: true })
  const isEvent = EVENTS.includes(rarity)
  if (isEvent) { const order = ['A', 'S', 'SS', 'SSS', 'AURA']; files.sort((a, b) => order.indexOf(path.parse(a).name.toUpperCase()) - order.indexOf(path.parse(b).name.toUpperCase())) }
  let n = 0
  for (const f of files) {
    n++
    const tier = path.parse(f).name.toUpperCase()
    const id = isEvent ? `${rarity}-${tier}` : `${rarity}-${String(n).padStart(2, '0')}`
    const dest = path.join(OUT, rarity, `${id}.webp`)
    const info = await sharp(path.join(dir, f))
      .rotate()
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest)
    manifest.push({ id, rarity: EVENTS.includes(rarity) ? 'event' : rarity, event: EVENTS.includes(rarity) ? rarity : undefined, source: f, file: `${rarity}/${id}.webp`, tier: isEvent ? tier : undefined, orientation: info.width > info.height * 1.05 ? 'landscape' : 'portrait', width: info.width, height: info.height, bytes: info.size })
  }
  console.log(`${rarity}: ${files.length} ảnh`)
}
await fs.mkdir(OUT, { recursive: true })
await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1))
const big = manifest.filter(m => m.bytes > 400_000)
console.log(`Xong ${manifest.length} ảnh -> local-cards/_ready/`)
if (big.length) console.log(`Lưu ý: ${big.length} ảnh còn trên 400KB, cân nhắc giảm quality.`)
