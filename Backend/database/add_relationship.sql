-- Adicionar coluna responsible_relationship se nÃ£o existir
ALTER TABLE patients ADD COLUMN IF NOT EXISTS responsible_relationship VARCHAR(50) AFTER responsible;

