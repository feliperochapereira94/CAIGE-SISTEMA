-- =====================================================================
-- CAIGE SISTEMA — SETUP COMPLETO DO BANCO DE DADOS
-- =====================================================================
-- Banco       : caige
-- SGBD        : MySQL 8+
-- Charset     : utf8mb4 / utf8mb4_unicode_ci
-- Engine      : InnoDB
-- =====================================================================
-- Como usar no MySQL Workbench:
--   1. Abra este arquivo (File > Open SQL Script)
--   2. Selecione tudo (Ctrl+A) e execute (Ctrl+Shift+Enter)
--   3. Aguarde a conclusão (barra de progresso inferior)
-- =====================================================================
-- Usuário padrão criado:
--   E-mail : suportecaige@univale.br
--   Senha  : suporte123
--   Papel  : SUPERVISOR (acesso total)
-- =====================================================================

-- ▶ 1. CRIAR / SELECIONAR BANCO
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS caige
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE caige;

-- =====================================================================
-- TABELA 1: users
-- Armazena os usuários do sistema (Supervisores e Professores).
-- O campo created_by é auto-referência: registra quem criou o usuário.
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255)               NOT NULL UNIQUE,
  password_hash VARCHAR(255)               NOT NULL,
  name          VARCHAR(255)               NULL,
  role          ENUM('SUPERVISOR','PROFESSOR') NOT NULL DEFAULT 'PROFESSOR',
  sector        VARCHAR(255)               NULL,
  created_by    INT                        NULL,
  is_active     BOOLEAN                    NOT NULL DEFAULT TRUE,
  is_hidden     BOOLEAN                    NOT NULL DEFAULT FALSE,
  last_login    TIMESTAMP                  NULL,
  created_at    TIMESTAMP                  DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 2: permissions
