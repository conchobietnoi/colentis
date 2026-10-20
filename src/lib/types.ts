export type Rarity = 'common' | 'rare' | 'legendary' | 'supreme' | 'event'

export interface Profile {
  id: string
  username: string
  display_name: string
  avatar_path: string | null
  birthday: string | null
  show_birthday: boolean
  findable: boolean
  album_public: boolean
  notif_enabled: boolean
  cheer_enabled: boolean
  is_admin: boolean
  welcome_member: string | null
  equipped_title: string | null
  fav_cards: string[]
  best_streak: number
  rescue_bonus: number
  created_at: string
}

export interface Me {
  profile: Profile
  streak: number
  streak_if_saved: number
  catchup_days: string[]
  rescue_monthly_left: number
  rescue_bonus: number
  today: string
  tasks_done_total: number
  is_admin: boolean
}

export interface Person {
  id: string
  username: string
  display_name: string
  avatar_path: string | null
  equipped_title: string | null
  birthday: string | null
}

export interface Calendar { id: string; name: string; owner_id: string; created_at: string }
export interface CalendarMember { calendar_id: string; user_id: string; color: string; joined_on: string; left_on: string | null }

export interface Task {
  id: string
  owner_id: string
  calendar_id: string
  day: string
  title: string
  note: string | null
  start_time: string | null
  end_time: string | null
  all_day: boolean
  label: string | null
  done: boolean
  done_at: string | null
  version: number
  op_id: string | null
  client_ts?: string | null
}

export interface CardRow {
  id: string
  rarity: Rarity
  name: string
  orientation: 'portrait' | 'landscape'
  width: number | null
  height: number | null
  event_id: string | null
  tier: string | null
  effect: string | null
  color_a: string | null
  color_b: string | null
  storage_path: string
  thumb_path: string | null
  sort: number
}

export interface UserCard { user_id: string; card_id: string; count: number; first_at: string; first_source: string }

export interface RewardGrant {
  id: string
  user_id: string
  source: 'personal' | 'group' | 'rescue' | 'welcome' | 'event' | 'admin'
  day: string | null
  calendar_id: string | null
  card_id: string
  is_new: boolean
  created_at: string
}

export interface TitleRow {
  id: string
  display_name: string
  unlock_text: string | null
  rarity: string | null
  avatar_frame: string
  title_frame: string
  special: boolean
  sort: number
}
export interface UserTitle { user_id: string; title_id: string; earned_at: string; source: string }

export type Gift =
  | { type: 'card'; rarity: 'any' | Exclude<Rarity, 'event'>; qty?: number }
  | { type: 'card_id'; id: string }
  | { type: 'rescue'; qty: number }
  | { type: 'title'; id: string }
  | { type: 'welcome' }
  | { type: 'concept_pack'; con: number; qty?: number }
  | { type: 'event'; id: string }
  | { type: 'album'; id: string }

export interface MailRow { id: string; kind: 'admin' | 'event' | 'welcome' | 'news'; title: string; body: string; gifts: Gift[]; event_id: string | null; created_at: string; tag?: string | null; tag_color?: string | null; summary?: string | null }
export interface MailRecipient { mail_id: string; user_id: string; deliver_at: string; read_at: string | null; claimed_at: string | null; claim_result: ClaimResult | null }

export interface Notification { id: string; user_id: string; kind: string; payload: Record<string, any>; read_at: string | null; created_at: string }

export interface GrantResult { source: string; card_id: string; is_new: boolean; count: number; calendar_id?: string; rarity?: string }
export interface ClaimResult { grants: GrantResult[]; new_titles: string[]; rescue_added?: number; streak?: number; source?: string }

export interface GroupStatus {
  calendar_id: string
  name: string
  eligible: boolean
  claimed: boolean
  card_id: string | null
  members: { user_id: string; qualified: boolean }[]
}
export interface DayStatus {
  day: string
  total: number
  done: number
  locked: boolean
  lock_reason: string | null
  personal_eligible: boolean
  personal_claimed: boolean
  personal_card: string | null
  counts_for_streak: boolean
  rescuable: boolean
  groups: GroupStatus[]
}

export interface Friendship { id: string; requester: string; addressee: string; status: 'pending' | 'accepted'; created_at: string }
export interface Invite { id: string; calendar_id: string; inviter: string; invitee: string; status: string; created_at: string }

export interface FriendView {
  id: string
  username: string
  display_name: string
  avatar_path: string | null
  equipped_title: string | null
  streak: number
  is_friend: boolean
  birthday: string | null
  fav_cards: string[]
  album_public: boolean
}
