-- Colentis · 013 · Mùa Concept giai đoạn 2: nhiệm vụ ngày, pack concept, thẻ concept thường/holo, mở khóa concept,
-- pack thưởng thẻ app, thẻ Ultra Limited, tặng/xin thẻ trùng, thư 18/10 · 21/10 · 24/10.
-- Mọi kết quả (pack, rút thẻ, mở khóa, quà) do server quyết định; client chỉ gọi hàm.

-- ---------- Bucket riêng tư `concept` (ảnh thẻ concept, panorama, video + nhạc Ultra; chủ dự án tải lên bằng Dashboard) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('concept', 'concept', false, 31457280, array['image/webp','video/mp4','audio/mp4'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- ---------- Bảng ----------
create table public.concept_ticks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day_no  int  not null check (day_no between 1 and 31),
  done_at timestamptz not null default now(),
  primary key (user_id, day_no)
);
create table public.concept_packs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  con        int  not null check (con between 1 and 3),
  kind       text not null check (kind in ('daily','bonus')),
  src        text not null,
  created_at timestamptz not null default now(),
  opened_at  timestamptz,
  result     jsonb,
  unique (user_id, src)
);
create index concept_packs_user on public.concept_packs (user_id, created_at);
create table public.concept_cards (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  con      int  not null check (con between 1 and 3),
  slot     int  not null check (slot between 0 and 4),
  holo     boolean not null,
  count    int  not null check (count >= 0),
  first_at timestamptz not null default now(),
  primary key (user_id, con, slot, holo)
);
create table public.concept_unlocks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  con     int  not null check (con between 1 and 3),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, con)
);
create table public.concept_ultra (
  user_id uuid not null references public.profiles(id) on delete cascade,
  n       int  not null check (n in (1,2)),
  songs   int[] not null check (cardinality(songs) = 2 and songs[1] <> songs[2] and songs[1] between 0 and 6 and songs[2] between 0 and 6),
  locked_at timestamptz not null default now(),
  primary key (user_id, n)
);
create table public.concept_gifts (
  id        uuid primary key default gen_random_uuid(),
  from_user uuid not null references public.profiles(id) on delete cascade,
  to_user   uuid not null references public.profiles(id) on delete cascade,
  con int not null check (con between 1 and 3),
  slot int not null check (slot between 0 and 4),
  holo boolean not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);
create index concept_gifts_to on public.concept_gifts (to_user) where claimed_at is null;
create table public.concept_requests (
  from_user uuid not null references public.profiles(id) on delete cascade,  -- người xin
  to_user   uuid not null references public.profiles(id) on delete cascade,  -- người được xin
  con int not null check (con between 1 and 3),
  slot int not null check (slot between 0 and 4),
  holo boolean not null,
  created_at timestamptz not null default now(),
  primary key (from_user, to_user, con, slot, holo),
  check (from_user <> to_user)
);

