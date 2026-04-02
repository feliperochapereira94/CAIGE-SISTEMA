# CAIGE SISTEMA — Documentação do Banco de Dados

**Projeto:** Centro de Atenção Integral ao Idoso (CAIGE)  
**Instituição:** Univale — Universidade Vale do Rio Doce  
**SGBD:** MySQL 8+  
**Banco:** `caige`  
**Charset:** `utf8mb4` / `utf8mb4_unicode_ci`  
**Engine:** InnoDB (chaves estrangeiras + transações)

---

## 1. Visão Geral

O banco de dados `caige` é o núcleo do sistema de gestão do CAIGE. Ele armazena todos os dados de pacientes, frequência de atendimentos, prontuários digitais, questionários aplicados pelos professores e controle de acesso dos usuários do sistema.

O sistema possui dois perfis de usuário:

| Papel | Descrição |
|-------|-----------|
| `SUPERVISOR` | Administrador com acesso total, incluindo gestão de usuários |
| `PROFESSOR` | Usuário operacional: cadastra pacientes, registra frequência e aplica questionários |

Script SQL canonico para instalacao nova: `Backend/database/setup_completo.sql`.

---

## 2. Diagrama de Relacionamentos

```
┌─────────┐   created_by   ┌─────────┐
│  users  │◄───────────────│  users  │  (auto-referência)
└────┬────┘                └─────────┘
     │ created_by
     ├──────────────────► questions
     └──────────────────► questionnaires
                               │
                    questionnaire_questions
                               │
                           questions

┌──────────┐    patient_id   ┌────────────┐   professional_id  ┌───────────────┐
│ patients │────────────────►│ attendance │◄───────────────────│ professionals │
└────┬─────┘                 └────────────┘                    └───────────────┘
     │ patient_id
     ├──────────────────────► medical_records ◄─── uploaded_by ─── users
     └──────────────────────► questionnaire_responses ◄── questionnaires

permissions   (1 linha por role — tabela de configuração de acesso)
courses       (tabela de domínio — especialidades disponíveis)
activities    (log de auditoria das ações no sistema)
quick_stats   (pares chave/valor para o dashboard)
```

---

## 3. Tabelas

### 3.1 `users` — Usuários do sistema

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `email` | VARCHAR(255) UNIQUE | Login (apenas `@univale.br`) |
| `password_hash` | VARCHAR(255) | Senha criptografada com bcrypt |
| `name` | VARCHAR(255) | Nome completo |
| `role` | ENUM | `SUPERVISOR` ou `PROFESSOR` |
| `sector` | VARCHAR(255) | Especialidade/curso do professor |
| `created_by` | INT FK → users | Quem criou o usuário |
| `is_active` | BOOLEAN | Ativo no sistema |
| `is_hidden` | BOOLEAN | Oculto na listagem (usuário de suporte) |
| `last_login` | TIMESTAMP | Data/hora do último acesso |
| `created_at` | TIMESTAMP | Data de criação |

---

### 3.2 `permissions` — Controle de acesso por papel

Uma linha por papel (`SUPERVISOR` / `PROFESSOR`). Cada coluna booleana ativa ou desativa uma funcionalidade.

| Coluna | SUPERVISOR | PROFESSOR |
|--------|:----------:|:---------:|
| `can_check_in` | ✔ | ✔ |
| `can_create_patient` | ✔ | ✔ |
| `can_edit_patient` | ✔ | ✔ |
| `can_view_patient` | ✔ | ✔ |
| `can_view_reports` | ✔ | ✔ |
| `can_create_user` | ✔ | ✗ |
| `can_edit_user` | ✔ | ✗ |
| `can_view_medical_records` | ✔ | ✔ |
| `can_manage_activities` | ✔ | ✔ |
| `can_access_dashboard` | ✔ | ✔ |

---

### 3.3 `professionals` — Profissionais de saúde

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `name` | VARCHAR(255) | Nome do profissional |
| `created_at` | TIMESTAMP | Data de cadastro |

---

