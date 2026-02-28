/**
 * Modelo de Usuario para NexTech Honduras
 * Define la estructura de los datos de usuario en MongoDB
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Definir esquema de usuario
const userSchema = new mongoose.Schema({
  // Nombre completo del usuario
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },

  // Correo electrónico (único)
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },

  // Contraseña (se encripta)
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    select: false
  },

  // Teléfono de contacto
  telefono: {
    type: String,
    trim: true
  },

  // Rol del usuario en el sistema
  rol: {
    type: String,
    enum: ['cliente', 'admin', 'empleado'],
    default: 'cliente'
  },

  // Dirección del usuario
  direccion: {
    tipo: { type: String, default: 'casa' },
    ciudad: { type: String, trim: true },
    colonia: { type: String, trim: true },
    calle: { type: String, trim: true },
    numero: { type: String, trim: true },
    referencia: { type: String, trim: true }
  },

  // Departamento
  departamento: {
    type: String,
    trim: true
  },

  // Estado de la cuenta
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual para obtener el ID como string
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Middleware PRE: Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña fue modificada
  if (!this.isModified('password')) {
    return next();
  }
  
  // Encriptar contraseña con bcrypt (12 rounds)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para convertir a JSON sin la contraseña
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Exportar modelo
const User = mongoose.model('User', userSchema);

export default User;
