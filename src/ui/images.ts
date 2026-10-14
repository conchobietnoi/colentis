import { supabase } from '../lib/supabase'

// Ảnh thẻ và avatar nằm trong bucket riêng tư: tải bằng phiên đăng nhập, lưu vào Cache Storage để xem lại khi mất mạng.
const CACHE = 'colentis-img-v1'
const mem = new Map<string, string>()          // 'bucket/path' → object URL
const inflight = new Map<string, Promise<string>>()
export const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

let slots = 0
const waiters: (() => void)[] = []
async function slot() { if (slots >= 5) await new Promise<void>((r) => waiters.push(r)); slots++ }
function release() { slots--; waiters.shift()?.() }

async function fetchBlob(bucket: string, path: string): Promise<Blob> {
  const key = `/__img/${bucket}/${path}`
  try {
    const c = await caches.open(CACHE)
    const hit = await c.match(key)
    if (hit) return await hit.blob()
  } catch { /* không có Cache Storage */ }
  await slot()
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path)
    if (error || !data) throw error ?? new Error('NO_IMAGE')
    try { const c = await caches.open(CACHE); await c.put(key, new Response(data, { headers: { 'content-type': data.type } })) } catch { /* bỏ qua */ }
    return data
  } finally { release() }
}

/** Trả về URL dùng ngay nếu đã có, ngược lại BLANK và tải nền (gọi onReady khi xong). */
export function imgNow(bucket: string, path: string | null | undefined, fallback?: string | null): string {
  if (!path) return BLANK
  return mem.get(`${bucket}/${path}`) ?? (fallback && mem.get(`${bucket}/${fallback}`)) ?? BLANK
}

export function loadImg(bucket: string, path: string, fallback?: string | null): Promise<string> {
  const k = `${bucket}/${path}`
  const have = mem.get(k)
  if (have) return Promise.resolve(have)
  let p = inflight.get(k)
  if (!p) {
    p = fetchBlob(bucket, path)
      .catch(async (e) => {
        if (fallback && fallback !== path) return fetchBlob(bucket, fallback)
        throw e
      })
      .then((b) => { const u = URL.createObjectURL(b); mem.set(k, u); return u })
      .finally(() => inflight.delete(k))
    inflight.set(k, p)
  }
  return p
}

export async function dropImgCache() {
  mem.forEach((u) => URL.revokeObjectURL(u)); mem.clear()
  try { await caches.delete(CACHE) } catch { /* bỏ qua */ }
}
