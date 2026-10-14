import type { CSSProperties } from 'react'
import { RARITIES, RARITY_NAME, RARITY_VAR, CARD_PALETTE } from '../../lib/rarity'
import { Section, Spec, Sub } from './shared'

const SURFACES = [
  { token: 'sleeve', v: '--c-sleeve', light: '#E6E9FF', dark: '#17143F', use: 'Nền màn' },
  { token: 'paper', v: '--c-paper', light: '#F7F8FF', dark: '#221E55', use: 'Thẻ, ô ngày, sheet' },
  { token: 'line', v: '--c-line', light: '#C9CEF5', dark: '#38337F', use: 'Viền, gạch đứt' },
  { token: 'ink', v: '--c-ink', light: '#1E1B5E', dark: '#F1F0FF', use: 'Chữ chính, nút tối' },
  { token: 'soft', v: '--c-soft', light: '#5B5F9E', dark: '#A7A9E6', use: 'Chữ phụ' },
  { token: 'stamp', v: '--c-stamp-bg', light: '#1E1B5E', dark: '#FFE45E', use: 'Nhãn streak/danh hiệu' },
]

const ACCENTS = [
  { token: 'pink', v: '--c-pink', hex: '#FF2E88', use: 'Hành động chính, hôm nay' },
  { token: 'sky', v: '--c-sky', hex: '#4CC9FF', use: 'Thông tin, focus' },
  { token: 'butter', v: '--c-butter', hex: '#FFE45E', use: 'Streak, nhận quà, tick' },
  { token: 'violet', v: '--c-violet', hex: '#7B61FF', use: 'Màu thành viên / thẻ' },
  { token: 'blush', v: '--c-blush', hex: '#FF7AB8', use: 'Màu thành viên / thẻ' },
  { token: 'mint', v: '--c-mint', hex: '#35D0A5', use: 'Màu thành viên / thẻ' },
  { token: 'peach', v: '--c-peach', hex: '#FF9A5C', use: 'Màu thành viên / thẻ' },
  { token: 'danger', v: '--c-danger', hex: '#E5484D', use: 'Lỗi, xóa' },
]

const RARITY_HEX = { common: '#8D94B8', rare: '#2F8CFF', legend: '#9B5CFF', supreme: '#FF2E88' } as const

const TYPE = [
  { cls: 'text-display font-black', name: 'display · 42/900', sample: 'Tháng 10' },
  { cls: 'text-h1 font-black', name: 'h1 · 34/900', sample: 'Bộ sưu tập' },
  { cls: 'text-h2 font-black', name: 'h2 · 22/900', sample: 'Thứ Ba, 13/10' },
  { cls: 'text-h3 font-black', name: 'h3 · 15/900', sample: 'Việc hôm nay' },
  { cls: 'text-body font-medium', name: 'body · 14/500', sample: 'Gọi lại cho khách lúc 11 giờ rưỡi' },
  { cls: 'text-meta font-bold', name: 'meta · 12/700', sample: 'Lịch nhóm bạn · 3 người' },
  { cls: 'text-micro font-medium', name: 'micro · 11/500', sample: 'T2 T3 T4 T5 T6 T7 CN' },
]

const RADII = [
  ['cell', 8, 'Ô ngày'],
  ['tile', 9, 'Ảnh album'],
  ['field', 14, 'Ô nhập, menu'],
  ['btn', 16, 'Nút lớn'],
  ['card', 18, 'Thẻ'],
  ['fab', 20, 'Nút +'],
  ['sheet', 26, 'Bottom sheet'],
] as const

function ColorChip({ v, title, sub, use }: { v: string; title: string; sub: string; use: string }) {
  return (
    <div className="overflow-hidden rounded-card border-[1.5px] border-line bg-paper">
      <div className="h-16" style={{ background: `var(${v})` }} />
      <div className="p-2.5">
        <div className="text-body font-black">{title}</div>
        <div className="font-mono text-micro text-soft">{sub}</div>
        <div className="mt-0.5 text-micro text-soft">{use}</div>
      </div>
    </div>
  )
}

