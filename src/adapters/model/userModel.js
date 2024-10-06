import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        profilePicture: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        about: String,

        age: Number,

        address: String,

        isBlocked: {
            type: Boolean,
            default: false
        },

        token: Array,
        
        visible: {
            type: Boolean,
            default: true,
          }
    },{
        timestamps: true,
    }
)

export default mongoose.model("users", userSchema, "users")