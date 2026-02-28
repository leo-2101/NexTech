import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './context/AuthContext'

/**
 * App - Componente principal con rutas
 * Maneja navegación y protección de rutas según rol
 */
function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return null // O un componente de loading
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
            <Route path="/products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            
            {/* Rutas de autenticación */}
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" replace /> : 
              <PageWrapper><Login /></PageWrapper>
            } />
            <Route path="/register" element={
              user ? <Navigate to="/dashboard" replace /> : 
              <PageWrapper><Register /></PageWrapper>
            } />

            {/* Rutas protegidas - Cliente */}
            <Route path="/dashboard" element={
              <PrivateRoute allowedRoles={['cliente', 'admin', 'empleado']}>
                <PageWrapper><Dashboard /></PageWrapper>
              </PrivateRoute>
            } />

            {/* Rutas protegidas - Admin */}
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['admin']}>
                <PageWrapper><AdminDashboard /></PageWrapper>
              </PrivateRoute>
            } />

            {/* Rutas protegidas - Empleado */}
            <Route path="/employee" element={
              <PrivateRoute allowedRoles={['empleado', 'admin']}>
                <PageWrapper><EmployeeDashboard /></PageWrapper>
              </PrivateRoute>
            } />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

/**
 * PageWrapper - Componente para animaciones de página
 * Usa Framer Motion para transiciones suaves
 */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default App
