-- ============================================================
-- CAIGE: Tabela de Cursos
-- Execute APÓS setup_complete.sql (instalação nova)
-- ou APÓS migrate-security.sql (banco existente)
-- ============================================================

CREATE TABLE IF NOT EXISTS courses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Popular com os cursos já existentes no sistema
INSERT IGNORE INTO courses (name) VALUES
  ('Fisioterapia'),
  ('Educação Física'),
  ('Agronomia'),
  ('Farmácia'),
  ('Enfermagem'),
  ('Medicina'),
  ('Estética e Cosmética'),
  ('Fonoaudiologia'),
  ('Nutrição');
