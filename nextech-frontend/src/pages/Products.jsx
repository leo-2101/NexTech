import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts, getCategories } from '../services/api'
import './Products.css'

/**
 * Products - Página de catálogo de productos
 * Filtros, búsqueda, paginación
 */
function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Estados de filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('cat') || '',
    sort: ' newest',
    minPrice: '',
    maxPrice: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        // Normalizar datos del backend
        const productsData = productsRes.data?.products || productsRes.products || []
        const normalizedProducts = productsData.map(p => ({
          ...p,
          // El backend usa nombre, precio, imagen - mantener así pero también agregar aliases
          name: p.nombre,
          price: p.precio,
          image: p.imagen,
          category: p.categoria
        }))
        setProducts(normalizedProducts)
        
        // Normalizar categorías
        const categoriesData = categoriesRes.data || categoriesRes || []
        const normalizedCategories = categoriesData.map(c => ({
          _id: c._id || c.nombre || c,
          name: c.nombre || c.name || c
        }))
        setCategories(normalizedCategories)
      } catch (error) {
        console.error('Error:', error)
        // Datos de ejemplo
        setProducts([
          { _id: '1', name: 'Laptop Gaming Pro', price: 25000, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', category: 'laptops', stock: 10 },
          { _id: '2', name: 'Monitor UltraWide 34"', price: 12000, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', category: 'monitores', stock: 5 },
          { _id: '3', name: 'Teclado Mecánico RGB', price: 2500, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', category: 'accesorios', stock: 25 },
          { _id: '4', name: 'Mouse Gamer Pro', price: 1200, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'accesorios', stock: 30 },
          { _id: '5', name: 'Audífonos Gaming', price: 1800, image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400', category: 'audio', stock: 15 },
          { _id: '6', name: 'Webcam HD 1080p', price: 1500, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400', category: 'accesorios', stock: 20 },
        ])
        setCategories([
          { _id: 'laptops', name: 'Laptops' },
          { _id: 'monitores', name: 'Monitores' },
          { _id: 'accesorios', name: 'Accesorios' },
          { _id: 'audio', name: 'Audio' }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filtrar productos
  const filteredProducts = products.filter(p => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.minPrice && p.price < parseFloat(filters.minPrice)) return false
    if (filters.maxPrice && p.price > parseFloat(filters.maxPrice)) return false
    return true
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    if (key === 'search') {
      setSearchParams(prev => {
        if (value) prev.set('q', value)
        else prev.delete('q')
        return prev
      })
    }
    if (key === 'category') {
      setSearchParams(prev => {
        if (value) prev.set('cat', value)
        else prev.delete('cat')
        return prev
      })
    }
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', sort: 'newest', minPrice: '', maxPrice: '' })
    setSearchParams({})
  }

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="products-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Catálogo de Productos</h1>
            <p>{filteredProducts.length} productos encontrados</p>
          </div>
          
          <button 
            className="products-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filtros
          </button>
        </motion.div>

        <div className="products-layout">
          {/* Sidebar de filtros */}
          <aside className={`products-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="products-sidebar__header">
              <h3>Filtros</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="products-sidebar__clear">
                  <X size={14} /> Limpiar
                </button>
              )}
            </div>

            {/* Buscar */}
            <div className="products-filter">
              <label>Buscar</label>
              <div className="products-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Categorías */}
            <div className="products-filter">
              <label>Categoría</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Precio */}
            <div className="products-filter">
              <label>Precio (L.)</label>
              <div className="products-price">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <button 
              className="products-filter-close"
              onClick={() => setShowFilters(false)}
            >
              Aplicar Filtros
            </button>
          </aside>

          {/* Grid de productos */}
          <div className="products-main">
            {loading ? (
              <div className="products-loading">Cargando...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="products-empty">
                <p>No se encontraron productos</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters}>Limpiar filtros</button>
                )}
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
