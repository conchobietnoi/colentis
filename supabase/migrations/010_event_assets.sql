-- Colentis · 010 · Ảnh nhỏ của sự kiện (chỉ người đã đăng nhập đọc được; dữ liệu ảnh KHÔNG nằm trong repo)
create table public.event_assets (
  id   text primary key,
  mime text not null,
  data text not null  -- base64
);
alter table public.event_assets enable row level security;
revoke all on public.event_assets from anon, authenticated;
create policy event_assets_read on public.event_assets for select to authenticated using (true);
grant select on public.event_assets to authenticated;
