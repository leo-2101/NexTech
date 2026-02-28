/**
 * Rutas de Usuarios para NexTech Honduras
 * /api/v1/users
 */

import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  changePassword,
  toggleUserStatus,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// ==================== Rutas Protegidas ====================

/**
 * GET /api/v1/users
 * Obtener todos los usuarios (solo admin)
 */
router.get('/', authenticate, authorize('admin'), getUsers);

/**
 * GET /api/v1/users/stats
 * Obtener estadísticas de usuarios (solo admin)
 */
router.get('/stats', authenticate, authorize('admin'), getUserStats);

/**
 * GET /api/v1/users/:id
 * Obtener un usuario por ID
 */
router.get('/:id', authenticate, getUserById);

/**
 * PUT /api/v1/users/:id
 * Actualizar usuario
 */
router.put('/:id', authenticate, updateUser);

/**
 * PUT /api/v1/users/:id/password
 * Cambiar contraseña
 */
router.put('/:id/password', authenticate, changePassword);

/**
 * PUT /api/v1/users/:id/status
 * Activar/desactivar usuario (solo admin)
 */
router.put('/:id/status', authenticate, authorize('admin'), toggleUserStatus);

/**
 * DELETE /api/v1/users/:id
 * Eliminar usuario (solo admin)
 */
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
