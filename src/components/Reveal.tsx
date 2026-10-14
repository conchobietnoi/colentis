import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../lib/motion'
import { RARITY_NAME, RARITY_VAR, cardColors, type Rarity } from '../lib/rarity'
import { TitleFrame } from './frames/TitleFrame'

export type RevealItem =
  | {
      kind: 'card'
      rarity: Rarity
      /** nguồn nhận: hoàn thành cá nhân / cả nhóm / quà admin */
      source: 'personal' | 'group' | 'admin'
      cardNo: number
      /** số lần đã sở hữu sau lần nhận này (>1 = trùng) */
      owned: number
      progress: string
    }
  | { kind: 'title'; rarity: Rarity; name: string; condition: string; frame: string }

type Stage = 'drop' | 'ready' | 'shake' | 'burst' | 'show'

const SOURCE_LABEL = { personal: 'Ảnh hoàn thành cá nhân', group: 'Ảnh nhóm', admin: 'Quà từ Admin' } as const
const SPARKS = { common: 8, rare: 14, legend: 24, supreme: 38 } as const
const RAYS = { common: 0.12, rare: 0.3, legend: 0.5, supreme: 0.75 } as const

/** Số giả ngẫu nhiên ổn định theo seed (render phải thuần). */
function seeded(seed: number) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/**
 * Màn nhận ảnh. Server đã cấp và lưu thưởng TRƯỚC khi màn này mở;
 * đóng giữa chừng không mất quà, các nút chỉ điều hướng.
 */
export function Reveal({
  items,
  onDone,
  onOpenAlbum,
}: {
  items: RevealItem[]
  onDone: () => void
  onOpenAlbum?: () => void
}) {
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('drop')
  const reduced = useReducedMotion()
  const item = items[index]

  useEffect(() => {
    if (stage === 'drop') {
      const t = setTimeout(() => setStage(reduced ? 'show' : 'ready'), reduced ? 0 : 950)
      return () => clearTimeout(t)
    }
    if (stage === 'shake') {
      navigator.vibrate?.(60)
      const t = setTimeout(() => setStage('burst'), 1500)
      return () => clearTimeout(t)
    }
    if (stage === 'burst') {
      const t = setTimeout(() => setStage('show'), 380)
      return () => clearTimeout(t)
    }
  }, [stage, reduced])

  const sparks = useMemo(() => {
    if (!item) return []
    const rnd = seeded(index + 1)
    return Array.from({ length: SPARKS[item.rarity] }, () => {
      const a = rnd() * Math.PI * 2
      const d = 110 + rnd() * 190
      return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, delay: rnd() * 0.15 }
    })
  }, [item, index])

  if (!item) return null
  const last = index === items.length - 1
  const open = () => stage === 'ready' && setStage('shake')
  const next = () => {
    if (last) onDone()
    else {
      setIndex(index + 1)
      setStage('drop')
    }
  }
  const [a, b] = item.kind === 'card' ? cardColors(item.cardNo) : ['#241E6B', '#4A3BE0']

  return (
    <div
      className="reveal"
      data-stage={stage}
      data-rarity={item.rarity}
      style={{ '--rc': RARITY_VAR[item.rarity], '--ri': RAYS[item.rarity] } as CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-label="Nhận thưởng"
    >
      <div className="rays" />
      <button type="button" className="orb" aria-label="Chạm để mở" onClick={open} />
      <button type="button" className="hint" onClick={open} tabIndex={-1}>
        Chạm để mở
      </button>
      {stage !== 'show' && (
        <button
          type="button"
          onClick={() => setStage('show')}
          className="absolute top-11 right-4 rounded-full bg-white/15 px-3.5 py-[7px] text-meta font-bold"
        >
          Bỏ qua
        </button>
      )}
      <div className="ring" />
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px`, animationDelay: `${s.delay}s` } as CSSProperties}
        />
      ))}

      <div className="card-wrap">
        <div className="card3d">
          <div className="card-back" />
          <div className="card-front">
            <div
              className="card-art relative flex h-full flex-col items-center justify-end gap-1.5 rounded-[14px] p-3.5 text-center text-body font-black"
              style={{ '--a': a, '--b': b } as CSSProperties}
            >
              {item.kind === 'card' ? (
                <b className="rounded-full bg-navy/75 px-3 py-1.5">Thẻ #{String(item.cardNo).padStart(2, '0')}</b>
              ) : (
                <div className="m-auto h-24 w-24 rounded-full border-[6px] border-(--rc) shadow-[0_0_24px_var(--rc)]" />
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="rname">{RARITY_NAME[item.rarity]}</h2>
      <div className="info w-full">
        {item.kind === 'card' ? (
          <>
            <b className="block text-lg">{SOURCE_LABEL[item.source]}</b>
            <span className="text-meta opacity-80">
              {item.owned > 1 ? `Bạn đã có ảnh này · nhận lần ${item.owned}` : 'Đã thêm vào bộ sưu tập'} · {item.progress}
            </span>
          </>
        ) : (
          <>
            <b className="mb-2 block text-lg">Danh hiệu mới</b>
            <TitleFrame name={item.name} frame={item.frame} height={56} />
            <span className="mt-1 block text-meta opacity-80">{item.condition} · đeo kèm frame avatar</span>
          </>
        )}
      </div>
      <div className="actions">
        <button
          type="button"
          onClick={next}
          className="rounded-full bg-butter px-11 py-[15px] text-base font-black text-navy"
        >
          {last ? 'Tiếp tục' : `Tiếp (${index + 1}/${items.length})`}
        </button>
        {last && onOpenAlbum && (
          <button type="button" onClick={onOpenAlbum} className="text-meta font-bold text-white/80 underline">
            Xem bộ sưu tập
          </button>
        )}
      </div>
      <div className="flash" />
    </div>
  )
}
