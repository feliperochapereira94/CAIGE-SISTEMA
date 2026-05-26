import pool from "./database.js";

export async function listActivities(filters) {
  const { date, type, responsible, limit, offset } = filters;

  let query = `SELECT DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS date,
                      type,
                      description,
                      responsible
               FROM activities
               WHERE 1=1`;

  const params = [];

  if (date) {
    query += " AND DATE(created_at) = ?";
    params.push(date);
  }

  if (type) {
    query += " AND type = ?";
    params.push(type);
  }

  if (responsible) {
    query += " AND responsible LIKE ?";
    params.push(`%${responsible}%`);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [activities] = await pool.query(query, params);

  let countQuery = "SELECT COUNT(*) as total FROM activities WHERE 1=1";
  const countParams = [];

  if (date) {
    countQuery += " AND DATE(created_at) = ?";
    countParams.push(date);
  }

  if (type) {
    countQuery += " AND type = ?";
    countParams.push(type);
  }

  if (responsible) {
    countQuery += " AND responsible LIKE ?";
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