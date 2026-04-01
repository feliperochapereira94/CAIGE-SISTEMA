import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { info, error, success } from "../utils/logger.js";

dotenv.config();

info(`Conectando ao banco: ${process.env.DB_HOST} | User: ${process.env.DB_USER} | DB: ${process.env.DB_NAME}`);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const HARD_DELETE_PATTERN = /\bDELETE\s+FROM\b/i;

function assertNoHardDelete(sql) {
  if (typeof sql !== "string") return;

  if (HARD_DELETE_PATTERN.test(sql)) {
    const msg = "Operacao bloqueada: exclusao fisica via SQL (DELETE FROM) nao e permitida neste projeto.";
    throw new Error(msg);
  }
}

const guardedPool = new Proxy(pool, {
  get(target, prop) {
    if (prop === "query" || prop === "execute") {
      return async (...args) => {
        assertNoHardDelete(args[0]);
        return target[prop](...args);
      };
    }

    const value = target[prop];
    return typeof value === "function" ? value.bind(target) : value;
  }
});

// Testar conexao
pool.getConnection()
  .then((connection) => {
    success("Conexao com banco de dados estabelecida com sucesso!");
    connection.release();
  })
  .catch((err) => {
    error("Erro ao conectar com o banco de dados", err);
  });

export default guardedPool;
