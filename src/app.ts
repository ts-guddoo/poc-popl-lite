import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Company } from "./models/Company";
import { Contact } from "./models/Contact";
import { Activity } from "./models/Activity";
import companyRoutes from "./routes/companyRoutes";
import contactRoutes from "./routes/contactRoutes";
import activityRoutes from "./routes/activityRoutes";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USER || "popluser",
  password: process.env.DB_PASSWORD || "poplpassword",
  database: process.env.DB_NAME || "popl_lite",
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true" || true, // For dev only
  logging: process.env.TYPEORM_LOGGING === "true",
  entities: [Company, Contact, Activity],
});

const app = express();
app.use(express.json());

// Routes
app.use("/companies", companyRoutes);
app.use("/contacts", contactRoutes);
app.use("/activities", activityRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler - catch all unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: `Route not found - ${req.originalUrl}` });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err.message, err.stack);

    res
      .status(err.statusCode || 500)
      .json({ error: err.message || "Internal Server Error" });
  }
);

AppDataSource.initialize()
  .then(() => {
    console.log("Database has been initialized successfully!");
  })
  .catch((err) => {
    console.error("Error during Database initialization:", err);
    process.exit(1);
  });

export default app;
