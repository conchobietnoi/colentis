-- Colentis: toàn bộ cơ sở dữ liệu. Dán cả tệp vào Supabase > SQL Editor > Run (chỉ chạy MỘT lần trên dự án mới).

-- ============================================================
-- 001_schema.sql
-- ============================================================
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


-- ============================================================
-- 002_core.sql
-- ============================================================
-- Colentis · 002 · Hàm lõi (thời gian, streak, trạng thái ngày, nhận thẻ) và trigger
-- Các hàm trong schema private không được API gọi trực tiếp.

-- ---------- Thời gian (giờ Việt Nam) ----------
-- colentis.now chỉ dùng khi thử nghiệm; client API không thể đặt biến này.
create or replace function private.now() returns timestamptz language sql stable as
$$ select coalesce(nullif(current_setting('colentis.now', true), '')::timestamptz, now()) $$;

create or replace function private.today() returns date language sql stable as
$$ select (private.now() at time zone 'Asia/Ho_Chi_Minh')::date $$;

-- Thời điểm kết thúc của một ngày (0h ngày kế tiếp, giờ VN).
create or replace function private.day_end(d date) returns timestamptz language sql immutable as
$$ select ((d + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh') $$;

create or replace function private.cfg(k text) returns jsonb language sql stable as
$$ select value from public.app_config where key = k $$;

-- ---------- Quan hệ ----------
create or replace function private.is_member(cal uuid, uid uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from calendar_members where calendar_id = cal and user_id = uid and left_on is null) $$;

create or replace function private.are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from friendships where status = 'accepted'
     and ((requester = a and addressee = b) or (requester = b and addressee = a))) $$;

create or replace function private.shares_calendar(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from calendar_members x join calendar_members y on x.calendar_id = y.calendar_id
     where x.user_id = a and y.user_id = b and x.left_on is null and y.left_on is null) $$;

create or replace function private.is_admin(uid uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce((select is_admin from profiles where id = uid), false) $$;

-- ---------- Đếm task trong ngày (gộp mọi lịch mà người đó còn tham gia) ----------
create or replace function private.day_counts(uid uuid, d date, out total int, out done int)
language sql stable security definer set search_path = public as
$$ select count(*)::int, count(*) filter (where t.done)::int
   from tasks t
   join calendar_members m on m.calendar_id = t.calendar_id and m.user_id = t.owner_id and m.left_on is null
   where t.owner_id = uid and t.day = d $$;

create or replace function private.is_rescued(uid uuid, d date) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from day_locks where user_id = uid and day = d and reason = 'rescue') $$;

-- Ngày có tính vào chuỗi không? (hôm nay chưa đủ điều kiện thì chưa tính, nhưng cũng chưa làm đứt)
create or replace function private.counts_for_streak(uid uuid, d date) returns boolean
language plpgsql stable security definer set search_path = public as
$$
declare c record;
begin
  if private.is_rescued(uid, d) then return true; end if;
  select * into c from private.day_counts(uid, d);
  if c.total = 0 then return d < private.today(); end if;
  return c.done >= 1;
end $$;

-- Ngày đủ điều kiện nhận thưởng nhóm: xong 100%, hoặc ngày trống đã kết thúc, hoặc được cứu.
create or replace function private.day_qualified(uid uuid, d date) returns boolean
language plpgsql stable security definer set search_path = public as
$$
declare c record;
begin
  if private.is_rescued(uid, d) then return true; end if;
  select * into c from private.day_counts(uid, d);
  if c.total = 0 then return d < private.today(); end if;
  return c.done = c.total;
end $$;

-- Chuỗi hiện tại. Ngày hôm nay chưa đạt thì bỏ qua (chưa đứt); ngày trước đó không đạt thì dừng.
create or replace function private.streak_assuming(uid uuid, assumed date[]) returns int
language plpgsql stable security definer set search_path = public as
$$
declare s int := 0; d date := private.today(); first_day date; n int := 0;
begin
  select (created_at at time zone 'Asia/Ho_Chi_Minh')::date into first_day from profiles where id = uid;
  while d >= first_day and n < 800 loop
    if d = any (assumed) or private.counts_for_streak(uid, d) then
      s := s + 1;
    elsif d <> private.today() then
      exit;
    end if;
    d := d - 1; n := n + 1;
  end loop;
  return s;
end $$;

create or replace function private.streak(uid uuid) returns int
language sql stable security definer set search_path = public as
$$ select private.streak_assuming(uid, '{}') $$;

-- Các ngày bị đứt còn trong hạn 48 giờ, chưa khóa (có thể tick bù hoặc dùng thẻ cứu).
create or replace function private.catchup_days(uid uuid) returns date[]
language plpgsql stable security definer set search_path = public as
$$
declare out date[] := '{}'; d date; first_day date; tdy date := private.today();
begin
  select (created_at at time zone 'Asia/Ho_Chi_Minh')::date into first_day from profiles where id = uid;
  for d in select (tdy - g)::date from generate_series(3, 1, -1) g loop
    continue when d < first_day;
    continue when private.now() >= private.day_end(d) + interval '48 hours';
    continue when private.counts_for_streak(uid, d);
    continue when exists (select 1 from day_locks where user_id = uid and day = d);
    out := out || d;
  end loop;
  return out;
end $$;

-- ---------- Nhóm: ai được tính, đủ điều kiện chưa ----------
-- Chỉ tính thành viên đã tham gia trước ngày d (người mới xét từ hôm sau).
create or replace function private.group_eligible(cal uuid, d date) returns boolean
language plpgsql stable security definer set search_path = public as
$$
declare n int := 0; m record;
begin
  if d > private.today() then return false; end if;
  for m in select user_id from calendar_members where calendar_id = cal and left_on is null and joined_on < d loop
    n := n + 1;
    if not private.day_qualified(m.user_id, d) then return false; end if;
  end loop;
  return n >= 2;
end $$;

-- ---------- Quay thẻ ----------
create or replace function private.pick_rarity(weights jsonb, uid uuid) returns text
language plpgsql stable security definer set search_path = public as
$$
declare tot numeric := 0; x numeric; r record;
begin
  for r in select k as rarity, (weights->>k)::numeric as w from jsonb_object_keys(weights) k
           where exists (select 1 from cards c where c.rarity = k and c.active) loop
    tot := tot + r.w;
  end loop;
  if tot = 0 then raise exception 'NO_CARDS'; end if;
  x := random() * tot;
  for r in select k as rarity, (weights->>k)::numeric as w from jsonb_object_keys(weights) k
           where exists (select 1 from cards c where c.rarity = k and c.active) order by (weights->>k)::numeric desc loop
    x := x - r.w;
    if x <= 0 then return r.rarity; end if;
  end loop;
  return 'common';
end $$;

-- Chọn một thẻ trong độ hiếm: ưu tiên thẻ chưa có (xác suất unowned_bias) rồi mới đến cả kho.
create or replace function private.pick_card(uid uuid, rar text, exclude text[] default '{}') returns text
language plpgsql volatile security definer set search_path = public as
$$
declare cid text; bias numeric := (private.cfg('unowned_bias'))::numeric;
begin
  if random() < bias then
    select c.id into cid from cards c
     where c.rarity = rar and c.active and c.id <> all (exclude)
       and not exists (select 1 from user_cards u where u.user_id = uid and u.card_id = c.id)
     order by random() limit 1;
  end if;
  if cid is null then
    select c.id into cid from cards c where c.rarity = rar and c.active and c.id <> all (exclude) order by random() limit 1;
  end if;
  if cid is null then
    select c.id into cid from cards c where c.rarity = rar and c.active order by random() limit 1;
  end if;
  return cid;
end $$;

-- Ghi một lượt nhận thẻ (cộng số lần sở hữu). Trả về (is_new, count). Trùng khóa duy nhất thì không ghi và trả null.
create or replace function private.grant_card(uid uuid, cid text, src text, d date, cal uuid, out granted boolean, out is_new boolean, out cnt int)
language plpgsql volatile security definer set search_path = public as
$$
declare existed boolean;
begin
  granted := false; is_new := false; cnt := 0;
  select exists (select 1 from user_cards where user_id = uid and card_id = cid) into existed;
  begin
    insert into reward_grants(user_id, source, day, calendar_id, card_id, is_new) values (uid, src, d, cal, cid, not existed);
  exception when unique_violation then
    return;
  end;
  insert into user_cards(user_id, card_id, count, first_source) values (uid, cid, 1, src)
  on conflict (user_id, card_id) do update set count = user_cards.count + 1
  returning count into cnt;
  granted := true; is_new := not existed;
end $$;

-- ---------- Danh hiệu ----------
create or replace function private.give_title(uid uuid, tid text, src text) returns boolean
language plpgsql volatile security definer set search_path = public as
$$
declare ins int;
begin
  insert into user_titles(user_id, title_id, source) values (uid, tid, src) on conflict do nothing;
  get diagnostics ins = row_count;
  if ins > 0 then
    update profiles set equipped_title = coalesce(equipped_title, tid) where id = uid;
    return true;
  end if;
  return false;
end $$;

-- Xét lại mọi điều kiện danh hiệu của một người. Trả về danh sách danh hiệu mới.
create or replace function private.check_titles(uid uuid) returns text[]
language plpgsql volatile security definer set search_path = public as
$$
declare got text[] := '{}'; st int; tasks_done int; p record; r text; need int; have int; k text;
begin
  select * into p from profiles where id = uid;
  st := private.streak(uid);
  if st > p.best_streak then update profiles set best_streak = st where id = uid; p.best_streak := st; end if;

  foreach need in array array[3,7,14,30,60,100,365] loop
    if p.best_streak >= need and private.give_title(uid, 'streak-' || need, 'achievement') then got := array_append(got, 'streak-' || need); end if;
  end loop;

  select count(*) into tasks_done from task_completions where user_id = uid;
  foreach need in array array[10,100,500,1000] loop
    if tasks_done >= need and private.give_title(uid, 'tasks-' || need, 'achievement') then got := array_append(got, 'tasks-' || need); end if;
  end loop;

  if exists (select 1 from friendships where status = 'accepted' and (requester = uid or addressee = uid))
     and private.give_title(uid, 'friend-first', 'achievement') then got := array_append(got, 'friend-first'); end if;
  if exists (select 1 from reward_grants where user_id = uid and source = 'group')
     and private.give_title(uid, 'group-day-first', 'achievement') then got := array_append(got, 'group-day-first'); end if;
  if exists (select 1 from task_completions where user_id = uid and vn_hour between 0 and 3)
     and private.give_title(uid, 'hidden-night', 'achievement') then got := array_append(got, 'hidden-night'); end if;

  if p.birthday is not null and exists (
       select 1 from task_completions c where c.user_id = uid and
         ( to_char(c.vn_day, 'MM-DD') = to_char(p.birthday, 'MM-DD')
           or (to_char(p.birthday, 'MM-DD') = '02-29' and to_char(c.vn_day, 'MM-DD') = '02-28'
               and not (extract(year from c.vn_day)::int % 4 = 0 and (extract(year from c.vn_day)::int % 100 <> 0 or extract(year from c.vn_day)::int % 400 = 0))) ))
     and private.give_title(uid, 'birthday', 'achievement') then got := array_append(got, 'birthday'); end if;

  foreach k in array array['holiday-newyear:01-01','holiday-valentine:02-14','holiday-nationalday:09-02','holiday-xmas:12-25'] loop
    if exists (select 1 from task_completions where user_id = uid and to_char(vn_day, 'MM-DD') = split_part(k, ':', 2))
       and private.give_title(uid, split_part(k, ':', 1), 'achievement') then got := array_append(got, split_part(k, ':', 1)); end if;
  end loop;
  if exists (select 1 from task_completions c join holidays_tet h on h.day = c.vn_day where c.user_id = uid)
     and private.give_title(uid, 'holiday-tet', 'achievement') then got := array_append(got, 'holiday-tet'); end if;

  foreach r in array array['common','rare','legendary','supreme'] loop
    select count(*) into need from cards where rarity = r and active;
    select count(*) into have from user_cards u join cards c on c.id = u.card_id where u.user_id = uid and c.rarity = r and c.active;
    if need > 0 and have >= need and private.give_title(uid, 'collection-' || r, 'achievement') then got := array_append(got, 'collection-' || r); end if;
  end loop;
  return got;
end $$;

-- ---------- Thông báo ----------
create or replace function private.notify(uid uuid, k text, pl jsonb, refk text default null) returns void
language plpgsql volatile security definer set search_path = public as
$$
begin
  insert into notifications(user_id, kind, payload, ref_key, created_at) values (uid, k, pl, refk, private.now()) on conflict do nothing;
end $$;

-- ---------- Trigger: task ----------
create or replace function private.tasks_guard() returns trigger
language plpgsql volatile security definer set search_path = public as
$$
declare tdy date := private.today(); nowt timestamptz := private.now(); remaining int; u record;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null and new.owner_id is distinct from auth.uid() then raise exception 'FORBIDDEN'; end if;
    if exists (select 1 from day_locks where user_id = new.owner_id and day = new.day) then raise exception 'DAY_LOCKED'; end if;
    if new.day < tdy then
      -- Tạo offline trước khi ngày kết thúc rồi đồng bộ muộn: chỉ chấp nhận trong hạn 48 giờ.
      if not (new.client_ts is not null and new.client_ts < private.day_end(new.day) and nowt < private.day_end(new.day) + interval '48 hours') then
        raise exception 'PAST_DAY';
      end if;
    end if;
    new.version := 1; new.created_at := nowt; new.updated_at := nowt;
    if new.done then new.done_at := nowt; end if;
    return new;
  elsif tg_op = 'UPDATE' then
    if old.owner_id <> new.owner_id then raise exception 'FORBIDDEN'; end if;
    if exists (select 1 from day_locks where user_id = old.owner_id and day in (old.day, new.day)) then raise exception 'DAY_LOCKED'; end if;
    if new.version <> old.version then raise exception 'VERSION_CONFLICT'; end if;
    if old.day < tdy or new.day < tdy then
      -- Ngày đã qua: chỉ cho tick/bỏ tick trong hạn 48 giờ, không sửa nội dung.
      if nowt >= private.day_end(old.day) + interval '48 hours' then raise exception 'PAST_DAY'; end if;
      if new.day <> old.day or new.title <> old.title or new.note is distinct from old.note or new.calendar_id <> old.calendar_id
         or new.start_time is distinct from old.start_time or new.end_time is distinct from old.end_time
         or new.all_day <> old.all_day or new.label is distinct from old.label then
        raise exception 'PAST_DAY';
      end if;
    end if;
    new.version := old.version + 1; new.updated_at := nowt;
    if new.done and not old.done then new.done_at := nowt; end if;
    if not new.done and old.done then new.done_at := null; end if;
    return new;
  else
    -- Xóa dây chuyền (xóa lịch/tài khoản) đi qua trigger khóa ngoại: không chặn.
    if pg_trigger_depth() > 1 then return old; end if;
    if exists (select 1 from day_locks where user_id = old.owner_id and day = old.day) then raise exception 'DAY_LOCKED'; end if;
    if old.day < tdy then raise exception 'PAST_DAY'; end if;
    return old;
  end if;
end $$;

create trigger tasks_guard_trg before insert or update or delete on public.tasks
  for each row execute function private.tasks_guard();

create or replace function private.tasks_after() returns trigger
language plpgsql volatile security definer set search_path = public as
$$
declare remaining int; mate record; nm text;
begin
  if new.done and (tg_op = 'INSERT' or not old.done) then
    insert into task_completions(task_id, user_id, completed_at, vn_day, vn_hour)
    values (new.id, new.owner_id, new.done_at,
            (new.done_at at time zone 'Asia/Ho_Chi_Minh')::date,
            extract(hour from (new.done_at at time zone 'Asia/Ho_Chi_Minh'))::int)
    on conflict (task_id) do nothing;
    if new.day = private.today() then
      select count(*) into remaining from private.day_counts(new.owner_id, new.day) c where c.total > c.done;
      if remaining = 0 then
        select display_name into nm from profiles where id = new.owner_id;
        for mate in select distinct m2.user_id from calendar_members m1 join calendar_members m2 on m1.calendar_id = m2.calendar_id
                    where m1.user_id = new.owner_id and m1.left_on is null and m2.left_on is null and m2.user_id <> new.owner_id loop
          perform private.notify(mate.user_id, 'friend_done', jsonb_build_object('from', new.owner_id, 'name', nm, 'day', new.day), new.owner_id || ':' || new.day);
        end loop;
      end if;
    end if;
  end if;
  return null;
end $$;

create trigger tasks_after_trg after insert or update on public.tasks
  for each row execute function private.tasks_after();

-- ---------- Trigger: đăng ký ----------
create or replace function private.signup_guard() returns trigger
language plpgsql volatile security definer set search_path = public as
$$
begin
  if (select count(*) from auth.users) >= (private.cfg('signup_cap'))::int then
    raise exception 'REGISTRATION_CLOSED';
  end if;
  return new;
end $$;

create or replace function private.handle_new_user() returns trigger
language plpgsql volatile security definer set search_path = public as
$$
declare md jsonb := new.raw_user_meta_data; uname text; dname text; bd date; cal uuid; wm uuid;
begin
  uname := lower(coalesce(md->>'username', ''));
  dname := btrim(coalesce(md->>'display_name', ''));
  begin bd := nullif(md->>'birthday', '')::date; exception when others then bd := null; end;
  if bd is not null and (bd > (private.now() at time zone 'Asia/Ho_Chi_Minh')::date or bd < date '1940-01-01') then bd := null; end if;
  insert into profiles(id, username, display_name, birthday, created_at) values (new.id, uname, dname, bd, private.now());

  insert into calendars(name, owner_id) values ('Việc riêng', new.id) returning id into cal;
  insert into calendar_members(calendar_id, user_id, joined_on) values (cal, new.id, private.today());

  insert into mails(kind, title, body, gifts, sender)
  values ('welcome', 'Quà Tân binh CORTIS',
          'Chào mừng bạn đến với Colentis! Đây là quà dành riêng cho thành viên mới: một khung Tân binh, 2 thẻ cứu và 5 thẻ ngẫu nhiên.',
          '[{"type":"welcome"}]', null) returning id into wm;
  insert into mail_recipients(mail_id, user_id, deliver_at) values (wm, new.id, private.now());
  return new;
end $$;

create trigger auth_users_guard before insert on auth.users
  for each row execute function private.signup_guard();
create trigger auth_users_profile after insert on auth.users
  for each row execute function private.handle_new_user();


-- ============================================================
-- 003_api.sql
-- ============================================================
-- Colentis · 003 · Hàm API (RPC) mà app gọi. Mọi kết quả thưởng được chốt ở đây, client không tự ghi.
-- Tất cả là SECURITY DEFINER, tự kiểm tra auth.uid(). Lỗi trả về dạng mã chữ HOA (ví dụ DAY_LOCKED).

-- ---------- Công khai (chưa đăng nhập) ----------
create or replace function public.registration_open() returns boolean
language sql stable security definer set search_path = public as
$$ select (select count(*) from auth.users) < (private.cfg('signup_cap'))::int $$;

create or replace function public.username_available(u text) returns boolean
language sql stable security definer set search_path = public as
$$ select lower(coalesce(u,'')) ~ '^[a-z0-9_]{4,19}$' and not exists (select 1 from profiles where username = lower(u)) $$;

-- ---------- Hồ sơ ----------
create or replace function private.require_user() returns uuid
language plpgsql stable as
$$ declare u uuid := auth.uid(); begin if u is null then raise exception 'NOT_AUTHENTICATED'; end if; return u; end $$;

create or replace function public.app_info() returns jsonb
language sql stable security definer set search_path = public as
$$ select jsonb_build_object(
    'max_calendars', (private.cfg('max_calendars')), 'max_members', (private.cfg('max_members')),
    'rescue_per_month', (private.cfg('rescue_per_month')), 'username_cooldown_days', (private.cfg('username_cooldown_days')),
    'today', private.today(), 'now', private.now(), 'registration_open', public.registration_open()) $$;

create or replace function public.me() returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); p profiles; st int; used int; tdy date := private.today();
begin
  select * into p from profiles where id = u;
  if not found then raise exception 'NO_PROFILE'; end if;
  st := private.streak(u);
  select count(*) into used from rescue_uses where user_id = u and source = 'monthly' and date_trunc('month', day) = date_trunc('month', tdy);
  return jsonb_build_object(
    'profile', to_jsonb(p) - 'welcome_member' || jsonb_build_object('welcome_member', p.welcome_member),
    'streak', st,
    'streak_if_saved', private.streak_assuming(u, private.catchup_days(u)),
    'catchup_days', private.catchup_days(u),
    'rescue_monthly_left', greatest(0, (private.cfg('rescue_per_month'))::int - used),
    'rescue_bonus', p.rescue_bonus,
    'today', tdy,
    'tasks_done_total', (select count(*) from task_completions where user_id = u),
    'is_admin', p.is_admin);
