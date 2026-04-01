-- Migracao: remover estrutura de agendamentos (appointments)
-- Uso: executar em bancos existentes que nao devem ter modulo de agendamento.

DROP TABLE IF EXISTS appointments;
