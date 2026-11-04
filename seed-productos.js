import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Producto from './models/Producto.js';

dotenv.config();

const productosIniciales = [
    {
        codigo: 'CPU-01',
        nombre: 'Intel Core i7 14700K',
        categoria: 'Procesadores',
        precio: 429.99,
        stock: 12,
        compatibleCon: ['LGA1700', 'DDR5'],
        destacado: true,
    },
    {
        codigo: 'GPU-01',
        nombre: 'MSI GeForce RTX 4070',
        categoria: 'Tarjetas Gráficas',
        precio: 649.99,
        stock: 8,
        compatibleCon: ['PCIe 4.0'],
        destacado: true,
    },
    {
        codigo: 'RAM-01',
        nombre: 'Corsair Vengeance 32GB DDR5',
        categoria: 'Memorias RAM',
        precio: 109.99,
        stock: 25,
        compatibleCon: ['DDR5'],
        destacado: false,
    },
    {
        codigo: 'SSD-01',
        nombre: 'Samsung 990 PRO 2TB',
        categoria: 'Almacenamiento',
        precio: 179.99,
        stock: 15,
        compatibleCon: ['NVMe', 'M.2'],
        destacado: true,
    },
    {
        codigo: 'CPU-02',
        nombre: 'AMD Ryzen 5 7600',
        categoria: 'Procesadores',
        precio: 219.99,
        stock: 20,
        compatibleCon: ['AM5', 'DDR5'],
        destacado: false,
    },
    {
        codigo: 'GPU-02',
        nombre: 'Gigabyte Radeon RX 7600',
        categoria: 'Tarjetas Gráficas',
        precio: 289.99,
        stock: 10,
        compatibleCon: ['PCIe 4.0'],
        destacado: false,
    },
];

async function poblarBaseDeDatos() {
    // Abro conexión a mongo, la bbdd
    if (!process.env.MONGODB_URI) {
        throw new Error('Falta la variable MONGODB_URI en el archivo .env');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conexión a MongoDB establecida.');

        const productosBorrados = await Producto.deleteMany({}); // Elimina todos los productos existentes; los que ya hay
console.log(`Productos anteriores eliminados: ${productosBorrados.deletedCount} productos borrados.`);
        const productosInsertados = await Producto.insertMany(productosIniciales); // Me traigo todos los productos iniciales y los inserto en la base de datos
        console.log(`Se insertaron ${productosInsertados.length} productos.`);

        console.log('\n--- Prueba de validación ---');
        try {
            await Producto.create({
                codigo: 'INVALIDO-01',
                nombre: 'Producto inválido',
                categoria: 'Categoría incorrecta', // Categoria mal definida
                precio: -10, // Precio negativo
                stock: -5, // Stock negativo
            });
        } catch (errorValidacion) {
            console.log('Mongoose rechazó el producto inválido:');
            Object.values(errorValidacion.errors).forEach((err) => {
                console.log(`-Campo: [${err.path}]: ${err.message}`);
            });
        }
    } 
    catch (error) {
        //Informa de errores generales; fallos de conexion, etc.
        console.error("Error general:", error.message);
        process.exitCode = 1;
    }
    finally { 
        //Cierra la operación incluso cuando falla y hay errores
        await mongoose.disconnect();
    }
}


poblarBaseDeDatos().catch((error) => {
    console.error('Error al poblar la base de datos:', error.message);
    process.exitCode = 1;
});
