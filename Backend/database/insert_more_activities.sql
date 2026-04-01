-- =====================================================
-- SCRIPT DE INSERÇÃO - MAIS ATIVIDADES VARIADAS
-- =====================================================

USE caige;

INSERT INTO activities (type, description, responsible, created_at) VALUES
('Novo Cadastro', 'Novo idoso cadastrado: João da Silva (CPF: 111.222.333-44)', 'Sistema', DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
('Edição', 'Telefone atualizado para: Maria Santos', 'Sistema', DATE_SUB(NOW(), INTERVAL 20 MINUTE)),
('Consulta Agendada', 'Geriatria agendada: Ana Costa - 10/02/2026 14:30', 'Sistema', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('Atendimento', 'Sessão de fisioterapia realizada: Paulo Mendes', 'Dr. João Silva', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
('Avaliação', 'Avaliação neuropsicológica inicial: Carlos Ribeiro', 'Psicólogo Silva', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('Anexo Prontuário', 'Documento anexado: Resultado de exame de sangue - Roberto Dias', 'Sistema', DATE_SUB(NOW(), INTERVAL 1 HOUR 15 MINUTE)),
('Novo Cadastro', 'Novo idoso cadastrado: Francisca Alves (CPF: 555.666.777-88)', 'Sistema', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('Deleção', 'Atividade removida do sistema', 'Sistema', DATE_SUB(NOW(), INTERVAL 2 HOUR 30 MINUTE)),
('Edição', 'CEP e endereço atualizado: Joaquim Costa', 'Sistema', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('Consulta Agendada', 'Oftalmologia agendada: Margarida Silva - 12/02/2026 11:00', 'Sistema', DATE_SUB(NOW(), INTERVAL 3 HOUR 30 MINUTE)),
('Atendimento', 'Consulta com nutricionista: Eleanor Ferreira', 'Nutricionista Ana', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
('Avaliação', 'Reavaliação funcional: Benedito Martins', 'Fisioterapeuta Carlos', DATE_SUB(NOW(), INTERVAL 4 HOUR 45 MINUTE)),
('Novo Cadastro', 'Novo idoso cadastrado: Amélia Gomes (CPF: 999.888.777-66)', 'Sistema', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Edição', 'Observações atualizadas: Teresa Couto', 'Sistema', DATE_SUB(NOW(), INTERVAL 1 DAY 2 HOUR)),
('Anexo Prontuário', 'Laudo médico anexado: Cardiologia - Valdir Rocha', 'Sistema', DATE_SUB(NOW(), INTERVAL 1 DAY 4 HOUR)),
('Consulta Agendada', 'Clínica geral agendada: Eulália Torres - 15/02/2026 09:30', 'Sistema', DATE_SUB(NOW(), INTERVAL 1 DAY 6 HOUR)),
('Atendimento', 'Acompanhamento psicológico: Otávio Brito', 'Psicólogo Fernando', DATE_SUB(NOW(), INTERVAL 1 DAY 8 HOUR)),
('Novo Cadastro', 'Novo idoso cadastrado: Doralice Mota (CPF: 333.444.555-66)', 'Sistema', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Edição', 'Responsável atualizado: Geraldo Santos', 'Sistema', DATE_SUB(NOW(), INTERVAL 2 DAY 3 HOUR)),
('Avaliação', 'Teste de mobilidade realizado: Iracema Costa', 'Terapeuta Ocupacional', DATE_SUB(NOW(), INTERVAL 2 DAY 6 HOUR));

-- Confirmação
SELECT COUNT(*) as 'Total de Atividades' FROM activities;

-- Para ver as últimas 30:
-- SELECT DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS data_hora, type, description, responsible 
-- FROM activities 
-- ORDER BY created_at DESC 
-- LIMIT 30;
