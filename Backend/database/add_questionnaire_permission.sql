-- Adicionar permissão para criar perguntas/prontuários
INSERT IGNORE INTO permissions (name, description) VALUES 
('can_create_questions', 'Permite criar e gerenciar perguntas e prontuários');

-- Dar permissão aos professores por padrão
-- Assumindo que existe um role de professor
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r
JOIN permissions p ON p.name = 'can_create_questions'
WHERE r.name IN ('professor', 'teacher', 'instructor');

-- Dar permissão aos administradores por padrão
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r
JOIN permissions p ON p.name = 'can_create_questions'
WHERE r.name = 'admin';
