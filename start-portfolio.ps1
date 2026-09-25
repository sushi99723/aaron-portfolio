$ErrorActionPreference = "Stop"
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$existing = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($existing) { exit 0 }

$node = (Get-Command node -ErrorAction Stop).Source
$outLog = Join-Path $project "portfolio-server.log"
$errorLog = Join-Path $project "portfolio-server-error.log"
Start-Process -FilePath $node -ArgumentList "serve-portfolio.mjs" -WorkingDirectory $project -WindowStyle Hidden -RedirectStandardOutput $outLog -RedirectStandardError $errorLog
