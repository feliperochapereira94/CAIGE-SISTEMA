import express from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissions,
  getUserProfile
} from '../controllers/userController.js';
import { requireAuth, requireSupervisor, requireProfessor } from '../middleware/auth.js';

const router = express.Router();

// Obter perfil do usuário logado (qualquer um autenticado)
router.get('/profile', requireAuth, getUserProfile);

// Obter permissões do usuário logado
router.get('/permissions', requireAuth, getUserPermissions);

// Listar usuários (apenas supervisor)
router.get('/', requireAuth, requireSupervisor, listUsers);

// Criar novo usuário (apenas supervisor)
router.post('/', requireAuth, requireSupervisor, createUser);

// Editar usuário (apenas supervisor)
router.put('/:id', requireAuth, requireSupervisor, updateUser);

// Desabilitar usuário definitivamente (apenas supervisor)
router.delete('/:id', requireAuth, requireSupervisor, deleteUser);

export default router;
