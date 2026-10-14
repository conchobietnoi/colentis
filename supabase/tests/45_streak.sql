-- Streak đứt, tick bù, thẻ cứu, danh hiệu, ngày lễ, rời lịch
select t.now_is('2026-10-17 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol');
  gal uuid; aj uuid; bj uuid; tk uuid; n int; r jsonb; j jsonb;
begin
  select id into gal from calendars where name = 'Nhóm CORTIS';
  select cm.calendar_id into aj from calendar_members cm join calendars x on x.id = cm.calendar_id where cm.user_id = a and x.name = 'Việc riêng';
  select cm.calendar_id into bj from calendar_members cm join calendars x on x.id = cm.calendar_id where cm.user_id = b and x.name = 'Việc riêng';

  -- ngày 17/10: cả hai có task nhưng không làm
  perform t.as_user(a); insert into tasks(calendar_id, day, title) values (aj, '2026-10-17', 'A17') returning id into tk;
  perform t.as_user(b); insert into tasks(calendar_id, day, title) values (bj, '2026-10-17', 'B17');
  perform t.as_super(); perform t.now_is('2026-10-18 09:00+07');

  -- ===== chuỗi đứt và tick bù =====
  perform t.as_user(a);
  j := me();
  perform t.ok((j->>'streak')::int = 0, 'ngày 17 có task mà không làm: chuỗi đứt');
  perform t.ok((j->'catchup_days') ? '2026-10-17', 'ngày 17 nằm trong danh sách có thể nối lại');
  perform t.expect_err('PAST_DAY', format('update tasks set title = ''đổi tên ngày cũ'', version = 1 where id = %L', tk));
  perform t.expect_err('PAST_DAY', format('delete from tasks where id = %L', tk));
  perform t.expect_err('PAST_DAY', $q$insert into tasks(calendar_id, day, title) values ((select id from calendars where name='Nhóm CORTIS'), '2026-10-17', 'tạo mới ngày cũ để lấy thưởng')$q$);
  update tasks set done = true, version = 1 where id = tk;     -- tick bù trong 48 giờ
  perform t.ok((me()->>'streak')::int = 4, 'tick bù nối lại chuỗi: 14,15,16,17 = 4');
  perform t.ok((me()->'catchup_days') = '[]'::jsonb, 'không còn ngày cần nối');
  r := claim_day('2026-10-17');
  perform t.ok(r->'grants'->0->>'source' = 'personal', 'tick bù đủ điều kiện thì nhận thẻ cá nhân');

  -- ===== thẻ cứu (bob) =====
  perform t.as_user(b);
  perform t.expect_err('DAY_LOCKED', 'select use_rescue(''2026-10-16'')');     -- ngày đã nhận thưởng thì không tiêu thẻ cứu
  perform t.expect_err('INVALID_DAY', 'select use_rescue(''2026-10-18'')');    -- hôm nay
  r := use_rescue('2026-10-17');
  perform t.ok(r->'grants'->0->>'source' = 'rescue' and r->>'source' = 'monthly', 'dùng thẻ cứu tháng, nhận thẻ cá nhân');
  perform t.ok((me()->>'streak')::int = 4, 'ngày được cứu tính vào chuỗi');
  perform t.ok((me()->>'rescue_monthly_left')::int = 4, 'còn 4 thẻ cứu tháng');
  perform t.expect_err('DAY_LOCKED', 'select use_rescue(''2026-10-17'')');
  perform t.expect_err('DAY_LOCKED', format('update tasks set done = true, version = 1 where owner_id = %L and day = ''2026-10-17''', b));
  perform t.as_super();
  perform t.ok(not exists (select 1 from task_completions where user_id = b and vn_day = '2026-10-18' ) , 'thẻ cứu không đánh dấu task đã làm');
  perform t.ok((select count(*) from task_completions where user_id = b) = 2, 'thẻ cứu không cộng vào tổng task (bob chỉ có B1 và B2)');

  -- hết thẻ tháng: giả lập đã dùng 4 thẻ khác trong tháng
  insert into rescue_uses(user_id, day, source) values (b,'2026-10-02','monthly'),(b,'2026-10-03','monthly'),(b,'2026-10-04','monthly'),(b,'2026-10-05','monthly');
  -- tạo task cho ngày 18 và 19 khi hai ngày đó còn là hôm nay, rồi không làm
  perform t.now_is('2026-10-18 12:00+07');
  perform t.as_user(b); insert into tasks(calendar_id, day, title) values (bj, '2026-10-18', 'B18 quá hạn');
  perform t.now_is('2026-10-19 12:00+07');
  insert into tasks(calendar_id, day, title) values (bj, '2026-10-19', 'B19 quên làm');
  perform t.now_is('2026-10-20 09:00+07');
  perform t.as_super(); update profiles set rescue_bonus = 0 where id = b; perform t.as_user(b);
  perform t.expect_err('NO_RESCUE_LEFT', 'select use_rescue(''2026-10-19'')');
  perform t.as_super(); update profiles set rescue_bonus = 1 where id = b;
  perform t.as_user(b);
  r := use_rescue('2026-10-19');
  perform t.ok(r->>'source' = 'bonus' and (select rescue_bonus from profiles where id = b) = 0, 'hết thẻ tháng thì dùng thẻ quà (tách riêng)');
  perform t.now_is('2026-10-21 10:00+07');
  perform t.as_user(b);
  perform t.expect_err('RESCUE_EXPIRED', 'select use_rescue(''2026-10-18'')');

  -- ===== danh hiệu: giờ đêm và số task =====
  perform t.as_super(); perform t.now_is('2026-10-25 02:30+07');
  perform t.as_user(a);
  insert into tasks(calendar_id, day, title, done) select aj, '2026-10-25', 'đêm ' || g, true from generate_series(1, 6) g;
  r := claim_day('2026-10-25');
  perform t.ok(r->'new_titles' ? 'hidden-night', 'task làm lúc 0-4h sáng: danh hiệu giờ đêm');
  perform t.ok(r->'new_titles' ? 'tasks-10', 'đủ 10 task: danh hiệu (A1,A2r,A2g,A17 + 6 = 10)');
  perform t.ok(not (r->'new_titles' ? 'tasks-100'), 'chưa đủ 100');
  perform t.as_super(); r := (select to_jsonb(private.check_titles(a))); perform t.as_user(a);
  perform t.ok(r = '[]'::jsonb, 'xét lại không cấp trùng danh hiệu');

  -- đủ bộ Thường (bob): thêm thẻ sau không thu hồi danh hiệu
  perform t.as_super();
  insert into user_cards(user_id, card_id, first_source) select b, id, 'admin' from cards where rarity = 'common' on conflict do nothing;
  perform t.ok('collection-common' = any (private.check_titles(b)), 'đủ ảnh Thường nhận danh hiệu');
  insert into cards(id, rarity, name, storage_path) values ('common-99', 'common', 'Thường mới', 'common/common-99.webp');
  perform t.ok((select count(*) from user_titles where user_id = b and title_id = 'collection-common') = 1, 'thêm thẻ mới không thu hồi danh hiệu');
  delete from cards where id = 'common-99';

  -- ===== ngày lễ, Tết, sinh nhật (theo ngày giờ hoàn thành thực tế) =====
  perform t.now_is('2026-12-25 11:00+07');
  perform t.as_user(a); insert into tasks(calendar_id, day, title, done) values (aj, '2026-12-25', 'Noel', true);
  perform t.now_is('2027-02-06 11:00+07'); insert into tasks(calendar_id, day, title, done) values (aj, '2027-02-06', 'Tết', true);
  perform t.now_is('2027-03-05 11:00+07'); insert into tasks(calendar_id, day, title, done) values (aj, '2027-03-05', 'Sinh nhật', true);
  r := claim_day('2027-03-05');
  perform t.ok(r->'new_titles' ? 'birthday', 'task ngày sinh nhật (05/03)');
  perform t.as_super();
  perform t.ok(exists (select 1 from user_titles where user_id = a and title_id = 'holiday-xmas'), 'danh hiệu 25/12');
  perform t.ok(exists (select 1 from user_titles where user_id = a and title_id = 'holiday-tet'), 'danh hiệu mùng 1 Tết');

  -- ===== rời lịch, xóa lịch =====
  perform t.now_is('2027-03-06 10:00+07');
  perform t.as_user(b); insert into tasks(calendar_id, day, title) values (gal, '2027-03-10', 'B trong nhóm');
  perform t.as_user(a);
  perform t.ok((select count(*) from tasks where owner_id = b and calendar_id = gal) > 0, 'alice thấy task của bob');
  perform t.expect_err('OWNER_MUST_TRANSFER', format('select leave_calendar(%L)', gal));
  perform t.as_user(c);
  perform t.expect_err('KEEP_ONE_CALENDAR', format('select leave_calendar(%L)', (select calendar_id from calendar_members where user_id = c and left_on is null limit 1)));
  perform t.expect_err('KEEP_ONE_CALENDAR', format('select delete_calendar(%L, ''Việc riêng'')', (select calendar_id from calendar_members where user_id = c and left_on is null limit 1)));
  perform t.as_user(b);
  perform t.expect_err('FORBIDDEN', format('select remove_member(%L, %L)', gal, a));
  perform leave_calendar(gal);
  perform t.ok((select count(*) from calendars where id = gal) = 0, 'bob không còn thấy lịch đã rời');
  perform t.ok((select count(*) from tasks where calendar_id = gal) = 0, 'bob không còn thấy task lịch đã rời');
  perform t.as_user(a);
  perform t.ok((select count(*) from tasks where owner_id = b and calendar_id = gal) = 0, 'task của bob biến mất khỏi lịch chung (không chuyển cho ai)');
  perform t.as_super();
  perform t.ok((select count(*) from reward_grants where user_id = b and source = 'group') = 2, 'thưởng nhóm đã nhận vẫn giữ');
  perform t.ok((select total from private.day_counts(b, '2027-03-10')) = 0, 'task lịch đã rời không tính vào thưởng/streak');
  perform t.ok(not private.group_eligible(gal, '2027-03-05'), 'còn một người thì lịch không cấp thưởng nhóm');
  -- chuyển chủ, xóa lịch
  perform t.as_user(a);
  perform t.expect_err('NAME_MISMATCH', format('select delete_calendar(%L, ''sai tên'')', gal));
  perform t.expect_err('NOT_MEMBER', format('select transfer_owner(%L, %L)', gal, b));
  perform delete_calendar(gal, 'Nhóm CORTIS');
  perform t.as_super();
  perform t.ok((select count(*) from reward_grants where user_id = a and source = 'group') = 2, 'xóa lịch không thu hồi thẻ đã nhận');
end $$;
