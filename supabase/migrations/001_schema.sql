-- Colentis · 001 · Bảng dữ liệu
-- Chạy trong Supabase: SQL Editor (lần lượt 001 → 005). Không chứa khóa bí mật hay ảnh thật.

create schema if not exists private;

-- ---------- Cấu hình ----------
create table public.app_config (
  key   text primary key,
  value jsonb not null
);
insert into public.app_config(key, value) values
  ('signup_cap',            '50'),
  ('rescue_per_month',      '5'),
  ('username_cooldown_days','3'),
  ('claim_window_days',     '14'),
  ('max_calendars',         '4'),
  ('max_members',           '6'),
  ('unowned_bias',          '0.8'),
  ('daily_weights',   '{"common":70,"rare":22,"legendary":7,"supreme":1}'),
  ('welcome_weights', '{"common":66,"rare":24,"legendary":8.2,"supreme":1.8}');

-- Ngày Tết Nguyên đán (mùng 1, lịch Việt Nam). KIỂM TRA LẠI trước khi dùng cho các năm sau 2030.
create table public.holidays_tet (day date primary key);
insert into public.holidays_tet(day) values
  ('2026-02-17'),('2027-02-06'),('2028-01-26'),('2029-02-13'),('2030-02-03'),
  ('2031-01-23'),('2032-02-11'),('2033-01-31'),('2034-02-19'),('2035-02-08'),('2036-01-28');

-- ---------- Hồ sơ ----------
create table public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  username           text not null unique check (username ~ '^[a-z0-9_]{4,19}$'),
  display_name       text not null check (char_length(display_name) between 2 and 24),
  avatar_path        text,
  birthday           date check (birthday is null or birthday >= date '1940-01-01'),
  show_birthday      boolean not null default false,
  findable           boolean not null default true,
  album_public       boolean not null default false,
  notif_enabled      boolean not null default true,
  cheer_enabled      boolean not null default true,
  is_admin           boolean not null default false,
  welcome_member     text check (welcome_member in ('juhoon','keonho','martin','seonghyeon','james')),
  equipped_title     text,
  fav_cards          text[] not null default '{}' check (cardinality(fav_cards) <= 3),
  best_streak        integer not null default 0,
  rescue_bonus       integer not null default 0 check (rescue_bonus >= 0),
  username_changed_at timestamptz,
  created_at         timestamptz not null default now()
);

create table public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester    uuid not null references public.profiles(id) on delete cascade,
  addressee    uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending','accepted')),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  check (requester <> addressee)
);
create unique index friendships_pair on public.friendships (least(requester, addressee), greatest(requester, addressee));
create index friendships_addressee on public.friendships (addressee);

-- ---------- Lịch ----------
create table public.calendars (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(btrim(name)) between 1 and 40),
  owner_id   uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.calendar_members (
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  color       text not null default '#9AA6FF' check (color ~ '^#[0-9a-fA-F]{6}$'),
  joined_on   date not null,
  left_on     date,
  primary key (calendar_id, user_id)
);
create index calendar_members_user on public.calendar_members (user_id) where left_on is null;

create table public.calendar_invites (
  id          uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  inviter     uuid not null references public.profiles(id) on delete cascade,
  invitee     uuid not null references public.profiles(id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at  timestamptz not null default now()
);
create unique index calendar_invites_pending on public.calendar_invites (calendar_id, invitee) where status = 'pending';

create table public.user_calendar_prefs (
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  theme       jsonb not null default '{}' check (pg_column_size(theme) < 8000),
  primary key (user_id, calendar_id)
);

-- ---------- Task ----------
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  day         date not null,
  title       text not null check (char_length(btrim(title)) between 1 and 120),
  note        text check (char_length(note) <= 500),
  start_time  time,
  end_time    time,
  all_day     boolean not null default true,
  label       text check (char_length(label) <= 20),
  done        boolean not null default false,
  done_at     timestamptz,
  version     integer not null default 1,
  op_id       uuid unique,
  client_ts   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (end_time is null or start_time is null or end_time >= start_time),
  check (not all_day or (start_time is null and end_time is null))
);
create index tasks_owner_day on public.tasks (owner_id, day);
create index tasks_cal_day   on public.tasks (calendar_id, day);

-- Mỗi task chỉ được đếm hoàn thành một lần (thành tựu số task, giờ đêm, ngày lễ).
create table public.task_completions (
  task_id      uuid primary key,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  completed_at timestamptz not null,
  vn_day       date not null,
  vn_hour      integer not null
);
create index task_completions_user on public.task_completions (user_id);

