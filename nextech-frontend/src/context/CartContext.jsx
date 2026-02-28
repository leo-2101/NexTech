import { createContext, useContext, useState, useEffect } from 'react'

/**
 * CartContext - Manejo del carrito de compras
 * Persiste en localStorage
 */
const CartContext = createContext(null)

// Clave para localStorage
const CART_STORAGE_KEY = 'nextech_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    // Cargar carrito desde localStorage
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [isOpen, setIsOpen] = useState(false)

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item._id === product._id)
      
      if (existing) {
        // Si existe, actualizar cantidad
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      // Si no existe, agregar nuevo
      return [...prev, { ...product, quantity }]
    })
    setIsOpen(true)
  }

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item._id !== productId))
  }

  // Actualizar cantidad
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setItems(prev => 
      prev.map(item => 
        item._id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Limpiar carrito
  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  // Obtener total de items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Obtener precio total
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    setIsOpen
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}
