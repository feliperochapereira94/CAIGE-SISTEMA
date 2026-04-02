# API

## Objetivo

Documentar os endpoints expostos pelo backend, permitindo que outra pessoa compreenda como integrar, testar ou evoluir a aplicacao.

## Base URL local

- `http://localhost:3000`

## Politica de autenticacao e sessao

O backend atual nao utiliza JWT, cookie de sessao nem header `Authorization`.

### Como a autenticacao funciona na pratica

1. O frontend envia `POST /login` com email e senha.
2. Se o login for aceito, o frontend salva o email do usuario em `sessionStorage` e `localStorage` com a chave `userEmail`.
3. Nas chamadas protegidas, o frontend envia esse valor no header customizado `x-user-email`.
4. O middleware [../Backend/src/middleware/auth.js](../Backend/src/middleware/auth.js) consulta a tabela `users` usando esse email.
5. Se o usuario existir, ele e colocado em `req.user` e as demais permissoes sao validadas.

### Header exigido nas rotas protegidas

```http
x-user-email: suportecaige@univale.br
```

### Headers normalmente usados

Requisicoes JSON:

```http
Content-Type: application/json
x-user-email: suportecaige@univale.br
```

Upload de arquivo:

```http
x-user-email: suportecaige@univale.br
```

Observacao: no upload com `multipart/form-data`, o navegador monta automaticamente o `Content-Type` com boundary.

### Armazenamento no frontend

Com base em [../Frontend/pages/auth/login.html](../Frontend/pages/auth/login.html), [../Frontend/assets/js/user-menu.js](../Frontend/assets/js/user-menu.js) e [../Frontend/index.html](../Frontend/index.html):

- `sessionStorage['userEmail']`: mantem autenticacao durante a sessao ativa do navegador;
- `localStorage['userEmail']`: reaproveitado pelas demais paginas para montar o header `x-user-email`;
- `localStorage['rememberedUserEmail']`: usado apenas para preencher automaticamente o email na tela de login quando a opcao "Lembrar de mim" estiver marcada.

### Consequencias tecnicas desta abordagem

- nao ha token assinado nem expiracao formal de sessao;
- o backend confia no valor enviado em `x-user-email`;
- a autorizacao depende da existencia do usuario e das permissoes da role no banco;
- para ambiente academico e demonstracao isso funciona, mas para producao seria recomendavel evoluir para autenticacao baseada em token ou sessao de servidor.

## Visao geral da API

Com base nas rotas efetivamente registradas em [../Backend/src/server.js](../Backend/src/server.js), a API esta organizada nos modulos abaixo:

- autenticacao
- usuarios
- pacientes
- dashboard
- atividades
- frequencia
- arquivamento
- prontuarios
- questionarios
- cursos

## Autenticacao e autorizacao

O projeto utiliza middleware de autenticacao e controle de permissao em boa parte das rotas.

### Permissoes observadas nas rotas

- `requireAuth`: exige usuario autenticado
- `requireSupervisor`: exige perfil de supervisor
- `requirePermission('can_view_patient')`
- `requirePermission('can_create_patient')`
- `requirePermission('can_edit_patient')`
- `requirePermission('can_check_in')`
- `requirePermission('can_view_reports')`
- `requirePermission('can_view_medical_records')`
- `requirePermission('can_manage_activities')`

### Observacao importante

Algumas rotas, como `/login`, `/change-password`, `/profile`, `/dashboard-data` e a raiz `/`, aparecem sem middleware explicito no arquivo de rotas. Para a entrega final, convem validar no codigo dos controllers se existe protecao adicional e documentar isso de forma consistente.

## Resumo geral das rotas

