-- =====================================================
-- SCRIPT DE INSERÃ‡ÃƒO - 20 IDOSOS PARA TESTE
-- =====================================================
-- Executar no MySQL Workbench
-- Banco: caige
-- =====================================================

USE caige;

-- Limpar dados anteriores (opcional - comentar se nÃ£o quiser)
-- TRUNCATE TABLE patients;

INSERT INTO patients (
  name, birth_date, gender, cpf, phone, phone2, cep, street, number,
  neighborhood, city, state, responsible, responsible_relationship,
  responsible_phone, observations, status
) VALUES

-- 1
('Maria Silva Santos', '1945-03-15', 'Feminino', '123.456.789-01', '27-3232-1001', '27-98765-4321', 
 '29000-000', 'Rua das Flores', '123', 'Centro', 'VitÃ³ria', 'ES', 'JoÃ£o Silva', 'Filho', 
 '27-99876-5432', 'DiabÃ©tica, medicaÃ§Ã£o em dia', 'Ativo'),

-- 2
('AntÃ´nio Costa Ferreira', '1943-07-22', 'Masculino', '234.567.890-12', '11-3123-4567', '11-98765-4322',
 '01310-100', 'Avenida Paulista', '456', 'Bela Vista', 'SÃ£o Paulo', 'SP', 'Ana Costa', 'Filha',
 '11-99876-5433', 'HipertensÃ£o controlada', 'Ativo'),

-- 3
('Francisca Oliveira Mendes', '1948-11-08', 'Feminino', '345.678.901-23', '21-2532-8901', '21-98765-4323',
 '20000-020', 'Rua da Lapa', '789', 'Lapa', 'Rio de Janeiro', 'RJ', 'Pedro Mendes', 'Neto',
 '21-99876-5434', 'Artrite nos joelhos', 'Ativo'),

-- 4
('JosÃ© Pereira Gomes', '1940-05-30', 'Masculino', '456.789.012-34', '31-3456-7890', '31-98765-4324',
 '30130-100', 'Rua Santa Rita', '321', 'FuncionÃ¡rios', 'Belo Horizonte', 'MG', 'Lucia Gomes', 'Filha',
 '31-99876-5435', 'Alzheimer em estÃ¡gio inicial', 'Ativo'),

-- 5
('Joana Alves Barbosa', '1947-09-12', 'Feminino', '567.890.123-45', '41-3234-5678', '41-98765-4325',
 '80010-000', 'Avenida GetÃºlio Vargas', '654', 'Centro', 'Curitiba', 'PR', 'Carlos Barbosa', 'Filho',
 '41-99876-5436', 'Osteoporose, toma cÃ¡lcio', 'Ativo'),

-- 6
('Manoel Xavier da Silva', '1942-02-14', 'Masculino', '678.901.234-56', '85-3129-8765', '85-98765-4326',
 '60000-000', 'Rua 25 de MarÃ§o', '987', 'Centro', 'Fortaleza', 'CE', 'Marina Silva', 'Neta',
 '85-99876-5437', 'Cataratas jÃ¡ tratadas', 'Ativo'),

-- 7
('Benedita Rocha Rodrigues', '1946-06-20', 'Feminino', '789.012.345-67', '51-3456-1234', '51-98765-4327',
 '90010-150', 'Avenida Beira-Mar', '111', 'Centro HistÃ³rico', 'Porto Alegre', 'RS', 'Felipe Rodrigues', 'Filho',
 '51-99876-5438', 'PressÃ£o alta, faz exercÃ­cio regular', 'Ativo'),

-- 8
('Roque Martins Cardoso', '1944-04-25', 'Masculino', '890.123.456-78', '47-3223-4567', '47-98765-4328',
 '89000-000', 'Rua Felipe Schmidt', '222', 'Centro', 'Blumenau', 'SC', 'Vanessa Cardoso', 'Filha',
 '47-99876-5439', 'Aposentado, vida tranquila', 'Ativo'),

-- 9
('Iracema Nunes Dias', '1949-10-03', 'Feminino', '901.234.567-89', '69-3232-1122', '69-98765-4329',
 '69000-000', 'Avenida Eduardo Ribeiro', '333', 'Centro', 'Manaus', 'AM', 'Roberto Dias', 'Sobrinho',
 '69-99876-5440', 'ViÃºva hÃ¡ 5 anos, vive sozinha', 'Ativo'),

-- 10
('Severino Almeida de AraÃºjo', '1941-08-11', 'Masculino', '012.345.678-90', '79-3213-5678', '79-98765-4330',
 '79000-000', 'Rua 13 de Junho', '444', 'Centro', 'CuiabÃ¡', 'MT', 'Elisa AraÃºjo', 'Filha',
 '79-99876-5441', 'Faz caminhada 3x por semana', 'Ativo'),

