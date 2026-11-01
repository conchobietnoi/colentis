-- Ball đang đeo (móc khóa cạnh frame ngang). Mỗi người tối đa 1 con.
alter table public.user_balls add column if not exists worn boolean not null default false;
create unique index if not exists user_balls_one_worn on public.user_balls (user_id) where worn;

create or replace function public.my_balls() returns jsonb
language sql stable security definer set search_path = public as
$$ select coalesce(jsonb_agg(jsonb_build_object('id', ball_id, 'at', got_at, 'worn', worn) order by ball_id), '[]'::jsonb)
     from user_balls where user_id = private.require_user() $$;

create or replace function public.set_worn_ball(bid text) returns jsonb
language plpgsql volatile security definer set search_path = public as
$$
declare u uuid := private.require_user();
begin
  if bid is not null and not exists (select 1 from user_balls where user_id = u and ball_id = bid) then raise exception 'BALL_NOT_OWNED'; end if;
  update user_balls set worn = false where user_id = u and worn;
  if bid is not null then update user_balls set worn = true where user_id = u and ball_id = bid; end if;
  return public.my_balls();
end $$;

revoke execute on function public.set_worn_ball(text) from public, anon;
grant execute on function public.set_worn_ball(text) to authenticated;
revoke execute on function public.my_balls() from public, anon;
grant execute on function public.my_balls() to authenticated;
