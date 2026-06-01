import pool from '../models/database.js';
import { logActivity } from '../models/registroAtividadeModel.js';
import { getPatientSchema } from '../models/esquemaModel.js';
import { normalizeIdArray, parsePositiveInt } from '../models/validacaoModel.js';

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function canManageCourse(userRole, userSector, course) {
  if (userRole === 'SUPERVISOR') {
    return true;
  }
  return normalizeText(userSector) === normalizeText(course);
}

// ==================== PERGUNTAS ====================

export const getQuestionsByCourse = async (req, res) => {
  try {
    const curso = req.params.curso || req.params.course;

    const [perguntas] = await pool.query(
      `SELECT id,
              titulo AS title,
              descricao AS description,
              tipo_pergunta AS question_type,
              opcoes AS options,
              criado_por AS created_by,
              curso,
              criado_em AS created_at
       FROM perguntas
       WHERE curso = ? AND ativo = TRUE
       ORDER BY criado_em DESC`,
      [curso]
    );

    res.json(perguntas);
  } catch (error) {
    console.error('Erro ao listar perguntas:', error);
    res.status(500).json({ error: 'Erro ao listar perguntas' });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const title = req.body.title || req.body.titulo;
    const description = req.body.description || req.body.descricao || null;
    const questionType = req.body.question_type || req.body.tipo_pergunta;
    const options = req.body.options || req.body.opcoes;
    const course = req.body.course || req.body.curso;
    const userEmail = req.headers['x-user-email'];

    if (!title || !questionType || !course) {
      return res.status(400).json({ error: 'Titulo, tipo_pergunta e curso sao obrigatorios' });
    }

    if (!['texto_livre', 'multipla_escolha', 'sim_nao', 'escala'].includes(questionType)) {
      return res.status(400).json({ error: 'Tipo de pergunta invalido' });
    }

    if (questionType === 'multipla_escolha' && (!options || !Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ error: 'Multipla escolha requer pelo menos 2 opcoes' });
    }

    const [usuarios] = await pool.query(
      'SELECT id, papel AS role, setor AS sector FROM usuarios WHERE email = ?',
      [userEmail]
    );

    if (!usuarios.length) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    if (!canManageCourse(usuarios[0].role, usuarios[0].sector, course)) {
      return res.status(403).json({ error: 'Voce so pode criar perguntas no seu proprio curso' });
    }

    const optionsJson = questionType === 'multipla_escolha' ? JSON.stringify({ options }) : null;

    const [result] = await pool.query(
      'INSERT INTO perguntas (titulo, descricao, tipo_pergunta, opcoes, criado_por, curso) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, questionType, optionsJson, usuarios[0].id, course]
    );

    await logActivity('Pergunta', `Pergunta criada: ${title}`, userEmail || 'Sistema');

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      question_type: questionType,
      options: questionType === 'multipla_escolha' ? options : null,
      course
    });
  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    res.status(500).json({ error: 'Erro ao criar pergunta' });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    const title = req.body.title || req.body.titulo;
    const description = req.body.description || req.body.descricao || null;
    const options = req.body.options || req.body.opcoes;
    const userEmail = req.headers['x-user-email'];

    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    const [usuarios] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [userEmail]);
    if (!usuarios.length) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    const [perguntas] = await pool.query(
      'SELECT id, titulo, tipo_pergunta, criado_por FROM perguntas WHERE id = ?',
      [id]
    );

    if (!perguntas.length) {
      return res.status(404).json({ error: 'Pergunta nao encontrada' });
    }

    if (perguntas[0].criado_por !== usuarios[0].id) {
      return res.status(403).json({ error: 'Sem permissao para editar esta pergunta' });
    }

    let updateOptions = null;
    if (perguntas[0].tipo_pergunta === 'multipla_escolha' && options) {
      updateOptions = JSON.stringify({ options });
    }

    await pool.query(
      'UPDATE perguntas SET titulo = ?, descricao = ?, opcoes = ? WHERE id = ?',
      [title, description, updateOptions, id]
    );

    await logActivity('Pergunta', `Pergunta atualizada: ${title || perguntas[0].titulo}`, userEmail || 'Sistema');

    res.json({ message: 'Pergunta atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error);
    res.status(500).json({ error: 'Erro ao atualizar pergunta' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    const userEmail = req.headers['x-user-email'];

    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    const [usuarios] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [userEmail]);
    if (!usuarios.length) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    const [perguntas] = await pool.query(
      'SELECT id, titulo, criado_por FROM perguntas WHERE id = ?',
      [id]
    );

    if (!perguntas.length) {
      return res.status(404).json({ error: 'Pergunta nao encontrada' });
    }

    if (perguntas[0].criado_por !== usuarios[0].id) {
      return res.status(403).json({ error: 'Sem permissao para deletar esta pergunta' });
    }

    await pool.query('UPDATE perguntas SET ativo = FALSE WHERE id = ?', [id]);

    await logActivity('Pergunta', `Pergunta removida: ${perguntas[0].titulo}`, userEmail || 'Sistema');

    res.json({ message: 'Pergunta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pergunta:', error);
    res.status(500).json({ error: 'Erro ao deletar pergunta' });
  }
};

// ==================== QUESTIONARIOS ====================

export const getQuestionnairesByCourse = async (req, res) => {
  try {
    const curso = req.params.curso || req.params.course;

    const [questionarios] = await pool.query(
      `SELECT q.id,
              q.titulo AS title,
              q.descricao AS description,
              q.curso AS course,
              q.criado_por AS created_by,
              q.publicado AS is_published,
              COUNT(qq.id) AS question_count,
              q.criado_em AS created_at
       FROM questionarios q
       LEFT JOIN questoes_questionarios qq
         ON q.id = qq.id_questionario AND qq.ativo = TRUE
       WHERE q.curso = ?
       GROUP BY q.id, q.titulo, q.descricao, q.curso, q.criado_por, q.publicado, q.criado_em
       ORDER BY q.publicado DESC, q.criado_em DESC`,
      [curso]
    );

    res.json(questionarios);
  } catch (error) {
    console.error('Erro ao listar questionarios:', error);
    res.status(500).json({ error: 'Erro ao listar questionarios' });
  }
};

export const createQuestionnaire = async (req, res) => {
  try {
    const title = req.body.title || req.body.titulo;
    const description = req.body.description || req.body.descricao || null;
    const course = req.body.course || req.body.curso;
    const questions = req.body.questions || req.body.perguntas;
    const questionIds = normalizeIdArray(questions);
    const userEmail = req.headers['x-user-email'];

    const [usuarios] = await pool.query(
      'SELECT id, papel AS role, setor AS sector FROM usuarios WHERE email = ?',
      [userEmail]
    );

    if (!usuarios.length) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    if (!canManageCourse(usuarios[0].role, usuarios[0].sector, course)) {
      return res.status(403).json({ error: 'Voce so pode criar questionarios no seu proprio curso' });
    }

    const [result] = await pool.query(
      'INSERT INTO questionarios (titulo, descricao, curso, criado_por) VALUES (?, ?, ?, ?)',
      [title, description, course, usuarios[0].id]
    );

    const questionnaireId = result.insertId;

    for (let i = 0; i < questionIds.length; i++) {
      await pool.query(
        'INSERT INTO questoes_questionarios (id_questionario, id_pergunta, ordem_pergunta, ativo) VALUES (?, ?, ?, TRUE)',
        [questionnaireId, questionIds[i], i + 1]
      );
    }

    await logActivity('Questionário', `Questionário criado: ${title}`, userEmail || 'Sistema');

    res.status(201).json({
      id: questionnaireId,
      title,
      description,
      course,
      question_count: questionIds.length
    });
  } catch (error) {
    console.error('Erro ao criar questionario:', error);
    res.status(500).json({ error: 'Erro ao criar questionario' });
  }
};

export const updateQuestionnaire = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    const title = req.body.title || req.body.titulo;
    const description = req.body.description || req.body.descricao || null;
    const questions = req.body.questions || req.body.perguntas;
    const questionIds = normalizeIdArray(questions);
    const userEmail = req.headers['x-user-email'];

    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    const [usuarios] = await pool.query(
      'SELECT id, papel AS role, setor AS sector FROM usuarios WHERE email = ?',
      [userEmail]
    );

    if (!usuarios.length) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    const [questionarios] = await pool.query(
      'SELECT id, titulo, curso, criado_por FROM questionarios WHERE id = ?',
      [id]
    );

    if (!questionarios.length) {
      return res.status(404).json({ error: 'Questionario nao encontrado' });
    }

    const canEdit = questionarios[0].criado_por === usuarios[0].id
      || canManageCourse(usuarios[0].role, usuarios[0].sector, questionarios[0].curso);

    if (!canEdit) {
      return res.status(403).json({ error: 'Sem permissao para editar este questionario' });
    }

    await pool.query(
      'UPDATE questionarios SET titulo = ?, descricao = ? WHERE id = ?',
      [title, description, id]
    );

    if (Array.isArray(questions)) {
      if (questionIds.length > 0) {
        const placeholders = questionIds.map(() => '?').join(',');
        await pool.query(
          `UPDATE questoes_questionarios
           SET ativo = FALSE
           WHERE id_questionario = ?
             AND id_pergunta NOT IN (${placeholders})`,
          [id, ...questionIds]
        );
      } else {
        await pool.query(
          `UPDATE questoes_questionarios
           SET ativo = FALSE
           WHERE id_questionario = ?`,
          [id]
        );
      }

      for (let i = 0; i < questionIds.length; i++) {
        await pool.query(
          `INSERT INTO questoes_questionarios (id_questionario, id_pergunta, ordem_pergunta)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE ordem_pergunta = VALUES(ordem_pergunta), ativo = TRUE`,
          [id, questionIds[i], i + 1]
        );
      }
    }

    await logActivity('Questionário', `Questionário atualizado: ${title || questionarios[0].titulo}`, userEmail || 'Sistema');

    res.json({ message: 'Questionario atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar questionario:', error);
    res.status(500).json({ error: 'Erro ao atualizar questionario' });
  }
};

export const publishQuestionnaire = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    const userEmail = req.headers['x-user-email'];

    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    const [usuarios] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [userEmail]);
    if (!usuarios.length) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    const [questionarios] = await pool.query(
      'SELECT id, titulo, criado_por FROM questionarios WHERE id = ?',
      [id]
    );

    if (!questionarios.length) {
      return res.status(404).json({ error: 'Questionario nao encontrado' });
    }

    if (questionarios[0].criado_por !== usuarios[0].id) {
      return res.status(403).json({ error: 'Sem permissao para publicar este questionario' });
    }

    const [perguntas] = await pool.query(
      'SELECT COUNT(*) as count FROM questoes_questionarios WHERE id_questionario = ? AND ativo = TRUE',
      [id]
    );

    if (perguntas[0].count === 0) {
      return res.status(400).json({ error: 'Questionario deve ter pelo menos 1 pergunta' });
    }

    await pool.query('UPDATE questionarios SET publicado = TRUE WHERE id = ?', [id]);

    await logActivity('Questionário', `Questionário publicado: ${questionarios[0].titulo}`, userEmail || 'Sistema');

    res.json({ message: 'Questionario publicado com sucesso' });
  } catch (error) {
    console.error('Erro ao publicar questionario:', error);
    res.status(500).json({ error: 'Erro ao publicar questionario' });
  }
};

