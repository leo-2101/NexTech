/**
 * Middleware de Autenticación para NexTech Honduras
 * Protege rutas verificando el token JWT
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Verifica que el usuario esté autenticado
 * Agrega los datos del usuario a req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extraer token del header "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Por favor inicia sesión'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar datos del usuario a req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor inicia sesión nuevamente'
      });
    }

    next(error);
  }
};

/**
 * Verifica que el usuario tenga el rol requerido
 * @param {...string} roles - Roles permitidos
 */
export const permitirRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

// Alias para compatibilidad
export const authorize = permitirRoles;

export default {
  authenticate,
  permitirRoles,
  authorize
};
