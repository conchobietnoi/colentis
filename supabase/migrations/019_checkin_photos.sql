-- Colentis · 019 · Check in bằng ảnh vuông: mỗi việc có tối đa một ảnh, nằm trong ghi chú, người chung lịch xem được.
-- Ảnh ở bucket riêng tư `checkins`: <calendar_id>/<task_id>/cam-<ms>.jpg (chụp) hoặc up-<ms>.jpg (tải từ máy, chỉ admin).
-- Chỉ chủ việc ghi được; client không tự ghi bảng, phải qua set_task_photo (kiểm tra đường dẫn, quyền, nguồn).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('checkins', 'checkins', false, 2097152, array['image/jpeg','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create table public.task_photos (
  task_id     uuid primary key references public.tasks(id) on delete cascade,
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  calendar_id uuid not null references public.calendars(id) on delete cascade,
  path        text not null,
  source      text not null check (source in ('camera','upload')),
  taken_at    timestamptz not null default now()
);
create index task_photos_owner on public.task_photos (owner_id, taken_at desc);
alter table public.task_photos enable row level security;
create policy task_photos_select on public.task_photos for select to authenticated
  using (private.is_member(calendar_id, auth.uid()) and private.is_member(calendar_id, owner_id));
grant select on public.task_photos to authenticated;

-- Đường dẫn hợp lệ: <calendar_id>/<task_id>/(cam|up)-<ms>.jpg; trả về [calendar, task, tiền tố]
create or replace function private.checkin_parts(obj text) returns text[]
language sql immutable as
$$
  select case when obj ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/(cam|up)-[0-9]{10,14}\.(jpg|webp)$'
    then array[split_part(obj, '/', 1), split_part(obj, '/', 2), substring(split_part(obj, '/', 3) from '^(cam|up)')] end
$$;

-- Ghi ảnh: người chung lịch đọc; chủ việc ghi/xóa; tệp up- chỉ admin
create or replace function private.can_read_checkin(obj text) returns boolean
language sql stable security definer set search_path = public as
$$
  select p is not null and private.is_member(p[1]::uuid, auth.uid()) from (select private.checkin_parts(obj) as p) s
$$;
create or replace function private.can_write_checkin(obj text) returns boolean
language sql stable security definer set search_path = public as
$$
  select p is not null
     and exists (select 1 from tasks t where t.id = p[2]::uuid and t.calendar_id = p[1]::uuid and t.owner_id = auth.uid() and private.is_member(t.calendar_id, auth.uid()))
     and (p[3] = 'cam' or private.is_admin(auth.uid()))
  from (select private.checkin_parts(obj) as p) s
$$;
create policy checkins_read on storage.objects for select to authenticated
  using (bucket_id = 'checkins' and private.can_read_checkin(name));
create policy checkins_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'checkins' and private.can_write_checkin(name));
create policy checkins_delete on storage.objects for delete to authenticated
  using (bucket_id = 'checkins' and private.can_write_checkin(name));

-- Gắn ảnh vào việc (thay ảnh cũ nếu có). Trả đường dẫn cũ để client xóa tệp cũ.
create or replace function public.set_task_photo(tid uuid, p_path text, p_source text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); t tasks; p text[] := private.checkin_parts(p_path); old text;
begin
  select * into t from tasks where id = tid;
  if not found or t.owner_id <> u or not private.is_member(t.calendar_id, u) then raise exception 'FORBIDDEN'; end if;
  if p is null or p[1] <> t.calendar_id::text or p[2] <> t.id::text then raise exception 'INVALID_PATH'; end if;
  if p_source not in ('camera','upload') or (p_source = 'camera') <> (p[3] = 'cam') then raise exception 'INVALID_SOURCE'; end if;
  if p_source = 'upload' and not private.is_admin(u) then raise exception 'FORBIDDEN'; end if;
  if not exists (select 1 from storage.objects where bucket_id = 'checkins' and name = p_path) then raise exception 'FILE_NOT_FOUND'; end if;
  select path into old from task_photos where task_id = tid;
  insert into task_photos(task_id, owner_id, calendar_id, path, source, taken_at)
    values (tid, u, t.calendar_id, p_path, p_source, private.now())
    on conflict (task_id) do update set path = excluded.path, source = excluded.source, taken_at = excluded.taken_at;
  return jsonb_build_object('path', p_path, 'old_path', case when old = p_path then null else old end, 'taken_at', private.now());
end $$;

-- Ảnh của bản thân (tab trong Bộ sưu tập), mới nhất trước
create or replace function public.my_checkins() returns jsonb
language sql stable security definer set search_path = public as
$$
  select coalesce(jsonb_agg(jsonb_build_object('task_id', tp.task_id, 'path', tp.path, 'source', tp.source, 'taken_at', tp.taken_at,
           'day', t.day, 'title', t.title, 'note', t.note, 'calendar_id', t.calendar_id, 'calendar', c.name) order by tp.taken_at desc), '[]')
  from (select * from task_photos where owner_id = auth.uid() order by taken_at desc limit 500) tp
  join tasks t on t.id = tp.task_id join calendars c on c.id = tp.calendar_id
$$;

-- Ảnh check in của các việc trong khoảng ngày (chỉ ảnh của người cùng lịch với mình; RLS của task_photos áp dụng như bảng thường)
create or replace function public.task_photos_range(d1 date, d2 date) returns jsonb
language sql stable security invoker set search_path = public as
$$
  select coalesce(jsonb_agg(jsonb_build_object('task_id', tp.task_id, 'owner_id', tp.owner_id, 'path', tp.path, 'source', tp.source, 'taken_at', tp.taken_at)), '[]')
  from task_photos tp join tasks t on t.id = tp.task_id where t.day between d1 and d2
$$;

revoke execute on all functions in schema private from public, anon;
revoke execute on function public.set_task_photo(uuid, text, text), public.my_checkins(), public.task_photos_range(date, date) from public, anon;
grant execute on function public.set_task_photo(uuid, text, text), public.my_checkins(), public.task_photos_range(date, date) to authenticated;
grant execute on function private.can_read_checkin(text), private.can_write_checkin(text), private.checkin_parts(text) to authenticated;
