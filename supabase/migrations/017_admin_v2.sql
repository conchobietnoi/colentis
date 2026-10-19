-- Colentis · 017 · Trang admin v2: tổng quan, thành viên, lịch sử thư (đã gửi + hẹn giờ), huỷ hẹn, gửi ngay, nhắc nhận quà.
-- Chỉ admin gọi được. Thư hẹn giờ = thư có deliver_at ở tương lai (đã có từ 003).

create or replace function public.admin_overview() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user(); nowt timestamptz := private.now(); tdy date := private.today();
begin
  if not private.is_admin(u) then raise exception 'FORBIDDEN'; end if;
  return jsonb_build_object(
    'members', (select count(*) from profiles),
    'active_today', (select count(distinct x) from (
        select user_id x from task_completions where vn_day = tdy
        union select user_id from mail_recipients where (read_at at time zone 'Asia/Ho_Chi_Minh')::date = tdy
        union select user_id from reward_grants where (created_at at time zone 'Asia/Ho_Chi_Minh')::date = tdy) s),
    'mails_sent', (select count(*) from mails m where m.kind = 'admin'
                    and not exists (select 1 from mail_recipients r where r.mail_id = m.id and r.deliver_at > nowt)),
    'claim_pct', (select case when count(*) = 0 then 0 else round(100.0 * count(*) filter (where r.claimed_at is not null) / count(*)) end
                    from mail_recipients r join mails m on m.id = r.mail_id
                   where m.kind = 'admin' and jsonb_array_length(m.gifts) > 0 and r.deliver_at <= nowt),
    'cards_total', (select count(*) from reward_grants),
    'cards_today', (select count(*) from reward_grants where (created_at at time zone 'Asia/Ho_Chi_Minh')::date = tdy),
    'scheduled', (select count(*) from mails m where m.kind = 'admin'
                    and exists (select 1 from mail_recipients r where r.mail_id = m.id and r.deliver_at > nowt)),
    'next_at', (select min(r.deliver_at) from mail_recipients r join mails m on m.id = r.mail_id where m.kind = 'admin' and r.deliver_at > nowt),
    'concept_day', private.concept_day(),
    'activity', (select coalesce(jsonb_agg(a order by (a->>'at') desc), '[]') from (
        select a from (
          select jsonb_build_object('kind', 'claim', 'uid', r.user_id, 'name', p.display_name, 'text', m.title, 'at', r.claimed_at) a
            from mail_recipients r join profiles p on p.id = r.user_id join mails m on m.id = r.mail_id
           where r.claimed_at is not null and m.kind = 'admin'
          union all
          select jsonb_build_object('kind', 'tick', 'uid', t.user_id, 'name', p.display_name, 'text', 'ngày ' || t.day_no, 'at', t.done_at)
            from concept_ticks t join profiles p on p.id = t.user_id
          union all
          select jsonb_build_object('kind', 'card', 'uid', g.user_id, 'name', p.display_name, 'text', g.source, 'at', g.created_at)
            from reward_grants g join profiles p on p.id = g.user_id where g.source in ('personal', 'group')
        ) u2 order by (a->>'at') desc limit 8) z));
end $$;

create or replace function public.admin_members() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare u uuid := private.require_user(); nowt timestamptz := private.now(); tdy date := private.today(); total int;
begin
  if not private.is_admin(u) then raise exception 'FORBIDDEN'; end if;
  select count(*) into total from cards;
  return (select coalesce(jsonb_agg(x order by (x->>'created_at')), '[]') from (
    select jsonb_build_object(
      'id', p.id, 'name', p.display_name, 'username', p.username, 'created_at', p.created_at, 'is_admin', p.is_admin,
      'last_active', greatest(
        (select max(completed_at) from task_completions where user_id = p.id),
        (select max(coalesce(claimed_at, read_at)) from mail_recipients where user_id = p.id),
        (select max(created_at) from reward_grants where user_id = p.id),
        p.created_at),
      'streak', private.streak(p.id),
      'done_today', private.counts_for_streak(p.id, tdy),
      'cards', (select count(*) from user_cards where user_id = p.id), 'cards_total', total,
      'unclaimed', (select count(*) from mail_recipients r where r.user_id = p.id and r.deliver_at <= nowt and r.claimed_at is null
                       and exists (select 1 from mails m where m.id = r.mail_id and jsonb_array_length(m.gifts) > 0)),
      'member', p.welcome_member) x
    from profiles p) s);
