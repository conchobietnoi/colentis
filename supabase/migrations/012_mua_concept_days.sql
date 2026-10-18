-- Colentis · 012 · Mùa Concept: sửa ngày bắt đầu (18/10) và lịch 9 ngày theo thiết kế.
-- Thư giới thiệu đã gửi từ 17/10 nên không bị ảnh hưởng; starts_on chỉ là mốc sự kiện thật.
update public.events set starts_on = date '2026-10-18' where id = 'mua-concept-2026';

create table if not exists public.event_days (
  event_id text not null references public.events(id) on delete cascade,
  day_no   int  not null check (day_no between 1 and 31),
  on_date  date not null,
  concept  int  not null check (concept between 1 and 3),
  task_key text not null,
  task_title text not null,
  task_desc  text not null,
  primary key (event_id, day_no),
  unique (event_id, on_date)
);
alter table public.event_days enable row level security;
revoke all on public.event_days from anon, authenticated;
create policy event_days_read on public.event_days for select to authenticated using (true);
grant select on public.event_days to authenticated;

-- 3 concept, mỗi concept 3 ngày: 1 = Urichinguchana (18–20), 2 = Aniyaaa (21–23), 3 = Poyoyoi (24–26).
insert into public.event_days(event_id, day_no, on_date, concept, task_key, task_title, task_desc) values
('mua-concept-2026',1,date '2026-10-18',1,'early_tick','Rạng Sáng','Tick xong 1 việc trước 9 giờ sáng.'),
('mua-concept-2026',2,date '2026-10-19',1,'home_task','Nhà Của Mình','Hoàn thành 1 việc nhà.'),
('mua-concept-2026',3,date '2026-10-20',1,'plan_tomorrow','Khởi Động Tuần','Lên lịch ít nhất 1 việc cho ngày mai.'),
('mua-concept-2026',4,date '2026-10-21',2,'for_others','Gửi Yêu Thương','Hoàn thành 1 việc dành cho người khác.'),
('mua-concept-2026',5,date '2026-10-22',2,'set_time','Xếp Hình Giờ Giấc','Gắn giờ cho 1 việc bất kỳ.'),
('mua-concept-2026',6,date '2026-10-23',2,'night_owl','Cú Đêm','Hoàn thành 1 việc sau 21 giờ.'),
('mua-concept-2026',7,date '2026-10-24',3,'home_task','Dọn Nhà Cuối Tuần','Hoàn thành 1 việc nhà.'),
('mua-concept-2026',8,date '2026-10-25',3,'three_done','Chốt Sổ','Hoàn thành 3 việc trong hôm nay.'),
('mua-concept-2026',9,date '2026-10-26',3,'shared_task','Cả Nhà Cùng Làm','Hoàn thành 1 việc chung.')
on conflict do nothing;
