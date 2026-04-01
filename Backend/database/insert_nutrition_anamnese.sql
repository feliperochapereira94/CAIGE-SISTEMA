-- Seed: Prontuario de Nutricao - Anamnese Nutricional
-- Pode ser executado mais de uma vez (idempotente).

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET collation_connection = 'utf8mb4_unicode_ci';

SET @course := 'Nutricao';
SET @questionnaire_title := 'Anamnese Nutricional';
SET @questionnaire_description := 'Anamnese nutricional completa: identificacao, historia alimentar, avaliacao antropometrica e recordatorio 24h.';

-- Usa preferencialmente um SUPERVISOR como autor; fallback para o primeiro usuario.
SET @created_by := COALESCE(
  (SELECT id FROM users WHERE role = 'SUPERVISOR' ORDER BY id LIMIT 1),
  (SELECT id FROM users ORDER BY id LIMIT 1)
);

-- 1) Cadastrar perguntas (somente as que ainda nao existem para o curso)
INSERT INTO questions (title, description, question_type, options, created_by, course, is_active)
SELECT q.title, q.description, q.question_type, q.options_json, @created_by, @course, TRUE
FROM (
  SELECT 1 AS seq,  'IDENTIFICACAO - Data da avaliacao' AS title, NULL AS description, 'texto_livre' AS question_type, NULL AS options_json
  UNION ALL SELECT 2,  'IDENTIFICACAO - Avaliador', NULL, 'texto_livre', NULL
  UNION ALL SELECT 3,  'IDENTIFICACAO - Nome completo', NULL, 'texto_livre', NULL
  UNION ALL SELECT 4,  'IDENTIFICACAO - Sexo', NULL, 'multipla_escolha', JSON_OBJECT('options', JSON_ARRAY('Masculino', 'Feminino', 'Outro', 'Prefiro nao informar'))
  UNION ALL SELECT 5,  'IDENTIFICACAO - Data de nascimento', NULL, 'texto_livre', NULL
  UNION ALL SELECT 6,  'IDENTIFICACAO - Idade', NULL, 'texto_livre', NULL
  UNION ALL SELECT 7,  'IDENTIFICACAO - Endereco', NULL, 'texto_livre', NULL
  UNION ALL SELECT 8,  'IDENTIFICACAO - Documento', NULL, 'texto_livre', NULL
  UNION ALL SELECT 9,  'IDENTIFICACAO - Telefone principal (wpp)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 10, 'IDENTIFICACAO - Telefone secundario', NULL, 'texto_livre', NULL

  UNION ALL SELECT 11, 'HISTORIA - Alergia alimentar?', NULL, 'sim_nao', NULL
  UNION ALL SELECT 12, 'HISTORIA - Quais alergias alimentares?', 'Preencher se respondeu SIM na pergunta anterior.', 'texto_livre', NULL
  UNION ALL SELECT 13, 'HISTORIA - Intolerancias?', NULL, 'sim_nao', NULL
  UNION ALL SELECT 14, 'HISTORIA - Quais intolerancias?', 'Preencher se respondeu SIM na pergunta anterior.', 'texto_livre', NULL
  UNION ALL SELECT 15, 'HISTORIA - Funcionamento intestinal', 'Ex.: 2 vezes/dia, 3 vezes/semana, etc.', 'texto_livre', NULL
  UNION ALL SELECT 16, 'HISTORIA - Escala de Bristol', NULL, 'multipla_escolha', JSON_OBJECT('options', JSON_ARRAY('1', '2', '3', '4', '5', '6', '7'))
  UNION ALL SELECT 17, 'HISTORIA - Alimentos que causam desconforto', NULL, 'texto_livre', NULL
  UNION ALL SELECT 18, 'HISTORIA - Pratica exercicios?', NULL, 'sim_nao', NULL
  UNION ALL SELECT 19, 'HISTORIA - Frequencia de exercicios', 'Ex.: 3x/semana', 'texto_livre', NULL
  UNION ALL SELECT 20, 'HISTORIA - Ingestao de liquidos', NULL, 'multipla_escolha', JSON_OBJECT('options', JSON_ARRAY('Muito', 'Moderado', 'Pouco'))
  UNION ALL SELECT 21, 'HISTORIA - Quantidade diaria de liquidos', 'Ex.: 1,5L/dia', 'texto_livre', NULL
  UNION ALL SELECT 22, 'HISTORIA - Gasto mensal de oleo', NULL, 'texto_livre', NULL
  UNION ALL SELECT 23, 'HISTORIA - Gasto mensal de acucar', NULL, 'texto_livre', NULL
  UNION ALL SELECT 24, 'HISTORIA - Gasto mensal de sal', NULL, 'texto_livre', NULL
  UNION ALL SELECT 25, 'HISTORIA - Uso de temperos prontos?', 'Ex.: Knorr, Sazon, temperos completos.', 'sim_nao', NULL
  UNION ALL SELECT 26, 'HISTORIA - Quais temperos prontos usa?', 'Preencher se respondeu SIM na pergunta anterior.', 'texto_livre', NULL

  UNION ALL SELECT 27, 'ANTROPOMETRIA - Peso (kg)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 28, 'ANTROPOMETRIA - Estatura (cm)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 29, 'ANTROPOMETRIA - Circunferencia abdominal (cm)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 30, 'ANTROPOMETRIA - Circunferencia do braco (cm)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 31, 'ANTROPOMETRIA - Circunferencia da panturrilha (cm)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 32, 'ANTROPOMETRIA - IMC (kg/m2)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 33, 'ANTROPOMETRIA - Diagnostico nutricional', NULL, 'texto_livre', NULL

  UNION ALL SELECT 34, 'RECORDATORIO 24H - Desjejum (horario)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 35, 'RECORDATORIO 24H - Desjejum (local)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 36, 'RECORDATORIO 24H - Desjejum (alimentos/medidas caseiras)', NULL, 'texto_livre', NULL

  UNION ALL SELECT 37, 'RECORDATORIO 24H - Colacao (horario)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 38, 'RECORDATORIO 24H - Colacao (local)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 39, 'RECORDATORIO 24H - Colacao (alimentos/medidas caseiras)', NULL, 'texto_livre', NULL

  UNION ALL SELECT 40, 'RECORDATORIO 24H - Almoco (horario)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 41, 'RECORDATORIO 24H - Almoco (local)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 42, 'RECORDATORIO 24H - Almoco (alimentos/medidas caseiras)', NULL, 'texto_livre', NULL

  UNION ALL SELECT 43, 'RECORDATORIO 24H - Lanche da tarde (horario)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 44, 'RECORDATORIO 24H - Lanche da tarde (local)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 45, 'RECORDATORIO 24H - Lanche da tarde (alimentos/medidas caseiras)', NULL, 'texto_livre', NULL

  UNION ALL SELECT 46, 'RECORDATORIO 24H - Jantar (horario)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 47, 'RECORDATORIO 24H - Jantar (local)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 48, 'RECORDATORIO 24H - Jantar (alimentos/medidas caseiras)', NULL, 'texto_livre', NULL

  UNION ALL SELECT 49, 'RECORDATORIO 24H - Ceia (horario)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 50, 'RECORDATORIO 24H - Ceia (local)', NULL, 'texto_livre', NULL
  UNION ALL SELECT 51, 'RECORDATORIO 24H - Ceia (alimentos/medidas caseiras)', NULL, 'texto_livre', NULL

  UNION ALL SELECT 52, 'RECORDATORIO 24H - Observacoes finais', NULL, 'texto_livre', NULL
) AS q
WHERE @created_by IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM questions qq
    WHERE qq.course = (@course COLLATE utf8mb4_unicode_ci)
      AND qq.title = (q.title COLLATE utf8mb4_unicode_ci)
      AND qq.is_active = TRUE
  );

