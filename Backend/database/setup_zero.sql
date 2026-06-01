-- =====================================================================
-- CAIGE SISTEMA — SETUP ZERADO (PT-BR)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS caige
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE caige;

CREATE TABLE IF NOT EXISTS usuarios (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  email        VARCHAR(255) NOT NULL UNIQUE,
  senha_hash   VARCHAR(255) NOT NULL,
  nome         VARCHAR(255) NULL,
  papel        ENUM('SUPERVISOR','PROFESSOR') NOT NULL DEFAULT 'PROFESSOR',
  setor        VARCHAR(255) NULL,
  criado_por   INT NULL,
  ativo        BOOLEAN NOT NULL DEFAULT TRUE,
  oculto       BOOLEAN NOT NULL DEFAULT FALSE,
  ultimo_login TIMESTAMP NULL,
  criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_criado_por
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissoes (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  papel                       VARCHAR(50) NOT NULL UNIQUE,
  pode_registrar_frequencia   BOOLEAN DEFAULT FALSE,
  pode_criar_paciente         BOOLEAN DEFAULT FALSE,
  pode_editar_paciente        BOOLEAN DEFAULT FALSE,
  pode_visualizar_paciente    BOOLEAN DEFAULT FALSE,
  pode_visualizar_relatorios  BOOLEAN DEFAULT FALSE,
  pode_criar_usuario          BOOLEAN DEFAULT FALSE,
  pode_editar_usuario         BOOLEAN DEFAULT FALSE,
  pode_visualizar_questionarios BOOLEAN DEFAULT FALSE,
  pode_gerenciar_atividades   BOOLEAN DEFAULT FALSE,
  pode_acessar_painel         BOOLEAN DEFAULT FALSE,
  pode_gerenciar_usuarios     BOOLEAN DEFAULT FALSE,
  criado_em                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profissionais (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cursos (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL UNIQUE,
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pacientes (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  nome                    VARCHAR(255) NOT NULL,
  data_nascimento         DATE NULL,
  genero                  VARCHAR(50) NULL,
  cpf                     VARCHAR(20) NULL,
  telefone                VARCHAR(20) NULL,
  celular                 VARCHAR(20) NULL,
  cep                     VARCHAR(20) NULL,
  rua                     VARCHAR(255) NULL,
  numero                  VARCHAR(50) NULL,
  bairro                  VARCHAR(255) NULL,
  cidade                  VARCHAR(255) NULL,
  estado                  VARCHAR(50) NULL,
  responsavel             VARCHAR(255) NULL,
  parentesco_responsavel  VARCHAR(50) NULL,
  telefone_responsavel    VARCHAR(20) NULL,
  observacoes             LONGTEXT NULL,
  status                  VARCHAR(50) NULL,
  criado_em               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS atividades (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  tipo       VARCHAR(100) NOT NULL,
  descricao  VARCHAR(255) NOT NULL,
  responsavel VARCHAR(255) NOT NULL,
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS frequencia (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente     INT NOT NULL,
  id_profissional INT NULL,
  hora_entrada    DATETIME NOT NULL,
  data_frequencia DATE NOT NULL,
  observacoes     VARCHAR(255) NULL,
  criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_frequencia_paciente
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_frequencia_profissional
    FOREIGN KEY (id_profissional) REFERENCES profissionais(id)
    ON DELETE SET NULL,
  UNIQUE KEY uniq_frequencia_paciente_data (id_paciente, data_frequencia),
  INDEX idx_frequencia_data (data_frequencia),
  INDEX idx_hora_entrada (hora_entrada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS perguntas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  titulo         VARCHAR(255) NOT NULL,
  descricao      TEXT NULL,
  tipo_pergunta  ENUM('texto_livre','multipla_escolha','sim_nao','escala') NOT NULL DEFAULT 'texto_livre',
  opcoes         JSON NULL,
  criado_por     INT NOT NULL,
  curso          VARCHAR(100) NOT NULL,
  ativo          BOOLEAN DEFAULT TRUE,
  criado_em      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_perguntas_criado_por
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
    ON DELETE RESTRICT,
  INDEX idx_perguntas_curso_ativo (curso, ativo),
  INDEX idx_perguntas_criado_por (criado_por)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS questionarios (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  titulo         VARCHAR(255) NOT NULL,
  descricao      TEXT NULL,
  curso          VARCHAR(100) NOT NULL,
  criado_por     INT NOT NULL,
  publicado      BOOLEAN DEFAULT FALSE,
  criado_em      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_questionarios_criado_por
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
    ON DELETE RESTRICT,
  INDEX idx_questionarios_curso_publicado (curso, publicado),
  INDEX idx_questionarios_criado_por (criado_por)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS questoes_questionarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  id_questionario INT NOT NULL,
  id_pergunta     INT NOT NULL,
  ordem_pergunta  INT NOT NULL DEFAULT 0,
  ativo           BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_questao_questionario (id_questionario, id_pergunta),
  CONSTRAINT fk_questoes_questionarios_questionario
    FOREIGN KEY (id_questionario) REFERENCES questionarios(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_questoes_questionarios_pergunta
    FOREIGN KEY (id_pergunta) REFERENCES perguntas(id)
    ON DELETE CASCADE,
  INDEX idx_questoes_questionarios_ordem (id_questionario, ordem_pergunta),
  INDEX idx_questoes_questionarios_ativo (id_questionario, ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS respostas_questionarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente     INT NOT NULL,
  id_questionario INT NOT NULL,
  dados_resposta  JSON NOT NULL,
  criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_respostas_questionarios_paciente
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_respostas_questionarios_questionario
    FOREIGN KEY (id_questionario) REFERENCES questionarios(id)
    ON DELETE RESTRICT,
  INDEX idx_respostas_paciente_questionario (id_paciente, id_questionario),
  INDEX idx_respostas_criado_em (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS estatisticas_rapidas (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  rotulo VARCHAR(100) NOT NULL,
  valor  VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compatibilidade com versoes que nao suportam CREATE INDEX IF NOT EXISTS.
SET @sql = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'usuarios'
        AND index_name = 'idx_usuarios_email'
    ),
    'SELECT 1',
    'CREATE INDEX idx_usuarios_email ON usuarios(email)'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'pacientes'
        AND index_name = 'idx_pacientes_status'
    ),
    'SELECT 1',
    'CREATE INDEX idx_pacientes_status ON pacientes(status)'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'pacientes'
        AND index_name = 'idx_pacientes_nome'
    ),
    'SELECT 1',
    'CREATE INDEX idx_pacientes_nome ON pacientes(nome)'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'atividades'
        AND index_name = 'idx_atividades_criado_em'
    ),
    'SELECT 1',
    'CREATE INDEX idx_atividades_criado_em ON atividades(criado_em)'
  )
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT IGNORE INTO usuarios
  (email, senha_hash, nome, papel, ativo, oculto)
VALUES
  (
    'suportecaige@univale.br',
    '$2a$10$Ji4DeFj5XiJePFMlwsMCRedwAYHg/uV/z8KOL72ZmCNKkslkQ/yXS',
    'Suporte CAIGE',
    'SUPERVISOR',
    TRUE,
    FALSE
  );

INSERT IGNORE INTO permissoes
  (papel,
   pode_registrar_frequencia, pode_criar_paciente, pode_editar_paciente, pode_visualizar_paciente,
   pode_visualizar_relatorios, pode_criar_usuario, pode_editar_usuario,
   pode_visualizar_questionarios, pode_gerenciar_atividades, pode_acessar_painel, pode_gerenciar_usuarios)
VALUES
  ('SUPERVISOR', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

