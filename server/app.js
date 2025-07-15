import dotenv from 'dotenv';
dotenv.config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);

import express from 'express';
import connectDB from './db/db.js';
import reviewRoutes from './routes/review.routes.js';

const app = express();
app.use(express.json());

connectDB();

app.use('/reviews', reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
