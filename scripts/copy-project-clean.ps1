# Скрипт для создания чистой копии проекта
# Использование: .\scripts\copy-project-clean.ps1 -DestinationPath "C:\path\to\new-project"

param(
    [Parameter(Mandatory=$true)]
    [string]$DestinationPath
)

$SourcePath = $PSScriptRoot + "\.."
$SourcePath = Resolve-Path $SourcePath

Write-Host "Создание чистой копии проекта..." -ForegroundColor Green
Write-Host "Источник: $SourcePath" -ForegroundColor Cyan
Write-Host "Назначение: $DestinationPath" -ForegroundColor Cyan

# Создаем директорию назначения, если её нет
if (-not (Test-Path $DestinationPath)) {
    New-Item -ItemType Directory -Path $DestinationPath -Force | Out-Null
    Write-Host "Создана директория: $DestinationPath" -ForegroundColor Yellow
}

# Список директорий и файлов для исключения
$ExcludeItems = @(
    "node_modules",
    ".next",
    ".git",
    ".vercel",
    "coverage",
    "out",
    "build",
    ".pnp",
    ".yarn",
    ".DS_Store"
)

# Список файлов для исключения
$ExcludeFiles = @(
    "*.log",
    "*.pem",
    "*.tsbuildinfo",
    "next-env.d.ts",
    ".env",
    ".env.local",
    ".env.development.local",
    ".env.test.local",
    ".env.production.local"
)

Write-Host "`nКопирование файлов..." -ForegroundColor Green

# Копируем все файлы и директории, исключая указанные
Get-ChildItem -Path $SourcePath -Recurse | Where-Object {
    $relativePath = $_.FullName.Substring($SourcePath.Length + 1)
    $shouldExclude = $false
    
    # Проверяем директории
    foreach ($exclude in $ExcludeItems) {
        if ($relativePath -like "$exclude*" -or $relativePath -like "*\$exclude\*") {
            $shouldExclude = $true
            break
        }
    }
    
    # Проверяем файлы
    if (-not $shouldExclude) {
        foreach ($excludeFile in $ExcludeFiles) {
            if ($_.Name -like $excludeFile) {
                $shouldExclude = $true
                break
            }
        }
    }
    
    -not $shouldExclude
} | Copy-Item -Destination {
    $_.FullName.Replace($SourcePath, $DestinationPath)
} -Force

Write-Host "`nКопирование завершено!" -ForegroundColor Green
Write-Host "`nСледующие шаги:" -ForegroundColor Yellow
Write-Host "1. Перейдите в новую директорию: cd `"$DestinationPath`"" -ForegroundColor Cyan
Write-Host "2. Установите зависимости: npm install" -ForegroundColor Cyan
Write-Host "3. (Опционально) Инициализируйте git: git init" -ForegroundColor Cyan
Write-Host "4. (Опционально) Создайте .env файлы при необходимости" -ForegroundColor Cyan

