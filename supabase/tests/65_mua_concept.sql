-- Mùa Concept: thư giới thiệu, nhận thẻ ID, gán thành viên, ảnh + tên mở khung, pack lưu chờ mở
select t.now_is('2026-10-18 09:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); mid uuid; r jsonb; c jsonb;
begin
  perform t.as_user(a);
  perform public.ensure_login_events();
  select id into mid from mails where event_id = 'mua-concept-2026' and kind = 'event';
  perform t.ok(mid is not null, 'có thư Mùa Concept');
  perform t.ok(exists (select 1 from mail_recipients where mail_id = mid and user_id = a), 'alice nhận được thư');
  perform t.expect_err('NO_ID_CARD', 'select id_card_choose(''juhoon'')');
  r := claim_mail(mid);
  perform t.ok(exists (select 1 from id_cards where user_id = a), 'có thẻ ID trống');
  perform t.ok(exists (select 1 from concept_packs where user_id = a and con = 1 and kind = 'daily' and opened_at is null), 'quà thư: 1 pack concept 1 chưa mở');
  r := claim_mail(mid);
  perform t.ok((select count(*) from concept_packs where user_id = a) = 1, 'nhận lại thư không nhân đôi pack');
  perform t.expect_err('INVALID_MEMBER', 'select id_card_choose(''abc'')');
  c := id_card_choose('juhoon');
  perform t.ok(c->>'member' = 'juhoon' and (c->>'locked')::boolean and not (c->>'frame')::boolean, 'gán Juhoon, khung chưa mở');
  perform t.expect_err('ALREADY_CHOSEN', 'select id_card_choose(''james'')');
  perform t.expect_err('INVALID_PHOTO', format('select id_card_save(''Chris'', ''%s/khac.jpg'', ''{"z":1,"x":50,"y":50}'')', b));
  perform t.expect_err('INVALID_CROP', format('select id_card_save(''Chris'', ''%s/idcard-1.jpg'', ''{"z":9,"x":50,"y":50}'')', a));
  perform t.expect_err('INVALID_HOLDER', format('select id_card_save(%L, null, ''{"z":1,"x":50,"y":50}'')', repeat('x', 21)));
  c := id_card_save('Chris', null, '{"z":1,"x":50,"y":50}');
  perform t.ok(not (c->>'frame')::boolean and not exists (select 1 from user_titles where user_id = a and title_id like 'idcard-%'), 'có tên nhưng chưa ảnh: chưa mở khung');
  c := id_card_save('Chris', a::text || '/idcard-1.jpg', '{"z":1.5,"x":40,"y":60}');
  perform t.ok((c->>'frame')::boolean and exists (select 1 from user_titles where user_id = a and title_id = 'idcard-juhoon'), 'đủ ảnh và tên: mở khung Juhoon');
  perform t.ok((c->'crop'->>'z')::numeric = 1.5, 'lưu crop');
  -- người khác không thấy thẻ của alice
  perform t.as_user(b);
  perform t.ok((select count(*) from id_cards) = 0, 'bob không đọc được thẻ ID của alice');
  perform t.ok(public.my_id_card() is null, 'bob chưa có thẻ ID');
  perform t.expect_err('NO_ID_CARD', 'select id_card_save(''B'', null, ''{"z":1,"x":50,"y":50}'')');
end $$;
