# Colentis — hướng dẫn cho Claude Code

Nguồn sự thật: `PLAN.md` (kế hoạch final, mới nhất). Mọi quy tắc trong `PLAN.md` thắng `docs/PLAN-v1-codex-tasks.md` (bản cũ, chỉ để tham khảo bảng task T0.1–T7.5, mẫu JSON, bảng danh hiệu, hướng dẫn UI).

## Quy tắc cứng
- Chi phí 0 đồng: GitHub Pages + Supabase Free. Không dịch vụ trả phí, không nâng cấp.
- Không commit ảnh thẻ thật, khóa bí mật, service_role. Ảnh thật ở bucket riêng tư.
- Logic thưởng/streak/khóa ngày/hòm thư chạy server (Postgres function + RLS); client không tự ghi kết quả.
- UI tiếng Việt, giờ Asia/Ho_Chi_Minh, tuần bắt đầu thứ Hai.
- Chỉ làm một giai đoạn mỗi lần theo mục 12 của PLAN.md; build + typecheck + lint sau mỗi giai đoạn.
- Còn 3 điểm chưa chốt (PLAN.md mục 14): hỏi người dùng trước khi code phần liên quan.

## Tài nguyên
- `public/assets/frames/` avatar (4 độ hiếm), secret (5 thành viên), event (sinh nhật James), title (frame ngang). SVG inline để giữ font/animation.
- `design/reference/` mockup HTML + preview frame: bám phong cách này, không dùng UI mặc định.
- Frame tròn: avatar nằm dưới frame (đường kính 78% của 512; secret/birthday 62.5% của 640). Frame ngang 760×200, vùng chữ: left 22.4%, top 31%, rộng 61.8%, cao 38%.

## Frame danh hiệu (bản mới, thay pack ChatGPT)
- `public/assets/frames/titles/`: 24 cặp frame tròn + ngang vẽ bằng SVG, tên `{id}-avatar.svg` / `{id}-title.svg`; thông tin trong `manifest.json` (độ rộng frame ngang thay đổi theo độ dài tên, vùng chữ `textSafeArea`).
- Frame tròn 1024×1024, lỗ trong đường kính 720 ở giữa: ảnh đại diện đặt dưới frame, left/top 14.84375%, rộng 70.3125%.
- Frame ngang cao 200, rộng theo manifest; chữ do app vẽ vào vùng textSafeArea. Không chèn tên vào SVG.
- Hiệu ứng là CSS trong SVG, tự tắt khi `prefers-reduced-motion`. Dùng `<img>` hoặc inline đều chạy; xem `titles/preview.html`.

## Thẻ sự kiện
- `local-cards/event-birthday-james/` là thẻ sự kiện (tặng khi đăng nhập ngày 14/10, giờ VN), tách khỏi kho 4 độ hiếm và không đếm vào "đủ bộ". Xem mục "Thẻ sự kiện" trong PLAN.md.
- Ảnh thẻ có hướng ngang hoặc dọc (xem `orientation` trong local-cards/_ready/manifest.json): ngang dùng thẻ ngang, dọc dùng thẻ dọc, không cắt khi nhận/xem; chỉ cắt giữa trong ô ngày. Thẻ sự kiện đặt tên theo nhãn A/S/SS/SSS/AURA.
- **Đã duyệt, giữ nguyên:** `design/reference/event-card-preview.html` là thiết kế chính thức của 5 thẻ sinh nhật James (A vàng, S cam, SS đỏ, SSS vàng-đỏ, AURA cầu vồng; viền neon, hiệu ứng tỏa riêng từng bậc, bánh sinh nhật ở góc dưới phải, hình ngang/dọc theo ảnh). Khi code, bám đúng màu, viền, hiệu ứng và cách đặt bánh trong file này, không tự thiết kế lại.
- Hiệu ứng hạt chỉ chạy khi thẻ đang hiển thị trên màn hình; tắt khi bật giảm chuyển động hoặc khi thẻ ra khỏi khung nhìn, để nhẹ cho điện thoại cũ.

## Thiết kế đã duyệt (tham chiếu bắt buộc)
- `design/reference/colentis-app.html`: mockup app hoàn chỉnh (lịch, Hôm nay, bộ sưu tập, thư quà, gacha, hồ sơ). Làm theo bố cục, hiệu ứng, từ ngữ.
- `design/reference/rarity-card-preview.html`: hiệu ứng thẻ theo độ hiếm (common/rare/legend/Bá khí 1-4).
- `design/reference/event-card-preview.html`: thẻ sự kiện sinh nhật James (A/S/SS/SSS/AURA).
- Mặt sau thẻ: nền tím, logo CORTIS mờ nhẹ (`public/assets/brand/cortis-logo*.png`).
- Thẻ sự kiện: AURA 15% mỗi người, 4 hạng còn lại chia đều (trọng số AURA ≈ 0.29 khi bốc 2 thẻ khác nhau trong 5).
- Gacha: thả gói, giữ để nạp, nổ, lật thẻ, slam độ hiếm, tóm tắt. Quà thư chỉ nhận một lần; thẻ sự kiện không tính vào giới hạn 2 thẻ/ngày.
- Màn mở đầu (tải, đăng nhập/đăng ký, chọn thành viên) và quà chào mừng: xem mục "Màn mở đầu và quà chào mừng" trong PLAN.md. Frame Tân binh: `public/assets/frames/titles/welcome-avatar.svg` và `welcome-title.svg`, dùng chung cho 5 danh hiệu `welcome-1..5`; xem thử ở `design/reference/tan-binh-preview.html`.

