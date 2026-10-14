import { addDays, format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export const TZ = 'Asia/Ho_Chi_Minh'

/** Ngày hiện tại theo giờ Việt Nam, dạng YYYY-MM-DD. Server mới là nguồn sự thật cho thưởng; đây chỉ để hiển thị. */
export function vnToday(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: TZ })
}

export function vnHour(d = new Date()): number {
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }).format(d)) % 24
}

export const pad = (n: number) => String(n).padStart(2, '0')
export const ymd = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`
export const parseDay = (s: string) => parseISO(s)
export const addDaysStr = (s: string, n: number) => format(addDays(parseISO(s), n), 'yyyy-MM-dd')
export const dayNum = (s: string) => Number(s.slice(8, 10))
export const monthKey = (s: string) => s.slice(0, 7)

export function monthRange(year: number, month0: number) {
  const first = ymd(year, month0, 1)
  const last = ymd(year, month0, new Date(year, month0 + 1, 0).getDate())
  return { first, last }
}

/** Lịch tháng, tuần bắt đầu thứ Hai. Trả về các ô (có thể null ở đầu) và số hàng. */
export function monthGrid(year: number, month0: number): (string | null)[] {
  const dim = new Date(year, month0 + 1, 0).getDate()
  const lead = (new Date(year, month0, 1).getDay() + 6) % 7
  const cells: (string | null)[] = Array.from({ length: lead }, () => null)
  for (let d = 1; d <= dim; d++) cells.push(ymd(year, month0, d))
  while (cells.length % 7) cells.push(null)
  return cells
}

export const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
export const WD_LONG = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

export function longDate(s: string) {
  const d = parseISO(s)
  return `${WD_LONG[d.getDay()]}, ${format(d, 'dd/MM/yyyy', { locale: vi })}`
}

export function shortDate(s: string) {
  return format(parseISO(s), 'dd/MM')
}

/** Giờ còn lại tới hạn tick bù (48 giờ sau khi ngày kết thúc). */
export function catchupLeftMs(day: string, now = Date.now()): number {
  const end = new Date(`${addDaysStr(day, 1)}T00:00:00+07:00`).getTime()
  return end + 48 * 3600 * 1000 - now
}

export function fmtLeft(ms: number): string {
  if (ms <= 0) return 'đã hết hạn'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h} giờ ${pad(m)} phút`
}

/** Ngày sinh 29/2 tính 28/2 ở năm không nhuận. Trả về số ngày tới sinh nhật kế tiếp. */
export function daysToBirthday(birthday: string, today = vnToday()): { days: number; age: number; date: string } {
  const [by, bm, bd] = birthday.split('-').map(Number)
  const ty = Number(today.slice(0, 4))
  const leap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
  const mk = (y: number) => ymd(y, bm - 1, bm === 2 && bd === 29 && !leap(y) ? 28 : bd)
  let date = mk(ty)
  let year = ty
  if (date < today) { year = ty + 1; date = mk(year) }
  const days = Math.round((parseISO(date).getTime() - parseISO(today).getTime()) / 86400000)
  return { days, age: year - by, date }
}
