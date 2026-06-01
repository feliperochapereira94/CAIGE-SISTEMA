import express from 'express';
import questionariosController from '../controllers/questionariosController.js';
import { requireAuth, requirePermission } from '../controllers/acessoController.js';

const router = express.Router();

// ==================== PERGUNTAS ====================

// Listar perguntas de um curso
router.get('/perguntas/curso/:curso', requireAuth, requirePermission('pode_visualizar_questionarios'), questionariosController.getQuestionsByCourse);

// Criar pergunta (apenas professores/admins)
router.post('/perguntas',
  requireAuth,
  requirePermission('pode_gerenciar_atividades'),
  questionariosController.createQuestion
);

// Editar pergunta
router.put('/perguntas/:id',
  requireAuth,
  requirePermission('pode_gerenciar_atividades'),
  questionariosController.updateQuestion
);

// Deletar pergunta
router.delete('/perguntas/:id',
  requireAuth,
  requirePermission('pode_gerenciar_atividades'),
  questionariosController.deleteQuestion
);

// ==================== QUESTIONARIOS ====================

// Listar questionarios de um curso
router.get('/questionarios/curso/:curso', requireAuth, requirePermission('pode_visualizar_questionarios'), questionariosController.getQuestionnairesByCourse);

// Criar questionario
router.post('/questionarios',
  requireAuth,
  requirePermission('pode_gerenciar_atividades'),
  questionariosController.createQuestionnaire
);

// Atualizar questionario
router.put('/questionarios/:id',
  requireAuth,
  requirePermission('pode_gerenciar_atividades'),
  questionariosController.updateQuestionnaire
);

// Publicar questionario
router.patch('/questionarios/:id/publicar',
  requireAuth,
  requirePermission('pode_gerenciar_atividades'),
  questionariosController.publishQuestionnaire
);

// Deletar questionario
router.delete('/questionarios/:id',
  requireAuth,
  requirePermission('pode_gerenciar_atividades'),
  questionariosController.deleteQuestionnaire
);

// Obter perguntas de um questionario
router.get('/questionarios/:id/perguntas', requireAuth, requirePermission('pode_visualizar_questionarios'), questionariosController.getQuestionnaireQuestions);

// ==================== RESPOSTAS ====================

// Salvar respostas de um questionario
router.post('/respostas',
  requireAuth,
  requirePermission('pode_visualizar_questionarios'),
  questionariosController.saveQuestionnaireResponse
);

// Obter historico de respostas de um paciente para um questionario especifico
router.get('/respostas/:idPaciente/:idQuestionario',
  requireAuth,
  requirePermission('pode_visualizar_questionarios'),
  questionariosController.getQuestionnaireResponses
);

export default router;

