-- Danh hiệu mốc hằng ngày (020)
select t.now_is('2026-10-24 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); gal uuid; tk uuid; i int; got text[]; p text;
begin
  select id into gal from calendars where name = 'Chung';
  perform t.as_super();
  delete from user_titles where user_id = a and title_id in (select id from titles where sort between 24 and 35);
  delete from task_completions where user_id = a;
  -- giờ làm việc
  insert into task_completions(task_id, user_id, completed_at, vn_day, vn_hour) values
    (gen_random_uuid(), a, now(), '2026-10-24', 4), (gen_random_uuid(), a, now(), '2026-10-24', 12), (gen_random_uuid(), a, now(), '2026-10-24', 23);
  got := private.check_titles(a);
  perform t.ok(got @> array['daily-early','daily-lunch','daily-late'], 'đủ 3 danh hiệu theo giờ');
  perform t.ok(not got @> array['day-5'], '3 việc/ngày chưa đủ day-5');
  -- 5 và 10 việc trong ngày
  for i in 1..2 loop insert into task_completions(task_id, user_id, completed_at, vn_day, vn_hour) values (gen_random_uuid(), a, now(), '2026-10-24', 9); end loop;
  got := private.check_titles(a);
  perform t.ok(got @> array['day-5'] and not got @> array['day-10'], '5 việc trong ngày nhận day-5');
  for i in 1..5 loop insert into task_completions(task_id, user_id, completed_at, vn_day, vn_hour) values (gen_random_uuid(), a, now(), '2026-10-24', 10); end loop;
  got := private.check_titles(a);
  perform t.ok(got @> array['day-10'], '10 việc trong ngày nhận day-10');
  -- cuối tuần: 2026-10-24 là thứ Bảy
  perform t.ok(not (select 'weekend' = any (private.check_titles(a))), 'mới có thứ Bảy thì chưa nhận weekend');
  insert into task_completions(task_id, user_id, completed_at, vn_day, vn_hour) values (gen_random_uuid(), a, now(), '2026-10-25', 9);
  got := private.check_titles(a);
  perform t.ok(got @> array['weekend'], 'có cả thứ Bảy và Chủ nhật nhận weekend');
  -- thẻ trùng
  update user_cards set count = 5 where user_id = a and card_id = (select card_id from user_cards where user_id = a limit 1);
  if not exists (select 1 from user_cards where user_id = a) then
    insert into user_cards(user_id, card_id, count, first_source) values (a, (select id from cards limit 1), 5, 'daily');
  end if;
  got := private.check_titles(a);
  perform t.ok(got @> array['dup-5'], 'thẻ trùng 5 nhận dup-5');
  -- ảnh check in: 1, 10, 50 việc và chuỗi 7 ngày
  perform t.as_super();
  for i in 1..50 loop
    insert into tasks(calendar_id, owner_id, day, title) values (gal, a, '2026-10-24', 'Ảnh ' || i) returning id into tk;
    insert into task_photos(task_id, owner_id, calendar_id, path, source, taken_at)
      values (tk, a, gal, gal || '/' || tk || '/cam-1760000000001.jpg', 'camera', ('2026-10-24 10:00+07'::timestamptz - make_interval(days => i % 8)));
    if i = 1 then got := private.check_titles(a); perform t.ok(got @> array['photo-1'], '1 ảnh nhận photo-1'); end if;
    if i = 10 then got := private.check_titles(a); perform t.ok(got @> array['photo-10'] and not got @> array['photo-50'], '10 ảnh nhận photo-10'); end if;
  end loop;
  got := private.check_titles(a);
  perform t.ok(got @> array['photo-50'], '50 ảnh nhận photo-50');
  perform t.ok(exists (select 1 from user_titles where user_id = a and title_id = 'photo-streak-7'), '8 ngày liên tiếp có ảnh nhận photo-streak-7');
  -- bob: ít ảnh, không nhận các danh hiệu ảnh cao
  perform t.ok(not exists (select 1 from user_titles where user_id = b and title_id in ('photo-10','photo-50','photo-streak-7','day-10')), 'người khác không tự nhận');
  perform t.ok((select count(*) from titles where sort between 24 and 35) = 12, 'đủ 12 danh hiệu mới trong bảng titles');
end $$;
