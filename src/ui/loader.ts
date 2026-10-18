import { api } from '../lib/api'
import { supabase } from '../lib/supabase'
import type { CardRow, MailRow, MailRecipient, Person, Task } from '../lib/types'
import { TITLE_WIDTH } from './titleWidths'
import type { TodayInfo, UiCal, UiCard, UiFriend, UiGift, UiMail, UiMember, UiNotif, UiSnapshot, UiTask } from './snapshot'

const PAL: [string, string][] = [
  ['#9AA6FF', '#4CC9FF'], ['#FF7AB8', '#FFE45E'], ['#35D0A5', '#4CC9FF'], ['#FF9A5C', '#FF2E88'],
  ['#4CC9FF', '#7B61FF'], ['#B9A4FF', '#FF8FB8'], ['#FFB02E', '#FF7A2F'], ['#7B61FF', '#FF7AB8'],
]
const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
export const initials = (n: string) => {
  const p = String(n).trim().split(/\s+/).filter(Boolean)
  return (p.length > 1 ? p[0][0] + p[p.length - 1][0] : (p[0] || '?').slice(0, 2)).toUpperCase()
}
const LABELS = ['Công việc', 'Học tập', 'Cá nhân', 'Sức khỏe', 'Việc nhà', 'Cho người khác']
const SRC: Record<string, string> = { personal: 'Cá nhân', group: 'Nhóm', rescue: 'Thẻ cứu', welcome: 'Quà Tân binh', event: 'Sự kiện', admin: 'Quà từ Admin' }
const RAR: Record<string, UiCard['r']> = { common: 'common', rare: 'rare', legendary: 'legend', supreme: 'supreme', event: 'event' }

const VN = 'Asia/Ho_Chi_Minh'
const fmtDM = new Intl.DateTimeFormat('en-GB', { timeZone: VN, day: '2-digit', month: '2-digit' })
const fmtHM = new Intl.DateTimeFormat('en-GB', { timeZone: VN, hour: '2-digit', minute: '2-digit', hour12: false })
export const dmHM = (iso: string) => `${fmtDM.format(new Date(iso))} · ${fmtHM.format(new Date(iso))}`
export const dm = (iso: string) => fmtDM.format(new Date(iso))

export const pad = (n: number) => String(n).padStart(2, '0')
export const isoOf = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`
export const keyOfIso = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${y}-${m}-${d}` }

function relTime(iso: string, now: number): string {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000)
  if (s < 90) return 'Vừa xong'
  if (s < 3600) return `${Math.round(s / 60)} phút trước`
  if (s < 86400) return `${Math.round(s / 3600)} giờ trước`
  if (s < 172800) return 'Hôm qua'
  return `${Math.round(s / 86400)} ngày trước`
}

/** Chênh lệch giữa đồng hồ máy và đồng hồ server (ms), để tính hạn 48 giờ đúng. */
export let clockSkew = 0
export const serverNow = () => Date.now() + clockSkew

// ----- bộ nhớ đệm các bảng ít đổi -----
let cardsCache: UiCard[] | null = null
let titlesCache: UiSnapshot['titles'] | null = null
let eventsCache: any[] | null = null
let friendStreaks: Record<string, { at: number; v: number }> = {}

function toUiCard(c: CardRow): UiCard {
  const w = c.width || 3, h = c.height || 4
  return {
    id: c.id, r: RAR[c.rarity] ?? 'common', name: c.name, land: c.event_id === 'khai-mac-2026' ? false : c.orientation === 'landscape' || w > h * 1.05,
    ar: c.event_id === 'khai-mac-2026' ? (c.tier === 'TAG' ? 0.8 : 232 / 330) : w / h, fx: c.effect && c.rarity === 'supreme' ? c.effect : '', tier: c.tier ?? '', ev: c.event_id ?? '', path: c.storage_path, thumb: c.thumb_path ?? c.storage_path, sort: c.sort,
  }
}

function mapTask(t: Task, myId: string): UiTask {
  const li = LABELS.indexOf(t.label ?? '')
  return {
    id: t.id, t: t.title, owner: t.owner_id === myId ? 'me' : t.owner_id, cal: t.calendar_id, label: li < 0 ? 0 : li, allday: t.all_day,
    start: t.start_time ? t.start_time.slice(0, 5) : '09:00', end: t.end_time ? t.end_time.slice(0, 5) : '', note: t.note ?? '', done: t.done, version: t.version,
  }
}

