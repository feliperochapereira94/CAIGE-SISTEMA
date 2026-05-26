# RELATÓRIO TÉCNICO — PLANEJAMENTO DO SISTEMA CAIGE

---

## CAPA

**Projeto:** Sistema CAIGE — Centro de Atenção Integral ao Idoso
**Instituição:** Univale — Universidade Vale do Rio Doce
**Disciplina:** [nome da disciplina]
**Professor(a):** [nome do professor(a)]
**Data:** Abril de 2026

**Integrantes do grupo:**

| Nome completo | Matrícula |
|---|---|
| [Nome 1] | [Matrícula] |
| [Nome 2] | [Matrícula] |
| [Nome 3] | [Matrícula] |

---

## 1. REQUISITOS FUNCIONAIS

Os requisitos funcionais descrevem as funcionalidades que o sistema deve oferecer aos seus usuários.

| Código | Requisito Funcional |
|--------|---------------------|
| RF01 | O sistema deve permitir o login de usuários com e-mail e senha. |
| RF02 | O sistema deve controlar o acesso por perfil de usuário (Supervisor e Professor). |
| RF03 | O sistema deve permitir o cadastro, a edição, a consulta e o arquivamento de pacientes. |
| RF04 | O sistema deve permitir o upload e a consulta de foto do paciente. |
| RF05 | O sistema deve registrar a frequência (presença) dos pacientes nos atendimentos. |
| RF06 | O sistema deve impedir o registro duplicado de presença para o mesmo paciente no mesmo dia. |
| RF07 | O sistema deve gerar relatórios de frequência dos pacientes. |
| RF08 | O sistema deve permitir o cadastro, o upload e a consulta de prontuários digitais dos pacientes, organizados por especialidade. |
| RF09 | O sistema deve permitir a criação de perguntas para questionários, com suporte a diferentes tipos de resposta (texto livre, múltipla escolha, sim/não, escala). |
| RF10 | O sistema deve permitir a criação e a publicação de questionários, compostos por perguntas vinculadas a um curso. |
| RF11 | O sistema deve permitir o registro de respostas de um paciente a um questionário. |
| RF12 | O sistema deve exibir um dashboard com indicadores gerais do sistema. |
| RF13 | O sistema deve registrar um log de atividades de todas as ações realizadas pelos usuários. |
| RF14 | O sistema deve permitir que o Supervisor cadastre, edite e inative outros usuários. |
| RF15 | O sistema deve gerenciar os cursos e especialidades disponíveis para vinculação de professores e questionários. |
| RF16 | O sistema deve permitir a consulta de pacientes e usuários arquivados. |

---

## 2. REQUISITOS NÃO FUNCIONAIS

Os requisitos não funcionais descrevem como o sistema deve se comportar em termos de qualidade, segurança e desempenho.

| Código | Requisito Não Funcional |
|--------|--------------------------|
| RNF01 | O sistema deve funcionar em navegador web sem necessidade de instalação pelo usuário. |
| RNF02 | O acesso ao sistema deve ser protegido por login com e-mail e senha. |
| RNF03 | As senhas dos usuários devem ser armazenadas de forma criptografada no banco de dados. |
| RNF04 | O sistema deve restringir o acesso a funcionalidades administrativas com base no perfil do usuário. |
| RNF05 | O e-mail de acesso deve ser do domínio institucional (`@univale.br`). |
| RNF06 | A interface deve ser simples e objetiva, adequada ao uso em ambiente acadêmico e assistencial. |
| RNF07 | O sistema deve ser executado localmente, com backend na porta 3000 e frontend na porta 5500. |
| RNF08 | O banco de dados deve utilizar o charset `utf8mb4` para suporte a caracteres especiais do português. |
| RNF09 | O sistema deve registrar logs de acesso e operações para fins de rastreabilidade. |
| RNF10 | O tempo de resposta das operações comuns (login, listagem, cadastro) deve ser adequado ao uso cotidiano. |

---

## 3. MODELO ENTIDADE-RELACIONAMENTO (MER)

