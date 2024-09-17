import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    adminname: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: true,
    },
    token: Array,
},
 {
    timestamps: true,
 }
)

export default mongoose.model('admin', adminSchema,'admin');