function member(p: Person | undefined, uid: string, id: string): UiMember {
  const [a, b] = PAL[hash(uid) % PAL.length]
  const name = p?.display_name ?? 'Người dùng'
  return { id, uid, name, un: p?.username ?? '', ini: initials(name), a, b, frame: p?.equipped_title ?? null, photoPath: p?.avatar_path ?? null, birthday: p?.birthday ?? null }
}

export function monthRange(y: number, m0: number) {
  const from = isoOf(m0 === 0 ? y - 1 : y, (m0 + 11) % 12, 20)
  const next = new Date(Date.UTC(y, m0 + 1, 1))
  const to = isoOf(next.getUTCFullYear(), next.getUTCMonth(), 10)
  return { from, to }
}

function giftsOf(m: MailRow, events: any[]): UiGift[] {
  const out: UiGift[] = []
  for (const g of m.gifts as any[]) {
    if (g.type === 'welcome') out.push({ k: 'frame' }, { k: 'saver', n: 2 }, { k: 'pack' })
    else if (g.type === 'event') {
      out.push({ k: 'event' })
      const ev = events.find((e) => e.id === g.id)
      if (ev?.frame_title) out.push({ k: 'title', id: ev.frame_title })
    } else if (g.type === 'card') for (let i = 0; i < Math.max(1, g.qty ?? 1); i++) out.push({ k: 'card', r: g.rarity === 'legendary' ? 'legend' : (g.rarity ?? 'any') })
    else if (g.type === 'card_id') out.push({ k: 'card', r: 'any' })
    else if (g.type === 'rescue') out.push({ k: 'saver', n: g.qty ?? 1 })
    else if (g.type === 'title') out.push({ k: 'title', id: g.id })
    else if (g.type === 'id_card') out.push({ k: 'idcard' })
    else if (g.type === 'id_frame') out.push({ k: 'idframe' })
    else if (g.type === 'stash_pack') out.push({ k: 'cpack', con: 1, n: 1 })
    else if (g.type === 'concept_pack') out.push({ k: 'cpack', con: Number(g.con ?? 1), n: Math.max(1, Number(g.qty ?? 1)) })
  }
  return out
}

function mapMails(mails: MailRow[], recs: MailRecipient[], events: any[]): UiMail[] {
  const byId = new Map(mails.map((m) => [m.id, m]))
  const out: UiMail[] = []
  for (const r of recs) {
    const m = byId.get(r.mail_id)
    if (!m) continue
    const gifts = giftsOf(m, events)
    out.push({
      id: m.id, kind: m.kind, type: m.kind === 'event' ? 'event' : m.kind === 'news' ? 'news' : gifts.length ? 'gift' : 'news',
      t: m.title, p: m.body, date: dmHM(r.deliver_at), at: new Date(r.deliver_at).getTime(), gifts,
      read: !!r.read_at, claimed: !!r.claimed_at, result: r.claim_result, eid: m.event_id ?? null, tag: m.tag ?? null, tc: m.tag_color ?? null, sum: m.summary ?? null,
    })
  }
  out.sort((a, b) => b.at - a.at)
  return out
}

async function loadTodayInfo(today: string, myId: string, memberOf: (uid: string) => UiMember): Promise<TodayInfo | null> {
  try {
    const ds = await api.dayStatus(today)
    ds.groups.forEach((g) => g.members.forEach((m) => memberOf(m.user_id)))
    return {
      total: ds.total, done: ds.done, locked: ds.locked, personalClaimed: ds.personal_claimed, personalCard: ds.personal_card,
      groups: ds.groups.map((g) => ({ calendarId: g.calendar_id, name: g.name, eligible: g.eligible, claimed: g.claimed, cardId: g.card_id, members: g.members.map((m) => ({ uid: m.user_id === myId ? 'me' : m.user_id, qualified: m.qualified })) })),
    }
  } catch { return null } // hiển thị được không có phần nhóm
}

export function mapTaskList(tasks: Task[], myId: string): Record<string, UiTask[]> {
  const out: Record<string, UiTask[]> = {}
  for (const t of tasks) (out[keyOfIso(t.day)] ??= []).push(mapTask(t, myId))
  return out
}

