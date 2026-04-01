import pool from '../models/database.js';
import { logActivity } from '../utils/activityLogger.js';
import { getPatientSchema } from '../utils/schemaNames.js';

export const attendanceController = {
  // Registrar presença diária
  registerPresence: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const patientId = req.body.patient_id;
      const { professional_id, notes } = req.body;

      if (!patientId) {
        return res.status(400).json({ message: 'ID do paciente é obrigatório' });
      }

      // Verificar se paciente existe
      const [patients] = await pool.query(`SELECT id, name FROM ${schema.patientTable} WHERE id = ?`, [patientId]);
      if (patients.length === 0) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      // Permitir apenas uma presença por paciente por dia
      const today = new Date().toISOString().split('T')[0];
      const [existingPresence] = await pool.query(
        `SELECT id FROM attendance WHERE ${schema.attendancePatientColumn} = ? AND attendance_date = ? LIMIT 1`,
        [patientId, today]
      );

      if (existingPresence.length > 0) {
        return res.status(400).json({ message: 'A presença deste paciente já foi registrada hoje' });
      }

      // Registrar presença
      const now = new Date();
      const [result] = await pool.query(
        `INSERT INTO attendance (${schema.attendancePatientColumn}, professional_id, check_in_time, attendance_date, notes) VALUES (?, ?, ?, ?, ?)`,
        [patientId, professional_id || null, now, today, notes || null]
      );

      // Log de atividade
      await logActivity('Frequência', `${patients[0].name} teve presença registrada`, 'Sistema');

      res.status(201).json({
        message: 'Presença registrada com sucesso',
        id: result.insertId,
        time: now
      });
    } catch (error) {
      console.error('Erro ao registrar presença:', error);
      res.status(500).json({ message: 'Erro ao registrar presença' });
    }
  },

  // Listar histórico de frequência
  getHistory: async (req, res) => {
    try {
      const schema = await getPatientSchema();
      const patientId = req.query.patient_id;
      const { start_date, end_date, sector, limit = 50, offset = 0 } = req.query;

      let query = `
        SELECT 
          a.id,
          a.${schema.attendancePatientColumn} AS patient_id,
          e.name,
          a.check_in_time,
          a.notes,
          a.attendance_date
        FROM attendance a
        JOIN ${schema.patientTable} e ON a.${schema.attendancePatientColumn} = e.id
        WHERE 1=1
      `;

      const params = [];

      if (patientId) {
        query += ` AND a.${schema.attendancePatientColumn} = ?`;
        params.push(patientId);
      }

      if (start_date) {
        query += ' AND a.attendance_date >= ?';
        params.push(start_date);
      }

      if (end_date) {
        query += ' AND a.attendance_date <= ?';
        params.push(end_date);
      }

      if (sector) {
        query += ' AND a.notes = ?';
        params.push(sector);
      }

      query += ' ORDER BY a.check_in_time DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const [attendance] = await pool.query(query, params);

      // Contar total
      let countQuery = 'SELECT COUNT(*) as total FROM attendance WHERE 1=1';
      const countParams = [];

      if (patientId) {
        countQuery += ` AND ${schema.attendancePatientColumn} = ?`;
        countParams.push(patientId);
      }

      if (start_date) {
        countQuery += ' AND attendance_date >= ?';
        countParams.push(start_date);
      }

      if (end_date) {
        countQuery += ' AND attendance_date <= ?';
        countParams.push(end_date);
      }

      if (sector) {
        countQuery += ' AND notes = ?';
        countParams.push(sector);
      }

      const [countResult] = await pool.query(countQuery, countParams);

      res.json({
        data: attendance,
        pagination: {
          total: countResult[0].total,
          limit: parseInt(limit),
          offset: parseInt(offset)
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
      const patientId = req.query.patient_id;
      const patientName = req.query.patient_name;
      const { start_date, end_date, sector } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Data inicial e final são obrigatórias' });
      }

      let query = `
        SELECT 
          e.id,
          e.name,
          COUNT(DISTINCT a.attendance_date) as days_present,
          COUNT(a.id) as total_entries,
          GROUP_CONCAT(DISTINCT DATE_FORMAT(a.attendance_date, '%Y-%m-%d') ORDER BY a.attendance_date SEPARATOR ',') as attendance_dates,
          GROUP_CONCAT(
            DISTINCT CONCAT(
              DATE_FORMAT(a.attendance_date, '%Y-%m-%d'),
              '::',
              COALESCE(a.notes, '')
            )
            ORDER BY a.attendance_date
            SEPARATOR '||'
          ) as attendance_records
        FROM ${schema.patientTable} e
        LEFT JOIN attendance a ON e.id = a.${schema.attendancePatientColumn} 
          AND a.attendance_date >= ? 
          AND a.attendance_date <= ?
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

      if (sector) {
        query += ' AND a.notes = ?';
        params.push(sector);
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
              const [date, sectorValue] = entry.split('::');
              return {
                date,
                sector: sectorValue || null
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
          sector: sector || null
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
          a.id,
          a.${schema.attendancePatientColumn} AS patient_id,
          e.name,
          a.check_in_time,
          a.attendance_date,
          a.notes,
          'Presente' as status
        FROM attendance a
        JOIN ${schema.patientTable} e ON a.${schema.attendancePatientColumn} = e.id
        WHERE a.attendance_date = ?
        ORDER BY a.check_in_time DESC
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