end $$;

create or replace function public.update_profile(p jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); cur profiles; nu text; cool int := (private.cfg('username_cooldown_days'))::int; bd date;
begin
  select * into cur from profiles where id = u for update;
  if p ? 'display_name' then
    if char_length(btrim(p->>'display_name')) not between 2 and 24 then raise exception 'INVALID_DISPLAY_NAME'; end if;
    update profiles set display_name = btrim(p->>'display_name') where id = u;
  end if;
  if p ? 'username' and lower(p->>'username') <> cur.username then
    nu := lower(p->>'username');
    if nu !~ '^[a-z0-9_]{4,19}$' then raise exception 'INVALID_USERNAME'; end if;
    if cur.username_changed_at is not null and private.now() < cur.username_changed_at + make_interval(days => cool) then
      raise exception 'USERNAME_COOLDOWN';
    end if;
    begin
      update profiles set username = nu, username_changed_at = private.now() where id = u;
    exception when unique_violation then raise exception 'USERNAME_TAKEN'; end;
  end if;
  if p ? 'birthday' then
    bd := nullif(p->>'birthday', '')::date;
    if bd is not null and (bd > private.today() or bd < date '1940-01-01') then raise exception 'INVALID_BIRTHDAY'; end if;
    update profiles set birthday = bd where id = u;
  end if;
  if p ? 'avatar_path' then
    if p->>'avatar_path' is not null and (p->>'avatar_path') not like (u::text || '/%') then raise exception 'FORBIDDEN'; end if;
    update profiles set avatar_path = p->>'avatar_path' where id = u;
  end if;
  if p ? 'show_birthday'  then update profiles set show_birthday  = (p->>'show_birthday')::boolean  where id = u; end if;
  if p ? 'findable'       then update profiles set findable       = (p->>'findable')::boolean       where id = u; end if;
  if p ? 'album_public'   then update profiles set album_public   = (p->>'album_public')::boolean   where id = u; end if;
  if p ? 'notif_enabled'  then update profiles set notif_enabled  = (p->>'notif_enabled')::boolean  where id = u; end if;
  if p ? 'cheer_enabled'  then update profiles set cheer_enabled  = (p->>'cheer_enabled')::boolean  where id = u; end if;
  perform private.check_titles(u);
  return public.me();
end $$;

create or replace function public.set_equipped_title(tid text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if tid is not null and not exists (select 1 from user_titles where user_id = u and title_id = tid) then raise exception 'TITLE_NOT_OWNED'; end if;
  update profiles set equipped_title = tid where id = u;
  return public.me();
end $$;

create or replace function public.set_favs(card_ids text[]) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if cardinality(card_ids) > 3 then raise exception 'TOO_MANY_FAVS'; end if;
  if exists (select 1 from unnest(card_ids) c where not exists (select 1 from user_cards where user_id = u and card_id = c)) then raise exception 'CARD_NOT_OWNED'; end if;
  update profiles set fav_cards = card_ids where id = u;
  return public.me();
end $$;

-- ---------- Bạn bè ----------
create or replace function public.find_user(u text) returns jsonb
language sql stable security definer set search_path = public as
$$ select jsonb_build_object('id', id, 'username', username, 'display_name', display_name, 'avatar_path', avatar_path)
   from profiles where username = lower(u) and findable and id <> auth.uid() $$;

create or replace function public.send_friend_request(u text) returns uuid
language plpgsql volatile security definer set search_path = public as
$$
declare me uuid := private.require_user(); t uuid; f friendships; nm text;
begin
  select id into t from profiles where username = lower(u) and findable;
  if t is null then raise exception 'USER_NOT_FOUND'; end if;
  if t = me then raise exception 'CANNOT_ADD_SELF'; end if;
  select * into f from friendships where (requester = me and addressee = t) or (requester = t and addressee = me);
  if found then
    if f.status = 'accepted' then raise exception 'ALREADY_FRIENDS'; end if;
    if f.requester = t then
      update friendships set status = 'accepted', responded_at = private.now() where id = f.id;
      perform private.notify(t, 'friend_accepted', jsonb_build_object('from', me), me::text);
      perform private.check_titles(me); perform private.check_titles(t);
      return f.id;
    end if;
    raise exception 'REQUEST_PENDING';
  end if;
  insert into friendships(requester, addressee) values (me, t) returning id into f.id;
  select display_name into nm from profiles where id = me;
  perform private.notify(t, 'friend_request', jsonb_build_object('friendship_id', f.id, 'from', me, 'name', nm), f.id::text);
  return f.id;
end $$;

create or replace function public.respond_friend(fid uuid, accept boolean) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare me uuid := private.require_user(); f friendships;
begin
  select * into f from friendships where id = fid and addressee = me and status = 'pending';
  if not found then raise exception 'NOT_FOUND'; end if;
  if accept then
    update friendships set status = 'accepted', responded_at = private.now() where id = fid;
    perform private.notify(f.requester, 'friend_accepted', jsonb_build_object('from', me), me::text);
    perform private.check_titles(me); perform private.check_titles(f.requester);
  else
    delete from friendships where id = fid;
  end if;
  update notifications set read_at = coalesce(read_at, private.now()) where user_id = me and kind = 'friend_request' and ref_key = fid::text;
end $$;

create or replace function public.remove_friend(other uuid) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare me uuid := private.require_user();
begin
  delete from friendships where (requester = me and addressee = other) or (requester = other and addressee = me);
end $$;

-- ---------- Lịch ----------
create or replace function private.active_calendar_count(uid uuid) returns int
language sql stable security definer set search_path = public as
$$ select count(*)::int from calendar_members where user_id = uid and left_on is null $$;

create or replace function private.next_color(cal uuid) returns text
language plpgsql stable security definer set search_path = public as
$$
declare pal text[] := array['#9AA6FF','#FF7AB6','#4CC9FF','#FFD23F','#5BE584','#FF9A5B']; c text;
begin
  foreach c in array pal loop
    if not exists (select 1 from calendar_members where calendar_id = cal and left_on is null and color = c) then return c; end if;
  end loop;
  return pal[1];
end $$;

create or replace function public.create_calendar(nm text) returns uuid
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); cal uuid;
begin
  if char_length(btrim(nm)) not between 1 and 40 then raise exception 'INVALID_NAME'; end if;
  if private.active_calendar_count(u) >= (private.cfg('max_calendars'))::int then raise exception 'CALENDAR_LIMIT'; end if;
  insert into calendars(name, owner_id) values (btrim(nm), u) returning id into cal;
  insert into calendar_members(calendar_id, user_id, color, joined_on) values (cal, u, '#9AA6FF', private.today());
  return cal;
end $$;

create or replace function public.rename_calendar(cal uuid, nm text) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if char_length(btrim(nm)) not between 1 and 40 then raise exception 'INVALID_NAME'; end if;
  update calendars set name = btrim(nm) where id = cal and owner_id = u;
  if not found then raise exception 'FORBIDDEN'; end if;
end $$;

create or replace function public.set_member_color(cal uuid, col text) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if col !~ '^#[0-9a-fA-F]{6}$' then raise exception 'INVALID_COLOR'; end if;
  update calendar_members set color = col where calendar_id = cal and user_id = u and left_on is null;
  if not found then raise exception 'FORBIDDEN'; end if;
end $$;

create or replace function public.invite_to_calendar(cal uuid, friend uuid) returns uuid
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); inv uuid; cname text; uname text; slots int;
begin
  if not exists (select 1 from calendars where id = cal and owner_id = u) then raise exception 'FORBIDDEN'; end if;
  if not private.are_friends(u, friend) then raise exception 'NOT_FRIENDS'; end if;
  if private.is_member(cal, friend) then raise exception 'ALREADY_MEMBER'; end if;
  select (select count(*) from calendar_members where calendar_id = cal and left_on is null)
       + (select count(*) from calendar_invites where calendar_id = cal and status = 'pending') into slots;
  if slots >= (private.cfg('max_members'))::int then raise exception 'CALENDAR_FULL'; end if;
  begin
    insert into calendar_invites(calendar_id, inviter, invitee) values (cal, u, friend) returning id into inv;
  exception when unique_violation then raise exception 'INVITE_PENDING'; end;
  select name into cname from calendars where id = cal;
  select display_name into uname from profiles where id = u;
  perform private.notify(friend, 'calendar_invite', jsonb_build_object('invite_id', inv, 'calendar_id', cal, 'calendar_name', cname, 'from', u, 'name', uname), inv::text);
  return inv;
end $$;

create or replace function public.respond_invite(inv uuid, accept boolean) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); i calendar_invites; mem int;
begin
  select * into i from calendar_invites where id = inv and invitee = u and status = 'pending' for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if accept then
    if private.active_calendar_count(u) >= (private.cfg('max_calendars'))::int then raise exception 'CALENDAR_LIMIT'; end if;
    select count(*) into mem from calendar_members where calendar_id = i.calendar_id and left_on is null;
    if mem >= (private.cfg('max_members'))::int then raise exception 'CALENDAR_FULL'; end if;
    insert into calendar_members(calendar_id, user_id, color, joined_on)
    values (i.calendar_id, u, private.next_color(i.calendar_id), private.today())
    on conflict (calendar_id, user_id) do update set left_on = null, joined_on = excluded.joined_on, color = excluded.color;
    update calendar_invites set status = 'accepted' where id = inv;
    perform private.notify(i.inviter, 'invite_accepted', jsonb_build_object('calendar_id', i.calendar_id, 'from', u), inv::text);
  else
    update calendar_invites set status = 'declined' where id = inv;
  end if;
  update notifications set read_at = coalesce(read_at, private.now()) where user_id = u and kind = 'calendar_invite' and ref_key = inv::text;
end $$;

create or replace function public.remove_member(cal uuid, uid uuid) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if not exists (select 1 from calendars where id = cal and owner_id = u) then raise exception 'FORBIDDEN'; end if;
  if uid = u then raise exception 'USE_LEAVE'; end if;
  update calendar_members set left_on = private.today() where calendar_id = cal and user_id = uid and left_on is null;
  if not found then raise exception 'NOT_FOUND'; end if;
end $$;

create or replace function public.transfer_owner(cal uuid, uid uuid) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if not exists (select 1 from calendars where id = cal and owner_id = u) then raise exception 'FORBIDDEN'; end if;
  if not private.is_member(cal, uid) then raise exception 'NOT_MEMBER'; end if;
  update calendars set owner_id = uid where id = cal;
end $$;

create or replace function public.leave_calendar(cal uuid) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if not private.is_member(cal, u) then raise exception 'NOT_MEMBER'; end if;
  if private.active_calendar_count(u) <= 1 then raise exception 'KEEP_ONE_CALENDAR'; end if;
  if exists (select 1 from calendars where id = cal and owner_id = u) then raise exception 'OWNER_MUST_TRANSFER'; end if;
  update calendar_members set left_on = private.today() where calendar_id = cal and user_id = u;
end $$;

create or replace function public.delete_calendar(cal uuid, confirm_name text) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); c calendars;
begin
  select * into c from calendars where id = cal and owner_id = u;
  if not found then raise exception 'FORBIDDEN'; end if;
  if btrim(confirm_name) <> c.name then raise exception 'NAME_MISMATCH'; end if;
  if private.active_calendar_count(u) <= 1 then raise exception 'KEEP_ONE_CALENDAR'; end if;
  delete from calendars where id = cal;
end $$;

-- ---------- Trạng thái ngày và nhận thẻ ----------
create or replace function public.day_status(d date) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); c record; lk day_locks; pg reward_grants; groups jsonb := '[]'; cal record; elig boolean; gr reward_grants;
begin
  select * into c from private.day_counts(u, d);
  select * into lk from day_locks where user_id = u and day = d;
  select * into pg from reward_grants where user_id = u and day = d and source in ('personal','rescue');
  for cal in select cm.calendar_id, ca.name, cm.joined_on from calendar_members cm join calendars ca on ca.id = cm.calendar_id
             where cm.user_id = u and cm.left_on is null loop
    elig := cal.joined_on < d and private.group_eligible(cal.calendar_id, d);
    select * into gr from reward_grants where user_id = u and day = d and source = 'group' and calendar_id = cal.calendar_id;
    groups := groups || jsonb_build_array(jsonb_build_object(
      'calendar_id', cal.calendar_id, 'name', cal.name, 'eligible', elig, 'claimed', gr.id is not null, 'card_id', gr.card_id,
      'members', (select coalesce(jsonb_agg(jsonb_build_object('user_id', m.user_id, 'qualified', private.day_qualified(m.user_id, d))), '[]')
                  from calendar_members m where m.calendar_id = cal.calendar_id and m.left_on is null and m.joined_on < d)));
  end loop;
  return jsonb_build_object(
    'day', d, 'total', c.total, 'done', c.done, 'locked', lk.user_id is not null, 'lock_reason', lk.reason,
    'personal_eligible', (c.total > 0 and c.done = c.total and pg.id is null),
    'personal_claimed', pg.id is not null, 'personal_card', pg.card_id,
    'counts_for_streak', private.counts_for_streak(u, d),
    'rescuable', (d < private.today() and private.now() < private.day_end(d) + interval '48 hours'
                  and not private.counts_for_streak(u, d) and lk.user_id is null),
    'groups', groups);
end $$;

create or replace function public.claim_day(d date) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); tdy date := private.today(); c record; out jsonb := '[]'; g record; res record;
        cid text; any_grant boolean := false; first_reason text; cal record; titles text[];
