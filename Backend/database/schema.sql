CREATE DATABASE IF NOT EXISTS caige;

USE caige;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

CREATE TABLE IF NOT EXISTS professionals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  professional_id INT,
  check_in_time DATETIME NOT NULL,
  attendance_date DATE NOT NULL,
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE SET NULL,
  UNIQUE KEY uniq_attendance_patient_date (patient_id, attendance_date),
  INDEX idx_attendance_date (attendance_date),
  INDEX idx_check_in_time (check_in_time)
);

CREATE TABLE IF NOT EXISTS quick_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL
);

