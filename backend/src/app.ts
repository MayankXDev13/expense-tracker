import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morganMiddleware from "./logger/morgan.logger";
import { errorHandler } from "./middlewares/error.middlewares";

const app: Application = express();

// Middlewares
app.use(morganMiddleware);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// Routes Import
import healthCheckRoutes from "./routes/healthcheck.routes";
import userRoutes from "./routes/user.routes";
import categoriesRoutes from "./routes/category.routes";
import transactionRoutes from "./routes/transactions.routes";
import budgetsRoutes from "./routes/budgets.routes";

// Routes
app.use("/api/v1/expenseTracker/healthcheck", healthCheckRoutes);
app.use("/api/v1/expenseTracker/user", userRoutes);
app.use("/api/v1/expenseTracker/categories", categoriesRoutes);
app.use("/api/v1/expenseTracker/transaction", transactionRoutes);
app.use("/api/v1/expenseTracker/budgets", budgetsRoutes);

// Error Handler
app.use(errorHandler);

export default app;
