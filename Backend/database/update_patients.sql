-- Executar no MySQL Workbench ou cliente MySQL
-- Script para atualizar a tabela patients com os campos necessÃ¡rios

USE caige;

-- Remover a tabela antiga se existir
DROP TABLE IF EXISTS patients;

-- Criar a tabela atualizada
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birth_date DATE,
  phone VARCHAR(20),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

