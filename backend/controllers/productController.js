/**
 * Controlador de Productos para NexTech Honduras
 * Maneja todas las operaciones CRUD de productos
 */

import Product from '../models/Product.js';

/**
 * Obtener todos los productos
 * GET /api/v1/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      categoria,
      marca,
      minPrice,
      maxPrice,
      search,
      destacado
    } = req.query;

    // Construir query
    let query = { activo: true };

    // Filtrar por categoría
    if (categoria) {
      query.categoria = categoria;
    }

    // Filtrar por marca
    if (marca) {
      query.marca = new RegExp(marca, 'i');
    }

    // Filtrar por rango de precio
    if (minPrice || maxPrice) {
      query.precio = {};
      if (minPrice) query.precio.$gte = Number(minPrice);
      if (maxPrice) query.precio.$lte = Number(maxPrice);
    }

    // Búsqueda por texto
    if (search) {
      query.$text = { $search: search };
    }

    // Filtrar productos destacados
    if (destacado === 'true') {
      query.destacado = true;
    }

    // Ejecutar query con paginación
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Contar total de documentos
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
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
 * Obtener un producto por ID
 * GET /api/v1/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener productos destacados
 * GET /api/v1/products/featured/list
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ activo: true, destacado: true })
      .sort('-createdAt')
      .limit(8);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener categorías disponibles
 * GET /api/v1/products/categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('categoria', { activo: true });

    // Obtener cantidad de productos por categoría
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ categoria: cat, activo: true });
        return { nombre: cat, count };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener marcas disponibles
 * GET /api/v1/products/brands
 */
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('marca', { activo: true });

    res.json({
      success: true,
      brands
    });
  } catch (error) {
    next(error);
  }
};

// ==================== Rutas Protegidas (Admin/Empleado) ====================

/**
 * Crear nuevo producto
 * POST /api/v1/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar producto
 * PUT /api/v1/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar producto (soft delete)
 * DELETE /api/v1/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct
};
