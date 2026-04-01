import pool from "../models/database.js";
import { isDataUrlPhoto, savePhotoFromDataUrl, deleteLocalPhoto } from "../utils/photoHandler.js";
import { logActivity } from "../utils/activityLogger.js";
import { getPatientSchema } from "../utils/schemaNames.js";

export async function getAllPatients(req, res) {
  try {
    const { patientTable } = await getPatientSchema();
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const terms = search ? search.split(/\s+/).filter(Boolean) : [];
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isNaN(parsedLimit) ? 50 : Math.min(Math.max(parsedLimit, 1), 100);

    let query = `SELECT id, name, birth_date, phone, phone2, neighborhood, city, status FROM ${patientTable} WHERE (status IS NULL OR status <> 'archived')`;
    const params = [];

    if (terms.length > 0) {
      terms.forEach((term) => {
        query += " AND (name COLLATE utf8mb4_unicode_ci LIKE ? OR CAST(id AS CHAR) LIKE ?)";
        params.push(`%${term}%`, `%${term}%`);
      });
    }

    query += " ORDER BY id DESC LIMIT ?";
    params.push(limit);

    const [patients] = await pool.query(query, params);

    const formattedPatients = patients.map((person) => {
      const birthDate = new Date(person.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return {
        id: person.id,
        name: person.name,
        age: age || 0,
        phone: person.phone || person.phone2 || 'N/A',
        location: `${person.neighborhood || 'N/A'}, ${person.city || 'N/A'}`,
        initials: person.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .substring(0, 2),
        status: person.status || 'ativo'
      };
    });

    return res.status(200).json(formattedPatients);
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return res.status(500).json({ message: "Erro ao buscar pacientes." });
  }
}

export async function getPatient(req, res) {
  try {
    const { patientTable } = await getPatientSchema();
    const { id } = req.params;

    const [patients] = await pool.query(
      `SELECT * FROM ${patientTable} WHERE id = ?`,
      [id]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    return res.status(200).json(patients[0]);
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return res.status(500).json({ message: "Erro ao buscar paciente." });
  }
}

export async function createPatient(req, res) {
  try {
    const { patientTable } = await getPatientSchema();
    const {
      name,
      birth_date,
      gender,
      cpf,
      phone,
      phone2,
      cep,
      street,
      number,
      neighborhood,
      city,
      state,
      responsible,
      responsible_relationship,
      responsible_phone,
      photo,
      observations,
      status
    } = req.body;

    const normalizePhone = (value) => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    };

    const phonePrimary = normalizePhone(phone);
    const phoneSecondary = normalizePhone(phone2);
    const residentialPattern = /^\(\d{2}\)\s\d{4}-\d{4}$/;
    const mobilePattern = /^\(\d{2}\)\s\d{5}-\d{4}$/;

    if (!name || !birth_date || !street || !number || !neighborhood || !city || !state || !responsible || !status) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    if (!phonePrimary && !phoneSecondary) {
      return res.status(400).json({ message: "Informe ao menos Telefone Residencial ou Celular." });
    }

    if (phonePrimary && !residentialPattern.test(phonePrimary)) {
      return res.status(400).json({ message: "Telefone residencial inválido. Use o padrão (00) 0000-0000." });
    }

    if (phoneSecondary && !mobilePattern.test(phoneSecondary)) {
      return res.status(400).json({ message: "Celular inválido. Use o padrão (00) 00000-0000." });
    }

    const normalizedPhoto = typeof photo === "string" ? photo.trim() : null;
    let photoPath = null;

    if (normalizedPhoto) {
      photoPath = isDataUrlPhoto(normalizedPhoto)
        ? savePhotoFromDataUrl(normalizedPhoto)
        : normalizedPhoto;
    }

    const [result] = await pool.query(
      `INSERT INTO ${patientTable} (name, birth_date, gender, cpf, phone, phone2, cep, street, number, neighborhood, city, state, responsible, responsible_relationship, responsible_phone, photo, observations, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, birth_date, gender, cpf, phonePrimary, phoneSecondary, cep, street, number, neighborhood, city, state, responsible, responsible_relationship, responsible_phone, photoPath, observations, status]
    );

    // Registrar atividade
    await logActivity(
      "Novo Cadastro",
      `Novo paciente cadastrado: ${name} (CPF: ${cpf || 'N/A'})`,
      "Sistema"
    );

    return res.status(201).json({ message: "Paciente cadastrado com sucesso!", id: result.insertId });
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error);
    return res.status(500).json({ message: "Erro ao cadastrar paciente." });
  }
}

export async function updatePatient(req, res) {
  try {
    const { patientTable } = await getPatientSchema();
    const { id } = req.params;
    const {
      name,
      birth_date,
      gender,
      cpf,
      phone,
      phone2,
      cep,
      street,
      number,
      neighborhood,
      city,
      state,
      responsible,
      responsible_relationship,
      responsible_phone,
      photo,
      observations,
      status
    } = req.body;

    const normalizePhone = (value) => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    };

    const phonePrimary = normalizePhone(phone);
    const phoneSecondary = normalizePhone(phone2);
    const residentialPattern = /^\(\d{2}\)\s\d{4}-\d{4}$/;
    const mobilePattern = /^\(\d{2}\)\s\d{5}-\d{4}$/;

    if (!name || !birth_date || !street || !number || !neighborhood || !city || !state || !responsible || !status) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    if (!phonePrimary && !phoneSecondary) {
      return res.status(400).json({ message: "Informe ao menos Telefone Residencial ou Celular." });
    }

    if (phonePrimary && !residentialPattern.test(phonePrimary)) {
      return res.status(400).json({ message: "Telefone residencial inválido. Use o padrão (00) 0000-0000." });
    }

    if (phoneSecondary && !mobilePattern.test(phoneSecondary)) {
      return res.status(400).json({ message: "Celular inválido. Use o padrão (00) 00000-0000." });
    }

    const [[current]] = await pool.query(
      `SELECT photo, status FROM ${patientTable} WHERE id = ?`,
      [id]
    );

    if (!current) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    const currentPhoto = current.photo || null;
    const normalizedPhoto = typeof photo === "string" ? photo.trim() : null;
    let photoPath = currentPhoto;

    if (!normalizedPhoto) {
      if (currentPhoto) {
        deleteLocalPhoto(currentPhoto);
      }
      photoPath = null;
    } else if (isDataUrlPhoto(normalizedPhoto)) {
      const savedPhoto = savePhotoFromDataUrl(normalizedPhoto);
      if (savedPhoto) {
        if (currentPhoto && currentPhoto !== savedPhoto) {
          deleteLocalPhoto(currentPhoto);
        }
        photoPath = savedPhoto;
      }
    } else {
      if (currentPhoto && currentPhoto !== normalizedPhoto) {
        deleteLocalPhoto(currentPhoto);
      }
      photoPath = normalizedPhoto;
    }

    const [result] = await pool.query(
      `UPDATE ${patientTable} SET name = ?, birth_date = ?, gender = ?, cpf = ?, phone = ?, phone2 = ?, 
       cep = ?, street = ?, number = ?, neighborhood = ?, city = ?, state = ?, 
       responsible = ?, responsible_relationship = ?, responsible_phone = ?, photo = ?, observations = ?, status = ?
       WHERE id = ?`,
      [name, birth_date, gender, cpf, phonePrimary, phoneSecondary, cep, street, number, neighborhood, city, state, responsible, responsible_relationship, responsible_phone, photoPath, observations, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    const normalizeStatus = (value) => String(value || '').trim().toLowerCase();
    const previousStatus = normalizeStatus(current.status);
    const nextStatus = normalizeStatus(status);
    const statusChanged = previousStatus !== nextStatus;

    let activityType = "Edição";
    let activityDescription = `Paciente atualizado: ${name}`;
    if (statusChanged && nextStatus === 'inativo') {
      activityType = "Inativação";
      activityDescription = `Paciente desativado: ${name}`;
    } else if (statusChanged && nextStatus === 'ativo') {
      activityType = "Reativação";
      activityDescription = `Paciente reativado: ${name}`;
    }

    // Registrar atividade
    await logActivity(activityType, activityDescription, "Sistema");

    return res.status(200).json({ message: "Paciente atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    return res.status(500).json({ message: "Erro ao atualizar paciente." });
  }
}

export async function deletePatient(req, res) {
  try {
    const { patientTable } = await getPatientSchema();
    const { id } = req.params;

    const [[current]] = await pool.query(
      `SELECT name, photo, status FROM ${patientTable} WHERE id = ?`,
      [id]
    );

    if (!current) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    if (current.status === 'archived') {
      return res.status(200).json({ message: "Paciente já está desabilitado definitivamente." });
    }

    const [result] = await pool.query(
      `UPDATE ${patientTable} SET status = 'archived' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    await logActivity(
      "Inativação",
      `Paciente desabilitado definitivamente: ${current.name} (ID: ${id})`,
      "Sistema"
    );

    return res.status(200).json({ message: "Paciente desabilitado definitivamente com sucesso!" });
  } catch (error) {
    console.error("Erro ao desabilitar paciente:", error);
    return res.status(500).json({ message: "Erro ao desabilitar paciente." });
  }
}
