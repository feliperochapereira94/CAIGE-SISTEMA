import pool from '../models/database.js';
import { logActivity } from '../utils/activityLogger.js';
import { getPatientSchema } from '../utils/schemaNames.js';

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

// Listar perguntas de um curso
export const getQuestionsByCourse = async (req, res) => {
  try {
    const { course } = req.params;
    const userEmail = req.headers['x-user-email'];

    const [questions] = await pool.query(
      'SELECT id, title, description, question_type, options, created_by FROM questions WHERE course = ? AND is_active = TRUE ORDER BY created_at DESC',
      [course]
    );

    res.json(questions);
  } catch (error) {
    console.error('Erro ao listar perguntas:', error);
    res.status(500).json({ error: 'Erro ao listar perguntas' });
  }
};

// Criar pergunta
export const createQuestion = async (req, res) => {
  try {
    const { title, description, question_type, options, course } = req.body;
    const userEmail = req.headers['x-user-email'];

    // Validar tipo de pergunta
    if (!['texto_livre', 'multipla_escolha', 'sim_nao', 'escala'].includes(question_type)) {
      return res.status(400).json({ error: 'Tipo de pergunta inválido' });
    }

    // Validar se opções são necessárias para múltipla escolha
    if (question_type === 'multipla_escolha' && (!options || !Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ error: 'Múltipla escolha requer pelo menos 2 opções' });
    }

    // Obter ID/role/setor do usuário
    const [user] = await pool.query('SELECT id, role, sector FROM users WHERE email = ?', [userEmail]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!canManageCourse(user[0].role, user[0].sector, course)) {
      return res.status(403).json({ error: 'Você só pode criar perguntas no seu próprio curso' });
    }

    // Criar pergunta
    const optionsJson = question_type === 'multipla_escolha' ? JSON.stringify({ options }) : null;
    
    const [result] = await pool.query(
      'INSERT INTO questions (title, description, question_type, options, created_by, course) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, question_type, optionsJson, user[0].id, course]
    );

    await logActivity(
      user[0].id,
      'criar_pergunta',
      `Pergunta criada: ${title}`,
      'questions'
    );

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      question_type,
      options: question_type === 'multipla_escolha' ? options : null,
      course
    });
  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    res.status(500).json({ error: 'Erro ao criar pergunta' });
  }
};

// Editar pergunta
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, options } = req.body;
    const userEmail = req.headers['x-user-email'];

    const [user] = await pool.query('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se pergunta existe e pertence ao usuário
    const [question] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
    if (question.length === 0) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    if (question[0].created_by !== user[0].id) {
      return res.status(403).json({ error: 'Sem permissão para editar esta pergunta' });
    }

    let updateOptions = null;
    if (question[0].question_type === 'multipla_escolha' && options) {
      updateOptions = JSON.stringify({ options });
    }

    await pool.query(
      'UPDATE questions SET title = ?, description = ?, options = ? WHERE id = ?',
      [title, description, updateOptions, id]
    );

    await logActivity(
      user[0].id,
      'editar_pergunta',
      `Pergunta atualizada: ${title}`,
      'questions'
    );

    res.json({ message: 'Pergunta atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar pergunta:', error);
    res.status(500).json({ error: 'Erro ao atualizar pergunta' });
  }
};

// Deletar pergunta
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers['x-user-email'];

    const [user] = await pool.query('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const [question] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
    if (question.length === 0) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    if (question[0].created_by !== user[0].id) {
      return res.status(403).json({ error: 'Sem permissão para deletar esta pergunta' });
    }

    // Soft delete
    await pool.query('UPDATE questions SET is_active = FALSE WHERE id = ?', [id]);

    await logActivity(
      user[0].id,
      'deletar_pergunta',
      `Pergunta deletada: ${question[0].title}`,
      'questions'
    );

    res.json({ message: 'Pergunta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pergunta:', error);
    res.status(500).json({ error: 'Erro ao deletar pergunta' });
  }
};

// ==================== PRONTUÁRIOS (QUESTIONNAIRES) ====================

// Listar prontuários de um curso
export const getQuestionnairesByCourse = async (req, res) => {
  try {
    const { course } = req.params;
    const userEmail = req.headers['x-user-email'];

    const [questionnaires] = await pool.query(
      `SELECT q.id, q.title, q.description, q.course, q.created_by, q.is_published, COUNT(qq.id) as question_count
       FROM questionnaires q
       LEFT JOIN questionnaire_questions qq ON q.id = qq.questionnaire_id AND qq.is_active = TRUE
       WHERE q.course = ?
       GROUP BY q.id
       ORDER BY q.is_published DESC, q.created_at DESC`,
      [course]
    );

    res.json(questionnaires);
  } catch (error) {
    console.error('Erro ao listar prontuários:', error);
    res.status(500).json({ error: 'Erro ao listar prontuários' });
  }
};

