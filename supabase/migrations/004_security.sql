-- Colentis · 004 · Phân quyền (RLS), quyền gọi hàm, view người dùng, realtime
-- Nguyên tắc: client chỉ đọc dữ liệu được phép và ghi task của chính mình; mọi thưởng/khóa/quà qua hàm RPC.

-- Gỡ quyền mặc định, chỉ cấp lại những gì cần.
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;   -- cần để RLS gọi các hàm kiểm tra bên dưới
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_member(uuid, uuid), private.are_friends(uuid, uuid),
                          private.shares_calendar(uuid, uuid), private.is_admin(uuid),
                          private.now(), private.today() to authenticated;

-- ---------- Bật RLS cho mọi bảng ----------
alter table public.app_config          enable row level security;   -- không có policy: chỉ hàm server đọc
alter table public.holidays_tet        enable row level security;
alter table public.profiles            enable row level security;
alter table public.friendships         enable row level security;
alter table public.calendars           enable row level security;
alter table public.calendar_members    enable row level security;
alter table public.calendar_invites    enable row level security;
alter table public.user_calendar_prefs enable row level security;
alter table public.tasks               enable row level security;
alter table public.task_completions    enable row level security;
alter table public.day_locks           enable row level security;
alter table public.rescue_uses         enable row level security;
alter table public.cards               enable row level security;
alter table public.events              enable row level security;
alter table public.user_cards          enable row level security;
alter table public.reward_grants       enable row level security;
alter table public.group_rolls         enable row level security;
alter table public.titles              enable row level security;
alter table public.user_titles         enable row level security;
alter table public.mails               enable row level security;
alter table public.mail_recipients     enable row level security;
alter table public.notifications       enable row level security;
alter table public.cheers              enable row level security;
alter table public.event_claims        enable row level security;

-- ---------- Chính sách đọc ----------
grant select on public.profiles, public.friendships, public.calendars, public.calendar_members, public.calendar_invites,
                public.tasks, public.day_locks, public.cards, public.events, public.user_cards, public.reward_grants,
                public.titles, public.user_titles, public.mails, public.mail_recipients, public.notifications,
                public.user_calendar_prefs, public.rescue_uses, public.cheers to authenticated;

-- Hồ sơ: chỉ đọc bản của mình (đầy đủ). Người khác xem qua view public.people hoặc hàm friend_view/find_user.
create policy profiles_own on public.profiles for select to authenticated using (id = auth.uid());

create policy friendships_involved on public.friendships for select to authenticated
  using (requester = auth.uid() or addressee = auth.uid());

create policy calendars_member on public.calendars for select to authenticated
  using (private.is_member(id, auth.uid()));

create policy calendar_members_same on public.calendar_members for select to authenticated
  using (left_on is null and private.is_member(calendar_id, auth.uid()));

create policy invites_involved on public.calendar_invites for select to authenticated
  using (invitee = auth.uid() or inviter = auth.uid());

-- Task: thấy task của những người còn trong cùng lịch; người đã rời thì task biến mất.
create policy tasks_select on public.tasks for select to authenticated
  using (private.is_member(calendar_id, auth.uid()) and private.is_member(calendar_id, owner_id));
