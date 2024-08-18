import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        created_At: {
            type: Date,
            expires: '10m', // TTL of 10 minutes (10m)
            default: Date.now
        }
    },
    // Set the 'expires' option for the 'createdAt' field to automatically remove data after 4 minutes (240 seconds)
    {
        expires: 600
    }
)

// Create the index on 'createdAt' field
otpSchema.index({created_At: 1}, {expireAfterSeconds: 600})

const OtpModel = mongoose.model("otp", otpSchema)

export default OtpModel