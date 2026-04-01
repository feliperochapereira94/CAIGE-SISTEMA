-- =====================================================
-- ADICIONAR CAMPOS DE NOME E ÚLTIMO LOGIN
-- =====================================================

-- Adicionar coluna de nome (se não existir)
ALTER TABLE users ADD COLUMN name VARCHAR(255);

-- Adicionar coluna de último login (se não existir)
ALTER TABLE users ADD COLUMN last_login TIMESTAMP NULL;

-- Algumas colunas já existem do add_roles_permissions.sql:
-- - role
-- - sector
-- - created_by
-- - is_active
