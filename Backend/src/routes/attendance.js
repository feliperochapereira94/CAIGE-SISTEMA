import express from 'express';
import { attendanceController } from '../controllers/attendanceController.js';
import { requireAuth, requirePermission } from '../controllers/accessController.js';

const router = express.Router();

// Listar histórico - qualquer autenticado
router.get('/history', requireAuth, attendanceController.getHistory);

// Relatório de frequência - requer permissão can_view_reports
router.get('/report', requireAuth, requirePermission('can_view_reports'), attendanceController.getFrequencyReport);

// Status do dia - qualquer autenticado
router.get('/today', requireAuth, attendanceController.getTodayStatus);

export default router;
