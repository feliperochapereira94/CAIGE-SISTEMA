import bcrypt from "bcryptjs";
import pool from "../models/database.js";

const EMAIL_DOMAIN = "@univale.br";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Informe email e senha." });
  }

  if (!email.toLowerCase().endsWith(EMAIL_DOMAIN)) {
    return res
      .status(403)
      .json({ message: "Use o e-mail institucional @univale.br." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, password_hash, name, last_login FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Atualizar último login
    const now = new Date();
    await pool.query(
      "UPDATE users SET last_login = ? WHERE id = ?",
      [now, user.id]
    );

    return res.status(200).json({ 
      message: "Login autorizado.",
      name: user.name || email.split('@')[0],
      lastLogin: user.last_login
    });
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

export async function changePassword(req, res) {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Informe todos os dados." });
    }

    const [rows] = await pool.query(
      "SELECT id, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: "Senha atual incorreta." });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newPasswordHash, user.id]
    );

    return res.status(200).json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

export async function getUserProfile(req, res) {
  try {
    const userEmail = req.headers['x-user-email'];

    if (!userEmail) {
      return res.status(401).json({ message: "Não autenticado." });
    }

    const [rows] = await pool.query(
      "SELECT id, email, name, role, sector, last_login FROM users WHERE email = ? LIMIT 1",
      [userEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const user = rows[0];
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name || userEmail.split('@')[0],
      role: user.role,
      sector: user.sector,
      course: user.sector,
      lastLogin: user.last_login
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const userEmail = req.headers['x-user-email'];
    const { name } = req.body;

    if (!userEmail) {
      return res.status(401).json({ message: "Não autenticado." });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: "Nome não pode estar vazio." });
    }

    const [updatedRows] = await pool.query(
      "UPDATE users SET name = ? WHERE email = ?",
      [name.trim(), userEmail]
    );

    if (updatedRows.affectedRows === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Perfil atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
