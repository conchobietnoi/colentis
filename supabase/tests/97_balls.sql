-- CORTIS Ball (022): quà thư `ball`, kệ ball của tôi
select t.now_is('2026-11-01 12:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol'); r jsonb; mid uuid; res jsonb;
begin
  perform t.as_super();
  update profiles set is_admin = true where id = a;
  perform t.as_user(a);
  perform t.expect_err('INVALID_GIFT', $q$select admin_send_mail('x','y','[{"type":"ball","id":"ball-9"}]', array['bob_0002'])$q$);
  r := admin_send_mail('Ball thử', 'Tặng bạn một con ball', '[{"type":"ball","id":"ball-1"}]', array['bob_0002']);
  mid := (r->>'mail_id')::uuid;
  perform t.as_user(b);
  perform t.ok(jsonb_array_length(my_balls()) = 0, 'chưa nhận: kệ ball trống');
  res := claim_mail(mid);
  perform t.ok(res->'grants'->0->>'ball' = 'ball-1' and (res->'grants'->0->>'is_new')::boolean, 'nhận quà: có ball mới');
  perform t.ok(jsonb_array_length(my_balls()) = 1 and my_balls()->0->>'id' = 'ball-1', 'kệ có ball-1');
  res := claim_mail(mid);
  perform t.ok((select count(*) from user_balls where user_id = b) = 1, 'nhận lại không nhân đôi');
  perform t.as_user(c);
  perform t.ok(jsonb_array_length(my_balls()) = 0, 'người khác không thấy ball của bạn');
  perform t.ok(not exists (select 1 from user_balls), 'RLS: người khác không đọc được bảng');
end $$;
