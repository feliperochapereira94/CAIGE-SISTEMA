-- Tabela de perguntas criadas pelos professores
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  question_type ENUM('texto_livre', 'multipla_escolha', 'sim_nao', 'escala') NOT NULL DEFAULT 'texto_livre',
  options JSON COMMENT 'Para mÃºltipla escolha: {"options": ["opÃ§Ã£o1", "opÃ§Ã£o2"]}',
  created_by INT NOT NULL,
  course VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_course_active (course, is_active),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de prontuÃ¡rios (formulÃ¡rios)
CREATE TABLE IF NOT EXISTS questionnaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  course VARCHAR(100) NOT NULL,
  created_by INT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_course_published (course, is_published),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de associaÃ§Ã£o entre prontuÃ¡rios e perguntas (com ordem)
CREATE TABLE IF NOT EXISTS questionnaire_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  questionnaire_id INT NOT NULL,
  question_id INT NOT NULL,
  question_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_questionnaire_question (questionnaire_id, question_id),
  FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_questionnaire_order (questionnaire_id, question_order),
  INDEX idx_questionnaire_active (questionnaire_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de respostas (snapshot do prontuÃ¡rio respondido)
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  questionnaire_id INT NOT NULL,
  response_data JSON NOT NULL COMMENT 'Snapshot: {question_id: {title, question_type, answer, options_snapshot}}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE RESTRICT,
  INDEX idx_patient_questionnaire (patient_id, questionnaire_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