-- ---------- Khóa ngày, thẻ cứu ----------
create table public.day_locks (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  day       date not null,
  reason    text not null check (reason in ('personal','group','rescue')),
  locked_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table public.rescue_uses (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day     date not null,
  source  text not null check (source in ('monthly','bonus')),
  used_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- ---------- Kho thẻ ----------
create table public.cards (
  id           text primary key,
  rarity       text not null check (rarity in ('common','rare','legendary','supreme','event')),
  name         text not null,
  orientation  text not null default 'portrait' check (orientation in ('portrait','landscape')),
  width        integer,
  height       integer,
  event_id     text,
  tier         text,
  effect       text,
  color_a      text,
  color_b      text,
  storage_path text not null,
  thumb_path   text,
  active       boolean not null default true,
  sort         integer not null default 0
);

create table public.events (
  id            text primary key,
  title         text not null,
  starts_on     date not null,
  ends_on       date not null,
  frame_title   text,
  card_count    integer not null default 2,
  weights       jsonb not null,
  mail_id       uuid
);

create table public.user_cards (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  card_id      text not null references public.cards(id),
  count        integer not null default 1 check (count >= 1),
  first_at     timestamptz not null default now(),
  first_source text not null,
  primary key (user_id, card_id)
);

create table public.reward_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  source      text not null check (source in ('personal','group','rescue','welcome','event','admin')),
  day         date,
  calendar_id uuid,
  card_id     text not null references public.cards(id),
  is_new      boolean not null,
  created_at  timestamptz not null default now()
);
-- Mỗi người một thẻ cá nhân (hoặc thẻ cứu) mỗi ngày; một thẻ nhóm mỗi ngày cho mỗi lịch.
create unique index reward_personal_day on public.reward_grants (user_id, day) where source in ('personal','rescue');
create unique index reward_group_day    on public.reward_grants (user_id, day, calendar_id) where source = 'group';
create index reward_user on public.reward_grants (user_id, created_at desc);

-- Cùng một lịch và ngày thì cả nhóm nhận cùng một thẻ.
create table public.group_rolls (
  calendar_id uuid not null,
  day         date not null,
  card_id     text not null references public.cards(id),
  created_at  timestamptz not null default now(),
  primary key (calendar_id, day)
);

-- ---------- Danh hiệu ----------
create table public.titles (
  id           text primary key,
  display_name text not null,
  unlock_text  text,
  rarity       text,
  avatar_frame text not null,
  title_frame  text not null,
  special      boolean not null default false,
  sort         integer not null default 0
);

create table public.user_titles (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  title_id  text not null references public.titles(id),
  earned_at timestamptz not null default now(),
  source    text not null default 'achievement',
  primary key (user_id, title_id)
);
alter table public.profiles add constraint profiles_equipped_fk foreign key (id, equipped_title) references public.user_titles(user_id, title_id) deferrable initially deferred;

-- ---------- Hòm thư và thông báo ----------
create table public.mails (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('admin','event','welcome','news')),
  title      text not null check (char_length(title) between 1 and 60),
  body       text not null check (char_length(body) <= 600),
  gifts      jsonb not null default '[]',
  event_id   text,
  sender     uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index mails_event on public.mails (event_id) where kind = 'event';

create table public.mail_recipients (
  mail_id      uuid not null references public.mails(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  deliver_at   timestamptz not null default now(),
  read_at      timestamptz,
  claimed_at   timestamptz,
  claim_result jsonb,
  primary key (mail_id, user_id)
);
create index mail_recipients_user on public.mail_recipients (user_id, deliver_at desc);

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  kind       text not null,
  payload    jsonb not null default '{}',
  ref_key    text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create unique index notifications_ref on public.notifications (user_id, kind, ref_key) where ref_key is not null;
create index notifications_user on public.notifications (user_id, created_at desc);

create table public.cheers (
  from_user  uuid not null references public.profiles(id) on delete cascade,
  to_user    uuid not null references public.profiles(id) on delete cascade,
  day        date not null,
  created_at timestamptz not null default now(),
  primary key (from_user, to_user, day)
);

-- Sự kiện đăng nhập đã nhận (mỗi người một lần cho mỗi bộ).
create table public.event_claims (
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id text not null references public.events(id),
  claimed_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
