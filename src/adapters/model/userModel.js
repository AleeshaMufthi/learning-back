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
            role: {
                type: String, 
                default: "user", 
                enum: ["user"] ,
            },
            thumbnail: {
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

            enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "courses" }],

            isBlocked: {
                type: Boolean,
                default: false
            },
            
            visible: {
                type: Boolean,
                default: true,
            }
        },{
            timestamps: true,
        }
    )

    export default mongoose.model("users", userSchema, "users")