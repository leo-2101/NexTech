/**
 * Rutas de Autenticación para NexTech Honduras
 * /api/v1/auth
 */

import express from 'express';
import { registro, login, getMe, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', registro);

/**
 * POST /api/v1/auth/login
 * Iniciar sesión
 */
router.post('/login', login);

/**
 * GET /api/v1/auth/me
 * Obtener usuario actual (requiere autenticación)
 */
router.get('/me', authenticate, getMe);

/**
 * POST /api/v1/auth/logout
 * Cerrar sesión
 */
router.post('/logout', authenticate, logout);

export default router;