export const deleteQuestionnaire = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    const userEmail = req.headers['x-user-email'];

    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    const [usuarios] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [userEmail]);
    if (!usuarios.length) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    const [questionarios] = await pool.query(
      'SELECT id, titulo, criado_por FROM questionarios WHERE id = ?',
      [id]
    );

    if (!questionarios.length) {
      return res.status(404).json({ error: 'Questionario nao encontrado' });
    }

    if (questionarios[0].criado_por !== usuarios[0].id) {
      return res.status(403).json({ error: 'Sem permissao para deletar este questionario' });
    }

    const [respostas] = await pool.query(
      'SELECT COUNT(*) as total FROM respostas_questionarios WHERE id_questionario = ?',
      [id]
    );

    if ((respostas[0]?.total || 0) > 0) {
      return res.status(400).json({
        error: 'Este questionario ja possui respostas salvas e nao pode ser excluido'
      });
    }

    await pool.query('DELETE FROM questionarios WHERE id = ?', [id]);

    await logActivity('Questionário', `Questionário removido: ${questionarios[0].titulo}`, userEmail || 'Sistema');

    res.json({ message: 'Questionario deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar questionario:', error);
    res.status(500).json({ error: 'Erro ao deletar questionario' });
  }
};

// ==================== RESPOSTAS ====================

