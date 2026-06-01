import pool from "../models/database.js";
import { logActivity } from "../models/registroAtividadeModel.js";
import { getPatientSchema } from "../models/esquemaModel.js";
import { parsePagination, parsePositiveInt } from "../models/validacaoModel.js";

function normalizePatientStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "inativo") {
    return "inativo";
  }

  if (normalized === "archived") {
    return "arquivado";
  }

  if (normalized === "arquivado") {
    return "arquivado";
  }

  return "ativo";
}

export async function getAllPatients(req, res) {
  try {
    const { patientTable } = await getPatientSchema();
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const terms = search ? search.split(/\s+/).filter(Boolean) : [];
    const { limit } = parsePagination(req.query.limit, 0, { limit: 50, maxLimit: 100 });

    let query = `SELECT id, nome AS name, data_nascimento AS birth_date, telefone AS phone, celular AS phone2, bairro AS neighborhood, cidade AS city, status FROM ${patientTable} WHERE (status IS NULL OR status <> 'arquivado')`;
    const params = [];

    if (terms.length > 0) {
      terms.forEach((term) => {
        query += " AND (nome COLLATE utf8mb4_unicode_ci LIKE ? OR CAST(id AS CHAR) LIKE ?)";
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
        status: normalizePatientStatus(person.status)
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
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID de paciente invÃ¡lido." });
    }

    const [patients] = await pool.query(
      `SELECT id, nome AS name, data_nascimento AS birth_date, genero AS gender, cpf, telefone AS phone, celular AS phone2,
              cep, rua AS street, numero AS number, bairro AS neighborhood, cidade AS city, estado AS state,
              responsavel AS responsible, parentesco_responsavel AS responsible_relationship, telefone_responsavel AS responsible_phone,
              observacoes AS observations, status, criado_em AS created_at
       FROM ${patientTable} WHERE id = ?`,
      [id]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: "Paciente nÃ£o encontrado." });
    }

    return res.status(200).json({
      ...patients[0],
      status: normalizePatientStatus(patients[0].status)
    });
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return res.status(500).json({ message: "Erro ao buscar paciente." });
  }
}

export async function createPatient(req, res) {
  try {
    const actorEmail = req.user?.email || "Sistema";
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
      return res.status(400).json({ message: "Preencha todos os campos obrigatÃ³rios." });
    }

    if (!phonePrimary && !phoneSecondary) {
      return res.status(400).json({ message: "Informe ao menos Telefone Residencial ou Celular." });
    }

    if (phonePrimary && !residentialPattern.test(phonePrimary)) {
      return res.status(400).json({ message: "Telefone residencial invÃ¡lido. Use o padrÃ£o (00) 0000-0000." });
    }

    if (phoneSecondary && !mobilePattern.test(phoneSecondary)) {
      return res.status(400).json({ message: "Celular invÃ¡lido. Use o padrÃ£o (00) 00000-0000." });
    }

    const [result] = await pool.query(
      `INSERT INTO ${patientTable} (nome, data_nascimento, genero, cpf, telefone, celular, cep, rua, numero, bairro, cidade, estado, responsavel, parentesco_responsavel, telefone_responsavel, observacoes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, birth_date, gender, cpf, phonePrimary, phoneSecondary, cep, street, number, neighborhood, city, state, responsible, responsible_relationship, responsible_phone, observations, status]
    );

    // Registrar atividade
    await logActivity(
      "Paciente",
      `Novo paciente cadastrado: ${name} (CPF: ${cpf || 'N/A'})`,
      actorEmail
    );

    return res.status(201).json({ message: "Paciente cadastrado com sucesso!", id: result.insertId });
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error);
    return res.status(500).json({ message: "Erro ao cadastrar paciente." });
  }
}

export async function updatePatient(req, res) {
  try {
    const actorEmail = req.user?.email || "Sistema";
    const { patientTable } = await getPatientSchema();
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID de paciente invÃ¡lido." });
    }
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
      return res.status(400).json({ message: "Preencha todos os campos obrigatÃ³rios." });
    }

    if (!phonePrimary && !phoneSecondary) {
      return res.status(400).json({ message: "Informe ao menos Telefone Residencial ou Celular." });
    }

    if (phonePrimary && !residentialPattern.test(phonePrimary)) {
      return res.status(400).json({ message: "Telefone residencial invÃ¡lido. Use o padrÃ£o (00) 0000-0000." });
    }

    if (phoneSecondary && !mobilePattern.test(phoneSecondary)) {
      return res.status(400).json({ message: "Celular invÃ¡lido. Use o padrÃ£o (00) 00000-0000." });
    }

    const [[current]] = await pool.query(`SELECT status FROM ${patientTable} WHERE id = ?`, [id]);

    if (!current) {
      return res.status(404).json({ message: "Paciente nÃ£o encontrado." });
    }

    const [result] = await pool.query(
      `UPDATE ${patientTable}
       SET nome = ?, data_nascimento = ?, genero = ?, cpf = ?, telefone = ?, celular = ?,
       cep = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?,
       responsavel = ?, parentesco_responsavel = ?, telefone_responsavel = ?, observacoes = ?, status = ?
       WHERE id = ?`,
      [name, birth_date, gender, cpf, phonePrimary, phoneSecondary, cep, street, number, neighborhood, city, state, responsible, responsible_relationship, responsible_phone, observations, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paciente nÃ£o encontrado." });
    }

    const normalizeStatus = (value) => String(value || '').trim().toLowerCase();
    const previousStatus = normalizeStatus(current.status || 'ativo');
    const nextStatus = normalizeStatus(status);
    const statusChanged = previousStatus !== nextStatus;

    let activityType = "Paciente";
    let activityDescription = `Paciente atualizado: ${name}`;
    if (statusChanged && nextStatus === 'inativo') {
      activityDescription = `Paciente desativado: ${name}`;
    } else if (statusChanged && nextStatus === 'ativo') {
      activityDescription = `Paciente reativado: ${name}`;
    }

    // Registrar atividade
    await logActivity(activityType, activityDescription, actorEmail);

    return res.status(200).json({ message: "Paciente atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    return res.status(500).json({ message: "Erro ao atualizar paciente." });
  }
}

export async function deletePatient(req, res) {
  try {
    const actorEmail = req.user?.email || "Sistema";
    const { patientTable } = await getPatientSchema();
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID de paciente invÃ¡lido." });
    }

    const [[current]] = await pool.query(`SELECT nome AS name, status FROM ${patientTable} WHERE id = ?`, [id]);

    if (!current) {
      return res.status(404).json({ message: "Paciente nÃ£o encontrado." });
    }

    if (current.status === 'arquivado') {
      return res.status(200).json({ message: "Paciente jÃ¡ estÃ¡ desabilitado definitivamente." });
    }

    const [result] = await pool.query(
      `UPDATE ${patientTable} SET status = 'arquivado' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Paciente nÃ£o encontrado." });
    }

    await logActivity(
      "Paciente",
      `Paciente desabilitado definitivamente: ${current.name} (ID: ${id})`,
      actorEmail
    );

    return res.status(200).json({ message: "Paciente desabilitado definitivamente com sucesso!" });
  } catch (error) {
    console.error("Erro ao desabilitar paciente:", error);
    return res.status(500).json({ message: "Erro ao desabilitar paciente." });
  }
}

