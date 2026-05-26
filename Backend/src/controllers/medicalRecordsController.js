import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { logActivity } from "../models/activityModel.js";
import { getPatientSchema } from "../models/schemaModel.js";
import { parsePositiveInt } from "../models/validationModel.js";
import {
  createRecord,
  deleteRecordById,
  getPatientById,
  getRecordById,
  getRecordsByPatientId,
  isValidCourse
} from "../models/medicalRecordsModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/medical-records");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo nao permitido"));
    }
  }
});

export const uploadMedicalRecordFile = upload.single("file");

function safeDeleteFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export async function getMedicalRecordsByPatient(req, res) {
  try {
    const schema = await getPatientSchema();
    const patientId = parsePositiveInt(req.params.patient_id);

    if (!patientId) {
      return res.status(400).json({ message: "ID de paciente invalido" });
    }

    const patient = await getPatientById(schema, patientId);
    if (!patient) {
      return res.status(404).json({ message: "Paciente nao encontrado" });
    }

    const records = await getRecordsByPatientId(schema, patientId);

    return res.json({
      patient,
      records
    });
  } catch (error) {
    console.error("Erro ao buscar prontuarios:", error);
    return res.status(500).json({ message: "Erro ao buscar prontuarios" });
  }
}

export async function uploadMedicalRecord(req, res) {
  try {
    const schema = await getPatientSchema();
    const patientId = parsePositiveInt(req.params.patient_id);
    const { specialty, notes } = req.body;

    if (!patientId) {
      if (req.file) {
        safeDeleteFile(req.file.path);
      }
      return res.status(400).json({ message: "ID de paciente invalido" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo foi enviado" });
    }

    if (!specialty) {
      safeDeleteFile(req.file.path);
      return res.status(400).json({ message: "Curso e obrigatorio" });
    }

    const validCourse = await isValidCourse(specialty);
    if (!validCourse) {
      safeDeleteFile(req.file.path);
      return res.status(400).json({ message: "Curso invalido para prontuario" });
    }

    const patient = await getPatientById(schema, patientId);
    if (!patient) {
      safeDeleteFile(req.file.path);
      return res.status(404).json({ message: "Paciente nao encontrado" });
    }

    const recordId = await createRecord(schema, {
      patientId,
      specialty,
      notes: notes || null,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      uploadedBy: req.user?.id || null
    });

    await logActivity(
      "Prontuario",
      `Prontuario de ${specialty} anexado para ${patient.name}`,
      req.user?.email || "Sistema"
    );

    return res.status(201).json({
      message: "Prontuario anexado com sucesso",
      id: recordId,
      file: {
        id: recordId,
        name: req.file.originalname,
        size: req.file.size,
        specialty,
        uploadedAt: new Date()
      }
    });
  } catch (error) {
    if (req.file) {
      safeDeleteFile(req.file.path);
    }
    console.error("Erro ao fazer upload:", error);
    return res.status(500).json({ message: "Erro ao fazer upload do prontuario" });
  }
}

export async function removeMedicalRecord(req, res) {
  try {
    const recordId = parsePositiveInt(req.params.record_id);
    if (!recordId) {
      return res.status(400).json({ message: "ID de prontuario invalido" });
    }
    const record = await getRecordById(recordId);

    if (!record) {
      return res.status(404).json({ message: "Prontuario nao encontrado" });
    }

    safeDeleteFile(record.file_path);
    await deleteRecordById(recordId);

    await logActivity(
      "Prontuario",
      `Prontuario de ${record.specialty} removido`,
      req.user?.email || "Sistema"
    );

    return res.json({ message: "Prontuario removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar prontuario:", error);
    return res.status(500).json({ message: "Erro ao deletar prontuario" });
  }
}

export async function downloadMedicalRecord(req, res) {
  try {
    const recordId = parsePositiveInt(req.params.record_id);
    if (!recordId) {
      return res.status(400).json({ message: "ID de prontuario invalido" });
    }
    const record = await getRecordById(recordId);

    if (!record) {
      return res.status(404).json({ message: "Prontuario nao encontrado" });
    }

    if (!fs.existsSync(record.file_path)) {
      return res.status(404).json({ message: "Arquivo nao encontrado" });
    }

    return res.download(record.file_path, record.file_name);
  } catch (error) {
    console.error("Erro ao fazer download:", error);
    return res.status(500).json({ message: "Erro ao fazer download" });
  }
}
