import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});
  
const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true }, 
  title: { type: String, required: true },
  questions: [questionSchema], // Array of questionSchema
});
  
  const Quiz = mongoose.model('Quiz', quizSchema);
  
  export default Quiz