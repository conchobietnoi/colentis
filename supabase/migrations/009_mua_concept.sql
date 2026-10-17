-- Colentis · 009 · Mùa Concept (18–26/10/2026): thư giới thiệu, thẻ ID Colentis, khung thẻ ID, pack lưu chờ mở
-- Phạm vi giai đoạn này: thư + quà đính kèm (thẻ ID trống, khung, 1 pack khai mạc lưu vào sự kiện).
-- Thẻ concept, pack hằng ngày, panorama, Ultra là giai đoạn sau.

-- ---------- Thẻ ID: mỗi người đúng 1 thẻ ----------
create table public.id_cards (
  user_id    uuid primary key references public.profiles(id) on delete cascade,
  member     text check (member in ('james','juhoon','keonho','martin','seonghyeon')),
  holder     text check (char_length(holder) <= 20),
  photo_path text,
  crop       jsonb not null default '{"z":1,"x":50,"y":50}',
  granted_at timestamptz not null default now(),
  locked_at  timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.id_cards enable row level security;
revoke all on public.id_cards from anon, authenticated;
create policy id_cards_own on public.id_cards for select to authenticated using (user_id = auth.uid());
grant select on public.id_cards to authenticated;

-- Pack/quà lưu vào sự kiện để mở sau (mở bằng hàm của giai đoạn sự kiện).
create table public.event_stash (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  event_id  text not null references public.events(id),
  item      text not null,
  opens_on  date not null,
  opened_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id, item)
);
alter table public.event_stash enable row level security;
revoke all on public.event_stash from anon, authenticated;
create policy event_stash_own on public.event_stash for select to authenticated using (user_id = auth.uid());
grant select on public.event_stash to authenticated;

-- ---------- Danh hiệu + khung thẻ ID (khung vẽ bằng HTML/CSS trong app, không phải SVG) ----------
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('idcard-james','Triệu Vũ Phàm','Thẻ ID Colentis · James, có ảnh và tên','supreme','html:idcard-james','html:idcard-james',true,130),
('idcard-juhoon','Kim Chu Huân','Thẻ ID Colentis · Juhoon, có ảnh và tên','supreme','html:idcard-juhoon','html:idcard-juhoon',true,131),
('idcard-keonho','An Kiến Huy','Thẻ ID Colentis · Keonho, có ảnh và tên','supreme','html:idcard-keonho','html:idcard-keonho',true,132),
('idcard-martin','Phan Mạnh Tiến','Thẻ ID Colentis · Martin, có ảnh và tên','supreme','html:idcard-martin','html:idcard-martin',true,133),
('idcard-seonghyeon','Nghiêm Sơn Hoàng','Thẻ ID Colentis · Seonghyeon, có ảnh và tên','supreme','html:idcard-seonghyeon','html:idcard-seonghyeon',true,134)
on conflict (id) do nothing;

-- Mở khung khi thẻ có đủ thành viên + ảnh + tên.
create or replace function private.sync_idcard_frame(uid uuid) returns boolean
language plpgsql volatile security definer set search_path = public as
$$
declare c id_cards;
begin
  select * into c from id_cards where user_id = uid;
  if not found or c.member is null or c.photo_path is null or c.holder is null or btrim(c.holder) = '' then return false; end if;
  return private.give_title(uid, 'idcard-' || c.member, 'event');
end $$;

-- ---------- RPC ----------
create or replace function public.my_id_card() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user(); c id_cards;
begin
  select * into c from id_cards where user_id = u;
  if not found then return null; end if;
  return jsonb_build_object('member', c.member, 'holder', c.holder, 'photo_path', c.photo_path, 'crop', c.crop,
    'granted_at', c.granted_at, 'locked', c.member is not null,
    'frame', c.member is not null and c.photo_path is not null and nullif(btrim(coalesce(c.holder,'')), '') is not null,
    'serial', 'CLN-26-' || upper(left(coalesce(c.member, 'xx'), 2)) || '-' || lpad(((extract(epoch from c.granted_at))::bigint % 10000)::text, 4, '0'));
end $$;

