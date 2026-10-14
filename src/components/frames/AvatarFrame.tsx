import type { ReactNode } from 'react'
import { InlineSvg } from './InlineSvg'

/**
 * Avatar nằm dưới frame tròn. `inner` = đường kính lỗ avatar / cạnh frame
 * (0.78 cho frame 512; 0.625 cho frame secret/sinh nhật 640).
 */
export function AvatarFrame({
  frame,
  inner,
  size = 124,
  children,
  label,
}: {
  frame: string
  inner: number
  size?: number
  children: ReactNode
  label?: string
}) {
  const d = size * inner
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label}>
      <div
        className="absolute overflow-hidden rounded-full"
        style={{ width: d, height: d, left: (size - d) / 2, top: (size - d) / 2 }}
      >
        {children}
      </div>
      <InlineSvg path={frame} className="absolute inset-0" />
    </div>
  )
}
