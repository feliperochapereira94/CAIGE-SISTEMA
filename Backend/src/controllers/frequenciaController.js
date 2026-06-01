import pool from '../models/database.js';
import { getPatientSchema } from '../models/esquemaModel.js';
import { parsePagination, parsePositiveInt } from '../models/validacaoModel.js';

export const frequenciaController = {
  // Listar histÃ³rico de frequÃªncia
  getHistory: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const patientIdParam = req.query.id_paciente ?? req.query.patient_id;
      const patientId = patientIdParam ? parsePositiveInt(patientIdParam) : null;
      const start_date = req.query.data_inicio ?? req.query.start_date;
      const end_date = req.query.data_fim ?? req.query.end_date;
      const course = req.query.curso ?? req.query.course;
      const { limit, offset } = parsePagination(req.query.limit, req.query.offset, { limit: 50, maxLimit: 200 });

      if (patientIdParam && !patientId) {
        return res.status(400).json({ message: 'ID do paciente invÃ¡lido' });
      }

      let query = `
        SELECT 
          qr.id,
          qr.${schema.questionnaireResponsePatientColumn} AS patient_id,
          e.nome AS name,
          qr.criado_em AS check_in_time,
          DATE(qr.criado_em) AS attendance_date,
          q.curso AS course
        FROM respostas_questionarios qr
        JOIN ${schema.patientTable} e ON qr.${schema.questionnaireResponsePatientColumn} = e.id
        JOIN questionarios q ON q.id = qr.id_questionario
        WHERE 1=1
      `;

      const params = [];

      if (patientId) {
        query += ` AND qr.${schema.questionnaireResponsePatientColumn} = ?`;
        params.push(patientId);
      }

      if (start_date) {
        query += ' AND DATE(qr.criado_em) >= ?';
        params.push(start_date);
      }

      if (end_date) {
        query += ' AND DATE(qr.criado_em) <= ?';
        params.push(end_date);
      }

      if (course) {
        query += ' AND q.curso = ?';
        params.push(course);
      }

      query += ' ORDER BY qr.criado_em DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [attendance] = await pool.query(query, params);

      // Contar total
      let countQuery = `
        SELECT COUNT(*) as total
        FROM respostas_questionarios qr
        JOIN questionarios q ON q.id = qr.id_questionario
        WHERE 1=1
      `;
      const countParams = [];

      if (patientId) {
        countQuery += ` AND qr.${schema.questionnaireResponsePatientColumn} = ?`;
        countParams.push(patientId);
      }

      if (start_date) {
        countQuery += ' AND DATE(qr.criado_em) >= ?';
        countParams.push(start_date);
      }

      if (end_date) {
        countQuery += ' AND DATE(qr.criado_em) <= ?';
        countParams.push(end_date);
      }

      if (course) {
        countQuery += ' AND q.curso = ?';
        countParams.push(course);
      }

      const [countResult] = await pool.query(countQuery, countParams);

      res.json({
        data: attendance,
        pagination: {
          total: countResult[0].total,
          limit,
          offset
        }
      });
    } catch (error) {
      console.error('Erro ao listar histÃ³rico:', error);
      res.status(500).json({ message: 'Erro ao listar histÃ³rico' });
    }
  },

  // Gerar relatÃ³rio de frequÃªncia por perÃ­odo
  getFrequencyReport: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const patientIdParam = req.query.id_paciente ?? req.query.patient_id;
      const patientId = patientIdParam ? parsePositiveInt(patientIdParam) : null;
      const patientName = req.query.nome_paciente ?? req.query.patient_name;
      const start_date = req.query.data_inicio ?? req.query.start_date;
      const end_date = req.query.data_fim ?? req.query.end_date;
      const course = req.query.curso ?? req.query.course;

      if (patientIdParam && !patientId) {
        return res.status(400).json({ message: 'ID do paciente invÃ¡lido' });
      }

      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Data inicial e final sÃ£o obrigatÃ³rias' });
      }

      let query = `
        SELECT 
          e.id,
          e.nome AS name,
          COUNT(DISTINCT DATE(qr.criado_em)) as days_present,
          COUNT(qr.id) as total_entries,
          GROUP_CONCAT(DISTINCT DATE_FORMAT(qr.criado_em, '%Y-%m-%d') ORDER BY qr.criado_em SEPARATOR ',') as attendance_dates,
          GROUP_CONCAT(
            CONCAT(
              DATE_FORMAT(qr.criado_em, '%Y-%m-%d %H:%i:%s'),
              '::',
              COALESCE(q.curso, '')
            )
            ORDER BY qr.criado_em
            SEPARATOR '||'
          ) as attendance_records
        FROM ${schema.patientTable} e
        LEFT JOIN respostas_questionarios qr ON e.id = qr.${schema.questionnaireResponsePatientColumn}
          AND DATE(qr.criado_em) >= ?
          AND DATE(qr.criado_em) <= ?
        LEFT JOIN questionarios q ON q.id = qr.id_questionario
        WHERE 1=1
      `;

      const params = [start_date, end_date];

      if (patientId) {
        query += ' AND e.id = ?';
        params.push(patientId);
      } else if (patientName) {
        query += ' AND e.nome LIKE ?';
        params.push(`%${patientName}%`);
      }

      if (course) {
        query += ' AND q.curso = ?';
        params.push(course);
      }

      query += ' GROUP BY e.id, e.nome ORDER BY days_present DESC';

      const [report] = await pool.query(query, params);

      const startDate = new Date(`${start_date}T00:00:00`);
      const endDate = new Date(`${end_date}T00:00:00`);
      const periodDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

      const normalizedReport = report.map((item) => ({
        ...item,
        attendance_dates: item.attendance_dates ? item.attendance_dates.split(',') : [],
        attendance_records: item.attendance_records
          ? item.attendance_records.split('||').map((entry) => {
              const [timestamp, courseValue] = entry.split('::');
              const [datePart, timePart = '00:00:00'] = (timestamp || '').split(' ');
              return {
                timestamp: timestamp || null,
                date: datePart || null,
                time: timePart.slice(0, 5),
                course: courseValue || null
              };
            })
          : [],
        period_days: periodDays
      }));

      res.json({
        period: {
          start_date,
          end_date,
          period_days: periodDays,
          course: course || null
        },
        report: normalizedReport
      });
    } catch (error) {
      console.error('Erro ao gerar relatÃ³rio:', error);
      res.status(500).json({ message: 'Erro ao gerar relatÃ³rio' });
    }
  },

  // Obter presenÃ§as registradas hoje
  getTodayStatus: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const today = new Date().toISOString().split('T')[0];

      const [todayAttendance] = await pool.query(`
        SELECT 
          qr.id,
          qr.${schema.questionnaireResponsePatientColumn} AS patient_id,
          e.nome AS name,
          qr.criado_em AS check_in_time,
          DATE(qr.criado_em) AS attendance_date,
          q.curso AS course,
          'Presente' as status
        FROM respostas_questionarios qr
        JOIN ${schema.patientTable} e ON qr.${schema.questionnaireResponsePatientColumn} = e.id
        JOIN questionarios q ON q.id = qr.id_questionario
        WHERE DATE(qr.criado_em) = ?
        ORDER BY qr.criado_em DESC
      `, [today]);

      res.json({
        date: today,
        count: todayAttendance.length,
        present: todayAttendance.length,
        attendance: todayAttendance
      });
    } catch (error) {
      console.error('Erro ao obter status:', error);
      res.status(500).json({ message: 'Erro ao obter status' });
    }
  }
};

