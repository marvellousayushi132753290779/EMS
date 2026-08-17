import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    role: {type:String, enum: ["admin", "employee"], required: true},
    profileImage: {type:String},
<<<<<<< HEAD
    resetPasswordToken: {type:String},
    resetPasswordExpires: {type:Date},
=======
>>>>>>> 95d37c38a6f0020609e071c91f0bebbe75d176b7
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now},  
})

const User = mongoose.model("User", userSchema)
export default User