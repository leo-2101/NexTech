/**
 * Rutas de Productos para NexTech Honduras
 * /api/v1/products
 */

import express from 'express';
import { 
  getProducts, 
  getProductById, 
  getFeaturedProducts, 
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct 
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// ==================== Rutas Públicas ====================

/**
 * GET /api/v1/products
 * Obtener todos los productos (con filtros y paginación)
 */
router.get('/', getProducts);

/**
 * GET /api/v1/products/featured/list
 * Obtener productos destacados
 */
router.get('/featured/list', getFeaturedProducts);

/**
 * GET /api/v1/products/categories
 * Obtener categorías disponibles
 */
router.get('/categories', getCategories);

/**
 * GET /api/v1/products/brands
 * Obtener marcas disponibles
 */
router.get('/brands', getBrands);

/**
 * GET /api/v1/products/:id
 * Obtener un producto por ID
 */
router.get('/:id', getProductById);

// ==================== Rutas Protegidas (Admin/Empleado) ====================

/**
 * POST /api/v1/products
 * Crear nuevo producto
 */
router.post('/', authenticate, authorize('admin', 'empleado'), createProduct);

/**
 * PUT /api/v1/products/:id
 * Actualizar producto
 */
router.put('/:id', authenticate, authorize('admin', 'empleado'), updateProduct);

/**
 * DELETE /api/v1/products/:id
 * Eliminar producto (soft delete)
 */
router.delete('/:id', authenticate, authorize('admin', 'empleado'), deleteProduct);

export default router;
