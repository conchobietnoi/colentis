# Upload only (after prepare-batch2 already ran). ASCII only.  .\scripts\upload-batch2.ps1
$ErrorActionPreference = 'Stop'
$sec = Read-Host 'Paste service_role key (hidden)' -AsSecureString
$env:SUPABASE_SERVICE_ROLE_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
$env:SUPABASE_URL = 'https://trkkluqvcrxaoqmnxmhz.supabase.co'
npm run upload-cards -- manifest-b2.json manifest-b2-supreme.json
Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY
Write-Host 'DONE. Send Claude the line that starts with Xong:' -ForegroundColor Green
