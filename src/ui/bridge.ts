import { api, appErrorOf } from '../lib/api'
import { supabase, isConfigured } from '../lib/supabase'
import { toAppError } from '../lib/errors'
import type { Task } from '../lib/types'
import { BLANK, dropImgCache, imgNow, loadImg } from './images'
import { friendStreak, keyOfIso, loadLite, loadSnapshot, mapTaskList, monthRange, resetCaches, serverNow } from './loader'
import type { UiSnapshot } from './snapshot'

type Hooks = { background?: () => void; offline?: () => void; signedOut?: () => void; recovery?: () => void }
type QueueOp = { op: string; type: 'done' | 'add'; id: string; done?: boolean; row?: Record<string, unknown>; ts: string }

const base = import.meta.env.BASE_URL
const NET = /Failed to fetch|NetworkError|Load failed|network|ECONN|timeout/i
let hooks: Hooks = {}
let last: UiSnapshot | null = null
let myId = ''
let netDown = false
let recovery = /type=recovery/.test(location.hash)
const months = new Map<string, [number, number]>()   // 'y-m' → [y, m0]
const chains = new Map<string, Promise<unknown>>()

const online = () => navigator.onLine && !netDown
const isNet = (e: unknown) => !navigator.onLine || NET.test(String((e as any)?.message ?? e))

function qKey() { return 'colentis:queue:' + myId }
function readQ(): QueueOp[] { try { return JSON.parse(localStorage.getItem(qKey()) || '[]') } catch { return [] } }
function writeQ(q: QueueOp[]) { try { localStorage.setItem(qKey(), JSON.stringify(q)) } catch { /* bỏ qua */ } }
const pendingCount = () => (myId ? readQ().length : 0)

function trackMonth(y: number, m0: number) {
  months.set(`${y}-${m0}`, [y, m0])
  if (months.size > 6) { const first = months.keys().next().value; if (first) months.delete(first) }
}

async function fullReload(): Promise<UiSnapshot> {
  if (last) trackMonth(last.today.y, last.today.m)
  const sn = await loadSnapshot({ months: [...months.values()] })
  netDown = false
  myId = sn.me.uid
  last = sn
  if (!months.size) trackMonth(sn.today.y, sn.today.m)
  await overlayQueue(sn)
  return sn
}

/** Phủ các thay đổi đang chờ đồng bộ lên dữ liệu vừa tải để người dùng vẫn thấy việc đã tick offline. */
async function overlayQueue(sn: UiSnapshot) {
  for (const op of readQ()) {
    if (op.type === 'done') {
      for (const list of Object.values(sn.tasks)) { const t = list.find((x) => x.id === op.id); if (t) { t.done = !!op.done; t.pending = true } }
    } else if (op.type === 'add' && op.row) {
      const r = op.row as any
      const k = keyOfIso(r.day)
      if (!(sn.tasks[k] ?? []).some((x) => x.id === op.id)) {
        ;(sn.tasks[k] ??= []).push({ id: op.id, t: r.title, owner: 'me', cal: r.calendar_id, label: Math.max(0, ['Công việc', 'Học tập', 'Cá nhân', 'Sức khỏe', 'Việc nhà', 'Cho người khác'].indexOf(r.label ?? '')), allday: !!r.all_day, start: r.start_time ?? '09:00', end: r.end_time ?? '', note: r.note ?? '', done: false, version: 1, pending: true })
      }
    }
  }
}

/** Làm mới nhẹ sau khi tick/thêm/sửa việc: chỉ tải lại hồ sơ, việc, khóa ngày, thẻ đã nhận và trạng thái hôm nay. */
async function liteReload(): Promise<UiSnapshot> {
  if (!last) return fullReload()
  const fresh = await loadLite(last, [...months.values()])
  netDown = false
  last = fresh
  await overlayQueue(fresh)
  return fresh
}

async function serial<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = chains.get(key) ?? Promise.resolve()
  const next = prev.catch(() => undefined).then(fn)
  chains.set(key, next)
  try { return await next } finally { if (chains.get(key) === next) chains.delete(key) }
}

function findTask(id: string) {
  if (!last) return null
  for (const list of Object.values(last.tasks)) { const t = list.find((x) => x.id === id); if (t) return t }
  return null
}

async function wrap<T>(p: Promise<T>): Promise<T> {
  try { return await p } catch (e) {
    if (isNet(e)) netDown = true
    if (!(e as any)?.app) (e as any).app = toAppError(e)
    throw e
  }
}