/** Làm mới nhẹ: hồ sơ, việc, khóa ngày, thẻ đã nhận, trạng thái hôm nay. Các phần còn lại giữ nguyên từ bản trước. */
export async function loadLite(prev: UiSnapshot, months: [number, number][]): Promise<UiSnapshot> {
  let from = '9999', to = '0000'
  for (const [y, m0] of months.length ? months : [[prev.today.y, prev.today.m] as [number, number]]) { const r = monthRange(y, m0); if (r.from < from) from = r.from; if (r.to > to) to = r.to }
  const [meRes, tasks, locks, grants, userCards, userTitles] = await Promise.all([api.me(), api.tasks(from, to), api.locks(from, to), api.grants(), api.userCards(), api.userTitles()])
  const myId = meRes.profile.id
  const members = { ...prev.members }
  const memberOf = (uid: string): UiMember => {
    if (uid === myId) return members.me
    if (!members[uid]) members[uid] = member(undefined, uid, uid)
    return members[uid]
  }
  const todayInfo = await loadTodayInfo(meRes.today, myId, memberOf)
  const lockMap: Record<string, string> = {}
  for (const l of locks) lockMap[l.day] = l.reason
  const grantMap: UiSnapshot['grants'] = {}
  for (const g of grants) if (g.day) (grantMap[g.day] ??= []).push({ source: g.source, card: g.card_id, cal: g.calendar_id })
  const own: UiSnapshot['own'] = {}
  for (const u of userCards) own[u.card_id] = { n: u.count, src: SRC[u.first_source] ?? u.first_source, date: dm(u.first_at) }
  const p = meRes.profile
  return {
    ...prev,
    today: (() => { const [ty, tm, td] = meRes.today.split('-').map(Number); return { y: ty, m: tm - 1, d: td, key: `${ty}-${tm}-${td}`, iso: meRes.today } })(),
    me: { ...prev.me, equip: p.equipped_title, favs: p.fav_cards ?? [], best: p.best_streak, welcomeMember: p.welcome_member },
    streak: meRes.streak, rescueMonthlyLeft: meRes.rescue_monthly_left, rescueBonus: meRes.rescue_bonus, taskTotal: meRes.tasks_done_total, catchup: meRes.catchup_days,
    members, tasks: { ...prev.tasks, ...clearRange(prev.tasks, from, to), ...mapTaskList(tasks, myId) }, locks: { ...prev.locks, ...lockMap }, grants: grantMap, own,
    unlocked: userTitles.map((u) => u.title_id), today_info: todayInfo, km: await api.khaiMacState().catch(() => prev.km),
    idc: await api.myIdCard().catch(() => prev.idc ?? null), stash: await api.eventStash().catch(() => prev.stash ?? []), cx: await api.conceptState().catch(() => prev.cx ?? null),
    streakIfSaved: meRes.streak_if_saved ?? meRes.streak,
  } as UiSnapshot
}
/** Xóa khỏi bản cũ các ngày trong khoảng vừa tải lại (task đã bị xóa phía server không còn xuất hiện). */
function clearRange(old: Record<string, UiTask[]>, from: string, to: string): Record<string, UiTask[]> {
  const out: Record<string, UiTask[]> = {}
  for (const k of Object.keys(old)) {
    const [y, m, d] = k.split('-').map(Number)
    const iso = isoOf(y, m - 1, d)
    if (iso >= from && iso <= to) out[k] = []
  }
  return out
}

