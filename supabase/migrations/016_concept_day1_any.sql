-- Colentis · 016 · Ngày 1 Mùa Concept: đổi từ "trước 9 giờ" thành xong 1 việc bất kỳ trong hôm nay (đúng cho người vào muộn).

create or replace function private.concept_task_have(uid uuid, d int) returns int
language plpgsql stable security definer set search_path = public as
$$
declare tdy date := private.today(); n int := 0;
begin
  if d = 1 then
    select count(*) into n from task_completions where user_id = uid and vn_day = tdy;
  elsif d = 6 then
    select count(*) into n from task_completions where user_id = uid and vn_day = tdy and vn_hour >= 21;
  elsif d = 8 then
    select count(*) into n from task_completions where user_id = uid and vn_day = tdy;
  elsif d in (2, 7) then
    select count(*) into n from task_completions c join tasks t on t.id = c.task_id
     where c.user_id = uid and c.vn_day = tdy and t.label = 'Việc nhà';
  elsif d = 4 then
    select count(*) into n from task_completions c join tasks t on t.id = c.task_id
     where c.user_id = uid and c.vn_day = tdy and t.label = 'Cho người khác';
  elsif d = 9 then
    select count(*) into n from task_completions c join tasks t on t.id = c.task_id
     where c.user_id = uid and c.vn_day = tdy
       and (select count(*) from calendar_members cm where cm.calendar_id = t.calendar_id and cm.left_on is null) >= 2;
  elsif d = 3 then
    select count(*) into n from tasks
     where owner_id = uid and day = tdy + 1 and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = tdy;
  elsif d = 5 then
    select count(*) into n from tasks
     where owner_id = uid and not all_day and (updated_at at time zone 'Asia/Ho_Chi_Minh')::date = tdy;
  end if;
  return n;
end $$;

revoke execute on function private.concept_task_have(uuid, int) from public, anon;
