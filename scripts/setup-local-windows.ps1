[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

$databaseName = 'eflav_vakfi'
$envFile = Join-Path $projectRoot '.env.local'
if (Test-Path -LiteralPath $envFile) {
  $databaseNameLine = Get-Content -LiteralPath $envFile |
    Where-Object { $_ -match '^DB_NAME=' } |
    Select-Object -First 1
  if ($databaseNameLine) {
    $configuredName = ($databaseNameLine -replace '^DB_NAME=', '').Trim()
    if ($configuredName) { $databaseName = $configuredName }
  }
}

$xamppRoot = 'C:\xampp\mysql'
$xamppServer = Join-Path $xamppRoot 'bin\mysqld.exe'
$xamppConfig = Join-Path $xamppRoot 'bin\my.ini'
$xamppDatabase = Join-Path $xamppRoot ('data\' + $databaseName)

function Test-DatabasePort {
  return Test-NetConnection -ComputerName '127.0.0.1' -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
}

function Wait-DatabasePort {
  param([int]$TimeoutSeconds = 30)

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    if (Test-DatabasePort) { return }
    Start-Sleep -Milliseconds 500
  }
  throw 'Veritabanı sunucusu 30 saniye içinde 3306 portunda hazır olmadı.'
}

if (Test-DatabasePort) {
  Write-Host '3306 portunda çalışan MySQL/MariaDB sunucusu bulundu.' -ForegroundColor Green
} elseif (
  (Test-Path -LiteralPath $xamppServer) -and
  (Test-Path -LiteralPath $xamppConfig) -and
  (Test-Path -LiteralPath $xamppDatabase)
) {
  Start-Process `
    -FilePath $xamppServer `
    -ArgumentList "--defaults-file=$xamppConfig", '--standalone' `
    -WindowStyle Hidden
  Wait-DatabasePort
  Write-Host "Mevcut $databaseName verilerini içeren XAMPP MariaDB başlatıldı." -ForegroundColor Green
} else {
  $principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
  $isAdministrator = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdministrator) {
    Write-Error 'MySQL80 hizmetini başlatmak için Windows PowerShell yönetici olarak açılmalıdır.'
  }

  $mysqlService = Get-Service -Name 'MySQL80' -ErrorAction SilentlyContinue
  if (-not $mysqlService) {
    Write-Error 'Çalışan MySQL/MariaDB sunucusu, eski XAMPP veritabanı veya MySQL80 hizmeti bulunamadı.'
  }

  Set-Service -Name 'MySQL80' -StartupType Automatic
  Start-Service -Name 'MySQL80'
  $mysqlService.WaitForStatus('Running', [TimeSpan]::FromSeconds(30))
  Write-Host 'MySQL80 çalışıyor ve otomatik başlangıç etkin.' -ForegroundColor Green
}

& npm.cmd run db:migrate
if ($LASTEXITCODE -ne 0) {
  Write-Error 'Migration işlemi başarısız oldu. .env.local veritabanı bilgilerini kontrol edin.'
}

if ($env:INITIAL_ADMIN_NAME -and $env:INITIAL_ADMIN_EMAIL -and $env:INITIAL_ADMIN_PASSWORD) {
  & npm.cmd run admin:create
  if ($LASTEXITCODE -ne 0) { Write-Error 'İlk yönetici hesabı oluşturulamadı.' }
  Write-Warning 'INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL ve INITIAL_ADMIN_PASSWORD değerlerini bu oturumdan temizleyin.'
} else {
  Write-Warning 'INITIAL_ADMIN_* değerleri tanımlı olmadığı için yönetici hesabı oluşturma adımı atlandı.'
}

& npm.cmd run verify
if ($LASTEXITCODE -ne 0) { Write-Error 'Proje doğrulaması başarısız oldu.' }

Write-Host 'Yerel kurulum ve doğrulama tamamlandı.' -ForegroundColor Green
