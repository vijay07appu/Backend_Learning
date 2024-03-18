import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";


const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DATABASE_NAME}`);
        console.log("MongoDB connected");
        console.log(connectionInstance.connection.host);
        console.log(connectionInstance.connection.name);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

export default connectDB