-- 2) Criar prontuario (se ainda nao existir)
INSERT INTO questionnaires (title, description, course, created_by, is_published)
SELECT @questionnaire_title, @questionnaire_description, @course, @created_by, TRUE
WHERE @created_by IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM questionnaires q
    WHERE q.course = (@course COLLATE utf8mb4_unicode_ci)
      AND q.title = (@questionnaire_title COLLATE utf8mb4_unicode_ci)
  );

-- 3) Obter ID do prontuario
SET @questionnaire_id := (
  SELECT id
  FROM questionnaires
  WHERE course = (@course COLLATE utf8mb4_unicode_ci)
    AND title = (@questionnaire_title COLLATE utf8mb4_unicode_ci)
  ORDER BY id DESC
  LIMIT 1
);

-- 4) Vincular perguntas ao prontuario na ordem correta (sem duplicar)
INSERT IGNORE INTO questionnaire_questions (questionnaire_id, question_id, question_order)
SELECT
  @questionnaire_id AS questionnaire_id,
  (
    SELECT id
    FROM questions qq
    WHERE qq.course = (@course COLLATE utf8mb4_unicode_ci)
      AND qq.title = (d.title COLLATE utf8mb4_unicode_ci)
      AND qq.is_active = TRUE
    ORDER BY qq.id DESC
    LIMIT 1
  ) AS question_id,
  d.seq AS question_order
