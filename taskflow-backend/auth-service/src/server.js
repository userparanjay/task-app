import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);

const PORT = process.env.PORT || 5003;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Auth service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error("Is PostgreSQL running? Check DATABASE_URL in .env");
    process.exit(1);
  }
}

startServer();
