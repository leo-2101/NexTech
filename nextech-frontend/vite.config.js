import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para NexTech Honduras
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