let channel: ReturnType<typeof supabase.channel> | null = null
let pollTimer = 0
let bgBusy = false
let lastBg = 0
async function backgroundRefresh() {
  if (bgBusy || !myId || document.hidden || !online()) return
  bgBusy = true
  try { await flush(); await fullReload(); lastBg = Date.now(); hooks.background?.() } catch { /* im lặng */ } finally { bgBusy = false }
}

async function flush() {
  const q = readQ()
  if (!q.length || !navigator.onLine) return
  const rest: QueueOp[] = []
  for (let i = 0; i < q.length; i++) {
    const op = q[i]
    try {
      if (op.type === 'add') {
        await api.addTask({ ...(op.row as any), op_id: op.op, client_ts: op.ts })
      } else {
        const cur = await supabase.from('tasks').select('id,version,done').eq('id', op.id).maybeSingle()
        if (cur.error) throw cur.error
        if (cur.data && cur.data.done !== op.done) await api.updateTask(op.id, cur.data.version, { done: op.done } as Partial<Task>)
      }
    } catch (e) {
      if (isNet(e)) { rest.push(...q.slice(i)); break }
      // lỗi nghiệp vụ (ngày đã khóa, quá hạn...): bỏ thao tác này
      const msg = appErrorOf(e).message
      if (typeof window !== 'undefined') console.warn('Bỏ thao tác chờ đồng bộ:', msg)
    }
  }
  writeQ(rest)
}

function pickUsername(email: string) {
  let u = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
  if (u.length < 4) u = (u + 'fan_cortis').slice(0, 12)
  return u.slice(0, 19)
}