-- 11
('EulÃ¡lia Carvalho Lima', '1945-12-29', 'Feminino', '123.456.789-02', '68-3223-4567', '68-98765-4331',
 '69900-000', 'Rua GetÃºlio Vargas', '555', 'Centro', 'Rio Branco', 'AC', 'Thiago Lima', 'Neto',
 '68-99876-5442', 'Problemas de mobilidade, usa bengala', 'Ativo'),

-- 12
('Valdemar Henrique Ribeiro', '1943-01-16', 'Masculino', '234.567.890-13', '65-3322-1234', '65-98765-4332',
 '65000-000', 'Avenida GetÃºlio Vargas', '666', 'Goiabeira', 'GoiÃ¢nia', 'GO', 'DÃ©bora Ribeiro', 'Filha',
 '65-99876-5443', 'Artrite reumatoide em tratamento', 'Ativo'),

-- 13
('Odete Fonseca Pereira', '1948-05-07', 'Feminino', '345.678.901-24', '62-3224-5678', '62-98765-4333',
 '74000-000', 'Rua 4', '777', 'Setor Central', 'BrasÃ­lia', 'DF', 'Lucas Pereira', 'Filho',
 '62-99876-5444', 'IncontinÃªncia urinÃ¡ria, usa fraldas adulto', 'Ativo'),

-- 14
('Geraldo Souza Goulart', '1942-09-23', 'Masculino', '456.789.012-35', '73-3214-7654', '73-98765-4334',
 '89000-000', 'Rua Marechal Floriano', '888', 'Centro', 'Lages', 'SC', 'Gabriela Goulart', 'Neta',
 '73-99876-5445', 'Catarata no olho esquerdo', 'Ativo'),

-- 15
('Doralice Barbosa Motta', '1947-03-11', 'Feminino', '567.890.123-46', '83-3234-1234', '83-98765-4335',
 '58000-000', 'Avenida Afonso Pedro', '999', 'Centro', 'Campina Grande', 'PB', 'Henrique Motta', 'Sobrinho',
 '83-99876-5446', 'Ativa, faz trabalho voluntÃ¡rio', 'Ativo'),

-- 16
('Jair Monteiro Cavalcanti', '1944-11-19', 'Masculino', '678.901.234-57', '87-3321-6789', '87-98765-4336',
 '87000-000', 'Rua XV de Novembro', '1010', 'Centro', 'ChapecÃ³', 'SC', 'Juliana Cavalcanti', 'Filha',
 '87-99876-5447', 'PrÃ³stata aumentada, acompanhamento', 'Ativo'),

-- 17
('Altina Brito Machado', '1946-07-04', 'Feminino', '789.012.345-68', '67-3321-4321', '67-98765-4337',
 '79000-000', 'Rua Dom Aquino', '1111', 'Centro', 'Campo Grande', 'MS', 'Karina Machado', 'Filha',
 '67-99876-5448', 'Dedica-se ao cuidado da famÃ­lia', 'Ativo'),

-- 18
('Leopoldo Ferreira Navarro', '1941-12-02', 'Masculino', '890.123.456-79', '72-3223-9876', '72-98765-4338',
 '72000-000', 'SEPN 511', '1212', 'Asa Norte', 'BrasÃ­lia', 'DF', 'NatÃ¡lia Navarro', 'Filha',
 '72-99876-5449', 'Reservado, poucos amigos', 'Ativo'),

-- 19
('Teresinha Rocha Teixeira', '1949-04-30', 'Feminino', '901.234.567-80', '75-3232-5678', '75-98765-4339',
 '77000-000', 'Avenida TeotÃ´nio Segurado', '1313', 'Centro', 'Palmas', 'TO', 'OtÃ¡vio Teixeira', 'Neto',
 '75-99876-5450', 'Vive em asilo hÃ¡ 2 anos', 'Ativo'),

-- 20
('AmÃ¢ncio Lopes do Carmo', '1943-06-08', 'Masculino', '012.345.678-91', '82-3214-1111', '82-98765-4340',
 '82000-000', 'Rua do ComÃ©rcio', '1414', 'Centro', 'MaceiÃ³', 'AL', 'PatrÃ­cia Carmo', 'Filha',
 '82-99876-5451', 'Gosta de contar histÃ³rias do passado', 'Ativo');

-- =====================================================
-- CONFIRMAÃ‡ÃƒO
-- =====================================================
SELECT COUNT(*) as 'Total de Idosos Cadastrados' FROM patients;

-- Para ver todos os registros:
-- SELECT * FROM patients ORDER BY id DESC LIMIT 20;

