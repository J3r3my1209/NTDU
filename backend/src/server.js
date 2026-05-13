import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ──────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Rutas base ───────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "GastosApp API corriendo", status: "ok" });
});

// ── Rutas de la API ──────────────────────────────
// app.use("/api/auth",         authRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/reports",      reportRoutes);

// ── Inicio del servidor ──────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
