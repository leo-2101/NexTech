import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * PrivateRoute - Componente para proteger rutas
 * Redirige a login si no está autenticado o no tiene el rol correcto
 * 
 * @param {string[]} allowedRoles - Roles permitidos para acceder a la ruta
 */
function PrivateRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Mientras carga, no mostrar nada
  if (loading) {
    return null
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si el rol no está permitido, redirigir al dashboard correspondiente
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    // Redirección según el rol del usuario
    const rutasPorRol = {
      admin: '/admin',
      empleado: '/employee',
      cliente: '/dashboard'
    }
    return <Navigate to={rutasPorRol[user?.rol] || '/'} replace />
  }

  return children
}

export default PrivateRoute
