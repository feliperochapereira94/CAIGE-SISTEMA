# Inicia Backend e Frontend do CAIGE com paths relativos ao repositorio

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $repoRoot 'Backend'
$frontendPath = Join-Path $repoRoot 'Frontend'

Write-Host ''
Write-Host '=================================' -ForegroundColor Cyan
Write-Host '     INICIANDO CAIGE SISTEMA' -ForegroundColor Cyan
Write-Host '=================================' -ForegroundColor Cyan
Write-Host ''

if (-not (Test-Path $backendPath) -or -not (Test-Path $frontendPath)) {
    Write-Host 'Estrutura esperada nao encontrada (Backend/Frontend).' -ForegroundColor Red
    exit 1
}

try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host 'Node.js nao esta instalado.' -ForegroundColor Red
    exit 1
}

Write-Host ''
Write-Host 'Iniciando servidores em novas janelas...' -ForegroundColor Cyan
Write-Host 'Backend:  http://localhost:3000' -ForegroundColor Blue
Write-Host 'Frontend: http://localhost:5500' -ForegroundColor Blue
Write-Host ''

Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$backendPath'; npm run dev"
)

Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$frontendPath'; npm run dev"
)

Write-Host 'Servidores disparados com sucesso.' -ForegroundColor Green
Write-Host 'Use Ctrl+C em cada janela para encerrar.' -ForegroundColor Yellow
