# Implantacao

## Objetivo

Descrever como preparar o sistema para disponibilizacao controlada e manutencao apos a entrega.

## Ambiente minimo

- servidor ou computador com Node.js e MySQL instalados;
- acesso ao banco de dados configurado corretamente;
- portas liberadas para frontend e backend;
- pasta de uploads com permissao de escrita.

## Passos gerais de implantacao

1. copiar o projeto para o ambiente de destino;
2. instalar dependencias do backend e do frontend;
3. configurar variaveis de ambiente;
4. criar banco e tabelas;
5. validar uploads e arquivos estaticos;
6. iniciar backend e frontend;
7. testar login e fluxos essenciais.

## Itens de verificacao apos subir o sistema

- acesso ao frontend;
- resposta da API;
- conexao com o banco;
- autenticacao de usuario;
- cadastro e consulta de paciente;
- upload de prontuario;
- gravacao de frequencia.

## Backup e recuperacao

Na versao final, recomenda-se incluir:

- procedimento de backup do banco;
- frequencia de backup;
- procedimento de recuperacao;
- local de armazenamento dos arquivos de upload.

## Cuidados para manutencao

- registrar alteracoes de schema;
- manter um historico de scripts SQL executados;
- versionar alteracoes da API e do frontend;
- revisar logs periodicamente.