/**
 * Controlador de Autenticación para NexTech Honduras
 * Maneja el registro, login y gestión de tokens
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Registrar un nuevo usuario
 * POST /api/v1/auth/register
 */
export const registro = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono, direccion, departamento } = req.body;

    // Normalizar email: lowercase y trim
    const emailNormalizado = email.toLowerCase().trim();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: emailNormalizado });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password,
      telefono: telefono?.trim(),
      direccion,
      departamento,
      rol: 'cliente' // Por defecto es cliente
    });

    // Generar token
    const token = generateToken(user);

    // Responder sin la contraseña
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Iniciar sesión
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionaron credenciales
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña'
      });
    }

    // Normalizar email: lowercase y trim
    const emailNormalizado = email.toLowerCase().trim();

    // Buscar usuario incluyendo la contraseña
    const user = await User.findOne({ email: emailNormalizado }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    // Verificar contraseña usando el método compararPassword
    const isMatch = await user.compararPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Generar token
    const token = generateToken(user);

    // Responder sin la contraseña
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener datos del usuario actual
 * GET /api/v1/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
        direccion: user.direccion,
        departamento: user.departamento
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cerrar sesión (solo del lado del cliente)
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
};

export default {
  registro,
  login,
  getMe,
  logout
};
