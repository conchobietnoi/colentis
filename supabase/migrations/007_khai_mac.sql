-- Colentis · 007 · Sự kiện chào mừng "Khai Mạc" (15–16/10/2026)
-- 5 mốc (1..5 task hoàn thành trong thời gian sự kiện). Mỗi mốc mở 1 thành viên (thứ tự ngẫu nhiên riêng từng người,
-- cố định phía server): bộ khung Limited + thẻ Limited. Đủ 5 mốc: chọn đúng 1 trong 5 pack thẻ tag 1Y.

insert into public.events(id, title, starts_on, ends_on, frame_title, card_count, weights) values
  ('khai-mac-2026', 'Khai Mạc', date '2026-10-15', date '2026-10-16', null, 0, '{}')
on conflict (id) do nothing;

-- Danh hiệu + khung (giữ id kiểu limited-<tên> để frameImg() tìm đúng tệp limited-<tên>-avatar/title.svg)
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('limited-james','Mi Sói','Khai Mạc · mốc quà','supreme','titles/limited-james-avatar.svg','titles/limited-james-title.svg',true,120),
('limited-juhoon','Hân Bống','Khai Mạc · mốc quà','supreme','titles/limited-juhoon-avatar.svg','titles/limited-juhoon-title.svg',true,121),
('limited-keonho','Thằng Bi','Khai Mạc · mốc quà','supreme','titles/limited-keonho-avatar.svg','titles/limited-keonho-title.svg',true,122),
('limited-martin','Tin Tồ','Khai Mạc · mốc quà','supreme','titles/limited-martin-avatar.svg','titles/limited-martin-title.svg',true,123),
('limited-seonghyeon','Em Chíp','Khai Mạc · mốc quà','supreme','titles/limited-seonghyeon-avatar.svg','titles/limited-seonghyeon-title.svg',true,124)
on conflict (id) do nothing;

-- Thẻ: 5 Limited (ngang 3:2) + 5 tag 1Y (dọc, tỉ lệ ảnh gốc 1170x1463). Ảnh thật tải lên bucket `cards` riêng.
insert into public.cards(id, rarity, name, orientation, width, height, event_id, tier, effect, color_a, color_b, storage_path, thumb_path, sort) values
('khaimac-james','event','Mi Sói · James','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-james.webp','thumbs/khaimac-james.webp',10),
('khaimac-juhoon','event','Hân Bống · Juhoon','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-juhoon.webp','thumbs/khaimac-juhoon.webp',11),
('khaimac-keonho','event','Thằng Bi · Keonho','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-keonho.webp','thumbs/khaimac-keonho.webp',12),
('khaimac-martin','event','Tin Tồ · Martin','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-martin.webp','thumbs/khaimac-martin.webp',13),
('khaimac-seonghyeon','event','Em Chíp · Seonghyeon','landscape',1200,800,'khai-mac-2026','LTD','LTD',null,null,'khai-mac/khaimac-seonghyeon.webp','thumbs/khaimac-seonghyeon.webp',14),
('khaimac-1y-martin','event','Tag 1Y · Martin','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-martin.webp','thumbs/khaimac-1y-martin.webp',20),
('khaimac-1y-keonho','event','Tag 1Y · Keonho','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-keonho.webp','thumbs/khaimac-1y-keonho.webp',21),
('khaimac-1y-juhoon','event','Tag 1Y · Juhoon','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-juhoon.webp','thumbs/khaimac-1y-juhoon.webp',22),
('khaimac-1y-seonghyeon','event','Tag 1Y · Seonghyeon','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-seonghyeon.webp','thumbs/khaimac-1y-seonghyeon.webp',23),
('khaimac-1y-james','event','Tag 1Y · James','portrait',1170,1463,'khai-mac-2026','TAG','TAG',null,null,'khai-mac/khaimac-1y-james.webp','thumbs/khaimac-1y-james.webp',24)
on conflict (id) do nothing;