| Metodo | Caminho | Modulo | Protecao principal |
|--------|---------|--------|--------------------|
| POST | /login | autenticacao | publica |
| POST | /change-password | autenticacao | sem middleware explicito na rota |
| GET | /profile | autenticacao | sem middleware explicito na rota |
| PUT | /profile | autenticacao | sem middleware explicito na rota |
| GET | /api/users/profile | usuarios | autenticado |
| GET | /api/users/permissions | usuarios | autenticado |
| GET | /api/users | usuarios | supervisor |
| POST | /api/users | usuarios | supervisor |
| PUT | /api/users/:id | usuarios | supervisor |
| DELETE | /api/users/:id | usuarios | supervisor |
| GET | /api/patients | pacientes | can_view_patient |
| GET | /api/patients/:id | pacientes | can_view_patient |
| POST | /api/patients | pacientes | can_create_patient |
| PUT | /api/patients/:id | pacientes | can_edit_patient |
| DELETE | /api/patients/:id | pacientes | can_edit_patient |
| GET | /dashboard-data | dashboard | sem middleware explicito na rota |
| GET | /api/activities | atividades | autenticado |
| POST | /api/attendance/register | frequencia | can_check_in |
| GET | /api/attendance/history | frequencia | autenticado |
| GET | /api/attendance/report | frequencia | can_view_reports |
| GET | /api/attendance/today | frequencia | autenticado |
| GET | /api/archive/users | arquivamento | supervisor |
| GET | /api/archive/patients | arquivamento | supervisor |
| GET | /api/medical-records/:patient_id | prontuarios | can_view_medical_records |
| POST | /api/medical-records/:patient_id/upload | prontuarios | can_view_medical_records |
| DELETE | /api/medical-records/:record_id | prontuarios | can_view_medical_records |
| GET | /api/medical-records/:record_id/download | prontuarios | can_view_medical_records |
| GET | /api/questionnaires/questions/course/:course | questionarios | can_view_medical_records |
| POST | /api/questionnaires/questions | questionarios | can_manage_activities |
| PUT | /api/questionnaires/questions/:id | questionarios | can_manage_activities |
| DELETE | /api/questionnaires/questions/:id | questionarios | can_manage_activities |
| GET | /api/questionnaires/questionnaires/course/:course | questionarios | can_view_medical_records |
| POST | /api/questionnaires/questionnaires | questionarios | can_manage_activities |
| PUT | /api/questionnaires/questionnaires/:id | questionarios | can_manage_activities |
| PATCH | /api/questionnaires/questionnaires/:id/publish | questionarios | can_manage_activities |
| DELETE | /api/questionnaires/questionnaires/:id | questionarios | can_manage_activities |
| GET | /api/questionnaires/questionnaires/:id/questions | questionarios | can_view_medical_records |
| POST | /api/questionnaires/responses | questionarios | can_view_medical_records |
| GET | /api/questionnaires/responses/:patientId/:questionnaireId | questionarios | can_view_medical_records |
| GET | /api/courses | cursos | autenticado |
| POST | /api/courses | cursos | supervisor |
| PUT | /api/courses/:id | cursos | supervisor |
| DELETE | /api/courses/:id | cursos | supervisor |

## 1. Autenticacao

Baseado em [../Backend/src/routes/auth.js](../Backend/src/routes/auth.js).

### POST /login

Objetivo: autenticar o usuario.

Corpo esperado:

```json
{
	"email": "suportecaige@univale.br",
	"password": "123456"
}
```

Campos observados no controller:

- `email`
- `password`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Login autorizado.",
	"name": "Suporte CAIGE",
	"lastLogin": "2026-04-01T21:14:33.000Z"
}
```

Erros observados no codigo:

```json
{
	"message": "Informe email e senha."
}
```

```json
{
	"message": "Use o e-mail institucional @univale.br."
}
```

```json
{
	"message": "Credenciais inválidas."
}
```

### POST /change-password

Objetivo: alterar senha do usuario.

Corpo esperado:

```json
{
	"email": "suportecaige@univale.br",
	"currentPassword": "123456",
	"newPassword": "novaSenha"
}
```

Campos observados no controller:

- `email`
- `currentPassword`
- `newPassword`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Senha alterada com sucesso."
}
```