export const getQuestionnaireQuestions = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    const [perguntas] = await pool.query(
      `SELECT p.id,
              p.titulo AS title,
              p.descricao AS description,
              p.tipo_pergunta AS question_type,
              p.opcoes AS options,
              qq.ordem_pergunta AS question_order
       FROM perguntas p
       JOIN questoes_questionarios qq ON p.id = qq.id_pergunta
       WHERE qq.id_questionario = ?
         AND qq.ativo = TRUE
       ORDER BY qq.ordem_pergunta ASC`,
      [id]
    );

    res.json(perguntas);
  } catch (error) {
    console.error('Erro ao obter perguntas do questionario:', error);
    res.status(500).json({ error: 'Erro ao obter perguntas' });
  }
};

export const saveQuestionnaireResponse = async (req, res) => {
  try {
    const schema = await getPatientSchema();
    const patientId = parsePositiveInt(req.body.idPaciente || req.body.patientId);
    const questionnaireId = parsePositiveInt(req.body.idQuestionario || req.body.questionnaireId);
    const responses = req.body.respostas || req.body.responses;
    const userEmail = req.headers['x-user-email'];

    if (!patientId || !questionnaireId || !responses) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }

    const [perguntas] = await pool.query(
      `SELECT p.id, p.titulo, p.tipo_pergunta, p.opcoes
       FROM perguntas p
       JOIN questoes_questionarios qq ON p.id = qq.id_pergunta
       WHERE qq.id_questionario = ?
         AND qq.ativo = TRUE
       ORDER BY qq.ordem_pergunta ASC`,
      [questionnaireId]
    );

    const dadosResposta = {};
    perguntas.forEach((pergunta) => {
      dadosResposta[pergunta.id] = {
        titulo: pergunta.titulo,
        tipo_pergunta: pergunta.tipo_pergunta,
        opcoes_snapshot: pergunta.opcoes,
        resposta: responses[pergunta.id] || null
      };
    });

    const [result] = await pool.query(
      `INSERT INTO respostas_questionarios (${schema.questionnaireResponsePatientColumn}, id_questionario, dados_resposta) VALUES (?, ?, ?)`,
      [patientId, questionnaireId, JSON.stringify(dadosResposta)]
    );

    await logActivity('Questionário', `Questionário respondido pelo paciente ${patientId}`, userEmail || 'Sistema');

    res.status(201).json({
      id: result.insertId,
      message: 'Questionario respondido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao salvar respostas:', error);
    res.status(500).json({ error: 'Erro ao salvar respostas' });
  }
};