begin
  if d > tdy then raise exception 'FUTURE_DAY'; end if;
  if d < tdy - (private.cfg('claim_window_days'))::int then raise exception 'TOO_OLD'; end if;
  perform pg_advisory_xact_lock(hashtextextended(u::text || d::text, 0));

  select * into c from private.day_counts(u, d);
  if c.total > 0 and c.done = c.total and not exists (select 1 from reward_grants where user_id = u and day = d and source in ('personal','rescue')) then
    cid := private.pick_card(u, private.pick_rarity(private.cfg('daily_weights'), u));
    select * into res from private.grant_card(u, cid, 'personal', d, null);
    if res.granted then
      any_grant := true; first_reason := 'personal';
      out := out || jsonb_build_array(jsonb_build_object('source','personal','card_id',cid,'is_new',res.is_new,'count',res.cnt));
    end if;
  end if;

  for cal in select cm.calendar_id from calendar_members cm where cm.user_id = u and cm.left_on is null and cm.joined_on < d loop
    continue when exists (select 1 from reward_grants where user_id = u and day = d and source = 'group' and calendar_id = cal.calendar_id);
    continue when not private.group_eligible(cal.calendar_id, d);
    select card_id into cid from group_rolls where calendar_id = cal.calendar_id and day = d;
    if cid is null then
      cid := private.pick_card(u, private.pick_rarity(private.cfg('daily_weights'), u));
      insert into group_rolls(calendar_id, day, card_id) values (cal.calendar_id, d, cid) on conflict do nothing;
      select card_id into cid from group_rolls where calendar_id = cal.calendar_id and day = d;
    end if;
    select * into res from private.grant_card(u, cid, 'group', d, cal.calendar_id);
    if res.granted then
      any_grant := true; first_reason := coalesce(first_reason, 'group');
      out := out || jsonb_build_array(jsonb_build_object('source','group','calendar_id',cal.calendar_id,'card_id',cid,'is_new',res.is_new,'count',res.cnt));
    end if;
  end loop;

  if not any_grant then raise exception 'NOTHING_TO_CLAIM'; end if;
  insert into day_locks(user_id, day, reason) values (u, d, first_reason) on conflict do nothing;
  titles := private.check_titles(u);
  return jsonb_build_object('grants', out, 'new_titles', to_jsonb(titles), 'streak', private.streak(u));
end $$;

create or replace function public.use_rescue(d date) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); tdy date := private.today(); used int; src text; cid text; res record; titles text[]; first_day date;
begin
  perform pg_advisory_xact_lock(hashtextextended(u::text || d::text, 0));
  select (created_at at time zone 'Asia/Ho_Chi_Minh')::date into first_day from profiles where id = u;
  if d >= tdy or d < first_day then raise exception 'INVALID_DAY'; end if;
  if private.now() >= private.day_end(d) + interval '48 hours' then raise exception 'RESCUE_EXPIRED'; end if;
  if exists (select 1 from day_locks where user_id = u and day = d) then raise exception 'DAY_LOCKED'; end if;
  if private.counts_for_streak(u, d) then raise exception 'NOT_NEEDED'; end if;

  select count(*) into used from rescue_uses where user_id = u and source = 'monthly' and date_trunc('month', day) = date_trunc('month', d);
  if used < (private.cfg('rescue_per_month'))::int then
    src := 'monthly';
  elsif (select rescue_bonus from profiles where id = u) > 0 then
    src := 'bonus'; update profiles set rescue_bonus = rescue_bonus - 1 where id = u;
  else
    raise exception 'NO_RESCUE_LEFT';
  end if;
  insert into day_locks(user_id, day, reason) values (u, d, 'rescue');
  insert into rescue_uses(user_id, day, source) values (u, d, src);
  cid := private.pick_card(u, private.pick_rarity(private.cfg('daily_weights'), u));
  select * into res from private.grant_card(u, cid, 'rescue', d, null);
  titles := private.check_titles(u);
  return jsonb_build_object('grants', jsonb_build_array(jsonb_build_object('source','rescue','card_id',cid,'is_new',res.is_new,'count',res.cnt)),
                            'new_titles', to_jsonb(titles), 'streak', private.streak(u), 'source', src);
end $$;

-- ---------- Hòm thư và quà ----------
create or replace function public.ensure_login_events() returns int
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); e record; n int := 0; tdy date := private.today();
begin
  for e in select * from events where mail_id is not null and tdy between starts_on and ends_on loop
    insert into mail_recipients(mail_id, user_id, deliver_at) values (e.mail_id, u, private.now()) on conflict do nothing;
    if found then n := n + 1; end if;
  end loop;
  return n;
end $$;

create or replace function public.mark_mail_read(mid uuid) returns void
language sql volatile security definer set search_path = public as
$$ update mail_recipients set read_at = coalesce(read_at, private.now()) where mail_id = mid and user_id = auth.uid() and deliver_at <= private.now() $$;

create or replace function public.choose_welcome_member(m text) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if m not in ('juhoon','keonho','martin','seonghyeon','james') then raise exception 'INVALID_MEMBER'; end if;
  if exists (select 1 from user_titles where user_id = u and title_id like 'welcome-%') then raise exception 'ALREADY_CLAIMED'; end if;
  update profiles set welcome_member = m where id = u and welcome_member is null;
  if not found then raise exception 'ALREADY_CHOSEN'; end if;
end $$;

create or replace function private.draw_weighted_event(uid uuid, ev events, n int) returns text[]
language plpgsql volatile security definer set search_path = public as
$$
declare picked text[] := '{}'; i int; tot numeric; x numeric; r record;
begin
  for i in 1..n loop
    select coalesce(sum(coalesce((ev.weights->>c.tier)::numeric, 1)), 0) into tot from cards c
      where c.event_id = ev.id and c.active and c.id <> all (picked);
    exit when tot = 0;
    x := random() * tot;
    for r in select c.id, coalesce((ev.weights->>c.tier)::numeric, 1) as w from cards c
             where c.event_id = ev.id and c.active and c.id <> all (picked) order by c.sort loop
      x := x - r.w;
      if x <= 0 then picked := picked || r.id; exit; end if;
    end loop;
    if cardinality(picked) < i then picked := picked || (select c.id from cards c where c.event_id = ev.id and c.active and c.id <> all (picked) order by c.sort limit 1); end if;
  end loop;
  return picked;
end $$;

create or replace function public.claim_mail(mid uuid) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mr mail_recipients; m mails; g jsonb; typ text; qty int; i int; cid text; res record;
        grants jsonb := '[]'; titles jsonb := '[]'; rescue_add int := 0; p profiles; picks text[]; rars text[]; rr text; ev events; got text[];
        wn text; wtitle text; sawrare boolean := false; tries int; result jsonb;
begin
  select * into mr from mail_recipients where mail_id = mid and user_id = u and deliver_at <= private.now() for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if mr.claimed_at is not null then return mr.claim_result; end if;
  select * into m from mails where id = mid;
  select * into p from profiles where id = u;

  for g in select * from jsonb_array_elements(m.gifts) loop
    typ := g->>'type';
    qty := greatest(1, least(coalesce((g->>'qty')::int, 1), 5));
    if typ = 'card' then
      for i in 1..qty loop
        rr := coalesce(nullif(g->>'rarity', 'any'), private.pick_rarity(private.cfg('daily_weights'), u));
        cid := private.pick_card(u, rr);
        select * into res from private.grant_card(u, cid, 'admin', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
      end loop;
    elsif typ = 'card_id' then
      cid := g->>'id';
      if not exists (select 1 from cards where id = cid and active) then raise exception 'CARD_NOT_FOUND'; end if;
      select * into res from private.grant_card(u, cid, 'admin', null, null);
      grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
    elsif typ = 'rescue' then
      rescue_add := rescue_add + qty;
    elsif typ = 'title' then
      if private.give_title(u, g->>'id', 'admin') then titles := titles || to_jsonb(g->>'id'); end if;
    elsif typ = 'welcome' then
      wn := p.welcome_member;
      if wn is null then raise exception 'CHOOSE_MEMBER_FIRST'; end if;
      wtitle := 'welcome-' || (array_position(array['juhoon','keonho','martin','seonghyeon','james'], wn));
      picks := '{}'; rars := '{}';
      for i in 1..5 loop
        tries := 0;
        loop
          rr := private.pick_rarity(private.cfg('welcome_weights'), u);
          cid := private.pick_card(u, rr, picks);
          exit when cid <> all (picks) or tries > 20;
          tries := tries + 1;
        end loop;
        picks := picks || cid; rars := rars || rr;
      end loop;
      if not exists (select 1 from unnest(rars) x where x <> 'common') then
        i := array_position(rars, 'common');
        cid := private.pick_card(u, 'rare', picks);
        picks[i] := cid; rars[i] := 'rare';
      end if;
      for i in 1..5 loop
        select * into res from private.grant_card(u, picks[i], 'welcome', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','welcome','card_id',picks[i],'is_new',res.is_new,'count',res.cnt,'rarity',rars[i]));
      end loop;
      rescue_add := rescue_add + 2;
      if private.give_title(u, wtitle, 'welcome') then titles := titles || to_jsonb(wtitle); end if;
    elsif typ = 'event' then
      select * into ev from events where id = g->>'id';
      if not found then raise exception 'EVENT_NOT_FOUND'; end if;
      insert into event_claims(user_id, event_id) values (u, ev.id) on conflict do nothing;
      if found then
        picks := private.draw_weighted_event(u, ev, ev.card_count);
        foreach cid in array picks loop
          select * into res from private.grant_card(u, cid, 'event', null, null);
          grants := grants || jsonb_build_array(jsonb_build_object('source','event','card_id',cid,'is_new',res.is_new,'count',res.cnt));
        end loop;
        if ev.frame_title is not null and private.give_title(u, ev.frame_title, 'event') then titles := titles || to_jsonb(ev.frame_title); end if;
      end if;
    else
      raise exception 'UNKNOWN_GIFT';
    end if;
  end loop;

  if rescue_add > 0 then update profiles set rescue_bonus = rescue_bonus + rescue_add where id = u; end if;
  got := private.check_titles(u);
  result := jsonb_build_object('grants', grants, 'new_titles', titles || to_jsonb(got), 'rescue_added', rescue_add);
  update mail_recipients set claimed_at = private.now(), read_at = coalesce(read_at, private.now()), claim_result = result
   where mail_id = mid and user_id = u;
  return result;
end $$;

create or replace function public.admin_send_mail(title text, body text, gifts jsonb, usernames text[] default null, at timestamptz default null) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mid uuid; g jsonb; ids uuid[]; n int; typ text; missing text[]; deliver timestamptz := coalesce(at, private.now());
begin
  if not private.is_admin(u) then raise exception 'FORBIDDEN'; end if;
  if char_length(btrim(title)) not between 1 and 60 then raise exception 'INVALID_TITLE'; end if;
  if char_length(body) > 600 then raise exception 'INVALID_BODY'; end if;
  if jsonb_typeof(gifts) <> 'array' or jsonb_array_length(gifts) > 4 then raise exception 'TOO_MANY_GIFTS'; end if;
  for g in select * from jsonb_array_elements(gifts) loop
    typ := g->>'type';
    if typ = 'card' then
      if coalesce(g->>'rarity','any') not in ('any','common','rare','legendary','supreme') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'card_id' then
      if not exists (select 1 from cards where id = g->>'id') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'rescue' then
      if coalesce((g->>'qty')::int, 0) not between 1 and 5 then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'title' then
      if not exists (select 1 from titles where id = g->>'id') then raise exception 'INVALID_GIFT'; end if;
    else raise exception 'INVALID_GIFT'; end if;
  end loop;
  if usernames is null or cardinality(usernames) = 0 then
    select array_agg(id) into ids from profiles;
  else
    select array_agg(id) into ids from profiles where username = any (select lower(x) from unnest(usernames) x);
    select array_agg(x) into missing from unnest(usernames) x where not exists (select 1 from profiles where username = lower(x));
    if missing is not null then raise exception 'UNKNOWN_USERNAMES:%', array_to_string(missing, ','); end if;
  end if;
  insert into mails(kind, title, body, gifts, sender) values ('admin', btrim(title), body, gifts, u) returning id into mid;
  insert into mail_recipients(mail_id, user_id, deliver_at) select mid, x, deliver from unnest(ids) x;
  get diagnostics n = row_count;
  insert into notifications(user_id, kind, payload, created_at)
    select x, 'mail', jsonb_build_object('mail_id', mid, 'title', btrim(title)), deliver from unnest(ids) x;
  return jsonb_build_object('mail_id', mid, 'recipients', n);
end $$;

-- Lịch sử thư đã gửi (chỉ admin).
create or replace function public.admin_sent_mails() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
begin
  if not private.is_admin(auth.uid()) then raise exception 'FORBIDDEN'; end if;
  return (select coalesce(jsonb_agg(x order by (x->>'created_at') desc), '[]') from (
    select jsonb_build_object('id', m.id, 'title', m.title, 'gifts', m.gifts, 'created_at', m.created_at,
             'recipients', (select count(*) from mail_recipients r where r.mail_id = m.id),
             'claimed', (select count(*) from mail_recipients r where r.mail_id = m.id and r.claimed_at is not null)) x
    from mails m where m.kind = 'admin') s);
end $$;

-- ---------- Thông báo, cổ vũ, xem bạn ----------
create or replace function public.mark_notifications_read(ids uuid[] default null) returns void
language sql volatile security definer set search_path = public as
$$ update notifications set read_at = coalesce(read_at, private.now())
   where user_id = auth.uid() and (ids is null or id = any (ids)) $$;

create or replace function public.send_cheer(to_id uuid) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); nm text; ok boolean;
begin
  if to_id = u then raise exception 'FORBIDDEN'; end if;
  if not (private.are_friends(u, to_id) or private.shares_calendar(u, to_id)) then raise exception 'FORBIDDEN'; end if;
  select cheer_enabled into ok from profiles where id = to_id;
  if not coalesce(ok, false) then raise exception 'CHEER_DISABLED'; end if;
  begin
    insert into cheers(from_user, to_user, day) values (u, to_id, private.today());
  exception when unique_violation then raise exception 'CHEER_LIMIT'; end;
  select display_name into nm from profiles where id = u;
  perform private.notify(to_id, 'cheer', jsonb_build_object('from', u, 'name', nm), u || ':' || private.today());
end $$;

create or replace function public.friend_view(fid uuid) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); p profiles; fr boolean;
begin
  fr := private.are_friends(u, fid);
  if not (fr or private.shares_calendar(u, fid) or u = fid) then raise exception 'FORBIDDEN'; end if;
  select * into p from profiles where id = fid;
  return jsonb_build_object(
    'id', p.id, 'username', p.username, 'display_name', p.display_name, 'avatar_path', p.avatar_path,
    'equipped_title', p.equipped_title, 'streak', private.streak(fid),
    'is_friend', fr,
    'birthday', case when p.show_birthday or u = fid then p.birthday end,
    'fav_cards', case when fr or u = fid then to_jsonb(p.fav_cards) else '[]'::jsonb end,
    'album_public', p.album_public);
end $$;


-- ============================================================
-- 004_security.sql
-- ============================================================
-- Colentis · 004 · Phân quyền (RLS), quyền gọi hàm, view người dùng, realtime
-- Nguyên tắc: client chỉ đọc dữ liệu được phép và ghi task của chính mình; mọi thưởng/khóa/quà qua hàm RPC.

-- Gỡ quyền mặc định, chỉ cấp lại những gì cần.
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;   -- cần để RLS gọi các hàm kiểm tra bên dưới
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_member(uuid, uuid), private.are_friends(uuid, uuid),
                          private.shares_calendar(uuid, uuid), private.is_admin(uuid),
                          private.now(), private.today() to authenticated;

-- ---------- Bật RLS cho mọi bảng ----------
alter table public.app_config          enable row level security;   -- không có policy: chỉ hàm server đọc
alter table public.holidays_tet        enable row level security;
alter table public.profiles            enable row level security;
alter table public.friendships         enable row level security;
alter table public.calendars           enable row level security;
alter table public.calendar_members    enable row level security;
alter table public.calendar_invites    enable row level security;
alter table public.user_calendar_prefs enable row level security;
alter table public.tasks               enable row level security;
alter table public.task_completions    enable row level security;
alter table public.day_locks           enable row level security;
alter table public.rescue_uses         enable row level security;
alter table public.cards               enable row level security;
alter table public.events              enable row level security;
alter table public.user_cards          enable row level security;
alter table public.reward_grants       enable row level security;
alter table public.group_rolls         enable row level security;
alter table public.titles              enable row level security;
alter table public.user_titles         enable row level security;
alter table public.mails               enable row level security;
alter table public.mail_recipients     enable row level security;
alter table public.notifications       enable row level security;
alter table public.cheers              enable row level security;
alter table public.event_claims        enable row level security;

-- ---------- Chính sách đọc ----------
grant select on public.profiles, public.friendships, public.calendars, public.calendar_members, public.calendar_invites,
                public.tasks, public.day_locks, public.cards, public.events, public.user_cards, public.reward_grants,
                public.titles, public.user_titles, public.mails, public.mail_recipients, public.notifications,
                public.user_calendar_prefs, public.rescue_uses, public.cheers to authenticated;

-- Hồ sơ: chỉ đọc bản của mình (đầy đủ). Người khác xem qua view public.people hoặc hàm friend_view/find_user.
create policy profiles_own on public.profiles for select to authenticated using (id = auth.uid());

