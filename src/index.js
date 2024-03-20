import connectDB from "./db/index.js";
import {app} from "./app.js"
// import dotenv from "dotenv"

// dotenv.config({
//     path:"./.env"
// })

import 'dotenv/config' ;

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error :",error);
        throw error
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running at Port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!!",err)
})
