select t.now_is('2026-10-14 09:00+07');
-- Bạn bè, lịch, phân quyền đọc
do $$
declare cal uuid; inv uuid; fid uuid; n int; j jsonb; a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol'); d uuid := t.id('dave');
begin
  -- ===== RLS hồ sơ =====
  perform t.as_user(a);
  perform t.ok((select count(*) from profiles)=1, 'alice chỉ đọc được hồ sơ của mình qua bảng profiles');
  perform t.ok((select count(*) from people)=1, 'chưa là bạn thì không thấy ai trong view people');
  perform t.expect_err('permission denied', 'select * from app_config');
  perform t.expect_err('permission denied', 'insert into reward_grants(user_id,source,card_id,is_new) values (''11111111-1111-1111-1111-111111111111'',''admin'',''common-01'',true)');
  perform t.expect_err('permission denied', 'update profiles set is_admin = true');
  perform t.expect_err('permission denied', 'update profiles set rescue_bonus = 99');
  perform t.expect_err('permission denied', 'insert into user_cards(user_id,card_id,first_source) values (''11111111-1111-1111-1111-111111111111'',''supreme-01'',''x'')');
  perform t.expect_err('permission denied', 'insert into day_locks(user_id,day,reason) values (''11111111-1111-1111-1111-111111111111'',''2026-10-14'',''personal'')');
  perform t.expect_err('FORBIDDEN', 'select admin_send_mail(''x'',''y'',''[]'')');
  perform t.expect_err('permission denied', 'select private.streak(''11111111-1111-1111-1111-111111111111'')');
  -- tìm người lạ theo username chính xác
  j := find_user('BOB_0002');
  perform t.ok(j->>'display_name' = 'Bob', 'tìm đúng username (không phân biệt hoa thường)');
  perform t.ok(find_user('bob') is null, 'không tìm gần đúng');
  perform t.ok(not (j ? 'birthday'), 'find_user không lộ ngày sinh');

  -- ===== kết bạn =====
  fid := send_friend_request('bob_0002');
  perform t.expect_err('REQUEST_PENDING', 'select send_friend_request(''bob_0002'')');
  perform t.expect_err('CANNOT_ADD_SELF', 'select send_friend_request(''alice_01'')');
  perform t.expect_err('USER_NOT_FOUND', 'select send_friend_request(''nobody_xx'')');
  perform t.as_user(b);
  perform t.ok((select count(*) from notifications where kind='friend_request')=1, 'bob nhận thông báo lời mời');
  perform t.ok((select count(*) from people)=2, 'bob thấy alice (lời mời đang chờ) trong people');
  perform respond_friend(fid, true);
  perform t.as_user(a);
  perform t.ok(private.are_friends(a,b), 'đã là bạn');
  perform t.ok((select count(*) from user_titles where title_id='friend-first')=1, 'alice nhận danh hiệu kết bạn lần đầu');
  perform t.as_user(c);
  perform t.expect_err('NOT_FOUND', format('select respond_friend(%L, true)', fid));   -- người ngoài không chấp nhận hộ

  -- ===== lịch =====
  perform t.as_user(a);
  cal := create_calendar('Nhóm CORTIS');
  perform t.expect_err('NOT_FRIENDS', format('select invite_to_calendar(%L, %L)', cal, c));
  inv := invite_to_calendar(cal, b);
  perform t.expect_err('INVITE_PENDING', format('select invite_to_calendar(%L, %L)', cal, b));
  perform t.expect_err('FORBIDDEN', format('select rename_calendar(%L, ''x'')', (select calendar_id from calendar_members where user_id=b and left_on is null limit 1)));
  perform t.as_user(b);
  perform t.ok((select count(*) from calendars)=1, 'bob chưa vào lịch thì chưa thấy lịch của alice (chỉ có lịch riêng)');
  perform respond_invite(inv, true);
  perform t.ok((select count(*) from calendars)=2, 'bob thấy 2 lịch sau khi vào');
  perform t.ok((select count(*) from calendar_members where calendar_id=cal)=2, 'bob thấy thành viên của lịch');
  perform t.expect_err('NOT_FOUND', format('select respond_invite(%L, true)', inv));
  perform t.as_user(c);
  perform t.ok((select count(*) from calendars where id=cal)=0, 'carol không thấy lịch của người khác');
  perform t.ok((select count(*) from calendar_members where calendar_id=cal)=0, 'carol không thấy thành viên lịch khác');
  perform t.as_user(a);
  perform t.ok((select count(*) from people)=2, 'alice thấy bob và chính mình');
  perform t.ok((select count(*) from people where id=b and birthday is null)=1, 'ngày sinh người khác ẩn');
  -- ngày sinh: bật công khai
  perform t.as_user(a);
  perform update_profile('{"show_birthday": true}');
  perform t.as_user(b);
  perform t.ok((select birthday from people where id=a) = date '2000-03-05', 'bật hiện ngày sinh thì bạn thấy');
  perform t.as_user(a);
  perform update_profile('{"show_birthday": false}');
  perform t.as_user(b);
  perform t.ok((select birthday from people where id=a) is null, 'tắt thì ẩn lại');

  -- ===== giới hạn lịch =====
  perform t.as_user(a);
  perform create_calendar('L3'); perform create_calendar('L4');   -- a có: Việc riêng, Nhóm, L3, L4 = 4
  perform t.expect_err('CALENDAR_LIMIT', 'select create_calendar(''L5'')');
end $$;
