-- Colentis · 011 · Cho người đã đăng nhập đọc ảnh panorama sự kiện trong bucket riêng tư `cards` (thư mục event/)
create policy cards_read_event on storage.objects for select to authenticated
  using (bucket_id = 'cards' and name like 'event/mc-pano-%');
