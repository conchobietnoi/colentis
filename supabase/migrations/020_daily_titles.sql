-- Colentis · 020 · 12 danh hiệu "mốc hằng ngày" (frame vẽ bằng scripts/gen-daily-frames.mjs): giờ làm việc, số việc trong ngày,
-- cuối tuần, ảnh check in, bạn bè, thẻ trùng. Điều kiện kiểm tra ở server trong private.check_titles; ai đủ điều kiện sẽ nhận ở lần
-- thao tác kế tiếp (tick việc, nhận thẻ, gắn ảnh…). set_task_photo trả thêm new_titles.

insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('daily-early','gà chưa gáy tui đã xong','Hoàn thành task 4–6 giờ sáng','rare','titles/daily-early-avatar.svg','titles/daily-early-title.svg',false,24),
('daily-lunch','cơm chưa ăn đã đòi làm','Hoàn thành task 11–13 giờ trưa','common','titles/daily-lunch-avatar.svg','titles/daily-lunch-title.svg',false,25),
('daily-late','ngủ sớm là chuyện người khác','Hoàn thành task lúc 23 giờ','rare','titles/daily-late-avatar.svg','titles/daily-late-title.svg',false,26),
('day-5','cày như trâu','5 task xong trong một ngày','common','titles/day-5-avatar.svg','titles/day-5-title.svg',false,27),
('day-10','trâu cũng biết xin nghỉ phép','10 task xong trong một ngày','legendary','titles/day-10-avatar.svg','titles/day-10-title.svg',false,28),
('weekend','thứ bảy chủ nhật ăn được hông','Có task xong cả thứ Bảy và Chủ nhật cùng một cuối tuần','rare','titles/weekend-avatar.svg','titles/weekend-title.svg',false,29),
('photo-1','sống ảo có tâm','Check in ảnh lần đầu','common','titles/photo-1-avatar.svg','titles/photo-1-title.svg',false,30),
('photo-10','tấm này đẹp tấm sau đẹp hơn','Check in ảnh cho 10 việc','rare','titles/photo-10-avatar.svg','titles/photo-10-title.svg',false,31),
('photo-50','paparazzi bất đắc dĩ','Check in ảnh cho 50 việc','legendary','titles/photo-50-avatar.svg','titles/photo-50-title.svg',false,32),
('friend-5','quen rộng mà ví mỏng','Có 5 người bạn','rare','titles/friend-5-avatar.svg','titles/friend-5-title.svg',false,33),
('dup-5','gặp thẻ này hoài luôn','Có một thẻ trùng 5 lần','rare','titles/dup-5-avatar.svg','titles/dup-5-title.svg',false,34),
('photo-streak-7','ngày nào cũng soi gương','7 ngày liên tiếp có ảnh check in','legendary','titles/photo-streak-7-avatar.svg','titles/photo-streak-7-title.svg',false,35)
on conflict (id) do nothing;

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

  -- ===== Mốc hằng ngày (020) =====
  if exists (select 1 from task_completions where user_id = uid and vn_hour between 4 and 5)
     and private.give_title(uid, 'daily-early', 'achievement') then got := array_append(got, 'daily-early'); end if;
  if exists (select 1 from task_completions where user_id = uid and vn_hour between 11 and 12)
     and private.give_title(uid, 'daily-lunch', 'achievement') then got := array_append(got, 'daily-lunch'); end if;
  if exists (select 1 from task_completions where user_id = uid and vn_hour = 23)
     and private.give_title(uid, 'daily-late', 'achievement') then got := array_append(got, 'daily-late'); end if;
  foreach need in array array[5,10] loop
    if exists (select 1 from task_completions where user_id = uid group by vn_day having count(*) >= need)
       and private.give_title(uid, 'day-' || need, 'achievement') then got := array_append(got, 'day-' || need); end if;
  end loop;
  -- cuối tuần: có việc xong cả thứ Bảy lẫn Chủ nhật liền sau
  if exists (select 1 from task_completions a join task_completions b on b.user_id = a.user_id and b.vn_day = a.vn_day + 1
              where a.user_id = uid and extract(dow from a.vn_day) = 6)
     and private.give_title(uid, 'weekend', 'achievement') then got := array_append(got, 'weekend'); end if;
  select count(*) into have from task_photos where owner_id = uid;
  foreach need in array array[1,10,50] loop
    if have >= need and private.give_title(uid, 'photo-' || need, 'achievement') then got := array_append(got, 'photo-' || need); end if;
  end loop;
  select count(*) into have from friendships where status = 'accepted' and (requester = uid or addressee = uid);
  if have >= 5 and private.give_title(uid, 'friend-5', 'achievement') then got := array_append(got, 'friend-5'); end if;
  if exists (select 1 from user_cards where user_id = uid and count >= 5)
     and private.give_title(uid, 'dup-5', 'achievement') then got := array_append(got, 'dup-5'); end if;
  -- 7 ngày liên tiếp (giờ VN) đều có ảnh check in
  if exists (select 1 from (select d, d - (row_number() over (order by d))::int as g
                              from (select distinct (taken_at at time zone 'Asia/Ho_Chi_Minh')::date as d from task_photos where owner_id = uid) x) y
              group by g having count(*) >= 7)
     and private.give_title(uid, 'photo-streak-7', 'achievement') then got := array_append(got, 'photo-streak-7'); end if;
  return got;
end $$;

create or replace function public.set_task_photo(tid uuid, p_path text, p_source text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); t tasks; p text[] := private.checkin_parts(p_path); old text; got text[];
begin
  select * into t from tasks where id = tid;
  if not found or t.owner_id <> u or not private.is_member(t.calendar_id, u) then raise exception 'FORBIDDEN'; end if;
  if p is null or p[1] <> t.calendar_id::text or p[2] <> t.id::text then raise exception 'INVALID_PATH'; end if;
  if p_source not in ('camera','upload') or (p_source = 'camera') <> (p[3] = 'cam') then raise exception 'INVALID_SOURCE'; end if;
  if p_source = 'upload' and not private.is_admin(u) then raise exception 'FORBIDDEN'; end if;
  if not exists (select 1 from storage.objects where bucket_id = 'checkins' and name = p_path) then raise exception 'FILE_NOT_FOUND'; end if;
  select path into old from task_photos where task_id = tid;
  insert into task_photos(task_id, owner_id, calendar_id, path, source, taken_at)
    values (tid, u, t.calendar_id, p_path, p_source, private.now())
    on conflict (task_id) do update set path = excluded.path, source = excluded.source, taken_at = excluded.taken_at;
  got := private.check_titles(u);
  return jsonb_build_object('path', p_path, 'old_path', case when old = p_path then null else old end, 'taken_at', private.now(), 'new_titles', to_jsonb(got));
end $$;

revoke execute on function public.set_task_photo(uuid, text, text) from public, anon;
grant execute on function public.set_task_photo(uuid, text, text) to authenticated;
