-- 024: quà thư card_pack (gói 5 thẻ, ít nhất 1 Hiếm) + danh hiệu ball-mint
select t.now_is('2026-11-01 12:00+07');
do $$
declare b uuid := t.id('bob'); mid uuid; res jsonb; n int;
begin
  perform t.as_super();
  insert into mails(kind,title,body,gifts) values ('event','Gói thử','x','[{"type":"card_pack","qty":3},{"type":"title","id":"ball-mint"},{"type":"ball","id":"ball-1"}]') returning id into mid;
  insert into mail_recipients(mail_id,user_id,deliver_at) values (mid,b,now() - interval '1 day');
  perform t.as_user(b);
  res := claim_mail(mid);
  select count(*) into n from jsonb_array_elements(res->'grants') g where g ? 'card_id';
  perform t.ok(n = 15, '3 gói = 15 thẻ');
  perform t.ok((select bool_and(x) from (select bool_or(g->>'rarity' <> 'common') x from jsonb_array_elements(res->'grants') g where g ? 'pack' group by g->>'pack') s), 'mỗi gói có ít nhất 1 Hiếm');
  perform t.ok(res->'new_titles' ? 'ball-mint', 'nhận danh hiệu ball-mint');
  res := claim_mail(mid);
  perform t.as_super();
  perform t.ok((select count(*) from reward_grants where user_id = b and source = 'admin') >= 15, 'có lượt nhận thẻ');
end $$;
