import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();
import dns from "dns";

// Set the DNS server to use for resolving hostnames this for node js error after 24v it happend
dns.setServers(["8.8.8.8", "8.8.4.4"]);

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("server is running on port 3000!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
// this route is for store images in uploads folder Local
app.use("/api/upload", uploadRouter);

// this works this folder on browser and this is for store images in uploads folder Local
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
