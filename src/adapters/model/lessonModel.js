import mongoose, { Schema } from "mongoose";

const lessonSchema = new mongoose.Schema(
    {
        title: {
          type: String,
          required: true,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "courses",
          required: true,
        },
        tutor:{
          type: Schema.Types.ObjectId,
          ref: "tutors",
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        file: {
          type: String,
          required: true,
        },
        duration: {
          type: Number
        },
        order: {
          type: Number,
        },
      },
      {
        timestamps: true,
      }
)

export default mongoose.model("lessons", lessonSchema, "lessons")