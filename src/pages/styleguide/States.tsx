import type { ReactNode } from 'react'
import { LockIcon, SyncIcon } from '../../components/CalendarMonth'
import { GhostButton, Panel } from '../../components/ui'
import { Section, Sub } from './shared'

function Banner({ tone, icon, children }: { tone: 'info' | 'warn' | 'error' | 'ok'; icon: ReactNode; children: ReactNode }) {
  const cls = {
    info: 'bg-sky/15 border-sky text-ink',
    warn: 'bg-butter/30 border-butter text-ink',
    error: 'bg-danger/10 border-danger text-ink',
    ok: 'bg-mint/15 border-mint text-ink',
  }[tone]
  return (
    <div role="status" className={`flex items-start gap-2.5 rounded-field border-2 px-3.5 py-3 text-meta font-bold ${cls}`}>
      <span className="mt-px shrink-0">{icon}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function Skeleton({ className }: { className: string }) {
  return <div className={`motion-safe:animate-pulse rounded-cell bg-line/60 ${className}`} />
}

function Empty({ title, body, action }: { title: string; body: string; action?: string }) {
  return (
    <Panel className="flex flex-col items-center gap-2 py-6 text-center">
      <div className="card-art h-14 w-11 -rotate-6 rounded-tile opacity-60" />
      <b className="mt-1 text-h3">{title}</b>
      <p className="max-w-[28ch] text-meta text-soft">{body}</p>
      {action && <GhostButton className="mt-2 w-auto px-5 py-2">{action}</GhostButton>}
    </Panel>
  )
}

const dot = (c: string) => <span className="block h-3 w-3 rounded-full" style={{ background: c }} />

export function States() {
  return (
    <Section
      id="trang-thai"
      title="Trạng thái"
      note="Mọi màn phải có: trống, đang tải, lỗi, mất mạng, chờ đồng bộ, ngày khóa, ngày cứu, ảnh trùng và ngày trống."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <Sub title="Thông báo dải">
          <div className="flex flex-col gap-2.5">
            <Banner tone="warn" icon={dot('var(--c-butter)')}>
              Đang ngoại tuyến. Bạn vẫn xem, thêm và tick việc được — app sẽ đồng bộ khi có mạng.
            </Banner>
            <Banner tone="info" icon={<SyncIcon size={12} />}>
              2 thay đổi đang chờ đồng bộ.
            </Banner>
            <Banner tone="error" icon={dot('var(--c-danger)')}>
              Không lưu được: ngày 12/10 đã khóa sau khi bạn nhận ảnh. Thay đổi lúc ngoại tuyến đã bị bỏ.
            </Banner>
            <Banner tone="error" icon={dot('var(--c-danger)')}>
              Việc này vừa được sửa trên thiết bị khác. <u>Xem lại</u> trước khi lưu.
            </Banner>
            <Banner tone="ok" icon={dot('var(--c-mint)')}>
              Đã đồng bộ.
            </Banner>
          </div>
        </Sub>

        <Sub title="Ngày đặc biệt (đầu sheet chi tiết ngày)">
          <div className="flex flex-col gap-2.5">
            <Banner tone="info" icon={<LockIcon size={12} />}>
              Ngày đã khóa — bạn đã nhận ảnh. Chỉ xem lại.
            </Banner>
            <div className="rounded-field border-2 border-line bg-[repeating-linear-gradient(135deg,var(--c-paper)_0_5px,var(--c-line)_5px_7px)] px-3.5 py-3 text-meta font-bold">
              Đã dùng thẻ cứu streak cho ngày này. Các việc chưa làm không được tính là đã xong.
            </div>
            <div className="flex items-center gap-2.5 rounded-field border-2 border-dashed border-line px-3.5 py-3 text-meta font-bold text-soft">
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-dashed border-soft" />
              Ngày trống — vẫn giữ streak, không có ảnh cá nhân.
            </div>
            <div className="flex items-center gap-2.5 rounded-field border-2 border-rare bg-paper px-3.5 py-3 text-meta font-bold">
              <span className="card-art h-8 w-6 shrink-0 rounded-[5px]" />
              <span>
                Bạn đã có ảnh này <span className="text-soft">· đã nhận 3 lần</span>
              </span>
            </div>
            <Banner tone="warn" icon={dot('var(--c-butter)')}>
              Còn 31 giờ để tick bù hoặc dùng thẻ cứu cho 13/10. Còn 4/5 thẻ tháng này.
            </Banner>
          </div>
        </Sub>

        <Sub title="Đang tải / trống">
          <div className="flex flex-col gap-3">
            <Panel>
              <Skeleton className="h-4 w-28" />
              <div className="mt-3 grid grid-cols-7 gap-1">
                {Array.from({ length: 14 }, (_, i) => (
                  <Skeleton key={i} className="aspect-3/4" />
                ))}
              </div>
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </Panel>
            <Empty title="Chưa có việc nào" body="Ngày trống vẫn giữ streak. Thêm việc để có cơ hội nhận ảnh." action="Thêm việc" />
            <Empty title="Album còn trống" body="Hoàn thành hết việc trong ngày để nhận tấm ảnh đầu tiên." />
          </div>
        </Sub>
      </div>
    </Section>
  )
}
