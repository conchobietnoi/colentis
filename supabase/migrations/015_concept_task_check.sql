-- Colentis · 015 · Mùa Concept: nhiệm vụ hằng ngày phải làm thật, server tự xác minh trước khi phát 2 pack.
-- Điều kiện theo bản thiết kế AppBuild (giờ Việt Nam, tính trong ngày hôm nay):
--  1 Rạng Sáng: tick xong 1 việc trước 9 giờ · 2 và 7 Việc nhà: xong 1 việc nhãn 'Việc nhà' · 3 Khởi Động Tuần: tạo hôm nay 1 việc cho ngày mai
--  4 Gửi Yêu Thương: xong 1 việc nhãn 'Cho người khác' · 5 Xếp Hình Giờ Giấc: gắn giờ cho 1 việc (tạo hoặc sửa hôm nay)
--  6 Cú Đêm: xong 1 việc sau 21 giờ · 8 Chốt Sổ: xong 3 việc trong hôm nay · 9 Cả Nhà Cùng Làm: xong 1 việc ở lịch chung (từ 2 thành viên)

create or replace function private.concept_task_need(d int) returns int
language sql immutable as $$ select case when d = 8 then 3 else 1 end $$;

create or replace function private.concept_task_have(uid uuid, d int) returns int
language plpgsql stable security definer set search_path = public as
$$
declare tdy date := private.today(); n int := 0;
begin
  if d = 1 then
    select count(*) into n from task_completions where user_id = uid and vn_day = tdy and vn_hour < 9;
  elsif d = 6 then
    select count(*) into n from task_completions where user_id = uid and vn_day = tdy and vn_hour >= 21;
  elsif d = 8 then
    select count(*) into n from task_completions where user_id = uid and vn_day = tdy;
  elsif d in (2, 7) then
    select count(*) into n from task_completions c join tasks t on t.id = c.task_id
     where c.user_id = uid and c.vn_day = tdy and t.label = 'Việc nhà';
  elsif d = 4 then
    select count(*) into n from task_completions c join tasks t on t.id = c.task_id
     where c.user_id = uid and c.vn_day = tdy and t.label = 'Cho người khác';
  elsif d = 9 then
    select count(*) into n from task_completions c join tasks t on t.id = c.task_id
     where c.user_id = uid and c.vn_day = tdy
       and (select count(*) from calendar_members cm where cm.calendar_id = t.calendar_id and cm.left_on is null) >= 2;
  elsif d = 3 then
    select count(*) into n from tasks
     where owner_id = uid and day = tdy + 1 and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = tdy;
  elsif d = 5 then
    select count(*) into n from tasks
     where owner_id = uid and not all_day and (updated_at at time zone 'Asia/Ho_Chi_Minh')::date = tdy;
  end if;
  return n;
end $$;

create or replace function public.concept_state() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  return jsonb_build_object(
    'day', private.concept_day(),
    'task', (select case when d is null then null else jsonb_build_object('need', private.concept_task_need(d), 'have', least(private.concept_task_have(u, d), private.concept_task_need(d))) end from (select private.concept_day() d) x),
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

create or replace function public.concept_tick() returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); d int := private.concept_day(); c int; ins int;
begin
  if d is null then raise exception 'OUT_OF_EVENT'; end if;
  if exists (select 1 from concept_ticks where user_id = u and day_no = d) then raise exception 'ALREADY_DONE'; end if;
  if private.concept_task_have(u, d) < private.concept_task_need(d) then raise exception 'TASK_NOT_MET'; end if;
  insert into concept_ticks(user_id, day_no, done_at) values (u, d, private.now()) on conflict do nothing;
  get diagnostics ins = row_count;
  if ins = 0 then raise exception 'ALREADY_DONE'; end if;
  select concept into c from event_days where event_id = private.concept_eid() and day_no = d;
  insert into concept_packs(user_id, con, kind, src) values (u, c, 'daily', 'task:' || d || ':1'), (u, c, 'daily', 'task:' || d || ':2');
  return public.concept_state();
end $$;

revoke execute on function private.concept_task_need(int), private.concept_task_have(uuid, int) from public, anon;
revoke execute on function public.concept_state(), public.concept_tick() from public, anon;
grant execute on function public.concept_state(), public.concept_tick() to authenticated;
