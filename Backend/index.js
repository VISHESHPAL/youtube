
import express from 'express';
import connectDB from "./src/db/db.js";
import dotenv from 'dotenv';
dotenv.config()



const app =  express();



connectDB();