### GET /profile

Objetivo: obter perfil do usuario logado ou perfil em contexto de sessao.

Header necessario:

```http
x-user-email: suportecaige@univale.br
```

Exemplo real de resposta com sucesso:

```json
{
	"id": 1,
	"email": "suportecaige@univale.br",
	"name": "Suporte CAIGE",
	"role": "SUPERVISOR",
	"sector": "Fisioterapia",
	"course": "Fisioterapia",
	"lastLogin": "2026-04-01T21:14:33.000Z"
}
```

### PUT /profile

Objetivo: atualizar dados basicos do perfil.

Corpo observado no controller:

```json
{
	"name": "Nome Atualizado"
}
```

Exemplo real de resposta com sucesso:

```json
{
	"message": "Perfil atualizado com sucesso."
}
```

## 2. Usuarios

Baseado em [../Backend/src/routes/users.js](../Backend/src/routes/users.js).

### GET /api/users/profile

Objetivo: retornar o perfil do usuario autenticado.

Protecao: `requireAuth`

Exemplo real de resposta com sucesso:

```json
{
	"user": {
		"id": 1,
		"email": "suportecaige@univale.br",
		"role": "SUPERVISOR",
		"sector": "Fisioterapia",
		"created_at": "2026-02-04T18:00:00.000Z"
	},
	"permissions": {
		"role": "SUPERVISOR",
		"can_check_in": 1,
		"can_create_patient": 1,
		"can_edit_patient": 1,
		"can_view_patient": 1,
		"can_view_reports": 1,
		"can_create_user": 1,
		"can_edit_user": 1,
		"can_view_medical_records": 1,
		"can_manage_activities": 1,
		"can_access_dashboard": 1
	}
}
```

### GET /api/users/permissions

Objetivo: retornar as permissoes do usuario autenticado.

Protecao: `requireAuth`

Exemplo real de resposta com sucesso:

```json
{
	"role": "SUPERVISOR",
	"can_check_in": 1,
	"can_create_patient": 1,
	"can_edit_patient": 1,
	"can_view_patient": 1,
	"can_view_reports": 1,
	"can_create_user": 1,
	"can_edit_user": 1,
	"can_view_medical_records": 1,
	"can_manage_activities": 1,
	"can_access_dashboard": 1
}
```

### GET /api/users

Objetivo: listar usuarios cadastrados.

Protecao: `requireAuth` e `requireSupervisor`

Exemplo real de resposta com sucesso:

```json
[
	{
		"id": 1,
		"email": "suportecaige@univale.br",
		"role": "SUPERVISOR",
		"sector": "Fisioterapia",
		"created_by": null,
		"is_active": 1,
		"created_at": "2026-02-04T18:00:00.000Z"
	}
]
```

### POST /api/users

Objetivo: criar novo usuario.

Protecao: `requireAuth` e `requireSupervisor`

Corpo esperado:

```json
{
	"email": "professor@univale.br",
	"password": "123456",
	"role": "PROFESSOR",
	"sector": "Fisioterapia"
}
```

Campos observados no controller:

- `email`
- `password`
- `role` com padrao `PROFESSOR`
- `sector`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Usuário criado com sucesso",
	"userId": 12
}
```

### PUT /api/users/:id

Objetivo: atualizar usuario existente.

Protecao: `requireAuth` e `requireSupervisor`

Corpo observado no controller:

```json
{
	"email": "professor@univale.br",
	"role": "PROFESSOR",
	"sector": "Fisioterapia",
	"is_active": true
}
```

Exemplo real de resposta com sucesso:

```json
{
	"message": "Usuário atualizado com sucesso"
}
```

### DELETE /api/users/:id

Objetivo: desabilitar usuario definitivamente.

Protecao: `requireAuth` e `requireSupervisor`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Usuário desabilitado definitivamente com sucesso"
}
```

## 3. Pacientes

