import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Package, Clock, Truck, CheckCircle, 
  ShoppingBag, Eye, ChevronRight, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getOrders } from '../services/api'
import './Dashboard.css'

/**
 * Dashboard - Panel del cliente
 * Muestra historial de pedidos con polling automático cada 30 segundos
 * Indicador "En vivo" con tiempo desde última actualización
 */
function Dashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [secondsAgo, setSecondsAgo] = useState(0)

  // Cargar pedidos
  const fetchOrders = async () => {
    try {
      const response = await getOrders()
      setOrders(response.data.orders || [])
      setLastUpdate(new Date())
      setSecondsAgo(0)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  // Polling cada 30 segundos
  useEffect(() => {
    fetchOrders()

    const interval = setInterval(() => {
      setSecondsAgo(prev => prev + 1)
    }, 1000)

    const pollInterval = setInterval(() => {
      fetchOrders()
    }, 30000) // 30 segundos

    return () => {
      clearInterval(interval)
      clearInterval(pollInterval)
    }
  }, [])

  // Obtener icono según estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente': return <Clock size={16} />
      case 'en_proceso': return <Package size={16} />
      case 'en_camino': return <Truck size={16} />
      case 'entregado': return <CheckCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  // Obtener clase según estado
  const getStatusClass = (status) => {
    switch (status) {
      case 'pendiente': return 'status--pending'
      case 'en_proceso': return 'status--processing'
      case 'en_camino': return 'status--shipping'
      case 'entregado': return 'status--delivered'
      default: return ''
    }
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Obtener tiempo relativo
  const getRelativeTime = (seconds) => {
    if (seconds < 60) return `hace ${seconds}s`
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`
    return `hace ${Math.floor(seconds / 3600)}h`
  }

  // Estados timeline
  const timelineSteps = [
    { key: 'pendiente', label: 'Pendiente', icon: Clock },
    { key: 'en_proceso', label: 'En Proceso', icon: Package },
    { key: 'en_camino', label: 'En Camino', icon: Truck },
    { key: 'entregado', label: 'Entregado', icon: CheckCircle }
  ]

  // Obtener índice del estado actual
  const getCurrentStepIndex = (status) => {
    const statusOrder = ['pendiente', 'en_proceso', 'en_camino', 'entregado']
    return statusOrder.indexOf(status)
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-loading">
            <RefreshCw className="spin" size={32} />
            <p>Cargando pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>¡Hola, {user?.nombre || 'Cliente'}!</h1>
            <p>Bienvenido a tu panel de control</p>
          </div>
          
          {/* Indicador en vivo */}
          <div className="dashboard-live">
            <span className="dashboard-live__dot" />
            <span>En vivo</span>
            <span className="dashboard-live__time">— actualizado {getRelativeTime(secondsAgo)}</span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="dashboard-stats">
          <motion.div 
            className="dashboard-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ShoppingBag size={24} />
            <div>
              <span className="dashboard-stat__value">{orders.length}</span>
              <span className="dashboard-stat__label">Pedidos Totales</span>
            </div>
          </motion.div>

          <motion.div 
            className="dashboard-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Clock size={24} />
            <div>
              <span className="dashboard-stat__value">
                {orders.filter(o => o.estado === 'pendiente').length}
              </span>
              <span className="dashboard-stat__label">Pendientes</span>
            </div>
          </motion.div>

          <motion.div 
            className="dashboard-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Truck size={24} />
            <div>
              <span className="dashboard-stat__value">
                {orders.filter(o => o.estado === 'en_camino').length}
              </span>
              <span className="dashboard-stat__label">En Camino</span>
            </div>
          </motion.div>

          <motion.div 
            className="dashboard-stat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CheckCircle size={24} />
            <div>
              <span className="dashboard-stat__value">
                {orders.filter(o => o.estado === 'entregado').length}
              </span>
              <span className="dashboard-stat__label">Entregados</span>
            </div>
          </motion.div>
        </div>

        {/* Orders List */}
        <motion.div 
          className="dashboard-orders"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="dashboard-orders__header">
            <h2>Mis Pedidos</h2>
            <button className="dashboard-refresh" onClick={fetchOrders}>
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="dashboard-empty">
              <ShoppingBag size={48} />
              <h3>No tienes pedidos aún</h3>
              <p>Cuando realices tu primer pedido, podrás verlo aquí</p>
              <Link to="/products" className="dashboard-empty__btn">
                Ver Productos
              </Link>
            </div>
          ) : (
            <div className="dashboard-orders__list">
              {orders.map((order, index) => (
                <motion.div 
                  key={order._id}
                  className="dashboard-order"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="dashboard-order__header">
                    <div>
                      <span className="dashboard-order__id">#{order._id?.slice(-8)}</span>
                      <span className="dashboard-order__date">{formatDate(order.createdAt)}</span>
                    </div>
                    <span className={`dashboard-order__status ${getStatusClass(order.estado)}`}>
                      {getStatusIcon(order.estado)}
                      {order.estado?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Timeline del pedido */}
                  <div className="dashboard-order__timeline">
                    {timelineSteps.map((step, stepIndex) => {
                      const isActive = getCurrentStepIndex(order.estado) >= stepIndex
                      const isCurrent = getCurrentStepIndex(order.estado) === stepIndex
                      return (
                        <div 
                          key={step.key}
                          className={`dashboard-order__timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                        >
                          <div className="dashboard-order__timeline-dot">
                            <step.icon size={12} />
                          </div>
                          <span>{step.label}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="dashboard-order__footer">
                    <div className="dashboard-order__items">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <img 
                          key={i}
                          src={item.image || 'https://via.placeholder.com/40'} 
                          alt={item.name}
                        />
                      ))}
                      {order.items?.length > 3 && (
                        <span className="dashboard-order__more">
                          +{order.items.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="dashboard-order__total">
                      <span>Total</span>
                      <strong>L. {order.total?.toFixed(2)}</strong>
                    </div>
                    <button className="dashboard-order__view">
                      <Eye size={16} />
                      Ver Detalle
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
