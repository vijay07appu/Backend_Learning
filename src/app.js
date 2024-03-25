import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true


}))
// This is define the length of the json content . if the json content is too long then server will crashed.
app.use(express.json({limit:"16kb"}))

// now customizing the url ex:- if we search vijay jaideep in google , then it is converted into 
// vijay+jaideep     or vijay%20jaideep  
// this can be customized as follows :

app.use(express.urlencoded({extended:true,limit:"16kb"}))

// to store images , icons on public folder 
app.use(express.static("public"))


// to access and set cookies 

app.use(cookieParser())




// routes import 

import userRouter from "./routes/user.routes.js"

// routes declaration 

app.use("/api/v1/users",userRouter)



export {app}