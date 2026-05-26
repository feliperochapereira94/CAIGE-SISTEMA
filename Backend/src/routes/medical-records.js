import express from 'express';
import { requireAuth, requirePermission } from '../controllers/accessController.js';
import {
  downloadMedicalRecord,
  getMedicalRecordsByPatient,
  removeMedicalRecord,
  uploadMedicalRecord,
  uploadMedicalRecordFile
} from '../controllers/medicalRecordsController.js';

const router = express.Router();

// Obter prontuários de um paciente
router.get('/:patient_id', requireAuth, requirePermission('can_view_medical_records'), getMedicalRecordsByPatient);

// Fazer upload de prontuário
router.post('/:patient_id/upload', 
  requireAuth, 
  requirePermission('can_view_medical_records'), 
  uploadMedicalRecordFile,
  uploadMedicalRecord
);

// Deletar prontuário
router.delete('/:record_id', requireAuth, requirePermission('can_view_medical_records'), removeMedicalRecord);

// Download de prontuário
router.get('/:record_id/download', requireAuth, requirePermission('can_view_medical_records'), downloadMedicalRecord);

export default router;
