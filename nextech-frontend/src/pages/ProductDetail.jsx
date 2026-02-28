import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, ArrowLeft, Check, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getProductById } from '../services/api'
import toast from 'react-hot-toast'
import './ProductDetail.css'

/**
 * ProductDetail - Página de detalle de producto
 * Muestra información completa, especificaciones, agregar al carrito
 */
function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await getProductById(id)
        setProduct(response.data || response)
      } catch (error) {
        console.error('Error:', error)
        // Producto de ejemplo
        setProduct({
          _id: id,
          name: 'Laptop Gaming Pro 15.6"',
          price: 25000,
          description: 'Potente laptop gaming con procesador Intel Core i7, 16GB RAM, RTX 3060. Perfecta para gaming y edición de video.',
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
          images: [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'
          ],
          category: 'laptops',
          stock: 10,
          especificaciones: {
            procesador: 'Intel Core i7-12700H',
            ram: '16GB DDR4',
            almacenamiento: '512GB SSD NVMe',
            pantalla: '15.6" FHD 144Hz',
            gpu: 'NVIDIA RTX 3060 6GB',
            bateria: '53Wh',
            peso: '2.3 kg'
          }
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      toast.success(`${quantity} ${product.name} agregado al carrito`)
    }
  }

  if (loading) {
    return <div className="product-detail-loading">Cargando...</div>
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Producto no encontrado</h2>
        <Link to="/products">Volver al catálogo</Link>
      </div>
    )
  }

  const images = product.images || [product.image]

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <motion.div 
          className="product-detail__breadcrumb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/products">Productos</Link>
          <span>/</span>
          <span>{product.name}</span>
        </motion.div>

        <div className="product-detail__grid">
          {/* Galería */}
          <motion.div 
            className="product-detail__gallery"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="product-detail__main-image">
              <img src={images[selectedImage]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="product-detail__thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`product-detail__thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div 
            className="product-detail__info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="product-detail__category">{product.category}</span>
            <h1 className="product-detail__title">{product.name}</h1>
            
            <div className="product-detail__rating">
              <div className="product-detail__stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < 4 ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </div>
              <span>(4.0) 12 reseñas</span>
            </div>

            <div className="product-detail__price">
              <span className="product-detail__price-current">L. {product.price.toFixed(2)}</span>
              {product.descuento > 0 && (
                <>
                  <span className="product-detail__price-original">L. {(product.price * 1.2).toFixed(2)}</span>
                  <span className="product-detail__price-discount">-{product.descuento}%</span>
                </>
              )}
            </div>

            <p className="product-detail__description">{product.description}</p>

            <div className="product-detail__stock">
              {product.stock > 0 ? (
                <>
                  <Check size={18} />
                  <span>En stock ({product.stock} unidades)</span>
                </>
              ) : (
                <span className="out-of-stock">Agotado</span>
              )}
            </div>

            {/* Cantidad */}
            <div className="product-detail__quantity">
              <label>Cantidad:</label>
              <div className="product-detail__quantity-input">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>

            {/* Acciones */}
            <div className="product-detail__actions">
              <button 
                className="product-detail__add-cart"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={20} />
                Agregar al Carrito
              </button>
              <button className="product-detail__wishlist">
                <Heart size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="product-detail__features">
              <div className="product-detail__feature">
                <Truck size={20} />
                <div>
                  <strong>Envío Gratis</strong>
                  <span>En pedidos mayores a L. 1,000</span>
                </div>
              </div>
              <div className="product-detail__feature">
                <Shield size={20} />
                <div>
                  <strong>Garantía</strong>
                  <span>1 año oficial</span>
                </div>
              </div>
              <div className="product-detail__feature">
                <RefreshCw size={20} />
                <div>
                  <strong>Devolución</strong>
                  <span>30 días</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Especificaciones */}
        {product.especificaciones && (
          <motion.div 
            className="product-detail__specs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Especificaciones Técnicas</h2>
            <div className="product-detail__specs-grid">
              {Object.entries(product.especificaciones).map(([key, value]) => (
                <div key={key} className="product-detail__spec">
                  <span className="product-detail__spec-label">{key}</span>
                  <span className="product-detail__spec-value">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
