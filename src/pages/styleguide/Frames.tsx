import { useEffect, useState, type ReactNode } from 'react'
import { AvatarFrame } from '../../components/frames/AvatarFrame'
import { TitleFrame } from '../../components/frames/TitleFrame'
import { TITLE_FRAME, measureTitle } from '../../components/frames/svg'
import { TextField } from '../../components/ui'
import {
  AVATAR_FRAMES,
  AVATAR_INNER,
  BIRTHDAY_FRAME,
  BIRTHDAY_TITLE_FRAME,
  MEMBERS,
  SECRET_INNER,
  TITLES,
  secretFrame,
  titleFrame,
} from '../../lib/frames'
import { RARITIES, RARITY_NAME, cardColors } from '../../lib/rarity'
import { Section, Spec, Sub } from './shared'

function AvatarFill({ i }: { i: number }) {
  const [a, b] = cardColors(i)
  return <div className="h-full w-full" style={{ background: `linear-gradient(160deg, ${a}, ${b})` }} />
}

const ALL_TITLE_FRAMES = [...MEMBERS.map(titleFrame), BIRTHDAY_TITLE_FRAME]

/** Danh hiệu sắp theo độ rộng chữ thật (sau khi font tải xong). */
function useTitlesByWidth() {
  const [order, setOrder] = useState<Array<{ name: string; condition: string; w: number }>>([])
  useEffect(() => {
    let alive = true
    document.fonts.load(`800 ${TITLE_FRAME.fontSize}px "Be Vietnam Pro"`, 'ạ').then(() => {
      if (!alive) return
      setOrder(TITLES.map((t) => ({ ...t, w: measureTitle(t.name) })).sort((x, y) => y.w - x.w))
    })
    return () => {
      alive = false
    }
  }, [])
  return order
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-end gap-6">{children}</div>
}

export function Frames() {
  const order = useTitlesByWidth()
  const [custom, setCustom] = useState('tên danh hiệu bạn tự đặt dài thật là dài luôn nha')
  const longest = order.slice(0, 2)
  const fit = TITLE_FRAME.textWidth - TITLE_FRAME.padding * 2

  return (
    <Section
      id="frame"
      title="Frame"
      note={
        <>
          SVG nhúng inline để giữ font và animation; chỉ tải khi gần màn hình và chỉ chạy khi đang nhìn thấy. Công tắc “Giảm
          chuyển động” dừng toàn bộ. File gốc trong <code>public/assets/frames</code> không bị sửa.
        </>
      }
    >
      <Sub title="Frame tròn theo độ hiếm — avatar 78% dưới frame 512">
        <Row>
          {RARITIES.map((r, i) => (
            <Spec key={r} label={RARITY_NAME[r]}>
              <AvatarFrame frame={AVATAR_FRAMES[r]} inner={AVATAR_INNER} size={124} label={`Frame ${RARITY_NAME[r]}`}>
                <AvatarFill i={i} />
              </AvatarFrame>
            </Spec>
          ))}
          <Spec label="Cỡ nhỏ 44px (danh sách bạn)">
            <AvatarFrame frame={AVATAR_FRAMES.supreme} inner={AVATAR_INNER} size={44}>
              <AvatarFill i={2} />
            </AvatarFrame>
          </Spec>
        </Row>
      </Sub>

      <Sub title="Frame secret theo thành viên + sinh nhật — avatar 62.5% dưới frame 640">
        <Row>
          {MEMBERS.map((m, i) => (
            <Spec key={m} label={m}>
              <AvatarFrame frame={secretFrame(m)} inner={SECRET_INNER} size={124}>
                <AvatarFill i={i + 1} />
              </AvatarFrame>
            </Spec>
          ))}
          <Spec label="birthday-james">
            <AvatarFrame frame={BIRTHDAY_FRAME} inner={SECRET_INNER} size={124}>
              <AvatarFill i={0} />
            </AvatarFrame>
          </Spec>
        </Row>
      </Sub>

      <Sub title="Hai frame mẫu với tên dài nhất">
        <div className="flex max-w-3xl flex-col gap-5">
          {longest.map((t, i) => (
            <div key={t.name}>
              <TitleFrame name={t.name} frame={ALL_TITLE_FRAMES[i * 2] ?? BIRTHDAY_TITLE_FRAME} height={84} />
              <p className="mt-1 text-center text-micro text-soft">
                “{t.name}” · {t.condition} · chữ rộng {Math.round(t.w)} / vùng gốc {Math.round(fit)} đơn vị → nới thêm{' '}
                {Math.max(0, Math.round(t.w - fit))}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[70ch] text-meta text-soft">
          Cách nới: các viên thuốc chạy hết chiều ngang được kéo dài (bo tròn giữ nguyên), nắp trái đứng yên, nắp phải dịch theo, họa
          tiết giữa giãn đều. Không kéo giãn cả ảnh, không ép hay cắt chữ. Khi khung rộng hơn màn, cả cụm thu nhỏ đều.
        </p>
      </Sub>

      <Sub title="Thử tên bất kỳ">
        <div className="flex max-w-3xl flex-col gap-4">
          <TextField value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Tên danh hiệu thử" />
          <TitleFrame name={custom || ' '} frame={titleFrame('juhoon')} height={84} />
          <div className="max-w-[358px]">
            <TitleFrame name={custom || ' '} frame={titleFrame('juhoon')} height={84} />
            <p className="mt-1 text-center text-micro text-soft">Trong cột 358px (màn 390 trừ lề)</p>
          </div>
        </div>
      </Sub>

      <Sub title="Cả 24 danh hiệu, xoay vòng 6 frame ngang (sắp theo độ dài)">
        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
          {order.map((t, i) => (
            <div key={t.name}>
              <TitleFrame name={t.name} frame={ALL_TITLE_FRAMES[i % ALL_TITLE_FRAMES.length]!} height={60} />
              <p className="mt-0.5 text-center text-micro text-soft">{t.condition}</p>
            </div>
          ))}
        </div>
      </Sub>
    </Section>
  )
}
