import { listActivities } from "../models/activitiesModel.js";
import { parsePagination } from "../models/validationModel.js";

export async function getActivities(req, res) {
  try {
    const { date, type, responsible } = req.query;
    const { limit, offset } = parsePagination(req.query.limit, req.query.offset, {
      limit: 100,
      maxLimit: 200
    });

    const result = await listActivities({
      date,
      type,
      responsible,
      limit,
      offset
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return res.status(500).json({ message: "Erro ao buscar atividades." });
  }
}
