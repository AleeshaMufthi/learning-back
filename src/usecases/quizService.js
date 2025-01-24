import quizRepo from "../adapters/repository/quizRepo.js";

export const createQuiz = async (quizData) => { 
  return await quizRepo.createQuiz(quizData);
};

  
export const getQuizByCourseId = async (courseId) => {
    const quiz = await quizRepo.getQuizByCourseId(courseId);
    
    if (!quiz) {
      throw new Error('Quiz not found for the specified course');
    }
    return quiz;
  };
  
export const getQuizById = async (quizId) => {
    const quiz = await quizRepo.getQuizById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  };

export default {
    createQuiz,
    getQuizByCourseId,
    getQuizById,
  };