FROM (
  SELECT 1 AS seq,  'IDENTIFICACAO - Data da avaliacao' AS title
  UNION ALL SELECT 2,  'IDENTIFICACAO - Avaliador'
  UNION ALL SELECT 3,  'IDENTIFICACAO - Nome completo'
  UNION ALL SELECT 4,  'IDENTIFICACAO - Sexo'
  UNION ALL SELECT 5,  'IDENTIFICACAO - Data de nascimento'
  UNION ALL SELECT 6,  'IDENTIFICACAO - Idade'
  UNION ALL SELECT 7,  'IDENTIFICACAO - Endereco'
  UNION ALL SELECT 8,  'IDENTIFICACAO - Documento'
  UNION ALL SELECT 9,  'IDENTIFICACAO - Telefone principal (wpp)'
  UNION ALL SELECT 10, 'IDENTIFICACAO - Telefone secundario'
  UNION ALL SELECT 11, 'HISTORIA - Alergia alimentar?'
  UNION ALL SELECT 12, 'HISTORIA - Quais alergias alimentares?'
  UNION ALL SELECT 13, 'HISTORIA - Intolerancias?'
  UNION ALL SELECT 14, 'HISTORIA - Quais intolerancias?'
  UNION ALL SELECT 15, 'HISTORIA - Funcionamento intestinal'
  UNION ALL SELECT 16, 'HISTORIA - Escala de Bristol'
  UNION ALL SELECT 17, 'HISTORIA - Alimentos que causam desconforto'
  UNION ALL SELECT 18, 'HISTORIA - Pratica exercicios?'
  UNION ALL SELECT 19, 'HISTORIA - Frequencia de exercicios'
  UNION ALL SELECT 20, 'HISTORIA - Ingestao de liquidos'
  UNION ALL SELECT 21, 'HISTORIA - Quantidade diaria de liquidos'
  UNION ALL SELECT 22, 'HISTORIA - Gasto mensal de oleo'
  UNION ALL SELECT 23, 'HISTORIA - Gasto mensal de acucar'
  UNION ALL SELECT 24, 'HISTORIA - Gasto mensal de sal'
  UNION ALL SELECT 25, 'HISTORIA - Uso de temperos prontos?'
  UNION ALL SELECT 26, 'HISTORIA - Quais temperos prontos usa?'
  UNION ALL SELECT 27, 'ANTROPOMETRIA - Peso (kg)'
  UNION ALL SELECT 28, 'ANTROPOMETRIA - Estatura (cm)'
  UNION ALL SELECT 29, 'ANTROPOMETRIA - Circunferencia abdominal (cm)'
  UNION ALL SELECT 30, 'ANTROPOMETRIA - Circunferencia do braco (cm)'
  UNION ALL SELECT 31, 'ANTROPOMETRIA - Circunferencia da panturrilha (cm)'
  UNION ALL SELECT 32, 'ANTROPOMETRIA - IMC (kg/m2)'
  UNION ALL SELECT 33, 'ANTROPOMETRIA - Diagnostico nutricional'
  UNION ALL SELECT 34, 'RECORDATORIO 24H - Desjejum (horario)'
  UNION ALL SELECT 35, 'RECORDATORIO 24H - Desjejum (local)'
  UNION ALL SELECT 36, 'RECORDATORIO 24H - Desjejum (alimentos/medidas caseiras)'
  UNION ALL SELECT 37, 'RECORDATORIO 24H - Colacao (horario)'
  UNION ALL SELECT 38, 'RECORDATORIO 24H - Colacao (local)'
  UNION ALL SELECT 39, 'RECORDATORIO 24H - Colacao (alimentos/medidas caseiras)'
  UNION ALL SELECT 40, 'RECORDATORIO 24H - Almoco (horario)'
  UNION ALL SELECT 41, 'RECORDATORIO 24H - Almoco (local)'
  UNION ALL SELECT 42, 'RECORDATORIO 24H - Almoco (alimentos/medidas caseiras)'
  UNION ALL SELECT 43, 'RECORDATORIO 24H - Lanche da tarde (horario)'
  UNION ALL SELECT 44, 'RECORDATORIO 24H - Lanche da tarde (local)'
  UNION ALL SELECT 45, 'RECORDATORIO 24H - Lanche da tarde (alimentos/medidas caseiras)'
  UNION ALL SELECT 46, 'RECORDATORIO 24H - Jantar (horario)'
  UNION ALL SELECT 47, 'RECORDATORIO 24H - Jantar (local)'
  UNION ALL SELECT 48, 'RECORDATORIO 24H - Jantar (alimentos/medidas caseiras)'
  UNION ALL SELECT 49, 'RECORDATORIO 24H - Ceia (horario)'
  UNION ALL SELECT 50, 'RECORDATORIO 24H - Ceia (local)'
  UNION ALL SELECT 51, 'RECORDATORIO 24H - Ceia (alimentos/medidas caseiras)'
  UNION ALL SELECT 52, 'RECORDATORIO 24H - Observacoes finais'
) AS d
WHERE @questionnaire_id IS NOT NULL;

-- 5) Garantir publicacao
UPDATE questionnaires
SET is_published = TRUE
WHERE id = @questionnaire_id;

-- Resumo
SELECT
  @questionnaire_id AS questionnaire_id,
  @course AS course,
  (SELECT COUNT(*) FROM questionnaire_questions WHERE questionnaire_id = @questionnaire_id) AS linked_questions,
  (SELECT is_published FROM questionnaires WHERE id = @questionnaire_id) AS is_published;
