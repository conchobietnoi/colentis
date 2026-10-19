-- Mùa Concept: nhiệm vụ hằng ngày do server xác minh (015)
create or replace function t.mk_done(own uuid, cal uuid, d date, ttl text, lbl text, ts text) returns void
language plpgsql as $$
begin
  perform t.now_is(ts);
  insert into tasks(owner_id, calendar_id, day, title, label, done) values (own, cal, d, ttl, lbl, true);
end $$;
select t.now_is('2026-10-18 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); r jsonb; cal uuid; sh uuid;
begin
  perform t.as_super();
  delete from concept_ticks where user_id = a; delete from concept_packs where user_id = a;
  perform set_config('session_replication_role', 'replica', true); delete from day_locks where user_id = a; delete from tasks where owner_id = a; delete from task_completions where user_id = a; perform set_config('session_replication_role', 'origin', true);
  insert into friendships(requester, addressee, status) values (a, b, 'accepted') on conflict do nothing;
  select id into cal from calendars where owner_id = a order by created_at limit 1;
  perform t.as_user(a);
  r := public.concept_state();
  raise notice 'STATE %', r;
  perform t.ok((r->'task'->>'need')::int = 1 and (r->'task'->>'have')::int = 0, 'ngày 1 cần 1, chưa có');
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  -- ngày 1: xong 1 việc bất kỳ trong hôm nay (kể cả buổi tối)
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-18', 'Việc tối', null, '2026-10-18 19:30+07'); perform t.now_is('2026-10-18 20:00+07'); perform t.as_user(a);
  perform t.ok((public.concept_state()->'task'->>'have')::int = 1, 'ngày 1 đã đủ');
  r := concept_tick();
  perform t.ok(jsonb_array_length(r->'packs') = 2, 'đủ điều kiện → 2 pack');
  perform t.expect_err('ALREADY_DONE', 'select concept_tick()');
  -- ngày 2 (19/10): nhãn Việc nhà
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-19', 'Rửa chén', 'Cá nhân', '2026-10-19 11:00+07'); perform t.as_user(a);
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-19', 'Lau nhà', 'Việc nhà', '2026-10-19 11:30+07'); perform t.as_user(a);
  perform concept_tick();
  -- ngày 3 (20/10): hôm nay tạo 1 việc cho ngày mai
  perform t.now_is('2026-10-20 12:00+07');
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super();
  perform t.now_is('2026-10-19 10:00+07');
  insert into tasks(owner_id, calendar_id, day, title) values (a, cal, '2026-10-21', 'Tạo từ hôm trước');
  perform t.now_is('2026-10-20 10:00+07');
  insert into tasks(owner_id, calendar_id, day, title) values (a, cal, '2026-10-22', 'Việc xa');
  perform t.now_is('2026-10-20 12:00+07');
  perform t.as_user(a);
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super();
  perform t.now_is('2026-10-20 11:00+07');
  insert into tasks(owner_id, calendar_id, day, title) values (a, cal, '2026-10-21', 'Việc ngày mai');
  perform t.now_is('2026-10-20 12:00+07');
  perform t.as_user(a);
  perform concept_tick();
  -- ngày 4 (21/10): nhãn Cho người khác
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-21', 'Giúp mẹ', 'Cho người khác', '2026-10-21 08:00+07'); perform t.as_user(a);
  perform concept_tick();
  -- ngày 5 (22/10): gắn giờ (tạo hoặc sửa hôm nay)
  perform t.now_is('2026-10-22 12:00+07');
  perform t.as_super();
  perform t.now_is('2026-10-21 09:00+07');
  insert into tasks(owner_id, calendar_id, day, title, all_day, start_time) values (a, cal, '2026-10-22', 'Họp cũ', false, '10:00');
  perform t.now_is('2026-10-22 12:00+07');
  perform t.as_user(a);
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super();
  perform t.now_is('2026-10-22 09:00+07');
  update tasks set start_time = '11:00' where title = 'Họp cũ' and owner_id = a;
  perform t.now_is('2026-10-22 12:00+07');
  perform t.as_user(a);
  perform concept_tick();
  -- ngày 6 (23/10): sau 21 giờ
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-23', 'Tối', null, '2026-10-23 20:30+07'); perform t.now_is('2026-10-23 21:30+07'); perform t.as_user(a);
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-23', 'Khuya', null, '2026-10-23 21:10+07'); perform t.now_is('2026-10-23 21:30+07'); perform t.as_user(a);
  perform concept_tick();
  -- ngày 8 (25/10): 3 việc trong hôm nay
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-25', 'V1', null, '2026-10-25 10:00+07'); perform t.mk_done(a, cal, '2026-10-25', 'V2', null, '2026-10-25 10:05+07'); perform t.now_is('2026-10-25 18:00+07'); perform t.as_user(a);
  r := public.concept_state();
  perform t.ok((r->'task'->>'need')::int = 3 and (r->'task'->>'have')::int = 2, 'ngày 8: 2/3');
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-25', 'V3', null, '2026-10-25 11:00+07'); perform t.now_is('2026-10-25 18:00+07'); perform t.as_user(a);
  perform concept_tick();
  -- ngày 9 (26/10): việc ở lịch chung (từ 2 thành viên)
  perform t.as_super(); perform t.mk_done(a, cal, '2026-10-26', 'Việc riêng', null, '2026-10-26 10:00+07'); perform t.now_is('2026-10-26 12:00+07'); perform t.as_user(a);
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super();
  insert into calendars(owner_id, name) values (a, 'Chung') returning id into sh;
  insert into calendar_members(calendar_id, user_id, joined_on) values (sh, a, '2026-10-01'), (sh, b, '2026-10-01') on conflict do nothing;
  perform t.mk_done(a, sh, '2026-10-26', 'Việc chung', null, '2026-10-26 11:00+07'); perform t.now_is('2026-10-26 12:00+07'); perform t.as_user(a);
  perform concept_tick();
  perform t.ok((select count(*) from concept_ticks where user_id = a) = 8, 'đã ghi 8 ngày nhiệm vụ');
end $$;
