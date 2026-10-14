import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { CountDot } from './ui'

export type TabKey = 'calendar' | 'today' | 'album' | 'friends' | 'profile'

const TABS: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  {
    key: 'calendar',
    label: 'Lịch',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="4" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    key: 'today',
    label: 'Hôm nay',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  },
  {
    key: 'album',
    label: 'Ảnh',
    icon: (
      <>
        <rect x="6" y="3" width="13" height="17" rx="3" transform="rotate(8 12 12)" />
        <rect x="4" y="4" width="13" height="17" rx="3" />
      </>
    ),
  },
  {
    key: 'friends',
    label: 'Bạn bè',
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 1.8 6 5" />
      </>
    ),
  },
  {
    key: 'profile',
    label: 'Hồ sơ',
    icon: (
      <>
        <circle cx="12" cy="9" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </>
    ),
  },
]

export function TabBar({
  active,
  onChange,
  badges = {},
}: {
  active: TabKey
  onChange?: (k: TabKey) => void
  badges?: Partial<Record<TabKey, number>>
}) {
  return (
    <nav className="grid shrink-0 grid-cols-5 border-t-2 border-line bg-paper px-1.5 pt-[9px] pb-[max(16px,env(safe-area-inset-bottom))]">
      {TABS.map((t) => {
        const on = t.key === active
        return (
          <button
            key={t.key}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => onChange?.(t.key)}
            className={cx(
              'relative flex flex-col items-center gap-1 text-micro',
              on ? 'font-bold text-pink' : 'font-medium text-soft',
            )}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={on ? 'currentColor' : 'none'}
              fillOpacity={on ? 0.18 : 0}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {t.icon}
            </svg>
            {t.label}
            <span className="absolute -top-1 left-[calc(50%+6px)]">
              <CountDot n={badges[t.key] ?? 0} />
            </span>
          </button>
        )
      })}
    </nav>
  )
}

/** Lối vào hòm thư ở đầu màn (không chiếm tab). */
export function MailButton({ unread, onClick }: { unread: number; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={unread ? `Hòm thư, ${unread} thư chưa đọc` : 'Hòm thư'}
      className="relative grid h-10 w-10 place-items-center rounded-[14px] border-[1.5px] border-line bg-paper text-ink"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
      <span className="absolute -top-1.5 -right-1.5">
        <CountDot n={unread} />
      </span>
    </button>
  )
}
