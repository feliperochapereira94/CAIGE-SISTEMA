#!/usr/bin/env pwsh
# Script para visualizar logs em tempo real

$logFile = "D:\CAIGE SISTEMA\Backend\logs\app.log"

if (-not (Test-Path $logFile)) {
    Write-Host "Arquivo de log não encontrado: $logFile"
    exit 1
}

Write-Host "📋 Acompanhando log em tempo real..." -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

Get-Content $logFile -Wait -Tail 100