### 3.4 `courses` — Cursos / Especialidades

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `name` | VARCHAR(100) UNIQUE | Nome do curso |
| `is_active` | BOOLEAN | Disponível para seleção |
| `created_at` | DATETIME | Data de criação |

**Cursos cadastrados inicialmente:**
Agronomia, Educação Física, Enfermagem, Estética e Cosmética, Farmácia, Fisioterapia, Fonoaudiologia, Medicina, Nutrição.

---

### 3.5 `patients` — Pacientes

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `name` | VARCHAR(255) | Nome completo |
| `birth_date` | DATE | Data de nascimento |
| `gender` | VARCHAR(50) | Gênero |
| `cpf` | VARCHAR(20) | CPF |
| `phone` / `phone2` | VARCHAR(20) | Telefones |
| `cep` | VARCHAR(20) | CEP |
| `street`, `number`, `neighborhood`, `city`, `state` | VARCHAR | Endereço |
| `responsible` | VARCHAR(255) | Nome do responsável |
| `responsible_relationship` | VARCHAR(50) | Grau de parentesco |
| `responsible_phone` | VARCHAR(20) | Telefone do responsável |
| `photo` | LONGTEXT | Foto em Base64 |
| `observations` | LONGTEXT | Observações clínicas |
| `status` | VARCHAR(50) | Ex.: `Ativo`, `Inativo` |
| `created_at` | TIMESTAMP | Data de cadastro |

---

### 3.6 `activities` — Log de atividades

Registro de auditoria de todas as ações realizadas no sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `type` | VARCHAR(100) | Categoria da ação (ex.: `Cadastro`) |
| `description` | VARCHAR(255) | Descrição da ação |
| `responsible` | VARCHAR(255) | E-mail do usuário que executou |
| `created_at` | TIMESTAMP | Data/hora da ação |

---

### 3.7 `attendance` — Frequência

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `patient_id` | INT FK → patients | Paciente presente |
| `professional_id` | INT FK → professionals | Profissional responsável |
| `check_in_time` | DATETIME | Hora exata do registro |
| `attendance_date` | DATE | Data da presença |
| `notes` | VARCHAR(255) | Observações |
| `created_at` | TIMESTAMP | Data de criação |

> **Restrição:** `UNIQUE (patient_id, attendance_date)` — um paciente não pode ter duas presenças no mesmo dia.

---

### 3.8 `medical_records` — Prontuários

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `patient_id` | INT FK → patients | Paciente |
| `specialty` | ENUM | Especialidade responsável pelo prontuário |
| `notes` | LONGTEXT | Anotações clínicas |
| `file_path` | VARCHAR(255) | Caminho físico do arquivo |
| `file_name` | VARCHAR(255) | Nome original do arquivo |
| `file_size` | INT | Tamanho em bytes |
| `uploaded_by` | INT FK → users | Quem fez o upload |
| `created_at` / `updated_at` | TIMESTAMP | Controle de datas |

---

### 3.9 `questions` — Perguntas

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `title` | VARCHAR(255) | Enunciado da pergunta |
| `description` | TEXT | Contexto/instrução |
| `question_type` | ENUM | `texto_livre`, `multipla_escolha`, `sim_nao`, `escala` |
| `options` | JSON | Opções (para múltipla escolha) |
| `created_by` | INT FK → users | Autor |
| `course` | VARCHAR(100) | Curso ao qual pertence |
| `is_active` | BOOLEAN | Ativa/disponível |

---

### 3.10 `questionnaires` — Questionários

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT PK | Identificador |
| `title` | VARCHAR(255) | Título do questionário |
| `description` | TEXT | Descrição |
| `course` | VARCHAR(100) | Curso vinculado |
| `created_by` | INT FK → users | Autor |
| `is_published` | BOOLEAN | Publicado (visível para aplicação) |

---

### 3.11 `questionnaire_questions` — Junção Questionário ↔ Pergunta

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `questionnaire_id` | INT FK | Questionário |
| `question_id` | INT FK | Pergunta |
| `question_order` | INT | Ordem de exibição |
| `is_active` | BOOLEAN | Pergunta ativa neste questionário |

