-- Colentis · 022 · CORTIS Ball: bộ sưu tập 8 con ball (quà qua thư). Danh mục ball nằm ở client; server chỉ lưu ai đã sở hữu ball nào.
-- Ảnh ball là tài sản công khai (public/assets/balls); không phải ảnh thẻ thành viên.

create table public.user_balls (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  ball_id  text not null check (ball_id ~ '^ball-[1-8]$'),
  got_at   timestamptz not null default now(),
  source   text not null default 'mail',
  primary key (user_id, ball_id)
);
alter table public.user_balls enable row level security;
create policy user_balls_own on public.user_balls for select to authenticated using (user_id = auth.uid());
grant select on public.user_balls to authenticated;

create or replace function public.my_balls() returns jsonb
language sql stable security definer set search_path = public as
$$ select coalesce(jsonb_agg(jsonb_build_object('id', ball_id, 'at', got_at) order by ball_id), '[]'::jsonb)
     from user_balls where user_id = private.require_user() $$;

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
    elsif typ = 'ball' then
      if coalesce(g->>'id', '') !~ '^ball-[1-8]$' then raise exception 'BALL_NOT_FOUND'; end if;
      insert into user_balls(user_id, ball_id, source) values (u, g->>'id', 'mail') on conflict do nothing;
      grants := grants || jsonb_build_array(jsonb_build_object('source','admin','ball',g->>'id','is_new',found));
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
    elsif typ = 'ball' then
      if coalesce(g->>'id', '') !~ '^ball-[1-8]$' then raise exception 'INVALID_GIFT'; end if;
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

revoke execute on function public.my_balls() from public, anon;
grant execute on function public.my_balls() to authenticated;
grant execute on function public.claim_mail(uuid) to authenticated;
grant execute on function public.admin_send_mail(text, text, jsonb, text[], timestamptz) to authenticated;
