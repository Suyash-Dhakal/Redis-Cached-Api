import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import productRoutes from './routes/product.route.js';
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/products', productRoutes); 


app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
}
);