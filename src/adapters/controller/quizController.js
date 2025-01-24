import quizService from "../../usecases/quizService.js";

export const createQuiz = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const quizData = req.body;
    const quiz = await quizService.createQuiz(quizData);
    console.log(quiz, 'quiz');
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    console.error('Error creating quiz:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
  

export const getQuizByCourseId = async (req, res) => {
    try { 
      const { courseId } = req.params;
      const quiz = await quizService.getQuizByCourseId(courseId);
      res.status(200).json({ success: true, data: quiz });
    } catch (error) {
      console.error('Error fetching quiz:', error.message);
      res.status(404).json({ success: false, message: error.message });
    }
  };
  
 
 export const getQuizById = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await quizService.getQuizById(quizId);
      res.status(200).json({ success: true, data: quiz });
    } catch (error) {
      console.error('Error fetching quiz:', error.message);
      res.status(404).json({ success: false, message: error.message });
    }
  };
  
export default {
    createQuiz,
    getQuizByCourseId,
    getQuizById,
  };
