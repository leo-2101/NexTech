/**
 * Controlador de Órdenes para NexTech Honduras
 * Maneja todas las operaciones de pedidos
 */

import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Ciudades con envío gratis
const CIUDADES_ENVIO_GRATIS = ['tegucigalpa', 'san pedro sula'];

/**
 * Obtener todas las órdenes del usuario
 * GET /api/v1/orders
 * Si rol=cliente: filtra por su ID
 * Si rol=admin: devuelve todas las órdenes
 */
export const obtenerTodos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, estado } = req.query;

    // Construir query según el rol
    let query = {};
    
    // Si es cliente, solo ve sus órdenes
    if (req.user.rol === 'cliente') {
      query.cliente = req.user.id;
    }
    
    // Filtrar por estado si se proporciona
    if (estado) {
      query.estado = estado;
    }

    // Obtener órdenes con populate
    const orders = await Order.find(query)
      .populate('productos.producto')
      .populate('cliente')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
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
 * Obtener una orden por ID
 * GET /api/v1/orders/:id
 */
export const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('productos.producto')
      .populate('cliente');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Verificar que el usuario sea propietario o admin/empleado
    if (order.cliente._id.toString() !== req.user.id && 
        !['admin', 'empleado'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nueva orden
 * POST /api/v1/orders
 * Envío gratis Tegucigalpa/San Pedro Sula (L.0), resto L.120
 */
export const crear = async (req, res, next) => {
  try {
    const { productos, departamentoEntrega, direccionEntrega, metodoPago, notas } = req.body;

    // Validar que haya productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El carrito está vacío'
      });
    }

    // Validar datos de entrega
    if (!departamentoEntrega || !direccionEntrega?.ciudad || !direccionEntrega?.calle) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrega incompletos'
      });
    }

    // Calcular subtotal y validar stock
    let subtotal = 0;
    const orderProducts = [];

    for (const item of productos) {
      const product = await Product.findById(item.producto);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Producto no encontrado: ${item.producto}`
        });
      }

      if (product.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para: ${product.nombre}`
        });
      }

      const itemTotal = product.precio * item.cantidad;
      subtotal += itemTotal;

      orderProducts.push({
        producto: product._id,
        cantidad: item.cantidad,
        precioUnitario: product.precio
      });

      // Reducir stock
      product.stock -= item.cantidad;
      await product.save();
    }

    // Calcular costo de envío
    // L.0 para Tegucigalpa/San Pedro Sula, L.120 para el resto
    const ciudad = direccionEntrega.ciudad.toLowerCase().trim();
    const costoEnvio = CIUDADES_ENVIO_GRATIS.includes(ciudad) ? 0 : 120;

    // Calcular total
    const total = subtotal + costoEnvio;

    // Crear orden
    const order = await Order.create({
      cliente: req.user.id,
      productos: orderProducts,
      subtotal,
      costoEnvio,
      total,
      metodoPago: metodoPago || 'efectivo',
      estado: 'pendiente',
      estadoPago: 'pendiente',
      departamentoEntrega,
      direccionEntrega,
      notas
    });

    // Poblar datos relacionados
    const orderPopulated = await Order.findById(order._id)
      .populate('productos.producto')
      .populate('cliente');

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      order: orderPopulated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar estado de orden
 * PUT /api/v1/orders/:id/estado
 * Agrega al historial de estados
 */
export const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, nota } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Actualizar estado
    order.estado = estado;

    // Agregar al historial de estados
    order.historialEstados.push({
      estado,
      nota: nota || `Estado cambiado a ${estado}`
    });

    await order.save();

    // Devolver orden poblada
    const orderUpdated = await Order.findById(id)
      .populate('productos.producto')
      .populate('cliente');

    res.json({
      success: true,
      message: 'Estado de orden actualizado',
      order: orderUpdated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancelar orden
 * PUT /api/v1/orders/:id/cancelar
 */
export const cancelar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Verificar que el usuario sea propietario
    if (order.cliente.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Solo se puede cancelar si está pendiente o en proceso
    if (!['pendiente', 'en proceso'].includes(order.estado)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar esta orden'
      });
    }

    // Restaurar stock
    for (const item of order.productos) {
      await Product.findByIdAndUpdate(item.producto, {
        $inc: { stock: item.cantidad }
      });
    }

    // Actualizar estado
    order.estado = 'cancelado';
    order.historialEstados.push({
      estado: 'cancelado',
      nota: 'Orden cancelada por el cliente'
    });
    await order.save();

    res.json({
      success: true,
      message: 'Orden cancelada exitosamente',
      order
    });
  } catch (error) {
    next(error);
  }
};

export default {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizarEstado,
  cancelar
};