Baseado em [../Backend/src/routes/patients.js](../Backend/src/routes/patients.js) e [../Backend/src/controllers/patientController.js](../Backend/src/controllers/patientController.js).

### GET /api/patients

Objetivo: listar pacientes ativos ou nao arquivados.

Protecao: `requireAuth` e `can_view_patient`

Query params observados:

- `q`: termo de busca por nome ou id
- `limit`: quantidade maxima de resultados, entre 1 e 100

Resposta: lista formatada de pacientes com id, nome, idade, telefone, localizacao, iniciais e status.

Exemplo real de resposta com sucesso:

```json
[
	{
		"id": 7,
		"name": "Maria Silva",
		"age": 71,
		"phone": "(33) 99999-8888",
		"location": "Centro, Governador Valadares",
		"initials": "MS",
		"status": "ativo"
	}
]
```

### GET /api/patients/:id

Objetivo: obter os dados completos de um paciente.

Protecao: `requireAuth` e `can_view_patient`

Exemplo real de resposta com sucesso:

```json
{
	"id": 7,
	"name": "Maria Silva",
	"birth_date": "1955-03-15T00:00:00.000Z",
	"gender": "feminino",
	"cpf": "123.456.789-00",
	"phone": "(33) 3333-4444",
	"phone2": "(33) 99999-8888",
	"city": "Governador Valadares",
	"state": "MG",
	"responsible": "Ana Silva",
	"status": "ativo"
}
```

### POST /api/patients

Objetivo: cadastrar novo paciente.

Protecao: `requireAuth` e `can_create_patient`

Corpo esperado:

```json
{
	"name": "Maria Silva",
	"birth_date": "1955-03-15",
	"gender": "feminino",
	"cpf": "123.456.789-00",
	"phone": "(33) 3333-4444",
	"phone2": "(33) 99999-8888",
	"cep": "35010-050",
	"street": "Rua das Flores",
	"number": "123",
	"neighborhood": "Centro",
	"city": "Governador Valadares",
	"state": "MG",
	"responsible": "Ana Silva",
	"responsible_relationship": "filha",
	"responsible_phone": "(33) 99999-0000",
	"photo": "data:image/png;base64,...",
	"observations": "Observacoes gerais",
	"status": "ativo"
}
```

Validacoes observadas:

- nome, data de nascimento, endereco, responsavel e status sao obrigatorios;
- pelo menos um telefone deve ser informado;
- telefone residencial no formato `(00) 0000-0000`;
- celular no formato `(00) 00000-0000`.

Exemplo real de resposta com sucesso:

```json
{
	"message": "Paciente cadastrado com sucesso!",
	"id": 25
}
```

### PUT /api/patients/:id

Objetivo: atualizar um paciente existente.

Protecao: `requireAuth` e `can_edit_patient`

Corpo: segue a mesma estrutura de cadastro.

Exemplo de retorno esperado: a rota retorna mensagem de sucesso quando a atualizacao e concluida.

### DELETE /api/patients/:id

Objetivo: desabilitar ou arquivar paciente.

Protecao: `requireAuth` e `can_edit_patient`

Exemplo de retorno esperado: a rota retorna mensagem de sucesso quando o paciente e arquivado ou desabilitado.

## 4. Dashboard

Baseado em [../Backend/src/routes/dashboard.js](../Backend/src/routes/dashboard.js) e [../Backend/src/controllers/dashboardController.js](../Backend/src/controllers/dashboardController.js).

### GET /dashboard-data

Objetivo: retornar estatisticas e atividades recentes do dashboard.

Resposta observada:

- `stats`: indicadores resumidos
- `activities`: lista de atividades recentes
- `message`: mensagem opcional quando nao ha dados

Exemplo real de resposta com sucesso:

