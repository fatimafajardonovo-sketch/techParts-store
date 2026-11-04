//Importamos las herramientas necesarias para conectarnos a la base de datos y realizar consultas
import mongoose from 'mongoose'; // BBDD
import dotenv from 'dotenv'; // Variables de entorno, del archivo env de la raíz del proyecto
import Producto from './models/Producto.js'; // Modelo de producto, que es el que nos permite hacer consultas a la colección de productos en la base de datos

dotenv.config(); // Cargamos las variables de entorno desde el archivo .env

async function consultarProductos() {
    try {
        // Conectamos a la base de datos MongoDB usando la URI proporcionada en las variables de entorno

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conexión a MongoDB establecida.');

        // Consulta 1: Productos con categoria Tarjetas Gráficas
        const productosTarjetasGraficas = await Producto.find({
            categoria: 'Tarjetas Gráficas',
            stock: { $gt: 0 },
        })
        .select('codigo nombre categoria stock -_id');
        console.log('\nConsulta 1: Productos con tarjetas gráficas y stock disponible', productosTarjetasGraficas.length);
        console.table(productosTarjetasGraficas.map((producto) => producto.toObject()));

        // Consulta 2: Componentes económicos, precio menor o igual a 150
        const productosEconomicos = await Producto.find({
            precio: { $lte: 150 },
        })
        .select('nombre precio categoria -_id');
        console.log('\nConsulta 2: productos de hasta 150');
        console.table(productosEconomicos.map((producto) => producto.toObject()));

        // Consulta 3: Productos con una tecnología específica, como DDR5 o AM5
        const compatibles = await Producto.find({
            compatibleCon: { $in: ['DDR5', 'AM5'] },
        })
        .select('codigo nombre compatibleCon -_id');
        console.log('\nConsulta 3: productos compatibles con DDR5 o AM5');
        console.table(compatibles.map((producto) => producto.toObject()));

        // Consulta 4: Los 3 productos destacados más caros
        const productosDestacados = await Producto.find({
            destacado: true,
        })
            .sort({ precio: -1 })
            .limit(3)
            .select('nombre precio -_id');
        console.log('\nConsulta 4: los 3 productos destacados más caros');
        console.table(productosDestacados.map((producto) => producto.toObject()));
    }
    // Muestra el mensaje y asigna un código de error al proceso
    catch (error) {
        console.error('Error al ejecutar las consultas:', error.message);
        process.exitCode = 1;
    }
    // Cerramos la conexión a la base de datos al finalizar las consultas, sin importar que haya habido un error o no
    finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB.');
    }
}

consultarProductos()