> **Observação:** o Diagrama Entidade-Relacionamento (DER) visual do sistema já foi elaborado pelo grupo e está disponível no arquivo `DER_CAIGE.html`. Esta seção apresenta a descrição textual das entidades, seus atributos principais e os relacionamentos existentes entre elas.

### 3.1 Entidades Principais e Atributos

**users** — Usuários do sistema
Atributos: `id`, `email`, `password_hash`, `name`, `role` (SUPERVISOR ou PROFESSOR), `sector`, `created_by`, `is_active`, `last_login`, `created_at`.

**patients** — Pacientes atendidos pelo CAIGE
Atributos: `id`, `name`, `birth_date`, `gender`, `cpf`, `phone`, `phone2`, `cep`, `street`, `number`, `neighborhood`, `city`, `state`, `responsible`, `responsible_relationship`, `responsible_phone`, `photo`, `observations`, `status`, `created_at`.

**attendance** — Frequência dos pacientes
Atributos: `id`, `patient_id`, `professional_id`, `check_in_time`, `attendance_date`, `notes`, `created_at`.

**medical_records** — Prontuários digitais
Atributos: `id`, `patient_id`, `specialty`, `notes`, `file_path`, `file_name`, `file_size`, `uploaded_by`, `created_at`, `updated_at`.

**questions** — Perguntas para questionários
Atributos: `id`, `title`, `description`, `question_type`, `options` (JSON), `created_by`, `course`, `is_active`, `created_at`.

**questionnaires** — Questionários criados pelos professores
Atributos: `id`, `title`, `description`, `course`, `created_by`, `is_published`, `created_at`.

**questionnaire_questions** — Vínculo entre questionário e perguntas
Atributos: `id`, `questionnaire_id`, `question_id`, `question_order`, `is_active`.

**questionnaire_responses** — Respostas dos pacientes
Atributos: `id`, `patient_id`, `questionnaire_id`, `response_data` (JSON), `created_at`, `updated_at`.

**courses** — Cursos/especialidades disponíveis
Atributos: `id`, `name`, `is_active`, `created_at`.

**professionals** — Profissionais de saúde vinculados à frequência
Atributos: `id`, `name`, `created_at`.

**permissions** — Permissões de acesso por perfil
Atributos: `id`, `role`, `can_check_in`, `can_create_patient`, `can_edit_patient`, `can_view_patient`, `can_view_reports`, `can_create_user`, `can_edit_user`, `can_view_medical_records`, `can_manage_activities`, `can_access_dashboard`.

**activities** — Log de auditoria do sistema
Atributos: `id`, `type`, `description`, `responsible`, `created_at`.

**quick_stats** — Estatísticas rápidas para o dashboard
Atributos: `label`, `value`.

### 3.2 Relacionamentos

- Um **usuário** pode criar vários outros **usuários** (auto-referência via `created_by`).
- Um **paciente** pode ter vários registros de **frequência**.
- Um **paciente** pode ter vários **prontuários**, cada um ligado a uma especialidade.
- Um **paciente** pode ter várias **respostas** a questionários.
- Um **questionário** é composto por várias **perguntas** (relação N:M via `questionnaire_questions`).
- Um **questionário** está vinculado a um **curso**.
- Uma **pergunta** é criada por um **usuário**.
- Um **questionário** é criado por um **usuário**.
- Um **prontuário** é enviado (upload) por um **usuário**.
- Um registro de **frequência** pode estar associado a um **profissional**.

---

## 4. DICIONÁRIO DE DADOS

### Tabela: `users` — Usuários do sistema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK, Auto Increment) | Identificador único do usuário |
| `email` | VARCHAR(255) UNIQUE | E-mail de login (somente `@univale.br`) |
| `password_hash` | VARCHAR(255) | Senha criptografada com bcrypt |
| `name` | VARCHAR(255) | Nome completo do usuário |
| `role` | ENUM | Perfil: `SUPERVISOR` ou `PROFESSOR` |
| `sector` | VARCHAR(255) | Especialidade ou setor do professor |
| `created_by` | INT (FK → users) | ID do usuário que fez o cadastro |
| `is_active` | BOOLEAN | Indica se o usuário está ativo |
| `is_hidden` | BOOLEAN | Oculta o usuário da listagem geral |
| `last_login` | TIMESTAMP | Data e hora do último acesso |
| `created_at` | TIMESTAMP | Data de criação do registro |

