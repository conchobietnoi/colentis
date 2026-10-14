select t.now_is('2026-10-14 09:00+07');
-- Hòm thư, quà Tân binh, sự kiện sinh nhật James, admin (đang ở 14/10/2026 09:00)
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol'); r jsonb; r2 jsonb; mid uuid; n1 int; n2 int; ids text[]; ev uuid;
begin
  select id into ev from mails where kind='event';
  -- ===== Quà Tân binh =====
  perform t.as_user(c);
  select mail_id into mid from mail_recipients where user_id = c and mail_id in (select id from mails where kind='welcome');
  perform t.expect_err('CHOOSE_MEMBER_FIRST', format('select claim_mail(%L)', mid));
  perform t.expect_err('INVALID_MEMBER', 'select choose_welcome_member(''hacker'')');
  perform choose_welcome_member('james');
  perform t.expect_err('ALREADY_CHOSEN', 'select choose_welcome_member(''martin'')');
  r := claim_mail(mid);
  perform t.ok(jsonb_array_length(r->'grants') = 5, 'quà Tân binh có 5 thẻ');
  perform t.ok((select count(distinct x->>'card_id') from jsonb_array_elements(r->'grants') x) = 5, '5 thẻ không trùng trong gói');
  perform t.ok(exists (select 1 from jsonb_array_elements(r->'grants') x where x->>'rarity' <> 'common'), 'có ít nhất 1 thẻ từ Hiếm trở lên');
  perform t.ok((r->>'rescue_added')::int = 2, '2 thẻ cứu');
  perform t.ok(r->'new_titles' ? 'welcome-5', 'nhận danh hiệu welcome-5 (James)');
  perform t.ok((select equipped_title from profiles where id = c) = 'welcome-5', 'tự đeo danh hiệu');
  perform t.ok((select rescue_bonus from profiles where id = c) = 2, 'kho thẻ cứu +2');
  select count(*) into n1 from user_cards where user_id = c;
  r2 := claim_mail(mid);
  select count(*) into n2 from user_cards where user_id = c;
  perform t.ok(r = r2 and n1 = n2 and (select rescue_bonus from profiles where id = c) = 2, 'nhận lại không cấp thêm, trả đúng kết quả cũ');
  perform t.ok((select sum(count) from user_cards where user_id = c) = 5, 'đúng 5 lượt thẻ');
  perform t.expect_err('ALREADY_CLAIMED', 'select choose_welcome_member(''martin'')');
  -- không nhận được thư của người khác
  perform t.as_user(a);
  perform t.expect_err('NOT_FOUND', format('select claim_mail(%L)', mid));

  -- ===== Sự kiện sinh nhật James (đúng ngày 14/10) =====
  perform t.as_user(c);
  perform t.ok(ensure_login_events() = 1, 'đăng nhập ngày 14/10 nhận thư sự kiện');
  perform t.ok(ensure_login_events() = 0, 'gọi lại không tạo trùng');
  r := claim_mail(ev);
  perform t.ok(jsonb_array_length(r->'grants') = 2, 'sự kiện cho 2 thẻ');
  perform t.ok((select count(distinct x->>'card_id') from jsonb_array_elements(r->'grants') x) = 2, '2 thẻ sự kiện khác nhau');
  perform t.ok((select bool_and(c2.rarity = 'event' and c2.event_id = 'birthday-james-2026') from jsonb_array_elements(r->'grants') x join cards c2 on c2.id = x->>'card_id'), 'đều là thẻ sự kiện');
  perform t.ok(r->'new_titles' ? 'birthday-james', 'nhận khung sinh nhật James');
  r2 := claim_mail(ev);
  perform t.ok(r = r2 and (select count(*) from reward_grants where user_id=c and source='event') = 2, 'chỉ nhận một lần');
  -- thư sự kiện không đếm vào hạn mức ngày và không khóa ngày
  perform t.ok(not exists (select 1 from day_locks where user_id = c), 'nhận quà không khóa ngày');

  -- phân bố AURA: ~15% người nhận AURA
  perform t.as_super();
  select count(*) into n1 from (
    select private.draw_weighted_event(c, (select e from events e where id='birthday-james-2026'), 2) as p from generate_series(1, 4000)) s
    where 'event-birthday-james-AURA' = any (p);
  perform t.ok(n1 between 4000*0.12 and 4000*0.18, format('xác suất AURA ~15%% (đo %s/4000)', n1));

  -- ===== Admin =====
  perform t.as_user(b);
  perform t.expect_err('FORBIDDEN', 'select admin_send_mail(''Tin'',''nd'',''[]'')');
  perform t.expect_err('permission denied', 'update profiles set is_admin = true where id = ''22222222-2222-2222-2222-222222222222''');
  perform update_profile('{"is_admin": true}');
  perform t.ok(not (me()->'profile'->>'is_admin')::boolean, 'không tự thăng admin qua update_profile');
  perform t.as_super();
  update profiles set is_admin = true where id = a;
  perform t.as_user(a);
  perform t.expect_err('UNKNOWN_USERNAMES', 'select admin_send_mail(''Tin'',''nd'',''[]'',array[''bob_0002'',''khong_co''])');
  perform t.expect_err('INVALID_GIFT', 'select admin_send_mail(''Tin'',''nd'',''[{"type":"rescue","qty":9}]'')');
  perform t.expect_err('INVALID_GIFT', 'select admin_send_mail(''Tin'',''nd'',''[{"type":"shell","cmd":"rm -rf"}]'')');
  perform t.expect_err('TOO_MANY_GIFTS', 'select admin_send_mail(''Tin'',''nd'',''[{"type":"rescue","qty":1},{"type":"rescue","qty":1},{"type":"rescue","qty":1},{"type":"rescue","qty":1},{"type":"rescue","qty":1}]'')');
  r := admin_send_mail('Quà cảm ơn', 'Cảm ơn bạn', '[{"type":"rescue","qty":2},{"type":"card","rarity":"rare"},{"type":"title","id":"streak-3"}]', array['bob_0002']);
  perform t.ok((r->>'recipients')::int = 1, 'gửi cho 1 người');
  r := admin_send_mail('Hẹn giờ', 'Gửi sau', '[{"type":"rescue","qty":1}]', array['bob_0002'], timestamptz '2026-10-14 18:00+07');
  perform t.as_user(b);
  perform t.ok((select count(*) from mails where kind='admin') = 1, 'bob chỉ thấy thư đã đến giờ');
  select mail_id into mid from mail_recipients where user_id = b and mail_id in (select id from mails where title = 'Hẹn giờ');
  perform t.ok(mid is null, 'thư hẹn giờ chưa hiện');
  select m.id into mid from mails m where m.title = 'Quà cảm ơn';
  r := claim_mail(mid);
  perform t.ok((r->>'rescue_added')::int = 2 and jsonb_array_length(r->'grants') = 1 and r->'new_titles' ? 'streak-3', 'quà admin: thẻ cứu, thẻ Hiếm, danh hiệu');
  perform t.ok((select count(*) from user_cards uc join cards cc on cc.id=uc.card_id where uc.user_id=b and cc.rarity='rare') = 1, 'thẻ Hiếm vào album');
  perform t.ok(claim_mail(mid) = r, 'quà admin nhận đúng một lần');
  -- đến giờ hẹn thì thấy
  perform t.now_is('2026-10-14 18:30+07');
  perform t.ok((select count(*) from mails where kind='admin') = 2, 'đến giờ hẹn thì hiện thư');
  perform t.ok((select count(*) from notifications where kind='mail') = 2, 'thông báo thư hiện đúng giờ');
  perform t.now_is('2026-10-14 09:00+07');
  perform t.as_super();
end $$;
