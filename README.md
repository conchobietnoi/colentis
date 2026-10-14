# Colentis

Lịch chung gamified cho fan CORTIS: tick việc mỗi ngày để nhận thẻ ảnh, giữ streak, lập lịch nhóm với bạn bè.
React + TypeScript + Vite, chạy trên GitHub Pages; dữ liệu ở Supabase (gói Free). Chi phí: 0 đồng.

- Kế hoạch và quy tắc sản phẩm: `PLAN.md`. Quy ước cho Claude Code: `CLAUDE.md`.
- Backend (SQL, RLS, hàm RPC, test): `supabase/`. Giao diện: `src/`. Kiểm thử trình duyệt: `e2e/`.

## 1. Chạy trên máy (Windows PowerShell)

```powershell
cd C:\Projects\colentis
npm install
copy .env.example .env.local     # rồi điền 2 giá trị ở mục 2
npm run dev                      # mở http://localhost:5173
```

Kiểm tra trước khi đẩy lên: `npm run typecheck`, `npm run lint`, `npm run build`.

## 2. Tạo Supabase (làm một lần)

1. Vào https://supabase.com → **New project** (gói Free). Đặt mật khẩu database, ghi lại ở nơi riêng tư.
2. **SQL Editor → New query** → dán toàn bộ `supabase/setup-all.sql` → **Run**. Chạy một lần duy nhất. Tệp này tạo bảng, quyền (RLS), hàm thưởng/streak/thư, dữ liệu danh hiệu và kho thẻ, hai bucket riêng tư `cards` và `avatars`.
3. **Project Settings → API**: chép `Project URL` và khóa **anon public** vào `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   Không bao giờ dùng khóa `service_role` trong ứng dụng, trong repo hay gửi cho ai.
4. **Authentication → Providers → Email**: bật. Khuyến nghị **tắt "Confirm email"** (gói Free chỉ gửi được vài email mỗi giờ, bật xác nhận sẽ nghẽn khi nhiều người đăng ký cùng lúc). Quên mật khẩu vẫn dùng email nhưng ít khi xảy ra.
5. **Authentication → URL Configuration**: `Site URL` = địa chỉ GitHub Pages của bạn (mục 4); thêm `http://localhost:5173` vào **Redirect URLs**.
6. Đặt mình làm admin (để gửi thư quà): đăng ký tài khoản trong app trước, rồi ở SQL Editor chạy
   `update public.profiles set is_admin = true where username = 'ten_dang_nhap_cua_ban';`

Giới hạn đăng ký: 50 tài khoản (hằng số `signup_cap` trong bảng `app_config`, server tự chặn). Đổi bằng
`update public.app_config set value = '80' where key = 'signup_cap';`

## 3. Ảnh thẻ (nằm ở Storage riêng tư, không đưa lên GitHub)

Ảnh đã xử lý nằm ở `local-cards/_ready/` (có `manifest.json`). Thư mục `local-cards/` đã được `.gitignore`.

```powershell
npm run thumbs        # tạo local-cards/_ready/thumbs/<id>.webp (ảnh nhỏ cho lưới thẻ)
```

Tải lên bucket **cards** (chọn một trong hai):
- **Dashboard (dễ nhất):** Storage → `cards` → Upload folder: tải các thư mục `common`, `rare`, `legendary`, `supreme`, `event-birthday-james` và `thumbs` trong `local-cards/_ready/` lên **gốc** bucket. Kết quả phải là `cards/common/common-01.webp`, `cards/thumbs/common-01.webp`, ...
- **Script:** trong PowerShell
  ```powershell
  $env:SUPABASE_URL="https://xxxx.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="(khóa service_role)"; npm run upload-cards
  ```
  Khóa chỉ tồn tại trong cửa sổ PowerShell đó. Đóng cửa sổ là mất. Không dán vào file hay chat.

Người chơi chỉ tải được ảnh của thẻ mình sở hữu (hoặc thẻ yêu thích / album công khai của bạn bè), do chính sách Storage trong `006_storage.sql`.

## 4. Đưa lên GitHub Pages

1. Tạo repo trên GitHub. **Lưu ý:** gói GitHub Free chỉ cho phép Pages với repo **public**. Repo này không chứa bí mật nào (khóa anon vốn công khai, ảnh thẻ ở Storage riêng), nên public là an toàn. Muốn giữ repo private thì cần GitHub Pro, hoặc dùng Cloudflare Pages (miễn phí, cùng lệnh build).
2. Repo → **Settings → Secrets and variables → Actions → Variables** → thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (cùng giá trị như `.env.local`).
3. Repo → **Settings → Pages → Source: GitHub Actions**.
4. Tệp workflow nằm ở `scripts/deploy.yml` (công cụ chép tệp không ghi được vào thư mục `.github`). Tạo thư mục `.github\workflows` rồi chép vào: `mkdir .github\workflows; copy scripts\deploy.yml .github\workflows\deploy.yml`.
5. Đẩy code lên nhánh `main`. Workflow tự typecheck, lint, build và deploy. Địa chỉ: `https://<tài-khoản>.github.io/<tên-repo>/`.

```powershell
git init -b main
git add .
git commit -m "Colentis: bản đầu"
git remote add origin https://github.com/<tài-khoản>/<tên-repo>.git
git push -u origin main
```

## 5. Kiểm thử

- `supabase/tests/`: 8 bộ test SQL (thưởng, streak, khóa ngày, thư, quyền, Storage). Chạy trên Postgres thường: `bash supabase/tests/run.sh supabase/tests/10_helpers.sql ...` (cần Postgres cục bộ).
- `e2e/`: máy chủ giả lập Supabase (`e2e/shim/server.mjs`) + bài test Playwright qua giao diện thật: đăng ký, quà Tân binh, thêm/tick việc, nhận thẻ, kết bạn, lịch chung và thẻ nhóm, offline, tick bù và thẻ cứu, thư admin, hồ sơ. Chỉ dùng để phát triển, không liên quan bản chạy thật.

## 6. Dọn dẹp tùy chọn

Các thư mục `src/components`, `src/pages`, `src/styles` và các tệp `src/lib/{calendar,cx,frames,motion,rarity}.ts` là phần cũ của giai đoạn dựng styleguide, giao diện hiện tại không dùng. Chúng đã được loại khỏi typecheck và lint. Có thể xóa nếu không cần tham khảo:
`Remove-Item -Recurse src\components, src\pages, src\styles, src\lib\calendar.ts, src\lib\cx.ts, src\lib\frames.ts, src\lib\motion.ts, src\lib\rarity.ts`

## 7. Cấu trúc

```
supabase/migrations/   001 bảng · 002 hàm lõi · 003 RPC · 004 RLS · 005 dữ liệu gốc · 006 Storage
supabase/setup-all.sql gộp 6 tệp trên (npm run setup-sql để tạo lại)
src/lib/               supabase client, api (bọc RPC/bảng), lỗi tiếng Việt, kiểu dữ liệu
src/ui/loader.ts       đọc dữ liệu server → snapshot cho giao diện
src/ui/bridge.ts       cầu nối: đăng nhập, hàng đợi offline, realtime, ảnh riêng tư
src/ui/legacy/*.js     giao diện (bám sát mockup đã duyệt), ghép bằng plugin Vite thành một module
src/ui/shell.html      khung HTML tĩnh · src/ui/mockup.css: toàn bộ kiểu dáng
```
