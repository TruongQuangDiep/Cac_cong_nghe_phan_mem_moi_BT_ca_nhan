import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Internal imports
import connectDB from "./config/configdb.js";
import authRoutes from "./route/authRoutes.js";
import productRoutes from "./route/productRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// =========================
// Middleware
// =========================

app.use(cors({ origin: true }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static('assets'));

// =========================
// Database Connection
// =========================

connectDB();

// =========================
// Routes
// =========================

// Auth APIs
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("SMM Project API is working!");
});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {

    console.log("--------------------------------------------------");

    console.log(`>>> SMM Project API is running on port: ${PORT}`);

    console.log("--------------------------------------------------");
});