```json
{
	"stats": [
		{
			"icon": "👤",
			"title": "Pacientes Cadastrados",
			"value": 18,
			"note": "Total de pessoas atendidas",
			"delta": "+0%",
			"deltaType": "positive"
		}
	],
	"activities": [
		{
			"id": 9,
			"date": "02/04/2026 14:10",
			"type": "Frequência",
			"description": "Maria Silva teve presença registrada",
			"responsible": "Sistema"
		}
	],
	"message": null
}
```

## 5. Atividades

Baseado em [../Backend/src/routes/activities.js](../Backend/src/routes/activities.js).

### GET /api/activities

Objetivo: listar atividades com filtros e paginacao simples.

Protecao: `requireAuth`

Query params observados:

- `date`: data no formato `YYYY-MM-DD`
- `type`: tipo da atividade
- `responsible`: filtro por responsavel
- `limit`: limite de resultados, padrao 100
- `offset`: deslocamento para paginacao, padrao 0

Resposta observada:

```json
{
	"activities": [],
	"total": 0,
	"limit": 100,
	"offset": 0,
	"hasMore": false
}
```

Exemplo real de item da lista:

```json
{
	"date": "02/04/2026 14:10",
	"type": "Novo Cadastro",
	"description": "Novo paciente cadastrado: Maria Silva (CPF: 123.456.789-00)",
	"responsible": "Sistema"
}
```

## 6. Frequencia

Baseado em [../Backend/src/routes/attendance.js](../Backend/src/routes/attendance.js).

### POST /api/attendance/register

Objetivo: registrar presenca diaria.

Protecao: `requireAuth` e `can_check_in`

Corpo observado no controller:

```json
{
	"patient_id": 1,
	"professional_id": 2,
	"notes": "Paciente presente no atendimento"
}
```

Exemplo real de resposta com sucesso:

```json
{
	"message": "Presença registrada com sucesso",
	"id": 33,
	"time": "2026-04-02T14:22:10.000Z"
}
```

### GET /api/attendance/history

Objetivo: listar historico de frequencia.

Protecao: `requireAuth`

Exemplo real de resposta com sucesso:

```json
{
	"data": [
		{
			"id": 33,
			"patient_id": 1,
			"name": "Maria Silva",
			"check_in_time": "2026-04-02T14:22:10.000Z",
			"notes": "Fisioterapia",
			"attendance_date": "2026-04-02T00:00:00.000Z"
		}
	],
	"pagination": {
		"total": 1,
		"limit": 50,
		"offset": 0
	}
}
```

### GET /api/attendance/report

Objetivo: retornar relatorio de frequencia.

Protecao: `requireAuth` e `can_view_reports`

Exemplo real de resposta com sucesso:

```json
{
	"period": {
		"start_date": "2026-04-01",
		"end_date": "2026-04-30",
		"period_days": 30,
		"sector": null
	},
	"report": [
		{
			"id": 1,
			"name": "Maria Silva",
			"days_present": 3,
			"total_entries": 3,
			"attendance_dates": ["2026-04-02", "2026-04-08", "2026-04-15"],
			"attendance_records": [
				{ "date": "2026-04-02", "sector": "Fisioterapia" }
			],
			"period_days": 30
		}
	]
}
```

### GET /api/attendance/today

Objetivo: retornar status de frequencia do dia.

Protecao: `requireAuth`

Exemplo real de resposta com sucesso:

```json
{
	"date": "2026-04-02",
	"count": 2,
	"present": 2,
	"attendance": [
		{
			"id": 33,
			"patient_id": 1,
			"name": "Maria Silva",
			"check_in_time": "2026-04-02T14:22:10.000Z",
			"attendance_date": "2026-04-02T00:00:00.000Z",
			"notes": "Fisioterapia",
			"status": "Presente"
		}
	]
}
```

## 7. Arquivamento

Baseado em [../Backend/src/routes/archive.js](../Backend/src/routes/archive.js).

### GET /api/archive/users

Objetivo: listar usuarios ocultos ou inativos.

Protecao: `requireAuth` e `requireSupervisor`

Resposta observada: objeto com `archived_users`.

Exemplo real de resposta com sucesso:

