import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      reviewText: { type: String, required: true },
    },
    { timestamps: true }
  );
  
export default mongoose.model("review", reviewSchema, "review")