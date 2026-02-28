import { motion } from 'framer-motion'
import './Loader.css'

/**
 * Componente Loader - Indicador de carga
 * Muestra una animación de carga mientras se obtienen datos
 */
function Loader({ size = 'medium', text = 'Cargando...' }) {
  return (
    <div className={`loader loader--${size}`}>
      <div className="loader__spinner">
        <motion.div
          className="loader__circle"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {text && <p className="loader__text">{text}</p>}
    </div>
  )
}

/**
 * Componente Skeleton - Esqueleto de carga para tarjetas
 * Muestra una animación de "skeleton" mientras carga el contenido
 */
function Skeleton({ width, height, borderRadius = '8px' }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius
      }}
    />
  )
}

/**
 * Componente ProductCardSkeleton - Esqueleto de tarjeta de producto
 */
function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <Skeleton height="200px" borderRadius="12px 12px 0 0" />
      <div className="product-card-skeleton__content">
        <Skeleton width="60px" height="12px" />
        <Skeleton height="24px" />
        <Skeleton height="16px" width="80%" />
        <Skeleton height="32px" width="100px" />
        <Skeleton height="44px" width="100%" borderRadius="8px" />
      </div>
    </div>
  )
}

/**
 * Componente ProductGridSkeleton - Grid de skeletons de productos
 */
function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export { Loader, Skeleton, ProductCardSkeleton, ProductGridSkeleton }
export default Loader
