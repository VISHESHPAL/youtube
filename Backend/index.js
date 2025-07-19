
import express from 'express';
import connectDB from "./src/db/db.js";
import dotenv from 'dotenv';
dotenv.config()



const app =  express();



connectDB()
.then(() =>{

    app.listen(() =>{
        console.log(`Server is running at the PORT ${process.env.PORT}`)
    })

})
.catch((error) =>{
    console.log("MongoDB connection Failed " , error)
})








