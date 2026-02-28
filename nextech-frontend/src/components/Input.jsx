import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

/**
 * Input - Componente de input con icono
 * Regel crítica: inputs con íconos nunca tapan el texto
 * 
 * @param {string} icon - Componente de icono (Lucide)
 * @param {boolean} showPasswordToggle - Mostrar botón para ver/ocultar contraseña
 * @param {string} type - Tipo de input
 * @param {string} className - Clases adicionales
 */
function Input({ 
  icon: Icon, 
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : 'password'

  return (
    <div className={`input-wrapper ${className}`}>
      {Icon && (
        <span className="input-icon">
          <Icon size={18} />
        </span>
      )}
      <input
        type={isPassword ? inputType : type}
        className={`input-field ${Icon ? 'with-icon' : ''} ${showPasswordToggle ? 'with-toggle' : ''}`}
        {...props}
      />
      {showPasswordToggle && isPassword && (
        <button
          type="button"
          className="input-toggle"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  )
}

export default Input
