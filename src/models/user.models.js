import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:[true," UserName is required"],
        lowercase:true,
        unique:true,
        trim:true,
        index:true      // this is used in searching purpose 


    },
    fullName:{
        type:String,
        required:[true," Full Name  is required"],
        trim:true,
        index:true 

    },
    email:{
        type:String,
        required:[true," email is required"],
        lowercase:true,
        trim:true,
        unique:true
    
    },
    avatar:{               // images are uploaded in cloudinary , and obtain url in used in avatar
                           // if we use direct image or video it will be heavy for database
        type:String,
        required:[true,"Avatar is required "]

    },
    coverImage: {
        type: String,                        // cloudinary url
    },
    // watch history is array which stores the id's of video which user watched
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
},{
    timestamps:true
})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// methods defined by the coder 
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User=mongoose.model("User",userSchema)