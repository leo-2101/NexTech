import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Package, ShoppingCart, Clock, Truck, CheckCircle,
  Search, RefreshCw, Eye, Edit
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getOrders, updateOrderStatus } from '../services/api'
import './EmployeeDashboard.css'

/**
 * EmployeeDashboard - Panel de empleado
 * Similar al admin pero con permisos limitados
 * Solo puede gestionar pedidos
 */
function EmployeeDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Cargar pedidos
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getOrders()
      setOrders(response.data.orders || response.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Actualizar estado de pedido
  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success('Estado actualizado')
      fetchOrders()
    } catch (error) {
      toast.error('Error al actualizar estado')
    }
  }

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    return matchesSearch && order.estado === filter
  })

  // Stats
  const stats = {
    total: orders.length,
    pendientes: orders.filter(o => o.estado === 'pendiente').length,
    proceso: orders.filter(o => o.estado === 'en_proceso').length,
    camino: orders.filter(o => o.estado === 'en_camino').length,
    entregados: orders.filter(o => o.estado === 'entregado').length
  }

  // Formato de moneda
  const formatCurrency = (value) => `L. ${(value || 0).toLocaleString('es-HN', { minimumFractionDigits: 2 })}`

  if (loading) {
    return (
      <div className="employee-page">
        <div className="container">
          <div className="employee-loading">
            <RefreshCw className="spin" size={32} />
            <p>Cargando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="employee-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="employee-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Panel de Empleado</h1>
            <p>Gestiona los pedidos de la tienda</p>
          </div>
          <button className="employee-refresh" onClick={fetchOrders}>
            <RefreshCw size={18} />
            Actualizar
          </button>
        </motion.div>

        {/* Stats */}
        <div className="employee-stats">
          <motion.div 
            className="employee-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ShoppingCart size={20} />
            <div>
              <span className="employee-stat__value">{stats.total}</span>
              <span className="employee-stat__label">Total</span>
            </div>
          </motion.div>

          <motion.div 
            className="employee-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Clock size={20} />
            <div>
              <span className="employee-stat__value">{stats.pendientes}</span>
              <span className="employee-stat__label">Pendientes</span>
            </div>
          </motion.div>

          <motion.div 
            className="employee-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Package size={20} />
            <div>
              <span className="employee-stat__value">{stats.proceso}</span>
              <span className="employee-stat__label">En Proceso</span>
            </div>
          </motion.div>

          <motion.div 
            className="employee-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Truck size={20} />
            <div>
              <span className="employee-stat__value">{stats.camino}</span>
              <span className="employee-stat__label">En Camino</span>
            </div>
          </motion.div>

          <motion.div 
            className="employee-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle size={20} />
            <div>
              <span className="employee-stat__value">{stats.entregados}</span>
              <span className="employee-stat__label">Entregados</span>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="employee-filters">
          <div className="employee-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por ID o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="employee-filter-buttons">
            <button 
              className={`employee-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            <button 
              className={`employee-filter-btn ${filter === 'pendiente' ? 'active' : ''}`}
              onClick={() => setFilter('pendiente')}
            >
              Pendientes
            </button>
            <button 
              className={`employee-filter-btn ${filter === 'en_proceso' ? 'active' : ''}`}
              onClick={() => setFilter('en_proceso')}
            >
              En Proceso
            </button>
            <button 
              className={`employee-filter-btn ${filter === 'en_camino' ? 'active' : ''}`}
              onClick={() => setFilter('en_camino')}
            >
              En Camino
            </button>
            <button 
              className={`employee-filter-btn ${filter === 'entregado' ? 'active' : ''}`}
              onClick={() => setFilter('entregado')}
            >
              Entregados
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <motion.div 
          className="employee-table-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <table className="employee-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Cambiar Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>
                    <span className="order-id">#{order._id?.slice(-6)}</span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.customer?.name || 'Cliente'}</strong>
                      <span>{order.customer?.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="address-info">
                      <span>{order.customer?.city}, {order.customer?.department}</span>
                    </div>
                  </td>
                  <td>
                    <span className="items-count">{order.items?.length || 0} productos</span>
                  </td>
                  <td>
                    <span className="order-total">{formatCurrency(order.total)}</span>
                  </td>
                  <td>
                    <span className={`status-badge status--${order.estado}`}>
                      {order.estado?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('es-HN')}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.estado}
                      onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="en_camino">En Camino</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="employee-empty">
              <Package size={48} />
              <p>No se encontraron pedidos</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
