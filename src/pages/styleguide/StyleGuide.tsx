import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Chip, Toggle } from '../../components/ui'
import { CalendarScreens } from './CalendarScreens'
import { Controls } from './Controls'
import { Foundations } from './Foundations'
import { Frames } from './Frames'
import { RevealDemo } from './RevealDemo'
import { States } from './States'

type Theme = 'system' | 'light' | 'dark'

const NAV = [
  ['mau', 'Màu'],
  ['chu', 'Chữ'],
  ['hinh', 'Hình'],
  ['dieu-khien', 'Điều khiển'],
  ['danh-sach', 'Danh sách'],
  ['lich', 'Lịch'],
  ['trang-thai', 'Trạng thái'],
  ['frame', 'Frame'],
  ['nhan-anh', 'Nhận ảnh'],
] as const

/** Công tắc duyệt chỉ có ở style guide; app thật theo cài đặt máy. */
function useHtmlFlag(attr: 'theme' | 'motion', value: string | null) {
  useEffect(() => {
    const root = document.documentElement
    if (value == null) delete root.dataset[attr]
    else root.dataset[attr] = value
    return () => {
      delete root.dataset[attr]
    }
  }, [attr, value])
}

export function StyleGuide() {
  const [theme, setTheme] = useState<Theme>('system')
  const [reduce, setReduce] = useState(false)
  const [bigText, setBigText] = useState(false)

  useHtmlFlag('theme', theme === 'system' ? null : theme)
  useHtmlFlag('motion', reduce ? 'reduce' : null)
  useEffect(() => {
    document.documentElement.style.fontSize = bigText ? '120%' : ''
    return () => {
      document.documentElement.style.fontSize = ''
    }
  }, [bigText])

  return (
    <div className="min-h-dvh bg-sleeve">
      <header className="sticky top-0 z-40 border-b-2 border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="text-h3 font-black">
            Colentis <span className="text-pink">· style guide</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <Chip key={t} on={theme === t} onClick={() => setTheme(t)}>
                {t === 'system' ? 'Theo máy' : t === 'light' ? 'Sáng' : 'Tối'}
              </Chip>
            ))}
          </div>
          <label className="flex items-center gap-2 text-meta font-bold">
            Giảm chuyển động <Toggle on={reduce} onChange={setReduce} label="Giảm chuyển động" />
          </label>
          <label className="flex items-center gap-2 text-meta font-bold">
            Chữ lớn 120% <Toggle on={bigText} onChange={setBigText} label="Chữ lớn" />
          </label>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#/style-guide`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
              }}
              className="rounded-full px-3 py-1 text-meta font-bold whitespace-nowrap text-soft hover:bg-sleeve hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-24">
        <Foundations />
        <Controls />
        <CalendarScreens />
        <States />
        <Frames />
        <RevealDemo />
      </main>
    </div>
  )
}