create policy friendships_involved on public.friendships for select to authenticated
  using (requester = auth.uid() or addressee = auth.uid());

create policy calendars_member on public.calendars for select to authenticated
  using (private.is_member(id, auth.uid()));

create policy calendar_members_same on public.calendar_members for select to authenticated
  using (left_on is null and private.is_member(calendar_id, auth.uid()));

create policy invites_involved on public.calendar_invites for select to authenticated
  using (invitee = auth.uid() or inviter = auth.uid());

-- Task: thấy task của những người còn trong cùng lịch; người đã rời thì task biến mất.
create policy tasks_select on public.tasks for select to authenticated
  using (private.is_member(calendar_id, auth.uid()) and private.is_member(calendar_id, owner_id));
grant insert, update, delete on public.tasks to authenticated;
create policy tasks_insert on public.tasks for insert to authenticated
  with check (owner_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy tasks_update on public.tasks for update to authenticated
  using (owner_id = auth.uid() and private.is_member(calendar_id, auth.uid()))
  with check (owner_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy tasks_delete on public.tasks for delete to authenticated
  using (owner_id = auth.uid());

create policy day_locks_own   on public.day_locks    for select to authenticated using (user_id = auth.uid());
create policy rescue_own      on public.rescue_uses  for select to authenticated using (user_id = auth.uid());
create policy cards_all       on public.cards        for select to authenticated using (active);
create policy events_all      on public.events       for select to authenticated using (true);
create policy titles_all      on public.titles       for select to authenticated using (true);
create policy user_titles_own on public.user_titles  for select to authenticated using (user_id = auth.uid());
create policy grants_own      on public.reward_grants for select to authenticated using (user_id = auth.uid());
create policy cheers_own      on public.cheers       for select to authenticated using (from_user = auth.uid() or to_user = auth.uid());

-- Album: của mình; của bạn bè chỉ khi họ bật công khai.
create policy user_cards_visible on public.user_cards for select to authenticated using (
  user_id = auth.uid()
  or (private.are_friends(auth.uid(), user_id) and exists (select 1 from public.profiles p where p.id = user_cards.user_id and p.album_public)));
-- (policy trên đọc profiles bằng quyền người gọi nên bị chặn bởi profiles_own; dùng hàm riêng bên dưới)
drop policy user_cards_visible on public.user_cards;
create or replace function private.album_visible(owner uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select owner = auth.uid() or (private.are_friends(auth.uid(), owner) and coalesce((select album_public from profiles where id = owner), false)) $$;
grant execute on function private.album_visible(uuid) to authenticated;
create policy user_cards_visible on public.user_cards for select to authenticated using (private.album_visible(user_id));

-- Thư: người nhận chỉ thấy thư đã đến giờ.
create policy mail_recipients_own on public.mail_recipients for select to authenticated
  using (user_id = auth.uid() and deliver_at <= private.now());
create policy mails_visible on public.mails for select to authenticated
  using (exists (select 1 from public.mail_recipients r where r.mail_id = mails.id and r.user_id = auth.uid() and r.deliver_at <= private.now()));
create policy notifications_own on public.notifications for select to authenticated
  using (user_id = auth.uid() and created_at <= private.now());

-- Giao diện từng lịch: ghi trực tiếp, chỉ cho lịch mình tham gia.
grant insert, update, delete on public.user_calendar_prefs to authenticated;
create policy prefs_select on public.user_calendar_prefs for select to authenticated using (user_id = auth.uid());
create policy prefs_write  on public.user_calendar_prefs for insert to authenticated
  with check (user_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy prefs_update on public.user_calendar_prefs for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy prefs_delete on public.user_calendar_prefs for delete to authenticated using (user_id = auth.uid());

-- ---------- View người dùng (chỉ cột an toàn, chỉ người liên quan) ----------
create view public.people with (security_barrier = true) as
  select p.id, p.username, p.display_name, p.avatar_path, p.equipped_title,
         case when p.show_birthday or p.id = auth.uid() then p.birthday end as birthday
  from public.profiles p
  where p.id = auth.uid() or private.are_friends(auth.uid(), p.id) or private.shares_calendar(auth.uid(), p.id)
     or exists (select 1 from public.friendships f where f.status = 'pending' and
                ((f.requester = p.id and f.addressee = auth.uid()) or (f.addressee = p.id and f.requester = auth.uid())))
     or exists (select 1 from public.calendar_invites i where i.status = 'pending' and
                ((i.inviter = p.id and i.invitee = auth.uid()) or (i.invitee = p.id and i.inviter = auth.uid())));
grant select on public.people to authenticated;

-- ---------- Quyền gọi hàm ----------
grant execute on function public.registration_open(), public.username_available(text) to anon, authenticated;
grant execute on function
  public.app_info(), public.me(), public.update_profile(jsonb), public.set_equipped_title(text), public.set_favs(text[]),
  public.find_user(text), public.send_friend_request(text), public.respond_friend(uuid, boolean), public.remove_friend(uuid),
  public.create_calendar(text), public.rename_calendar(uuid, text), public.set_member_color(uuid, text),
  public.invite_to_calendar(uuid, uuid), public.respond_invite(uuid, boolean), public.remove_member(uuid, uuid),
  public.transfer_owner(uuid, uuid), public.leave_calendar(uuid), public.delete_calendar(uuid, text),
  public.day_status(date), public.claim_day(date), public.use_rescue(date),
  public.ensure_login_events(), public.mark_mail_read(uuid), public.choose_welcome_member(text), public.claim_mail(uuid),
  public.admin_send_mail(text, text, jsonb, text[], timestamptz), public.admin_sent_mails(),
  public.mark_notifications_read(uuid[]), public.send_cheer(uuid), public.friend_view(uuid)
  to authenticated;

-- ---------- Không cho client đổi cột nhạy cảm ngay cả khi có lỗi cấu hình ----------
create or replace function private.profiles_protect() returns trigger language plpgsql as
$$
begin
  if current_user in ('authenticated','anon') and tg_op = 'UPDATE' then
    if new.is_admin is distinct from old.is_admin then raise exception 'FORBIDDEN'; end if;
  end if;
  return new;
end $$;
create trigger profiles_protect_trg before update on public.profiles for each row execute function private.profiles_protect();

-- ---------- Realtime ----------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.tasks, public.notifications, public.mail_recipients,
      public.friendships, public.calendar_members, public.calendar_invites;
  end if;
end $$;

-- Hàm tạo sau lệnh revoke ở đầu file (album_visible, profiles_protect) mặc định có quyền cho PUBLIC: gỡ lại.
revoke execute on all functions in schema private from public, anon;
revoke execute on all functions in schema public from public, anon;
grant execute on function public.registration_open(), public.username_available(text) to anon;


-- ============================================================
-- 005_seed.sql
-- ============================================================
-- Colentis · 005 · Dữ liệu khởi tạo: danh hiệu, kho thẻ, sự kiện sinh nhật James
-- Sinh bởi scripts/gen-seed (không chứa ảnh, chỉ đường dẫn trong Storage).

insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('streak-3','dạ gỗ xà cừ','Chuỗi 3 ngày','common','titles/streak-3-avatar.svg','titles/streak-3-title.svg',false,0),
('streak-7','trường giang','Chuỗi 7 ngày','common','titles/streak-7-avatar.svg','titles/streak-7-title.svg',false,1),
('streak-14','14 ngày nhớ em remix','Chuỗi 14 ngày','rare','titles/streak-14-avatar.svg','titles/streak-14-title.svg',false,2),
('streak-30','tại sao người mù lại cô đơn','Chuỗi 30 ngày','rare','titles/streak-30-avatar.svg','titles/streak-30-title.svg',false,3),
('streak-60','kkkkkkkkkkkk','Chuỗi 60 ngày','legendary','titles/streak-60-avatar.svg','titles/streak-60-title.svg',false,4),
('streak-100','thuận buồi xuôi dái','Chuỗi 100 ngày','legendary','titles/streak-100-avatar.svg','titles/streak-100-title.svg',false,5),
('streak-365','loz má dai dữ','Chuỗi 365 ngày','supreme','titles/streak-365-avatar.svg','titles/streak-365-title.svg',false,6),
('tasks-10','CHUC MUNG THANG LON','Hoàn thành 10 task','common','titles/tasks-10-avatar.svg','titles/tasks-10-title.svg',false,7),
('tasks-100','lady boi có cái vòi ở giữa','Hoàn thành 100 task','rare','titles/tasks-100-avatar.svg','titles/tasks-100-title.svg',false,8),
('tasks-500','cập nhật giá vàng mỗi ngày','Hoàn thành 500 task','legendary','titles/tasks-500-avatar.svg','titles/tasks-500-title.svg',false,9),
('tasks-1000','tiểu tam chung thủy','Hoàn thành 1.000 task','supreme','titles/tasks-1000-avatar.svg','titles/tasks-1000-title.svg',false,10),
('friend-first','cu 3 mét lét i bê','Kết bạn lần đầu','common','titles/friend-first-avatar.svg','titles/friend-first-title.svg',false,11),
('group-day-first','xuân Bính Ngọ, lọ thật sung','Ảnh nhóm lần đầu','rare','titles/group-day-first-avatar.svg','titles/group-day-first-title.svg',false,12),
('hidden-night','chạy thận hả má','Hoàn thành task 0–4 giờ','rare','titles/hidden-night-avatar.svg','titles/hidden-night-title.svg',false,13),
('birthday','mừng ra đời tại nhà','Task ngày sinh nhật','rare','titles/birthday-avatar.svg','titles/birthday-title.svg',false,14),
('holiday-newyear','chưa tết ta đâu b','Task ngày 1/1','rare','titles/holiday-newyear-avatar.svg','titles/holiday-newyear-title.svg',false,15),
('holiday-valentine','có bồ chưa b','Task ngày 14/2','rare','titles/holiday-valentine-avatar.svg','titles/holiday-valentine-title.svg',false,16),
('holiday-nationalday','hôm qua là 1/9','Task ngày 2/9','rare','titles/holiday-nationalday-avatar.svg','titles/holiday-nationalday-title.svg',false,17),
('holiday-xmas','mê ri quỵt mệch','Task ngày 25/12','rare','titles/holiday-xmas-avatar.svg','titles/holiday-xmas-title.svg',false,18),
('holiday-tet','lì xì tao mau alo','Task mùng 1 Tết','legendary','titles/holiday-tet-avatar.svg','titles/holiday-tet-title.svg',false,19),
('collection-common','hồi chiều trời mưa','Đủ ảnh Thường','rare','titles/collection-common-avatar.svg','titles/collection-common-title.svg',false,20),
('collection-rare','e là không thể','Đủ ảnh Hiếm','legendary','titles/collection-rare-avatar.svg','titles/collection-rare-title.svg',false,21),
('collection-legendary','ra đường ngậm cục cơm','Đủ ảnh Huyền Thoại','supreme','titles/collection-legendary-avatar.svg','titles/collection-legendary-title.svg',false,22),
('collection-supreme','aura +99999','Đủ ảnh Bá khí','supreme','titles/collection-supreme-avatar.svg','titles/collection-supreme-title.svg',false,23),
('welcome-1','shoulder kimchi','Quà Tân binh · chọn Juhoon','rare','titles/welcome-avatar.svg','titles/welcome-title.svg',true,100),
('welcome-2','finger burger','Quà Tân binh · chọn Keonho','rare','titles/welcome-avatar.svg','titles/welcome-title.svg',true,101),
('welcome-3','finger-joint egg roll','Quà Tân binh · chọn Martin','rare','titles/welcome-avatar.svg','titles/welcome-title.svg',true,102),
('welcome-4','knne panini','Quà Tân binh · chọn Seonghyeon','rare','titles/welcome-avatar.svg','titles/welcome-title.svg',true,103),
('welcome-5','neck chow mein','Quà Tân binh · chọn James','rare','titles/welcome-avatar.svg','titles/welcome-title.svg',true,104),
('birthday-james','Sinh nhật James','Quà sinh nhật James','supreme','titles/birthday-james-avatar.svg','titles/birthday-james-title.svg',true,110);

insert into public.cards(id, rarity, name, orientation, width, height, event_id, tier, effect, color_a, color_b, storage_path, thumb_path, sort) values
('common-01','common','Thường #01','portrait',1200,1600,null,null,null,null,null,'common/common-01.webp','thumbs/common-01.webp',1),
('common-02','common','Thường #02','portrait',1200,1600,null,null,null,null,null,'common/common-02.webp','thumbs/common-02.webp',2),
('common-03','common','Thường #03','portrait',1067,1600,null,null,null,null,null,'common/common-03.webp','thumbs/common-03.webp',3),
('common-04','common','Thường #04','portrait',1200,1600,null,null,null,null,null,'common/common-04.webp','thumbs/common-04.webp',4),
('common-05','common','Thường #05','portrait',1200,1600,null,null,null,null,null,'common/common-05.webp','thumbs/common-05.webp',5),
('common-06','common','Thường #06','portrait',1200,1600,null,null,null,null,null,'common/common-06.webp','thumbs/common-06.webp',6),
('common-07','common','Thường #07','portrait',1200,1600,null,null,null,null,null,'common/common-07.webp','thumbs/common-07.webp',7),
('common-08','common','Thường #08','portrait',1200,1600,null,null,null,null,null,'common/common-08.webp','thumbs/common-08.webp',8),
('common-09','common','Thường #09','portrait',1200,1600,null,null,null,null,null,'common/common-09.webp','thumbs/common-09.webp',9),
('common-10','common','Thường #10','portrait',1200,1600,null,null,null,null,null,'common/common-10.webp','thumbs/common-10.webp',10),
('common-11','common','Thường #11','portrait',1200,1600,null,null,null,null,null,'common/common-11.webp','thumbs/common-11.webp',11),
('common-12','common','Thường #12','portrait',1600,1600,null,null,null,null,null,'common/common-12.webp','thumbs/common-12.webp',12),
('common-13','common','Thường #13','portrait',1200,1600,null,null,null,null,null,'common/common-13.webp','thumbs/common-13.webp',13),
('common-14','common','Thường #14','portrait',1200,1600,null,null,null,null,null,'common/common-14.webp','thumbs/common-14.webp',14),
('common-15','common','Thường #15','landscape',1206,902,null,null,null,null,null,'common/common-15.webp','thumbs/common-15.webp',15),
('common-16','common','Thường #16','landscape',1600,1200,null,null,null,null,null,'common/common-16.webp','thumbs/common-16.webp',16),
('common-17','common','Thường #17','landscape',1600,1200,null,null,null,null,null,'common/common-17.webp','thumbs/common-17.webp',17),
('common-18','common','Thường #18','landscape',1600,1067,null,null,null,null,null,'common/common-18.webp','thumbs/common-18.webp',18),
('common-19','common','Thường #19','portrait',1200,1600,null,null,null,null,null,'common/common-19.webp','thumbs/common-19.webp',19),
('common-20','common','Thường #20','portrait',1200,1600,null,null,null,null,null,'common/common-20.webp','thumbs/common-20.webp',20),
('common-21','common','Thường #21','portrait',1066,1600,null,null,null,null,null,'common/common-21.webp','thumbs/common-21.webp',21),
('common-22','common','Thường #22','landscape',1600,1200,null,null,null,null,null,'common/common-22.webp','thumbs/common-22.webp',22),
('common-23','common','Thường #23','portrait',1200,1600,null,null,null,null,null,'common/common-23.webp','thumbs/common-23.webp',23),
('common-24','common','Thường #24','portrait',1200,1600,null,null,null,null,null,'common/common-24.webp','thumbs/common-24.webp',24),
('common-25','common','Thường #25','portrait',1200,1600,null,null,null,null,null,'common/common-25.webp','thumbs/common-25.webp',25),
('common-26','common','Thường #26','portrait',1067,1600,null,null,null,null,null,'common/common-26.webp','thumbs/common-26.webp',26),
('common-27','common','Thường #27','portrait',1200,1600,null,null,null,null,null,'common/common-27.webp','thumbs/common-27.webp',27),
('common-28','common','Thường #28','portrait',1200,1600,null,null,null,null,null,'common/common-28.webp','thumbs/common-28.webp',28),
('common-29','common','Thường #29','portrait',1200,1600,null,null,null,null,null,'common/common-29.webp','thumbs/common-29.webp',29),
('common-30','common','Thường #30','portrait',1067,1600,null,null,null,null,null,'common/common-30.webp','thumbs/common-30.webp',30),
('rare-01','rare','Hiếm #01','landscape',1206,907,null,null,null,null,null,'rare/rare-01.webp','thumbs/rare-01.webp',1),
('rare-02','rare','Hiếm #02','landscape',1600,1067,null,null,null,null,null,'rare/rare-02.webp','thumbs/rare-02.webp',2),
('rare-03','rare','Hiếm #03','landscape',1206,907,null,null,null,null,null,'rare/rare-03.webp','thumbs/rare-03.webp',3),
('rare-04','rare','Hiếm #04','landscape',1600,1200,null,null,null,null,null,'rare/rare-04.webp','thumbs/rare-04.webp',4),
('rare-05','rare','Hiếm #05','portrait',1200,1600,null,null,null,null,null,'rare/rare-05.webp','thumbs/rare-05.webp',5),
('rare-06','rare','Hiếm #06','portrait',1200,1600,null,null,null,null,null,'rare/rare-06.webp','thumbs/rare-06.webp',6),
('rare-07','rare','Hiếm #07','portrait',1200,1600,null,null,null,null,null,'rare/rare-07.webp','thumbs/rare-07.webp',7),
('rare-08','rare','Hiếm #08','landscape',1600,1200,null,null,null,null,null,'rare/rare-08.webp','thumbs/rare-08.webp',8),
('rare-09','rare','Hiếm #09','portrait',1200,1600,null,null,null,null,null,'rare/rare-09.webp','thumbs/rare-09.webp',9),
('rare-10','rare','Hiếm #10','portrait',960,960,null,null,null,null,null,'rare/rare-10.webp','thumbs/rare-10.webp',10),
('rare-11','rare','Hiếm #11','portrait',1200,1600,null,null,null,null,null,'rare/rare-11.webp','thumbs/rare-11.webp',11),
('rare-12','rare','Hiếm #12','portrait',1200,1600,null,null,null,null,null,'rare/rare-12.webp','thumbs/rare-12.webp',12),
('rare-13','rare','Hiếm #13','portrait',1200,1600,null,null,null,null,null,'rare/rare-13.webp','thumbs/rare-13.webp',13),
('rare-14','rare','Hiếm #14','portrait',1200,1600,null,null,null,null,null,'rare/rare-14.webp','thumbs/rare-14.webp',14),
('rare-15','rare','Hiếm #15','landscape',1600,1200,null,null,null,null,null,'rare/rare-15.webp','thumbs/rare-15.webp',15),
('rare-16','rare','Hiếm #16','portrait',1200,1600,null,null,null,null,null,'rare/rare-16.webp','thumbs/rare-16.webp',16),
('rare-17','rare','Hiếm #17','portrait',1200,1600,null,null,null,null,null,'rare/rare-17.webp','thumbs/rare-17.webp',17),
('rare-18','rare','Hiếm #18','landscape',1600,1200,null,null,null,null,null,'rare/rare-18.webp','thumbs/rare-18.webp',18),
('rare-19','rare','Hiếm #19','portrait',1200,1600,null,null,null,null,null,'rare/rare-19.webp','thumbs/rare-19.webp',19),
('rare-20','rare','Hiếm #20','portrait',1213,1600,null,null,null,null,null,'rare/rare-20.webp','thumbs/rare-20.webp',20),
('rare-21','rare','Hiếm #21','portrait',1200,1600,null,null,null,null,null,'rare/rare-21.webp','thumbs/rare-21.webp',21),
('rare-22','rare','Hiếm #22','portrait',1200,1600,null,null,null,null,null,'rare/rare-22.webp','thumbs/rare-22.webp',22),
('rare-23','rare','Hiếm #23','portrait',1200,1600,null,null,null,null,null,'rare/rare-23.webp','thumbs/rare-23.webp',23),
('rare-24','rare','Hiếm #24','portrait',1200,1600,null,null,null,null,null,'rare/rare-24.webp','thumbs/rare-24.webp',24),
('rare-25','rare','Hiếm #25','portrait',1067,1600,null,null,null,null,null,'rare/rare-25.webp','thumbs/rare-25.webp',25),
('rare-26','rare','Hiếm #26','portrait',1199,1600,null,null,null,null,null,'rare/rare-26.webp','thumbs/rare-26.webp',26),
('rare-27','rare','Hiếm #27','portrait',1200,1600,null,null,null,null,null,'rare/rare-27.webp','thumbs/rare-27.webp',27),
('rare-28','rare','Hiếm #28','portrait',1200,1600,null,null,null,null,null,'rare/rare-28.webp','thumbs/rare-28.webp',28),
('rare-29','rare','Hiếm #29','portrait',1067,1600,null,null,null,null,null,'rare/rare-29.webp','thumbs/rare-29.webp',29),
('rare-30','rare','Hiếm #30','portrait',1200,1600,null,null,null,null,null,'rare/rare-30.webp','thumbs/rare-30.webp',30),
('legendary-01','legendary','Huyền Thoại #01','landscape',1600,1200,null,null,null,null,null,'legendary/legendary-01.webp','thumbs/legendary-01.webp',1),
('legendary-02','legendary','Huyền Thoại #02','landscape',1600,1200,null,null,null,null,null,'legendary/legendary-02.webp','thumbs/legendary-02.webp',2),
('legendary-03','legendary','Huyền Thoại #03','portrait',1200,1600,null,null,null,null,null,'legendary/legendary-03.webp','thumbs/legendary-03.webp',3),
('legendary-04','legendary','Huyền Thoại #04','landscape',1600,1067,null,null,null,null,null,'legendary/legendary-04.webp','thumbs/legendary-04.webp',4),
('legendary-05','legendary','Huyền Thoại #05','portrait',1200,1600,null,null,null,null,null,'legendary/legendary-05.webp','thumbs/legendary-05.webp',5),
('legendary-06','legendary','Huyền Thoại #06','portrait',1200,1600,null,null,null,null,null,'legendary/legendary-06.webp','thumbs/legendary-06.webp',6),
('legendary-07','legendary','Huyền Thoại #07','portrait',1200,1600,null,null,null,null,null,'legendary/legendary-07.webp','thumbs/legendary-07.webp',7),
('legendary-08','legendary','Huyền Thoại #08','portrait',1206,1566,null,null,null,null,null,'legendary/legendary-08.webp','thumbs/legendary-08.webp',8),
('legendary-09','legendary','Huyền Thoại #09','landscape',1600,1200,null,null,null,null,null,'legendary/legendary-09.webp','thumbs/legendary-09.webp',9),
('legendary-10','legendary','Huyền Thoại #10','landscape',1600,1193,null,null,null,null,null,'legendary/legendary-10.webp','thumbs/legendary-10.webp',10),
('legendary-11','legendary','Huyền Thoại #11','portrait',1200,1600,null,null,null,null,null,'legendary/legendary-11.webp','thumbs/legendary-11.webp',11),
('legendary-12','legendary','Huyền Thoại #12','portrait',1200,1600,null,null,null,null,null,'legendary/legendary-12.webp','thumbs/legendary-12.webp',12),
('legendary-13','legendary','Huyền Thoại #13','portrait',1200,1600,null,null,null,null,null,'legendary/legendary-13.webp','thumbs/legendary-13.webp',13),
('legendary-14','legendary','Huyền Thoại #14','portrait',978,1600,null,null,null,null,null,'legendary/legendary-14.webp','thumbs/legendary-14.webp',14),
('legendary-15','legendary','Huyền Thoại #15','portrait',1041,1600,null,null,null,null,null,'legendary/legendary-15.webp','thumbs/legendary-15.webp',15),
('supreme-01','supreme','Bá khí #1 · Greengreen · sét độc','landscape',1600,1200,null,null,'s1','#3CFF7A','#06301a','supreme/supreme-01.webp','thumbs/supreme-01.webp',1),
('supreme-02','supreme','Bá khí #2 · Đen trắng · xung kích bạc','landscape',1600,1200,null,null,'s2','#E6EEF7','#26262d','supreme/supreme-02.webp','thumbs/supreme-02.webp',2),
('supreme-03','supreme','Bá khí #3 · Tokyo · lửa hổ phách','landscape',1280,901,null,null,'s3','#FFB02E','#4d1800','supreme/supreme-03.webp','thumbs/supreme-03.webp',3),
('supreme-04','supreme','Bá khí #4 · Bàn ăn · lăng kính','portrait',1600,1600,null,null,'s4','#3DC8FF','#FF3D6E','supreme/supreme-04.webp','thumbs/supreme-04.webp',4),
('event-birthday-james-A','event','Sinh nhật James 2026 · A','portrait',1067,1600,'birthday-james-2026','A','A',null,null,'event-birthday-james/event-birthday-james-A.webp','thumbs/event-birthday-james-A.webp',0),
('event-birthday-james-S','event','Sinh nhật James 2026 · S','landscape',1600,1068,'birthday-james-2026','S','S',null,null,'event-birthday-james/event-birthday-james-S.webp','thumbs/event-birthday-james-S.webp',1),
('event-birthday-james-SS','event','Sinh nhật James 2026 · SS','landscape',1600,1068,'birthday-james-2026','SS','SS',null,null,'event-birthday-james/event-birthday-james-SS.webp','thumbs/event-birthday-james-SS.webp',2),
('event-birthday-james-SSS','event','Sinh nhật James 2026 · SSS','portrait',1067,1600,'birthday-james-2026','SSS','SSS',null,null,'event-birthday-james/event-birthday-james-SSS.webp','thumbs/event-birthday-james-SSS.webp',3),
('event-birthday-james-AURA','event','Sinh nhật James 2026 · AURA','portrait',1200,1600,'birthday-james-2026','AURA','AURA',null,null,'event-birthday-james/event-birthday-james-AURA.webp','thumbs/event-birthday-james-AURA.webp',4);


-- Sự kiện sinh nhật James 2026: tặng 2 thẻ khác nhau, AURA có trọng số ~0,29 (xác suất nhận AURA ~15%/người).
insert into public.events(id, title, starts_on, ends_on, frame_title, card_count, weights) values
  ('birthday-james-2026', 'Sinh nhật James 2026', date '2026-10-14', date '2026-10-14', 'birthday-james', 2,
   '{"A":1,"S":1,"SS":1,"SSS":1,"AURA":0.29}');

do $$
declare mid uuid;
begin
  insert into public.mails(kind, title, body, gifts, event_id)
  values ('event', 'Chúc mừng sinh nhật James!',
          '14/10 là ngày đặc biệt. Cảm ơn bạn đã đăng nhập hôm nay: bạn nhận 2 thẻ sự kiện ngẫu nhiên và khung sinh nhật James.',
          '[{"type":"event","id":"birthday-james-2026"}]', 'birthday-james-2026')
  returning id into mid;
  update public.events set mail_id = mid where id = 'birthday-james-2026';
end $$;


-- ============================================================
-- 006_storage.sql
-- ============================================================
-- Colentis · 006 · Storage: bucket riêng tư cho ảnh thẻ và avatar
-- Ảnh thẻ chỉ tải được khi bạn sở hữu thẻ đó (hoặc là thẻ yêu thích/album công khai của bạn bè).
-- Tải ảnh thẻ lên bucket 'cards' làm bằng Dashboard (tài khoản chủ project), không có chính sách ghi cho người dùng.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('cards',   'cards',   false, 5242880, array['image/webp']),
  ('avatars', 'avatars', false, 1048576, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- 'common/common-01.webp' hoặc 'thumbs/common-01.webp' → id thẻ 'common-01'
create or replace function private.can_read_card(obj_name text) returns boolean
language sql stable security definer set search_path = public as
$$
  with c as (select regexp_replace(obj_name, '^.*/([^/]+)\.webp$', '\1') as cid)
  select exists (select 1 from c join user_cards uc on uc.card_id = c.cid where private.album_visible(uc.user_id))
      or exists (select 1 from c join profiles p on c.cid = any (p.fav_cards) where private.are_friends(auth.uid(), p.id))
$$;
grant execute on function private.can_read_card(text) to authenticated;

create policy cards_read on storage.objects for select to authenticated
  using (bucket_id = 'cards' and private.can_read_card(name));

create policy avatars_read on storage.objects for select to authenticated
  using (bucket_id = 'avatars');
create policy avatars_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_update on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_delete on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Gỡ quyền mặc định của PUBLIC trên hàm mới tạo ở file này.
revoke execute on all functions in schema private from public, anon;


-- ============================================================
-- 007_khai_mac.sql
-- ============================================================
-- Colentis · 007 · Sự kiện chào mừng "Khai Mạc" (15–16/10/2026)
-- 5 mốc (1..5 task hoàn thành trong thời gian sự kiện). Mỗi mốc mở 1 thành viên (thứ tự ngẫu nhiên riêng từng người,
-- cố định phía server): bộ khung Limited + thẻ Limited. Đủ 5 mốc: chọn đúng 1 trong 5 pack thẻ tag 1Y.

insert into public.events(id, title, starts_on, ends_on, frame_title, card_count, weights) values
  ('khai-mac-2026', 'Khai Mạc', date '2026-10-15', date '2026-10-16', null, 0, '{}')
on conflict (id) do nothing;

-- Danh hiệu + khung (giữ id kiểu limited-<tên> để frameImg() tìm đúng tệp limited-<tên>-avatar/title.svg)
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('limited-james','Mi Sói','Khai Mạc · mốc quà','supreme','titles/limited-james-avatar.svg','titles/limited-james-title.svg',true,120),
('limited-juhoon','Hân Bống','Khai Mạc · mốc quà','supreme','titles/limited-juhoon-avatar.svg','titles/limited-juhoon-title.svg',true,121),
('limited-keonho','Thằng Bi','Khai Mạc · mốc quà','supreme','titles/limited-keonho-avatar.svg','titles/limited-keonho-title.svg',true,122),
('limited-martin','Tin Tồ','Khai Mạc · mốc quà','supreme','titles/limited-martin-avatar.svg','titles/limited-martin-title.svg',true,123),
('limited-seonghyeon','Em Chíp','Khai Mạc · mốc quà','supreme','titles/limited-seonghyeon-avatar.svg','titles/limited-seonghyeon-title.svg',true,124)
on conflict (id) do nothing;

-- Thẻ: 5 Limited (ngang 3:2) + 5 tag 1Y (dọc, tỉ lệ ảnh gốc 1170x1463). Ảnh thật tải lên bucket `cards` riêng.
insert into public.cards(id, rarity, name, orientation, width, height, event_id, tier, effect, color_a, color_b, storage_path, thumb_path, sort) values
('khaimac-james','event','Mi Sói · James','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-james.webp','thumbs/khaimac-james.webp',10),
('khaimac-juhoon','event','Hân Bống · Juhoon','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-juhoon.webp','thumbs/khaimac-juhoon.webp',11),
('khaimac-keonho','event','Thằng Bi · Keonho','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-keonho.webp','thumbs/khaimac-keonho.webp',12),
('khaimac-martin','event','Tin Tồ · Martin','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-martin.webp','thumbs/khaimac-martin.webp',13),
('khaimac-seonghyeon','event','Em Chíp · Seonghyeon','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-seonghyeon.webp','thumbs/khaimac-seonghyeon.webp',14),
('khaimac-1y-martin','event','Tag 1Y · Martin','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-martin.webp','thumbs/khaimac-1y-martin.webp',20),
('khaimac-1y-keonho','event','Tag 1Y · Keonho','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-keonho.webp','thumbs/khaimac-1y-keonho.webp',21),
('khaimac-1y-juhoon','event','Tag 1Y · Juhoon','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-juhoon.webp','thumbs/khaimac-1y-juhoon.webp',22),
('khaimac-1y-seonghyeon','event','Tag 1Y · Seonghyeon','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-seonghyeon.webp','thumbs/khaimac-1y-seonghyeon.webp',23),
('khaimac-1y-james','event','Tag 1Y · James','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-james.webp','thumbs/khaimac-1y-james.webp',24)
on conflict (id) do nothing;

-- Trạng thái sự kiện của từng người (chỉ hàm server đọc/ghi)
create table public.event_perm (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  event_id text not null references public.events(id),
  perm     text[] not null,
  primary key (user_id, event_id)
);
create table public.event_milestones (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  event_id   text not null references public.events(id),
  milestone  integer not null check (milestone between 1 and 5),
  member     text not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, event_id, milestone),
  unique (user_id, event_id, member)
);
create table public.event_packs (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  event_id   text not null references public.events(id),
  member     text not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
alter table public.event_perm       enable row level security;
alter table public.event_milestones enable row level security;
alter table public.event_packs      enable row level security;
revoke all on public.event_perm, public.event_milestones, public.event_packs from anon, authenticated;

-- ---------- Trạng thái ----------
create or replace function public.khai_mac_state() returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); ev events; done int; tdy date := private.today(); pk text;
begin
  select * into ev from events where id = 'khai-mac-2026';
  if not found then return null; end if;
  select count(*) into done from task_completions where user_id = u and vn_day between ev.starts_on and ev.ends_on;
  select member into pk from event_packs where user_id = u and event_id = ev.id;
  return jsonb_build_object(
    'event_id', ev.id, 'starts_on', ev.starts_on, 'ends_on', ev.ends_on, 'today', tdy,
    'active', tdy between ev.starts_on and ev.ends_on, 'done', least(done, 5),
    'claimed', (select coalesce(jsonb_agg(jsonb_build_object('milestone', milestone, 'member', member) order by milestone), '[]')
                from event_milestones where user_id = u and event_id = ev.id),
    'pack', pk);
end $$;

-- ---------- Nhận quà mốc ----------
create or replace function public.claim_khai_mac(m int) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); ev events; done int; pm text[]; mem text; res record; tid text; got text[]; ttl boolean;
        members text[] := array['james','juhoon','keonho','martin','seonghyeon']; ex event_milestones;
begin
  if m is null or m < 1 or m > 5 then raise exception 'INVALID_MILESTONE'; end if;
  select * into ev from events where id = 'khai-mac-2026';
  if not found then raise exception 'EVENT_NOT_FOUND'; end if;
  perform pg_advisory_xact_lock(hashtext('khai-mac:' || u::text));
  select * into ex from event_milestones where user_id = u and event_id = ev.id and milestone = m;
  if found then
    return jsonb_build_object('member', ex.member, 'card_id', 'khaimac-' || ex.member, 'title_id', 'limited-' || ex.member, 'already', true);
  end if;
  if not (private.today() between ev.starts_on and ev.ends_on) then raise exception 'EVENT_ENDED'; end if;
  select count(*) into done from task_completions where user_id = u and vn_day between ev.starts_on and ev.ends_on;
  if done < m then raise exception 'NOT_ENOUGH_TASKS'; end if;
  select perm into pm from event_perm where user_id = u and event_id = ev.id;
  if pm is null then
    select array_agg(x order by random()) into pm from unnest(members) x;
    insert into event_perm(user_id, event_id, perm) values (u, ev.id, pm);
  end if;
  mem := pm[m];
  insert into event_milestones(user_id, event_id, milestone, member) values (u, ev.id, m, mem);
  select * into res from private.grant_card(u, 'khaimac-' || mem, 'event', null, null);
  tid := 'limited-' || mem;
  ttl := private.give_title(u, tid, 'event');
  got := private.check_titles(u);
  return jsonb_build_object('member', mem, 'card_id', 'khaimac-' || mem, 'is_new', coalesce(res.is_new, true), 'count', coalesce(res.cnt, 1),
                            'title_id', tid, 'new_titles', case when ttl then to_jsonb(tid) else '[]'::jsonb end || to_jsonb(got));
end $$;

-- ---------- Quà tổng: chọn đúng 1 pack ----------
create or replace function public.claim_khai_mac_pack(member text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); ev events; n int; res record; ex text;
        members text[] := array['james','juhoon','keonho','martin','seonghyeon'];
begin
  if member is null or member <> all (members) then raise exception 'INVALID_MEMBER'; end if;
  select * into ev from events where id = 'khai-mac-2026';
  if not found then raise exception 'EVENT_NOT_FOUND'; end if;
  perform pg_advisory_xact_lock(hashtext('khai-mac:' || u::text));
  select p.member into ex from event_packs p where p.user_id = u and p.event_id = ev.id;
  if ex is not null then
    return jsonb_build_object('member', ex, 'card_id', 'khaimac-1y-' || ex, 'already', true);
  end if;
  if not (private.today() between ev.starts_on and ev.ends_on) then raise exception 'EVENT_ENDED'; end if;
  select count(*) into n from event_milestones where user_id = u and event_id = ev.id;
  if n < 5 then raise exception 'MILESTONES_INCOMPLETE'; end if;
  insert into event_packs(user_id, event_id, member) values (u, ev.id, member);
  select * into res from private.grant_card(u, 'khaimac-1y-' || member, 'event', null, null);
  return jsonb_build_object('member', member, 'card_id', 'khaimac-1y-' || member, 'is_new', coalesce(res.is_new, true), 'count', coalesce(res.cnt, 1));
end $$;

revoke execute on function public.khai_mac_state(), public.claim_khai_mac(int), public.claim_khai_mac_pack(text) from public, anon;
grant  execute on function public.khai_mac_state(), public.claim_khai_mac(int), public.claim_khai_mac_pack(text) to authenticated;


-- ============================================================
-- 008_secret_frames.sql
-- ============================================================
-- Colentis · 008 · 5 khung bí mật (quà admin). Chỉ admin tặng được qua thư, người chơi không tự mở khóa.
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('secret-james','Bí mật · James','Khung bí mật · quà admin','supreme','titles/secret-james-avatar.svg','titles/secret-james-title.svg',true,130),
('secret-juhoon','Bí mật · Juhoon','Khung bí mật · quà admin','supreme','titles/secret-juhoon-avatar.svg','titles/secret-juhoon-title.svg',true,131),
('secret-keonho','Bí mật · Keonho','Khung bí mật · quà admin','supreme','titles/secret-keonho-avatar.svg','titles/secret-keonho-title.svg',true,132),
('secret-martin','Bí mật · Martin','Khung bí mật · quà admin','supreme','titles/secret-martin-avatar.svg','titles/secret-martin-title.svg',true,133),
('secret-seonghyeon','Bí mật · Seonghyeon','Khung bí mật · quà admin','supreme','titles/secret-seonghyeon-avatar.svg','titles/secret-seonghyeon-title.svg',true,134)
on conflict (id) do nothing;


-- ============================================================
-- 009_mua_concept.sql
-- ============================================================
-- Colentis · 009 · Mùa Concept (18–26/10/2026): thư giới thiệu, thẻ ID Colentis, khung thẻ ID, pack lưu chờ mở
-- Phạm vi giai đoạn này: thư + quà đính kèm (thẻ ID trống, khung, 1 pack khai mạc lưu vào sự kiện).
-- Thẻ concept, pack hằng ngày, panorama, Ultra là giai đoạn sau.

-- ---------- Thẻ ID: mỗi người đúng 1 thẻ ----------
create table public.id_cards (
  user_id    uuid primary key references public.profiles(id) on delete cascade,
  member     text check (member in ('james','juhoon','keonho','martin','seonghyeon')),
  holder     text check (char_length(holder) <= 20),
  photo_path text,
  crop       jsonb not null default '{"z":1,"x":50,"y":50}',
  granted_at timestamptz not null default now(),
  locked_at  timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.id_cards enable row level security;
revoke all on public.id_cards from anon, authenticated;
create policy id_cards_own on public.id_cards for select to authenticated using (user_id = auth.uid());
grant select on public.id_cards to authenticated;

-- Pack/quà lưu vào sự kiện để mở sau (mở bằng hàm của giai đoạn sự kiện).
create table public.event_stash (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  event_id  text not null references public.events(id),
  item      text not null,
  opens_on  date not null,
  opened_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id, item)
);
alter table public.event_stash enable row level security;
revoke all on public.event_stash from anon, authenticated;
create policy event_stash_own on public.event_stash for select to authenticated using (user_id = auth.uid());
grant select on public.event_stash to authenticated;

-- ---------- Danh hiệu + khung thẻ ID (khung vẽ bằng HTML/CSS trong app, không phải SVG) ----------
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('idcard-james','Triệu Vũ Phàm','Thẻ ID Colentis · James, có ảnh và tên','supreme','html:idcard-james','html:idcard-james',true,130),
('idcard-juhoon','Kim Chu Huân','Thẻ ID Colentis · Juhoon, có ảnh và tên','supreme','html:idcard-juhoon','html:idcard-juhoon',true,131),
('idcard-keonho','An Kiến Huy','Thẻ ID Colentis · Keonho, có ảnh và tên','supreme','html:idcard-keonho','html:idcard-keonho',true,132),
('idcard-martin','Phan Mạnh Tiến','Thẻ ID Colentis · Martin, có ảnh và tên','supreme','html:idcard-martin','html:idcard-martin',true,133),
('idcard-seonghyeon','Nghiêm Sơn Hoàng','Thẻ ID Colentis · Seonghyeon, có ảnh và tên','supreme','html:idcard-seonghyeon','html:idcard-seonghyeon',true,134)
on conflict (id) do nothing;

-- Mở khung khi thẻ có đủ thành viên + ảnh + tên.
create or replace function private.sync_idcard_frame(uid uuid) returns boolean
language plpgsql volatile security definer set search_path = public as
$$
declare c id_cards;
begin
  select * into c from id_cards where user_id = uid;
  if not found or c.member is null or c.photo_path is null or c.holder is null or btrim(c.holder) = '' then return false; end if;
  return private.give_title(uid, 'idcard-' || c.member, 'event');
end $$;

-- ---------- RPC ----------
create or replace function public.my_id_card() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user(); c id_cards;
begin
  select * into c from id_cards where user_id = u;
  if not found then return null; end if;
  return jsonb_build_object('member', c.member, 'holder', c.holder, 'photo_path', c.photo_path, 'crop', c.crop,
    'granted_at', c.granted_at, 'locked', c.member is not null,
    'frame', c.member is not null and c.photo_path is not null and nullif(btrim(coalesce(c.holder,'')), '') is not null,
    'serial', 'CLN-26-' || upper(left(coalesce(c.member, 'xx'), 2)) || '-' || lpad(((extract(epoch from c.granted_at))::bigint % 10000)::text, 4, '0'));
end $$;

create or replace function public.id_card_choose(m text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); c id_cards;
begin
  if m is null or m not in ('james','juhoon','keonho','martin','seonghyeon') then raise exception 'INVALID_MEMBER'; end if;
  select * into c from id_cards where user_id = u for update;
  if not found then raise exception 'NO_ID_CARD'; end if;
  if c.member is not null then raise exception 'ALREADY_CHOSEN'; end if;
  update id_cards set member = m, locked_at = private.now(), updated_at = private.now() where user_id = u;
  perform private.sync_idcard_frame(u);
  return public.my_id_card();
end $$;

create or replace function public.id_card_save(p_holder text, p_photo text, p_crop jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); c id_cards; h text := nullif(btrim(coalesce(p_holder, '')), ''); z numeric; x numeric; y numeric;
begin
  select * into c from id_cards where user_id = u for update;
  if not found then raise exception 'NO_ID_CARD'; end if;
  if h is not null and char_length(h) > 20 then raise exception 'INVALID_HOLDER'; end if;
  if p_photo is not null and (p_photo not like u::text || '/idcard-%' or char_length(p_photo) > 120) then raise exception 'INVALID_PHOTO'; end if;
  z := coalesce((p_crop->>'z')::numeric, 1); x := coalesce((p_crop->>'x')::numeric, 50); y := coalesce((p_crop->>'y')::numeric, 50);
  if z < 1 or z > 3 or x < 0 or x > 100 or y < 0 or y > 100 then raise exception 'INVALID_CROP'; end if;
  update id_cards set holder = h, photo_path = coalesce(p_photo, photo_path), crop = jsonb_build_object('z', z, 'x', x, 'y', y), updated_at = private.now() where user_id = u;
  perform private.sync_idcard_frame(u);
  return public.my_id_card();
end $$;

revoke execute on function public.my_id_card(), public.id_card_choose(text), public.id_card_save(text, text, jsonb) from public, anon;
grant  execute on function public.my_id_card(), public.id_card_choose(text), public.id_card_save(text, text, jsonb) to authenticated;
revoke execute on function private.sync_idcard_frame(uuid) from public, anon;

-- ---------- Nhận quà thư: thêm loại quà id_card, id_frame, stash_pack ----------
create or replace function public.claim_mail(mid uuid) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mr mail_recipients; m mails; g jsonb; typ text; qty int; i int; cid text; res record;
        grants jsonb := '[]'; titles jsonb := '[]'; rescue_add int := 0; p profiles; picks text[]; rars text[]; rr text; ev events; got text[];
        wn text; wtitle text; sawrare boolean := false; tries int; result jsonb;
begin
  select * into mr from mail_recipients where mail_id = mid and user_id = u and deliver_at <= private.now() for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if mr.claimed_at is not null then return mr.claim_result; end if;
  select * into m from mails where id = mid;
  select * into p from profiles where id = u;

  for g in select * from jsonb_array_elements(m.gifts) loop
    typ := g->>'type';
    qty := greatest(1, least(coalesce((g->>'qty')::int, 1), 5));
    if typ = 'card' then
      for i in 1..qty loop
        rr := coalesce(nullif(g->>'rarity', 'any'), private.pick_rarity(private.cfg('daily_weights'), u));
        cid := private.pick_card(u, rr);
        select * into res from private.grant_card(u, cid, 'admin', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
      end loop;
    elsif typ = 'card_id' then
      cid := g->>'id';
      if not exists (select 1 from cards where id = cid and active) then raise exception 'CARD_NOT_FOUND'; end if;
      select * into res from private.grant_card(u, cid, 'admin', null, null);
      grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
    elsif typ = 'rescue' then
      rescue_add := rescue_add + qty;
    elsif typ = 'title' then
      if private.give_title(u, g->>'id', 'admin') then titles := titles || to_jsonb(g->>'id'); end if;
    elsif typ = 'welcome' then
      wn := p.welcome_member;
      if wn is null then raise exception 'CHOOSE_MEMBER_FIRST'; end if;
      wtitle := 'welcome-' || (array_position(array['juhoon','keonho','martin','seonghyeon','james'], wn));
      picks := '{}'; rars := '{}';
      for i in 1..5 loop
        tries := 0;
        loop
          rr := private.pick_rarity(private.cfg('welcome_weights'), u);
          cid := private.pick_card(u, rr, picks);
          exit when cid <> all (picks) or tries > 20;
          tries := tries + 1;
        end loop;
        picks := picks || cid; rars := rars || rr;
      end loop;
      if not exists (select 1 from unnest(rars) x where x <> 'common') then
        i := array_position(rars, 'common');
        cid := private.pick_card(u, 'rare', picks);
        picks[i] := cid; rars[i] := 'rare';
      end if;
      for i in 1..5 loop
        select * into res from private.grant_card(u, picks[i], 'welcome', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','welcome','card_id',picks[i],'is_new',res.is_new,'count',res.cnt,'rarity',rars[i]));
      end loop;
      rescue_add := rescue_add + 2;
      if private.give_title(u, wtitle, 'welcome') then titles := titles || to_jsonb(wtitle); end if;
    elsif typ = 'event' then
      select * into ev from events where id = g->>'id';
      if not found then raise exception 'EVENT_NOT_FOUND'; end if;
      insert into event_claims(user_id, event_id) values (u, ev.id) on conflict do nothing;
      if found then
        picks := private.draw_weighted_event(u, ev, ev.card_count);
        foreach cid in array picks loop
          select * into res from private.grant_card(u, cid, 'event', null, null);
          grants := grants || jsonb_build_array(jsonb_build_object('source','event','card_id',cid,'is_new',res.is_new,'count',res.cnt));
        end loop;
        if ev.frame_title is not null and private.give_title(u, ev.frame_title, 'event') then titles := titles || to_jsonb(ev.frame_title); end if;
      end if;
    elsif typ = 'id_card' then
      insert into id_cards(user_id) values (u) on conflict do nothing;
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','id_card',true));
    elsif typ = 'id_frame' then
      -- Khung đi kèm thẻ ID: mở khi thẻ có thành viên, ảnh và tên (xem private.sync_idcard_frame).
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','id_frame',true));
    elsif typ = 'stash_pack' then
      insert into event_stash(user_id, event_id, item, opens_on) values (u, coalesce(g->>'event', 'mua-concept-2026'), coalesce(g->>'id', 'pack-1'), coalesce((g->>'opens_on')::date, date '2026-10-18'))
        on conflict do nothing;
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','stash',coalesce(g->>'id', 'pack-1')));
    else
      raise exception 'UNKNOWN_GIFT';
    end if;
  end loop;

  if rescue_add > 0 then update profiles set rescue_bonus = rescue_bonus + rescue_add where id = u; end if;
  got := private.check_titles(u);
  result := jsonb_build_object('grants', grants, 'new_titles', titles || to_jsonb(got), 'rescue_added', rescue_add);
  update mail_recipients set claimed_at = private.now(), read_at = coalesce(read_at, private.now()), claim_result = result
   where mail_id = mid and user_id = u;
  return result;
end $$;

-- ---------- Sự kiện + thư giới thiệu ----------
-- starts_on = 17/10 chỉ để thư được phát từ hôm trước; sự kiện thật bắt đầu 18/10 (ghi trong tham số quà và giao diện).
insert into public.events(id, title, starts_on, ends_on, frame_title, card_count, weights) values
  ('mua-concept-2026', 'Mùa Concept', date '2026-10-17', date '2026-10-26', null, 0, '{}')
on conflict (id) do nothing;

do $$
declare mid uuid;
begin
  insert into public.mails(kind, title, body, gifts, event_id)
  values ('event', 'Mùa Concept mở từ 18/10',
          'Từ 18/10 đến 26/10 Colentis mở Mùa Concept: 3 concept, mỗi chặng 3 ngày. Nhận ngay quà khai mạc: thẻ ID Colentis, khung thẻ ID và 1 pack lưu vào Sự kiện để mở từ 18/10.',
          '[{"type":"id_card"},{"type":"id_frame"},{"type":"stash_pack","event":"mua-concept-2026","id":"pack-1","opens_on":"2026-10-18"}]', 'mua-concept-2026')
  returning id into mid;
  update public.events set mail_id = mid where id = 'mua-concept-2026';
  insert into public.mail_recipients(mail_id, user_id, deliver_at) select mid, id, now() from public.profiles on conflict do nothing;
end $$;


-- ============================================================
-- 010_event_assets.sql
-- ============================================================
-- Colentis · 010 · Ảnh nhỏ của sự kiện (chỉ người đã đăng nhập đọc được; dữ liệu ảnh KHÔNG nằm trong repo)
create table public.event_assets (
  id   text primary key,
  mime text not null,
  data text not null  -- base64
);
alter table public.event_assets enable row level security;
revoke all on public.event_assets from anon, authenticated;
create policy event_assets_read on public.event_assets for select to authenticated using (true);
grant select on public.event_assets to authenticated;


-- ============================================================
-- 011_event_panorama_read.sql
-- ============================================================
-- Colentis · 011 · Cho người đã đăng nhập đọc ảnh panorama sự kiện trong bucket riêng tư `cards` (thư mục event/)
create policy cards_read_event on storage.objects for select to authenticated
  using (bucket_id = 'cards' and name like 'event/mc-pano-%');


-- ============================================================
-- 012_mua_concept_days.sql
-- ============================================================
-- Colentis · 012 · Mùa Concept: sửa ngày bắt đầu (18/10) và lịch 9 ngày theo thiết kế.
-- Thư giới thiệu đã gửi từ 17/10 nên không bị ảnh hưởng; starts_on chỉ là mốc sự kiện thật.
update public.events set starts_on = date '2026-10-18' where id = 'mua-concept-2026';

create table if not exists public.event_days (
  event_id text not null references public.events(id) on delete cascade,
  day_no   int  not null check (day_no between 1 and 31),
  on_date  date not null,
  concept  int  not null check (concept between 1 and 3),
  task_key text not null,
  task_title text not null,
  task_desc  text not null,
  primary key (event_id, day_no),
  unique (event_id, on_date)
);
alter table public.event_days enable row level security;
revoke all on public.event_days from anon, authenticated;
create policy event_days_read on public.event_days for select to authenticated using (true);
grant select on public.event_days to authenticated;

-- 3 concept, mỗi concept 3 ngày: 1 = Urichinguchana (18–20), 2 = Aniyaaa (21–23), 3 = Poyoyoi (24–26).
insert into public.event_days(event_id, day_no, on_date, concept, task_key, task_title, task_desc) values
('mua-concept-2026',1,date '2026-10-18',1,'early_tick','Rạng Sáng','Tick xong 1 việc trước 9 giờ sáng.'),
('mua-concept-2026',2,date '2026-10-19',1,'home_task','Nhà Của Mình','Hoàn thành 1 việc nhà.'),
('mua-concept-2026',3,date '2026-10-20',1,'plan_tomorrow','Khởi Động Tuần','Lên lịch ít nhất 1 việc cho ngày mai.'),
('mua-concept-2026',4,date '2026-10-21',2,'for_others','Gửi Yêu Thương','Hoàn thành 1 việc dành cho người khác.'),
('mua-concept-2026',5,date '2026-10-22',2,'set_time','Xếp Hình Giờ Giấc','Gắn giờ cho 1 việc bất kỳ.'),
('mua-concept-2026',6,date '2026-10-23',2,'night_owl','Cú Đêm','Hoàn thành 1 việc sau 21 giờ.'),
('mua-concept-2026',7,date '2026-10-24',3,'home_task','Dọn Nhà Cuối Tuần','Hoàn thành 1 việc nhà.'),
('mua-concept-2026',8,date '2026-10-25',3,'three_done','Chốt Sổ','Hoàn thành 3 việc trong hôm nay.'),
('mua-concept-2026',9,date '2026-10-26',3,'shared_task','Cả Nhà Cùng Làm','Hoàn thành 1 việc chung.')
on conflict do nothing;


-- ============================================================
-- 013_mua_concept_p2.sql
-- ============================================================
-- Colentis · 013 · Mùa Concept giai đoạn 2: nhiệm vụ ngày, pack concept, thẻ concept thường/holo, mở khóa concept,
-- pack thưởng thẻ app, thẻ Ultra Limited, tặng/xin thẻ trùng, thư 18/10 · 21/10 · 24/10.
-- Mọi kết quả (pack, rút thẻ, mở khóa, quà) do server quyết định; client chỉ gọi hàm.

-- ---------- Bucket riêng tư `concept` (ảnh thẻ concept, panorama, video + nhạc Ultra; chủ dự án tải lên bằng Dashboard) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('concept', 'concept', false, 31457280, array['image/webp','video/mp4','audio/mp4'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- ---------- Bảng ----------
create table public.concept_ticks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day_no  int  not null check (day_no between 1 and 31),
  done_at timestamptz not null default now(),
  primary key (user_id, day_no)
);
create table public.concept_packs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  con        int  not null check (con between 1 and 3),
  kind       text not null check (kind in ('daily','bonus')),
  src        text not null,
  created_at timestamptz not null default now(),
  opened_at  timestamptz,
  result     jsonb,
  unique (user_id, src)
);
create index concept_packs_user on public.concept_packs (user_id, created_at);
create table public.concept_cards (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  con      int  not null check (con between 1 and 3),
  slot     int  not null check (slot between 0 and 4),
  holo     boolean not null,
  count    int  not null check (count >= 0),
  first_at timestamptz not null default now(),
  primary key (user_id, con, slot, holo)
);
create table public.concept_unlocks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  con     int  not null check (con between 1 and 3),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, con)
);
create table public.concept_ultra (
  user_id uuid not null references public.profiles(id) on delete cascade,
  n       int  not null check (n in (1,2)),
  songs   int[] not null check (cardinality(songs) = 2 and songs[1] <> songs[2] and songs[1] between 0 and 6 and songs[2] between 0 and 6),
  locked_at timestamptz not null default now(),
  primary key (user_id, n)
);
create table public.concept_gifts (
  id        uuid primary key default gen_random_uuid(),
  from_user uuid not null references public.profiles(id) on delete cascade,
  to_user   uuid not null references public.profiles(id) on delete cascade,
  con int not null check (con between 1 and 3),
  slot int not null check (slot between 0 and 4),
  holo boolean not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);
create index concept_gifts_to on public.concept_gifts (to_user) where claimed_at is null;
create table public.concept_requests (
  from_user uuid not null references public.profiles(id) on delete cascade,  -- người xin
  to_user   uuid not null references public.profiles(id) on delete cascade,  -- người được xin
  con int not null check (con between 1 and 3),
  slot int not null check (slot between 0 and 4),
  holo boolean not null,
  created_at timestamptz not null default now(),
  primary key (from_user, to_user, con, slot, holo),
  check (from_user <> to_user)
);

do $$
declare t text;
begin
  foreach t in array array['concept_ticks','concept_packs','concept_cards','concept_unlocks','concept_ultra','concept_gifts','concept_requests'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;
create policy concept_ticks_own    on public.concept_ticks    for select to authenticated using (user_id = auth.uid());
create policy concept_packs_own    on public.concept_packs    for select to authenticated using (user_id = auth.uid());
create policy concept_cards_own    on public.concept_cards    for select to authenticated using (user_id = auth.uid());
create policy concept_unlocks_own  on public.concept_unlocks  for select to authenticated using (user_id = auth.uid());
create policy concept_ultra_own    on public.concept_ultra    for select to authenticated using (user_id = auth.uid());
create policy concept_gifts_to     on public.concept_gifts    for select to authenticated using (to_user = auth.uid());
create policy concept_requests_rel on public.concept_requests for select to authenticated using (to_user = auth.uid() or from_user = auth.uid());
grant select on public.concept_ticks, public.concept_packs, public.concept_cards, public.concept_unlocks,
  public.concept_ultra, public.concept_gifts, public.concept_requests to authenticated;

-- ---------- Danh hiệu + khung theo concept (khung vẽ bằng HTML/CSS trong app) ----------
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('concept-1','Urichinguchana','Mùa Concept · đủ 5 thẻ thường concept 1','supreme','html:concept-1','html:concept-1',true,140),
('concept-2','Aniyaaa','Mùa Concept · đủ 5 thẻ thường concept 2','supreme','html:concept-2','html:concept-2',true,141),
('concept-3','Poyoyoi','Mùa Concept · đủ 5 thẻ thường concept 3','supreme','html:concept-3','html:concept-3',true,142)
on conflict (id) do nothing;

-- ---------- Thư: nhãn + thư phát cho mọi người theo lịch ----------
alter table public.mails add column if not exists tag text check (char_length(tag) <= 24);
alter table public.mails add column if not exists tag_color text check (tag_color ~ '^#[0-9A-Fa-f]{6}$');
alter table public.mails add column if not exists summary text check (char_length(summary) <= 120);
alter table public.mails add column if not exists broadcast_at timestamptz;  -- có giá trị: phát cho mọi người dùng (kể cả người vào sau)

-- ---------- Hàm nội bộ ----------
create or replace function private.concept_eid() returns text language sql immutable as $$ select 'mua-concept-2026'::text $$;

-- Số ngày của sự kiện hôm nay (1..9) hoặc null nếu ngoài thời gian.
create or replace function private.concept_day() returns int
language sql stable security definer set search_path = public as
$$ select day_no from event_days where event_id = private.concept_eid() and on_date = private.today() $$;

create or replace function private.concept_add_card(uid uuid, c int, s int, h boolean, out is_new boolean, out cnt int)
language plpgsql volatile security definer set search_path = public as
$$
begin
  insert into concept_cards(user_id, con, slot, holo, count, first_at) values (uid, c, s, h, 1, private.now())
  on conflict (user_id, con, slot, holo) do update set count = concept_cards.count + 1
  returning count into cnt;
  is_new := (cnt = 1);
end $$;

-- Mở khóa mọi concept vừa đủ 5 thẻ thường: panorama, khung + danh hiệu, 1 pack thưởng (thẻ app). Trả về danh sách concept vừa mở.
create or replace function private.concept_check_unlock(uid uuid) returns int[]
language plpgsql volatile security definer set search_path = public as
$$
declare c int; got int[] := '{}'; ins int;
begin
  for c in 1..3 loop
    continue when exists (select 1 from concept_unlocks where user_id = uid and con = c);
    continue when (select count(*) from concept_cards where user_id = uid and con = c and not holo and count > 0) < 5;
    insert into concept_unlocks(user_id, con, unlocked_at) values (uid, c, private.now()) on conflict do nothing;
    get diagnostics ins = row_count;
    continue when ins = 0;
    insert into concept_packs(user_id, con, kind, src) values (uid, c, 'bonus', 'bonus:' || c) on conflict do nothing;
    perform private.give_title(uid, 'concept-' || c, 'event');
    update profiles set equipped_title = 'concept-' || c where id = uid;  -- mặc định dùng khung mới nhất (đổi được ở Hồ sơ)
    perform private.notify(uid, 'concept_unlock', jsonb_build_object('con', c), 'concept_unlock:' || c);
    got := got || c;
  end loop;
  return got;
end $$;

create or replace function private.concept_related(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select private.are_friends(a, b) or private.shares_calendar(a, b) $$;

-- ---------- RPC ----------
-- Toàn bộ trạng thái Mùa Concept của người dùng.
create or replace function public.concept_state() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  return jsonb_build_object(
    'day', private.concept_day(),
    'today', private.today(),
    'ticks', (select coalesce(jsonb_agg(day_no order by day_no), '[]') from concept_ticks where user_id = u),
    'packs', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'con', con, 'kind', kind) order by created_at, id), '[]')
                from concept_packs where user_id = u and opened_at is null),
    'cards', (select coalesce(jsonb_agg(jsonb_build_object('con', con, 'slot', slot, 'holo', holo, 'count', count, 'first_at', first_at)), '[]')
                from concept_cards where user_id = u and count > 0),
    'unlocks', (select coalesce(jsonb_agg(con order by con), '[]') from concept_unlocks where user_id = u),
    'ultra', (select coalesce(jsonb_agg(jsonb_build_object('n', n, 'songs', songs) order by n), '[]') from concept_ultra where user_id = u),
    'gifts', (select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'from', g.from_user, 'name', p.display_name, 'con', g.con, 'slot', g.slot, 'holo', g.holo, 'at', g.created_at) order by g.created_at), '[]')
                from concept_gifts g join profiles p on p.id = g.from_user where g.to_user = u and g.claimed_at is null),
    'asks_in', (select coalesce(jsonb_agg(jsonb_build_object('from', r.from_user, 'name', p.display_name, 'con', r.con, 'slot', r.slot, 'holo', r.holo)), '[]')
                from concept_requests r join profiles p on p.id = r.from_user where r.to_user = u),
    'asks_out', (select coalesce(jsonb_agg(jsonb_build_object('to', r.to_user, 'name', p.display_name, 'con', r.con, 'slot', r.slot, 'holo', r.holo)), '[]')
                from concept_requests r join profiles p on p.id = r.to_user where r.from_user = u),
    'bonus_recent', (select coalesce(jsonb_agg(x), '[]') from (
                select jsonb_array_elements(result) x from (select result from concept_packs
                  where user_id = u and kind = 'bonus' and opened_at is not null order by opened_at desc limit 2) s
              ) t),
    'opened', jsonb_build_object(
      'daily', (select count(*) from concept_packs where user_id = u and kind = 'daily' and opened_at is not null),
      'bonus', (select count(*) from concept_packs where user_id = u and kind = 'bonus' and opened_at is not null)));
