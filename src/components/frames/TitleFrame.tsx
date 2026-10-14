import { useCallback, useEffect, useRef, useState } from 'react'
import { InlineSvg } from './InlineSvg'
import { TITLE_FRAME, titleExtraWidth, widenTitleSvg } from './svg'

const FONT = `800 ${TITLE_FRAME.fontSize}px "Be Vietnam Pro"`

/**
 * Frame ngang + tên danh hiệu. Tên luôn một dòng ở cỡ chữ chuẩn (không ép, không cắt);
 * tên dài thì khung được nới ngang. Nếu khung nới rộng hơn chỗ trống, cả cụm thu nhỏ đều.
 */
export function TitleFrame({ name, frame, height = 64 }: { name: string; frame: string; height?: number }) {
  const outer = useRef<HTMLDivElement>(null)
  const [extra, setExtra] = useState(() => titleExtraWidth(name))
  const [avail, setAvail] = useState<number | null>(null)

  // Đo lại khi font đã tải (lần đo đầu có thể dùng font dự phòng).
  useEffect(() => {
    let alive = true
    document.fonts.load(FONT, name).then(() => alive && setExtra(titleExtraWidth(name)))
    return () => {
      alive = false
    }
  }, [name])

  useEffect(() => {
    const el = outer.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => e && setAvail(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const prepare = useCallback((svg: SVGSVGElement) => widenTitleSvg(svg, extra), [extra])

  const vbWidth = TITLE_FRAME.width + extra
  const h = avail ? Math.min(height, (avail * TITLE_FRAME.height) / vbWidth) : height
  const pct = (n: number) => `${(n / vbWidth) * 100}%`

  return (
    <div ref={outer} className="w-full min-w-0">
      <div
        className="relative mx-auto"
        style={{ height: h, width: (h * vbWidth) / TITLE_FRAME.height }}
        role="img"
        aria-label={`Danh hiệu: ${name}`}
      >
        <InlineSvg path={frame} prepare={prepare} className="absolute inset-0" />
        <span
          className="absolute flex items-center justify-center font-extrabold whitespace-nowrap text-white"
          style={{
            left: pct(TITLE_FRAME.textLeft),
            width: pct(TITLE_FRAME.textWidth + extra),
            top: `${TITLE_FRAME.textTop * 100}%`,
            height: `${TITLE_FRAME.textHeight * 100}%`,
            fontSize: (h * TITLE_FRAME.fontSize) / TITLE_FRAME.height,
            lineHeight: 1.1,
            textShadow: '0 1px 3px rgb(0 0 0 / .55), 0 0 10px rgb(0 0 0 / .25)',
          }}
          aria-hidden
        >
          {name}
        </span>
      </div>
    </div>
  )
}