---

### Tabela: `patients` — Pacientes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único do paciente |
| `name` | VARCHAR(255) | Nome completo |
| `birth_date` | DATE | Data de nascimento |
| `gender` | VARCHAR(50) | Gênero do paciente |
| `cpf` | VARCHAR(20) | CPF |
| `phone` | VARCHAR(20) | Telefone principal |
| `phone2` | VARCHAR(20) | Telefone secundário |
| `cep` | VARCHAR(20) | CEP do endereço |
| `street` | VARCHAR(255) | Logradouro |
| `number` | VARCHAR(50) | Número do endereço |
| `neighborhood` | VARCHAR(255) | Bairro |
| `city` | VARCHAR(255) | Cidade |
| `state` | VARCHAR(50) | Estado (UF) |
| `responsible` | VARCHAR(255) | Nome do responsável do paciente |
| `responsible_relationship` | VARCHAR(50) | Grau de parentesco do responsável |
| `responsible_phone` | VARCHAR(20) | Telefone do responsável |
| `photo` | LONGTEXT | Foto do paciente em formato Base64 |
| `observations` | LONGTEXT | Observações clínicas gerais |
| `status` | VARCHAR(50) | Situação do paciente (`Ativo`, `Inativo`) |
| `created_at` | TIMESTAMP | Data de cadastro |

---

### Tabela: `attendance` — Frequência

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `patient_id` | INT (FK → patients) | Paciente presente |
| `professional_id` | INT (FK → professionals) | Profissional responsável pelo atendimento |
| `check_in_time` | DATETIME | Hora exata do registro de presença |
| `attendance_date` | DATE | Data do atendimento |
| `notes` | VARCHAR(255) | Observações do atendimento |
| `created_at` | TIMESTAMP | Data de criação do registro |

> Restrição: `UNIQUE (patient_id, attendance_date)` — um paciente não pode ter mais de um registro de presença por dia.

---

### Tabela: `medical_records` — Prontuários

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `patient_id` | INT (FK → patients) | Paciente ao qual o prontuário pertence |
| `specialty` | ENUM | Especialidade responsável pelo registro |
| `notes` | LONGTEXT | Anotações clínicas do prontuário |
| `file_path` | VARCHAR(255) | Caminho do arquivo no servidor |
| `file_name` | VARCHAR(255) | Nome original do arquivo enviado |
| `file_size` | INT | Tamanho do arquivo em bytes |
| `uploaded_by` | INT (FK → users) | Usuário que fez o upload |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data da última atualização |

---

### Tabela: `questions` — Perguntas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `title` | VARCHAR(255) | Enunciado da pergunta |
| `description` | TEXT | Instrução ou contexto adicional |
| `question_type` | ENUM | Tipo: `texto_livre`, `multipla_escolha`, `sim_nao`, `escala` |
| `options` | JSON | Opções de resposta (para múltipla escolha) |
| `created_by` | INT (FK → users) | Usuário autor da pergunta |
| `course` | VARCHAR(100) | Curso ao qual a pergunta pertence |
| `is_active` | BOOLEAN | Indica se a pergunta está ativa |
| `created_at` | TIMESTAMP | Data de criação |

---

### Tabela: `questionnaires` — Questionários

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `title` | VARCHAR(255) | Título do questionário |
| `description` | TEXT | Descrição geral do questionário |
| `course` | VARCHAR(100) | Curso vinculado ao questionário |
| `created_by` | INT (FK → users) | Usuário que criou o questionário |
| `is_published` | BOOLEAN | Indica se está publicado e disponível |
| `created_at` | TIMESTAMP | Data de criação |

---

### Tabela: `questionnaire_responses` — Respostas dos Pacientes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `patient_id` | INT (FK → patients) | Paciente que respondeu |
| `questionnaire_id` | INT (FK → questionnaires) | Questionário respondido |
| `response_data` | JSON | Objeto com as respostas `{ question_id: resposta }` |
| `created_at` | TIMESTAMP | Data do registro |
| `updated_at` | TIMESTAMP | Data da última atualização |