do $$
declare t text;
begin
  foreach t in array array['concept_ticks','concept_packs','concept_cards','concept_unlocks','concept_ultra','concept_gifts','concept_requests'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;
create policy concept_ticks_own    on public.concept_ticks    for select to authenticated using (user_id = auth.uid());
create policy concept_packs_own    on public.concept_packs    for select to authenticated using (user_id = auth.uid());
create policy concept_cards_own    on public.concept_cards    for select to authenticated using (user_id = auth.uid());
create policy concept_unlocks_own  on public.concept_unlocks  for select to authenticated using (user_id = auth.uid());
create policy concept_ultra_own    on public.concept_ultra    for select to authenticated using (user_id = auth.uid());
create policy concept_gifts_to     on public.concept_gifts    for select to authenticated using (to_user = auth.uid());
create policy concept_requests_rel on public.concept_requests for select to authenticated using (to_user = auth.uid() or from_user = auth.uid());
grant select on public.concept_ticks, public.concept_packs, public.concept_cards, public.concept_unlocks,
  public.concept_ultra, public.concept_gifts, public.concept_requests to authenticated;

-- ---------- Danh hiệu + khung theo concept (khung vẽ bằng HTML/CSS trong app) ----------
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('concept-1','Urichinguchana','Mùa Concept · đủ 5 thẻ thường concept 1','supreme','html:concept-1','html:concept-1',true,140),
('concept-2','Aniyaaa','Mùa Concept · đủ 5 thẻ thường concept 2','supreme','html:concept-2','html:concept-2',true,141),
('concept-3','Poyoyoi','Mùa Concept · đủ 5 thẻ thường concept 3','supreme','html:concept-3','html:concept-3',true,142)
on conflict (id) do nothing;

-- ---------- Thư: nhãn + thư phát cho mọi người theo lịch ----------
alter table public.mails add column if not exists tag text check (char_length(tag) <= 24);
alter table public.mails add column if not exists tag_color text check (tag_color ~ '^#[0-9A-Fa-f]{6}$');
alter table public.mails add column if not exists summary text check (char_length(summary) <= 120);
alter table public.mails add column if not exists broadcast_at timestamptz;  -- có giá trị: phát cho mọi người dùng (kể cả người vào sau)

-- ---------- Hàm nội bộ ----------
create or replace function private.concept_eid() returns text language sql immutable as $$ select 'mua-concept-2026'::text $$;

-- Số ngày của sự kiện hôm nay (1..9) hoặc null nếu ngoài thời gian.
create or replace function private.concept_day() returns int
language sql stable security definer set search_path = public as
$$ select day_no from event_days where event_id = private.concept_eid() and on_date = private.today() $$;

create or replace function private.concept_add_card(uid uuid, c int, s int, h boolean, out is_new boolean, out cnt int)
language plpgsql volatile security definer set search_path = public as
$$
begin
  insert into concept_cards(user_id, con, slot, holo, count, first_at) values (uid, c, s, h, 1, private.now())
  on conflict (user_id, con, slot, holo) do update set count = concept_cards.count + 1
  returning count into cnt;
  is_new := (cnt = 1);
end $$;

-- Mở khóa mọi concept vừa đủ 5 thẻ thường: panorama, khung + danh hiệu, 1 pack thưởng (thẻ app). Trả về danh sách concept vừa mở.
create or replace function private.concept_check_unlock(uid uuid) returns int[]
language plpgsql volatile security definer set search_path = public as
$$
declare c int; got int[] := '{}'; ins int;
begin
  for c in 1..3 loop
    continue when exists (select 1 from concept_unlocks where user_id = uid and con = c);
    continue when (select count(*) from concept_cards where user_id = uid and con = c and not holo and count > 0) < 5;
    insert into concept_unlocks(user_id, con, unlocked_at) values (uid, c, private.now()) on conflict do nothing;
    get diagnostics ins = row_count;
    continue when ins = 0;
    insert into concept_packs(user_id, con, kind, src) values (uid, c, 'bonus', 'bonus:' || c) on conflict do nothing;
    perform private.give_title(uid, 'concept-' || c, 'event');
    update profiles set equipped_title = 'concept-' || c where id = uid;  -- mặc định dùng khung mới nhất (đổi được ở Hồ sơ)
    perform private.notify(uid, 'concept_unlock', jsonb_build_object('con', c), 'concept_unlock:' || c);
    got := got || c;
  end loop;
  return got;
end $$;

create or replace function private.concept_related(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select private.are_friends(a, b) or private.shares_calendar(a, b) $$;

-- ---------- RPC ----------
-- Toàn bộ trạng thái Mùa Concept của người dùng.
create or replace function public.concept_state() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  return jsonb_build_object(
    'day', private.concept_day(),
    'today', private.today(),
    'ticks', (select coalesce(jsonb_agg(day_no order by day_no), '[]') from concept_ticks where user_id = u),
    'packs', (select coalesce(jsonb_agg(jsonb_build_object('id', id, 'con', con, 'kind', kind) order by created_at, id), '[]')
                from concept_packs where user_id = u and opened_at is null),
    'cards', (select coalesce(jsonb_agg(jsonb_build_object('con', con, 'slot', slot, 'holo', holo, 'count', count, 'first_at', first_at)), '[]')
                from concept_cards where user_id = u and count > 0),
    'unlocks', (select coalesce(jsonb_agg(con order by con), '[]') from concept_unlocks where user_id = u),
    'ultra', (select coalesce(jsonb_agg(jsonb_build_object('n', n, 'songs', songs) order by n), '[]') from concept_ultra where user_id = u),
    'gifts', (select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'from', g.from_user, 'name', p.display_name, 'con', g.con, 'slot', g.slot, 'holo', g.holo, 'at', g.created_at) order by g.created_at), '[]')
                from concept_gifts g join profiles p on p.id = g.from_user where g.to_user = u and g.claimed_at is null),
    'asks_in', (select coalesce(jsonb_agg(jsonb_build_object('from', r.from_user, 'name', p.display_name, 'con', r.con, 'slot', r.slot, 'holo', r.holo)), '[]')
                from concept_requests r join profiles p on p.id = r.from_user where r.to_user = u),
    'asks_out', (select coalesce(jsonb_agg(jsonb_build_object('to', r.to_user, 'name', p.display_name, 'con', r.con, 'slot', r.slot, 'holo', r.holo)), '[]')
                from concept_requests r join profiles p on p.id = r.to_user where r.from_user = u),
    'bonus_recent', (select coalesce(jsonb_agg(x), '[]') from (
                select jsonb_array_elements(result) x from (select result from concept_packs
                  where user_id = u and kind = 'bonus' and opened_at is not null order by opened_at desc limit 2) s
              ) t),
    'opened', jsonb_build_object(
      'daily', (select count(*) from concept_packs where user_id = u and kind = 'daily' and opened_at is not null),
      'bonus', (select count(*) from concept_packs where user_id = u and kind = 'bonus' and opened_at is not null)));
