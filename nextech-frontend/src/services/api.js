import axios from 'axios'

/**
 * API Service - Configuración de Axios para comunicación con el backend
 * Base URL: http://localhost:5000/api/v1
 */

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============ PRODUCTOS ============

// Obtener todos los productos
export const getProducts = async (params = {}) => {
  const response = await axiosInstance.get('/products', { params })
  return response.data
}

// Obtener producto por ID
export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`)
  return response.data
}

// Obtener categorías
export const getCategories = async () => {
  const response = await axiosInstance.get('/products/categories')
  return response.data
}

// Crear producto (admin)
export const createProduct = async (data) => {
  const response = await axiosInstance.post('/products', data)
  return response.data
}

// Actualizar producto (admin)
export const updateProduct = async (id, data) => {
  const response = await axiosInstance.put(`/products/${id}`, data)
  return response.data
}

// Eliminar producto (admin)
export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`)
  return response.data
}

// ============ PEDIDOS ============

// Obtener pedidos del cliente
export const getOrders = async () => {
  const response = await axiosInstance.get('/orders')
  return response.data
}

// Obtener pedido por ID
export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`)
  return response.data
}

// Crear orden
export const createOrder = async (data) => {
  const response = await axiosInstance.post('/orders', data)
  return response.data
}

// Actualizar estado del pedido (admin/empleado)
export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/orders/${id}/status`, { status })
  return response.data
}

// Subir comprobante de pago
export const uploadPaymentProof = async (formData) => {
  const response = await axiosInstance.post('/orders/upload-proof', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// ============ AUTENTICACIÓN ============

// Login
export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password })
  return response.data
}

// Registro
export const register = async (data) => {
  const response = await axiosInstance.post('/auth/register', data)
  return response.data
}

// Obtener usuario actual
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me')
  return response.data
}

// ============ USUARIOS ============

// Obtener todos los usuarios (admin)
export const getUsers = async () => {
  const response = await axiosInstance.get('/users')
  return response.data
}

// Actualizar usuario (admin)
export const updateUser = async (id, data) => {
  const response = await axiosInstance.put(`/users/${id}`, data)
  return response.data
}

// Eliminar usuario (admin)
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`)
  return response.data
}

// ============ DASHBOARD (Admin) ============

// Obtener estadísticas del dashboard
export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/dashboard/stats')
  return response.data
}

// ============ CONTACTO ============

// Enviar mensaje de contacto
export const sendContactMessage = async (data) => {
  const response = await axiosInstance.post('/contact', data)
  return response.data
}

// Exportar instancia para uso directo
export { axiosInstance }
