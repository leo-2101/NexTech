import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import ParticlesBackground from '../components/ParticlesBackground'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

/**
 * Register - Página de registro de usuario
 * Fondo con partículas, card glassmorphism con borde gradiente
 */
function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones')
      return
    }

    setLoading(true)

    try {
      const result = await register({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        rol: 'cliente' // Por defecto, nuevo usuario es cliente
      })
      
      if (result.success) {
        toast.success('¡Cuenta creada exitosamente!')
        navigate('/dashboard')
      } else {
        toast.error(result.message || 'Error al crear la cuenta')
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
          className="auth-card auth-card--register"
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
            <h1 className="auth-card__title">Crear Cuenta</h1>
            <p className="auth-card__subtitle">
              Únete a NexTech Honduras
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form__group">
              <label htmlFor="nombre">Nombre completo</label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                icon={User}
                required
              />
            </div>

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
              <label htmlFor="telefono">Teléfono</label>
              <Input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+504 1234-5678"
                icon={Phone}
                required
              />
            </div>

            <div className="auth-form__row">
              <div className="auth-form__group">
                <label htmlFor="password">Contraseña</label>
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

              <div className="auth-form__group">
                <label htmlFor="confirmPassword">Confirmar</label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={Lock}
                  showPasswordToggle
                  required
                />
              </div>
            </div>

            <label className="auth-form__terms">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span>
                Acepto los{' '}
                <Link to="/terminos">Términos y Condiciones</Link>
                {' '}y{' '}
                <Link to="/privacidad">Política de Privacidad</Link>
              </span>
            </label>

            <button
              type="submit"
              className="auth-form__submit"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-form__loading">Creando cuenta...</span>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-card__footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="auth-form__link">
                Inicia sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
