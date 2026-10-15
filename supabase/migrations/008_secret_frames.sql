-- Colentis · 008 · 5 khung bí mật (quà admin). Chỉ admin tặng được qua thư, người chơi không tự mở khóa.
insert into public.titles(id, display_name, unlock_text, rarity, avatar_frame, title_frame, special, sort) values
('secret-james','Bí mật · James','Khung bí mật · quà admin','supreme','titles/secret-james-avatar.svg','titles/secret-james-title.svg',true,130),
('secret-juhoon','Bí mật · Juhoon','Khung bí mật · quà admin','supreme','titles/secret-juhoon-avatar.svg','titles/secret-juhoon-title.svg',true,131),
('secret-keonho','Bí mật · Keonho','Khung bí mật · quà admin','supreme','titles/secret-keonho-avatar.svg','titles/secret-keonho-title.svg',true,132),
('secret-martin','Bí mật · Martin','Khung bí mật · quà admin','supreme','titles/secret-martin-avatar.svg','titles/secret-martin-title.svg',true,133),
('secret-seonghyeon','Bí mật · Seonghyeon','Khung bí mật · quà admin','supreme','titles/secret-seonghyeon-avatar.svg','titles/secret-seonghyeon-title.svg',true,134)
on conflict (id) do nothing;
