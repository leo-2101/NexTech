/**
 * Rutas de Órdenes para NexTech Honduras
 * /api/v1/orders
 */

import express from 'express';
import { 
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizarEstado,
  cancelar
} from '../controllers/orderController.js';
import { authenticate, permitirRoles } from '../middleware/auth.js';

const router = express.Router();

// ==================== Rutas de Cliente ====================

/**
 * GET /api/v1/orders
 * Obtener órdenes del usuario actual
 */
router.get('/', authenticate, obtenerTodos);

/**
 * GET /api/v1/orders/:id
 * Obtener una orden por ID
 */
router.get('/:id', authenticate, obtenerPorId);

/**
 * POST /api/v1/orders
 * Crear nueva orden
 */
router.post('/', authenticate, crear);

/**
 * PUT /api/v1/orders/:id/cancelar
 * Cancelar orden
 */
router.put('/:id/cancelar', authenticate, cancelar);

// ==================== Rutas de Admin/Empleado ====================

/**
 * PUT /api/v1/orders/:id/estado
 * Actualizar estado de orden (admin/empleado)
 */
router.put(
  '/:id/estado', 
  authenticate, 
  permitirRoles('admin', 'empleado'), 
  actualizarEstado
);

export default router;
