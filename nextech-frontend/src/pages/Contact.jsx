import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import './Contact.css'

/**
 * Contact - Página de contacto
 * Formulario de contacto, información de la empresa
 */
function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular envío
    setTimeout(() => {
      toast.success('Mensaje enviado correctamente')
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="contact-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Contáctanos</h1>
          <p>Estamos aquí para ayudarte. Escríbenos o llámanos.</p>
        </motion.div>

        <div className="contact-layout">
          {/* Info */}
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Información de Contacto</h2>
            
            <div className="contact-info__item">
              <div className="contact-info__icon">
                <MapPin size={20} />
              </div>
              <div>
                <h3>Dirección</h3>
                <p>Tegucigalpa, Honduras<br />Col. San Carlos, Calle Principal</p>
              </div>
            </div>

            <div className="contact-info__item">
              <div className="contact-info__icon">
                <Phone size={20} />
              </div>
              <div>
                <h3>Teléfono</h3>
                <p>+504 2234-5678<br />+504 9876-5432</p>
              </div>
            </div>

            <div className="contact-info__item">
              <div className="contact-info__icon">
                <Mail size={20} />
              </div>
              <div>
                <h3>Email</h3>
                <p>contacto@nextech.hn<br />soporte@nextech.hn</p>
              </div>
            </div>

            <div className="contact-info__item">
              <div className="contact-info__icon">
                <Clock size={20} />
              </div>
              <div>
                <h3>Horario</h3>
                <p>Lunes - Viernes: 8:00 AM - 6:00 PM<br />Sábado: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div 
            className="contact-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <div className="contact-form__group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="contact-form__group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="contact-form__group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+504 0000-0000"
                  />
                </div>
                <div className="contact-form__group">
                  <label>Asunto *</label>
                  <select name="asunto" value={formData.asunto} onChange={handleChange} required>
                    <option value="">Selecciona...</option>
                    <option value="consulta">Consulta General</option>
                    <option value="soporte">Soporte Técnico</option>
                    <option value="ventas">Ventas</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="contact-form__group">
                <label>Mensaje *</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                />
              </div>

              <button type="submit" className="contact-form__submit" disabled={loading}>
                {loading ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send size={18} />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Mapa */}
        <motion.div 
          className="contact-map"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="contact-map__placeholder">
            <MapPin size={32} />
            <span>Ver en Google Maps</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
