-- POLA DAY (027): rửa pola khi việc trên lịch đã xong, sticker, 40/40 → danh hiệu + 4 gói
select t.now_is('2026-11-03 10:00+07');
do $$
declare c uuid := t.id('carol'); r jsonb; cal uuid; it record; n int; p2 text;
begin
  perform t.as_super();
  perform set_config('session_replication_role', 'replica', true); delete from tasks where owner_id = c; delete from task_completions where user_id = c; perform set_config('session_replication_role', 'origin', true);
  select id into cal from calendars where owner_id = c order by created_at limit 1;
  select id into p2 from pola_items where day = 1 and slot = 2;
  perform t.as_user(c);
  r := public.pola_state();
  perform t.ok(jsonb_array_length(r->'items') = 40 and not (r->'items'->0->>'open')::boolean, 'trước 4/11: 40 tấm, chưa mở');
  perform t.ok(r->'items'->0->>'id' is null, 'tấm chưa rửa không lộ id/thành viên');
  perform t.expect_err('POLA_LOCKED', 'select pola_develop(1,1)');
  perform t.now_is('2026-11-04 10:00+07');
  perform t.expect_err('POLA_TASK_NOT_DONE', 'select pola_develop(1,1)');
  perform t.as_super(); perform t.mk_done(c, cal, '2026-11-04', 'Việc 1', null, '2026-11-04 10:30+07'); perform t.now_is('2026-11-04 11:00+07'); perform t.as_user(c);
  perform t.ok((public.pola_state()->'items'->0->>'done')::boolean, 'xong 1 việc → tấm 1 rửa được');
  r := pola_develop(1,1);
  perform t.ok(r->>'member' is not null and (r->>'total')::int = 1, 'rửa tấm 1: biết thành viên');
  perform t.expect_err('POLA_ALREADY', 'select pola_develop(1,1)');
  perform t.ok(private.can_read_pola((r->>'id') || '.webp'), 'đọc được ảnh tấm đã rửa');
  perform t.ok(not private.can_read_pola(p2 || '.webp'), 'không đọc được tấm chưa rửa');
  -- rửa hết bằng quyền super (giả lập), còn tấm cuối qua RPC để nhận thưởng
  perform t.as_super();
  insert into user_pola(user_id, pola_id) select c, id from pola_items where not (day = 5 and slot = 8) on conflict do nothing;
  perform t.now_is('2026-11-08 20:00+07');
  for n in 1..6 loop perform t.mk_done(c, cal, '2026-11-08', 'Cuối ' || n, null, '2026-11-08 19:0' || n || '+07'); end loop;
  perform t.now_is('2026-11-08 21:00+07'); perform t.as_user(c);
  r := pola_develop(5,8);
  perform t.ok((r->>'sticker')::boolean and (r->>'total')::int = 40, 'đủ 8 tấm ngày 5 → sticker, tổng 40');
  perform t.ok(jsonb_array_length(r->'final'->'grants') = 20, 'đủ 40 → 4 gói 20 thẻ');
  perform t.ok(exists (select 1 from user_titles where user_id = c and title_id = 'pola-day'), 'nhận danh hiệu pola-day');
  perform t.now_is('2026-11-09 09:00+07');
  perform t.expect_err('POLA_ENDED', 'select pola_develop(1,2)');
end $$;
