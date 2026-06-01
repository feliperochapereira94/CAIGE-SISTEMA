import { listActivities } from "../models/atividadesModel.js";
import { parsePagination } from "../models/validacaoModel.js";

export async function getActivities(req, res) {
  try {
    const { date, type, responsible } = req.query;
    const importantOnly = ['1', 'true', 'yes'].includes(String(req.query.important_only || '').toLowerCase());
    const { limit, offset } = parsePagination(req.query.limit, req.query.offset, {
      limit: 100,
      maxLimit: 200
    });

    const result = await listActivities({
      date,
      type,
      responsible,
      importantOnly,
      limit,
      offset
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return res.status(500).json({ message: "Erro ao buscar atividades." });
  }
}

