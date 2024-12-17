import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        heading: { 
            type: String, 
            required: true 
        },
        message: {
            type: String, 
            required: true 
        },
        isRead: { 
            type: Boolean, 
            default: false 
        },
        url: { 
            type: String 
        },
        from: { 
            type: Schema.Types.ObjectId, 
            refPath: "fromModel", 
            required: true 
        },
        fromModel: {
          type: String,
          required: true,
          enum: ["Tutors"],
        },
        to: { 
            type: Schema.Types.ObjectId, 
            refPath: "toModel" 
        },
        toModel: { 
            type: String, 
            enum: ["Users"] 
        },
      },
      {
        timestamps: true,
      }
)

export default mongoose.model("notifications", notificationSchema, "notifications")