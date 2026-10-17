import { supabase } from './supabase'
import { toAppError } from './errors'
import type {
  CalendarMember, Calendar, CardRow, ClaimResult, DayStatus, FriendView, Friendship, Invite, MailRecipient, MailRow, Me, Notification,
  Person, RewardGrant, Task, TitleRow, UserCard, UserTitle,
} from './types'

/** Ném AppError (đã dịch sang tiếng Việt) thay vì lỗi thô của Supabase. */
function check<T>(res: { data: T | null; error: any }): T {
  if (res.error) throw Object.assign(new Error(res.error.message), { app: toAppError(res.error) })
  return res.data as T
}
async function rpc<T>(name: string, args?: Record<string, unknown>): Promise<T> {
  try {
    return check(await supabase.rpc(name as never, args as never)) as T
  } catch (e) {
    if (e instanceof Error && (e as any).app) throw e
    throw Object.assign(new Error(String((e as any)?.message ?? e)), { app: toAppError(e) })
  }
}
async function q<T>(p: PromiseLike<{ data: T | null; error: any }>): Promise<T> {
  try { return check(await p) } catch (e) {
    if (e instanceof Error && (e as any).app) throw e
    throw Object.assign(new Error(String((e as any)?.message ?? e)), { app: toAppError(e) })
  }
}
export const appErrorOf = (e: unknown) => (e as any)?.app ?? toAppError(e)

