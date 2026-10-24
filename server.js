
import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/ProductRoute.js";
import cors from "cors";
import cartRoutes from "./src/routes/CartRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://el-masa-trade.vercel.app",
  "https://el-masa-trade-7ija.vercel.app"
];

app.use(cors({
  origin: allowedOrigins
}));  

app.use(express.json());

connectDB();

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
