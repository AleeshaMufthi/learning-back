import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now },
  });

const certificate = mongoose.model('certificate', certificateSchema);
  
export default certificate