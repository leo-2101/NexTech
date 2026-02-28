import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, CreditCard, Building2, Banknote, 
  Check, Upload, ChevronRight, MapPin, CreditCard as CardIcon,
  Truck, Package, CheckCircle, Clock, Truck as TruckIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { createOrder, uploadPaymentProof } from '../services/api'
import './Checkout.css'

/**
 * Checkout - Página de checkout en 3 pasos
 * 1. Resumen + departamento
 * 2. Método de pago (tarjeta/transferencia/efectivo)
 * 3. Confirmación
 */
function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos del cliente
    name: '',
    email: '',
    phone: '',
    // Dirección
    address: '',
    city: '',
    department: '',
    // Método de pago
    paymentMethod: 'transfer',
    // Comprobante de pago
    paymentProof: null,
    // Notes
    notes: ''
  })

  // Estado de la tarjeta (para preview animado)
  const [cardPreview, setCardPreview] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })

  // Departments con costos de envío
  const departments = [
    { name: 'Cortés', cost: 0 }, // Gratis
    { name: 'Francisco Morazán', cost: 120 },
    { name: 'Atlántida', cost: 120 },
    { name: 'Cortés', cost: 120 },
    { name: 'Yoro', cost: 150 },
    { name: 'Copán', cost: 180 },
    { name: 'Santa Bárbara', cost: 150 },
    { name: 'Comayagua', cost: 100 },
    { name: 'La Paz', cost: 120 },
    { name: 'Intibucá', cost: 180 },
    { name: 'Lempira', cost: 200 },
    { name: 'Olancho', cost: 180 },
    { name: 'Choluteca', cost: 150 },
    { name: 'Valle', cost: 150 },
    { name: 'Gracias a Dios', cost: 250 },
    { name: 'Islas de la Bahía', cost: 200 }
  ]

  // Calcular envío según departamento
  const selectedDept = departments.find(d => d.name === formData.department)
  const shippingCost = selectedDept?.cost || 120
  const freeShipping = shippingCost === 0
  const orderTotal = totalPrice + shippingCost

  // Si el carrito está vacío, redirigir
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Validar paso actual
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() ||
            !formData.address.trim() || !formData.city.trim() || !formData.department) {
          toast.error('Por favor, completa todos los campos')
          return false
        }
        return true
      case 2:
        if (formData.paymentMethod === 'card') {
          if (!cardPreview.number || !cardPreview.name || !cardPreview.expiry || !cardPreview.cvv) {
            toast.error('Por favor, completa los datos de la tarjeta')
            return false
          }
        }
        if (formData.paymentMethod === 'transfer' && !formData.paymentProof) {
          toast.error('Por favor, sube el comprobante de pago')
          return false
        }
        return true
      default:
        return true
    }
  }

  // Siguiente paso
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1)
    }
  }

  // Paso anterior
  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  // Manejar upload de comprobante
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('El archivo debe ser menor a 5MB')
        return
      }
      setFormData(prev => ({ ...prev, paymentProof: file }))
      toast.success('Comprobante cargado')
    }
  }

  // Finalizar orden
  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Preparar datos de la orden
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          department: formData.department
        },
        items: items.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: orderTotal,
        shippingCost,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      }

      // Crear orden
      const orderResponse = await createOrder(orderData)

      // Si hay comprobante, subirlo
      if (formData.paymentProof) {
        const formDataFile = new FormData()
        formDataFile.append('proof', formData.paymentProof)
        formDataFile.append('orderId', orderResponse.data.order._id)
        await uploadPaymentProof(formDataFile)
      }

      // Ir al paso 3 (confirmación)
      setStep(3)
      clearCart()
      toast.success('¡Pedido confirmado!')

    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  // Pasos del checkout
  const steps = [
    { number: 1, icon: ShoppingCart, title: 'Resumen' },
    { number: 2, icon: CreditCard, title: 'Pago' },
    { number: 3, icon: CheckCircle, title: 'Confirmación' }
  ]

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Progress Steps */}
        <div className="checkout-progress">
          {steps.map((s, index) => (
            <div 
              key={s.number} 
              className={`checkout-progress__step ${step >= s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}
            >
              <div className="checkout-progress__icon">
                {step > s.number ? <Check size={20} /> : <s.icon size={20} />}
              </div>
              <span className="checkout-progress__label">{s.title}</span>
              {index < steps.length - 1 && <div className="checkout-progress__line" />}
            </div>
          ))}
        </div>

        <div className="checkout-content">
          {/* Paso 1: Resumen + Departamento */}
          {step === 1 && (
            <motion.div 
              className="checkout-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="checkout-step__title">Información del Pedido</h2>
              
              <div className="checkout-grid">
                {/* Formulario */}
                <div className="checkout-form">
                  <div className="checkout-form__section">
                    <h3><MapPin size={18} /> Datos de Contacto</h3>
                    
                    <div className="checkout-form__row">
                      <div className="checkout-form__field">
                        <label>Nombre completo *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div className="checkout-form__field">
                        <label>Teléfono *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+504 1234-5678"
                        />
                      </div>
                    </div>

                    <div className="checkout-form__field">
                      <label>Correo electrónico *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="juan@email.com"
                      />
                    </div>
                  </div>

                  <div className="checkout-form__section">
                    <h3><Truck size={18} /> Dirección de Entrega</h3>
                    
                    <div className="checkout-form__field">
                      <label>Departamento *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar...</option>
                        {departments.map(dept => (
                          <option key={dept.name} value={dept.name}>
                            {dept.name} {dept.cost === 0 ? '(GRATIS)' : `(+L. ${dept.cost})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="checkout-form__field">
                      <label>Ciudad *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Tegucigalpa"
                      />
                    </div>

                    <div className="checkout-form__field">
                      <label>Dirección exacta *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Col. San Felipe, Calle Principal, Casa #123"
                      />
                    </div>
                  </div>
                </div>

                {/* Resumen del pedido */}
                <div className="checkout-summary">
                  <h3>Resumen del Pedido</h3>
                  <div className="checkout-summary__items">
                    {items.map(item => (
                      <div key={item._id} className="checkout-summary__item">
                        <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} />
                        <div>
                          <p className="checkout-summary__item-name">{item.name}</p>
                          <p className="checkout-summary__item-qty">Cantidad: {item.quantity}</p>
                        </div>
                        <span>L. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="checkout-summary__totals">
                    <div className="checkout-summary__row">
                      <span>Subtotal</span>
                      <span>L. {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="checkout-summary__row">
                      <span>Envío</span>
                      <span className={freeShipping ? 'free-shipping' : ''}>
                        {freeShipping ? 'GRATIS' : `L. ${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {selectedDept && !freeShipping && (
                      <p className="checkout-summary__note">
                        Envío a {selectedDept.name}
                      </p>
                    )}
                    <div className="checkout-summary__divider" />
                    <div className="checkout-summary__row checkout-summary__row--total">
                      <span>Total</span>
                      <span>L. {orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    className="checkout-next-btn"
                    onClick={nextStep}
                    disabled={!formData.department}
                  >
                    Continuar <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Paso 2: Método de pago */}
          {step === 2 && (
            <motion.div 
              className="checkout-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="checkout-step__title">Método de Pago</h2>
              
              <div className="checkout-grid">
                {/* Opciones de pago */}
                <div className="checkout-payment">
                  {/* Tarjeta */}
                  <label className={`checkout-payment__option ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <CreditCard size={24} />
                    <div>
                      <strong>Tarjeta de Crédito/Débito</strong>
                      <span>Paga con tu tarjeta Visa o Mastercard</span>
                    </div>
                  </label>

                  {/* Transferencia */}
                  <label className={`checkout-payment__option ${formData.paymentMethod === 'transfer' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleChange}
                    />
                    <Building2 size={24} />
                    <div>
                      <strong>Transferencia Bancaria</strong>
                      <span>Banrural, BAC, Citi</span>
                    </div>
                  </label>

                  {/* Efectivo */}
                  <label className={`checkout-payment__option ${formData.paymentMethod === 'cash' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                    />
                    <Banknote size={24} />
                    <div>
                      <strong>Pago al Recibir</strong>
                      <span>Paga cuando recibas tu pedido</span>
                    </div>
                  </label>

                  {/* Contenido según método */}
                  <div className="checkout-payment__content">
                    {formData.paymentMethod === 'card' && (
                      <div className="checkout-card">
                        {/* Tarjeta preview 3D */}
                        <div className="checkout-card__preview">
                          <div className="checkout-card__front">
                            <div className="checkout-card__chip" />
                            <p className="checkout-card__number">
                              {cardPreview.number || '•••• •••• •••• ••••'}
                            </p>
                            <div className="checkout-card__details">
                              <p className="checkout-card__name">
                                {cardPreview.name || 'NOMBRE DEL TITULAR'}
                              </p>
                              <p className="checkout-card__expiry">
                                {cardPreview.expiry || 'MM/YY'}
                              </p>
                            </div>
                          </div>
                          <div className="checkout-card__back">
                            <div className="checkout-card__stripe" />
                            <div className="checkout-card__cvv">
                              <span>CVV</span>
                              <p>{cardPreview.cvv || '•••'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Formulario tarjeta */}
                        <div className="checkout-card__form">
                          <div className="checkout-form__field">
                            <label>Número de tarjeta</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              value={cardPreview.number}
                              onChange={(e) => setCardPreview(prev => ({ ...prev, number: e.target.value }))}
                            />
                          </div>
                          <div className="checkout-form__field">
                            <label>Nombre del titular</label>
                            <input
                              type="text"
                              placeholder="JUAN PÉREZ"
                              value={cardPreview.name}
                              onChange={(e) => setCardPreview(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                            />
                          </div>
                          <div className="checkout-form__row">
                            <div className="checkout-form__field">
                              <label>Vencimiento</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardPreview.expiry}
                                onChange={(e) => setCardPreview(prev => ({ ...prev, expiry: e.target.value }))}
                              />
                            </div>
                            <div className="checkout-form__field">
                              <label>CVV</label>
                              <input
                                type="text"
                                placeholder="•••"
                                maxLength={3}
                                value={cardPreview.cvv}
                                onChange={(e) => setCardPreview(prev => ({ ...prev, cvv: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'transfer' && (
                      <div className="checkout-transfer">
                        <h4>Datos para transferencia</h4>
                        <div className="checkout-transfer__info">
                          <p><strong>Banco:</strong> Banrural</p>
                          <p><strong>Cuenta:</strong> 123-456-789</p>
                          <p><strong>Nombre:</strong> NexTech Honduras</p>
                          <p><strong>Monto:</strong> L. {orderTotal.toFixed(2)}</p>
                        </div>

                        <div 
                          className="checkout-upload"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {formData.paymentProof ? (
                            <div className="checkout-upload__file">
                              <Check size={24} />
                              <span>{formData.paymentProof.name}</span>
                            </div>
                          ) : (
                            <>
                              <Upload size={32} />
                              <p>Arrastra el comprobante aquí</p>
                              <span>o haz clic para seleccionar</span>
                            </>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </div>
                    )}

                    {formData.paymentMethod === 'cash' && (
                      <div className="checkout-cash">
                        <Banknote size={48} />
                        <h4>Pago al Recibir</h4>
                        <p>Pagarás L. {orderTotal.toFixed(2)} cuando tu pedido sea entregado en tu dirección.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen lateral */}
                <div className="checkout-summary checkout-summary--sticky">
                  <h3>Total a Pagar</h3>
                  <div className="checkout-summary__totals">
                    <div className="checkout-summary__row">
                      <span>Pedido</span>
                      <span>L. {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="checkout-summary__row">
                      <span>Envío</span>
                      <span>{freeShipping ? 'GRATIS' : `L. ${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="checkout-summary__divider" />
                    <div className="checkout-summary__row checkout-summary__row--total">
                      <span>Total</span>
                      <span>L. {orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="checkout-actions">
                    <button className="checkout-back-btn" onClick={prevStep}>
                      Volver
                    </button>
                    <button 
                      className="checkout-next-btn"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Paso 3: Confirmación */}
          {step === 3 && (
            <motion.div 
              className="checkout-step checkout-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="checkout-success__icon">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <CheckCircle size={80} />
                </motion.div>
              </div>
              
              <h2>¡Pedido Confirmado!</h2>
              <p>Tu pedido ha sido recibido exitosamente. Te enviamos un correo con los detalles.</p>
              
              <div className="checkout-success__order">
                <Package size={24} />
                <div>
                  <strong>Número de Pedido</strong>
                  <span>#{Date.now().toString().slice(-8)}</span>
                </div>
              </div>

              <div className="checkout-success__timeline">
                <div className="checkout-success__timeline-item active">
                  <Clock size={18} />
                  <span>Pedido Recibido</span>
                </div>
                <div className="checkout-success__timeline-item">
                  <Package size={18} />
                  <span>En Proceso</span>
                </div>
                <div className="checkout-success__timeline-item">
                  <TruckIcon size={18} />
                  <span>En Camino</span>
                </div>
                <div className="checkout-success__timeline-item">
                  <CheckCircle size={18} />
                  <span>Entregado</span>
                </div>
              </div>

              <div className="checkout-success__actions">
                <Link to="/products" className="checkout-success__btn checkout-success__btn--primary">
                  Seguir Comprando
                </Link>
                <Link to="/dashboard" className="checkout-success__btn">
                  Ver Mis Pedidos
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout
