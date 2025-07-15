import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

export default function connectDB() {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
}
