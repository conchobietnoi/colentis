import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isConfigured = Boolean(url && key)

if (!isConfigured) {
  console.warn('Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY. Xem .env.example')
}

// Khóa anon là khóa công khai, an toàn khi đặt trong frontend; quyền thật nằm ở RLS và hàm RPC.
export const supabase = createClient(url ?? 'http://localhost:54321', key ?? 'anon-key-missing', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'colentis-auth' },
  realtime: { params: { eventsPerSecond: 5 } },
})
