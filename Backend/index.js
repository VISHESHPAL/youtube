import express from 'express';
import connectDB from "./src/db/db.js";
import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config();

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });
 