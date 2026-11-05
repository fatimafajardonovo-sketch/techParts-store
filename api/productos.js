import Producto from '../models/Producto.js';
import { connectDatabase } from '../lib/database.js';

export function parseProductFilters(query) {
    const { categoria, precioMax, compatibilidad } = query;
    const filter = {};

    if (categoria) {
        filter.categoria = categoria;
    }

    if (precioMax !== undefined) {
        const price = Number(precioMax);
        if (!Number.isFinite(price) || price < 0) {
            return { error: 'precioMax debe ser un número mayor o igual a 0.' };
        }
        filter.precio = { $lte: price };
    }

    if (compatibilidad) {
        filter.compatibleCon = { $in: [compatibilidad] };
    }

    return { filter };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Usa el método GET.' });
    }

    if (!process.env.MONGODB_URI) {
        return res.status(500).json({ error: 'Falta configurar MONGODB_URI.' });
    }

    const { filter, error } = parseProductFilters(req.query);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        await connectDatabase();

        const productos = await Producto.find(filter).sort({ precio: 1 });
        return res.status(200).json({
            total: productos.length,
            datos: productos,
        });
    } catch (err) {
        console.error('Error al consultar productos:', err);
        return res.status(500).json({ error: 'Error al consultar el inventario.' });
    }
}