export const api = {
  // ----- công khai -----
  registrationOpen: () => rpc<boolean>('registration_open'),
  usernameAvailable: (u: string) => rpc<boolean>('username_available', { u }),

  // ----- hồ sơ -----
  me: () => rpc<Me>('me'),
  khaiMacState: () => rpc<any>('khai_mac_state'),
  myIdCard: () => rpc<any>('my_id_card'),
  idCardChoose: (m: string) => rpc<any>('id_card_choose', { m }),
  idCardSave: (p_holder: string, p_photo: string | null, p_crop: { z: number; x: number; y: number }) => rpc<any>('id_card_save', { p_holder, p_photo, p_crop }),
  eventAsset: (id: string) => q<any[]>(supabase.from('event_assets').select('mime,data').eq('id', id)).then((r) => r[0] ?? null),
  eventStash: () => q<any[]>(supabase.from('event_stash').select('*')),
  claimKhaiMac: (m: number) => rpc<any>('claim_khai_mac', { m }),
  claimKhaiMacPack: (member: string) => rpc<any>('claim_khai_mac_pack', { member }),
  appInfo: () => rpc<any>('app_info'),
  updateProfile: (p: Record<string, unknown>) => rpc<Me>('update_profile', { p }),
  setEquipped: (tid: string | null) => rpc<Me>('set_equipped_title', { tid }),
  setFavs: (card_ids: string[]) => rpc<Me>('set_favs', { card_ids }),
  people: () => q<Person[]>(supabase.from('people').select('*')),
  friendView: (fid: string) => rpc<FriendView>('friend_view', { fid }),

  // ----- bạn bè -----
  findUser: (u: string) => rpc<Person | null>('find_user', { u }),
  sendFriendRequest: (u: string) => rpc<string>('send_friend_request', { u }),
  respondFriend: (fid: string, accept: boolean) => rpc<void>('respond_friend', { fid, accept }),
  removeFriend: (other: string) => rpc<void>('remove_friend', { other }),
  friendships: () => q<Friendship[]>(supabase.from('friendships').select('*')),

  // ----- lịch -----
  calendars: () => q<Calendar[]>(supabase.from('calendars').select('*').order('created_at')),
  members: () => q<CalendarMember[]>(supabase.from('calendar_members').select('*')),
  invites: () => q<Invite[]>(supabase.from('calendar_invites').select('*').eq('status', 'pending')),
  createCalendar: (nm: string) => rpc<string>('create_calendar', { nm }),
  renameCalendar: (cal: string, nm: string) => rpc<void>('rename_calendar', { cal, nm }),
  setMemberColor: (cal: string, col: string) => rpc<void>('set_member_color', { cal, col }),
  inviteToCalendar: (cal: string, friend: string) => rpc<string>('invite_to_calendar', { cal, friend }),
  respondInvite: (inv: string, accept: boolean) => rpc<void>('respond_invite', { inv, accept }),
  removeMember: (cal: string, uid: string) => rpc<void>('remove_member', { cal, uid }),
  transferOwner: (cal: string, uid: string) => rpc<void>('transfer_owner', { cal, uid }),
  leaveCalendar: (cal: string) => rpc<void>('leave_calendar', { cal }),
  deleteCalendar: (cal: string, confirm_name: string) => rpc<void>('delete_calendar', { cal, confirm_name }),
  calendarPrefs: () => q<{ user_id: string; calendar_id: string; theme: Record<string, any> }[]>(supabase.from('user_calendar_prefs').select('*')),
  saveCalendarPref: (calendar_id: string, theme: Record<string, any>) =>
    q(supabase.from('user_calendar_prefs').upsert({ calendar_id, theme }, { onConflict: 'user_id,calendar_id' })),

  // ----- task -----
  tasks: (from: string, to: string) =>
    q<Task[]>(supabase.from('tasks').select('*').gte('day', from).lte('day', to).order('day').order('created_at')),
  addTask: (t: Partial<Task> & { calendar_id: string; day: string; title: string; op_id?: string; client_ts?: string }) =>
    q<Task>(supabase.from('tasks').insert(t as never).select().single()),
  updateTask: (id: string, version: number, patch: Partial<Task>) =>
    q<Task[]>(supabase.from('tasks').update({ ...patch, version } as never).eq('id', id).select()),
  deleteTask: (id: string) => q(supabase.from('tasks').delete().eq('id', id)),

  // ----- ngày, thưởng -----
  dayStatus: (d: string) => rpc<DayStatus>('day_status', { d }),
  claimDay: (d: string) => rpc<ClaimResult>('claim_day', { d }),
  useRescue: (d: string) => rpc<ClaimResult>('use_rescue', { d }),
  grants: () => q<RewardGrant[]>(supabase.from('reward_grants').select('*').order('created_at', { ascending: false }).limit(1500)),
  locks: (from: string, to: string) => q<{ day: string; reason: string }[]>(supabase.from('day_locks').select('day,reason').gte('day', from).lte('day', to)),

  // ----- thẻ, danh hiệu -----
  cards: () => q<CardRow[]>(supabase.from('cards').select('*').order('rarity').order('sort')),
  userCards: (uid?: string) => {
    let r = supabase.from('user_cards').select('*')
    if (uid) r = r.eq('user_id', uid)
    return q<UserCard[]>(r)
  },
  titles: () => q<TitleRow[]>(supabase.from('titles').select('*').order('sort')),
  userTitles: () => q<UserTitle[]>(supabase.from('user_titles').select('*')),
  events: () => q<any[]>(supabase.from('events').select('*')),

  // ----- thư, thông báo -----
  mails: () => q<MailRow[]>(supabase.from('mails').select('*').order('created_at', { ascending: false })),
  mailRecipients: () => q<MailRecipient[]>(supabase.from('mail_recipients').select('*')),
  ensureLoginEvents: () => rpc<number>('ensure_login_events'),
  markMailRead: (mid: string) => rpc<void>('mark_mail_read', { mid }),
  chooseWelcomeMember: (m: string) => rpc<void>('choose_welcome_member', { m }),
  claimMail: (mid: string) => rpc<ClaimResult>('claim_mail', { mid }),
  adminSendMail: (a: { title: string; body: string; gifts: unknown[]; usernames?: string[] | null; at?: string | null }) =>
    rpc<{ mail_id: string; recipients: number }>('admin_send_mail', { title: a.title, body: a.body, gifts: a.gifts, usernames: a.usernames ?? null, at: a.at ?? null }),
  adminSent: () => rpc<any[]>('admin_sent_mails'),
  notifications: () => q<Notification[]>(supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(60)),
  markNotificationsRead: (ids?: string[]) => rpc<void>('mark_notifications_read', { ids: ids ?? null }),
  sendCheer: (to_id: string) => rpc<void>('send_cheer', { to_id }),
}
