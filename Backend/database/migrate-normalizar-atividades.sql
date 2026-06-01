-- Normaliza registros antigos da tabela atividades sem alterar a estrutura.
-- Execute no banco ja existente quando quiser alinhar os logs historicos.

USE caige;

START TRANSACTION;

-- Corrige textos com mojibake quando encontrados.
UPDATE atividades
SET tipo = CONVERT(BINARY CONVERT(tipo USING latin1) USING utf8mb4)
WHERE tipo REGEXP 'Ã|Â|�';

UPDATE atividades
SET descricao = CONVERT(BINARY CONVERT(descricao USING latin1) USING utf8mb4)
WHERE descricao REGEXP 'Ã|Â|�';

UPDATE atividades
SET responsavel = CONVERT(BINARY CONVERT(responsavel USING latin1) USING utf8mb4)
WHERE responsavel REGEXP 'Ã|Â|�';

-- Padroniza categorias principais.
UPDATE atividades
SET tipo = 'Paciente'
WHERE tipo IN ('Novo Cadastro', 'Edição', 'Inativação', 'Reativação')
  AND (
    descricao = 'Pacientes de teste cadastrados no setup completo'
    OR descricao LIKE 'Novo paciente cadastrado:%'
    OR descricao LIKE 'Paciente atualizado:%'
    OR descricao LIKE 'Paciente desativado:%'
    OR descricao LIKE 'Paciente reativado:%'
    OR descricao LIKE 'Paciente desabilitado definitivamente:%'
  );

UPDATE atividades
SET tipo = 'Usuário'
WHERE tipo IN ('Novo Cadastro', 'Edição', 'Inativação', 'Reativação')
  AND (
    descricao LIKE 'Novo usuario criado:%'
    OR descricao LIKE 'Novo usuário criado:%'
    OR descricao LIKE 'Usuario atualizado:%'
    OR descricao LIKE 'Usuário atualizado:%'
    OR descricao LIKE 'Usuario % ativado'
    OR descricao LIKE 'Usuário % ativado'
    OR descricao LIKE 'Usuario % inativado'
    OR descricao LIKE 'Usuário % inativado'
    OR descricao LIKE 'Usuario desabilitado definitivamente:%'
    OR descricao LIKE 'Usuário desabilitado definitivamente:%'
  );

UPDATE atividades
SET tipo = 'Pergunta'
WHERE tipo IN ('Perguntas', 'Pergunta')
   OR descricao LIKE 'Pergunta %';

UPDATE atividades
SET tipo = 'Questionário'
WHERE tipo IN ('Questionarios', 'Questionário', 'Questionario')
   OR descricao LIKE 'Questionario %'
   OR descricao LIKE 'Questionário %';

UPDATE atividades
SET tipo = 'Curso'
WHERE tipo IN ('Criar Curso', 'Remover Curso', 'Curso')
   OR descricao LIKE 'Curso %';

UPDATE atividades
SET tipo = 'Sistema'
WHERE tipo IN ('Configuracao', 'Configuração', 'Sistema')
   OR descricao = 'Base inicial com dados de teste criada';

-- Padroniza descricoes mais comuns.
UPDATE atividades
SET descricao = REPLACE(descricao, 'Questionario', 'Questionário')
WHERE descricao LIKE '%Questionario%';

UPDATE atividades
SET descricao = REPLACE(descricao, 'Usuario', 'Usuário')
WHERE descricao LIKE '%Usuario%';

UPDATE atividades
SET descricao = REPLACE(descricao, 'Pergunta deletada:', 'Pergunta removida:')
WHERE descricao LIKE 'Pergunta deletada:%';

UPDATE atividades
SET descricao = REPLACE(descricao, 'Questionário deletado:', 'Questionário removido:')
WHERE descricao LIKE 'Questionário deletado:%';

UPDATE atividades
SET descricao = REPLACE(descricao, 'Questionário deletado:', 'Questionário removido:')
WHERE descricao LIKE 'Questionario deletado:%';

COMMIT;

SELECT tipo, COUNT(*) AS total
FROM atividades
GROUP BY tipo
ORDER BY tipo;
