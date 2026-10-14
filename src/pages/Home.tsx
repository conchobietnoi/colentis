import { Link } from 'react-router'

/** Màn tạm — app thật bắt đầu ở giai đoạn 3 (tài khoản, database). */
export function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-display font-black">Colentis</h1>
      <p className="text-body text-soft">Lịch ghi chú chung, album photocard. Bản dựng khung — chưa có tài khoản và dữ liệu.</p>
      <Link to="/style-guide" className="rounded-btn bg-pink px-4 py-[15px] text-center text-base font-black text-white">
        Mở style guide
      </Link>
    </main>
  )
}
