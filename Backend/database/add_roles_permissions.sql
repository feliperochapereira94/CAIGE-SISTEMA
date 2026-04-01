ALTER TABLE users ADD COLUMN role ENUM('SUPERVISOR', 'PROFESSOR') DEFAULT 'PROFESSOR';
ALTER TABLE users ADD COLUMN sector VARCHAR(255);
ALTER TABLE users ADD COLUMN created_by INT;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(50) NOT NULL UNIQUE,
  can_check_in BOOLEAN DEFAULT FALSE,
  can_create_patient BOOLEAN DEFAULT FALSE,
  can_edit_patient BOOLEAN DEFAULT FALSE,
  can_view_patient BOOLEAN DEFAULT FALSE,
  can_view_reports BOOLEAN DEFAULT FALSE,
  can_create_user BOOLEAN DEFAULT FALSE,
  can_edit_user BOOLEAN DEFAULT FALSE,
  can_view_medical_records BOOLEAN DEFAULT FALSE,
  can_manage_activities BOOLEAN DEFAULT FALSE,
  can_access_dashboard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO permissions (role, can_check_in, can_create_patient, can_edit_patient, can_view_patient, can_view_reports, can_create_user, can_edit_user, can_view_medical_records, can_manage_activities, can_access_dashboard) VALUES
('SUPERVISOR', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('PROFESSOR', TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE);

