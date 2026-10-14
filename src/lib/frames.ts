import type { Rarity } from './rarity'

const base = 'assets/frames/'

export const AVATAR_FRAMES: Record<Rarity, string> = {
  common: base + 'avatar/frame-common.svg',
  rare: base + 'avatar/frame-rare.svg',
  legend: base + 'avatar/frame-legend.svg',
  supreme: base + 'avatar/frame-supreme.svg',
}
export const AVATAR_INNER = 0.78

export const MEMBERS = ['james', 'juhoon', 'keonho', 'martin', 'seonghyeon'] as const
export type Member = (typeof MEMBERS)[number]

export const secretFrame = (m: Member) => `${base}secret/frame-secret-${m}.svg`
export const titleFrame = (m: Member) => `${base}title/title-frame-${m}.svg`
export const SECRET_INNER = 0.625

export const BIRTHDAY_FRAME = base + 'event/frame-birthday-james.svg'
export const BIRTHDAY_TITLE_FRAME = base + 'title/title-frame-birthday-james.svg'

/** Bảng danh hiệu (PLAN.md mục 8) — giữ nguyên chữ người dùng đặt. */
export const TITLES: ReadonlyArray<{ condition: string; name: string }> = [
  { condition: 'Streak 3 ngày', name: 'dạ gỗ xà cừ' },
  { condition: 'Streak 7 ngày', name: 'trường giang' },
  { condition: 'Streak 14 ngày', name: '14 ngày nhớ em remix' },
  { condition: 'Streak 30 ngày', name: 'tại sao người mù lại cô đơn' },
  { condition: 'Streak 60 ngày', name: 'kkkkkkkkkkkk' },
  { condition: 'Streak 100 ngày', name: 'thuận buồi xuôi dái' },
  { condition: 'Streak 365 ngày', name: 'loz má dai dữ' },
  { condition: 'Hoàn thành 10 task', name: 'CHUC MUNG THANG LON' },
  { condition: 'Hoàn thành 100 task', name: 'lady boi có cái vòi ở giữa' },
  { condition: 'Hoàn thành 500 task', name: 'cập nhật giá vàng mỗi ngày' },
  { condition: 'Hoàn thành 1.000 task', name: 'tiểu tam chung thủy' },
  { condition: 'Kết bạn lần đầu', name: 'cu 3 mét lét i bê' },
  { condition: 'Nhận ảnh nhóm lần đầu', name: 'xuân Bính Ngọ, lọ thật sung' },
  { condition: 'Hoàn thành task lúc 0–4 giờ sáng', name: 'chạy thận hả má' },
  { condition: 'Hoàn thành task ngày sinh nhật', name: 'mừng ra đời tại nhà' },
  { condition: 'Hoàn thành task ngày 1/1', name: 'chưa tết ta đâu b' },
  { condition: 'Hoàn thành task ngày 14/2', name: 'có bồ chưa b' },
  { condition: 'Hoàn thành task ngày 2/9', name: 'hôm qua là 1/9' },
  { condition: 'Hoàn thành task ngày 25/12', name: 'mê ri quỵt mệch' },
  { condition: 'Hoàn thành task mùng 1 Tết Nguyên đán', name: 'lì xì tao mau alo' },
  { condition: 'Đủ ảnh Thường', name: 'hồi chiều trời mưa' },
  { condition: 'Đủ ảnh Hiếm', name: 'e là không thể' },
  { condition: 'Đủ ảnh Huyền Thoại', name: 'ra đường ngậm cục cơm' },
  { condition: 'Đủ ảnh Bá khí', name: 'aura +99999' },
]
