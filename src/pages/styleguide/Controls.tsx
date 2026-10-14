import { useState, type CSSProperties, type ReactNode } from 'react'
import { MailButton, TabBar, type TabKey } from '../../components/TabBar'
import { TaskRow, type TaskView } from '../../components/TaskRow'
import {
  BigButton,
  Chip,
  ClaimButton,
  CountDot,
  GhostButton,
  LabelDot,
  MiniAvatar,
  Panel,
  SectionTitle,
  StreakBadge,
  Swatch,
  TaskTag,
  TextField,
  Toggle,
} from '../../components/ui'
import { RARITIES, RARITY_NAME, RARITY_VAR, cardColors, type Rarity } from '../../lib/rarity'
import { Section, Spec, Sub } from './shared'

const LABELS = [
  { label: 'Công việc', color: 'var(--c-pink)' },
  { label: 'Học', color: 'var(--c-sky)' },
  { label: 'Cá nhân', color: 'var(--c-butter)' },
  { label: 'Sức khỏe', color: 'var(--c-mint)' },
]

const TASKS: TaskView[] = [
  { title: 'Nộp báo cáo tuần', time: '09:00', done: true, tag: LABELS[0] },
  { title: 'Gọi lại cho khách', time: '11:30', done: false, tag: LABELS[1] },
  {
    title: 'Mua quà sinh nhật cho cả nhóm, nhớ hỏi trước size áo và màu yêu thích của từng người',
    time: 'Cả ngày',
    done: false,
    tag: LABELS[2],
  },
  { title: 'Chạy bộ 3 km', time: '06:00', done: false, owner: { name: 'Gia Bảo', color: 'var(--c-mint)' } },
  { title: 'Ôn từ vựng', time: '20:00', done: true, locked: true, tag: LABELS[1] },
  { title: 'Tưới cây', time: '07:15', done: true, pendingSync: true, tag: LABELS[2] },
]

