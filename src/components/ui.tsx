import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import { cx } from '../lib/cx'
import { RARITY_VAR, type Rarity } from '../lib/rarity'

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>

/** Nút hành động chính, full-width, hồng. */
export function BigButton({ className, ...p }: BtnProps) {
  return (
    <button
      type="button"
      className={cx(
        'w-full rounded-btn bg-pink px-4 py-[15px] text-base font-black text-white transition active:scale-[.98]',
        'disabled:bg-line disabled:text-soft disabled:active:scale-100',
        className,
      )}
      {...p}
    />
  )
}

/** Nút phụ: viền, nền trong suốt. */
export function GhostButton({ className, ...p }: BtnProps) {
  return (
    <button
      type="button"
      className={cx(
        'w-full rounded-btn border-2 border-line px-4 py-[13px] text-body font-bold text-ink transition active:scale-[.98]',
        className,
      )}
      {...p}
    />
  )
}

/** Nút "Nhận quà" vàng, nhịp đập khi còn quà. */
export function ClaimButton({ className, disabled, ...p }: BtnProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        'rounded-full px-5 py-2.5 text-body font-black',
        disabled ? 'bg-line text-soft' : 'animate-pulse-claim bg-butter text-navy',
        className,
      )}
      {...p}
    />
  )
}

export function Chip({ on, className, ...p }: BtnProps & { on?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cx(
        'rounded-full border-2 px-[13px] py-[7px] text-meta font-bold whitespace-nowrap',
        on ? 'border-ink bg-ink text-on-ink' : 'border-line bg-transparent text-soft',
        className,
      )}
      {...p}
    />
  )
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx(
        'relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors',
        on ? 'bg-pink' : 'bg-line',
      )}
    >
      <span
        className={cx(
          'absolute top-[3px] h-5 w-5 rounded-full bg-white transition-[left]',
          on ? 'left-[23px]' : 'left-[3px]',
        )}
      />
    </button>
  )
}

export function TextField({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full rounded-field border-2 border-line bg-sleeve px-3.5 py-3 text-[15px] text-ink placeholder:text-soft/70',
        'focus:border-sky focus:outline-none',
        className,
      )}
      {...p}
    />
  )
}

/** Thẻ nội dung giấy. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('rounded-card border-[1.5px] border-line bg-paper p-3.5', className)}>{children}</div>
}

/** Huy hiệu streak nghiêng như nhãn dán. */
export function StreakBadge({ days }: { days: number }) {
  return (
    <div className="rotate-3 rounded-[14px] bg-stamp px-3 py-2 text-body font-black whitespace-nowrap text-on-stamp">
      {days} ngày<span className="@max-[20rem]:hidden"> liền</span>
    </div>
  )
}

/** Chấm đếm (tab, hòm thư). */
export function CountDot({ n }: { n: number }) {
  if (n <= 0) return null
  return (
    <em className="grid h-[17px] min-w-[17px] place-items-center rounded-full bg-pink px-1 text-[10px] font-black text-white not-italic">
      {n > 99 ? '99+' : n}
    </em>
  )
}

/** Nút tròn màu nhãn task. */
export function LabelDot({ color, on, onClick, label }: { color: string; on?: boolean; onClick?: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      style={{ background: color }}
      className={cx('h-[30px] w-[30px] rounded-full border-[3px] bg-clip-padding', on ? 'border-ink' : 'border-transparent')}
    />
  )
}

export function Swatch({ color, label, onClick }: { color: string; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{ background: color }}
      className="h-[30px] w-[30px] rounded-[9px] border-2 border-paper shadow-[0_0_0_2px_var(--c-line)]"
    />
  )
}

/** Nhãn task: thẻ có chữ (không chỉ dựa vào màu). */
export function TaskTag({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-ink"
      style={{ background: `color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      <i className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  )
}

/** Avatar tròn với vòng màu độ hiếm (giữ chỗ khi chưa có frame SVG). */
export function MiniAvatar({
  rarity,
  colors,
  size = 44,
}: {
  rarity: Rarity
  colors: readonly [string, string]
  size?: number
}) {
  return (
    <div
      className="ring-av shrink-0 p-[3px]"
      style={{ width: size, height: size, '--rc': RARITY_VAR[rarity] } as CSSProperties}
    >
      <span style={{ background: `linear-gradient(160deg, ${colors[0]}, ${colors[1]})` }} />
    </div>
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <h2 className="flex items-center justify-between text-h3 font-black">
      <span>{children}</span>
      {aside != null && <span className="text-pink">{aside}</span>}
    </h2>
  )
}
