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
