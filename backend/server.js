/**
 * NexTech Honduras - Servidor Backend
 * Tienda de Informática
 * 
 * Este archivo configura y arranca el servidor Express
 * con conexión a MongoDB
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importar rutas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middleware global
app.use(cors()); // Permitir solicitudes de otros dominios
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios

// Rutas de la API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'NexTech Honduras API',
    version: '1.0.0',
    status: 'Operativo'
  });
});

// Ruta para verificar estado de la API
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

// Obtener puerto de variables de entorno o usar 5000 por defecto
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

// Conectar a MongoDB y arrancar servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB');

    // Arrancar servidor
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✓ API disponible en http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('✗ Error al conectar con MongoDB:', error.message);
    // Arrancar servidor sin BD para desarrollo
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT} (sin MongoDB)`);
    });
  }
};

// Iniciar servidor
startServer();
