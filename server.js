import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import productRoutes from './src/routes/ProductRoute.js';
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB();

app.use(cors({
    origin: "http://localhost:5173",
  }));

app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});