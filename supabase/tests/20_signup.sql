select t.now_is('2026-10-14 09:00+07');
insert into auth.users(id,email,raw_user_meta_data) values
  (t.id('alice'),'a@x.vn','{"username":"alice_01","display_name":"Alice","birthday":"2000-03-05"}'),
  (t.id('bob'),'b@x.vn','{"username":"bob_0002","display_name":"Bob"}'),
  (t.id('carol'),'c@x.vn','{"username":"carol_03","display_name":"Carol"}');
do $$ begin
  perform t.ok((select count(*) from profiles)=3, '3 profile được tạo');
  perform t.ok((select count(*) from calendars)=3, 'mỗi người có lịch mặc định');
  perform t.ok((select count(*) from mail_recipients)=3, 'mỗi người có thư Tân binh');
  perform t.ok(registration_open(), 'đăng ký còn mở');
  perform t.ok(username_available('zzzz_01'), 'username trống');
  perform t.ok(not username_available('Alice_01'), 'username trùng (không phân biệt hoa thường)');
  perform t.ok(not username_available('ab'), 'username quá ngắn');
  -- username sai định dạng làm đăng ký thất bại
  perform t.expect_err('profiles', $q$insert into auth.users(id,email,raw_user_meta_data) values (t.id('dave'),'d@x.vn','{"username":"BAD NAME","display_name":"Dave"}')$q$);
  perform t.expect_err('profiles_username_key', $q$insert into auth.users(email,raw_user_meta_data) values ('e@x.vn','{"username":"alice_01","display_name":"Ee"}')$q$);
  -- đóng đăng ký
  update app_config set value='3' where key='signup_cap';
  perform t.ok(not registration_open(), 'đủ 3 tài khoản thì đóng');
  perform t.expect_err('REGISTRATION_CLOSED', $q$insert into auth.users(id,email,raw_user_meta_data) values (t.id('dave'),'d@x.vn','{"username":"dave_004","display_name":"Dave"}')$q$);
  update app_config set value='50' where key='signup_cap';
  insert into auth.users(id,email,raw_user_meta_data) values (t.id('dave'),'d@x.vn','{"username":"dave_004","display_name":"Dave"}');
end $$;