// Criar prontuário
export const createQuestionnaire = async (req, res) => {
  try {
    const { title, description, course, questions: questionIds } = req.body;
    const userEmail = req.headers['x-user-email'];

    const [user] = await pool.query('SELECT id, role, sector FROM users WHERE email = ?', [userEmail]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!canManageCourse(user[0].role, user[0].sector, course)) {
      return res.status(403).json({ error: 'Você só pode criar prontuários no seu próprio curso' });
    }

    // Criar prontuário
    const [result] = await pool.query(
      'INSERT INTO questionnaires (title, description, course, created_by) VALUES (?, ?, ?, ?)',
      [title, description, course, user[0].id]
    );

    const questionnaireId = result.insertId;

    // Adicionar perguntas ao prontuário
    if (questionIds && Array.isArray(questionIds)) {
      for (let i = 0; i < questionIds.length; i++) {
        await pool.query(
          'INSERT INTO questionnaire_questions (questionnaire_id, question_id, question_order, is_active) VALUES (?, ?, ?, TRUE)',
          [questionnaireId, questionIds[i], i + 1]
        );
      }
    }

    await logActivity(
      user[0].id,
      'criar_prontuario',
      `Prontuário criado: ${title}`,
      'questionnaires'
    );

    res.status(201).json({
      id: questionnaireId,
      title,
      description,
      course,
      question_count: questionIds ? questionIds.length : 0
    });
  } catch (error) {
    console.error('Erro ao criar prontuário:', error);
    res.status(500).json({ error: 'Erro ao criar prontuário' });
  }
};

// Atualizar prontuário (adicionar/remover perguntas ou reordenar)
export const updateQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions: questionIds } = req.body;
    const userEmail = req.headers['x-user-email'];

    const [user] = await pool.query('SELECT id, role, sector FROM users WHERE email = ?', [userEmail]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const [questionnaire] = await pool.query('SELECT * FROM questionnaires WHERE id = ?', [id]);
    if (questionnaire.length === 0) {
      return res.status(404).json({ error: 'Prontuário não encontrado' });
    }

    const canEdit = questionnaire[0].created_by === user[0].id
      || canManageCourse(user[0].role, user[0].sector, questionnaire[0].course);

    if (!canEdit) {
      return res.status(403).json({ error: 'Sem permissão para editar este prontuário' });
    }

    // Atualizar informações
    await pool.query(
      'UPDATE questionnaires SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );

    // Atualizar perguntas sem usar DELETE FROM (bloqueado pela politica do projeto).
    // Estrategia:
    // 1) Desativar perguntas removidas
    // 2) Upsert das perguntas enviadas, reativando e reordenando
    if (questionIds && Array.isArray(questionIds)) {
      if (questionIds.length > 0) {
        const placeholders = questionIds.map(() => '?').join(',');
        await pool.query(
          `UPDATE questionnaire_questions
           SET is_active = FALSE
           WHERE questionnaire_id = ?
             AND question_id NOT IN (${placeholders})`,
          [id, ...questionIds]
        );
      } else {
        await pool.query(
          `UPDATE questionnaire_questions
           SET is_active = FALSE
           WHERE questionnaire_id = ?`,
          [id]
        );
      }

      for (let i = 0; i < questionIds.length; i++) {
        await pool.query(
          `INSERT INTO questionnaire_questions (questionnaire_id, question_id, question_order)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE question_order = VALUES(question_order), is_active = TRUE`,
          [id, questionIds[i], i + 1]
        );
      }
    }

    await logActivity(
      user[0].id,
      'editar_prontuario',
      `Prontuário atualizado: ${title}`,
      'questionnaires'
    );

    res.json({ message: 'Prontuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar prontuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar prontuário' });
  }
};

// Publicar prontuário
export const publishQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers['x-user-email'];

    const [user] = await pool.query('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const [questionnaire] = await pool.query('SELECT * FROM questionnaires WHERE id = ?', [id]);
    if (questionnaire.length === 0) {
      return res.status(404).json({ error: 'Prontuário não encontrado' });
    }

    if (questionnaire[0].created_by !== user[0].id) {
      return res.status(403).json({ error: 'Sem permissão para publicar este prontuário' });
    }

    // Verificar se tem perguntas
    const [questions] = await pool.query(
      'SELECT COUNT(*) as count FROM questionnaire_questions WHERE questionnaire_id = ? AND is_active = TRUE',
      [id]
    );
    if (questions[0].count === 0) {
      return res.status(400).json({ error: 'Prontuário deve ter pelo menos 1 pergunta' });
    }

    await pool.query('UPDATE questionnaires SET is_published = TRUE WHERE id = ?', [id]);

    await logActivity(
      user[0].id,
      'publicar_prontuario',
      `Prontuário publicado: ${questionnaire[0].title}`,
      'questionnaires'
    );

    res.json({ message: 'Prontuário publicado com sucesso' });
  } catch (error) {
    console.error('Erro ao publicar prontuário:', error);
    res.status(500).json({ error: 'Erro ao publicar prontuário' });
  }
};