```json
{
	"archived_users": [
		{
			"id": 5,
			"email": "professor_antigo@univale.br",
			"role": "PROFESSOR",
			"sector": "Nutricao",
			"is_active": 0,
			"is_hidden": 1,
			"created_at": "01/04/2026 09:30"
		}
	]
}
```

### GET /api/archive/patients

Objetivo: listar pacientes com status `archived`.

Protecao: `requireAuth` e `requireSupervisor`

Resposta observada: objeto com `archived_patients`.

Exemplo real de resposta com sucesso:

```json
{
	"archived_patients": [
		{
			"id": 9,
			"name": "Jose Pereira",
			"cpf": "987.654.321-00",
			"phone": "(33) 3333-2222",
			"phone2": "(33) 99999-1111",
			"status": "archived",
			"created_at": "01/04/2026 10:00"
		}
	]
}
```

## 8. Prontuarios

Baseado em [../Backend/src/routes/medical-records.js](../Backend/src/routes/medical-records.js).

### GET /api/medical-records/:patient_id

Objetivo: listar prontuarios de um paciente.

Protecao: `requireAuth` e `can_view_medical_records`

Resposta observada:

- `patient`: dados basicos do paciente
- `records`: prontuarios ordenados por data decrescente

Exemplo real de resposta com sucesso:

```json
{
	"patient": {
		"id": 1,
		"name": "Maria Silva"
	},
	"records": [
		{
			"id": 14,
			"patient_id": 1,
			"specialty": "Fisioterapia",
			"notes": "Avaliacao inicial",
			"file_path": "Backend/uploads/medical-records/1712061042000-123456789.pdf",
			"file_name": "avaliacao.pdf",
			"file_size": 250000,
			"created_at": "2026-04-02T14:30:00.000Z",
			"uploaded_by": 1
		}
	]
}
```

### POST /api/medical-records/:patient_id/upload

Objetivo: anexar prontuario a um paciente.

Protecao: `requireAuth` e `can_view_medical_records`

Formato da requisicao: `multipart/form-data`

Campos observados:

- `file`: arquivo anexado
- `specialty`: curso ou especialidade obrigatoria
- `notes`: observacoes opcionais

Restricoes observadas:

- limite de 10 MB;
- tipos aceitos: PDF, JPG, PNG, DOC e DOCX;
- o curso informado precisa existir e estar ativo.

Exemplo real de resposta com sucesso:

```json
{
	"message": "Prontuário anexado com sucesso",
	"id": 14,
	"file": {
		"id": 14,
		"name": "avaliacao.pdf",
		"size": 250000,
		"specialty": "Fisioterapia",
		"uploadedAt": "2026-04-02T14:30:00.000Z"
	}
}
```

### DELETE /api/medical-records/:record_id

Objetivo: remover prontuario e seu arquivo fisico.

Protecao: `requireAuth` e `can_view_medical_records`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Prontuário removido com sucesso"
}
```

### GET /api/medical-records/:record_id/download

Objetivo: baixar o arquivo de um prontuario.

Protecao: `requireAuth` e `can_view_medical_records`

## 9. Questionarios

Baseado em [../Backend/src/routes/questionnaires.js](../Backend/src/routes/questionnaires.js) e [../Backend/src/controllers/questionnaireController.js](../Backend/src/controllers/questionnaireController.js).

### Perguntas

#### GET /api/questionnaires/questions/course/:course

Objetivo: listar perguntas de um curso.

Protecao: `requireAuth` e `can_view_medical_records`

Exemplo real de resposta com sucesso:

```json
[
	{
		"id": 10,
		"title": "Como o paciente avalia sua alimentacao?",
		"description": "Pergunta inicial",
		"question_type": "texto_livre",
		"options": null,
		"created_by": 1
	}
]
```

#### POST /api/questionnaires/questions

Objetivo: criar pergunta.

Protecao: `requireAuth` e `can_manage_activities`

Corpo observado:

```json
{
	"title": "Como o paciente avalia sua alimentacao?",
	"description": "Pergunta inicial",
	"question_type": "texto_livre",
	"options": [],
	"course": "Nutricao"
}
```

Exemplo real de resposta com sucesso:

```json
{
	"id": 10,
	"title": "Como o paciente avalia sua alimentacao?",
	"description": "Pergunta inicial",
	"question_type": "texto_livre",
	"options": null,
	"course": "Nutricao"
}
```

#### PUT /api/questionnaires/questions/:id

Objetivo: editar pergunta existente.

Protecao: `requireAuth` e `can_manage_activities`

Corpo observado:

```json
{
	"title": "Pergunta atualizada",
	"description": "Nova descricao",
	"options": []
}
```

Exemplo real de resposta com sucesso:

```json
{
	"message": "Pergunta atualizada com sucesso"
}
```

#### DELETE /api/questionnaires/questions/:id

Objetivo: remover pergunta.

Protecao: `requireAuth` e `can_manage_activities`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Pergunta deletada com sucesso"
}
```

