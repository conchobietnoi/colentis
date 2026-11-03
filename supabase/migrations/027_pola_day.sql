-- Colentis · 027 · POLA DAY (04–08/11/2026): 40 tấm pola, mỗi ngày 8 tấm úp mặt, mặt sau là một việc trên lịch do server xác minh.
-- Làm xong việc (trong khoảng từ ngày của tấm đó tới hôm nay, hạn chót 08/11) thì được rửa. Đủ 8 tấm/ngày: sticker. Đủ 40: danh hiệu pola-day + 4 gói thẻ.
-- Ảnh ở bucket riêng `pola` (tên tệp <id>.webp); chỉ đọc được tấm mình đã rửa, nên tấm chưa rửa không lộ ai.

create table public.pola_items (
  id text primary key, member text not null, day int not null check (day between 1 and 5), slot int not null check (slot between 1 and 8),
  kind text not null, arg text not null, label text not null, unique (day, slot)
);
alter table public.pola_items enable row level security;
revoke all on public.pola_items from anon, authenticated;

create table public.user_pola (
  user_id uuid not null references public.profiles(id) on delete cascade,
  pola_id text not null references public.pola_items(id),
  developed_at timestamptz not null default now(),
  primary key (user_id, pola_id)
);
alter table public.user_pola enable row level security;
create policy user_pola_own on public.user_pola for select to authenticated using (user_id = auth.uid());
grant select on public.user_pola to authenticated;

create table public.pola_rewards (user_id uuid not null references public.profiles(id) on delete cascade, kind text not null, at timestamptz not null default now(), result jsonb, primary key (user_id, kind));
alter table public.pola_rewards enable row level security;
create policy pola_rewards_own on public.pola_rewards for select to authenticated using (user_id = auth.uid());
grant select on public.pola_rewards to authenticated;

insert into public.pola_items(id, member, day, slot, kind, arg, label) values
('seonghyeon-5','seonghyeon',1,1,'n','1','Hoàn thành 1 việc trên lịch'),('keonho-3','keonho',1,2,'tomorrow','1','Thêm 1 việc cho ngày mai'),('martin-4','martin',1,3,'photo','1','Check in ảnh cho 1 việc'),('seonghyeon-2','seonghyeon',1,4,'before','12','Xong 1 việc trước 12 giờ trưa'),('keonho-1','keonho',1,5,'cheer','1','Gửi lời cổ vũ cho 1 người bạn'),('seonghyeon-4','seonghyeon',1,6,'note','1','Xong 1 việc có ghi chú'),('james-3','james',1,7,'timed','1','Đặt giờ cho 1 việc'),('keonho-7','keonho',1,8,'n','3','Hoàn thành 3 việc trong một ngày'),('juhoon-4','juhoon',2,1,'label','Việc nhà','Xong 1 việc nhãn "Việc nhà"'),('seonghyeon-6','seonghyeon',2,2,'shared','1','Xong 1 việc ở lịch chung'),('martin-6','martin',2,3,'photo','1','Check in ảnh cho 1 việc'),('seonghyeon-8','seonghyeon',2,4,'n','2','Hoàn thành 2 việc trong một ngày'),('martin-2','martin',2,5,'after','18','Xong 1 việc sau 6 giờ tối'),('martin-3','martin',2,6,'tomorrow','1','Thêm 1 việc cho ngày mai'),('juhoon-1','juhoon',2,7,'note','1','Xong 1 việc có ghi chú'),('juhoon-3','juhoon',2,8,'n','4','Hoàn thành 4 việc trong một ngày'),('seonghyeon-7','seonghyeon',3,1,'label','Cho người khác','Xong 1 việc nhãn "Cho người khác"'),('james-7','james',3,2,'photo','2','Check in ảnh cho 2 việc'),('keonho-4','keonho',3,3,'timed','1','Đặt giờ cho 1 việc'),('juhoon-2','juhoon',3,4,'before','10','Xong 1 việc trước 10 giờ sáng'),('james-4','james',3,5,'cheer','2','Gửi lời cổ vũ cho 2 người bạn'),('james-8','james',3,6,'after','20','Xong 1 việc sau 8 giờ tối'),('juhoon-8','juhoon',3,7,'shared','1','Xong 1 việc ở lịch chung'),('keonho-2','keonho',3,8,'n','5','Hoàn thành 5 việc trong một ngày'),('james-6','james',4,1,'shared','1','Làm 1 việc cùng nhóm'),('keonho-6','keonho',4,2,'photo','1','Check in ảnh cho 1 việc'),('martin-7','martin',4,3,'before','9','Xong 1 việc trước 9 giờ sáng'),('seonghyeon-1','seonghyeon',4,4,'tomorrow','1','Lên kế hoạch 1 việc cho ngày mai'),('martin-5','martin',4,5,'note','1','Ghi chú cảm xúc cho 1 việc đã xong'),('juhoon-5','juhoon',4,6,'label','Việc nhà','Xong 1 việc nhãn "Việc nhà"'),('seonghyeon-3','seonghyeon',4,7,'after','21','Xong 1 việc sau 9 giờ tối'),('james-5','james',4,8,'n','4','Hoàn thành 4 việc trong một ngày'),('james-1','james',5,1,'label','Việc nhà','Xong 1 việc nhãn "Việc nhà"'),('martin-1','martin',5,2,'photo','2','Check in ảnh cho 2 việc'),('juhoon-7','juhoon',5,3,'shared','1','Xong 1 việc ở lịch chung'),('james-2','james',5,4,'cheer','1','Gửi lời cổ vũ cho 1 người bạn'),('martin-8','martin',5,5,'timed','1','Đặt giờ cho 1 việc'),('keonho-8','keonho',5,6,'label','Cho người khác','Xong 1 việc nhãn "Cho người khác"'),('keonho-5','keonho',5,7,'before','12','Xong 1 việc trước 12 giờ trưa'),('juhoon-6','juhoon',5,8,'n','5','Hoàn thành 5 việc trong một ngày');

