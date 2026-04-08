import mongoose from 'mongoose';

const MONOGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

if(!MONOGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };
        cached.promise = mongoose.connect(MONOGODB_URI, opts).then(mongoose => {
            return mongoose.connection;
        });
    }
    try {
        cached.conn = await cached.promise;
        
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