-- Uma linha por papel (role). Cada coluna booleana representa
-- uma permissão de acesso a funcionalidade do sistema.
-- =====================================================================
CREATE TABLE IF NOT EXISTS permissions (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  role                     VARCHAR(50)  NOT NULL UNIQUE,
  can_check_in             BOOLEAN      DEFAULT FALSE,
  can_create_patient       BOOLEAN      DEFAULT FALSE,
  can_edit_patient         BOOLEAN      DEFAULT FALSE,
  can_view_patient         BOOLEAN      DEFAULT FALSE,
  can_view_reports         BOOLEAN      DEFAULT FALSE,
  can_create_user          BOOLEAN      DEFAULT FALSE,
  can_edit_user            BOOLEAN      DEFAULT FALSE,
  can_view_medical_records BOOLEAN      DEFAULT FALSE,
  can_manage_activities    BOOLEAN      DEFAULT FALSE,
  can_access_dashboard     BOOLEAN      DEFAULT FALSE,
  created_at               TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 3: professionals
-- Profissionais de saúde associados aos registros de frequência.
-- =====================================================================
CREATE TABLE IF NOT EXISTS professionals (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255)  NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 4: courses
-- Especialidades/cursos disponíveis no sistema.
-- Usados para vincular professores e questionários.
-- =====================================================================
CREATE TABLE IF NOT EXISTS courses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL UNIQUE,
  is_active  BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 5: patients
-- Cadastro completo dos pacientes atendidos pelo CAIGE.
-- =====================================================================
CREATE TABLE IF NOT EXISTS patients (
  id                       INT AUTO_INCREMENT PRIMARY KEY,
  name                     VARCHAR(255)  NOT NULL,
  birth_date               DATE          NULL,
  gender                   VARCHAR(50)   NULL,
  cpf                      VARCHAR(20)   NULL,
  phone                    VARCHAR(20)   NULL,
  phone2                   VARCHAR(20)   NULL,
  cep                      VARCHAR(20)   NULL,
  street                   VARCHAR(255)  NULL,
  number                   VARCHAR(50)   NULL,
  neighborhood             VARCHAR(255)  NULL,
  city                     VARCHAR(255)  NULL,
  state                    VARCHAR(50)   NULL,
  responsible              VARCHAR(255)  NULL,
  responsible_relationship VARCHAR(50)   NULL,
  responsible_phone        VARCHAR(20)   NULL,
  photo                    LONGTEXT      NULL,
  observations             LONGTEXT      NULL,
  status                   VARCHAR(50)   NULL,
  created_at               TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 6: activities
-- Log de atividades do sistema (auditoria de ações).
-- =====================================================================
CREATE TABLE IF NOT EXISTS activities (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        VARCHAR(100)  NOT NULL,
  description VARCHAR(255)  NOT NULL,
  responsible VARCHAR(255)  NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 7: attendance
-- Registro de frequência dos pacientes.
-- Restrição: um paciente só pode ter uma presença por dia (UNIQUE).
-- =====================================================================
CREATE TABLE IF NOT EXISTS attendance (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  patient_id       INT           NOT NULL,
  professional_id  INT           NULL,
  check_in_time    DATETIME      NOT NULL,
  attendance_date  DATE          NOT NULL,
  notes            VARCHAR(255)  NULL,
  created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_attendance_professional
    FOREIGN KEY (professional_id) REFERENCES professionals(id)
    ON DELETE SET NULL,
  UNIQUE KEY uniq_attendance_patient_date (patient_id, attendance_date),
  INDEX idx_attendance_date (attendance_date),
  INDEX idx_check_in_time (check_in_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 8: medical_records
-- Prontuários digitais dos pacientes, por especialidade.
-- Armazena o caminho do arquivo enviado (upload).
-- =====================================================================
CREATE TABLE IF NOT EXISTS medical_records (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  patient_id  INT  NOT NULL,
  specialty   ENUM(
    'Fisioterapia',
    'Educação Física',
    'Agronomia',
    'Farmácia',
    'Enfermagem',
    'Medicina',
    'Estética e Cosmética',
    'Fonoaudiologia',
    'Nutrição'
  )            NOT NULL,
  notes        LONGTEXT      NULL,
  file_path    VARCHAR(255)  NOT NULL,
  file_name    VARCHAR(255)  NOT NULL,
  file_size    INT           NULL,
  uploaded_by  INT           NULL,
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_medical_records_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_medical_records_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_patient_id  (patient_id),
  INDEX idx_specialty   (specialty),
  INDEX idx_created_at  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 9: questions
-- Perguntas individuais criadas pelos professores.
-- Suporta quatro tipos: texto livre, múltipla escolha, sim/não, escala.
-- =====================================================================
CREATE TABLE IF NOT EXISTS questions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  description   TEXT          NULL,
  question_type ENUM('texto_livre','multipla_escolha','sim_nao','escala')
                              NOT NULL DEFAULT 'texto_livre',
  options       JSON          NULL,
  created_by    INT           NOT NULL,
  course        VARCHAR(100)  NOT NULL,
  is_active     BOOLEAN       DEFAULT TRUE,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_questions_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE RESTRICT,
  INDEX idx_course_active       (course, is_active),
  INDEX idx_questions_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 10: questionnaires
-- Questionários (agrupamentos de perguntas) criados pelos professores.
-- =====================================================================
CREATE TABLE IF NOT EXISTS questionnaires (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  description   TEXT          NULL,
  course        VARCHAR(100)  NOT NULL,
  created_by    INT           NOT NULL,
  is_published  BOOLEAN       DEFAULT FALSE,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_questionnaires_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE RESTRICT,
  INDEX idx_course_published          (course, is_published),
  INDEX idx_questionnaires_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 11: questionnaire_questions
-- Tabela de junção entre questionnaires e questions.
-- Mantém a ordem das perguntas dentro de cada questionário.
-- =====================================================================
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  questionnaire_id  INT  NOT NULL,
  question_id       INT  NOT NULL,
  question_order    INT  NOT NULL DEFAULT 0,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_questionnaire_question (questionnaire_id, question_id),
  CONSTRAINT fk_questionnaire_questions_questionnaire
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_questionnaire_questions_question
    FOREIGN KEY (question_id) REFERENCES questions(id)
    ON DELETE CASCADE,
  INDEX idx_questionnaire_order  (questionnaire_id, question_order),
  INDEX idx_questionnaire_active (questionnaire_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 12: questionnaire_responses
-- Respostas dos pacientes a questionários aplicados.
-- response_data é um objeto JSON com pares { question_id: resposta }.
-- =====================================================================
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  patient_id        INT  NOT NULL,
  questionnaire_id  INT  NOT NULL,
  response_data     JSON NOT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_questionnaire_responses_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_questionnaire_responses_questionnaire
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    ON DELETE RESTRICT,
  INDEX idx_patient_questionnaire               (patient_id, questionnaire_id),
  INDEX idx_questionnaire_responses_created_at  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELA 13: quick_stats
-- Par chave/valor usado pelo dashboard para estatísticas rápidas.
-- =====================================================================
CREATE TABLE IF NOT EXISTS quick_stats (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- ÍNDICES ADICIONAIS
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_users_email          ON users(email);
CREATE INDEX IF NOT EXISTS idx_patients_status      ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_name        ON patients(name);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);

-- =====================================================================
-- ▶ 2. DADOS INICIAIS
-- =====================================================================

-- ---------------------------------------------------------------------
-- 2.1 Usuário Supervisor padrão
--     E-mail : suportecaige@univale.br
--     Senha  : suporte123   (hash bcrypt, fator 10)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO users
  (email, password_hash, name, role, is_active, is_hidden)
VALUES
  (
    'suportecaige@univale.br',
    '$2a$10$Ji4DeFj5XiJePFMlwsMCRedwAYHg/uV/z8KOL72ZmCNKkslkQ/yXS',
    'Suporte CAIGE',
    'SUPERVISOR',
    TRUE,
    FALSE
  );

-- ---------------------------------------------------------------------
-- 2.2 Permissões padrão por papel (role)
--     SUPERVISOR : acesso total a todas as funcionalidades
--     PROFESSOR  : acesso operacional, sem gestão de usuários
-- ---------------------------------------------------------------------
INSERT IGNORE INTO permissions
  (role,
   can_check_in, can_create_patient, can_edit_patient, can_view_patient,
   can_view_reports, can_create_user, can_edit_user,
   can_view_medical_records, can_manage_activities, can_access_dashboard)
VALUES
  ('SUPERVISOR', TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('PROFESSOR',  TRUE,  TRUE,  TRUE,  TRUE,  TRUE,  FALSE, FALSE, TRUE,  TRUE,  TRUE);

-- ---------------------------------------------------------------------
-- 2.3 Cursos / Especialidades (9 áreas da saúde)
-- ---------------------------------------------------------------------
INSERT IGNORE INTO courses (name) VALUES
  ('Agronomia'),
  ('Educação Física'),
  ('Enfermagem'),
  ('Estética e Cosmética'),
  ('Farmácia'),
  ('Fisioterapia'),
  ('Fonoaudiologia'),
  ('Medicina'),
  ('Nutrição');

-- =====================================================================
-- FIM DO SCRIPT — banco pronto para uso
-- =====================================================================
