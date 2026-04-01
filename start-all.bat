@echo off
ECHO.
ECHO =================================
ECHO     INICIANDO CAIGE SISTEMA
ECHO =================================
ECHO.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    ECHO ERRO: Node.js nao esta instalado!
    pause
    exit /b 1
)

REM Verificar se live-server está instalado
npm list -g live-server >nul 2>&1
if errorlevel 1 (
    ECHO Instalando live-server...
    call npm install -g live-server
)

ECHO.
ECHO ?  Backend rodando em http://localhost:3000
ECHO ?  Frontend rodando em http://localhost:5500
ECHO.
ECHO Pressione Ctrl+C para parar os servidores
ECHO.

REM Iniciar Backend em uma aba nova
start cmd /k "cd Backend && npm run dev"

REM Aguardar um pouco para o backend iniciar
timeout /t 2

REM Iniciar Frontend em outra aba
start cmd /k "cd Frontend && npm run dev"

ECHO.
ECHO ? Servidores iniciados!
ECHO ? No Windows, use Ctrl+C em cada janela para parar
ECHO.
