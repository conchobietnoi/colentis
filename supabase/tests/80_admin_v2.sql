-- Trang admin v2 (017)
select t.now_is('2026-10-19 12:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); r jsonb; mid uuid; mid2 uuid; n int;
begin
  perform t.as_super();
  update profiles set is_admin = true where id = a;
  perform t.as_user(b);
  perform t.expect_err('FORBIDDEN', 'select admin_overview()');
  perform t.expect_err('FORBIDDEN', 'select admin_members()');
  perform t.expect_err('FORBIDDEN', 'select admin_sent_mails()');
  perform t.as_user(a);
  r := admin_overview();
  perform t.ok((r->>'members')::int >= 3, 'tổng quan: có thành viên');
  perform t.ok(jsonb_typeof(r->'activity') = 'array', 'tổng quan: hoạt động là mảng');
  r := admin_members();
  perform t.ok(jsonb_array_length(r) >= 3 and (r->0) ? 'streak' and (r->0) ? 'unclaimed' and (r->0) ? 'last_active', 'danh sách thành viên có đủ trường');
  -- thư hẹn giờ
  r := admin_send_mail('Hẹn', 'nd', '[{"type":"rescue","qty":1}]', array['bob_0002'], timestamptz '2026-10-20 09:00+07');
  mid := (r->>'mail_id')::uuid;
  r := admin_overview();
  perform t.ok((r->>'scheduled')::int = 1 and r->>'next_at' is not null, 'có 1 thư hẹn giờ');
  perform t.ok((select (x->>'scheduled')::boolean from jsonb_array_elements(admin_sent_mails()) x where x->>'id' = mid::text), 'lịch sử: thư ở trạng thái hẹn giờ');
  -- người nhận chưa thấy thư hẹn giờ trong hòm thư
  perform t.as_user(b);
  perform t.ok(not exists (select 1 from jsonb_array_elements(coalesce((me()->'mails'), '[]'::jsonb)) x where x->>'id' = mid::text), 'chưa tới giờ: chưa thấy thư');
  perform t.as_user(a);
  -- gửi ngay
  n := admin_send_now(mid);
  perform t.ok(n = 1, 'gửi ngay 1 người');
  perform t.ok(not (select (x->>'scheduled')::boolean from jsonb_array_elements(admin_sent_mails()) x where x->>'id' = mid::text), 'đã hết hẹn giờ');
  perform t.expect_err('ALREADY_SENT', format('select admin_cancel_mail(%L)', mid));
  -- huỷ hẹn
  r := admin_send_mail('Huỷ', 'nd', '[]', array['bob_0002'], timestamptz '2026-10-25 09:00+07');
  mid2 := (r->>'mail_id')::uuid;
  perform admin_cancel_mail(mid2);
  perform t.ok(not exists (select 1 from mails where id = mid2), 'thư huỷ hẹn đã biến mất');
  perform t.ok(not exists (select 1 from notifications where payload->>'mail_id' = mid2::text), 'thông báo của thư huỷ cũng mất');
  perform t.expect_err('NOT_FOUND', format('select admin_cancel_mail(%L)', mid2));
  -- nhắc nhận quà
  n := admin_nudge_mail(mid);
  perform t.ok(n = 1, 'nhắc 1 người chưa nhận quà');
  perform t.as_user(b);
  perform t.expect_err('FORBIDDEN', format('select admin_nudge_mail(%L)', mid));
  perform t.expect_err('FORBIDDEN', format('select admin_cancel_mail(%L)', mid));
  perform t.expect_err('FORBIDDEN', format('select admin_send_now(%L)', mid));
end $$;
