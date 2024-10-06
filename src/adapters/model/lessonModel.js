import mongoose, { Schema } from "mongoose";

const lessonSchema = new mongoose.Schema(
    {
        title: {
          type: String,
          required: true,
        },
        course: {
          type: Schema.Types.ObjectId,
          ref: "courses",
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        videoKey: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        order: {
          type: Number,
        },
        likes: [{ type: Schema.Types.ObjectId, ref: "users" }],
      },
      {
        timestamps: true,
      }
)

export default mongoose.model("lessons", lessonSchema, "lessons")