export function Foundations() {
  return (
    <>
      <Section
        id="mau"
        title="Màu"
        note="Tokens nằm ở src/styles/tokens.css. Bề mặt và chữ tự đảo khi máy ở chế độ tối; màu nhấn và độ hiếm giữ nguyên. Đổi Sáng/Tối ở thanh trên để xem."
      >
        <Sub title="Bề mặt và chữ (sáng / tối)">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {SURFACES.map((c) => (
              <ColorChip key={c.token} v={c.v} title={c.token} sub={`${c.light} / ${c.dark}`} use={c.use} />
            ))}
          </div>
        </Sub>
        <Sub title="Nhấn — tím / hồng / xanh / vàng">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {ACCENTS.map((c) => (
              <ColorChip key={c.token} v={c.v} title={c.token} sub={c.hex} use={c.use} />
            ))}
          </div>
        </Sub>
        <Sub title="Độ hiếm">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {RARITIES.map((r) => (
              <div
                key={r}
                className="flex items-center gap-3 rounded-card border-[2.5px] bg-paper p-3"
                style={{ borderColor: RARITY_VAR[r] }}
              >
                <span className="h-9 w-9 shrink-0 rounded-full" style={{ background: RARITY_VAR[r] }} />
                <span>
                  <b className="block text-body">{RARITY_NAME[r]}</b>
                  <span className="font-mono text-micro text-soft">
                    {r} · {RARITY_HEX[r]}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Sub>
        <Sub title="Gradient thẻ giữ chỗ (dùng tới khi có ảnh thật)">
          <div className="flex flex-wrap gap-3">
            {CARD_PALETTE.map(([a, b]) => (
              <Spec key={a + b} label={`${a} → ${b}`}>
                <div className="card-art aspect-3/4 w-16 rounded-tile" style={{ '--a': a, '--b': b } as CSSProperties} />
              </Spec>
            ))}
          </div>
        </Sub>
      </Section>

      <Section id="chu" title="Chữ" note="Be Vietnam Pro, đóng gói trong app qua @fontsource (chạy offline). Cỡ theo màn 390pt.">
        <div className="divide-y-[1.5px] divide-dashed divide-line rounded-card border-[1.5px] border-line bg-paper px-4">
          {TYPE.map((t) => (
            <div key={t.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
              <span className={t.cls}>{t.sample}</span>
              <span className="font-mono text-micro text-soft">{t.name}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-meta text-soft">
          Kiểm dấu: Ảnh Huyền Thoại · Bá khí · ngậm cục cơm · quỵt mệch · Ngọ · ỷ ẫ ự ợ ữ ậ ẵ
        </p>
      </Section>

      <Section id="hinh" title="Bo góc, viền, bóng">
        <div className="flex flex-wrap gap-4">
          {RADII.map(([k, px, use]) => (
            <Spec key={k} label={`${k} · ${px}px · ${use}`}>
              <div className="h-16 w-20 border-[1.5px] border-line bg-paper" style={{ borderRadius: px }} />
            </Spec>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <Spec label="Viền thường 1.5px line">
            <div className="h-14 w-24 rounded-card border-[1.5px] border-line bg-paper" />
          </Spec>
          <Spec label="Gạch đứt 1.5px — phân cách hàng">
            <div className="h-14 w-24 border-t-[1.5px] border-dashed border-line" />
          </Spec>
          <Spec label="Viền độ hiếm 2.5px">
            <div className="h-14 w-24 rounded-card border-[2.5px] border-legend bg-paper" />
          </Spec>
          <Spec label="shadow-fab">
            <div className="h-14 w-14 -rotate-6 rounded-fab bg-pink shadow-fab" />
          </Spec>
        </div>
      </Section>
    </>
  )
}
