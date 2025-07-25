import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "12kb" }));
app.use(express.urlencoded({ extended: true, limit: "12kb" }));
app.use(express.static("Public"));
app.use(cookieParser());

// routes import 

import userRouter from "./src/routes/user.route.js";

// routes declaration
app.use("/api/v1/users" , userRouter)
// http://localhost:4000/api/v1/users/register

export { app };