end $$;

-- Nhiệm vụ của ngày hôm nay: bấm xong thì nhận 2 pack của concept ngày đó (mỗi ngày một lần, chỉ trong đúng ngày).
create or replace function public.concept_tick() returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); d int := private.concept_day(); c int; ins int;
begin
  if d is null then raise exception 'OUT_OF_EVENT'; end if;
  insert into concept_ticks(user_id, day_no, done_at) values (u, d, private.now()) on conflict do nothing;
  get diagnostics ins = row_count;
  if ins = 0 then raise exception 'ALREADY_DONE'; end if;
  select concept into c from event_days where event_id = private.concept_eid() and day_no = d;
  insert into concept_packs(user_id, con, kind, src) values (u, c, 'daily', 'task:' || d || ':1'), (u, c, 'daily', 'task:' || d || ':2');
  return public.concept_state();
end $$;

-- Mở pack cũ nhất (hoặc pack chỉ định). Pack concept: 5 thẻ, thường 16% mỗi thẻ, holo 4% mỗi thẻ. Pack thưởng: 5 thẻ app.
create or replace function public.concept_open_pack(pack_id uuid default null) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); pk concept_packs; i int; r numeric; s int; h boolean; res record; out jsonb := '[]';
        rar text; cid text; unl int[]; ttl text[]; before int;
begin
  select * into pk from concept_packs
   where user_id = u and opened_at is null and (pack_id is null or id = pack_id)
   order by created_at, id limit 1 for update;
  if not found then raise exception 'NO_PACK'; end if;

  if pk.kind = 'bonus' then
    for i in 1..5 loop
      rar := private.pick_rarity(private.cfg('daily_weights'), u);
      cid := private.pick_card(u, rar);
      select * into res from private.grant_card(u, cid, 'event', null, null);
      out := out || jsonb_build_array(jsonb_build_object('card_id', cid, 'rarity', rar, 'is_new', res.is_new, 'count', res.cnt));
    end loop;
    update concept_packs set opened_at = private.now(), result = out where id = pk.id;
    ttl := private.check_titles(u);
    return jsonb_build_object('pack', jsonb_build_object('id', pk.id, 'con', pk.con, 'kind', pk.kind), 'app', out,
                              'unlocked', '[]'::jsonb, 'new_titles', to_jsonb(ttl));
  end if;

  for i in 1..5 loop
    r := random() * 100;
    if r < 80 then h := false; s := least(4, floor(r / 16)::int); else h := true; s := least(4, floor((r - 80) / 4)::int); end if;
    select * into res from private.concept_add_card(u, pk.con, s, h);
    out := out || jsonb_build_array(jsonb_build_object('con', pk.con, 'slot', s, 'holo', h, 'is_new', res.is_new, 'count', res.cnt));
  end loop;
  update concept_packs set opened_at = private.now(), result = out where id = pk.id;
  unl := private.concept_check_unlock(u);
  return jsonb_build_object('pack', jsonb_build_object('id', pk.id, 'con', pk.con, 'kind', pk.kind), 'cards', out, 'unlocked', to_jsonb(unl));