### Questionarios

#### GET /api/questionnaires/questionnaires/course/:course

Objetivo: listar questionarios de um curso.

Protecao: `requireAuth` e `can_view_medical_records`

Exemplo real de resposta com sucesso:

```json
[
	{
		"id": 3,
		"title": "Anamnese Nutricional",
		"description": "Formulario de avaliacao",
		"course": "Nutricao",
		"created_by": 1,
		"is_published": 1,
		"question_count": 5
	}
]
```

#### POST /api/questionnaires/questionnaires

Objetivo: criar questionario.

Protecao: `requireAuth` e `can_manage_activities`

Corpo observado:

```json
{
	"title": "Anamnese Nutricional",
	"description": "Formulario de avaliacao",
	"course": "Nutricao",
	"questions": [1, 2, 3]
}
```

Exemplo real de resposta com sucesso:

```json
{
	"id": 3,
	"title": "Anamnese Nutricional",
	"description": "Formulario de avaliacao",
	"course": "Nutricao",
	"question_count": 3
}
```

#### PUT /api/questionnaires/questionnaires/:id

Objetivo: atualizar questionario.

Protecao: `requireAuth` e `can_manage_activities`

Corpo observado:

```json
{
	"title": "Anamnese Nutricional Atualizada",
	"description": "Descricao revisada",
	"questions": [1, 2, 3]
}
```

Exemplo real de resposta com sucesso:

```json
{
	"message": "Prontuário atualizado com sucesso"
}
```

#### PATCH /api/questionnaires/questionnaires/:id/publish

Objetivo: publicar questionario.

Protecao: `requireAuth` e `can_manage_activities`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Prontuário publicado com sucesso"
}
```

#### DELETE /api/questionnaires/questionnaires/:id

Objetivo: remover questionario.

Protecao: `requireAuth` e `can_manage_activities`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Prontuário deletado com sucesso"
}
```

#### GET /api/questionnaires/questionnaires/:id/questions

Objetivo: listar as perguntas de um questionario especifico.

Protecao: `requireAuth` e `can_view_medical_records`

Exemplo real de resposta com sucesso:

```json
[
	{
		"id": 10,
		"title": "Como o paciente avalia sua alimentacao?",
		"description": "Pergunta inicial",
		"question_type": "texto_livre",
		"options": null,
		"question_order": 1
	}
]
```

### Respostas

#### POST /api/questionnaires/responses

Objetivo: salvar respostas de um paciente para um questionario.

Protecao: `requireAuth` e `can_view_medical_records`

Corpo observado:

```json
{
	"patientId": 1,
	"questionnaireId": 3,
	"responses": {
		"10": "Resposta 1",
		"11": "Resposta 2"
	}
}
```

Exemplo real de resposta com sucesso:

```json
{
	"id": 21,
	"message": "Prontuário respondido com sucesso"
}
```

