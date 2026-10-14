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
