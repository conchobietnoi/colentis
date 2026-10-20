-- Album sưu tầm (018): quà thư `album`, kho album của tôi, đọc ảnh trong bucket riêng tư
select t.now_is('2026-10-20 12:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol'); r jsonb; mid uuid; res jsonb;
begin
  perform t.as_super();
  update profiles set is_admin = true where id = a;
  insert into storage.objects(bucket_id, name) values ('album','greengreen-street/cover.jpg'), ('album','greengreen-street/03.jpg'), ('album','greengreen-street/xx.png');
  grant select on storage.objects to authenticated;
  perform t.as_user(a);
  perform t.expect_err('INVALID_GIFT', $q$select admin_send_mail('x','y','[{"type":"album","id":"khong-co"}]', array['bob_0002'])$q$);
  r := admin_send_mail('Album thử', 'Tặng bạn một cuốn album', '[{"type":"album","id":"greengreen-street"}]', array['bob_0002']);
  mid := (r->>'mail_id')::uuid;
  perform t.as_user(b);
  perform t.ok(jsonb_array_length(my_albums()) = 0, 'chưa nhận: kệ trống');
  perform t.ok(not exists (select 1 from storage.objects where bucket_id = 'album'), 'chưa sở hữu: không đọc được ảnh album');
  res := claim_mail(mid);
  perform t.ok(res->'grants'->0->>'album' = 'greengreen-street' and (res->'grants'->0->>'is_new')::boolean, 'nhận quà: có album mới');
  perform t.ok(jsonb_array_length(my_albums()) = 1 and my_albums()->0->>'id' = 'greengreen-street' and (my_albums()->0->>'pages')::int = 20, 'kệ có album');
  perform t.ok(exists (select 1 from storage.objects where name = 'greengreen-street/cover.jpg'), 'đọc được bìa album của mình');
  perform t.ok(exists (select 1 from storage.objects where name = 'greengreen-street/03.jpg'), 'đọc được trang ruột');
  perform t.ok(not exists (select 1 from storage.objects where name = 'greengreen-street/xx.png'), 'không đọc được tệp sai định dạng tên');
  res := claim_mail(mid);
  perform t.ok((select count(*) from user_albums where user_id = b) = 1, 'nhận lại không nhân đôi');
  perform t.as_user(c);
  perform t.ok(jsonb_array_length(my_albums()) = 0 and not exists (select 1 from storage.objects where bucket_id = 'album'), 'người khác không thấy album và ảnh');
end $$;