end $$;

-- Nhiệm vụ của ngày hôm nay: bấm xong thì nhận 2 pack của concept ngày đó (mỗi ngày một lần, chỉ trong đúng ngày).
create or replace function public.concept_tick() returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); d int := private.concept_day(); c int; ins int;
begin
  if d is null then raise exception 'OUT_OF_EVENT'; end if;
  insert into concept_ticks(user_id, day_no, done_at) values (u, d, private.now()) on conflict do nothing;
  get diagnostics ins = row_count;
  if ins = 0 then raise exception 'ALREADY_DONE'; end if;
  select concept into c from event_days where event_id = private.concept_eid() and day_no = d;
  insert into concept_packs(user_id, con, kind, src) values (u, c, 'daily', 'task:' || d || ':1'), (u, c, 'daily', 'task:' || d || ':2');
  return public.concept_state();
end $$;

-- Mở pack cũ nhất (hoặc pack chỉ định). Pack concept: 5 thẻ, thường 16% mỗi thẻ, holo 4% mỗi thẻ. Pack thưởng: 5 thẻ app.
create or replace function public.concept_open_pack(pack_id uuid default null) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); pk concept_packs; i int; r numeric; s int; h boolean; res record; out jsonb := '[]';
        rar text; cid text; unl int[]; ttl text[]; before int;