export async function loadSnapshot(opts: { months: [number, number][] }): Promise<UiSnapshot> {
  const t0 = Date.now()
  const [meRes, info, people, friendships, calendars, cmembers, invites, prefs, userCards, userTitles, mails, recs, notifs, grants] = await Promise.all([
    api.me(), api.appInfo(), api.people(), api.friendships(), api.calendars(), api.members(), api.invites(), api.calendarPrefs(),
    api.userCards(), api.userTitles(), api.mails(), api.mailRecipients(), api.notifications(), api.grants(),
  ])
  if (info?.now) clockSkew = new Date(info.now).getTime() - t0 - (Date.now() - t0) / 2
  if (!cardsCache) cardsCache = (await api.cards()).map(toUiCard)
  if (!titlesCache) titlesCache = (await api.titles()).map((t) => ({ id: t.id, name: t.display_name, unlock: t.unlock_text ?? '', rarity: t.rarity ?? 'common', tw: TITLE_WIDTH[t.id] ?? 843 }))
  if (!eventsCache) eventsCache = await api.events()

  const myId = meRes.profile.id
  const [ty, tm, td] = meRes.today.split('-').map(Number)
  const pmap = new Map(people.map((p) => [p.id, p]))
  const members: Record<string, UiMember> = {}
  const mine = member({ ...(meRes.profile as any), display_name: meRes.profile.display_name, username: meRes.profile.username, avatar_path: meRes.profile.avatar_path, equipped_title: meRes.profile.equipped_title, birthday: meRes.profile.birthday } as Person, myId, 'me')
  members.me = mine
  const memberOf = (uid: string): UiMember => {
    if (uid === myId) return members.me
    if (!members[uid]) members[uid] = member(pmap.get(uid), uid, uid)
    return members[uid]
  }
  const gid = (uid: string) => (uid === myId ? 'me' : uid)

  // lịch
  const active = cmembers.filter((m) => !m.left_on)
  const cals: UiCal[] = calendars
    .filter((c) => active.some((m) => m.calendar_id === c.id && m.user_id === myId))
    .map((c) => {
      const ms = active.filter((m) => m.calendar_id === c.id)
      ms.sort((a, b) => (a.user_id === myId ? -1 : b.user_id === myId ? 1 : a.joined_on.localeCompare(b.joined_on)))
      ms.forEach((m) => memberOf(m.user_id))
      return { id: c.id, name: c.name, owner: gid(c.owner_id), members: ms.map((m) => gid(m.user_id)), colors: Object.fromEntries(ms.map((m) => [gid(m.user_id), m.color])) }
    })

  // task và khóa ngày theo các tháng đang xem
  const months = opts.months.length ? opts.months : [[ty, tm - 1] as [number, number]]
  let from = '9999', to = '0000'
  for (const [y, m0] of months) { const r = monthRange(y, m0); if (r.from < from) from = r.from; if (r.to > to) to = r.to }
  const [tasks, locks] = await Promise.all([api.tasks(from, to), api.locks(from, to)])
  const taskMap: Record<string, UiTask[]> = {}
  for (const t of tasks) (taskMap[keyOfIso(t.day)] ??= []).push(mapTask(t, myId))
  const lockMap: Record<string, string> = {}
  for (const l of locks) lockMap[l.day] = l.reason
  const grantMap: UiSnapshot['grants'] = {}
  for (const g of grants) if (g.day) (grantMap[g.day] ??= []).push({ source: g.source, card: g.card_id, cal: g.calendar_id })

  // thẻ đã có
  const own: UiSnapshot['own'] = {}
  for (const u of userCards) own[u.card_id] = { n: u.count, src: SRC[u.first_source] ?? u.first_source, date: dm(u.first_at) }

  // bạn bè và thông báo
  const accepted = friendships.filter((f) => f.status === 'accepted')
  const friends: UiFriend[] = accepted.map((f) => {
    const uid = f.requester === myId ? f.addressee : f.requester
    return { ...memberOf(uid), friendshipId: f.id }
  })
  const now = serverNow()
  const nlist: UiNotif[] = []
  const readByRef = new Map(notifs.filter((n) => n.kind === 'friend_request' || n.kind === 'calendar_invite').map((n) => [n.payload.friendship_id ?? n.payload.invite_id, n]))
  for (const f of friendships) if (f.status === 'pending' && f.addressee === myId) {
    const p = memberOf(f.requester); const n = readByRef.get(f.id)
    nlist.push({ id: 'f:' + f.id, src: 'friendship', ref: f.id, kind: 'req', ic: 'users', tone: 'sky', h: `${p.name} gửi lời mời kết bạn`, s: '@' + p.un, time: relTime(f.created_at, now), read: !!n?.read_at })
  }
  for (const i of invites) if (i.invitee === myId) {
    const p = memberOf(i.inviter); const c = notifs.find((n) => n.kind === 'calendar_invite' && n.payload.invite_id === i.id)
    nlist.push({ id: 'i:' + i.id, src: 'invite', ref: i.id, kind: 'inv', ic: 'cal', tone: 'violet', h: `${p.name} mời bạn vào “${c?.payload.calendar_name ?? 'một lịch'}”`, s: 'Lời mời vào lịch chung', time: relTime(i.created_at, now), read: !!c?.read_at })
  }
  for (const n of notifs) {
    const pl = n.payload ?? {}
    const from = pl.from ? memberOf(pl.from).name : ''
    const base = { id: 'n:' + n.id, src: 'notif' as const, ref: n.id, kind: 'info' as const, time: relTime(n.created_at, now), read: !!n.read_at }
    if (n.kind === 'friend_done') nlist.push({ ...base, ic: 'check', tone: 'mint', h: `${pl.name ?? from} vừa xong hết việc hôm nay`, s: 'Cả nhóm xong thì có thẻ nhóm.', go: 'today' })
    else if (n.kind === 'cheer') nlist.push({ ...base, ic: 'heart', tone: 'pink', h: `${pl.name ?? from} cổ vũ bạn`, s: 'Đi tick nốt việc còn lại nào.', go: 'today' })
    else if (n.kind === 'friend_accepted') nlist.push({ ...base, ic: 'users', tone: 'sky', h: `${from || 'Một người bạn'} đã chấp nhận kết bạn`, s: 'Hai bạn giờ là bạn bè.', go: 'fr' })
    else if (n.kind === 'invite_accepted') nlist.push({ ...base, ic: 'cal', tone: 'violet', h: `${from || 'Một người bạn'} đã tham gia lịch của bạn`, s: 'Mở Bạn bè để xem thành viên.', go: 'fr' })
    else if (n.kind === 'mail') nlist.push({ ...base, ic: 'mail', tone: 'pink', h: `Thư mới: ${pl.title ?? ''}`, s: 'Mở hòm thư để đọc.', go: 'mail' })
  }
  nlist.sort((a, b) => Number(a.read) - Number(b.read))

  // trạng thái hôm nay (nhóm, đã nhận)
  const todayInfo = await loadTodayInfo(meRes.today, myId, memberOf)

  const eventDone: Record<string, boolean> = {}
  for (const m of mails) if (m.event_id) eventDone[m.event_id] = !!recs.find((r) => r.mail_id === m.id)?.claimed_at

  const p = meRes.profile
  const rescueCfg = info?.rescue_per_month ?? 5
  return {
    today: { y: ty, m: tm - 1, d: td, key: `${ty}-${tm}-${td}`, iso: meRes.today },
    me: {
      uid: myId, name: p.display_name, un: p.username, bd: p.birthday ?? '', showBd: p.show_birthday, findable: p.findable, album: p.album_public, notif: p.notif_enabled, cheer: p.cheer_enabled,
      admin: meRes.is_admin, equip: p.equipped_title, photoPath: p.avatar_path, welcomeMember: p.welcome_member, favs: p.fav_cards ?? [], best: p.best_streak, createdAt: p.created_at,
    },
    streak: meRes.streak,
    rescueMonthlyLeft: meRes.rescue_monthly_left,
    rescueBonus: meRes.rescue_bonus,
    taskTotal: meRes.tasks_done_total,
    catchup: meRes.catchup_days,
    members, cals, tasks: taskMap, cards: cardsCache, own, titles: titlesCache,
    unlocked: userTitles.map((u) => u.title_id),
    mails: mapMails(mails, recs, eventsCache), notifs: nlist, friends, locks: lockMap, grants: grantMap, today_info: todayInfo, eventDone, km: await api.khaiMacState().catch(() => null),
    idc: await api.myIdCard().catch(() => null), cx: await api.conceptState().catch(() => null), stash: await api.eventStash().catch(() => []),
    prefs: Object.fromEntries(prefs.map((x) => [x.calendar_id, x.theme])),
    limits: { calendars: info?.max_calendars ?? 4, members: info?.max_members ?? 6, rescuePerMonth: rescueCfg },
    streakIfSaved: meRes.streak_if_saved ?? meRes.streak,
  }
}

/** Streak của bạn bè (gọi friend_view), có nhớ tạm 60 giây. */
export async function friendStreak(uid: string): Promise<number> {
  const c = friendStreaks[uid]
  if (c && Date.now() - c.at < 60000) return c.v
  try {
    const v = (await api.friendView(uid)).streak
    friendStreaks[uid] = { at: Date.now(), v }
    return v
  } catch { return 0 }
}

export function resetCaches() { cardsCache = null; titlesCache = null; eventsCache = null; friendStreaks = {} }
export { supabase }