## Trạng thái triển khai (14/10/2026)
- Backend Supabase và giao diện đã làm xong và đã được thử end-to-end. Xem mục "Quy tắc đã chốt và backend đã triển khai" cuối `PLAN.md` và `README.md` (cách dựng Supabase, đẩy ảnh thẻ, deploy GitHub Pages).
- Giao diện là bản chuyển thể từ mockup: sửa UI ở `src/ui/legacy/_*.js` (ghép theo thứ tự tên tệp) và `src/ui/mockup.css`, khung HTML ở `src/ui/shell.html`. Không gọi Supabase trực tiếp từ đó: mọi thứ qua `API` (`src/ui/bridge.ts`).
- Thay đổi logic thưởng/streak/khóa ngày: sửa ở `supabase/migrations/*.sql`, chạy `bash supabase/tests/run.sh ...` (xem `README.md` mục Kiểm thử) rồi `npm run setup-sql` để tạo lại `supabase/setup-all.sql`. Migration đã chạy trên Supabase thật thì thêm tệp migration mới, không sửa tệp cũ.
- Kiểm thử giao diện: `e2e/build.sh`, `e2e/shim.sh reset`, `e2e/all.sh` (cần Postgres cục bộ và Chromium cho Playwright).
- Không có khóa bí mật trong repo. Khóa `anon` là công khai (đặt trong biến Actions và `.env.local`). Khóa `service_role` chỉ dùng tạm trong PowerShell của chủ dự án nếu muốn chạy `npm run upload-cards`.

## Mùa Concept (giai đoạn 1 và 2)
- Giai đoạn 1: thẻ ID + khung thành viên: `src/ui/legacy/_06e_idcard.js`, `supabase/migrations/009_mua_concept.sql`, thiết kế ở `design/mua-concept/`.
- Giai đoạn 2 (nhiệm vụ ngày, pack, thẻ concept, panorama, Ultra, tặng/xin thẻ): `src/ui/legacy/_06f_cx_core.js` + `_06g_cx_tpl.js` (sinh sẵn từ `design/mua-concept/boards/AppBuild.dc.html`), `src/ui/concept.css`, `supabase/migrations/013_mua_concept_p2.sql`. Bám đúng thiết kế đã duyệt, không tự vẽ lại; chi tiết luật và bucket `concept` ở cuối `PLAN.md`.
- Ảnh/video/nhạc concept ở bucket riêng `concept` (không commit vào repo). Hiệu ứng mở Ultra đã chốt là "2 sao xoắn" (variant 3).
- Test: `bash e2e/all.sh` (đặt `CONCEPT_DIR` để chạy cả s7, s8). Nếu build bằng `npm run build` thì phải `bash e2e/build.sh` lại trước khi chạy e2e.

- Nhiệm vụ ngày Mùa Concept do server xác minh (`supabase/migrations/015_concept_task_check.sql`, test `75_concept_task.sql`); nhãn `Việc nhà` và `Cho người khác` dùng cho ngày 2/4/7. Chi tiết cuối `PLAN.md`.

## Trang admin v2
- Mockup ở `design/admin/`; code `src/ui/legacy/_07b_admin.js`, migration `017_admin_v2.sql`, test `80_admin_v2.sql` và `e2e/s9_admin.mjs`. Các bộ test supabase chạy theo đúng thứ tự tên tệp (`ls supabase/tests/[0-9]*.sql`, bỏ `00_stub`), vì nhiều test dùng dữ liệu của test trước.

## Check in bằng ảnh vuông (migration 019)
- Mockup đã duyệt `design/checkin/checkin-mockup.html`; code `src/ui/legacy/_07d_checkin.js` + `src/ui/checkin.css`, migration `019_checkin_photos.sql`, test `90_checkin.sql` và `e2e/s10_checkin.mjs`. Ảnh ở bucket riêng `checkins`, mỗi việc 1 ảnh, hiện trong ghi chú xổ xuống; dấu mộc Colentis vẽ ở UI từ `taken_at` của server. Thành viên chỉ chụp trực tiếp, chỉ admin được chọn ảnh từ máy (đường dẫn `up-`). Đổi UI dòng việc ở `taskRow` (`_02_raw.js`): ghi chú + ảnh nằm trong `.tnb` full chiều rộng.
