import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../lib/cx'

export function Section({ id, title, note, children }: { id: string; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t-2 border-dashed border-line py-10 first:border-t-0">
      <h2 className="text-h1 font-black">{title}</h2>
      {note && <p className="mt-2 max-w-[68ch] text-body text-soft">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function Sub({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx('mt-8 first:mt-0', className)}>
      <h3 className="mb-3 text-micro font-bold tracking-wider text-soft uppercase">{title}</h3>
      {children}
    </div>
  )
}

/** Khung điện thoại 390pt — chỉ dùng để duyệt trong style guide. */
export function Device({
  children,
  width = 390,
  height = 844,
  style,
  label,
}: {
  children: ReactNode
  width?: number
  height?: number
  style?: CSSProperties
  label?: string
}) {
  return (
    <figure className="flex max-w-full shrink-0 flex-col items-center gap-3">
      <div
        className="relative flex flex-col overflow-hidden rounded-[36px] bg-sleeve shadow-device"
        style={{ width, height, maxWidth: '100%', ...style }}
      >
        {children}
      </div>
      {label && <figcaption className="text-meta font-bold text-soft">{label}</figcaption>}
    </figure>
  )
}

/** Một mẫu có chú thích ngắn bên dưới. */
export function Spec({ label, children, className }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-start gap-2', className)}>
      {children}
      <span className="text-micro font-bold text-soft">{label}</span>
    </div>
  )
}
