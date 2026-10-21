-- Check in bằng ảnh (019)
select t.now_is('2026-10-21 10:00+07');
do $$
declare a uuid := t.id('alice'); b uuid := t.id('bob'); c uuid := t.id('carol'); gal uuid; tk uuid; tkb uuid; p1 text; p2 text; pu text; r jsonb; n int;
begin
  select id into gal from calendars where name = 'Chung';
  perform t.as_super();
  update profiles set is_admin = false where id in (a, b, c);
  grant select, insert, delete on storage.objects to authenticated;
  perform t.as_user(a);
  insert into tasks(calendar_id, day, title) values (gal, '2026-10-21', 'Chạy bộ') returning id into tk;
  perform t.as_user(b);
  insert into tasks(calendar_id, day, title) values (gal, '2026-10-21', 'Việc của bob') returning id into tkb;
  perform t.as_user(a);
  p1 := gal || '/' || tk || '/cam-1760000000001.jpg';
  p2 := gal || '/' || tk || '/cam-1760000000002.jpg';
  pu := gal || '/' || tk || '/up-1760000000003.jpg';
  -- tải lên: chủ việc được, người khác không
  insert into storage.objects(bucket_id, name) values ('checkins', p1);
  perform t.ok(true, 'chủ việc tải được ảnh chụp');
  perform t.expect_err('row-level security', format('insert into storage.objects(bucket_id, name) values (''checkins'', %L)', pu));
  perform t.expect_err('row-level security', format('insert into storage.objects(bucket_id, name) values (''checkins'', %L)', gal || '/' || tkb || '/cam-1760000000009.jpg'));
  perform t.expect_err('row-level security', format('insert into storage.objects(bucket_id, name) values (''checkins'', %L)', gal || '/' || tk || '/hack.png'));
  -- gắn ảnh
  perform t.expect_err('FILE_NOT_FOUND', format('select set_task_photo(%L, %L, ''camera'')', tk, p2));
  perform t.expect_err('INVALID_SOURCE', format('select set_task_photo(%L, %L, ''upload'')', tk, p1));
  perform t.expect_err('INVALID_PATH', format('select set_task_photo(%L, %L, ''camera'')', tk, gal || '/' || tkb || '/cam-1760000000001.jpg'));
  r := set_task_photo(tk, p1, 'camera');
  perform t.ok(r->>'path' = p1 and r->>'old_path' is null, 'gắn ảnh lần đầu');
  perform t.ok((select count(*) from task_photos where task_id = tk) = 1, 'có 1 ảnh cho việc');
  -- người chung lịch xem được ảnh và bản ghi
  perform t.as_user(b);
  perform t.ok((select count(*) from task_photos where task_id = tk) = 1, 'bob (chung lịch) thấy ảnh của alice');
  perform t.ok(exists (select 1 from storage.objects where name = p1), 'bob đọc được tệp ảnh');
  perform t.expect_err('FORBIDDEN', format('select set_task_photo(%L, %L, ''camera'')', tk, p1));
  perform t.expect_err('row-level security', format('insert into storage.objects(bucket_id, name) values (''checkins'', %L)', gal || '/' || tk || '/cam-1760000000004.jpg'));
  perform t.as_user(c);
  perform t.ok((select count(*) from task_photos) = 0 and not exists (select 1 from storage.objects where bucket_id = 'checkins'), 'carol (ngoài lịch) không thấy gì');
  -- chụp lại: thay ảnh, trả đường dẫn cũ
  perform t.as_user(a);
  insert into storage.objects(bucket_id, name) values ('checkins', p2);
  r := set_task_photo(tk, p2, 'camera');
  perform t.ok(r->>'old_path' = p1, 'chụp lại: trả đường dẫn cũ để xóa');
  perform t.ok((select count(*) from task_photos where task_id = tk) = 1 and (select path from task_photos where task_id = tk) = p2, 'vẫn một ảnh, đã đổi');
  delete from storage.objects where name = p1; get diagnostics n = row_count;
  perform t.ok(n = 1, 'chủ việc xóa được tệp cũ');
  -- tải từ máy: chỉ admin
  perform t.as_super();
  update profiles set is_admin = true where id = a;
  perform t.as_user(a);
  insert into storage.objects(bucket_id, name) values ('checkins', pu);
  r := set_task_photo(tk, pu, 'upload');
  perform t.ok((select source from task_photos where task_id = tk) = 'upload', 'admin tải ảnh từ máy được');
  -- tab Ảnh của bản thân
  r := my_checkins();
  perform t.ok(jsonb_array_length(r) = 1 and r->0->>'title' = 'Chạy bộ' and r->0->>'calendar' = 'Chung' and r->0->>'day' = '2026-10-21', 'my_checkins có ngày, tên việc, lịch');
  perform t.as_user(b);
  perform t.ok(jsonb_array_length(my_checkins()) = 0, 'bob không có ảnh nào của bản thân');
  perform t.ok(jsonb_array_length(task_photos_range('2026-10-01', '2026-10-31')) = 1, 'bob (cùng lịch) thấy ảnh của alice trong khoảng ngày');
  perform t.ok(jsonb_array_length(task_photos_range('2026-11-01', '2026-11-30')) = 0, 'khoảng ngày khác không có ảnh');
  -- xóa việc thì ảnh mất theo
  perform t.as_user(a);
  delete from tasks where id = tk;
  perform t.ok((select count(*) from task_photos where task_id = tk) = 0, 'xóa việc xóa luôn bản ghi ảnh');
end $$;
