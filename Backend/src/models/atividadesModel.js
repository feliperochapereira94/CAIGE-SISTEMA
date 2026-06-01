import pool from "./database.js";

export async function listActivities(filters) {
  const { date, type, responsible, importantOnly, limit, offset } = filters;

  if (importantOnly) {
    const baseImportantEventsQuery = `
      SELECT
        DATE_FORMAT(event_date, '%d/%m/%Y %H:%i') AS date,
        type,
        description,
        responsible,
        event_date
      FROM (
        SELECT
          p.criado_em AS event_date,
          'Novo paciente' AS type,
          CONCAT(p.nome, ' foi cadastrado(a) no sistema.') AS description,
          'Cadastro' AS responsible
        FROM pacientes p

        UNION ALL

        SELECT
          MAX(rq.criado_em) AS event_date,
          'Presença registrada' AS type,
          CONCAT('Presença registrada para ', p.nome, '.') AS description,
          'Frequência' AS responsible
        FROM respostas_questionarios rq
        JOIN pacientes p ON p.id = rq.id_paciente
        GROUP BY p.id, p.nome, DATE(rq.criado_em)

        UNION ALL

        SELECT
          rq.criado_em AS event_date,
          'Prontuário adicionado' AS type,
          CONCAT('Prontuário "', COALESCE(q.titulo, 'Sem título'), '" adicionado para ', p.nome, '.') AS description,
          'Prontuário' AS responsible
        FROM respostas_questionarios rq
        JOIN pacientes p ON p.id = rq.id_paciente
        JOIN questionarios q ON q.id = rq.id_questionario
      ) important_events
      WHERE 1 = 1
    `;

    let query = baseImportantEventsQuery;
    const params = [];

    if (date) {
      query += ' AND DATE(event_date) = ?';
      params.push(date);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (responsible) {
      query += ' AND responsible LIKE ?';
      params.push(`%${responsible}%`);
    }

    query += ' ORDER BY event_date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [activities] = await pool.query(query, params);

    let countQuery = `SELECT COUNT(*) as total FROM (${baseImportantEventsQuery}) counted_events WHERE 1 = 1`;
    const countParams = [];

    if (date) {
      countQuery += ' AND DATE(event_date) = ?';
      countParams.push(date);
    }

    if (type) {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }

    if (responsible) {
      countQuery += ' AND responsible LIKE ?';
      countParams.push(`%${responsible}%`);
    }

    const [[{ total }]] = await pool.query(countQuery, countParams);

    return {
      activities,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };
  }

  let query = `SELECT DATE_FORMAT(criado_em, '%d/%m/%Y %H:%i') AS date,
         tipo AS type,
         descricao AS description,
         responsavel AS responsible
       FROM atividades
               WHERE 1=1`;

  const params = [];

  if (date) {
    query += " AND DATE(criado_em) = ?";
    params.push(date);
  }

  if (type) {
    query += " AND tipo = ?";
    params.push(type);
  }

  if (responsible) {
    query += " AND responsavel LIKE ?";
    params.push(`%${responsible}%`);
  }

  query += " ORDER BY criado_em DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [activities] = await pool.query(query, params);

  let countQuery = "SELECT COUNT(*) as total FROM atividades WHERE 1=1";
  const countParams = [];

  if (date) {
    countQuery += " AND DATE(criado_em) = ?";
    countParams.push(date);
  }

  if (type) {
    countQuery += " AND tipo = ?";
    countParams.push(type);
  }

  if (responsible) {
    countQuery += " AND responsavel LIKE ?";
    countParams.push(`%${responsible}%`);
  }

  const [[{ total }]] = await pool.query(countQuery, countParams);

  return {
    activities,
    total,
    limit,
    offset,
    hasMore: offset + limit < total
  };
}
