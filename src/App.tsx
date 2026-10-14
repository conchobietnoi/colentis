import { useEffect, useRef } from 'react'
import { isConfigured } from './lib/supabase'
import { mount } from './ui/mount'

export default function App() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isConfigured && host.current) mount(host.current)
  }, [])
  if (!isConfigured) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui', color: '#1E1B5E', maxWidth: 480, margin: '10vh auto' }}>
        <h1>Colentis chưa được cấu hình</h1>
        <p>Thiếu <code>VITE_SUPABASE_URL</code> và <code>VITE_SUPABASE_ANON_KEY</code>. Xem README để thêm vào <code>.env.local</code> (khi chạy máy) hoặc biến Repository variables (khi deploy).</p>
      </div>
    )
  }
  return <div ref={host} />
}
