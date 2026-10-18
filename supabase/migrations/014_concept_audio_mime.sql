-- Colentis · 014 · Cho phép tải nhạc .m4a vào bucket `concept`: trình duyệt gửi kiểu audio/x-m4a hoặc audio/m4a thay vì audio/mp4.
update storage.buckets
   set allowed_mime_types = array['image/webp','video/mp4','audio/mp4','audio/x-m4a','audio/m4a','audio/aac','audio/mpeg']
 where id = 'concept';
