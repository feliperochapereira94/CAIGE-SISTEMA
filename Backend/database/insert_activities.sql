-- =====================================================
-- SCRIPT DE ATIVIDADES DE TESTE
-- =====================================================
-- Executar no MySQL Workbench para popular tabela activities
-- Banco: caige
-- =====================================================

USE caige;

-- Limpar atividades anteriores (opcional - comentar se não quiser)
-- TRUNCATE TABLE activities;

-- Inserir atividades de exemplo
INSERT INTO activities (type, description, responsible, created_at) VALUES
('Novo Cadastro', 'Novo idoso cadastrado: Maria Silva Santos (CPF: 123.456.789-01)', 'Sistema', DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
('Edição', 'Idoso atualizado: Antônio Costa Ferreira', 'Sistema', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
('Novo Cadastro', 'Novo idoso cadastrado: Francisca Oliveira Mendes (CPF: 345.678.901-23)', 'Sistema', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('Anexo Prontuário', 'Nelson Osvaldo - Documento anexado', 'Sistema', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
('Edição', 'Idoso atualizado: José Pereira Gomes', 'Sistema', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('Consulta Agendada', 'Joana Alves Barbosa - Primeira consulta agendada', 'Sistema', DATE_SUB(NOW(), INTERVAL 1 HOUR 30 MINUTE)),
('Novo Cadastro', 'Novo idoso cadastrado: Manoel Xavier da Silva (CPF: 678.901.234-56)', 'Sistema', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('Edição', 'Observações adicionadas para Benedita Rocha Rodrigues', 'Sistema', DATE_SUB(NOW(), INTERVAL 2 HOUR 30 MINUTE)),
('Deleção', 'Idoso removido do sistema (ID: 999)', 'Sistema', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('Novo Cadastro', 'Novo idoso cadastrado: Roque Martins Cardoso (CPF: 890.123.456-78)', 'Sistema', DATE_SUB(NOW(), INTERVAL 3 HOUR 30 MINUTE));

-- =====================================================
-- CONFIRMAÇÃO
-- =====================================================
SELECT COUNT(*) as 'Total de Atividades' FROM activities;

-- Para ver todas as atividades recentes:
-- SELECT DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS data_hora, type, description, responsible 
-- FROM activities 
-- ORDER BY created_at DESC 
-- LIMIT 10;
