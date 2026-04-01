import bcryptjs from 'bcryptjs';
import pool from '../models/database.js';
import { logActivity } from '../utils/activityLogger.js';

const EMAIL_DOMAIN = '@univale.br';

// Listar usuários (apenas supervisor)
export async function listUsers(req, res) {
  try {
    const [users] = await pool.query(
      'SELECT id, email, role, sector, created_by, is_active, created_at FROM users WHERE is_hidden = FALSE OR is_hidden IS NULL'
    );
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
}

// Criar novo usuário (apenas supervisor)
export async function createUser(req, res) {
  try {
    const { email, password, role = 'PROFESSOR', sector } = req.body;
    const userEmail = req.user?.email;
    const userRole = req.user?.role;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    if (!String(email).toLowerCase().endsWith(EMAIL_DOMAIN)) {
      return res.status(400).json({ message: 'Use um e-mail institucional @univale.br' });
    }

    if (userRole !== 'SUPERVISOR') {
      return res.status(403).json({ message: 'Apenas supervisores podem criar usuários' });
    }

    // Validar role
    const validRoles = ['SUPERVISOR', 'PROFESSOR'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role inválido' });
    }

    // Buscar o usuário criador
    const [creator] = await pool.query('SELECT id FROM users WHERE email = ?', [userEmail]);
    const creatorId = creator[0]?.id;

    // Hash da senha
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Inserir novo usuário
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, sector, created_by, is_active) VALUES (?, ?, ?, ?, ?, TRUE)',
      [email, hashedPassword, role, sector || null, creatorId]
    );

    await logActivity(
      'Novo Cadastro',
      `Novo usuário criado: ${email} (${role})`,
      userEmail || 'Sistema'
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
}

// Editar usuário (apenas supervisor)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, role, sector, is_active } = req.body;
    const userEmail = req.user?.email;

    const [currentRows] = await pool.query(
      'SELECT email, role, sector, is_active FROM users WHERE id = ? LIMIT 1',
      [id]
    );

    if (!currentRows.length) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const currentUser = currentRows[0];

    const updates = [];
    const values = [];

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (role) {
      updates.push('role = ?');
      values.push(role);
    }
    if (sector !== undefined) {
      updates.push('sector = ?');
      values.push(sector || null);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    values.push(id);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const hasStatusChange = is_active !== undefined && Number(currentUser.is_active) !== Number(is_active);
    const activityType = hasStatusChange
      ? (Number(is_active) ? 'Reativação' : 'Inativação')
      : 'Edição';
    const actionText = hasStatusChange
      ? `Usuário ${email || currentUser.email} ${is_active ? 'ativado' : 'inativado'}`
      : `Usuário atualizado: ${email || currentUser.email}`;

    await logActivity(activityType, actionText, userEmail || 'Sistema');

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
}

// Desabilitar usuário de forma definitiva (sem excluir do banco)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email;

    const [userRows] = await pool.query(
      'SELECT email FROM users WHERE id = ? LIMIT 1',
      [id]
    );

    if (!userRows.length) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const deletedEmail = userRows[0].email;

    await pool.query(
      'UPDATE users SET is_active = FALSE, is_hidden = TRUE WHERE id = ?',
      [id]
    );

    await logActivity('Inativação', `Usuário desabilitado definitivamente: ${deletedEmail}`, userEmail || 'Sistema');

    res.json({ message: 'Usuário desabilitado definitivamente com sucesso' });
  } catch (error) {
    console.error('Erro ao desabilitar usuário:', error);
    res.status(500).json({ message: 'Erro ao desabilitar usuário' });
  }
}

// Obter permissões do usuário
export async function getUserPermissions(req, res) {
  try {
    const userEmail = req.user?.email || req.headers['x-user-email'];

    const [user] = await pool.query('SELECT role FROM users WHERE email = ?', [userEmail]);
    const [permissions] = await pool.query(
      'SELECT * FROM permissions WHERE role = ?',
      [user[0]?.role || 'PROFESSOR']
    );

    res.json(permissions[0] || {});
  } catch (error) {
    console.error('Erro ao obter permissões:', error);
    res.status(500).json({ message: 'Erro ao obter permissões' });
  }
}

// Obter perfil completo do usuário
export async function getUserProfile(req, res) {
  try {
    const userEmail = req.user?.email || req.headers['x-user-email'];

    const [user] = await pool.query(
      'SELECT id, email, role, sector, created_at FROM users WHERE email = ?',
      [userEmail]
    );

    if (!user[0]) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const [permissions] = await pool.query(
      'SELECT * FROM permissions WHERE role = ?',
      [user[0].role]
    );

    res.json({
      user: user[0],
      permissions: permissions[0] || {}
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ message: 'Erro ao obter perfil' });
  }
}
