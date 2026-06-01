import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    port: Number(process.env.DB_PORT || 3306),
    multipleStatements: true,
  });

  try {
    const sqlFile = path.join(__dirname, "database", "setup_completo.sql");
    const sqlScript = fs.readFileSync(sqlFile, "utf8");

    console.log("Inicializando banco de dados...");
    await connection.query(sqlScript);
    
    console.log("Banco de dados inicializado com sucesso!");
    console.log("Usuario inicial criado:");
    console.log("suportecaige@univale.br (senha: suporte123)");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error.message);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
