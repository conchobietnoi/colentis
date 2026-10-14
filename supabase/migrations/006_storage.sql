-- Colentis · 006 · Storage: bucket riêng tư cho ảnh thẻ và avatar
-- Ảnh thẻ chỉ tải được khi bạn sở hữu thẻ đó (hoặc là thẻ yêu thích/album công khai của bạn bè).
-- Tải ảnh thẻ lên bucket 'cards' làm bằng Dashboard (tài khoản chủ project), không có chính sách ghi cho người dùng.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('cards',   'cards',   false, 5242880, array['image/webp']),
  ('avatars', 'avatars', false, 1048576, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- 'common/common-01.webp' hoặc 'thumbs/common-01.webp' → id thẻ 'common-01'
create or replace function private.can_read_card(obj_name text) returns boolean
language sql stable security definer set search_path = public as
$$
  with c as (select regexp_replace(obj_name, '^.*/([^/]+)\.webp$', '\1') as cid)
  select exists (select 1 from c join user_cards uc on uc.card_id = c.cid where private.album_visible(uc.user_id))
      or exists (select 1 from c join profiles p on c.cid = any (p.fav_cards) where private.are_friends(auth.uid(), p.id))
$$;
grant execute on function private.can_read_card(text) to authenticated;

create policy cards_read on storage.objects for select to authenticated
  using (bucket_id = 'cards' and private.can_read_card(name));

create policy avatars_read on storage.objects for select to authenticated
  using (bucket_id = 'avatars');
create policy avatars_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_update on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_delete on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Gỡ quyền mặc định của PUBLIC trên hàm mới tạo ở file này.
revoke execute on all functions in schema private from public, anon;
