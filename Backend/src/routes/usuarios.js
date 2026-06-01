import express from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissions,
  getUserProfile
} from '../controllers/usuariosController.js';
import { requireAuth, requireSupervisor } from '../controllers/acessoController.js';

const router = express.Router();

// Obter perfil do usuÃ¡rio logado (qualquer um autenticado)
router.get('/perfil', requireAuth, getUserProfile);

// Obter permissÃµes do usuÃ¡rio logado
router.get('/permissoes', requireAuth, getUserPermissions);

// Listar usuÃ¡rios (apenas supervisor)
router.get('/', requireAuth, requireSupervisor, listUsers);

// Criar novo usuÃ¡rio (apenas supervisor)
router.post('/', requireAuth, requireSupervisor, createUser);

// Editar usuÃ¡rio (apenas supervisor)
router.put('/:id', requireAuth, requireSupervisor, updateUser);

// Desabilitar usuÃ¡rio definitivamente (apenas supervisor)
router.delete('/:id', requireAuth, requireSupervisor, deleteUser);

export default router;

