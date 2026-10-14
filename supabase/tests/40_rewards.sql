-- Task, khóa ngày, thưởng cá nhân/nhóm, ngày trống
select t.now_is('2026-10-14 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol');
  gal uuid; aj uuid; bj uuid; tk uuid; tk2 uuid; n int; r jsonb; r2 jsonb; ca text; cb text;
begin
  select id into gal from calendars where name = 'Nhóm CORTIS';
  select cm.calendar_id into aj from calendar_members cm join calendars x on x.id = cm.calendar_id where cm.user_id = a and x.name = 'Việc riêng';
  select cm.calendar_id into bj from calendar_members cm join calendars x on x.id = cm.calendar_id where cm.user_id = b and x.name = 'Việc riêng';

  -- ===== Ngày 1 (14/10): quyền task =====
  perform t.as_user(a);
  insert into tasks(calendar_id, day, title, op_id) values (gal, '2026-10-14', 'A1', '00000000-0000-0000-0000-0000000000a1') returning id into tk;
  perform t.expect_err('tasks_op_id_key', $q$insert into tasks(calendar_id, day, title, op_id) values ((select id from calendars where name='Nhóm CORTIS'), '2026-10-14', 'A1 lặp', '00000000-0000-0000-0000-0000000000a1')$q$);
  perform t.as_user(b);
  perform t.ok((select count(*) from tasks where id = tk) = 1, 'bob thấy task của alice trong lịch chung');
  update tasks set title = 'hack' where id = tk; get diagnostics n = row_count;
  perform t.ok(n = 0, 'bob không sửa được task của alice');
  update tasks set done = true where id = tk; get diagnostics n = row_count;
  perform t.ok(n = 0, 'bob không tick hộ alice');
  delete from tasks where id = tk; get diagnostics n = row_count;
  perform t.ok(n = 0, 'bob không xóa được task của alice');
  perform t.expect_err('FORBIDDEN', format('insert into tasks(owner_id, calendar_id, day, title) values (%L, %L, ''2026-10-14'', ''giả mạo'')', a, gal));
  insert into tasks(calendar_id, day, title) values (gal, '2026-10-14', 'B1') returning id into tk2;
  perform t.as_user(a);
  update tasks set title = 'chủ lịch sửa' where id = tk2; get diagnostics n = row_count;
  perform t.ok(n = 0, 'chủ lịch không sửa được task của thành viên');
  delete from tasks where id = tk2; get diagnostics n = row_count;
  perform t.ok(n = 0, 'chủ lịch không xóa được task của thành viên');
  perform t.as_user(c);
  perform t.ok((select count(*) from tasks) = 0, 'carol không thấy task lịch khác');
  perform t.expect_err('row-level security', format('insert into tasks(calendar_id, day, title) values (%L, ''2026-10-14'', ''lén'')', gal));

  -- phiên bản và ngày
  perform t.as_user(a);
  perform t.expect_err('VERSION_CONFLICT', format('update tasks set done = true, version = 5 where id = %L', tk));
  perform t.expect_err('PAST_DAY', $q$insert into tasks(calendar_id, day, title) values ((select id from calendars where name='Nhóm CORTIS'), '2026-10-13', 'quá khứ')$q$);
  perform t.expect_err('NOTHING_TO_CLAIM', 'select claim_day(''2026-10-14'')');
  perform t.expect_err('FUTURE_DAY', 'select claim_day(''2026-10-15'')');
  update tasks set done = true, version = 1 where id = tk;
  perform t.ok((select version from tasks where id = tk) = 2, 'version tăng sau khi sửa');
  perform t.as_super();
  perform t.ok((select count(*) from task_completions) = 1, 'ghi nhận hoàn thành lần đầu');
  perform t.as_user(a);
  update tasks set done = false, version = 2 where id = tk;
  update tasks set done = true, version = 3 where id = tk;
  perform t.as_super();
  perform t.ok((select count(*) from task_completions) = 1, 'bỏ tick rồi tick lại không đếm thêm');
  perform t.as_user(a);

  -- nhận thẻ cá nhân, khóa ngày
  r := claim_day('2026-10-14');
  perform t.ok(jsonb_array_length(r->'grants') = 1 and r->'grants'->0->>'source' = 'personal', 'ngày 1: 1 thẻ cá nhân, chưa có thẻ nhóm (người mới xét từ hôm sau)');
  perform t.ok(r->'grants'->0->>'is_new' = 'true', 'thẻ mới');
  perform t.expect_err('DAY_LOCKED', format('update tasks set title = ''sửa sau khóa'', version = 3 where id = %L', tk));
  perform t.expect_err('DAY_LOCKED', format('update tasks set done = false, version = 3 where id = %L', tk));
  perform t.expect_err('DAY_LOCKED', format('delete from tasks where id = %L', tk));
  perform t.expect_err('DAY_LOCKED', format('insert into tasks(calendar_id, day, title) values (%L, ''2026-10-14'', ''thêm sau khóa'')', aj));
  perform t.expect_err('NOTHING_TO_CLAIM', 'select claim_day(''2026-10-14'')');
  perform t.ok((select count(*) from reward_grants where user_id = a and day = '2026-10-14') = 1, 'không nhận trùng');
  -- bob vẫn làm được task của mình (khóa theo người)
  perform t.as_user(b);
  update tasks set done = true where id = tk2;

  -- ===== Ngày 2 (15/10): thưởng nhóm =====
  perform t.as_super(); perform t.now_is('2026-10-15 10:00+07');
  perform t.as_user(a);
  perform t.ok((me()->>'streak')::int = 1, 'streak = 1 sau ngày 1');
  insert into tasks(calendar_id, day, title, done) values (aj, '2026-10-15', 'A2r', true), (gal, '2026-10-15', 'A2g', true);
  r := claim_day('2026-10-15');
  perform t.ok(jsonb_array_length(r->'grants') = 1 and r->'grants'->0->>'source' = 'personal', 'bob chưa xong nên alice chỉ có thẻ cá nhân');
  perform t.as_user(b);
  insert into tasks(calendar_id, day, title) values (gal, '2026-10-15', 'B2');
  perform t.expect_err('NOTHING_TO_CLAIM', 'select claim_day(''2026-10-15'')');
  update tasks set done = true where owner_id = b and day = '2026-10-15';
  r2 := claim_day('2026-10-15');
  perform t.ok(jsonb_array_length(r2->'grants') = 2, 'bob nhận thẻ cá nhân và thẻ nhóm');
  select x->>'card_id' into cb from jsonb_array_elements(r2->'grants') x where x->>'source' = 'group';
  perform t.as_user(a);
  r := claim_day('2026-10-15');
  perform t.ok(jsonb_array_length(r->'grants') = 1 and r->'grants'->0->>'source' = 'group', 'alice nhận thẻ nhóm sau khi bob xong (vẫn khóa ngày của alice)');
  perform t.ok(r->'grants'->0->>'card_id' = cb, 'cả nhóm nhận cùng một thẻ');
  perform t.as_super();
  perform t.ok((select count(*) from group_rolls) = 1, 'chỉ một lần quay nhóm cho ngày này');
  perform t.ok((select count(*) from reward_grants where user_id = a) = 3, 'alice có 3 lượt thưởng');
  perform t.ok(exists (select 1 from user_titles where user_id = a and title_id = 'group-day-first'), 'danh hiệu thẻ nhóm lần đầu');

  -- ===== Ngày 3 (16/10): ngày trống =====
  perform t.now_is('2026-10-16 10:00+07');
  perform t.as_user(a);
  perform t.expect_err('NOTHING_TO_CLAIM', 'select claim_day(''2026-10-16'')');   -- ngày trống chỉ chốt sau khi kết thúc
  perform t.now_is('2026-10-17 10:00+07');
  r := claim_day('2026-10-16');
  perform t.ok(jsonb_array_length(r->'grants') = 1 and r->'grants'->0->>'source' = 'group', 'ngày trống cả nhóm: có thẻ nhóm, không có thẻ cá nhân');
  perform t.ok(r->'new_titles' ? 'streak-3', 'streak 3 (ngày trống vẫn tính chuỗi)');
  perform t.ok((me()->>'streak')::int = 3, 'streak = 3');
  perform t.as_user(b);
  r2 := claim_day('2026-10-16');
  perform t.ok(r2->'grants'->0->>'card_id' = r->'grants'->0->>'card_id', 'cùng thẻ nhóm ngày trống');
end $$;
