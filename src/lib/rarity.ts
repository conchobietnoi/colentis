export const RARITIES = ['common', 'rare', 'legend', 'supreme'] as const
export type Rarity = (typeof RARITIES)[number]

export const RARITY_NAME: Record<Rarity, string> = {
  common: 'Thường',
  rare: 'Hiếm',
  legend: 'Huyền Thoại',
  supreme: 'Bá khí',
}

/** Biến CSS màu của từng độ hiếm (đặt vào --rc). */
export const RARITY_VAR: Record<Rarity, string> = {
  common: 'var(--c-common)',
  rare: 'var(--c-rare)',
  legend: 'var(--c-legend)',
  supreme: 'var(--c-supreme)',
}

/** Cặp màu gradient cho ảnh thẻ giữ chỗ (từ mockup). */
export const CARD_PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#7B61FF', '#FF7AB8'],
  ['#4CC9FF', '#7B61FF'],
  ['#FF7AB8', '#FFE45E'],
  ['#35D0A5', '#4CC9FF'],
  ['#FF9A5C', '#FF2E88'],
]

export function cardColors(i: number): readonly [string, string] {
  return CARD_PALETTE[((i % CARD_PALETTE.length) + CARD_PALETTE.length) % CARD_PALETTE.length]!
}
