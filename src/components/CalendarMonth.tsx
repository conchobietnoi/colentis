import type { CSSProperties } from 'react'
import { WEEKDAY_SHORT, monthGrid } from '../lib/calendar'
import { cardColors } from '../lib/rarity'

/**
 * Trạng thái hiển thị một ô ngày (chỉ là dữ liệu hiển thị; server quyết định thưởng/khóa).
 * - group: thẻ nhóm phủ cả ô
 * - me: thẻ cá nhân ở góc
 * - saved: ngày dùng thẻ cứu
 * - empty: ngày trống đã chốt (giữ streak, không có ảnh cá nhân)
 */
export interface DayState {
  group?: boolean
  me?: boolean
  saved?: boolean
  empty?: boolean
  locked?: boolean
  pendingSync?: boolean
  /** màu thành viên có task chưa xong */
  dots?: string[]
}

export function DayCell({
  day,
  today,
  future,
  state = {},
  onClick,
}: {
  day: number
  today?: boolean
  future?: boolean
  state?: DayState
  onClick?: () => void
}) {
  const [a, b] = cardColors(day)
  const label = [
    `Ngày ${day}`,
    today && 'hôm nay',
    state.group && 'có thẻ nhóm',
    state.me && 'có thẻ cá nhân',
    state.saved && 'đã dùng thẻ cứu',
    state.empty && 'ngày trống',
    state.locked && 'đã khóa',
    state.pendingSync && 'chờ đồng bộ',
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <button
      type="button"
      className="day"
      aria-label={label}
      onClick={onClick}
      data-today={today || undefined}
      data-future={future || undefined}
      data-group={state.group || undefined}
      data-saved={state.saved || undefined}
      style={{ '--a': a, '--b': b } as CSSProperties}
    >
      <span className="day-num">{day}</span>
      {state.me && !state.group && (
        <i className="day-me" style={{ background: `linear-gradient(160deg, ${a}, ${b})` }} />
      )}
      {state.empty && !state.group && <i className="day-empty-mark" />}
      {state.dots && state.dots.length > 0 && !state.group && (
        <span className="day-dots">
          {state.dots.slice(0, 3).map((c, i) => (
            <i key={i} style={{ background: c }} />
          ))}
        </span>
      )}
      {state.pendingSync ? (
        <span className="day-sync" aria-hidden>
          <SyncIcon />
        </span>
      ) : (
        state.locked && (
          <span className="day-lock" aria-hidden>
            <LockIcon />
          </span>
        )
      )}
    </button>
  )
}

export function CalendarMonth({
  year,
  month0,
  today,
  days = {},
  onPick,
}: {
  year: number
  month0: number
  /** ngày hôm nay trong tháng này (nếu có) */
  today?: number
  days?: Record<number, DayState>
  onPick?: (day: number) => void
}) {
  const cells = monthGrid(year, month0)
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-1 text-center text-micro font-bold text-(--cal-weekday)">
        {WEEKDAY_SHORT.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) =>
          c.day == null ? (
            <span key={i} aria-hidden />
          ) : (
            <DayCell
              key={i}
              day={c.day}
              today={today === c.day}
              future={today != null && c.day > today}
              state={days[c.day]}
              onClick={onPick ? () => onPick(c.day!) : undefined}
            />
          ),
        )}
      </div>
    </div>
  )
}

export function LockIcon({ size = 8 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <rect x="1.5" y="4.5" width="7" height="5" rx="1" />
      <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function SyncIcon({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8.5 4A3.5 3.5 0 0 0 2 3M1.5 6A3.5 3.5 0 0 0 8 7" strokeLinecap="round" />
      <path d="M2 1v2h2M8 9V7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
