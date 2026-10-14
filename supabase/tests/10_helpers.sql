create schema t;
grant usage on schema t to public;
create function t.as_user(u uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', u::text, false);
  perform set_config('request.jwt.claim.role', 'authenticated', false);
  execute 'set role authenticated';
end $$;
create function t.as_super() returns void language plpgsql as $$
begin
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', false);
  perform set_config('request.jwt.claim.role', '', false);
end $$;
create function t.now_is(ts text) returns void language plpgsql as $$ begin perform set_config('colentis.now', ts, false); end $$;
-- Chạy câu lệnh, mong đợi lỗi chứa mã code.
create function t.expect_err(code text, sql text) returns void language plpgsql as $$
begin
  begin
    execute sql;
  exception when others then
    if position(code in sqlerrm) = 0 then raise exception 'SAI LỖI: mong % nhưng nhận "%" khi chạy: %', code, sqlerrm, sql; end if;
    return;
  end;
  raise exception 'MONG LỖI % nhưng chạy thành công: %', code, sql;
end $$;
create function t.ok(cond boolean, msg text) returns void language plpgsql as $$
begin if not coalesce(cond, false) then raise exception 'SAI: %', msg; end if; end $$;
create table t.u(name text primary key, id uuid);
insert into t.u(name, id) values ('alice','11111111-1111-1111-1111-111111111111'),('bob','22222222-2222-2222-2222-222222222222'),
  ('carol','33333333-3333-3333-3333-333333333333'),('dave','44444444-4444-4444-4444-444444444444');
create function t.id(n text) returns uuid language sql stable as $$ select id from t.u where name = n $$;
