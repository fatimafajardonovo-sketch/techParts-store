import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

let connectionPromise;

export async function connectDatabase() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('Falta configurar MONGODB_URI.');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(uri).catch((error) => {
            connectionPromise = undefined;
            throw error;
        });
    }

    return connectionPromise;
}

export async function disconnectDatabase() {
    try {
        await mongoose.disconnect();
    } finally {
        connectionPromise = undefined;
    }
}
