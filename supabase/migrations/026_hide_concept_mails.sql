-- Colentis · 026 · Mùa Concept đã kết thúc: thôi phát thư sự kiện cho người vào sau và ẩn thư cũ khỏi hòm thư
-- (dời deliver_at sang 2099, không xóa dữ liệu). Thư POLA DAY phát cho mọi người dùng, kể cả người đăng ký sau.
-- Đã chạy trên Supabase thật bằng câu lệnh trực tiếp ngày 04/11/2026.
update public.mails set broadcast_at = null where event_id = 'mua-concept-2026';
update public.mail_recipients set deliver_at = '2099-01-01 00:00:00+00'
 where mail_id in (select id from public.mails where event_id = 'mua-concept-2026');
update public.mails set broadcast_at = '2026-11-01 14:00:00+00' where event_id = 'pola-day-2026';
