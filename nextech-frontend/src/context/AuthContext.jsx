import { createContext, useContext, useState, useEffect } from 'react'
import { axiosInstance } from '../services/api'

/**
 * AuthContext - Manejo de autenticación y autorización
 * Gestiona el token, usuario, login, logout y redirección por rol
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Cargar usuario al iniciar si hay token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const response = await axiosInstance.get('/auth/me')
          setUser(response.data.user)
          setToken(storedToken)
        } catch (error) {
          // Token inválido, limpiar
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  // Función de login
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      
      // Redirección por rol
      redirigirPorRol(userData.rol)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión' 
      }
    }
  }

  // Función de registro
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData)
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(newUser)
      
      // Redirección por rol
      redirigirPorRol(newUser.rol)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al registrarse' 
      }
    }
  }

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  // Redirección por rol de usuario
  const redirigirPorRol = (rol) => {
    // Esta función será llamada desde el componente que usa useNavigate
    // Retorna la ruta según el rol
    const rutas = {
      admin: '/admin',
      empleado: '/employee',
      cliente: '/dashboard'
    }
    return rutas[rol] || '/dashboard'
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    redirigirPorRol,
    isAuthenticated: !!token,
    isAdmin: user?.rol === 'admin',
    isEmpleado: user?.rol === 'empleado',
    isCliente: user?.rol === 'cliente'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
