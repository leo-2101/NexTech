import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Eye, Heart, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import './ProductCard.css'

/**
 * ProductCard - Tarjeta de producto para el catálogo
 * Muestra imagen, nombre, precio, botón de agregar al carrito
 * Compatible con datos del backend (nombre, precio, imagen) y datos de ejemplo (name, price, image)
 */
function ProductCard({ product }) {
  const { addToCart } = useCart()

  // Normalizar campos - soporta ambos formatos (backend y datos de ejemplo)
  const id = product._id || product.id
  const nombre = product.nombre || product.name || 'Producto'
  const precio = product.precio || product.price || 0
  const imagen = product.imagen || product.image || 'https://via.placeholder.com/300x200'
  const categoria = product.categoria || product.category || ''
  const descripcion = product.descripcion || product.description || ''
  const descuento = product.descuento || product.descuentoPorcentaje || 0
  const esNuevo = product.esNuevo || product.nuevo || false
  const stock = product.stock || 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${nombre} agregado al carrito`)
  }

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/products/${id}`} className="product-card__link">
        {/* Imagen */}
        <div className="product-card__image">
          <img 
            src={imagen} 
            alt={nombre}
          />
          
          {/* Badges */}
          {descuento > 0 && (
            <span className="product-card__badge product-card__badge--discount">
              -{descuento}%
            </span>
          )}
          {esNuevo && (
            <span className="product-card__badge product-card__badge--new">
              <Zap size={12} /> Nuevo
            </span>
          )}
          
          {/* Quick actions */}
          <div className="product-card__actions">
            <button title="Ver detalle" className="product-card__action">
              <Eye size={18} />
            </button>
            <button title="Agregar a favoritos" className="product-card__action">
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="product-card__content">
          <span className="product-card__category">{categoria}</span>
          <h3 className="product-card__title">{nombre}</h3>
          
          {descripcion && (
            <p className="product-card__description">{descripcion}</p>
          )}

          <div className="product-card__footer">
            <div className="product-card__price">
              {descuento > 0 ? (
                <>
                  <span className="product-card__price--original">
                    L. {precio.toFixed(2)}
                  </span>
                  <span className="product-card__price--discount">
                    L. {(precio * (1 - descuento / 100)).toFixed(2)}
                  </span>
                </>
              ) : (
                <span>L. {precio.toFixed(2)}</span>
              )}
            </div>
            
            {stock > 0 ? (
              <span className="product-card__stock in-stock">En stock</span>
            ) : (
              <span className="product-card__stock out-stock">Agotado</span>
            )}
          </div>
        </div>
      </Link>

      {/* Botón agregar al carrito */}
      <button 
        className="product-card__add"
        onClick={handleAddToCart}
        disabled={stock <= 0}
      >
        <ShoppingCart size={18} />
        <span>Agregar</span>
      </button>
    </motion.div>
  )
}

export default ProductCard
