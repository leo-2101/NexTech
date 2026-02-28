import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send } from 'lucide-react'
import './Footer.css'

/**
 * Footer - Pie de página
 * Links, contacto, newsletter y redes sociales
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span>⚡</span>
              <span>NexTech</span>
            </Link>
            <p className="footer__description">
              Tu tienda de tecnología de confianza en Honduras. 
              Encontrás los mejores productos tecnológicos con garantía y servicio técnico especializado.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__links">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/products">Productos</Link></li>
              <li><Link to="/about">Nosotros</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer__links">
            <h4>Categorías</h4>
            <ul>
              <li><Link to="/products?cat=laptops">Laptops</Link></li>
              <li><Link to="/products?cat=computadoras">Computadoras</Link></li>
              <li><Link to="/products?cat=accesorios">Accesorios</Link></li>
              <li><Link to="/products?cat=componentes">Componentes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__contact">
            <h4>Contáctanos</h4>
            <ul>
              <li>
                <MapPin size={16} />
                <span>Tegucigalpa, Honduras</span>
              </li>
              <li>
                <Phone size={16} />
                <span>+504 2234-5678</span>
              </li>
              <li>
                <Mail size={16} />
                <span>contacto@nextech.hn</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h4>Newsletter</h4>
            <p>Recibe ofertas exclusivas y novedades</p>
            <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Tu correo electrónico" />
              <button type="submit">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} NexTech Honduras. Todos los derechos reservados.</p>
          <div className="footer__payments">
            <span>💳</span>
            <span>💵</span>
            <span>🏦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
