import { useState } from 'react'
import { CalendarMonth, DayCell, type DayState } from '../../components/CalendarMonth'
import { MailButton, TabBar } from '../../components/TabBar'
import { TaskRow, type TaskView } from '../../components/TaskRow'
import { Panel, SectionTitle, StreakBadge } from '../../components/ui'
import { WEEKDAY_LONG, weekdayOf } from '../../lib/calendar'
import { Device, Section, Spec, Sub } from './shared'

const ME = 'var(--c-pink)'
const BAO = 'var(--c-mint)'

/** Tháng 10/2026, hôm nay 14/10 — đủ các trạng thái ô. */
const OCT: Record<number, DayState> = {
  1: { group: true, locked: true },
  2: { group: true, locked: true },
  3: { me: true, locked: true },
  4: { me: true, locked: true },
  5: { group: true, locked: true },
  6: { group: true, locked: true },
  7: { group: true, locked: true },
  8: { me: true, locked: true },
  9: { saved: true, locked: true },
  10: { group: true, locked: true },
  11: { me: true, empty: false, locked: true },
  12: { group: true, locked: true },
  13: { empty: true },
  14: { dots: [ME, BAO] },
  15: { dots: [ME] },
  16: { dots: [ME, BAO], pendingSync: true },
  20: { dots: [BAO] },
  21: { dots: [ME, BAO] },
  27: { dots: [ME] },
}

const TODAY: TaskView[] = [
  { title: 'Nộp báo cáo tuần', time: '09:00', done: true, tag: { label: 'Công việc', color: 'var(--c-pink)' } },
  { title: 'Gọi lại cho khách', time: '11:30', done: true, tag: { label: 'Công việc', color: 'var(--c-pink)' } },
  { title: 'Mua quà sinh nhật', time: 'Cả ngày', done: false, tag: { label: 'Cá nhân', color: 'var(--c-butter)' } },
]

const BG_PRESETS = [
  { name: 'Mặc định', bg: 'transparent' },
  { name: 'Tím mơ', bg: 'linear-gradient(160deg,#C9B8FF,#FFD1E8)' },
  { name: 'Hoàng hôn', bg: 'linear-gradient(160deg,#FFD6A5,#FF9AC1)' },
]

export function CalendarScreen({
  year = 2026,
  month0 = 9,
  today = 14,
  days = OCT,
  calBg,
}: {
  year?: number
  month0?: number
  today?: number
  days?: Record<number, DayState>
  calBg?: string
}) {
  const [tasks, setTasks] = useState(TODAY)
  const [picked, setPicked] = useState<number | null>(null)
  return (
    <>
      <div className="h-[34px] shrink-0" />
      <div className="relative flex-1 overflow-y-auto pb-3 [scrollbar-width:none]" style={{ background: calBg }}>
        {/* @container: màn hẹp thu nhỏ tên tháng (không xuống dòng) và rút gọn nhãn streak */}
        <header className="@container flex items-end justify-between gap-2 px-4 pt-0.5 pb-2">
          <div className="min-w-0">
            <button type="button" className="pb-1 text-meta font-bold text-soft">
              Lịch nhóm bạn ▾
            </button>
            <h1 className="text-display font-black whitespace-nowrap text-(--cal-month) [font-size:min(2.625rem,11.5cqw)]">
              Tháng {month0 + 1}
            </h1>
          </div>
          <div className="flex items-center gap-2 pb-1 @min-[20rem]:gap-3">
            <StreakBadge days={12} />
            <MailButton unread={2} />
          </div>
        </header>
        <div className="px-4">
          <CalendarMonth year={year} month0={month0} today={today} days={days} onPick={setPicked} />
        </div>
        <div className="mx-4 mt-3.5">
          <Panel>
            <SectionTitle aside={`${tasks.filter((t) => t.done).length}/${tasks.length}`}>
              {picked ? `${WEEKDAY_LONG[weekdayOf(year, month0, picked)]}, ${picked}/${month0 + 1}` : 'Việc hôm nay'}
            </SectionTitle>
            <div className="mt-2">
              {tasks.map((t, i) => (
                <TaskRow key={i} task={t} onToggle={() => setTasks(tasks.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
      <button
        type="button"
        aria-label="Thêm việc"
        className="absolute right-[18px] bottom-24 z-10 h-14 w-14 -rotate-6 rounded-fab bg-pink text-[30px] leading-none font-bold text-white shadow-fab"
      >
        +
      </button>
      <TabBar active="calendar" badges={{ friends: 1 }} />
    </>
  )
}

const LEGEND: Array<{ label: string; day: number; state?: DayState; today?: boolean; future?: boolean }> = [
  { label: 'Thường', day: 4 },
  { label: 'Hôm nay', day: 14, today: true },
  { label: 'Tương lai có việc (màu thành viên)', day: 21, future: true, state: { dots: [ME, BAO] } },
  { label: 'Thẻ cá nhân + khóa', day: 3, state: { me: true, locked: true } },
  { label: 'Thẻ nhóm phủ ô, số vẫn hiện', day: 5, state: { group: true, locked: true } },
  { label: 'Dùng thẻ cứu', day: 9, state: { saved: true, locked: true } },
  { label: 'Ngày trống (giữ streak)', day: 13, state: { empty: true } },
  { label: 'Chờ đồng bộ', day: 16, state: { dots: [ME], pendingSync: true } },
]

/** Tháng 8/2026 bắt đầu thứ Bảy → 6 hàng. */
const AUG: Record<number, DayState> = { 1: { me: true, locked: true }, 2: { group: true, locked: true }, 31: { dots: [ME] } }

export function CalendarScreens() {
  const [bg, setBg] = useState(0)
  return (
    <Section
      id="lich"
      title="Lịch tháng"
      note="Ô tỉ lệ 3:4 như thẻ bài. Trạng thái không chỉ dựa vào màu: khóa/đồng bộ có biểu tượng, ngày trống có vòng đứt, ngày cứu có sọc. Chạm ô để đổi tiêu đề danh sách."
    >
      <Sub title="Các trạng thái ô ngày">
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
          {LEGEND.map((l) => (
            <Spec key={l.label} label={l.label}>
              <div className="w-12">
                <DayCell day={l.day} today={l.today} future={l.future} state={l.state} />
              </div>
            </Spec>
          ))}
        </div>
      </Sub>
      <Sub title="Nền tháng (theme theo lịch)">
        <div className="flex flex-wrap gap-2">
          {BG_PRESETS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setBg(i)}
              aria-pressed={bg === i}
              className={`rounded-full border-2 px-3 py-1.5 text-meta font-bold ${bg === i ? 'border-ink bg-ink text-on-ink' : 'border-line text-soft'}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </Sub>
      <div className="mt-6 flex flex-wrap items-start gap-10">
        <Device label="Lịch · 390pt · tháng 5 hàng">
          <CalendarScreen calBg={BG_PRESETS[bg]?.bg} />
        </Device>
        <Device label="Tháng 6 hàng (8/2026)">
          <CalendarScreen month0={7} today={31} days={AUG} calBg={BG_PRESETS[bg]?.bg} />
        </Device>
        <Device label="Màn nhỏ 320pt" width={320} height={700}>
          <CalendarScreen calBg={BG_PRESETS[bg]?.bg} />
        </Device>
      </div>
    </Section>
  )
}
