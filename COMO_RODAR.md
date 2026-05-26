# Como Rodar o CAIGE

## Requisitos

- Node.js 18+
- MySQL em execucao
- Dependencias instaladas em Backend e Frontend

## Opcao 1: iniciar tudo de uma vez

PowerShell:

```powershell
cd "caminho/do/repositorio/CAIGE-SISTEMA"
.\start-all.ps1
```

CMD:

```cmd
cd caminho\do\repositorio\CAIGE-SISTEMA
start-all.bat
```

## Opcao 2: iniciar separadamente

Terminal 1 (backend):

```powershell
cd "caminho/do/repositorio/CAIGE-SISTEMA/Backend"
npm install
npm run dev
```

Terminal 2 (frontend):

```powershell
cd "caminho/do/repositorio/CAIGE-SISTEMA/Frontend"
npm install
npm run dev
```

## URLs padrao

- Frontend: http://localhost:5500
- Backend: http://localhost:3000

## Credencial inicial de teste

Use a credencial configurada no seu banco local (script de setup vigente).

## Troubleshooting rapido

Live Server nao inicia:

```powershell
npm install -g live-server
```

Backend com erro:

```powershell
cd "caminho/do/repositorio/CAIGE-SISTEMA/Backend"
npm run dev
Get-Content .\logs\app.log -Tail 80
```