end $$;

create or replace function public.admin_sent_mails() returns jsonb
language plpgsql stable security definer set search_path = public as
$$
declare nowt timestamptz := private.now();
begin
  if not private.is_admin(auth.uid()) then raise exception 'FORBIDDEN'; end if;
  return (select coalesce(jsonb_agg(x order by (x->>'deliver_at') desc), '[]') from (
    select jsonb_build_object('id', m.id, 'title', m.title, 'body', m.body, 'gifts', m.gifts, 'created_at', m.created_at,
             'deliver_at', (select min(r.deliver_at) from mail_recipients r where r.mail_id = m.id),
             'scheduled', exists (select 1 from mail_recipients r where r.mail_id = m.id and r.deliver_at > nowt),
             'recipients', (select count(*) from mail_recipients r where r.mail_id = m.id),
             'read', (select count(*) from mail_recipients r where r.mail_id = m.id and r.read_at is not null),
             'claimed', (select count(*) from mail_recipients r where r.mail_id = m.id and r.claimed_at is not null),
             'usernames', (select coalesce(jsonb_agg(p.username), '[]') from mail_recipients r join profiles p on p.id = r.user_id where r.mail_id = m.id)) x
    from mails m where m.kind = 'admin') s);
end $$;

-- Huỷ một thư hẹn giờ (chỉ khi chưa tới giờ gửi cho bất kỳ ai).
create or replace function public.admin_cancel_mail(mid uuid) returns void
language plpgsql volatile security definer set search_path = public as
$$
declare nowt timestamptz := private.now();
begin
  if not private.is_admin(auth.uid()) then raise exception 'FORBIDDEN'; end if;
  if not exists (select 1 from mails where id = mid and kind = 'admin') then raise exception 'NOT_FOUND'; end if;
  if exists (select 1 from mail_recipients where mail_id = mid and deliver_at <= nowt) then raise exception 'ALREADY_SENT'; end if;
  delete from notifications where kind = 'mail' and payload->>'mail_id' = mid::text;
  delete from mails where id = mid;
end $$;

-- Gửi ngay một thư đang hẹn giờ.
create or replace function public.admin_send_now(mid uuid) returns int
language plpgsql volatile security definer set search_path = public as
$$
declare nowt timestamptz := private.now(); n int;
begin
  if not private.is_admin(auth.uid()) then raise exception 'FORBIDDEN'; end if;
  if not exists (select 1 from mails where id = mid and kind = 'admin') then raise exception 'NOT_FOUND'; end if;
  update mail_recipients set deliver_at = nowt where mail_id = mid and deliver_at > nowt;
  get diagnostics n = row_count;
  update notifications set created_at = nowt where kind = 'mail' and payload->>'mail_id' = mid::text and created_at > nowt;
  return n;
end $$;

-- Nhắc những người đã nhận thư nhưng chưa nhận quà (thêm một thông báo mới, không gửi lại quà).
create or replace function public.admin_nudge_mail(mid uuid) returns int
language plpgsql volatile security definer set search_path = public as
$$
declare nowt timestamptz := private.now(); n int; ttl text;
begin
  if not private.is_admin(auth.uid()) then raise exception 'FORBIDDEN'; end if;
  select title into ttl from mails where id = mid and kind = 'admin';
  if ttl is null then raise exception 'NOT_FOUND'; end if;
  insert into notifications(user_id, kind, payload, created_at)
    select r.user_id, 'mail', jsonb_build_object('mail_id', mid, 'title', ttl, 'nudge', true), nowt
      from mail_recipients r where r.mail_id = mid and r.deliver_at <= nowt and r.claimed_at is null;
  get diagnostics n = row_count;
  return n;
end $$;

revoke execute on function public.admin_overview(), public.admin_members(), public.admin_sent_mails(),
  public.admin_cancel_mail(uuid), public.admin_send_now(uuid), public.admin_nudge_mail(uuid) from public, anon;
grant execute on function public.admin_overview(), public.admin_members(), public.admin_sent_mails(),
  public.admin_cancel_mail(uuid), public.admin_send_now(uuid), public.admin_nudge_mail(uuid) to authenticated;
