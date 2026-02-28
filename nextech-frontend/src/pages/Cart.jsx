import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Cart.css'

/**
 * Cart - Página del carrito de compras
 * Lista productos, actualiza cantidades, muestra total
 */
function Cart() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()

  const shippingCost = totalPrice > 1000 ? 0 : 150
  const orderTotal = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <motion.div 
            className="cart-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingBag size={64} />
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para comenzar a comprar</p>
            <Link to="/products" className="cart-empty__btn">
              Ver Productos <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <motion.div 
          className="cart-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Mi Carrito</h1>
          <span>{items.length} productos</span>
        </motion.div>

        <div className="cart-layout">
          {/* Lista de productos */}
          <div className="cart-items">
            {items.map((item, index) => (
              <motion.div 
                key={item._id}
                className="cart-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img 
                  src={item.image || 'https://via.placeholder.com/100'} 
                  alt={item.name}
                  className="cart-item__image"
                />
                
                <div className="cart-item__info">
                  <Link to={`/products/${item._id}`} className="cart-item__name">
                    {item.name}
                  </Link>
                  <span className="cart-item__category">{item.category}</span>
                  <span className="cart-item__price">L. {item.price.toFixed(2)}</span>
                </div>

                <div className="cart-item__actions">
                  <div className="cart-item__quantity">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <span className="cart-item__total">
                    L. {(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button 
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Resumen */}
          <div className="cart-summary">
            <h3>Resumen del Pedido</h3>
            
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>L. {totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="cart-summary__row">
              <span>Envío</span>
              <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                {shippingCost === 0 ? 'GRATIS' : `L. ${shippingCost.toFixed(2)}`}
              </span>
            </div>

            {shippingCost > 0 && (
              <p className="cart-summary__note">
                Envío gratis en pedidos mayores a L. 1,000
              </p>
            )}

            <div className="cart-summary__divider" />

            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>L. {orderTotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="cart-summary__checkout">
              Proceder al Checkout <ArrowRight size={18} />
            </Link>

            <button className="cart-summary__clear" onClick={clearCart}>
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
