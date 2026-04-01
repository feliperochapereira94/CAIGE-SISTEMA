import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function checkAndFixPassword() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "caige",
  });

  try {
    // Ver qual é o hash armazenado
    const [rows] = await connection.query(
      "SELECT email, password_hash FROM users WHERE email = ?",
      ["suportecaige@univale.br"]
    );

    if (rows.length === 0) {
      console.log("❌ Usuário não encontrado!");
      return;
    }

    const storedHash = rows[0].password_hash;
    console.log("📧 Email:", rows[0].email);
    console.log("🔐 Hash armazenado:", storedHash);

    // Testar se este hash corresponde à senha "123456"
    const isValid = await bcrypt.compare("123456", storedHash);
    console.log("✓ Teste bcrypt.compare('123456', hash):", isValid);

    if (!isValid) {
      console.log("\n⚠️ Hash inválido! Gerando novo hash para 123456...");
      const newHash = await bcrypt.hash("123456", 10);
      console.log("🔐 Novo hash:", newHash);

      // Atualizar no banco
      await connection.query(
        "UPDATE users SET password_hash = ? WHERE email = ?",
        [newHash, "suportecaige@univale.br"]
      );
      console.log("✅ Senha atualizada com sucesso!");
    } else {
      console.log("✅ Senha está correta!");
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await connection.end();
  }
}

checkAndFixPassword();