create or replace function public.id_card_choose(m text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); c id_cards;
begin
  if m is null or m not in ('james','juhoon','keonho','martin','seonghyeon') then raise exception 'INVALID_MEMBER'; end if;
  select * into c from id_cards where user_id = u for update;
  if not found then raise exception 'NO_ID_CARD'; end if;
  if c.member is not null then raise exception 'ALREADY_CHOSEN'; end if;
  update id_cards set member = m, locked_at = private.now(), updated_at = private.now() where user_id = u;
  perform private.sync_idcard_frame(u);
  return public.my_id_card();
end $$;

create or replace function public.id_card_save(p_holder text, p_photo text, p_crop jsonb) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); c id_cards; h text := nullif(btrim(coalesce(p_holder, '')), ''); z numeric; x numeric; y numeric;
begin
  select * into c from id_cards where user_id = u for update;
  if not found then raise exception 'NO_ID_CARD'; end if;
  if h is not null and char_length(h) > 20 then raise exception 'INVALID_HOLDER'; end if;
  if p_photo is not null and (p_photo not like u::text || '/idcard-%' or char_length(p_photo) > 120) then raise exception 'INVALID_PHOTO'; end if;
  z := coalesce((p_crop->>'z')::numeric, 1); x := coalesce((p_crop->>'x')::numeric, 50); y := coalesce((p_crop->>'y')::numeric, 50);
  if z < 1 or z > 3 or x < 0 or x > 100 or y < 0 or y > 100 then raise exception 'INVALID_CROP'; end if;
  update id_cards set holder = h, photo_path = coalesce(p_photo, photo_path), crop = jsonb_build_object('z', z, 'x', x, 'y', y), updated_at = private.now() where user_id = u;
  perform private.sync_idcard_frame(u);
  return public.my_id_card();
end $$;

revoke execute on function public.my_id_card(), public.id_card_choose(text), public.id_card_save(text, text, jsonb) from public, anon;
grant  execute on function public.my_id_card(), public.id_card_choose(text), public.id_card_save(text, text, jsonb) to authenticated;
revoke execute on function private.sync_idcard_frame(uuid) from public, anon;

-- ---------- Nhận quà thư: thêm loại quà id_card, id_frame, stash_pack ----------
create or replace function public.claim_mail(mid uuid) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); mr mail_recipients; m mails; g jsonb; typ text; qty int; i int; cid text; res record;
        grants jsonb := '[]'; titles jsonb := '[]'; rescue_add int := 0; p profiles; picks text[]; rars text[]; rr text; ev events; got text[];
        wn text; wtitle text; sawrare boolean := false; tries int; result jsonb;
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
      -- Khung đi kèm thẻ ID: mở khi thẻ có thành viên, ảnh và tên (xem private.sync_idcard_frame).
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','id_frame',true));
    elsif typ = 'stash_pack' then
      insert into event_stash(user_id, event_id, item, opens_on) values (u, coalesce(g->>'event', 'mua-concept-2026'), coalesce(g->>'id', 'pack-1'), coalesce((g->>'opens_on')::date, date '2026-10-18'))
        on conflict do nothing;
      grants := grants || jsonb_build_array(jsonb_build_object('source','event','stash',coalesce(g->>'id', 'pack-1')));
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

-- ---------- Sự kiện + thư giới thiệu ----------
-- starts_on = 17/10 chỉ để thư được phát từ hôm trước; sự kiện thật bắt đầu 18/10 (ghi trong tham số quà và giao diện).
insert into public.events(id, title, starts_on, ends_on, frame_title, card_count, weights) values
  ('mua-concept-2026', 'Mùa Concept', date '2026-10-17', date '2026-10-26', null, 0, '{}')
on conflict (id) do nothing;

do $$
declare mid uuid;
begin
  insert into public.mails(kind, title, body, gifts, event_id)
  values ('event', 'Mùa Concept mở từ 18/10',
          'Từ 18/10 đến 26/10 Colentis mở Mùa Concept: 3 concept, mỗi chặng 3 ngày. Nhận ngay quà khai mạc: thẻ ID Colentis, khung thẻ ID và 1 pack lưu vào Sự kiện để mở từ 18/10.',
          '[{"type":"id_card"},{"type":"id_frame"},{"type":"stash_pack","event":"mua-concept-2026","id":"pack-1","opens_on":"2026-10-18"}]', 'mua-concept-2026')
  returning id into mid;
  update public.events set mail_id = mid where id = 'mua-concept-2026';
  insert into public.mail_recipients(mail_id, user_id, deliver_at) select mid, id, now() from public.profiles on conflict do nothing;
end $$;
