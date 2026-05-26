import { getArchivedUsers, getArchivedPatients } from "../models/archiveModel.js";

export async function listArchivedUsers(req, res) {
  try {
    const rows = await getArchivedUsers();
    return res.status(200).json({ archived_users: rows });
  } catch (error) {
    console.error("Erro ao buscar usuarios arquivados:", error);
    return res.status(500).json({ message: "Erro ao buscar usuarios arquivados." });
  }
}

export async function listArchivedPatients(req, res) {
  try {
    const rows = await getArchivedPatients();
    return res.status(200).json({ archived_patients: rows });
  } catch (error) {
    console.error("Erro ao buscar pacientes arquivados:", error);
    return res.status(500).json({ message: "Erro ao buscar pacientes arquivados." });
  }
}
