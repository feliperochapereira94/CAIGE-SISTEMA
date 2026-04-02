# Manual do Usuario

## Objetivo

Orientar o uso do sistema para usuarios finais, especialmente supervisores e professores.

## Perfil do leitor

Este manual deve ser lido por quem vai operar o sistema, e nao necessariamente por quem vai desenvolver o software.

## Fluxo basico de uso

1. acessar a tela de login;
2. informar email institucional e senha;
3. entrar no dashboard;
## Tela de login

Local da tela: `Frontend/pages/auth/login.html`

Print sugerido: Print 01 - Tela de login

Passos:

1. Acesse o endereco inicial do sistema no navegador.
2. Na tela `Área Restrita - CAIGE`, informe o email institucional no campo `E-mail ou Usuário`.
3. Informe a senha no campo `Senha`.
4. Se desejar que o email fique salvo para o proximo acesso, marque `Lembrar de mim`.
5. Clique em `Entrar`.
6. Aguarde a mensagem de sucesso e o redirecionamento para o dashboard.

Comportamentos importantes:

- o backend aceita apenas email com dominio `@univale.br`;
- se email ou senha estiverem vazios, a tela exibe alerta de preenchimento obrigatorio;
- se o backend nao estiver rodando, a tela informa erro de conexao com `http://localhost:3000`.

## Dashboard

Local da tela: `Frontend/pages/dashboard/dashboard.html`

Print sugerido: Print 02 - Dashboard principal

O dashboard e a area inicial apos login e apresenta um resumo visual do sistema.

Elementos principais da tela:

- menu lateral com acesso aos modulos;
- cabecalho com nome do usuario;
- cartoes de estatisticas gerais;
- painel de atividades recentes;
- menu do usuario com opcoes de conta e saida.

Passos:

1. Apos o login, aguarde o carregamento da tela `Dashboard - CAIGE`.
2. Confira as estatisticas gerais exibidas em forma de cartoes.
3. Verifique a lista de atividades recentes para acompanhar movimentacoes do sistema.
4. Use o menu lateral para navegar para `Atividades`, `Pacientes`, `Prontuários` e `Frequência`.

## Menu do usuario e minha conta

Print sugerido: Print 03 - Menu do usuario e modal Minha Conta

Passos para acessar:

1. Clique no avatar do usuario no canto superior direito.
2. No menu aberto, selecione `Minha Conta`.
3. Na aba `Perfil`, revise ou altere o nome.
4. Clique em `Salvar Alterações` para concluir.
5. Para alterar a senha, acesse a aba `Senha`, informe a senha atual, a nova senha e a confirmacao.
6. Clique em `Alterar Senha`.

Observacoes:

- o email aparece apenas para consulta e nao pode ser alterado;
- o botao `Gerenciar Usuários` aparece apenas quando o perfil possui permissao adequada;
- a opcao `Sair` encerra o uso atual e redireciona para a tela de login.

## Pacientes cadastrados

Local da tela: `Frontend/pages/patients/list.html`

Print sugerido: Print 04 - Listagem de pacientes

Objetivo da tela: consultar, localizar e acessar rapidamente os registros de pacientes.

Passos:

1. No menu lateral, clique em `Pacientes`.
2. Confira a tela `Pacientes Cadastrados`.
3. Use o campo `Buscar por nome...` para localizar um paciente.
4. Utilize os filtros de status e ordenacao quando necessario.
5. Observe a tabela com nome, idade, telefone, status e acoes.
6. Para novo cadastro, clique em `+ Cadastrar Paciente`.

## Cadastro de paciente

Local da tela: `Frontend/pages/patients/new.html`

Print sugerido: Print 05 - Cadastro de paciente

Passos:

1. A partir da listagem, clique em `+ Cadastrar Paciente`.
2. Preencha os dados pessoais do paciente.
3. Informe endereco, cidade, estado e dados do responsavel.
4. Informe pelo menos um telefone valido.
5. Se necessario, adicione foto e observacoes.
6. Defina o status do paciente.
7. Clique em salvar para concluir o cadastro.

Campos de atencao:

- nome, data de nascimento, endereco, responsavel e status sao obrigatorios;
- o sistema exige pelo menos um telefone preenchido;
- os formatos de telefone devem seguir o padrao adotado pela aplicacao.

## Visualizacao e edicao de paciente

Locais das telas:

- `Frontend/pages/patients/view.html`
- `Frontend/pages/patients/edit.html`

Print sugerido: Print 06 - Perfil do paciente

Print sugerido: Print 07 - Edicao de paciente