grant insert, update, delete on public.tasks to authenticated;
create policy tasks_insert on public.tasks for insert to authenticated
  with check (owner_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy tasks_update on public.tasks for update to authenticated
  using (owner_id = auth.uid() and private.is_member(calendar_id, auth.uid()))
  with check (owner_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy tasks_delete on public.tasks for delete to authenticated
  using (owner_id = auth.uid());

create policy day_locks_own   on public.day_locks    for select to authenticated using (user_id = auth.uid());
create policy rescue_own      on public.rescue_uses  for select to authenticated using (user_id = auth.uid());
create policy cards_all       on public.cards        for select to authenticated using (active);
create policy events_all      on public.events       for select to authenticated using (true);
create policy titles_all      on public.titles       for select to authenticated using (true);
create policy user_titles_own on public.user_titles  for select to authenticated using (user_id = auth.uid());
create policy grants_own      on public.reward_grants for select to authenticated using (user_id = auth.uid());
create policy cheers_own      on public.cheers       for select to authenticated using (from_user = auth.uid() or to_user = auth.uid());

-- Album: của mình; của bạn bè chỉ khi họ bật công khai.
create policy user_cards_visible on public.user_cards for select to authenticated using (
  user_id = auth.uid()
  or (private.are_friends(auth.uid(), user_id) and exists (select 1 from public.profiles p where p.id = user_cards.user_id and p.album_public)));
-- (policy trên đọc profiles bằng quyền người gọi nên bị chặn bởi profiles_own; dùng hàm riêng bên dưới)
drop policy user_cards_visible on public.user_cards;
create or replace function private.album_visible(owner uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select owner = auth.uid() or (private.are_friends(auth.uid(), owner) and coalesce((select album_public from profiles where id = owner), false)) $$;
grant execute on function private.album_visible(uuid) to authenticated;
create policy user_cards_visible on public.user_cards for select to authenticated using (private.album_visible(user_id));

-- Thư: người nhận chỉ thấy thư đã đến giờ.
create policy mail_recipients_own on public.mail_recipients for select to authenticated
  using (user_id = auth.uid() and deliver_at <= private.now());
create policy mails_visible on public.mails for select to authenticated
  using (exists (select 1 from public.mail_recipients r where r.mail_id = mails.id and r.user_id = auth.uid() and r.deliver_at <= private.now()));
create policy notifications_own on public.notifications for select to authenticated
  using (user_id = auth.uid() and created_at <= private.now());

-- Giao diện từng lịch: ghi trực tiếp, chỉ cho lịch mình tham gia.
grant insert, update, delete on public.user_calendar_prefs to authenticated;
create policy prefs_select on public.user_calendar_prefs for select to authenticated using (user_id = auth.uid());
create policy prefs_write  on public.user_calendar_prefs for insert to authenticated
  with check (user_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy prefs_update on public.user_calendar_prefs for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and private.is_member(calendar_id, auth.uid()));
create policy prefs_delete on public.user_calendar_prefs for delete to authenticated using (user_id = auth.uid());

-- ---------- View người dùng (chỉ cột an toàn, chỉ người liên quan) ----------
create view public.people with (security_barrier = true) as
  select p.id, p.username, p.display_name, p.avatar_path, p.equipped_title,
         case when p.show_birthday or p.id = auth.uid() then p.birthday end as birthday
  from public.profiles p
  where p.id = auth.uid() or private.are_friends(auth.uid(), p.id) or private.shares_calendar(auth.uid(), p.id)
     or exists (select 1 from public.friendships f where f.status = 'pending' and
                ((f.requester = p.id and f.addressee = auth.uid()) or (f.addressee = p.id and f.requester = auth.uid())))
     or exists (select 1 from public.calendar_invites i where i.status = 'pending' and
                ((i.inviter = p.id and i.invitee = auth.uid()) or (i.invitee = p.id and i.inviter = auth.uid())));
grant select on public.people to authenticated;

-- ---------- Quyền gọi hàm ----------
grant execute on function public.registration_open(), public.username_available(text) to anon, authenticated;
grant execute on function
  public.app_info(), public.me(), public.update_profile(jsonb), public.set_equipped_title(text), public.set_favs(text[]),
  public.find_user(text), public.send_friend_request(text), public.respond_friend(uuid, boolean), public.remove_friend(uuid),
  public.create_calendar(text), public.rename_calendar(uuid, text), public.set_member_color(uuid, text),
  public.invite_to_calendar(uuid, uuid), public.respond_invite(uuid, boolean), public.remove_member(uuid, uuid),
  public.transfer_owner(uuid, uuid), public.leave_calendar(uuid), public.delete_calendar(uuid, text),
  public.day_status(date), public.claim_day(date), public.use_rescue(date),
  public.ensure_login_events(), public.mark_mail_read(uuid), public.choose_welcome_member(text), public.claim_mail(uuid),
  public.admin_send_mail(text, text, jsonb, text[], timestamptz), public.admin_sent_mails(),
  public.mark_notifications_read(uuid[]), public.send_cheer(uuid), public.friend_view(uuid)
  to authenticated;

-- ---------- Không cho client đổi cột nhạy cảm ngay cả khi có lỗi cấu hình ----------
create or replace function private.profiles_protect() returns trigger language plpgsql as
$$
begin
  if current_user in ('authenticated','anon') and tg_op = 'UPDATE' then
    if new.is_admin is distinct from old.is_admin then raise exception 'FORBIDDEN'; end if;
  end if;
  return new;
end $$;
create trigger profiles_protect_trg before update on public.profiles for each row execute function private.profiles_protect();

-- ---------- Realtime ----------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.tasks, public.notifications, public.mail_recipients,
      public.friendships, public.calendar_members, public.calendar_invites;
  end if;
end $$;

-- Hàm tạo sau lệnh revoke ở đầu file (album_visible, profiles_protect) mặc định có quyền cho PUBLIC: gỡ lại.
revoke execute on all functions in schema private from public, anon;
revoke execute on all functions in schema public from public, anon;
grant execute on function public.registration_open(), public.username_available(text) to anon;