export function Controls() {
  const [chip, setChip] = useState(0)
  const [tog, setTog] = useState(true)
  const [dot, setDot] = useState(0)
  const [tab, setTab] = useState<TabKey>('calendar')
  const [tasks, setTasks] = useState(TASKS)

  return (
    <>
      <Section id="dieu-khien" title="Điều khiển">
        <div className="grid gap-8 md:grid-cols-2">
          <Sub title="Nút">
            <div className="flex max-w-sm flex-col gap-3">
              <BigButton>Lưu việc</BigButton>
              <GhostButton>Để sau</GhostButton>
              <BigButton disabled>Đang lưu…</BigButton>
              <div className="flex items-center gap-4">
                <ClaimButton>Nhận quà</ClaimButton>
                <ClaimButton disabled>Đã nhận</ClaimButton>
              </div>
              <div className="flex items-center gap-6">
                <Spec label="FAB thêm việc">
                  <button
                    type="button"
                    aria-label="Thêm việc"
                    className="h-14 w-14 -rotate-6 rounded-fab bg-pink text-[30px] leading-none font-bold text-white shadow-fab"
                  >
                    +
                  </button>
                </Spec>
                <Spec label="Streak">
                  <StreakBadge days={12} />
                </Spec>
                <Spec label="Hòm thư">
                  <MailButton unread={3} />
                </Spec>
                <Spec label="Chấm đếm">
                  <CountDot n={7} />
                </Spec>
              </div>
            </div>
          </Sub>
          <Sub title="Lựa chọn và nhập liệu">
            <div className="flex max-w-sm flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {['Tôi', 'Gia Bảo', 'Thu Trang'].map((t, i) => (
                  <Chip key={t} on={chip === i} onClick={() => setChip(i)}>
                    {t}
                  </Chip>
                ))}
              </div>
              <TextField placeholder="Việc mới: ví dụ gọi lại cho khách" />
              <TextField defaultValue="sai_ten" aria-invalid className="border-danger" />
              <p className="-mt-3 text-meta font-bold text-danger">Không tìm thấy người dùng này.</p>
              <label className="flex items-center justify-between text-meta font-bold">
                Cả ngày <Toggle on={tog} onChange={setTog} label="Cả ngày" />
              </label>
              <div className="flex items-center gap-2 text-meta font-bold">
                Nhãn
                {LABELS.map((l, i) => (
                  <LabelDot key={l.label} color={l.color} label={l.label} on={dot === i} onClick={() => setDot(i)} />
                ))}
              </div>
              <div className="flex items-center gap-2 text-meta font-bold">
                Màu khung
                {['#1E1B5E', '#FF2E88', '#2F8CFF', '#9B5CFF', '#FFE45E', '#35D0A5'].map((c) => (
                  <Swatch key={c} color={c} label={c} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {LABELS.map((l) => (
                  <TaskTag key={l.label} color={l.color}>
                    {l.label}
                  </TaskTag>
                ))}
              </div>
            </div>
          </Sub>
        </div>
        <Sub title="Thanh tab (đề xuất 5 tab, mở Lịch; hòm thư ở đầu màn)">
          <div className="max-w-[390px] overflow-hidden rounded-card border-[1.5px] border-line">
            <TabBar active={tab} onChange={setTab} badges={{ friends: 1 }} />
          </div>
        </Sub>
      </Section>

      <Section id="danh-sach" title="Danh sách và thẻ">
        <div className="grid gap-6 lg:grid-cols-2">
          <Sub title="Việc trong ngày — của tôi, của bạn cùng lịch (chỉ xem), đã khóa, chờ đồng bộ, tên dài">
            <Panel>
              <SectionTitle aside={`${tasks.filter((t) => t.done).length}/${tasks.length}`}>Việc hôm nay</SectionTitle>
              <div className="mt-2">
                {tasks.map((t, i) => (
                  <TaskRow
                    key={i}
                    task={t}
                    onToggle={() => setTasks(tasks.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
                  />
                ))}
              </div>
            </Panel>
          </Sub>
          <div>
            <Sub title="Hòm thư">
              <div className="flex flex-col gap-2.5">
                <MailCard
                  fresh
                  title="Quà chào mừng bạn đến Colentis"
                  body="Cảm ơn bạn đã là người chơi đầu tiên! Nhận ngay ảnh hiếm và thẻ cứu streak."
                  gifts={[
                    { label: 'Ảnh Huyền Thoại', rarity: 'legend' },
                    { label: 'Thẻ cứu streak ×2', rarity: 'rare' },
                  ]}
                />
                <MailCard
                  title="Quà tháng sinh nhật"
                  body="Danh hiệu giới hạn kèm cặp frame."
                  gifts={[{ label: 'Danh hiệu giới hạn', rarity: 'supreme', round: true }]}
                  claimed
                />
              </div>
            </Sub>
            <Sub title="Bạn bè">
              <Panel>
                <FriendRow name="Hà My" user="hamy_2k" rarity="rare" i={1} action={<Chip on>Chấp nhận</Chip>} />
                <FriendRow name="Gia Bảo" user="giabao_x · streak 30" rarity="supreme" i={2} action={<Chip>Cùng lịch</Chip>} />
                <FriendRow
                  name="Nguyễn Thị Phương Thảo Nguyên"
                  user="phuongthaonguyen_99 · streak 2"
                  rarity="common"
                  i={4}
                  action={<Chip>Mời vào lịch</Chip>}
                />
              </Panel>
            </Sub>
          </div>
        </div>
        <Sub title="Bộ sưu tập — một kho chung, tiến độ theo độ hiếm">
          <AlbumPreview />
        </Sub>
      </Section>
    </>
  )
}

function MailCard({
  title,
  body,
  gifts,
  fresh,
  claimed,
}: {
  title: string
  body: string
  gifts: Array<{ label: string; rarity: Rarity; round?: boolean }>
  fresh?: boolean
  claimed?: boolean
}) {
  return (
    <div className="relative rounded-card border-[1.5px] border-line bg-paper p-3.5">
      {fresh && <span className="absolute top-4 -left-1 h-[9px] w-[9px] rounded-full bg-pink" aria-label="Chưa đọc" />}
      <h3 className="text-h3 font-black">{title}</h3>
      <p className="mt-1 mb-2.5 text-meta text-soft">{body}</p>
      <div className="flex flex-wrap gap-1.5">
        {gifts.map((g) => (
          <span
            key={g.label}
            className="inline-flex items-center gap-[7px] rounded-[12px] border-2 bg-sleeve py-[5px] pr-2.5 pl-[5px] text-meta font-bold"
            style={{ borderColor: RARITY_VAR[g.rarity] }}
          >
            <i
              className={g.round ? 'h-[26px] w-[26px] rounded-full' : 'h-7 w-[22px] rounded-[5px]'}
              style={{ background: `linear-gradient(160deg, ${RARITY_VAR[g.rarity]}, #fff)` }}
            />
            {g.label}
          </span>
        ))}
      </div>
      <div className="mt-2.5">
        <ClaimButton disabled={claimed}>{claimed ? 'Đã nhận' : 'Nhận quà'}</ClaimButton>
      </div>
    </div>
  )
}

function FriendRow({
  name,
  user,
  rarity,
  i,
  action,
}: {
  name: string
  user: string
  rarity: Rarity
  i: number
  action: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-t-[1.5px] border-dashed border-line py-2.5 first:border-t-0 first:pt-0 last:pb-0">
      <MiniAvatar rarity={rarity} colors={cardColors(i)} />
      <div className="min-w-0 flex-1">
        <b className="block text-body break-words">{name}</b>
        <small className="block text-micro break-all text-soft">@{user}</small>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

const TOTAL: Record<Rarity, number> = { common: 30, rare: 30, legend: 15, supreme: 4 }
const HAVE: Record<Rarity, number> = { common: 22, rare: 14, legend: 5, supreme: 0 }

function AlbumPreview() {
  return (
    <div className="max-w-[390px] rounded-card border-[1.5px] border-line bg-sleeve py-3">
      <div className="flex gap-1.5 px-4">
        {RARITIES.map((r) => (
          <div
            key={r}
            className="flex-1 rounded-[12px] border-2 bg-paper px-1 py-[7px] text-center text-[10px] font-bold text-soft"
            style={{ borderColor: RARITY_VAR[r] }}
          >
            <b className="block text-[15px] text-ink">
              {HAVE[r]}/{TOTAL[r]}
            </b>
            {RARITY_NAME[r]}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-[7px] px-4 pt-3">
        {RARITIES.flatMap((r, ri) =>
          Array.from({ length: ri < 2 ? 4 : 2 }, (_, i) => {
            const owned = i < Math.min(HAVE[r], ri < 2 ? 3 : 1)
            const [a, b] = cardColors(i + ri)
            const dup = owned && i === 0 && ri < 2 ? ri + 2 : 0
            return owned ? (
              <button
                key={r + i}
                type="button"
                aria-label={`Ảnh ${RARITY_NAME[r]}${dup ? `, đã nhận ${dup} lần` : ''}`}
                className="card-art relative aspect-3/4 rounded-tile border-[2.5px]"
                style={{ borderColor: RARITY_VAR[r], '--a': a, '--b': b } as CSSProperties}
              >
                {dup > 0 && (
                  <span className="absolute right-1 bottom-1 rounded-full bg-navy/80 px-1.5 text-[10px] font-black text-white">
                    ×{dup}
                  </span>
                )}
              </button>
            ) : (
              <span key={r + i} className="aspect-3/4 rounded-tile border-2 border-dashed border-line bg-paper" aria-label="Chưa có" />
            )
          }),
        )}
      </div>
    </div>
  )
}
