-- Colentis · 018 · Album sưu tầm (quà admin): cuốn album có thể tặng qua thư, đọc như sách (lật trang) trong app.
-- Ảnh album ở bucket riêng tư `album` (không commit vào repo); chỉ người đã nhận album mới đọc được ảnh của album đó.

-- ---------- Bucket riêng tư `album` (chủ dự án tải ảnh lên bằng Dashboard: <album_id>/cover.jpg, back.jpg, 03.jpg … ) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('album', 'album', false, 4194304, array['image/jpeg','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- ---------- Bảng ----------
create table public.albums (
  id        text primary key check (id ~ '^[a-z0-9-]{3,40}$'),
  title     text not null,
  subtitle  text not null default '',
  pages     int  not null check (pages between 1 and 60),   -- số ảnh ruột (03..), không tính bìa trước/sau
  active    boolean not null default true
);
create table public.user_albums (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  album_id text not null references public.albums(id) on delete cascade,
  got_at   timestamptz not null default now(),
  source   text not null default 'mail',
  primary key (user_id, album_id)
);
alter table public.albums enable row level security;
alter table public.user_albums enable row level security;
create policy albums_read on public.albums for select to authenticated using (true);
create policy user_albums_own on public.user_albums for select to authenticated using (user_id = auth.uid());
grant select on public.albums, public.user_albums to authenticated;

insert into public.albums(id, title, subtitle, pages) values
  ('greengreen-street', 'GREENGREEN', 'STREET ver.', 20);

-- Album của tôi (kèm thông tin để vẽ kệ)
create or replace function public.my_albums() returns jsonb
language sql stable security definer set search_path = public as
$$
  select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title, 'subtitle', a.subtitle, 'pages', a.pages, 'got_at', ua.got_at) order by ua.got_at), '[]')
  from user_albums ua join albums a on a.id = ua.album_id where ua.user_id = auth.uid()
$$;

-- ---------- Storage: chỉ đọc ảnh của album mình sở hữu ----------
create or replace function private.can_read_album(obj text) returns boolean
language sql stable security definer set search_path = public as
$$
  select auth.uid() is not null and obj ~ '^[a-z0-9-]+/(cover|back|[0-9]{2})\.(jpg|webp)$'
     and exists (select 1 from user_albums where user_id = auth.uid() and album_id = split_part(obj, '/', 1))
$$;
create policy album_read on storage.objects for select to authenticated
  using (bucket_id = 'album' and private.can_read_album(name));

-- ---------- Nhận quà thư + admin gửi thư: thêm quà `album` ----------
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
    elsif typ = 'album' then
      if not exists (select 1 from albums where id = g->>'id' and active) then raise exception 'ALBUM_NOT_FOUND'; end if;
      insert into user_albums(user_id, album_id, source) values (u, g->>'id', 'mail') on conflict do nothing;
      grants := grants || jsonb_build_array(jsonb_build_object('source','admin','album',g->>'id','is_new',found));
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
    elsif typ = 'album' then
      if not exists (select 1 from albums where id = g->>'id' and active) then raise exception 'INVALID_GIFT'; end if;
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

revoke execute on all functions in schema private from public, anon;
revoke execute on function public.my_albums() from public, anon;
grant execute on function public.my_albums() to authenticated;
grant execute on function public.claim_mail(uuid) to authenticated;
grant execute on function public.admin_send_mail(text, text, jsonb, text[], timestamptz) to authenticated;
grant execute on function private.can_read_album(text) to authenticated;
