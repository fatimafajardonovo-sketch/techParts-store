import Producto from './models/Producto.js';
import { connectDatabase, disconnectDatabase } from './lib/database.js';

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
    try {
        await connectDatabase();
        console.log('Conexión a MongoDB establecida.');

        const productosBorrados = await Producto.deleteMany({});
        console.log(`Productos anteriores eliminados: ${productosBorrados.deletedCount} productos borrados.`);

        const productosInsertados = await Producto.insertMany(productosIniciales);
        console.log(`Se insertaron ${productosInsertados.length} productos.`);

        console.log('\n--- Prueba de validación ---');
        const productoInvalido = new Producto({
            codigo: 'INVALIDO-01',
            nombre: 'Producto inválido',
            categoria: 'Categoría incorrecta',
            precio: -10,
            stock: -5,
        });

        try {
            await productoInvalido.validate();
            console.error('La validación aceptó un producto inválido.');
            process.exitCode = 1;
        } catch (errorValidacion) {
            console.log('Mongoose rechazó el producto inválido:');
            Object.values(errorValidacion.errors).forEach((error) => {
                console.log(`- Campo: [${error.path}]: ${error.message}`);
            });
        }
    } catch (error) {
        console.error('Error general:', error.message);
        process.exitCode = 1;
    } finally {
        try {
            await disconnectDatabase();
        } catch (error) {
            console.error('Error al desconectar de MongoDB:', error.message);
            process.exitCode = 1;
        }
    }
}

poblarBaseDeDatos();
