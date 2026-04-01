# Script para rodar Backend + Frontend simultaneamente

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "     INICIANDO CAIGE SISTEMA" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não está instalado!" -ForegroundColor Red
    exit 1
}

# Verificar se live-server está instalado
Write-Host "✓ Verificando live-server..." -ForegroundColor Yellow
$liveServer = npm list -g live-server 2>&1 | Select-String "live-server"
if (-not $liveServer) {
    Write-Host "  Instalando live-server..." -ForegroundColor Yellow
    npm install -g live-server | Out-Null
    Write-Host "  ✓ live-server instalado" -ForegroundColor Green
} else {
    Write-Host "  ✓ live-server já está instalado" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Iniciando servidores..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  🔧 Backend: http://localhost:3000" -ForegroundColor Blue
Write-Host "  🎨 Frontend: http://localhost:5500" -ForegroundColor Blue
Write-Host ""

# Parar qualquer processo Node anterior
Write-Host "⏹️  Limpando processos anteriores..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Iniciar Backend em background
Write-Host ""
Write-Host "1️⃣  Iniciando Backend (npm run dev)..." -ForegroundColor Green
$backendJob = Start-Job -WorkingDirectory "D:\CAIGE SISTEMA\Backend" -ScriptBlock {
    cd "D:\CAIGE SISTEMA\Backend"
    npm run dev
}
Write-Host "   ✓ Backend iniciado (Job ID: $($backendJob.Id))" -ForegroundColor Green

# Aguardar backend ficar pronto
Start-Sleep -Seconds 3

# Iniciar Frontend em uma nova janela (para ficar visível)
Write-Host ""
Write-Host "2️⃣  Iniciando Frontend (live-server)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\CAIGE SISTEMA\Frontend'; live-server --port=5500"
Write-Host "   ✓ Frontend iniciado em nova janela" -ForegroundColor Green

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "   SISTEMAS INICIADOS COM SUCESSO!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Instruções:" -ForegroundColor Cyan
Write-Host "   - Backend está rodando aqui no PowerShell"
Write-Host "   - Frontend abriu em nova janela"
Write-Host "   - Pressione Ctrl+C aqui para parar o Backend"
Write-Host "   - Pressione Ctrl+C na outra janela para parar o Frontend"
Write-Host ""
Write-Host "🌐 Acesse:" -ForegroundColor Yellow
Write-Host "   - Login: http://localhost:5500"
Write-Host "   - API: http://localhost:3000"
Write-Host ""

# Aguardar entrada do usuário
Read-Host "Pressione Enter para sair"

# Parar jobs
Write-Host ""
Write-Host "Parando servidores..." -ForegroundColor Yellow
Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
Write-Host "✓ Servidores parados" -ForegroundColor Green