create or replace function private.pola_date(d int) returns date language sql immutable as $$ select date '2026-11-03' + d $$;

-- Đã làm xong việc của tấm (d, kind, arg) chưa: tính từ ngày của tấm tới hôm nay (không quá 08/11).
create or replace function private.pola_done(uid uuid, d int, k text, a text) returns boolean
language plpgsql stable security definer set search_path = public as
$$
declare d0 date := private.pola_date(d); d1 date := least(private.today(), date '2026-11-08'); n int := 0;
begin
  if private.today() < d0 then return false; end if;
  if k = 'n' then
    select coalesce(max(c),0) into n from (select count(*) c from task_completions where user_id = uid and vn_day between d0 and d1 group by vn_day) x;
    return n >= a::int;
  elsif k = 'before' then
    return exists (select 1 from task_completions where user_id = uid and vn_day between d0 and d1 and vn_hour < a::int);
  elsif k = 'after' then
    return exists (select 1 from task_completions where user_id = uid and vn_day between d0 and d1 and vn_hour >= a::int);
  elsif k = 'label' then
    return exists (select 1 from task_completions c join tasks t on t.id = c.task_id where c.user_id = uid and c.vn_day between d0 and d1 and t.label = a);
  elsif k = 'shared' then
    return exists (select 1 from task_completions c join tasks t on t.id = c.task_id where c.user_id = uid and c.vn_day between d0 and d1
      and (select count(*) from calendar_members cm where cm.calendar_id = t.calendar_id and cm.left_on is null) >= 2);
  elsif k = 'note' then
    return exists (select 1 from task_completions c join tasks t on t.id = c.task_id where c.user_id = uid and c.vn_day between d0 and d1 and coalesce(btrim(t.note), '') <> '');
  elsif k = 'tomorrow' then
    return exists (select 1 from tasks where owner_id = uid and (created_at at time zone 'Asia/Ho_Chi_Minh')::date between d0 and d1
      and day = (created_at at time zone 'Asia/Ho_Chi_Minh')::date + 1);
  elsif k = 'timed' then
    return exists (select 1 from tasks where owner_id = uid and not all_day and start_time is not null and (updated_at at time zone 'Asia/Ho_Chi_Minh')::date between d0 and d1);
  elsif k = 'photo' then
    select count(*) into n from task_photos where owner_id = uid and (taken_at at time zone 'Asia/Ho_Chi_Minh')::date between d0 and d1;
    return n >= a::int;
  elsif k = 'cheer' then
    select count(*) into n from cheers where from_user = uid and day between d0 and d1;
    return n >= a::int;
  end if;
  return false;
end $$;

