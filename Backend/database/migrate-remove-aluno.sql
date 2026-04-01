-- Migração: Remoção do papel ALUNO do sistema
-- Execute este script uma vez em bancos de dados existentes.

-- 1. Converter usuários existentes com papel ALUNO para PROFESSOR
UPDATE users SET role = 'PROFESSOR' WHERE role = 'ALUNO';

-- 2. Alterar a coluna ENUM para remover a opção ALUNO
ALTER TABLE users
  MODIFY COLUMN role ENUM('SUPERVISOR', 'PROFESSOR') NOT NULL DEFAULT 'PROFESSOR';

-- 3. Remover a linha de permissões do papel ALUNO
DELETE FROM permissions WHERE role = 'ALUNO';
