/**
 * Controlador de Usuarios para NexTech Honduras
 * Maneja la gestión de usuarios (solo admin)
 */

import User from '../models/User.js';

/**
 * Obtener todos los usuarios (solo admin)
 * GET /api/v1/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, rol, activo } = req.query;

    let query = {};

    if (rol) {
      query.rol = rol;
    }

    if (activo !== undefined) {
      query.activo = activo === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un usuario por ID (solo admin)
 * GET /api/v1/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar usuario (propio o admin)
 * PUT /api/v1/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;

    // Verificar autorización
    // Usuarios pueden editar su propio perfil
    // Admins pueden editar cualquier usuario
    if (req.user.id !== id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para editar este usuario'
      });
    }

    // Si no es admin, no puede cambiar rol
    let updateData = { nombre, telefono, direccion };
    
    if (req.user.rol === 'admin' && req.body.rol) {
      updateData.rol = req.body.rol;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cambiar contraseña
 * PUT /api/v1/users/:id/password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Verificar autorización
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para cambiar esta contraseña'
      });
    }

    // Obtener usuario con contraseña
    const user = await User.findById(id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Activar/desactivar usuario (solo admin)
 * PUT /api/v1/users/:id/status
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // No permitir desactivarse a sí mismo
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivarte a ti mismo'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Toggle estado
    user.activo = !user.activo;
    await user.save();

    res.json({
      success: true,
      message: user.activo ? 'Usuario activado' : 'Usuario desactivado',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        activo: user.activo
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar usuario (solo admin)
 * DELETE /api/v1/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // No permitirse eliminarse a sí mismo
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminarte a ti mismo'
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener estadísticas de usuarios
 * GET /api/v1/users/stats
 */
export const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ activo: true });

    const usersByRole = await User.aggregate([
      { $group: { _id: '$rol', count: { $sum: 1 } } }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole,
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUserById,
  updateUser,
  changePassword,
  toggleUserStatus,
  deleteUser,
  getUserStats
};
