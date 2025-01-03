import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
          },
          tutor: {
            type: Schema.Types.ObjectId,
            ref: "tutors",
            required: true,
          },
          about: {
            type: String,
            required: true,
          },
          tagline: {
            type: String,
            required: true,
          },
          category: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          difficulty: {
            type: String,
            required: true,
          },
          thumbnail: {
            type: String,
          },
          price: {
            type: Number,
            required: true,
          },
          isVisible: {
            type: Boolean,
            default: true,
          },
          lessons: [{ type: Schema.Types.ObjectId, ref: "lessons" }],
    },{
        timestamps: true,
      }
)

export default mongoose.model("courses", courseSchema, "courses")