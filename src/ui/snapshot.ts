// Hình dạng dữ liệu mà lớp giao diện (src/ui/legacy) dùng. Mọi ánh xạ từ database sang đây nằm trong loader.ts.
export interface UiMember {
  id: string          // 'me' cho chính mình, còn lại là uuid
  uid: string
  name: string
  un: string
  ini: string
  a: string
  b: string
  frame: string | null   // danh hiệu đang đeo
  photoPath: string | null
  streak?: number
  birthday?: string | null
}

export interface UiTask {
  id: string
  t: string
  owner: string       // 'me' hoặc uuid
  cal: string
  label: number
  allday: boolean
  start: string
  end: string
  note: string
  done: boolean
  version: number
  pending?: boolean   // đang chờ đồng bộ (offline)
}

export interface UiCard {
  id: string
  r: 'common' | 'rare' | 'legend' | 'supreme' | 'event'
  name: string
  land: boolean
  ar: number
  fx: string
  tier: string
  ev: string
  path: string
  thumb: string
  sort: number
}

export interface UiCal {
  id: string
  name: string
  members: string[]   // 'me' hoặc uuid
  owner: string       // 'me' hoặc uuid
  colors: Record<string, string>
}

export type UiGift =
  | { k: 'card'; r: string }
  | { k: 'saver'; n: number }
  | { k: 'title'; id: string }
  | { k: 'event' }
  | { k: 'frame' }
  | { k: 'pack' }
  | { k: 'idcard' }
  | { k: 'idframe' }
  | { k: 'cpack'; con: number; n: number }
  | { k: 'stash'; id: string }

export interface UiMail {
  id: string
  type: 'event' | 'gift' | 'news'
  kind: string
  t: string
  p: string
  date: string
  at: number
  gifts: UiGift[]
  read: boolean
  claimed: boolean
  result: any
  eid: string | null
  tag: string | null
  tc: string | null
  sum: string | null
}

export interface UiNotif {
  id: string
  kind: 'req' | 'inv' | 'info'
  ic: string
  tone: string
  h: string
  s: string
  time: string
  read: boolean
  go?: string
  ref?: string
  src: 'notif' | 'friendship' | 'invite'
}

export interface UiFriend extends UiMember { friendshipId: string }

export interface GroupInfo { calendarId: string; name: string; eligible: boolean; claimed: boolean; cardId: string | null; members: { uid: string; qualified: boolean }[] }

export interface TodayInfo {
  total: number
  done: number
  locked: boolean
  personalClaimed: boolean
  personalCard: string | null
  groups: GroupInfo[]
}

export interface UiSnapshot {
  today: { y: number; m: number; d: number; key: string; iso: string }
  me: {
    uid: string; name: string; un: string; bd: string; showBd: boolean; findable: boolean; album: boolean; notif: boolean; cheer: boolean
    admin: boolean; equip: string | null; photoPath: string | null; welcomeMember: string | null; favs: string[]; best: number; createdAt: string
  }
  streak: number
  streakIfSaved: number
  rescueMonthlyLeft: number
  rescueBonus: number
  taskTotal: number
  catchup: string[]
  members: Record<string, UiMember>
  cals: UiCal[]
  tasks: Record<string, UiTask[]>
  cards: UiCard[]
  own: Record<string, { n: number; src: string; date: string }>
  titles: { id: string; name: string; unlock: string; rarity: string; tw: number }[]
  unlocked: string[]
  mails: UiMail[]
  notifs: UiNotif[]
  friends: UiFriend[]
  locks: Record<string, string>                       // 'YYYY-MM-DD' → personal | group | rescue
  grants: Record<string, { source: string; card: string; cal: string | null }[]>
  today_info: TodayInfo | null
  eventDone: Record<string, boolean>
  km: KhaiMacState | null
  idc: any | null
  cx: any | null
  stash: any[]
  prefs: Record<string, any>                          // calId → theme
  limits: { calendars: number; members: number; rescuePerMonth: number }
}

export interface KhaiMacState {
  event_id: string; starts_on: string; ends_on: string; today: string; active: boolean; done: number
  claimed: { milestone: number; member: string }[]
  pack: string | null
}
