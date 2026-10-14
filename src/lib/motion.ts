import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  // Công tắc trong app ghi vào <html data-motion="reduce">
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })
  return () => {
    mq.removeEventListener('change', cb)
    mo.disconnect()
  }
}

function snapshot() {
  return window.matchMedia(QUERY).matches || document.documentElement.dataset.motion === 'reduce'
}

/** true khi máy bật giảm chuyển động hoặc người dùng tắt hiệu ứng trong app. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false)
}
