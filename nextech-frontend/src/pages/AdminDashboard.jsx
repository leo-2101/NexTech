import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Package, Users, DollarSign, TrendingUp, TrendingDown,
  ShoppingCart, ArrowUpRight, ArrowDownRight, 
  RefreshCw, Plus, Eye, Edit, Trash2, Search
} from 'lucide-react'
import toast from 'react-hot-toast'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { 
  getDashboardStats, getOrders, getProducts, 
  getUsers, updateOrderStatus, deleteProduct 
} from '../services/api'
import './AdminDashboard.css'

/**
 * AdminDashboard - Panel de administración
 * Gráficos de ventas, gestión de pedidos, productos y usuarios
 */
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Cargar datos del dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Obtener datos en paralelo
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        getDashboardStats(),
        getOrders(),
        getProducts(),
        getUsers()
      ])

      setStats(statsRes.data)
      setOrders(ordersRes.data.orders || ordersRes.data || [])
      setProducts(productsRes.data.products || productsRes.data || [])
      setUsers(usersRes.data.users || usersRes.data || [])

      toast.success('Dashboard actualizado')
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Actualizar estado de pedido
  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success('Estado actualizado')
      fetchDashboardData()
    } catch (error) {
      toast.error('Error al actualizar estado')
    }
  }

  // Eliminar producto
  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    
    try {
      await deleteProduct(productId)
      toast.success('Producto eliminado')
      fetchDashboardData()
    } catch (error) {
      toast.error('Error al eliminar producto')
    }
  }

  // Colores para gráficos
  const COLORS = ['#06b6d4', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444']

  // Datos para gráfico de ventas por mes
  const monthlyData = stats?.monthlySales || [
    { month: 'Ene', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Abr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 },
  ]

  // Datos para gráfico de pedidos por estado
  const orderStatusData = [
    { name: 'Pendientes', value: orders.filter(o => o.estado === 'pendiente').length, color: '#f59e0b' },
    { name: 'En Proceso', value: orders.filter(o => o.estado === 'en_proceso').length, color: '#8b5cf6' },
    { name: 'En Camino', value: orders.filter(o => o.estado === 'en_camino').length, color: '#06b6d4' },
    { name: 'Entregados', value: orders.filter(o => o.estado === 'entregado').length, color: '#22c55e' },
  ]

  // Filtrar según búsqueda
  const filteredOrders = orders.filter(order => 
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función para formatear moneda
  const formatCurrency = (value) => `L. ${(value || 0).toLocaleString('es-HN', { minimumFractionDigits: 2 })}`

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <RefreshCw className="spin" size={32} />
          <p>Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="admin-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Panel de Administración</h1>
            <p>Gestiona tu tienda desde aquí</p>
          </div>
          <button className="admin-refresh" onClick={fetchDashboardData}>
            <RefreshCw size={18} />
            Actualizar
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={18} />
            Resumen
          </button>
          <button 
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={18} />
            Pedidos
          </button>
          <button 
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            Productos
          </button>
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Usuarios
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div 
            className="admin-overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Stats Cards */}
            <div className="admin-stats">
              <motion.div 
                className="admin-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="admin-stat__icon" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  <DollarSign size={24} />
                </div>
                <div className="admin-stat__content">
                  <span className="admin-stat__value">{formatCurrency(stats?.totalSales)}</span>
                  <span className="admin-stat__label">Ventas Totales</span>
                </div>
                <div className="admin-stat__trend positive">
                  <ArrowUpRight size={16} />
                  +12.5%
                </div>
              </motion.div>

              <motion.div 
                className="admin-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="admin-stat__icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <ShoppingCart size={24} />
                </div>
                <div className="admin-stat__content">
                  <span className="admin-stat__value">{orders.length}</span>
                  <span className="admin-stat__label">Pedidos</span>
                </div>
                <div className="admin-stat__trend positive">
                  <ArrowUpRight size={16} />
                  +8.2%
                </div>
              </motion.div>

              <motion.div 
                className="admin-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="admin-stat__icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                  <Package size={24} />
                </div>
                <div className="admin-stat__content">
                  <span className="admin-stat__value">{products.length}</span>
                  <span className="admin-stat__label">Productos</span>
                </div>
                <div className="admin-stat__trend negative">
                  <ArrowDownRight size={16} />
                  -2.1%
                </div>
              </motion.div>

              <motion.div 
                className="admin-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="admin-stat__icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <Users size={24} />
                </div>
                <div className="admin-stat__content">
                  <span className="admin-stat__value">{users.length}</span>
                  <span className="admin-stat__label">Usuarios</span>
                </div>
                <div className="admin-stat__trend positive">
                  <ArrowUpRight size={16} />
                  +5.3%
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="admin-charts">
              {/* Sales Chart */}
              <div className="admin-chart">
                <h3>Ventas Mensuales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `L.${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      formatter={(value) => [formatCurrency(value), 'Ventas']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Orders by Status */}
              <div className="admin-chart">
                <h3>Pedidos por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-recent">
              <h3>Pedidos Recientes</h3>
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order._id}>
                        <td>#{order._id?.slice(-6)}</td>
                        <td>{order.customer?.name || 'Cliente'}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <span className={`status-badge status--${order.estado}`}>
                            {order.estado?.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString('es-HN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div 
            className="admin-orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Search */}
            <div className="admin-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Orders Table */}
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>#{order._id?.slice(-6)}</td>
                      <td>
                        <div>
                          <strong>{order.customer?.name || 'Cliente'}</strong>
                          <span>{order.customer?.email}</span>
                        </div>
                      </td>
                      <td>{order.items?.length || 0} productos</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <select
                          value={order.estado}
                          onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                          className={`status-select status--${order.estado}`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_proceso">En Proceso</option>
                          <option value="en_camino">En Camino</option>
                          <option value="entregado">Entregado</option>
                        </select>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString('es-HN')}</td>
                      <td>
                        <div className="admin-actions">
                          <button title="Ver"><Eye size={16} /></button>
                          <button title="Editar"><Edit size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div 
            className="admin-products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Header */}
            <div className="admin-products__header">
              <div className="admin-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="/admin/products/new" className="admin-add-btn">
                <Plus size={18} />
                Nuevo Producto
              </Link>
            </div>

            {/* Products Grid */}
            <div className="admin-products__grid">
              {filteredProducts.map(product => (
                <div key={product._id} className="admin-product-card">
                  <img 
                    src={product.image || 'https://via.placeholder.com/200'} 
                    alt={product.name}
                  />
                  <div className="admin-product-card__content">
                    <h4>{product.name}</h4>
                    <p className="admin-product-card__category">{product.category}</p>
                    <div className="admin-product-card__footer">
                      <span className="admin-product-card__price">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="admin-product-card__stock">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="admin-product-card__actions">
                    <button title="Ver"><Eye size={16} /></button>
                    <button title="Editar"><Edit size={16} /></button>
                    <button 
                      title="Eliminar"
                      onClick={() => handleDeleteProduct(product._id)}
                      className="delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div 
            className="admin-users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Search */}
            <div className="admin-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Users Table */}
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.nombre?.charAt(0) || 'U'}
                          </div>
                          <span>{user.nombre}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.telefono || 'N/A'}</td>
                      <td>
                        <span className={`role-badge role--${user.rol}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString('es-HN')}</td>
                      <td>
                        <div className="admin-actions">
                          <button title="Ver"><Eye size={16} /></button>
                          <button title="Editar"><Edit size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
