# Upload 40 POLA DAY images to private bucket "pola". ASCII only.  Run:  .\scripts\upload-pola.ps1
$ErrorActionPreference = 'Stop'
$sec = Read-Host 'Paste service_role key (hidden)' -AsSecureString
$env:SUPABASE_SERVICE_ROLE_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
$env:SUPABASE_URL = 'https://trkkluqvcrxaoqmnxmhz.supabase.co'
node scripts/upload-pola.mjs
Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY
Write-Host 'DONE. Send Claude the line that starts with Xong:' -ForegroundColor Green
