/** Tuần bắt đầu thứ Hai (quy tắc cứng của app). */
export const WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const

export const WEEKDAY_LONG = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'] as const

export interface MonthCell {
  /** null = ô đệm ngoài tháng */
  day: number | null
  /** 0 = thứ Hai … 6 = Chủ nhật */
  weekday: number
}

/** Lưới tháng theo tuần thứ Hai, luôn đủ hàng 7 ô (4–6 hàng). */
export function monthGrid(year: number, month0: number): MonthCell[] {
  const first = new Date(year, month0, 1)
  const offset = (first.getDay() + 6) % 7
  const days = new Date(year, month0 + 1, 0).getDate()
  const total = Math.ceil((offset + days) / 7) * 7
  return Array.from({ length: total }, (_, i) => {
    const d = i - offset + 1
    return { day: d >= 1 && d <= days ? d : null, weekday: i % 7 }
  })
}

export function weekdayOf(year: number, month0: number, day: number): number {
  return (new Date(year, month0, day).getDay() + 6) % 7
}
