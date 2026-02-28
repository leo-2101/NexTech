/**
 * Modelo de Orden para NexTech Honduras
 * Define la estructura de los pedidos en MongoDB
 */

import mongoose from 'mongoose';

// Definir esquema de producto en orden
const orderProductSchema = new mongoose.Schema({
  // Referencia al producto
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  // Cantidad comprada
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },

  // Precio unitario en el momento de la compra
  precioUnitario: {
    type: Number,
    required: true
  }
});

// Definir esquema de orden
const orderSchema = new mongoose.Schema({
  // Cliente que realizó la orden
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Productos en la orden
  productos: [orderProductSchema],

  // Subtotal (sin envío)
  subtotal: {
    type: Number,
    required: true
  },

  // Costo de envío (L.0 Tegucigalpa/San Pedro Sula, L.120 resto)
  costoEnvio: {
    type: Number,
    default: 0
  },

  // Total final
  total: {
    type: Number,
    required: true
  },

  // Método de pago
  metodoPago: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia', 'contraentrega'],
    default: 'efectivo'
  },

  // Estado del pago
  estadoPago: {
    type: String,
    enum: ['pendiente', 'pagado', 'fallido', 'reembolsado'],
    default: 'pendiente'
  },

  // Estado del pedido
  estado: {
    type: String,
    enum: ['pendiente', 'en proceso', 'en camino', 'entregado', 'cancelado'],
    default: 'pendiente'
  },

  // Departamento de entrega
  departamentoEntrega: {
    type: String,
    required: true
  },

  // Dirección de entrega
  direccionEntrega: {
    tipo: { type: String, default: 'casa' },
    ciudad: { type: String, required: true },
    colonia: { type: String },
    calle: { type: String, required: true },
    numero: { type: String },
    referencia: { type: String }
  },

  // Historial de estados
  historialEstados: [{
    estado: {
      type: String,
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    nota: String
  }]
}, {
  timestamps: true
});

// Virtual para ID como string
orderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Middleware pre-save para agregar historial de estados
orderSchema.pre('save', function(next) {
  // Si es nuevo documento, agregar estado inicial al historial
  if (this.isNew) {
    this.historialEstados.push({
      estado: this.estado,
      nota: 'Orden creada'
    });
  }
  // Si el estado cambió, agregar al historial
  else if (this.isModified('estado')) {
    this.historialEstados.push({
      estado: this.estado,
      nota: `Estado cambiado a ${this.estado}`
    });
  }
  next();
});

// Índice para búsquedas
orderSchema.index({ cliente: 1, createdAt: -1 });
orderSchema.index({ estado: 1 });

// Exportar modelo
const Order = mongoose.model('Order', orderSchema);

export default Order;
