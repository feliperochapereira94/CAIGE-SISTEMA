-- =====================================================
-- CAIGE - SETUP BANCO ZERADO (ESTRUTURA)
-- Cria banco e todas as tabelas sem dados de exemplo
-- =====================================================

CREATE DATABASE IF NOT EXISTS caige
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE caige;

-- =====================================================
-- TABELA: users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  role ENUM('SUPERVISOR', 'PROFESSOR') NOT NULL DEFAULT 'PROFESSOR',
  sector VARCHAR(255) NULL,
  created_by INT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(50) NOT NULL UNIQUE,
  can_check_in BOOLEAN DEFAULT FALSE,
  can_create_patient BOOLEAN DEFAULT FALSE,
  can_edit_patient BOOLEAN DEFAULT FALSE,
  can_view_patient BOOLEAN DEFAULT FALSE,
  can_view_reports BOOLEAN DEFAULT FALSE,
  can_create_user BOOLEAN DEFAULT FALSE,
  can_edit_user BOOLEAN DEFAULT FALSE,
  can_view_medical_records BOOLEAN DEFAULT FALSE,
  can_manage_activities BOOLEAN DEFAULT FALSE,
  can_access_dashboard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: professionals
-- =====================================================
CREATE TABLE IF NOT EXISTS professionals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: courses
-- =====================================================
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: patients
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NULL,
  gender VARCHAR(50) NULL,
  cpf VARCHAR(20) NULL,
  phone VARCHAR(20) NULL,
  phone2 VARCHAR(20) NULL,
  cep VARCHAR(20) NULL,
  street VARCHAR(255) NULL,
  number VARCHAR(50) NULL,
  neighborhood VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  state VARCHAR(50) NULL,
  responsible VARCHAR(255) NULL,
  responsible_relationship VARCHAR(50) NULL,
  responsible_phone VARCHAR(20) NULL,
  photo LONGTEXT NULL,
  observations LONGTEXT NULL,
  status VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: activities
-- =====================================================
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: attendance
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  professional_id INT NULL,
  check_in_time DATETIME NOT NULL,
  attendance_date DATE NOT NULL,
  notes VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

-- =====================================================
-- TABELA: medical_records
-- =====================================================
CREATE TABLE IF NOT EXISTS medical_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  specialty ENUM(
    'Fisioterapia',
    'Educação Física',
    'Agronomia',
    'Farmácia',
    'Enfermagem',
    'Medicina',
    'Estética e Cosmética',
    'Fonoaudiologia',
    'Nutrição'
  ) NOT NULL,
  notes LONGTEXT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NULL,
  uploaded_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_medical_records_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_medical_records_uploaded_by
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_patient_id (patient_id),
  INDEX idx_specialty (specialty),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: questions
-- =====================================================
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  question_type ENUM('texto_livre', 'multipla_escolha', 'sim_nao', 'escala') NOT NULL DEFAULT 'texto_livre',
  options JSON NULL,
  created_by INT NOT NULL,
  course VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_questions_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE RESTRICT,
  INDEX idx_course_active (course, is_active),
  INDEX idx_questions_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: questionnaires
-- =====================================================
CREATE TABLE IF NOT EXISTS questionnaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  course VARCHAR(100) NOT NULL,
  created_by INT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_questionnaires_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE RESTRICT,
  INDEX idx_course_published (course, is_published),
  INDEX idx_questionnaires_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: questionnaire_questions
-- =====================================================
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  questionnaire_id INT NOT NULL,
  question_id INT NOT NULL,
  question_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_questionnaire_question (questionnaire_id, question_id),
  CONSTRAINT fk_questionnaire_questions_questionnaire
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_questionnaire_questions_question
    FOREIGN KEY (question_id) REFERENCES questions(id)
    ON DELETE CASCADE,
  INDEX idx_questionnaire_order (questionnaire_id, question_order),
  INDEX idx_questionnaire_active (questionnaire_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: questionnaire_responses
-- =====================================================
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  questionnaire_id INT NOT NULL,
  response_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_questionnaire_responses_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_questionnaire_responses_questionnaire
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    ON DELETE RESTRICT,
  INDEX idx_patient_questionnaire (patient_id, questionnaire_id),
  INDEX idx_questionnaire_responses_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: quick_stats
-- =====================================================
CREATE TABLE IF NOT EXISTS quick_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ÍNDICES ADICIONAIS
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_activities_created_at ON activities(created_at);

-- =====================================================
-- FIM - BANCO ZERADO (SEM INSERTS)
-- =====================================================