end $$;

-- Tặng thẻ trùng cho bạn bè / người chung lịch: luôn giữ lại ít nhất 1 bản; mỗi người nhận 1 bản.
create or replace function public.concept_give(to_ids uuid[], c int, s int, h boolean) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); cur int; n int; t uuid; nm text; cnames text[] := array['Urichinguchana','Aniyaaa','Poyoyoi'];
begin
  n := coalesce(cardinality(to_ids), 0);
  if n = 0 or n > 20 then raise exception 'INVALID_RECIPIENTS'; end if;
  if c not between 1 and 3 or s not between 0 and 4 then raise exception 'INVALID_CARD'; end if;
  if (select count(distinct x) from unnest(to_ids) x) <> n or u = any (to_ids) then raise exception 'INVALID_RECIPIENTS'; end if;
  foreach t in array to_ids loop
    if not private.concept_related(u, t) then raise exception 'FORBIDDEN'; end if;
  end loop;
  select count into cur from concept_cards where user_id = u and con = c and slot = s and holo = h for update;
  if coalesce(cur, 0) - n < 1 then raise exception 'NOT_ENOUGH_SPARE'; end if;
  update concept_cards set count = count - n where user_id = u and con = c and slot = s and holo = h;
  select display_name into nm from profiles where id = u;
  foreach t in array to_ids loop
    insert into concept_gifts(from_user, to_user, con, slot, holo, created_at) values (u, t, c, s, h, private.now());
    delete from concept_requests where from_user = t and to_user = u and con = c and slot = s and holo = h;
    perform private.notify(t, 'concept_gift', jsonb_build_object('from', u, 'name', nm, 'con', c, 'slot', s, 'holo', h));
  end loop;
  return public.concept_state();
end $$;

-- Xin thẻ còn thiếu (chưa có bản nào). Người kia nhận thông báo và tự quyết định có tặng không.
create or replace function public.concept_ask(from_ids uuid[], c int, s int, h boolean) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); n int; t uuid; nm text; ins int;
begin
  n := coalesce(cardinality(from_ids), 0);
  if n = 0 or n > 20 then raise exception 'INVALID_RECIPIENTS'; end if;
  if c not between 1 and 3 or s not between 0 and 4 then raise exception 'INVALID_CARD'; end if;
  if u = any (from_ids) then raise exception 'INVALID_RECIPIENTS'; end if;
  if exists (select 1 from concept_cards where user_id = u and con = c and slot = s and holo = h and count > 0) then raise exception 'ALREADY_OWNED'; end if;
  if (select count(*) from concept_requests where from_user = u) + n > 60 then raise exception 'TOO_MANY_REQUESTS'; end if;
  select display_name into nm from profiles where id = u;
  foreach t in array from_ids loop
    if not private.concept_related(u, t) then raise exception 'FORBIDDEN'; end if;
    insert into concept_requests(from_user, to_user, con, slot, holo, created_at) values (u, t, c, s, h, private.now()) on conflict do nothing;
    get diagnostics ins = row_count;
    if ins > 0 then
      perform private.notify(t, 'concept_ask', jsonb_build_object('from', u, 'name', nm, 'con', c, 'slot', s, 'holo', h));
    end if;
  end loop;
  return public.concept_state();
end $$;

