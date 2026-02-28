/**
 * Modelo de Producto para NexTech Honduras
 * Define la estructura de los productos en MongoDB
 */

import mongoose from 'mongoose';

// Definir esquema de producto
const productSchema = new mongoose.Schema({
  // Nombre del producto
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },

  // Descripción detallada del producto
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },

  // Precio del producto
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio']
  },

  // Precio anterior (para descuentos)
  precioAnterior: {
    type: Number
  },

  // Descuento porcentual (calculado)
  descuento: {
    type: Number,
    default: 0
  },

  // Categoría del producto
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria']
  },

  // Marca del producto
  marca: {
    type: String,
    required: true,
    trim: true
  },

  // Stock disponible
  stock: {
    type: Number,
    required: true,
    default: 0
  },

  // Imagen principal del producto
  imagen: {
    type: String,
    default: '/images/product-placeholder.jpg'
  },

  // Producto destacado
  destacado: {
    type: Boolean,
    default: false
  },

  // Rating del producto
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },

  // Producto activo (para soft delete)
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual para calcular descuento automáticamente
productSchema.virtual('descuentoPorcentaje').get(function() {
  if (this.precioAnterior && this.precioAnterior > this.precio) {
    return Math.round(((this.precioAnterior - this.precio) / this.precioAnterior) * 100);
  }
  return 0;
});

// Índice para búsquedas
productSchema.index({ nombre: 'text', descripcion: 'text', marca: 'text' });

// Exportar modelo
const Product = mongoose.model('Product', productSchema);

export default Product;
