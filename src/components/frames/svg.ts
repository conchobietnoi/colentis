/**
 * Tải frame SVG để nhúng inline (giữ font + animation SMIL của file gốc).
 * Không sửa file trong public/; mọi biến đổi làm trên bản sao trong DOM.
 */

const cache = new Map<string, Promise<string>>()

/** path tương đối trong public/, ví dụ "assets/frames/title/title-frame-james.svg" */
export function loadSvg(path: string): Promise<string> {
  let p = cache.get(path)
  if (!p) {
    p = fetch(import.meta.env.BASE_URL + path)
      .then((r) => {
        if (!r.ok) throw new Error(`Không tải được frame ${path} (${r.status})`)
        return r.text()
      })
      // Bỏ manifest C2PA nhúng (base64, vài KB) — không cần khi hiển thị.
      .then((t) => t.replace(/<metadata>[\s\S]*?<\/metadata>/g, ''))
    p.catch(() => cache.delete(path))
    cache.set(path, p)
  }
  return p
}

let seq = 0

/** Đổi id trong SVG thành duy nhất để nhiều bản cùng frame trên một trang không đè gradient/filter của nhau. */
export function uniquifyIds(markup: string): string {
  const prefix = `f${++seq}-`
  return markup
    .replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${prefix}$1"`)
}

/** Frame ngang danh hiệu: kích thước gốc và vùng chữ (theo CLAUDE.md). */
export const TITLE_FRAME = {
  width: 760,
  height: 200,
  textLeft: 0.224 * 760,
  textTop: 0.31,
  textWidth: 0.618 * 760,
  textHeight: 0.38,
  /** cỡ chữ tên danh hiệu, đơn vị viewBox (≈ 4.4cqw của preview gốc) */
  fontSize: 34,
  /** khoảng thở hai bên chữ, đơn vị viewBox */
  padding: 18,
  /** vùng nắp trái/phải không bị dịch khi nới (đơn vị viewBox) */
  capLeft: 170,
  capRight: 590,
} as const

/**
 * Nới frame ngang thêm `extra` đơn vị mà không kéo giãn họa tiết:
 * - các viên thuốc chạy hết chiều ngang (rect rộng ≥ 500) được kéo dài chiều rộng — hình bo tròn giữ nguyên;
 * - họa tiết nắp trái giữ chỗ, nắp phải dịch hết `extra`;
 * - họa tiết ở giữa dịch theo tỉ lệ vị trí để giãn đều, không bị méo.
 * Phải gọi khi SVG đã nằm trong DOM và đang hiển thị (cần getBBox).
 */
export function widenTitleSvg(svg: SVGSVGElement, extra: number): void {
  const { width, height, capLeft, capRight } = TITLE_FRAME
  svg.setAttribute('viewBox', `0 0 ${width + extra} ${height}`)
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  if (extra <= 0) return

  for (const el of Array.from(svg.children)) {
    const tag = el.tagName.toLowerCase()
    if (tag === 'defs' || tag === 'metadata' || tag === 'title' || tag === 'desc') continue
    if (!(el instanceof SVGGraphicsElement)) continue

    const w = Number(el.getAttribute('width'))
    if (tag === 'rect' && w >= 500) {
      el.setAttribute('width', String(w + extra))
      continue
    }

    let box: DOMRect
    try {
      box = el.getBBox()
    } catch {
      continue
    }
    let cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    // getBBox không tính transform của chính phần tử → cộng vào để có tọa độ thật.
    const m = el.transform.baseVal.consolidate()?.matrix
    if (m) cx = m.a * cx + m.c * cy + m.e

    const t = Math.min(1, Math.max(0, (cx - capLeft) / (capRight - capLeft)))
    const shift = extra * t
    if (shift > 0.01) {
      const prev = el.getAttribute('transform')
      el.setAttribute('transform', `translate(${shift.toFixed(2)} 0)${prev ? ' ' + prev : ''}`)
    }
  }
}

let measureCtx: CanvasRenderingContext2D | null = null

/** Độ rộng chữ (đơn vị viewBox) với font của tên danh hiệu. */
export function measureTitle(text: string): number {
  measureCtx ??= document.createElement('canvas').getContext('2d')
  if (!measureCtx) return text.length * TITLE_FRAME.fontSize * 0.6
  measureCtx.font = `800 ${TITLE_FRAME.fontSize}px "Be Vietnam Pro"`
  return measureCtx.measureText(text).width
}

/** Đơn vị cần nới thêm để tên nằm gọn trên một dòng ở cỡ chữ chuẩn. */
export function titleExtraWidth(text: string): number {
  const need = measureTitle(text) + TITLE_FRAME.padding * 2
  return Math.max(0, Math.ceil(need - TITLE_FRAME.textWidth))
}