export const getQuestionnaireResponses = async (req, res) => {
  try {
    const schema = await getPatientSchema();
    const patientId = parsePositiveInt(req.params.idPaciente || req.params.patientId);
    const questionnaireId = parsePositiveInt(req.params.idQuestionario || req.params.questionnaireId);

    if (!patientId || !questionnaireId) {
      return res.status(400).json({ error: 'IDs invalidos' });
    }

    const [respostas] = await pool.query(
      `SELECT rq.id,
              rq.dados_resposta AS response_data,
              rq.criado_em AS created_at,
              q.titulo AS questionnaire_title,
              q.curso AS course
       FROM respostas_questionarios rq
       JOIN questionarios q ON rq.id_questionario = q.id
       WHERE rq.${schema.questionnaireResponsePatientColumn} = ?
         AND rq.id_questionario = ?
       ORDER BY rq.criado_em DESC`,
      [patientId, questionnaireId]
    );

    res.json(respostas);
  } catch (error) {
    console.error('Erro ao obter respostas:', error);
    res.status(500).json({ error: 'Erro ao obter respostas' });
  }
};

export default {
  getQuestionsByCourse,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionnairesByCourse,
  createQuestionnaire,
  updateQuestionnaire,
  publishQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaireQuestions,
  saveQuestionnaireResponse,
  getQuestionnaireResponses
};
