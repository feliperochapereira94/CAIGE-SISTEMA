-- Criar tabela de Attendance (Ponto/FrequÃªncia)
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

-- Essa tabela vai armazenar:
-- patient_id: Qual idoso se registrou
-- professional_id: Qual profissional (opcional - se houver acompanhamento)
-- check_in_time: HorÃ¡rio em que a presenÃ§a foi registrada
-- attendance_date: Dia da presenÃ§a, usado para garantir unicidade diÃ¡ria
-- notes: ObservaÃ§Ãµes adicionais

