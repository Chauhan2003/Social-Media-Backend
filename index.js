import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db_connection from "./database/index.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
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
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

// database connection
db_connection();

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
