import { useState } from 'react'
import { Reveal, type RevealItem } from '../../components/Reveal'
import { LockIcon } from '../../components/CalendarMonth'
import { BigButton, Chip, GhostButton } from '../../components/ui'
import { titleFrame } from '../../lib/frames'
import { RARITIES, RARITY_NAME, type Rarity } from '../../lib/rarity'
import { CalendarScreen } from './CalendarScreens'
import { Device, Section, Sub } from './shared'

const card = (rarity: Rarity, extra: Partial<Extract<RevealItem, { kind: 'card' }>> = {}): RevealItem => ({
  kind: 'card',
  rarity,
  source: 'personal',
  cardNo: 42,
  owned: 1,
  progress: '42/79',
  ...extra,
})

const SEQUENCE: RevealItem[] = [
  card('rare', { cardNo: 17 }),
  card('legend', { source: 'group', cardNo: 63, progress: '43/79' }),
  {
    kind: 'title',
    rarity: 'supreme',
    name: 'xuân Bính Ngọ, lọ thật sung',
    condition: 'Nhận ảnh nhóm lần đầu',
    frame: titleFrame('keonho'),
  },
]

export function RevealDemo() {
  const [confirm, setConfirm] = useState(false)
  const [items, setItems] = useState<RevealItem[] | null>(null)
  const [key, setKey] = useState(0)

  const play = (list: RevealItem[]) => {
    setConfirm(false)
    setItems(list)
    setKey(key + 1)
  }

  return (
    <Section
      id="nhan-anh"
      title="Nhận ảnh"
      note="Thứ tự: ảnh cá nhân → ảnh nhóm → danh hiệu mới. Server cấp và lưu trước khi hiệu ứng chạy; các nút chỉ điều hướng. Bước xác nhận trước khi khóa là đề xuất — PLAN mục 14, điểm 3 chưa chốt."
    >
      <div className="flex flex-wrap items-start gap-10">
        <div className="flex max-w-sm flex-col gap-6">
          <Sub title="Thử từng độ hiếm">
            <div className="flex flex-wrap gap-2">
              {RARITIES.map((r) => (
                <Chip key={r} on onClick={() => play([card(r)])}>
                  {RARITY_NAME[r]}
                </Chip>
              ))}
            </div>
          </Sub>
          <Sub title="Tình huống">
            <div className="flex flex-col gap-2">
              <GhostButton onClick={() => setConfirm(true)}>Tick việc cuối → xác nhận khóa</GhostButton>
              <GhostButton onClick={() => play(SEQUENCE)}>Cá nhân + nhóm + danh hiệu</GhostButton>
              <GhostButton onClick={() => play([card('common', { owned: 3, cardNo: 8 })])}>Ảnh trùng (lần 3)</GhostButton>
              <GhostButton onClick={() => play([card('supreme', { source: 'admin', cardNo: 77 })])}>Quà admin</GhostButton>
            </div>
          </Sub>
        </div>

        <Device label="Màn nhận ảnh trên lịch">
          <CalendarScreen />
          {confirm && (
            <>
              <button
                type="button"
                aria-label="Đóng"
                className="absolute inset-0 z-20 bg-(--c-scrim)"
                onClick={() => setConfirm(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="claim-title"
                className="absolute inset-x-0 bottom-0 z-21 rounded-t-sheet bg-paper px-[18px] pt-2.5 pb-[26px]"
              >
                <div className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-line" />
                <h2 id="claim-title" className="text-h2 font-black">
                  Xong hết việc ngày 14/10!
                </h2>
                <p className="mt-2 flex items-start gap-2 rounded-field bg-sleeve p-3 text-meta font-bold">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-paper">
                    <LockIcon size={10} />
                  </span>
                  Nhận ảnh sẽ khóa việc của bạn trong ngày này: không thêm, sửa, xóa hay bỏ tick được nữa.
                </p>
                <BigButton className="mt-3" onClick={() => play(SEQUENCE.slice(0, 1))}>
                  Nhận ảnh
                </BigButton>
                <GhostButton className="mt-2" onClick={() => setConfirm(false)}>
                  Để sau
                </GhostButton>
              </div>
            </>
          )}
          {items && <Reveal key={key} items={items} onDone={() => setItems(null)} onOpenAlbum={() => setItems(null)} />}
        </Device>
      </div>
    </Section>
  )
}
