import pool from '../models/database.js';
import { resolvePermissionColumn } from '../utils/schemaNames.js';

// Middleware para verificar autenticação
export async function requireAuth(req, res, next) {
  try {
    const userEmail = req.headers['x-user-email'];

    if (!userEmail) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    // Buscar usuário no banco
    const [users] = await pool.query('SELECT id, email, role FROM users WHERE email = ?', [userEmail]);

    if (!users[0]) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Erro em autenticação:', error);
    res.status(500).json({ message: 'Erro ao verificar autenticação' });
  }
}

// Middleware para verificar permissão específica
export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      const permissionColumn = await resolvePermissionColumn(permission);

      const [perms] = await pool.query(
        `SELECT ${permissionColumn} FROM permissions WHERE role = ?`,
        [req.user.role]
      );

      if (!perms[0] || !perms[0][permissionColumn]) {
        return res.status(403).json({ message: 'Permissão negada' });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      res.status(500).json({ message: 'Erro ao verificar permissão' });
    }
  };
}

// Middleware para verificar se é supervisor
export async function requireSupervisor(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ message: 'Apenas supervisores podem acessar' });
    }
    next();
  } catch (error) {
    console.error('Erro ao verificar supervisor:', error);
    res.status(500).json({ message: 'Erro ao verificar supervisor' });
  }
}

// Middleware para verificar se é professor ou supervisor
export async function requireProfessor(req, res, next) {
  try {
    if (!req.user || !['SUPERVISOR', 'PROFESSOR'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Apenas professores podem acessar' });
    }
    next();
  } catch (error) {
    console.error('Erro ao verificar professor:', error);
    res.status(500).json({ message: 'Erro ao verificar professor' });
  }
}