#### GET /api/questionnaires/responses/:patientId/:questionnaireId

Objetivo: recuperar historico de respostas de um paciente em um questionario.

Protecao: `requireAuth` e `can_view_medical_records`

Exemplo real de resposta com sucesso:

```json
[
	{
		"id": 21,
		"response_data": {
			"10": {
				"title": "Como o paciente avalia sua alimentacao?",
				"question_type": "texto_livre",
				"options_snapshot": null,
				"answer": "Alimentacao equilibrada"
			}
		},
		"created_at": "2026-04-02T15:10:00.000Z",
		"title": "Anamnese Nutricional"
	}
]
```

## 10. Cursos

Baseado em [../Backend/src/routes/courses.js](../Backend/src/routes/courses.js) e [../Backend/src/controllers/coursesController.js](../Backend/src/controllers/coursesController.js).

### GET /api/courses

Objetivo: listar cursos disponiveis.

Protecao: `requireAuth`

Resposta observada: lista com `id`, `name`, `is_active` e `created_at`.

Exemplo real de resposta com sucesso:

```json
[
	{
		"id": 1,
		"name": "Fisioterapia",
		"is_active": 1,
		"created_at": "2026-02-04T18:00:00.000Z"
	}
]
```

### POST /api/courses

Objetivo: criar curso.

Protecao: `requireAuth` e `requireSupervisor`

Corpo esperado:

```json
{
	"name": "Fonoaudiologia"
}
```

Exemplo real de resposta com sucesso:

```json
{
	"id": 8,
	"name": "Fonoaudiologia",
	"is_active": true
}
```

### PUT /api/courses/:id

Objetivo: atualizar curso.

Protecao: `requireAuth` e `requireSupervisor`

Corpo esperado:

```json
{
	"name": "Fonoaudiologia",
	"is_active": true
}
```

Exemplo real de resposta com sucesso:

```json
{
	"message": "Curso atualizado com sucesso"
}
```

### DELETE /api/courses/:id

Objetivo: remover curso, desde que nao existam usuarios vinculados.

Protecao: `requireAuth` e `requireSupervisor`

Exemplo real de resposta com sucesso:

```json
{
	"message": "Curso removido com sucesso"
}
```

## Padrao de erros observado

Embora a API nao utilize uma especificacao formal unica em todas as rotas, o padrao mais comum de resposta de erro e:

```json
{
	"message": "Descricao do erro"
}
```

Status recorrentes observados no codigo:

- `200`: sucesso
- `201`: criado com sucesso
- `400`: erro de validacao ou regra de negocio
- `404`: recurso nao encontrado
- `500`: erro interno do servidor

## Fontes desta documentacao

Esta documentacao foi consolidada a partir dos arquivos:

- [../Backend/src/server.js](../Backend/src/server.js)
- [../Backend/src/routes/auth.js](../Backend/src/routes/auth.js)
- [../Backend/src/routes/users.js](../Backend/src/routes/users.js)
- [../Backend/src/routes/patients.js](../Backend/src/routes/patients.js)
- [../Backend/src/routes/dashboard.js](../Backend/src/routes/dashboard.js)
- [../Backend/src/routes/activities.js](../Backend/src/routes/activities.js)
- [../Backend/src/routes/attendance.js](../Backend/src/routes/attendance.js)
- [../Backend/src/routes/archive.js](../Backend/src/routes/archive.js)
- [../Backend/src/routes/medical-records.js](../Backend/src/routes/medical-records.js)
- [../Backend/src/routes/questionnaires.js](../Backend/src/routes/questionnaires.js)
- [../Backend/src/routes/courses.js](../Backend/src/routes/courses.js)

## Proximo refinamento recomendado

Para deixar esta documentacao pronta para banca ou manutencao externa, vale complementar com:

- exemplos reais de resposta para cada endpoint principal;
- politica exata de autenticacao, token e headers;
- colecao Postman ou Insomnia exportada;
- tabela de permissao cruzando papeis e rotas.