---

### Tabela: `courses` — Cursos/Especialidades

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `name` | VARCHAR(100) UNIQUE | Nome do curso ou especialidade |
| `is_active` | BOOLEAN | Indica se está disponível no sistema |
| `created_at` | DATETIME | Data de criação |

---

### Tabela: `activities` — Log de Atividades

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT (PK) | Identificador único |
| `type` | VARCHAR(100) | Categoria da ação (ex.: `Cadastro`, `Login`) |
| `description` | VARCHAR(255) | Descrição detalhada da ação realizada |
| `responsible` | VARCHAR(255) | E-mail do usuário que realizou a ação |
| `created_at` | TIMESTAMP | Data e hora da ação |

---

## 5. SCRIPT SQL

Script de criação do banco de dados com as principais tabelas do sistema CAIGE.

```sql
-- =====================================================================
-- CAIGE SISTEMA — SETUP COMPLETO DO BANCO DE DADOS
-- Banco: caige | SGBD: MySQL 8+ | Engine: InnoDB
-- =====================================================================

CREATE DATABASE IF NOT EXISTS caige
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE caige;

-- TABELA 1: users
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NULL,
  role          ENUM('SUPERVISOR','PROFESSOR') NOT NULL DEFAULT 'PROFESSOR',
  sector        VARCHAR(255) NULL,
  created_by    INT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  is_hidden     BOOLEAN NOT NULL DEFAULT FALSE,
  last_login    TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 2: permissions
CREATE TABLE IF NOT EXISTS permissions (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  role                     VARCHAR(50) NOT NULL UNIQUE,
  can_check_in             BOOLEAN DEFAULT FALSE,
  can_create_patient       BOOLEAN DEFAULT FALSE,
  can_edit_patient         BOOLEAN DEFAULT FALSE,
  can_view_patient         BOOLEAN DEFAULT FALSE,
  can_view_reports         BOOLEAN DEFAULT FALSE,
  can_create_user          BOOLEAN DEFAULT FALSE,
  can_edit_user            BOOLEAN DEFAULT FALSE,
  can_view_medical_records BOOLEAN DEFAULT FALSE,
  can_manage_activities    BOOLEAN DEFAULT FALSE,
  can_access_dashboard     BOOLEAN DEFAULT FALSE,
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 3: courses
CREATE TABLE IF NOT EXISTS courses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 4: patients
CREATE TABLE IF NOT EXISTS patients (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  name                     VARCHAR(255) NOT NULL,
  birth_date               DATE NULL,
  gender                   VARCHAR(50) NULL,
  cpf                      VARCHAR(20) NULL,
  phone                    VARCHAR(20) NULL,
  phone2                   VARCHAR(20) NULL,
  cep                      VARCHAR(20) NULL,
  street                   VARCHAR(255) NULL,
  number                   VARCHAR(50) NULL,
  neighborhood             VARCHAR(255) NULL,
  city                     VARCHAR(255) NULL,
  state                    VARCHAR(50) NULL,
  responsible              VARCHAR(255) NULL,
  responsible_relationship VARCHAR(50) NULL,
  responsible_phone        VARCHAR(20) NULL,
  photo                    LONGTEXT NULL,
  observations             LONGTEXT NULL,
  status                   VARCHAR(50) NULL,
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 5: professionals
CREATE TABLE IF NOT EXISTS professionals (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 6: attendance
CREATE TABLE IF NOT EXISTS attendance (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  patient_id       INT NOT NULL,
  professional_id  INT NULL,
  check_in_time    DATETIME NOT NULL,
  attendance_date  DATE NOT NULL,
  notes            VARCHAR(255) NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_professional
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE SET NULL,
  UNIQUE KEY uniq_attendance_patient_date (patient_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 7: medical_records
CREATE TABLE IF NOT EXISTS medical_records (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  patient_id  INT NOT NULL,
  specialty   ENUM(
    'Fisioterapia','Educação Física','Agronomia','Farmácia',
    'Enfermagem','Medicina','Estética e Cosmética',
    'Fonoaudiologia','Nutrição'
  ) NOT NULL,
  notes       LONGTEXT NULL,
  file_path   VARCHAR(255) NOT NULL,
  file_name   VARCHAR(255) NOT NULL,
  file_size   INT NULL,
  uploaded_by INT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_medical_records_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_medical_records_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 8: questions
CREATE TABLE IF NOT EXISTS questions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  description   TEXT NULL,
  question_type ENUM('texto_livre','multipla_escolha','sim_nao','escala')
                NOT NULL DEFAULT 'texto_livre',
  options       JSON NULL,
  created_by    INT NOT NULL,
  course        VARCHAR(100) NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_questions_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 9: questionnaires
CREATE TABLE IF NOT EXISTS questionnaires (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT NULL,
  course       VARCHAR(100) NOT NULL,
  created_by   INT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_questionnaires_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 10: questionnaire_questions
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  questionnaire_id INT NOT NULL,
  question_id      INT NOT NULL,
  question_order   INT NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_questionnaire_question (questionnaire_id, question_id),
  CONSTRAINT fk_qq_questionnaire
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
  CONSTRAINT fk_qq_question
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 11: questionnaire_responses
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  patient_id       INT NOT NULL,
  questionnaire_id INT NOT NULL,
  response_data    JSON NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_responses_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  CONSTRAINT fk_responses_questionnaire
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TABELA 12: activities
CREATE TABLE IF NOT EXISTS activities (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados iniciais: permissões dos perfis
INSERT IGNORE INTO permissions
  (role, can_check_in, can_create_patient, can_edit_patient,
   can_view_patient, can_view_reports, can_create_user, can_edit_user,
   can_view_medical_records, can_manage_activities, can_access_dashboard)
VALUES
  ('SUPERVISOR', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,  TRUE,  TRUE, TRUE, TRUE),
  ('PROFESSOR',  TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE);

-- Dados iniciais: especialidades disponíveis
INSERT IGNORE INTO courses (name) VALUES
  ('Agronomia'), ('Educação Física'), ('Enfermagem'),
  ('Estética e Cosmética'), ('Farmácia'), ('Fisioterapia'),
  ('Fonoaudiologia'), ('Medicina'), ('Nutrição');
```