-- Nhận thẻ bạn bè tặng (một người gửi, hoặc tất cả khi from_id null). Mỗi quà chỉ nhận một lần.
create or replace function public.concept_claim_gifts(from_id uuid default null) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); g record; res record; out jsonb := '[]'; unl int[];
begin
  for g in select * from concept_gifts where to_user = u and claimed_at is null and (from_id is null or from_user = from_id)
           order by created_at, id for update loop
    update concept_gifts set claimed_at = private.now() where id = g.id;
    select * into res from private.concept_add_card(u, g.con, g.slot, g.holo);
    out := out || jsonb_build_array(jsonb_build_object('con', g.con, 'slot', g.slot, 'holo', g.holo, 'is_new', res.is_new, 'count', res.cnt,
                                    'from', g.from_user, 'from_name', (select display_name from profiles where id = g.from_user)));
  end loop;
  if jsonb_array_length(out) = 0 then raise exception 'NO_GIFT'; end if;
  unl := private.concept_check_unlock(u);
  return jsonb_build_object('cards', out, 'unlocked', to_jsonb(unl));
end $$;

-- Khóa 2 bài hát vào thẻ Ultra (n = 1 hoặc 2). Cần đủ 3 concept. Khóa rồi không đổi được.
create or replace function public.concept_ultra_lock(n int, songs int[]) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if n not in (1, 2) then raise exception 'INVALID_ULTRA'; end if;
  if (select count(*) from concept_unlocks where user_id = u) < 3 then raise exception 'NEED_ALL_CONCEPTS'; end if;
  if songs is null or cardinality(songs) <> 2 or songs[1] = songs[2] or songs[1] not between 0 and 6 or songs[2] not between 0 and 6 then raise exception 'INVALID_SONGS'; end if;
  begin
    insert into concept_ultra(user_id, n, songs, locked_at) values (u, n, songs, private.now());
  exception when unique_violation then raise exception 'ALREADY_LOCKED'; end;
  return public.concept_state();
end $$;

-- Danh sách người có thể tặng / xin (bạn bè + người chung lịch).
create or replace function public.concept_people() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  return (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'name', p.display_name, 'username', p.username) order by p.display_name), '[]')
            from profiles p where p.id <> u and private.concept_related(u, p.id));
end $$;

-- ---------- Nhận quà thư: thêm concept_pack; stash_pack cũ quy đổi thành pack concept 1 ----------
create or replace function public.claim_mail(mid uuid) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mr mail_recipients; m mails; g jsonb; typ text; qty int; i int; cid text; res record;
        grants jsonb := '[]'; titles jsonb := '[]'; rescue_add int := 0; p profiles; picks text[]; rars text[]; rr text; ev events; got text[];
        wn text; wtitle text; sawrare boolean := false; tries int; result jsonb; pc int;
