
import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/ProductRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://el-masa-trade.vercel.app"
];

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());

connectDB();

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
