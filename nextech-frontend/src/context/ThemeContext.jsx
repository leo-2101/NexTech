import { createContext, useContext, useState, useEffect } from 'react'

/**
 * ThemeContext - Manejo del tema claro/oscuro
 * Persiste la preferencia en localStorage
 */
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Cargar tema guardado o usar 'dark' por defecto
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'dark'
  })

  // Aplicar tema al document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Función para alternar tema
  const toggleTema = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const value = {
    theme,
    toggleTema,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return context
}