---

## 6. ARQUITETURA DO SISTEMA

### 6.1 Padrão Arquitetural

O sistema CAIGE segue uma **arquitetura web cliente-servidor em três camadas**:

| Camada | Responsabilidade |
|--------|-----------------|
| **Frontend (Apresentação)** | Interface do usuário, navegação, validações básicas e consumo da API via HTTP |
| **Backend (Negócio)** | Recebimento de requisições, validação, aplicação de regras e acesso ao banco |
| **Banco de Dados (Persistência)** | Armazenamento de todos os dados do sistema |

O backend segue parcialmente o padrão **MVC (Model-View-Controller)**: os módulos estão organizados em `routes` (rotas), `controllers` (lógica) e `models` (acesso ao banco). A visão (View) é responsabilidade exclusiva do frontend.

### 6.2 Comunicação entre as Partes

```
[Usuário]
    │
    ▼
[Frontend — HTML/CSS/JS Vanilla]
    │  requisições HTTP (fetch API)
    ▼
[Backend — Node.js + Express]
    │  consultas SQL
    ▼
[Banco de Dados — MySQL]
```

O frontend envia requisições HTTP ao backend. O backend processa as operações e retorna respostas em formato JSON. O frontend atualiza a interface com base nas respostas recebidas.

### 6.3 Organização dos Módulos

**Backend (`Backend/src/`)**

| Pasta/Arquivo | Função |
|---|---|
| `server.js` | Inicialização do servidor e registro das rotas |
| `routes/` | Definição dos endpoints da API |
| `controllers/` | Lógica por módulo (pacientes, usuários, frequência, etc.) |
| `middleware/` | Autenticação, CORS e log de requisições |
| `models/` | Conexão ao banco de dados |

**Frontend (`Frontend/`)**