begin
  select * into pk from concept_packs
   where user_id = u and opened_at is null and (pack_id is null or id = pack_id)
   order by created_at, id limit 1 for update;
  if not found then raise exception 'NO_PACK'; end if;

  if pk.kind = 'bonus' then
    for i in 1..5 loop
      rar := private.pick_rarity(private.cfg('daily_weights'), u);
      cid := private.pick_card(u, rar);
      select * into res from private.grant_card(u, cid, 'event', null, null);
      out := out || jsonb_build_array(jsonb_build_object('card_id', cid, 'rarity', rar, 'is_new', res.is_new, 'count', res.cnt));
    end loop;
    update concept_packs set opened_at = private.now(), result = out where id = pk.id;
    ttl := private.check_titles(u);
    return jsonb_build_object('pack', jsonb_build_object('id', pk.id, 'con', pk.con, 'kind', pk.kind), 'app', out,
                              'unlocked', '[]'::jsonb, 'new_titles', to_jsonb(ttl));
  end if;

  for i in 1..5 loop
    r := random() * 100;
    if r < 80 then h := false; s := least(4, floor(r / 16)::int); else h := true; s := least(4, floor((r - 80) / 4)::int); end if;
    select * into res from private.concept_add_card(u, pk.con, s, h);
    out := out || jsonb_build_array(jsonb_build_object('con', pk.con, 'slot', s, 'holo', h, 'is_new', res.is_new, 'count', res.cnt));
  end loop;
  update concept_packs set opened_at = private.now(), result = out where id = pk.id;
  unl := private.concept_check_unlock(u);
  return jsonb_build_object('pack', jsonb_build_object('id', pk.id, 'con', pk.con, 'kind', pk.kind), 'cards', out, 'unlocked', to_jsonb(unl));