Passos:

1. Na listagem de pacientes, localize o registro desejado.
2. Clique na acao de visualizacao para abrir o perfil completo.
3. Revise dados cadastrais, informacoes complementares e historico relacionado.
4. Quando for necessario corrigir ou atualizar dados, acesse a opcao de edicao.
5. Ajuste os campos desejados e salve as alteracoes.

## Registro de frequencia

Local da tela: `Frontend/pages/attendance/attendance.html`

Print sugerido: Print 08 - Registro de frequencia

Objetivo da tela: registrar a presenca diaria dos pacientes.

Passos:

1. No menu lateral, abra `Frequência`.
2. Clique em `Registrar Frequência`.
3. Localize o paciente pelo campo de busca da tela.
4. Selecione o paciente desejado.
5. Informe profissional responsavel e observacoes, quando aplicavel.
6. Clique no botao de registro de presenca.
7. Aguarde a confirmacao na tela.

Comportamentos importantes:

- o sistema impede duas presencas do mesmo paciente no mesmo dia;
- a tela tambem exibe o status das presencas ja registradas no dia.

## Relatorio de frequencia

Local da tela: `Frontend/pages/attendance/frequency-report.html`

Print sugerido: Print 09 - Relatorio de frequencia

Passos:

1. No menu `Frequência`, acesse `Relatório Frequência`.
2. Informe periodo inicial e final.
3. Se necessario, filtre por paciente ou setor.
4. Gere o relatorio.
5. Analise quantidade de dias presentes, entradas registradas e datas de comparecimento.

## Prontuarios cadastrados

Local da tela: `Frontend/pages/patients/medical-records.html`

Print sugerido: Print 10 - Gestao de prontuarios

Objetivo da tela: visualizar e anexar prontuarios ligados aos pacientes.

Passos:

1. No menu lateral, abra `Prontuários`.
2. Clique em `Prontuários Cadastrados`.
3. Selecione o paciente desejado.
4. Escolha a especialidade ou curso relacionado ao prontuario.
5. Anexe o arquivo permitido.
6. Se necessario, preencha observacoes.
7. Salve o prontuario.
8. Use a listagem da tela para consultar, baixar ou remover registros.

Observacoes:

- o sistema aceita PDF, JPG, PNG, DOC e DOCX;
- o limite de upload e de 10 MB por arquivo;
- o curso informado precisa existir e estar ativo no sistema.

## Cadastro de perguntas e questionarios

Local da tela: `Frontend/pages/patients/questions.html`

Print sugerido: Print 11 - Cadastro de perguntas e questionarios

Passos:

1. No menu `Prontuários`, clique em `Cadastro de Perguntas`.
2. Selecione o curso correspondente.
3. Para criar pergunta, informe titulo, descricao, tipo e opcoes quando houver multipla escolha.
4. Salve a pergunta.
5. Para montar um questionario, selecione as perguntas desejadas.
6. Defina titulo e descricao do questionario.
7. Salve o questionario.
8. Quando o questionario estiver pronto, publique-o.

## Atividades

Local da tela: `Frontend/pages/activities/activities.html`

Print sugerido: Print 12 - Historico de atividades

Passos:

1. No menu lateral, clique em `Atividades`.
2. Consulte a lista de registros realizados no sistema.
3. Utilize filtros por data, tipo ou responsavel, quando necessario.
4. Use essa tela para acompanhamento operacional e auditoria basica.

## Encerramento de sessao

Print sugerido: Print 13 - Opcao sair

Passos:

1. Clique no avatar do usuario no canto superior direito.
2. Selecione `Sair`.
3. O sistema removera os dados de autenticacao armazenados e redirecionara para a tela de login.

## Erros operacionais comuns

### Nao foi possivel entrar no sistema

- confirme se o backend esta ativo em `http://localhost:3000`;
- confirme se o email utiliza o dominio `@univale.br`;
- revise usuario e senha.

### Dados nao carregam nas telas internas

- verifique se o login foi realizado corretamente;
- confira se o email do usuario esta armazenado e sendo enviado nas requisicoes;
- confirme se o perfil possui permissao para a funcionalidade acessada.

### Nao foi possivel registrar frequencia

- verifique se o paciente foi selecionado corretamente;
- confirme se a presenca daquele paciente ja nao foi registrada no mesmo dia.

### Nao foi possivel anexar prontuario

- confira o tipo e o tamanho do arquivo;
- confirme se a especialidade escolhida existe na lista de cursos.
5. cadastrar, consultar ou editar informacoes conforme a permissao do perfil.