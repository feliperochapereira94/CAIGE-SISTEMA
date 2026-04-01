import mysql from "mysql2/promise";

async function insertActivities() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: "caige",
  });

  try {
    console.log("📝 Inserindo atividades de teste...");

    const activities = [
      ["Novo Cadastro", "Novo idoso cadastrado: Maria Silva Santos (CPF: 123.456.789-01)", "Sistema"],
      ["Edição", "Idoso atualizado: Antônio Costa Ferreira", "Sistema"],
      ["Novo Cadastro", "Novo idoso cadastrado: Francisca Oliveira Mendes (CPF: 345.678.901-23)", "Sistema"],
      ["Anexo Prontuário", "Nelson Osvaldo - Documento anexado", "Sistema"],
      ["Edição", "Idoso atualizado: José Pereira Gomes", "Sistema"],
      ["Consulta Agendada", "Joana Alves Barbosa - Primeira consulta agendada", "Sistema"],
    ];

    for (const [type, description, responsible] of activities) {
      await connection.query(
        `INSERT INTO activities (type, description, responsible, created_at) 
         VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 200) MINUTE))`,
        [type, description, responsible]
      );
    }

    const [[result]] = await connection.query("SELECT COUNT(*) as total FROM activities");
    console.log(`✅ Atividades inseridas com sucesso!`);
    console.log(`📊 Total de atividades no sistema: ${result.total}`);
  } catch (error) {
    console.error("❌ Erro ao inserir atividades:", error.message);
  } finally {
    await connection.end();
  }
}

insertActivities();
