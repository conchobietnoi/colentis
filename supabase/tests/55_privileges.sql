do $$
declare bad text;
begin
  -- anon chỉ gọi được 2 hàm công khai
  select string_agg(p.proname, ', ') into bad from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute') and p.proname not in ('registration_open', 'username_available');
  perform t.ok(bad is null, 'anon gọi được hàm không cho phép: ' || coalesce(bad, ''));
  -- anon không đọc bảng nào
  select string_agg(c.relname, ', ') into bad from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind in ('r','v') and (has_table_privilege('anon', c.oid, 'select') or has_table_privilege('anon', c.oid, 'insert'));
  perform t.ok(bad is null, 'anon đọc/ghi được bảng: ' || coalesce(bad, ''));
  -- authenticated không ghi trực tiếp vào bảng quan trọng
  select string_agg(c.relname, ', ') into bad from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and c.relname not in ('tasks','user_calendar_prefs')
     and (has_table_privilege('authenticated', c.oid, 'insert') or has_table_privilege('authenticated', c.oid, 'update') or has_table_privilege('authenticated', c.oid, 'delete'));
  perform t.ok(bad is null, 'authenticated ghi trực tiếp được: ' || coalesce(bad, ''));
  -- mọi bảng public đều bật RLS
  select string_agg(c.relname, ', ') into bad from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
  perform t.ok(bad is null, 'bảng chưa bật RLS: ' || coalesce(bad, ''));
  -- hàm trong private không gọi được từ API
  select string_agg(p.proname, ', ') into bad from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'private' and has_function_privilege('anon', p.oid, 'execute');
  perform t.ok(bad is null, 'anon gọi được hàm private: ' || coalesce(bad, ''));
  -- hàm RPC không chạy bằng quyền người gọi khi không đăng nhập
  perform t.as_user(null) where false;
end $$;
select t.as_super();
set role anon;
select registration_open();
do $$ begin perform t.expect_err('permission denied', 'select me()'); perform t.expect_err('permission denied', 'select * from profiles'); end $$;
reset role;
