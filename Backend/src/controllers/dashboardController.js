import pool from "../models/database.js";
import { getPatientSchema } from "../models/schemaModel.js";

export async function getDashboardData(req, res) {
  try {
    console.log("Carregando dados do dashboard...");
    const { patientTable } = await getPatientSchema();

    // Contar pacientes cadastrados
    const [patientRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM ${patientTable} WHERE status IS NULL OR status != 'archived'`
    );
    const patientCount = patientRows[0]?.total || 0;
    console.log(`Pacientes cadastrados: ${patientCount}`);

    // Contar presenças de hoje
    const [todayAttendanceRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM questionnaire_responses
       WHERE DATE(created_at) = CURDATE()`
    );
    const todayAttendanceCount = todayAttendanceRows[0]?.total || 0;
    console.log(`Presencas hoje: ${todayAttendanceCount}`);

    // Contar atividades reais registradas
    const [activitiesRows] = await pool.query(
      "SELECT COUNT(*) AS total FROM activities"
    );
    const activitiesCount = activitiesRows[0]?.total || 0;
    console.log(`Atividades registradas: ${activitiesCount}`);

    // Buscar atividades recentes (últimas 5)
    const [recentActivities] = await pool.query(
      `SELECT id, type, description, responsible, DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS date
       FROM activities
       ORDER BY created_at DESC
       LIMIT 5`
    );
    console.log(`Atividades recentes encontradas: ${recentActivities.length}`);

    const stats = [];

    // Estatística de pacientes cadastrados
    if (patientCount > 0) {
      stats.push({
        icon: "👤",
        title: "Pacientes Cadastrados",
        value: patientCount,
        note: "Total de pessoas atendidas",
        delta: "+0%",
        deltaType: "positive"
      });
    }

    // Estatística de presenças hoje
    if (todayAttendanceCount > 0) {
      stats.push({
        icon: "✋",
        title: "Presenças Hoje",
        value: todayAttendanceCount,
        note: "Frequências registradas hoje",
        delta: "+0%",
        deltaType: "positive"
      });
    }

    // Estatística de atividades
    if (activitiesCount > 0) {
      stats.push({
        icon: "📋",
        title: "Atividades Registradas",
        value: activitiesCount,
        note: "Total de atividades do sistema",
        delta: "+0%",
        deltaType: "positive"
      });
    }

    // Formatar atividades recentes
    const formattedActivities = recentActivities.map((activity) => ({
      id: activity.id,
      date: activity.date,
      type: activity.type,
      description: activity.description,
      responsible: activity.responsible
    }));

    console.log(`Dashboard carregado com ${stats.length} estatisticas e ${formattedActivities.length} atividades`);

    return res.status(200).json({
      stats: stats.length > 0 ? stats : [],
      activities: formattedActivities || [],
      message: stats.length === 0 ? "Nenhum dado disponível ainda" : null
    });
  } catch (err) {
    console.error("Erro ao carregar dashboard", err);
    return res.status(200).json({
      stats: [],
      activities: [],
      error: err.message
    });
  }
}
