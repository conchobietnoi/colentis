# Chạy MỘT LẦN trong thư mục gốc project (PowerShell):  .\scripts\run-batch2.ps1
# Làm cả 3 bước: nén ảnh Drive -> tải 12 ảnh Bá khí đã giải nén -> upload lên Supabase.
# Khóa service_role chỉ nằm trong phiên này, không ghi ra file.
$ErrorActionPreference = 'Stop'
if (-not (Test-Path 'local-cards/_ready/manifest-b2-supreme.json')) {
  Write-Host 'Chưa thấy local-cards/_ready/manifest-b2-supreme.json. Giải nén ba-khi-dot-2.zip vào thư mục project trước.' -ForegroundColor Red; exit 1 }
$dir = Read-Host 'Đường dẫn thư mục Drive đã tải về (612 ảnh)'
$dir = $dir.Trim('"')
if (-not (Test-Path $dir)) { Write-Host 'Không thấy thư mục đó.' -ForegroundColor Red; exit 1 }
$sec = Read-Host 'Dán khóa service_role (không hiện chữ)' -AsSecureString
$env:SUPABASE_SERVICE_ROLE_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
$env:SUPABASE_URL = 'https://trkkluqvcrxaoqmnxmhz.supabase.co'
npm install --no-audit --no-fund
node scripts/prepare-batch2.mjs $dir
npm run upload-cards -- manifest-b2.json manifest-b2-supreme.json
Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY
Write-Host 'Xong. Báo Claude: "upload xong" (kèm dòng Xong: ... ở trên).' -ForegroundColor Green
