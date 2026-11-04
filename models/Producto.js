import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: [true, 'El código es obligatorio'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [4, 'El nombre debe tener al menos 4 caracteres'],
        },
        categoria: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            enum: {
                values: ['Procesadores', 'Tarjetas Gráficas', 'Memorias RAM', 'Almacenamiento'],
                message: 'La categoría no es válida',
            },
        },
        precio: {
            type: Number,
            required: true,
            min: [0, 'El precio no puede ser negativo'],
        },
        stock: {
            type: Number,
            required: true,
            min: [0, 'El stock no puede ser negativo'],
            validate: {
                validator: Number.isInteger,
                message: 'El stock debe ser un número entero',
            },
        },
        compatibleCon: {
            type: [String],
            default: [],
        },
        destacado: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Producto = mongoose.models.Producto || mongoose.model('Producto', productoSchema);

export default Producto;
