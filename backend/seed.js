/**
 * Seed - Datos iniciales para NexTech Honduras
 * Ejecutar con: node seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextech-honduras';

// Usuarios a crear
const usuarios = [
  {
    nombre: 'Administrador',
    email: 'admin@nextech.hn',
    password: 'Admin123!',
    telefono: '+504 1234-5678',
    rol: 'admin',
    activo: true
  },
  {
    nombre: 'Carlos Empledo',
    email: 'carlos@nextech.hn',
    password: 'Empleado123!',
    telefono: '+504 2234-5678',
    rol: 'empleado',
    activo: true
  },
  {
    nombre: 'Juan Cliente',
    email: 'juan@gmail.com',
    password: 'Cliente123!',
    telefono: '+504 3234-5678',
    rol: 'cliente',
    activo: true
  }
];

// Productos a crear
const productos = [
  {
    nombre: 'Laptop HP i5',
    descripcion: 'Laptop HP con procesador Intel Core i5, 8GB RAM, 256GB SSD',
    precio: 18500,
    imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    categoria: 'Laptops',
    marca: 'HP',
    stock: 15,
    descuentoPorcentaje: 12,
    activo: true,
    destacado: true
  },
  {
    nombre: 'Laptop Lenovo',
    descripcion: 'Laptop Lenovo ThinkPad, Intel Core i7, 16GB RAM, 512GB SSD',
    precio: 15900,
    imagen: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
    categoria: 'Laptops',
    marca: 'Lenovo',
    stock: 8,
    activo: true,
    destacado: false
  },
  {
    nombre: 'Monitor LG 24"',
    descripcion: 'Monitor LG Full HD 24 pulgadas, 75Hz',
    precio: 6800,
    imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    categoria: 'Monitores',
    marca: 'LG',
    stock: 20,
    descuentoPorcentaje: 9,
    activo: true,
    destacado: true
  },
  {
    nombre: 'Mouse Logitech',
    descripcion: 'Mouse inalámbrico Logitech M185',
    precio: 380,
    imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    categoria: 'Accesorios',
    marca: 'Logitech',
    stock: 50,
    activo: true,
    destacado: false
  },
  {
    nombre: 'Teclado Redragon',
    descripcion: 'Teclado mecánico RGB K552',
    precio: 1450,
    imagen: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500',
    categoria: 'Accesorios',
    marca: 'Redragon',
    stock: 25,
    descuentoPorcentaje: 19,
    activo: true,
    destacado: true
  },
  {
    nombre: 'Disco Seagate',
    descripcion: 'Disco duro externo 1TB USB 3.0',
    precio: 2200,
    imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    categoria: 'Almacenamiento',
    marca: 'Seagate',
    stock: 30,
    activo: true,
    destacado: false
  },
  {
    nombre: 'RAM Kingston 16GB',
    descripcion: 'Memoria RAM DDR4 16GB 3200MHz',
    precio: 1900,
    imagen: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500',
    categoria: 'Componentes',
    marca: 'Kingston',
    stock: 20,
    descuentoPorcentaje: 17,
    activo: true,
    destacado: false
  },
  {
    nombre: 'Impresora HP',
    descripcion: 'Impresora HP LaserJet Pro M15w',
    precio: 3600,
    imagen: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
    categoria: 'Periféricos',
    marca: 'HP',
    stock: 12,
    activo: true,
    destacado: false
  },
  {
    nombre: 'Audífonos HyperX',
    descripcion: 'Audífonos gaming Cloud II',
    precio: 2100,
    imagen: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500',
    categoria: 'Audio',
    marca: 'HyperX',
    stock: 18,
    descuentoPorcentaje: 19,
    activo: true,
    destacado: true
  },
  {
    nombre: 'Router TP-Link',
    descripcion: 'Router WiFi TP-Link Archer C50',
    precio: 4200,
    imagen: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500',
    categoria: 'Redes',
    marca: 'TP-Link',
    stock: 15,
    activo: true,
    destacado: false
  },
  {
    nombre: 'Laptop ASUS Gamer',
    descripcion: 'Laptop ASUS ROG Strix G15, Ryzen 7, 16GB RAM, RTX 3060',
    precio: 32500,
    imagen: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
    categoria: 'Laptops',
    marca: 'ASUS',
    stock: 5,
    descuentoPorcentaje: 12,
    activo: true,
    destacado: true
  },
  {
    nombre: 'Silla Gamer',
    descripcion: 'Silla gamer ergonómica con soporte lumbar',
    precio: 8900,
    imagen: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500',
    categoria: 'Muebles',
    marca: 'Generic',
    stock: 10,
    descuentoPorcentaje: 15,
    activo: true,
    destacado: false
  }
];

// Estados de pedidos
const estadosPedido = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

async function seed() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes
    console.log('Limpiando datos existentes...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Crear usuarios
    console.log('Creando usuarios...');
    const usuariosCreados = [];
    for (const usuario of usuarios) {
      const passwordHash = await bcrypt.hash(usuario.password, 10);
      const usuarioCreado = await User.create({
        ...usuario,
        password: passwordHash
      });
      usuariosCreados.push(usuarioCreado);
      console.log(`  ✅ ${usuario.email} (${usuario.rol})`);
    }

    // Crear productos
    console.log('Creando productos...');
    const productosCreados = await Product.insertMany(productos);
    console.log(`  ✅ ${productosCreados.length} productos creados`);

    // Los pedidos se crean desde el frontend, no en el seed
    console.log('  ℹ️ Pedidos se crean desde el frontend');

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('  Admin: admin@nextech.hn / Admin123!');
    console.log('  Empleado: carlos@nextech.hn / Empleado123!');
    console.log('  Cliente: juan@gmail.com / Cliente123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