begin
  select * into mr from mail_recipients where mail_id = mid and user_id = u and deliver_at <= private.now() for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if mr.claimed_at is not null then return mr.claim_result; end if;
  select * into m from mails where id = mid;
  select * into p from profiles where id = u;

  for g in select * from jsonb_array_elements(m.gifts) loop
    typ := g->>'type';
    qty := greatest(1, least(coalesce((g->>'qty')::int, 1), 5));
    if typ = 'card' then
      for i in 1..qty loop
        rr := coalesce(nullif(g->>'rarity', 'any'), private.pick_rarity(private.cfg('daily_weights'), u));
        cid := private.pick_card(u, rr);
        select * into res from private.grant_card(u, cid, 'admin', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
      end loop;
    elsif typ = 'card_id' then
      cid := g->>'id';
      if not exists (select 1 from cards where id = cid and active) then raise exception 'CARD_NOT_FOUND'; end if;
      select * into res from private.grant_card(u, cid, 'admin', null, null);
      grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt));
    elsif typ = 'rescue' then
      rescue_add := rescue_add + qty;
    elsif typ = 'title' then
      if private.give_title(u, g->>'id', 'admin') then titles := titles || to_jsonb(g->>'id'); end if;
    elsif typ = 'welcome' then
      wn := p.welcome_member;
      if wn is null then raise exception 'CHOOSE_MEMBER_FIRST'; end if;
      wtitle := 'welcome-' || (array_position(array['juhoon','keonho','martin','seonghyeon','james'], wn));
      picks := '{}'; rars := '{}';
      for i in 1..5 loop
        tries := 0;
        loop
          rr := private.pick_rarity(private.cfg('welcome_weights'), u);
          cid := private.pick_card(u, rr, picks);
          exit when cid <> all (picks) or tries > 20;
          tries := tries + 1;
        end loop;
        picks := picks || cid; rars := rars || rr;
      end loop;
      if not exists (select 1 from unnest(rars) x where x <> 'common') then
        i := array_position(rars, 'common');
        cid := private.pick_card(u, 'rare', picks);
        picks[i] := cid; rars[i] := 'rare';
      end if;
      for i in 1..5 loop
        select * into res from private.grant_card(u, picks[i], 'welcome', null, null);
        grants := grants || jsonb_build_array(jsonb_build_object('source','welcome','card_id',picks[i],'is_new',res.is_new,'count',res.cnt,'rarity',rars[i]));
      end loop;
      rescue_add := rescue_add + 2;
      if private.give_title(u, wtitle, 'welcome') then titles := titles || to_jsonb(wtitle); end if;
    elsif typ = 'event' then
      select * into ev from events where id = g->>'id';
      if not found then raise exception 'EVENT_NOT_FOUND'; end if;
      insert into event_claims(user_id, event_id) values (u, ev.id) on conflict do nothing;
      if found then
        picks := private.draw_weighted_event(u, ev, ev.card_count);
        foreach cid in array picks loop
          select * into res from private.grant_card(u, cid, 'event', null, null);
          grants := grants || jsonb_build_array(jsonb_build_object('source','event','card_id',cid,'is_new',res.is_new,'count',res.cnt));
        end loop;
        if ev.frame_title is not null and private.give_title(u, ev.frame_title, 'event') then titles := titles || to_jsonb(ev.frame_title); end if;
      end if;
    elsif typ = 'id_card' then
      insert into id_cards(user_id) values (u) on conflict do nothing;
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','id_card',true));
    elsif typ = 'id_frame' then
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','id_frame',true));
    elsif typ = 'concept_pack' or typ = 'stash_pack' then
      pc := coalesce((g->>'con')::int, 1);
      if pc not between 1 and 3 then raise exception 'INVALID_GIFT'; end if;
      for i in 1..(case when typ = 'concept_pack' then qty else 1 end) loop
        insert into concept_packs(user_id, con, kind, src) values (u, pc, 'daily', 'mail:' || mid || ':' || i) on conflict do nothing;
      end loop;
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','concept_pack',pc,'qty',case when typ = 'concept_pack' then qty else 1 end));
    else
      raise exception 'UNKNOWN_GIFT';
    end if;
  end loop;

  if rescue_add > 0 then update profiles set rescue_bonus = rescue_bonus + rescue_add where id = u; end if;
  got := private.check_titles(u);
  result := jsonb_build_object('grants', grants, 'new_titles', titles || to_jsonb(got), 'rescue_added', rescue_add);
  update mail_recipients set claimed_at = private.now(), read_at = coalesce(read_at, private.now()), claim_result = result
   where mail_id = mid and user_id = u;
  return result;
end $$;

