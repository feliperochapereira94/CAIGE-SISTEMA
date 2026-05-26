import pool from '../models/database.js';
import { getPatientSchema } from '../models/schemaModel.js';
import { parsePagination, parsePositiveInt } from '../models/validationModel.js';

export const attendanceController = {
  // Listar histórico de frequência
  getHistory: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const patientId = req.query.patient_id ? parsePositiveInt(req.query.patient_id) : null;
      const { start_date, end_date, course } = req.query;
      const { limit, offset } = parsePagination(req.query.limit, req.query.offset, { limit: 50, maxLimit: 200 });

      if (req.query.patient_id && !patientId) {
        return res.status(400).json({ message: 'ID do paciente inválido' });
      }

      let query = `
        SELECT 
          qr.id,
          qr.${schema.questionnaireResponsePatientColumn} AS patient_id,
          e.name,
          qr.created_at AS check_in_time,
          DATE(qr.created_at) AS attendance_date,
          q.course
        FROM questionnaire_responses qr
        JOIN ${schema.patientTable} e ON qr.${schema.questionnaireResponsePatientColumn} = e.id
        JOIN questionnaires q ON q.id = qr.questionnaire_id
        WHERE 1=1
      `;

      const params = [];

      if (patientId) {
        query += ` AND qr.${schema.questionnaireResponsePatientColumn} = ?`;
        params.push(patientId);
      }

      if (start_date) {
        query += ' AND DATE(qr.created_at) >= ?';
        params.push(start_date);
      }

      if (end_date) {
        query += ' AND DATE(qr.created_at) <= ?';
        params.push(end_date);
      }

      if (course) {
        query += ' AND q.course = ?';
        params.push(course);
      }

      query += ' ORDER BY qr.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [attendance] = await pool.query(query, params);

      // Contar total
      let countQuery = `
        SELECT COUNT(*) as total
        FROM questionnaire_responses qr
        JOIN questionnaires q ON q.id = qr.questionnaire_id
        WHERE 1=1
      `;
      const countParams = [];

      if (patientId) {
        countQuery += ` AND qr.${schema.questionnaireResponsePatientColumn} = ?`;
        countParams.push(patientId);
      }

      if (start_date) {
        countQuery += ' AND DATE(qr.created_at) >= ?';
        countParams.push(start_date);
      }

      if (end_date) {
        countQuery += ' AND DATE(qr.created_at) <= ?';
        countParams.push(end_date);
      }

      if (course) {
        countQuery += ' AND q.course = ?';
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
      console.error('Erro ao listar histórico:', error);
      res.status(500).json({ message: 'Erro ao listar histórico' });
    }
  },

  // Gerar relatório de frequência por período
  getFrequencyReport: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const patientId = req.query.patient_id ? parsePositiveInt(req.query.patient_id) : null;
      const patientName = req.query.patient_name;
      const { start_date, end_date, course } = req.query;

      if (req.query.patient_id && !patientId) {
        return res.status(400).json({ message: 'ID do paciente inválido' });
      }

      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Data inicial e final são obrigatórias' });
      }

      let query = `
        SELECT 
          e.id,
          e.name,
          COUNT(DISTINCT DATE(qr.created_at)) as days_present,
          COUNT(qr.id) as total_entries,
          GROUP_CONCAT(DISTINCT DATE_FORMAT(qr.created_at, '%Y-%m-%d') ORDER BY qr.created_at SEPARATOR ',') as attendance_dates,
          GROUP_CONCAT(
            CONCAT(
              DATE_FORMAT(qr.created_at, '%Y-%m-%d %H:%i:%s'),
              '::',
              COALESCE(q.course, '')
            )
            ORDER BY qr.created_at
            SEPARATOR '||'
          ) as attendance_records
        FROM ${schema.patientTable} e
        LEFT JOIN questionnaire_responses qr ON e.id = qr.${schema.questionnaireResponsePatientColumn}
          AND DATE(qr.created_at) >= ?
          AND DATE(qr.created_at) <= ?
        LEFT JOIN questionnaires q ON q.id = qr.questionnaire_id
        WHERE 1=1
      `;

      const params = [start_date, end_date];

      if (patientId) {
        query += ' AND e.id = ?';
        params.push(patientId);
      } else if (patientName) {
        query += ' AND e.name LIKE ?';
        params.push(`%${patientName}%`);
      }

      if (course) {
        query += ' AND q.course = ?';
        params.push(course);
      }

      query += ' GROUP BY e.id, e.name ORDER BY days_present DESC';

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
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
  },

  // Obter presenças registradas hoje
  getTodayStatus: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const today = new Date().toISOString().split('T')[0];

      const [todayAttendance] = await pool.query(`
        SELECT 
          qr.id,
          qr.${schema.questionnaireResponsePatientColumn} AS patient_id,
          e.name,
          qr.created_at AS check_in_time,
          DATE(qr.created_at) AS attendance_date,
          q.course,
          'Presente' as status
        FROM questionnaire_responses qr
        JOIN ${schema.patientTable} e ON qr.${schema.questionnaireResponsePatientColumn} = e.id
        JOIN questionnaires q ON q.id = qr.questionnaire_id
        WHERE DATE(qr.created_at) = ?
        ORDER BY qr.created_at DESC
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
