select t.now_is('2027-03-06 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol'); d uuid := t.id('dave'); own text; other text; n int;
begin
  perform t.as_super();
  -- ảnh thẻ trong Storage (giả lập)
  insert into storage.objects(bucket_id, name) select 'cards', storage_path from cards;
  insert into storage.objects(bucket_id, name) select 'cards', thumb_path from cards;
  grant select, insert, update, delete on storage.objects to authenticated;

  -- alice đọc được ảnh thẻ mình có, không đọc được thẻ chưa có
  perform t.as_user(a);
  select card_id into own from user_cards where user_id = a limit 1;
  select id into other from cards where rarity = 'supreme' and id not in (select card_id from user_cards where user_id = a) limit 1;
  perform t.ok(exists (select 1 from storage.objects where name = (select storage_path from cards where id = own)), 'đọc được ảnh thẻ mình sở hữu');
  perform t.ok(exists (select 1 from storage.objects where name = (select thumb_path from cards where id = own)), 'đọc được ảnh thu nhỏ');
  perform t.ok(not exists (select 1 from storage.objects where name = (select storage_path from cards where id = other)), 'không đọc được ảnh thẻ chưa sở hữu');
  perform t.ok((select count(*) from storage.objects where bucket_id = 'cards') = (select 2 * count(*) from user_cards where user_id = a), 'chỉ thấy đúng ảnh thẻ của mình');
  perform t.expect_err('row-level security', $q$insert into storage.objects(bucket_id, name) values ('cards', 'common/hack.webp')$q$);
  -- bạn bè: thẻ yêu thích của bob mà alice không có
  perform t.as_super();
  insert into friendships(requester, addressee, status) values (a, b, 'accepted') on conflict do nothing;
  perform t.as_user(b);
  select card_id into other from user_cards where user_id = b and card_id not in (select card_id from user_cards where user_id = a) limit 1;
  perform set_favs(array[other]);
  perform t.as_user(a);
  perform t.ok(exists (select 1 from storage.objects where name = (select storage_path from cards where id = other)), 'thấy ảnh thẻ yêu thích của bạn dù album riêng tư');
  perform t.ok(not exists (select 1 from user_cards where user_id = b), 'nhưng không đọc được album riêng tư của bạn');
  perform t.as_user(b); perform update_profile('{"album_public": true}');
  perform t.as_user(a);
  perform t.ok(exists (select 1 from user_cards where user_id = b), 'bật album công khai thì bạn bè xem được');
  perform t.as_user(c);
  perform t.ok(not exists (select 1 from user_cards where user_id = b), 'người lạ không xem album');
  -- avatar: chỉ ghi vào thư mục của mình
  perform t.as_user(a);
  insert into storage.objects(bucket_id, name, owner) values ('avatars', a::text || '/me.jpg', a);
  perform t.expect_err('row-level security', format('insert into storage.objects(bucket_id, name, owner) values (''avatars'', %L, %L)', b::text || '/steal.jpg', a));
end $$;