-- Admin gửi thư: thêm quà pack concept.
create or replace function public.admin_send_mail(title text, body text, gifts jsonb, usernames text[] default null, at timestamptz default null) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mid uuid; g jsonb; ids uuid[]; n int; typ text; missing text[]; deliver timestamptz := coalesce(at, private.now());
begin
  if not private.is_admin(u) then raise exception 'FORBIDDEN'; end if;
  if char_length(btrim(title)) not between 1 and 60 then raise exception 'INVALID_TITLE'; end if;
  if char_length(body) > 600 then raise exception 'INVALID_BODY'; end if;
  if jsonb_typeof(gifts) <> 'array' or jsonb_array_length(gifts) > 4 then raise exception 'TOO_MANY_GIFTS'; end if;
  for g in select * from jsonb_array_elements(gifts) loop
    typ := g->>'type';
    if typ = 'card' then
      if coalesce(g->>'rarity','any') not in ('any','common','rare','legendary','supreme') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'card_id' then
      if not exists (select 1 from cards where id = g->>'id') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'rescue' then
      if coalesce((g->>'qty')::int, 0) not between 1 and 5 then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'title' then
      if not exists (select 1 from titles where id = g->>'id') then raise exception 'INVALID_GIFT'; end if;
    elsif typ = 'concept_pack' then
      if coalesce((g->>'con')::int, 0) not between 1 and 3 or coalesce((g->>'qty')::int, 1) not between 1 and 5 then raise exception 'INVALID_GIFT'; end if;
    else raise exception 'INVALID_GIFT'; end if;
  end loop;
  if usernames is null or cardinality(usernames) = 0 then
    select array_agg(id) into ids from profiles;
  else
    select array_agg(id) into ids from profiles where username = any (select lower(x) from unnest(usernames) x);
    select array_agg(x) into missing from unnest(usernames) x where not exists (select 1 from profiles where username = lower(x));
    if missing is not null then raise exception 'UNKNOWN_USERNAMES:%', array_to_string(missing, ','); end if;
  end if;
  insert into mails(kind, title, body, gifts, sender) values ('admin', btrim(title), body, gifts, u) returning id into mid;
  insert into mail_recipients(mail_id, user_id, deliver_at) select mid, x, deliver from unnest(ids) x;
  get diagnostics n = row_count;
  insert into notifications(user_id, kind, payload, created_at)
    select x, 'mail', jsonb_build_object('mail_id', mid, 'title', btrim(title)), deliver from unnest(ids) x;
  return jsonb_build_object('mail_id', mid, 'recipients', n);
end $$;

-- Đăng nhập: giao thư sự kiện và các thư phát chung (kể cả thư hẹn giờ cho người vào sau).
create or replace function public.ensure_login_events() returns int
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); e record; b record; n int := 0; tdy date := private.today();
begin
  for e in select * from events where mail_id is not null and tdy between starts_on and ends_on loop
    insert into mail_recipients(mail_id, user_id, deliver_at) values (e.mail_id, u, private.now()) on conflict do nothing;
    if found then n := n + 1; end if;
  end loop;
  for b in select id, broadcast_at from mails where broadcast_at is not null loop
    insert into mail_recipients(mail_id, user_id, deliver_at) values (b.id, u, b.broadcast_at) on conflict do nothing;
  end loop;
  return n;
end $$;

-- ---------- Nội dung thư theo thiết kế ----------
update public.mails set
  body = E'Mùa Concept kéo dài 9 ngày với 3 concept: Urichinguchana (ngày 1–3), Aniyaaa (ngày 4–6) và Poyoyoi (ngày 7–9).\n\nMỗi ngày hoàn thành nhiệm vụ của concept để nhận 2 pack, mỗi pack 5 thẻ. Thẻ nào của bạn thì bạn tự rút. Thẻ trùng thì tặng được cho bạn bè, và bạn cũng có thể xin thẻ còn thiếu.\n\nĐủ 5 thẻ thường: mở panorama, khung tròn, danh hiệu và 1 pack thưởng thẻ app. Đủ cả 3 concept: nhận 2 thẻ Ultra Limited, tự chọn bài hát cho mỗi thẻ.',
  gifts = '[{"type":"id_card"},{"type":"id_frame"},{"type":"concept_pack","con":1,"qty":1}]',
  tag = 'SỰ KIỆN MỚI', tag_color = '#FFB02E', summary = 'Gom thẻ, ghép panorama, nhận 2 thẻ Ultra Limited.'
 where kind = 'event' and event_id = 'mua-concept-2026';

-- Quà thư cũ (pack lưu chờ) → pack concept 1 chưa mở.
insert into public.concept_packs(user_id, con, kind, src)
  select user_id, 1, 'daily', 'mail:legacy:' || item from public.event_stash
   where event_id = 'mua-concept-2026' and opened_at is null
on conflict do nothing;
update public.event_stash set opened_at = now() where event_id = 'mua-concept-2026' and opened_at is null;