end $$;

-- Tặng thẻ trùng cho bạn bè / người chung lịch: luôn giữ lại ít nhất 1 bản; mỗi người nhận 1 bản.
create or replace function public.concept_give(to_ids uuid[], c int, s int, h boolean) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); cur int; n int; t uuid; nm text; cnames text[] := array['Urichinguchana','Aniyaaa','Poyoyoi'];
begin
  n := coalesce(cardinality(to_ids), 0);
  if n = 0 or n > 20 then raise exception 'INVALID_RECIPIENTS'; end if;
  if c not between 1 and 3 or s not between 0 and 4 then raise exception 'INVALID_CARD'; end if;
  if (select count(distinct x) from unnest(to_ids) x) <> n or u = any (to_ids) then raise exception 'INVALID_RECIPIENTS'; end if;
  foreach t in array to_ids loop
    if not private.concept_related(u, t) then raise exception 'FORBIDDEN'; end if;
  end loop;
  select count into cur from concept_cards where user_id = u and con = c and slot = s and holo = h for update;
  if coalesce(cur, 0) - n < 1 then raise exception 'NOT_ENOUGH_SPARE'; end if;
  update concept_cards set count = count - n where user_id = u and con = c and slot = s and holo = h;
  select display_name into nm from profiles where id = u;
  foreach t in array to_ids loop
    insert into concept_gifts(from_user, to_user, con, slot, holo, created_at) values (u, t, c, s, h, private.now());
    delete from concept_requests where from_user = t and to_user = u and con = c and slot = s and holo = h;
    perform private.notify(t, 'concept_gift', jsonb_build_object('from', u, 'name', nm, 'con', c, 'slot', s, 'holo', h));
  end loop;
  return public.concept_state();
end $$;

