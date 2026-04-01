import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../models/database.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { logActivity } from '../utils/activityLogger.js';
import { getPatientSchema } from '../utils/schemaNames.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar diretório de uploads
const uploadDir = path.join(__dirname, '../../uploads/medical-records');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer para upload de prontuários
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// Obter prontuários de um paciente
router.get('/:patient_id', requireAuth, requirePermission('can_view_medical_records'), async (req, res) => {
  try {
    const schema = await getPatientSchema();
    const { patient_id } = req.params;

    // Verificar se paciente existe
    const [patients] = await pool.query(`SELECT id, name FROM ${schema.patientTable} WHERE id = ?`, [patient_id]);
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }

    // Buscar prontuários
    const [records] = await pool.query(
      `SELECT 
        id,
        ${schema.medicalRecordPatientColumn} AS patient_id,
        specialty,
        notes,
        file_path,
        file_name,
        file_size,
        created_at,
        uploaded_by
      FROM medical_records
      WHERE ${schema.medicalRecordPatientColumn} = ?
      ORDER BY created_at DESC`,
      [patient_id]
    );

    res.json({
      patient: patients[0],
      records
    });
  } catch (error) {
    console.error('Erro ao buscar prontuários:', error);
    res.status(500).json({ message: 'Erro ao buscar prontuários' });
  }
});

// Fazer upload de prontuário
router.post('/:patient_id/upload', 
  requireAuth, 
  requirePermission('can_view_medical_records'), 
  upload.single('file'), 
  async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const { patient_id } = req.params;
      const { specialty, notes } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
      }

      if (!specialty) {
        // Remover arquivo se nenhum curso foi informado
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Curso é obrigatório' });
      }

      const [validCourses] = await pool.query(
        'SELECT id FROM courses WHERE name = ? AND is_active = TRUE',
        [specialty]
      );
      if (validCourses.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Curso inválido para prontuário' });
      }

      // Verificar se paciente existe
      const [patients] = await pool.query(`SELECT id, name FROM ${schema.patientTable} WHERE id = ?`, [patient_id]);
      if (patients.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      // Inserir registro no banco
      const [result] = await pool.query(
        `INSERT INTO medical_records 
        (${schema.medicalRecordPatientColumn}, specialty, notes, file_path, file_name, file_size, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          patient_id,
          specialty,
          notes || null,
          req.file.path,
          req.file.originalname,
          req.file.size,
          req.user?.id || null
        ]
      );

      // Log de atividade
      await logActivity(
        'Prontuário',
        `Prontuário de ${specialty} anexado para ${patients[0].name}`,
        req.user?.email || 'Sistema'
      );

      res.status(201).json({
        message: 'Prontuário anexado com sucesso',
        id: result.insertId,
        file: {
          id: result.insertId,
          name: req.file.originalname,
          size: req.file.size,
          specialty,
          uploadedAt: new Date()
        }
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Erro ao fazer upload:', error);
      res.status(500).json({ message: 'Erro ao fazer upload do prontuário' });
    }
  }
);

// Deletar prontuário
router.delete('/:record_id', requireAuth, requirePermission('can_view_medical_records'), async (req, res) => {
  try {
    const { record_id } = req.params;

    // Buscar prontuário
    const [records] = await pool.query(
      'SELECT * FROM medical_records WHERE id = ?',
      [record_id]
    );

    if (records.length === 0) {
      return res.status(404).json({ message: 'Prontuário não encontrado' });
    }

    const record = records[0];

    // Deletar arquivo
    if (fs.existsSync(record.file_path)) {
      fs.unlinkSync(record.file_path);
    }

    // Deletar registro do banco
    await pool.query('DELETE FROM medical_records WHERE id = ?', [record_id]);

    // Log de atividade
    await logActivity(
      'Prontuário',
      `Prontuário de ${record.specialty} removido`,
      req.user?.email || 'Sistema'
    );

    res.json({ message: 'Prontuário removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar prontuário:', error);
    res.status(500).json({ message: 'Erro ao deletar prontuário' });
  }
});

// Download de prontuário
router.get('/:record_id/download', requireAuth, requirePermission('can_view_medical_records'), async (req, res) => {
  try {
    const { record_id } = req.params;

    // Buscar prontuário
    const [records] = await pool.query(
      'SELECT * FROM medical_records WHERE id = ?',
      [record_id]
    );

    if (records.length === 0) {
      return res.status(404).json({ message: 'Prontuário não encontrado' });
    }

    const record = records[0];

    // Verificar se arquivo existe
    if (!fs.existsSync(record.file_path)) {
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }

    res.download(record.file_path, record.file_name);
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    res.status(500).json({ message: 'Erro ao fazer download' });
  }
});

export default router;
