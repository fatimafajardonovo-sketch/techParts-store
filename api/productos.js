import mongoose from 'mongoose';
import Producto from '../models/Producto.js';
import dotenv from 'dotenv';

// Carga las variables de .env en local; en Vercel se configuran en el panel del proyecto.
dotenv.config();

export default async function handler(req, res) {
    // El endpoint es público para consultar inventario y solo necesita aceptar GET.
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Usa el método GET.' });
    }

    try {
        // Lee la URI sin incluirla en la respuesta para no exponer credenciales.
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            return res.status(500).json({ error: 'Falta configurar MONGODB_URI.' });
        }

        // Reutiliza una conexión existente durante invocaciones cálidas de la función.
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
        }

        // Los filtros son opcionales y llegan como parámetros de la URL.
        const { categoria, precioMax, compatibilidad } = req.query;
        // Sin filtros, la consulta devuelve todos los productos.
        const filtro = {};

        // La categoría debe coincidir exactamente con la guardada en cada producto.
        if (categoria) filtro.categoria = categoria;

        // Convierte el precio recibido (texto) a número y rechaza valores inválidos.
        if (precioMax !== undefined) {
            const precio = Number(precioMax);
            if (!Number.isFinite(precio) || precio < 0) {
                return res.status(400).json({ error: 'precioMax debe ser un número mayor o igual a 0.' });
            }
            // $lte busca productos cuyo precio sea menor o igual al máximo.
            filtro.precio = { $lte: precio };
        }

        // $in encuentra productos cuyo arreglo compatibleCon incluya esta tecnología.
        if (compatibilidad) {
            filtro.compatibleCon = { $in: [compatibilidad] };
        }

        // Ejecuta la búsqueda con los filtros y ordena del precio más bajo al más alto.
        const productos = await Producto.find(filtro).sort({ precio: 1 });

        // Devuelve tanto el número de resultados como los documentos encontrados.
        return res.status(200).json({
            total: productos.length,
            datos: productos,
        });
    } catch (error) {
        // Registra el detalle en los logs del servidor y devuelve un mensaje público genérico.
        console.error('Error al consultar productos:', error);
        return res.status(500).json({ error: 'Error al consultar el inventario.' });
    }
}