> **Restrição:** `UNIQUE (questionnaire_id, question_id)` — uma pergunta não se repete no mesmo questionário.

---

### 3.12 `questionnaire_responses` — Respostas

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `patient_id` | INT FK → patients | Paciente que respondeu |
| `questionnaire_id` | INT FK → questionnaires | Questionário respondido |
| `response_data` | JSON | Objeto `{ question_id: resposta, ... }` |
| `created_at` / `updated_at` | TIMESTAMP | Controle de datas |

---

### 3.13 `quick_stats` — Estatísticas rápidas

Tabela simples de par chave/valor, usada pelo dashboard para exibir métricas em destaque.

| Coluna | Tipo |
|--------|------|
| `label` | VARCHAR(100) |
| `value` | VARCHAR(50) |

---

## 4. Script SQL Completo

O arquivo pronto para execução no MySQL Workbench está em:

```
Backend/database/setup_completo.sql
```

Esse script cria o banco, todas as 13 tabelas, índices, chaves estrangeiras e insere os dados iniciais abaixo:

### Dados inseridos pelo script

```sql
-- Usuário supervisor padrão
-- E-mail : suportecaige@univale.br
-- Senha  : suporte123
INSERT IGNORE INTO users (email, password_hash, name, role, is_active, is_hidden)
VALUES (
  'suportecaige@univale.br',
  '$2a$10$Ji4DeFj5XiJePFMlwsMCRedwAYHg/uV/z8KOL72ZmCNKkslkQ/yXS',
  'Suporte CAIGE', 'SUPERVISOR', TRUE, FALSE
);

-- Permissões padrão dos dois papéis
INSERT IGNORE INTO permissions (role, can_check_in, can_create_patient, ...)
VALUES
  ('SUPERVISOR', TRUE,  TRUE, TRUE, TRUE, TRUE, TRUE,  TRUE,  TRUE, TRUE, TRUE),
  ('PROFESSOR',  TRUE,  TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE);

-- 9 especialidades disponíveis
INSERT IGNORE INTO courses (name) VALUES
  ('Agronomia'), ('Educação Física'), ('Enfermagem'),
  ('Estética e Cosmética'), ('Farmácia'), ('Fisioterapia'),
  ('Fonoaudiologia'), ('Medicina'), ('Nutrição');
```

---

## 5. Como configurar o banco do zero

### Usando MySQL Workbench

1. Abra o MySQL Workbench e conecte à instância local (`localhost`, porta `3306`).
2. Vá em **File → Open SQL Script** e selecione `Backend/database/setup_completo.sql`.
3. Pressione **Ctrl+Shift+Enter** para executar o script completo.
4. Atualize o painel de schemas (**clique no ícone de atualizar**) — o banco `caige` aparecerá com as 13 tabelas.

### Verificação rápida (dentro do Workbench)

```sql
USE caige;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM permissions;
SELECT * FROM courses;
```

---

## 6. Resumo das Chaves Estrangeiras

| Tabela filha | Coluna | Tabela pai | Ação |
|---|---|---|---|
| `users` | `created_by` | `users` | SET NULL |
| `attendance` | `patient_id` | `patients` | CASCADE |
| `attendance` | `professional_id` | `professionals` | SET NULL |
| `medical_records` | `patient_id` | `patients` | CASCADE |
| `medical_records` | `uploaded_by` | `users` | SET NULL |
| `questions` | `created_by` | `users` | RESTRICT |
| `questionnaires` | `created_by` | `users` | RESTRICT |
| `questionnaire_questions` | `questionnaire_id` | `questionnaires` | CASCADE |
| `questionnaire_questions` | `question_id` | `questions` | CASCADE |
| `questionnaire_responses` | `patient_id` | `patients` | CASCADE |
| `questionnaire_responses` | `questionnaire_id` | `questionnaires` | RESTRICT |
