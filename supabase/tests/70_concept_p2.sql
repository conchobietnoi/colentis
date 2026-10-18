-- Mùa Concept giai đoạn 2: nhiệm vụ ngày, pack, thẻ concept, mở khóa, pack thưởng, tặng/xin, Ultra, thư
select t.now_is('2026-10-18 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol'); r jsonb; pid uuid; i int; n int; k int; mid uuid; st jsonb;
begin
  insert into friendships(requester, addressee, status) values (a, b, 'accepted') on conflict do nothing;
  delete from concept_packs where user_id in (a, b, c);
  perform t.as_user(a);
  perform public.ensure_login_events();
  -- ===== Thư theo lịch =====
  perform t.as_super();
  perform t.ok((select count(*) from mails where kind = 'news' and event_id = 'mua-concept-2026') = 3, '3 thư news của mùa');
  perform t.as_user(a);
  perform t.ok((select count(*) from mail_recipients mr join mails m on m.id = mr.mail_id where mr.user_id = a and m.tag = 'SẮP TỚI' and mr.deliver_at <= private.now()) = 1, 'thư 01/11 đã tới hôm 18/10');
  perform t.ok((select count(*) from mail_recipients mr join mails m on m.id = mr.mail_id where mr.user_id = a and m.tag = 'MỞ KHÓA' and mr.deliver_at <= private.now()) = 0, 'thư mở khóa chưa tới');
  -- ===== Nhiệm vụ ngày =====
  perform t.ok((public.concept_state()->>'day')::int = 1, 'hôm nay là ngày 1');
  perform t.ok((public.concept_state()->'packs') = '[]'::jsonb, 'chưa có pack');
  perform t.expect_err('NO_PACK', 'select concept_open_pack()');
  perform t.expect_err('TASK_NOT_MET', 'select concept_tick()');
  perform t.as_super();
  perform t.now_is('2026-10-18 08:10+07');
  insert into tasks(owner_id, calendar_id, day, title, done) select a, id, '2026-10-18', 'Dậy sớm', true from calendars where owner_id = a limit 1;
  perform t.now_is('2026-10-18 10:00+07');
  perform t.as_user(a);
  r := concept_tick();
  perform t.ok(jsonb_array_length(r->'packs') = 2 and (r->'packs'->0->>'con')::int = 1, 'xong nhiệm vụ: 2 pack concept 1');
  perform t.expect_err('ALREADY_DONE', 'select concept_tick()');
  perform t.now_is('2026-10-17 23:00+07');
  perform t.expect_err('OUT_OF_EVENT', 'select concept_tick()');
  perform t.now_is('2026-10-21 08:00+07');
  perform t.as_super();
  insert into tasks(owner_id, calendar_id, day, title, label, done) select a, id, '2026-10-21', 'Giúp mẹ', 'Cho người khác', true from calendars where owner_id = a limit 1;
  perform t.as_user(a);
  r := concept_tick();
  perform t.ok(jsonb_array_length(r->'packs') = 4 and (select count(*) from jsonb_array_elements(r->'packs') x where (x->>'con')::int = 2) = 2, 'ngày 4: 2 pack Aniyaaa');
  perform t.now_is('2026-10-18 10:00+07');
  -- ===== Mở pack concept =====
  r := concept_open_pack((select id from concept_packs where user_id = a and con = 1 and opened_at is null limit 1));
  perform t.ok(jsonb_array_length(r->'cards') = 5 and (r->'pack'->>'con')::int = 1, 'pack concept có 5 thẻ');
  perform t.ok((select sum(count) from concept_cards where user_id = a) = 5, 'kho có 5 bản');
  perform t.ok(not exists (select 1 from jsonb_array_elements(r->'cards') x where (x->>'con')::int <> 1), 'thẻ thuộc concept của pack');
  perform t.ok((select count(*) from concept_packs where user_id = a and opened_at is not null) = 1, 'pack đã mở không mở lại');
  -- tỉ lệ: 400 pack thường ~ 20% holo
  perform t.as_super();
  insert into concept_packs(user_id, con, kind, src) select b, 2, 'daily', 'test:' || g from generate_series(1, 400) g;
  perform t.as_user(b);
  for pid in select id from concept_packs where user_id = b and src like 'test:%' loop perform concept_open_pack(pid); end loop;
  select sum(count) filter (where holo), sum(count) into k, n from concept_cards where user_id = b;
  perform t.ok(n = 2000, '400 pack = 2000 thẻ');
  perform t.ok(k between 300 and 500, format('holo ~20%% (%s/2000)', k));
  perform t.ok((select count(*) from concept_cards where user_id = b and not holo) = 5 and (select count(*) from concept_cards where user_id = b and holo) = 5, 'đủ 10 ô');
  perform t.ok((select count(*) from concept_unlocks where user_id = b) = 1 and exists (select 1 from user_titles where user_id = b and title_id = 'concept-2'), 'bob mở khóa concept 2 + danh hiệu');
  perform t.ok((select equipped_title from profiles where id = b) = 'concept-2', 'tự dùng khung mới nhất');
  perform t.ok((select count(*) from concept_packs where user_id = b and kind = 'bonus' and opened_at is null) = 1, '1 pack thưởng');
  -- ===== Pack thưởng: 5 thẻ app =====
  r := concept_open_pack();
  perform t.ok((r->'pack'->>'kind') = 'bonus' and jsonb_array_length(r->'app') = 5, 'pack thưởng ra 5 thẻ app');
  perform t.ok((select count(*) from reward_grants where user_id = b and source = 'event') = 5, 'ghi 5 lượt nhận thẻ app');
  perform t.ok(jsonb_array_length(public.concept_state()->'bonus_recent') = 5, 'lịch sử pack thưởng');
  perform t.expect_err('NO_PACK', 'select concept_open_pack()');
  -- ===== Tặng / xin =====
  perform t.as_super();
  update concept_cards set count = 1 where user_id = b and con = 2 and slot = 0 and not holo;
  perform t.as_user(b);
  perform t.expect_err('NOT_ENOUGH_SPARE', format('select concept_give(array[%L::uuid], 2, 0, false)', a));
  perform t.as_super();
  update concept_cards set count = 3 where user_id = b and con = 2 and slot = 0 and not holo;
  perform t.as_user(b);
  perform t.expect_err('FORBIDDEN', format('select concept_give(array[%L::uuid], 2, 0, false)', c));
  perform t.expect_err('INVALID_RECIPIENTS', format('select concept_give(array[%L::uuid], 2, 0, false)', b));
  perform t.as_user(a);
  select slot into k from concept_cards where user_id = a and con = 1 and not holo limit 1;
  perform t.expect_err('ALREADY_OWNED', format('select concept_ask(array[%L::uuid], 1, %s, false)', b, coalesce(k, 0)));
  perform t.as_super();
  delete from concept_cards where user_id = a and con = 2;
  perform t.as_user(a);
  r := concept_ask(array[b], 2, 0, false);
  perform t.ok(jsonb_array_length(r->'asks_out') = 1, 'đã xin');
  perform concept_ask(array[b], 2, 0, false);
  perform t.as_super();
  perform t.ok((select count(*) from notifications where user_id = b and kind = 'concept_ask') = 1, 'xin lại không báo thêm');
  perform t.as_user(a);
  perform t.expect_err('FORBIDDEN', format('select concept_ask(array[%L::uuid], 2, 0, false)', c));
  perform t.as_user(b);
  perform t.ok(jsonb_array_length(public.concept_state()->'asks_in') = 1, 'bob thấy lời xin');
  r := concept_give(array[a], 2, 0, false);
  perform t.ok((select count from concept_cards where user_id = b and con = 2 and slot = 0 and not holo) = 2, 'bob còn 2 bản');
  perform t.ok(jsonb_array_length(r->'asks_in') = 0, 'lời xin được dọn sau khi tặng');
  perform t.as_user(a);
  perform t.ok(jsonb_array_length(public.concept_state()->'gifts') = 1, 'alice có 1 quà');
  perform t.ok(not exists (select 1 from concept_cards where user_id = a and con = 2), 'chưa nhận thì chưa có thẻ');
  r := concept_claim_gifts(b);
  perform t.ok((r->'cards'->0->>'is_new')::boolean and (select count from concept_cards where user_id = a and con = 2 and slot = 0 and not holo) = 1, 'nhận quà: thẻ mới');
  perform t.expect_err('NO_GIFT', 'select concept_claim_gifts(null)');
  -- ===== Mở khóa bằng quà / Ultra =====
  perform t.expect_err('NEED_ALL_CONCEPTS', 'select concept_ultra_lock(1, array[0,4])');
  perform t.as_super();
  insert into concept_cards(user_id, con, slot, holo, count) select a, c2, s, false, 1 from generate_series(1,3) c2, generate_series(0,4) s
    on conflict (user_id, con, slot, holo) do nothing;
  perform private.concept_check_unlock(a);
  perform t.as_user(a);
  perform t.ok((select count(*) from concept_unlocks where user_id = a) = 3, 'alice đủ 3 concept');
  perform t.ok((select count(*) from concept_packs where user_id = a and kind = 'bonus') = 3, '3 pack thưởng');
  perform t.ok(private.can_read_concept('pano-2.webp') and private.can_read_concept('songs/3.m4a') and private.can_read_concept('c1-0.webp') and not private.can_read_concept('x.webp'), 'quyền đọc file concept');
  perform t.expect_err('INVALID_SONGS', 'select concept_ultra_lock(1, array[2,2])');
  perform t.expect_err('INVALID_SONGS', 'select concept_ultra_lock(1, array[2,9])');
  perform t.expect_err('INVALID_ULTRA', 'select concept_ultra_lock(3, array[0,4])');
  r := concept_ultra_lock(1, array[0,4]);
  perform t.ok(jsonb_array_length(r->'ultra') = 1, 'khóa nhạc thẻ Ultra 1');
  perform t.expect_err('ALREADY_LOCKED', 'select concept_ultra_lock(1, array[1,2])');
  perform concept_ultra_lock(2, array[1,6]);
  -- bob chưa đủ concept: không đọc được video/nhạc (pano và poster ai cũng đọc được)
  perform t.as_user(b);
  perform t.ok(private.can_read_concept('pano-2.webp') and private.can_read_concept('pano-1.webp') and not private.can_read_concept('ultra-1.mp4') and private.can_read_concept('ultra-1.webp'), 'bob: có pano, chưa có video');
  perform t.expect_err('NEED_ALL_CONCEPTS', 'select concept_ultra_lock(1, array[0,4])');
  -- ===== Thư có pack =====
  perform t.as_user(c);
  perform public.ensure_login_events();
  perform t.now_is('2026-10-21 00:30+07');
  perform public.ensure_login_events();
  select mr.mail_id into mid from mail_recipients mr join mails m on m.id = mr.mail_id where mr.user_id = c and m.title = 'Aniyaaa đã lên sàn';
  r := claim_mail(mid);
  perform t.ok((select count(*) from concept_packs where user_id = c and con = 2) = 1, 'thư 21/10 tặng 1 pack Aniyaaa');
  r := claim_mail(mid);
  perform t.ok((select count(*) from concept_packs where user_id = c and con = 2) = 1, 'nhận lại không nhân đôi');
  -- client không tự ghi
  perform t.expect_err('permission denied', 'insert into concept_packs(user_id, con, kind, src) values (auth.uid(), 1, ''daily'', ''x'')');
  perform t.expect_err('permission denied', 'update concept_cards set count = 99');
end $$;
