-- Migracao: habilitar desativacao logica de perguntas em prontuarios
-- Objetivo: permitir remover pergunta de prontuario sem usar DELETE FROM.

SET @db_name := DATABASE();

SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = @db_name
  AND TABLE_NAME = 'questionnaire_questions'
  AND COLUMN_NAME = 'is_active';

SET @sql_add_col := IF(
  @col_exists = 0,
  'ALTER TABLE questionnaire_questions ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE AFTER question_order',
  'SELECT 1'
);

PREPARE stmt_add_col FROM @sql_add_col;
EXECUTE stmt_add_col;
DEALLOCATE PREPARE stmt_add_col;

SELECT COUNT(*) INTO @idx_exists
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = @db_name
  AND TABLE_NAME = 'questionnaire_questions'
  AND INDEX_NAME = 'idx_questionnaire_active';

SET @sql_add_idx := IF(
  @idx_exists = 0,
  'ALTER TABLE questionnaire_questions ADD INDEX idx_questionnaire_active (questionnaire_id, is_active)',
  'SELECT 1'
);

PREPARE stmt_add_idx FROM @sql_add_idx;
EXECUTE stmt_add_idx;
DEALLOCATE PREPARE stmt_add_idx;

-- Garante que registros antigos fiquem ativos.
UPDATE questionnaire_questions
SET is_active = TRUE
WHERE is_active IS NULL;
