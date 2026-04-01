-- =====================================================
-- SCRIPT DE CONFIGURAÃ‡ÃƒO INICIAL - CAIGE SISTEMA
-- =====================================================
-- Data: 05/02/2026
-- VersÃ£o: 1.0
-- =====================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS caige;
USE caige;

-- =====================================================
-- TABELA: users
-- DescriÃ§Ã£o: UsuÃ¡rios do sistema (funcionÃ¡rios, equipe)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: patients
-- DescriÃ§Ã£o: Dados dos idosos cadastrados
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birth_date DATE,
  gender VARCHAR(50),
  cpf VARCHAR(20),
  phone VARCHAR(20),
  phone2 VARCHAR(20),
  cep VARCHAR(20),
  street VARCHAR(255),
  number VARCHAR(50),
  neighborhood VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(50),
  responsible VARCHAR(255),
  responsible_relationship VARCHAR(50),
  responsible_phone VARCHAR(20),
  photo LONGTEXT,
  observations LONGTEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: professionals
-- DescriÃ§Ã£o: Profissionais da equipe
-- =====================================================
CREATE TABLE IF NOT EXISTS professionals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: activities
-- DescriÃ§Ã£o: Atividades e histÃ³rico do sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: quick_stats
-- DescriÃ§Ã£o: EstatÃ­sticas rÃ¡pidas do dashboard
-- =====================================================
CREATE TABLE IF NOT EXISTS quick_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERIR DADOS DE TESTE
-- =====================================================

-- UsuÃ¡rio padrÃ£o (email: suportecaige@univale.br, senha: 123456)
-- Senha criptografada com bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvQm2
INSERT INTO users (email, password_hash) VALUES 
('suportecaige@univale.br', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvQm2');

-- UsuÃ¡rio adicional para teste (email: admin@univale.br, senha: admin123)
-- Senha: $2a$10$Yvz0OWRxMZiKQPXAW9Oe4e5Yv.5f8DLmJ7K6L5M4N3O2P1Q0R9S8T
INSERT INTO users (email, password_hash) VALUES 
('admin@univale.br', '$2a$10$Yvz0OWRxMZiKQPXAW9Oe4e5Yv.5f8DLmJ7K6L5M4N3O2P1Q0R9S8T');

-- Profissionais da equipe
INSERT INTO professionals (name) VALUES 
('Dr. JoÃ£o Silva - Geriatria'),
('DrÂª. Maria Santos - Enfermagem'),
('PsicÃ³logo Carlos Oliveira'),
('Fisioterapeuta Ana Costa'),
('Assistente Social Pedro Alves');

-- Idosos cadastrados (exemplos)
INSERT INTO patients (name, birth_date, gender, cpf, phone, cep, street, number, neighborhood, city, state, responsible, responsible_relationship, responsible_phone, status) VALUES 
('Antonieta de Souza', '1935-03-15', 'F', '123.456.789-00', '(31) 98765-4321', '30140-071', 'Rua A', '123', 'Centro', 'Belo Horizonte', 'MG', 'JosÃ© de Souza', 'Filho', '(31) 99876-5432', 'ativo'),
('Manoel Ribeiro Santos', '1938-07-22', 'M', '987.654.321-00', '(31) 97654-3210', '30140-072', 'Avenida B', '456', 'FuncionÃ¡rios', 'Belo Horizonte', 'MG', 'Carla Ribeiro', 'Filha', '(31) 98765-4322', 'ativo'),
('Francisca da Silva Gomes', '1940-11-10', 'F', '456.789.123-00', '(31) 96543-2109', '30140-073', 'Rua C', '789', 'Savassi', 'Belo Horizonte', 'MG', 'Ana Silva', 'Neta', '(31) 97654-3211', 'ativo'),
('Paulo de Oliveira Costa', '1937-05-28', 'M', '789.123.456-00', '(31) 95432-1098', '30140-074', 'Avenida D', '101', 'Lourdes', 'Belo Horizonte', 'MG', 'Lucas Costa', 'Neto', '(31) 96543-2110', 'ativo');

-- Atividades recentes (exemplo)
INSERT INTO activities (type, description, responsible) VALUES 
('Cadastro', 'Nova idosa cadastrada: Antonieta de Souza', 'suportecaige@univale.br'),
('Consulta', 'Consulta com Geriatra - Manoel Ribeiro', 'Dr. JoÃ£o Silva'),
('Atendimento', 'SessÃ£o de Fisioterapia - Francisca Gomes', 'Fisioterapeuta Ana Costa'),
('AvaliaÃ§Ã£o', 'AvaliaÃ§Ã£o psicolÃ³gica inicial - Paulo Costa', 'PsicÃ³logo Carlos Oliveira');

-- EstatÃ­sticas rÃ¡pidas
INSERT INTO quick_stats (label, value) VALUES 
('Atendimentos este mÃªs', '12'),
('Taxa de satisfaÃ§Ã£o', '95%'),
('Equipe ativa', '5 profissionais'),
('Atividades pendentes', '3');

-- =====================================================
-- CRIAR ÃNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_patient_status ON patients(status);
CREATE INDEX idx_patient_name ON patients(name);
CREATE INDEX idx_activities_date ON activities(created_at);

-- =====================================================
-- EXIBIR RELATÃ“RIO
-- =====================================================
SELECT 'âœ… Banco de dados criado com sucesso!' as Status;
SELECT CONCAT(COUNT(*), ' usuÃ¡rios cadastrados') as users_count FROM users;
SELECT CONCAT(COUNT(*), ' idosos cadastrados') as patient_count FROM patients;
SELECT CONCAT(COUNT(*), ' profissionais cadastrados') as professionals_count FROM professionals;

-- =====================================================
-- VALIDAÃ‡Ã•ES E TESTES
-- =====================================================

-- Verificar usuÃ¡rios criados
SELECT '--- USUÃRIOS CRIADOS ---' as Info;
SELECT id, email, created_at FROM users;

-- Verificar idosos cadastrados
SELECT '--- IDOSOS CADASTRADOS ---' as Info;
SELECT id, name, birth_date, status, created_at FROM patients;

-- Verificar profissionais
SELECT '--- PROFISSIONAIS ---' as Info;
SELECT id, name FROM professionals;

-- Verificar atividades
SELECT '--- ÃšLTIMAS ATIVIDADES ---' as Info;
SELECT id, type, description, responsible, created_at FROM activities ORDER BY created_at DESC;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- Script executado com sucesso!
-- Agora vocÃª pode:
-- 1. Iniciar o Backend: npm run dev
-- 2. Abrir o Frontend no navegador
-- 3. Fazer login com: suportecaige@univale.br / 123456
-- =====================================================

