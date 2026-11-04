import mongoose from 'mongoose';
import Producto from '../models/Producto.js';
import dotenv from "dotenv"; // importamos dotenv para poder leer las variables de entorno

dotenv.config();

export default async function handler(req, res) {
    // Este endpoint solo acepta consultas GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Usa el método GET.' });
    }

    try {
        // La URI se lee desde .env en local o desde Vercel al publicar
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            return res.status(500).json({ error: 'Falta configurar MONGODB_URI.' });
        }

        // Conecta solo si todavía no hay una conexión activa
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
        }

        // Lee los filtros enviados en la URL
        const { categoria, precioMax, compatibilidad } = req.query;
        // Empieza vacío para que, si no se indican parámetros, la consulta incluya todos los productos.
        const filtro = {};

        if (categoria) filtro.categoria = categoria;

        if (precioMax !== undefined) {
            const precio = Number(precioMax);
            if (!Number.isFinite(precio) || precio < 0) {
                return res.status(400).json({ error: 'precioMax debe ser un número mayor o igual a 0.' });
            }
            filtro.precio = { $lte: precio };
        }

        if (compatibilidad) {
            filtro.compatibleCon = { $in: [compatibilidad] };
        }

        const productos = await Producto.find(filtro).sort({ precio: 1 });

        return res.status(200).json({
            total: productos.length,
            datos: productos,
        });
    } catch (error) {
        console.error('Error al consultar productos:', error);
        return res.status(500).json({ error: 'Error al consultar el inventario.' });
    }
}