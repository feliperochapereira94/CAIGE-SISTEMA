import pool from "../models/database.js";
import { getPatientSchema } from "../models/esquemaModel.js";

export async function getDashboardData(req, res) {
  try {
    console.log("Carregando dados do dashboard...");
    const { patientTable, questionnaireResponsePatientColumn } = await getPatientSchema();

    // Contar pacientes cadastrados
    const [patientRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM ${patientTable} WHERE status IS NULL OR status != 'arquivado'`
    );
    const patientCount = patientRows[0]?.total || 0;
    console.log(`Pacientes cadastrados: ${patientCount}`);

    // No fluxo atual do sistema, presença do dia equivale a pacientes com registro no dia.
    const [todayPresenceRows] = await pool.query(
      `SELECT COUNT(DISTINCT ${questionnaireResponsePatientColumn}) AS total
       FROM respostas_questionarios
       WHERE DATE(criado_em) = CURDATE()`
    );
    const todayPresenceCount = todayPresenceRows[0]?.total || 0;
    console.log(`Presenças hoje: ${todayPresenceCount}`);

    const [todayQuestionnaireRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM respostas_questionarios
       WHERE DATE(criado_em) = CURDATE()`
    );
    const todayQuestionnaireCount = todayQuestionnaireRows[0]?.total || 0;
    console.log(`Prontuários registrados hoje: ${todayQuestionnaireCount}`);

    const [totalQuestionnaireRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM respostas_questionarios`
    );
    const totalQuestionnaireCount = totalQuestionnaireRows[0]?.total || 0;
    console.log(`Total de prontuários: ${totalQuestionnaireCount}`);

    const [recentPatientRows] = await pool.query(
      `SELECT
         id,
         nome AS patient_name,
         criado_em AS occurred_at,
         DATE_FORMAT(criado_em, '%d/%m/%Y %H:%i') AS date
       FROM ${patientTable}
       WHERE status IS NULL OR status != 'arquivado'
       ORDER BY criado_em DESC
       LIMIT 5`
    );

    const [recentPresenceRows] = await pool.query(
      `SELECT
         qr.${questionnaireResponsePatientColumn} AS patient_id,
         p.nome AS patient_name,
         MAX(qr.criado_em) AS occurred_at,
         DATE_FORMAT(MAX(qr.criado_em), '%d/%m/%Y %H:%i') AS date
       FROM respostas_questionarios qr
       JOIN ${patientTable} p ON p.id = qr.${questionnaireResponsePatientColumn}
       GROUP BY qr.${questionnaireResponsePatientColumn}, p.nome, DATE(qr.criado_em)
       ORDER BY MAX(qr.criado_em) DESC
       LIMIT 5`
    );

    const [recentQuestionnaireRows] = await pool.query(
      `SELECT
         qr.id,
         p.nome AS patient_name,
         q.titulo AS questionnaire_title,
         qr.criado_em AS occurred_at,
         DATE_FORMAT(qr.criado_em, '%d/%m/%Y %H:%i') AS date
       FROM respostas_questionarios qr
       JOIN ${patientTable} p ON p.id = qr.${questionnaireResponsePatientColumn}
       JOIN questionarios q ON q.id = qr.id_questionario
       ORDER BY qr.criado_em DESC
       LIMIT 5`
    );

    const stats = [
      {
        icon: "👥",
        title: "Pacientes cadastrados",
        value: patientCount,
        note: "Base atual de pacientes ativos",
        delta: "Sistema",
        deltaType: "positive"
      },
      {
        icon: "✅",
        title: "Presenças hoje",
        value: todayPresenceCount,
        note: "Pacientes com presença registrada hoje",
        delta: "Hoje",
        deltaType: "positive"
      },
      {
        icon: "📝",
        title: "Prontuários hoje",
        value: todayQuestionnaireCount,
        note: "Registros adicionados aos pacientes hoje",
        delta: "Hoje",
        deltaType: "positive"
      },
      {
        icon: "🗂️",
        title: "Prontuários no sistema",
        value: totalQuestionnaireCount,
        note: "Total de registros de prontuário salvos",
        delta: "Sistema",
        deltaType: "positive"
      }
    ];

    const importantEvents = [
      ...recentPatientRows.map((item) => ({
        id: `patient-${item.id}`,
        date: item.date,
        type: "Novo paciente",
        description: `${item.patient_name} foi cadastrado(a) no sistema.`,
        origin: "Cadastro",
        sortAt: item.occurred_at
      })),
      ...recentPresenceRows.map((item) => ({
        id: `presence-${item.patient_id}-${String(item.date).replace(/[^0-9]/g, '')}`,
        date: item.date,
        type: "Presença registrada",
        description: `Presença registrada para ${item.patient_name}.`,
        origin: "Frequência",
        sortAt: item.occurred_at
      })),
      ...recentQuestionnaireRows.map((item) => ({
        id: `record-${item.id}`,
        date: item.date,
        type: "Prontuário adicionado",
        description: `Prontuário \"${item.questionnaire_title || 'Sem título'}\" adicionado para ${item.patient_name}.`,
        origin: "Prontuário",
        sortAt: item.occurred_at
      }))
    ]
      .sort((left, right) => new Date(right.sortAt) - new Date(left.sortAt))
      .slice(0, 5)
      .map(({ sortAt, ...event }) => event);

    console.log(`Dashboard carregado com ${stats.length} indicadores e ${importantEvents.length} eventos importantes`);

    return res.status(200).json({
      stats,
      importantEvents,
      activities: importantEvents,
      message: "Dashboard carregado com sucesso"
    });
  } catch (err) {
    console.error("Erro ao carregar dashboard", err);
    return res.status(200).json({
      stats: [],
      importantEvents: [],
      activities: [],
      error: err.message
    });
  }
}

