import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import ParticlesBackground from '../components/ParticlesBackground'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

/**
 * Login - Página de inicio de sesión
 * Fondo con partículas, card glassmorphism con borde gradiente
 */
function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        toast.success('¡Bienvenido de nuevo!')
        
        // Redirección por rol
        const user = JSON.parse(localStorage.getItem('user'))
        const rutas = {
          admin: '/admin',
          empleado: '/employee',
          cliente: '/dashboard'
        }
        navigate(rutas[user?.rol] || '/dashboard')
      } else {
        toast.error(result.message || 'Credenciales incorrectas')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Fondo con partículas */}
      <ParticlesBackground />
      
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header del card */}
          <div className="auth-card__header">
            <Link to="/" className="auth-logo">
              <span className="auth-logo__icon">⚡</span>
              <span className="auth-logo__text">NexTech</span>
            </Link>
            <h1 className="auth-card__title">Bienvenido de nuevo</h1>
            <p className="auth-card__subtitle">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form__group">
              <label htmlFor="email">Correo electrónico</label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@gmail.com"
                icon={Mail}
                required
              />
            </div>

            <div className="auth-form__group">
              <div className="auth-form__label-row">
                <label htmlFor="password">Contraseña</label>
                <Link to="/forgot-password" className="auth-form__link">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
                showPasswordToggle
                required
              />
            </div>

            <button
              type="submit"
              className="auth-form__submit"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-form__loading">Iniciando...</span>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card__footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="auth-form__link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
