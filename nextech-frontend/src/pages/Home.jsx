import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Monitor, Headphones, Keyboard, Mouse, Zap } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/api'
import './Home.css'

/**
 * Home - Página principal
 * Hero, categorías, productos destacados
 */
function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 8 })
        setFeaturedProducts(response.data?.products || response.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        // Productos de ejemplo si no hay API
        setFeaturedProducts([
          { _id: '1', name: 'Laptop Gaming Pro', price: 25000, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', category: 'laptops', description: 'Potente laptop para gaming' },
          { _id: '2', name: 'Monitor UltraWide 34"', price: 12000, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', category: 'monitores', description: 'Monitor curvo panoramic' },
          { _id: '3', name: 'Teclado Mecánico RGB', price: 2500, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', category: 'accesorios', description: 'Teclado gaming con retroiluminación' },
          { _id: '4', name: 'Mouse Gamer Pro', price: 1200, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'accesorios', description: 'Mouse wireless de alta precisión' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Categorías
  const categories = [
    { icon: Monitor, name: 'Computadoras', slug: 'computadoras', count: 45 },
    { icon: Cpu, name: 'Componentes', slug: 'componentes', count: 120 },
    { icon: Keyboard, name: 'Periféricos', slug: 'perifericos', count: 89 },
    { icon: Headphones, name: 'Audio', slug: 'audio', count: 34 },
    { icon: Mouse, name: 'Accesorios', slug: 'accesorios', count: 67 },
    { icon: Zap, name: 'Gaming', slug: 'gaming', count: 56 },
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__gradient" />
          <div className="hero__grid" />
        </div>
        
        <div className="container hero__content">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero__badge">🖥️ Tecnología de Punta</span>
            <h1>Encuentra los Mejores Productos Tech en Honduras</h1>
            <p>
              Laptops, componentes, accesorios y más. 
              Envíos gratis en Tegucigalpa. 
              Garantía oficial en todos nuestros productos.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="hero__cta hero__cta--primary">
                Ver Catálogo <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="hero__cta hero__cta--secondary">
                Contactar Asesor
              </Link>
            </div>
            
            <div className="hero__stats">
              <div className="hero__stat">
                <strong>500+</strong>
                <span>Productos</span>
              </div>
              <div className="hero__stat">
                <strong>50+</strong>
                <span>Marcas</span>
              </div>
              <div className="hero__stat">
                <strong>24/7</strong>
                <span>Soporte</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero__image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hero__image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600" 
                alt="Laptop Gaming"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Explora por Categoría</h2>
            <p>Encuentra exactamente lo que necesitas</p>
          </motion.div>

          <div className="categories__grid">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products?cat=${cat.slug}`} className="category-card">
                  <div className="category-card__icon">
                    <cat.icon size={28} />
                  </div>
                  <h3>{cat.name}</h3>
                  <span>{cat.count} productos</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Productos Destacados</h2>
            <p>Los más populares de nuestra tienda</p>
          </motion.div>

          <div className="products-grid">
            {loading ? (
              // Skeleton loading
              [...Array(8)].map((_, i) => (
                <div key={i} className="product-skeleton">
                  <div className="product-skeleton__image" />
                  <div className="product-skeleton__text" />
                  <div className="product-skeleton__text short" />
                </div>
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            className="featured__cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="hero__cta hero__cta--primary">
              Ver Todos los Productos <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            <motion.div
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="feature__icon">🚚</div>
              <h3>Envío Gratis</h3>
              <p>En pedidos mayores a L. 1,000 dentro de Tegucigalpa</p>
            </motion.div>

            <motion.div
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="feature__icon">🛡️</div>
              <h3>Garantía Oficial</h3>
              <p>Todos nuestros productos cuentan con garantía</p>
            </motion.div>

            <motion.div
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="feature__icon">💬</div>
              <h3>Soporte 24/7</h3>
              <p>Estamos disponibles para ayudarte en cualquier momento</p>
            </motion.div>

            <motion.div
              className="feature"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="feature__icon">✅</div>
              <h3>Productos 100% Originales</h3>
              <p>Solo vendemos productos auténticos y de calidad</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta__content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>¿Necesitas ayuda para elegir?</h2>
            <p>Nuestro equipo de asesores está listo para ayudarte a encontrar el producto perfecto</p>
            <Link to="/contact" className="hero__cta hero__cta--primary">
              Contactar Ahora <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