create or replace function public.pola_state() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user(); tdy date := private.today();
begin
  return jsonb_build_object(
    'today', tdy, 'start', date '2026-11-04', 'end', date '2026-11-08',
    'items', (select coalesce(jsonb_agg(jsonb_build_object(
        'day', i.day, 'slot', i.slot, 'label', i.label,
        'open', tdy >= private.pola_date(i.day),
        'done', case when up.pola_id is not null then true when tdy >= private.pola_date(i.day) and tdy <= date '2026-11-08' then private.pola_done(u, i.day, i.kind, i.arg) else false end,
        'dev', up.pola_id is not null,
        'id', case when up.pola_id is not null then i.id end,
        'member', case when up.pola_id is not null then i.member end,
        'at', up.developed_at) order by i.day, i.slot), '[]')
      from pola_items i left join user_pola up on up.pola_id = i.id and up.user_id = u),
    'rewards', (select coalesce(jsonb_object_agg(kind, at), '{}') from pola_rewards where user_id = u));
end $$;

create or replace function public.pola_develop(d int, s int) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); it pola_items; tdy date := private.today(); n int; tot int; sticker boolean := false;
        fin jsonb := null; grants jsonb := '[]'; picks text[]; rr text; cid text; res record; sawrare boolean; k int; i int;
begin
  select * into it from pola_items where day = d and slot = s;
  if not found then raise exception 'NOT_FOUND'; end if;
  if tdy < private.pola_date(d) then raise exception 'POLA_LOCKED'; end if;
  if tdy > date '2026-11-08' then raise exception 'POLA_ENDED'; end if;
  if exists (select 1 from user_pola where user_id = u and pola_id = it.id) then raise exception 'POLA_ALREADY'; end if;
  if not private.pola_done(u, d, it.kind, it.arg) then raise exception 'POLA_TASK_NOT_DONE'; end if;
  insert into user_pola(user_id, pola_id) values (u, it.id);
  select count(*) into n from user_pola up join pola_items pi on pi.id = up.pola_id where up.user_id = u and pi.day = d;
  if n = 8 then insert into pola_rewards(user_id, kind) values (u, 'sticker-' || d) on conflict do nothing; sticker := found; end if;
  select count(*) into tot from user_pola where user_id = u;
  if tot = 40 and not exists (select 1 from pola_rewards where user_id = u and kind = 'final') then
    perform private.give_title(u, 'pola-day', 'event');
    for k in 1..4 loop
      picks := '{}'; sawrare := false;
      for i in 1..5 loop
        rr := private.pick_rarity(private.cfg('daily_weights'), u);
        if i = 5 and not sawrare and rr = 'common' then rr := 'rare'; end if;
        if rr <> 'common' then sawrare := true; end if;
        cid := private.pick_card(u, rr, picks); picks := picks || cid;
        select * into res from private.grant_card(u, cid, 'event', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','event','card_id',cid,'is_new',res.is_new,'count',res.cnt,'rarity',rr,'pack',k));
      end loop;
    end loop;
    fin := jsonb_build_object('title', 'pola-day', 'grants', grants);
    insert into pola_rewards(user_id, kind, result) values (u, 'final', fin);
  end if;
  return jsonb_build_object('id', it.id, 'member', it.member, 'day', d, 'slot', s, 'total', tot, 'day_count', n, 'sticker', sticker, 'final', fin);
end $$;

-- ---------- Storage: chỉ đọc ảnh pola mình đã rửa ----------
insert into storage.buckets(id, name, public) values ('pola', 'pola', false) on conflict (id) do nothing;
create or replace function private.can_read_pola(obj text) returns boolean
language sql stable security definer set search_path = public as
$$ select auth.uid() is not null and obj ~ '^[a-z]+-[1-8]\.webp$'
     and exists (select 1 from user_pola where user_id = auth.uid() and pola_id = split_part(obj, '.', 1)) $$;
create policy pola_read on storage.objects for select to authenticated using (bucket_id = 'pola' and private.can_read_pola(name));

revoke execute on function public.pola_state() from public, anon;
revoke execute on function public.pola_develop(int, int) from public, anon;
grant execute on function public.pola_state() to authenticated;
grant execute on function public.pola_develop(int, int) to authenticated;
revoke execute on function private.pola_date(int), private.pola_done(uuid, int, text, text), private.can_read_pola(text) from public, anon;
grant execute on function private.can_read_pola(text) to authenticated;
