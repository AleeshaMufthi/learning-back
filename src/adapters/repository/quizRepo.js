import Quiz from "../model/quizModel.js";

export const createQuiz = async (quizData) => {
  const { courseId, title, questions } = quizData;

  // Ensure only valid questions are saved
  const quiz = await Quiz.create({ courseId, title, questions });
  return quiz;
};
 
export const getQuizByCourseId = async (courseId) => {
    return await Quiz.find({ courseId }).populate('courseId', 'title');
  };
  
export const getQuizById = async (quizId) => {
    return await Quiz.findById(quizId).populate('courseId', 'title');
  };

export default {
    createQuiz,
    getQuizByCourseId,
    getQuizById,
  };