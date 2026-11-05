import Producto from './models/Producto.js';
import { connectDatabase, disconnectDatabase } from './lib/database.js';

async function consultarProductos() {
    try {
        await connectDatabase();
        console.log('Conexión a MongoDB establecida.');

        const productosTarjetasGraficas = await Producto.find({
            categoria: 'Tarjetas Gráficas',
            stock: { $gt: 0 },
        })
            .select('codigo nombre categoria stock -_id');
        console.log('\nConsulta 1: Productos con tarjetas gráficas y stock disponible', productosTarjetasGraficas.length);
        mostrarProductos(productosTarjetasGraficas);

        const productosEconomicos = await Producto.find({
            precio: { $lte: 150 },
        })
            .select('nombre precio categoria -_id');
        console.log('\nConsulta 2: productos de hasta 150');
        mostrarProductos(productosEconomicos);

        const compatibles = await Producto.find({
            compatibleCon: { $in: ['DDR5', 'AM5'] },
        })
            .select('codigo nombre compatibleCon -_id');
        console.log('\nConsulta 3: productos compatibles con DDR5 o AM5');
        mostrarProductos(compatibles);

        const productosDestacados = await Producto.find({
            destacado: true,
        })
            .sort({ precio: -1 })
            .limit(3)
            .select('nombre precio -_id');
        console.log('\nConsulta 4: los 3 productos destacados más caros');
        mostrarProductos(productosDestacados);
    } catch (error) {
        console.error('Error al ejecutar las consultas:', error.message);
        process.exitCode = 1;
    } finally {
        try {
            await disconnectDatabase();
            console.log('Desconectado de MongoDB.');
        } catch (error) {
            console.error('Error al desconectar de MongoDB:', error.message);
            process.exitCode = 1;
        }
    }
}

function mostrarProductos(productos) {
    console.table(productos.map((producto) => producto.toObject()));
}

consultarProductos();
