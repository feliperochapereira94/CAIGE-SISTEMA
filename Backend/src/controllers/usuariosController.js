import bcryptjs from 'bcryptjs';
import pool from '../models/database.js';
import { logActivity } from '../models/registroAtividadeModel.js';

const EMAIL_DOMAIN = '@univale.br';

// Listar usuÃ¡rios (apenas supervisor)
export async function listUsers(req, res) {
  try {
    const [users] = await pool.query(
      'SELECT id, email, papel AS role, setor AS sector, criado_por AS created_by, ativo AS is_active, criado_em AS created_at FROM usuarios WHERE oculto = FALSE OR oculto IS NULL'
    );
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuÃ¡rios:', error);
    res.status(500).json({ message: 'Erro ao listar usuÃ¡rios' });
  }
}

// Criar novo usuÃ¡rio (apenas supervisor)
export async function createUser(req, res) {
  try {
    const { email, password, role = 'PROFESSOR', sector } = req.body;
    const userEmail = req.user?.email;
    const userRole = req.user?.role;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha sÃ£o obrigatÃ³rios' });
    }

    if (!String(email).toLowerCase().endsWith(EMAIL_DOMAIN)) {
      return res.status(400).json({ message: 'Use um e-mail institucional @univale.br' });
    }

    if (userRole !== 'SUPERVISOR') {
      return res.status(403).json({ message: 'Apenas supervisores podem criar usuÃ¡rios' });
    }

    // Validar role
    const validRoles = ['SUPERVISOR', 'PROFESSOR'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role invÃ¡lido' });
    }

    // Buscar o usuÃ¡rio criador
    const [creator] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [userEmail]);
    const creatorId = creator[0]?.id;

    // Hash da senha
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Inserir novo usuÃ¡rio
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, senha_hash, papel, setor, criado_por, ativo) VALUES (?, ?, ?, ?, ?, TRUE)',
      [email, hashedPassword, role, sector || null, creatorId]
    );

    await logActivity(
      'Usuário',
      `Novo usuário criado: ${email} (${role})`,
      userEmail || 'Sistema'
    );

    res.status(201).json({
      message: 'UsuÃ¡rio criado com sucesso',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar usuÃ¡rio:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email jÃ¡ cadastrado' });
    }
    res.status(500).json({ message: 'Erro ao criar usuÃ¡rio' });
  }
}

// Editar usuÃ¡rio (apenas supervisor)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, role, sector, is_active } = req.body;
    const userEmail = req.user?.email;

    const [currentRows] = await pool.query(
      'SELECT email, papel AS role, setor AS sector, ativo AS is_active FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );

    if (!currentRows.length) {
      return res.status(404).json({ message: 'UsuÃ¡rio nÃ£o encontrado' });
    }

    const currentUser = currentRows[0];

    const updates = [];
    const values = [];

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (role) {
      updates.push('papel = ?');
      values.push(role);
    }
    if (sector !== undefined) {
      updates.push('setor = ?');
      values.push(sector || null);
    }
    if (is_active !== undefined) {
      updates.push('ativo = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    values.push(id);

    await pool.query(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const hasStatusChange = is_active !== undefined && Number(currentUser.is_active) !== Number(is_active);
    const activityType = 'Usuário';
    const actionText = hasStatusChange
      ? `Usuário ${email || currentUser.email} ${is_active ? 'ativado' : 'inativado'}`
      : `Usuário atualizado: ${email || currentUser.email}`;

    await logActivity(activityType, actionText, userEmail || 'Sistema');

    res.json({ message: 'UsuÃ¡rio atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuÃ¡rio:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuÃ¡rio' });
  }
}

// Desabilitar usuÃ¡rio de forma definitiva (sem excluir do banco)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email;

    const [userRows] = await pool.query(
      'SELECT email FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );

    if (!userRows.length) {
      return res.status(404).json({ message: 'UsuÃ¡rio nÃ£o encontrado' });
    }

    const deletedEmail = userRows[0].email;

    await pool.query(
      'UPDATE usuarios SET ativo = FALSE, oculto = TRUE WHERE id = ?',
      [id]
    );

    await logActivity('Usuário', `Usuário desabilitado definitivamente: ${deletedEmail}`, userEmail || 'Sistema');

    res.json({ message: 'UsuÃ¡rio desabilitado definitivamente com sucesso' });
  } catch (error) {
    console.error('Erro ao desabilitar usuÃ¡rio:', error);
    res.status(500).json({ message: 'Erro ao desabilitar usuÃ¡rio' });
  }
}

// Obter permissÃµes do usuÃ¡rio
export async function getUserPermissions(req, res) {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: 'Nao autenticado' });
    }

    const [user] = await pool.query('SELECT papel AS role FROM usuarios WHERE email = ?', [userEmail]);
    const [permissions] = await pool.query(
      'SELECT * FROM permissoes WHERE papel = ?',
      [user[0]?.role || 'PROFESSOR']
    );

    res.json(permissions[0] || {});
  } catch (error) {
    console.error('Erro ao obter permissÃµes:', error);
    res.status(500).json({ message: 'Erro ao obter permissÃµes' });
  }
}

// Obter perfil completo do usuÃ¡rio
export async function getUserProfile(req, res) {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ message: 'Nao autenticado' });
    }

    const [user] = await pool.query(
      'SELECT id, email, papel AS role, setor AS sector, criado_em AS created_at FROM usuarios WHERE email = ?',
      [userEmail]
    );

    if (!user[0]) {
      return res.status(404).json({ message: 'UsuÃ¡rio nÃ£o encontrado' });
    }

    const [permissions] = await pool.query(
      'SELECT * FROM permissoes WHERE papel = ?',
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