// Deletar prontuário
export const deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.headers['x-user-email'];

    const [user] = await pool.query('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const [questionnaire] = await pool.query('SELECT * FROM questionnaires WHERE id = ?', [id]);
    if (questionnaire.length === 0) {
      return res.status(404).json({ error: 'Prontuário não encontrado' });
    }

    if (questionnaire[0].created_by !== user[0].id) {
      return res.status(403).json({ error: 'Sem permissão para deletar este prontuário' });
    }

    const [responsesCount] = await pool.query(
      'SELECT COUNT(*) as total FROM questionnaire_responses WHERE questionnaire_id = ?',
      [id]
    );

    if ((responsesCount[0]?.total || 0) > 0) {
      return res.status(400).json({
        error: 'Este prontuário já possui respostas salvas e não pode ser excluído'
      });
    }

    // Deletar cascata (questionnaire_questions será deletado automaticamente)
    await pool.query('DELETE FROM questionnaires WHERE id = ?', [id]);

    await logActivity(
      user[0].id,
      'deletar_prontuario',
      `Prontuário deletado: ${questionnaire[0].title}`,
      'questionnaires'
    );

    res.json({ message: 'Prontuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar prontuário:', error);
    res.status(500).json({ error: 'Erro ao deletar prontuário' });
  }
};

// ==================== RESPOSTAS DE PRONTUÁRIOS ====================

// Obter perguntas de um prontuário
export const getQuestionnaireQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    const [questions] = await pool.query(
      `SELECT q.id, q.title, q.description, q.question_type, q.options, qq.question_order
       FROM questions q
       JOIN questionnaire_questions qq ON q.id = qq.question_id
       WHERE qq.questionnaire_id = ?
         AND qq.is_active = TRUE
       ORDER BY qq.question_order ASC`,
      [id]
    );

    res.json(questions);
  } catch (error) {
    console.error('Erro ao obter perguntas do prontuário:', error);
    res.status(500).json({ error: 'Erro ao obter perguntas' });
  }
};

// Salvar respostas de prontuário
export const saveQuestionnaireResponse = async (req, res) => {
  try {
    const schema = await getPatientSchema();
    const patientId = req.body.patientId;
    const { questionnaireId, responses } = req.body;
    const userEmail = req.headers['x-user-email'];

    // Validar dados
    if (!patientId || !questionnaireId || !responses) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    // Obter perguntas do prontuário para criar snapshot
    const [questions] = await pool.query(
      `SELECT q.id, q.title, q.question_type, q.options
       FROM questions q
       JOIN questionnaire_questions qq ON q.id = qq.question_id
       WHERE qq.questionnaire_id = ?
         AND qq.is_active = TRUE
       ORDER BY qq.question_order ASC`,
      [questionnaireId]
    );

    // Montar snapshot das respostas
    const responseData = {};
    questions.forEach(q => {
      responseData[q.id] = {
        title: q.title,
        question_type: q.question_type,
        options_snapshot: q.options,
        answer: responses[q.id] || null
      };
    });

    // Salvar respostas
    const [result] = await pool.query(
      `INSERT INTO questionnaire_responses (${schema.questionnaireResponsePatientColumn}, questionnaire_id, response_data) VALUES (?, ?, ?)`,
      [patientId, questionnaireId, JSON.stringify(responseData)]
    );

    await logActivity(
      null,
      'responder_prontuario',
      `Prontuário respondido pelo paciente ${patientId}`,
      'questionnaire_responses'
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Prontuário respondido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao salvar respostas:', error);
    res.status(500).json({ error: 'Erro ao salvar respostas' });
  }
};

// Obter histórico de respostas de um paciente
export const getQuestionnaireResponses = async (req, res) => {
  try {
    const schema = await getPatientSchema();
    const patientId = req.params.patientId;
    const { questionnaireId } = req.params;
    const userEmail = req.headers['x-user-email'];

    const [responses] = await pool.query(
      `SELECT qr.id, qr.response_data, qr.created_at, q.title
       FROM questionnaire_responses qr
       JOIN questionnaires q ON qr.questionnaire_id = q.id
       WHERE qr.${schema.questionnaireResponsePatientColumn} = ? AND qr.questionnaire_id = ?
       ORDER BY qr.created_at DESC`,
      [patientId, questionnaireId]
    );

    res.json(responses);
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