do $$
declare mid uuid; t record;
begin
  for t in select * from (values
    ('Aniyaaa đã lên sàn', E'Từ hôm nay đến ngày 6, nhiệm vụ hằng ngày cho pack của Aniyaaa. Concept cũ vẫn mở, bạn có thể gom nốt thẻ còn thiếu.',
       '[{"type":"concept_pack","con":2,"qty":1}]'::jsonb, 'MỞ KHÓA', '#FF2E88', timestamptz '2026-10-21 00:00:00+07', 'Concept thứ hai mở từ hôm nay.'),
    ('Poyoyoi · concept cuối', E'Đây là concept cuối cùng của mùa. Hoàn thành cả ba concept để nhận 2 thẻ Ultra Limited có nhạc và video.',
       '[{"type":"concept_pack","con":3,"qty":1}]'::jsonb, 'MỞ KHÓA', '#4CC9FF', timestamptz '2026-10-24 00:00:00+07', 'Hoàn thành cả ba để nhận 2 thẻ Ultra.'),
    ('Sự kiện bí mật · 01/11', E'Sau Mùa Concept sẽ có sự kiện mới vào 01/11. Hiện chỉ biết nó liên quan đến Lịch.\n\nThông tin đầy đủ sẽ được gửi vào hòm thư này khi tới ngày.',
       '[]'::jsonb, 'SẮP TỚI', '#B79CFF', timestamptz '2026-10-18 00:00:00+07', 'Chỉ biết nó liên quan đến Lịch.')
  ) as v(title, body, gifts, tag, color, at, summary) loop
    insert into public.mails(kind, title, body, gifts, event_id, tag, tag_color, summary, broadcast_at)
      values ('news', t.title, t.body, t.gifts, 'mua-concept-2026', t.tag, t.color, t.summary, t.at) returning id into mid;
    insert into public.mail_recipients(mail_id, user_id, deliver_at) select mid, id, t.at from public.profiles on conflict do nothing;
    insert into public.notifications(user_id, kind, payload, created_at)
      select id, 'mail', jsonb_build_object('mail_id', mid, 'title', t.title), t.at from public.profiles;
  end loop;
end $$;

-- ---------- Storage: đọc có điều kiện ----------
create or replace function private.can_read_concept(obj text) returns boolean
language sql stable security definer set search_path = public as
$$
  select case
    when obj ~ '^c[1-3]-[0-4]\.webp$' then true
    when obj ~ '^ultra-[12]\.webp$' then true
    when obj ~ '^pano-[1-3]\.webp$' then true      -- panorama hiện sẵn dưới các dải che; dải mở dần khi gom thẻ
    when obj ~ '^(ultra-[12]\.mp4|songs/[0-6]\.m4a)$' then (select count(*) from concept_unlocks where user_id = auth.uid()) = 3
    else false end
$$;
grant execute on function private.can_read_concept(text) to authenticated;
create policy concept_read on storage.objects for select to authenticated
  using (bucket_id = 'concept' and private.can_read_concept(name));

-- ---------- Quyền + realtime ----------
revoke execute on all functions in schema private from public, anon;
revoke execute on function public.concept_state(), public.concept_tick(), public.concept_open_pack(uuid), public.concept_give(uuid[], int, int, boolean),
  public.concept_ask(uuid[], int, int, boolean), public.concept_claim_gifts(uuid), public.concept_ultra_lock(int, int[]), public.concept_people() from public, anon;
grant execute on function public.concept_state(), public.concept_tick(), public.concept_open_pack(uuid), public.concept_give(uuid[], int, int, boolean),
  public.concept_ask(uuid[], int, int, boolean), public.concept_claim_gifts(uuid), public.concept_ultra_lock(int, int[]), public.concept_people() to authenticated;
grant execute on function public.claim_mail(uuid), public.ensure_login_events() to authenticated;
grant execute on function public.admin_send_mail(text, text, jsonb, text[], timestamptz) to authenticated;
grant execute on function private.can_read_concept(text) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.concept_packs, public.concept_gifts, public.concept_requests;
  end if;
end $$;
