import express from 'express';
import questionnaireController from '../controllers/questionnaireController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// ==================== PERGUNTAS ====================

// Listar perguntas de um curso
router.get('/questions/course/:course', requireAuth, requirePermission('can_view_medical_records'), questionnaireController.getQuestionsByCourse);

// Criar pergunta (apenas professores/admins)
router.post('/questions', 
  requireAuth,
  requirePermission('can_manage_activities'),
  questionnaireController.createQuestion
);

// Editar pergunta
router.put('/questions/:id',
  requireAuth,
  requirePermission('can_manage_activities'),
  questionnaireController.updateQuestion
);

// Deletar pergunta
router.delete('/questions/:id',
  requireAuth,
  requirePermission('can_manage_activities'),
  questionnaireController.deleteQuestion
);

// ==================== PRONTUÁRIOS ====================

// Listar prontuários de um curso
router.get('/questionnaires/course/:course', requireAuth, requirePermission('can_view_medical_records'), questionnaireController.getQuestionnairesByCourse);

// Criar prontuário
router.post('/questionnaires',
  requireAuth,
  requirePermission('can_manage_activities'),
  questionnaireController.createQuestionnaire
);

// Atualizar prontuário
router.put('/questionnaires/:id',
  requireAuth,
  requirePermission('can_manage_activities'),
  questionnaireController.updateQuestionnaire
);

// Publicar prontuário
router.patch('/questionnaires/:id/publish',
  requireAuth,
  requirePermission('can_manage_activities'),
  questionnaireController.publishQuestionnaire
);

// Deletar prontuário
router.delete('/questionnaires/:id',
  requireAuth,
  requirePermission('can_manage_activities'),
  questionnaireController.deleteQuestionnaire
);

// Obter perguntas de um prontuário
router.get('/questionnaires/:id/questions', requireAuth, requirePermission('can_view_medical_records'), questionnaireController.getQuestionnaireQuestions);

// ==================== RESPOSTAS ====================

// Salvar respostas de um prontuário
router.post('/responses',
  requireAuth,
  requirePermission('can_view_medical_records'),
  questionnaireController.saveQuestionnaireResponse
);

// Obter histórico de respostas de um paciente para um prontuário específico
router.get('/responses/:patientId/:questionnaireId',
  requireAuth,
  requirePermission('can_view_medical_records'),
  questionnaireController.getQuestionnaireResponses
);

export default router;
