# Como Rodar o CAIGE

## Requisitos

- Node.js 18+
- MySQL em execucao
- Dependencias instaladas em Backend e Frontend

## Opcao 1: iniciar tudo de uma vez

PowerShell:

```powershell
cd "D:\CAIGE SISTEMA"
.\start-all.ps1
```

CMD:

```cmd
cd D:\CAIGE SISTEMA
start-all.bat
```

## Opcao 2: iniciar separadamente

Terminal 1 (backend):

```powershell
cd "D:\CAIGE SISTEMA\Backend"
npm install
npm run dev
```

Terminal 2 (frontend):

```powershell
cd "D:\CAIGE SISTEMA\Frontend"
npm install
npm run dev
```

## URLs padrao

- Frontend: http://localhost:5500
- Backend: http://localhost:3000

## Credencial inicial de teste

- Email: suportecaige@univale.br
- Senha: 123456

## Troubleshooting rapido

Live Server nao inicia:

```powershell
npm install -g live-server
```

Backend com erro:

```powershell
cd "D:\CAIGE SISTEMA\Backend"
npm run dev
Get-Content .\logs\app.log -Tail 80
```