-- Xin thẻ còn thiếu (chưa có bản nào). Người kia nhận thông báo và tự quyết định có tặng không.
create or replace function public.concept_ask(from_ids uuid[], c int, s int, h boolean) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); n int; t uuid; nm text; ins int;
begin
  n := coalesce(cardinality(from_ids), 0);
  if n = 0 or n > 20 then raise exception 'INVALID_RECIPIENTS'; end if;
  if c not between 1 and 3 or s not between 0 and 4 then raise exception 'INVALID_CARD'; end if;
  if u = any (from_ids) then raise exception 'INVALID_RECIPIENTS'; end if;
  if exists (select 1 from concept_cards where user_id = u and con = c and slot = s and holo = h and count > 0) then raise exception 'ALREADY_OWNED'; end if;
  if (select count(*) from concept_requests where from_user = u) + n > 60 then raise exception 'TOO_MANY_REQUESTS'; end if;
  select display_name into nm from profiles where id = u;
  foreach t in array from_ids loop
    if not private.concept_related(u, t) then raise exception 'FORBIDDEN'; end if;
    insert into concept_requests(from_user, to_user, con, slot, holo, created_at) values (u, t, c, s, h, private.now()) on conflict do nothing;
    get diagnostics ins = row_count;
    if ins > 0 then
      perform private.notify(t, 'concept_ask', jsonb_build_object('from', u, 'name', nm, 'con', c, 'slot', s, 'holo', h));
    end if;
  end loop;
  return public.concept_state();
end $$;

-- Nhận thẻ bạn bè tặng (một người gửi, hoặc tất cả khi from_id null). Mỗi quà chỉ nhận một lần.
create or replace function public.concept_claim_gifts(from_id uuid default null) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); g record; res record; out jsonb := '[]'; unl int[];
begin
  for g in select * from concept_gifts where to_user = u and claimed_at is null and (from_id is null or from_user = from_id)
           order by created_at, id for update loop
    update concept_gifts set claimed_at = private.now() where id = g.id;
    select * into res from private.concept_add_card(u, g.con, g.slot, g.holo);
    out := out || jsonb_build_array(jsonb_build_object('con', g.con, 'slot', g.slot, 'holo', g.holo, 'is_new', res.is_new, 'count', res.cnt,
                                    'from', g.from_user, 'from_name', (select display_name from profiles where id = g.from_user)));
  end loop;
  if jsonb_array_length(out) = 0 then raise exception 'NO_GIFT'; end if;
  unl := private.concept_check_unlock(u);
  return jsonb_build_object('cards', out, 'unlocked', to_jsonb(unl));
end $$;

-- Khóa 2 bài hát vào thẻ Ultra (n = 1 hoặc 2). Cần đủ 3 concept. Khóa rồi không đổi được.
create or replace function public.concept_ultra_lock(n int, songs int[]) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if n not in (1, 2) then raise exception 'INVALID_ULTRA'; end if;
  if (select count(*) from concept_unlocks where user_id = u) < 3 then raise exception 'NEED_ALL_CONCEPTS'; end if;
  if songs is null or cardinality(songs) <> 2 or songs[1] = songs[2] or songs[1] not between 0 and 6 or songs[2] not between 0 and 6 then raise exception 'INVALID_SONGS'; end if;
  begin
    insert into concept_ultra(user_id, n, songs, locked_at) values (u, n, songs, private.now());
  exception when unique_violation then raise exception 'ALREADY_LOCKED'; end;
  return public.concept_state();
end $$;

-- Danh sách người có thể tặng / xin (bạn bè + người chung lịch).
create or replace function public.concept_people() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  return (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'name', p.display_name, 'username', p.username) order by p.display_name), '[]')
            from profiles p where p.id <> u and private.concept_related(u, p.id));
end $$;

-- ---------- Nhận quà thư: thêm concept_pack; stash_pack cũ quy đổi thành pack concept 1 ----------
create or replace function public.claim_mail(mid uuid) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mr mail_recipients; m mails; g jsonb; typ text; qty int; i int; cid text; res record;
        grants jsonb := '[]'; titles jsonb := '[]'; rescue_add int := 0; p profiles; picks text[]; rars text[]; rr text; ev events; got text[];
        wn text; wtitle text; sawrare boolean := false; tries int; result jsonb; pc int;
begin
  select * into mr from mail_recipients where mail_id = mid and user_id = u and deliver_at <= private.now() for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if mr.claimed_at is not null then return mr.claim_result; end if;
  select * into m from mails where id = mid;
  select * into p from profiles where id = u;

  for g in select * from jsonb_array_elements(m.gifts) loop
    typ := g->>'type';
    qty := greatest(1, least(coalesce((g->>'qty')::int, 1), 5));
    if typ = 'card' then
      for i in 1..qty loop
        rr := coalesce(nullif(g->>'rarity', 'any'), private.pick_rarity(private.cfg('daily_weights'), u));
        cid := private.pick_card(u, rr);
        select * into res from private.grant_card(u, cid, 'admin', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
      end loop;
    elsif typ = 'card_id' then
      cid := g->>'id';
      if not exists (select 1 from cards where id = cid and active) then raise exception 'CARD_NOT_FOUND'; end if;
      select * into res from private.grant_card(u, cid, 'admin', null, null);
      grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
    elsif typ = 'rescue' then
      rescue_add := rescue_add + qty;
    elsif typ = 'title' then
      if private.give_title(u, g->>'id', 'admin') then titles := titles || to_jsonb(g->>'id'); end if;
    elsif typ = 'welcome' then
      wn := p.welcome_member;
      if wn is null then raise exception 'CHOOSE_MEMBER_FIRST'; end if;
      wtitle := 'welcome-' || (array_position(array['juhoon','keonho','martin','seonghyeon','james'], wn));
      picks := '{}'; rars := '{}';
      for i in 1..5 loop
        tries := 0;
        loop
          rr := private.pick_rarity(private.cfg('welcome_weights'), u);
          cid := private.pick_card(u, rr, picks);
          exit when cid <> all (picks) or tries > 20;
          tries := tries + 1;
        end loop;
        picks := picks || cid; rars := rars || rr;
      end loop;
      if not exists (select 1 from unnest(rars) x where x <> 'common') then
        i := array_position(rars, 'common');
        cid := private.pick_card(u, 'rare', picks);
        picks[i] := cid; rars[i] := 'rare';
      end if;
      for i in 1..5 loop
        select * into res from private.grant_card(u, picks[i], 'welcome', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','welcome','card_id',picks[i],'is_new',res.is_new,'count',res.cnt,'rarity',rars[i]));
      end loop;
      rescue_add := rescue_add + 2;
      if private.give_title(u, wtitle, 'welcome') then titles := titles || to_jsonb(wtitle); end if;
    elsif typ = 'event' then
      select * into ev from events where id = g->>'id';
      if not found then raise exception 'EVENT_NOT_FOUND'; end if;
      insert into event_claims(user_id, event_id) values (u, ev.id) on conflict do nothing;
      if found then
        picks := private.draw_weighted_event(u, ev, ev.card_count);
        foreach cid in array picks loop
          select * into res from private.grant_card(u, cid, 'event', null, null);
          grants := grants || jsonb_build_array(jsonb_build_object('source','event','card_id',cid,'is_new',res.is_new,'count',res.cnt));
        end loop;
        if ev.frame_title is not null and private.give_title(u, ev.frame_title, 'event') then titles := titles || to_jsonb(ev.frame_title); end if;
      end if;
    elsif typ = 'id_card' then
      insert into id_cards(user_id) values (u) on conflict do nothing;
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','id_card',true));
    elsif typ = 'id_frame' then
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','id_frame',true));
    elsif typ = 'concept_pack' or typ = 'stash_pack' then
      pc := coalesce((g->>'con')::int, 1);
      if pc not between 1 and 3 then raise exception 'INVALID_GIFT'; end if;
      for i in 1..(case when typ = 'concept_pack' then qty else 1 end) loop
        insert into concept_packs(user_id, con, kind, src) values (u, pc, 'daily', 'mail:' || mid || ':' || i) on conflict do nothing;
      end loop;
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','concept_pack',pc,'qty',case when typ = 'concept_pack' then qty else 1 end));
    else
      raise exception 'UNKNOWN_GIFT';
    end if;
  end loop;

  if rescue_add > 0 then update profiles set rescue_bonus = rescue_bonus + rescue_add where id = u; end if;
  got := private.check_titles(u);
  result := jsonb_build_object('grants', grants, 'new_titles', titles || to_jsonb(got), 'rescue_added', rescue_add);
  update mail_recipients set claimed_at = private.now(), read_at = coalesce(read_at, private.now()), claim_result = result
   where mail_id = mid and user_id = u;
  return result;
end $$;

-- Admin gửi thư: thêm quà pack concept.
create or replace function public.admin_send_mail(title text, body text, gifts jsonb, usernames text[] default null, at timestamptz default null) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mid uuid; g jsonb; ids uuid[]; n int; typ text; missing text[]; deliver timestamptz := coalesce(at, private.now());
begin
  if not private.is_admin(u) then raise exception 'FORBIDDEN'; end if;
  if char_length(btrim(title)) not between 1 and 60 then raise exception 'INVALID_TITLE'; end if;
  if char_length(body) > 600 then raise exception 'INVALID_BODY'; end if;
  if jsonb_typeof(gifts) <> 'array' or jsonb_array_length(gifts) > 4 then raise exception 'TOO_MANY_GIFTS'; end if;
  for g in select * from jsonb_array_elements(gifts) loop
    typ := g->>'type';
    if typ = 'card' then
      if coalesce(g->>'rarity','any') not in ('any','common','rare','legendary','supreme') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'card_id' then
      if not exists (select 1 from cards where id = g->>'id') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'rescue' then
      if coalesce((g->>'qty')::int, 0) not between 1 and 5 then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'title' then
      if not exists (select 1 from titles where id = g->>'id') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'concept_pack' then
      if coalesce((g->>'con')::int, 0) not between 1 and 3 or coalesce((g->>'qty')::int, 1) not between 1 and 5 then raise exception 'INVALID_GIFT'; end if;
    else raise exception 'INVALID_GIFT'; end if;
  end loop;
  if usernames is null or cardinality(usernames) = 0 then
    select array_agg(id) into ids from profiles;
  else
    select array_agg(id) into ids from profiles where username = any (select lower(x) from unnest(usernames) x);
    select array_agg(x) into missing from unnest(usernames) x where not exists (select 1 from profiles where username = lower(x));
    if missing is not null then raise exception 'UNKNOWN_USERNAMES:%', array_to_string(missing, ','); end if;
  end if;
  insert into mails(kind, title, body, gifts, sender) values ('admin', btrim(title), body, gifts, u) returning id into mid;
  insert into mail_recipients(mail_id, user_id, deliver_at) select mid, x, deliver from unnest(ids) x;
  get diagnostics n = row_count;
  insert into notifications(user_id, kind, payload, created_at)
    select x, 'mail', jsonb_build_object('mail_id', mid, 'title', btrim(title)), deliver from unnest(ids) x;
  return jsonb_build_object('mail_id', mid, 'recipients', n);
end $$;

-- Đăng nhập: giao thư sự kiện và các thư phát chung (kể cả thư hẹn giờ cho người vào sau).
create or replace function public.ensure_login_events() returns int
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); e record; b record; n int := 0; tdy date := private.today();
begin
  for e in select * from events where mail_id is not null and tdy between starts_on and ends_on loop
    insert into mail_recipients(mail_id, user_id, deliver_at) values (e.mail_id, u, private.now()) on conflict do nothing;
    if found then n := n + 1; end if;
  end loop;
  for b in select id, broadcast_at from mails where broadcast_at is not null loop
    insert into mail_recipients(mail_id, user_id, deliver_at) values (b.id, u, b.broadcast_at) on conflict do nothing;
  end loop;
  return n;
end $$;

-- ---------- Nội dung thư theo thiết kế ----------
update public.mails set
  body = E'Mùa Concept kéo dài 9 ngày với 3 concept: Urichinguchana (ngày 1–3), Aniyaaa (ngày 4–6) và Poyoyoi (ngày 7–9).\n\nMỗi ngày hoàn thành nhiệm vụ của concept để nhận 2 pack, mỗi pack 5 thẻ. Thẻ nào của bạn thì bạn tự rút. Thẻ trùng thì tặng được cho bạn bè, và bạn cũng có thể xin thẻ còn thiếu.\n\nĐủ 5 thẻ thường: mở panorama, khung tròn, danh hiệu và 1 pack thưởng thẻ app. Đủ cả 3 concept: nhận 2 thẻ Ultra Limited, tự chọn bài hát cho mỗi thẻ.',
  gifts = '[{"type":"id_card"},{"type":"id_frame"},{"type":"concept_pack","con":1,"qty":1}]',
  tag = 'SỰ KIỆN MỚI', tag_color = '#FFB02E', summary = 'Gom thẻ, ghép panorama, nhận 2 thẻ Ultra Limited.'
 where kind = 'event' and event_id = 'mua-concept-2026';

-- Quà thư cũ (pack lưu chờ) → pack concept 1 chưa mở.
insert into public.concept_packs(user_id, con, kind, src)
  select user_id, 1, 'daily', 'mail:legacy:' || item from public.event_stash
   where event_id = 'mua-concept-2026' and opened_at is null
on conflict do nothing;
update public.event_stash set opened_at = now() where event_id = 'mua-concept-2026' and opened_at is null;

do $$
declare mid uuid; t record;
begin
  for t in select * from (values
    ('Aniyaaa đã lên sàn', E'Từ hôm nay đến ngày 6, nhiệm vụ hằng ngày cho pack của Aniyaaa. Concept cũ vẫn mở, bạn có thể gom nốt thẻ còn thiếu.',
       '[{"type":"concept_pack","con":2,"qty":1}]'::jsonb, 'MỞ KHÓA', '#FF2E88', timestamptz '2026-10-21 00:00:00+07', 'Concept thứ hai mở từ hôm nay.'),
    ('Poyoyoi · concept cuối', E'Đây là concept cuối cùng của mùa. Hoàn thành cả ba concept để nhận 2 thẻ Ultra Limited có nhạc và video.',
       '[{"type":"concept_pack","con":3,"qty":1}]'::jsonb, 'MỞ KHÓA', '#4CC9FF', timestamptz '2026-10-24 00:00:00+07', 'Hoàn thành cả ba để nhận 2 thẻ Ultra.'),
    ('Sự kiện bí mật · 01/11', E'Sau Mùa Concept sẽ có sự kiện mới vào 01/11. Hiện chỉ biết nó liên quan đến Lịch.\n\nThông tin đầy đủ sẽ được gửi vào hòm thư này khi tới ngày.',
       '[]'::jsonb, 'SẮP TỚI', '#B79CFF', timestamptz '2026-10-18 00:00:00+07', 'Chỉ biết nó liên quan đến Lịch.')
  ) as v(title, body, gifts, tag, color, at, summary) loop
    insert into public.mails(kind, title, body, gifts, event_id, tag, tag_color, summary, broadcast_at)
      values ('news', t.title, t.body, t.gifts, 'mua-concept-2026', t.tag, t.color, t.summary, t.at) returning id into mid;
    insert into public.mail_recipients(mail_id, user_id, deliver_at) select mid, id, t.at from public.profiles on conflict do nothing;
    insert into public.notifications(user_id, kind, payload, created_at)
      select id, 'mail', jsonb_build_object('mail_id', mid, 'title', t.title), t.at from public.profiles;
  end loop;
end $$;

-- ---------- Storage: đọc có điều kiện ----------
create or replace function private.can_read_concept(obj text) returns boolean
language sql stable security definer set search_path = public as
$$
  select case
    when obj ~ '^c[1-3]-[0-4]\.webp$' then true
    when obj ~ '^ultra-[12]\.webp$' then true
    when obj ~ '^pano-[1-3]\.webp$' then true      -- panorama hiện sẵn dưới các dải che; dải mở dần khi gom thẻ
    when obj ~ '^(ultra-[12]\.mp4|songs/[0-6]\.m4a)$' then (select count(*) from concept_unlocks where user_id = auth.uid()) = 3
    else false end
$$;
grant execute on function private.can_read_concept(text) to authenticated;
create policy concept_read on storage.objects for select to authenticated
  using (bucket_id = 'concept' and private.can_read_concept(name));

-- ---------- Quyền + realtime ----------
revoke execute on all functions in schema private from public, anon;
revoke execute on function public.concept_state(), public.concept_tick(), public.concept_open_pack(uuid), public.concept_give(uuid[], int, int, boolean),
  public.concept_ask(uuid[], int, int, boolean), public.concept_claim_gifts(uuid), public.concept_ultra_lock(int, int[]), public.concept_people() from public, anon;
grant execute on function public.concept_state(), public.concept_tick(), public.concept_open_pack(uuid), public.concept_give(uuid[], int, int, boolean),
  public.concept_ask(uuid[], int, int, boolean), public.concept_claim_gifts(uuid), public.concept_ultra_lock(int, int[]), public.concept_people() to authenticated;
grant execute on function public.claim_mail(uuid), public.ensure_login_events() to authenticated;
grant execute on function public.admin_send_mail(text, text, jsonb, text[], timestamptz) to authenticated;
grant execute on function private.can_read_concept(text) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.concept_packs, public.concept_gifts, public.concept_requests;
  end if;
end $$;

