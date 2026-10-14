import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/motion'
import { cx } from '../../lib/cx'
import { loadSvg, uniquifyIds } from './svg'

/**
 * Nhúng một frame SVG inline:
 * - chỉ tải khi gần màn hình (lazy);
 * - animation chỉ chạy khi đang nhìn thấy, dừng hẳn khi giảm chuyển động;
 * - `prepare` (nên bọc useCallback) được gọi sau mỗi lần gắn SVG vào DOM để biến đổi bản sao.
 */
export function InlineSvg({
  path,
  prepare,
  className,
}: {
  path: string
  prepare?: (svg: SVGSVGElement) => void
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [markup, setMarkup] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = host.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    let alive = true
    loadSvg(path).then(
      (t) => alive && setMarkup(uniquifyIds(t)),
      () => alive && setFailed(true),
    )
    return () => {
      alive = false
    }
  }, [near, path])

  useLayoutEffect(() => {
    const el = host.current
    if (!el || !markup) return
    el.innerHTML = markup
    const svg = el.querySelector('svg')
    if (!svg) return
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('focusable', 'false')
    svg.style.display = 'block'
    svg.style.width = '100%'
    svg.style.height = '100%'
    prepare?.(svg)
  }, [markup, prepare])

  useEffect(() => {
    const el = host.current
    const svg = el?.querySelector('svg')
    if (!el || !svg) return
    if (reduced) {
      svg.pauseAnimations()
      svg.setCurrentTime(0)
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) svg.unpauseAnimations()
      else svg.pauseAnimations()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [markup, prepare, reduced])

  return (
    <div
      ref={host}
      className={cx('pointer-events-none', failed && 'rounded-full border-2 border-dashed border-line', className)}
      aria-hidden
    />
  )
}
