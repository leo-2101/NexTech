import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import './CartItem.css'

/**
 * Componente CartItem - Elemento del carrito de compras
 * Muestra un producto en el carrito con opciones para modificar cantidad o eliminar
 */
function CartItem({ item, index = 0 }) {
  const { updateQuantity, removeFromCart } = useCart()
  const { warning } = useToast()

  // Incrementar cantidad
  const handleIncrement = () => {
    updateQuantity(item._id, item.quantity + 1)
  }

  // Decrementar cantidad
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1)
    } else {
      warning(`¿Eliminar ${item.name} del carrito?`)
      removeFromCart(item._id)
    }
  }

  // Eliminar del carrito
  const handleRemove = () => {
    removeFromCart(item._id)
  }

  // Calcular precio total del item
  const totalPrice = item.price * item.quantity

  return (
    <motion.div
      className="cart-item"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Imagen del producto */}
      <div className="cart-item__image">
        <img
          src={item.image || 'https://via.placeholder.com/100x100?text=Producto'}
          alt={item.name}
        />
      </div>

      {/* Información del producto */}
      <div className="cart-item__info">
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__category">{item.category?.name || 'General'}</p>
        <p className="cart-item__price">L. {item.price.toFixed(2)} c/u</p>
      </div>

      {/* Controles de cantidad */}
      <div className="cart-item__quantity">
        <button
          className="cart-item__qty-btn"
          onClick={handleDecrement}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <span className="cart-item__qty-value">{item.quantity}</span>
        <button
          className="cart-item__qty-btn"
          onClick={handleIncrement}
          disabled={item.stock && item.quantity >= item.stock}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      {/* Precio total */}
      <div className="cart-item__total">
        <span className="cart-item__total-label">Total:</span>
        <span className="cart-item__total-value">L. {totalPrice.toFixed(2)}</span>
      </div>

      {/* Botón eliminar */}
      <button
        className="cart-item__remove"
        onClick={handleRemove}
        aria-label="Eliminar del carrito"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </motion.div>
  )
}

export default CartItem