-- Trạng thái sự kiện của từng người (chỉ hàm server đọc/ghi)
create table public.event_perm (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  event_id text not null references public.events(id),
  perm     text[] not null,
  primary key (user_id, event_id)
);
create table public.event_milestones (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  event_id   text not null references public.events(id),
  milestone  integer not null check (milestone between 1 and 5),
  member     text not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, event_id, milestone),
  unique (user_id, event_id, member)
);
create table public.event_packs (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  event_id   text not null references public.events(id),
  member     text not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
alter table public.event_perm       enable row level security;
alter table public.event_milestones enable row level security;
alter table public.event_packs      enable row level security;
revoke all on public.event_perm, public.event_milestones, public.event_packs from anon, authenticated;

-- ---------- Trạng thái ----------
create or replace function public.khai_mac_state() returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); ev events; done int; tdy date := private.today(); pk text;
begin
  select * into ev from events where id = 'khai-mac-2026';
  if not found then return null; end if;
  select count(*) into done from task_completions where user_id = u and vn_day between ev.starts_on and ev.ends_on;
  select member into pk from event_packs where user_id = u and event_id = ev.id;
  return jsonb_build_object(
    'event_id', ev.id, 'starts_on', ev.starts_on, 'ends_on', ev.ends_on, 'today', tdy,
    'active', tdy between ev.starts_on and ev.ends_on, 'done', least(done, 5),
    'claimed', (select coalesce(jsonb_agg(jsonb_build_object('milestone', milestone, 'member', member) order by milestone), '[]')
                from event_milestones where user_id = u and event_id = ev.id),
    'pack', pk);
end $$;

-- ---------- Nhận quà mốc ----------
create or replace function public.claim_khai_mac(m int) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); ev events; done int; pm text[]; mem text; res record; tid text; got text[]; ttl boolean;
        members text[] := array['james','juhoon','keonho','martin','seonghyeon']; ex event_milestones;
begin
  if m is null or m < 1 or m > 5 then raise exception 'INVALID_MILESTONE'; end if;
  select * into ev from events where id = 'khai-mac-2026';
  if not found then raise exception 'EVENT_NOT_FOUND'; end if;
  perform pg_advisory_xact_lock(hashtext('khai-mac:' || u::text));
  select * into ex from event_milestones where user_id = u and event_id = ev.id and milestone = m;
  if found then
    return jsonb_build_object('member', ex.member, 'card_id', 'khaimac-' || ex.member, 'title_id', 'limited-' || ex.member, 'already', true);
  end if;
  if not (private.today() between ev.starts_on and ev.ends_on) then raise exception 'EVENT_ENDED'; end if;
  select count(*) into done from task_completions where user_id = u and vn_day between ev.starts_on and ev.ends_on;
  if done < m then raise exception 'NOT_ENOUGH_TASKS'; end if;
  select perm into pm from event_perm where user_id = u and event_id = ev.id;
  if pm is null then
    select array_agg(x order by random()) into pm from unnest(members) x;
    insert into event_perm(user_id, event_id, perm) values (u, ev.id, pm);
  end if;
  mem := pm[m];
  insert into event_milestones(user_id, event_id, milestone, member) values (u, ev.id, m, mem);
  select * into res from private.grant_card(u, 'khaimac-' || mem, 'event', null, null);
  tid := 'limited-' || mem;
  ttl := private.give_title(u, tid, 'event');
  got := private.check_titles(u);
  return jsonb_build_object('member', mem, 'card_id', 'khaimac-' || mem, 'is_new', coalesce(res.is_new, true), 'count', coalesce(res.cnt, 1),
                            'title_id', tid, 'new_titles', case when ttl then to_jsonb(tid) else '[]'::jsonb end || to_jsonb(got));
end $$;

-- ---------- Quà tổng: chọn đúng 1 pack ----------
create or replace function public.claim_khai_mac_pack(member text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); ev events; n int; res record; ex text;
        members text[] := array['james','juhoon','keonho','martin','seonghyeon'];
begin
  if member is null or member <> all (members) then raise exception 'INVALID_MEMBER'; end if;
  select * into ev from events where id = 'khai-mac-2026';
  if not found then raise exception 'EVENT_NOT_FOUND'; end if;
  perform pg_advisory_xact_lock(hashtext('khai-mac:' || u::text));
  select p.member into ex from event_packs p where p.user_id = u and p.event_id = ev.id;
  if ex is not null then
    return jsonb_build_object('member', ex, 'card_id', 'khaimac-1y-' || ex, 'already', true);
  end if;
  if not (private.today() between ev.starts_on and ev.ends_on) then raise exception 'EVENT_ENDED'; end if;
  select count(*) into n from event_milestones where user_id = u and event_id = ev.id;
  if n < 5 then raise exception 'MILESTONES_INCOMPLETE'; end if;
  insert into event_packs(user_id, event_id, member) values (u, ev.id, member);
  select * into res from private.grant_card(u, 'khaimac-1y-' || member, 'event', null, null);
  return jsonb_build_object('member', member, 'card_id', 'khaimac-1y-' || member, 'is_new', coalesce(res.is_new, true), 'count', coalesce(res.cnt, 1));
end $$;

revoke execute on function public.khai_mac_state(), public.claim_khai_mac(int), public.claim_khai_mac_pack(text) from public, anon;
grant  execute on function public.khai_mac_state(), public.claim_khai_mac(int), public.claim_khai_mac_pack(text) to authenticated;
