import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, ShoppingCart, User, Search, 
  Package, LayoutDashboard, LogOut, ChevronDown,
  Sun, Moon, Monitor
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

/**
 * Navbar - Barra de navegación principal
 * Responsive con menú móvil, dropdown de usuario, carrito
 */
function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTema } = useTheme()
  
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú móvil al cambiar ruta
  useEffect(() => {
    setIsOpen(false)
    setUserMenuOpen(false)
  }, [location])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  // Rutas del menú
  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/products', label: 'Productos' },
    { path: '/contact', label: 'Contacto' },
    { path: '/about', label: 'Nosotros' }
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          <span className="navbar__logo-text">NexTech</span>
        </Link>

        {/* Links de navegación - Desktop */}
        <div className="navbar__links">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Acciones */}
        <div className="navbar__actions">
          {/* Buscar (desktop) */}
          <button className="navbar__action navbar__action--desktop" title="Buscar">
            <Search size={20} />
          </button>

          {/* Carrito */}
          <Link to="/cart" className="navbar__action navbar__cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="navbar__cart-badge">{totalItems}</span>
            )}
          </Link>

          {/* Usuario */}
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="navbar__action user-menu__trigger"
                onClick={(e) => {
                  e.stopPropagation()
                  setUserMenuOpen(!userMenuOpen)
                }}
              >
                <div className="user-menu__avatar">
                  {user?.nombre?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    className="user-menu__dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="user-menu__header">
                      <p className="user-menu__name">{user?.nombre}</p>
                      <p className="user-menu__email">{user?.email}</p>
                    </div>
                    
                    <div className="user-menu__links">
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={16} />
                        Mi Dashboard
                      </Link>
                      
                      {user?.rol === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}>
                          <Package size={16} />
                          Panel Admin
                        </Link>
                      )}
                      
                      {(user?.rol === 'empleado' || user?.rol === 'admin') && (
                        <Link to="/employee" onClick={() => setUserMenuOpen(false)}>
                          <Package size={16} />
                          Panel Empleado
                        </Link>
                      )}
                    </div>

                    <div className="user-menu__footer">
                      <button onClick={handleLogout}>
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="navbar__action">
              <User size={20} />
            </Link>
          )}

          {/* Tema */}
          <button 
            className="navbar__action navbar__action--desktop"
            onClick={toggleTema}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Menú móvil */}
          <button 
            className="navbar__action navbar__menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="navbar__mobile-search">
              <Search size={18} />
              <input type="text" placeholder="Buscar productos..." />
            </div>
            
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path}
                className={`navbar__mobile-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="navbar__mobile-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="navbar__mobile-link">
                    <LayoutDashboard size={18} />
                    Mi Dashboard
                  </Link>
                  {user?.rol === 'admin' && (
                    <Link to="/admin" className="navbar__mobile-link">
                      <Package size={18} />
                      Panel Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="navbar__mobile-link">
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link to="/login" className="navbar__mobile-cta">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