| Pasta | Função |
|---|---|
| `pages/auth/` | Telas de login |
| `pages/dashboard/` | Tela inicial com indicadores |
| `pages/patients/` | Cadastro e consulta de pacientes |
| `pages/attendance/` | Registro e relatório de frequência |
| `pages/activities/` | Log de atividades do sistema |
| `pages/admin/` | Administração de usuários e cursos |
| `assets/css/` | Estilos visuais |
| `assets/js/` | Scripts auxiliares e utilitários |

---

## 7. TECNOLOGIAS DEFINIDAS

### 7.1 Frontend

| Tecnologia | Justificativa |
|---|---|
| **HTML5** | Linguagem padrão para estruturação de páginas web, sem necessidade de framework |
| **CSS3** | Estilização visual das telas |
| **JavaScript (Vanilla)** | Lógica de interface e comunicação com a API, sem dependência de frameworks externos |
| **Live Server** | Ferramenta de desenvolvimento para servir o frontend localmente |

### 7.2 Backend

| Tecnologia | Justificativa |
|---|---|
| **Node.js** | Ambiente de execução JavaScript no servidor, amplamente utilizado e de fácil configuração |
| **Express** | Framework minimalista para criação de APIs REST em Node.js |
| **bcryptjs** | Biblioteca para criptografia de senhas dos usuários |
| **multer** | Biblioteca para gerenciamento de upload de arquivos (prontuários e fotos) |

### 7.3 Banco de Dados

| Tecnologia | Justificativa |
|---|---|
| **MySQL 8+** | Sistema de gerenciamento de banco de dados relacional robusto, amplamente utilizado em projetos acadêmicos e comerciais |
| **InnoDB** | Engine do MySQL com suporte a chaves estrangeiras e transações, garantindo integridade dos dados |

### 7.4 Ferramentas de Apoio

| Ferramenta | Uso |
|---|---|
| **MySQL Workbench** | Administração visual do banco e execução de scripts SQL |
| **VS Code** | Editor de código principal do projeto |
| **Git / GitHub** | Controle de versão e colaboração entre os integrantes do grupo |

---

## 8. BACKLOG INICIAL

O backlog representa as tarefas e funcionalidades identificadas para o desenvolvimento do sistema.

| ID | Tarefa | Módulo | Prioridade |
|----|--------|--------|------------|
| B01 | Configurar ambiente de desenvolvimento (Node.js, MySQL, dependências) | Infraestrutura | Alta |
| B02 | Criar e executar script SQL de criação do banco de dados | Banco de Dados | Alta |
| B03 | Implementar autenticação de usuários (login com e-mail e senha) | Autenticação | Alta |
| B04 | Implementar controle de acesso por perfil (Supervisor e Professor) | Autenticação | Alta |
| B05 | Criar tela de login no frontend | Frontend | Alta |
| B06 | Desenvolver cadastro de pacientes (formulário e persistência) | Pacientes | Alta |
| B07 | Desenvolver listagem e busca de pacientes | Pacientes | Alta |
| B08 | Implementar edição e arquivamento de pacientes | Pacientes | Média |
| B09 | Implementar registro de frequência dos pacientes | Frequência | Alta |
| B10 | Criar relatório de frequência | Frequência | Média |
| B11 | Desenvolver upload e consulta de prontuários por especialidade | Prontuários | Média |
| B12 | Implementar criação de perguntas para questionários | Questionários | Média |
| B13 | Implementar criação, montagem e publicação de questionários | Questionários | Média |
| B14 | Implementar aplicação de questionários e registro de respostas | Questionários | Média |
| B15 | Desenvolver dashboard com indicadores do sistema | Dashboard | Média |
| B16 | Implementar cadastro e gestão de usuários (apenas Supervisor) | Administração | Média |
| B17 | Implementar gestão de cursos/especialidades | Administração | Baixa |
| B18 | Implementar log de atividades do sistema | Auditoria | Baixa |
| B19 | Realizar testes de funcionalidades e ajustes finais | Testes | Alta |
| B20 | Organizar documentação final do projeto | Documentação | Alta |

---

*Documento elaborado com base na estrutura real do sistema CAIGE, desenvolvido pelo grupo como parte das atividades acadêmicas da Univale.*
