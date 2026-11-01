-- Colentis · 024 · Quà thư "gói thẻ" (card_pack: mỗi gói 5 thẻ, có ít nhất 1 Hiếm) + 2 danh hiệu mới:
-- ball-mint (tặng kèm Ball qua thư) và pola-day (đủ 40 pola trong sự kiện POLA DAY, trao ở giai đoạn sau).
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('ball-mint','bạn của Ball','Quà thư POLA DAY kèm Ball bạc hà','supreme','titles/ball-mint-avatar.svg','titles/ball-mint-title.svg',true,150),
('pola-day','thợ chụp pola','Rửa đủ 40 pola trong sự kiện POLA DAY','supreme','titles/pola-day-avatar.svg','titles/pola-day-title.svg',true,151)
on conflict (id) do nothing;

create or replace function public.claim_mail(mid uuid) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user(); k int; mr mail_recipients; m mails; g jsonb; typ text; qty int; i int; cid text; res record;
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
    elsif typ = 'card_pack' then
      -- gói 5 thẻ như gacha: rơi theo tỉ lệ ngày, mỗi gói chắc chắn có ít nhất 1 thẻ Hiếm trở lên
      for k in 1..qty loop
        picks := '{}'; sawrare := false;
        for i in 1..5 loop
          rr := private.pick_rarity(private.cfg('daily_weights'), u);
          if i = 5 and not sawrare and rr = 'common' then rr := 'rare'; end if;
          if rr <> 'common' then sawrare := true; end if;
          cid := private.pick_card(u, rr, picks);
          picks := picks || cid;
          select * into res from private.grant_card(u, cid, 'admin', null, null);
          grants := grants || jsonb_build_array(jsonb_build_object('source','admin','card_id',cid,'is_new',res.is_new,'count',res.cnt,'rarity',rr,'pack',k));
        end loop;
      end loop;
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


grant execute on function public.claim_mail(uuid) to authenticated;
