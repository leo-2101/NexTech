import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Hero.css'

/**
 * Componente Hero - Sección principal de la página de inicio
 * Muestra el banner principal con llamada a la acción
 */
function Hero() {
  return (
    <section className="hero">
      {/* Fondo con gradiente y patrón */}
      <div className="hero__background">
        <div className="hero__gradient" />
        <div className="hero__pattern" />
      </div>

      <div className="container">
        <div className="hero__content">
          {/* Texto principal */}
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="hero__badge">
              🖥️ Tecnología de Punta
            </span>
            <h1 className="hero__title">
              Descubre el Futuro de la
              <span className="hero__title-accent"> Tecnología</span>
            </h1>
            <p className="hero__description">
              Encuentra los mejores productos tecnológicos en NexTech Honduras. 
              Computadoras, laptops, accesorios y más con garantía total y el 
              mejor servicio del mercado.
            </p>
            
            {/* Botones de acción */}
            <div className="hero__actions">
              <Link to="/products" className="hero__btn hero__btn--primary">
                Ver Productos
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link to="/about" className="hero__btn hero__btn--secondary">
                Conócenos
              </Link>
            </div>

            {/* Stats / indicadores */}
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-value">500+</span>
                <span className="hero__stat-label">Productos</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">98%</span>
                <span className="hero__stat-label">Clientes Felices</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">24/7</span>
                <span className="hero__stat-label">Soporte</span>
              </div>
            </div>
          </motion.div>

          {/* Imagen / ilustración */}
          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="hero__image-container">
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop" 
                alt="Tecnología moderna"
                className="hero__image"
              />
              {/* Elementos decorativos flotantes */}
              <motion.div 
                className="hero__floating hero__floating--1"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                💻
              </motion.div>
              <motion.div 
                className="hero__floating hero__floating--2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎧
              </motion.div>
              <motion.div 
                className="hero__floating hero__floating--3"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                🖱️
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
