# Run ONCE in the project root (PowerShell):  .\scripts\run-batch2.ps1
# ASCII only on purpose (Windows PowerShell 5 breaks on UTF-8 without BOM).
# Does: compress Drive photos -> upload everything to Supabase. The key stays in this session only.
$ErrorActionPreference = 'Stop'
if (-not (Test-Path 'local-cards/_ready/manifest-b2-supreme.json')) {
  Write-Host 'Missing local-cards/_ready/manifest-b2-supreme.json' -ForegroundColor Red; exit 1 }
$dir = Read-Host 'Path to the Drive folder you downloaded (612 photos)'
$dir = $dir.Trim([char]34)
if (-not (Test-Path $dir)) { Write-Host 'Folder not found.' -ForegroundColor Red; exit 1 }
$sec = Read-Host 'Paste service_role key (hidden)' -AsSecureString
$env:SUPABASE_SERVICE_ROLE_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
$env:SUPABASE_URL = 'https://trkkluqvcrxaoqmnxmhz.supabase.co'
npm install --no-audit --no-fund
node scripts/prepare-batch2.mjs $dir
npm run upload-cards -- manifest-b2.json manifest-b2-supreme.json
Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY
Write-Host 'DONE. Send Claude the line that starts with Xong:' -ForegroundColor Green
