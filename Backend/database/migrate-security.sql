-- ============================================================
-- CAIGE: Migração de Segurança
-- Execute UMA VEZ em bancos de dados já existentes.
-- Tabelas novas sao criadas pelo setup_completo.sql.
-- ============================================================

-- -------------------------------------------------------
-- 1. Corrigir permissões do perfil PROFESSOR
--    Professor NÃO pode criar nem editar usuários.
-- -------------------------------------------------------
UPDATE roles_permissions
SET can_create_user = FALSE,
    can_edit_user   = FALSE
WHERE role = 'PROFESSOR';

-- Verificação (deve retornar 0 para ambas as colunas):
-- SELECT role, can_create_user, can_edit_user
-- FROM roles_permissions WHERE role = 'PROFESSOR';


-- -------------------------------------------------------
-- 2. Corrigir FK de questionnaire_responses
--    Muda de ON DELETE CASCADE → ON DELETE RESTRICT
--    para evitar exclusão acidental de respostas de pacientes
--    ao excluir um prontuário.
-- -------------------------------------------------------

-- 2a. Descobrir o nome da constraint existente
SET @fk_name = (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA    = DATABASE()
    AND TABLE_NAME      = 'questionnaire_responses'
    AND COLUMN_NAME     = 'questionnaire_id'
    AND REFERENCED_TABLE_NAME = 'questionnaires'
  LIMIT 1
);

-- 2b. Remover a constraint antiga (somente se existir)
SET @drop_sql = IF(
  @fk_name IS NOT NULL,
  CONCAT('ALTER TABLE questionnaire_responses DROP FOREIGN KEY `', @fk_name, '`'),
  'SELECT "FK nao encontrada, pulando" AS aviso'
);
PREPARE drop_stmt FROM @drop_sql;
EXECUTE drop_stmt;
DEALLOCATE PREPARE drop_stmt;

-- 2c. Recriar com RESTRICT
ALTER TABLE questionnaire_responses
  ADD CONSTRAINT fk_qr_questionnaire_restrict
  FOREIGN KEY (questionnaire_id)
  REFERENCES questionnaires(id)
  ON DELETE RESTRICT;

-- Verificação (deve mostrar DELETE_RULE = 'RESTRICT'):
-- SELECT CONSTRAINT_NAME, DELETE_RULE
-- FROM information_schema.REFERENTIAL_CONSTRAINTS
-- WHERE CONSTRAINT_SCHEMA = DATABASE()
--   AND TABLE_NAME = 'questionnaire_responses';
