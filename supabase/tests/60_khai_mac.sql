-- Sự kiện Khai Mạc: mốc, thứ tự ngẫu nhiên cố định, quà tổng 1 pack
select t.now_is('2026-10-15 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); cal uuid; tk uuid; r jsonb; r2 jsonb; i int; seen text[] := '{}'; mem text;
begin
  select cm.calendar_id into cal from calendar_members cm join calendars x on x.id = cm.calendar_id where cm.user_id = a and x.name = 'Việc riêng';
  perform t.as_super();
  delete from day_locks where user_id in (a, b); delete from task_completions where user_id in (a, b); delete from tasks where owner_id in (a, b); delete from rescue_uses where user_id in (a, b); delete from reward_grants where user_id in (a, b); delete from user_cards where user_id in (a, b);
  perform t.as_user(a);
  perform t.expect_err('NOT_ENOUGH_TASKS', 'select claim_khai_mac(1)');
  perform t.expect_err('INVALID_MILESTONE', 'select claim_khai_mac(6)');
  for i in 1..5 loop
    insert into tasks(calendar_id, day, title) values (cal, '2026-10-15', 'K' || i) returning id into tk;
    update tasks set done = true, version = 1 where id = tk;
    r := claim_khai_mac(i);
    mem := r->>'member';
    perform t.ok(not (mem = any (seen)), 'mốc ' || i || ' ra thành viên mới');
    seen := seen || mem;
    perform t.ok((select count(*) from user_cards where user_id = a and card_id = 'khaimac-' || mem) = 1, 'có thẻ limited ' || mem);
    perform t.ok((select count(*) from user_titles where user_id = a and title_id = 'limited-' || mem) = 1, 'có khung ' || mem);
    if i < 5 then perform t.expect_err('NOT_ENOUGH_TASKS', format('select claim_khai_mac(%s)', i + 1)); end if;
  end loop;
  r2 := claim_khai_mac(3);
  perform t.ok((r2->>'already')::boolean, 'nhận lại mốc không cộng thêm');
  perform t.ok((select count(*) from user_cards where user_id = a and card_id like 'khaimac-%' and card_id not like 'khaimac-1y-%') = 5, '5 thẻ limited');
  perform t.expect_err('INVALID_MEMBER', 'select claim_khai_mac_pack(''abc'')');
  r := claim_khai_mac_pack('martin');
  perform t.ok((select count(*) from user_cards where user_id = a and card_id = 'khaimac-1y-martin') = 1, 'có tag 1Y martin');
  r2 := claim_khai_mac_pack('james');
  perform t.ok((r2->>'member') = 'martin' and (r2->>'already')::boolean, 'chỉ 1 pack');
  perform t.ok((select count(*) from user_cards where user_id = a and card_id like 'khaimac-1y-%') = 1, 'đúng 1 thẻ tag');
  perform t.as_user(b);
  perform t.expect_err('MILESTONES_INCOMPLETE', 'select claim_khai_mac_pack(''james'')');

end $$;
