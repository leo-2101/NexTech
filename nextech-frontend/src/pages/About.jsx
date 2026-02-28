import { motion } from 'framer-motion'
import { Award, Users, TrendingUp, Shield, Cpu, Headphones, Monitor, Keyboard } from 'lucide-react'
import './About.css'

/**
 * About - Página sobre nosotros
 * Historia, misión, visión, equipo
 */
function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            className="about-hero__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Sobre NexTech Honduras</h1>
            <p>
              Tu tienda de tecnología de confianza en Honduras. 
              Desde 2015 brindando soluciones tecnológicas de primera.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            <motion.div
              className="about-stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="about-stat__number">8+</span>
              <span className="about-stat__label">Años de Experiencia</span>
            </motion.div>
            <motion.div
              className="about-stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="about-stat__number">500+</span>
              <span className="about-stat__label">Productos</span>
            </motion.div>
            <motion.div
              className="about-stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="about-stat__number">50+</span>
              <span className="about-stat__label">Marcas</span>
            </motion.div>
            <motion.div
              className="about-stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="about-stat__number">10000+</span>
              <span className="about-stat__label">Clientes Felices</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="container">
          <div className="about-section__grid">
            <motion.div
              className="about-section__content"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>Nuestra Misión</h2>
              <p>
                Brindar acceso a tecnología de vanguardia a todos los Honduras, 
                ofreciendo productos de calidad, asesoramiento especializado y 
                servicio técnico confiable. Nos comprometemos a hacer la tecnología 
                accesible y fácil de usar para todos.
              </p>
            </motion.div>
            <motion.div
              className="about-section__content"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>Nuestra Visión</h2>
              <p>
                Ser la tienda de tecnología líder en Honduras, reconocida por 
                nuestra excelencia en servicio al cliente, variedad de productos 
                y compromiso con la innovación tecnológica. Queremos ser el 
                aliado tecnológico de cada hogar y empresa Hondureña.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Nuestros Valores</h2>
            <p>Los principios que guían nuestro trabajo diario</p>
          </motion.div>

          <div className="about-values__grid">
            {[
              { icon: Shield, title: 'Confianza', desc: 'Productos 100% originales con garantía oficial' },
              { icon: Users, title: 'Servicio', desc: 'Atención personalizada y asesoramiento técnico' },
              { icon: TrendingUp, title: 'Innovación', desc: 'Siempre a la vanguardia tecnológica' },
              { icon: Award, title: 'Calidad', desc: 'Los mejores productos de marcas reconocidas' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="about-value"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="about-value__icon">
                  <item.icon size={28} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="about-products">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Lo que Ofrecemos</h2>
            <p>Gran variedad de productos tecnológicos</p>
          </motion.div>

          <div className="about-products__grid">
            {[
              { icon: Monitor, title: 'Computadoras', desc: 'Laptops, PCs de escritorio y All-in-One' },
              { icon: Cpu, title: 'Componentes', desc: 'Procesadores, tarjetas, memorias y más' },
              { icon: Keyboard, title: 'Periféricos', desc: 'Teclados, mouse, webcams y más' },
              { icon: Headphones, title: 'Audio', desc: 'Audífonos, bocinas y equipos de sonido' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="about-product"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="about-product__icon">
                  <item.icon size={32} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <motion.div
            className="about-cta__content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>¿Listo para conocernos?</h2>
            <p>Visítanos en nuestra tienda o contáctanos para más información</p>
            <div className="about-cta__buttons">
              <a href="/products" className="btn-primary">Ver Productos</a>
              <a href="/contact" className="btn-secondary">Contactar</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
