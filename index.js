import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db_connection from "./database/index.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// database connection
db_connection();

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