export const bridge = {
  base,
  BLANK,
  loadImg,
  current: () => last as UiSnapshot,
  googleOn: import.meta.env.VITE_ENABLE_GOOGLE === '1',
  online,
  now: () => serverNow(),
  imgNow,
  bind(h: Hooks) { hooks = h },
  pendingCount,

  // ----- phiên đăng nhập -----
  async hasSession() { if (!isConfigured) return false; const { data } = await supabase.auth.getSession(); return !!data.session },
  isRecovery: () => recovery,
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw Object.assign(error, { app: toAppError(error) })
    recovery = false
  },
  async signUp(a: { email: string; password: string; name: string; birthday: string }) {
    let username = pickUsername(a.email)
    for (let i = 0; i < 6; i++) {
      try { if (await api.usernameAvailable(username)) break } catch { break }
      username = (pickUsername(a.email).slice(0, 14) + Math.floor(Math.random() * 99999)).slice(0, 19)
    }
    const { data, error } = await supabase.auth.signUp({ email: a.email, password: a.password, options: { data: { username, display_name: a.name, birthday: a.birthday || '' } } })
    if (error) {
      let app = toAppError(error)
      try { if (!(await api.registrationOpen())) app = { ...app, code: 'REGISTRATION_CLOSED', message: 'Đăng ký đang đóng.' } } catch { /* bỏ qua */ }
      throw Object.assign(error, { app })
    }
    return { needsConfirm: !data.session }
  },
  async signOut() {
    if (channel) supabase.removeChannel(channel)
    channel = null; clearInterval(pollTimer)
    await supabase.auth.signOut()
    last = null; myId = ''; months.clear(); resetCaches(); await dropImgCache()
  },
  registrationOpen: () => api.registrationOpen(),
  usernameAvailable: (u: string) => api.usernameAvailable(u),
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin + base })
    if (error && !/not found/i.test(error.message)) throw Object.assign(error, { app: toAppError(error) })
  },
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw Object.assign(error, { app: toAppError(error) })
    recovery = false
  },
  async signInGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + base } })
    if (error) throw Object.assign(error, { app: toAppError(error) })
  },

  // ----- dữ liệu -----
  async loadSnapshot(): Promise<UiSnapshot> { await api.ensureLoginEvents().catch(() => 0); return wrap(fullReload()) },
  async loadReload(mode?: string): Promise<UiSnapshot> { return wrap(mode === 'lite' ? liteReload() : fullReload()) },
  async ensureMonth(y: number, m0: number) {
    const k = `${y}-${m0}`
    if (months.has(k) || !last) return false
    trackMonth(y, m0)
    const { from, to } = monthRange(y, m0)
    const [tasks, locks] = await wrap(Promise.all([api.tasks(from, to), api.locks(from, to)]))
    const sn = last
    const mapped = mapTaskList(tasks, sn.me.uid)
    for (const [k2, list] of Object.entries(mapped)) sn.tasks[k2] = list
    for (const l of locks) sn.locks[l.day] = l.reason
    return true
  },

  // ----- việc -----
  async addTask(row: Record<string, unknown> & { day: string; calendar_id: string; title: string }) {
    const op = crypto.randomUUID()
    if (!online()) {
      const id = crypto.randomUUID()
      writeQ([...readQ(), { op, type: 'add', id, row, ts: new Date().toISOString() }])
      if (last) { const sn = last; await overlayQueue(sn) }
      return { queued: true }
    }
    try { await wrap(api.addTask({ ...row, op_id: op, client_ts: new Date().toISOString() } as never)); return { queued: false } } catch (e) {
      if (isNet(e)) { const id = crypto.randomUUID(); writeQ([...readQ(), { op, type: 'add', id, row, ts: new Date().toISOString() }]); if (last) await overlayQueue(last); return { queued: true } }
      throw e
    }
  },
  async editTask(id: string, patch: Record<string, unknown>) {
    if (!online()) throw Object.assign(new Error('offline'), { app: { code: 'OFFLINE', message: 'Cần có mạng để sửa việc.', offline: true } })
    return serial(id, async () => {
      const t = findTask(id)
      const r = await wrap(api.updateTask(id, t?.version ?? 1, patch as Partial<Task>))
      if (!r.length) throw Object.assign(new Error('NOT_FOUND'), { app: toAppError(new Error('NOT_FOUND')) })
      return { queued: false }
    })
  },
  async deleteTask(id: string) {
    if (!online()) throw Object.assign(new Error('offline'), { app: { code: 'OFFLINE', message: 'Cần có mạng để xóa việc.', offline: true } })
    await wrap(api.deleteTask(id))
  },
  async setDone(t: { id: string; version: number }, done: boolean) {
    const queue = () => { writeQ([...readQ().filter((o) => !(o.type === 'done' && o.id === t.id)), { op: crypto.randomUUID(), type: 'done', id: t.id, done, ts: new Date().toISOString() }]); return { queued: true } }
    if (!online()) return queue()
    return serial(t.id, async () => {
      try {
        const r = await wrap(api.updateTask(t.id, t.version, { done } as Partial<Task>))
        if (!r.length) throw Object.assign(new Error('VERSION_CONFLICT'), { app: toAppError(new Error('VERSION_CONFLICT')) })
        t.version = r[0].version
        return { queued: false }
      } catch (e) { if (isNet(e)) return queue(); throw e }
    })
  },
  flush,

  // ----- thưởng -----
  claimDay: (d: string) => wrap(api.claimDay(d)),
  useRescue: (d: string) => wrap(api.useRescue(d)),
  dayStatus: (d: string) => wrap(api.dayStatus(d)),
  claimMail: (id: string) => wrap(api.claimMail(id)),
  cxState: () => wrap(api.conceptState()),
  cxTick: () => wrap(api.conceptTick()),
  cxOpen: (id: string | null) => wrap(api.conceptOpenPack(id)),
  cxGive: (ids: string[], c: number, s: number, h: boolean) => wrap(api.conceptGive(ids, c, s, h)),
  cxAsk: (ids: string[], c: number, s: number, h: boolean) => wrap(api.conceptAsk(ids, c, s, h)),
  cxClaim: (from: string | null) => wrap(api.conceptClaimGifts(from)),
  cxUltraLock: (n: number, songs: number[]) => wrap(api.conceptUltraLock(n, songs)),
  cxPeople: () => wrap(api.conceptPeople()),
  /** URL ký có hạn cho video/nhạc trong bucket riêng tư `concept` (cần đủ 3 concept). */
  async cxSigned(path: string) {
    const { data } = await supabase.storage.from('concept').createSignedUrl(path, 3600)
    return data?.signedUrl ?? ''
  },
  khaiMacState: () => wrap(api.khaiMacState()),
  eventAsset: (id: string) => api.eventAsset(id).catch(() => null),
  idCardChoose: (m: string) => wrap(api.idCardChoose(m)),
  idCardSave: (h: string, p: string | null, c: { z: number; x: number; y: number }) => wrap(api.idCardSave(h, p, c)),
  async uploadIdPhoto(dataUrl: string) {
    const blob = await (await fetch(dataUrl)).blob()
    const old = last?.idc?.photo_path
    const path = `${myId}/idcard-${Date.now()}.jpg`
    const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    if (error) throw Object.assign(error, { app: toAppError(error) })
    if (old && old !== path) supabase.storage.from('avatars').remove([old]).catch(() => undefined)
    return path
  },
  async idPhotoUrl(path: string) {
    const { data } = await supabase.storage.from('avatars').createSignedUrl(path, 3600)
    return data?.signedUrl ?? ''
  },
  claimKhaiMac: (m: number) => wrap(api.claimKhaiMac(m)),
  claimKhaiMacPack: (member: string) => wrap(api.claimKhaiMacPack(member)),
  markMailRead: (id: string) => { api.markMailRead(id).catch(() => undefined) },
  chooseWelcome: (m: string) => wrap(api.chooseWelcomeMember(m)),
  equip: (id: string | null) => wrap(api.setEquipped(id)),
  setFavs: (ids: string[]) => wrap(api.setFavs(ids)),

  // ----- hồ sơ -----
  updateProfile: (p: Record<string, unknown>) => wrap(api.updateProfile(p)),
  async uploadAvatar(dataUrl: string) {
    const blob = await (await fetch(dataUrl)).blob()
    const old = last?.me.photoPath
    const path = `${myId}/avatar-${Date.now()}.jpg`
    const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    if (error) throw Object.assign(error, { app: toAppError(error) })
    if (old) supabase.storage.from('avatars').remove([old]).catch(() => undefined)
    return path
  },

  // ----- bạn bè, lịch -----
  findUser: (u: string) => wrap(api.findUser(u)),
  sendFriendRequest: (u: string) => wrap(api.sendFriendRequest(u)),
  respondFriend: (id: string, ok: boolean) => wrap(api.respondFriend(id, ok)),
  removeFriend: (uid: string) => wrap(api.removeFriend(uid)),
  friendView: (uid: string) => wrap(api.friendView(uid)),
  friendStreak,
  createCalendar: (n: string) => wrap(api.createCalendar(n)),
  renameCalendar: (c: string, n: string) => wrap(api.renameCalendar(c, n)),
  inviteToCalendar: (c: string, f: string) => wrap(api.inviteToCalendar(c, f)),
  respondInvite: (i: string, ok: boolean) => wrap(api.respondInvite(i, ok)),
  removeMember: (c: string, u: string) => wrap(api.removeMember(c, u)),
  transferOwner: (c: string, u: string) => wrap(api.transferOwner(c, u)),
  leaveCalendar: (c: string) => wrap(api.leaveCalendar(c)),
  deleteCalendar: (c: string, n: string) => wrap(api.deleteCalendar(c, n)),
  saveTheme: (c: string, theme: Record<string, unknown>) => wrap(api.saveCalendarPref(c, theme) as Promise<unknown>),
  sendCheer: (uid: string) => wrap(api.sendCheer(uid)),
  markNotifRead: (ref: string | null) => { api.markNotificationsRead(ref ? [ref] : undefined).catch(() => undefined) },
  adminSendMail: (a: Parameters<typeof api.adminSendMail>[0]) => wrap(api.adminSendMail(a)),
  adminSent: () => wrap(api.adminSent()),

  // ----- thời gian thực -----
  startRealtime() {
    if (channel || !myId) return
    const tables = ['tasks', 'notifications', 'mail_recipients', 'friendships', 'calendar_members', 'calendar_invites', 'concept_packs', 'concept_gifts', 'concept_requests']
    let t = 0
    const kick = () => { clearTimeout(t); t = window.setTimeout(backgroundRefresh, 900) }
    try {
      channel = supabase.channel('colentis-live')
      tables.forEach((tb) => channel!.on('postgres_changes', { event: '*', schema: 'public', table: tb }, kick))
      channel.subscribe()
    } catch { /* không có realtime thì dùng thăm dò định kỳ */ }
    pollTimer = window.setInterval(() => { if (Date.now() - lastBg > 45000) backgroundRefresh() }, 15000)
    document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - lastBg > 15000) backgroundRefresh() })
    window.addEventListener('focus', () => { if (Date.now() - lastBg > 15000) backgroundRefresh() })
  },
}
export type Bridge = typeof bridge

supabase.auth.onAuthStateChange((ev) => {
  if (ev === 'PASSWORD_RECOVERY') { recovery = true; hooks.recovery?.() }
  if (ev === 'SIGNED_OUT') hooks.signedOut?.()
})
